---
task: certify-accessibility-compliance
responsavel: "@dx-accessibility-specialist"
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

# Task: Certify Accessibility Compliance

## Metadata
- **Squad:** squad-design
- **Agent:** Beacon (dx-accessibility-specialist)
- **Complexity:** Complex

## Objetivo
Certificar conformidade de acessibilidade — emitir verdict formal (PASS/CONDITIONAL/FAIL) apos validacao completa, gerando documentacao de compliance.

## Entrada
- A11y audit report completo
- Remediation results
- Re-test results
- Screen reader test reports

## Passos

### 1. Verificar Remediacao
Para cada issue encontrado no audit:
| Issue | Status | Fix Verified? | Re-test Result |
|-------|--------|--------------|---------------|
| C1 | fixed | [yes/no] | [pass/fail] |
| M1 | fixed | [yes/no] | [pass/fail] |

### 2. Re-run Automated Tests
| Ferramenta | Results |
|-----------|---------|
| axe-core | Critical: / Major: / Minor: |
| Lighthouse a11y | /100 |
| pa11y | Issues: |

### 3. Re-run Manual Tests
| Teste | Result |
|-------|--------|
| Keyboard navigation | [pass/fail] |
| Screen reader (NVDA) | [pass/fail] |
| Screen reader (VoiceOver) | [pass/fail] |
| Zoom 200% | [pass/fail] |
| Zoom 400% (reflow) | [pass/fail] |
| Reduced motion | [pass/fail] |
| High contrast | [pass/fail] |
| Text spacing | [pass/fail] |

### 4. Determinar Verdict
| Verdict | Criterio |
|---------|----------|
| **PASS** | 0 critical, 0 major unresolved, Lighthouse >= 95, all manual tests pass |
| **CONDITIONAL** | 0 critical, <= 3 major with documented remediation timeline |
| **FAIL** | Any unresolved critical, OR > 3 unresolved major, OR manual tests failing |

### 5. Gerar Compliance Statement
```yaml
accessibility_certification:
  project: ""
  date: ""
  standard: "WCAG 2.2 Level AA"
  verdict: "[PASS/CONDITIONAL/FAIL]"
  auditor: "Beacon (dx-accessibility-specialist)"

  automated_results:
    axe_critical: 0
    axe_major: 0
    lighthouse_score: 0

  manual_results:
    keyboard: "[pass/fail]"
    screen_reader: "[pass/fail]"
    zoom: "[pass/fail]"
    reduced_motion: "[pass/fail]"

  known_issues:
    - issue: ""
      severity: ""
      remediation_date: ""

  ongoing_monitoring:
    automated_ci: true
    quarterly_audit: true
    user_feedback_channel: true

  statement: |
    Este produto foi auditado contra WCAG 2.2 Level AA e
    [atende/atende parcialmente/nao atende] os criterios de conformidade.
    [Detalhes sobre issues conhecidos e timeline de remediacao.]
```

### 6. Documentar Residual Issues
Se CONDITIONAL:
- Listar todos os issues pendentes
- Timeline de remediacao por issue
- Impact assessment
- Temporary workarounds (se existirem)

### 7. Plano de Monitoramento
- axe-core em CI/CD (bloqueia regressoes)
- Lighthouse CI com threshold
- Quarterly manual audits
- User feedback channel para a11y issues
- Annual full re-certification

## Saida
- Accessibility certification document
- Compliance statement formal
- Residual issues list (se CONDITIONAL)
- Monitoring plan
- **GATE VERDICT: PASS / CONDITIONAL / FAIL**

## Validacao
- [ ] Todos os issues do audit re-verificados
- [ ] Testes automatizados re-executados
- [ ] Testes manuais re-executados
- [ ] Verdict determinado por criterios claros
- [ ] Compliance statement redigida
- [ ] Monitoring plan definido
- [ ] Gate verdict comunicado ao Nexus
