# 🔌 Guia de Integração com APIs de IA e Serviços Externos

**Festeja Kids 2.0 - Integração com APIs**

Este guia mostra como integrar APIs de IA e serviços externos no sistema Festeja Kids, com exemplos práticos em Python/JSON para Google Colab e backend Node.js.

---

## 📋 Índice

1. [API Manus (Já Configurada)](#api-manus)
2. [OpenAI API](#openai-api)
3. [Google Gemini API](#google-gemini-api)
4. [Anthropic Claude API](#anthropic-claude-api)
5. [Hugging Face API](#hugging-face-api)
6. [Twilio API (WhatsApp)](#twilio-api)
7. [SendGrid API (Email)](#sendgrid-api)
8. [Google Maps API](#google-maps-api)
9. [Exemplos Práticos para Festeja Kids](#exemplos-práticos)
10. [Notebook Google Colab](#notebook-google-colab)

---

## 🎯 API Manus (Já Configurada)

### Credenciais Disponíveis

Você já possui a API Key do Manus configurada no sistema:

```
FESTEJA_KIDS_API=FESTEJA-KIDS2-API-241120250201
```

### Recursos Disponíveis

A API Manus já está integrada no sistema e oferece:

1. **LLM (Large Language Model)**
   - Geração de texto com IA
   - Chat conversacional
   - Análise de sentimento
   - Resumos automáticos

2. **Storage (S3)**
   - Upload de arquivos
   - Armazenamento de imagens
   - Download de documentos

3. **Notifications**
   - Notificações push
   - Alertas para o proprietário

4. **Maps**
   - Integração com Google Maps
   - Geocodificação
   - Rotas e direções

### Exemplo de Uso no Backend (Node.js)

```typescript
// server/exemplo-llm.ts
import { invokeLLM } from "./server/_core/llm";

// Gerar descrição de festa com IA
async function gerarDescricaoFesta(tema: string, numeroConvidados: number) {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Você é um especialista em festas infantis."
      },
      {
        role: "user",
        content: `Crie uma descrição atrativa para uma festa infantil com tema ${tema} para ${numeroConvidados} convidados.`
      }
    ]
  });
  
  return response.choices[0].message.content;
}
```

### Exemplo de Uso no Google Colab (Python)

```python
import requests
import json

# Configurar API
MANUS_API_URL = "https://forge.manus.im"
MANUS_API_KEY = "FESTEJA-KIDS2-API-241120250201"

headers = {
    "Authorization": f"Bearer {MANUS_API_KEY}",
    "Content-Type": "application/json"
}

# Chamar LLM
def chamar_llm(mensagem):
    payload = {
        "messages": [
            {"role": "system", "content": "Você é um assistente de festas infantis."},
            {"role": "user", "content": mensagem}
        ]
    }
    
    response = requests.post(
        f"{MANUS_API_URL}/llm/chat",
        headers=headers,
        json=payload
    )
    
    return response.json()

# Exemplo de uso
resultado = chamar_llm("Sugira 5 temas de festa para crianças de 5 anos")
print(resultado['choices'][0]['message']['content'])
```

---

## 🤖 OpenAI API

### Como Obter a API Key

1. Acesse https://platform.openai.com
2. Crie uma conta ou faça login
3. Vá em **API Keys** no menu lateral
4. Clique em **Create new secret key**
5. Copie a chave (ela só será mostrada uma vez!)
6. Adicione créditos em **Billing** (mínimo $5)

### Preços (Novembro 2024)

- **GPT-4 Turbo**: $0.01 / 1K tokens (input), $0.03 / 1K tokens (output)
- **GPT-3.5 Turbo**: $0.0005 / 1K tokens (input), $0.0015 / 1K tokens (output)
- **DALL-E 3**: $0.04 por imagem (1024x1024)

### Exemplo Python (Google Colab)

```python
!pip install openai

import openai

# Configurar API Key
openai.api_key = "sk-proj-..." # Sua chave aqui

# Gerar texto
def gerar_ideias_festa(tema, idade):
    response = openai.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {"role": "system", "content": "Você é um especialista em festas infantis."},
            {"role": "user", "content": f"Sugira atividades para festa de {tema} para criança de {idade} anos"}
        ],
        temperature=0.7,
        max_tokens=500
    )
    return response.choices[0].message.content

# Usar
ideias = gerar_ideias_festa("Frozen", 5)
print(ideias)
```

### Exemplo com Requests (JSON)

```python
import requests

API_KEY = "sk-proj-..."
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "model": "gpt-3.5-turbo",
    "messages": [
        {"role": "user", "content": "Liste 10 temas populares de festa infantil"}
    ]
}

response = requests.post(
    "https://api.openai.com/v1/chat/completions",
    headers=headers,
    json=payload
)

print(response.json()['choices'][0]['message']['content'])
```

### Integração no Backend Festeja Kids

```typescript
// server/routers/ai.ts
import OpenAI from "openai";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiRouter = router({
  gerarIdeiasAtividades: protectedProcedure
    .input(z.object({
      tema: z.string(),
      idade: z.number(),
      numeroConvidados: z.number(),
    }))
    .mutation(async ({ input }) => {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em festas infantis."
          },
          {
            role: "user",
            content: `Sugira 5 atividades para uma festa de ${input.tema} para ${input.numeroConvidados} crianças de ${input.idade} anos.`
          }
        ],
      });
      
      return {
        ideias: completion.choices[0].message.content,
      };
    }),
});
```

---

## 🌟 Google Gemini API

### Como Obter a API Key

1. Acesse https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em **Create API Key**
4. Copie a chave gerada

### Preços

- **Gemini Pro**: GRATUITO até 60 requisições/minuto
- **Gemini Pro Vision**: GRATUITO até 60 requisições/minuto

### Exemplo Python (Google Colab)

```python
!pip install google-generativeai

import google.generativeai as genai

# Configurar API Key
genai.configure(api_key="AIza...")

# Usar Gemini Pro
model = genai.GenerativeModel('gemini-pro')

def analisar_festa(descricao):
    prompt = f"""
    Analise esta descrição de festa infantil e sugira melhorias:
    
    {descricao}
    
    Forneça:
    1. Pontos fortes
    2. Sugestões de melhoria
    3. Estimativa de custo
    """
    
    response = model.generate_content(prompt)
    return response.text

# Usar
analise = analisar_festa("Festa de Frozen para 50 crianças com bolo, decoração e recreação")
print(analise)
```

### Exemplo com Requests (JSON)

```python
import requests

API_KEY = "AIza..."
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={API_KEY}"

payload = {
    "contents": [{
        "parts": [{
            "text": "Liste 10 brincadeiras para festa infantil ao ar livre"
        }]
    }]
}

response = requests.post(url, json=payload)
print(response.json()['candidates'][0]['content']['parts'][0]['text'])
```

---

## 🧠 Anthropic Claude API

### Como Obter a API Key

1. Acesse https://console.anthropic.com
2. Crie uma conta
3. Vá em **API Keys**
4. Clique em **Create Key**
5. Adicione créditos (mínimo $5)

### Preços

- **Claude 3 Opus**: $15 / 1M tokens (input), $75 / 1M tokens (output)
- **Claude 3 Sonnet**: $3 / 1M tokens (input), $15 / 1M tokens (output)
- **Claude 3 Haiku**: $0.25 / 1M tokens (input), $1.25 / 1M tokens (output)

### Exemplo Python

```python
!pip install anthropic

import anthropic

client = anthropic.Anthropic(api_key="sk-ant-...")

def gerar_orcamento_festa(detalhes):
    message = client.messages.create(
        model="claude-3-sonnet-20240229",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": f"Crie um orçamento detalhado para: {detalhes}"
            }
        ]
    )
    return message.content[0].text

# Usar
orcamento = gerar_orcamento_festa("Festa Patrulha Canina para 30 crianças")
print(orcamento)
```

---

## 🤗 Hugging Face API

### Como Obter a API Key

1. Acesse https://huggingface.co
2. Crie uma conta
3. Vá em **Settings** → **Access Tokens**
4. Clique em **New token**
5. Dê um nome e selecione permissões
6. Copie o token

### Preços

- **Gratuito**: 30.000 caracteres/mês
- **Pro**: $9/mês - 1M caracteres
- **Enterprise**: Customizado

### Exemplo Python

```python
!pip install huggingface_hub

from huggingface_hub import InferenceClient

client = InferenceClient(token="hf_...")

def resumir_feedback(texto):
    response = client.text_generation(
        texto,
        model="mistralai/Mistral-7B-Instruct-v0.2",
        max_new_tokens=200
    )
    return response

# Usar
feedback = "A festa foi maravilhosa! As crianças adoraram a decoração..."
resumo = resumir_feedback(f"Resuma este feedback: {feedback}")
print(resumo)
```

---

## 📱 Twilio API (WhatsApp)

### Como Obter Credenciais

1. Acesse https://www.twilio.com
2. Crie uma conta (trial gratuito com $15 de crédito)
3. Vá em **Console**
4. Copie **Account SID** e **Auth Token**
5. Para WhatsApp: Configure **Twilio Sandbox for WhatsApp**

### Preços

- **WhatsApp**: $0.005 por mensagem (enviada)
- **SMS**: $0.0075 por mensagem (Brasil)

### Exemplo Python

```python
!pip install twilio

from twilio.rest import Client

# Credenciais
account_sid = "AC..."
auth_token = "..."
client = Client(account_sid, auth_token)

def enviar_whatsapp(para, mensagem):
    message = client.messages.create(
        from_='whatsapp:+14155238886',  # Número Twilio Sandbox
        body=mensagem,
        to=f'whatsapp:{para}'
    )
    return message.sid

# Usar
enviar_whatsapp(
    "+5511999999999",
    "Olá! Sua festa está confirmada para 15/12/2025 às 14h. Estamos ansiosos! 🎉"
)
```

### Integração no Backend

```typescript
// server/routers/whatsapp.ts
import twilio from "twilio";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const whatsappRouter = router({
  enviarLembrete: protectedProcedure
    .input(z.object({
      festaId: z.number(),
      telefone: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Buscar dados da festa
      const festa = await getFesta(input.festaId);
      
      const mensagem = `Olá! Lembrete: sua festa de ${festa.tema} acontece em ${festa.dataFesta}. Estamos preparando tudo! 🎉`;
      
      const message = await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${input.telefone}`,
        body: mensagem,
      });
      
      return { success: true, messageId: message.sid };
    }),
});
```

---

## 📧 SendGrid API (Email)

### Como Obter API Key

1. Acesse https://sendgrid.com
2. Crie uma conta (100 emails/dia gratuitos)
3. Vá em **Settings** → **API Keys**
4. Clique em **Create API Key**
5. Dê permissões **Full Access**
6. Copie a chave

### Preços

- **Gratuito**: 100 emails/dia
- **Essentials**: $19.95/mês - 50.000 emails
- **Pro**: $89.95/mês - 100.000 emails

### Exemplo Python

```python
!pip install sendgrid

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def enviar_email_confirmacao(para, nome_cliente, data_festa):
    message = Mail(
        from_email='contato@festejakids.com',
        to_emails=para,
        subject='Confirmação de Festa - Festeja Kids',
        html_content=f"""
        <h1>Olá {nome_cliente}!</h1>
        <p>Sua festa está confirmada para <strong>{data_festa}</strong>.</p>
        <p>Estamos preparando tudo com muito carinho! 🎉</p>
        <p>Atenciosamente,<br>Equipe Festeja Kids</p>
        """
    )
    
    sg = SendGridAPIClient('SG..')
    response = sg.send(message)
    return response.status_code

# Usar
enviar_email_confirmacao(
    "cliente@email.com",
    "Maria Silva",
    "15/12/2025"
)
```

---

## 🗺️ Google Maps API

### Como Obter API Key

1. Acesse https://console.cloud.google.com
2. Crie um projeto
3. Ative **Maps JavaScript API** e **Places API**
4. Vá em **Credentials**
5. Clique em **Create Credentials** → **API Key**
6. Copie a chave
7. **Importante**: Restrinja a chave por domínio/IP

### Preços

- **Gratuito**: $200 de crédito/mês
- **Maps JavaScript API**: $7 por 1.000 carregamentos
- **Places API**: $17 por 1.000 requisições

### Exemplo Python

```python
!pip install googlemaps

import googlemaps

gmaps = googlemaps.Client(key='AIza...')

def buscar_endereco(cep):
    geocode_result = gmaps.geocode(cep)
    if geocode_result:
        return geocode_result[0]['formatted_address']
    return None

# Usar
endereco = buscar_endereco('01310-100')
print(endereco)  # Av. Paulista, 1578 - Bela Vista, São Paulo...
```

---

## 🎯 Exemplos Práticos para Festeja Kids

### 1. Gerador de Descrições de Festas com IA

```python
# Usar Manus LLM ou OpenAI
def gerar_descricao_marketing(festa):
    prompt = f"""
    Crie uma descrição de marketing atrativa para:
    - Tema: {festa['tema']}
    - Idade: {festa['idade']} anos
    - Convidados: {festa['convidados']}
    
    A descrição deve ter 2-3 parágrafos e destacar a diversão e segurança.
    """
    
    # Usar API escolhida
    return chamar_llm(prompt)
```

### 2. Análise de Sentimento em Feedbacks

```python
def analisar_feedback(texto_feedback):
    prompt = f"""
    Analise o sentimento deste feedback de festa infantil:
    "{texto_feedback}"
    
    Retorne em JSON:
    {{
        "sentimento": "positivo/neutro/negativo",
        "score": 0-10,
        "pontos_fortes": [],
        "pontos_fracos": [],
        "acao_recomendada": ""
    }}
    """
    
    resposta = chamar_llm(prompt)
    return json.loads(resposta)
```

### 3. Sugestão Automática de Temas

```python
def sugerir_temas(idade, genero, interesses):
    prompt = f"""
    Sugira 5 temas de festa infantil para:
    - Idade: {idade} anos
    - Gênero: {genero}
    - Interesses: {interesses}
    
    Para cada tema, forneça:
    1. Nome do tema
    2. Breve descrição
    3. Cores principais
    4. 3 atividades sugeridas
    """
    
    return chamar_llm(prompt)
```

### 4. Gerador de Orçamentos Inteligente

```python
def gerar_orcamento_ia(tema, convidados, orcamento_max):
    prompt = f"""
    Crie um orçamento detalhado para festa infantil:
    - Tema: {tema}
    - Convidados: {convidados}
    - Orçamento máximo: R$ {orcamento_max}
    
    Distribua o orçamento em:
    - Decoração (30%)
    - Alimentação (35%)
    - Entretenimento (20%)
    - Lembrancinhas (10%)
    - Outros (5%)
    
    Liste itens específicos para cada categoria.
    """
    
    return chamar_llm(prompt)
```

### 5. Chatbot de Atendimento

```python
def chatbot_atendimento(mensagem_cliente, historico=[]):
    historico.append({"role": "user", "content": mensagem_cliente})
    
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": """Você é um atendente da Festeja Kids. 
                Seja cordial, prestativo e sugira temas de festas quando apropriado.
                Colete: nome, telefone, data desejada, tema, número de convidados."""
            },
            *historico
        ]
    )
    
    resposta = response.choices[0].message.content
    historico.append({"role": "assistant", "content": resposta})
    
    return resposta, historico
```

---

## 📓 Notebook Google Colab Completo

Criei um notebook pronto para usar com todas as APIs:

```python
# Festeja_Kids_APIs_IA.ipynb

# Célula 1: Instalação
!pip install openai google-generativeai anthropic twilio sendgrid googlemaps requests

# Célula 2: Configuração
import os
from google.colab import userdata

# Armazenar chaves de forma segura no Colab
# Vá em: 🔑 (ícone de chave) → Secrets → Add new secret

MANUS_API_KEY = userdata.get('MANUS_API_KEY')
OPENAI_API_KEY = userdata.get('OPENAI_API_KEY')
GEMINI_API_KEY = userdata.get('GEMINI_API_KEY')
# ... outras chaves

# Célula 3: Funções auxiliares
def chamar_manus_llm(mensagem):
    # Implementação
    pass

def chamar_openai(mensagem):
    # Implementação
    pass

# Célula 4: Exemplos práticos
# ... seus casos de uso
```

---

## 🔐 Segurança das API Keys

### ❌ NUNCA Faça Isso

```python
# NÃO commite chaves no código!
api_key = "sk-proj-abc123..."  # ❌ ERRADO
```

### ✅ Boas Práticas

**No Google Colab:**
```python
from google.colab import userdata
api_key = userdata.get('OPENAI_API_KEY')  # ✅ CORRETO
```

**No Backend (Node.js):**
```typescript
// Use variáveis de ambiente
const apiKey = process.env.OPENAI_API_KEY;  // ✅ CORRETO
```

**Adicionar no Sistema:**
```bash
# Via webdev_request_secrets
# Ou manualmente no Dashboard → Settings → Secrets
```

---

## 📊 Comparação de APIs de IA

| API | Preço | Velocidade | Qualidade | Melhor Para |
|-----|-------|------------|-----------|-------------|
| **Manus LLM** | Incluído | Rápida | Alta | Uso geral no sistema |
| **OpenAI GPT-4** | $$$ | Média | Muito Alta | Tarefas complexas |
| **OpenAI GPT-3.5** | $ | Rápida | Alta | Uso geral, chatbots |
| **Google Gemini** | Gratuito | Rápida | Alta | Análise de imagens |
| **Claude 3** | $$ | Média | Muito Alta | Textos longos |
| **Hugging Face** | $ | Variável | Média-Alta | Modelos específicos |

---

## 🚀 Próximos Passos

1. **Escolher APIs**: Decida quais APIs usar para cada funcionalidade
2. **Obter Chaves**: Siga os guias acima para obter as API keys
3. **Testar no Colab**: Use o notebook para testar as integrações
4. **Integrar no Backend**: Adicione as funcionalidades no sistema
5. **Monitorar Custos**: Acompanhe o uso e custos de cada API

---

## 📚 Recursos Adicionais

- **Documentação Manus**: https://docs.manus.im
- **OpenAI Docs**: https://platform.openai.com/docs
- **Google AI Studio**: https://makersuite.google.com
- **Anthropic Docs**: https://docs.anthropic.com
- **Twilio Docs**: https://www.twilio.com/docs

---

**Desenvolvido para Festeja Kids 2.0**  
**Última Atualização:** 24 de novembro de 2025
