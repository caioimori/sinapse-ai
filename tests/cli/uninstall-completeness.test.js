/**
 * Uninstall completeness — Audit 1 P0 (UN-1) regression suite.
 *
 * Install writes ~200 agent files to ~/.claude/agents/ + ~/.codex/agents/.
 * Pre-fix uninstall removed only `*-orqx.md` (~21 files), leaving ~178
 * orphaned. This suite locks in the manifest-aware removal so a future
 * regression resurrects the orphan bug visibly.
 */

'use strict';

const fs = require('fs');
const crypto = require('crypto');
const os = require('os');
const path = require('path');

const cli = require(path.join(__dirname, '..', '..', 'bin', 'cli.js'));
const {
  removeInstalledAgentsFrom,
  recordInstalledAgents,
  readInstalledAgentsManifest,
  INSTALLED_AGENTS_MANIFEST,
} = cli;

let tmpAgentsDir;
let tmpHome;
let backupManifest;
let manifestExisted;

function writeStub(dir, name, body = `---\nname: ${name.replace(/\.md$/, '')}\n---\nstub`) {
  fs.writeFileSync(path.join(dir, name), body);
}

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

beforeEach(() => {
  tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-uninstall-'));
  tmpAgentsDir = path.join(tmpHome, '.claude', 'agents');
  fs.mkdirSync(tmpAgentsDir, { recursive: true });
  manifestExisted = fs.existsSync(INSTALLED_AGENTS_MANIFEST);
  if (manifestExisted) {
    backupManifest = fs.readFileSync(INSTALLED_AGENTS_MANIFEST, 'utf8');
    fs.rmSync(INSTALLED_AGENTS_MANIFEST);
  }
});

afterEach(() => {
  try { fs.rmSync(tmpHome, { recursive: true, force: true }); } catch { /* ignore */ }
  if (fs.existsSync(INSTALLED_AGENTS_MANIFEST)) fs.rmSync(INSTALLED_AGENTS_MANIFEST);
  if (manifestExisted && backupManifest !== undefined) {
    fs.mkdirSync(path.dirname(INSTALLED_AGENTS_MANIFEST), { recursive: true });
    fs.writeFileSync(INSTALLED_AGENTS_MANIFEST, backupManifest);
  }
});

