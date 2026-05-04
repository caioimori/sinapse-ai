# Technical Debt Management Framework

## Purpose
Framework para gestao sistematica de divida tecnica, incluindo classificacao, priorizacao e alocacao de budget.

## Martin Fowler Technical Debt Quadrant
```
              DELIBERATE                    INADVERTENT
         ┌──────────────────────┬──────────────────────┐
RECKLESS │ "We know this is     │ "What is layered     │
         │  wrong but ship it"  │  architecture?"       │
         │ Fix ASAP             │ Fix + train           │
         ├──────────────────────┼──────────────────────┤
PRUDENT  │ "We must ship now    │ "Now we know how we  │
         │  and deal with it"   │  should have done it"│
         │ Schedule payback     │ Address when relevant │
         └──────────────────────┴──────────────────────┘
```

## Debt Types
| Type | Examples | Impact | Detection |
|------|---------|--------|-----------|
| Code Debt | Duplicated code, missing tests, poor naming | Velocity | Code review, linting |
| Architecture Debt | Wrong patterns, scaling limits | Performance, features | Architecture review |
| Infrastructure Debt | Outdated dependencies, manual deploys | Security, reliability | Dependency audit |
| Testing Debt | Missing tests, flaky tests | Quality, confidence | Coverage reports |
| Documentation Debt | Outdated docs, missing docs | Onboarding, maintenance | Knowledge audit |

## Severity Scoring
| Dimension | 1 | 3 | 5 |
|-----------|---|---|---|
| User Impact | Invisible | Occasional issues | Blocks users |
| Velocity Impact | No effect | Slows some work | Slows every sprint |
| Risk Level | Cosmetic | Moderate bug risk | Security/data risk |
| Spread | Single file | One module | Entire codebase |
| Growth Rate | Stable | Slowly worsening | Rapidly worsening |

Score = Sum of dimensions (5-25)
- 20-25: Critical (this sprint)
- 15-19: High (next 1-2 sprints)
- 10-14: Medium (this quarter)
- 5-9: Low (opportunistic)

## Budget Allocation
```
Minimum: 15% of sprint capacity for tech debt
Scales with Debt Ratio:
  Debt Ratio < 10%: 15% allocation (healthy)
  Debt Ratio 10-20%: 20% allocation
  Debt Ratio 20-30%: 25% allocation
  Debt Ratio > 30%: 30%+ (or dedicated debt sprint)

Debt Ratio = Time to Fix All Debt / Time to Rebuild
```

## Health Indicators
| Indicator | Healthy | Warning | Critical |
|-----------|---------|---------|----------|
| Debt Ratio | < 10% | 10-20% | > 20% |
| New Debt/Sprint | Decreasing | Stable | Increasing |
| Debt Age (avg) | < 3 months | 3-6 months | > 6 months |
| Velocity Trend | Stable/Up | Slight decline | Declining |

## Prevention Practices
- Definition of Done includes debt check
- Debt card created for every shortcut taken
- Quarterly full debt inventory
- Refactoring budget protected (non-negotiable)
- Architecture Decision Records for trade-offs
