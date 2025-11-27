# Festeja Kids 2.0 - TODO

## Modelagem e Estrutura de Dados
- [x] Criar schema do banco de dados com tabelas: festas, clientes, pagamentos, custos_variaveis, custos_fixos
- [x] Implementar helpers de banco de dados para CRUD de festas
- [x] Implementar helpers de banco de dados para CRUD de clientes
- [x] Implementar helpers de banco de dados para controle de pagamentos
- [x] Implementar helpers de banco de dados para gestão de custos

## Gestão de Festas
- [x] Criar interface de listagem de festas com filtros (data, status, cliente)
- [x] Criar formulário de cadastro de nova festa
- [ ] Criar formulário de edição de festa existente
- [ ] Implementar visualização detalhada de festa individual
- [x] Implementar controle de status da festa (agendada, realizada, cancelada)
- [x] Implementar geração automática de código de contrato
- [ ] Criar visualização de próximas festas (calendário)

## Gestão de Clientes
- [x] Criar interface de listagem de clientes
- [ ] Criar formulário de cadastro de cliente
- [ ] Criar formulário de edição de cliente
- [ ] Implementar histórico de festas por cliente
- [x] Implementar busca de clientes

## Controle Financeiro
- [ ] Criar interface de registro de pagamentos
- [ ] Implementar controle de pagamentos parciais
- [ ] Implementar cálculo automático de saldo devedor
- [ ] Criar visualização de valores a receber
- [ ] Criar relatório de inadimplência
- [ ] Implementar histórico de pagamentos por festa

## Gestão de Custos
- [ ] Criar interface de cadastro de custos variáveis
- [ ] Criar interface de cadastro de custos fixos mensais
- [ ] Implementar edição de custos
- [ ] Implementar cálculo automático de custo por festa
- [ ] Implementar cálculo de margem de lucro
- [ ] Implementar cálculo de ponto de equilíbrio mensal

## Dashboard e Relatórios
- [x] Criar dashboard principal com indicadores (festas do mês, faturamento, a receber)
- [ ] Implementar análise mensal (festas vendidas, valor vendido, valor recebido, ticket médio)
- [ ] Implementar análise trimestral
- [ ] Implementar análise anual
- [ ] Criar gráficos de evolução de vendas
- [ ] Criar gráfico de análise de ticket médio
- [ ] Criar gráfico de valor por convidado
- [ ] Implementar previsão de faturamento
- [ ] Implementar análise de lucratividade
- [ ] Implementar exportação de relatórios (PDF, Excel)

## Autenticação e Segurança
- [x] Configurar autenticação com Manus OAuth
- [x] Implementar controle de acesso por role (admin/user)
- [x] Configurar proteção de rotas

## Testes
- [x] Criar testes para procedures de festas
- [ ] Criar testes para procedures de pagamentos
- [ ] Criar testes para procedures de custos
- [ ] Criar testes para cálculos financeiros
- [ ] Testar fluxo completo de cadastro de festa até pagamento

## Migração de Dados
- [x] Criar script de importação de dados históricos de 2024
- [x] Criar script de importação de dados históricos de 2025
- [x] Criar script de importação de próximas festas
- [x] Validar integridade dos dados importados

## Melhorias e Ajustes Finais
- [ ] Ajustar responsividade mobile
- [ ] Implementar loading states e feedback visual
- [ ] Implementar tratamento de erros
- [ ] Adicionar validações de formulários
- [ ] Otimizar performance de queries
- [ ] Criar documentação de uso do sistema

## Importação de Contratos em PDF
- [x] Extrair dados dos contratos de novembro 2025
- [x] Extrair dados dos contratos de dezembro 2025
- [x] Extrair dados dos contratos de 2026
- [x] Validar dados extraídos dos PDFs
- [x] Importar festas futuras no banco de dados

## Validação Cruzada de Dados
- [x] Analisar planilhas de próximos eventos
- [x] Comparar dados das planilhas com banco de dados
- [x] Identificar festas faltantes ou duplicadas
- [x] Corrigir divergências de valores e datas
- [x] Sincronizar todos os dados

