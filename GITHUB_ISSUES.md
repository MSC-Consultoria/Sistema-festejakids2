# 📋 GitHub Issues - Festeja Kids 2.0

Lista completa de issues para criar no repositório GitHub.

---

## Issue #1: Backend de Importação de Dados Excel

**Labels**: `enhancement`, `backend`, `priority:high`

### 📤 Descrição
Implementar o backend para processar planilhas Excel e importar dados de festas e clientes.

### 🎯 Objetivo
Permitir que o usuário faça upload de planilhas Excel e importe dados em massa para o sistema.

### ✅ Tarefas
- [ ] Instalar biblioteca `xlsx` ou `exceljs`
- [ ] Criar endpoint tRPC `importacao.uploadFestas`
- [ ] Criar endpoint tRPC `importacao.uploadClientes`
- [ ] Implementar parser para planilhas de festas
- [ ] Implementar parser para planilhas de clientes
- [ ] Validar dados antes de inserir (Zod schema)
- [ ] Implementar preview de dados antes de confirmar importação
- [ ] Criar tabela de log de importações
- [ ] Adicionar tratamento de erros detalhado
- [ ] Criar testes unitários para parser

### 📋 Estrutura de Planilha Esperada

**Festas:**
```
Código | Cliente | Telefone | Data da Festa | Valor Total | Convidados | Tema
FK001  | Maria   | (11) ... | 15/01/2026    | R$ 5.000,00 | 50         | Frozen
```

**Clientes:**
```
Nome  | Telefone  | Email           | CPF           | Endereço
Maria | (11) ...  | maria@email.com | 123.456.789-00| Rua X, 123
```

### 🔧 Tecnologias
- `xlsx` ou `exceljs` para parsing
- tRPC para API
- Zod para validação
- Drizzle ORM para inserção

### 📝 Referências
- Interface já criada em `client/src/pages/Importacao.tsx`
- Documentação em `DESENVOLVIMENTO_LOCAL.md`

### ⏱️ Estimativa
3-5 horas

---

## Issue #2: Interface de Gerenciamento de Usuários

**Labels**: `enhancement`, `frontend`, `backend`, `priority:high`

### 👥 Descrição
Criar interface completa para administradores gerenciarem usuários do sistema (adicionar, editar, desativar).

### 🎯 Objetivo
Permitir que administradores controlem acesso ao sistema e atribuam roles aos usuários.

### ✅ Tarefas
- [ ] Criar tabela `usuarios_sistema` no schema (separada de `users` OAuth)
- [ ] Criar página `client/src/pages/Usuarios.tsx`
- [ ] Implementar listagem de usuários com tabela
- [ ] Criar formulário de adicionar usuário
- [ ] Implementar edição de usuário (nome, email, role)
- [ ] Adicionar função de ativar/desativar usuário
- [ ] Criar router tRPC `usuarios` com procedures
- [ ] Implementar filtros (por role, status)
- [ ] Adicionar busca por nome/email
- [ ] Proteger rotas com `adminProcedure`
- [ ] Criar testes unitários

### 🎨 Componentes Necessários
- Tabela de usuários com colunas: Nome, Email, Role, Status, Ações
- Modal de adicionar/editar usuário
- Select de roles (Admin, Gerente, Atendente, Cliente)
- Toggle de ativar/desativar
- Badges de status (Ativo/Inativo)

### 🔐 Segurança
- Apenas admin pode acessar
- Validar email único
- Não permitir admin desativar a si mesmo
- Log de alterações de usuários

### 📝 Referências
- Middleware de roles em `server/_core/roleMiddleware.ts`
- Padrão de CRUD em `server/routers/visitacoes.ts`

### ⏱️ Estimativa
4-6 horas

---

## Issue #3: Gráfico de Evolução Mensal de Contratos

**Labels**: `enhancement`, `frontend`, `priority:medium`

### 📊 Descrição
Adicionar gráfico de linha/barra mostrando evolução de contratos fechados por mês.

### 🎯 Objetivo
Visualizar tendência de crescimento e sazonalidade das vendas.

### ✅ Tarefas
- [ ] Instalar biblioteca `recharts`
- [ ] Criar procedure tRPC `visitacoes.evolucaoMensal`
- [ ] Implementar query para agrupar contratos por mês
- [ ] Criar componente `EvolucaoMensalChart.tsx`
- [ ] Adicionar gráfico ao Dashboard
- [ ] Implementar filtro de período (3, 6, 12 meses)
- [ ] Adicionar tooltip com detalhes
- [ ] Tornar responsivo para mobile
- [ ] Adicionar loading state
- [ ] Criar testes para procedure

