import { drizzle } from "drizzle-orm/mysql2";
import { clientes, festas } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { readFileSync } from "fs";

const db = drizzle(process.env.DATABASE_URL);

console.log("📊 Importando dados da planilha Próximasfestas.xlsx...\n");

// Ler JSON convertido
const festasData = JSON.parse(
  readFileSync("/home/ubuntu/festeja-kids-2/scripts/proximasfestas.json", "utf-8")
);

console.log(`📋 ${festasData.length} festas encontradas\n`);

let clientesImportados = 0;
let festasImportadas = 0;
const clientesMap = new Map();

for (const festaData of festasData) {
  const { codigo, cliente, data_fechamento, data_festa, valor_festa, valor_recebido, convidados, telefone } = festaData;

  if (!cliente || !data_festa || data_festa === 'nan') {
    console.log(`⚠️  Pulando festa sem dados mínimos: ${codigo}`);
    continue;
  }

  // Converter datas
  const parseExcelDate = (dateStr) => {
    if (!dateStr || dateStr === 'nan') return new Date();
    try {
      // Formato: "2025-11-22 00:00:00"
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch {
      return new Date();
    }
  };

  const dataFestaDate = parseExcelDate(data_festa);
  const dataFechamentoDate = parseExcelDate(data_fechamento);

  // Verificar se cliente já existe
  let clienteId = clientesMap.get(cliente.toLowerCase().trim());

  if (!clienteId) {
    // Buscar no banco
    const clienteResult = await db.select().from(clientes)
      .where(eq(clientes.nome, cliente))
      .limit(1);

    if (clienteResult.length > 0) {
      clienteId = clienteResult[0].id;
      clientesMap.set(cliente.toLowerCase().trim(), clienteId);
    } else {
      // Criar novo cliente
      const telefoneClean = telefone.replace(/[^\d]/g, '');
      const result = await db.insert(clientes).values({
        nome: cliente,
        telefone: telefoneClean || null,
        email: null,
        cpf: null,
        endereco: null,
      });
      clienteId = Number(result[0].insertId);
      clientesMap.set(cliente.toLowerCase().trim(), clienteId);
      clientesImportados++;
    }
  }

  // Converter valores para centavos
  const valorTotalCentavos = Math.round(valor_festa * 100);
  const valorPagoCentavos = Math.round(valor_recebido * 100);

  // Determinar status
  const hoje = new Date();
  let status = 'agendada';
  if (dataFestaDate < hoje) {
    status = 'realizada';
  }

  // Criar festa
  try {
    await db.insert(festas).values({
      codigo: codigo || `AUTO${Date.now()}`,
      clienteId,
      dataFechamento: dataFechamentoDate,
      dataFesta: dataFestaDate,
      valorTotal: valorTotalCentavos,
      valorPago: valorPagoCentavos,
      numeroConvidados: convidados || 0,
      tema: null,
      horario: null,
      status,
      observacoes: null,
    });
    festasImportadas++;
    console.log(`✅ ${cliente} - ${dataFestaDate.toLocaleDateString('pt-BR')} - R$ ${(valorTotalCentavos/100).toFixed(2)}`);
  } catch (e) {
    console.log(`❌ Erro ao importar ${cliente}: ${e.message}`);
  }
}

console.log(`\n📊 Resumo da importação:`);
console.log(`✅ ${clientesImportados} clientes criados`);
console.log(`✅ ${festasImportadas} festas importadas`);
console.log(`\n🎉 Importação concluída!`);

process.exit(0);
