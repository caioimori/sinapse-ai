/**
 * Verification Tests for Active SINAPSE Memory Modules
 *
 * Tests active memory modules:
 * 1. Feedback Loop (gotchas-memory.js)
 *
 * @created 2026-01-29
 * @updated 2026-02-09 - Removed orphan modules tests (Story MIS-2)
 * @updated 2026-06-15 - Status note added (see below)
 * @updated 2026-07-03 - Suite "Custom Rules per Project" removida: o
 *   semantic-merge-engine foi removido na execução do DEC-03 (cluster
 *   multi-story órfão — docs/epics/epic-ultra-optimization/decisions/)
 *
 * STATUS — IMPORTANT (do not mistake this for a passing CI gate):
 * This is a `.verify.js` standalone script (run manually via `node`), NOT a
 * Jest spec — jest.config.js only matches `*.test.js`/`*.spec.js`, so it never
 * runs in CI. The "Feedback Loop" section below asserts the Story 9.4 surface
 * (FeedbackType enum + trackUserFeedback / getAccuracyMetrics / getSuggestedRules)
 * which is NOT yet implemented in gotchas-memory.js — those assertions are a
 * forward spec for pending work, not a regression check. The Custom Rules
 * section reflects shipped behavior. Do not "fix" this by inventing the feedback
 * feature without its story (Constitution Art. IV — No Invention).
 */

// Test helpers
const testResults = {
  passed: 0,
  failed: 0,
  errors: [],
};

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    testResults.passed++;
  } catch (error) {
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${error.message}`);
    testResults.failed++;
    testResults.errors.push({ name, error: error.message });
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertDefined(value, message) {
  if (value === undefined || value === null) {
    throw new Error(message || 'Value is undefined or null');
  }
}

// ============================================================================
// TEST SUITE 1: FEEDBACK LOOP
// ============================================================================

console.log('\n🔄 Testing Feedback Loop...\n');

test('GotchasMemory module loads with FeedbackType', () => {
  const { GotchasMemory, FeedbackType } = require('../gotchas-memory');

  assertDefined(GotchasMemory, 'GotchasMemory should be defined');
  assertDefined(FeedbackType, 'FeedbackType should be defined');
});

test('FeedbackType has required types', () => {
  const { FeedbackType } = require('../gotchas-memory');

  assertEqual(FeedbackType.HELPFUL, 'helpful', 'HELPFUL type');
  assertEqual(FeedbackType.NOT_HELPFUL, 'not_helpful', 'NOT_HELPFUL type');
  assertEqual(FeedbackType.FALSE_POSITIVE, 'false_positive', 'FALSE_POSITIVE type');
  assertEqual(FeedbackType.MISSED, 'missed', 'MISSED type');
  assertEqual(FeedbackType.IMPROVED, 'improved', 'IMPROVED type');
});

test('GotchasMemory has trackUserFeedback method', () => {
  const { GotchasMemory } = require('../gotchas-memory');

  // GotchasMemory constructor takes rootPath as first arg (string)
  const memory = new GotchasMemory(process.cwd());
  assertDefined(memory.trackUserFeedback, 'trackUserFeedback method should exist');
});

test('GotchasMemory has getAccuracyMetrics method', () => {
  const { GotchasMemory } = require('../gotchas-memory');

  const memory = new GotchasMemory(process.cwd());
  assertDefined(memory.getAccuracyMetrics, 'getAccuracyMetrics method should exist');
});

test('GotchasMemory has getSuggestedRules method', () => {
  const { GotchasMemory } = require('../gotchas-memory');

  const memory = new GotchasMemory(process.cwd());
  assertDefined(memory.getSuggestedRules, 'getSuggestedRules method should exist');
});

test('GotchasMemory can track feedback', () => {
  const { GotchasMemory, FeedbackType } = require('../gotchas-memory');

  const memory = new GotchasMemory(process.cwd());
  const result = memory.trackUserFeedback({
    gotchaId: 'test-gotcha-1',
    feedbackType: FeedbackType.HELPFUL,
    comment: 'Test feedback',
  });

  assertDefined(result, 'Result should be defined');
  // Result structure may vary
  assertTrue(typeof result === 'object', 'Result should be an object');
});

test('GotchasMemory can get accuracy metrics', () => {
  const { GotchasMemory } = require('../gotchas-memory');

  const memory = new GotchasMemory(process.cwd());
  const metrics = memory.getAccuracyMetrics();

  assertDefined(metrics, 'Metrics should be defined');
  assertTrue(typeof metrics === 'object', 'Metrics should be an object');
});

// ============================================================================
// TEST SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60));
console.log(`\n  ✅ Passed: ${testResults.passed}`);
console.log(`  ❌ Failed: ${testResults.failed}`);
console.log(`  📊 Total:  ${testResults.passed + testResults.failed}`);

if (testResults.errors.length > 0) {
  console.log('\n  Errors:');
  testResults.errors.forEach((e) => {
    console.log(`    - ${e.name}: ${e.error}`);
  });
}

console.log('\n' + '='.repeat(60));

// Exit with error code if tests failed
process.exit(testResults.failed > 0 ? 1 : 0);

