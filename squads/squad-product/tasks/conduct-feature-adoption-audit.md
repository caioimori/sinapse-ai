---
task: conduct-feature-adoption-audit
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

# Conduct Feature Adoption Audit

## Metadata
- **Agent:** ps-product-analyst (Delta)
- **Complexity:** Medium
- **Estimated Time:** 3-4 hours
- **Produces:** Feature adoption matrix, usage patterns, optimization recommendations, sunset candidates

## Purpose
Auditar adocao de features para entender quais features geram valor, quais estao subutilizadas e quais sao candidatas a sunset. Base para decisoes de investimento em produto.

## Steps

### Step 1: Inventory All Features
**Feature Catalog:**
| Feature | Category | Launch Date | Target Persona | Maintenance Cost |
|---------|----------|-----------|---------------|-----------------|
| [feature 1] | Core/Secondary/Peripheral | [date] | [persona] | Low/Med/High |
| [feature 2] | | | | |
| [feature 3] | | | | |

### Step 2: Measure Adoption Metrics
**Per Feature:**
```
FEATURE: [name]
──────────────────────────────
Discovery Rate: [% of users who see/find the feature]
Adoption Rate: [% of users who use it at least once]
Activation Rate: [% who use it and get value (complete task)]
Retention Rate: [% who use it repeatedly]
Depth of Use: [avg actions per session within feature]
Time to First Use: [median days from signup to first use]
```

**Feature Adoption Matrix (2x2):**
```
                    HIGH BREADTH (many users)
                    │
    CORE            │           POWER
    (High breadth   │     (High breadth +
     High depth)    │      High depth)
                    │
────────────────────┼────────────────────
                    │
    UNDERUSED       │           ZOMBIE
    (Low breadth    │     (Low breadth
     Low depth)     │      Low depth)
                    │
                    LOW BREADTH (few users)
```

**Quadrant Definitions:**
| Quadrant | Adoption | Depth | Strategy |
|----------|----------|-------|----------|
| **Core** | >50% users | >3x/week | Protect and optimize |
| **Power** | >30% users | >5x/week | Reduce friction, promote |
| **Underused** | <20% users | <1x/week | Improve discovery or sunset |
| **Zombie** | <5% users | <1x/month | Strong sunset candidate |

### Step 3: Analyze Adoption Patterns
**Adoption by Segment:**
| Feature | Persona A | Persona B | Persona C | Free | Paid |
|---------|-----------|-----------|-----------|------|------|
| [feature] | [%] | [%] | [%] | [%] | [%] |

**Correlation with Key Outcomes:**
| Feature Usage | Retention Impact | Revenue Impact | NPS Impact |
|--------------|-----------------|---------------|-----------|
| [feature 1] | +[X]pp retention | +$[Y] ARPU | +[Z] NPS |
| [feature 2] | +[X]pp | +$[Y] | +[Z] |

**Feature Discovery Analysis:**
| Feature | Discovery Method | Discovery Rate | Adoption After Discovery |
|---------|-----------------|---------------|------------------------|
| [feature] | [navigation/search/onboarding/referral] | [%] | [%] |

### Step 4: Identify Issues
**Low Adoption Root Causes:**
| Feature | Adoption Rate | Likely Root Cause | Evidence |
|---------|-------------|------------------|---------|
| [feature] | [%] | Discovery problem (users do not find it) | [low discovery rate] |
| [feature] | [%] | Value gap (users do not see benefit) | [high discovery, low adoption] |
| [feature] | [%] | Usability issue (too hard to use) | [high adoption, low activation] |
| [feature] | [%] | Wrong audience (built for wrong persona) | [segment mismatch] |
| [feature] | [%] | Timing issue (offered too early/late) | [time-to-use pattern] |

### Step 5: Generate Recommendations
**Per Feature:**
| Feature | Quadrant | Action | Rationale | Priority |
|---------|---------|--------|-----------|----------|
| [feature] | Core | Optimize performance | High-usage, high-value | P1 |
| [feature] | Power | Improve discovery | Valuable but hidden | P1 |
| [feature] | Underused | A/B test discovery | May have discovery problem | P2 |
| [feature] | Zombie | Evaluate for sunset | Low value, maintenance cost | P2 |

**Sunset Evaluation (for Zombie features):**
| Criterion | Assessment |
|-----------|-----------|
| Current active users | [N absolute users] |
| Revenue from these users | [$] |
| Maintenance cost per quarter | [$] |
| Dependencies (other features that use this) | [list] |
| Migration path for current users | [what they would use instead] |
| Recommendation | Sunset / Rethink / Keep (with justification) |

### Step 6: Compile Audit Report
**Structure:**
1. Feature landscape overview (total features, distribution across quadrants)
2. Feature adoption matrix (visual 2x2)
3. Top findings (high-impact insights)
4. Feature-by-feature analysis (detailed per feature)
5. Recommendations (prioritized action plan)
6. Sunset candidates (with migration paths)
7. Investment allocation suggestion

## Output Artifacts
- `feature-adoption-audit.md` | `feature-matrix.md` | `sunset-candidates.md` | `feature-optimization-plan.md`

## Quality Criteria
- All features inventoried | Adoption metrics calculated per feature | 2x2 matrix populated | Segment analysis completed | Root causes identified for low adoption | Sunset candidates evaluated with criteria | Recommendations prioritized by impact
