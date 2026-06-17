'use strict';

/**
 * Behavioral tests for the parametric Codex agent/task activator.
 * These execute real resolution against the on-disk catalog (decision D7) —
 * they do not merely count files. Every emitted task pointer is verified to
 * reference a file that exists.
 */

const fs = require('fs');
const path = require('path');

const {
  PROJECT_ROOT,
  resolveCodexAgent,
  resolveCodexAgentCommand,
  loadCodexAgentIndex,
  buildEcosystemStats,
} = require('../../.codex/scripts/resolve-codex-agent');

function exists(rel) {
  return fs.existsSync(path.join(PROJECT_ROOT, rel));
}

describe('resolve-codex-agent (parametric activator)', () => {
  const targets = [
    'brand-orqx',
    'developer',
    'meta-ads-specialist',
    'cyber-orqx',
  ];

  it.each(targets)('resolves @%s without "Unknown Codex agent"', (agent) => {
    const result = resolveCodexAgent(agent);
    expect(result.agentId).toBeTruthy();
    expect(result.sourceOfTruth).toBeTruthy();
    expect(exists(result.sourceOfTruth)).toBe(true);
  });

  it('resolves every agent in the catalog (no failures, no broken source pointers)', () => {
    const index = loadCodexAgentIndex();
    const ids = Object.keys(index);
    expect(ids.length).toBeGreaterThan(100);

    const failures = [];
    for (const id of ids) {
      try {
        const res = resolveCodexAgent(id);
        if (!res.sourceOfTruth || !exists(res.sourceOfTruth)) {
          failures.push(`${id}: bad source`);
        }
      } catch (err) {
        failures.push(`${id}: ${err.message}`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('never emits a task pointer to a file that does not exist', () => {
    const index = loadCodexAgentIndex();
    const broken = [];
    for (const id of Object.keys(index)) {
      const res = resolveCodexAgent(id);
      for (const task of res.tasks) {
        if (!exists(task.target)) {
          broken.push(`${id} → ${task.target}`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it('resolves a specific command to an existing task file', () => {
    const result = resolveCodexAgentCommand('meta-ads-specialist', 'audit-meta-ads-account');
    expect(result.kind).toBe('task');
    expect(result.target).toBe('squads/squad-paidmedia/tasks/audit-meta-ads-account.md');
    expect(exists(result.target)).toBe(true);
  });

  it('throws "Unknown Codex agent" only for a truly unknown agent', () => {
    expect(() => resolveCodexAgent('definitely-not-an-agent')).toThrow('Unknown Codex agent');
  });

  it('reports accurate ecosystem stats measured from disk', () => {
    const stats = buildEcosystemStats();
    expect(stats.totalAgents).toBe(stats.resolvableAgents);
    expect(stats.squads).toBeGreaterThanOrEqual(17);
    expect(stats.resolvableTaskPointers).toBeGreaterThan(1000);
    expect(stats.agentsWithTasks).toBeGreaterThanOrEqual(stats.totalAgents - 1);
  });
});
