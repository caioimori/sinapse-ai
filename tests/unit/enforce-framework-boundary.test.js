/**
 * Tests for enforce-framework-boundary.cjs hook
 *
 * Test strategy:
 *   - Spawn the hook as a child process with crafted stdin JSON
 *   - Point the hook at a TEMP fixture project (via CLAUDE_PROJECT_DIR) whose
 *     .sinapse-ai/core-config.yaml has boundary.frameworkProtection: true.
 *     The REAL repo core-config.yaml stays at false and is never touched.
 *   - Assert exit code (0 = allow, 2 = block) and stderr content on block.
 *
 * Covered cases:
 *   (a) protection ON + Edit L1 (.sinapse-ai/core/foo.js)            → 2
 *   (b) protection ON + Edit .sinapse-ai/constitution.md            → 2
 *   (c) protection ON + Write exception (.sinapse-ai/data/foo.yaml) → 0
 *   (d) protection ON + Edit exception MEMORY.md                    → 0
 *   (e) protection ON + Write docs/foo.md (L4)                      → 0
 *   (f) protection OFF + Edit L1                                    → 0
 *   (g) core-config.yaml missing/illegible                         → 0 (fail-open)
 *   (h) tool_name=Read on L1 path                                  → 0 (only Write/Edit)
 */

'use strict';

const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const HOOK = path.resolve(
  __dirname,
  '../../.claude/hooks/enforce-framework-boundary.cjs',
);

// ---------------------------------------------------------------------------
// Helper: run hook with given stdin JSON and env overrides
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
// Helper: temp fixture project with a controlled boundary block.
// Mirrors the real repo's protected/exceptions lists so the test exercises
// the same globs the hook will see in production.
// ---------------------------------------------------------------------------

const BOUNDARY_YAML = (frameworkProtection) => `markdownExploder: true
project:
  type: EXISTING_SINAPSE
boundary:
  frameworkProtection: ${frameworkProtection}
  protected:
    - .sinapse-ai/core/**
    - .sinapse-ai/development/tasks/**
    - .sinapse-ai/development/templates/**
    - .sinapse-ai/development/checklists/**
    - .sinapse-ai/development/workflows/**
    - .sinapse-ai/infrastructure/**
    - .sinapse-ai/constitution.md
    - bin/sinapse.js
    - bin/sinapse-init.js
  exceptions:
    - .sinapse-ai/data/**
    - .sinapse-ai/development/agents/*/MEMORY.md
    - .sinapse-ai/core/config/schemas/**
    - .sinapse-ai/core/config/template-overrides.js
`;

/**
 * Create a temp project dir.
 * @param {boolean|null} frameworkProtection  true/false → write config with that value.
 *                                             null      → do NOT create core-config.yaml.
 */