## Limpeza de Banco de Dados
- [x] Limpar tabela de pagamentos
- [x] Limpar tabela de festas
- [x] Limpar tabela de clientes
- [x] Limpar tabela de custos variáveis
- [x] Limpar tabela de custos fixos
- [x] Verificar limpeza completa

## Importação de Próximasfestas.xlsx (Fonte Única)
- [x] Analisar estrutura da planilha
- [x] Criar script de importação dedicado
- [x] Importar clientes da planilha
- [x] Importar festas da planilha
- [x] Validar dados importados

## Importação Completa de Todas as Informações da Planilha
- [x] Analisar todas as colunas da planilha Próximasfestas.xlsx
- [x] Adicionar campos de pagamento detalhados (Pagamento 1, 2, 3)
- [x] Atualizar schema do banco de dados
- [x] Criar tabela de pagamentos individuais
- [x] Reimportar dados com todas as informações
- [x] Atualizar interface para exibir pagamentos

## Correção de Campos Faltantes
- [x] Verificar campos atuais no schema de festas
- [x] Confirmar que Código, Data de Fechamento, Data da Festa e Número de Convidados existem
- [x] Verificar se os dados foram importados corretamente
- [x] Atualizar interface para exibir todos os campos

## Funcionalidade de Adicionar Nova Festa
- [x] Criar página de formulário de nova festa
- [x] Implementar seleção de cliente existente ou cadastro de novo cliente
- [x] Adicionar validação de campos obrigatórios
- [x] Implementar geração automática de código de contrato
- [x] Criar procedure tRPC para cadastro de festa
- [x] Adicionar feedback de sucesso/erro
- [x] Redirecionar para lista de festas após cadastro
- [x] Criar testes unitários para criação de festas

## Correção de Páginas 404
- [x] Identificar rotas que levam a 404
- [x] Corrigir links quebrados na navegação
- [x] Traduzir página 404 para português
- [x] Ajustar tema escuro na página 404
- [x] Testar todas as rotas do sistema

## Correções e Melhorias Solicitadas
- [x] Corrigir cálculo de ticket médio para considerar apenas festas realizadas
- [x] Adicionar opção de cadastrar novo cliente no formulário de festa
- [x] Criar aba de calendário mensal mostrando quantidade de festas por mês
- [x] Criar aba de custos para inserir custos de cada festa
- [x] Implementar visualização de custos variáveis e fixos
- [x] Implementar cadastro e exclusão de custos

## Novas Funcionalidades Solicitadas
- [x] Criar aba de Agenda em formato de calendário
- [x] Integrar com Google Calendar para inserir festas de janeiro
- [x] Fazer commit do projeto no repositório GitHub
- [x] Criar linha do tempo do projeto
- [x] Criar aba Financeiro com dashboard completo
- [x] Criar formulário de registro de pagamentos (valor, código contrato, forma de pagamento)
- [ ] Implementar busca de festa por código de contrato
- [ ] Vincular pagamentos às festas automaticamente

## Recursos Visuais (Gráficos)
- [x] Instalar biblioteca de gráficos (Recharts)
- [x] Adicionar gráfico de evolução mensal de faturamento
- [x] Adicionar gráfico de pizza de recebimentos vs a receber
- [x] Adicionar gráfico de barras de festas por mês
- [x] Criar aba Relatórios com dashboards visuais
- [x] Implementar gráfico de análise trimestral
- [x] Implementar gráfico de análise anual
- [x] Adicionar gráfico de custos vs receita

## Acompanhamento de Pagamentos e Projeção Financeira
- [x] Criar procedure para calcular status de pagamento (em dia, atrasado, quitado)
- [x] Implementar validação de parcela mínima (R$ 500/mês)
- [x] Implementar validação de quitação 10 dias antes do evento
- [x] Criar aba de Acompanhamento de Pagamentos
- [x] Implementar tabela de clientes com status de pagamento
- [x] Adicionar alertas visuais (cores) para status
- [x] Criar projeção financeira para próximos 12 meses
- [x] Implementar gráfico de fluxo de recebimento projetado
- [x] Adicionar comparativo: recebimento esperado vs realizado

