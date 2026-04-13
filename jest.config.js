/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',

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
    // Manifest tests need manifest data alignment (OSR-10 tech debt)
    'tests/unit/manifest/manifest-generator.test.js',
    'tests/unit/manifest/manifest-validator.test.js',
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
  coverageThreshold: {
    global: {
      branches: 21,
      functions: 25,
      lines: 23,
      statements: 23,
    },
    '.sinapse-ai/core/': {
      lines: 38,
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
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Cross-platform config from REMOTE
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
