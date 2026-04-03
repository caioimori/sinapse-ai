# Recommendations & Deployment Blockers

## Consolidated Deployment Blockers

These are the NON-NEGOTIABLE items that MUST be met before any production deployment. Derived from all 10 security frameworks analyzed.

### TIER 1: ABSOLUTE BLOCKERS (Deploy = Impossible)

| # | Blocker | Source | Severity |
|---|---------|--------|----------|
| 1 | Any table without RLS enabled | Supabase, OWASP A01 | CRITICAL |
| 2 | API keys hardcoded in source code | Claude API, CIS C3 | CRITICAL |
| 3 | service_role key in client-side code | Supabase | CRITICAL |
| 4 | No MFA on admin/cloud/production accounts | Breach lessons, CIS C5-6 | CRITICAL |
| 5 | APIs without authentication | OWASP A01, Breach lessons | CRITICAL |
| 6 | SQL queries using string concatenation | OWASP A05, SQL Governance | CRITICAL |
| 7 | Critical/High vulnerabilities in dependencies | OWASP A03, CIS C7 | CRITICAL |
| 8 | Secrets detected in codebase | Claude API, CIS C3 | CRITICAL |
| 9 | Default credentials in production | OWASP A02, CIS C4 | CRITICAL |
| 10 | No encryption on data in transit (no TLS) | NIST CSF, Zero Trust | CRITICAL |

### TIER 2: COMPLIANCE BLOCKERS (Deploy = Illegal in Brazil)

| # | Blocker | Source | Severity |
|---|---------|--------|----------|
| 11 | No DPO appointed | LGPD Art. 41 | LEGAL |
| 12 | No breach notification capability (<3 days) | LGPD Resolution 15 | LEGAL |
| 13 | No consent management mechanism | LGPD Art. 7-8 | LEGAL |
| 14 | No data subject rights portal | LGPD Art. 18 | LEGAL |
| 15 | International transfers without SCCs | LGPD Art. 33 (since Aug 2025) | LEGAL |
| 16 | Processing children's data without parental consent | LGPD Art. 14 | LEGAL |
| 17 | No privacy policy published | LGPD Art. 9 | LEGAL |

### TIER 3: OPERATIONAL BLOCKERS (Deploy = Irresponsible)

| # | Blocker | Source | Severity |
|---|---------|--------|----------|
| 18 | No asset inventory | CIS C1-2, NIST IDENTIFY | HIGH |
| 19 | No centralized logging/SIEM | CIS C8, OWASP A09 | HIGH |
| 20 | No incident response plan | CIS C17, NIST RESPOND | HIGH |
| 21 | No backup verification in last 90 days | CIS C11, Pre-deploy | HIGH |
| 22 | No vulnerability scanning process | CIS C7, OWASP A03 | HIGH |
| 23 | No network segmentation | Zero Trust, Breach lessons | HIGH |
| 24 | No vendor security assessment | NIST GOVERN, CIS C15 | HIGH |
| 25 | No SSL enforcement on database | Supabase, NIST CSF | HIGH |

---

## Enforcement Framework Integration Recommendations

### For Hook-Based Enforcement (SINAPSE)

The following checks can be automated as pre-commit/pre-deploy hooks:

```yaml
# Proposed enforcement hooks
hooks:
  pre_commit:
    - id: secret-detection
      tool: gitleaks
      action: BLOCK
      source: "Claude API, CIS C3"

    - id: sql-injection-prevention
      pattern: "string concatenation in SQL"
      action: BLOCK
      source: "OWASP A05"

    - id: service-role-exposure
      pattern: "service_role|supabase_service_key in client/"
      action: BLOCK
      source: "Supabase Security"

    - id: hardcoded-credentials
      pattern: "password=|api_key=|secret=.*['\"][^'\"]{8,}"
      action: BLOCK
      source: "CIS C3, OWASP A02"

  pre_deploy:
    - id: rls-verification
      check: "ALL tables have RLS enabled"
      action: BLOCK
      source: "Supabase, OWASP A01"

    - id: dependency-audit
      tool: "npm audit"
      threshold: "0 critical, 0 high"
      action: BLOCK
      source: "OWASP A03, CIS C7"

    - id: ssl-enforcement
      check: "SSL enabled on database"
      action: BLOCK
      source: "NIST CSF, Zero Trust"

    - id: mfa-verification
      check: "MFA enabled on all admin accounts"
      action: BLOCK
      source: "Breach lessons, CIS C5-6"

    - id: security-headers
      check: "HSTS, CSP, X-Frame-Options configured"
      action: BLOCK
      source: "OWASP A02"
```

### For Constitutional Integration

Map security blockers to existing SINAPSE Constitution articles:

| Blocker Category | Maps To | Suggested Amendment |
|-----------------|---------|---------------------|
| Access Control (RLS, RBAC) | Art. V Quality First | Add explicit security quality gate |
| Secret Protection | New Article | Art. IX: Secret Governance (NON-NEGOTIABLE) |
| LGPD Compliance | New Article | Art. X: Data Protection Compliance (NON-NEGOTIABLE) |
| Supply Chain Security | Art. V Quality First | Expand to include dependency scanning |
| Encryption | New Article | Art. XI: Encryption First (MUST) |

### For CI/CD Pipeline

```
Pipeline Security Gates (in order):
1. Secret scanning (gitleaks) -> BLOCK on detection
2. SAST (static analysis) -> BLOCK on critical/high
3. Dependency scanning (npm audit) -> BLOCK on critical/high
4. Container scanning (Trivy) -> BLOCK on critical/high
5. DAST (dynamic analysis) -> BLOCK on critical/high
6. RLS verification -> BLOCK if any table unprotected
7. Security headers verification -> BLOCK if missing
8. LGPD compliance check -> BLOCK if missing DPO/consent/notification
```

---

## Key Metrics for Security Posture

| Metric | Target | Source |
|--------|--------|--------|
| Mean Time to Patch (Critical) | < 48 hours | CIS C7 |
| Mean Time to Patch (High) | < 7 days | CIS C7 |
| MFA Coverage | 100% of accounts | Breach lessons |
| RLS Coverage | 100% of tables | Supabase |
| Secret Scanning | 0 detections | Claude API |
| Dependency Vulnerabilities (Critical) | 0 | OWASP A03 |
| Breach Notification Capability | < 3 days | LGPD |
| Backup Verification Frequency | Every 90 days | CIS C11 |
| Penetration Test Frequency | Annual minimum | CIS C18 |
| Security Training | Annual for all staff | CIS C14 |

---

## Next Steps

Implementation of this security framework should be delegated to:

1. **@architect** -- Design the security architecture, map controls to system components
2. **@developer** -- Implement technical controls (hooks, scanning, RLS policies)
3. **@devops** -- Configure CI/CD security gates, secret management, monitoring
4. **@quality-gate** -- Validate security controls in QA gate checklist
5. **@project-lead** -- Create epic for security hardening with stories per tier

**Priority order:** TIER 1 blockers first (critical), then TIER 2 (legal), then TIER 3 (operational).

---

## Sources Summary

All findings derived from 22+ authoritative sources including OWASP Foundation, NIST, CIS, ANPD, Anthropic official documentation, Supabase official documentation, and breach analysis from security research firms. Full source list in [02-research-report.md](02-research-report.md#sources).
