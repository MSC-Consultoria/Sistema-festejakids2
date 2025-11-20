import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de clientes
 */
export const clientes = mysqlTable("clientes", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  cpf: varchar("cpf", { length: 14 }),
  endereco: text("endereco"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = typeof clientes.$inferInsert;

/**
 * Tabela de festas
 */
export const festas = mysqlTable("festas", {
  id: int("id").autoincrement().primaryKey(),
  codigo: varchar("codigo", { length: 20 }).notNull().unique(),
  clienteId: int("clienteId").notNull(),
  dataFechamento: timestamp("dataFechamento").notNull(),
  dataFesta: timestamp("dataFesta").notNull(),
  valorTotal: int("valorTotal").notNull(), // em centavos
  valorPago: int("valorPago").default(0).notNull(), // em centavos
  numeroConvidados: int("numeroConvidados").notNull(),
  tema: varchar("tema", { length: 255 }),
  horario: varchar("horario", { length: 50 }),
  status: mysqlEnum("status", ["agendada", "realizada", "cancelada"]).default("agendada").notNull(),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Festa = typeof festas.$inferSelect;
export type InsertFesta = typeof festas.$inferInsert;

/**
 * Tabela de pagamentos
 */
export const pagamentos = mysqlTable("pagamentos", {
  id: int("id").autoincrement().primaryKey(),
  festaId: int("festaId").notNull(),
  valor: int("valor").notNull(), // em centavos
  dataPagamento: timestamp("dataPagamento").notNull(),
  metodoPagamento: varchar("metodoPagamento", { length: 50 }),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Pagamento = typeof pagamentos.$inferSelect;
export type InsertPagamento = typeof pagamentos.$inferInsert;

/**
 * Tabela de custos variáveis (por festa)
 */
export const custosVariaveis = mysqlTable("custosVariaveis", {
  id: int("id").autoincrement().primaryKey(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  valor: int("valor").notNull(), // em centavos
  percentual: int("percentual").default(0), // percentual do valor da festa (0-100)
  ativo: int("ativo").default(1).notNull(), // 0 ou 1 (boolean)
  ordem: int("ordem").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustoVariavel = typeof custosVariaveis.$inferSelect;
export type InsertCustoVariavel = typeof custosVariaveis.$inferInsert;

/**
 * Tabela de custos fixos mensais
 */
export const custosFixos = mysqlTable("custosFixos", {
  id: int("id").autoincrement().primaryKey(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  valor: int("valor").notNull(), // em centavos
  mesReferencia: timestamp("mesReferencia").notNull(), // mês de referência do custo
  ativo: int("ativo").default(1).notNull(), // 0 ou 1 (boolean)
  ordem: int("ordem").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustoFixo = typeof custosFixos.$inferSelect;
export type InsertCustoFixo = typeof custosFixos.$inferInsert;