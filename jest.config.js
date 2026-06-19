/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  // Story 10.25 — json-summary lets scripts/coverage-report-summary.js
  // read the rolled-up percentages from coverage/coverage-summary.json.
  coverageReporters: ['lcov', 'text', 'text-summary', 'html', 'json-summary', 'clover'],

  // Test patterns from LOCAL (mais específico)
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/.sinapse-ai/**/__tests__/**/*.test.js',
    // Pro tests run via pro-integration.yml CI workflow (not in local npm test)
    // '**/pro/**/__tests__/**/*.test.js',
  ],

  // Ignore patterns - exclude incompatible test frameworks
  testPathIgnorePatterns: [
    '/node_modules/',
    // Local reference clones (gitignored, not part of this package — present only on
    // dev machines that cloned a reference repo under colaborator/). Absent in CI;
    // excluding here makes local `npm test` match CI instead of running foreign suites.
    '<rootDir>/colaborator/',
    // Pro submodule tests — run via pro-integration.yml CI workflow, not local npm test
    // Use anchored regex to only match the pro/ submodule dir, not tests/pro/
    '<rootDir>/pro/',
    // Playwright e2e tests (use ESM imports, run with Playwright not Jest)
    'tools/quality-dashboard/tests/e2e/',
    // Windows-specific tests (only run on Windows CI)
    'tests/integration/windows/',
    // Node.js native test runner tests (use node:test module)
    'tests/installer/v21-path-validation.test.js',
    // NOTE: The OSR-10 "tools-system" suites (tests/tools/**, tool-*, tools-system,
    // clickup/story-clickup, v21-structure) were DELETED, not ignored: they tested the
    // common/utils/** and tools/installer/lib/** subsystems removed in the v4.31→v2.1
    // migration. Nothing points to that code anymore, so the tests were dead (not
    // recoverable by path-rewrite). Removed in chore/remove-dead-tools-tests.
    // Squad template tests use ESM imports - run separately with --experimental-vm-modules
    '.sinapse-ai/development/templates/squad-template/tests/',
    // Manifest suites re-enabled (fix-registry-dedup-stale): they now act as the
    // drift detector for service-registry.json — validateAll() fails CI on duplicate
    // worker IDs or missing files, the exact defects this story fixed.
    // Performance tests are flaky on different hardware (OSR-10 tech debt)
    'tests/integration/install-transaction.test.js',
    // License tests require network/crypto resources unavailable in CI (pre-existing)
    'tests/license/',
    // NOTE: workflow-intelligence suite (204 tests) was RE-ENABLED in
    // test-coverage-honest-ratchet. The old "assertion count mismatches" reason was a
    // stale-count bug (registry grew 10→12 workflows); the 5 affected assertions now
    // derive their expected count from workflow-patterns.yaml.
  ],

  // Coverage collection (Story TD-3: Updated paths)
  collectCoverageFrom: [
    'src/**/*.js',
    '.sinapse-ai/**/*.js',
    'bin/**/*.js',
    'packages/**/*.js',
    'scripts/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**',
    '!**/__tests__/**',
    '!**/*.test.js',
    '!**/*.spec.js',
    // Exclude templates, generated files, and legacy scripts
    '!.sinapse-ai/development/templates/**',
    '!.sinapse-ai/development/scripts/**',
    '!.sinapse-ai/core/orchestration/**',
    '!.sinapse-ai/core/execution/**',
    '!.sinapse-ai/hooks/**',
    '!.sinapse-ai/product/templates/**',
    '!**/dist/**',
    // Story TD-6: Exclude I/O-heavy health check plugins from core coverage
    // These are integration-test candidates (git, npm, network, disk, docker, etc.)
    // Core engine/healers/reporters remain in scope with 80%+ coverage
    '!.sinapse-ai/core/health-check/checks/**',
    // Story TD-6: Exclude config/manifest modules - mostly I/O operations
    // These modules handle file system operations and JSON parsing
    // Better suited for integration tests
    '!.sinapse-ai/core/config/**',
    '!.sinapse-ai/core/manifest/**',
    // Story TD-6: Exclude registry (file I/O heavy) and utils (helper functions)
    // These provide supporting functionality tested indirectly through main modules
    '!.sinapse-ai/core/registry/**',
    '!.sinapse-ai/core/utils/**',
  ],

  // Coverage thresholds — RATCHET POLICY
  //
  // These floors sit at the LOW end of the observed coverage swing (see below).
  // The intent is to make coverage monotonically non-decreasing over time without
  // false-failing a PR.
  //
  // NEVER lower these floors without an explicit story justification.
  //
  // ⚠️ COVERAGE IS NONDETERMINISTIC IN THIS REPO — DO NOT raise these floors to the
  // "high" reading (story test-coverage-honest-ratchet, 2026-06-19).
  // The same `npm run test:coverage` swings ~26% ↔ 37% between runs, IN CI, on the
  // same commit. Empirically confirmed:
  //   - main runs 27849649808 / 27849141825 (Node 24): stmts 36.86% · br 34.09% ·
  //     fn 40.2% · ln 37.04%
  //   - PR run 27850908885 (Node 24, same code + 5 extra deterministic suites):
  //     stmts 26.58% · br 23.78% · fn 27.76% · ln 26.7%
  // Both runs SKIP the exact same set (18 suites / 212 tests), so the swing is NOT
  // skip-count variance — it is coverage-COLLECTION nondeterminism (suspected jest
  // multi-worker: a heavy worker's coverage occasionally not aggregating). The old
  // comment blamed "Node 24 skipped suites"; that rationale was wrong, but the LOW
  // floors were the correct defensive choice and MUST stay until the collection
  // nondeterminism is root-caused. floor = floor(low-swing − ~1pp).
  //
  // FOLLOW-UP (the real coverage debt): root-cause the 11pp collection swing
  // (jest maxWorkers / worker coverage aggregation), make it deterministic, THEN
  // ratchet the floors up to the stable real number (~37% global, ~80% core/).
  //
  // Note: .sinapse-ai/core/ held ~80% (its floors are unaffected by the global
  // swing in every run observed) but is left at the conservative legacy floor for
  // the same reason — no proof it can't swing once the root cause is understood.
  coverageThreshold: {
    global: {
      branches: 22,
      functions: 26,
      lines: 25,
      statements: 24,
    },
    '.sinapse-ai/core/': {
      lines: 45,
    },
  },

  // Coverage ignore patterns from REMOTE
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage/', '/.husky/', '/dist/'],

  // Timeout from REMOTE (30s melhor para operações longas)
  testTimeout: 30000,

  // Config from LOCAL
  verbose: true,
  roots: ['<rootDir>'],
  moduleDirectories: ['node_modules', '.'],

  // A local `npm install` inside .sinapse-ai/ creates a nested (gitignored)
  // .sinapse-ai/node_modules. Without this mapping, modules under .sinapse-ai/core/
  // resolve their deps (glob, js-yaml, ...) from that nested path, while the test
  // files resolve from the root node_modules. jest.mock() registers mocks by the
  // RESOLVED absolute path, so the test's mock('glob') and the source-under-test's
  // require('glob') point at two different files — the mock never intercepts, and
  // ~170 tests fail LOCALLY with mocks that silently don't apply. CI never sees this
  // (clean `npm ci`, no nested dir). Forcing these deps to a single canonical path
  // (root node_modules) makes both sides resolve to the same module so mocks apply.
  // All 13 nested deps also exist at the root. Production (`npx sinapse`) is
  // unaffected — this mapping only applies in the jest test environment.
  moduleNameMapper: {
    '^(ajv|chalk|commander|cross-spawn|diff|execa|fast-glob|fs-extra|glob|highlight\\.js|inquirer|js-yaml|semver|tar)$':
      '<rootDir>/node_modules/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Cross-platform config from REMOTE
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
