# Audit 2 — Sub-Report 2: Security (OWASP Top 10 lens)

**Date:** 2026-04-28
**Verdict:** YELLOW
**Method:** `npm audit`, code grep for dangerous patterns, secret-scan inspection, hook security audit

## OWASP Top 10 Coverage

| OWASP # | Category | Status | Evidence |
|---|---|---|---|
| A01 Broken Access Control | Agent Authority gates (@devops exclusive push) | OK | Constitution Art. II + `enforce-git-push-authority.sh` |
| A02 Crypto Failures | N/A (no user data layer in framework) | N/A | — |
| A03 Injection | SQL hook + parameterized queries rule | OK | `sql-governance.py`, `security-scanning.md` |
| A04 Insecure Design | Constitution + gates | OK | 11 articles, multiple gates |
| A05 Security Misconfig | Defaults checked | OK | secret-scan pre-commit |
| A06 Vulnerable Components | **2 vulns open** (1 high, 1 moderate) | **YELLOW** | `npm audit` |
| A07 ID & Auth Failures | N/A (framework, not service) | N/A | — |
| A08 Software/Data Integrity | Manifest signing test exists | OK | `tests/security/manifest-signing.test.js` |
| A09 Logging/Monitoring | Telemetry module exists | OK | `.sinapse-ai/core/telemetry/` |
| A10 SSRF | N/A (no outbound by default) | N/A | — |

## Findings

### P0 / P1

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q2.1 | **P1** | `picomatch` 4.0.0-4.0.3 ReDoS + method injection (HIGH) — present in `node_modules/npm/node_modules/tinyglobby/node_modules/picomatch` (transitive via npm itself) | `npm audit` |
| Q2.2 | **P1** | `brace-expansion` 4.0.0-5.0.4 zero-step hang/memory exhaustion (MODERATE) — transitive in `node_modules/npm/` | `npm audit` |
| Q2.3 | P2 | Audit 1 claimed "0 Dependabot alerts open" — true for direct deps, but `npm audit` finds 2 in npm-bundled transitives. Audit 1 finding needs nuance. | comparison |

**Note Q2.1/Q2.2 nuance:** Both vulns are in `node_modules/npm/...` — these are bundled with npm itself, not direct dependencies of sinapse-ai. The `overrides` block in `package.json` already pins `picomatch ^4.0.4` and `brace-expansion ^5.0.5`, but the override doesn't reach into npm's bundled tree. Risk is low for end-users (npm is run by the user's npm, not ours), but `npm audit` still flags them in CI.

### Code-Level Security (manual grep)

| Concern | Result | Verdict |
|---|---|---|
| `eval(` usage | 6 matches — **all are detection patterns** in security validators | OK |
| `new Function(` | 0 matches in production code | OK |
| `child_process` shell:true with interpolation | 0 matches | OK |
| `fs.*Sync` with unsanitized request input | 0 matches | OK |
| Path traversal protection | `tests/security/path-traversal.test.js` exists | OK |
| Prototype pollution `Object.prototype` mutation | 0 matches in non-test prod code | OK |
| Secret-scan patterns | 8 patterns covered: PEM keys, GitHub PAT, OpenAI, AWS, Google, Slack | OK |

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q2.4 | OK | Secret-scan covers 8 token formats, blocks `.env*` (allow `.example/sample/template`) | `bin/utils/staged-secret-scan.js:9-17` |
| Q2.5 | P2 | Secret-scan uses `execSync` for git diff — fine, but no max output bound on `git diff --cached --name-only` (low risk) | `staged-secret-scan.js:21-26` |
| Q2.6 | P2 | Merge-utils protects against `__proto__` mutation via `Object.getPrototypeOf` check, but no explicit denylist for `constructor` / `prototype` keys when deep-merging YAML | `.sinapse-ai/core/config/merge-utils.js:23-29` |
| Q2.7 | P2 | No SAST integration in CI (e.g., Semgrep, CodeQL, Snyk) beyond CodeRabbit | `.github/workflows/` |
| Q2.8 | P3 | npm tarball does not include `.npmrc` provenance signing — supply chain attestation absent | `npm pack --dry-run` |

## Recommended Stories (Bloco Fix)

- **Story Q2-A (P1):** Document Q2.1/Q2.2 in known-issues with mitigation (transitive in npm internals, end-user risk minimal); track upstream npm fix
- **Story Q2-B (P2):** Harden `merge-utils.js` against `constructor`/`prototype` injection in YAML deep-merge
- **Story Q2-C (P2):** Add `npm provenance` to publish flow (supply chain attestation)
- **Story Q2-D (P3):** Evaluate adding GitHub CodeQL or Semgrep job (one-time setup, free for OSS)
