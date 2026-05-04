---
task: conduct-data-quality-gate
responsavel: "@growth-orqx"
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

# Task: Conduct Data Quality Gate

## Metadata
- **Squad:** squad-growth
- **Agent:** Catalyst (growth-orqx)
- **Complexity:** Standard

## Objetivo
Conduzir gate de qualidade de dados — verificar que tracking, event data e pipelines atendem ao standard minimo de qualidade antes de permitir analise e experimentacao.

## Entrada
- Tracking implementation
- Event data samples
- Data pipeline outputs
- Quality thresholds

## Passos

### 1. Data Quality Dimensions
| Dimensao | Metrica | Target | Medida |
|----------|---------|--------|--------|
| Accuracy | Event data matches reality | >= 98% | Spot check 100 events |
| Completeness | All required fields present | >= 95% | Check null rates per event |
| Consistency | Same event = same format | 100% | Schema validation |
| Timeliness | Data arrives within SLA | < 5 min delay | Latency monitoring |
| Uniqueness | No duplicate events | < 0.1% duplication | Dedup check |
| Validity | Values within expected ranges | 100% | Range/format validation |

### 2. Critical Events Verification
| Event | Expected | Actual | Match? | Issues |
|-------|----------|--------|--------|--------|
| page_view | On every page load | | | |
| click (CTA) | On button clicks | | | |
| form_submit | On form submission | | | |
| purchase | On transaction | | | |
| sign_up | On registration | | | |
| login | On authentication | | | |

### 3. Privacy Compliance Check
| Check | Status |
|-------|--------|
| Consent collected before tracking | |
| PII not sent to analytics | |
| Data retention policy configured | |
| User opt-out functional | |
| Cross-domain consent consistent | |
| Server-side filtering active | |

### 4. Gate Verdict
| Verdict | Criterio | Acao |
|---------|---------|------|
| **PASS** | Accuracy >= 98%, all critical events OK, privacy compliant | Proceed to analysis |
| **CONDITIONAL** | Minor issues (95-98% accuracy), non-critical gaps | Fix within 1 week |
| **FAIL** | Accuracy < 95%, critical events missing, privacy issues | Block, fix immediately |

## Saida
- Data quality report
- Event verification matrix
- Privacy compliance status
- Gate verdict (PASS/CONDITIONAL/FAIL)

## Validacao
- [ ] Accuracy >= 98%
- [ ] Completeness >= 95%
- [ ] All critical events verificados
- [ ] Zero PII em analytics
- [ ] Consent management funcional
- [ ] Gate verdict emitido
