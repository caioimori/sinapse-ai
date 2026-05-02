# Audit 2 — Sub-Report 5: Dependencies

**Date:** 2026-04-28
**Verdict:** GREEN with two yellow flags
**Method:** `npm ls`, `npm audit`, `license-checker`, `depcheck`

## Tree Health

| Metric | Value | Verdict |
|---|---:|---|
| `npm ls` clean (no UNMET) | YES | OK |
| Direct deps | 24 | OK |
| Direct devDeps | 14 | OK |
| Total deps in tree | ~916 (license-checker count) | OK |
| Vulns | 1 high + 1 moderate (transitive in npm) | YELLOW (see Q2.1/Q2.2) |
| Deprecated warnings | 7 (in `npx license-checker` chain only) | OK |

## License Audit

License distribution (from `license-checker --summary`):

| License | Count | GA-Compatible? |
|---|---:|---|
| MIT | 676 | YES |
| ISC | 139 | YES |
| Apache-2.0 | 34 | YES |
| BSD-3-Clause | 20 | YES |
| BSD-2-Clause | 17 | YES |
| BlueOak-1.0.0 | 15 | YES |
| (MIT OR CC0-1.0) | 6 | YES |
| CC0-1.0 | 2 | YES |
| (MIT OR Apache-2.0) | 1 | YES |
| Python-2.0 | 1 | YES |
| **CC-BY-4.0** | 1 | YELLOW — attribution required |
| Artistic-2.0 | 1 | YES |
| Apache 2.0 (typo variant) | 1 | YES |
| (BSD-2-Clause OR MIT OR Apache-2.0) | 1 | YES |
| **CC-BY-3.0** | 1 | YELLOW — attribution required |
| 0BSD | 1 | YES |

**No GPL/AGPL/SSPL detected.** Safe for MIT distribution.

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q5.1 | P2 | Two **CC-BY** packages (3.0 and 4.0) require attribution. Need to verify NOTICE/THIRD-PARTY-LICENSES file is present and includes them. | `license-checker --summary` |

## Pinning / Override Strategy

`package.json:197-202` overrides 4 transitives:
```yaml
overrides:
  diff: ^8.0.3
  serialize-javascript: ^7.0.5
  picomatch: ^4.0.4
  brace-expansion: ^5.0.5
```

This is **excellent** practice — proactive supply chain hardening for known-vuln packages. However:

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q5.2 | P2 | Overrides don't penetrate `node_modules/npm/...` bundled tree (npm ships its own). The 2 audit findings (Q2.1/Q2.2) survive despite overrides. | `npm audit` |

## Unused Deps (`depcheck`)

| Status | Count | Action |
|---|---:|---|
| Unused production deps | 9 | Verify (high false-positive rate) |
| Unused devDeps | 5 | Verify |
| Missing deps | 2 (`@eslint/js`, `yaml`) | Investigate — used but not declared |

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q5.3 | **P1** | `@eslint/js` and `yaml` used in code but NOT declared in `package.json` — relies on hoisting / transitive resolution. Risk: peer/transitive shift breaks lint or YAML processing. | `npx depcheck` |
| Q5.4 | P2 | `@kayvan/markdown-tree-parser`, `ansi-to-html`, `asciichart`, `chokidar`, `handlebars`, `picocolors`, `proper-lockfile`, `tar`, `validator` — depcheck flags as unused. Likely used dynamically; verify. | `npx depcheck` |
| Q5.5 | P3 | `@semantic-release/changelog`, `@semantic-release/git`, `@types/jest`, `conventional-changelog-conventionalcommits`, `yaml-lint` flagged unused-dev. Likely used by semantic-release config; verify. | `npx depcheck` |

## Engines

```json
"engines": { "node": ">=18.0.0", "npm": ">=9.0.0" }
```

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q5.6 | P3 | Node 18 is in maintenance LTS until 2025-04-30. By v1.0.0 GA, consider bumping floor to Node 20. | `package.json:160-163` |

## Recommended Stories (Bloco Fix)

- **Story Q5-A (P1):** Add `@eslint/js` and `yaml` to explicit `dependencies`/`devDependencies`
- **Story Q5-B (P2):** Verify NOTICE/THIRD-PARTY-LICENSES.md includes CC-BY attribution
- **Story Q5-C (P2):** Audit "unused deps" list — confirm dynamic usage or remove
- **Story Q5-D (P3):** Decide Node engine floor for v1.0.0 GA (18 EOL vs 20 LTS)
