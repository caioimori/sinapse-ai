---
task: execute-feature-launch-checklist
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

# Execute Feature Launch Checklist

## Metadata
- **Agent:** ps-delivery-manager (Tempo)
- **Complexity:** Medium
- **Estimated Time:** 2-4 hours (execution of checklist)
- **Produces:** Launch readiness assessment, go/no-go decision, launch plan, rollback plan

## Purpose
Executar checklist de lancamento de feature para garantir qualidade, comunicacao e preparacao operacional antes de ir para producao. Nenhuma feature lanca sem passar por este gate.

## Steps

### Step 1: Pre-Launch Readiness Assessment
**Technical Readiness:**
- [ ] All acceptance criteria implemented and tested
- [ ] Unit tests passing (coverage >= threshold)
- [ ] Integration tests passing
- [ ] Performance tested (load within acceptable limits)
- [ ] Security review completed (no critical/high vulnerabilities)
- [ ] Database migrations tested in staging
- [ ] API contracts documented and versioned
- [ ] Error handling and logging in place
- [ ] Feature flag configured (if gradual rollout)
- [ ] Monitoring and alerting configured

**Quality Readiness:**
- [ ] QA sign-off obtained
- [ ] Edge cases tested and documented
- [ ] Cross-browser/device testing (if applicable)
- [ ] Accessibility check passed (WCAG 2.1 AA)
- [ ] Regression suite passing (no new failures)
- [ ] Known issues documented with workarounds

**Documentation Readiness:**
- [ ] User-facing documentation updated
- [ ] API documentation updated (if API changes)
- [ ] Internal knowledge base updated
- [ ] Release notes drafted
- [ ] Support team briefed on new feature

### Step 2: Communication Readiness
**Internal Communication:**
- [ ] Engineering team aware of deployment plan
- [ ] Support/CS team briefed with FAQ document
- [ ] Sales team informed (if relevant to sales process)
- [ ] Product team has reviewed final state

**External Communication:**
- [ ] Client notification prepared (if client-facing)
- [ ] In-app announcement configured (if applicable)
- [ ] Changelog entry prepared
- [ ] Email notification drafted (if applicable)

### Step 3: Rollout Plan
**Deployment Strategy:**
| Phase | Audience | % of Users | Duration | Success Criteria |
|-------|----------|-----------|----------|-----------------|
| Phase 1 | Internal team | 0% (internal only) | 1 day | No critical bugs |
| Phase 2 | Beta users | 5-10% | 2-3 days | Error rate < threshold |
| Phase 3 | Expanded rollout | 25-50% | 3-5 days | Metrics stable |
| Phase 4 | Full rollout | 100% | — | All green |

**Feature Flag Configuration:**
```
Flag Name: [feature_flag_name]
Default: OFF
Phase 1: ON for [internal-team] group
Phase 2: ON for [beta-users] group
Phase 3: ON for [% rollout]
Phase 4: ON for all (flag can be removed)
```

### Step 4: Rollback Plan
**Rollback Criteria (automatic triggers):**
| Metric | Threshold | Action |
|--------|-----------|--------|
| Error rate | > [X%] above baseline | Automatic flag OFF |
| Latency | > [Xms] p95 | Alert + manual review |
| Conversion rate | Drop > [X%] | Alert + manual review |
| User complaints | > [N] in [timeframe] | Manual review |

**Rollback Procedure:**
```
1. Disable feature flag (immediate, no deployment needed)
2. Communicate to stakeholders: "Feature X rolled back due to [reason]"
3. Collect data on what went wrong
4. Create fix plan with timeline
5. Schedule re-launch with fixes
```

**Rollback Owner:** [name/role]
**Rollback Decision Authority:** [who can trigger rollback]

### Step 5: Go/No-Go Decision
**Launch Readiness Scorecard:**
| Category | Items Ready | Items Total | Status |
|----------|-----------|-------------|--------|
| Technical | [N] | [N] | GO/NO-GO |
| Quality | [N] | [N] | GO/NO-GO |
| Documentation | [N] | [N] | GO/NO-GO |
| Communication | [N] | [N] | GO/NO-GO |
| Rollout Plan | [N] | [N] | GO/NO-GO |
| Rollback Plan | [N] | [N] | GO/NO-GO |

**Decision Rules:**
- ALL categories must be GO for full launch
- If 1 category is NO-GO: Launch with mitigation (document risk)
- If 2+ categories are NO-GO: DELAY launch, fix blockers first
- Critical items (security, data integrity): NO exceptions

**GO/NO-GO Decision:**
```
Decision: GO / NO-GO / GO WITH CONDITIONS
Date: [date]
Decided By: [who]
Conditions (if applicable): [what must happen before/during launch]
Launch Date: [when]
```

### Step 6: Post-Launch Monitoring (first 48h)
**Monitoring Checklist:**
- [ ] Hour 1: Check error rates, latency, feature usage
- [ ] Hour 4: Review initial user feedback, support tickets
- [ ] Day 1: Full metrics review vs baseline
- [ ] Day 2: Confirm stability, expand rollout if phased
- [ ] Week 1: Feature adoption metrics, user feedback synthesis

## Output Artifacts
- `launch-checklist-[feature].md` | `rollout-plan.md` | `rollback-plan.md` | `go-no-go-decision.md` | `post-launch-monitoring.md`

## Quality Criteria
- All checklist items addressed (not skipped) | Rollout plan phased (not big-bang) | Rollback plan documented with clear triggers | Go/No-Go decision recorded with rationale | Post-launch monitoring active for 48h minimum