## Commit no GitHub
- [x] Configurar repositório remoto do GitHub
- [x] Adicionar todos os arquivos ao staging
- [x] Fazer commit com mensagem descritiva
- [x] Push para o repositório remoto
- [x] Verificar commit no GitHub

## Página de Detalhes da Festa
- [x] Criar rota e página de detalhes
- [x] Exibir informações completas da festa
- [x] Mostrar timeline de pagamentos
- [x] Adicionar botão de edição
- [x] Calcular margem de lucro

## Exportação e Relatórios
- [ ] Implementar exportação para PDF
- [ ] Implementar exportação para Excel
- [ ] Gerar recibos de pagamento

## Filtros Avançados
- [x] Adicionar busca por código (implementado em Festas)
- [x] Implementar filtros por data (implementado em Festas)
- [x] Implementar filtros por status (implementado em Festas)
- [x] Adicionar ordenação (implementado em Festas e Clientes)

## Otimização Mobile
- [x] Adaptar DashboardLayout com menu hamburguer
- [x] Converter tabelas em cards empilháveis (Festas)
- [x] Converter tabelas em cards empilháveis (Clientes)
- [x] Ajustar tamanhos de botões e áreas de toque
- [x] Otimizar gráficos para telas verticais
- [x] Melhorar legibilidade de textos
- [x] Testar em diferentes resoluções mobile

## Melhorias Visuais para Mobile
- [x] Atualizar paleta de cores com gradientes
- [x] Adicionar classes CSS para animações e efeitos
- [x] Melhorar cards com sombras e bordas arredondadas
- [x] Aumentar ícones e adicionar cores vibrantes
- [x] Adicionar animações suaves e transições
- [x] Implementar navegação inferior (bottom nav) para mobile
- [x] Melhorar espaçamentos e respiração do layout
- [x] Adicionar micro-interações nos botões

## Controle de Visitações (Leads)
- [x] Criar tabela de visitações no schema
- [x] Adicionar campos: nome, telefone, email, data visita, interesse, status, observações
- [x] Implementar helpers de banco para CRUD de visitações
- [x] Criar procedures tRPC para visitações
- [x] Criar página de listagem de visitações
- [x] Criar formulário de cadastro de visitação
- [x] Implementar status de acompanhamento (Visitou, Aguardando, Proposta Enviada, Fechado, Perdido)
- [x] Adicionar função de converter visitante em cliente
- [x] Criar dashboard de conversão com taxa e funil de vendas
- [x] Criar testes unitários para router de visitações (8 testes passando)

## Identidade Visual Festeja Kids
- [x] Substituir logo atual pela Logomarca-Festejakids2.png
- [x] Adaptar paleta de cores (vermelho, amarelo, ciano, verde, magenta, roxo)
- [x] Atualizar gradientes e cores dos cards
- [x] Ajustar cores dos badges e status
- [ ] Atualizar favicon com nova logo (usuário deve fazer via Dashboard)

## Sistema de Roles e Permissões
- [x] Adicionar enum de roles no schema (admin, atendente, gerente, cliente)
- [x] Criar middleware de autorização por role
- [x] Implementar controle de acesso nas procedures tRPC
- [ ] Criar interface de gerenciamento de usuários (futura)
- [x] Adicionar filtro de menu por role

## Modo Atendente Simplificado
- [x] Criar layout simplificado para atendente
- [x] Restringir menu a: Nova Festa, Novo Pagamento, Agenda, Visitações
- [x] Criar atalhos rápidos para ações frequentes
- [x] Implementar navegação simplificada

## Importação de Dados
- [x] Criar aba de Importação
- [x] Implementar upload de arquivos Excel (interface pronta)
- [ ] Criar parser para planilhas de festas (backend pendente)
- [ ] Criar parser para planilhas de clientes (backend pendente)
- [ ] Adicionar validação de dados importados (backend pendente)
- [ ] Implementar preview antes de importar (backend pendente)
- [ ] Criar log de importações (backend pendente)

