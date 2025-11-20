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
