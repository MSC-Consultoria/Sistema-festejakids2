import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  clientes,
  InsertCliente,
  festas,
  InsertFesta,
  pagamentos,
  InsertPagamento,
  custosVariaveis,
  InsertCustoVariavel,
  custosFixos,
  InsertCustoFixo,
  visitacoes,
  InsertVisitacao,
  contratosGerados,
  InsertContratoGerado,
  templatesContrato,
  InsertTemplateContrato
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ CLIENTES ============

export async function createCliente(cliente: InsertCliente) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(clientes).values(cliente);
  return Number(result[0].insertId);
}

export async function getClienteById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clientes).where(eq(clientes.id, id)).limit(1);
  return result[0];
}

export async function getAllClientes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clientes).orderBy(clientes.nome);
}

export async function updateCliente(id: number, data: Partial<InsertCliente>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(clientes).set(data).where(eq(clientes.id, id));
}

export async function deleteCliente(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(clientes).where(eq(clientes.id, id));
}

export async function searchClientes(searchTerm: string) {
  const db = await getDb();
  if (!db) return [];
  const { or, like } = await import("drizzle-orm");
  return db.select().from(clientes)
    .where(
      or(
        like(clientes.nome, `%${searchTerm}%`),
        like(clientes.telefone, `%${searchTerm}%`),
        like(clientes.email, `%${searchTerm}%`)
      )
    )
    .orderBy(clientes.nome);
}

// ============ FESTAS ============

export async function createFesta(festa: InsertFesta) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(festas).values(festa);
  return Number(result[0].insertId);
}

export async function getFestaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select({
      id: festas.id,
      codigo: festas.codigo,
      clienteId: festas.clienteId,
      nomeCliente: clientes.nome,
      dataFechamento: festas.dataFechamento,
      dataFesta: festas.dataFesta,
      valorTotal: festas.valorTotal,
      valorPago: festas.valorPago,
      numeroConvidados: festas.numeroConvidados,
      tema: festas.tema,
      horario: festas.horario,
      status: festas.status,
      observacoes: festas.observacoes,
      cpfCliente: festas.cpfCliente,
      endereco: festas.endereco,
      brinde: festas.brinde,
      refeicao: festas.refeicao,
      massaType: festas.massaType,
      molhoType: festas.molhoType,
      bolo: festas.bolo,
      nomeAniversariante: festas.nomeAniversariante,
      idadeAniversariante: festas.idadeAniversariante,
      createdAt: festas.createdAt,
      updatedAt: festas.updatedAt,
    })
    .from(festas)
    .leftJoin(clientes, eq(festas.clienteId, clientes.id))
    .where(eq(festas.id, id))
    .limit(1);
  return result[0];
}

export async function getFestaByCodigo(codigo: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(festas).where(eq(festas.codigo, codigo)).limit(1);
  return result[0];
}

export async function getAllFestas() {
  const db = await getDb();
  if (!db) return [];
  const { desc } = await import("drizzle-orm");
  
  const result = await db
    .select({
      id: festas.id,
      codigo: festas.codigo,
      clienteId: festas.clienteId,
      clienteNome: clientes.nome,
      dataFechamento: festas.dataFechamento,
      dataFesta: festas.dataFesta,
      valorTotal: festas.valorTotal,
      valorPago: festas.valorPago,
      numeroConvidados: festas.numeroConvidados,
      tema: festas.tema,
      horario: festas.horario,
      status: festas.status,
      observacoes: festas.observacoes,
      createdAt: festas.createdAt,
      updatedAt: festas.updatedAt,
    })
    .from(festas)
    .leftJoin(clientes, eq(festas.clienteId, clientes.id))
    .orderBy(desc(festas.dataFesta));
  
  return result;
}

export async function getFestasByStatus(status: "agendada" | "realizada" | "cancelada") {
  const db = await getDb();
  if (!db) return [];
  const { desc } = await import("drizzle-orm");
  return db.select().from(festas)
    .where(eq(festas.status, status))
    .orderBy(desc(festas.dataFesta));
}

