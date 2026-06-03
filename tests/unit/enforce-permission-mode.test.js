/**
 * Tests for enforce-permission-mode.cjs hook
 *
 * Test strategy:
 *   - Spawn the hook as a child process with crafted stdin JSON
 *   - Assert exit code (0 = allow, 2 = block)
 *   - Assert stderr content for blocked cases
 *
 * Fail-open cases are also covered: missing config, invalid JSON, etc.
 */

'use strict';

const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const HOOK = path.resolve(
  __dirname,
  '../../.claude/hooks/enforce-permission-mode.cjs',
);

// ---------------------------------------------------------------------------
// Helper: run hook with given stdin JSON and optional env overrides
// ---------------------------------------------------------------------------

function runHook(inputObj, envOverrides = {}) {
  return new Promise((resolve) => {
    const stdin = JSON.stringify(inputObj);
    const env = { ...process.env, ...envOverrides };

    const child = execFile(
      process.execPath, // node
      [HOOK],
      { env },
      (err, stdout, stderr) => {
        const code = err ? err.code : 0;
        resolve({ code, stdout, stderr });
      },
    );

    child.stdin.write(stdin);
    child.stdin.end();
  });
}

// ---------------------------------------------------------------------------
// Helper: create a temp project dir with .sinapse/config.yaml
// ---------------------------------------------------------------------------

async function makeTempProject(mode) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'snps-perm-test-'));
  const sinapseDir = path.join(dir, '.sinapse');
  fs.mkdirSync(sinapseDir, { recursive: true });
  if (mode !== null) {
    fs.writeFileSync(
      path.join(sinapseDir, 'config.yaml'),
      `permissions:\n  mode: ${mode}\n`,
      'utf8',
    );
  }
  return dir;
}

