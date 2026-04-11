# Checklist: Security Deployment Gate

> Purpose: Block production deployments that violate security requirements
> Used by: @devops (Pipeline), @quality-gate (Litmus)
> When: Before every production deployment or `npm publish`

---

## Tier 1: Absolute Blockers (deploy = impossible)

- [ ] RLS enabled on ALL tables with user data (`SELECT tablename FROM pg_tables WHERE NOT rowsecurity`)
- [ ] No API keys hardcoded in source code (secret scanning hook passes)
- [ ] `service_role` key NOT present in frontend code (`src/`, `app/`, `pages/`)
- [ ] MFA enabled on all admin/cloud/production accounts
- [ ] All public APIs require authentication middleware
- [ ] No SQL string concatenation (parameterized queries only)
- [ ] Zero critical/high vulnerabilities in dependencies (`npm audit --audit-level=high`)
- [ ] No secrets detected in codebase (`gitleaks detect` or equivalent)
- [ ] No default credentials in production (no admin/admin, test/test)
- [ ] TLS/HTTPS enforced for all data in transit

## Tier 2: Compliance Blockers (deploy = illegal in Brazil)

- [ ] DPO/Encarregado designated (LGPD Art. 41)
- [ ] Breach notification capability within 3 days (LGPD Resolucao 15)
- [ ] Consent collection mechanism implemented (LGPD Art. 7-8)
- [ ] Data subject rights portal exists (access, correct, delete) (LGPD Art. 18)
- [ ] International data transfer with SCCs if applicable (LGPD Art. 33)
- [ ] Children's data requires parental consent if applicable (LGPD Art. 14)
- [ ] Privacy policy published and accessible (LGPD Art. 9)

## Tier 3: Operational Blockers (deploy = irresponsible)

- [ ] Asset inventory documented (CIS C1-2)
- [ ] Centralized logging configured (CIS C8)
- [ ] Incident response plan exists (CIS C17)
- [ ] Backup verification within last 90 days (CIS C11)
- [ ] Vulnerability scanning process in place (CIS C7)
- [ ] Network segmentation applied (Zero Trust)
- [ ] Vendor security assessment completed (CIS C15)
- [ ] SSL enforcement on database connections

## Verdict

| Tier 1 | Tier 2 | Tier 3 | Decision |
|--------|--------|--------|----------|
| All pass | All pass | All pass | DEPLOY |
| All pass | All pass | Gaps | DEPLOY with documented risk |
| All pass | Gaps | Any | BLOCKED (compliance) |
| Gaps | Any | Any | BLOCKED (absolute) |

---

*Security Deployment Checklist v1.0 — Sources: OWASP Top 10, NIST CSF 2.0, CIS Controls v8, LGPD/ANPD*