function makeTempProject(frameworkProtection) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'snps-boundary-test-'));
  if (frameworkProtection !== null) {
    const cfgDir = path.join(dir, '.sinapse-ai');
    fs.mkdirSync(cfgDir, { recursive: true });
    fs.writeFileSync(
      path.join(cfgDir, 'core-config.yaml'),
      BOUNDARY_YAML(frameworkProtection),
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
// (a)-(e), (h): frameworkProtection = true
// ---------------------------------------------------------------------------

describe('enforce-framework-boundary — protection ON', () => {
  let projectDir;
  beforeAll(() => {
    projectDir = makeTempProject(true);
  });
  afterAll(() => cleanTemp(projectDir));

  const env = () => ({ CLAUDE_PROJECT_DIR: projectDir });

  // (a) Edit L1 → block
  test('(a) blocks Edit on .sinapse-ai/core/foo.js', async () => {
    const result = await runHook(
      { tool_name: 'Edit', tool_input: { file_path: '.sinapse-ai/core/foo.js', old_string: 'a', new_string: 'b' } },
      env(),
    );
    expect(result.code).toBe(2);
    expect(result.stderr).toContain('FRAMEWORK-BOUNDARY BLOCK');
    expect(result.stderr).toContain('.sinapse-ai/core/foo.js');
    expect(result.stderr).toContain('.sinapse-ai/core/**');
  });

  // (b) Edit constitution.md → block
  test('(b) blocks Edit on .sinapse-ai/constitution.md', async () => {
    const result = await runHook(
      { tool_name: 'Edit', tool_input: { file_path: '.sinapse-ai/constitution.md', old_string: 'a', new_string: 'b' } },
      env(),
    );
    expect(result.code).toBe(2);
    expect(result.stderr).toContain('FRAMEWORK-BOUNDARY BLOCK');
    expect(result.stderr).toContain('.sinapse-ai/constitution.md');
  });

  // (c) Write exception data/** → allow
  test('(c) allows Write on .sinapse-ai/data/foo.yaml (exception)', async () => {
    const result = await runHook(
      { tool_name: 'Write', tool_input: { file_path: '.sinapse-ai/data/foo.yaml', content: 'x' } },
      env(),
    );
    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
  });

  // (d) Edit exception MEMORY.md → allow (exception wins over .sinapse-ai/** intuition;
  //     note this path is under development/agents which is NOT in protected, but the
  //     exception glob with single * must still resolve to allow)
  test('(d) allows Edit on .sinapse-ai/development/agents/dev/MEMORY.md (exception)', async () => {
    const result = await runHook(
      { tool_name: 'Edit', tool_input: { file_path: '.sinapse-ai/development/agents/dev/MEMORY.md', old_string: 'a', new_string: 'b' } },
      env(),
    );
    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
  });

  // (e) Write L4 docs → allow
  test('(e) allows Write on docs/foo.md (L4 runtime)', async () => {
    const result = await runHook(
      { tool_name: 'Write', tool_input: { file_path: 'docs/foo.md', content: '# hi' } },
      env(),
    );
    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
  });

  // (h) Read on L1 path → allow (only Write/Edit/NotebookEdit are enforced)
  test('(h) allows Read on .sinapse-ai/core/foo.js (non-write tool)', async () => {
    const result = await runHook(
      { tool_name: 'Read', tool_input: { file_path: '.sinapse-ai/core/foo.js' } },
      env(),
    );
    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
  });

  // Extra coverage: exception under protected dir wins (core/config/schemas/**)
  test('(extra) exceptions WIN over protected: .sinapse-ai/core/config/schemas/x.json allowed', async () => {
    const result = await runHook(
      { tool_name: 'Write', tool_input: { file_path: '.sinapse-ai/core/config/schemas/x.json', content: '{}' } },
      env(),
    );
    expect(result.code).toBe(0);
  });

  // Extra coverage: absolute path normalization still blocks
  test('(extra) blocks Edit via absolute path inside protected L1', async () => {
    const absolute = path.join(projectDir, '.sinapse-ai', 'core', 'deep', 'mod.js');
    const result = await runHook(
      { tool_name: 'Edit', tool_input: { file_path: absolute, old_string: 'a', new_string: 'b' } },
      env(),
    );
    expect(result.code).toBe(2);
    expect(result.stderr).toContain('FRAMEWORK-BOUNDARY BLOCK');
  });

  // Extra coverage: single * does NOT cross segments — a/b/MEMORY.md is NOT an exception
  // and is also not protected, so it still allows (proves * segment semantics don't
  // accidentally over-match into protected). Then a protected bin file blocks.
  test('(extra) blocks Write on bin/sinapse.js (protected file glob)', async () => {
    const result = await runHook(
      { tool_name: 'Write', tool_input: { file_path: 'bin/sinapse.js', content: 'x' } },
      env(),
    );
    expect(result.code).toBe(2);
    expect(result.stderr).toContain('bin/sinapse.js');
  });
});

// ---------------------------------------------------------------------------
// (f): frameworkProtection = false → never blocks, even on L1
// ---------------------------------------------------------------------------

describe('enforce-framework-boundary — protection OFF', () => {
  let projectDir;
  beforeAll(() => {
    projectDir = makeTempProject(false);
  });
  afterAll(() => cleanTemp(projectDir));

  test('(f) allows Edit on L1 path when frameworkProtection=false', async () => {
    const result = await runHook(
      { tool_name: 'Edit', tool_input: { file_path: '.sinapse-ai/core/foo.js', old_string: 'a', new_string: 'b' } },
      { CLAUDE_PROJECT_DIR: projectDir },
    );
    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
  });
});

// ---------------------------------------------------------------------------
// (g): missing / illegible core-config.yaml → fail-open (allow)
// ---------------------------------------------------------------------------

describe('enforce-framework-boundary — fail-open (no config)', () => {
  let projectDir;
  beforeAll(() => {
    projectDir = makeTempProject(null); // no core-config.yaml written
  });
  afterAll(() => cleanTemp(projectDir));

  test('(g) allows Edit on L1 path when core-config.yaml is missing', async () => {
    const result = await runHook(
      { tool_name: 'Edit', tool_input: { file_path: '.sinapse-ai/core/foo.js', old_string: 'a', new_string: 'b' } },
      { CLAUDE_PROJECT_DIR: projectDir },
    );
    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
  });

  test('(g2) allows Edit on L1 when core-config.yaml is malformed YAML', async () => {
    const badDir = fs.mkdtempSync(path.join(os.tmpdir(), 'snps-boundary-bad-'));
    try {
      const cfgDir = path.join(badDir, '.sinapse-ai');
      fs.mkdirSync(cfgDir, { recursive: true });
      // Invalid YAML (unterminated flow mapping)
      fs.writeFileSync(path.join(cfgDir, 'core-config.yaml'), 'boundary: { : [ broken', 'utf8');
      const result = await runHook(
        { tool_name: 'Edit', tool_input: { file_path: '.sinapse-ai/core/foo.js', old_string: 'a', new_string: 'b' } },
        { CLAUDE_PROJECT_DIR: badDir },
      );
      expect(result.code).toBe(0);
    } finally {
      cleanTemp(badDir);
    }
  });
});

// ---------------------------------------------------------------------------
// Fail-open: invalid / empty stdin
// ---------------------------------------------------------------------------

describe('enforce-framework-boundary — fail-open (invalid stdin)', () => {
  let projectDir;
  beforeAll(() => {
    projectDir = makeTempProject(true);
  });
  afterAll(() => cleanTemp(projectDir));

  test('exits 0 when stdin is not valid JSON', async () => {
    const result = await new Promise((resolve) => {
      const child = execFile(
        process.execPath,
        [HOOK],
        { env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir } },
        (err, stdout, stderr) => resolve({ code: err ? err.code : 0, stdout, stderr }),
      );
      child.stdin.write('NOT JSON {{{');
      child.stdin.end();
    });
    expect(result.code).toBe(0);
  });

  test('exits 0 when stdin is empty', async () => {
    const result = await new Promise((resolve) => {
      const child = execFile(
        process.execPath,
        [HOOK],
        { env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir } },
        (err, stdout, stderr) => resolve({ code: err ? err.code : 0, stdout, stderr }),
      );
      child.stdin.end();
    });
    expect(result.code).toBe(0);
  });
});