function cleanTemp(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Tests — explore mode BLOCKS writes
// ---------------------------------------------------------------------------

describe('enforce-permission-mode hook — explore mode (read-only)', () => {
  let projectDir;

  beforeAll(async () => {
    projectDir = await makeTempProject('explore');
  });

  afterAll(() => cleanTemp(projectDir));

  const exploreEnv = () => ({ CLAUDE_PROJECT_DIR: projectDir });

  test('blocks Write tool', async () => {
    const result = await runHook(
      { tool_name: 'Write', tool_input: { file_path: '/tmp/foo.js', content: 'x' } },
      exploreEnv(),
    );
    expect(result.code).toBe(2);
    expect(result.stderr).toContain('PERMISSION-MODE BLOCK');
    expect(result.stderr).toContain('Write');
  });

  test('blocks Edit tool', async () => {
    const result = await runHook(
      { tool_name: 'Edit', tool_input: { file_path: '/tmp/foo.js', old_string: 'a', new_string: 'b' } },
      exploreEnv(),
    );
    expect(result.code).toBe(2);
    expect(result.stderr).toContain('PERMISSION-MODE BLOCK');
  });

  test('blocks destructive Bash (rm -rf)', async () => {
    const result = await runHook(
      { tool_name: 'Bash', tool_input: { command: 'rm -rf /tmp/something' } },
      exploreEnv(),
    );
    expect(result.code).toBe(2);
    expect(result.stderr).toContain('PERMISSION-MODE BLOCK');
  });

  test('blocks write Bash (git commit)', async () => {
    const result = await runHook(
      { tool_name: 'Bash', tool_input: { command: 'git commit -m "test"' } },
      exploreEnv(),
    );
    expect(result.code).toBe(2);
    expect(result.stderr).toContain('PERMISSION-MODE BLOCK');
  });

  test('allows Read tool', async () => {
    const result = await runHook(
      { tool_name: 'Read', tool_input: { file_path: '/tmp/foo.js' } },
      exploreEnv(),
    );
    expect(result.code).toBe(0);
  });

  test('allows Glob tool', async () => {
    const result = await runHook(
      { tool_name: 'Glob', tool_input: { pattern: '**/*.js' } },
      exploreEnv(),
    );
    expect(result.code).toBe(0);
  });

  test('allows Grep tool', async () => {
    const result = await runHook(
      { tool_name: 'Grep', tool_input: { pattern: 'foo' } },
      exploreEnv(),
    );
    expect(result.code).toBe(0);
  });

  test('allows safe Bash (git status)', async () => {
    const result = await runHook(
      { tool_name: 'Bash', tool_input: { command: 'git status' } },
      exploreEnv(),
    );
    expect(result.code).toBe(0);
  });

  test('allows safe Bash (ls -la)', async () => {
    const result = await runHook(
      { tool_name: 'Bash', tool_input: { command: 'ls -la' } },
      exploreEnv(),
    );
    expect(result.code).toBe(0);
  });

  test('block message mentions mode-change commands', async () => {
    const result = await runHook(
      { tool_name: 'Write', tool_input: { file_path: 'x.js', content: '' } },
      exploreEnv(),
    );
    expect(result.stderr).toContain('*mode ask');
    expect(result.stderr).toContain('*mode auto');
  });
});

// ---------------------------------------------------------------------------
// Tests — ask mode ALLOWS writes (no confirmation enforced at hook level)
// ---------------------------------------------------------------------------

describe('enforce-permission-mode hook — ask mode (default)', () => {
  let projectDir;

  beforeAll(async () => {
    projectDir = await makeTempProject('ask');
  });

  afterAll(() => cleanTemp(projectDir));

  const askEnv = () => ({ CLAUDE_PROJECT_DIR: projectDir });

  test('allows Write tool', async () => {
    const result = await runHook(
      { tool_name: 'Write', tool_input: { file_path: '/tmp/foo.js', content: 'x' } },
      askEnv(),
    );
    expect(result.code).toBe(0);
  });

  test('allows Edit tool', async () => {
    const result = await runHook(
      { tool_name: 'Edit', tool_input: { file_path: '/tmp/foo.js', old_string: 'a', new_string: 'b' } },
      askEnv(),
    );
    expect(result.code).toBe(0);
  });

  test('allows destructive Bash', async () => {
    const result = await runHook(
      { tool_name: 'Bash', tool_input: { command: 'rm -rf /tmp/test-dir' } },
      askEnv(),
    );
    expect(result.code).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Tests — auto mode ALLOWS everything
// ---------------------------------------------------------------------------

describe('enforce-permission-mode hook — auto mode', () => {
  let projectDir;

  beforeAll(async () => {
    projectDir = await makeTempProject('auto');
  });

  afterAll(() => cleanTemp(projectDir));

  const autoEnv = () => ({ CLAUDE_PROJECT_DIR: projectDir });

  test('allows Write tool', async () => {
    const result = await runHook(
      { tool_name: 'Write', tool_input: { file_path: '/tmp/foo.js', content: 'x' } },
      autoEnv(),
    );
    expect(result.code).toBe(0);
  });

  test('allows Edit tool', async () => {
    const result = await runHook(
      { tool_name: 'Edit', tool_input: { file_path: '/tmp/foo.js', old_string: 'a', new_string: 'b' } },
      autoEnv(),
    );
    expect(result.code).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Tests — fail-open: no config, missing file, invalid JSON
// ---------------------------------------------------------------------------

describe('enforce-permission-mode hook — fail-open (no config)', () => {
  let projectDir;

  beforeAll(async () => {
    // Create project dir WITHOUT a config file
    projectDir = await makeTempProject(null);
  });

  afterAll(() => cleanTemp(projectDir));

  const noConfigEnv = () => ({ CLAUDE_PROJECT_DIR: projectDir });

  test('allows Write when no config exists (defaults to ask → allow)', async () => {
    const result = await runHook(
      { tool_name: 'Write', tool_input: { file_path: '/tmp/foo.js', content: 'x' } },
      noConfigEnv(),
    );
    // No config → mode defaults to 'ask' → allow
    expect(result.code).toBe(0);
  });

  test('allows all operations when config is missing', async () => {
    const result = await runHook(
      { tool_name: 'Edit', tool_input: { file_path: '/tmp/foo.js' } },
      noConfigEnv(),
    );
    expect(result.code).toBe(0);
  });
});

describe('enforce-permission-mode hook — fail-open (invalid stdin)', () => {
  test('exits 0 (allow) when stdin is not valid JSON', async () => {
    const dir = await makeTempProject('explore');
    try {
      const result = await new Promise((resolve) => {
        const child = execFile(
          process.execPath,
          [HOOK],
          { env: { ...process.env, CLAUDE_PROJECT_DIR: dir } },
          (err, stdout, stderr) => {
            const code = err ? err.code : 0;
            resolve({ code, stdout, stderr });
          },
        );
        child.stdin.write('THIS IS NOT JSON {{{');
        child.stdin.end();
      });
      expect(result.code).toBe(0);
    } finally {
      cleanTemp(dir);
    }
  });

  test('exits 0 (allow) when stdin is empty', async () => {
    const dir = await makeTempProject('explore');
    try {
      const result = await new Promise((resolve) => {
        const child = execFile(
          process.execPath,
          [HOOK],
          { env: { ...process.env, CLAUDE_PROJECT_DIR: dir } },
          (err, stdout, stderr) => {
            const code = err ? err.code : 0;
            resolve({ code, stdout, stderr });
          },
        );
        child.stdin.end();
      });
      expect(result.code).toBe(0);
    } finally {
      cleanTemp(dir);
    }
  });
});

// ---------------------------------------------------------------------------
// Tests — legacy brand/org naming check (Article XI compliance)
// ---------------------------------------------------------------------------

describe('enforce-permission-mode hook — naming compliance', () => {
  test('hook file contains no legacy brand/org references', () => {
    const hookSource = fs.readFileSync(HOOK, 'utf8');
    // Legacy terms built from fragments so this test file does not itself trip
    // validate-no-external-refs (which greps the repo for these literals).
    const legacyBrand = new RegExp('AI' + 'OX', 'i');
    const legacyOrg = new RegExp('Syn' + 'kra' + 'AI', 'i');
    const legacyAlt = new RegExp('ai' + 'os', 'i');
    expect(hookSource).not.toMatch(legacyBrand);
    expect(hookSource).not.toMatch(legacyOrg);
    expect(hookSource).not.toMatch(legacyAlt);
  });
});
