---
task: conduct-deal-review
responsavel: "@commercial-orqx"
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

# Task: Conduct Deal Review

## Metadata
- **Squad:** squad-commercial
- **Agent:** Pipeline (commercial-orqx)
- **Complexity:** Standard

## Objetivo
Conduzir deal review — inspecao rigorosa de oportunidades no pipeline para garantir qualificacao adequada, forecast accuracy e velocidade de progressao.

## Entrada
- Pipeline snapshot from CRM
- Deal MEDDIC scores
- Stage duration data
- Activity logs

## Passos

### 1. Deal Inspection Criteria
| Dimensao | Pergunta | Red Flag |
|----------|---------|----------|
| **Qualification** | MEDDIC score >= 5/8? | Score < 4 |
| **Champion** | Champion confirmado e engajado? | No champion identified |
| **Economic Buyer** | EB encontrado? Interagiu? | EB not engaged |
| **Timeline** | Data de decisao definida? | No clear timeline |
| **Competition** | Competidores mapeados? | Unknown competition |
| **Next Step** | Proximo passo concreto e datado? | Vague next steps |
| **Stale** | Deal parado ha mais de 2x avg cycle? | Stale > 2x average |

### 2. Pipeline Inspection Template
| Deal | Value | Stage | Age | MEDDIC | Next Step | Verdict |
|------|-------|-------|-----|--------|-----------|---------|
| | R$ | | days | /8 | | Advance/Hold/Kill |

### 3. Deal Verdicts
| Verdict | Action |
|---------|--------|
| **Advance** | Deal is healthy, continue execution |
| **Hold** | Missing criteria, specific actions needed before next step |
| **Accelerate** | Deal is healthy but slow, compress timeline |
| **Kill** | Unqualified, remove from pipeline, document reason |
| **Escalate** | Needs executive involvement or cross-functional support |

### 4. Forecast Category Review
| Category | Criteria | Deals | Value |
|----------|---------|-------|-------|
| Commit | 90%+ probability, verbal commit from EB | | R$ |
| Best Case | 50-90%, qualified but pending | | R$ |
| Pipeline | <50%, early or mid-stage | | R$ |
| Omitted | Stale or unqualified | | R$ |

## Saida
- Deal review notes per opportunity
- Verdicts assigned (Advance/Hold/Kill/Accelerate)
- Forecast categories updated
- Action items for each held/escalated deal

## Validacao
- [ ] All deals above $X threshold reviewed
- [ ] Stale deals identified and actioned
- [ ] Forecast categories reflect reality
- [ ] Next steps concrete and dated for all active deals
