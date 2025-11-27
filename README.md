# Festeja Kids 2.0

Sistema completo de gestão para buffet infantil, desenvolvido com React 19, TypeScript, tRPC, Express e MySQL.

## 📋 Sobre o Projeto

O Festeja Kids 2.0 é um sistema de gerenciamento completo para buffets infantis que permite controlar todo o ciclo de vida de uma festa, desde a visitação inicial até o fechamento financeiro.

## ✨ Funcionalidades Principais

### 🎉 Gestão de Festas
- **Listagem de Festas**: Visualização completa de todas as festas cadastradas com filtros por status
- **Cadastro de Festas**: Formulário completo com Ficha de Contrato e Ficha de Degustação
  - **Ficha de Contrato**: CPF, Email, Endereço, Datas, Horário, Convidados, Tema, Aniversariante
  - **Ficha de Degustação**: Brinde, Refeição, Tipo de Massa, Tipo de Molho, Bolo
- **Edição de Festas**: Atualização completa de todos os dados da festa
- **Código Automático**: Geração automática de código único para cada festa

### 👥 Gestão de Clientes
- Cadastro completo de clientes
- Histórico de festas por cliente
- Controle de CPF e dados de contato

### 📅 Visitações
- Registro de visitações com 5 status possíveis:
  - **Aguardando**: Visitação agendada
  - **Fechou Pré-Contrato**: Cliente fechou pré-contrato
  - **Fechou Contrato**: Cliente fechou contrato definitivo
  - **Tem Interesse**: Cliente demonstrou interesse
  - **Faltou**: Cliente não compareceu
  - **Remarcar**: Visitação precisa ser remarcada
- Conversão de visitações em clientes
- Ficha de Contrato e Degustação para visitações

### 💰 Gestão Financeira
- **Pagamentos**: Registro de parcelas e pagamentos
- **Custos Fixos**: Controle de custos mensais fixos
- **Custos Variáveis**: Custos específicos por festa
- **Dashboard Financeiro**: Visão geral de faturamento, saldo a receber e ticket médio

### 📊 Relatórios e Dashboard
- Dashboard com métricas principais
- Taxa de conversão de visitações
- Festas agendadas vs realizadas
- Resumo financeiro completo

### 👤 Gestão de Usuários
- Sistema de autenticação com Manus OAuth
- Controle de permissões (Admin/Usuário)
- Gerenciamento de usuários

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19**: Framework JavaScript
- **TypeScript**: Tipagem estática
- **Tailwind CSS 4**: Estilização
- **shadcn/ui**: Componentes UI
- **tRPC**: Type-safe API calls
- **Wouter**: Roteamento
- **React Query**: Gerenciamento de estado

### Backend
- **Express 4**: Framework Node.js
- **tRPC 11**: Type-safe API
- **Drizzle ORM**: ORM TypeScript-first
- **MySQL/TiDB**: Banco de dados
- **Superjson**: Serialização de dados

### Autenticação
- **Manus OAuth**: Sistema de autenticação integrado
- **JWT**: Tokens de sessão

## 📦 Instalação

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
# As variáveis são injetadas automaticamente pelo sistema Manus

# Aplicar migrações do banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

## 🧪 Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test:watch
```

## 📁 Estrutura do Projeto

```
festeja-kids-2/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── contexts/      # Contextos React
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilitários e configurações
├── server/                # Backend Express + tRPC
│   ├── routers/          # Routers tRPC
│   ├── db.ts             # Funções de banco de dados
│   └── _core/            # Configurações do servidor
├── drizzle/              # Schema e migrações do banco
│   └── schema.ts         # Definição das tabelas
└── shared/               # Código compartilhado
```

## 🔄 Linha do Tempo do Projeto

### Fase 1: Estrutura Inicial (Concluída)
- ✅ Configuração do projeto com template tRPC + Manus Auth
- ✅ Configuração do banco de dados MySQL/TiDB
- ✅ Sistema de autenticação com Manus OAuth

### Fase 2: Módulos Principais (Concluída)
- ✅ Gestão de Clientes
- ✅ Gestão de Festas (CRUD completo)
- ✅ Gestão de Visitações
- ✅ Gestão Financeira (Pagamentos e Custos)

### Fase 3: Funcionalidades Avançadas (Concluída)
- ✅ Dashboard com métricas
- ✅ Ficha de Contrato e Degustação
- ✅ Sistema de status de visitações (5 estados)
- ✅ Edição completa de festas
- ✅ Código automático de festas

### Fase 4: Melhorias e Refinamentos (Em Andamento)
- ✅ Limpeza de dados de teste
- ✅ Atualização de documentação
- 🔄 Página de detalhes de festa
- 🔄 Filtros avançados
- 🔄 Geração de relatórios em PDF

## 🤝 Contribuindo

Este é um projeto privado. Para contribuir, entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Todos os direitos reservados © 2025 Festeja Kids

## 📞 Suporte

Para suporte técnico, entre em contato através do sistema Manus ou com a equipe de desenvolvimento.