describe('removeInstalledAgentsFrom — manifest-aware path', () => {
  test('removes every filename listed in installed-agents.json', () => {
    writeStub(tmpAgentsDir, 'foo-orqx.md');
    writeStub(tmpAgentsDir, 'developer.md');
    writeStub(tmpAgentsDir, 'analyst.md');
    writeStub(tmpAgentsDir, 'user-custom.md'); // user-added, not in manifest

    recordInstalledAgents(['foo-orqx.md', 'developer.md', 'analyst.md'], ['claude-code'], tmpHome);

    const result = removeInstalledAgentsFrom(tmpAgentsDir, readInstalledAgentsManifest(tmpHome));

    expect(result.removed).toBe(3);
    expect(result.existed).toBe(true);
    expect(fs.existsSync(path.join(tmpAgentsDir, 'foo-orqx.md'))).toBe(false);
    expect(fs.existsSync(path.join(tmpAgentsDir, 'developer.md'))).toBe(false);
    expect(fs.existsSync(path.join(tmpAgentsDir, 'analyst.md'))).toBe(false);
    expect(fs.existsSync(path.join(tmpAgentsDir, 'user-custom.md'))).toBe(true); // preserved
  });

  test('returns existed=false when directory missing', () => {
    const missing = path.join(tmpAgentsDir, 'does-not-exist');
    const result = removeInstalledAgentsFrom(missing);
    expect(result.existed).toBe(false);
    expect(result.removed).toBe(0);
  });

  test('skips manifest entries whose files are absent (idempotent rerun)', () => {
    writeStub(tmpAgentsDir, 'a.md');
    recordInstalledAgents(['a.md', 'b.md', 'c.md'], ['claude-code'], tmpHome);
    const manifest = readInstalledAgentsManifest(tmpHome);

    const first = removeInstalledAgentsFrom(tmpAgentsDir, manifest);
    expect(first.removed).toBe(1);

    const second = removeInstalledAgentsFrom(tmpAgentsDir, manifest);
    expect(second.removed).toBe(0); // already gone
  });

  test('uses provider-qualified artifacts when providers share a filename', () => {
    const codexDir = path.join(tmpHome, '.codex', 'agents');
    fs.mkdirSync(codexDir, { recursive: true });
    const claudePath = path.join(tmpAgentsDir, 'developer.md');
    const codexPath = path.join(codexDir, 'developer.md');
    fs.writeFileSync(claudePath, '<!-- SINAPSE-MANAGED:global-agent -->\nClaude');
    fs.writeFileSync(codexPath, '<!-- SINAPSE-MANAGED:global-agent -->\nCodex legacy');
    const manifest = {
      version: 2,
      filenames: ['developer.md'],
      artifacts: [
        { provider: 'claude-code', filename: 'developer.md', sha256: sha256(claudePath) },
        { provider: 'codex', filename: 'developer.md', sha256: sha256(codexPath) },
      ],
    };

    expect(removeInstalledAgentsFrom(tmpAgentsDir, manifest).removed).toBe(1);
    expect(fs.existsSync(claudePath)).toBe(false);
    expect(fs.existsSync(codexPath)).toBe(true);
    expect(removeInstalledAgentsFrom(codexDir, manifest).removed).toBe(1);
  });

  test('preserves an edited v2 artifact even when the ownership marker remains', () => {
    const agentPath = path.join(tmpAgentsDir, 'developer.md');
    fs.writeFileSync(agentPath, '<!-- SINAPSE-MANAGED:global-agent -->\noriginal');
    recordInstalledAgents(['developer.md'], ['claude-code'], tmpHome);
    const manifest = readInstalledAgentsManifest(tmpHome);
    fs.appendFileSync(agentPath, '\nuser edit');

    expect(removeInstalledAgentsFrom(tmpAgentsDir, manifest).removed).toBe(0);
    expect(fs.readFileSync(agentPath, 'utf8')).toContain('user edit');
  });

  test('does not use marker fallback for a v2 artifact without a digest', () => {
    const agentPath = path.join(tmpAgentsDir, 'developer.md');
    fs.writeFileSync(agentPath, '<!-- SINAPSE-MANAGED:global-agent -->\n');
    const manifest = {
      version: 2,
      filenames: ['developer.md'],
      artifacts: [{ provider: 'claude-code', filename: 'developer.md', sha256: null }],
    };

    expect(removeInstalledAgentsFrom(tmpAgentsDir, manifest).removed).toBe(0);
    expect(fs.existsSync(agentPath)).toBe(true);
  });
});

describe('removeInstalledAgentsFrom — fallback for pre-manifest installs', () => {
  test('removes *-orqx.md files via heuristic when manifest absent', () => {
    writeStub(tmpAgentsDir, 'design-orqx.md', '<!-- SINAPSE-MANAGED:global-agent -->\n');
    writeStub(tmpAgentsDir, 'copy-orqx.md', '<!-- SINAPSE-MANAGED:global-agent -->\n');
    writeStub(tmpAgentsDir, 'unrelated.md');

    // No manifest → fallback path
    const result = removeInstalledAgentsFrom(tmpAgentsDir);

    expect(result.removed).toBe(2);
    expect(fs.existsSync(path.join(tmpAgentsDir, 'design-orqx.md'))).toBe(false);
    expect(fs.existsSync(path.join(tmpAgentsDir, 'copy-orqx.md'))).toBe(false);
    expect(fs.existsSync(path.join(tmpAgentsDir, 'unrelated.md'))).toBe(true);
  });

  test('preserves files that only resemble legacy agents without an ownership marker', () => {
    writeStub(tmpAgentsDir, 'analyst.md', '---\nname: sinapse-analyst\n---\n');
    writeStub(tmpAgentsDir, 'random.md', '---\nname: my-custom\n---\n');

    const result = removeInstalledAgentsFrom(tmpAgentsDir);

    expect(result.removed).toBe(0);
    expect(fs.existsSync(path.join(tmpAgentsDir, 'analyst.md'))).toBe(true);
    expect(fs.existsSync(path.join(tmpAgentsDir, 'random.md'))).toBe(true);
  });
});

