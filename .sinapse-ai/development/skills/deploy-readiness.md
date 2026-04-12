---
name: deploy-readiness
description: Automated deployment readiness check against 25 blockers
trigger: Before any production deployment
agents: [devops, quality-gate, developer]
---

# Deploy Readiness Skill

## Usage

Invoke with `*deploy-readiness` or `/deploy-readiness` before any production deploy.

## Protocol

Run all 25 deployment blockers from Constitution Article X. For each item, execute the automated check where possible or mark as MANUAL.

### Tier 1: Absolute Blockers (10 items — deploy = impossible)

| # | Blocker | Automated Check |
|---|---------|-----------------|
| 1 | Tables without RLS | `SELECT tablename FROM pg_tables WHERE schemaname='public' AND NOT rowsecurity` |
| 2 | Hardcoded API keys | `grep -rn "sk-\|sk_live\|AKIA\|password\s*=" src/ app/ --include="*.{ts,js,tsx}"` |
| 3 | service_role in frontend | `grep -rn "service_role" src/ app/ pages/ --include="*.{ts,js,tsx}"` |
| 4 | No MFA on admin accounts | MANUAL — verify in cloud dashboard |
| 5 | APIs without auth | MANUAL — review endpoint middleware |
| 6 | SQL string concatenation | `grep -rn "query(\`.*\${" src/ --include="*.{ts,js}"` |
| 7 | Critical/high vulns in deps | `npm audit --audit-level=high` |
| 8 | Secrets in codebase | `git log --all -p -- "*.env" \| head -5` + grep patterns |
| 9 | Default credentials | MANUAL — check for admin/admin, test/test |
| 10 | No TLS | MANUAL — verify HTTPS enforcement |

### Tier 2: Compliance Blockers (7 items — deploy = illegal in Brazil)

| # | Blocker | Check |
|---|---------|-------|
| 11 | No DPO designated | MANUAL — organizational check |
| 12 | No breach notification capability | MANUAL — process check |
| 13 | No consent mechanism | Search for consent UI: `grep -rn "consent\|consentimento" src/` |
| 14 | No data subject rights portal | Search for deletion endpoint: `grep -rn "delete.*account\|excluir" src/` |
| 15 | International transfer without SCCs | MANUAL — review data flows |
| 16 | Children's data without parental consent | MANUAL — if applicable |
| 17 | No published privacy policy | Check for privacy route: `grep -rn "privacidade\|privacy" src/` |

### Tier 3: Operational Blockers (8 items — deploy = irresponsible)

| # | Blocker | Check |
|---|---------|-------|
| 18 | No asset inventory | MANUAL — documentation check |
| 19 | No centralized logging | Search for logger: `grep -rn "winston\|pino\|logger" src/` |
| 20 | No incident response plan | MANUAL — documentation check |
| 21 | No backup verification (90 days) | MANUAL — ops check |
| 22 | No vulnerability scanning | Check CI for scan step: `grep -rn "audit\|snyk\|trivy" .github/` |
| 23 | No network segmentation | MANUAL — infra review |
| 24 | No vendor security assessment | MANUAL — procurement check |
| 25 | No SSL on database | MANUAL — verify DB connection string |

## Execution

1. Run all automated checks in parallel where possible
2. Collect results into score card
3. For MANUAL items: mark as UNCHECKED (requires human verification)

## Output

```
## Deploy Readiness Report — {project} — {date}

### Score: {passed}/{total_auto} automated | {manual_count} manual checks pending

### Tier 1 — Absolute Blockers
| # | Check | Status | Details |
|---|-------|--------|---------|
| 1 | RLS | PASS | All 12 tables have RLS |
| 2 | API Keys | FAIL | Found sk- in config.ts:42 |

### Tier 2 — Compliance (LGPD)
...

### Tier 3 — Operational
...

### Verdict: READY | BLOCKED | NEEDS_MANUAL_REVIEW
- Blocking items: {list}
- Manual items pending: {list}
```

## Rules
- Any Tier 1 FAIL = BLOCKED, no override
- Tier 2 FAIL = BLOCKED (legal requirement)
- Tier 3 FAIL = WARN, deploy with documented risk acceptance
- MANUAL items do NOT block but must be reviewed before launch
- Reference: `.claude/rules/security-data-protection.md`
