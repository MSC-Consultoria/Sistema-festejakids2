# 🔐 ALERTA DE SEGURANÇA - AÇÃO IMEDIATA NECESSÁRIA

## ⚠️ CREDENCIAIS EXPOSTAS PUBLICAMENTE

Você compartilhou credenciais sensíveis em uma conversa. **Isso é um risco de segurança crítico!**

### 🚨 AÇÕES IMEDIATAS NECESSÁRIAS

#### 1. Revogar/Regenerar Credenciais Expostas

**TiDB Cloud (Banco de Dados):**
1. Acesse https://tidbcloud.com
2. Vá em seu cluster
3. Clique em **"Reset Password"** para gerar nova senha
4. Ou crie um novo usuário com permissões limitadas
5. **DELETE o usuário antigo** se possível

**Google API Key:**
1. Acesse https://console.cloud.google.com/apis/credentials
2. Encontre a chave `AIzaSyCsk_8E95_pA8YIQRg4bddW4lYGtHRYkEo`
3. Clique em **"Delete"** ou **"Regenerate"**
4. Crie uma nova chave
5. **Restrinja a nova chave** por domínio/IP

**Manus API Key:**
1. A chave `FESTEJA-KIDS2-API-241120250201` já está configurada no sistema
2. A chave `sk-5izKRwFLzkoK9YUMvY_d1O2bR56UVcDG18DxWb0ubtSx2DWMCw2d84Cva_ddl5BZ4tqmyEPmgjjg9pTWnRvyT-Y8Nu8Z` parece ser outra chave
3. Se for uma chave diferente, verifique se precisa ser revogada

---

## ✅ COMO CONFIGURAR CREDENCIAIS DE FORMA SEGURA

### Método 1: Arquivo .env Local (Desenvolvimento)

**1. Crie arquivo `.env` na raiz do projeto:**

```bash
# NÃO COMMITE ESTE ARQUIVO NO GIT!
# Adicione .env ao .gitignore

# Banco de Dados TiDB
DATABASE_URL="mysql://NOVO_USUARIO:NOVA_SENHA@gateway02.us-east-1.prod.aws.tidbcloud.com:4000/kipPpydFSSmPdFAif48Epo?ssl={\"rejectUnauthorized\":true}"

# Manus API
FESTEJA_KIDS_API="FESTEJA-KIDS2-API-241120250201"

# Google API (após regenerar)
GOOGLE_API_KEY="SUA_NOVA_CHAVE_GOOGLE"

# Outras APIs (se necessário)
# OPENAI_API_KEY="sk-..."
# TWILIO_ACCOUNT_SID="AC..."
# TWILIO_AUTH_TOKEN="..."
```

**2. Verifique que .env está no .gitignore:**

```bash
# Arquivo .gitignore deve conter:
.env
.env.local
.env.*.local
```

**3. Use as variáveis no código:**

```typescript
// TypeScript/Node.js
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.FESTEJA_KIDS_API;
```

```python
# Python
import os
db_url = os.getenv('DATABASE_URL')
api_key = os.getenv('FESTEJA_KIDS_API')
```

---

### Método 2: Google Colab Secrets (Notebooks)

**1. No Google Colab, clique no ícone 🔑 (chave) na barra lateral**

**2. Clique em "+ Add new secret"**

**3. Adicione cada credencial:**

```
Nome: DATABASE_URL
Valor: mysql://NOVO_USUARIO:NOVA_SENHA@gateway02...

Nome: FESTEJA_KIDS_API
Valor: FESTEJA-KIDS2-API-241120250201

Nome: GOOGLE_API_KEY
Valor: SUA_NOVA_CHAVE_GOOGLE
```

**4. Use no código:**

```python
from google.colab import userdata

db_url = userdata.get('DATABASE_URL')
api_key = userdata.get('FESTEJA_KIDS_API')
```

---

### Método 3: Variáveis de Ambiente do Sistema (Linux/Mac)

**1. Edite ~/.bashrc ou ~/.zshrc:**

```bash
export DATABASE_URL="mysql://..."
export FESTEJA_KIDS_API="FESTEJA-KIDS2-API-241120250201"
export GOOGLE_API_KEY="..."
```

**2. Recarregue:**

```bash
source ~/.bashrc
```

**3. Use normalmente:**

```bash
echo $DATABASE_URL
```

---

### Método 4: Gerenciador de Senhas (Recomendado)

Use um gerenciador de senhas como:
- **1Password**
- **Bitwarden**
- **LastPass**
- **KeePass**

Armazene todas as credenciais lá e copie quando necessário.

---

## 🚫 O QUE NUNCA FAZER

### ❌ NUNCA faça isso:

```typescript
// ❌ ERRADO - Credenciais no código
const apiKey = "sk-5izKRwFLzkoK9YUMvY_d1O2bR56UVcDG18DxWb0ubtSx2DWMCw2d84Cva_ddl5BZ4tqmyEPmgjjg9pTWnRvyT-Y8Nu8Z";
const dbPassword = "1DV5nkWOxA0KB9Q3LE1E";
```

```python
# ❌ ERRADO - Credenciais no código
api_key = "AIzaSyCsk_8E95_pA8YIQRg4bddW4lYGtHRYkEo"
```

