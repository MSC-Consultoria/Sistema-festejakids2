# Roadmap - Festeja Kids 2.0

**Versão:** 1.0.0  
**Última Atualização:** 27 de Novembro de 2025  
**Progresso Atual:** 69.04% (272/394 tarefas concluídas)

---

## 🎯 Visão Geral

Este roadmap detalha os próximos passos planejados para o desenvolvimento do Sistema Festeja Kids 2.0, organizados por prioridade e prazo estimado.

---

## 📅 Curto Prazo (1-2 semanas)

### 1. Editor de Templates de Contrato ⭐⭐⭐

**Prioridade:** Alta  
**Estimativa:** 3-4 dias  
**Status:** 🔴 Não Iniciado

**Descrição:**
Criar interface administrativa para editar textos padrão do contrato sem modificar código.

**Tarefas:**
- [ ] Criar página `/configuracoes/templates-contrato` (admin only)
- [ ] Implementar editor WYSIWYG ou textarea para cada seção
- [ ] Adicionar procedure `templates.update` no backend
- [ ] Integrar template editável na geração de PDF
- [ ] Adicionar preview do contrato com template atual
- [ ] Implementar versionamento de templates

**Benefícios:**
- Autonomia para ajustar textos sem desenvolvedor
- Facilita personalização por cliente
- Reduz manutenção

---

### 2. Interface de Associação Manual de Pagamentos ⭐⭐⭐

**Prioridade:** Alta  
**Estimativa:** 2-3 dias  
**Status:** 🔴 Não Iniciado

**Descrição:**
Desenvolver interface drag-and-drop para associar os 27 comprovantes restantes aos pagamentos corretos e vincular pagamentos às festas.

**Tarefas:**
- [ ] Criar página `/financeiro/associar-pagamentos`
- [ ] Implementar upload de comprovantes para S3
- [ ] Criar componente drag-and-drop para associação
- [ ] Adicionar procedure `pagamentos.associarComprovante`
- [ ] Adicionar procedure `pagamentos.vincularFesta`
- [ ] Implementar preview de comprovantes
- [ ] Adicionar validação de duplicatas

**Benefícios:**
- Completar processamento dos 34 pagamentos de novembro
- Facilitar gestão de pagamentos futuros
- Melhorar rastreabilidade

---

### 3. Calendário Integrado (Visitações + Pagamentos) ⭐⭐

**Prioridade:** Média  
**Estimativa:** 2 dias  
**Status:** 🔴 Não Iniciado

**Descrição:**
Adicionar visualização de pagamentos e visitações no calendário existente, com filtros por tipo de evento.

**Tarefas:**
- [ ] Estender procedure `festas.porMes` para incluir visitações
- [ ] Adicionar query `pagamentos.porMes`
- [ ] Atualizar componente `Calendario.tsx` para múltiplos tipos
- [ ] Adicionar filtros (Festas / Visitações / Pagamentos)
- [ ] Implementar cores diferentes por tipo de evento
- [ ] Adicionar tooltip com detalhes ao hover

**Benefícios:**
- Visão unificada de todos os eventos
- Facilita planejamento e organização
- Melhora experiência do usuário

---

### 4. Swagger UI Integrado ⭐⭐

**Prioridade:** Média  
**Estimativa:** 1 dia  
**Status:** 🔴 Não Iniciado

**Descrição:**
Adicionar página `/api/docs` com Swagger UI embutido para navegação interativa da API.

**Tarefas:**
- [ ] Instalar `swagger-ui-express`
- [ ] Criar rota `/api/docs` no Express
- [ ] Carregar `openapi_festeja_kids_2.json`
- [ ] Configurar autenticação via cookie no Swagger
- [ ] Adicionar exemplos de request/response
- [ ] Documentar erros comuns

**Benefícios:**
- Facilita testes da API
- Documentação interativa e sempre atualizada
- Reduz curva de aprendizado para novos desenvolvedores

---

## 📅 Médio Prazo (3-4 semanas)

### 5. Exportação de Relatórios (Excel/PDF) ⭐⭐⭐

**Prioridade:** Alta  
**Estimativa:** 4-5 dias  
**Status:** 🔴 Não Iniciado

**Descrição:**
Implementar exportação de relatórios financeiros e de festas em Excel/PDF para análises externas.

