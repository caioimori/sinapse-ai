---
task: formulate-test-hypotheses
responsavel: "@ga-cro-specialist"
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

# Task: Formulate Test Hypotheses

## Metadata
- **Squad:** squad-growth
- **Agent:** Convert (ga-cro-specialist)
- **Complexity:** Standard

## Objetivo
Formular hipoteses de teste estruturadas — transformar insights e friction points em hipoteses testaveise priorizadas por ICE/PIE scoring.

## Entrada
- CRO audit findings
- Friction points identified
- Funnel analysis
- Qualitative research insights

## Passos

### 1. Hypothesis Framework
```
IF we [change/add/remove this]
THEN [this metric] will [increase/decrease]
BECAUSE [data-supported reasoning]
```

**Exemplo:**
```
IF we simplify the signup form from 8 to 4 fields
THEN the form completion rate will increase by 20%
BECAUSE heatmap data shows 45% of users abandon after field 5,
and industry benchmarks show 4-field forms convert 25% higher
```

### 2. Hypothesis Template
| Campo | Descricao |
|-------|----------|
| ID | H-001 |
| Hypothesis | IF... THEN... BECAUSE... |
| Primary metric | Metric to measure success |
| Secondary metrics | Supporting metrics to watch |
| Guardrail metrics | Metrics that should NOT degrade |
| Evidence | Data supporting the hypothesis |
| Variant description | What changes in the variant |
| Target page/flow | Where the test runs |
| ICE Score | Impact × Confidence × Ease |

### 3. ICE Scoring Framework
| Dimensao | 1-3 (Low) | 4-7 (Medium) | 8-10 (High) |
|----------|----------|-------------|------------|
| Impact | Minor metric move | Moderate improvement | Major conversion lift |
| Confidence | Gut feeling | Some data support | Strong data + precedent |
| Ease | Complex, multi-team | Moderate effort | Quick, single change |

### 4. Hypothesis Backlog (Prioritized)
| ID | Hypothesis (short) | Impact | Confidence | Ease | ICE | Priority |
|----|-------------------|--------|-----------|------|-----|---------|
| H-001 | Simplify signup form | 8 | 7 | 9 | 504 | P1 |
| H-002 | Add social proof to LP | 6 | 8 | 8 | 384 | P2 |
| H-003 | Redesign pricing page | 9 | 5 | 4 | 180 | P3 |
| H-004 | | | | | | |

### 5. Hypothesis Quality Checklist
| Criterio | Check |
|----------|-------|
| Data-supported | Evidence cited, not opinion |
| Specific metric | Clear primary metric defined |
| Measurable | Can calculate lift and significance |
| Testable | Can create meaningful variant |
| Time-bound | Reasonable test duration estimated |
| No multiple variables | Tests ONE change at a time |
| Guardrails defined | Won't harm other key metrics |

## Saida
- Hypothesis backlog (prioritized)
- ICE scores for each hypothesis
- Evidence documentation per hypothesis
- Hypothesis quality validation

## Validacao
- [ ] Hipoteses seguem formato IF/THEN/BECAUSE
- [ ] Cada hipotese tem evidence documental
- [ ] ICE score calculado
- [ ] Backlog priorizado por ICE
- [ ] Guardrail metrics definidos
- [ ] Quality checklist passado para top 5
