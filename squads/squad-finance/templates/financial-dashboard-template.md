---
template: financial-dashboard-template
squad: squad-finance
description: "Template de dashboard financeiro executivo"
used_by:
  - generate-executive-dashboard
  - monthly-financial-cycle
  - quarterly-financial-review
---

# Financial Dashboard — {{period}}

## Health Score: {{health_score}}/100 {{health_status}}

---

## 1. Revenue

| Metrica | Valor | Target | Var | Status |
|---------|-------|--------|-----|--------|
| Receita Liquida | R$ {{rl}} | R$ {{rl_target}} | {{rl_var}}% | {{rl_status}} |
| Growth MoM | {{growth_mom}}% | {{growth_target}}% | | {{growth_status}} |
| MRR | R$ {{mrr}} | R$ {{mrr_target}} | | {{mrr_status}} |
| NRR | {{nrr}}% | >=100% | | {{nrr_status}} |
| Maior cliente % | {{top_client_pct}}% | <=15% | | {{conc_status}} |

## 2. Profitability

| Metrica | Valor | Target | Var | Status |
|---------|-------|--------|-----|--------|
| Gross Margin | {{gm}}% | >=50% | | {{gm_status}} |
| EBITDA | R$ {{ebitda}} ({{ebitda_pct}}%) | >=15% | | {{ebitda_status}} |
| Utilizacao | {{util}}% | 75% | | {{util_status}} |
| Rev/Employee | R$ {{rev_emp}} | R$ 20K | | {{rev_emp_status}} |
| Rate Realization | {{rr}}% | >=85% | | {{rr_status}} |

## 3. Cash

| Metrica | Valor | Target | Status |
|---------|-------|--------|--------|
| Saldo Atual | R$ {{saldo}} | | |
| Runway | {{runway}} meses | >=6m | {{runway_status}} |
| DSO | {{dso}} dias | <=45d | {{dso_status}} |
| Collection Rate | {{collection}}% | >=90% | {{collection_status}} |
| AR Total | R$ {{ar_total}} | | |

## 4. Budget

| Metrica | Valor | Target | Status |
|---------|-------|--------|--------|
| Pacing Index | {{pacing}} | 1.0 | {{pacing_status}} |
| Variance YTD | {{variance_ytd}}% | <=5% | {{variance_status}} |
| EAC | R$ {{eac}} | R$ {{budget_anual}} | {{eac_status}} |
| Forecast Accuracy | {{forecast_acc}}% | >=90% | {{forecast_status}} |

## 5. Unit Economics

| Metrica | Valor | Benchmark | Status |
|---------|-------|-----------|--------|
| CAC | R$ {{cac}} | <R$ 8K | {{cac_status}} |
| LTV | R$ {{ltv}} | | |
| LTV:CAC | {{ltv_cac}}:1 | >=3:1 | {{ltv_cac_status}} |
| Payback | {{payback}} meses | <=12m | {{payback_status}} |
| Magic Number | {{magic}} | >=0.75 | {{magic_status}} |

---

## Alertas Ativos

| Severidade | Alerta | Acao | Responsavel |
|-----------|--------|------|-------------|
| {{sev_1}} | {{alerta_1}} | {{acao_1}} | {{resp_1}} |
| {{sev_2}} | {{alerta_2}} | {{acao_2}} | {{resp_2}} |
| {{sev_3}} | {{alerta_3}} | {{acao_3}} | {{resp_3}} |

---

## Executive Summary 3x3

### Destaques Positivos
1. {{destaque_1}}
2. {{destaque_2}}
3. {{destaque_3}}

### Riscos
1. {{risco_1}}
2. {{risco_2}}
3. {{risco_3}}

### Recomendacoes
1. {{recomendacao_1}}
2. {{recomendacao_2}}
3. {{recomendacao_3}}

---

*Dashboard gerado por squad-finance em {{generation_date}}*
