---
task: create-welcome-sequence
responsavel: "@conversion-writer"
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

# Task: Create Welcome Sequence

## Metadata
- **Squad:** squad-copy
- **Agent:** conversion-writer (Spark)
- **Complexity:** STANDARD
- **Depends on:** produto/servico, onboarding flow, brand voice
- **Feeds:** brand-voice-writer (Tone), squad-growth

## Objetivo
Criar sequencia de welcome emails que transforma novos leads/clientes em usuarios engajados — definindo expectativas, entregando valor imediato e construindo relacionamento desde o primeiro contato.

## Entrada
- Trigger de entrada (signup, compra, download)
- Primeiras acoes desejadas (ativacao)
- Conteudo de valor para entregar
- Brand voice guidelines

## Passos

### 1. Definir Objetivo por Email
| Email | Timing | Objetivo | KPI |
|-------|--------|----------|-----|
| E1 | Imediato | Confirmacao + valor imediato | Open rate |
| E2 | Dia 1-2 | Quick win (primeira vitoria) | Click + ativacao |
| E3 | Dia 3-4 | Educacao + feature discovery | Engagement |
| E4 | Dia 5-7 | Social proof + case | Trust building |
| E5 | Dia 7-10 | Upgrade/CTA principal | Conversao |

### 2. Email 1 — O Welcome (Imediato)
**Objetivo:** Causar boa primeira impressao + entregar o prometido

**Subject:** "Bem-vindo! Aqui esta seu [lead magnet/acesso]"

**Estrutura:**
```
Oi [Nome]! 👋

Seja bem-vindo(a) a [marca].

Aqui esta o que voce pediu:
[LINK/ACESSO para o lead magnet ou produto]

O que esperar:
📧 Nos proximos dias, vou enviar [preview do conteudo]
🎯 Tudo focado em ajudar voce a [resultado principal]
💡 Voce pode responder este email a qualquer momento

Enquanto isso, [1 acao rapida que gera valor]:
[CTA: Comece Aqui]

Ate ja,
[Nome/Marca]

PS: Se tiver qualquer duvida, e so responder este email.
Sim, eu realmente leio as respostas. 😊
```

**Tom:** Caloroso, pessoal, sem venda.

### 3. Email 2 — O Quick Win (Dia 1-2)
**Objetivo:** Primeira vitoria rapida → gerar momentum

**Subject:** "Faça isso em 5 minutos e veja resultados"

**Estrutura:**
```
Oi [Nome],

Ontem voce deu o primeiro passo. Agora, o segundo:

[ACAO SIMPLES em 3-5 passos]

Passo 1: [acao]
Passo 2: [acao]
Passo 3: [acao]

Pronto! Voce acabou de [resultado].

[IMAGEM/GIF mostrando o resultado]

[Testimonial curto]: "[Cliente] fez isso e em [tempo] alcancou [resultado]"

Proximo email: vou mostrar [preview do E3].

[CTA: Fazer Agora]
```

### 4. Email 3 — A Educacao (Dia 3-4)
**Objetivo:** Entregar insight valioso + mostrar expertise

**Subject:** "O erro #1 que [audiencia] comete com [topico]"

**Estrutura:**
```
Oi [Nome],

Sabia que [X]% das pessoas [erro comum]?

Aqui esta o que descobrimos:
[Insight valioso e pratico]

A solucao:
1. [Passo acionavel]
2. [Passo acionavel]
3. [Passo acionavel]

[Se aplicavel: como o produto ajuda com isso]

[CTA: Experimentar Agora]

PS: Amanha compartilho a historia de [Cliente]
que transformou [resultado] usando essa abordagem.
```

### 5. Email 4 — A Prova Social (Dia 5-7)
**Objetivo:** Social proof + build trust

**Subject:** "Como [Cliente] alcançou [resultado especifico]"

**Estrutura:**
```
Oi [Nome],

Quero te apresentar [Cliente].

[Mini customer story - 150-200 palavras]
- Antes: [situacao]
- O que mudou: [acao]
- Resultado: [numeros]

"[Quote direta do cliente]"
— [Nome], [Cargo]

[Se aplicavel: O que [Cliente] usou para isso]

Sera que voce pode ter resultados parecidos?
[CTA: Ver Como]
```

### 6. Email 5 — A Conversao (Dia 7-10)
**Objetivo:** CTA principal (upgrade, compra, agendamento)

**Subject:** "Uma pergunta rapida, [Nome]"

**Estrutura:**
```
Oi [Nome],

Nos ultimos dias voce:
✅ [Recap do valor entregue no E1]
✅ [Recap do quick win do E2]
✅ [Recap do insight do E3]

Se voce quer levar [resultado] ao proximo nivel,
[marca] pode ajudar com:

🎯 [Beneficio 1]
🎯 [Beneficio 2]
🎯 [Beneficio 3]

[Oferta especial para novos membros, se aplicavel]

[CTA: Comecar Agora]

PS: Se nao for o momento certo, sem problema.
Continue recebendo nosso conteudo — e quando
estiver pronto, estaremos aqui.
```

**Tom:** Natural, sem pressao, porta aberta.

## Cross-Squad Handoff
```yaml
handoffs:
  - to: brand-voice-writer (Tone)
    delivers: Welcome sequence para review de voz
    format: Sequencia completa com notas de tom
  - to: squad-growth
    delivers: Sequencia para automacao
    format: Emails + triggers + metricas
```

## Saida
- 5 emails de welcome completos
- Subject lines + preview text
- Timeline e triggers
- Metricas-alvo por email
- Branching logic (se aplicavel)

## Validacao
- [ ] Email 1 entrega imediata (sem venda)
- [ ] Email 2 gera quick win acionável
- [ ] Email 3 educa com insight valioso
- [ ] Email 4 prova social com historia real
- [ ] Email 5 CTA natural (nao agressivo)
- [ ] Cada email tem valor standalone
- [ ] Tom consistente com brand voice
- [ ] Progressao natural de relacionamento
- [ ] Timeline e cadencia otimizadas

---

*Task operada por: conversion-writer (Spark)*
