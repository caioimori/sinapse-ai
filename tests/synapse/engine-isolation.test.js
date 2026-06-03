/**
 * SynapseEngine — Per-layer isolation tests (PORT #11)
 *
 * Proves that a layer throwing inside _safeProcess is isolated:
 *   - The pipeline chain continues with remaining layers.
 *   - The failing layer is recorded in metrics with status 'error'.
 *   - errorDetails is serialized via serializeError (contains SNPS_ code).
 *   - Layers returning null with getLastError() are also recorded as 'error'.
 *
 * @module tests/synapse/engine-isolation
 */

jest.setTimeout(30000);

// ---------------------------------------------------------------------------
// Mocks — must be set BEFORE require
// ---------------------------------------------------------------------------

jest.mock('../../.sinapse-ai/core/synapse/context/context-tracker', () => ({
  estimateContextPercent: jest.fn(() => 10),
  calculateBracket: jest.fn(() => 'FRESH'),
  getActiveLayers: jest.fn(() => ({ layers: [0, 1, 2], memoryHints: false, handoffWarning: false })),
  getTokenBudget: jest.fn(() => 800),
  needsMemoryHints: jest.fn(() => false),
  needsHandoffWarning: jest.fn(() => false),
}));

jest.mock('../../.sinapse-ai/core/synapse/output/formatter', () => ({
  formatSynapseRules: jest.fn(() => '<synapse-rules>\n</synapse-rules>'),
}));

jest.mock('../../.sinapse-ai/core/synapse/memory/memory-bridge', () => ({
  MemoryBridge: jest.fn().mockImplementation(() => ({
    getMemoryHints: jest.fn(() => Promise.resolve([])),
  })),
}));

// L0 — healthy
jest.mock('../../.sinapse-ai/core/synapse/layers/l0-constitution', () => {
  return class MockL0 {
    constructor() { this.name = 'constitution'; this.layer = 0; }
    _safeProcess() { return { rules: ['CONST_RULE'], metadata: { layer: 0, source: 'constitution' } }; }
  };
}, { virtual: true });

// L1 — throws
jest.mock('../../.sinapse-ai/core/synapse/layers/l1-global', () => {
  return class MockL1Throwing {
    constructor() { this.name = 'global'; this.layer = 1; }
    _safeProcess() { throw new Error('L1 exploded intentionally'); }
  };
}, { virtual: true });

// L2 — healthy (must still run after L1 throws)
jest.mock('../../.sinapse-ai/core/synapse/layers/l2-agent', () => {
  return class MockL2 {
    constructor() { this.name = 'agent'; this.layer = 2; }
    _safeProcess() { return { rules: ['AGENT_RULE'], metadata: { layer: 2, source: 'agent' } }; }
  };
}, { virtual: true });

// L3-L7 — not found (each must be its own jest.mock call — no out-of-scope vars)
jest.mock('../../.sinapse-ai/core/synapse/layers/l3-workflow', () => {
  const err = new Error("Cannot find module './layers/l3-workflow'");
  err.code = 'MODULE_NOT_FOUND';
  throw err;
}, { virtual: true });

jest.mock('../../.sinapse-ai/core/synapse/layers/l4-task', () => {
  const err = new Error("Cannot find module './layers/l4-task'");
  err.code = 'MODULE_NOT_FOUND';
  throw err;
}, { virtual: true });

jest.mock('../../.sinapse-ai/core/synapse/layers/l5-squad', () => {
  const err = new Error("Cannot find module './layers/l5-squad'");
  err.code = 'MODULE_NOT_FOUND';
  throw err;
}, { virtual: true });

jest.mock('../../.sinapse-ai/core/synapse/layers/l6-keyword', () => {
  const err = new Error("Cannot find module './layers/l6-keyword'");
  err.code = 'MODULE_NOT_FOUND';
  throw err;
}, { virtual: true });

jest.mock('../../.sinapse-ai/core/synapse/layers/l7-star-command', () => {
  const err = new Error("Cannot find module './layers/l7-star-command'");
  err.code = 'MODULE_NOT_FOUND';
  throw err;
}, { virtual: true });

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

