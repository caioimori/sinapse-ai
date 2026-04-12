---
task: write-email-sequence
responsavel: "@email-sequence-strategist"
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

# Task: Write Email Sequence

## Metadata
- **Squad:** squad-copy
- **Agent:** email-sequence-strategist (Drip)
- **Complexity:** COMPLEX
- **Depends on:** copy brief, audience persona, message hierarchy, funnel context
- **Feeds:** copy-editor (Chisel), persuasion-psychologist (Nudge)

## Objetivo
Escrever sequencia de emails completa — soap opera, launch, nurture ou re-engagement — com arco narrativo coerente, subject lines otimizadas e behavioral triggers. Cada email e um episodio que cria antecipacao para o proximo e move o lead pelo funil.

## Entrada
- Tipo de sequencia (soap opera, launch, nurture, re-engagement)
- Audiencia e awareness level
- Objetivo final (conversao desejada)
- Produto/servico e key benefits
- Objecoes mapeadas
- Trigger de entrada na sequencia

## Passos

### 1. Selecionar Framework da Sequencia
| Tipo | Framework | Emails | Cadencia |
|------|-----------|--------|----------|
| Soap Opera | Andre Chaperon — 5-act story structure | 5-8 | Diario |
| Launch | Jeff Walker — Seed/Pre-launch/Launch/Close | 8-15 | Variavel |
| Nurture | Awareness progression — Problem → Most Aware | 8-12 | 2-3x/semana |
| Re-engagement | Pattern interrupt + value + ultimatum | 3-5 | Cada 2-3 dias |
| Daily | Ben Settle — Infotainment + soft pitch | Ongoing | Diario |

### 2. Desenhar Arco Narrativo
- Definir personagem principal e Epiphany Bridge
- Mapear progressao emocional (dor → esperanca → confianca → acao)
- Criar open loops entre emails (curiosidade que so se resolve no proximo)
- Planejar pattern interrupts para manter engagement
- Garantir que cada email tem valor standalone + conexao com sequencia

### 3. Escrever Subject Lines (3 variacoes por email)
**Formulas de subject line:**
- Curiosidade: "O erro que [X] nao sabe que esta cometendo"
- Beneficio: "Como [resultado] em [prazo]"
- Story: "A historia de [pessoa] que [resultado]"
- Urgencia: "[N] horas para [oportunidade]"
- Contraintuitivo: "Por que [conselho comum] esta sabotando voce"

**Preview text:** Complementar (NUNCA repetir) a subject line

### 4. Escrever Cada Email
**Estrutura padrao:**
```
SUBJECT LINE + PREVIEW TEXT
OPENING (2-3 linhas) — Hook imediato
BODY (200-500 palavras) — 1 ideia principal
TRANSITION — Ponte natural para CTA
CTA — 1 acao clara e especifica
PS — Reforco ou antecipacao do proximo email
```

### 5. Definir Behavioral Triggers e Branching
- Quem abriu mas nao clicou → reenvio com novo subject
- Quem clicou → avanca para proximo estagio
- Quem nao abriu 3+ emails → sequencia de re-engagement
- Quem respondeu → flag para equipe de vendas
- Quem converteu → sair da sequencia, entrar em onboarding

### 6. Mapear Metricas-Alvo
| Email | Open Rate | Click Rate | Reply Rate |
|-------|-----------|------------|------------|
| Email 1 (Welcome) | >40% | >8% | >2% |
| Emails 2-5 (Nurture) | >25% | >3% | >1% |
| Emails 6-8 (Oferta) | >20% | >5% | — |
| Ultimo (Deadline) | >30% | >8% | — |

## Cross-Squad Handoff
```yaml
handoffs:
  - to: conversion-writer (Spark)
    delivers: Emails de conversao para review de CTA
    format: Copy completa com intencao por email
  - to: persuasion-psychologist (Nudge)
    delivers: Sequencia para review de progressao persuasiva
    format: Sequencia completa com arco narrativo mapeado
```

## Saida
- Sequencia completa (3-15 emails conforme tipo)
- Subject lines (3 variacoes por email) + preview texts
- Arco narrativo documentado
- Branching logic e behavioral triggers
- Metricas-alvo por email

## Validacao
- [ ] Framework correto para objetivo da sequencia
- [ ] Arco narrativo coerente (nao emails isolados)
- [ ] Open loops entre emails criando antecipacao
- [ ] Subject lines com 3 variacoes por email
- [ ] 1 ideia principal por email (nao sobrecarregar)
- [ ] CTA claro e unico em cada email
- [ ] PS utilizado estrategicamente
- [ ] Behavioral triggers e branching definidos
- [ ] Progressao de awareness mapeada
- [ ] Metricas-alvo realistas por estagio

---

*Task operada por: email-sequence-strategist (Drip)*
