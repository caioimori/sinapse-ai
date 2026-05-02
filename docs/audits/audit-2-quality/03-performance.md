# Audit 2 — Sub-Report 3: Performance

**Date:** 2026-04-28
**Verdict:** GREEN with one yellow flag
**Method:** Direct CLI cold-start timing (Windows 11), `npm pack --dry-run`, hook size inspection

## Cold Start Times (3 runs each, best wall-clock)

| Command | Time | Verdict |
|---|---:|---|
| `node bin/cli.js help` | ~45ms | EXCELLENT |
| `node bin/cli.js --help` | ~46ms | EXCELLENT |
| `node bin/cli.js status` | ~98ms | OK |
| `node bin/sinapse.js help` | ~246ms | OK (validates Claude install) |

Industry baseline for Node CLIs: <200ms cold start = excellent. SINAPSE CLI hits 45-50ms for the main entry — top decile.

## Package Size

| Metric | Value | Industry Norm | Verdict |
|---|---:|---:|---|
| Tarball size | 8.6 MB | <10MB acceptable | OK |
| Unpacked size | 30.4 MB | <50MB acceptable | OK |
| Total files | 4053 | — | YELLOW |
| Squad task .md files in tarball | hundreds | — | YELLOW |

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q3.1 | P2 | **4053 files in tarball** is high — some npm registries throttle large file counts. Most are squad task `.md` files. Could be tarballed/lazy-loaded. | `npm pack --dry-run` |
| Q3.2 | P2 | Unpacked 30.4MB — mostly markdown. Consider lazy install (download squad bundles on demand instead of shipping all 19 in main tarball). | `npm pack` |
| Q3.3 | OK | CLI cold start 45ms (top decile for Node CLIs) | direct measurement |

## Hook Overhead

Pre-commit hook runs (sequential):
1. `git-branch-guard.js`
2. `staged-secret-scan.js` (8 regex patterns × N staged files)
3. `framework-guard.js` (245 LOC)
4. `ensure-manifest.js --validate-only`

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q3.4 | P2 | No timing instrumentation on pre-commit hook chain. Unknown actual overhead per commit. | `.husky/pre-commit` |
| Q3.5 | P2 | `validate:parity:fast` in pre-push has fast-path (no agents changed → skip), good design | `.husky/pre-push` comments |

## Test Suite Performance

| Metric | Value | Verdict |
|---|---:|---|
| Wall-clock (full coverage run) | 75.6s | OK (target <120s) |
| Total tests | 11228 | — |
| Tests/sec | ~149 | EXCELLENT |
| Skipped suites | 23 | YELLOW |

## Largest Files (potential refactor candidates)

| File | LOC | Note |
|---|---:|---|
| `.sinapse-ai/infrastructure/scripts/performance-optimizer.js` | 1902 | God file |
| `bin/cli.js` | 1752 | Entry point — risk |
| `.sinapse-ai/core/execution/semantic-merge-engine.js` | 1736 | Complex domain |
| `.sinapse-ai/infrastructure/scripts/pattern-extractor.js` | 1562 | — |
| `.sinapse-ai/core/orchestration/master-orchestrator.js` | 1543 | Orchestrator complexity |
| `.sinapse-ai/core/execution/build-state-manager.js` | 1530 | — |
| `packages/installer/src/installer/post-install-validator.js` | 1522 | — |

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q3.6 | P1 | `bin/cli.js` 1752 lines — entrypoint should be <300 LOC dispatcher; rest split into modules | wc -l |
| Q3.7 | P2 | 7 files >1500 LOC. Cyclomatic complexity unknown but high probability of >20 per major function. | wc -l |

## Recommended Stories (Bloco Fix)

- **Story Q3-A (P1):** Refactor `bin/cli.js` into thin dispatcher (target <500 LOC) + extracted command modules
- **Story Q3-B (P2):** Add timing instrumentation to `.husky/pre-commit` chain (telemetry to detect regressions)
- **Story Q3-C (P2):** Investigate squad-bundle lazy loading to reduce file count from 4053
- **Story Q3-D (P2):** Set up CLI cold-start regression test (`time` budget <100ms in CI)
