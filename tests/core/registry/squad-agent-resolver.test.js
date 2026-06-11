/**
 * Tests for SquadAgentResolver (F2 — squad agents addressable by code).
 */

const path = require('path');
const SquadAgentResolver = require('../../../.sinapse-ai/core/registry/squad-agent-resolver');

const PROJECT_ROOT = path.resolve(__dirname, '../../..');

describe('SquadAgentResolver (F2)', () => {
  let resolver;

  beforeEach(() => {
    resolver = new SquadAgentResolver(PROJECT_ROOT);
  });

  test('indexes the full agent roster (177 squad + framework agents)', () => {
    // Should be well above the ~10 generic agents the dispatcher knew before.
    expect(resolver.size()).toBeGreaterThanOrEqual(150);
  });

  test('resolves a squad agent by id, with its squad', () => {
    const entry = resolver.resolve('@penetration-tester');
    expect(entry).not.toBeNull();
    expect(entry.id).toBe('penetration-tester');
    expect(entry.squad).toBe('squad-cybersecurity');
  });

  test('normalizes @, case, and separators', () => {
    const a = resolver.resolve('@penetration-tester');
    const b = resolver.resolve('Penetration_Tester');
    const c = resolver.resolve('penetration tester');
    expect(a.id).toBe('penetration-tester');
    expect(b && b.id).toBe('penetration-tester');
    expect(c && c.id).toBe('penetration-tester');
  });

  test('resolves short-form aliases to canonical personas', () => {
    expect(resolver.resolve('dev').id).toBe('developer');
    expect(resolver.resolve('@qa').id).toBe('quality-gate');
    expect(resolver.resolve('pm').id).toBe('project-lead');
  });

  test('returns null for unknown agents (no silent default)', () => {
    expect(resolver.resolve('@totally-unknown-xyz')).toBeNull();
    expect(resolver.has('@totally-unknown-xyz')).toBe(false);
  });

  test('loads the full persona content for a known agent', () => {
    const persona = resolver.loadPersona('@penetration-tester');
    expect(typeof persona).toBe('string');
    expect(persona.length).toBeGreaterThan(1000);
  });

  test('loadPersona returns null for unknown agents', () => {
    expect(resolver.loadPersona('@nope-nope')).toBeNull();
  });

  test('caches the index across calls (same Map reference)', () => {
    const first = resolver.buildIndex();
    const second = resolver.buildIndex();
    expect(first).toBe(second);
  });
});
