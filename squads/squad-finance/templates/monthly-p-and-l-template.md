---
template: monthly-p-and-l-template
squad: squad-finance
description: "Template de P&L mensal para agencias digitais"
used_by:
  - run-monthly-p-and-l
  - monthly-financial-cycle
---

# P&L Mensal — {{month}} {{year}}

## Resumo Executivo

| Indicador | {{month}} | Mes Anterior | Var MoM | Budget | Var Budget | Status |
|-----------|-----------|-------------|---------|--------|-----------|--------|
| Receita Liquida | R$ {{rl}} | R$ {{rl_prev}} | {{var_mom}}% | R$ {{rl_budget}} | {{var_budget}}% | {{status}} |
| Gross Margin | {{gm}}% | {{gm_prev}}% | {{gm_var}}pp | {{gm_target}}% | {{gm_var_b}}pp | {{status}} |
| EBITDA | R$ {{ebitda}} | R$ {{ebitda_prev}} | {{ebitda_var}}% | R$ {{ebitda_budget}} | {{ebitda_var_b}}% | {{status}} |
| EBITDA % | {{ebitda_pct}}% | {{ebitda_pct_prev}}% | | {{ebitda_pct_target}}% | | {{status}} |

---

## P&L Detalhado

```
RECEITA BRUTA                               R$ {{rb}}
  (-) ISS                                   R$ {{iss}}
  (-) PIS                                   R$ {{pis}}
  (-) COFINS                                R$ {{cofins}}
─────────────────────────────────────────────────────
RECEITA LÍQUIDA                             R$ {{rl}}

CUSTO DOS SERVIÇOS (COGS)
  Folha de Delivery (loaded)                R$ {{folha_delivery}}
  Freelancers e Terceirizados               R$ {{freelancers}}
  Ferramentas Diretas de Projeto            R$ {{tools_diretas}}
  Infra Direta (hosting, APIs)              R$ {{infra_direta}}
─────────────────────────────────────────────────────
TOTAL COGS                                  R$ {{cogs}}

═════════════════════════════════════════════════════
LUCRO BRUTO (Gross Profit)                  R$ {{gp}}
GROSS MARGIN                                {{gm}}%
═════════════════════════════════════════════════════

DESPESAS OPERACIONAIS (OpEx)
  Folha Admin e Comercial (loaded)          R$ {{folha_admin}}
  Aluguel e Facilities                      R$ {{aluguel}}
  Marketing e Vendas                        R$ {{marketing}}
  SaaS e Ferramentas Corporativas           R$ {{saas_corp}}
  Contabilidade e Juridico                  R$ {{contab_jurid}}
  Viagens e Eventos                         R$ {{viagens}}
  Outros                                    R$ {{outros}}
─────────────────────────────────────────────────────
TOTAL OpEx                                  R$ {{opex}}

═════════════════════════════════════════════════════
EBITDA                                      R$ {{ebitda}}
EBITDA %                                    {{ebitda_pct}}%
═════════════════════════════════════════════════════
```

---

## Metricas Operacionais

| Metrica | Valor | Target | Status |
|---------|-------|--------|--------|
| Utilizacao da equipe | {{utilizacao}}% | 75% | {{status}} |
| Revenue per employee | R$ {{rev_per_emp}} | R$ 20.000 | {{status}} |
| Headcount | {{headcount}} | {{headcount_plan}} | {{status}} |
| Projetos ativos | {{projetos}} | | |
| Horas faturadas | {{horas_fat}} | {{horas_target}} | {{status}} |

---

## P&L por Tipo de Receita

| Tipo | Receita | % Total | Gross Margin | Margem % |
|------|---------|---------|-------------|----------|
| Retainer | R$ {{ret_rev}} | {{ret_pct}}% | R$ {{ret_gm}} | {{ret_gm_pct}}% |
| Projetos | R$ {{proj_rev}} | {{proj_pct}}% | R$ {{proj_gm}} | {{proj_gm_pct}}% |
| Consulting | R$ {{cons_rev}} | {{cons_pct}}% | R$ {{cons_gm}} | {{cons_gm_pct}}% |
| **Total** | **R$ {{rl}}** | **100%** | **R$ {{gp}}** | **{{gm}}%** |

---

## Top 5 Clientes por Receita

| # | Cliente | Receita | % Total | Gross Margin |
|---|---------|---------|---------|-------------|
| 1 | {{client_1}} | R$ {{c1_rev}} | {{c1_pct}}% | {{c1_gm}}% |
| 2 | {{client_2}} | R$ {{c2_rev}} | {{c2_pct}}% | {{c2_gm}}% |
| 3 | {{client_3}} | R$ {{c3_rev}} | {{c3_pct}}% | {{c3_gm}}% |
| 4 | {{client_4}} | R$ {{c4_rev}} | {{c4_pct}}% | {{c4_gm}}% |
| 5 | {{client_5}} | R$ {{c5_rev}} | {{c5_pct}}% | {{c5_gm}}% |

---

## Destaques e Alertas

### Positivos
1. {{destaque_1}}
2. {{destaque_2}}
3. {{destaque_3}}

### Alertas
1. {{alerta_1}}
2. {{alerta_2}}
3. {{alerta_3}}

### Recomendacoes
1. {{recomendacao_1}}
2. {{recomendacao_2}}
3. {{recomendacao_3}}
