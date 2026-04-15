/**
 * Tests for .sinapse-ai/core/telemetry/index.js — Story C.1
 *
 * Focus areas (per Story C.1 ACs):
 *   AC 4 — exported API: enable/disable/isEnabled/send
 *   AC 5 — disabled by default, send() is a no-op when disabled
 *   AC 6 — enable() persists to ~/.sinapse/config.json, isEnabled() returns true
 *   AC 7 — SINAPSE_TELEMETRY=1 env var overrides config file
 *   AC 8 — payload shape is { category, platform, version, timestamp } only
 *   AC 9 — send() logs at debug level and does NOT make any HTTP request
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

// Snapshot & clean env vars that influence telemetry.isEnabled()
const TELEMETRY_ENV = ['SINAPSE_TELEMETRY'];
function snapshotEnv() {
  const snap = {};
  for (const k of TELEMETRY_ENV) snap[k] = process.env[k];
  return snap;
}
function restoreEnv(snap) {
  for (const k of TELEMETRY_ENV) {
    if (snap[k] === undefined) delete process.env[k];
    else process.env[k] = snap[k];
  }
}

describe('telemetry (Story C.1)', () => {
  let tmpHome;
  let homedirSpy;
  let telemetry;
  let envSnap;

  beforeEach(() => {
    envSnap = snapshotEnv();
    for (const k of TELEMETRY_ENV) delete process.env[k];

    // Isolate from the dev's real ~/.sinapse/config.json by redirecting HOME.
    tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-telemetry-'));
    homedirSpy = jest.spyOn(os, 'homedir').mockReturnValue(tmpHome);

    // Force a fresh require so internal caches are rebuilt under the mocked HOME.
    jest.resetModules();
    telemetry = require('../../.sinapse-ai/core/telemetry');
    telemetry._reset();
  });

  afterEach(() => {
    restoreEnv(envSnap);
    if (homedirSpy) homedirSpy.mockRestore();
    try { fs.rmSync(tmpHome, { recursive: true, force: true }); } catch { /* ignore */ }
  });

  // ─── AC 4: exported API ───────────────────────────────────────────────────
  describe('AC 4 — exported API', () => {
    test('exports enable, disable, isEnabled, send', () => {
      expect(typeof telemetry.enable).toBe('function');
      expect(typeof telemetry.disable).toBe('function');
      expect(typeof telemetry.isEnabled).toBe('function');
      expect(typeof telemetry.send).toBe('function');
    });

    test('exports FAILURE_CATEGORIES as a frozen list', () => {
      expect(Array.isArray(telemetry.FAILURE_CATEGORIES)).toBe(true);
      expect(telemetry.FAILURE_CATEGORIES).toContain('doctor-fail');
      expect(telemetry.FAILURE_CATEGORIES).toContain('sync-ide-fail');
      expect(telemetry.FAILURE_CATEGORIES).toContain('unknown');
      expect(Object.isFrozen(telemetry.FAILURE_CATEGORIES)).toBe(true);
    });
  });

  // ─── AC 5: disabled by default ────────────────────────────────────────────
  describe('AC 5 — disabled by default', () => {
    test('isEnabled() returns false on a clean HOME with no config file', () => {
      expect(telemetry.isEnabled()).toBe(false);
    });

    test('send() returns null and is a no-op when disabled', () => {
      const debugSpy = jest.fn();
      const result = telemetry.send({ category: 'doctor-fail' }, { logger: { debug: debugSpy } });
      expect(result).toBe(null);
      expect(debugSpy).not.toHaveBeenCalled();
    });

    test('send() makes NO network request (stub — no http module loaded into payload path)', () => {
      // Spy on http/https to assert the stub never touches them when disabled.
      const http = require('http');
      const https = require('https');
      const httpReq = jest.spyOn(http, 'request');
      const httpsReq = jest.spyOn(https, 'request');
      try {
        telemetry.send({ category: 'doctor-fail' });
        expect(httpReq).not.toHaveBeenCalled();
        expect(httpsReq).not.toHaveBeenCalled();
      } finally {
        httpReq.mockRestore();
        httpsReq.mockRestore();
      }
    });
  });

  // ─── AC 6: opt-in via CLI (enable/disable persists) ──────────────────────
  describe('AC 6 — enable() persists opt-in', () => {
    test('enable() writes telemetry=true to ~/.sinapse/config.json and flips isEnabled()', () => {
      expect(telemetry.isEnabled()).toBe(false);

      const ok = telemetry.enable();
      expect(ok).toBe(true);

      // File exists with the expected content
      const cfgPath = path.join(tmpHome, '.sinapse', 'config.json');
      expect(fs.existsSync(cfgPath)).toBe(true);
      const parsed = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      expect(parsed.telemetry).toBe(true);

      // And isEnabled() now reflects it
      expect(telemetry.isEnabled()).toBe(true);
    });

    test('disable() flips telemetry=false', () => {
      telemetry.enable();
      expect(telemetry.isEnabled()).toBe(true);

      const ok = telemetry.disable();
      expect(ok).toBe(true);
      expect(telemetry.isEnabled()).toBe(false);
    });

    test('enable() preserves other config keys (does not clobber)', () => {
      const cfgDir = path.join(tmpHome, '.sinapse');
      fs.mkdirSync(cfgDir, { recursive: true });
      fs.writeFileSync(
        path.join(cfgDir, 'config.json'),
        JSON.stringify({ someOther: 'value', nested: { a: 1 } }, null, 2),
        'utf8',
      );

      telemetry.enable();
      const parsed = JSON.parse(fs.readFileSync(path.join(cfgDir, 'config.json'), 'utf8'));
      expect(parsed.telemetry).toBe(true);
      expect(parsed.someOther).toBe('value');
      expect(parsed.nested).toEqual({ a: 1 });
    });
  });

  // ─── AC 7: env var override ───────────────────────────────────────────────
  describe('AC 7 — SINAPSE_TELEMETRY env var overrides config', () => {
    test('SINAPSE_TELEMETRY=1 → isEnabled() true even without config file', () => {
      process.env.SINAPSE_TELEMETRY = '1';
      expect(telemetry.isEnabled()).toBe(true);
    });

    test('SINAPSE_TELEMETRY=true → isEnabled() true', () => {
      process.env.SINAPSE_TELEMETRY = 'true';
      expect(telemetry.isEnabled()).toBe(true);
    });

    test('SINAPSE_TELEMETRY=0 forces off even if config says telemetry=true', () => {
      telemetry.enable(); // writes telemetry=true
      expect(telemetry.isEnabled()).toBe(true);

      process.env.SINAPSE_TELEMETRY = '0';
      expect(telemetry.isEnabled()).toBe(false);
    });

    test('unrelated env value falls through to config file', () => {
      process.env.SINAPSE_TELEMETRY = 'maybe';
      expect(telemetry.isEnabled()).toBe(false); // config is empty

      telemetry.enable();
      expect(telemetry.isEnabled()).toBe(true); // now config wins
    });
  });

  // ─── AC 8: anonymized payload shape ──────────────────────────────────────
  describe('AC 8 — anonymized payload', () => {
    test('buildPayload returns exactly { category, platform, version, timestamp }', () => {
      const payload = telemetry.buildPayload('doctor-fail');
      expect(Object.keys(payload).sort()).toEqual(
        ['category', 'platform', 'timestamp', 'version'],
      );
    });

    test('platform is always one of win32|darwin|linux', () => {
      const p = telemetry.normalizePlatform();
      expect(['win32', 'darwin', 'linux']).toContain(p);
    });

    test('unknown category is coerced to "unknown" (no sprawl)', () => {
      const payload = telemetry.buildPayload('completely-invented-category');
      expect(payload.category).toBe('unknown');
    });

    test('all predefined categories round-trip through buildPayload', () => {
      for (const cat of telemetry.FAILURE_CATEGORIES) {
        const payload = telemetry.buildPayload(cat);
        expect(payload.category).toBe(cat);
      }
    });

    test('payload contains NO user paths, NO usernames, NO PII', () => {
      const payload = telemetry.buildPayload('doctor-fail');
      const json = JSON.stringify(payload);
      // The payload is small and strictly typed — no place for PII to hide.
      expect(json).not.toMatch(/[A-Za-z]:\\/); // Windows path
      expect(json).not.toMatch(/\/home\//);    // Linux home path
      expect(json).not.toMatch(/\/Users\//);   // macOS home path
      expect(json).not.toMatch(/C:\\Users/);
    });

    test('timestamp is ISO 8601', () => {
      const payload = telemetry.buildPayload('doctor-fail');
      expect(payload.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(() => new Date(payload.timestamp).toISOString()).not.toThrow();
    });

    test('version is a non-empty string', () => {
      const payload = telemetry.buildPayload('doctor-fail');
      expect(typeof payload.version).toBe('string');
      expect(payload.version.length).toBeGreaterThan(0);
    });
  });

  // ─── AC 9: send logs at debug, no HTTP ───────────────────────────────────
  describe('AC 9 — send() logs at debug, no HTTP', () => {
    test('send() when enabled logs at debug and returns the payload', () => {
      telemetry.enable();
      const debugSpy = jest.fn();
      const result = telemetry.send({ category: 'doctor-fail' }, { logger: { debug: debugSpy } });

      expect(result).not.toBeNull();
      expect(result.category).toBe('doctor-fail');
      expect(debugSpy).toHaveBeenCalledTimes(1);
      const firstArg = debugSpy.mock.calls[0][0];
      expect(firstArg).toContain('[telemetry stub]');
    });

    test('send() when enabled does NOT make any http/https request', () => {
      telemetry.enable();
      const http = require('http');
      const https = require('https');
      const httpReq = jest.spyOn(http, 'request');
      const httpsReq = jest.spyOn(https, 'request');
      try {
        telemetry.send({ category: 'doctor-fail' }, { logger: { debug: () => {} } });
        expect(httpReq).not.toHaveBeenCalled();
        expect(httpsReq).not.toHaveBeenCalled();
      } finally {
        httpReq.mockRestore();
        httpsReq.mockRestore();
      }
    });

    test('send() never throws even if logger.debug throws', () => {
      telemetry.enable();
      const throwingLogger = { debug: () => { throw new Error('boom'); } };
      expect(() => telemetry.send({ category: 'doctor-fail' }, { logger: throwingLogger })).not.toThrow();
    });
  });

  // ─── Corrupt / missing config handling ───────────────────────────────────
  describe('config file robustness', () => {
    test('corrupt config.json is treated as no config (isEnabled → false)', () => {
      const cfgDir = path.join(tmpHome, '.sinapse');
      fs.mkdirSync(cfgDir, { recursive: true });
      fs.writeFileSync(path.join(cfgDir, 'config.json'), '{not valid json', 'utf8');

      expect(telemetry.isEnabled()).toBe(false);
    });

    test('missing ~/.sinapse directory does not crash enable()', () => {
      // tmpHome exists but .sinapse does not — enable() must create it.
      const ok = telemetry.enable();
      expect(ok).toBe(true);
      expect(fs.existsSync(path.join(tmpHome, '.sinapse', 'config.json'))).toBe(true);
    });
  });
});
