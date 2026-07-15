'use strict';

const { execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const HOOK = path.resolve(__dirname, '../../.codex/hooks/claude-compat.cjs');
const CONFIG = path.resolve(__dirname, '../../.codex/hooks.json');

function runHook(eventName, payload, options = {}) {
  return new Promise((resolve) => {
    const child = execFile(
      process.execPath,
      [HOOK, eventName],
      {
        cwd: options.cwd || process.cwd(),
        env: { ...process.env, ...(options.env || {}) },
      },
      (error, stdout, stderr) => {
        resolve({
          code: error ? error.code : 0,
          stdout,
          stderr,
        });
      },
    );
    child.stdin.end(options.raw === true ? String(payload) : JSON.stringify(payload));
  });
}

function parseOutput(result) {
  return result.stdout ? JSON.parse(result.stdout) : null;
}

function makeFixtureProject() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-codex-hooks-'));
  const hooksDir = path.join(root, '.claude', 'hooks');
  fs.mkdirSync(path.join(root, '.codex'), { recursive: true });
  fs.mkdirSync(hooksDir, { recursive: true });

  const traceGuard = `'use strict';
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8');
fs.appendFileSync(process.env.SINAPSE_TEST_TRACE, input + '\\n', 'utf8');
`;
  fs.writeFileSync(
    path.join(hooksDir, 'enforce-framework-boundary.cjs'),
    traceGuard,
    'utf8',
  );

  return {
    root,
    trace: path.join(root, 'guard-trace.jsonl'),
  };
}

