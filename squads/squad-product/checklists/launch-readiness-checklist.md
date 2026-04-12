# Launch Readiness Checklist

## Purpose
Gate de qualidade obrigatorio antes de qualquer lancamento em producao.

## Technical Readiness
- [ ] All acceptance criteria implemented and verified
- [ ] Unit tests passing (coverage >= project threshold)
- [ ] Integration tests passing
- [ ] Performance tested (load within acceptable limits)
- [ ] Security review completed (no critical/high vulnerabilities)
- [ ] Database migrations tested in staging
- [ ] API contracts documented and versioned
- [ ] Error handling and logging in place
- [ ] Feature flag configured for gradual rollout
- [ ] Monitoring and alerting configured
- [ ] Rollback procedure documented and tested

## Quality Readiness
- [ ] QA sign-off obtained
- [ ] Edge cases tested and documented
- [ ] Cross-browser/device testing (if applicable)
- [ ] Accessibility check passed (WCAG 2.1 AA minimum)
- [ ] Regression suite passing (no new failures)
- [ ] Known issues documented with workarounds

## Communication Readiness
- [ ] Release notes written (internal + external)
- [ ] Support/CS team briefed with FAQ
- [ ] Client notification prepared
- [ ] In-app announcement configured (if applicable)

## Operational Readiness
- [ ] Rollout plan approved (phased, not big-bang)
- [ ] Rollback criteria defined (automatic triggers)
- [ ] On-call rotation aware of launch
- [ ] Post-launch monitoring plan (first 48h)

## Go/No-Go Decision
- **ALL sections must pass for full launch**
- **1 section NO-GO:** Launch with documented risk mitigation
- **2+ sections NO-GO:** DELAY launch, fix blockers first
- **Critical items (security, data):** NO exceptions, must pass
