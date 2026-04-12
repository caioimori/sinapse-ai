---
task: analyze-experiment-results
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

# Task: Analyze Experiment Results

## Metadata
- **Squad:** squad-growth
- **Agent:** Convert (ga-cro-specialist)
- **Complexity:** Complex

## Objetivo
Analisar resultados de experimento — verificar validade estatistica, analisar segmentos, documentar learnings e fazer recomendacao de implementacao.

## Entrada
- Experiment data (full duration)
- Experiment brief
- Sample size requirements met
- Segmentation dimensions

## Passos

### 1. Data Quality Checks
| Check | Status | Note |
|-------|--------|------|
| Sample Ratio Mismatch (SRM) | | Expected 50/50, actual? |
| Minimum sample reached | | Per-variant minimum |
| Full week cycles | | No partial weeks |
| No external events | | No promotions, PR, outages |
| Tracking accuracy | | Events firing correctly |

**SRM Check:** If actual split deviates > 1% from expected, investigate before analyzing.

### 2. Overall Results
| Metric | Control | Variant | Lift | p-value | CI (95%) | Significant? |
|--------|---------|---------|------|---------|----------|-------------|
| Primary metric | | | +X% | | [lower, upper] | Yes/No |
| Secondary 1 | | | | | | |
| Secondary 2 | | | | | | |
| Guardrail 1 | | | | | | |
| Guardrail 2 | | | | | | |

### 3. Segmented Analysis
| Segment | Control CR | Variant CR | Lift | Significant? |
|---------|-----------|-----------|------|-------------|
| Desktop | | | | |
| Mobile | | | | |
| New users | | | | |
| Return users | | | | |
| Organic traffic | | | | |
| Paid traffic | | | | |

### 4. Statistical Interpretation
| Aspecto | Valor | Interpretacao |
|---------|-------|-------------|
| p-value | | < 0.05 = significant |
| Confidence interval | | Range of true effect |
| Effect size | | Practical significance |
| Power achieved | | >= 80% adequate |
| MDE detected | | Within expected range |
| Bayesian probability | | % chance variant is better |

### 5. Verdict
| Verdict | Criterio | Acao |
|---------|---------|------|
| **WINNER** | p < 0.05, lift > 0, guardrails OK | Implement variant |
| **LOSER** | p < 0.05, lift < 0 | Keep control, learn |
| **INCONCLUSIVE** | p >= 0.05 | Extend test, redesign, or accept null |
| **CONDITIONAL** | Primary wins, guardrail concern | Implement with monitoring |

### 6. Learnings Documentation
```yaml
experiment_learning:
  id: "EXP-{number}"
  hypothesis: ""
  result: "Winner/Loser/Inconclusive"
  primary_lift: "+X%"
  statistical_significance: "Yes/No"

  key_learnings:
    - "What we learned"
    - "Unexpected findings"
    - "Segment differences"

  implications:
    - "How this informs future tests"
    - "Related hypotheses to test"
    - "Process improvements"

  next_steps:
    - "Implement winner / Keep control"
    - "Follow-up experiment ideas"
    - "Monitoring plan post-implementation"
```

## Saida
- Experiment results report
- Statistical analysis with p-values and CIs
- Segmented results
- Verdict and recommendation
- Learnings document

## Validacao
- [ ] Data quality checks passados (no SRM)
- [ ] Significancia estatistica avaliada
- [ ] Segmented analysis completa
- [ ] Guardrail metrics verificados
- [ ] Verdict emitido com evidencia
- [ ] Learnings documentados
- [ ] Knowledge base atualizada
