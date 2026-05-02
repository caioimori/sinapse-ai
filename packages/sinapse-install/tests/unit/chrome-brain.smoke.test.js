/**
 * Chrome Brain — smoke tests
 *
 * @audit Audit 2 P0 (Q1.2) — flagship capability shipped at 0% coverage.
 * This suite locks in the public contract so future regressions surface
 * without exercising real Chrome / filesystem mutations (those require an
 * integration env). Coverage of `detectChrome()` and `getChromeBrainStatus()`
 * is best-effort because both are environment-aware.
 */

'use strict';

const path = require('path');

const chromeBrain = require(
  path.join(__dirname, '..', '..', 'src', 'capabilities', 'chrome-brain'),
);

describe('chrome-brain — public contract (Audit 2 Q1.2 smoke)', () => {
  test('exports the documented surface', () => {
    expect(typeof chromeBrain.installChromeBrain).toBe('function');
    expect(typeof chromeBrain.uninstallChromeBrain).toBe('function');
    expect(typeof chromeBrain.getChromeBrainStatus).toBe('function');
    expect(typeof chromeBrain.detectChrome).toBe('function');
  });

  test('detectChrome returns the documented shape', () => {
    const result = chromeBrain.detectChrome();
    expect(result).toEqual(expect.objectContaining({
      found: expect.any(Boolean),
    }));
    // path is string|null, variant is string|null
    expect(['string', 'object']).toContain(typeof result.path);
    expect(['string', 'object']).toContain(typeof result.variant);
    if (result.path !== null) expect(typeof result.path).toBe('string');
    if (result.variant !== null) expect(typeof result.variant).toBe('string');
  });

  test('detectChrome is deterministic across calls', () => {
    const first = chromeBrain.detectChrome();
    const second = chromeBrain.detectChrome();
    expect(first).toEqual(second);
  });

  test('getChromeBrainStatus returns an object without throwing', () => {
    expect(() => chromeBrain.getChromeBrainStatus()).not.toThrow();
    const status = chromeBrain.getChromeBrainStatus();
    expect(typeof status).toBe('object');
    expect(status).not.toBeNull();
  });

  test('uninstallChromeBrain accepts options without throwing on dry path', () => {
    // Dry-run / status-only call should not perform destructive ops when
    // the install markers are absent. We do NOT pass `{ force: true }`.
    expect(() => chromeBrain.uninstallChromeBrain({ dryRun: true })).not.toThrow();
  });

  test('installChromeBrain function arity is callable (not invoked here)', () => {
    // Sanity-check arity without invoking (install is destructive). A
    // real install requires a Chrome binary + writes to ~/.claude/, which
    // is out of scope for unit-test smoke. Integration coverage is a
    // separate follow-up story.
    expect(chromeBrain.installChromeBrain.length).toBeGreaterThanOrEqual(0);
    expect(chromeBrain.installChromeBrain.length).toBeLessThanOrEqual(2);
  });
});
