---
task: certify-statistical-validity
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

# Task: Certify Statistical Validity

## Metadata
- **Squad:** squad-growth
- **Agent:** Convert (ga-cro-specialist)
- **Complexity:** Standard

## Objetivo
Certificar validade estatistica — garantir que resultados de experimentos sao confiaveise que decisoes sao tomadas com rigor estatistico adequado.

## Entrada
- Experiment results data
- Sample size calculations
- Statistical test outputs

## Passos

### 1. Statistical Validity Checklist
| Check | Criterio | Status | Nota |
|-------|---------|--------|------|
| Sample size adequate | >= calculated minimum | | |
| Test duration | >= 14 days, full weeks | | |
| No SRM | Ratio within 1% of expected | | |
| Significance level | p < 0.05 (α = 0.05) | | |
| Statistical power | >= 80% (β = 0.20) | | |
| Effect size | Within MDE expectations | | |
| Multiple comparisons | Correction applied if needed | | |
| Novelty effect | Checked (segment by new/return) | | |
| External validity | No major external events | | |

### 2. Common Statistical Pitfalls
| Pitfall | Descricao | Prevencao |
|---------|----------|----------|
| Peeking | Checking results too early and stopping | Pre-set duration, sequential testing |
| SRM | Unequal traffic split | Check ratio before analyzing |
| Multiple testing | Too many metrics → false positives | Bonferroni correction |
| Simpson's Paradox | Overall effect differs from segments | Always check segments |
| Novelty effect | New design gets temporary boost | Segment new vs returning |
| Selection bias | Non-random exposure | Verify randomization |
| Survivor bias | Only analyzing completing users | Include all exposed users |
| HIPPO | Highest Paid Person's Opinion | Data > opinion |

### 3. Certification Verdict
| Verdict | Criterio |
|---------|---------|
| **CERTIFIED** | All checklist items pass, result is statistically valid |
| **CONDITIONAL** | Minor issues (borderline p-value 0.05-0.10), proceed with caution |
| **INVALID** | Major issues (SRM, insufficient sample, external factors) |
| **NEEDS EXTENSION** | Insufficient sample, extend test duration |

### 4. Certification Document
```yaml
statistical_certification:
  experiment_id: "EXP-{number}"
  certified_by: "Convert"
  date: ""

  verdict: "CERTIFIED/CONDITIONAL/INVALID"

  checks:
    sample_size: { required: 30000, actual: 32500, pass: true }
    duration: { required: "14 days", actual: "21 days", pass: true }
    srm_check: { expected: "50/50", actual: "49.8/50.2", pass: true }
    p_value: { threshold: 0.05, actual: 0.003, pass: true }
    power: { threshold: 0.80, actual: 0.92, pass: true }
    external_events: { any: false, pass: true }

  confidence_statement: >
    With 95% confidence, the variant produces a conversion rate
    between X% and Y% higher than control.

  recommendation: "Implement variant / Keep control / Extend test"
```

## Saida
- Statistical certification document
- Validity checklist results
- Confidence statement
- Recommendation

## Validacao
- [ ] Todos os checks de validade executados
- [ ] SRM verificado (sem mismatch)
- [ ] Sample size adequado
- [ ] Duration suficiente
- [ ] p-value < 0.05 (se significant)
- [ ] Certification verdict emitido
- [ ] Confidence statement redigido
