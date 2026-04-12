---
task: write-launch-sequence
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

# Task: Write Launch Sequence

## Metadata
- **Squad:** squad-copy
- **Agent:** conversion-writer (Spark)
- **Complexity:** COMPLEX
- **Depends on:** produto, oferta, audiencia, copy brief
- **Feeds:** persuasion-psychologist (Nudge), headline-specialist (Hook)

## Objetivo
Escrever sequencia completa de lancamento que cria anticipacao, desejo e urgencia — transformando um launch em evento que a audiencia espera ansiosamente. Baseado no Product Launch Formula (Jeff Walker) adaptado.

## Entrada
- Produto/servico sendo lancado
- Data de lancamento
- Oferta e pricing
- Audiencia e awareness level
- Assets disponiveis (video, demo, case studies)

## Passos

### 1. Estrutura do Launch (4 fases)
```
FASE 1: SEED (2-4 semanas antes)
  → Plantar curiosidade, tease, build anticipation

FASE 2: LAUNCH CONTENT (1-2 semanas antes)
  → Educar, criar desejo, eliminar objecoes

FASE 3: OPEN CART (3-7 dias)
  → Oferta aberta, conversao ativa, urgencia real

FASE 4: CLOSE/URGENCY (ultimos 24-48h)
  → Deadline, escassez, ultimo push
```

### 2. Fase 1 — SEED (Anticipacao)
**Emails de tease (3-5 emails):**

**Email Seed 1 — O Anuncio:**
```
Subject: "Algo grande esta chegando..."

[Nome],

Ha [tempo] estou trabalhando em algo especial.
Algo que vai ajudar voce a [resultado].

Ainda nao posso revelar tudo, mas posso dizer:

→ E para [audiencia especifica]
→ Resolve [problema especifico]
→ [Hint de diferenciacao]

Nas proximas semanas, vou compartilhar mais detalhes.
Por enquanto, marque na agenda: [DATA].

Fique de olho,
[Nome]
```

**Email Seed 2 — O Problem Awareness:**
```
Subject: "O problema que ninguem fala sobre [topico]"
[Conteudo educativo que prepara terreno para a solucao]
```

**Email Seed 3 — O Proof:**
```
Subject: "Resultados inesperados de [hint do produto]"
[Case study ou beta tester results]
```

### 3. Fase 2 — LAUNCH CONTENT (Educacao + Desejo)
**PLC — Pre-Launch Content (3 pecas):**

**PLC 1 — A Oportunidade:**
```
Subject: "Por que [topico] esta mudando tudo em [ano]"

Conteudo:
- O shift no mercado/industria
- A oportunidade que existe AGORA
- Por que a maioria perde essa oportunidade
- [Preview do que vem: PLC 2]
```

**PLC 2 — A Transformacao:**
```
Subject: "A transformacao: de [antes] para [depois]"

Conteudo:
- Case study detalhado
- Before/after com numeros
- O framework/metodo por tras
- [Preview do que vem: PLC 3]
```

**PLC 3 — O Mecanismo:**
```
Subject: "Como funciona (revelacao completa)"

Conteudo:
- Mecanismo unico detalhado
- Demo/walkthrough
- FAQ pre-emptive
- [Anuncio: "Amanha abrimos as inscricoes"]
```

### 4. Fase 3 — OPEN CART (Conversao)
**Sequencia de carrinho aberto (5-7 emails):**

**Email Open 1 — A Revelacao:**
```
Subject: "Esta aberto! [Produto] — Acesso liberado"

[Apresentacao completa da oferta]
[Beneficios detalhados]
[Pricing com desconto de lancamento]
[Bonus exclusivos]
[CTA: Garantir Minha Vaga]
```

**Email Open 2 — O Deep Dive:**
```
Subject: "Tudo que voce recebe com [produto]"
[Detalhamento da oferta + bonus + garantia]
```

**Email Open 3 — A Prova:**
```
Subject: "[Nome] ja se inscreveu — veja o que disse"
[Testimonials + social proof de early adopters]
```

**Email Open 4 — A FAQ:**
```
Subject: "As [N] perguntas mais comuns sobre [produto]"
[Objecao handling via FAQ]
```

**Email Open 5 — O Warning:**
```
Subject: "Atencao: [deadline] se aproxima"
[Urgencia + recapitulacao de valor + CTA]
```

### 5. Fase 4 — CLOSE (Urgencia Final)
**Ultimos 24-48h (3-4 emails):**

**Email Close 1 — "24 horas":**
```
Subject: "Ultimas 24 horas para [produto]"
[Resumo de tudo que perde se nao agir]
```

**Email Close 2 — "Ultimas horas":**
```
Subject: "Fechamos em [X] horas"
[Depoimento final + urgencia real]
```

**Email Close 3 — "Ultima chance":**
```
Subject: "[Nome], ultima chance"
[Email pessoal, direto, emocional]
[Recapitula o resultado que pode perder]
```

**Email Close 4 — "Fechou" (pos-close):**
```
Subject: "Inscricoes encerradas"
[Confirma fechamento]
[Para quem nao comprou: waitlist para proxima turma]
[Para quem comprou: welcome + proximos passos]
```

### 6. Metricas do Launch
| Fase | Metrica | Benchmark |
|------|---------|-----------|
| Seed | List growth, open rate | +10% lista, >30% OR |
| PLC | Engagement, replies | >40% OR, >5% reply |
| Open Cart | Conversion rate | 2-5% da lista |
| Close | Revenue % nos ultimos 48h | 30-50% do total |

## Cross-Squad Handoff
```yaml
handoffs:
  - to: headline-specialist (Hook)
    delivers: Subject lines para otimizacao
    format: Sequencia com subject lines para scoring
  - to: squad-growth
    delivers: Launch funnel para tracking
    format: Emails + triggers + revenue targets
  - to: squad-content
    delivers: PLC content para distribuicao
    format: Content pieces + social adaptations
```

## Saida
- Sequencia completa de lancamento (15-20 emails)
- Timeline detalhada (datas e horarios)
- Subject lines com variantes
- PLCs (Pre-Launch Content) scripts
- Metricas-alvo por fase

## Validacao
- [ ] 4 fases completas (Seed → PLC → Open → Close)
- [ ] Anticipacao construida progressivamente
- [ ] PLCs educam E criam desejo
- [ ] Oferta clara e completa no Open Cart
- [ ] Urgencia real (nao fabricada)
- [ ] Timeline realista e respeitosa
- [ ] Metricas por fase definidas
- [ ] Copy post-close para comprador e nao-comprador

---

*Task operada por: conversion-writer (Spark)*
