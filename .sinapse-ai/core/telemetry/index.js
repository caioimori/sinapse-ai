'use strict';

/**
 * SINAPSE Telemetry — STUB (opt-in, disabled by default)
 * @story C.1 — Exit Codes, Auto-Doctor & Opt-in Telemetry
 *
 * IMPORTANT (contributors):
 *   This is a STUB implementation. It does NOT make real network requests.
 *   Calling `send(event)` when telemetry is enabled logs the payload at debug
 *   level and stops there.
 *
 *   TODO(follow-up-story): wire a real HTTPS endpoint once the privacy policy
 *   at docs/TELEMETRY.md has been reviewed by legal and the endpoint URL is
 *   confirmed. Until then, NO real data leaves the user's machine.
 *
 * Contract (see Story C.1 ACs):
 *   AC 4 — Exported methods: enable(), disable(), isEnabled(), send(event).
 *   AC 5 — Disabled by default. `send()` is a no-op when disabled.
 *   AC 6 — `enable()` persists a flag to ~/.sinapse/config.json. CLI wrapper
 *          shows the confirmation message to the user.
 *   AC 7 — `SINAPSE_TELEMETRY=1` env var overrides the config file.
 *   AC 8 — Payload is anonymized: only { category, platform, version, timestamp }.
 *          NO user paths, NO usernames, NO file names, NO PII.
 *   AC 9 — send() logs at debug level only. No HTTP.
 *
 * Zero external deps (pure Node stdlib). Safe to require() anywhere.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

// ─── Config file location ────────────────────────────────────────────────────
// Stored under ~/.sinapse/config.json so it is per-user (not per-project) and
// does not pollute the project directory.

function sinapseHome() {
  return path.join(os.homedir(), '.sinapse');
}

function configPath() {
  return path.join(sinapseHome(), 'config.json');
}

// ─── Predefined failure categories (AC 8) ────────────────────────────────────
// Adding a new category? Add it here AND in docs/TELEMETRY.md so the privacy
// policy stays in sync with the code.

const FAILURE_CATEGORIES = Object.freeze([
  'doctor-fail',
  'sync-ide-fail',
  'permission-error',
  'runtime-dir-fail',
  'unknown',
]);

// ─── Allowed platforms (AC 8) ────────────────────────────────────────────────

const ALLOWED_PLATFORMS = Object.freeze(['win32', 'darwin', 'linux']);

/**
 * Normalize process.platform to one of the allowed values. Any exotic platform
 * (aix, freebsd, openbsd, sunos, ...) is coerced to 'linux' to avoid leaking a
 * fingerprint. NEVER returns the raw platform string.
 * @returns {'win32'|'darwin'|'linux'}
 */
function normalizePlatform() {
  const p = process.platform;
  if (p === 'win32' || p === 'darwin' || p === 'linux') return p;
  return 'linux';
}

// ─── Version reading ─────────────────────────────────────────────────────────

let _cachedVersion = null;
function readVersion() {
  if (_cachedVersion) return _cachedVersion;
  try {
    const pkg = require(path.resolve(__dirname, '..', '..', '..', 'package.json'));
    _cachedVersion = pkg && pkg.version ? String(pkg.version) : 'unknown';
  } catch {
    _cachedVersion = 'unknown';
  }
  return _cachedVersion;
}

// ─── Config file read / write ────────────────────────────────────────────────
// All filesystem calls are fail-safe: a corrupt or missing config.json MUST
// NEVER crash the caller. Telemetry is best-effort.

function readConfig() {
  try {
    const p = configPath();
    if (!fs.existsSync(p)) return {};
    const raw = fs.readFileSync(p, 'utf8');
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === 'object') ? parsed : {};
  } catch {
    return {};
  }
}

