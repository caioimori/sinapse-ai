'use strict';

/**
 * SINAPSE Logger — unified logging abstraction
 * @story A.2 - Logger & Verbose Flag Refactor
 *
 * Levels:
 *   error = 0  (always shown, except nothing is shown in --json mode until flush)
 *   warn  = 1  (default floor — shown unless --quiet)
 *   info  = 2  (shown on --verbose)
 *   debug = 3  (shown on --debug)
 *
 * Flag resolution priority (highest wins):
 *   --quiet > --debug > --verbose > default(warn)
 *
 * Extra modes:
 *   --json  Structured output: all human text is suppressed; logger accumulates a
 *           JSON summary which is flushed at process exit (flush() also callable).
 *
 * First-run detection:
 *   ASCII art header is gated by level (info+) OR the absence of
 *   ~/.sinapse/.first-run-done. The first run creates this flag file.
 *
 * Design constraints (from story Dev Notes):
 *   - Zero external deps (pure Node stdlib).
 *   - Safe on repeated require() from bin/cli.js and bin/sinapse.js in same process.
 *   - Tests can call createLogger({ level, json }) to build isolated instances.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const LEVELS = Object.freeze({
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
});

const LEVEL_NAMES = Object.freeze(['error', 'warn', 'info', 'debug']);

const DEFAULT_LEVEL = 'warn';

const SINAPSE_HOME = path.join(os.homedir(), '.sinapse');
const FIRST_RUN_FLAG = path.join(SINAPSE_HOME, '.first-run-done');

/**
 * Resolve level from parsed flags. Higher verbosity wins unless --quiet is set.
 * --quiet beats everything else (error only).
 * @param {{ quiet?: boolean, debug?: boolean, verbose?: boolean }} flags
 * @returns {'error'|'warn'|'info'|'debug'}
 */
function resolveLevel(flags = {}) {
  if (flags.quiet) return 'error';
  if (flags.debug) return 'debug';
  if (flags.verbose) return 'info';
  return DEFAULT_LEVEL;
}

/**
 * Parse verbosity/output flags from an argv-like array (process.argv.slice(2)).
 * Non-destructive — returns a plain object, does not mutate the input.
 * @param {string[]} argv
 */
function parseFlags(argv) {
  const a = Array.isArray(argv) ? argv : [];
  const has = (name) => a.includes(name);
  return {
    quiet: has('--quiet') || has('-q'),
    verbose: has('--verbose') || has('-v'),
    debug: has('--debug'),
    json: has('--json'),
  };
}

/**
 * Detect whether this is a first run. True when the flag file does NOT exist.
 * Any filesystem error is treated as "not first run" to avoid breaking headless
 * environments (safer default: stay quiet).
 */
function isFirstRun() {
  try {
    return !fs.existsSync(FIRST_RUN_FLAG);
  } catch {
    return false;
  }
}

/**
 * Mark first run as done by touching the flag file. Idempotent and failure-tolerant.
 */
function markFirstRunDone() {
  try {
    if (!fs.existsSync(SINAPSE_HOME)) {
      fs.mkdirSync(SINAPSE_HOME, { recursive: true });
    }
    if (!fs.existsSync(FIRST_RUN_FLAG)) {
      fs.writeFileSync(FIRST_RUN_FLAG, `${new Date().toISOString()}\n`, 'utf8');
    }
  } catch {
    /* non-fatal — first-run detection will just keep asking */
  }
}

/**
 * Build a logger instance.
 * @param {object} [opts]
 * @param {'error'|'warn'|'info'|'debug'} [opts.level]  explicit level (overrides flags)
 * @param {boolean} [opts.json]                         json mode
 * @param {NodeJS.WritableStream} [opts.stdout]         stdout sink (testable)
 * @param {NodeJS.WritableStream} [opts.stderr]         stderr sink (testable)
 */
