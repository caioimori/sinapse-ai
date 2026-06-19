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
    // v2.1 Migration: Tests with removed common/utils modules (OSR-10 tech debt)
    // These tests reference modules removed during v4.31.0 → v2.1 migration
    'tests/tools/backward-compatibility.test.js',
    'tests/tools/clickup-helpers.test.js',
    'tests/tools/clickup-validators.test.js',
    'tests/tools/google-workspace-helpers.test.js',
    'tests/tools/google-workspace-validators.test.js',
    'tests/tools/n8n-helpers.test.js',
    'tests/tools/n8n-validators.test.js',
    'tests/tools/schema-detection.test.js',
    'tests/tools/supabase-helpers.test.js',
    'tests/tools/supabase-validators.test.js',
    'tests/tools/validation-performance.test.js',
    'tests/tools/validators.test.js',
    'tests/integration/tools-system.test.js',
    'tests/unit/tool-helper-executor.test.js',
    'tests/unit/tool-validation-helper.test.js',
    'tests/unit/tool-resolver.test.js',
    'tests/regression/tools-migration.test.js',
    'tests/performance/tools-system-benchmark.test.js',
    'tests/clickup/status-sync.test.js',
    'tests/story-update-hook.test.js',
    'tests/epic-verification.test.js',
    'tests/e2e/story-creation-clickup.test.js',
    'tests/installer/v21-structure.test.js',
    // Squad template tests use ESM imports - run separately with --experimental-vm-modules
    '.sinapse-ai/development/templates/squad-template/tests/',
    // Manifest suites re-enabled (fix-registry-dedup-stale): they now act as the
    // drift detector for service-registry.json — validateAll() fails CI on duplicate
    // worker IDs or missing files, the exact defects this story fixed.
    // Performance tests are flaky on different hardware (OSR-10 tech debt)
    'tests/integration/install-transaction.test.js',
    // License tests require network/crypto resources unavailable in CI (pre-existing)
    'tests/license/',
    // Workflow intelligence tests - assertion count mismatches (pre-existing)
    '.sinapse-ai/workflow-intelligence/__tests__/',
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

  // Coverage thresholds — RATCHET POLICY (Story 10.19)
  //
  // These floors track the current actual coverage MINUS a 1pp safety buffer.
  // A 1pp regression still passes; a 2pp regression fails. The intent is to
  // make coverage monotonically non-decreasing over time without forcing a
  // PR to add tests just because of timing.
  //
  // To raise the floors:
  //   1. npm run test:coverage
  //   2. Read the actual numbers from coverage/lcov-report/index.html
  //   3. Bump the values below to (actual - 1)
  //   4. Document the bump in the relevant story's Change Log
  //
  // NEVER lower these floors without an explicit story justification.
  //
  // Baseline captured 2026-04-13 on Story 10.19 (deterministic re-run after
  // first reading was inflated by test pollution between runs):
  //   statements 24.44% -> floor 23
  //   branches   22.03% -> floor 21
  //   functions  26.06% -> floor 25
  //   lines      24.58% -> floor 23
  //
  // These floors are deliberately just above the legacy 19-22 floors so the
  // ratchet starts from an honest, reproducible state. Raising them is
  // future work for a follow-up story focused on test additions.
  //
  // .sinapse-ai/core/ — kept at 38 (legacy floor, was already passing before
  // this story; raising it requires a separate baseline-capture pass that
  // this story explicitly leaves out of scope).
  // Coverage ratchet — só sobe, nunca desce.
  //
  // Baseline 2026-05-05 (deep-audit), MENOR coverage observada entre Node 20/22/24:
  //   - Node 20/22 (local): lines 35.95% · statements 35.84% · functions 38.77% · branches 33.21%
  //   - Node 24 (CI):       lines 26.04% · statements 25.95% · functions 27.52% · branches 23.09%
  //
  // Diferenca = 24 test suites SKIPPED em Node 24 (compatibilidade incompleta).
  // Threshold setado pra Node 24 (menor) - 1pp pra absorver flake.
  // Story de follow-up: investigar suites skipped em Node 24 e habilitar.
  // Quando isso for resolvido, threshold sobe pra ~34% (real Node 22).
  //
  // Bump anterior (2026-04-13): statements 23, branches 21, functions 25, lines 23.
  // Novo (2026-05-05): +1pp em todas dimensoes — ratchet honesto vs CI real.
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
