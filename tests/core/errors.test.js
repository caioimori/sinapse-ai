/**
 * Core Errors Module Tests
 *
 * Foundation typed-error module (core/errors/) with SINAPSE branding
 * (SinapseError / SNPS_* / SINAPSE).
 *
 * Proves:
 *   - SinapseError carries the typed fields (code, category, severity,
 *     retryable, recovery, exitCode).
 *   - normalizeError envelopes a raw Error with code/category/severity.
 *   - serializeError redacts the stack when NODE_ENV=production and includes
 *     it in dev (or when a debug flag is set).
 *   - sanitizeValue survives a circular reference without throwing.
 *
 * @author @developer
 * @version 1.0.0
 */

const {
  SinapseError,
  ErrorRegistry,
  ErrorCategory,
  ErrorSeverity,
  DEFAULT_ERROR_CODE,
  CORE_ERROR_DEFINITIONS,
  defaultErrorRegistry,
  isSinapseError,
  normalizeError,
  serializeError,
  sanitizeValue,
  shouldExposeErrorStack,
} = require('../../.sinapse-ai/core/errors');

describe('Core Errors Module (Port #10)', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalSinapseDebug = process.env.SINAPSE_DEBUG;
  const originalDebugStacks = process.env.DEBUG_ERROR_STACKS;
  const originalDebugStacks2 = process.env.DEBUG_STACKS;

  afterEach(() => {
    // Restore env after every test so stack-exposure tests stay isolated.
    process.env.NODE_ENV = originalNodeEnv;
    process.env.SINAPSE_DEBUG = originalSinapseDebug;
    process.env.DEBUG_ERROR_STACKS = originalDebugStacks;
    process.env.DEBUG_STACKS = originalDebugStacks2;

    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    if (originalSinapseDebug === undefined) delete process.env.SINAPSE_DEBUG;
    if (originalDebugStacks === undefined) delete process.env.DEBUG_ERROR_STACKS;
    if (originalDebugStacks2 === undefined) delete process.env.DEBUG_STACKS;
  });

  describe('branding', () => {
    test('DEFAULT_ERROR_CODE uses SNPS_ prefix', () => {
      expect(DEFAULT_ERROR_CODE).toBe('SNPS_UNKNOWN_ERROR');
    });

    test('every core definition uses an SNPS_ code', () => {
      expect(CORE_ERROR_DEFINITIONS.length).toBeGreaterThan(0);
      for (const definition of CORE_ERROR_DEFINITIONS) {
        expect(definition.code).toMatch(/^SNPS_/);
      }
    });

    test('SNPS_SYNAPSE_LAYER_FAILED is registered', () => {
      expect(defaultErrorRegistry.has('SNPS_SYNAPSE_LAYER_FAILED')).toBe(true);
      const def = defaultErrorRegistry.lookup('SNPS_SYNAPSE_LAYER_FAILED');
      expect(def.category).toBe(ErrorCategory.SYNAPSE);
      expect(def.severity).toBe(ErrorSeverity.WARNING);
    });
  });

  describe('SinapseError fields', () => {
    test('carries code, category, severity, retryable, recovery, exitCode', () => {
      const error = new SinapseError('permission denied', {
        code: 'SNPS_PERMISSION_DENIED',
      });

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('SinapseError');
      expect(error.message).toBe('permission denied');
      expect(error.code).toBe('SNPS_PERMISSION_DENIED');
      expect(error.category).toBe(ErrorCategory.PERMISSION);
      expect(error.severity).toBe(ErrorSeverity.ERROR);
      expect(error.retryable).toBe(false);
      expect(Array.isArray(error.recovery)).toBe(true);
      expect(error.recovery.length).toBeGreaterThan(0);
      expect(error.exitCode).toBe(13);
      expect(error.isSinapseError).toBe(true);
      expect(isSinapseError(error)).toBe(true);
    });

    test('options can override definition defaults', () => {
      const error = new SinapseError('custom', {
        code: 'SNPS_NETWORK_ERROR',
        retryable: false,
        severity: ErrorSeverity.CRITICAL,
        exitCode: 7,
        recovery: ['do the thing'],
      });

      expect(error.retryable).toBe(false);
      expect(error.severity).toBe(ErrorSeverity.CRITICAL);
      expect(error.exitCode).toBe(7);
      expect(error.recovery).toEqual(['do the thing']);
    });

    test('unknown code falls back to default definition', () => {
      const error = new SinapseError('mystery', { code: 'SNPS_NOT_REGISTERED' });
      expect(error.code).toBe('SNPS_NOT_REGISTERED');
      expect(error.category).toBe(ErrorCategory.UNKNOWN);
    });

    test('toJSON delegates to serializeError', () => {
      const error = new SinapseError('boom', { code: 'SNPS_EXECUTION_FAILED' });
      const json = error.toJSON({ includeStack: false });
      expect(json.code).toBe('SNPS_EXECUTION_FAILED');
      expect(json.category).toBe(ErrorCategory.EXECUTION);
      expect(json.stack).toBe('[redacted]');
    });
  });

  describe('normalizeError', () => {
    test('envelopes a raw Error with code/category/severity', () => {
      const raw = new Error('disk gone');
      const normalized = normalizeError(raw, {
        code: 'SNPS_FILESYSTEM_ERROR',
      });

      expect(isSinapseError(normalized)).toBe(true);
      expect(normalized.code).toBe('SNPS_FILESYSTEM_ERROR');
      expect(normalized.category).toBe(ErrorCategory.FILESYSTEM);
      expect(normalized.severity).toBe(ErrorSeverity.ERROR);
      expect(normalized.message).toBe('disk gone');
      // Original error preserved as cause.
      expect(normalized.cause).toBe(raw);
      // Original error name captured in metadata.
      expect(normalized.metadata.originalError.name).toBe('Error');
    });

    test('raw Error with no overrides gets the default unknown code', () => {
      const normalized = normalizeError(new Error('???'));
      expect(isSinapseError(normalized)).toBe(true);
      expect(normalized.code).toBe(DEFAULT_ERROR_CODE);
      expect(normalized.category).toBe(ErrorCategory.UNKNOWN);
    });

    test('returns the same instance for an existing SinapseError with no overrides', () => {
      const original = new SinapseError('already typed', { code: 'SNPS_VALIDATION_FAILED' });
      expect(normalizeError(original)).toBe(original);
    });

    test('envelopes a non-Error value', () => {
      const normalized = normalizeError('just a string');
      expect(isSinapseError(normalized)).toBe(true);
      expect(normalized.message).toBe('just a string');
      expect(normalized.metadata.originalValue.type).toBe('string');
    });
  });

  describe('serializeError stack exposure', () => {
    test('does NOT include the real stack when NODE_ENV=production', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.SINAPSE_DEBUG;
      delete process.env.DEBUG_ERROR_STACKS;
      delete process.env.DEBUG_STACKS;

      const error = new SinapseError('prod boom', { code: 'SNPS_EXECUTION_FAILED' });
      const serialized = serializeError(error);

      expect(serialized.stack).toBe('[redacted]');
      expect(serialized.stack).not.toContain('errors.test.js');
      expect(shouldExposeErrorStack()).toBe(false);
    });

    test('production redaction can be overridden by explicit includeStack:true', () => {
      process.env.NODE_ENV = 'production';
      const error = new SinapseError('prod but explicit', { code: 'SNPS_EXECUTION_FAILED' });
      const serialized = serializeError(error, { includeStack: true });
      expect(serialized.stack).toEqual(error.stack);
      expect(typeof serialized.stack).toBe('string');
    });

    test('includes the stack in development when a debug flag is set', () => {
      process.env.NODE_ENV = 'development';
      process.env.SINAPSE_DEBUG = 'true';

      const error = new SinapseError('dev boom', { code: 'SNPS_EXECUTION_FAILED' });
      const serialized = serializeError(error);

      expect(serialized.stack).toEqual(error.stack);
      expect(serialized.stack).toContain('Error');
      expect(shouldExposeErrorStack()).toBe(true);
    });

    test('redacts the stack in development when no debug flag is set', () => {
      process.env.NODE_ENV = 'development';
      delete process.env.SINAPSE_DEBUG;
      delete process.env.DEBUG_ERROR_STACKS;
      delete process.env.DEBUG_STACKS;

      const error = new SinapseError('dev quiet', { code: 'SNPS_EXECUTION_FAILED' });
      const serialized = serializeError(error);
      expect(serialized.stack).toBe('[redacted]');
    });
  });

  describe('sanitizeValue circular safety', () => {
    test('does not throw on a self-referential object', () => {
      const cyclic = { name: 'root' };
      cyclic.self = cyclic;

      let result;
      expect(() => {
        result = sanitizeValue(cyclic);
      }).not.toThrow();

      expect(result.name).toBe('root');
      expect(result.self).toBe('[Circular]');
    });

    test('handles function, symbol, bigint, Map, Set, and nested cycles', () => {
      const inner = {};
      inner.loop = inner;

      const value = {
        fn: function noop() {},
        sym: Symbol('s'),
        big: 10n,
        map: new Map([['k', 'v']]),
        set: new Set([1, 2]),
        nested: inner,
      };

      let result;
      expect(() => {
        result = sanitizeValue(value);
      }).not.toThrow();

      expect(typeof result.fn).toBe('string');
      expect(typeof result.sym).toBe('string');
      expect(result.big).toBe('10');
      expect(result.map).toEqual([['k', 'v']]);
      expect(result.set).toEqual([1, 2]);
      expect(result.nested.loop).toBe('[Circular]');
    });

    test('serializeError tolerates a circular extra property on the error', () => {
      process.env.NODE_ENV = 'development';
      const error = new SinapseError('with cycle', { code: 'SNPS_EXECUTION_FAILED' });
      const ring = {};
      ring.self = ring;
      error.ring = ring;

      let serialized;
      expect(() => {
        serialized = serializeError(error, { includeStack: false });
      }).not.toThrow();

      expect(serialized.ring.self).toBe('[Circular]');
    });
  });

  describe('ErrorRegistry', () => {
    test('rejects an invalid (non SNPS-shaped) code', () => {
      const registry = new ErrorRegistry([]);
      expect(() => registry.register({ code: 'bad code!' })).toThrow(/Invalid SINAPSE error code/);
    });

    test('rejects duplicate codes', () => {
      const registry = new ErrorRegistry([]);
      registry.register({ code: 'SNPS_CUSTOM', category: ErrorCategory.EXECUTION });
      expect(() => registry.register({ code: 'SNPS_CUSTOM' })).toThrow(/Duplicate SINAPSE error code/);
    });

    test('lookup of an unregistered code flags it unregistered', () => {
      const def = defaultErrorRegistry.lookup('SNPS_TOTALLY_MADE_UP');
      expect(def.metadata.registry.registered).toBe(false);
    });
  });
});
