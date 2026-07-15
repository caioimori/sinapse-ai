const fixtures = require('../../packages/engineering-applicability/fixtures.json');
const { decideApplicability, normalizeInput, renderForProvider } = require('../../packages/engineering-applicability');

const ids = (items) => items.map((item) => item.id);

describe('engineering applicability advisory baseline', () => {
  test('normalizes arrays and input order deterministically', () => {
    const base = fixtures['greenfield-web-low'];
    const reordered = { ...base, surfaces: ['api', 'frontend', 'api'], deploymentTargets: ['cloud', 'web', 'cloud'] };
    expect(normalizeInput(reordered).normalized).toEqual(normalizeInput(base).normalized);
    expect(decideApplicability(reordered)).toEqual(decideApplicability(base));
  });

  test('fails safely for unknown signals and schemas', () => {
    const unknown = decideApplicability(fixtures['unknown-surface']);
    expect(unknown.status).toBe('unknown-signal');
    expect(unknown.unknown[0]).toMatchObject({ field: 'surfaces', reasonCode: 'UNKNOWN_SIGNAL' });
    expect(unknown.humanCheckpoints).toHaveLength(1);
    expect(decideApplicability({ ...fixtures['greenfield-web-low'], schemaVersion: '2.0.0' }).unknown[0].reasonCode).toBe('UNSUPPORTED_SCHEMA');
  });

  test('selects the greenfield web baseline and excludes legacy gates', () => {
    const decision = decideApplicability(fixtures['greenfield-web-low']);
    expect(ids(decision.selected)).toEqual(expect.arrayContaining(['story-spec-readiness', 'quality-assurance', 'application-security', 'design-system-grounding']));
    expect(ids(decision.excluded)).toEqual(expect.arrayContaining(['characterization-baseline', 'incremental-change-strategy']));
  });

  test('selects brownfield safety and high-risk obligations', () => {
    const decision = decideApplicability(fixtures['brownfield-service-high']);
    expect(ids(decision.selected)).toEqual(expect.arrayContaining([
      'characterization-baseline', 'incremental-change-strategy', 'application-security',
      'database-safety', 'threat-model', 'privacy-impact-assessment', 'availability-plan',
    ]));
    expect(decision.status).toBe('human-checkpoint');
    expect(decision.humanCheckpoints[0].id).toBe('irreversible-action-approval');
  });

  test('surface-specific obligations are explicitly excluded', () => {
    const decision = decideApplicability(fixtures['brownfield-ui-low']);
    expect(ids(decision.selected)).toContain('design-system-grounding');
    expect(decision.excluded.find((item) => item.id === 'database-safety').reasonCodes).toContain('SURFACE_ABSENT');
  });

  test('raising risk never removes selected obligations', () => {
    const lowInput = fixtures['greenfield-web-low'];
    const highInput = { ...lowInput, risk: { security: 'high', privacy: 'high', availability: 'high' } };
    const low = new Set(ids(decideApplicability(lowInput).selected));
    const high = new Set(ids(decideApplicability(highInput).selected));
    for (const id of low) expect(high.has(id)).toBe(true);
  });

  test.each(Object.keys(fixtures))('Claude and Codex preserve the same canonical decision for %s', (fixture) => {
    const decision = decideApplicability(fixtures[fixture]);
    const claude = renderForProvider('claude-code', decision);
    const codex = renderForProvider('codex', decision);
    expect(claude.decision).toEqual(codex.decision);
    expect(claude).toMatchObject({ mode: 'advisory', blocking: false, executedWorkflows: [], verifiedEvidence: [] });
    expect(codex).toMatchObject({ mode: 'advisory', blocking: false, executedWorkflows: [], verifiedEvidence: [] });
  });
});
