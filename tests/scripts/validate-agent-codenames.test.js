'use strict';

/**
 * Story onda1-s5 (AF-20260629 #32 + AF-20260702 #1.10)
 *
 * The original guard only recognized a QUOTED `name: "X"` YAML field, so an
 * unquoted `name: X` (also valid YAML — and, it turns out, the format used
 * by MOST framework-core agents) was invisible to it, and a persona
 * declared only in prose (no YAML block at all, e.g. design-orqx.md) was
 * invisible too. That blind spot let three orchestrators answer to "Nexus"
 * while the guard reported a clean pass.
 *
 * These tests cover: (1) the extraction fix itself (quoted, unquoted, and
 * the two prose conventions actually used in this repo), (2) the
 * blocking-vs-pending-triage collision split (so a guard fix doesn't
 * retroactively fail CI over dozens of unrelated pre-existing collisions
 * this story never authorized touching), and (3) a real-repo regression
 * lock: after the fix, "Nexus" is no longer a blocking collision.
 *
 * Story onda2-p7 (2026-07-02) then triaged and resolved all 24 codenames
 * this guard had surfaced as pending debt (Scope through Vertex — see the
 * KNOWN_COLLISIONS_PENDING_TRIAGE comment in the source for the full verdict
 * and rename map). The Set is empty again as a result; the mechanism itself
 * stays wired for whatever the guard surfaces next.
 */

const path = require('path');

const {
  extractCodenameWithSource,
  extractCodename,
  collectCodenames,
  findCollisions,
  ALLOWED_DUPLICATES,
  KNOWN_COLLISIONS_PENDING_TRIAGE,
} = require('../../scripts/validate-agent-codenames.js');

describe('extractCodenameWithSource — YAML (quoted + unquoted)', () => {
  test('quoted name: "X" (original supported format)', () => {
    const content = 'agent:\n  name: "Litmus"\n  id: quality-gate\n';
    expect(extractCodenameWithSource(content)).toEqual({ codename: 'Litmus', source: 'yaml' });
  });

  test('unquoted name: X — the AF-20260702 #1.10 blind spot', () => {
    const content = 'agent:\n  name: Pixel\n  id: developer\n';
    expect(extractCodenameWithSource(content)).toEqual({ codename: 'Pixel', source: 'yaml' });
  });

  test('unquoted multi-word name (e.g. "Quill Prime")', () => {
    const content = 'agent:\n  name: Quill Prime\n  id: copy-orqx\n';
    expect(extractCodenameWithSource(content)).toEqual({ codename: 'Quill Prime', source: 'yaml' });
  });

  test('does not match nested `- name:` list entries (commands/knowledge-base)', () => {
    const content = [
      'agent:',
      '  name: Relay',
      'commands:',
      '  - name: help',
      '    description: x',
      '  - name: create-team',
      '    description: y',
    ].join('\n');
    // First top-level (non-dashed) `name:` wins — the persona, not a command.
    expect(extractCodenameWithSource(content)).toEqual({ codename: 'Relay', source: 'yaml' });
  });

  test('extractCodename() back-compat wrapper returns just the string', () => {
    expect(extractCodename('agent:\n  name: Tensor\n')).toBe('Tensor');
    expect(extractCodename('no persona field here')).toBeNull();
  });
});

describe('extractCodenameWithSource — prose fallback (no YAML persona block)', () => {
  test('"# Agent: {Name} — {Title}" header (common orqx format)', () => {
    const content = '# Agent: Nexus — Digital Experience Orchestrator\n\n## Identidade\n';
    expect(extractCodenameWithSource(content)).toEqual({ codename: 'Nexus', source: 'prose' });
  });

  test('"# {id} — {Name}" whole-line header', () => {
    const content = '# content-orqx — Bulletin\n\n```yaml\n';
    expect(extractCodenameWithSource(content)).toEqual({ codename: 'Bulletin', source: 'prose' });
  });

  test('markdown identity bullet "- **Nome:** X"', () => {
    const content = '# Agent\n\n## Identidade\n- **ID:** design-orqx\n- **Nome:** Nexus\n- **Icon:** x\n';
    // The H1 has no "Agent:"/"—" pattern here, so this falls through to the bullet.
    expect(extractCodenameWithSource(content)).toEqual({ codename: 'Nexus', source: 'prose' });
  });

  test('markdown identity bullet "- **Name:** X" (English variant)', () => {
    const content = '# Some Agent\n\n- **Name:** Scope\n';
    expect(extractCodenameWithSource(content)).toEqual({ codename: 'Scope', source: 'prose' });
  });

  test('YAML takes priority over prose when both are present', () => {
    const content = '# Agent: WrongName — Title\n\nagent:\n  name: RightName\n';
    expect(extractCodenameWithSource(content)).toEqual({ codename: 'RightName', source: 'yaml' });
  });

  test('returns null when neither YAML nor prose declares a codename', () => {
    const content = '# Just a document\n\nNo persona here, just prose about the project scope.\n';
    expect(extractCodenameWithSource(content)).toBeNull();
  });
});

