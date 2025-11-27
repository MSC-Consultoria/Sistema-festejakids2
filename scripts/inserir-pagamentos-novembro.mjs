import { drizzle } from 'drizzle-orm/mysql2';
import { pagamentos } from '../drizzle/schema.js';
import fs from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não configurada');
  process.exit(1);
}

const db = drizzle(DATABASE_URL);

// Ler JSON de pagamentos
const pagamentosData = JSON.parse(
  fs.readFileSync('/home/ubuntu/pagamentos_para_inserir.json', 'utf-8')
);

console.log(`📋 Total de pagamentos a inserir: ${pagamentosData.length}`);
console.log(`💰 Valor total: R$ ${pagamentosData.reduce((sum, p) => sum + p.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`);

let inserted = 0;
let errors = 0;

for (const pag of pagamentosData) {
  try {
    await db.insert(pagamentos).values({
      codigo: pag.codigo,
      festaId: null, // Sem festa associada inicialmente
      valor: Math.round(pag.valor * 100), // Converter para centavos
      dataPagamento: new Date(pag.data),
      metodoPagamento: pag.formaPagamento,
      pagador: pag.pagador,
      comprovanteUrl: null,
      comprovanteFileKey: null,
      observacoes: 'Pagamento de novembro/2025 - Importado automaticamente',
    });
    inserted++;
    console.log(`✅ ${pag.codigo} - ${pag.pagador.substring(0, 30)} - R$ ${pag.valor.toFixed(2)}`);
  } catch (error) {
    errors++;
    console.error(`❌ Erro ao inserir ${pag.codigo}:`, error.message);
  }
}

console.log(`\n📊 Resumo:`);
console.log(`  ✅ Inseridos: ${inserted}`);
console.log(`  ❌ Erros: ${errors}`);
console.log(`  📈 Total: ${pagamentosData.length}`);

process.exit(0);
