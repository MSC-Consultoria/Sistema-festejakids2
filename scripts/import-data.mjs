import { drizzle } from "drizzle-orm/mysql2";
import { clientes, festas, custosVariaveis, custosFixos } from "../drizzle/schema.js";
import XLSX from "xlsx";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Conectar ao banco de dados
const db = drizzle(process.env.DATABASE_URL);

console.log("🚀 Iniciando importação de dados...\n");

// ============ IMPORTAR CUSTOS VARIÁVEIS ============
console.log("📊 Importando custos variáveis...");

const custosVariaveisData = [
  { descricao: "Equipe", valor: 83000, percentual: 0, ordem: 1 },
  { descricao: "Compras", valor: 50000, percentual: 0, ordem: 2 },
  { descricao: "Decoração", valor: 40000, percentual: 0, ordem: 3 },
  { descricao: "Animação", valor: 20000, percentual: 0, ordem: 4 },
  { descricao: "Salgados", valor: 42000, percentual: 0, ordem: 5 },
  { descricao: "Bolo Fake", valor: 4000, percentual: 0, ordem: 6 },
  { descricao: "Uber", valor: 5000, percentual: 0, ordem: 7 },
  { descricao: "Açaí", valor: 5000, percentual: 0, ordem: 8 },
  { descricao: "Bolo", valor: 20000, percentual: 0, ordem: 9 },
  { descricao: "Assado", valor: 20000, percentual: 0, ordem: 10 },
  { descricao: "Comissão GB", valor: 0, percentual: 2, ordem: 11 },
  { descricao: "Refrigerante", valor: 30000, percentual: 0, ordem: 12 },
];

for (const custo of custosVariaveisData) {
  await db.insert(custosVariaveis).values({
    descricao: custo.descricao,
    valor: custo.valor,
    percentual: custo.percentual,
    ativo: 1,
    ordem: custo.ordem,
  });
}

console.log(`✅ ${custosVariaveisData.length} custos variáveis importados\n`);

// ============ IMPORTAR CUSTOS FIXOS ============
console.log("📊 Importando custos fixos...");

const custosFixosData = [
  { descricao: "Água", valor: 100000, ordem: 1 },
  { descricao: "Luz", valor: 600000, ordem: 2 },
  { descricao: "Gás", valor: 80000, ordem: 3 },
  { descricao: "IPTU", valor: 200000, ordem: 4 },
  { descricao: "Contador", valor: 40000, ordem: 5 },
  { descricao: "Faxina", valor: 60000, ordem: 6 },
  { descricao: "Escritório", valor: 60000, ordem: 7 },
  { descricao: "Detetização", valor: 40000, ordem: 8 },
  { descricao: "Marketing", valor: 100000, ordem: 9 },
  { descricao: "Anúncio", valor: 100000, ordem: 10 },
  { descricao: "Imóvel", valor: 700000, ordem: 11 },
];

for (const custo of custosFixosData) {
  await db.insert(custosFixos).values({
    descricao: custo.descricao,
    valor: custo.valor,
    ativo: 1,
    ordem: custo.ordem,
  });
}

console.log(`✅ ${custosFixosData.length} custos fixos importados\n`);

// ============ IMPORTAR CLIENTES E FESTAS DE 2025 ============
console.log("📊 Importando dados de 2025...");

const festas2025Path = join(__dirname, "../../upload/Festas2025.xlsx");
const workbook2025 = XLSX.readFile(festas2025Path);
const sheet2025 = workbook2025.Sheets[workbook2025.SheetNames[0]];
const data2025 = XLSX.utils.sheet_to_json(sheet2025);

let clientesImportados = 0;
let festasImportadas = 0;
const clientesMap = new Map(); // Para evitar duplicatas

for (const row of data2025) {
  const nomeCliente = row["Nome do cliente"];
  const telefone = row["Contato 1"];
  const dataFechamento = row["Data de Fechamento"];
  const dataFesta = row["Data da  Festa"];
  const valor = row["Valor "];
  const valorPago = row["Valor Pago"];
  const numeroConvidados = row["N° de convidados"];

  if (!nomeCliente || !dataFesta || !valor) continue;

  // Verificar se cliente já existe
  let clienteId = clientesMap.get(nomeCliente);
  
  if (!clienteId) {
    // Criar novo cliente
    const result = await db.insert(clientes).values({
      nome: nomeCliente,
      telefone: telefone ? String(telefone) : null,
      email: null,
    });
    clienteId = Number(result[0].insertId);
    clientesMap.set(nomeCliente, clienteId);
    clientesImportados++;
  }

  // Converter datas do Excel (serial number) para Date
  const excelDateToJSDate = (serial) => {
    if (!serial || typeof serial !== 'number') return new Date();
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
  };

  const dataFestaDate = excelDateToJSDate(dataFesta);
  const dataFechamentoDate = dataFechamento ? excelDateToJSDate(dataFechamento) : new Date();

  // Gerar código do contrato
  const day = String(dataFechamentoDate.getDate()).padStart(2, "0");
  const month = String(dataFechamentoDate.getMonth() + 1).padStart(2, "0");
  const year = String(dataFechamentoDate.getFullYear()).slice(-2);
  const initials = nomeCliente.trim().slice(0, 2).toUpperCase().replace(/[^A-Z]/g, "XX");
  let codigo = `${day}${month}${year}${initials}`;
  
  // Adicionar sufixo se código já existe
  let suffix = 1;
  let codigoOriginal = codigo;
  const { eq } = await import("drizzle-orm");
  
  while (true) {
    try {
      const existing = await db.select().from(festas).where(eq(festas.codigo, codigo)).limit(1);
      if (existing.length === 0) break;
      codigo = `${codigoOriginal}${suffix}`;
      suffix++;
    } catch (e) {
      break;
    }
  }

  try {
    await db.insert(festas).values({
      codigo,
      clienteId,
      dataFechamento: dataFechamentoDate,
      dataFesta: dataFestaDate,
      valorTotal: Math.round((valor || 0) * 100), // converter para centavos
      valorPago: Math.round((valorPago || 0) * 100),
      numeroConvidados: Math.round(numeroConvidados || 0),
      tema: null,
      horario: null,
      status: dataFestaDate < new Date() ? "realizada" : "agendada",
      observacoes: null,
    });
    festasImportadas++;
  } catch (e) {
    console.log(`⚠️  Erro ao importar festa ${codigo}: ${e.message}`);
  }
}

console.log(`✅ ${clientesImportados} clientes importados`);
console.log(`✅ ${festasImportadas} festas importadas\n`);

console.log("🎉 Importação concluída com sucesso!");
process.exit(0);
