/**
 * Grounding config util tests.
 *
 * @story 10.47 — read/write/upsert semantics for ~/.claude/sinapse-ai-config.yaml
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const groundingConfig = require(
  path.join(__dirname, '..', '..', 'packages', 'installer', 'src', 'wizard', 'grounding-config'),
);

const {
  defaultConfig,
  readGroundingConfig,
  writeGroundingConfig,
  buildGroundingFromAnswers,
  pendingGroundingSections,
  isGroundingEnabled,
  SCHEMA_VERSION,
} = groundingConfig;

let tmpFile;

beforeEach(() => {
  tmpFile = path.join(os.tmpdir(), `sinapse-grounding-${Date.now()}-${Math.random().toString(36).slice(2)}.yaml`);
});

afterEach(() => {
  try { fs.rmSync(tmpFile, { force: true }); } catch { /* ignore */ }
});

describe('defaultConfig', () => {
  test('returns versioned skeleton with all sections disabled', () => {
    const cfg = defaultConfig();
    expect(cfg.version).toBe(SCHEMA_VERSION);
    expect(cfg.grounding.vault.enabled).toBe(false);
    expect(cfg.grounding.designSystem.enabled).toBe(false);
    expect(cfg.grounding.brand.enabled).toBe(false);
  });
});

describe('readGroundingConfig', () => {
  test('returns null when file does not exist', () => {
    expect(readGroundingConfig(tmpFile)).toBeNull();
  });

  test('returns null on invalid YAML (does not throw)', () => {
    fs.writeFileSync(tmpFile, '::: not yaml :::');
    expect(readGroundingConfig(tmpFile)).toBeNull();
  });

  test('round-trips a valid config', () => {
    writeGroundingConfig(defaultConfig(), tmpFile);
    const read = readGroundingConfig(tmpFile);
    expect(read.version).toBe(SCHEMA_VERSION);
    expect(read.grounding.vault.enabled).toBe(false);
  });
});

describe('buildGroundingFromAnswers', () => {
  test('empty answers leave all sections disabled', () => {
    const cfg = buildGroundingFromAnswers({});
    expect(cfg.grounding.vault.enabled).toBe(false);
    expect(cfg.grounding.designSystem.enabled).toBe(false);
    expect(cfg.grounding.brand.enabled).toBe(false);
  });

  test('vault path enables vault section', () => {
    const cfg = buildGroundingFromAnswers({ vaultPath: '/some/vault' });
    expect(cfg.grounding.vault.enabled).toBe(true);
    expect(cfg.grounding.vault.path).toBe('/some/vault');
  });

  test('designSystem path enables DS section', () => {
    const cfg = buildGroundingFromAnswers({ designSystemPath: '/some/ds' });
    expect(cfg.grounding.designSystem.enabled).toBe(true);
    expect(cfg.grounding.designSystem.rootPath).toBe('/some/ds');
  });

  test('brand path enables brand section', () => {
    const cfg = buildGroundingFromAnswers({ brandbookPath: '/some/brand' });
    expect(cfg.grounding.brand.enabled).toBe(true);
    expect(cfg.grounding.brand.brandbookPath).toBe('/some/brand');
  });

  test('whitespace-only answer is treated as empty (no enable)', () => {
    const cfg = buildGroundingFromAnswers({ vaultPath: '   ' });
    expect(cfg.grounding.vault.enabled).toBe(false);
  });

  test('preserves existing config when merging partial answers', () => {
    const existing = buildGroundingFromAnswers({ vaultPath: '/old/vault' });
    const merged = buildGroundingFromAnswers({ brandbookPath: '/new/brand' }, existing);
    expect(merged.grounding.vault.enabled).toBe(true);
    expect(merged.grounding.vault.path).toBe('/old/vault');
    expect(merged.grounding.brand.enabled).toBe(true);
    expect(merged.grounding.brand.brandbookPath).toBe('/new/brand');
  });

  test('always stamps current schema version', () => {
    const oldShape = { version: '0', grounding: { vault: { enabled: true, path: '/x' } } };
    const cfg = buildGroundingFromAnswers({}, oldShape);
    expect(cfg.version).toBe(SCHEMA_VERSION);
  });
});

describe('pendingGroundingSections', () => {
  test('all sections pending when config is null', () => {
    const pending = pendingGroundingSections(null);
    expect(pending).toEqual({ askVault: true, askDesignSystem: true, askBrand: true });
  });

  test('skips already-enabled sections', () => {
    const cfg = buildGroundingFromAnswers({
      vaultPath: '/v',
      designSystemPath: '/ds',
    });
    const pending = pendingGroundingSections(cfg);
    expect(pending.askVault).toBe(false);
    expect(pending.askDesignSystem).toBe(false);
    expect(pending.askBrand).toBe(true);
  });
});

describe('isGroundingEnabled', () => {
  test('returns false when config absent', () => {
    expect(isGroundingEnabled('vault', tmpFile)).toBe(false);
  });

  test('returns true after enabling section', () => {
    const cfg = buildGroundingFromAnswers({ vaultPath: '/v' });
    writeGroundingConfig(cfg, tmpFile);
    expect(isGroundingEnabled('vault', tmpFile)).toBe(true);
    expect(isGroundingEnabled('designSystem', tmpFile)).toBe(false);
  });
});

describe('writeGroundingConfig', () => {
  test('writes a header comment block before the YAML body', () => {
    writeGroundingConfig(defaultConfig(), tmpFile);
    const content = fs.readFileSync(tmpFile, 'utf8');
    expect(content.split('\n')[0]).toMatch(/^# SINAPSE-AI/);
    expect(content).toContain('Story 10.47');
  });

  test('creates parent directory if missing', () => {
    const nested = path.join(os.tmpdir(), `sinapse-grounding-nested-${Date.now()}`, 'sub', 'cfg.yaml');
    writeGroundingConfig(defaultConfig(), nested);
    expect(fs.existsSync(nested)).toBe(true);
    fs.rmSync(path.dirname(path.dirname(nested)), { recursive: true, force: true });
  });
});
