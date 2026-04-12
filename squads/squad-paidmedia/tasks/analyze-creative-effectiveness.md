---
task: analyze-creative-effectiveness
responsavel: "@pm-creative-performance-analyst"
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

# Task: Analyze Creative Effectiveness

## Metadata
- **Squad:** squad-paidmedia
- **Agent:** Lens (pm-creative-performance-analyst)
- **Complexity:** Standard

## Objetivo
Analisar efetividade de criativos de ads (todas as plataformas) para identificar padroes vencedores, criativos em fadiga e oportunidades de teste. Combinar dados quantitativos com analise qualitativa para entender POR QUE criativos vencem ou perdem.

## Entrada
- Creative performance data (all platforms)
- Ad creative assets (images, videos)
- Campaign metrics (CTR, CPA, ROAS)
- Competitor creative examples (optional)
- Historical creative data (if available)

## Passos

### 1. Creative Inventory
| Creative ID | Platform | Format | Status | Days Active | Spend | Results |
|-------------|----------|--------|--------|------------|-------|---------|
| | Meta/Google/YT | Image/Video/Carousel | Active/Paused | | R$ | |

### 2. Creative Effectiveness Matrix
```
Plot each creative on the matrix:

                    HIGH CONVERSION RATE
                          |
     SCALE WINNERS        |    OPTIMIZE CREATIVE
     (High hook × High    |    (Low hook × High conv)
      conversion)         |    → Fix the hook
                          |
    ──────────────────────┼──────────────────────
                          |
     TEST NEW CONCEPTS    |    KILL OR PIVOT
     (High hook × Low     |    (Low hook × Low conv)
      conversion)         |    → Stop spending
     → Fix the offer/LP   |
                          |
                    LOW CONVERSION RATE
```

| Quadrant | Creatives | Action |
|----------|-----------|--------|
| Scale Winners | [list] | Increase budget, find similar audiences |
| Optimize | [list] | Improve hook, keep targeting |
| Test Concepts | [list] | Improve LP or offer, keep creative |
| Kill/Pivot | [list] | Pause immediately |

### 3. Winning Pattern Analysis
| Pattern | Creatives That Use It | Avg Performance | Significance |
|---------|---------------------|-----------------|-------------|
| [visual pattern] | [IDs] | CTR: X%, CPA: R$ | High/Med/Low |
| [message pattern] | [IDs] | CTR: X%, CPA: R$ | High/Med/Low |
| [format pattern] | [IDs] | CTR: X%, CPA: R$ | High/Med/Low |
| [hook pattern] | [IDs] | CTR: X%, CPA: R$ | High/Med/Low |

### 4. 3C Analysis (Tier 11)
For top 5 creatives:
| Creative | Concept (clear in 3s?) | Congruence (matches LP?) | Continuity (funnel thread?) | Score |
|----------|----------------------|------------------------|---------------------------|-------|
| | Y/N | Y/N | Y/N | /3 |

### 5. Fatigue Detection
| Creative | Days Active | Peak CTR | Current CTR | Decline % | Frequency | Status |
|----------|------------|----------|-------------|-----------|-----------|--------|
| | | % | % | -X% | X/7 days | Fresh/Warning/Fatigued |

### 6. Recommendations
| # | Recommendation | Type | Expected Impact | Priority |
|---|---------------|------|----------------|----------|
| 1 | | Scale/Optimize/Kill/Test | +X% ROAS | P0 |
| 2 | | | | P0 |
| 3 | | | | P1 |
| 4 | | | | P1 |
| 5 | | | | P2 |

### 7. Next Creative Tests
| Test | Hypothesis | Variable | Variants | Budget |
|------|-----------|----------|----------|--------|
| | "If we [change], then [result] because [reason]" | | A vs B | R$ |

## Saida
- Creative inventory with status
- Effectiveness matrix plot
- Winning patterns identified (3-5 patterns)
- 3C analysis for top creatives
- Fatigue detection report
- Top 5 recommendations
- Next creative test plan

## Validacao
- [ ] All active creatives analyzed
- [ ] Matrix classification for each creative
- [ ] Minimum 3 winning patterns identified with data
- [ ] Fatigue status assessed for all creatives > 7 days
- [ ] Recommendations are specific and actionable
- [ ] Test plan includes clear hypotheses
