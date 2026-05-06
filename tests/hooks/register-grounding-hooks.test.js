/**
 * @story GA-1.6 — settings.json registrar for the 3 framework grounding hooks.
 *
 * Verifies idempotence, non-destructive merge, and missing-file safety.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  registerGroundingHooks,
  HOOK_FILENAMES,
  commandReferencesHook,
} = require('../../bin/lib/register-grounding-hooks');

function makeTmp() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'register-grounding-'));
  const settingsPath = path.join(dir, 'settings.json');
  const hooksDir = path.join(dir, 'hooks');
  fs.mkdirSync(hooksDir, { recursive: true });
  // Create stub hook files so the registrar treats them as installable.
  for (const name of HOOK_FILENAMES) {
    fs.writeFileSync(path.join(hooksDir, name), '#!/usr/bin/env node\n');
  }
  return { dir, settingsPath, hooksDir };
}

describe('registerGroundingHooks', () => {
  let tmp;
  beforeEach(() => { tmp = makeTmp(); });
  afterEach(() => {
    try { fs.rmSync(tmp.dir, { recursive: true, force: true }); } catch { /* ignore */ }
  });

  test('creates settings.json from scratch with 3 hooks', () => {
    const result = registerGroundingHooks({
      settingsPath: tmp.settingsPath,
      hooksDir: tmp.hooksDir,
    });
    expect(result.added).toEqual(HOOK_FILENAMES);
    expect(result.skipped).toEqual([]);
    expect(result.errors).toEqual([]);

    const written = JSON.parse(fs.readFileSync(tmp.settingsPath, 'utf8'));
    expect(written.hooks.UserPromptSubmit).toHaveLength(1);
    expect(written.hooks.UserPromptSubmit[0].hooks).toHaveLength(3);
    for (const name of HOOK_FILENAMES) {
      const found = written.hooks.UserPromptSubmit[0].hooks.some(
        (h) => commandReferencesHook(h.command, name),
      );
      expect(found).toBe(true);
    }
  });

  test('idempotent on re-run — no duplicates', () => {
    registerGroundingHooks({ settingsPath: tmp.settingsPath, hooksDir: tmp.hooksDir });
    const second = registerGroundingHooks({ settingsPath: tmp.settingsPath, hooksDir: tmp.hooksDir });
    expect(second.added).toEqual([]);
    expect(second.skipped).toEqual(HOOK_FILENAMES);

    const written = JSON.parse(fs.readFileSync(tmp.settingsPath, 'utf8'));
    expect(written.hooks.UserPromptSubmit[0].hooks).toHaveLength(3);
  });

  test("preserves existing personal hook (user's vault-grounding scenario)", () => {
    const existing = {
      hooks: {
        UserPromptSubmit: [{
          matcher: '',
          hooks: [
            {
              type: 'command',
              command: 'node "C:/Users/Caio Imori/.claude/hooks/vault-grounding.cjs"',
              timeout: 4000,
            },
          ],
        }],
      },
    };
    fs.writeFileSync(tmp.settingsPath, JSON.stringify(existing, null, 2));

    const result = registerGroundingHooks({ settingsPath: tmp.settingsPath, hooksDir: tmp.hooksDir });
    expect(result.added).toEqual(HOOK_FILENAMES);

    const written = JSON.parse(fs.readFileSync(tmp.settingsPath, 'utf8'));
    expect(written.hooks.UserPromptSubmit[0].hooks).toHaveLength(4);
    // Personal hook still first
    expect(written.hooks.UserPromptSubmit[0].hooks[0].command).toContain('vault-grounding.cjs');
    // No collision: personal `vault-grounding.cjs` !== framework `sinapse-vault-grounding.cjs`
    const sinapseEntries = written.hooks.UserPromptSubmit[0].hooks.filter(
      (h) => h.command.includes('sinapse-vault-grounding.cjs'),
    );
    expect(sinapseEntries).toHaveLength(1);
  });

  test('skips hooks whose source file is missing', () => {
    fs.unlinkSync(path.join(tmp.hooksDir, 'sinapse-brand-grounding.cjs'));
    const result = registerGroundingHooks({ settingsPath: tmp.settingsPath, hooksDir: tmp.hooksDir });
    expect(result.added).toEqual([
      'sinapse-vault-grounding.cjs',
      'sinapse-ds-grounding.cjs',
    ]);
    expect(result.errors.some((e) => e.includes('sinapse-brand-grounding.cjs'))).toBe(true);
  });

  test('does not overwrite unrelated settings keys', () => {
    fs.writeFileSync(tmp.settingsPath, JSON.stringify({
      language: 'portuguese',
      permissions: { defaultMode: 'bypassPermissions' },
    }, null, 2));
    registerGroundingHooks({ settingsPath: tmp.settingsPath, hooksDir: tmp.hooksDir });
    const written = JSON.parse(fs.readFileSync(tmp.settingsPath, 'utf8'));
    expect(written.language).toBe('portuguese');
    expect(written.permissions.defaultMode).toBe('bypassPermissions');
    expect(written.hooks.UserPromptSubmit).toBeDefined();
  });

  test('handles malformed settings.json by reporting error and not crashing', () => {
    fs.writeFileSync(tmp.settingsPath, '{ not json');
    const result = registerGroundingHooks({ settingsPath: tmp.settingsPath, hooksDir: tmp.hooksDir });
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.added).toEqual([]);
  });
});