## Campo de Horário Editável
- [x] Adicionar campo horário nas festas (já existe no schema)
- [x] Criar formulário de edição de horário (já existe em NovaFesta)
- [ ] Permitir edição em lote de horários (futura)
- [x] Validar formato de horário

## Incrementar Dashboard
- [x] Adicionar card "Contratos Fechados"
- [x] Adicionar card "Festas Realizadas"
- [x] Adicionar card "Visitas Realizadas"
- [x] Adicionar card "Taxa de Conversão"
- [ ] Corrigir distribuição de valores recebidos (set/out/nov) - dados já limpos
- [ ] Adicionar gráfico de evolução mensal de contratos (futura)

## Limpeza de Dados
- [x] Identificar clientes de teste
- [x] Excluir visitações de teste
- [x] Excluir festas de teste
- [x] Excluir pagamentos de teste
- [x] Validar integridade após limpeza

## Autenticação sem Google
- [ ] Implementar cadastro com email/senha (futura - requer mudança no sistema de auth)
- [ ] Criar página de registro (futura)
- [ ] Adicionar validação de email (futura)
- [ ] Implementar recuperação de senha (futura)

## Melhorias de UX e Configuração Inicial
- [x] Adicionar botão voltar na página de Visitações
- [x] Criar script para resetar completamente o banco de dados
- [x] Criar seed de 3 usuários padrão (Moises, Gabriel, Adriano)
- [ ] Implementar sistema de troca de senha obrigatória no primeiro login (futura)
- [ ] Restringir acesso apenas aos 3 usuários iniciais (futura - requer mudança no OAuth)
- [x] Adicionar métricas do mês corrente no Dashboard (Festas Realizadas e Vendidas)
- [x] Adicionar relógio em tempo real no header (atualização a cada 10s)

## Implementação de Importação Excel
- [x] Analisar estrutura da planilha Festasvendidas2025.xlsx
- [x] Instalar biblioteca xlsx (npm install xlsx)
- [x] Criar parser para processar colunas: Código, Nome Cliente, Data Fechamento, Data Evento, Horário, Tema, Valor, Total Pago, Custo, Telefone
- [x] Criar procedure tRPC para importação de festas
- [x] Validar dados importados (datas, valores, telefones)
- [x] Criar ou buscar clientes automaticamente durante importação
- [x] Atualizar interface de importação para upload e processamento
- [x] Testar importação com planilha real de 2025 (100 festas válidas de 168 linhas)
- [x] Adicionar preview de dados antes de importar
- [x] Criar log de importações com sucesso/erros

## Botão de Reset do Banco de Dados
- [x] Criar procedure tRPC para reset do banco
- [x] Adicionar botão de reset na interface (apenas para admin)
- [x] Adicionar confirmação dupla antes de resetar
- [x] Executar reset e recriar usuários padrão
- [x] Testar funcionalidade de reset

## Adicionar Novos Administradores e Importar Festas
- [x] Adicionar gabrielol2035@gmail.com como admin
- [x] Adicionar recantodoacaienventosrj@gmail.com como admin
- [x] Analisar estrutura da planilha Próximasfestas.xlsx (66 festas)
- [x] Validar dados da planilha
- [x] Importar festas da planilha para o banco (63 festas importadas com sucesso)
- [x] Verificar importação bem-sucedida (Dashboard mostrando R$ 328.700,00)

## Correção de Datas das Festas
- [x] Investigar problema de conversão de datas do Excel (1 dia adiantado)
- [x] Corrigir função excelDateToJSDate no script de importação (meio-dia UTC)
- [x] Resetar banco de dados
- [x] Reimportar festas com datas corretas
- [x] Verificar datas no sistema (Rodrigo Rios agora é 07/12/25 12:00:00 UTC)

