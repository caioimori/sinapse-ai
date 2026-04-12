---
task: adapt-for-twitter-threads
responsavel: "@platform-specialist"
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

# Task: Adapt for Twitter/X Threads

> Adaptar conteudo para formato e cultura do Twitter/X.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Trigger** | Conteudo que precisa formato Twitter/X |
| **Input** | Conteudo original, Template Contract Twitter/X |
| **Output** | Thread ou tweet adaptado com formato, tom e hashtags |
| **Handoff** | → content-governor (Index) para validacao |
| **Complexity** | simple |

---

## Fundamentacao

Twitter/X e a plataforma de conversas em tempo real e thought leadership conciso. O limite de 280 caracteres forca clareza radical. Threads permitem profundidade mantendo a brevidade por tweet. O algoritmo favorece: replies/quotes (conversacao), bookmarks, e impressoes no primeiro tweet. Referencia: Dickie Bush — Twitter/X growth, Ship 30 for 30.

---

## Steps

### Step 1: Adaptar para Brevidade
Cada tweet maximo 280 chars. Idealmente 200-240 para legibilidade. Remover palavras desnecessarias. Cada palavra deve justificar sua presenca.

### Step 2: Adaptar Tom
Twitter/X e direto, opiniativo, conversacional. Tom assertivo funciona melhor que tom educado. "Isso e o que eu penso" > "Talvez poderiamos considerar".

### Step 3: Formatar Thread
Primeiro tweet: hook + promessa (com indicador de thread). Tweets intermediarios: 1 ponto por tweet, numerados. Ultimo tweet: resumo + CTA (RT tweet 1).

### Step 4: Incluir Engagement Hooks
Reply bait no ultimo tweet. Perguntas que geram quote tweets. Afirmacoes que geram "concordo" publico.

### Step 5: Handoff

```yaml
handoff:
  artifact: "twitter-adaptation-{peca}.md"
  context: "Adaptado para Twitter/X: {N} tweets, hook tipo '{tipo}'"
  next: "content-governor (Index) para validacao"
```