### ❌ NUNCA commite:
- Arquivos `.env`
- Arquivos com credenciais
- Chaves API no código
- Senhas em comentários

### ❌ NUNCA compartilhe:
- Credenciais em chat público
- Screenshots com credenciais visíveis
- Logs com tokens/senhas
- Repositórios públicos com .env

---

## ✅ BOAS PRÁTICAS DE SEGURANÇA

### 1. Princípio do Menor Privilégio

Crie usuários com permissões mínimas necessárias:

```sql
-- Exemplo: usuário só para leitura
CREATE USER 'festeja_readonly'@'%' IDENTIFIED BY 'senha_forte';
GRANT SELECT ON kipPpydFSSmPdFAif48Epo.* TO 'festeja_readonly'@'%';

-- Exemplo: usuário para aplicação
CREATE USER 'festeja_app'@'%' IDENTIFIED BY 'senha_forte';
GRANT SELECT, INSERT, UPDATE, DELETE ON kipPpydFSSmPdFAif48Epo.* TO 'festeja_app'@'%';
```

### 2. Rotação de Credenciais

- Troque senhas a cada 90 dias
- Revogue chaves antigas
- Use senhas diferentes para cada serviço

### 3. Restrições de Acesso

**Google API:**
- Restrinja por domínio: `*.festejakids.com`
- Restrinja por IP se possível
- Limite APIs habilitadas

**TiDB Cloud:**
- Configure IP whitelist
- Use SSL/TLS sempre
- Monitore logs de acesso

### 4. Monitoramento

- Ative alertas de login suspeito
- Monitore uso de API (custos inesperados)
- Revise logs regularmente

### 5. Backup de Credenciais

- Mantenha backup seguro (gerenciador de senhas)
- Documente onde cada credencial é usada
- Tenha plano de recuperação

---

## 📝 TEMPLATE DE CONFIGURAÇÃO SEGURA

### Para Desenvolvimento Local

Crie arquivo `.env.example` (SEM valores reais):

```bash
# .env.example - Template de configuração
# Copie para .env e preencha com valores reais

# Banco de Dados
DATABASE_URL="mysql://usuario:senha@host:porta/database?ssl={\"rejectUnauthorized\":true}"

# APIs
FESTEJA_KIDS_API="sua-chave-manus"
GOOGLE_API_KEY="sua-chave-google"
OPENAI_API_KEY="sua-chave-openai"

# Outros
NODE_ENV="development"
```

### Para Produção (Manus Dashboard)

Use o Dashboard → Settings → Secrets para adicionar:
- `DATABASE_URL`
- `GOOGLE_API_KEY`
- Outras chaves necessárias

---

## 🔍 VERIFICAR SE CREDENCIAIS FORAM COMPROMETIDAS

### 1. Verificar GitHub

Se você commitou credenciais no GitHub:

```bash
# Remover do histórico (CUIDADO!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (CUIDADO!)
git push origin --force --all
```

**Melhor opção:** Delete o repositório e crie um novo sem credenciais.

### 2. Verificar Logs

Procure por credenciais em:
- Logs de aplicação
- Logs de erro
- Histórico de comandos (`~/.bash_history`)

### 3. Monitorar Uso

- Verifique uso de API (custos inesperados)
- Monitore conexões ao banco
- Revise logs de acesso

---

## 📞 CONTATOS DE EMERGÊNCIA

**TiDB Cloud Support:**
- https://support.pingcap.com

**Google Cloud Support:**
- https://cloud.google.com/support

**Manus Support:**
- https://help.manus.im

---

## ✅ CHECKLIST DE SEGURANÇA

Após ler este documento, execute:

- [ ] Regenerar senha do banco de dados TiDB
- [ ] Regenerar Google API Key
- [ ] Verificar/revogar chave Manus se necessário
- [ ] Criar arquivo .env local com novas credenciais
- [ ] Adicionar .env ao .gitignore
- [ ] Verificar se .env não foi commitado no Git
- [ ] Configurar Secrets no Google Colab
- [ ] Configurar restrições de API (domínio/IP)
- [ ] Ativar alertas de segurança
- [ ] Salvar credenciais em gerenciador de senhas
- [ ] Deletar mensagens com credenciais expostas (se possível)
- [ ] Revisar código para garantir que não há credenciais hardcoded

---

## 📚 RECURSOS ADICIONAIS

**Guias de Segurança:**
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- 12 Factor App: https://12factor.net/
- Google Cloud Security Best Practices: https://cloud.google.com/security/best-practices

**Ferramentas:**
- git-secrets: Previne commit de credenciais
- truffleHog: Detecta credenciais no Git
- dotenv: Gerencia variáveis de ambiente

---

## 🎯 RESUMO

1. **NUNCA** compartilhe credenciais publicamente
2. **SEMPRE** use variáveis de ambiente
3. **NUNCA** commite arquivos .env
4. **SEMPRE** use .gitignore
5. **REGENERE** credenciais expostas imediatamente
6. **USE** gerenciador de senhas
7. **MONITORE** uso e acessos
8. **REVISE** código antes de compartilhar

---

**Desenvolvido para Festeja Kids 2.0**  
**Última Atualização:** 24 de novembro de 2025

**ATENÇÃO:** Este documento contém informações críticas de segurança. Leia com atenção e siga todas as recomendações.
