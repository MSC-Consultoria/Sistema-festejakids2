#!/usr/bin/env node

/**
 * Script para analisar a estrutura da planilha Próximasfestas.xlsx
 */

import xlsx from "xlsx";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, "../data/Próximasfestas.xlsx");

console.log("📊 Analisando planilha:", filePath);
console.log("");

try {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  console.log("📄 Nome da planilha:", sheetName);
  console.log("");
  
  // Converter para JSON
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log("📋 Total de linhas:", data.length);
  console.log("");
  
  // Mostrar cabeçalhos
  console.log("📌 Cabeçalhos (primeira linha):");
  if (data.length > 0) {
    console.log(data[0]);
  }
  console.log("");
  
  // Mostrar primeiras 5 linhas de dados
  console.log("📝 Primeiras 5 linhas de dados:");
  for (let i = 1; i < Math.min(6, data.length); i++) {
    console.log(`\nLinha ${i}:`);
    console.log(data[i]);
  }
  console.log("");
  
  // Contar linhas não vazias
  let nonEmptyRows = 0;
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row && row.some(cell => cell !== undefined && cell !== null && cell !== "")) {
      nonEmptyRows++;
    }
  }
  
  console.log("✅ Linhas com dados:", nonEmptyRows);
  console.log("❌ Linhas vazias:", data.length - 1 - nonEmptyRows);
  
} catch (error) {
  console.error("❌ Erro ao analisar planilha:", error);
  process.exit(1);
}
