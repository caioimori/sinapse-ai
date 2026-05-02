# Audit 1.1 — Install Matrix

**Verdict:** 🟢 PASS
**Auditor:** Architect (Aria/Stratum)
**Date:** 2026-04-28
**Scope:** `npx sinapse-ai install` cross-platform validation via CI matrix + local doctor.

## Verification

### CI Matrix Workflow

- File: `.github/workflows/install-matrix.yml`
- Combos: 24 required (Win11/macOS/Ubuntu × npm/pnpm/yarn × global/npx-dlx/local) MINUS 3 documented exclusions (Windows × Yarn v1, platform bug — Yarn classic in maintenance since 2020)
- Runner: `.github/workflows/install-matrix/run-combo.sh`
- Gating: triggered by `release` label OR PR touching `package.json`/`bin/**`/`install-manifest.yaml`

### Recent Runs (last 5)

All ✅ success on `caio/release/10.0.0-rc.11` and surrounding PRs (gh run list 2026-05-02). No failures since rc.10.

### Local Smoke

`node bin/cli.js --help` renders correctly (UTF-8, ANSI colors, all 7 commands listed).
`node bin/cli.js doctor` → 11 PASS / 4 WARN / 0 FAIL (all WARNs are auto-fixable).

## Findings

| ID | Sev | Finding | Evidence |
|----|-----|---------|----------|
| INS-1 | P3 | Yarn v1 × Windows excluded as documented platform bug — acceptable but worth re-validating Yarn Berry coverage | `.github/workflows/install-matrix.yml:5-13` |
| INS-2 | P2 | Install Matrix only triggers on PRs with `release` label or packaging touches — regular dev PRs skip the gate | `.github/workflows/install-matrix.yml:25-39` |

## Recommendation
PASS. Install matrix is healthy and CI-gated. Yarn Berry coverage on Windows is an acceptable v1.x story (P3, not GA-blocker).
