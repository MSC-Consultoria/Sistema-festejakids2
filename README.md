# Festeja Kids 2.0

Sistema completo de gestão de festas infantis com controle de visitações, contratos, pagamentos, custos e relatórios financeiros.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Progresso](https://img.shields.io/badge/progresso-69%25-blue)
![Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.0-green)

---

## 📋 Sobre o Projeto

O **Festeja Kids 2.0** é uma plataforma moderna desenvolvida para empresas de festas infantis gerenciarem todo o ciclo de vida de seus eventos, desde a captação de leads (visitações) até o controle financeiro completo.

### Principais Funcionalidades

- ✅ **Gestão de Festas** - Cadastro, edição, calendário e agenda
- ✅ **Gestão de Clientes** - Cadastro completo com histórico
- ✅ **Visitações (Leads)** - Funil de conversão e acompanhamento
- ✅ **Controle Financeiro** - Pagamentos, custos e projeções
- ✅ **Geração de Contratos** - PDF automático com histórico de versões
- ✅ **Relatórios e Analytics** - Dashboard com gráficos e métricas
- ✅ **Importação de Dados** - Upload de planilhas Excel
- ✅ **Gestão de Usuários** - 4 níveis de acesso (Admin, Gerente, Atendente, Cliente)

---

## 🚀 Tecnologias

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **tRPC Client** - API calls type-safe
- **Wouter** - Routing
- **shadcn/ui** - Componentes UI
- **Recharts** - Gráficos

### Backend
- **Node.js 22** - Runtime
- **Express 4** - Web framework
- **tRPC 11** - API type-safe
- **Drizzle ORM** - Database ORM
- **Superjson** - Serialização

### Infraestrutura
- **Manus Platform** - Hospedagem e deployment
- **TiDB Cloud** - Banco de dados MySQL
- **S3 Storage** - Armazenamento de arquivos
- **Manus OAuth 2.0** - Autenticação

---

## 📊 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| **Progresso Geral** | 69.04% (272/394 tarefas) |
| **Fases Concluídas** | 21 de 22 |
| **Linhas de Código** | 8.617 linhas (frontend) |
| **Endpoints API** | 56 endpoints tRPC |
| **Tabelas do Banco** | 9 tabelas (109 colunas) |
| **Páginas** | 23 páginas React |
| **Testes** | 12+ testes unitários |

---

## 📚 Documentação

### Documentos Disponíveis

- **[DOCUMENTACAO_COMPLETA_FESTEJA_KIDS_2.json](docs/DOCUMENTACAO_COMPLETA_FESTEJA_KIDS_2.json)** (106 KB)
- **[API_FESTEJA_KIDS_2_COMPLETA.json](docs/API_FESTEJA_KIDS_2_COMPLETA.json)** (71 KB)
- **[openapi_festeja_kids_2.json](docs/openapi_festeja_kids_2.json)** (59 KB)
- **[ESTADO_ATUAL_DO_PROJETO.md](docs/ESTADO_ATUAL_DO_PROJETO.md)**
- **[ROADMAP.md](docs/ROADMAP.md)**

---

## 🚀 Como Executar

```bash
# Clonar repositório
git clone https://github.com/MSC-Consultoria/Sistema-festejakids2.git
cd Sistema-festejakids2

# Instalar dependências
pnpm install

# Aplicar schema do banco
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

---

## 📈 Roadmap

Veja o [ROADMAP completo](docs/ROADMAP.md) para detalhes.

---

**Última Atualização:** 27 de Novembro de 2025  
**Versão:** 1.0.0  
**Status:** Em Desenvolvimento (69% concluído)
