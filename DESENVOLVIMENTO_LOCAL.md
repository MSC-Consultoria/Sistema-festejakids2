# 🖥️ Guia de Desenvolvimento Local - Festeja Kids 2.0

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Inicial](#configuração-inicial)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Comandos Principais](#comandos-principais)
5. [IDEs Recomendadas](#ides-recomendadas)
6. [Workflow de Desenvolvimento](#workflow-de-desenvolvimento)
7. [Debugging](#debugging)
8. [Testes](#testes)
9. [Banco de Dados](#banco-de-dados)
10. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

### Software Necessário
- **Node.js**: 22.13.0 ou superior
- **pnpm**: 9.x ou superior
- **Git**: 2.x ou superior
- **MySQL**: 8.0 ou superior (ou acesso a TiDB remoto)

### Instalação do Node.js
```bash
# Via nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 22.13.0
nvm use 22.13.0

# Ou via site oficial
# https://nodejs.org/
```

### Instalação do pnpm
```bash
npm install -g pnpm
```

### Verificar Instalações
```bash
node --version    # v22.13.0
pnpm --version    # 9.x.x
git --version     # 2.x.x
```

---

## ⚙️ Configuração Inicial

### 1. Clonar o Repositório

**Via GitHub CLI (recomendado):**
```bash
gh repo clone MSC-Consultoria/Sistema-festejakids2
cd Sistema-festejakids2
```

**Via HTTPS:**
```bash
git clone https://github.com/MSC-Consultoria/Sistema-festejakids2.git
cd Sistema-festejakids2
```

**Via SSH:**
```bash
git clone git@github.com:MSC-Consultoria/Sistema-festejakids2.git
cd Sistema-festejakids2
```

### 2. Instalar Dependências

```bash
pnpm install
```

Isso instalará todas as dependências do projeto:
- **Backend**: Express, tRPC, Drizzle ORM, Zod
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/ui
- **Dev Tools**: Vitest, ESLint, Prettier

### 3. Configurar Variáveis de Ambiente

Criar arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Editar `.env` com suas credenciais:

```env
# ============================================
# BANCO DE DADOS
# ============================================
DATABASE_URL="mysql://usuario:senha@host:porta/database"

# Exemplo local:
# DATABASE_URL="mysql://root:senha@localhost:3306/festeja_kids"

# Exemplo TiDB Cloud:
# DATABASE_URL="mysql://usuario.root:senha@gateway01.sa-east-1.prod.aws.tidbcloud.com:4000/festeja_kids?ssl={"rejectUnauthorized":true}"

# ============================================
# AUTENTICAÇÃO
# ============================================
JWT_SECRET="sua-chave-secreta-muito-segura-aqui-min-32-chars"

# OAuth Manus (obter do dashboard Manus)
VITE_APP_ID="seu-app-id-aqui"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://oauth.manus.im"
OWNER_OPEN_ID="seu-open-id"
OWNER_NAME="Seu Nome"

# ============================================
# MANUS APIS
# ============================================
BUILT_IN_FORGE_API_URL="https://forge.manus.im"
BUILT_IN_FORGE_API_KEY="sua-api-key-backend"
VITE_FRONTEND_FORGE_API_KEY="sua-api-key-frontend"
VITE_FRONTEND_FORGE_API_URL="https://forge.manus.im"

# ============================================
# APLICAÇÃO
# ============================================
VITE_APP_TITLE="Festeja Kids 2.0"
VITE_APP_LOGO="/logo-festeja-kids.png"

# Analytics (opcional)
VITE_ANALYTICS_ENDPOINT="https://analytics.manus.im"
VITE_ANALYTICS_WEBSITE_ID="seu-website-id"
```

### 4. Configurar Banco de Dados

**Opção A: MySQL Local**
```bash
# Criar banco de dados
mysql -u root -p
CREATE DATABASE festeja_kids;
exit;

# Executar migrações
pnpm db:push
```

**Opção B: TiDB Cloud (Recomendado)**
1. Criar conta em https://tidbcloud.com
2. Criar cluster gratuito
3. Copiar string de conexão
4. Adicionar ao `.env` como `DATABASE_URL`
5. Executar `pnpm db:push`

### 5. Iniciar Servidor de Desenvolvimento

```bash
pnpm dev
```

O servidor iniciará em:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3000/api
- **tRPC**: http://localhost:3000/api/trpc

---

## 📁 Estrutura do Projeto

```
festeja-kids-2/
├── client/                      # Frontend React
│   ├── public/                  # Assets estáticos
│   │   └── logo-festeja-kids.png
│   ├── src/
│   │   ├── _core/              # Core do frontend (não editar)
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── ui/            # Shadcn/ui components
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── contexts/          # React contexts
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/             # Custom hooks
│   │   │   └── useMobile.ts
│   │   ├── lib/               # Bibliotecas
│   │   │   ├── trpc.ts        # Cliente tRPC
│   │   │   └── utils.ts       # Utilitários
│   │   ├── pages/             # Páginas da aplicação
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Festas.tsx
│   │   │   ├── NovaFesta.tsx
│   │   │   ├── Clientes.tsx
│   │   │   ├── Calendario.tsx
│   │   │   ├── Custos.tsx
│   │   │   ├── Financeiro.tsx
│   │   │   ├── Visitacoes.tsx
│   │   │   ├── Importacao.tsx
│   │   │   └── NotFound.tsx
│   │   ├── App.tsx            # Rotas e layout
│   │   ├── main.tsx           # Entry point
│   │   ├── index.css          # Estilos globais
│   │   └── const.ts           # Constantes
│   └── index.html
├── server/                      # Backend Express + tRPC
│   ├── _core/                  # Core do backend (não editar)
│   │   ├── context.ts
│   │   ├── cookies.ts
│   │   ├── env.ts
│   │   ├── imageGeneration.ts
│   │   ├── llm.ts
│   │   ├── map.ts
│   │   ├── notification.ts
│   │   ├── oauth.ts
│   │   ├── trpc.ts
│   │   └── voiceTranscription.ts
│   ├── routers/               # Routers tRPC
│   │   └── visitacoes.ts
│   ├── db.ts                  # Database helpers
│   ├── routers.ts             # Router principal
│   ├── roleMiddleware.ts      # Middleware de roles
│   ├── auth.logout.test.ts    # Testes de auth
│   ├── festas.test.ts         # Testes de festas
│   └── visitacoes.test.ts     # Testes de visitações
├── drizzle/                    # Banco de dados
│   ├── schema.ts              # Schema do banco
│   └── migrations/            # Migrações geradas
├── shared/                     # Código compartilhado
│   └── const.ts
├── storage/                    # Helpers de S3
│   └── index.ts
├── scripts/                    # Scripts de importação
│   └── ...
├── .env                        # Variáveis de ambiente (não commitar)
├── .env.example               # Template de .env
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── TIMELINE.md                # Este arquivo
├── DESENVOLVIMENTO_LOCAL.md  # Guia de desenvolvimento
└── README.md
```

---

## 🚀 Comandos Principais

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento (frontend + backend)
pnpm dev

# Apenas frontend
pnpm dev:client

# Apenas backend
pnpm dev:server
```

### Banco de Dados
```bash
# Aplicar migrações (gera e aplica automaticamente)
pnpm db:push

# Abrir Drizzle Studio (GUI para visualizar dados)
pnpm db:studio

# Gerar tipos TypeScript do schema
pnpm db:generate
```

### Testes
```bash
# Executar todos os testes
pnpm test

# Modo watch (re-executa ao salvar)
pnpm test:watch

# Testar arquivo específico
pnpm test visitacoes

# Cobertura de testes
pnpm test:coverage
```

### Build e Preview
```bash
# Build para produção
pnpm build

# Preview do build
pnpm preview
```

### Linting e Formatação
```bash
# Verificar código
pnpm lint

# Corrigir automaticamente
pnpm lint:fix

# Formatar com Prettier
pnpm format
```

### TypeScript
```bash
# Verificar tipos
pnpm typecheck
```

---

## 🛠️ IDEs Recomendadas

### Visual Studio Code (Recomendado)

**Extensões Essenciais:**
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "eamodio.gitlens",
    "usernamehw.errorlens",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

**Configuração** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/dist": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  }
}
```

**Atalhos Úteis:**
- `Ctrl+P` - Buscar arquivo
- `Ctrl+Shift+P` - Command Palette
- `Ctrl+` ` - Terminal
- `F12` - Ir para definição
- `Shift+F12` - Encontrar referências
- `Ctrl+Shift+F` - Buscar em todos os arquivos

### WebStorm / IntelliJ IDEA

**Configurações:**
1. Habilitar TypeScript service
2. Configurar Prettier como formatter
3. Habilitar ESLint
4. Configurar Node.js interpreter (22.13.0)

**Atalhos Úteis:**
- `Ctrl+Shift+N` - Buscar arquivo
- `Ctrl+Shift+A` - Buscar ação
- `Alt+F12` - Terminal
- `Ctrl+B` - Ir para definição
- `Ctrl+Alt+F7` - Encontrar usos

### Cursor / Windsurf (AI-powered)

**Vantagens:**
- Autocomplete inteligente com IA
- Geração de código contextual
- Refatoração assistida
- Chat integrado com contexto do projeto

---

## 🔄 Workflow de Desenvolvimento

### Estrutura de Branches

```
main                  # Produção (protegida)
├── develop           # Desenvolvimento
│   ├── feature/importacao-excel
│   ├── feature/gerenciamento-usuarios
│   ├── feature/graficos-dashboard
│   └── feature/area-cliente
└── hotfix/           # Correções urgentes
    └── hotfix/correcao-calculo-ticket
```

### Criar Nova Feature

```bash
# 1. Atualizar develop
git checkout develop
git pull origin develop

# 2. Criar branch da feature
git checkout -b feature/nome-da-feature

# 3. Desenvolver
# ... fazer alterações ...

# 4. Commitar (usar Conventional Commits)
git add .
git commit -m "feat: adiciona funcionalidade X"

# 5. Enviar para GitHub
git push origin feature/nome-da-feature

# 6. Criar Pull Request no GitHub
# 7. Após aprovação, merge para develop
```

### Conventional Commits

```bash
# Tipos de commit:
feat:     # Nova funcionalidade
fix:      # Correção de bug
docs:     # Documentação
style:    # Formatação (não afeta código)
refactor: # Refatoração
test:     # Adicionar testes
chore:    # Manutenção

# Exemplos:
git commit -m "feat: adiciona filtro de festas por período"
git commit -m "fix: corrige cálculo de ticket médio"
git commit -m "docs: atualiza README com instruções de deploy"
git commit -m "refactor: extrai lógica de validação para helper"
git commit -m "test: adiciona testes para router de visitações"
```

### Workflow Completo

```bash
# 1. Criar feature
git checkout -b feature/nova-funcionalidade

# 2. Desenvolver e testar
pnpm dev
# ... fazer alterações ...
pnpm test
pnpm lint

# 3. Commitar
git add .
git commit -m "feat: adiciona nova funcionalidade"

# 4. Push
git push origin feature/nova-funcionalidade

# 5. Criar Pull Request
# No GitHub: Compare & pull request

# 6. Code Review
# Aguardar aprovação

# 7. Merge
# Merge para develop

# 8. Deploy
# Periodicamente, merge develop -> main
```

---

## 🐛 Debugging

### Frontend (React)

**React DevTools:**
```bash
# Instalar extensão do navegador
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

**Console Debugging:**
```typescript
// Adicionar breakpoints com debugger
function MyComponent() {
  debugger; // Pausa execução aqui
  return <div>...</div>;
}

// Logs estruturados
console.log('Estado atual:', state);
console.table(data);
console.group('Grupo de logs');
console.log('Log 1');
console.log('Log 2');
console.groupEnd();
```

**VSCode Debugging:**
Criar `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Frontend",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/client/src"
    }
  ]
}
```

### Backend (Node.js)

**Console Debugging:**
```typescript
// Logs estruturados
console.log('[DB]', 'Fetching festas...');
console.error('[ERROR]', error);

// Inspecionar objetos
console.dir(objeto, { depth: null });
```

**VSCode Debugging:**
Adicionar ao `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["dev:server"],
  "skipFiles": ["<node_internals>/**"]
}
```

### tRPC Debugging

**Habilitar logs detalhados:**
```typescript
// client/src/lib/trpc.ts
const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});
```

---

## 🧪 Testes

### Estrutura de Testes

```typescript
// server/exemplo.test.ts
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("exemplo router", () => {
  it("deve fazer algo", async () => {
    // Arrange
    const ctx: TrpcContext = {
      user: { id: 1, role: "admin", ... },
      req: {} as any,
      res: {} as any,
    };
    const caller = appRouter.createCaller(ctx);

    // Act
    const result = await caller.exemplo.metodo();

    // Assert
    expect(result).toEqual({ success: true });
  });
});
```

### Executar Testes

```bash
# Todos os testes
pnpm test

# Arquivo específico
pnpm test visitacoes

# Modo watch
pnpm test:watch

# Com cobertura
pnpm test:coverage
```

### Boas Práticas

1. **Testar casos de sucesso e erro**
2. **Usar mocks para dependências externas**
3. **Nomear testes descritivamente**
4. **Manter testes independentes**
5. **Cobrir edge cases**

---

## 🗄️ Banco de Dados

### Drizzle ORM

**Criar nova tabela:**
```typescript
// drizzle/schema.ts
export const minhaTabela = mysqlTable("minha_tabela", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MinhaTabela = typeof minhaTabela.$inferSelect;
export type InsertMinhaTabela = typeof minhaTabela.$inferInsert;
```

**Aplicar migração:**
```bash
pnpm db:push
```

**Criar helpers:**
```typescript
// server/db.ts
export async function getMinhaTabela() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(minhaTabela);
}

export async function createMinhaTabela(data: InsertMinhaTabela) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(minhaTabela).values(data);
}
```

### Drizzle Studio

```bash
# Abrir GUI para visualizar/editar dados
pnpm db:studio
```

Acesse: http://localhost:4983

### Queries Diretas (SQL)

```typescript
// Evitar quando possível, preferir Drizzle ORM
import { sql } from "drizzle-orm";

const db = await getDb();
const result = await db.execute(sql`
  SELECT * FROM festas WHERE status = 'agendada'
`);
```

---

## 🔧 Troubleshooting

### Problema: Erro ao instalar dependências

**Sintoma:**
```
ERR_PNPM_FETCH_404
```

**Solução:**
```bash
# Limpar cache
pnpm store prune

# Reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Problema: Porta 3000 já em uso

**Sintoma:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solução:**
```bash
# Encontrar processo
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
PORT=3001 pnpm dev
```

### Problema: TypeScript errors

**Sintoma:**
```
error TS2307: Cannot find module
```

**Solução:**
```bash
# Reinstalar tipos
pnpm install --force

# Reiniciar TypeScript server (VSCode)
Ctrl+Shift+P > TypeScript: Restart TS Server
```

### Problema: Banco de dados não conecta

**Sintoma:**
```
Error: Access denied for user
```

**Solução:**
1. Verificar `DATABASE_URL` no `.env`
2. Testar conexão manual:
```bash
mysql -h host -u usuario -p database
```
3. Verificar firewall/SSL

### Problema: Hot reload não funciona

**Sintoma:**
Alterações não refletem no navegador

**Solução:**
```bash
# Limpar cache do Vite
rm -rf client/.vite

# Reiniciar servidor
pnpm dev
```

### Problema: Erro de CORS

**Sintoma:**
```
Access to fetch blocked by CORS policy
```

**Solução:**
Verificar configuração em `server/_core/index.ts`:
```typescript
app.use(cors({
  origin: process.env.VITE_APP_URL || 'http://localhost:3000',
  credentials: true,
}));
```

---

## 📚 Recursos Adicionais

### Documentação Oficial
- **tRPC**: https://trpc.io/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **Tailwind CSS**: https://tailwindcss.com
- **React**: https://react.dev
- **Shadcn/ui**: https://ui.shadcn.com
- **Vitest**: https://vitest.dev

### Comunidades
- **Discord tRPC**: https://trpc.io/discord
- **GitHub Discussions**: Use para dúvidas do projeto

### Tutoriais
- **tRPC + React**: https://trpc.io/docs/quickstart
- **Drizzle ORM**: https://orm.drizzle.team/docs/quick-start
- **Tailwind CSS**: https://tailwindcss.com/docs/installation

---

## ✅ Checklist de Configuração

- [ ] Node.js 22.13.0 instalado
- [ ] pnpm instalado
- [ ] Repositório clonado
- [ ] Dependências instaladas (`pnpm install`)
- [ ] Arquivo `.env` configurado
- [ ] Banco de dados configurado
- [ ] Migrações aplicadas (`pnpm db:push`)
- [ ] Servidor iniciado (`pnpm dev`)
- [ ] Testes passando (`pnpm test`)
- [ ] IDE configurada com extensões
- [ ] Git configurado

---

**Desenvolvido com ❤️ para Festeja Kids**  
**Última Atualização:** 24 de novembro de 2025
