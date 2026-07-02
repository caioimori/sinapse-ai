/**
 * Tests for SYNAPSE Context Bracket Tracker — model-aware config (v1.1.0)
 *
 * Proves:
 *  (a) With models.active = claude-fable-5 (1M window, same shape as the prior
 *      claude-opus-4-8 entry it replaced), estimateContextPercent uses the
 *      REAL 1M context window (not the legacy 200k default), so the same input
 *      reports a HIGHER % remaining (less depletion) than the old 200k math.
 *  (b) Graceful fallback to DEFAULTS (200k) when the models block / config file
 *      is absent — zero regression vs the pre-port pure-arithmetic behavior.
 *  (c) The registry carries claude-fable-5 + claude-sonnet-5 and `active`
 *      resolves to an existing entry (Story onda1-s3 — Fable 5 era registry).
 *
 * @module tests/synapse/context-tracker-model-aware
 * @story PORT #16a + #16b — context-tracker model-aware + models: in core-config
 * @story onda1-s3 — registry na era Fable 5 (claude-fable-5 active, claude-sonnet-5 added)
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');

const {
  estimateContextPercent,
  getModelConfig,
  resetModelConfigCache,
  DEFAULTS,
  XML_SAFETY_MULTIPLIER,
} = require('../../.sinapse-ai/core/synapse/context/context-tracker');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

/** Load and parse the real repo core-config.yaml (not a fixture). */
function loadRealConfig() {
  const configPath = path.join(REPO_ROOT, '.sinapse-ai', 'core-config.yaml');
  return yaml.load(fs.readFileSync(configPath, 'utf8'));
}

/** Build a temp project root containing a .sinapse-ai/core-config.yaml. */
function makeConfigRoot(yamlBody) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'snps-ct-'));
  fs.mkdirSync(path.join(root, '.sinapse-ai'), { recursive: true });
  if (yamlBody !== null) {
    fs.writeFileSync(path.join(root, '.sinapse-ai', 'core-config.yaml'), yamlBody, 'utf8');
  }
  return root;
}

afterEach(() => {
  resetModelConfigCache();
});

// =============================================================================
// (a) Active model claude-fable-5 → 1M context window
// =============================================================================

describe('model-aware: claude-fable-5 (active) uses 1M context window', () => {
  beforeEach(() => resetModelConfigCache());

  test('getModelConfig reads the real repo core-config.yaml (1M / 2000)', () => {
    // No basePath → resolves to the actual repo root (.sinapse-ai/core-config.yaml)
    const cfg = getModelConfig();
    expect(cfg.maxContext).toBe(1000000);
    expect(cfg.avgTokensPerPrompt).toBe(2000);
  });

  test('estimateContextPercent uses 1M, not the legacy 200k default', () => {
    // 50 prompts, model avg 2000, multiplier 1.2
    // used = 50 * 2000 * 1.2 = 120000
    // 1M:   100 - (120000 / 1000000 * 100) = 100 - 12 = 88
    const percentReal = estimateContextPercent(50);
    expect(percentReal).toBeCloseTo(88, 5);

    // Same prompt count under the OLD fixed-200k math (avg 2000) would be:
    // 100 - (120000 / 200000 * 100) = 100 - 60 = 40 → far more depleted.
    const oldStyle200k = 100 - (50 * 2000 * XML_SAFETY_MULTIPLIER / 200000 * 100);
    expect(oldStyle200k).toBeCloseTo(40, 5);

    // The whole point of the port: bigger window → less depletion for same input.
    expect(percentReal).toBeGreaterThan(oldStyle200k);
  });

  test('1M window keeps % HIGHER than 200k for an identical override input', () => {
    // Identical avgTokensPerPrompt override, only window differs.
    const at1M = estimateContextPercent(100, { maxContext: 1000000, avgTokensPerPrompt: 1500 });
    const at200k = estimateContextPercent(100, { maxContext: 200000, avgTokensPerPrompt: 1500 });
    expect(at1M).toBeGreaterThan(at200k);
    // 1M: 100 - (100*1500*1.2/1000000*100) = 100 - 18 = 82
    expect(at1M).toBeCloseTo(82, 5);
    // 200k: 100 - (100*1500*1.2/200000*100) = 100 - 90 = 10
    expect(at200k).toBeCloseTo(10, 5);
  });
});

// =============================================================================
// (c) Registry carries the Fable 5 era entries (Story onda1-s3)
// =============================================================================

