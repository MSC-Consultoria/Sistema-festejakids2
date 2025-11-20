import { drizzle } from "drizzle-orm/mysql2";
import { clientes, festas } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { readFileSync } from "fs";

const db = drizzle(process.env.DATABASE_URL);

console.log("🚀 Iniciando importação de contratos...\n");

// Ler arquivo JSON com contratos extraídos
const contractsData = JSON.parse(
  readFileSync("/home/ubuntu/festeja-kids-2/scripts/contratos_extraidos.json", "utf-8")
);

console.log(`📄 ${contractsData.length} contratos para processar\n`);

let clientesImportados = 0;
let festasImportadas = 0;
let festasAtualizadas = 0;
const clientesMap = new Map();

for (const contract of contractsData) {
  const { nome_cliente, cpf, telefone, data_fechamento, data_evento, aniversariante, tema, numero_convidados, horario, valor_total } = contract;

  if (!nome_cliente || !data_evento) {
    console.log(`⚠️  Pulando contrato sem dados mínimos: ${contract.arquivo}`);
    continue;
  }

  // Converter datas de DD/MM/YYYY para Date
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [day, month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const dataFestaDate = parseDate(data_evento);
  const dataFechamentoDate = data_fechamento ? parseDate(data_fechamento) : new Date();

  // Verificar se cliente já existe (por nome ou CPF)
  let clienteId = clientesMap.get(nome_cliente);

  if (!clienteId) {
    // Buscar no banco por CPF ou nome
    let existingCliente = null;
    
    if (cpf) {
      const cleanCpf = cpf.replace(/[^\d]/g, '');
      const result = await db.select().from(clientes).where(eq(clientes.cpf, cleanCpf)).limit(1);
      if (result.length > 0) {
        existingCliente = result[0];
      }
    }
    
    if (!existingCliente) {
      const result = await db.select().from(clientes).where(eq(clientes.nome, nome_cliente)).limit(1);
      if (result.length > 0) {
        existingCliente = result[0];
      }
    }

    if (existingCliente) {
      clienteId = existingCliente.id;
      clientesMap.set(nome_cliente, clienteId);
      
      // Atualizar telefone e CPF se não existirem
      const updates = {};
      if (telefone && !existingCliente.telefone) {
        updates.telefone = telefone;
      }
      if (cpf && !existingCliente.cpf) {
        updates.cpf = cpf.replace(/[^\d]/g, '');
      }
      
      if (Object.keys(updates).length > 0) {
        await db.update(clientes).set(updates).where(eq(clientes.id, clienteId));
      }
    } else {
      // Criar novo cliente
      const result = await db.insert(clientes).values({
        nome: nome_cliente,
        telefone: telefone || null,
        email: null,
        cpf: cpf ? cpf.replace(/[^\d]/g, '') : null,
        endereco: null,
      });
      clienteId = Number(result[0].insertId);
      clientesMap.set(nome_cliente, clienteId);
      clientesImportados++;
    }
  }

  // Gerar código do contrato
  const day = String(dataFechamentoDate.getDate()).padStart(2, "0");
  const month = String(dataFechamentoDate.getMonth() + 1).padStart(2, "0");
  const year = String(dataFechamentoDate.getFullYear()).slice(-2);
  const initials = nome_cliente.trim().slice(0, 2).toUpperCase().replace(/[^A-Z]/g, "XX");
  let codigo = `${day}${month}${year}${initials}`;

  // Adicionar sufixo se código já existe
  let suffix = 1;
  let codigoOriginal = codigo;
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

  // Verificar se festa já existe (por código ou data + cliente)
  const existingFesta = await db.select().from(festas)
    .where(eq(festas.clienteId, clienteId))
    .limit(100);
  
  const festaExistente = existingFesta.find(f => {
    const fData = new Date(f.dataFesta);
    return fData.getDate() === dataFestaDate.getDate() &&
           fData.getMonth() === dataFestaDate.getMonth() &&
           fData.getFullYear() === dataFestaDate.getFullYear();
  });

  if (festaExistente) {
    // Atualizar festa existente com dados do contrato
    const updates = {};
    if (tema && !festaExistente.tema) updates.tema = tema;
    if (horario && !festaExistente.horario) updates.horario = horario;
    if (aniversariante && !festaExistente.observacoes) {
      updates.observacoes = `Aniversariante: ${aniversariante}`;
    }
    if (valor_total && festaExistente.valorTotal === 0) {
      updates.valorTotal = Math.round(valor_total * 100);
    }
    if (numero_convidados && festaExistente.numeroConvidados === 0) {
      updates.numeroConvidados = numero_convidados;
    }
    
    if (Object.keys(updates).length > 0) {
      await db.update(festas).set(updates).where(eq(festas.id, festaExistente.id));
      festasAtualizadas++;
      console.log(`✏️  Atualizada: ${nome_cliente} - ${data_evento}`);
    } else {
      console.log(`ℹ️  Já existe: ${nome_cliente} - ${data_evento}`);
    }
  } else {
    // Criar nova festa
    try {
      await db.insert(festas).values({
        codigo,
        clienteId,
        dataFechamento: dataFechamentoDate,
        dataFesta: dataFestaDate,
        valorTotal: valor_total ? Math.round(valor_total * 100) : 0,
        valorPago: 0,
        numeroConvidados: numero_convidados || 0,
        tema: tema || null,
        horario: horario || null,
        status: dataFestaDate < new Date() ? "realizada" : "agendada",
        observacoes: aniversariante ? `Aniversariante: ${aniversariante}` : null,
      });
      festasImportadas++;
      console.log(`✅ Importada: ${nome_cliente} - ${data_evento}`);
    } catch (e) {
      console.log(`❌ Erro ao importar ${nome_cliente}: ${e.message}`);
    }
  }
}

console.log(`\n📊 Resumo da importação:`);
console.log(`✅ ${clientesImportados} novos clientes criados`);
console.log(`✅ ${festasImportadas} novas festas importadas`);
console.log(`✏️  ${festasAtualizadas} festas atualizadas`);
console.log(`\n🎉 Importação concluída!`);

process.exit(0);
