---
task: audit-tracking-accuracy
responsavel: "@ga-analytics-engineer"
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

# Task: Audit Tracking Accuracy

## Metadata
- **Squad:** squad-growth
- **Agent:** Signal (ga-analytics-engineer)
- **Complexity:** Standard

## Objetivo
Auditar acuracia do tracking — verificar que eventos estao disparando corretamente, parametros estao completos e dados chegam ao destino com qualidade.

## Entrada
- Tracking plan
- Implemented tracking
- Expected event data
- GA4/GTM access

## Passos

### 1. Audit Methodology
| Metodo | Descricao | Cobertura |
|--------|----------|----------|
| Manual testing | Navegar flows e verificar eventos | Critical flows |
| GTM Preview | Debug mode no GTM | All tags |
| GA4 DebugView | Real-time event verification | GA4 events |
| Automated tests | Playwright/Cypress with dataLayer checks | Regression |
| Cross-reference | Compare source data with GA4 reports | Accuracy |
| Volume check | Compare expected vs actual event counts | Completeness |

### 2. Event Verification Matrix
| Evento | Trigger Correto? | Parametros Completos? | Valores Corretos? | Destino OK? | Status |
|--------|-----------------|---------------------|-------------------|-------------|--------|
| page_view | | | | | |
| sign_up | | | | | |
| login | | | | | |
| form_submit | | | | | |
| purchase | | | | | |
| button_click | | | | | |
| search | | | | | |

### 3. Common Issues Checklist
| Issue | Check | Severity |
|-------|-------|---------|
| Event not firing | Test trigger in GTM Preview | Critical |
| Missing parameters | Check dataLayer push | High |
| Wrong parameter values | Cross-reference with source | High |
| Duplicate events | Check for multiple tags | Medium |
| Consent blocking | Verify consent mode | High |
| Cross-domain broken | Check linker configuration | High |
| PII leaking | Scan parameters for email/phone | Critical |
| Ad blocker impact | Test with/without ad blocker | Medium |

### 4. Accuracy Calculation
```
Accuracy = (Correctly tracked events / Total expected events) × 100

Target: >= 98%

Measurement method:
1. Select 100 test interactions across all critical flows
2. Verify each interaction generates correct event(s)
3. Check parameters match expected values
4. Calculate accuracy percentage
```

### 5. Audit Report Template
```yaml
audit_report:
  date: ""
  auditor: "Signal"
  scope: "All critical events"

  summary:
    total_events_tested: 100
    correctly_tracked: 98
    accuracy: "98%"
    verdict: "PASS"

  issues_found:
    - event: "form_submit"
      issue: "Missing time_to_complete_ms parameter"
      severity: "Medium"
      fix: "Add timer to form component"
      status: "Open"

  recommendations:
    - "Add automated tracking tests to CI"
    - "Schedule quarterly re-audit"
```

## Saida
- Tracking accuracy report
- Event verification matrix
- Issues list with severity
- Recommendations
- Accuracy score (%)

## Validacao
- [ ] Todos os eventos criticos testados
- [ ] Accuracy >= 98%
- [ ] Issues identificados com severity
- [ ] Nenhum PII detectado
- [ ] Consent mode funcional
- [ ] Cross-domain verificado
- [ ] Recomendacoes documentadas