function writeConfig(cfg) {
  try {
    const home = sinapseHome();
    if (!fs.existsSync(home)) {
      fs.mkdirSync(home, { recursive: true });
    }
    fs.writeFileSync(configPath(), `${JSON.stringify(cfg, null, 2)}\n`, 'utf8');
    return true;
  } catch {
    return false;
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * AC 5 + AC 7 — Is telemetry currently enabled?
 *
 * Resolution order (highest priority first):
 *   1. SINAPSE_TELEMETRY=1 env var → TRUE (overrides config file)
 *   2. SINAPSE_TELEMETRY=0 env var → FALSE (explicit opt-out wins too)
 *   3. ~/.sinapse/config.json { "telemetry": true|false }
 *   4. Default → FALSE
 *
 * @returns {boolean}
 */
function isEnabled() {
  const envVar = process.env.SINAPSE_TELEMETRY;
  if (envVar === '1' || envVar === 'true') return true;
  if (envVar === '0' || envVar === 'false') return false;
  const cfg = readConfig();
  return cfg.telemetry === true;
}

/**
 * AC 6 — Persist opt-in to config file. Returns true on success.
 * Does NOT print any message (CLI layer owns the user-facing copy).
 * @returns {boolean}
 */
function enable() {
  const cfg = readConfig();
  cfg.telemetry = true;
  return writeConfig(cfg);
}

/**
 * Persist opt-out to config file. Returns true on success.
 * @returns {boolean}
 */
function disable() {
  const cfg = readConfig();
  cfg.telemetry = false;
  return writeConfig(cfg);
}

/**
 * AC 8 — Build an anonymized payload from a category.
 * Only { category, platform, version, timestamp } is included.
 * Unknown categories are coerced to 'unknown' to prevent category-sprawl and
 * to keep the schema predictable for the (future) real endpoint.
 *
 * @param {string} category
 * @returns {{category:string,platform:'win32'|'darwin'|'linux',version:string,timestamp:string}}
 */
function buildPayload(category) {
  const safeCategory = FAILURE_CATEGORIES.includes(category) ? category : 'unknown';
  return {
    category: safeCategory,
    platform: normalizePlatform(),
    version: readVersion(),
    timestamp: new Date().toISOString(),
  };
}

/**
 * AC 5 + AC 9 — Send a telemetry event.
 *
 * When disabled → no-op (no network call, no log).
 * When enabled  → build anonymized payload, log at debug level, and return it.
 *
 * NOTE: This stub does NOT make any HTTP request. A follow-up story will add
 * the real endpoint after legal review of docs/TELEMETRY.md.
 *
 * @param {{category?: string}} event
 * @param {{logger?: object}} [opts] — inject a logger for tests; defaults to
 *   the shared SINAPSE logger if available, otherwise console.
 * @returns {null|object} the payload that would have been sent, or null if disabled
 */
function send(event = {}, opts = {}) {
  if (!isEnabled()) return null;
  const payload = buildPayload(event && event.category);
  const logger = opts.logger || _getDefaultLogger();
  try {
    if (logger && typeof logger.debug === 'function') {
      logger.debug('[telemetry stub]', JSON.stringify(payload));
    }
  } catch {
    /* never throw from telemetry */
  }
  // TODO(follow-up-story): POST payload to real endpoint here.
  return payload;
}

// ─── Default logger resolution ──────────────────────────────────────────────
// Try the shared SINAPSE logger first (so telemetry respects --debug/--quiet),
// but fall back to a console shim if it's unavailable (e.g. during very early
// bootstrap or in isolated tests).

let _defaultLogger = null;
function _getDefaultLogger() {
  if (_defaultLogger) return _defaultLogger;
  try {
    const { getLogger } = require('../logger');
    _defaultLogger = getLogger();
  } catch {
    _defaultLogger = {
      debug: (...args) => { try { console.debug(...args); } catch { /* ignore */ } },
    };
  }
  return _defaultLogger;
}

// Test helper — reset internal caches between tests. Not part of the public
// contract; do not use in production code.
function _reset() {
  _cachedVersion = null;
  _defaultLogger = null;
}

module.exports = {
  // Public API (AC 4)
  enable,
  disable,
  isEnabled,
  send,
  // Helpers exposed for tests + CLI command
  buildPayload,
  normalizePlatform,
  readVersion,
  configPath,
  sinapseHome,
  FAILURE_CATEGORIES,
  ALLOWED_PLATFORMS,
  _reset,
};
