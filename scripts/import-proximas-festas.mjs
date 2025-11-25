#!/usr/bin/env node

/**
 * Script para importar festas da planilha Próximasfestas.xlsx
 */

import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import xlsx from "xlsx";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL não configurada!");
  process.exit(1);
}

const filePath = join(__dirname, "../data/Próximasfestas.xlsx");

console.log("📊 Importando festas de:", filePath);
console.log("");

const db = drizzle(DATABASE_URL);

// Função para converter data do Excel para JavaScript
// Excel armazena datas como número de dias desde 1900-01-01
// Ajustamos para meio-dia UTC para evitar problemas de timezone
function excelDateToJSDate(excelDate) {
  if (!excelDate || typeof excelDate !== 'number') return null;
  // 25569 = dias entre 1900-01-01 e 1970-01-01 (epoch Unix)
  // Multiplicamos por 86400000 (milissegundos em um dia)
  const utcDays = Math.floor(excelDate - 25569);
  // Adiciona 12 horas (meio-dia UTC) para evitar problemas de timezone
  const utcValue = utcDays * 86400 * 1000 + (12 * 60 * 60 * 1000);
  const date = new Date(utcValue);
  return date;
}

// Função para normalizar telefone
function normalizarTelefone(telefone) {
  if (!telefone) return null;
  const tel = String(telefone).replace(/\D/g, '');
  if (tel.length === 0) return null;
  if (tel.length === 9) return `21${tel}`;
  if (tel.length === 11) return tel;
  return tel;
}

async function importarFestas() {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log("📋 Total de linhas na planilha:", data.length);
    console.log("");
    
    let sucessos = 0;
    let erros = 0;
    const errosDetalhados = [];
    
    // Começar da linha 3 (índice 3) porque:
    // Linha 0: "Próximas Festas"
    // Linha 1: vazia
    // Linha 2: cabeçalhos
    // Linha 3+: dados
    for (let i = 3; i < data.length; i++) {
      const row = data[i];
      
      // Pular linhas vazias
      if (!row || !row[0]) continue;
      
      try {
        const codigo = row[0] ? String(row[0]).trim() : null;
        const nomeCliente = row[1] ? String(row[1]).trim() : null;
        const dataFechamento = excelDateToJSDate(row[2]);
        const dataFesta = excelDateToJSDate(row[3]);
        const horario = row[4] ? String(row[4]).trim() : null;
        const tema = row[5] ? String(row[5]).trim() : null;
        const valorFesta = row[6] ? parseFloat(row[6]) : 0;
        const valorRecebido = row[7] ? parseFloat(row[7]) : 0;
        const pagamento1 = row[8] ? parseFloat(row[8]) : 0;
        const pagamento2 = row[9] ? parseFloat(row[9]) : 0;
        const pagamento3 = row[10] ? parseFloat(row[10]) : 0;
        const convidados = row[11] ? parseInt(row[11]) : null;
        const telefone = normalizarTelefone(row[12]);
        
        // Validações básicas
        if (!codigo || !nomeCliente || !dataFesta) {
          erros++;
          errosDetalhados.push({
            linha: i + 1,
            motivo: "Dados obrigatórios faltando (código, cliente ou data)",
            dados: { codigo, nomeCliente, dataFesta }
          });
          continue;
        }
        
        // 1. Criar ou buscar cliente
        const clienteResult = await db.execute(sql`
          SELECT id FROM clientes WHERE nome = ${nomeCliente} LIMIT 1
        `);
        
        let clienteId;
        if (clienteResult[0] && clienteResult[0].length > 0) {
          clienteId = clienteResult[0][0].id;
        } else {
          const insertCliente = await db.execute(sql`
            INSERT INTO clientes (nome, telefone, email, createdAt, updatedAt)
            VALUES (${nomeCliente}, ${telefone}, NULL, NOW(), NOW())
          `);
          clienteId = insertCliente[0].insertId;
        }
        
        // 2. Inserir festa (valores em centavos)
        const valorTotalCentavos = Math.round(valorFesta * 100);
        const valorPagoCentavos = Math.round(valorRecebido * 100);
        
        const insertFesta = await db.execute(sql`
          INSERT INTO festas (
            codigo,
            clienteId,
            dataFechamento,
            dataFesta,
            horario,
            tema,
            valorTotal,
            valorPago,
            numeroConvidados,
            status,
            createdAt,
            updatedAt
          ) VALUES (
            ${codigo},
            ${clienteId},
            ${dataFechamento},
            ${dataFesta},
            ${horario},
            ${tema},
            ${valorTotalCentavos},
            ${valorPagoCentavos},
            ${convidados},
            'agendada',
            NOW(),
            NOW()
          )
        `);
        
        const festaId = insertFesta[0].insertId;
        
        // 3. Inserir pagamentos (se houver) - valores em centavos
        const pagamentos = [pagamento1, pagamento2, pagamento3].filter(p => p > 0);
        
        for (const valor of pagamentos) {
          const valorCentavos = Math.round(valor * 100);
          await db.execute(sql`
            INSERT INTO pagamentos (
              festaId,
              valor,
              dataPagamento,
              metodoPagamento,
              createdAt
            ) VALUES (
              ${festaId},
              ${valorCentavos},
              ${dataFechamento || new Date()},
              'pix',
              NOW()
            )
          `);
        }
        
        sucessos++;
        console.log(`✅ Linha ${i + 1}: ${nomeCliente} - ${tema} (${codigo})`);
        
      } catch (error) {
        erros++;
        errosDetalhados.push({
          linha: i + 1,
          motivo: error.message,
          dados: row
        });
        console.error(`❌ Erro na linha ${i + 1}:`, error.message);
      }
    }
    
    console.log("");
    console.log("📊 Resultado da importação:");
    console.log(`  ✅ Sucessos: ${sucessos}`);
    console.log(`  ❌ Erros: ${erros}`);
    
    if (errosDetalhados.length > 0) {
      console.log("");
      console.log("❌ Detalhes dos erros:");
      errosDetalhados.forEach(erro => {
        console.log(`  Linha ${erro.linha}: ${erro.motivo}`);
      });
    }
    
    console.log("");
    console.log("✨ Importação concluída!");
    
  } catch (error) {
    console.error("❌ Erro ao importar festas:", error);
    process.exit(1);
  }
}

importarFestas()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