## Interface de Gerenciamento de Usuários
- [x] Criar helpers de banco para CRUD de usuários
- [x] Criar procedures tRPC protegidas com adminProcedure
- [x] Criar página Usuarios.tsx com listagem em tabela
- [x] Implementar filtros por role (admin, gerente, atendente, cliente)
- [x] Adicionar busca por nome/email
- [x] Criar formulário de adicionar usuário (dialog)
- [x] Criar formulário de editar usuário (dialog)
- [x] Implementar exclusão de usuário com confirmação
- [x] Adicionar rota /usuarios no App.tsx
- [x] Adicionar item "Usuários" no menu (apenas admin)
- [x] Criar testes unitários para procedures de usuários (12 testes passando)
- [x] Testar funcionalidade completa

## Melhoria da Tela de Visitações (Ficha de Contrato e Degustação)
- [x] Estender schema de visitações com novos campos (CPF, endereço, quantidade convidados, brinde, refeição, bolo, etc - 24 campos totais)
- [x] Criar procedures tRPC para CRUD completo de visitações
- [x] Atualizar página Visitacoes.tsx com formulários de Ficha de Contrato e Ficha de Degustação
- [x] Implementar abas para alternar entre Contrato e Degustação
- [x] Adicionar campos de brinde, refeição, bolo com opções pré-definidas
- [x] Implementar listagem com filtros e busca
- [x] Importar 8 visitações da semana de 27/11/2025 (Nadia, Suzane, Marcelaine, Caryne, Thais, Jenifer, Karien, Valzenir)
- [x] Testar funcionalidade completa

## Atualização da Tela de Nova Festa
- [ ] Estender schema de festas com campos de contrato (CPF cliente, endereço, brinde, refeição, bolo, aniversariante, idade aniversariante)
- [ ] Atualizar procedures tRPC para aceitar novos campos de contrato
- [ ] Reescrever formulário de Nova Festa com todos os campos
- [ ] Implementar validações de CPF e telefone
- [ ] Adicionar opções pré-definidas para brinde, massa e molho
- [ ] Implementar busca de cliente por CPF ou nome
- [ ] Testar cadastro de nova festa com todos os campos

## Funcionalidade de Edição de Festas
- [x] Criar página de edição de festa (/festas/editar/:id)
- [x] Implementar formulário preenchido com dados da festa
- [x] Reutilizar componentes de Ficha de Contrato e Degustação
- [x] Implementar procedure tRPC para atualização (festas.update)
- [x] Adicionar validação de campos
- [x] Implementar feedback de sucesso/erro
- [x] Adicionar botão de edição nos cards de festas
- [x] Criar testes unitários para edição

## Atualização de Visitações e Limpeza
- [x] Atualizar schema de visitações com novos status (Fechou Pré-Contrato, Fechou Contrato, Tem Interesse, Faltou, Remarcar)
- [x] Atualizar interface de visitações com novos status
- [x] Limpar visitações de teste do banco de dados
- [x] Limpar festas de teste do banco de dados
- [x] Atualizar linha do tempo do projeto
- [x] Atualizar documentação do projeto (README.md)
- [x] Fazer commit no GitHub com todas as alterações

## A. Correções de Erros Críticos (404)
- [x] Corrigir erro 404 na Página de Edição de Festa (já estava funcionando)
- [x] Corrigir erro 404 na Visualização de Detalhes do Cliente

## B. Melhorias na Funcionalidade de Visitações e Status
- [x] Implementar os 5 status de Visitação (já implementado)
- [x] Ajustar validação de E-mail na Visitação para permitir cadastro com ou sem e-mail
- [x] CPF é opcional na visitação, obrigatório apenas ao fechar contrato
- [x] Implementar fluxo de conversão: tela intermediária ao clicar em "Converter"
- [x] Flexibilizar Data do Evento na Visitação (opcional para visitação, obrigatória para contrato)

## C. Melhorias de Usabilidade e Interface (UX/UI)
- [ ] Tornar o Dashboard clicável (cards levam para páginas específicas)
- [ ] Detalhar Contrato no Calendário (modal com informações completas ao clicar na festa)
- [ ] Criar Filtro Avançado de Pesquisa em todas as abas
- [ ] Criar Versão Simplificada para usuário "Atendimento" com foco em:
  - [ ] Adicionar/Editar Visitação
  - [ ] Adicionar/Editar Novo Cliente
  - [ ] Adicionar/Editar Novo Pagamento