function readTrace(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

describe('Codex native hooks configuration', () => {
  test('uses repository-relative commands and Windows overrides for every handler', () => {
    const config = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
    const events = Object.keys(config.hooks);
    expect(events).toEqual(expect.arrayContaining([
      'PreToolUse',
      'PermissionRequest',
      'PostToolUse',
      'UserPromptSubmit',
      'PreCompact',
      'Stop',
      'SessionStart',
      'SubagentStart',
      'SubagentStop',
    ]));

    for (const groups of Object.values(config.hooks)) {
      for (const group of groups) {
        for (const hook of group.hooks) {
          expect(hook.type).toBe('command');
          expect(hook.command).toContain('git rev-parse --show-toplevel');
          expect(hook.commandWindows).toContain('git rev-parse --show-toplevel');
          expect(hook.command).not.toMatch(/[A-Za-z]:[\\/](?:Users|home)[\\/]/i);
          expect(hook.commandWindows).not.toMatch(/[A-Za-z]:[\\/](?:Users|home)[\\/]/i);
        }
      }
    }
  });

  test('Stop is telemetry-only and has no unconditional continuation hook', () => {
    const config = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
    const serialized = JSON.stringify(config.hooks.Stop);
    expect(serialized).toContain('claude-compat.cjs');
    expect(serialized).not.toMatch(/continue|decision|loop/i);
  });
});

describe('Codex apply_patch compatibility bridge', () => {
  let fixture;

  beforeEach(() => {
    fixture = makeFixtureProject();
  });

  afterEach(() => {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  });

  test('translates every Add, Update and Delete target in a multi-file patch', async () => {
    const command = `*** Begin Patch
*** Add File: docs/new-guide.md
+# New guide
*** Update File: packages/runtime.js
@@
-old
+new
*** Delete File: squads/legacy.md
*** End Patch`;
    const result = await runHook('PreToolUse', {
      hook_event_name: 'PreToolUse',
      tool_name: 'apply_patch',
      tool_input: { command },
      cwd: fixture.root,
    }, {
      cwd: fixture.root,
      env: { SINAPSE_TEST_TRACE: fixture.trace },
    });

    expect(result.code).toBe(0);
    expect(result.stdout).toBe('');
    const trace = readTrace(fixture.trace);
    expect(trace).toHaveLength(3);
    expect(trace.map((entry) => entry.tool_name)).toEqual(['Write', 'Edit', 'Edit']);
    expect(trace.map((entry) => entry.tool_input.file_path)).toEqual([
      'docs/new-guide.md',
      'packages/runtime.js',
      'squads/legacy.md',
    ]);
    expect(trace[0].tool_input.content).toContain('# New guide');
    expect(trace[1].tool_input.new_string).toContain('+new');
    expect(trace[2].tool_input.new_string).toBe('');
  });

  test.each([
    '.sinapse-ai/core/runtime.js',
    '.SINAPSE-AI/core/runtime.js',
    '.Sinapse-Ai/constitution.md',
    '.sinapse-ai/Core/runtime.js',
    '.sinapse-ai/constitution.md',
    '.sinapse-ai/development/tasks/new-task.md',
    '.sinapse-ai/infrastructure/new-validator.js',
    'bin/sinapse-delegate.js',
  ])('blocks protected path %s', async (filePath) => {
    const result = await runHook('PreToolUse', {
      hook_event_name: 'PreToolUse',
      tool_name: 'apply_patch',
      tool_input: {
        command: `*** Begin Patch\n*** Update File: ${filePath}\n@@\n-old\n+new\n*** End Patch`,
      },
      cwd: fixture.root,
    }, { cwd: fixture.root, env: { SINAPSE_TEST_TRACE: fixture.trace } });

    const output = parseOutput(result);
    expect(output.hookSpecificOutput.permissionDecision).toBe('deny');
    expect(output.hookSpecificOutput.permissionDecisionReason).toContain(filePath);
    expect(readTrace(fixture.trace)).toEqual([]);
  });

  test('blocks the entire patch when any target is protected', async () => {
    const command = `*** Begin Patch
*** Add File: docs/safe.md
+safe
*** Update File: .sinapse-ai/constitution.md
@@
-old
+new
*** End Patch`;
    const result = await runHook('PreToolUse', {
      tool_name: 'apply_patch',
      tool_input: { command },
      cwd: fixture.root,
    }, { cwd: fixture.root, env: { SINAPSE_TEST_TRACE: fixture.trace } });

    expect(parseOutput(result).hookSpecificOutput.permissionDecision).toBe('deny');
    expect(readTrace(fixture.trace)).toEqual([]);
  });

  test('blocks a rename into a protected path', async () => {
    const command = `*** Begin Patch
*** Update File: docs/safe.md
*** Move to: .sinapse-ai/core/renamed.md
@@
-old
+new
*** End Patch`;
    const result = await runHook('PreToolUse', {
      tool_name: 'apply_patch',
      tool_input: { command },
      cwd: fixture.root,
    }, { cwd: fixture.root, env: { SINAPSE_TEST_TRACE: fixture.trace } });

    const output = parseOutput(result);
    expect(output.hookSpecificOutput.permissionDecision).toBe('deny');
    expect(output.hookSpecificOutput.permissionDecisionReason).toContain(
      '.sinapse-ai/core/renamed.md',
    );
  });

  test('blocks secret-like content without echoing the value', async () => {
    const secret = `sk-proj-${'Q7w9_'.repeat(9)}`;
    const command = `*** Begin Patch
*** Add File: packages/config.js
+const key = '${secret}';
*** End Patch`;
    const result = await runHook('PreToolUse', {
      tool_name: 'apply_patch',
      tool_input: { command },
      cwd: fixture.root,
    }, { cwd: fixture.root, env: { SINAPSE_TEST_TRACE: fixture.trace } });

    const output = parseOutput(result);
    expect(output.hookSpecificOutput.permissionDecision).toBe('deny');
    expect(output.hookSpecificOutput.permissionDecisionReason).toContain('Secret-like content');
    expect(result.stdout).not.toContain(secret);
    expect(result.stderr).not.toContain(secret);
  });

  test('does not let an unrelated placeholder word hide a real secret', async () => {
    const secret = `sk-proj-${'R8x2_'.repeat(9)}`;
    const command = `*** Begin Patch
*** Add File: packages/config.js
+// example configuration
+const key = '${secret}';
*** End Patch`;
    const result = await runHook('PreToolUse', {
      tool_name: 'apply_patch',
      tool_input: { command },
      cwd: fixture.root,
    }, { cwd: fixture.root, env: { SINAPSE_TEST_TRACE: fixture.trace } });

    expect(parseOutput(result).hookSpecificOutput.permissionDecision).toBe('deny');
    expect(result.stdout).not.toContain(secret);
  });

  test('allows a safe L4 patch', async () => {
    const result = await runHook('PreToolUse', {
      tool_name: 'apply_patch',
      tool_input: {
        command: '*** Begin Patch\n*** Add File: docs/guides/safe.md\n+# Safe\n*** End Patch',
      },
      cwd: fixture.root,
    }, { cwd: fixture.root, env: { SINAPSE_TEST_TRACE: fixture.trace } });

    expect(result.code).toBe(0);
    expect(result.stdout).toBe('');
    expect(readTrace(fixture.trace)).toHaveLength(1);
  });

  test('fails closed for malformed apply_patch and invalid JSON', async () => {
    const malformed = await runHook('PreToolUse', {
      tool_name: 'apply_patch',
      tool_input: { command: 'not a patch' },
      cwd: fixture.root,
    }, { cwd: fixture.root });
    expect(parseOutput(malformed).hookSpecificOutput.permissionDecision).toBe('deny');

    const invalidJson = await runHook('PreToolUse', '{not-json', {
      cwd: fixture.root,
      raw: true,
    });
    expect(parseOutput(invalidJson).hookSpecificOutput.permissionDecision).toBe('deny');
  });
});

describe('Codex shell safety policies', () => {
  let fixture;

  beforeEach(() => {
    fixture = makeFixtureProject();
  });

  afterEach(() => {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  });

  test.each([
    'git push origin feature',
    'git push --force origin main',
    'git -c core.askPass=true push origin main',
    'git${IFS}push origin main',
    'git p\\ush origin main',
  ])('blocks Git push command: %s', async (command) => {
    const result = await runHook('PreToolUse', {
      tool_name: 'Bash',
      tool_input: { command },
      cwd: fixture.root,
    }, { cwd: fixture.root });
    expect(parseOutput(result).hookSpecificOutput.permissionDecision).toBe('deny');
  });

  test.each([
    'psql -c "DROP TABLE users"',
    'psql -c "DR""OP TABLE users"',
    "psql -c \"UP'DA'TE users SET active = false\"",
    'psql -c "TRUNCATE users"',
    'psql -c "ALTER TABLE users DROP COLUMN email"',
    'psql -c "DELETE FROM users"',
    'psql -c "UPDATE users SET active = false"',
    'psql -c "DELETE FROM users /* WHERE id = 1 */"',
    'psql -c "UPDATE users SET active = false -- WHERE id = 1"',
    'psql -c "UPDATE "my-users" AS u SET active = false"',
    'psql -c "DELETE FROM users --WHERE id = 1"',
    'psql --command "DELETE FROM users"',
    "psql -c \"DELETE FROM users RETURNING 'WHERE id'\"",
    'psql -c "DELETE\nFROM users"',
    'psql -c "UPDATE users\nSET active = false"',
  ])('blocks forbidden destructive SQL: %s', async (command) => {
    const result = await runHook('PreToolUse', {
      tool_name: 'Bash',
      tool_input: { command },
      cwd: fixture.root,
    }, { cwd: fixture.root });
    expect(parseOutput(result).hookSpecificOutput.permissionDecision).toBe('deny');
  });

  test.each([
    'git status --short',
    'psql -c "DELETE FROM users WHERE id = 1"',
    'psql -c "UPDATE users SET active = false WHERE id = 1"',
    "psql -c 'DELETE FROM users WHERE id = 1'",
  ])('allows safe shell command: %s', async (command) => {
    const result = await runHook('PreToolUse', {
      tool_name: 'Bash',
      tool_input: { command },
      cwd: fixture.root,
    }, { cwd: fixture.root });
    expect(result.code).toBe(0);
    expect(result.stdout).toBe('');
  });

  test.each([
    'git push --force origin feature/codex-hooks',
    'git push --force-with-lease origin feature/codex-hooks',
    'git push origin main',
    'git push origin HEAD:master',
    'git push origin',
    'git push origin :feature/obsolete',
    'git push origin $(git branch --show-current)',
  ])('blocks unsafe push even for @devops: %s', async (command) => {
    const result = await runHook('PreToolUse', {
      tool_name: 'Bash',
      tool_input: { command },
      cwd: fixture.root,
    }, {
      cwd: fixture.root,
      env: { SINAPSE_ACTIVE_AGENT: 'devops' },
    });
    expect(parseOutput(result).hookSpecificOutput.permissionDecision).toBe('deny');
  });

  test.each([
    'git push origin feature/codex-hooks',
    'git push -u origin refs/heads/feature/codex-hooks',
    'git.exe push origin bugfix/hook-policy',
  ])('allows explicit non-protected push only for @devops: %s', async (command) => {
    const result = await runHook('PreToolUse', {
      tool_name: 'Bash',
      tool_input: { command },
      cwd: fixture.root,
    }, {
      cwd: fixture.root,
      env: { SINAPSE_ACTIVE_AGENT: '@devops' },
    });
    expect(result.code).toBe(0);
    expect(result.stdout).toBe('');
  });

  test('returns the PermissionRequest-specific deny schema', async () => {
    const result = await runHook('PermissionRequest', {
      hook_event_name: 'PermissionRequest',
      tool_name: 'Bash',
      tool_input: { command: 'git push origin main' },
      cwd: fixture.root,
    }, { cwd: fixture.root });
    const output = parseOutput(result);
    expect(output.hookSpecificOutput.hookEventName).toBe('PermissionRequest');
    expect(output.hookSpecificOutput.decision.behavior).toBe('deny');
  });
});

describe('Codex lifecycle compatibility', () => {
  test.each(['SessionStart', 'SubagentStart'])(
    '%s injects concise canonical authority context',
    async (eventName) => {
      const fixture = makeFixtureProject();
      try {
        const result = await runHook(eventName, {
          hook_event_name: eventName,
          source: 'startup',
          agent_type: eventName === 'SubagentStart' ? 'developer' : undefined,
          cwd: fixture.root,
        }, { cwd: fixture.root });
        expect(result.code).toBe(0);
        expect(result.stdout).toContain('SINAPSE authority context');
        expect(result.stdout).toContain('Canonical agents, tasks, workflows');
        expect(result.stdout).toContain('@devops');
      } finally {
        fs.rmSync(fixture.root, { recursive: true, force: true });
      }
    },
  );

  test('SubagentStop is a no-op and does not request continuation', async () => {
    const fixture = makeFixtureProject();
    try {
      const result = await runHook('SubagentStop', {
        hook_event_name: 'SubagentStop',
        agent_type: 'developer',
        cwd: fixture.root,
      }, { cwd: fixture.root });
      expect(result.code).toBe(0);
      expect(result.stdout).toBe('');
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  });

  test('Stop invokes telemetry without requesting continuation', async () => {
    const fixture = makeFixtureProject();
    const marker = path.join(fixture.root, 'stop.marker');
    fs.writeFileSync(
      path.join(fixture.root, '.claude', 'hooks', 'telemetry-stop.cjs'),
      '\'use strict\'; require(\'fs\').writeFileSync(process.env.STOP_MARKER, \'done\');',
      'utf8',
    );
    try {
      const result = await runHook('Stop', {
        hook_event_name: 'Stop',
        session_id: 'test-session',
        cwd: fixture.root,
      }, {
        cwd: fixture.root,
        env: { STOP_MARKER: marker },
      });
      expect(result.code).toBe(0);
      expect(result.stdout).toBe('');
      expect(fs.readFileSync(marker, 'utf8')).toBe('done');
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  });
});
