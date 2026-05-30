/**
 * Spawn Safe — Cross-platform argv-based process spawning
 *
 * Hardened wrapper around child process spawning that:
 *   - NEVER uses a shell string (no `spawn('sh', ['-c', ...])`). Arguments go
 *     through argv, so a prompt containing quotes, pipes, `;`, `$()`, backticks
 *     or any other shell metacharacter is delivered literally and can never be
 *     interpreted as a command. Shell-injection is structurally impossible.
 *   - Resolves `.cmd` / `.bat` shims on Windows via the `cross-spawn` package
 *     (`claude` is `claude.cmd` on win32 — native `spawn('claude', ...)` gives
 *     ENOENT). cross-spawn also mitigates CVE-2024-27980 (Windows arg escaping).
 *   - Writes the provided `input` to stdin and closes it (the canonical way to
 *     feed a prompt to a CLI without putting it on the command line).
 *   - Uses a settle-once guard so the returned promise resolves/rejects exactly
 *     one time regardless of error/close/stdin-error ordering.
 *   - Handles stdin write errors / EPIPE, spawn errors (ENOENT), non-zero exit
 *     codes and signal termination as tracked failures — never hangs.
 *
 * Deterministic and testable: the underlying spawn implementation can be
 * injected via `options._spawnImpl` for unit tests (no real process needed).
 *
 * @module .sinapse-ai/core/utils/spawn-safe
 */

const crossSpawn = require('cross-spawn');

/**
 * @typedef {Object} SpawnSafeResult
 * @property {boolean} success - True when the process exited with code 0.
 * @property {number|null} code - Exit code (null when killed by a signal).
 * @property {string|null} signal - Signal name if killed by a signal, else null.
 * @property {string} stdout - Captured stdout.
 * @property {string} stderr - Captured stderr.
 */

/**
 * Spawn a command safely by argv and feed `input` through stdin.
 *
 * @param {string} command - Executable name (e.g. 'claude'). Resolved cross-platform.
 * @param {string[]} [args=[]] - Argument vector. Passed literally — never shell-parsed.
 * @param {Object} [options={}] - Options.
 * @param {string} [options.cwd] - Working directory.
 * @param {Object} [options.env] - Environment variables (defaults to process.env).
 * @param {number} [options.timeout] - Kill the process after N ms.
 * @param {string} [options.input] - Data written to the child's stdin, then stdin is closed.
 * @param {Function} [options.onStdout] - Optional callback(chunkString) for streaming stdout.
 * @param {Function} [options.onStderr] - Optional callback(chunkString) for streaming stderr.
 * @param {Function} [options._spawnImpl] - Injectable spawn (for tests). Defaults to cross-spawn.
 * @returns {Promise<SpawnSafeResult>} Resolves on close; rejects on spawn/stdin failure.
 */
function runSafe(command, args = [], options = {}) {
  if (!command || typeof command !== 'string') {
    return Promise.reject(new Error('runSafe requires a non-empty string command'));
  }

  if (!Array.isArray(args)) {
    return Promise.reject(new Error('runSafe requires args to be an array'));
  }

  const {
    cwd,
    env,
    timeout,
    input,
    onStdout,
    onStderr,
    _spawnImpl,
  } = options;

  const spawnImpl = typeof _spawnImpl === 'function' ? _spawnImpl : crossSpawn;

  return new Promise((resolve, reject) => {
    let child;

    const spawnOptions = {
      cwd,
      env: env || { ...process.env },
      stdio: ['pipe', 'pipe', 'pipe'],
    };

    if (typeof timeout === 'number' && timeout > 0) {
      spawnOptions.timeout = timeout;
    }

    try {
      child = spawnImpl(command, args, spawnOptions);
    } catch (error) {
      // Synchronous spawn failure (rare, but possible on bad cwd / impl).
      reject(new Error(`Failed to spawn "${command}": ${error.message}`));
      return;
    }

    let stdout = '';
    let stderr = '';
    let stdinError = null;
    let settled = false;

    const resolveOnce = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const rejectOnce = (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    // Spawn-level error (ENOENT, EACCES, timeout SIGTERM delivery, etc.).
    child.on('error', (error) => {
      rejectOnce(new Error(`Process "${command}" error: ${error.message}`));
    });

    if (child.stdout) {
      child.stdout.on('data', (data) => {
        const chunk = data.toString();
        stdout += chunk;
        if (typeof onStdout === 'function') onStdout(chunk);
      });
    }

    if (child.stderr) {
      child.stderr.on('data', (data) => {
        const chunk = data.toString();
        stderr += chunk;
        if (typeof onStderr === 'function') onStderr(chunk);
      });
    }

    child.on('close', (code, signal) => {
      if (stdinError) {
        rejectOnce(new Error(`Process "${command}" stdin write failed: ${stdinError.message}`));
        return;
      }
      resolveOnce({
        success: code === 0,
        code: typeof code === 'number' ? code : null,
        signal: signal || null,
        stdout,
        stderr,
      });
    });

    // Deliver input through stdin (never through the command line).
    if (input !== undefined && input !== null) {
      const stdin = child.stdin;

      if (!stdin || typeof stdin.write !== 'function' || typeof stdin.end !== 'function') {
        if (typeof child.kill === 'function') child.kill();
        rejectOnce(new Error(`Process "${command}" stdin is not available`));
        return;
      }

      // Track EPIPE / write-after-end so close handler reports it as a failure.
      stdin.on('error', (error) => {
        stdinError = error;
      });

      if (stdin.writable === false) {
        if (typeof child.kill === 'function') child.kill();
        rejectOnce(new Error(`Process "${command}" stdin is not writable`));
        return;
      }

      try {
        stdin.write(typeof input === 'string' ? input : String(input));
        stdin.end();
      } catch (error) {
        if (typeof child.kill === 'function') child.kill();
        rejectOnce(new Error(`Process "${command}" stdin write failed: ${error.message}`));
      }
    } else if (child.stdin && typeof child.stdin.end === 'function') {
      // No input to send — close stdin so the child doesn't block on read.
      child.stdin.on('error', () => {});
      try {
        child.stdin.end();
      } catch {
        // Ignore — child may have already closed stdin.
      }
    }
  });
}

module.exports = { runSafe };
module.exports.runSafe = runSafe;
