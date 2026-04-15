'use strict';

/**
 * Story A.3 — Verifies every doctor check module exports an `onError`
 * field and that the classification matches the story's AC:
 *   - warn:  entity-registry, agent-memory, git-hooks, code-intel, hooks-claude-count
 *   - fail:  node-version, npm-packages, settings-json, and all others
 */

const path = require('path');
const fs = require('fs');

const checksDir = path.resolve(__dirname, '..', '..', '.sinapse-ai', 'core', 'doctor', 'checks');

const WARN_CHECKS = new Set([
  'entity-registry',
  'agent-memory',
  'git-hooks',
  'code-intel',
  'hooks-claude-count',
]);

const REQUIRED_FAIL_CHECKS = new Set([
  'node-version',
  'npm-packages',
  'settings-json',
]);

function listCheckModuleFiles() {
  return fs
    .readdirSync(checksDir)
    .filter((f) => f.endsWith('.js') && f !== 'index.js');
}

describe('Story A.3 — check modules declare onError', () => {
  const files = listCheckModuleFiles();

  it('at least one check module file is found', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  test.each(files)('%s exports a valid onError', (file) => {
    const mod = require(path.join(checksDir, file));
    expect(typeof mod.name).toBe('string');
    expect(typeof mod.run).toBe('function');
    expect(typeof mod.onError).toBe('string');
    expect(['fail', 'warn', 'skip']).toContain(mod.onError);
  });

  it('fresh-install checks are classified as warn', () => {
    for (const name of WARN_CHECKS) {
      const mod = require(path.join(checksDir, `${name}.js`));
      expect(mod.onError).toBe('warn');
    }
  });

  it('blocking checks are classified as fail', () => {
    for (const name of REQUIRED_FAIL_CHECKS) {
      const mod = require(path.join(checksDir, `${name}.js`));
      expect(mod.onError).toBe('fail');
    }
  });
});