### 📋 Dados do Gráfico
- **Eixo X**: Meses (Jan, Fev, Mar...)
- **Eixo Y**: Número de contratos fechados
- **Linha secundária**: Taxa de conversão (%)
- **Período padrão**: Últimos 12 meses

### 🎨 Design
- Usar cores da identidade visual (chart-1 a chart-5)
- Gradiente no preenchimento da área
- Animação suave ao carregar
- Legenda clara

### 📝 Referências
- Recharts docs: https://recharts.org
- Cores em `client/src/index.css`

### ⏱️ Estimativa
3-4 horas

---

## Issue #4: Sistema de Notificações e Lembretes

**Labels**: `enhancement`, `backend`, `frontend`, `priority:medium`

### 🔔 Descrição
Implementar sistema de notificações para lembretes de pagamentos, follow-ups e festas próximas.

### 🎯 Objetivo
Automatizar comunicação e reduzir esquecimentos de tarefas importantes.

### ✅ Tarefas Backend
- [ ] Criar tabela `notificacoes` no schema
- [ ] Criar router tRPC `notificacoes`
- [ ] Implementar job agendado (cron) para verificar:
  - Pagamentos vencidos
  - Festas em 7 dias
  - Visitações sem follow-up há 3+ dias
- [ ] Criar procedure para marcar notificação como lida
- [ ] Integrar com `notifyOwner` do Manus

### ✅ Tarefas Frontend
- [ ] Criar componente `NotificationBell.tsx` no header
- [ ] Implementar dropdown de notificações
- [ ] Adicionar badge com contador
- [ ] Criar página `Notificacoes.tsx` (histórico completo)
- [ ] Implementar filtros (lidas/não lidas, tipo)
- [ ] Adicionar som/vibração para novas notificações

### 📋 Tipos de Notificações
1. **Pagamento Vencido**: "Festa FK001 tem pagamento vencido há 5 dias"
2. **Festa Próxima**: "Festa FK002 acontece em 3 dias"
3. **Follow-up Visitação**: "Visitação de Maria Silva sem contato há 7 dias"
4. **Novo Pagamento**: "Pagamento de R$ 1.000 recebido para festa FK003"

### 🔧 Tecnologias
- Node-cron para jobs agendados
- WebSocket ou Server-Sent Events para real-time
- Manus Notification API

### ⏱️ Estimativa
6-8 horas

---

## Issue #5: Autenticação com Email e Senha

**Labels**: `enhancement`, `backend`, `security`, `priority:low`

### 🔐 Descrição
Implementar autenticação alternativa com email/senha além do OAuth do Manus.

### 🎯 Objetivo
Permitir que usuários façam login sem conta Google/OAuth.

### ✅ Tarefas
- [ ] Criar tabela `credenciais` no schema
- [ ] Instalar biblioteca `bcrypt` para hash de senhas
- [ ] Criar procedure `auth.register` (email, senha)
- [ ] Criar procedure `auth.login` (email, senha)
- [ ] Implementar validação de senha forte (min 8 chars, maiúscula, número)
- [ ] Criar página de registro `Register.tsx`
- [ ] Criar página de login `Login.tsx`
- [ ] Implementar recuperação de senha por email
- [ ] Adicionar verificação de email (enviar código)
- [ ] Manter OAuth como opção alternativa
- [ ] Criar testes de segurança

### 🔒 Segurança
- Hash de senha com bcrypt (salt rounds: 10)
- Rate limiting em login (max 5 tentativas/minuto)
- Tokens de recuperação de senha com expiração
- Validação de email único
- Proteção contra brute force

### 📝 Referências
- bcrypt docs: https://www.npmjs.com/package/bcrypt
- JWT já implementado em `server/_core/cookies.ts`

### ⏱️ Estimativa
8-10 horas

---

## Issue #6: Área do Cliente (Portal do Cliente)

**Labels**: `enhancement`, `frontend`, `backend`, `priority:medium`

### 👤 Descrição
Criar área restrita para clientes visualizarem suas festas e pagamentos.

### 🎯 Objetivo
Dar transparência aos clientes sobre suas festas e status de pagamento.

