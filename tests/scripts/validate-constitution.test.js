'use strict';

/**
 * Story rodada2-m5 (AF-20260704 Mesa #7). The "CLAUDE.md ⇄ AGENTS.md are twins"
 * premise was refuted; the real shared canon (Constitution articles) is validated
 * by the constitution-consistency check, which this guard now runs on the PR gate.
 * These tests lock the divergence detection (an article missing from AGENTS.md is
 * caught) and smoke-test the runner against the real repo (baseline passes).
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const check = require('../../.sinapse-ai/core/doctor/checks/constitution-consistency');

const KEY_ARTICLES = [
  'CLI First',
  'Agent Authority',
  'Documentation-First Development',
  'No Invention',
  'Quality First',
  'Absolute Imports',
  'Ecosystem Metrics Accuracy',
  'Mandatory Delegation',
  'Safe Collaboration',
  'Security & Data Protection',
  'Conservative Default',
];

const CONSUMERS = [
  '.claude/CLAUDE.md',
  'AGENTS.md',
  '.synapse/constitution',
  '.sinapse-ai/product/templates/ide-rules/claude-rules.md',
];

function write(root, rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

/** Build a minimal consistent tree; optionally drop `omit` articles from one consumer. */
function buildTree({ omitFrom, omit = [] } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'constgate-'));
  write(root, '.sinapse-ai/constitution.md', KEY_ARTICLES.join('\n'));
  for (const c of CONSUMERS) {
    const arts = c === omitFrom ? KEY_ARTICLES.filter((a) => !omit.includes(a)) : KEY_ARTICLES;
    write(root, c, arts.join('\n'));
  }
  write(root, '.claude/rules/documentation-first.md', 'x');
  write(root, '.claude/rules/mandatory-delegation.md', 'x');
  return root;
}

describe('constitution-consistency check — divergence detection', () => {
  test('a fully consistent tree PASSes', async () => {
    const res = await check.run({ projectRoot: buildTree() });
    expect(res.status).toBe('PASS');
  });

  test('3+ articles missing from AGENTS.md FAILs and names the file', async () => {
    const root = buildTree({
      omitFrom: 'AGENTS.md',
      omit: ['No Invention', 'Quality First', 'Safe Collaboration'],
    });
    const res = await check.run({ projectRoot: root });
    expect(res.status).toBe('FAIL');
    expect(res.message).toMatch(/AGENTS\.md/);
  });

  test('one article missing from CLAUDE.md is at least a WARN (not silently passed)', async () => {
    const root = buildTree({ omitFrom: '.claude/CLAUDE.md', omit: ['No Invention'] });
    const res = await check.run({ projectRoot: root });
    expect(['WARN', 'FAIL']).toContain(res.status);
  });

  test('missing source FAILs hard', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'constgate-'));
    const res = await check.run({ projectRoot: root });
    expect(res.status).toBe('FAIL');
  });
});

describe('validate-constitution runner — real repo baseline', () => {
  test('does not FAIL against the framework repo (exits 0)', () => {
    const script = path.join(__dirname, '..', '..', 'scripts', 'validate-constitution.js');
    // The guard must not hard-FAIL on the real repo. It exits 0 on PASS and on
    // WARN (a WARN happens when the generated .synapse/constitution is absent —
    // e.g. a job that skips `pretest`). execFileSync throws only on a non-zero
    // exit, so asserting "does not throw" verifies the guard didn't FAIL —
    // independent of PASS/WARN and of stdout-vs-stderr routing.
    expect(() =>
      execFileSync(process.execPath, [script], { stdio: 'pipe' }),
    ).not.toThrow();
  });
});
