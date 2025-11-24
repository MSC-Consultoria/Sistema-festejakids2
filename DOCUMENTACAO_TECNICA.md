# 📚 Documentação Técnica - Festeja Kids 2.0

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Banco de Dados](#banco-de-dados)
5. [API (tRPC)](#api-trpc)
6. [Autenticação e Autorização](#autenticação-e-autorização)
7. [Frontend](#frontend)
8. [Integrações](#integrações)
9. [Segurança](#segurança)
10. [Performance](#performance)

---

## 🎯 Visão Geral

**Festeja Kids 2.0** é um sistema completo de gestão para empresas de festas infantis, desenvolvido com tecnologias modernas e type-safe.

### Funcionalidades Principais
- ✅ Gestão de festas (agendamento, acompanhamento, histórico)
- ✅ Cadastro e gerenciamento de clientes
- ✅ Controle financeiro (pagamentos, recebimentos, projeções)
- ✅ Gestão de custos (variáveis e fixos)
- ✅ Sistema de visitações (leads e conversão)
- ✅ Calendário e agenda visual
- ✅ Relatórios e dashboards
- ✅ Sistema de roles (Admin, Gerente, Atendente, Cliente)
- ✅ Importação de dados (interface pronta)

### Objetivos
1. **Centralizar** todas as operações em uma única plataforma
2. **Automatizar** processos manuais e cálculos
3. **Visualizar** métricas e KPIs em tempo real
4. **Escalar** conforme o crescimento do negócio

---

## 🏗️ Arquitetura

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   React    │  │  Tailwind  │  │ Shadcn/ui  │        │
│  │    19      │  │   CSS 4    │  │ Components │        │
│  └────────────┘  └────────────┘  └────────────┘        │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTP/WebSocket
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  SERVIDOR (Node.js)                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Express 4 + tRPC 11                   │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │ │
│  │  │  OAuth   │  │  Routers │  │   Auth   │        │ │
│  │  │  Manus   │  │   tRPC   │  │   JWT    │        │ │
│  │  └──────────┘  └──────────┘  └──────────┘        │ │
│  └────────────────────────────────────────────────────┘ │
│                          │                               │
│                          │ SQL                           │
│                          ▼                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Drizzle ORM 0.44.6                    │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          │ MySQL Protocol
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  BANCO DE DADOS                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │              MySQL 8.0 / TiDB Cloud                │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │ │
│  │  │  users   │  │  festas  │  │ clientes │        │ │
│  │  │visitacoes│  │pagamentos│  │  custos  │        │ │
│  │  └──────────┘  └──────────┘  └──────────┘        │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Fluxo de Requisição

```
1. Usuário interage com UI (React)
   ↓
2. Componente chama hook tRPC (trpc.festas.list.useQuery())
   ↓
3. tRPC Client serializa request (Superjson)
   ↓
4. HTTP POST /api/trpc/festas.list
   ↓
5. Express recebe request
   ↓
6. tRPC Server deserializa e valida (Zod)
   ↓
7. Middleware de autenticação verifica JWT
   ↓
8. Middleware de autorização verifica role
   ↓
9. Procedure executa lógica de negócio
   ↓
10. Helper de DB consulta Drizzle ORM
   ↓
11. Drizzle executa query SQL
   ↓
12. MySQL/TiDB retorna dados
   ↓
13. Drizzle mapeia para tipos TypeScript
   ↓
14. Procedure retorna dados
   ↓
15. tRPC Server serializa response (Superjson)
   ↓
16. HTTP 200 OK com JSON
   ↓
17. tRPC Client deserializa
   ↓
18. React atualiza UI
```

---

## 💻 Stack Tecnológico

### Backend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Node.js** | 22.13.0 | Runtime JavaScript |
| **TypeScript** | 5.x | Type safety |
| **Express** | 4.x | Web framework |
| **tRPC** | 11.x | Type-safe API |
| **Drizzle ORM** | 0.44.6 | Database ORM |
| **Zod** | 3.x | Schema validation |
| **Superjson** | 2.x | Serialização avançada |
| **Vitest** | 1.x | Testing framework |

### Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 19.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling |
| **Shadcn/ui** | Latest | Component library |
| **Wouter** | 3.x | Routing |
| **Lucide React** | Latest | Icons |
| **Sonner** | Latest | Toast notifications |
| **@tanstack/react-query** | 5.x | Data fetching (via tRPC) |

### Banco de Dados

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **MySQL** | 8.0+ | Banco relacional |
| **TiDB Cloud** | Latest | MySQL-compatible cloud DB |

### Ferramentas

| Ferramenta | Versão | Propósito |
|------------|--------|-----------|
| **pnpm** | 9.x | Package manager |
| **Vite** | 5.x | Build tool |
| **ESLint** | 9.x | Linting |
| **Prettier** | 3.x | Code formatting |

---

## 🗄️ Banco de Dados

### Schema Completo

```typescript
// drizzle/schema.ts

// Tabela de usuários (autenticação)
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "gerente", "atendente", "cliente"])
    .default("cliente")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// Tabela de clientes
export const clientes = mysqlTable("clientes", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  cpf: varchar("cpf", { length: 14 }),
  endereco: text("endereco"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Tabela de visitações (leads)
export const visitacoes = mysqlTable("visitacoes", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  dataVisita: timestamp("dataVisita").notNull(),
  interesse: text("interesse"),
  status: mysqlEnum("status", [
    "visitou",
    "aguardando",
    "proposta_enviada",
    "fechado",
    "perdido"
  ]).default("visitou").notNull(),
  observacoes: text("observacoes"),
  clienteId: int("clienteId"), // ID do cliente se convertido
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Tabela de festas
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
  status: mysqlEnum("status", ["agendada", "realizada", "cancelada"])
    .default("agendada")
    .notNull(),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Tabela de pagamentos
export const pagamentos = mysqlTable("pagamentos", {
  id: int("id").autoincrement().primaryKey(),
  festaId: int("festaId").notNull(),
  dataPagamento: timestamp("dataPagamento").notNull(),
  valor: int("valor").notNull(), // em centavos
  formaPagamento: varchar("formaPagamento", { length: 50 }),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Tabela de custos variáveis
export const custosVariaveis = mysqlTable("custos_variaveis", {
  id: int("id").autoincrement().primaryKey(),
  festaId: int("festaId").notNull(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  valor: int("valor").notNull(), // em centavos
  categoria: varchar("categoria", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Tabela de custos fixos
export const custosFixos = mysqlTable("custos_fixos", {
  id: int("id").autoincrement().primaryKey(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  valor: int("valor").notNull(), // em centavos
  mesReferencia: varchar("mesReferencia", { length: 7 }), // YYYY-MM
  categoria: varchar("categoria", { length: 100 }),
  recorrente: int("recorrente").default(0).notNull(), // 0 ou 1 (boolean)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
```

### Relacionamentos

```
users (1) ──────────────────────────────────┐
                                             │
clientes (1) ────┬─── (N) festas            │
                 │                           │
                 └─── (1) visitacoes         │
                                             │
festas (1) ──────┬─── (N) pagamentos        │
                 │                           │
                 └─── (N) custosVariaveis    │
                                             │
custosFixos (independente)                   │
                                             │
visitacoes ──────────────────────────────────┘
```

### Índices e Performance

```sql
-- Índices automáticos (primary keys)
PRIMARY KEY (id) em todas as tabelas

-- Índices únicos
UNIQUE (codigo) em festas
UNIQUE (openId) em users

-- Índices recomendados (adicionar se necessário)
INDEX idx_festas_cliente (clienteId)
INDEX idx_festas_data (dataFesta)
INDEX idx_festas_status (status)
INDEX idx_pagamentos_festa (festaId)
INDEX idx_visitacoes_status (status)
INDEX idx_visitacoes_cliente (clienteId)
```

---

## 🔌 API (tRPC)

### Estrutura de Routers

```typescript
// server/routers.ts
export const appRouter = router({
  auth: router({
    me: publicProcedure.query(),
    logout: publicProcedure.mutation(),
  }),
  
  festas: router({
    list: protectedProcedure.query(),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(),
    create: protectedProcedure.input(createFestaSchema).mutation(),
    update: protectedProcedure.input(updateFestaSchema).mutation(),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(),
    stats: protectedProcedure.query(),
  }),
  
  clientes: router({
    list: protectedProcedure.query(),
    create: protectedProcedure.input(createClienteSchema).mutation(),
    // ...
  }),
  
  visitacoes: router({
    list: protectedProcedure.query(),
    create: protectedProcedure.input(createVisitacaoSchema).mutation(),
    converterEmCliente: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(),
    stats: protectedProcedure.query(),
    // ...
  }),
  
  // ... outros routers
});

export type AppRouter = typeof appRouter;
```

### Exemplo de Procedure

```typescript
// server/routers/festas.ts
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getAllFestas, createFesta } from "../db";

const createFestaSchema = z.object({
  clienteId: z.number(),
  dataFechamento: z.date(),
  dataFesta: z.date(),
  valorTotal: z.number().positive(),
  numeroConvidados: z.number().positive(),
  tema: z.string().optional(),
  horario: z.string().optional(),
  observacoes: z.string().optional(),
});

export const festasRouter = router({
  list: protectedProcedure.query(async () => {
    return await getAllFestas();
  }),
  
  create: protectedProcedure
    .input(createFestaSchema)
    .mutation(async ({ input }) => {
      // Gerar código único
      const codigo = generateCodigo();
      
      // Criar festa
      await createFesta({
        ...input,
        codigo,
        valorPago: 0,
        status: "agendada",
      });
      
      return { success: true, codigo };
    }),
});
```

### Uso no Frontend

```typescript
// client/src/pages/Festas.tsx
import { trpc } from "@/lib/trpc";

export default function Festas() {
  // Query
  const { data: festas, isLoading } = trpc.festas.list.useQuery();
  
  // Mutation
  const createMutation = trpc.festas.create.useMutation({
    onSuccess: () => {
      toast.success("Festa criada com sucesso!");
      // Invalidar cache para recarregar lista
      trpc.useUtils().festas.list.invalidate();
    },
  });
  
  const handleCreate = (data) => {
    createMutation.mutate(data);
  };
  
  if (isLoading) return <div>Carregando...</div>;
  
  return (
    <div>
      {festas.map(festa => (
        <div key={festa.id}>{festa.codigo}</div>
      ))}
    </div>
  );
}
```

---

## 🔐 Autenticação e Autorização

### Fluxo de Autenticação (OAuth Manus)

```
1. Usuário clica em "Entrar"
   ↓
2. Redirecionamento para Manus OAuth Portal
   ↓
3. Usuário faz login (Google, etc)
   ↓
4. Manus redireciona para /api/oauth/callback?code=XXX
   ↓
5. Backend troca code por access token
   ↓
6. Backend busca dados do usuário
   ↓
7. Backend cria/atualiza usuário no DB
   ↓
8. Backend gera JWT e seta cookie
   ↓
9. Redirecionamento para /
   ↓
10. Frontend lê cookie e exibe usuário logado
```

### Middleware de Autenticação

```typescript
// server/_core/trpc.ts
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Você precisa estar autenticado",
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
```

### Middleware de Autorização (Roles)

```typescript
// server/_core/roleMiddleware.ts
export const requireAdmin = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Apenas administradores podem acessar",
    });
  }
  
  return next({ ctx });
});

export const adminProcedure = protectedProcedure.use(requireAdmin);
```

### Hierarquia de Roles

```
admin
  ├── Acesso total ao sistema
  ├── Gerenciar usuários
  ├── Configurações avançadas
  └── Todas as funcionalidades de gerente

gerente
  ├── Dashboard completo
  ├── Festas, Clientes, Custos
  ├── Financeiro, Relatórios
  ├── Visitações, Importação
  └── Todas as funcionalidades de atendente

atendente
  ├── Nova Festa
  ├── Novo Pagamento
  ├── Agenda
  └── Visitações

cliente (futura)
  ├── Minhas Festas
  └── Meus Pagamentos
```

---

## 🎨 Frontend

### Arquitetura de Componentes

```
App.tsx (Rotas)
├── DashboardLayout (Layout comum)
│   ├── Sidebar (Menu lateral)
│   ├── Header (Cabeçalho)
│   └── Content (Conteúdo da página)
│       ├── Dashboard
│       ├── Festas
│       ├── NovaFesta
│       ├── Clientes
│       ├── Calendario
│       ├── Custos
│       ├── Financeiro
│       ├── Visitacoes
│       └── Importacao
└── NotFound (404)
```

### Padrões de Componentes

**1. Página com Listagem:**
```typescript
export default function Festas() {
  const { data, isLoading } = trpc.festas.list.useQuery();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Festas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as festas
          </p>
        </div>
        
        <DataTable data={data} columns={columns} />
      </div>
    </DashboardLayout>
  );
}
```

**2. Formulário com Mutation:**
```typescript
export default function NovaFesta() {
  const createMutation = trpc.festas.create.useMutation({
    onSuccess: () => {
      toast.success("Festa criada!");
      navigate("/festas");
    },
  });
  
  const onSubmit = (data) => {
    createMutation.mutate(data);
  };
  
  return (
    <DashboardLayout>
      <Form onSubmit={onSubmit}>
        {/* campos */}
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </Form>
    </DashboardLayout>
  );
}
```

### Gerenciamento de Estado

**1. Estado do Servidor (tRPC + React Query):**
```typescript
// Dados do servidor são gerenciados automaticamente
const { data, isLoading, error } = trpc.festas.list.useQuery();
```

**2. Estado Local (useState):**
```typescript
// Estado da UI (modals, forms, etc)
const [isOpen, setIsOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
```

**3. Estado Global (Context):**
```typescript
// Tema, autenticação, etc
const { user } = useAuth();
const { theme, toggleTheme } = useTheme();
```

### Estilização (Tailwind CSS 4)

**Cores da Identidade Visual:**
```css
/* client/src/index.css */
:root {
  --chart-1: oklch(0.75 0.20 30);   /* Vermelho */
  --chart-2: oklch(0.80 0.18 90);   /* Amarelo */
  --chart-3: oklch(0.70 0.15 190);  /* Ciano */
  --chart-4: oklch(0.65 0.20 145);  /* Verde */
  --chart-5: oklch(0.60 0.25 320);  /* Magenta */
  --primary: oklch(0.65 0.25 320);  /* Magenta/Rosa */
}
```

**Uso:**
```tsx
<Card className="bg-chart-1 text-white">
  <CardHeader>Contratos Fechados</CardHeader>
  <CardContent>42</CardContent>
</Card>
```

---

## 🔗 Integrações

### Manus OAuth
- **Propósito**: Autenticação de usuários
- **Fluxo**: OAuth 2.0
- **Endpoint**: `https://api.manus.im`

### Manus Forge APIs
- **LLM**: Geração de texto com IA
- **Storage**: Upload de arquivos para S3
- **Notifications**: Notificações push
- **Maps**: Integração com Google Maps

---

## 🛡️ Segurança

### Boas Práticas Implementadas

1. **Validação de Input (Zod)**
   ```typescript
   const schema = z.object({
     email: z.string().email(),
     valor: z.number().positive(),
   });
   ```

2. **Sanitização de Dados**
   - Drizzle ORM previne SQL Injection automaticamente
   - Zod valida tipos e formatos

3. **Autenticação JWT**
   - Tokens assinados com secret forte
   - Cookies httpOnly (não acessíveis via JS)
   - SameSite=None para CORS seguro

4. **Autorização por Role**
   - Middleware valida role antes de executar
   - Procedures protegidas por nível de acesso

5. **HTTPS**
   - Sempre usar HTTPS em produção
   - Cookies com flag `secure`

### Checklist de Segurança

- [x] Validação de input (Zod)
- [x] Proteção contra SQL Injection (Drizzle ORM)
- [x] Autenticação JWT
- [x] Autorização por role
- [x] Cookies httpOnly e secure
- [ ] Rate limiting (implementar)
- [ ] CSRF protection (implementar)
- [ ] Logs de auditoria (implementar)

---

## ⚡ Performance

### Otimizações Implementadas

1. **Code Splitting**
   - Lazy loading de páginas
   - Chunks separados por rota

2. **React Query (via tRPC)**
   - Cache automático de queries
   - Deduplicação de requests
   - Background refetch

3. **Drizzle ORM**
   - Queries otimizadas
   - Prepared statements
   - Connection pooling

4. **Tailwind CSS**
   - Purge de classes não utilizadas
   - Minificação automática

### Métricas de Performance

| Métrica | Valor Atual | Meta |
|---------|-------------|------|
| **First Contentful Paint** | ~1.2s | <1.5s |
| **Time to Interactive** | ~2.5s | <3.0s |
| **Lighthouse Score** | 85+ | 90+ |
| **Bundle Size (JS)** | ~250KB | <300KB |

---

## 📊 Monitoramento

### Logs

```typescript
// Backend
console.log('[DB]', 'Fetching festas...');
console.error('[ERROR]', error);

// Frontend
console.log('[tRPC]', 'Query festas.list');
```

### Métricas (Manus Analytics)

- Page views
- User sessions
- API calls
- Error rate

---

**Desenvolvido com ❤️ para Festeja Kids**  
**Última Atualização:** 24 de novembro de 2025
