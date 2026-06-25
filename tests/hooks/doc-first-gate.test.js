/**
 * Tests for the doc-first-gate PreToolUse hook.
 *
 * Spawns the hook as a child process with mock stdin + CLAUDE_PROJECT_DIR,
 * asserting exit 0 (allow) vs exit 2 (block) across scenarios.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const HOOK = path.join(__dirname, '..', '..', '.claude', 'hooks', 'doc-first-gate.cjs');

function mkTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'docfirstgate-'));
}

/** Run the hook; return its exit code (0 allow / 2 block). */
function runHook(projectDir, filePath, { tool = 'Write', env = {} } = {}) {
  const input = JSON.stringify({ tool_name: tool, tool_input: { file_path: filePath } });
  try {
    execFileSync(process.execPath, [HOOK], {
      input,
      env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir, ...env },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return 0;
  } catch (err) {
    return typeof err.status === 'number' ? err.status : -1;
  }
}

function writeFile(root, rel, content = 'x') {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

describe('doc-first-gate hook', () => {
  it('BLOCKS code writes in a greenfield project with no docs', () => {
    const root = mkTmp();
    const exit = runHook(root, path.join(root, 'src', 'index.js'));
    expect(exit).toBe(2);
  });

  it('BLOCKS even after package.json was scaffolded (no code yet, no docs)', () => {
    const root = mkTmp();
    writeFile(root, 'package.json', '{"name":"new-site"}'); // scaffolded first (exempt file)
    const exit = runHook(root, path.join(root, 'src', 'index.js'));
    expect(exit).toBe(2); // the scaffold bypass must NOT open the gate
  });

  it('ALLOWS when PRD + epic + Ready story all exist', () => {
    const root = mkTmp();
    writeFile(root, 'docs/prd.md', '# PRD');
    writeFile(root, 'docs/epics/e1.md', '# Epic 1');
    writeFile(root, 'docs/stories/1.1.md', '---\nstatus: "Ready"\n---\n# S');
    const exit = runHook(root, path.join(root, 'src', 'index.js'));
    expect(exit).toBe(0);
  });

  it('ALLOWS (defers to story-gate) on an existing project with code/package.json', () => {
    const root = mkTmp();
    writeFile(root, 'package.json', '{"name":"client-app"}');
    writeFile(root, 'src/existing.js', 'console.log(1)');
    const exit = runHook(root, path.join(root, 'src', 'index.js'));
    expect(exit).toBe(0);
  });

  it('ALLOWS the framework\'s own repo (package.json name sinapse-ai)', () => {
    const root = mkTmp();
    writeFile(root, 'package.json', '{"name":"sinapse-ai"}');
    const exit = runHook(root, path.join(root, 'bin', 'thing.js'));
    expect(exit).toBe(0);
  });

  it('ALLOWS with the explicit override env', () => {
    const root = mkTmp();
    const exit = runHook(root, path.join(root, 'src', 'index.js'), {
      env: { SINAPSE_SKIP_DOCFIRST: '1' },
    });
    expect(exit).toBe(0);
  });

  it('ALLOWS exempt paths (docs/, .sinapse-ai/, tests/)', () => {
    const root = mkTmp();
    expect(runHook(root, path.join(root, 'docs', 'note.js'))).toBe(0);
    expect(runHook(root, path.join(root, 'tests', 'a.test.js'))).toBe(0);
    expect(runHook(root, path.join(root, '.sinapse-ai', 'x.js'))).toBe(0);
  });

  it('ALLOWS non-code paths at project root', () => {
    const root = mkTmp();
    expect(runHook(root, path.join(root, 'random.txt'))).toBe(0);
  });

  it('ALLOWS non-Write/Edit tools', () => {
    const root = mkTmp();
    expect(runHook(root, path.join(root, 'src', 'index.js'), { tool: 'Read' })).toBe(0);
  });
});