export async function getFestasByCliente(clienteId: number) {
  const db = await getDb();
  if (!db) return [];
  const { desc } = await import("drizzle-orm");
  return db.select().from(festas)
    .where(eq(festas.clienteId, clienteId))
    .orderBy(desc(festas.dataFesta));
}

export async function getFestasByDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  const { and, gte, lte, desc } = await import("drizzle-orm");
  return db.select().from(festas)
    .where(
      and(
        gte(festas.dataFesta, startDate),
        lte(festas.dataFesta, endDate)
      )
    )
    .orderBy(desc(festas.dataFesta));
}

export async function updateFesta(id: number, data: Partial<InsertFesta>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(festas).set(data).where(eq(festas.id, id));
}

export async function deleteFesta(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(festas).where(eq(festas.id, id));
}

// ============ PAGAMENTOS ============

export async function createPagamento(pagamento: InsertPagamento) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pagamentos).values(pagamento);
  return Number(result[0].insertId);
}

export async function getAllPagamentos() {
  const db = await getDb();
  if (!db) return [];
  const { desc } = await import("drizzle-orm");
  return db.select().from(pagamentos)
    .orderBy(desc(pagamentos.dataPagamento));
}

export async function getPagamentosByFesta(festaId: number) {
  const db = await getDb();
  if (!db) return [];
  const { desc } = await import("drizzle-orm");
  return db.select().from(pagamentos)
    .where(eq(pagamentos.festaId, festaId))
    .orderBy(desc(pagamentos.dataPagamento));
}

export async function deletePagamento(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(pagamentos).where(eq(pagamentos.id, id));
}

// ============ CUSTOS VARIÁVEIS ============

export async function createCustoVariavel(custo: InsertCustoVariavel) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(custosVariaveis).values(custo);
  return Number(result[0].insertId);
}

export async function getAllCustosVariaveis() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(custosVariaveis).orderBy(custosVariaveis.ordem);
}

export async function getActiveCustosVariaveis() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(custosVariaveis)
    .where(eq(custosVariaveis.ativo, 1))
    .orderBy(custosVariaveis.ordem);
}

export async function updateCustoVariavel(id: number, data: Partial<InsertCustoVariavel>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(custosVariaveis).set(data).where(eq(custosVariaveis.id, id));
}

export async function deleteCustoVariavel(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(custosVariaveis).where(eq(custosVariaveis.id, id));
}

// ============ CUSTOS FIXOS ============

export async function createCustoFixo(custo: InsertCustoFixo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(custosFixos).values(custo);
  return Number(result[0].insertId);
}

export async function getAllCustosFixos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(custosFixos).orderBy(custosFixos.ordem);
}

export async function getActiveCustosFixos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(custosFixos)
    .where(eq(custosFixos.ativo, 1))
    .orderBy(custosFixos.ordem);
}

export async function updateCustoFixo(id: number, data: Partial<InsertCustoFixo>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(custosFixos).set(data).where(eq(custosFixos.id, id));
}

export async function deleteCustoFixo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(custosFixos).where(eq(custosFixos.id, id));
}

// ============ FUNÇÕES DE CÁLCULO ============

export async function calcularCustoTotalVariavel(valorFesta: number) {
  const custosAtivos = await getActiveCustosVariaveis();
  let total = 0;
  
  for (const custo of custosAtivos) {
    if (custo.percentual && custo.percentual > 0) {
      // Custo percentual (ex: comissão)
      total += Math.round((valorFesta * custo.percentual) / 100);
    } else {
      // Custo fixo
      total += custo.valor;
    }
  }
  
  return total;
}

export async function calcularCustoTotalFixoMensal() {
  const custosAtivos = await getActiveCustosFixos();
  return custosAtivos.reduce((total, custo) => total + custo.valor, 0);
}

export async function calcularMargemLucro(valorFesta: number) {
  const custoVariavel = await calcularCustoTotalVariavel(valorFesta);
  const margemBruta = valorFesta - custoVariavel;
  const percentualMargem = (margemBruta / valorFesta) * 100;
  
  return {
    custoVariavel,
    margemBruta,
    percentualMargem,
  };
}

// ============================================
// VISITAÇÕES (LEADS)
// ============================================

