---
task: analyze-nps-verbatims
responsavel: "@ps-product-analyst"
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

# Analyze NPS Verbatims

## Metadata
- **Agent:** ps-product-analyst (Delta)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours
- **Produces:** NPS analysis report, theme taxonomy, actionable insights, segment breakdown

## Purpose
Analisar respostas abertas (verbatims) de pesquisas NPS para extrair insights acionaveis alem do score numerico. O score diz ONDE estamos, os verbatims dizem POR QUE.

## Steps

### Step 1: Data Preparation
**NPS Score Segments:**
| Segment | Score | Description |
|---------|-------|-------------|
| Promoters | 9-10 | Enthusiastic, loyal, fuel growth |
| Passives | 7-8 | Satisfied but not enthusiastic, vulnerable to competition |
| Detractors | 0-6 | Unhappy, can damage brand through negative word-of-mouth |

**NPS Formula:** NPS = % Promoters - % Detractors (range: -100 to +100)

**Data Inventory:**
| Attribute | Value |
|-----------|-------|
| Survey period | [date range] |
| Total responses | [N] |
| Response rate | [%] |
| Promoters | [N] ([%]) |
| Passives | [N] ([%]) |
| Detractors | [N] ([%]) |
| NPS Score | [score] |
| Verbatim completion rate | [% of respondents who wrote comments] |

### Step 2: Code Verbatims (Theme Taxonomy)
**Coding Process:**
1. Read ALL verbatims (do not sample for coding)
2. Create themes bottom-up (do not pre-define categories)
3. Each verbatim can have multiple codes (multi-label)
4. Code both sentiment and topic

**Theme Structure:**
| Theme | Sub-theme | Sentiment | Example Verbatim |
|-------|-----------|-----------|-----------------|
| Ease of Use | Intuitive UI | Positive | "So easy to navigate" |
| Ease of Use | Complex workflows | Negative | "Too many steps to do X" |
| Performance | Speed | Positive | "Fast and responsive" |
| Performance | Load times | Negative | "Slow when generating reports" |
| Support | Response time | Positive | "Quick and helpful support" |
| Support | Knowledge | Negative | "Agent did not understand my issue" |
| Features | [specific feature] | Positive/Negative | "[verbatim]" |
| Value | Price/value | Positive/Negative | "[verbatim]" |

### Step 3: Quantify Themes
**Theme Frequency by NPS Segment:**
| Theme | Promoters (N) | Passives (N) | Detractors (N) | Total | % of All |
|-------|--------------|-------------|----------------|-------|----------|
| [theme 1] | [N] | [N] | [N] | [N] | [%] |
| [theme 2] | [N] | [N] | [N] | [N] | [%] |

**Key Patterns:**
- **Top Promoter Drivers:** What do promoters mention most? (protect these)
- **Top Detractor Drivers:** What do detractors complain about? (fix these)
- **Passive Conversion Themes:** What would push passives to promoter? (grow these)
- **Polarizing Themes:** Same theme praised and criticized? (investigate)

### Step 4: Segment Analysis
**NPS by Segment:**
| Segment | N | NPS | Top Positive Theme | Top Negative Theme |
|---------|---|-----|-------------------|-------------------|
| By persona | | | | |
| By plan type | | | | |
| By tenure | | | | |
| By use case | | | | |
| By company size | | | | |

**Trend Analysis:**
| Theme | Last Quarter | This Quarter | Movement | Interpretation |
|-------|-------------|-------------|----------|----------------|
| [theme 1] | [frequency %] | [frequency %] | Up/Down | [what changed] |

### Step 5: Generate Insights & Recommendations
**Per Top Theme:**
```
THEME: [name]
FREQUENCY: [N mentions, % of verbatims]
SEGMENT MOST AFFECTED: [which NPS segment + user segment]
SENTIMENT: Positive / Negative / Mixed

REPRESENTATIVE QUOTES:
- "[quote 1]" — [segment, score]
- "[quote 2]" — [segment, score]
- "[quote 3]" — [segment, score]

INSIGHT: [what this theme tells us about user experience]
BUSINESS IMPACT: [how this affects retention, revenue, growth]
RECOMMENDATION: [specific action to take]
OWNER: [who should act on this]
PRIORITY: P1 / P2 / P3
```

### Step 6: Compile NPS Analysis Report
**Structure:**
1. Score Summary (NPS, segment distribution, trend)
2. Verbatim Overview (response rate, coding methodology)
3. Top Themes (frequency + sentiment breakdown)
4. Promoter Analysis (what they love, how to amplify)
5. Detractor Analysis (what to fix, priority order)
6. Passive Analysis (conversion opportunities)
7. Segment Insights (differences across user types)
8. Recommendations (prioritized actions with owners)
9. Appendix (full theme taxonomy, selected quotes)

## Output Artifacts
- `nps-analysis-[period].md` | `verbatim-theme-taxonomy.md` | `nps-segment-breakdown.md` | `nps-action-plan.md`

## Quality Criteria
- All verbatims coded (no sampling) | Themes created bottom-up from data | Quantified by segment (promoter/passive/detractor) | Trend compared to previous period | Recommendations specific with owners | Representative quotes included for each theme