**Tarefas:**
- [ ] Instalar `exceljs` e `pdfkit`
- [ ] Criar procedure `relatorios.exportarFinanceiro`
- [ ] Criar procedure `relatorios.exportarFestas`
- [ ] Implementar geração de Excel com múltiplas abas
- [ ] Implementar geração de PDF com gráficos
- [ ] Adicionar botões de exportação nas páginas
- [ ] Implementar filtros de período para exportação
- [ ] Adicionar logo e branding nos relatórios

**Benefícios:**
- Facilita análises externas (Excel)
- Compartilhamento profissional (PDF)
- Backup de dados

---

### 6. Sistema de Notificações Automáticas ⭐⭐⭐

**Prioridade:** Alta  
**Estimativa:** 5-6 dias  
**Status:** 🔴 Não Iniciado

**Descrição:**
Implementar lembretes automáticos de pagamento 7 dias antes do vencimento e alertas de quitação pendente 10 dias antes da festa.

**Tarefas:**
- [ ] Criar tabela `notificacoes` no banco
- [ ] Implementar cron job diário (node-cron)
- [ ] Criar procedure `notificacoes.verificarPagamentosPendentes`
- [ ] Criar procedure `notificacoes.verificarQuitacaoPendente`
- [ ] Integrar com `notifyOwner` do Manus
- [ ] Adicionar opção de envio por email (opcional)
- [ ] Criar página de histórico de notificações
- [ ] Implementar configurações de notificações

**Benefícios:**
- Reduz inadimplência
- Melhora fluxo de caixa
- Automatiza processos manuais

---

### 7. API Pública para Clientes ⭐⭐

**Prioridade:** Média  
**Estimativa:** 4-5 dias  
**Status:** 🔴 Não Iniciado

**Descrição:**
Criar endpoints públicos (com API key) para clientes consultarem suas festas, pagamentos e contratos via aplicativos externos.

**Tarefas:**
- [ ] Criar tabela `api_keys` no banco
- [ ] Implementar middleware de validação de API key
- [ ] Criar router `publicApi` separado
- [ ] Adicionar endpoint `GET /public-api/festas/:clienteId`
- [ ] Adicionar endpoint `GET /public-api/pagamentos/:clienteId`
- [ ] Adicionar endpoint `GET /public-api/contratos/:clienteId`
- [ ] Implementar rate limiting (100 req/hora)
- [ ] Criar documentação específica da API pública
- [ ] Adicionar página de gerenciamento de API keys (admin)

**Benefícios:**
- Integrações com apps externos
- Autonomia para clientes
- Novas possibilidades de negócio

---

### 8. Webhooks para Pagamentos PIX ⭐⭐

**Prioridade:** Média  
**Estimativa:** 3-4 dias  
**Status:** 🔴 Não Iniciado

**Descrição:**
Implementar webhook para receber notificações automáticas de pagamentos PIX aprovados e atualizar status em tempo real.

**Tarefas:**
- [ ] Criar endpoint `POST /api/webhooks/pix`
- [ ] Implementar validação de assinatura do webhook
- [ ] Criar procedure `pagamentos.processarWebhook`
- [ ] Atualizar status do pagamento automaticamente
- [ ] Enviar notificação ao proprietário
- [ ] Adicionar log de webhooks recebidos
- [ ] Implementar retry em caso de falha
- [ ] Documentar integração com gateway de pagamento

**Benefícios:**
- Atualização em tempo real
- Reduz trabalho manual
- Melhora experiência do cliente

---

## 📅 Longo Prazo (2-3 meses)

### 9. Aplicativo Mobile (React Native) ⭐⭐⭐

**Prioridade:** Alta  
**Estimativa:** 3-4 semanas  
**Status:** 🔴 Não Iniciado

**Descrição:**
Desenvolver aplicativo mobile para iOS e Android usando React Native, consumindo a API existente.

**Tarefas:**
- [ ] Configurar projeto React Native com Expo
- [ ] Implementar autenticação OAuth mobile
- [ ] Criar telas principais (Dashboard, Festas, Pagamentos)
- [ ] Implementar push notifications
- [ ] Adicionar câmera para upload de comprovantes
- [ ] Implementar modo offline (cache local)
- [ ] Publicar na App Store e Google Play
- [ ] Criar landing page do app

**Benefícios:**
- Acesso mobile nativo
- Push notifications
- Câmera integrada
- Melhor experiência mobile

---

### 10. Integração com WhatsApp Business ⭐⭐⭐

