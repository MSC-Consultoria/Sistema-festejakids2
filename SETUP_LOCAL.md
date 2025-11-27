# 🚀 Guia de Setup Local - Festeja Kids 2.0

## 📋 Pré-requisitos

### Software Necessário

1. **Node.js 22.x ou superior**
   - Download: https://nodejs.org/
   - Verificar instalação: `node --version`

2. **pnpm (Package Manager)**
   - Instalar globalmente: `npm install -g pnpm`
   - Verificar instalação: `pnpm --version`

3. **Git**
   - Download: https://git-scm.com/download/win
   - Verificar instalação: `git --version`

4. **Editor de Código (Recomendado)**
   - Visual Studio Code: https://code.visualstudio.com/

---

## 📥 Clonando o Repositório

### Opção 1: Via HTTPS
```bash
git clone https://github.com/MSC-Consultoria/Sistema-festejakids2.git
cd Sistema-festejakids2
```

### Opção 2: Via SSH (requer configuração de chave SSH)
```bash
git clone git@github.com:MSC-Consultoria/Sistema-festejakids2.git
cd Sistema-festejakids2
```

---

## ⚙️ Configuração do Ambiente

### 1. Instalar Dependências

```bash
pnpm install
```

Este comando irá instalar todas as dependências do projeto (frontend e backend).

### 2. Configurar Variáveis de Ambiente

O projeto usa variáveis de ambiente gerenciadas pela plataforma Manus. As seguintes variáveis já estão configuradas automaticamente:

**Variáveis do Sistema (Pré-configuradas):**
- `DATABASE_URL` - Conexão com banco de dados TiDB
- `JWT_SECRET` - Segredo para tokens JWT
- `VITE_APP_ID` - ID da aplicação Manus
- `OAUTH_SERVER_URL` - URL do servidor OAuth
- `VITE_OAUTH_PORTAL_URL` - URL do portal OAuth
- `OWNER_OPEN_ID` - OpenID do proprietário
- `OWNER_NAME` - Nome do proprietário
- `VITE_APP_TITLE` - Título da aplicação
- `VITE_APP_LOGO` - Logo da aplicação
- `BUILT_IN_FORGE_API_URL` - URL das APIs internas (backend)
- `BUILT_IN_FORGE_API_KEY` - Token das APIs internas (backend)
- `VITE_FRONTEND_FORGE_API_URL` - URL das APIs internas (frontend)
- `VITE_FRONTEND_FORGE_API_KEY` - Token das APIs internas (frontend)

**Para Desenvolvimento Local:**

Ao rodar localmente, o sistema se conecta automaticamente ao banco de dados e serviços da plataforma Manus. **Não é necessário criar arquivo `.env` manualmente**.

Se você baixou o projeto como ZIP da plataforma Manus, ele já vem com um arquivo `.env` pré-configurado com todas as variáveis necessárias.

### 3. Aplicar Migrações do Banco de Dados

```bash
pnpm db:push
```

Este comando aplica todas as migrações pendentes no banco de dados.

---

## 🏃 Executando o Projeto

### Modo Desenvolvimento

```bash
pnpm dev
```

O servidor será iniciado em:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

### Modo Produção

```bash
# Build do projeto
pnpm build

# Iniciar servidor de produção
pnpm start
```

---

## 🧪 Executando Testes

### Todos os Testes
```bash
pnpm test
```

### Testes Específicos
```bash
pnpm test festas.test.ts
pnpm test visitacoes.test.ts
```

### Testes em Modo Watch
```bash
pnpm test --watch
```

---

## 🗄️ Gerenciamento do Banco de Dados

### Aplicar Mudanças no Schema
```bash
pnpm db:push
```

### Gerar Migrações
```bash
pnpm drizzle-kit generate
```

### Aplicar Migrações
```bash
pnpm drizzle-kit migrate
```

### Abrir Drizzle Studio (Interface Visual)
```bash
pnpm drizzle-kit studio
```

---

## 🔧 Troubleshooting (Windows 10)

### Problema: "pnpm não é reconhecido como comando"

**Solução:**
1. Reinstalar pnpm globalmente:
   ```bash
   npm install -g pnpm
   ```
2. Reiniciar o terminal
3. Verificar instalação: `pnpm --version`

### Problema: "Erro de permissão ao executar scripts"

**Solução:**
1. Abrir PowerShell como Administrador
2. Executar:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Confirmar com `Y`