describe('registry: Fable 5 era — active + sonnet-5 entry present', () => {
  test('active points to claude-fable-5, an existing registry entry', () => {
    const config = loadRealConfig();
    expect(config.models.active).toBe('claude-fable-5');
    expect(config.models.registry).toHaveProperty(config.models.active);
  });

  test('claude-fable-5 entry has a 1M context window', () => {
    const config = loadRealConfig();
    expect(config.models.registry['claude-fable-5'].contextWindow).toBe(1000000);
  });

  test('claude-sonnet-5 entry is present with a positive finite context window', () => {
    const config = loadRealConfig();
    const sonnet5 = config.models.registry['claude-sonnet-5'];
    expect(sonnet5).toBeDefined();
    expect(Number.isFinite(sonnet5.contextWindow)).toBe(true);
    expect(sonnet5.contextWindow).toBeGreaterThan(0);
  });
});

// =============================================================================
// (b) Graceful fallback to DEFAULTS (200k) — zero regression
// =============================================================================

describe('graceful fallback: missing models block / missing file → DEFAULTS', () => {
  beforeEach(() => resetModelConfigCache());

  test('config file present but NO models block → DEFAULTS (200k / 1500)', () => {
    const root = makeConfigRoot('markdownExploder: true\nproject:\n  type: TEST\n');
    const cfg = getModelConfig(root);
    expect(cfg.maxContext).toBe(DEFAULTS.maxContext);
    expect(cfg.maxContext).toBe(200000);
    expect(cfg.avgTokensPerPrompt).toBe(DEFAULTS.avgTokensPerPrompt);
    expect(cfg.avgTokensPerPrompt).toBe(1500);
  });

  test('config file entirely absent → DEFAULTS (200k / 1500)', () => {
    const root = makeConfigRoot(null); // .sinapse-ai dir exists, no yaml file
    const cfg = getModelConfig(root);
    expect(cfg.maxContext).toBe(200000);
    expect(cfg.avgTokensPerPrompt).toBe(1500);
  });

  test('active points to a missing registry entry → DEFAULTS (200k)', () => {
    const root = makeConfigRoot(
      'models:\n  active: ghost-model\n  registry:\n    real-model:\n      contextWindow: 999999\n',
    );
    const cfg = getModelConfig(root);
    expect(cfg.maxContext).toBe(200000);
  });

  test('fallback math matches the pre-port pure-arithmetic behavior exactly', () => {
    const root = makeConfigRoot('markdownExploder: true\n'); // no models → DEFAULTS
    const cfg = getModelConfig(root);
    // Recreate estimateContextPercent math with the fallback config (zero regression):
    // 30 prompts, 1500 avg, 1.2x, 200000 → 100 - (30*1500*1.2/200000*100) = 73
    const used = 30 * cfg.avgTokensPerPrompt * XML_SAFETY_MULTIPLIER;
    const percent = 100 - (used / cfg.maxContext * 100);
    expect(percent).toBeCloseTo(73, 5);
  });
});

// =============================================================================
// Cache behavior (per-root) + reset
// =============================================================================

describe('model config cache is keyed by root and resettable', () => {
  beforeEach(() => resetModelConfigCache());

  test('repeated calls for the same root return equal config', () => {
    const a = getModelConfig(REPO_ROOT);
    const b = getModelConfig(REPO_ROOT);
    expect(b).toEqual(a);
  });

  test('returned config is a copy — mutating it does not poison the cache', () => {
    const first = getModelConfig(REPO_ROOT);
    first.maxContext = 1;
    const second = getModelConfig(REPO_ROOT);
    expect(second.maxContext).not.toBe(1);
  });

  test('resetModelConfigCache(root) clears only that root', () => {
    const root = makeConfigRoot(
      'models:\n  active: m\n  registry:\n    m:\n      contextWindow: 500000\n      avgTokensPerPrompt: 1234\n',
    );
    expect(getModelConfig(root).maxContext).toBe(500000);
    // Overwrite the file, but cache should still serve the old value...
    fs.writeFileSync(
      path.join(root, '.sinapse-ai', 'core-config.yaml'),
      'models:\n  active: m\n  registry:\n    m:\n      contextWindow: 300000\n',
      'utf8',
    );
    expect(getModelConfig(root).maxContext).toBe(500000); // cached
    resetModelConfigCache(root);
    expect(getModelConfig(root).maxContext).toBe(300000); // re-read
  });
});