### ✅ Tarefas Backend
- [ ] Criar procedure `festas.minhasFestas` (filtra por clienteId)
- [ ] Criar procedure `pagamentos.meusPagamentos`
- [ ] Implementar middleware `clienteProcedure`
- [ ] Adicionar campo `userId` em `clientes` (relacionar com `users`)

### ✅ Tarefas Frontend
- [ ] Criar layout `ClienteLayout.tsx` (diferente do admin)
- [ ] Criar página `MinhasFestas.tsx`
- [ ] Criar página `MeusPagamentos.tsx`
- [ ] Criar página `MeuPerfil.tsx`
- [ ] Implementar visualização de detalhes da festa
- [ ] Adicionar timeline de pagamentos
- [ ] Mostrar saldo devedor
- [ ] Permitir upload de documentos (futura)

### 🎨 Design
- Layout mais simples que admin
- Foco em visualização (sem edição)
- Cards grandes e legíveis
- Cores suaves

### 📝 Referências
- Role "cliente" já existe no schema
- Padrão de layout em `DashboardLayout.tsx`

### ⏱️ Estimativa
6-8 horas

---

## Issue #7: Relatórios Avançados com Exportação PDF

**Labels**: `enhancement`, `backend`, `frontend`, `priority:medium`

### 📄 Descrição
Criar relatórios detalhados com opção de exportar para PDF.

### 🎯 Objetivo
Gerar relatórios profissionais para análise e apresentação.

### ✅ Tarefas
- [ ] Instalar biblioteca `jspdf` ou `react-pdf`
- [ ] Criar página `RelatoriosAvancados.tsx`
- [ ] Implementar relatório de lucratividade por festa
- [ ] Implementar relatório de custos vs receita
- [ ] Criar ranking de temas mais vendidos
- [ ] Adicionar análise de sazonalidade
- [ ] Implementar filtros de período
- [ ] Criar função de exportar para PDF
- [ ] Adicionar logo e branding no PDF
- [ ] Implementar gráficos no PDF

### 📊 Tipos de Relatórios
1. **Lucratividade por Festa**: Receita - Custos = Lucro
2. **Análise de Custos**: Custos fixos vs variáveis
3. **Ranking de Temas**: Temas mais vendidos
4. **Sazonalidade**: Festas por mês do ano
5. **Taxa de Conversão**: Visitações → Contratos

### 🎨 Layout PDF
- Cabeçalho com logo Festeja Kids
- Título do relatório
- Período analisado
- Gráficos e tabelas
- Rodapé com data de geração

### ⏱️ Estimativa
5-7 horas

---

## Issue #8: Integração com WhatsApp Business

**Labels**: `enhancement`, `backend`, `integration`, `priority:low`

### 💬 Descrição
Integrar com WhatsApp Business API para envio automático de mensagens.

### 🎯 Objetivo
Automatizar comunicação com clientes via WhatsApp.

### ✅ Tarefas
- [ ] Pesquisar APIs disponíveis (Twilio, WhatsApp Business API)
- [ ] Criar conta no provedor escolhido
- [ ] Implementar envio de mensagem via API
- [ ] Criar templates de mensagens:
  - Confirmação de festa
  - Lembrete de pagamento
  - Lembrete de festa (1 dia antes)
  - Follow-up de visitação
- [ ] Adicionar botão "Enviar WhatsApp" nas festas
- [ ] Implementar log de mensagens enviadas
- [ ] Criar configuração de templates no admin

### 📱 Mensagens Automáticas
1. **Confirmação**: "Olá {nome}, sua festa foi confirmada para {data}!"
2. **Lembrete Pagamento**: "Olá {nome}, você tem um pagamento pendente de R$ {valor}"
3. **Lembrete Festa**: "Olá {nome}, sua festa é amanhã! Estamos preparando tudo 🎉"
4. **Follow-up**: "Olá {nome}, gostaria de agendar sua festa? Entre em contato!"

### 🔧 Tecnologias
- Twilio API ou WhatsApp Business API
- Webhooks para receber respostas
- Templates pré-aprovados pelo WhatsApp

### ⏱️ Estimativa
10-12 horas

---

## Issue #9: Sistema de Contratos Digitais

**Labels**: `enhancement`, `backend`, `frontend`, `priority:low`

### 📝 Descrição
Implementar geração automática de contratos e assinatura digital.

### 🎯 Objetivo
Digitalizar processo de contratação e armazenar contratos assinados.