**Prioridade:** Alta  
**Estimativa:** 2-3 semanas  
**Status:** 🔴 Não Iniciado

**Descrição:**
Integrar com WhatsApp Business API para envio automático de lembretes, confirmações e contratos.

**Tarefas:**
- [ ] Configurar WhatsApp Business API
- [ ] Criar templates de mensagens aprovados
- [ ] Implementar envio de lembrete de pagamento
- [ ] Implementar envio de confirmação de festa
- [ ] Implementar envio de contrato via WhatsApp
- [ ] Adicionar botão "Enviar via WhatsApp" nas páginas
- [ ] Implementar chatbot básico (FAQ)
- [ ] Adicionar log de mensagens enviadas

**Benefícios:**
- Canal de comunicação preferido dos clientes
- Automatização de comunicação
- Maior taxa de abertura que email

---

### 11. Sistema de CRM Integrado ⭐⭐

**Prioridade:** Média  
**Estimativa:** 3-4 semanas  
**Status:** 🔴 Não Iniciado

**Descrição:**
Desenvolver sistema de CRM completo para gestão de relacionamento com clientes.

**Tarefas:**
- [ ] Criar tabela `interacoes` (histórico de contatos)
- [ ] Criar tabela `tarefas` (follow-ups)
- [ ] Implementar timeline de interações por cliente
- [ ] Adicionar sistema de tarefas e lembretes
- [ ] Implementar funil de vendas visual
- [ ] Adicionar tags e segmentação de clientes
- [ ] Criar dashboard de CRM
- [ ] Implementar automações de follow-up

**Benefícios:**
- Melhora relacionamento com clientes
- Aumenta taxa de conversão
- Centraliza comunicação

---

### 12. Analytics Avançado com ML ⭐

**Prioridade:** Baixa  
**Estimativa:** 4-6 semanas  
**Status:** 🔴 Não Iniciado

**Descrição:**
Implementar analytics avançado com machine learning para previsões e insights.

**Tarefas:**
- [ ] Integrar com Google Analytics 4
- [ ] Implementar tracking de eventos
- [ ] Criar modelo de previsão de receita (Python + scikit-learn)
- [ ] Criar modelo de previsão de churn
- [ ] Implementar recomendações de upsell
- [ ] Adicionar dashboard de insights com ML
- [ ] Implementar A/B testing framework
- [ ] Criar relatórios de tendências

**Benefícios:**
- Previsões precisas de receita
- Identificação de clientes em risco
- Otimização de vendas

---

### 13. Multi-tenancy (Múltiplas Empresas) ⭐⭐

**Prioridade:** Média  
**Estimativa:** 4-5 semanas  
**Status:** 🔴 Não Iniciado

**Descrição:**
Transformar o sistema em SaaS multi-tenant para atender múltiplas empresas de festas.

**Tarefas:**
- [ ] Adicionar coluna `empresaId` em todas as tabelas
- [ ] Criar tabela `empresas` com configurações
- [ ] Implementar isolamento de dados por empresa
- [ ] Criar página de cadastro de nova empresa
- [ ] Implementar planos e cobrança (Stripe)
- [ ] Adicionar customização de branding por empresa
- [ ] Criar super admin para gerenciar empresas
- [ ] Implementar subdomínios por empresa

**Benefícios:**
- Modelo de negócio SaaS
- Escalabilidade
- Receita recorrente

---

## 🔧 Melhorias Técnicas

### 14. Testes Automatizados Completos ⭐⭐

**Prioridade:** Média  
**Estimativa:** 2-3 semanas  
**Status:** 🟡 Parcial (12 testes)

**Tarefas:**
- [ ] Aumentar cobertura de testes unitários (>80%)
- [ ] Implementar testes de integração (E2E com Playwright)
- [ ] Adicionar testes de performance (k6)
- [ ] Implementar CI/CD com GitHub Actions
- [ ] Adicionar testes de segurança (OWASP)
- [ ] Criar suite de testes de regressão

**Benefícios:**
- Maior confiabilidade
- Reduz bugs em produção
- Facilita refatoração

---

### 15. Otimização de Performance ⭐

**Prioridade:** Baixa  
**Estimativa:** 1-2 semanas  
**Status:** 🟢 Bom (< 2s load)