export async function createVisitacao(data: InsertVisitacao) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(visitacoes).values(data);
  return { id: Number(result[0].insertId) };
}

export async function getAllVisitacoes() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(visitacoes).orderBy(visitacoes.dataVisita);
}

export async function getVisitacaoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(visitacoes).where(eq(visitacoes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateVisitacao(id: number, data: Partial<InsertVisitacao>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(visitacoes).set(data).where(eq(visitacoes.id, id));
  return { success: true };
}

export async function deleteVisitacao(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(visitacoes).where(eq(visitacoes.id, id));
  return { success: true };
}

export async function getVisitacoesStats() {
  const db = await getDb();
  if (!db) return {
    total: 0,
    visitou: 0,
    aguardando: 0,
    propostaEnviada: 0,
    fechado: 0,
    perdido: 0,
    taxaConversao: 0
  };
  
  const all = await db.select().from(visitacoes);
  
  const aguardando = all.filter(v => v.status === "aguardando").length;
  const fechouPreContrato = all.filter(v => v.status === "fechou_pre_contrato").length;
  const fechouContrato = all.filter(v => v.status === "fechou_contrato").length;
  const temInteresse = all.filter(v => v.status === "tem_interesse").length;
  const faltou = all.filter(v => v.status === "faltou").length;
  const remarcar = all.filter(v => v.status === "remarcar").length;
  
  const taxaConversao = all.length > 0 ? ((fechouPreContrato + fechouContrato) / all.length) * 100 : 0;
  
  return {
    total: all.length,
    aguardando,
    fechouPreContrato,
    fechouContrato,
    temInteresse,
    faltou,
    remarcar,
    taxaConversao: Math.round(taxaConversao * 10) / 10
  };
}


// ========================================
// Helpers para Contratos Gerados
// ========================================

export async function createContratoGerado(contrato: InsertContratoGerado) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  
  const result = await database.insert(contratosGerados).values(contrato);
  return result;
}

export async function getContratosByFesta(festaId: number) {
  const database = await getDb();
  if (!database) return [];
  
  const result = await database
    .select()
    .from(contratosGerados)
    .where(eq(contratosGerados.festaId, festaId))
    .orderBy(contratosGerados.createdAt);
  
  return result;
}

export async function getProximaVersaoContrato(festaId: number): Promise<number> {
  const database = await getDb();
  if (!database) return 1;
  
  const contratos = await database
    .select()
    .from(contratosGerados)
    .where(eq(contratosGerados.festaId, festaId));
  
  if (contratos.length === 0) return 1;
  
  const maxVersao = Math.max(...contratos.map(c => c.versao || 1));
  return maxVersao + 1;
}

// ========================================
// Helpers para Templates de Contrato
// ========================================

export async function createTemplateContrato(template: InsertTemplateContrato) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  
  const result = await database.insert(templatesContrato).values(template);
  return result;
}

export async function getAllTemplatesContrato() {
  const database = await getDb();
  if (!database) return [];
  
  const result = await database.select().from(templatesContrato);
  return result;
}

export async function getTemplateContratoAtivo() {
  const database = await getDb();
  if (!database) return null;
  
  const result = await database
    .select()
    .from(templatesContrato)
    .where(eq(templatesContrato.ativo, 1))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function getTemplateContratoById(id: number) {
  const database = await getDb();
  if (!database) return null;
  
  const result = await database
    .select()
    .from(templatesContrato)
    .where(eq(templatesContrato.id, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updateTemplateContrato(id: number, data: Partial<InsertTemplateContrato>) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  
  await database.update(templatesContrato).set(data).where(eq(templatesContrato.id, id));
}

export async function deleteTemplateContrato(id: number) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  
  await database.delete(templatesContrato).where(eq(templatesContrato.id, id));
}

export async function setTemplateContratoAtivo(id: number) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  
  // Desativar todos os templates
  await database.update(templatesContrato).set({ ativo: 0 });
  
  // Ativar o template selecionado
  await database.update(templatesContrato).set({ ativo: 1 }).where(eq(templatesContrato.id, id));
}