### ✅ Tarefas
- [ ] Criar template de contrato em HTML/PDF
- [ ] Implementar preenchimento automático de dados
- [ ] Integrar com serviço de assinatura digital (ex: DocuSign, Clicksign)
- [ ] Criar tabela `contratos` no schema
- [ ] Implementar upload de contrato assinado
- [ ] Adicionar visualização de contrato na festa
- [ ] Criar versionamento de contratos
- [ ] Implementar envio por email para assinatura
- [ ] Adicionar status (Pendente, Assinado, Cancelado)

### 📋 Dados do Contrato
- Dados do cliente (nome, CPF, endereço)
- Dados da festa (data, horário, local, tema)
- Valor total e forma de pagamento
- Cláusulas e condições
- Espaço para assinaturas

### 🔧 Tecnologias
- jsPDF para geração
- DocuSign/Clicksign API para assinatura
- S3 para armazenamento

### ⏱️ Estimativa
12-15 horas

---

## Issue #10: Dashboard de Métricas em Tempo Real

**Labels**: `enhancement`, `frontend`, `priority:low`

### 📊 Descrição
Criar dashboard com métricas atualizadas em tempo real usando WebSocket.

### 🎯 Objetivo
Visualizar KPIs importantes sem precisar recarregar a página.

### ✅ Tarefas
- [ ] Implementar WebSocket no backend
- [ ] Criar evento de atualização de métricas
- [ ] Atualizar Dashboard para usar WebSocket
- [ ] Adicionar indicadores de tendência (↑↓)
- [ ] Implementar gráficos animados
- [ ] Adicionar comparação com período anterior
- [ ] Criar alertas visuais (metas atingidas)
- [ ] Otimizar performance para muitos usuários

### 📈 Métricas em Tempo Real
- Faturamento do dia
- Festas agendadas hoje
- Novos leads
- Pagamentos recebidos
- Taxa de conversão atual

### 🔧 Tecnologias
- Socket.io para WebSocket
- React Query para cache
- Framer Motion para animações

### ⏱️ Estimativa
8-10 horas

---

## Issue #11: Modo Offline (PWA)

**Labels**: `enhancement`, `frontend`, `pwa`, `priority:low`

### 📱 Descrição
Transformar aplicação em PWA (Progressive Web App) com suporte offline.

### 🎯 Objetivo
Permitir uso básico do sistema sem conexão com internet.

### ✅ Tarefas
- [ ] Configurar Service Worker
- [ ] Criar manifest.json
- [ ] Implementar cache de assets
- [ ] Adicionar cache de dados (IndexedDB)
- [ ] Implementar sincronização quando online
- [ ] Adicionar ícones PWA (múltiplos tamanhos)
- [ ] Criar tela de instalação
- [ ] Implementar indicador de status (online/offline)
- [ ] Testar em dispositivos móveis

### 📋 Funcionalidades Offline
- Visualizar festas (cache)
- Visualizar clientes (cache)
- Adicionar nova festa (fila de sincronização)
- Visualizar dashboard (dados em cache)

### 🔧 Tecnologias
- Vite PWA Plugin
- Workbox para Service Worker
- IndexedDB para storage local

### ⏱️ Estimativa
6-8 horas

---

## Issue #12: Testes E2E com Playwright

**Labels**: `testing`, `quality`, `priority:medium`

### 🧪 Descrição
Implementar testes end-to-end para garantir qualidade do sistema.

### 🎯 Objetivo
Automatizar testes de fluxos críticos e prevenir regressões.

### ✅ Tarefas
- [ ] Instalar Playwright
- [ ] Configurar ambiente de testes
- [ ] Criar testes para fluxo de login
- [ ] Criar testes para cadastro de festa
- [ ] Criar testes para cadastro de cliente
- [ ] Criar testes para registro de pagamento
- [ ] Criar testes para conversão de visitação
- [ ] Implementar CI/CD com testes automáticos
- [ ] Adicionar screenshots em caso de falha
- [ ] Criar relatório de cobertura

### 📋 Fluxos Críticos
1. Login → Dashboard
2. Nova Festa → Cadastro Cliente → Salvar
3. Registrar Pagamento → Atualizar Saldo
4. Visitação → Converter em Cliente
5. Importar Dados → Validar → Confirmar

### 🔧 Tecnologias
- Playwright
- GitHub Actions para CI/CD

