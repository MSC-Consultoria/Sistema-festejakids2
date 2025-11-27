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
  role: mysqlEnum("role", ["admin", "gerente", "atendente", "cliente"]).default("cliente").notNull(),
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
 * Tabela de visitações (leads)
 * Suporta Ficha de Contrato e Ficha de Degustação
 */
export const visitacoes = mysqlTable("visitacoes", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  cpf: varchar("cpf", { length: 14 }),
  endereco: text("endereco"),
  dataVisita: timestamp("dataVisita").notNull(),
  dataPretendida: timestamp("dataPretendida"), // Data pretendida para o evento
  horario: varchar("horario", { length: 50 }), // Horario da visita/evento
  interesse: text("interesse"), // Tipo de festa, tema, etc
  tema: varchar("tema", { length: 255 }), // Tema escolhido ou pretendido
  numeroConvidados: int("numeroConvidados"), // Quantidade de convidados
  brinde: varchar("brinde", { length: 255 }), // Tipo de brinde (acai, sorvete, etc)
  refeicao: text("refeicao"), // Descricao da refeicao
  massaType: varchar("massaType", { length: 100 }), // Tipo de massa (pene, fusilli, etc)
  molhoType: varchar("molhoType", { length: 100 }), // Tipo de molho (bolonhesa, calabresa, etc)
  bolo: text("bolo"), // Descricao do bolo
  nomeAniversariante: varchar("nomeAniversariante", { length: 255 }), // Nome do aniversariante
  idadeAniversariante: int("idadeAniversariante"), // Idade do aniversariante
  status: mysqlEnum("status", ["aguardando", "fechou_pre_contrato", "fechou_contrato", "tem_interesse", "faltou", "remarcar"]).default("aguardando").notNull(),
  observacoes: text("observacoes"),
  clienteId: int("clienteId"), // ID do cliente se foi convertido
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Visitacao = typeof visitacoes.$inferSelect;
export type InsertVisitacao = typeof visitacoes.$inferInsert;

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
  numeroConvidados: int("numeroConvidados"),
  tema: varchar("tema", { length: 255 }),
  horario: varchar("horario", { length: 50 }),
  // Campos da Ficha de Contrato
  cpfCliente: varchar("cpfCliente", { length: 14 }),
  endereco: text("endereco"),
  brinde: varchar("brinde", { length: 255 }),
  refeicao: text("refeicao"),
  massaType: varchar("massaType", { length: 100 }),
  molhoType: varchar("molhoType", { length: 100 }),
  bolo: text("bolo"),
  nomeAniversariante: varchar("nomeAniversariante", { length: 255 }),
  idadeAniversariante: int("idadeAniversariante"),
  status: mysqlEnum("status", ["agendada", "realizada", "cancelada"]).default("agendada").notNull(),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Festa = typeof festas.$inferSelect;
export type InsertFesta = typeof festas.$inferInsert;

/**
 * Tabela de pagamentos
 * Suporta pagamentos com ou sem festa associada (para associação manual posterior)
 */
export const pagamentos = mysqlTable("pagamentos", {
  id: int("id").autoincrement().primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(), // PADDMMAA-XXX
  festaId: int("festaId"), // Opcional - pode ser associado depois
  valor: int("valor").notNull(), // em centavos
  dataPagamento: timestamp("dataPagamento").notNull(),
  metodoPagamento: varchar("metodoPagamento", { length: 50 }),
  pagador: varchar("pagador", { length: 255 }), // Nome do pagador
  comprovanteUrl: text("comprovanteUrl"), // URL do comprovante no S3
  comprovanteFileKey: varchar("comprovanteFileKey", { length: 255 }), // Chave do arquivo no S3
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


/**
 * Tabela de histórico de contratos gerados
 * Armazena todas as versões de contratos gerados para cada festa
 */
export const contratosGerados = mysqlTable("contratos_gerados", {
  id: int("id").autoincrement().primaryKey(),
  festaId: int("festaId").notNull(), // ID da festa
  url: text("url").notNull(), // URL do contrato no S3
  fileKey: varchar("fileKey", { length: 255 }).notNull(), // Chave do arquivo no S3
  versao: int("versao").default(1).notNull(), // Versão do contrato (1, 2, 3...)
  geradoPor: int("geradoPor"), // ID do usuário que gerou
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContratoGerado = typeof contratosGerados.$inferSelect;
export type InsertContratoGerado = typeof contratosGerados.$inferInsert;

/**
 * Tabela de templates de contrato
 * Permite editar textos padrão do contrato sem modificar código
 */
export const templatesContrato = mysqlTable("templates_contrato", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(), // Nome do template (ex: "Padrão", "Premium")
  ativo: int("ativo").default(1).notNull(), // 0 ou 1 (boolean)
  
  // Textos editáveis do contrato
  servicosIncluidos: text("servicosIncluidos"), // Lista de serviços incluídos
  buffetAdulto: text("buffetAdulto"), // Descrição do buffet adulto
  buffetInfantil: text("buffetInfantil"), // Descrição do buffet infantil
  brindes: text("brindes"), // Descrição dos brindes
  observacoesGerais: text("observacoesGerais"), // Observações gerais do contrato
  dadosBancarios: text("dadosBancarios"), // Dados bancários para pagamento
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TemplateContrato = typeof templatesContrato.$inferSelect;
export type InsertTemplateContrato = typeof templatesContrato.$inferInsert;
