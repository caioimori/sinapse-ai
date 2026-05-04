---
task: define-ai-voice-guidelines
responsavel: "@brand-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Define AI Voice & Chatbot Brand Guidelines

> Definir guidelines para voz da marca em interfaces de IA, chatbots e assistentes virtuais.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-strategist (Athena) |
| **Co-agents** | brand-sonic-designer (Echo) voz sintetizada, brand-culture-architect (Ethos) tom e valores |
| **Trigger** | Quando marca implementa chatbot, assistente virtual, ou qualquer interface de IA |
| **Input** | Tom de voz, personalidade de marca, message house, personas |
| **Output** | `ai-voice-guidelines.md` |
| **Handoff** | → brand-compiler (Atlas) para inclusão no brandbook |
| **Referências** | Erika Hall "Conversational Design", Google Conversation Design Guidelines, Amazon Alexa Design Guidelines |

---

## Fundamentação

Com a ascensão de LLMs, chatbots e assistentes de voz, a marca precisa de guidelines específicas para interações conversacionais com IA. A "voz" de um chatbot é frequentemente o primeiro (e mais frequente) contato do consumidor com a marca. Uma IA sem personalidade de marca definida soa genérica; uma IA mal calibrada pode destruir brand equity.

```
       BRAND VOICE
           │
     ┌─────┼─────┐
     │     │     │
   Human  AI   Written
   Voice  Voice  Voice
     │     │     │
  Vendas  Bot   Copy
  Atend.  Chat  Docs
  Vídeo   VA    Social
```

---

## Steps

### Step 1: Definir Persona da IA
A IA da marca precisa de uma persona própria (sub-persona da marca):

| Pergunta | Resposta |
|----------|---------|
| A IA tem nome? | {nome ou "sem nome, apenas a marca"} |
| A IA tem avatar/representação visual? | {sim/não, descrição} |
| A IA se identifica como IA? | {sempre/quando perguntada/nunca} |
| Qual a "idade" da persona IA? | {faixa de maturidade} |
| A IA usa humor? | {nunca/sutilmente/frequentemente} |
| A IA usa emojis? | {nunca/pontuais/frequentes} |
| A IA tem gênero? | {neutro/masculino/feminino} |
| A IA tuteia ou trata formalmente? | {tu/você/senhor(a)} |

**Regras de identidade:**
- A IA NUNCA finge ser humana (ética)
- A IA SEMPRE pode escalar para humano quando solicitado
- A IA representa os valores da marca em TODAS as interações

### Step 2: Calibrar Tom de Voz para Conversação

**Adaptação do tom da marca para formato conversacional:**

| Dimensão | Tom da Marca | Tom da IA | Exemplo |
|----------|-------------|-----------|---------|
| Formalidade | {formal/casual} | {ajustar para conversação} | Marca formal → IA levemente menos formal |
| Extensão | {conciso/detalhado} | Sempre conciso primeiro, expandir se solicitado | "Posso explicar mais?" |
| Técnico | {especialista/acessível} | Acessível, técnico quando relevante | Adaptar ao nível do usuário |
| Empático | {caloroso/neutro} | Sempre empático em suporte | "Entendo a frustração" |
| Proativo | {reativo/proativo} | Proativo com limites | Sugerir, não impor |

**Escalas de Tom por Contexto:**

| Contexto | Caloroso ←→ Profissional | Casual ←→ Formal | Detalhado ←→ Conciso |
|----------|--------------------------|-------------------|----------------------|
| Boas-vindas | ●●●●○ | ●●●○○ | ○○●●● |
| Suporte | ●●●●● | ●●○○○ | ●●●○○ |
| Vendas | ●●●○○ | ●●●○○ | ●●○○○ |
| FAQ | ●●○○○ | ●●●●○ | ○○●●● |
| Erro/problema | ●●●●● | ●●○○○ | ●●●●○ |
| Confirmação | ●●○○○ | ●●●○○ | ○○○●● |

### Step 3: Criar Script Templates por Cenário

**Saudação:**
```
Primeira vez: "{Saudação}! Sou {nome/marca}. {proposta de valor em 1 frase}. Como posso ajudar?"
Retorno: "{Saudação}, {nome se disponível}! Bom ter você de volta. Em que posso ajudar?"
```

**Não entendi:**
```
Nível 1: "Não entendi completamente. Pode reformular?"
Nível 2: "Ainda não consegui entender. Quer tentar de outro jeito, ou prefere falar com alguém da equipe?"
Nível 3: "Vou conectar você com alguém da equipe que pode ajudar melhor. {handoff}"
```

**Erro/Problema:**
```
Reconhecimento: "Entendo que {problema}. Vou resolver isso."
Transparência: "{Explicação clara do que aconteceu}."
Solução: "{Passos concretos}."
Follow-up: "Resolvemos? Precisa de mais alguma coisa?"
```