### ⏱️ Estimativa
8-10 horas

---

## Issue #13: Otimização de Performance

**Labels**: `performance`, `optimization`, `priority:medium`

### ⚡ Descrição
Otimizar performance do frontend e backend para melhor experiência.

### 🎯 Objetivo
Reduzir tempo de carregamento e melhorar responsividade.

### ✅ Tarefas Frontend
- [ ] Implementar lazy loading de imagens
- [ ] Adicionar code splitting por rota
- [ ] Otimizar bundle size (tree shaking)
- [ ] Implementar virtual scrolling em listas grandes
- [ ] Adicionar skeleton loaders
- [ ] Otimizar re-renders (React.memo, useMemo)
- [ ] Comprimir imagens
- [ ] Implementar cache de assets

### ✅ Tarefas Backend
- [ ] Adicionar índices no banco de dados
- [ ] Implementar paginação em listagens
- [ ] Otimizar queries (evitar N+1)
- [ ] Adicionar cache Redis (opcional)
- [ ] Implementar rate limiting
- [ ] Comprimir responses (gzip)

### 📊 Metas
- Lighthouse Score: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Bundle Size: < 300KB

### ⏱️ Estimativa
6-8 horas

---

## Issue #14: Documentação de API (Swagger/OpenAPI)

**Labels**: `documentation`, `api`, `priority:low`

### 📚 Descrição
Gerar documentação automática da API tRPC.

### 🎯 Objetivo
Facilitar integração e manutenção da API.

### ✅ Tarefas
- [ ] Instalar plugin de documentação tRPC
- [ ] Gerar especificação OpenAPI
- [ ] Criar interface Swagger UI
- [ ] Documentar todos os endpoints
- [ ] Adicionar exemplos de request/response
- [ ] Documentar schemas Zod
- [ ] Adicionar autenticação na documentação
- [ ] Hospedar documentação em `/api/docs`

### 📝 Conteúdo
- Lista de todos os routers
- Procedures (queries e mutations)
- Schemas de input/output
- Códigos de erro
- Exemplos de uso

### 🔧 Tecnologias
- trpc-openapi
- Swagger UI

### ⏱️ Estimativa
4-5 horas

---

## Issue #15: Backup Automático do Banco de Dados

**Labels**: `infrastructure`, `backup`, `priority:high`

### 💾 Descrição
Implementar sistema de backup automático do banco de dados.

### 🎯 Objetivo
Garantir segurança dos dados e possibilidade de recuperação.

### ✅ Tarefas
- [ ] Criar script de backup do MySQL/TiDB
- [ ] Configurar job cron para backup diário
- [ ] Implementar upload de backup para S3
- [ ] Criar rotação de backups (manter últimos 30 dias)
- [ ] Implementar notificação de sucesso/falha
- [ ] Criar script de restore
- [ ] Testar processo de recuperação
- [ ] Documentar procedimento

### 📋 Estratégia de Backup
- **Frequência**: Diário (3h da manhã)
- **Retenção**: 30 dias
- **Formato**: SQL dump comprimido (.sql.gz)
- **Armazenamento**: S3 bucket privado
- **Notificação**: Email em caso de falha

### 🔧 Tecnologias
- mysqldump
- Node-cron
- AWS S3 SDK

### ⏱️ Estimativa
4-6 horas

---

## 📝 Como Usar Este Arquivo

### Opção 1: Criar Issues Manualmente no GitHub
1. Acesse https://github.com/MSC-Consultoria/Sistema-festejakids2/issues
2. Clique em "New Issue"
3. Copie e cole o conteúdo de cada issue acima
4. Adicione as labels correspondentes
5. Clique em "Submit new issue"

### Opção 2: Usar GitHub CLI (após configurar remote)
```bash
# Adicionar remote do GitHub
git remote add github git@github.com:MSC-Consultoria/Sistema-festejakids2.git

# Autenticar no GitHub
gh auth login

# Criar issues via CLI (exemplo)
gh issue create --title "Título" --body "Descrição" --label "enhancement"
```

### Opção 3: Importar via Script
Criar script Node.js que lê este arquivo e cria issues via GitHub API.

---

**Total de Issues**: 15  
**Prioridade Alta**: 3 issues  
**Prioridade Média**: 7 issues  
**Prioridade Baixa**: 5 issues  

**Estimativa Total**: 100-130 horas de desenvolvimento
