---
template: client-profitability-report-template
squad: squad-finance
description: "Template de report de rentabilidade por cliente"
used_by:
  - analyze-client-profitability
  - client-profitability-audit
---

# Client Profitability Report — {{client_name}}

## Periodo: {{period}}
## Data do Report: {{report_date}}

---

## 1. Resumo Executivo

| Indicador | Valor | Status |
|-----------|-------|--------|
| Receita total | R$ {{receita_total}} | |
| % da receita da empresa | {{pct_receita}}% | {{status_concentracao}} |
| COGS | R$ {{cogs_total}} | |
| Gross Margin | {{gross_margin}}% | {{status_gm}} |
| Custo de servicing | R$ {{servicing}} | |
| Net Margin | {{net_margin}}% | {{status_nm}} |
| DSO medio | {{dso}} dias | {{status_dso}} |
| Lifetime (meses) | {{lifetime}} | |
| **Classificacao** | **{{classificacao}}** | {{star_cow_question_dog}} |

---

## 2. Receita Detalhada

### Por Projeto

| Projeto | Receita | Horas | Rate Efetivo | Gross Margin |
|---------|---------|-------|-------------|-------------|
| {{proj_1}} | R$ {{p1_rev}} | {{p1_hours}} | R$ {{p1_rate}} | {{p1_gm}}% |
| {{proj_2}} | R$ {{p2_rev}} | {{p2_hours}} | R$ {{p2_rate}} | {{p2_gm}}% |
| {{proj_3}} | R$ {{p3_rev}} | {{p3_hours}} | R$ {{p3_rate}} | {{p3_gm}}% |
| **Total** | **R$ {{receita_total}}** | **{{total_hours}}** | **R$ {{avg_rate}}** | **{{gross_margin}}%** |

### Por Tipo

| Tipo | Receita | % |
|------|---------|---|
| Projeto | R$ {{proj_rev}} | {{proj_pct}}% |
| Retainer | R$ {{ret_rev}} | {{ret_pct}}% |
| Consulting | R$ {{cons_rev}} | {{cons_pct}}% |

---

## 3. Custos Detalhados

### COGS

| Rubrica | Valor | % COGS |
|---------|-------|--------|
| Equipe de delivery | R$ {{equipe_delivery}} | {{eq_pct}}% |
| Freelancers | R$ {{freelancers}} | {{fr_pct}}% |
| Ferramentas diretas | R$ {{tools}} | {{tl_pct}}% |
| **Total COGS** | **R$ {{cogs_total}}** | **100%** |

### Custo de Servicing

| Rubrica | Valor |
|---------|-------|
| Account Manager | R$ {{am_cost}} ({{am_hours}}h) |
| Pre-venda | R$ {{presale_cost}} ({{presale_hours}}h) |
| Relacionamento | R$ {{relac_cost}} |
| **Total Servicing** | **R$ {{servicing}}** |

---

## 4. P&L do Cliente

```
Receita Liquida                    R$ {{receita_total}}
(-) COGS                           R$ {{cogs_total}}
────────────────────────────────────────────
Gross Profit                       R$ {{gross_profit}}
Gross Margin                       {{gross_margin}}%

(-) Custo de Servicing             R$ {{servicing}}
(-) Overhead Alocado               R$ {{overhead}}
────────────────────────────────────────────
Net Profit                         R$ {{net_profit}}
Net Margin                         {{net_margin}}%
```

---

## 5. Client Profitability Matrix

```
                    Alta Receita          Baixa Receita
Alta Margem    [  STAR ★  ]          [ QUESTION MARK ? ]
Baixa Margem   [ CASH COW $ ]        [    DOG ✗    ]

Este cliente: {{classificacao}} — {{quadrante_descricao}}
```

---

## 6. Historico de Rentabilidade

| Periodo | Receita | Gross Margin | Net Margin | Tendencia |
|---------|---------|-------------|------------|-----------|
| {{period_1}} | R$ {{p1_rev}} | {{p1_gm}}% | {{p1_nm}}% | |
| {{period_2}} | R$ {{p2_rev}} | {{p2_gm}}% | {{p2_nm}}% | {{trend_2}} |
| {{period_3}} | R$ {{p3_rev}} | {{p3_gm}}% | {{p3_nm}}% | {{trend_3}} |

---

## 7. Recomendacao

**Acao:** {{recomendacao_acao}} (Investir / Renegociar / Expandir / Descontinuar)

**Justificativa:**
{{recomendacao_justificativa}}

**Impacto financeiro estimado:**
{{impacto_financeiro}}

**Proximos passos:**
1. {{passo_1}}
2. {{passo_2}}
3. {{passo_3}}