**Tarefas:**
- [ ] Implementar server-side rendering (SSR)
- [ ] Adicionar service worker (PWA)
- [ ] Otimizar queries do banco (índices compostos)
- [ ] Implementar cache Redis
- [ ] Adicionar CDN para assets estáticos
- [ ] Implementar lazy loading de imagens
- [ ] Otimizar bundle size (< 200KB)

**Benefícios:**
- Carregamento mais rápido
- Melhor experiência mobile
- Reduz custos de infraestrutura

---

### 16. Monitoramento e Observabilidade ⭐⭐

**Prioridade:** Média  
**Estimativa:** 1 semana  
**Status:** 🔴 Não Iniciado

**Tarefas:**
- [ ] Integrar com Sentry (error tracking)
- [ ] Implementar logging estruturado (Winston)
- [ ] Adicionar métricas (Prometheus)
- [ ] Criar dashboards de monitoramento (Grafana)
- [ ] Implementar health checks
- [ ] Adicionar alertas automáticos
- [ ] Implementar distributed tracing

**Benefícios:**
- Identificação rápida de problemas
- Melhor visibilidade do sistema
- Reduz downtime

---

## 📊 Priorização

### Critérios de Priorização

1. **Impacto no Negócio** (1-5)
2. **Complexidade Técnica** (1-5)
3. **Dependências** (bloqueadores)
4. **Valor para o Usuário** (1-5)

### Matriz de Priorização

| Item | Impacto | Complexidade | Valor | Prioridade |
|------|---------|--------------|-------|------------|
| Editor de Templates | 4 | 2 | 5 | ⭐⭐⭐ Alta |
| Associação Manual | 5 | 2 | 4 | ⭐⭐⭐ Alta |
| Calendário Integrado | 3 | 2 | 4 | ⭐⭐ Média |
| Swagger UI | 2 | 1 | 3 | ⭐⭐ Média |
| Exportação Relatórios | 5 | 3 | 5 | ⭐⭐⭐ Alta |
| Notificações Auto | 5 | 3 | 5 | ⭐⭐⭐ Alta |
| API Pública | 3 | 3 | 3 | ⭐⭐ Média |
| Webhooks PIX | 4 | 3 | 4 | ⭐⭐ Média |
| App Mobile | 5 | 5 | 5 | ⭐⭐⭐ Alta |
| WhatsApp Business | 5 | 4 | 5 | ⭐⭐⭐ Alta |
| CRM Integrado | 4 | 4 | 4 | ⭐⭐ Média |
| Analytics ML | 3 | 5 | 3 | ⭐ Baixa |
| Multi-tenancy | 5 | 5 | 4 | ⭐⭐ Média |

---

## 🎯 Metas Trimestrais

### Q1 2026 (Jan-Mar)

**Objetivo:** Completar funcionalidades core pendentes

- ✅ Editor de Templates de Contrato
- ✅ Associação Manual de Pagamentos
- ✅ Calendário Integrado
- ✅ Swagger UI
- ✅ Exportação de Relatórios
- ✅ Notificações Automáticas

**Meta de Conclusão:** 85% do projeto

---

### Q2 2026 (Abr-Jun)

**Objetivo:** Expandir canais e integrações

- ✅ API Pública
- ✅ Webhooks PIX
- ✅ Aplicativo Mobile (MVP)
- ✅ WhatsApp Business Integration

**Meta de Conclusão:** 95% do projeto

---

### Q3 2026 (Jul-Set)

**Objetivo:** Escalar e otimizar

- ✅ CRM Integrado
- ✅ Multi-tenancy (SaaS)
- ✅ Testes Automatizados Completos
- ✅ Monitoramento e Observabilidade

**Meta de Conclusão:** 100% do projeto

---

### Q4 2026 (Out-Dez)

**Objetivo:** Inovação e diferenciação

- ✅ Analytics Avançado com ML
- ✅ Otimização de Performance
- ✅ Novos módulos baseados em feedback

**Meta:** Manter 100% + novas features

---

## 📝 Notas Finais

Este roadmap é um documento vivo e será atualizado conforme:

- Feedback dos usuários
- Mudanças de prioridade do negócio
- Novas tecnologias disponíveis
- Recursos disponíveis

**Próxima Revisão:** 15 de Dezembro de 2025

---

**Última Atualização:** 27 de Novembro de 2025  
**Versão:** 1.0.0  
**Responsável:** Equipe de Desenvolvimento Festeja Kids 2.0
