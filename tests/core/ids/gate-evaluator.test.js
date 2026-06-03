'use strict';

const path = require('path');

// Module paths (mirrors verification-gates.test.js convention — no aliases).
const GATE_EVALUATOR_PATH = path.resolve(
  __dirname,
  '../../../.sinapse-ai/core/ids/gate-evaluator.js',
);
const ENGINE_PATH = path.resolve(
  __dirname,
  '../../../.sinapse-ai/core/synapse/context/semantic-handshake-engine.js',
);
const G5_PATH = path.resolve(
  __dirname,
  '../../../.sinapse-ai/core/ids/gates/g5-semantic-handshake.js',
);
const INDEX_PATH = path.resolve(
  __dirname,
  '../../../.sinapse-ai/core/ids/index.js',
);

const { GateEvaluator, DEFAULT_PHASE_GATES } = require(GATE_EVALUATOR_PATH);
const { SemanticHandshakeEngine } = require(ENGINE_PATH);
const { G5SemanticHandshakeGate } = require(G5_PATH);

// ================================================================
// Test Helpers
// ================================================================

/**
 * Suppress evaluator/gate logging during tests while recording calls.
 */
function createMockLogger() {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  };
}

/**
 * Mock IncrementalDecisionEngine — analyze() returns a configurable fixture.
 */
function createMockDecisionEngine(analyzeResult) {
  const defaultResult = {
    intent: 'test',
    recommendations: [],
    summary: { totalEntities: 100, matchesFound: 0, decision: 'CREATE', confidence: 'low' },
    rationale: 'No matches found.',
  };
  return {
    analyze: jest.fn().mockReturnValue(analyzeResult || defaultResult),
  };
}

/**
 * Mock RegistryLoader exposing the query surface gates use.
 */
function createMockRegistryLoader() {
  return {
    load: jest.fn(),
    queryByPath: jest.fn().mockReturnValue([]),
    queryByKeywords: jest.fn().mockReturnValue([]),
    queryByType: jest.fn().mockReturnValue([]),
    queryByPurpose: jest.fn().mockReturnValue([]),
  };
}

/**
 * Build a GateEvaluator wired with mock deps and an explicit phase mapping.
 */
function makeEvaluator(phaseGates, { decisionEngine, registryLoader, engine, logger } = {}) {
  return new GateEvaluator(
    {
      gateEvaluation: {
        enabled: true,
        failOpen: true,
        phaseGates,
      },
    },
    {
      decisionEngine: decisionEngine || createMockDecisionEngine(),
      registryLoader: registryLoader || createMockRegistryLoader(),
      engine,
      logger: logger || createMockLogger(),
    },
  );
}

// ================================================================
// (a) Phase -> gate mapping
// ================================================================

describe('GateEvaluator — phase->gate mapping', () => {
  it('fires G4 and G5 for the 2_development phase, in order', async () => {
    const evaluator = makeEvaluator({ '2_development': ['G4', 'G5'] });

    const verdict = await evaluator.evaluateGatesForPhase('2_development', {
      intent: 'implement circuit breaker',
      storyId: 'IDS-WIRE',
    });

    expect(verdict.results).toHaveLength(2);
    expect(verdict.results[0].gateId).toBe('G4');
    expect(verdict.results[1].gateId).toBe('G5');
    expect(verdict.phase).toBe('2_development');
  });

  it('fires only G1 for the epic_creation phase', async () => {
    const evaluator = makeEvaluator({ epic_creation: ['G1'] });

    const verdict = await evaluator.evaluateGatesForPhase('epic_creation', {
      intent: 'new billing epic',
    });

    expect(verdict.results).toHaveLength(1);
    expect(verdict.results[0].gateId).toBe('G1');
  });

  it('returns an empty result set for a phase with no mapped gates', async () => {
    const evaluator = makeEvaluator({});

    const verdict = await evaluator.evaluateGatesForPhase('unknown_phase', {});

    expect(verdict.results).toHaveLength(0);
    expect(verdict.blocked).toBe(false);
    expect(verdict.blockingGate).toBeNull();
  });

  it('getGatesForPhase reflects the configured mapping', () => {
    const evaluator = makeEvaluator({ story_validation: ['G3'] });
    expect(evaluator.getGatesForPhase('story_validation')).toEqual(['G3']);
    expect(evaluator.getGatesForPhase('missing')).toEqual([]);
  });

  it('exposes a default phase->gate mapping', () => {
    expect(DEFAULT_PHASE_GATES['2_development']).toEqual(['G4', 'G5']);
    expect(DEFAULT_PHASE_GATES.epic_creation).toEqual(['G1']);
  });

  it('returns an empty verdict when gateEvaluation is disabled', async () => {
    const evaluator = new GateEvaluator(
      { gateEvaluation: { enabled: false, phaseGates: { '2_development': ['G4'] } } },
      { decisionEngine: createMockDecisionEngine(), registryLoader: createMockRegistryLoader(), logger: createMockLogger() },
    );

    const verdict = await evaluator.evaluateGatesForPhase('2_development', { intent: 'x' });
    expect(verdict.results).toHaveLength(0);
    expect(verdict.blocked).toBe(false);
  });
});