### Problema: "Porta 3000 ou 5173 já está em uso"

**Solução:**
1. Identificar processo usando a porta:
   ```bash
   netstat -ano | findstr :3000
   ```
2. Matar o processo:
   ```bash
   taskkill /PID <PID> /F
   ```

### Problema: "Erro de conexão com banco de dados"

**Solução:**
1. Verificar se `DATABASE_URL` está configurado corretamente
2. Testar conexão:
   ```bash
   pnpm db:push
   ```
3. Se o erro persistir, verificar se o banco TiDB está acessível

### Problema: "Module not found" ou "Cannot find module"

**Solução:**
1. Limpar cache do pnpm:
   ```bash
   pnpm store prune
   ```
2. Reinstalar dependências:
   ```bash
   rm -rf node_modules
   pnpm install
   ```

### Problema: "TypeScript errors" ao executar

**Solução:**
1. Verificar erros de tipo:
   ```bash
   pnpm tsc --noEmit
   ```
2. Corrigir erros apontados
3. Reiniciar servidor

---

## 📁 Estrutura de Pastas

```
festeja-kids-2/
├── client/                 # Frontend React
│   ├── public/            # Assets estáticos
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── lib/           # Utilitários e configurações
│   │   └── hooks/         # Custom hooks
│   └── index.html
├── server/                 # Backend Express + tRPC
│   ├── _core/             # Core do servidor (não editar)
│   ├── routers/           # Routers tRPC (festas, clientes, etc.)
│   └── db.ts              # Helpers de banco de dados
├── drizzle/               # Schema e migrações do banco
│   └── schema.ts          # Definição de tabelas
├── shared/                # Código compartilhado
│   └── const.ts           # Constantes
└── package.json           # Dependências e scripts
```

---

## 🔑 Acessando o Sistema

### Primeiro Acesso

1. Acesse http://localhost:5173
2. Clique em "Entrar"
3. Faça login com sua conta Manus OAuth
4. Você será redirecionado para o Dashboard

### Usuários Administradores Padrão

Os seguintes emails têm acesso de administrador:
- recantodoacaienventosrj@gmail.com
- gabrielol2035@gmail.com

Para adicionar mais usuários, acesse a aba "Usuários" no menu lateral (disponível apenas para administradores).

---

## 📊 Importando Dados

### Via Interface Web

1. Acesse a aba "Importação" no menu lateral
2. Clique em "Selecionar Arquivo"
3. Escolha uma planilha Excel (.xlsx ou .xls)
4. Clique em "Importar Dados"
5. Aguarde o processamento

### Formato da Planilha

A planilha deve ter as seguintes colunas:

| Código | Cliente | Telefone | Data da Festa | Valor Total | Convidados |
|--------|---------|----------|---------------|-------------|------------|
| FK001  | Maria Silva | (11) 98765-4321 | 15/01/2026 | R$ 5.000,00 | 50 |

---

## 🚀 Deploy em Produção

O projeto está configurado para deploy automático na plataforma Manus:

1. Faça commit das suas alterações:
   ```bash
   git add .
   git commit -m "Descrição das alterações"
   git push origin main
   ```

2. Acesse a interface da plataforma Manus
3. Clique em "Publish" para fazer deploy

---

## 📞 Suporte

### Documentação
- README.md - Visão geral do projeto
- TIMELINE.md - Histórico de desenvolvimento
- Este arquivo (SETUP_LOCAL.md) - Guia de setup

### Contato
- Email: recantodoacaienventosrj@gmail.com
- GitHub Issues: https://github.com/MSC-Consultoria/Sistema-festejakids2/issues

### Recursos Úteis
- Documentação React: https://react.dev/
- Documentação tRPC: https://trpc.io/
- Documentação Drizzle ORM: https://orm.drizzle.team/
- Documentação Tailwind CSS: https://tailwindcss.com/

---

## ✅ Checklist de Setup

- [ ] Node.js 22.x instalado
- [ ] pnpm instalado globalmente
- [ ] Repositório clonado
- [ ] Dependências instaladas (`pnpm install`)
- [ ] Migrações aplicadas (`pnpm db:push`)
- [ ] Servidor rodando (`pnpm dev`)
- [ ] Acesso ao sistema via http://localhost:5173
- [ ] Login realizado com sucesso
- [ ] Dashboard carregando corretamente

---

**Desenvolvido com ❤️ para Festeja Kids**
**Última Atualização:** 27/11/2025
