'use strict';

/**
 * @story A.2 - Logger & Verbose Flag Refactor
 *
 * Tests cover:
 * - Level thresholds (error/warn/info/debug)
 * - Flag parsing and precedence (--quiet > --debug > --verbose > default)
 * - JSON mode accumulation + flush
 * - First-run detection for ASCII art gating
 * - shouldShowHeader logic
 */

const path = require('path');
const fs = require('fs');
const os = require('os');

const LOGGER_PATH = path.join(__dirname, '..', '..', '.sinapse-ai', 'core', 'logger');

describe('logger (Story A.2)', () => {
  let logger;

  beforeEach(() => {
    // Fresh require so the singleton inside the module is reset per test file section.
    jest.resetModules();
    logger = require(LOGGER_PATH);
  });

  // ── capture helpers ────────────────────────────────────────────────────────
  function makeStream() {
    const chunks = [];
    return {
      write: (s) => { chunks.push(String(s)); return true; },
      get text() { return chunks.join(''); },
      chunks,
    };
  }

  describe('LEVELS + parseFlags + resolveLevel', () => {
    test('LEVELS exposes error/warn/info/debug in ascending order', () => {
      expect(logger.LEVELS.error).toBe(0);
      expect(logger.LEVELS.warn).toBe(1);
      expect(logger.LEVELS.info).toBe(2);
      expect(logger.LEVELS.debug).toBe(3);
    });

    test('parseFlags detects --verbose/-v, --debug, --quiet/-q, --json', () => {
      expect(logger.parseFlags(['--verbose'])).toMatchObject({ verbose: true });
      expect(logger.parseFlags(['-v'])).toMatchObject({ verbose: true });
      expect(logger.parseFlags(['--debug'])).toMatchObject({ debug: true });
      expect(logger.parseFlags(['--quiet'])).toMatchObject({ quiet: true });
      expect(logger.parseFlags(['-q'])).toMatchObject({ quiet: true });
      expect(logger.parseFlags(['--json'])).toMatchObject({ json: true });
    });

    test('resolveLevel defaults to warn', () => {
      expect(logger.resolveLevel({})).toBe('warn');
    });

    test('resolveLevel: --verbose -> info', () => {
      expect(logger.resolveLevel({ verbose: true })).toBe('info');
    });

    test('resolveLevel: --debug -> debug', () => {
      expect(logger.resolveLevel({ debug: true })).toBe('debug');
    });

    test('resolveLevel: --quiet -> error (beats everything)', () => {
      expect(logger.resolveLevel({ quiet: true, debug: true, verbose: true })).toBe('error');
    });

    test('resolveLevel: --debug beats --verbose', () => {
      expect(logger.resolveLevel({ debug: true, verbose: true })).toBe('debug');
    });
  });

  describe('createLogger at default (warn) level', () => {
    test('info() is suppressed, warn() goes to stderr, always() goes to stdout', () => {
      const out = makeStream();
      const err = makeStream();
      const log = logger.createLogger({ level: 'warn', stdout: out, stderr: err });

      log.info('hidden-info');
      log.debug('hidden-debug');
      log.warn('shown-warn');
      log.always('shown-always');
      log.error('shown-error');

      expect(out.text).toContain('shown-always');
      expect(out.text).not.toContain('hidden-info');
      expect(err.text).toContain('shown-warn');
      expect(err.text).toContain('shown-error');
    });

    test('isEnabled reflects threshold', () => {
      const log = logger.createLogger({ level: 'warn' });
      expect(log.isEnabled('error')).toBe(true);
      expect(log.isEnabled('warn')).toBe(true);
      expect(log.isEnabled('info')).toBe(false);
      expect(log.isEnabled('debug')).toBe(false);
    });
  });

  describe('createLogger at info (--verbose) level', () => {
    test('info() is emitted, debug() is suppressed', () => {
      const out = makeStream();
      const err = makeStream();
      const log = logger.createLogger({ level: 'info', stdout: out, stderr: err });

      log.info('info-msg');
      log.debug('debug-msg');
      log.warn('warn-msg');

      expect(out.text).toContain('info-msg');
      expect(out.text).not.toContain('debug-msg');
      expect(err.text).toContain('warn-msg');
    });
  });

  describe('createLogger at debug level', () => {
    test('all levels are emitted', () => {
      const out = makeStream();
      const err = makeStream();
      const log = logger.createLogger({ level: 'debug', stdout: out, stderr: err });

      log.info('info-msg');
      log.debug('debug-msg');
      log.warn('warn-msg');
      log.error('error-msg');

      expect(out.text).toContain('info-msg');
      expect(out.text).toContain('debug-msg');
      expect(err.text).toContain('warn-msg');
      expect(err.text).toContain('error-msg');
    });
  });

  describe('createLogger at error (--quiet) level', () => {
    test('only error() is emitted', () => {
      const out = makeStream();
      const err = makeStream();
      const log = logger.createLogger({ level: 'error', stdout: out, stderr: err });

      log.info('hidden');
      log.debug('hidden');
      log.warn('hidden');
      log.always('hidden');
      log.error('shown');

      expect(out.text).toBe('');
      expect(err.text).toContain('shown');
      expect(err.text).not.toContain('hidden');
    });
  });

  describe('json mode', () => {
    test('suppresses human text; flush() emits structured JSON with required fields', () => {
      const out = makeStream();
      const err = makeStream();
      const log = logger.createLogger({ level: 'info', json: true, stdout: out, stderr: err });

      log.setVersion('9.9.9');
      log.addAgent('pixel', { role: 'developer' });
      log.info('info-msg');
      log.warn('warn-msg');
      log.error('error-msg');

      // Nothing emitted yet (buffered)
      expect(out.text).toBe('');
      expect(err.text).toBe('');

      log.flush();

      const payload = JSON.parse(out.text.trim());
      expect(payload).toHaveProperty('status');
      expect(payload).toHaveProperty('version', '9.9.9');
      expect(payload).toHaveProperty('agents');
      expect(payload.agents).toEqual([{ name: 'pixel', role: 'developer' }]);
      expect(payload.warnings).toContain('warn-msg');
      expect(payload.errors).toContain('error-msg');
      expect(payload.status).toBe('error');
    });

    test('flush() is idempotent', () => {
      const out = makeStream();
      const log = logger.createLogger({ level: 'warn', json: true, stdout: out });
      log.warn('w');
      log.flush();
      log.flush();
      // Only one JSON object written
      expect(out.chunks.length).toBe(1);
    });

    test('status transitions ok -> warn -> error and does not regress', () => {
      const out = makeStream();
      const log = logger.createLogger({ level: 'info', json: true, stdout: out });
      expect(log._jsonState.status).toBe('ok');
      log.warn('w1');
      expect(log._jsonState.status).toBe('warn');
      log.error('e1');
      expect(log._jsonState.status).toBe('error');
      // warnings after error do not downgrade status
      log.warn('w2');
      expect(log._jsonState.status).toBe('error');
    });
  });

  describe('shouldShowHeader', () => {
    const tmpHome = path.join(os.tmpdir(), `sinapse-logger-test-${process.pid}-${Date.now()}`);
    let originalHomedir;

    beforeAll(() => {
      originalHomedir = os.homedir;
      os.homedir = () => tmpHome;
    });

    afterAll(() => {
      os.homedir = originalHomedir;
      try { fs.rmSync(tmpHome, { recursive: true, force: true }); } catch { /* noop */ }
    });

    beforeEach(() => {
      try { fs.rmSync(tmpHome, { recursive: true, force: true }); } catch { /* noop */ }
      // Reload logger module so FIRST_RUN_FLAG is recomputed against tmpHome.
      jest.resetModules();
      logger = require(LOGGER_PATH);
    });

    test('first run + default level -> shows header', () => {
      const log = logger.createLogger({ level: 'warn' });
      expect(logger.shouldShowHeader(log)).toBe(true);
    });

    test('after markFirstRunDone() + default level -> hides header', () => {
      logger.markFirstRunDone();
      const log = logger.createLogger({ level: 'warn' });
      expect(logger.shouldShowHeader(log)).toBe(false);
    });

    test('--verbose always shows header (even after first run)', () => {
      logger.markFirstRunDone();
      const log = logger.createLogger({ level: 'info' });
      expect(logger.shouldShowHeader(log)).toBe(true);
    });

    test('--quiet never shows header', () => {
      const log = logger.createLogger({ level: 'error' });
      expect(logger.shouldShowHeader(log)).toBe(false);
    });

    test('--json never shows header', () => {
      const log = logger.createLogger({ level: 'info', json: true });
      expect(logger.shouldShowHeader(log)).toBe(false);
    });
  });

  describe('getLogger singleton', () => {
    test('returns same instance on repeated calls', () => {
      logger._resetLogger();
      const a = logger.getLogger(['--verbose']);
      const b = logger.getLogger(['--debug']); // ignored because singleton
      expect(a).toBe(b);
      logger._resetLogger();
    });

    test('reads argv to build level', () => {
      logger._resetLogger();
      const log = logger.getLogger(['--quiet']);
      expect(log.level).toBe('error');
      logger._resetLogger();
    });
  });
});
