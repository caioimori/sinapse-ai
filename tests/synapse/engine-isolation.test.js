/**
 * SynapseEngine — Per-layer isolation tests (PORT #11)
 *
 * Proves that a layer throwing inside _safeProcess is isolated:
 *   - The pipeline chain continues with remaining layers.
 *   - The failing layer is recorded in metrics with status 'error'.
 *   - errorDetails is serialized via serializeError (contains SNPS_ code).
 *   - Layers returning null with getLastError() are also recorded as 'error'.
 *
 * Isolation strategy (deterministic across the full `jest` run):
 *   The engine exposes a dependency-injection seam — `new SynapseEngine(path,
 *   { layers: [...] })` uses the supplied layer instances verbatim instead of
 *   loading L0-L7 from disk. We inject plain mock layers here. This removes ALL
 *   dependence on `jest.mock` hoisting and module-cache ordering, which is why
 *   the suite used to fail (5 tests) only when another file loaded the real
 *   engine + real layers earlier in the same Jest worker. No `jest.mock`,
 *   no `jest.resetModules`, no virtual modules — the test controls its own deps.
 *
 * @module tests/synapse/engine-isolation
 */

const { SynapseEngine, PipelineMetrics } = require('../../.sinapse-ai/core/synapse/engine');

jest.setTimeout(30000);

// ---------------------------------------------------------------------------
// Mock layers — injected directly via the engine's DI seam (no jest.mock).
// Each exposes name / layer / _safeProcess, matching the LayerProcessor contract
// the engine consumes. _safeProcess is the real public entry point the engine
// calls, so a throwing _safeProcess here exercises the exact isolation path.
// ---------------------------------------------------------------------------

function makeMockLayers() {
  return [
    // L0 — healthy
    {
      name: 'constitution',
      layer: 0,
      _safeProcess() {
        return { rules: ['CONST_RULE'], metadata: { layer: 0, source: 'constitution' } };
      },
    },
    // L1 — throws (must NOT abort the pipeline)
    {
      name: 'global',
      layer: 1,
      _safeProcess() {
        throw new Error('L1 exploded intentionally');
      },
    },
    // L2 — healthy (must still run AFTER L1 throws)
    {
      name: 'agent',
      layer: 2,
      _safeProcess() {
        return { rules: ['AGENT_RULE'], metadata: { layer: 2, source: 'agent' } };
      },
    },
  ];
}

// =============================================================================
// Pipeline isolation — throwing layer
// =============================================================================

describe('SynapseEngine — per-layer isolation (PORT #11)', () => {
  let engine;

  beforeEach(() => {
    engine = new SynapseEngine('/fake/.sinapse', { layers: makeMockLayers() });
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

  test('a layer returning null with getLastError() is recorded as error (not skipped)', async () => {
    const nullWithError = {
      name: 'global',
      layer: 1,
      _safeProcess() { return null; },
      getLastError() { return new Error('layer self-reported failure'); },
    };
    const engineNull = new SynapseEngine('/fake/.sinapse', {
      layers: [makeMockLayers()[0], nullWithError, makeMockLayers()[2]],
    });

    const { metrics } = await engineNull.process('test prompt', { prompt_count: 0 });

    expect(metrics.per_layer.global.status).toBe('error');
    expect(metrics.per_layer.global.error).toContain('layer self-reported failure');
    expect(metrics.layers_errored).toBe(1);
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
