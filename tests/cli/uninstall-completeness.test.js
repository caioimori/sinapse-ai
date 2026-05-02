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
let backupManifest;
let manifestExisted;

function writeStub(dir, name, body = `---\nname: ${name.replace(/\.md$/, '')}\n---\nstub`) {
  fs.writeFileSync(path.join(dir, name), body);
}

beforeEach(() => {
  tmpAgentsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-uninstall-'));
  manifestExisted = fs.existsSync(INSTALLED_AGENTS_MANIFEST);
  if (manifestExisted) {
    backupManifest = fs.readFileSync(INSTALLED_AGENTS_MANIFEST, 'utf8');
    fs.rmSync(INSTALLED_AGENTS_MANIFEST);
  }
});

afterEach(() => {
  try { fs.rmSync(tmpAgentsDir, { recursive: true, force: true }); } catch { /* ignore */ }
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

    recordInstalledAgents(['foo-orqx.md', 'developer.md', 'analyst.md'], ['claude-code']);

    const result = removeInstalledAgentsFrom(tmpAgentsDir);

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
    recordInstalledAgents(['a.md', 'b.md', 'c.md'], ['claude-code']);

    const first = removeInstalledAgentsFrom(tmpAgentsDir);
    expect(first.removed).toBe(1);

    const second = removeInstalledAgentsFrom(tmpAgentsDir);
    expect(second.removed).toBe(0); // already gone
  });
});

describe('removeInstalledAgentsFrom — fallback for pre-manifest installs', () => {
  test('removes *-orqx.md files via heuristic when manifest absent', () => {
    writeStub(tmpAgentsDir, 'design-orqx.md');
    writeStub(tmpAgentsDir, 'copy-orqx.md');
    writeStub(tmpAgentsDir, 'unrelated.md');

    // No manifest → fallback path
    const result = removeInstalledAgentsFrom(tmpAgentsDir);

    expect(result.removed).toBe(2);
    expect(fs.existsSync(path.join(tmpAgentsDir, 'design-orqx.md'))).toBe(false);
    expect(fs.existsSync(path.join(tmpAgentsDir, 'copy-orqx.md'))).toBe(false);
    expect(fs.existsSync(path.join(tmpAgentsDir, 'unrelated.md'))).toBe(true);
  });

  test('removes files with `name: sinapse-*` frontmatter via heuristic', () => {
    writeStub(tmpAgentsDir, 'analyst.md', '---\nname: sinapse-analyst\n---\n');
    writeStub(tmpAgentsDir, 'random.md', '---\nname: my-custom\n---\n');

    const result = removeInstalledAgentsFrom(tmpAgentsDir);

    expect(result.removed).toBe(1);
    expect(fs.existsSync(path.join(tmpAgentsDir, 'analyst.md'))).toBe(false);
    expect(fs.existsSync(path.join(tmpAgentsDir, 'random.md'))).toBe(true);
  });
});

describe('recordInstalledAgents + readInstalledAgentsManifest', () => {
  test('records and reads back the manifest', () => {
    recordInstalledAgents(['x.md', 'y.md'], ['claude-code']);
    const manifest = readInstalledAgentsManifest();

    expect(manifest).not.toBeNull();
    expect(manifest.version).toBe(1);
    expect(manifest.filenames).toEqual(['x.md', 'y.md']);
    expect(manifest.ides).toEqual(['claude-code']);
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
    recordInstalledAgents(filenames, ['claude-code', 'codex']);

    const result = removeInstalledAgentsFrom(tmpAgentsDir);

    expect(result.removed).toBe(200);
    expect(fs.readdirSync(tmpAgentsDir).filter((f) => f.endsWith('.md')).length).toBe(0);
  });
});
