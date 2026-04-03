# Security Frameworks & Enforcement Research

**Date:** 2026-04-01
**Query:** Security frameworks, standards, and historical references for building unhackable software
**Scope:** 10 topics covering OWASP, NIST, CIS, LGPD, breach analysis, API security, Supabase, pre-deploy checklists, and ANPD enforcement

## TL;DR

This research covers the 10 most critical security frameworks and references for building secure, compliant software platforms in 2025-2026. Key takeaways:

1. **OWASP Top 10 2025** -- Broken Access Control remains #1; Supply Chain Failures is new at #3
2. **NIST CSF 2.0** -- Added "Govern" as 6th function; supply chain risk is now core
3. **Zero Trust (NIST SP 800-207)** -- Never trust, always verify; per-session access; dynamic policy
4. **CIS Controls v8.1** -- 18 controls, 153 safeguards across 3 Implementation Groups
5. **LGPD** -- 3-day breach notification, R$50M max fine, DPO mandatory, consent must be granular
6. **Breaches 2023-2025** -- MFA absence caused most major breaches; credential stuffing dominates
7. **Claude API Security** -- Rotate keys every 90 days, never hardcode, use KMS, GitHub auto-revokes exposed keys
8. **Supabase Security** -- RLS on ALL tables, never expose service_role, SSL enforcement, network restrictions
9. **Pre-Deploy Checklists** -- MFA, RBAC, TLS 1.2+, AES-256, secret scanning in CI/CD, chaos testing
10. **ANPD Enforcement** -- R$98M+ in fines since 2023, blocked Meta from AI training, 2025-2026 agenda targets AI

## Files

| File | Content |
|------|---------|
| [00-query-original.md](00-query-original.md) | Original query and inferred context |
| [01-deep-research-prompt.md](01-deep-research-prompt.md) | Decomposed sub-queries |
| [02-research-report.md](02-research-report.md) | Complete findings (main document) |
| [03-recommendations.md](03-recommendations.md) | Deployment blockers and enforcement recommendations |
