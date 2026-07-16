/**
 * Story 10.40 — Uninstall completeness
 *
 * Verifies the helpers that:
 *   - remove SINAPSE-authored *-orqx.md files from a global agents dir
 *   - clean SINAPSE-owned keys from ~/.claude/settings.json without
 *     touching unrelated user config
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  removeInstalledAgentsFrom,
  cleanClaudeSettingsJson,
} = require('../../bin/cli');

const tempDirs = [];

function makeTempDir(prefix = 'sinapse-uninstall-') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    fs.rmSync(tempDirs.pop(), { recursive: true, force: true });
  }
});

describe('Story 10.40 — removeInstalledAgentsFrom() legacy fallback', () => {
  test('returns existed:false when dir is missing', () => {
    const missing = path.join(os.tmpdir(), `nope-${Date.now()}`);
    const out = removeInstalledAgentsFrom(missing, { version: 1, filenames: [] });
    expect(out.existed).toBe(false);
    expect(out.removed).toBe(0);
  });

  test('removes only *-orqx.md files, leaves user-authored alone', () => {
    const dir = makeTempDir();
    fs.writeFileSync(path.join(dir, 'brand-orqx.md'), '<!-- SINAPSE-MANAGED:global-agent -->\nagent');
    fs.writeFileSync(path.join(dir, 'commercial-orqx.md'), '<!-- SINAPSE-MANAGED:global-agent -->\nagent');
    fs.writeFileSync(path.join(dir, 'my-custom-agent.md'), 'mine');
    fs.writeFileSync(path.join(dir, 'README.md'), 'docs');

    const out = removeInstalledAgentsFrom(dir, {
      version: 1,
      filenames: ['brand-orqx.md', 'commercial-orqx.md', 'my-custom-agent.md', 'README.md'],
    });
    expect(out.existed).toBe(true);
    expect(out.removed).toBe(2);
    const remaining = fs.readdirSync(dir).sort();
    expect(remaining).toEqual(['README.md', 'my-custom-agent.md']);
  });

  test('returns removed:0 when no orqx files present', () => {
    const dir = makeTempDir();
    fs.writeFileSync(path.join(dir, 'README.md'), 'docs');
    const out = removeInstalledAgentsFrom(dir, { version: 1, filenames: ['README.md'] });
    expect(out.existed).toBe(true);
    expect(out.removed).toBe(0);
  });
});

describe('Story 10.40 — cleanClaudeSettingsJson()', () => {
  test('returns touched:false when file is missing', () => {
    const missing = path.join(os.tmpdir(), `nope-settings-${Date.now()}.json`);
    const out = cleanClaudeSettingsJson(missing);
    expect(out.touched).toBe(false);
  });

  test('strips language and sinapse keys, keeps everything else', () => {
    const dir = makeTempDir();
    const p = path.join(dir, 'settings.json');
    fs.writeFileSync(p, JSON.stringify({
      language: 'pt',
      sinapse: { installed: true, version: '10.0.0-rc.4' },
      theme: 'dark',
      hooks: { preCommit: 'lint' },
    }));

    const out = cleanClaudeSettingsJson(p);
    expect(out.touched).toBe(true);
    const after = JSON.parse(fs.readFileSync(p, 'utf8'));
    expect(after).toEqual({ theme: 'dark', hooks: { preCommit: 'lint' } });
  });

  test('returns touched:false when no SINAPSE keys are present', () => {
    const dir = makeTempDir();
    const p = path.join(dir, 'settings.json');
    fs.writeFileSync(p, JSON.stringify({ theme: 'dark' }));
    const out = cleanClaudeSettingsJson(p);
    expect(out.touched).toBe(false);
    const after = JSON.parse(fs.readFileSync(p, 'utf8'));
    expect(after).toEqual({ theme: 'dark' });
  });

  test('returns invalid:true when file is not valid JSON', () => {
    const dir = makeTempDir();
    const p = path.join(dir, 'settings.json');
    fs.writeFileSync(p, '{ this is not json');
    const out = cleanClaudeSettingsJson(p);
    expect(out.touched).toBe(false);
    expect(out.invalid).toBe(true);
  });

  test('writes the file as valid JSON after stripping', () => {
    const dir = makeTempDir();
    const p = path.join(dir, 'settings.json');
    fs.writeFileSync(p, JSON.stringify({ language: 'pt', other: 1 }));
    cleanClaudeSettingsJson(p);
    const after = fs.readFileSync(p, 'utf8');
    // Must end with newline (POSIX-friendly) and be parseable
    expect(() => JSON.parse(after)).not.toThrow();
  });
});
