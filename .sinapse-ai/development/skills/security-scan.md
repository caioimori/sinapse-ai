---
name: security-scan
description: Run security checks from the 25 deployment blockers
trigger: Before deploy, on demand, or during QA gate
agents: [developer, quality-gate, devops]
---

# Security Scan Skill

## Usage

Invoke with `*security-scan` or `/security-scan` before any deployment.

## Automated Checks (Tier 1 — Absolute Blockers)

Run these checks in order. Any failure = BLOCKED.

### 1. Secrets in Code
```bash
# Check for hardcoded keys, tokens, passwords
grep -rn "sk-\|sk_live\|password\s*=\s*['\"]" src/ app/ pages/ --include="*.ts" --include="*.js" --include="*.tsx"
# Check for service_role in frontend
grep -rn "service_role" src/ app/ pages/ --include="*.ts" --include="*.js"
```

### 2. Dependencies
```bash
npm audit --audit-level=high
```

### 3. Environment Files
```bash
# Verify .env is gitignored
git check-ignore .env
# Verify .env.example exists (if .env exists)
test -f .env.example
```

### 4. SQL Safety
- Scan for string concatenation in SQL queries
- Verify parameterized queries or ORM usage

### 5. RLS Check (if Supabase project)
- Verify all user-data tables have RLS enabled
- Check for policies on each RLS-enabled table

## Quick Scan vs Full Scan

| Mode | Checks | When |
|------|--------|------|
| Quick (`*security-scan quick`) | 1-3 only | Before every commit |
| Full (`*security-scan full`) | All 1-5 + CORS + headers | Before deploy |

## Output Format

```
## Security Scan — {timestamp}

| Check | Status | Details |
|-------|--------|---------|
| Secrets | PASS | No hardcoded secrets found |
| Deps | WARN | 2 moderate vulnerabilities |
| Env | PASS | .env gitignored, .env.example present |
| SQL | PASS | All queries parameterized |
| RLS | N/A | No Supabase detected |

Verdict: PASS | WARN | BLOCKED
```

## Rules
- BLOCKED verdict prevents deploy — no override without user confirmation
- WARN allows deploy but must be documented as tech debt
- Reference: Constitution Article X, `.claude/rules/security-data-protection.md`