function createLogger(opts = {}) {
  const level = opts.level && LEVELS[opts.level] !== undefined ? opts.level : DEFAULT_LEVEL;
  const threshold = LEVELS[level];
  const json = Boolean(opts.json);
  const stdout = opts.stdout || process.stdout;
  const stderr = opts.stderr || process.stderr;

  // JSON-mode accumulator. Flushed as a single JSON object on flush() or process exit.
  const jsonState = {
    status: 'ok',
    version: null,
    agents: [],
    warnings: [],
    errors: [],
    messages: [],
  };

  function emit(channel, lvl, args) {
    if (json) {
      const text = args
        .map((a) => (a instanceof Error ? a.stack || a.message : typeof a === 'object' ? safeStringify(a) : String(a)))
        .join(' ');
      if (lvl === 'error') jsonState.errors.push(text);
      else if (lvl === 'warn') jsonState.warnings.push(text);
      else jsonState.messages.push({ level: lvl, text });
      if (lvl === 'error') jsonState.status = 'error';
      else if (lvl === 'warn' && jsonState.status === 'ok') jsonState.status = 'warn';
      return;
    }
    const stream = channel === 'stderr' ? stderr : stdout;
    try {
      stream.write(`${formatArgs(args)}\n`);
    } catch {
      /* broken pipe / closed stream — swallow */
    }
  }

  function formatArgs(args) {
    return args
      .map((a) => {
        if (a instanceof Error) return a.stack || a.message;
        if (typeof a === 'object' && a !== null) return safeStringify(a);
        return String(a);
      })
      .join(' ');
  }

  const api = {
    level,
    threshold,
    json,

    isEnabled(lvl) {
      return LEVELS[lvl] !== undefined && LEVELS[lvl] <= threshold;
    },

    error(...args) {
      // error is always captured (level 0)
      emit('stderr', 'error', args);
    },

    warn(...args) {
      if (threshold >= LEVELS.warn) emit('stderr', 'warn', args);
    },

    info(...args) {
      if (threshold >= LEVELS.info) emit('stdout', 'info', args);
    },

    debug(...args) {
      if (threshold >= LEVELS.debug) emit('stdout', 'debug', args);
    },

    /**
     * Write raw text to stdout at info-or-higher. Used by commands that need
     * to render tables / long output that should NOT appear on default runs.
     */
    print(...args) {
      if (json) {
        jsonState.messages.push({ level: 'info', text: formatArgs(args) });
        return;
      }
      if (threshold >= LEVELS.info) {
        try {
          stdout.write(`${formatArgs(args)}\n`);
        } catch { /* ignore */ }
      }
    },

    /**
     * Always-on stdout write. For output that MUST appear at default level
     * (e.g. one-line status: "SINAPSE ready."). Respects --json and --quiet.
     * --quiet: suppressed unless this is a direct error.
     */
    always(...args) {
      if (json) {
        jsonState.messages.push({ level: 'always', text: formatArgs(args) });
        return;
      }
      if (threshold === LEVELS.error) return; // --quiet
      try {
        stdout.write(`${formatArgs(args)}\n`);
      } catch { /* ignore */ }
    },

    /**
     * Set the package version on the JSON state. Harmless in non-json mode.
     */
    setVersion(version) {
      jsonState.version = version;
    },

    /**
     * Push an agent entry into the JSON state. Harmless in non-json mode.
     */
    addAgent(name, meta = {}) {
      jsonState.agents.push({ name, ...meta });
    },

    /**
     * Flush the JSON state to stdout as a single structured object.
     * Safe to call multiple times — no-op after the first call.
     */
    flush() {
      if (!json || api._flushed) return;
      api._flushed = true;
      try {
        stdout.write(`${JSON.stringify(jsonState)}\n`);
      } catch { /* ignore */ }
    },

    _jsonState: jsonState,
    _flushed: false,
  };

  return api;
}

/**
 * Build the process-wide logger from process.argv. Cached: repeated calls return
 * the same instance so `bin/cli.js` and `bin/sinapse.js` share state in a single run.
 */
let _singleton = null;

function getLogger(argvOverride) {
  if (_singleton) return _singleton;
  const argv = argvOverride || process.argv.slice(2);
  const flags = parseFlags(argv);
  _singleton = createLogger({
    level: resolveLevel(flags),
    json: flags.json,
  });
  _singleton._flags = flags;

  // Ensure JSON state is flushed on process exit so --json is reliable.
  if (flags.json) {
    const flush = () => { try { _singleton.flush(); } catch { /* noop */ } };
    process.on('exit', flush);
    process.on('beforeExit', flush);
  }
  return _singleton;
}

/** Reset the singleton (tests only). */
function _resetLogger() {
  _singleton = null;
}

/**
 * Decide whether the ASCII art header should be shown.
 *
 *   show if: level >= info  (i.e. --verbose or --debug)
 *   OR       first run (no flag file)
 *
 *   never show in --json mode or --quiet mode.
 */
function shouldShowHeader(logger) {
  if (!logger) return false;
  if (logger.json) return false;
  if (logger.threshold === LEVELS.error) return false; // --quiet
  if (logger.threshold >= LEVELS.info) return true;    // --verbose / --debug
  return isFirstRun();
}

function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return '[unserializable]';
  }
}

module.exports = {
  LEVELS,
  LEVEL_NAMES,
  DEFAULT_LEVEL,
  FIRST_RUN_FLAG,
  createLogger,
  getLogger,
  parseFlags,
  resolveLevel,
  isFirstRun,
  markFirstRunDone,
  shouldShowHeader,
  _resetLogger,
};