// ================================================================
// (b) Verdict aggregation — advisory vs blocking
// ================================================================

describe('GateEvaluator — verdict aggregation', () => {
  it('blocked=false when every advisory gate passes', async () => {
    const evaluator = makeEvaluator({ '2_development': ['G4', 'G5'] });

    const verdict = await evaluator.evaluateGatesForPhase('2_development', { intent: 'x' });

    expect(verdict.blocked).toBe(false);
    expect(verdict.blockingGate).toBeNull();
    expect(verdict.correctionPrompt).toBeNull();
  });

  it('aggregates G4 advisory warnings without blocking', async () => {
    const decisionEngine = createMockDecisionEngine({
      intent: 'x',
      recommendations: [
        { entityPath: 'tasks/foo.md', relevanceScore: 0.72, decision: 'ADAPT', rationale: 'similar' },
        { entityPath: 'tasks/bar.md', relevanceScore: 0.65, decision: 'ADAPT', rationale: 'similar' },
      ],
      summary: { totalEntities: 100, matchesFound: 2, decision: 'ADAPT', confidence: 'medium' },
      rationale: '2 matches.',
    });

    const evaluator = makeEvaluator({ '2_development': ['G4'] }, { decisionEngine });

    const verdict = await evaluator.evaluateGatesForPhase('2_development', {
      intent: 'reuse something',
    });

    expect(verdict.blocked).toBe(false);
    const g4 = verdict.results[0];
    expect(g4.gateId).toBe('G4');
    expect(g4.result.opportunities).toHaveLength(2);
    expect(g4.result.warnings.some((w) => w.includes('2 relevant artifacts'))).toBe(true);
  });

  it('blocked=true with blockingGate=G5 and a correction prompt when G5 fails', async () => {
    // Real G5 gate via injected engine carrying a BLOCKER constraint.
    const engine = new SemanticHandshakeEngine({
      constraints: [
        {
          id: 'NO-EVAL',
          description: 'Dynamic eval is forbidden.',
          severity: 'BLOCKER',
          forbiddenPatterns: [/\beval\s*\(/],
        },
      ],
    });

    const evaluator = makeEvaluator({ '2_development': ['G4', 'G5'] }, { engine });

    const verdict = await evaluator.evaluateGatesForPhase('2_development', {
      intent: 'risky change',
      proposedCode: 'const result = eval(userInput);',
    });

    expect(verdict.blocked).toBe(true);
    expect(verdict.blockingGate).toBe('G5');
    expect(typeof verdict.correctionPrompt).toBe('string');
    expect(verdict.correctionPrompt.length).toBeGreaterThan(0);
  });

  it('stops at the first blocking gate (does not evaluate gates after it)', async () => {
    // Map G5 (blocking) before G4 so we can assert short-circuit behavior.
    const engine = new SemanticHandshakeEngine({
      constraints: [
        {
          id: 'NO-EVAL',
          description: 'Dynamic eval is forbidden.',
          severity: 'BLOCKER',
          forbiddenPatterns: [/\beval\s*\(/],
        },
      ],
    });
    const decisionEngine = createMockDecisionEngine();
    const evaluator = makeEvaluator({ '2_development': ['G5', 'G4'] }, { engine, decisionEngine });

    const verdict = await evaluator.evaluateGatesForPhase('2_development', {
      proposedCode: 'eval("x")',
      intent: 'x',
    });

    expect(verdict.blocked).toBe(true);
    expect(verdict.blockingGate).toBe('G5');
    // G4 must NOT have been reached.
    expect(verdict.results).toHaveLength(1);
    expect(decisionEngine.analyze).not.toHaveBeenCalled();
  });
});

// ================================================================
// (c) SMOKE — real known-bad fixture trips a gate to passed:false
// ================================================================

describe('GateEvaluator — SMOKE (real G5 detects a known-bad case)', () => {
  it('G5 returns passed:false and the evaluator marks blocked + correctionPrompt', async () => {
    const engine = new SemanticHandshakeEngine({
      constraints: [
        {
          id: 'NO-DIRECT-PG',
          description: 'MUST NOT import the pg driver directly.',
          severity: 'BLOCKER',
          forbiddenPatterns: [/require\(['"]pg['"]\)/],
        },
      ],
    });

    // Verify the underlying gate behaves as expected (passed:false, blocking).
    const gate = new G5SemanticHandshakeGate({ engine, logger: createMockLogger() });
    const gateResult = await gate.verify({
      proposedCode: 'const db = require("pg"); db.connect();',
    });
    expect(gateResult.result.passed).toBe(false);
    expect(gateResult.result.blocking).toBe(true);

    // Now the same bad case flows through the evaluator end-to-end.
    const evaluator = makeEvaluator({ '2_development': ['G5'] }, { engine });
    const verdict = await evaluator.evaluateGatesForPhase('2_development', {
      proposedCode: 'const db = require("pg"); db.connect();',
    });

    expect(verdict.blocked).toBe(true);
    expect(verdict.blockingGate).toBe('G5');
    expect(verdict.correctionPrompt).toEqual(expect.any(String));
    expect(verdict.correctionPrompt.length).toBeGreaterThan(0);
  });
});

// ================================================================
// (d) Fail-open — a broken gate or broken evaluator never halts the flow
// ================================================================

describe('GateEvaluator — fail-open', () => {
  it('skips a gate that throws on construction and keeps evaluating the rest', async () => {
    // G3 requires a registryLoader; force its construction to throw by routing
    // a broken loader through a real (non-injected) dependency path.
    const evaluator = new GateEvaluator(
      { gateEvaluation: { enabled: true, failOpen: true, phaseGates: { '2_development': ['G3', 'G4'] } } },
      {
        // decisionEngine present, but registryLoader getter is sabotaged.
        decisionEngine: createMockDecisionEngine(),
        registryLoader: null,
        logger: createMockLogger(),
      },
    );

    // Sabotage the lazy registry-loader builder so G3 construction fails,
    // proving a single broken gate does not derail the others.
    evaluator._getRegistryLoader = () => {
      throw new Error('registry exploded');
    };

    const verdict = await evaluator.evaluateGatesForPhase('2_development', { intent: 'x' });

    // G3 was skipped (build threw) but G4 still ran and passed.
    expect(verdict.blocked).toBe(false);
    expect(verdict.results.map((r) => r.gateId)).toEqual(['G4']);
  });

  it('skips a gate whose verify() throws and still returns a verdict', async () => {
    const evaluator = makeEvaluator({ '2_development': ['G4'] });

    // Force the cached gate to throw inside verify().
    const realGate = evaluator._getGate('G4');
    jest.spyOn(realGate, 'verify').mockRejectedValue(new Error('verify boom'));

    const verdict = await evaluator.evaluateGatesForPhase('2_development', { intent: 'x' });

    expect(verdict.blocked).toBe(false);
    expect(verdict.results).toHaveLength(0);
  });

  it('the caller pattern absorbs an evaluator that throws (fail-open contract)', async () => {
    // Simulate the workflow-executor wrapper: any throw is caught, flow proceeds.
    const broken = {
      evaluateGatesForPhase: jest.fn().mockRejectedValue(new Error('evaluator exploded')),
    };

    let blocked = false;
    let proceeded = false;
    try {
      const verdict = await broken.evaluateGatesForPhase('2_development', { intent: 'x' });
      blocked = verdict.blocked;
    } catch (_gateError) {
      // Caller swallows — development proceeds.
      proceeded = true;
    }

    expect(blocked).toBe(false);
    expect(proceeded).toBe(true);
  });
});

// ================================================================
// Barrel export wiring
// ================================================================

describe('IDS barrel', () => {
  it('re-exports GateEvaluator (module has a real consumer / not orphan)', () => {
    const ids = require(INDEX_PATH);
    expect(ids.GateEvaluator).toBe(GateEvaluator);
    expect(ids.DEFAULT_PHASE_GATES).toBeDefined();
  });
});
