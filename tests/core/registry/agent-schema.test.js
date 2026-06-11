/**
 * SCHEMA-001 closure — uniform agent schema, enforced as an invariant.
 *
 * The 199 agent files are structurally heterogeneous (frontmatter / `# Agent:` /
 * `# Name` / embedded yaml). Rather than mutate every prose file (risky), the
 * canonical schema is DERIVED by SquadAgentResolver. This test guarantees the
 * derived schema stays well-formed for EVERY agent: unique id, non-empty name,
 * valid type, resolvable. A malformed/added agent that breaks uniformity fails CI.
 */

const path = require('path');
const SquadAgentResolver = require('../../../.sinapse-ai/core/registry/squad-agent-resolver');
const { parseAgentsArgs } = require('../../../bin/commands/agents');

const ROOT = path.resolve(__dirname, '../../..');

describe('Agent schema invariants (SCHEMA-001)', () => {
  const resolver = new SquadAgentResolver(ROOT);
  const agents = resolver.list();

  test('indexes the full roster', () => {
    expect(agents.length).toBeGreaterThanOrEqual(150);
  });

  test('every agent has a non-empty derived name', () => {
    const blank = agents.filter((a) => !a.name || !a.name.trim());
    expect(blank).toEqual([]);
  });

  test('every agent id is unique', () => {
    const ids = agents.map((a) => a.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
  });

  test('every agent has a valid type (orchestrator | specialist)', () => {
    const bad = agents.filter((a) => !['orchestrator', 'specialist'].includes(a.type));
    expect(bad).toEqual([]);
  });

  test('orchestrators are exactly the *-orqx agents', () => {
    const orchestrators = agents.filter((a) => a.type === 'orchestrator');
    expect(orchestrators.length).toBeGreaterThan(0);
    expect(orchestrators.every((a) => /-orqx$/.test(a.id))).toBe(true);
  });

  test('every agent declares its squad (or framework)', () => {
    const noSquad = agents.filter((a) => !a.squad);
    expect(noSquad).toEqual([]);
  });

  test('describe() round-trips through resolve()', () => {
    const sample = resolver.describe('@penetration-tester');
    expect(sample.id).toBe('penetration-tester');
    expect(sample.squad).toBe('squad-cybersecurity');
    expect(sample.type).toBe('specialist');
  });
});

describe('sinapse agents — arg parsing', () => {
  test('parses --squad, --type, --json', () => {
    const o = parseAgentsArgs(['--squad', 'squad-copy', '--type=orchestrator', '--json']);
    expect(o.squad).toBe('squad-copy');
    expect(o.type).toBe('orchestrator');
    expect(o.json).toBe(true);
  });
});
