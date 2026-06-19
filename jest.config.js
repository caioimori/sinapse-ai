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
  // NEVER lower these floors without an explicit story justification.
  //
  // ⚠️ READ THIS BEFORE RAISING `global` (story test-coverage-threshold-semantics):
  // Coverage in this repo is DETERMINISTIC (~37% all-files). An earlier story
  // (#254) wrongly called it "nondeterministic, swinging 26%↔37%". That was a
  // misread: jest reports TWO different numbers in every run and they were compared
  // across runs as if they were the same metric. They are not:
  //
  //   1. The text-summary / CI job summary (~37%) = coverage over ALL files.
  //   2. The `global` threshold check (~26.5%) = coverage over all files EXCEPT
  //      those matched by a path key below. Jest REMOVES path-keyed files from the
  //      `global` bucket. Because `.sinapse-ai/core/` is ~80% covered and a large
  //      chunk, "all minus core" drops to ~26.5%.
  //
  // Verified (deterministic, identical across runs):
  //   all files:    stmts 37.27% · br 34.43% · fn 40.65% · ln 37.47%
  //   all − core/:  stmts 26.55% · br 23.80% · fn 27.80% · ln 26.68%  ← `global` sees this
  //   core/ only:   stmts ~79%   · br ~69%    · fn ~80%    · ln ~80%
  //
  // So the `global` floors below protect NON-CORE code (real ~26.5%, floor ≈ real−1)
  // and `.sinapse-ai/core/` is checked separately (real ~80%, floor ≈ real−1..2).
  // DO NOT set `global` to 37 — that number is the blend, which no single threshold
  // bucket actually measures; it would fail CI immediately (global sees ~26.5%).
  // To raise a floor: `npm run test:coverage`, read the RIGHT bucket, bump to real−1.
  coverageThreshold: {
    global: {
      branches: 22,
      functions: 26,
      lines: 25,
      statements: 24,
    },
    '.sinapse-ai/core/': {
      branches: 67,
      functions: 79,
      lines: 78,
      statements: 78,
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
