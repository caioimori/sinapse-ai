---
task: configure-feature-flag-rollout
responsavel: "@ps-delivery-manager"
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

# Configure Feature Flag Rollout

## Metadata
- **Agent:** ps-delivery-manager (Tempo)
- **Complexity:** Medium
- **Estimated Time:** 1-2 hours
- **Produces:** Feature flag configuration, rollout schedule, targeting rules, cleanup plan

## Purpose
Configurar feature flags para lancamento gradual e seguro de features. Feature flags sao a rede de seguranca que permite lancar com confianca e reverter instantaneamente se algo der errado.

## Steps

### Step 1: Flag Design
**Flag Specification:**
```
Flag Name: [descriptive-kebab-case-name]
Description: [what this flag controls]
Type: Boolean | Multivariate | Percentage
Owner: [who manages this flag]
Created: [date]
Planned Removal: [date — flags are temporary!]
```

**Flag Naming Convention:**
```
Pattern: [feature]-[scope]-[purpose]
Examples:
  new-dashboard-v2-rollout
  pricing-page-experiment-variant
  dark-mode-beta
  checkout-flow-redesign
```

**Flag Types:**
| Type | Use Case | Example |
|------|----------|---------|
| Kill Switch | Emergency disable | payment-gateway-fallback |
| Release Toggle | Gradual rollout | new-feature-rollout |
| Experiment | A/B testing | checkout-variant-b |
| Ops Toggle | Operational control | maintenance-mode |
| Permission | Access control | premium-feature-access |

### Step 2: Targeting Rules
**User Targeting Configuration:**
```
RULE 1: Internal team
  Condition: user.email ends_with "@agency.com"
  Serve: ON
  Purpose: Internal testing

RULE 2: Beta users
  Condition: user.segment = "beta"
  Serve: ON
  Purpose: Early adopter feedback

RULE 3: Percentage rollout
  Condition: percentage_rollout = [X%]
  Serve: ON for X%, OFF for rest
  Purpose: Gradual exposure

RULE 4: Default
  Serve: OFF
  Purpose: Catch-all for non-targeted users
```

**Segmentation Options:**
| Segment By | Use When |
|-----------|---------|
| User attribute (plan, role, tenure) | Targeting specific user types |
| Organization/account | Enterprise rollout per-company |
| Geography | Regional launches |
| Device/platform | Platform-specific features |
| Percentage (random) | General gradual rollout |
| Custom list (user IDs) | VIP/beta testing |

### Step 3: Rollout Schedule
**Phased Rollout Plan:**
| Phase | Date | Target | % Users | Duration | Gate Criteria |
|-------|------|--------|---------|----------|---------------|
| 0 - Internal | [date] | Internal team | 0% external | 1-2 days | No P0/P1 bugs |
| 1 - Canary | [date] | 5% random | 5% | 2-3 days | Error rate stable |
| 2 - Beta | [date] | 25% random | 25% | 3-5 days | Metrics within bounds |
| 3 - Majority | [date] | 75% random | 75% | 2-3 days | No regressions |
| 4 - Full | [date] | All users | 100% | — | Stable for 48h |
| 5 - Cleanup | [date] | Remove flag | — | — | Code cleaned |

**Gate Criteria Between Phases:**
| Metric | Acceptable Range | Block If |
|--------|-----------------|----------|
| Error rate | <= baseline + 0.5% | > baseline + 2% |
| Latency (p95) | <= baseline + 50ms | > baseline + 200ms |
| Feature usage | > 0 (users engaging) | 0% adoption after 24h |
| User complaints | < 3 in phase period | > 10 complaints |
| Revenue impact | Neutral or positive | > 5% negative |

### Step 4: Monitoring Configuration
**Real-Time Monitoring:**
```
Dashboard: [link to feature-specific dashboard]
Key Metrics to Watch:
  1. Feature usage rate (adoption)
  2. Error rate for flagged code paths
  3. Latency for flagged endpoints
  4. Business metrics (conversion, engagement)

Alerts:
  - Error rate spike: > [threshold] → Slack notification
  - Usage anomaly: 0 usage after 2h of rollout → Check targeting
  - Performance regression: p95 > [threshold] → Page on-call
```

### Step 5: Emergency Procedures
**Kill Switch Protocol:**
```
TRIGGER: [what condition triggers emergency disable]

STEPS:
1. Disable flag immediately (set to OFF for all)
   Tool: [LaunchDarkly/Unleash/custom] → Toggle OFF
   Time to disable: < 1 minute (no deployment needed)

2. Verify feature is disabled
   Check: [how to confirm feature is off]

3. Notify team
   Channel: [Slack channel / email list]
   Template: "Feature [name] disabled at [time] due to [reason]. Impact: [scope]. Investigation underway."

4. Assess impact
   - Users affected: [how many saw the issue]
   - Data impact: [any data corruption or loss]
   - Duration: [how long was issue live]

5. Create incident report
   - Root cause
   - Fix plan
   - Prevention measures
```

### Step 6: Flag Cleanup Plan
**Technical Debt Prevention:**
```
CLEANUP TIMELINE:
  Flag created: [date]
  Full rollout target: [date]
  Cleanup deadline: [full rollout + 2 weeks]
  Flag removal PR: [deadline for code cleanup]

CLEANUP STEPS:
1. Verify 100% rollout stable for 2 weeks
2. Remove flag checks from code
3. Remove flag from management tool
4. Remove flag-specific monitoring (or merge into main)
5. Update documentation
```

**Flag Lifecycle Policy:**
| Flag Age | Status | Action |
|---------|--------|--------|
| < 30 days | Active | Normal operation |
| 30-60 days | Warning | Review — should it be permanent or cleaned? |
| > 60 days | Overdue | Cleanup sprint — remove or convert to config |
| > 90 days | Critical | Mandatory cleanup this sprint |

## Output Artifacts
- `feature-flag-config-[name].md` | `rollout-schedule.md` | `flag-monitoring-setup.md` | `flag-cleanup-plan.md`

## Quality Criteria
- Flag naming follows convention | Targeting rules documented | Rollout phased (not big-bang) | Gate criteria between phases | Kill switch tested | Cleanup deadline set | No flags older than 90 days in codebase
