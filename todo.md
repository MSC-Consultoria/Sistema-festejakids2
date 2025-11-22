# Festeja Kids 2.0 - TODO

## Modelagem e Estrutura de Dados
- [x] Criar schema do banco de dados com tabelas: festas, clientes, pagamentos, custos_variaveis, custos_fixos
- [x] Implementar helpers de banco de dados para CRUD de festas
- [x] Implementar helpers de banco de dados para CRUD de clientes
- [x] Implementar helpers de banco de dados para controle de pagamentos
- [x] Implementar helpers de banco de dados para gestão de custos

## Gestão de Festas
- [x] Criar interface de listagem de festas com filtros (data, status, cliente)
- [ ] Criar formulário de cadastro de nova festa
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
- [ ] Adicionar busca por código
- [ ] Implementar filtros por data
- [ ] Implementar filtros por status
- [ ] Adicionar ordenação

## Otimização Mobile
- [x] Adaptar DashboardLayout com menu hamburguer
- [x] Converter tabelas em cards empilháveis (Festas)
- [x] Converter tabelas em cards empilháveis (Clientes)
- [x] Ajustar tamanhos de botões e áreas de toque
- [x] Otimizar gráficos para telas verticais
- [x] Melhorar legibilidade de textos
- [ ] Testar em diferentes resoluções mobile