## D. Gerenciamento de Usuários e Permissões
- [ ] Configurar usuários iniciais: recantodoacaienventosrj@gmail.com e gabrielol2035@gmail.com
- [ ] Definir perfis de acesso (Administrador por padrão, com opção de alterar roles)
- [ ] Permitir que administrador gerencie todos os usuários na aba "Usuários"

## E. Otimização de Performance
- [ ] Otimizar velocidade de carregamento da aba Acompanhamentos
- [ ] Investigar possíveis problemas de quebra de banco

## Próximas Melhorias - Sprint Atual

### Dashboard Clicável
- [x] Tornar card "Contratos Fechados" clicável → redireciona para /festas
- [x] Tornar card "Festas Realizadas" clicável → redireciona para /festas?status=realizada
- [x] Tornar card "Visitas Realizadas" clicável → redireciona para /visitacoes
- [x] Tornar card "Taxa de Conversão" clicável → redireciona para /visitacoes
- [x] Tornar card "Total de Festas" clicável → redireciona para /festas
- [x] Tornar card "Faturamento Total" clicável → redireciona para /financeiro

### Filtros Avançados
- [ ] Adicionar busca por código de contrato na página de Festas
- [ ] Adicionar busca por CPF na página de Festas
- [ ] Adicionar filtro de período de datas (data de fechamento e data do evento)
- [ ] Adicionar ordenação customizável (por data, valor, cliente, status)
- [ ] Implementar filtros na página de Clientes (busca por CPF, telefone, email)
- [ ] Implementar filtros na página de Visitações (busca por nome, telefone, status, período)

### Gerenciamento de Usuários
- [ ] Criar interface de listagem de usuários na página /usuarios
- [ ] Implementar formulário de adicionar novo usuário
- [ ] Implementar formulário de editar usuário existente
- [ ] Adicionar seleção de role (Admin/Atendimento) no formulário
- [ ] Implementar exclusão de usuários (com confirmação)
- [ ] Configurar usuários iniciais: recantodoacaienventosrj@gmail.com e gabrielol2035@gmail.com como Admin

### Documentação e Repositório
- [x] Atualizar TIMELINE.md com todas as fases do projeto
- [x] Criar documentação de setup local (SETUP_LOCAL.md)
- [x] Criar guia de configuração para Windows 10
- [x] Analisar issues existentes no GitHub (ISSUES_ANALYSIS.md)
- [x] Criar novos issues para funcionalidades pendentes (#17)
- [x] Fechar issues já resolvidos (#16)
- [x] Fazer commit e push de todas as alterações
- [ ] Atualizar README.md com estado atual do projeto


## Sprint Atual - Filtros e Gerenciamento de Usuários

### Filtros Avançados (Issue #17)
- [ ] Implementar busca por código de contrato em Festas
- [ ] Implementar busca por CPF em Festas
- [ ] Implementar filtro de período de datas (data de fechamento) em Festas
- [ ] Implementar filtro de período de datas (data do evento) em Festas
- [ ] Implementar ordenação customizável em Festas
- [ ] Implementar busca por CPF em Clientes
- [ ] Implementar busca por telefone em Clientes
- [ ] Implementar busca por email em Clientes
- [ ] Implementar busca por nome em Visitações
- [ ] Implementar busca por telefone em Visitações
- [ ] Implementar filtro por status em Visitações
- [ ] Implementar filtro de período em Visitações

### Gerenciamento de Usuários (Issue #2)
- [ ] Criar página de listagem de usuários
- [ ] Implementar formulário de adicionar novo usuário
- [ ] Implementar formulário de editar usuário
- [ ] Implementar seleção de role (Admin/Atendimento/Gerente/Cliente)
- [ ] Implementar exclusão de usuários com confirmação
- [ ] Configurar usuários iniciais como Admin
- [ ] Testar permissões por role
- [ ] Criar testes unitários para gerenciamento de usuários