**Escalação para humano:**
```
"Vou transferir para {nome/equipe} que pode ajudar melhor com isso. {Contexto que será passado}. Um momento."
```

**Fora do escopo:**
```
"Essa não é minha especialidade, mas posso {alternativa}. Ou prefere que eu conecte com alguém?"
```

### Step 4: Definir Vocabulário e Restrições

**Glossário da IA:**

| Usar | Evitar | Justificativa |
|------|--------|-------------|
| {palavra aprovada} | {palavra proibida} | {por que} |
| "Entendo" | "Eu sei como você se sente" | IA não sente |
| "Vou verificar" | "Não sei" | Proatividade |
| "Posso ajudar com" | "Não é minha responsabilidade" | Prestatividade |
| {saudação da marca} | "Olá, como vai?" (genérico) | Brand voice |

**Restrições absolutas (NEVER):**

| Restrição | Razão |
|-----------|-------|
| Nunca fingir ser humano | Ética, confiança |
| Nunca dar opinião pessoal | IA não tem opinião |
| Nunca fazer promessas que não pode cumprir | Confiança |
| Nunca compartilhar dados de outros usuários | Privacidade |
| Nunca responder sobre política, religião (salvo se relevante à marca) | Risco |
| Nunca usar linguagem discriminatória | Ética |
| Nunca inventar informações | Credibilidade |
| Nunca ignorar pedido de falar com humano | UX |

### Step 5: Definir UX Conversacional

| Elemento | Guideline |
|----------|----------|
| Comprimento de resposta | Máx. 3 frases por mensagem. Oferecer "quer saber mais?" |
| Tempo de resposta | <3s (percebido). Typing indicator se >2s |
| Botões/Quick replies | Oferecer sempre que possível (reduzir typing) |
| Carrosséis | Máx. 5 opções por carrossel |
| Rich cards | Imagem + título + CTA. Seguir visual guidelines |
| Fallback | Após 2 não-entendimentos → oferecer humano |
| Confirmação | Repetir dados críticos (pedido, pagamento, endereço) |
| Handoff humano | Preservar contexto completo da conversa |
| Horário fora do expediente | IA opera 24/7. Humano conforme horário. Informar SLA |
| Feedback | Pedir rating ao final: "Essa ajuda foi útil?" |

### Step 6: Voice Guidelines (Assistentes de Voz)
Para marcas com interface de voz (Alexa Skills, Google Actions, IVR):

| Elemento | Spec |
|----------|------|
| Voice persona | {mesmo da IA text, adaptado para spoken} |
| Velocidade de fala | {palavras por minuto: 120-150 wpm} |
| Pausas | {0.5s entre frases, 1s entre tópicos} |
| Confirmação | Repetir dados críticos em voz |
| Cancelamento | "OK, cancelado" (sempre respeitar) |
| Erro | "Não entendi. [reformular pergunta]" |
| Wake word | {se proprietário} |
| TTS voice | {referência: voz sintetizada, age, gender, accent} |

**Voice vs Text adaptações:**

| Aspecto | Text Chat | Voice |
|---------|-----------|-------|
| Comprimento | Pode ser mais detalhado | Mais curto (working memory) |
| Formatação | Markdown, listas, links | Sem formatação (spoken) |
| Confirmação | "Confirme: [dados]" button | "Você disse [dados]. Correto?" |
| Navegação | Botões, links | "Diga 1 para... ou 2 para..." |
| Emoção | Emojis (se aprovado) | Prosódia, tom de voz |

### Step 7: Definir Métricas de Qualidade

| Métrica | Target | Como Medir |
|---------|--------|-----------|
| CSAT da interação | ≥4.2/5 | Rating pós-conversa |
| Resolution rate | ≥70% | % resolvido sem humano |
| Escalation rate | ≤30% | % transferido para humano |
| Brand consistency score | ≥90% | Audit amostral de conversas |
| Avg. response time | <3s | Log técnico |
| Conversation completion | ≥80% | % que completa o fluxo |
| Sentiment analysis | ≥70% positivo | NLP em conversas |
| Off-brand responses | <2% | Audit + monitoring |

### Step 8: Handoff
```yaml
handoff:
  to: brand-compiler (Atlas)
  artifact: ai-voice-guidelines.md
  context: "Guidelines completos de voz da marca em IA com persona, tom, scripts, vocabulário e métricas"
  also_to:
    - brand-sonic-designer (Echo): "Voz sintetizada alinhada com sonic identity"
    - brand-culture-architect (Ethos): "Valores refletidos na IA"
    - brand-strategist (Athena): "Alinhamento com tom de voz geral"
  next: "Atlas inclui no brandbook como capítulo de AI & Conversational Brand"
```