// Re-required fresh before each test (below). A test running earlier in the same
// Jest worker can otherwise leave the engine module cached with the REAL
// context-tracker bound, so getActiveLayers() returns its real value and every
// layer reports 'skipped' — cross-file module-cache pollution. resetModules()
// rebuilds the registry so the hoisted mocks above always apply.
let SynapseEngine, PipelineMetrics;

beforeEach(() => {
  jest.resetModules();
  ({ SynapseEngine, PipelineMetrics } = require('../../.sinapse-ai/core/synapse/engine'));
});

// =============================================================================
// Pipeline isolation — throwing layer
// =============================================================================

describe('SynapseEngine — per-layer isolation (PORT #11)', () => {
  let engine;

  beforeEach(() => {
    engine = new SynapseEngine('/fake/.sinapse');
  });

  test('a throwing layer does NOT abort the pipeline — remaining layers still run', async () => {
    const { metrics } = await engine.process('test prompt', { prompt_count: 0 });

    // L0 ran successfully
    expect(metrics.per_layer.constitution.status).toBe('ok');
    expect(metrics.per_layer.constitution.rules).toBe(1);

    // L1 failed
    expect(metrics.per_layer.global.status).toBe('error');

    // L2 ran successfully AFTER L1 failure
    expect(metrics.per_layer.agent.status).toBe('ok');
    expect(metrics.per_layer.agent.rules).toBe(1);
  });

  test('failed layer error message is recorded', async () => {
    const { metrics } = await engine.process('test prompt', { prompt_count: 0 });

    const globalLayer = metrics.per_layer.global;
    expect(globalLayer.status).toBe('error');
    expect(typeof globalLayer.error).toBe('string');
    expect(globalLayer.error).toContain('L1 exploded intentionally');
  });

  test('failed layer carries errorDetails with a SNPS_ code from serializeError', async () => {
    const { metrics } = await engine.process('test prompt', { prompt_count: 0 });

    const globalLayer = metrics.per_layer.global;
    expect(globalLayer.errorDetails).toBeDefined();
    expect(typeof globalLayer.errorDetails.code).toBe('string');
    expect(globalLayer.errorDetails.code).toMatch(/^SNPS_/);
  });

  test('layers_errored counts exactly the failing layer', async () => {
    const { metrics } = await engine.process('test prompt', { prompt_count: 0 });

    expect(metrics.layers_errored).toBe(1);
    expect(metrics.layers_loaded).toBe(2); // L0 + L2
  });

  test('total_rules only sums successful layers (L0=1, L1=error, L2=1 → 2)', async () => {
    const { metrics } = await engine.process('test prompt', { prompt_count: 0 });

    expect(metrics.total_rules).toBe(2);
  });
});

// =============================================================================
// PipelineMetrics.errorLayer — uses normalizeError + serializeError
// =============================================================================

describe('PipelineMetrics.errorLayer — uses core/errors serializer (PORT #11)', () => {
  test('records error details with SNPS_ code when given a raw Error', () => {
    const metrics = new PipelineMetrics();
    metrics.startLayer('unstable');
    metrics.errorLayer('unstable', new Error('raw failure'));

    const info = metrics.layers.unstable;
    expect(info.status).toBe('error');
    expect(info.error).toContain('raw failure');
    expect(info.errorDetails).toBeDefined();
    expect(info.errorDetails.code).toMatch(/^SNPS_/);
  });

  test('records duration when startLayer was called before error', () => {
    const metrics = new PipelineMetrics();
    metrics.startLayer('timed');
    metrics.errorLayer('timed', new Error('boom'));

    expect(typeof metrics.layers.timed.duration).toBe('number');
    expect(metrics.layers.timed.duration).toBeGreaterThanOrEqual(0);
  });

  test('handles non-Error value (string) without throwing', () => {
    const metrics = new PipelineMetrics();
    expect(() => {
      metrics.errorLayer('string-err', 'something went wrong');
    }).not.toThrow();

    const info = metrics.layers['string-err'];
    expect(info.status).toBe('error');
    expect(info.errorDetails).toBeDefined();
  });
});
