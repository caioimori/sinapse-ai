---
task: standardize-cross-client-metrics
responsavel: "@ps-product-ops-specialist"
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

# Standardize Cross-Client Metrics

## Metadata
- **Agent:** ps-product-ops-specialist (Mosaic)
- **Complexity:** Medium-High
- **Estimated Time:** 4-6 hours
- **Produces:** Standard metric definitions, cross-client dashboard, benchmarking framework

## Purpose
Padronizar definicoes de metricas entre clientes para permitir benchmarking, comparacao e aprendizado cruzado. Quando cada cliente mede "retention" de forma diferente, nao ha como comparar ou aprender.

## Steps

### Step 1: Metric Audit Across Clients
**Current State:**
| Metric Name | Client A Definition | Client B Definition | Client C Definition | Consistent? |
|-------------|--------------------|--------------------|--------------------|-----------|
| Active User | [their definition] | [their definition] | [their definition] | [Y/N] |
| Retention | [their definition] | [their definition] | [their definition] | [Y/N] |
| Activation | [their definition] | [their definition] | [their definition] | [Y/N] |
| Churn | [their definition] | [their definition] | [their definition] | [Y/N] |
| NPS | [their definition] | [their definition] | [their definition] | [Y/N] |

### Step 2: Define Standard Definitions
**Universal Metric Standards:**
```
STANDARD METRIC: Active User
Definition: A user who performed [core action] at least once in [time period]
Variants:
  - DAU: Core action in last 24 hours
  - WAU: Core action in last 7 days
  - MAU: Core action in last 30 days
Note: "Core action" is product-specific, defined per client at onboarding

STANDARD METRIC: Retention (D-N)
Definition: % of users from cohort who perform core action on day N
Formula: Users active on Day N / Users in cohort × 100
Standard periods: D1, D7, D14, D30, D60, D90
Cohort definition: Signup date (or activation date — specify)

STANDARD METRIC: Activation Rate
Definition: % of signups who complete the product-specific aha moment
Formula: Users who reached aha / Total signups × 100
Timeframe: Within [N days] of signup (product-specific)
Note: "Aha moment" defined per product at onboarding

STANDARD METRIC: Churn Rate (Monthly)
Definition: % of customers lost in a calendar month
Formula: Customers who churned / Customers at start of month × 100
"Churned" = [no core action for N days] OR [subscription cancelled]

STANDARD METRIC: NPS
Definition: Net Promoter Score per standard methodology
Formula: % Promoters (9-10) - % Detractors (0-6)
Survey frequency: Quarterly (standard) or after key interactions
Sample: All active users, minimum 40 responses for statistical validity
```

### Step 3: Client-Specific Customization Layer
**Per Client, Map Standard to Specific:**
| Standard Metric | Client-Specific Definition | Core Action | Threshold |
|----------------|--------------------------|-------------|-----------|
| Active User | [what counts as active for this product] | [specific event] | [frequency] |
| Activation | [what is the aha moment] | [specific milestone] | [within N days] |
| Retention | [same formula, specific core action] | [event] | [D30] |
| Churn | [behavioral or subscription-based] | [trigger event] | [N days inactive] |

### Step 4: Cross-Client Benchmarking
**Benchmark Dashboard:**
| Metric | Client A | Client B | Client C | Agency Avg | Industry Avg |
|--------|---------|---------|---------|-----------|-------------|
| Activation Rate | [%] | [%] | [%] | [%] | [%] |
| D30 Retention | [%] | [%] | [%] | [%] | [%] |
| NPS | [score] | [score] | [score] | [avg] | [avg] |
| DAU/MAU | [ratio] | [ratio] | [ratio] | [avg] | [avg] |
| Health Score | [N/100] | [N/100] | [N/100] | [avg] | — |

**Benchmarking Rules:**
- Compare apples to apples (same product type, similar stage)
- Never share client data with other clients (anonymize)
- Use benchmarks for learning, not competition
- Industry benchmarks sourced from published data (Lenny Rachitsky, First Round, OpenView)

### Step 5: Cross-Client Learnings
**Pattern Detection:**
| Pattern | Observed In | Potential Universal Learning |
|---------|-----------|------------------------------|
| [pattern] | Client A, C | [what we can apply elsewhere] |
| [pattern] | Client B | [unique to this context?] |

**Knowledge Transfer Rules:**
- Anonymize all client-specific data
- Share patterns and approaches, not specific metrics
- Document what worked and what did not
- Create playbooks from repeated successes

### Step 6: Governance
**Metric Standards Governance:**
| Rule | Details |
|------|---------|
| New client onboarding | Map standard metrics during kickoff |
| Metric definition changes | Require ops approval + 30-day transition |
| Benchmark updates | Quarterly with latest industry data |
| Cross-client report | Monthly internal (never shared with clients) |
| Standard review | Semi-annual review of all definitions |

## Output Artifacts
- `standard-metric-definitions.md` | `client-metric-mapping/[client].md` | `cross-client-benchmarks.md` | `metric-governance-policy.md`

## Quality Criteria
- All core metrics have universal definitions | Client-specific mappings documented | Benchmarks include industry comparisons | Client data never shared across clients | Governance process defined | Quarterly benchmark updates scheduled
