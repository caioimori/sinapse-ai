---
task: synthesize-research-findings
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

# Synthesize Research Findings

## Metadata
- **Agent:** ps-discovery-lead (Quorum)
- **Complexity:** Medium-High
- **Estimated Time:** 3-4 hours
- **Produces:** Research synthesis, insight map, evidence-based recommendations

## Purpose
Sintetizar descobertas de multiplas fontes de pesquisa (entrevistas, analytics, surveys, testes) em insights acionaveis. Transformar dados brutos em decisoes de produto.

## Steps

### Step 1: Gather All Data Sources
**Inventory Check:**
| Source | Type | Sample Size | Confidence | Status |
|--------|------|-------------|-----------|--------|
| User interviews | Qualitative | N sessions | High/Med/Low | Collected/Pending |
| Analytics data | Quantitative | N users/events | High/Med/Low | Collected/Pending |
| Survey responses | Mixed | N responses | High/Med/Low | Collected/Pending |
| Usability tests | Qualitative | N sessions | High/Med/Low | Collected/Pending |
| Support tickets | Qualitative | N tickets | High/Med/Low | Collected/Pending |
| Competitor analysis | Secondary | N competitors | Medium | Collected/Pending |

**Minimum for Synthesis:** At least 2 different data sources to enable triangulation.

### Step 2: Affinity Mapping (Qualitative Data)
**Process:**
1. Extract all observations, quotes, and data points onto individual cards
2. Group related cards without pre-defined categories (bottom-up)
3. Name each group with an insight statement (not a topic label)
4. Arrange groups by relationship and hierarchy

**Insight Statement Format:**
- BAD: "Login issues" (topic, not insight)
- GOOD: "Users abandon login when asked to create account before seeing value" (specific, actionable)

**Hierarchy:**
```
Theme (broad pattern)
  └── Insight (specific finding)
       └── Evidence (quotes, data points, observations)
            └── Source (interview #, analytics query, etc.)
```

### Step 3: Triangulation Matrix
**Cross-reference findings across sources:**
| Insight | Interviews | Analytics | Survey | Usability | Confidence |
|---------|-----------|-----------|--------|-----------|-----------|
| [insight 1] | Supported (3/5) | Confirmed (metric) | N/A | Confirmed | HIGH |
| [insight 2] | Supported (4/5) | No data | Contradicted | N/A | MEDIUM |
| [insight 3] | Mentioned (1/5) | Confirmed (metric) | Confirmed | N/A | HIGH |
| [insight 4] | Supported (2/5) | No data | No data | N/A | LOW |

**Confidence Rules:**
- **HIGH:** Supported by 2+ independent sources
- **MEDIUM:** Supported by 1 source, not contradicted by others
- **LOW:** Single source only or contradicted by another source
- **CONFLICT:** Sources disagree — requires additional research

### Step 4: Prioritize Insights by Impact
**Impact Assessment per Insight:**
| Dimension | Score (1-5) | Notes |
|-----------|------------|-------|
| User impact (how many affected) | | |
| Severity (how painful) | | |
| Frequency (how often) | | |
| Business value (revenue/retention) | | |
| Feasibility (can we address this) | | |
| **Total** | **/25** | |

**Priority Bands:**
- 20-25: Critical — address immediately
- 15-19: High — plan for next quarter
- 10-14: Medium — add to backlog
- Below 10: Low — monitor, do not invest now

### Step 5: Generate Recommendations
**Per Priority Insight:**
```
INSIGHT: [specific finding with evidence]
CONFIDENCE: HIGH | MEDIUM | LOW
EVIDENCE: [summary of supporting data]
RECOMMENDATION: [specific action to take]
RISK IF IGNORED: [what happens if we do nothing]
NEXT STEP: [immediate action item]
OWNER: [agent/role responsible]
```

### Step 6: Create Research Synthesis Document
**Structure:**
1. Executive Summary (1 paragraph, key findings + top recommendation)
2. Research Overview (methods used, sample sizes, timeline)
3. Key Insights (prioritized, with evidence)
4. Recommendations (actionable, with owners)
5. Open Questions (what we still do not know)
6. Appendix (raw data references, methodology notes)

## Output Artifacts
- `research-synthesis-[topic].md` | `insight-map.md` | `triangulation-matrix.md` | `recommendations.md`

## Quality Criteria
- All data sources inventoried | Triangulation attempted for key insights | Confidence levels assigned | Recommendations specific and actionable | Open questions documented | No insights without evidence
