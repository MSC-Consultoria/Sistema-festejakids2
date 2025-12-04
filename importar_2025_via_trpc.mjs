import { drizzle } from 'drizzle-orm/mysql2';
import { clientes, festas } from './drizzle/schema.ts';
import { readFileSync } from 'fs';

const db = drizzle(process.env.DATABASE_URL);

const contratosData = JSON.parse(readFileSync('/home/ubuntu/upload/contratos_2025.json', 'utf-8'));
const contratos = contratosData.contratos;

function limparCPF(cpf) {
  if (!cpf) return null;
  return cpf.replace(/\D/g, '') || null;
}

function converterData(dataStr) {
  if (!dataStr) return null;
  const partes = dataStr.split('/');
  if (partes.length === 3) {
    return new Date(`${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`);
  }
  return null;
}

function extrairValor(valorStr) {
  if (!valorStr || valorStr === '') return 0;
  try {
    const valor = parseFloat(valorStr.replace(/\./g, '').replace(',', '.'));
    return Math.round(valor * 100); // Centavos
  } catch {
    return 0;
  }
}

async function importar() {
  console.log('Iniciando importação de 2025...\n');
  
  // 1. Coletar clientes únicos
  const clientesMap = new Map();
  for (const c of contratos) {
    const nome = c.cliente?.nome || '';
    if (nome && !clientesMap.has(nome)) {
      clientesMap.set(nome, {
        nome,
        cpf: limparCPF(c.cliente?.cpf),
        telefone: c.cliente?.telefone || null,
        endereco: c.cliente?.endereco || null
      });
    }
  }
  
  console.log(`Total de clientes únicos: ${clientesMap.size}`);
  
  // 2. Inserir clientes
  const clientesArray = Array.from(clientesMap.values());
  let clientesInseridos = 0;
  
  for (const cliente of clientesArray) {
    try {
      await db.insert(clientes).values(cliente);
      clientesInseridos++;
      if (clientesInseridos % 50 === 0) {
        console.log(`  Clientes inseridos: ${clientesInseridos}/${clientesArray.length}`);
      }
    } catch (error) {
      console.error(`Erro ao inserir cliente ${cliente.nome}:`, error.message);
    }
  }
  
  console.log(`✅ Total de clientes inseridos: ${clientesInseridos}\n`);
  
  // 3. Buscar IDs dos clientes
  const clientesDB = await db.select().from(clientes);
  const clienteIdMap = new Map();
  for (const c of clientesDB) {
    clienteIdMap.set(c.nome, c.id);
  }
  
  // 4. Inserir festas
  let festasInseridas = 0;
  let festasErro = 0;
  
  for (const c of contratos) {
    const dataEvento = converterData(c.evento?.data);
    if (!dataEvento) {
      festasErro++;
      continue;
    }
    
    const nomeCliente = c.cliente?.nome || '';
    const clienteId = clienteIdMap.get(nomeCliente);
    
    if (!clienteId) {
      console.error(`Cliente não encontrado: ${nomeCliente}`);
      festasErro++;
      continue;
    }
    
    const dataFechamento = converterData(c.data_fechamento) || new Date();
    const valor = extrairValor(c.pagamento?.valor);
    
    // Gerar código único
    const ano = dataEvento.getFullYear();
    const mes = String(dataEvento.getMonth() + 1).padStart(2, '0');
    const dia = String(dataEvento.getDate()).padStart(2, '0');
    const codigo = `F${ano}${mes}${dia}-${String(festasInseridas + 1).padStart(3, '0')}`;
    
    try {
      await db.insert(festas).values({
        codigo,
        clienteId,
        dataFechamento,
        dataFesta: dataEvento,
        valorTotal: valor,
        valorPago: 0,
        numeroConvidados: parseInt(c.evento?.numero_convidados) || null,
        tema: c.evento?.tema || null,
        cpfCliente: limparCPF(c.cliente?.cpf),
        endereco: c.cliente?.endereco || null,
        nomeAniversariante: c.evento?.aniversariante || null,
        status: 'agendada'
      });
      
      festasInseridas++;
      if (festasInseridas % 50 === 0) {
        console.log(`  Festas inseridas: ${festasInseridas}/${contratos.length}`);
      }
    } catch (error) {
      console.error(`Erro ao inserir festa ${codigo}:`, error.message);
      festasErro++;
    }
  }
  
  console.log(`\n✅ Importação concluída!`);
  console.log(`  Festas inseridas: ${festasInseridas}`);
  console.log(`  Festas com erro: ${festasErro}`);
  
  process.exit(0);
}

importar().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