describe('findCollisions — blocking vs. known-pending-triage split', () => {
  function toEntries(paths, source = 'yaml') {
    return paths.map((p) => ({ path: p, source }));
  }

  test('a fresh, unlisted duplicate is blocking', () => {
    const byName = new Map([['Ghost', toEntries(['a/one.md', 'b/two.md'])]]);
    const { blocking, pending } = findCollisions(byName);
    expect(blocking).toHaveLength(1);
    expect(blocking[0].codename).toBe('Ghost');
    expect(pending).toHaveLength(0);
  });

  test('ALLOWED_DUPLICATES (Imperator dual-register) never blocks or pends', () => {
    expect(ALLOWED_DUPLICATES.has('Imperator')).toBe(true);
    const byName = new Map([['Imperator', toEntries(['a/snps-orqx.md', 'b/sinapse-orqx.md'])]]);
    const { blocking, pending } = findCollisions(byName);
    expect(blocking).toHaveLength(0);
    expect(pending).toHaveLength(0);
  });

  test('a codename in KNOWN_COLLISIONS_PENDING_TRIAGE is reported but does not block', () => {
    // As of Story onda2-p7 the shipped Set is empty (every previously-known
    // pending collision was triaged and resolved — see the source comment).
    // Add a synthetic entry to exercise the mechanism itself without
    // depending on production data being non-empty, then clean up.
    const sampleName = '__test_pending_codename__';
    expect(KNOWN_COLLISIONS_PENDING_TRIAGE.has(sampleName)).toBe(false);
    KNOWN_COLLISIONS_PENDING_TRIAGE.add(sampleName);
    try {
      const byName = new Map([[sampleName, toEntries(['x/one.md', 'y/two.md'], 'prose')]]);
      const { blocking, pending } = findCollisions(byName);
      expect(blocking).toHaveLength(0);
      expect(pending).toHaveLength(1);
      expect(pending[0].codename).toBe(sampleName);
    } finally {
      KNOWN_COLLISIONS_PENDING_TRIAGE.delete(sampleName);
    }
  });

  test('"Nexus" is NOT in the pending-triage list — it was actually fixed, not deferred', () => {
    expect(KNOWN_COLLISIONS_PENDING_TRIAGE.has('Nexus')).toBe(false);
  });

  test('KNOWN_COLLISIONS_PENDING_TRIAGE is empty — Story onda2-p7 resolved all 24 pending collisions', () => {
    expect(KNOWN_COLLISIONS_PENDING_TRIAGE.size).toBe(0);
  });

  test('a unique codename (single file) is neither blocking nor pending', () => {
    const byName = new Map([['Solo', toEntries(['only/one.md'])]]);
    const { blocking, pending } = findCollisions(byName);
    expect(blocking).toHaveLength(0);
    expect(pending).toHaveLength(0);
  });
});

describe('real-repo regression lock (post onda1-s5 rename)', () => {
  const REPO_ROOT = path.resolve(__dirname, '..', '..');

  test('the "Nexus" collision is resolved: design-orqx is the sole holder', () => {
    const byName = collectCodenames();
    const nexusEntries = byName.get('Nexus') || [];
    const paths = nexusEntries.map((e) => e.path);
    expect(paths).toEqual(['squads/squad-design/agents/design-orqx.md']);
  });

  test('swarm-orqx and content-orqx now resolve to their new, unique codenames', () => {
    const byName = collectCodenames();
    const relay = (byName.get('Relay') || []).map((e) => e.path);
    const bulletin = (byName.get('Bulletin') || []).map((e) => e.path);
    expect(relay).toContain('squads/claude-code-mastery/agents/swarm-orqx.md');
    expect(bulletin).toContain('squads/squad-content/agents/content-orqx.md');
    // And neither collides with anything else.
    expect(relay).toHaveLength(1);
    expect(bulletin).toHaveLength(1);
  });

  test('running the real guard against the repo produces zero BLOCKING collisions', () => {
    const byName = collectCodenames();
    const { blocking } = findCollisions(byName);
    if (blocking.length > 0) {
      // Fail with a readable diff instead of a bare length mismatch.
      const detail = blocking.map((c) => `${c.codename}: ${c.files.map((f) => f.path).join(', ')}`).join('\n');
      throw new Error(`Unexpected blocking collision(s):\n${detail}`);
    }
    expect(blocking).toHaveLength(0);
  });

  test('previously-invisible unquoted framework-core codenames are now detected', () => {
    const byName = collectCodenames();
    // Pixel (developer.md) is unquoted YAML — the exact class of file the
    // original quoted-only regex could never see.
    const pixel = (byName.get('Pixel') || []).map((e) => e.path);
    expect(pixel).toContain('.sinapse-ai/development/agents/developer.md');
  });

  test('sanity: REPO_ROOT resolves to this checkout (guards against a misconfigured PROJECT_ROOT)', () => {
    expect(require('fs').existsSync(path.join(REPO_ROOT, 'scripts', 'validate-agent-codenames.js'))).toBe(true);
  });
});
