import XLSX from 'xlsx';
import * as db from './db';

/**
 * Converte número de data do Excel para objeto Date
 * Excel armazena datas como número de dias desde 1900-01-01
 */
function excelDateToJSDate(excelDate: number): Date {
  // Excel considera 1900-01-01 como dia 1, mas tem um bug que considera 1900 como ano bissexto
  // Precisamos ajustar para isso
  const EXCEL_EPOCH = new Date(1899, 11, 30); // 30 de dezembro de 1899
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return new Date(EXCEL_EPOCH.getTime() + excelDate * millisecondsPerDay);
}

/**
 * Normaliza telefone removendo caracteres especiais
 */
function normalizarTelefone(telefone: any): string | null {
  if (!telefone) return null;
  
  // Converter para string e remover tudo que não é número
  const tel = String(telefone).replace(/\D/g, '');
  
  // Se tiver menos de 8 dígitos, provavelmente não é um telefone válido
  if (tel.length < 8) return null;
  
  return tel;
}

/**
 * Normaliza valor monetário (remove espaços, converte para centavos)
 */
function normalizarValor(valor: any): number {
  if (!valor) return 0;
  
  // Se já for número, multiplica por 100 para converter para centavos
  if (typeof valor === 'number') {
    return Math.round(valor * 100);
  }
  
  // Se for string, remove caracteres não numéricos e converte
  const valorStr = String(valor).replace(/[^\d,.-]/g, '').replace(',', '.');
  const valorNum = parseFloat(valorStr);
  
  return isNaN(valorNum) ? 0 : Math.round(valorNum * 100);
}

export interface FestImportRow {
  codigo: string;
  nomeCliente: string;
  dataFechamento: Date;
  dataFesta: Date;
  horario?: string;
  tema?: string;
  valorTotal: number; // em centavos
  valorPago: number; // em centavos
  numeroConvidados: number;
  custos: number; // em centavos
  telefone?: string | null;
}

export interface ImportResult {
  success: boolean;
  totalLinhas: number;
  importadas: number;
  erros: Array<{ linha: number; erro: string }>;
  festas: FestImportRow[];
}

/**
 * Processa arquivo Excel e retorna dados parseados
 */
export async function parseExcelFestas(fileBuffer: Buffer): Promise<ImportResult> {
  const result: ImportResult = {
    success: false,
    totalLinhas: 0,
    importadas: 0,
    erros: [],
    festas: [],
  };

  try {
    // Ler arquivo Excel
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    
    // Pegar primeira aba
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Converter para JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(worksheet);
    
    result.totalLinhas = rawData.length;
    
    // Processar cada linha
    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const linhaNum = i + 2; // +2 porque linha 1 é cabeçalho e array começa em 0
      
      try {
        // Validar campos obrigatórios
        if (!row['Código do contrato']) {
          result.erros.push({ linha: linhaNum, erro: 'Código do contrato não encontrado' });
          continue;
        }
        
        if (!row['Nome do cliente']) {
          result.erros.push({ linha: linhaNum, erro: 'Nome do cliente não encontrado' });
          continue;
        }
        
        if (!row['Data de Fechamento']) {
          result.erros.push({ linha: linhaNum, erro: 'Data de fechamento não encontrada' });
          continue;
        }
        
        if (!row['Data da  Festa']) {
          result.erros.push({ linha: linhaNum, erro: 'Data da festa não encontrada' });
          continue;
        }
        
        // Converter datas do Excel
        const dataFechamento = excelDateToJSDate(row['Data de Fechamento']);
        const dataFesta = excelDateToJSDate(row['Data da  Festa']);
        
        // Validar datas
        if (isNaN(dataFechamento.getTime())) {
          result.erros.push({ linha: linhaNum, erro: 'Data de fechamento inválida' });
          continue;
        }
        
        if (isNaN(dataFesta.getTime())) {
          result.erros.push({ linha: linhaNum, erro: 'Data da festa inválida' });
          continue;
        }
        
        // Montar objeto de festa
        const festa: FestImportRow = {
          codigo: String(row['Código do contrato']).trim(),
          nomeCliente: String(row['Nome do cliente']).trim(),
          dataFechamento,
          dataFesta,
          horario: row['Horario'] ? String(row['Horario']).trim() : undefined,
          tema: row['Tema'] ? String(row['Tema']).trim() : undefined,
          valorTotal: normalizarValor(row['Valor ']),
          valorPago: normalizarValor(row['Valor Pago']),
          numeroConvidados: parseInt(row['N° de convidados']) || 0,
          custos: normalizarValor(row['Custos']),
          telefone: normalizarTelefone(row['Contato 1']),
        };
        
        result.festas.push(festa);
        result.importadas++;
        
      } catch (error: any) {
        result.erros.push({ 
          linha: linhaNum, 
          erro: error.message || 'Erro desconhecido ao processar linha' 
        });
      }
    }
    
    result.success = result.importadas > 0;
    
  } catch (error: any) {
    result.erros.push({ 
      linha: 0, 
      erro: `Erro ao ler arquivo Excel: ${error.message}` 
    });
  }
  
  return result;
}

/**
 * Importa festas para o banco de dados
 */
export async function importarFestas(festas: FestImportRow[]): Promise<{
  importadas: number;
  erros: Array<{ codigo: string; erro: string }>;
}> {
  const result = {
    importadas: 0,
    erros: [] as Array<{ codigo: string; erro: string }>,
  };
  
  for (const festa of festas) {
    try {
      // Verificar se festa já existe
      const festaExistente = await db.getFestaByCodigo(festa.codigo);
      if (festaExistente) {
        result.erros.push({ 
          codigo: festa.codigo, 
          erro: 'Festa já existe no banco de dados' 
        });
        continue;
      }
      
      // Buscar ou criar cliente
      // Buscar cliente por telefone se disponível
      let cliente = null;
      if (festa.telefone) {
        const todosClientes = await db.getAllClientes();
        cliente = todosClientes.find(c => c.telefone === festa.telefone) || null;
      }
      
      // Se não encontrou por telefone, buscar por nome
      if (!cliente) {
        const todosClientes = await db.getAllClientes();
        cliente = todosClientes.find(c => 
          c.nome.toLowerCase().trim() === festa.nomeCliente.toLowerCase().trim()
        ) || null;
      }
      
      if (!cliente) {
        // Criar novo cliente
        const clienteId = await db.createCliente({
          nome: festa.nomeCliente,
          telefone: festa.telefone || undefined,
        });
        cliente = await db.getClienteById(clienteId);
      }
      
      if (!cliente) {
        result.erros.push({ 
          codigo: festa.codigo, 
          erro: 'Erro ao criar/buscar cliente' 
        });
        continue;
      }
      
      // Criar festa
      await db.createFesta({
        codigo: festa.codigo,
        clienteId: cliente.id,
        dataFechamento: festa.dataFechamento,
        dataFesta: festa.dataFesta,
        valorTotal: festa.valorTotal,
        valorPago: festa.valorPago,
        numeroConvidados: festa.numeroConvidados,
        tema: festa.tema || null,
        horario: festa.horario || null,
        status: festa.dataFesta < new Date() ? 'realizada' : 'agendada',
        observacoes: `Importado de planilha Excel. Custos: R$ ${(festa.custos / 100).toFixed(2)}`,
      });
      
      result.importadas++;
      
    } catch (error: any) {
      result.erros.push({ 
        codigo: festa.codigo, 
        erro: error.message || 'Erro desconhecido ao importar festa' 
      });
    }
  }
  
  return result;
}
