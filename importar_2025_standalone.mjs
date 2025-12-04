import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;

const contratosData = JSON.parse(readFileSync('/home/ubuntu/upload/contratos_2025.json', 'utf-8'));
const contratos = contratosData.contratos;

function limparCPF(cpf) {
  if (!cpf) return null;
  const limpo = String(cpf).replace(/\D/g, '');
  return limpo.length === 11 ? limpo : null;
}

function truncarTelefone(tel) {
  if (!tel) return null;
  return String(tel).substring(0, 20);
}

function converterData(dataStr) {
  if (!dataStr) return null;
  const partes = dataStr.split('/');
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
  }
  return null;
}

function extrairValor(valorStr) {
  if (!valorStr || valorStr === '') return 0;
  try {
    const valor = parseFloat(String(valorStr).replace(/\./g, '').replace(',', '.'));
    return Math.round(valor * 100); // Centavos
  } catch {
    return 0;
  }
}

function extrairNumeroConvidados(str) {
  if (!str) return null;
  // Extrair primeiro número (ex: "80+10" -> 80, "150" -> 150)
  const match = String(str).match(/\d+/);
  return match ? parseInt(match[0]) : null;
}

async function importar() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('✅ Conectado ao banco de dados\n');
  console.log('Iniciando importação de 2025...\n');
  
  try {
    // 1. Coletar clientes únicos
    const clientesMap = new Map();
    for (const c of contratos) {
      const nome = c.cliente?.nome || '';
      if (nome && !clientesMap.has(nome)) {
        clientesMap.set(nome, {
          nome,
          cpf: limparCPF(c.cliente?.cpf),
          telefone: truncarTelefone(c.cliente?.telefone),
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
        await connection.execute(
          'INSERT INTO clientes (nome, cpf, telefone, endereco, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
          [cliente.nome, cliente.cpf, cliente.telefone, cliente.endereco]
        );
        clientesInseridos++;
        if (clientesInseridos % 50 === 0) {
          console.log(`  Clientes inseridos: ${clientesInseridos}/${clientesArray.length}`);
        }
      } catch (error) {
        if (!error.message.includes('Duplicate entry')) {
          console.error(`Erro ao inserir cliente ${cliente.nome}:`, error.message);
        }
      }
    }
    
    console.log(`✅ Total de clientes inseridos: ${clientesInseridos}\n`);
    
    // 3. Buscar IDs dos clientes
    const [clientesDB] = await connection.execute('SELECT id, nome FROM clientes');
    const clienteIdMap = new Map();
    for (const c of clientesDB) {
      clienteIdMap.set(c.nome, c.id);
    }
    
    console.log(`Mapeamento de clientes: ${clienteIdMap.size} clientes encontrados\n`);
    
    // 4. Inserir festas
    let festasInseridas = 0;
    let festasErro = 0;
    
    for (let i = 0; i < contratos.length; i++) {
      const c = contratos[i];
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
      
      const dataFechamento = converterData(c.data_fechamento) || dataEvento;
      const valor = extrairValor(c.pagamento?.valor);
      
      // Gerar código único
      const codigo = `F${dataEvento.replace(/-/g, '')}-${String(i + 1).padStart(3, '0')}`;
      
      try {
        await connection.execute(
          `INSERT INTO festas (codigo, clienteId, dataFechamento, dataFesta, valorTotal, valorPago, numeroConvidados, tema, cpfCliente, endereco, nomeAniversariante, status, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, 'agendada', NOW(), NOW())`,
          [
            codigo,
            clienteId,
            dataFechamento,
            dataEvento,
            valor,
            extrairNumeroConvidados(c.evento?.numero_convidados),
            c.evento?.tema || null,
            limparCPF(c.cliente?.cpf),
            c.cliente?.endereco || null,
            c.evento?.aniversariante || null
          ]
        );
        
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
    
    // Validar total
    const [result] = await connection.execute('SELECT COUNT(*) as total FROM festas WHERE YEAR(dataFesta) = 2025');
    console.log(`\n📊 Total de festas 2025 no banco: ${result[0].total}`);
    
  } finally {
    await connection.end();
  }
}

importar().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
