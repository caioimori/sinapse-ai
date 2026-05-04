---
task: write-product-discovery-report
responsavel: "@ps-discovery-lead"
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

# Write Product Discovery Report

## Metadata
- **Agent:** ps-discovery-lead (Quorum)
- **Complexity:** Medium
- **Estimated Time:** 3-4 hours
- **Produces:** Discovery report, executive summary, decision recommendations

## Purpose
Compilar resultados de um ciclo de discovery em relatorio estruturado para tomada de decisao. O relatorio deve transformar pesquisa em recomendacoes acionaveis com evidencia clara.

## Steps

### Step 1: Report Structure
```
PRODUCT DISCOVERY REPORT
─────────────────────────────────────────
Project: [discovery project name]
Period: [start date] — [end date]
Lead: ps-discovery-lead (Quorum)
Decision Needed By: [date]
─────────────────────────────────────────
```

### Step 2: Executive Summary (1 page max)
**Template:**
```
We set out to learn [primary research question].

Over [N weeks], we conducted [methods used: N interviews, N survey responses,
N usability tests, analytics analysis of N users].

KEY FINDINGS:
1. [Most important finding — one sentence]
2. [Second finding — one sentence]
3. [Third finding — one sentence]

RECOMMENDATION: [GO / NO-GO / PIVOT / MORE RESEARCH]
[One paragraph explaining why]

CONFIDENCE LEVEL: [HIGH / MEDIUM / LOW]
[What drives or limits our confidence]
```

### Step 3: Research Overview
**Methods & Sample:**
| Method | Sample Size | Period | Key Focus |
|--------|------------|--------|-----------|
| User interviews | [N] | [dates] | [what we explored] |
| Analytics analysis | [N users/events] | [date range] | [what we measured] |
| Survey | [N responses] | [dates] | [what we asked] |
| Usability tests | [N sessions] | [dates] | [what we tested] |
| Competitor analysis | [N competitors] | [dates] | [what we compared] |

**Participant Demographics:**
| Segment | Count | % of Sample | Notes |
|---------|-------|-------------|-------|
| [segment A] | [N] | [%] | [relevant context] |
| [segment B] | [N] | [%] | [relevant context] |

### Step 4: Detailed Findings (3-7 findings)
**Per Finding:**
```
FINDING [N]: [Clear insight statement]
────────────────────────────────────
Confidence: HIGH | MEDIUM | LOW
Evidence Sources: [which methods support this]

WHAT WE LEARNED:
[2-3 paragraphs with specific evidence, quotes, data points]

SUPPORTING DATA:
- Quantitative: [metric, percentage, count]
- Qualitative: "[exact user quote]" — Participant [ID]
- Behavioral: [observed pattern from recordings/analytics]

IMPLICATIONS:
- For product: [what this means for product decisions]
- For business: [revenue, retention, growth impact]
- For users: [how this affects user experience]
```

### Step 5: Opportunity Assessment
**Validated Opportunities:**
| Opportunity | Evidence Strength | User Impact | Business Impact | Priority |
|------------|------------------|-------------|-----------------|----------|
| [opp 1] | HIGH/MED/LOW | HIGH/MED/LOW | HIGH/MED/LOW | P1/P2/P3 |

**Invalidated Hypotheses:**
| Hypothesis | Why Invalidated | Evidence | Learning |
|-----------|----------------|---------|---------|
| [hypothesis] | [reason] | [data] | [what we learned] |

### Step 6: Recommendations
**Primary Recommendation:**
```
We recommend [specific action] because [evidence-based rationale].

Expected Impact: [metric improvement estimate]
Confidence: [HIGH/MEDIUM/LOW]
Investment Required: [effort estimate]
Risk: [what could go wrong]
```

**Alternative Options:**
| Option | Pros | Cons | Risk Level |
|--------|------|------|-----------|
| Option A (recommended) | [benefits] | [drawbacks] | Low/Med/High |
| Option B | [benefits] | [drawbacks] | Low/Med/High |
| Option C (do nothing) | [benefits] | [drawbacks] | Low/Med/High |

### Step 7: Open Questions & Next Steps
**What We Still Do Not Know:**
1. [Unanswered question + what would help answer it]
2. [Unanswered question + what would help answer it]

**Recommended Next Steps:**
| Action | Owner | Timeline | Depends On |
|--------|-------|----------|-----------|
| [action 1] | [agent/role] | [when] | [decision from this report] |
| [action 2] | [agent/role] | [when] | [prerequisite] |

## Output Artifacts
- `discovery-report-[project].md` | `executive-summary-[project].md` | `evidence-appendix.md`

## Quality Criteria
- Executive summary fits on one page | Every finding supported by evidence | Confidence levels assigned honestly | Recommendations specific and actionable | Alternative options presented | Open questions documented | No findings without data sources
