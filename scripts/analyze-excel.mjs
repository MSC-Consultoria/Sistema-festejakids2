#!/usr/bin/env node

/**
 * Script para analisar estrutura da planilha Excel
 * Uso: node scripts/analyze-excel.mjs
 */

import XLSX from 'xlsx';

const filePath = './Festasvendidas2025.xlsx';

console.log('📊 Analisando planilha:', filePath);
console.log('');

try {
  const workbook = XLSX.readFile(filePath);
  
  console.log('📋 Abas encontradas:', workbook.SheetNames);
  console.log('');
  
  // Analisar primeira aba
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  console.log(`📄 Analisando aba: "${sheetName}"`);
  console.log('');
  
  // Converter para JSON para análise
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log('📌 Cabeçalhos (primeira linha):');
  console.log(data[0]);
  console.log('');
  
  console.log(`📊 Total de linhas: ${data.length}`);
  console.log(`📊 Total de colunas: ${data[0]?.length || 0}`);
  console.log('');
  
  console.log('🔍 Primeiras 5 linhas de dados:');
  for (let i = 0; i < Math.min(5, data.length); i++) {
    console.log(`Linha ${i + 1}:`, data[i]);
  }
  console.log('');
  
  // Converter para JSON com cabeçalhos
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
  console.log('📝 Exemplo de registro (primeiro item):');
  console.log(JSON.stringify(jsonData[0], null, 2));
  console.log('');
  
  console.log(`✅ Total de registros: ${jsonData.length}`);
  
} catch (error) {
  console.error('❌ Erro ao analisar planilha:', error);
  process.exit(1);
}