describe('recordInstalledAgents + readInstalledAgentsManifest', () => {
  test('records and reads back the manifest', () => {
    recordInstalledAgents(['x.md', 'y.md'], ['claude-code']);
    const manifest = readInstalledAgentsManifest();

    expect(manifest).not.toBeNull();
    expect(manifest.version).toBe(2);
    expect(manifest.filenames).toEqual(['x.md', 'y.md']);
    expect(manifest.ides).toEqual(['claude-code']);
    expect(manifest.artifacts).toEqual([
      { provider: 'claude-code', filename: 'x.md', sha256: null },
      { provider: 'claude-code', filename: 'y.md', sha256: null },
    ]);
    expect(typeof manifest.timestamp).toBe('string');
  });

  test('overwrites previous manifest on re-install', () => {
    recordInstalledAgents(['a.md'], ['claude-code']);
    recordInstalledAgents(['b.md', 'c.md'], ['both', 'codex']);

    const manifest = readInstalledAgentsManifest();
    expect(manifest.filenames).toEqual(['b.md', 'c.md']);
  });

  test('readInstalledAgentsManifest returns null when file missing', () => {
    expect(readInstalledAgentsManifest()).toBeNull();
  });
});

describe('Audit 1 P0 regression — uninstall removes ~200 agent files, not just orqx', () => {
  test('manifest path: removes 200 files when install recorded 200', () => {
    const filenames = [];
    for (let i = 0; i < 200; i += 1) {
      const name = `agent-${i}.md`;
      filenames.push(name);
      writeStub(tmpAgentsDir, name);
    }
    recordInstalledAgents(filenames, ['claude-code'], tmpHome);

    const result = removeInstalledAgentsFrom(tmpAgentsDir, readInstalledAgentsManifest(tmpHome));

    expect(result.removed).toBe(200);
    expect(fs.readdirSync(tmpAgentsDir).filter((f) => f.endsWith('.md')).length).toBe(0);
  });
});

describe('UNINSTALL-GIT-HOOKS — removeGitHooksConfig (audit 2026-06-11)', () => {
  const { execFileSync } = require('child_process');
  const { removeGitHooksConfig } = require(path.join(__dirname, '..', '..', 'bin', 'commands', 'uninstall'));

  let repoDir;

  function git(args) {
    return execFileSync('git', ['-C', repoDir, ...args], { encoding: 'utf8' }).trim();
  }

  beforeEach(() => {
    repoDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-hooks-'));
    execFileSync('git', ['init', repoDir], { stdio: 'ignore' });
  });

  afterEach(() => {
    try { fs.rmSync(repoDir, { recursive: true, force: true }); } catch { /* ignore */ }
  });

  test('unsets a SINAPSE-managed core.hooksPath', async () => {
    git(['config', 'core.hooksPath', '.sinapse-ai/git-hooks']);
    const res = await removeGitHooksConfig(repoDir);
    expect(res.unset).toBe(true);
    // git config --get now exits non-zero (unset) → execFileSync throws.
    expect(() => git(['config', '--get', 'core.hooksPath'])).toThrow();
  });

  test('preserves a user-custom core.hooksPath', async () => {
    git(['config', 'core.hooksPath', '.husky']);
    const res = await removeGitHooksConfig(repoDir);
    expect(res.unset).toBe(false);
    expect(git(['config', '--get', 'core.hooksPath'])).toBe('.husky');
  });

  test('no-op when core.hooksPath is not set', async () => {
    const res = await removeGitHooksConfig(repoDir);
    expect(res.unset).toBe(false);
    expect(res.value).toBeNull();
  });
});
