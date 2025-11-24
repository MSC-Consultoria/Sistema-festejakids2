#!/usr/bin/env node

/**
 * Script para testar importação da planilha real
 * Uso: node scripts/test-import.mjs
 */

import { readFileSync } from 'fs';
import { parseExcelFestas, importarFestas } from '../server/importacao.ts';

const filePath = './Festasvendidas2025.xlsx';

console.log('📊 Testando importação de:', filePath);
console.log('');

try {
  // Ler arquivo
  const fileBuffer = readFileSync(filePath);
  
  console.log('✅ Arquivo lido com sucesso');
  console.log('');
  
  // Parsear
  console.log('🔍 Parseando arquivo...');
  const parseResult = await parseExcelFestas(fileBuffer);
  
  console.log('');
  console.log('📊 Resultado do Parse:');
  console.log(`  Total de linhas: ${parseResult.totalLinhas}`);
  console.log(`  Festas válidas: ${parseResult.importadas}`);
  console.log(`  Erros: ${parseResult.erros.length}`);
  console.log('');
  
  if (parseResult.erros.length > 0) {
    console.log('❌ Erros encontrados:');
    parseResult.erros.slice(0, 10).forEach(erro => {
      console.log(`  Linha ${erro.linha}: ${erro.erro}`);
    });
    if (parseResult.erros.length > 10) {
      console.log(`  ... e mais ${parseResult.erros.length - 10} erros`);
    }
    console.log('');
  }
  
  if (parseResult.festas.length > 0) {
    console.log('✅ Primeiras 3 festas parseadas:');
    parseResult.festas.slice(0, 3).forEach((festa, idx) => {
      console.log(`\n  Festa ${idx + 1}:`);
      console.log(`    Código: ${festa.codigo}`);
      console.log(`    Cliente: ${festa.nomeCliente}`);
      console.log(`    Data Fechamento: ${festa.dataFechamento.toLocaleDateString()}`);
      console.log(`    Data Festa: ${festa.dataFesta.toLocaleDateString()}`);
      console.log(`    Valor: R$ ${(festa.valorTotal / 100).toFixed(2)}`);
      console.log(`    Pago: R$ ${(festa.valorPago / 100).toFixed(2)}`);
      console.log(`    Convidados: ${festa.numeroConvidados}`);
      console.log(`    Custos: R$ ${(festa.custos / 100).toFixed(2)}`);
      console.log(`    Telefone: ${festa.telefone || 'Não informado'}`);
      console.log(`    Tema: ${festa.tema || 'Não informado'}`);
      console.log(`    Horário: ${festa.horario || 'Não informado'}`);
    });
    console.log('');
  }
  
  // Perguntar se deseja importar
  console.log('⚠️  Para importar os dados para o banco, execute:');
  console.log('   node scripts/import-festas.mjs');
  console.log('');
  
} catch (error) {
  console.error('❌ Erro ao testar importação:', error);
  process.exit(1);
}
