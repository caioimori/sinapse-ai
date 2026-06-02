/**
 * Recovery Handler — Sanitization Tests (PORT #14)
 *
 * Proves that getAttemptHistory() (via _cloneAttempt → sanitizeValue from
 * core/errors) does NOT throw JSON.stringify on attempt objects that contain:
 *   - Circular references
 *   - Function values
 *   - Symbol values
 *   - Map instances
 *   - Set instances
 *   - BigInt values
 *
 * @author @developer
 * @version 1.0.0
 */

const {
  RecoveryHandler,
} = require('../../.sinapse-ai/core/orchestration/recovery-handler');

describe('RecoveryHandler — sanitization (Port #14)', () => {
  let handler;

  beforeEach(() => {
    handler = new RecoveryHandler({
      projectRoot: process.cwd(),
      storyId: 'sanitize-test',
      maxRetries: 5,
      autoEscalate: false,
    });
  });

  // ─── helpers ─────────────────────────────────────────────────────────────

  /**
   * Inject a synthetic attempt record directly into the internal state,
   * bypassing handleEpicFailure so we can put arbitrary values in context.
   */
  function injectAttempt(epicNum, contextOverride = {}) {
    if (!handler.attempts[epicNum]) {
      handler.attempts[epicNum] = [];
    }
    handler.attempts[epicNum].push({
      number: handler.attempts[epicNum].length + 1,
      timestamp: new Date().toISOString(),
      error: 'synthetic error',
      approach: 'default',
      epicNum,
      context: contextOverride,
    });
  }

  // ─── circular reference ───────────────────────────────────────────────────

  test('circular reference in context does not throw JSON.stringify', () => {
    const circular = { name: 'ctx' };
    circular.self = circular; // circular!

    injectAttempt(1, circular);

    const history = handler.getAttemptHistory();
    expect(() => JSON.stringify(history)).not.toThrow();
  });

  test('circular reference is replaced with "[Circular]"', () => {
    const circular = { name: 'ctx' };
    circular.self = circular;

    injectAttempt(2, circular);

    const history = handler.getAttemptHistory();
    const attempt = history['2'][0];
    expect(attempt.context.self).toBe('[Circular]');
  });

  // ─── function ─────────────────────────────────────────────────────────────

  test('function value in context does not throw JSON.stringify', () => {
    injectAttempt(3, { handler: () => 'noop', name: 'ctx' });

    const history = handler.getAttemptHistory();
    expect(() => JSON.stringify(history)).not.toThrow();
  });

  test('function value is converted to its string representation', () => {
    const fn = () => 'noop';
    injectAttempt(4, { fn });

    const history = handler.getAttemptHistory();
    const attempt = history['4'][0];
    expect(typeof attempt.context.fn).toBe('string');
  });

  // ─── symbol ───────────────────────────────────────────────────────────────

  test('symbol value in context does not throw JSON.stringify', () => {
    injectAttempt(5, { sym: Symbol('test') });

    const history = handler.getAttemptHistory();
    expect(() => JSON.stringify(history)).not.toThrow();
  });

  test('symbol value is converted to its string representation', () => {
    injectAttempt(6, { sym: Symbol('mySymbol') });

    const history = handler.getAttemptHistory();
    const attempt = history['6'][0];
    expect(typeof attempt.context.sym).toBe('string');
    expect(attempt.context.sym).toContain('mySymbol');
  });

  // ─── Map ──────────────────────────────────────────────────────────────────

  test('Map value in context does not throw JSON.stringify', () => {
    const map = new Map([['key', 'value'], ['num', 42]]);
    injectAttempt(7, { map });

    const history = handler.getAttemptHistory();
    expect(() => JSON.stringify(history)).not.toThrow();
  });

  test('Map value is converted to an array of entries', () => {
    const map = new Map([['a', 1]]);
    injectAttempt(8, { map });

    const history = handler.getAttemptHistory();
    const attempt = history['8'][0];
    expect(Array.isArray(attempt.context.map)).toBe(true);
  });

  // ─── Set ──────────────────────────────────────────────────────────────────

  test('Set value in context does not throw JSON.stringify', () => {
    const set = new Set([1, 2, 3]);
    injectAttempt(9, { set });

    const history = handler.getAttemptHistory();
    expect(() => JSON.stringify(history)).not.toThrow();
  });

  test('Set value is converted to an array of its values', () => {
    const set = new Set(['x', 'y']);
    injectAttempt(10, { set });

    const history = handler.getAttemptHistory();
    const attempt = history['10'][0];
    expect(Array.isArray(attempt.context.set)).toBe(true);
    expect(attempt.context.set).toContain('x');
    expect(attempt.context.set).toContain('y');
  });

  // ─── BigInt ───────────────────────────────────────────────────────────────

  test('BigInt value in context does not throw JSON.stringify', () => {
    injectAttempt(11, { big: BigInt(9007199254740993) });

    const history = handler.getAttemptHistory();
    expect(() => JSON.stringify(history)).not.toThrow();
  });

  test('BigInt value is converted to a string', () => {
    injectAttempt(12, { big: BigInt(42) });

    const history = handler.getAttemptHistory();
    const attempt = history['12'][0];
    expect(attempt.context.big).toBe('42');
  });

  // ─── compound: circular + function + symbol in one attempt ────────────────

  test('compound hostile context (circular + function + symbol) survives JSON.stringify', () => {
    const ctx = { label: 'compound' };
    ctx.loop = ctx; // circular
    ctx.fn = function doSomething() {}; // function
    ctx.sym = Symbol('s'); // symbol
    ctx.map = new Map([['k', 'v']]);
    ctx.set = new Set([1, 2]);

    injectAttempt(13, ctx);

    const history = handler.getAttemptHistory();
    expect(() => JSON.stringify(history)).not.toThrow();

    const attempt = history['13'][0];
    expect(attempt.context.loop).toBe('[Circular]');
    expect(typeof attempt.context.fn).toBe('string');
    expect(typeof attempt.context.sym).toBe('string');
    expect(Array.isArray(attempt.context.map)).toBe(true);
    expect(Array.isArray(attempt.context.set)).toBe(true);
  });

  // ─── _assertValidEpicNum guard ────────────────────────────────────────────

  test('getAttemptCount throws TypeError for non-integer epicNum', () => {
    expect(() => handler.getAttemptCount('bad')).toThrow(TypeError);
    expect(() => handler.getAttemptCount(-1)).toThrow(TypeError);
    expect(() => handler.getAttemptCount(1.5)).toThrow(TypeError);
  });

  test('canRetry throws TypeError for non-integer epicNum', () => {
    expect(() => handler.canRetry(null)).toThrow(TypeError);
  });

  test('resetAttempts throws TypeError for non-integer epicNum', () => {
    expect(() => handler.resetAttempts('foo')).toThrow(TypeError);
  });

  test('getEpicLogs throws TypeError for non-integer epicNum', () => {
    expect(() => handler.getEpicLogs(undefined)).toThrow(TypeError);
  });

  // ─── internal state is immutable from callers ─────────────────────────────

  test('mutating getAttemptHistory result does not affect internal state', () => {
    injectAttempt(20, { x: 1 });

    const history = handler.getAttemptHistory();
    history['20'][0].context.x = 999;

    // internal attempt context should be unchanged
    expect(handler.attempts[20][0].context.x).toBe(1);
  });
});
