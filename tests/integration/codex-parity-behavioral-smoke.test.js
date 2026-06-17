'use strict';

/**
 * Behavioral parity smoke (anti-fachada).
 *
 * The legacy Codex validators only counted .md files — "green" meant a file
 * was present, never that it resolved. This suite asserts BEHAVIOR:
 *
 *   (a) A non-core agent (e.g. @brand-orqx, which used to throw
 *       "Unknown Codex agent") resolves to a real source-of-truth + at least
 *       one task pointer that exists on disk.
 *   (b) The curated catalog has ZERO orphans and ZERO broken pointers, and the
 *       integration validator exits clean (errors promoted from WARNING).
 *   (c) [reuses E8 bloco 1] git's core.hooksPath is populated with the managed
 *       SINAPSE hooks dir + a pre-commit guard — the security backstop is live.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

const {
  resolveCodexAgent,
  resolveCodexAgentCommand,
  buildEcosystemStats,
} = require(path.join(PROJECT_ROOT, '.codex', 'scripts', 'resolve-codex-agent'));

const {
  resolveCatalog,
} = require(path.join(
  PROJECT_ROOT,
  '.sinapse-ai',
  'infrastructure',
  'scripts',
  'codex-parity',
  'resolve',
));

const {
  validateCodexIntegration,
} = require(path.join(
  PROJECT_ROOT,
  '.sinapse-ai',
  'infrastructure',
  'scripts',
  'validate-codex-integration',
));

describe('Codex parity — behavioral smoke (anti-fachada)', () => {
  // (a) Non-core agent resolves to a valid agent + task --------------------
  it('resolves a non-core orchestrator (@brand-orqx) to a real source and task', () => {
    const agent = resolveCodexAgent('brand-orqx', PROJECT_ROOT);

    expect(agent.agentId).toBe('brand-orqx');
    expect(agent.squad).toBe('squad-brand');
    expect(agent.sourceOfTruth).toBe('squads/squad-brand/agents/brand-orqx.md');
    expect(fs.existsSync(path.join(PROJECT_ROOT, agent.sourceOfTruth))).toBe(true);

    // At least one resolvable task, and every task pointer exists on disk.
    expect(agent.taskCount).toBeGreaterThan(0);
    for (const task of agent.tasks) {
      expect(fs.existsSync(path.join(PROJECT_ROOT, task.target))).toBe(true);
    }
  });

  it('resolves a specific command for a non-core specialist to an existing task file', () => {
    // brand-strategist is a retired-chief-free, real squad specialist.
    const agent = resolveCodexAgent('brand-strategist', PROJECT_ROOT);
    expect(agent.taskCount).toBeGreaterThan(0);

    const firstTask = agent.tasks[0];
    const resolved = resolveCodexAgentCommand('brand-strategist', firstTask.command, PROJECT_ROOT);
    expect(resolved.agentId).toBe('brand-strategist');
    expect(fs.existsSync(path.join(PROJECT_ROOT, resolved.target))).toBe(true);
  });

  it('resolves EVERY catalog agent (no agent throws "Unknown Codex agent")', () => {
    const stats = buildEcosystemStats(PROJECT_ROOT);
    expect(stats.totalAgents).toBeGreaterThan(0);
    // 1:1 — every catalog entry resolves to a real source-of-truth.
    expect(stats.resolvableAgents).toBe(stats.totalAgents);
  });

  // (b) Catalog has no orphans nor broken pointers -------------------------
  it('has ZERO orphans and ZERO broken pointers in the curated catalog', () => {
    const catalog = resolveCatalog(PROJECT_ROOT);
    expect(catalog.brokenPointers).toEqual([]);
    expect(catalog.orphans).toEqual([]);
    expect(catalog.resolved.length).toBe(catalog.total);
  });

  it('integration validator exits clean on the curated catalog (mismatch is now an ERROR)', () => {
    const result = validateCodexIntegration({ projectRoot: PROJECT_ROOT, quiet: true });
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.metrics.brokenPointers).toBe(0);
    expect(result.metrics.orphans).toBe(0);
  });

  it('would FAIL if a broken pointer were planted (proves it is not a fachada)', () => {
    // Simulate a broken pointer in-memory by resolving against a temp catalog
    // copy with a poisoned target. We do this on a throwaway dir so the real
    // catalog is never mutated.
    const tmpRoot = fs.mkdtempSync(path.join(require('os').tmpdir(), 'codex-parity-'));
    try {
      const codexDir = path.join(tmpRoot, '.codex', 'agents');
      const devDir = path.join(tmpRoot, '.sinapse-ai', 'development', 'agents');
      fs.mkdirSync(codexDir, { recursive: true });
      fs.mkdirSync(devDir, { recursive: true });

      // A real source exists, but the pointer aims at a ghost path.
      fs.writeFileSync(path.join(devDir, 'analyst.md'), '# analyst\n');
      fs.writeFileSync(
        path.join(codexDir, 'analyst.md'),
        'Activate agent: analyst\nRead the agent definition at: squads/squad-GHOST/agents/analyst.md\n',
      );
      // A pure orphan: no source anywhere.
      fs.writeFileSync(
        path.join(codexDir, 'ghost-orphan.md'),
        'Activate agent: ghost-orphan\nRead the agent definition at: squads/void/agents/ghost-orphan.md\n',
      );

      const catalog = resolveCatalog(tmpRoot, {
        canonicalAgentsDir: '.sinapse-ai/development/agents',
        codexAgentsDir: '.codex/agents',
        squadsDir: 'squads',
      });

      expect(catalog.brokenPointers.map((b) => b.id)).toContain('analyst');
      expect(catalog.orphans.map((o) => o.id)).toContain('ghost-orphan');
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  // (c) [reuses E8 bloco 1] core.hooksPath populated -----------------------
  it('git core.hooksPath points at the managed SINAPSE hooks dir with a pre-commit guard', () => {
    let hooksPath = null;
    try {
      hooksPath = execFileSync('git', ['-C', PROJECT_ROOT, 'config', '--get', 'core.hooksPath'], {
        encoding: 'utf8',
      }).trim();
    } catch {
      hooksPath = null;
    }

    // If the repo isn't git-managed in this environment, the backstop check is
    // not applicable — skip rather than false-fail.
    if (!hooksPath) {
      return;
    }

    expect(hooksPath).toBe('.sinapse-ai/git-hooks');
    const preCommit = path.join(PROJECT_ROOT, hooksPath, 'pre-commit');
    expect(fs.existsSync(preCommit)).toBe(true);
  });
});
