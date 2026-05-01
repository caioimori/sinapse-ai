/**
 * Grounding Config — read/write for ~/.claude/sinapse-ai-config.yaml
 *
 * @story 10.47 — Generalize grounding semantico (BYO-vault/DS/brand)
 *
 * The shipped grounding hooks (vault / design-system / brand) read this
 * single YAML file as their source of truth. Absence of the file or
 * `enabled: false` in any section means the corresponding hook is a no-op
 * (no warnings, no errors — just silence).
 *
 * Schema versioned via top-level `version: "1"` so future migrations have
 * a clean upgrade path.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');

const CONFIG_DIR = path.join(os.homedir(), '.claude');
const CONFIG_PATH = path.join(CONFIG_DIR, 'sinapse-ai-config.yaml');

const SCHEMA_VERSION = '1';

function defaultConfig() {
  return {
    version: SCHEMA_VERSION,
    grounding: {
      vault: { enabled: false, path: '', domains: [] },
      designSystem: { enabled: false, profileName: '', rootPath: '' },
      brand: { enabled: false, profileName: '', brandbookPath: '' },
    },
  };
}

function readGroundingConfig(configPath = CONFIG_PATH) {
  try {
    if (!fs.existsSync(configPath)) return null;
    const raw = fs.readFileSync(configPath, 'utf8');
    const parsed = yaml.load(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeGroundingConfig(config, configPath = CONFIG_PATH) {
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  const dump = yaml.dump(config, { lineWidth: 100, noRefs: true });
  const header =
    '# SINAPSE-AI grounding configuration (Story 10.47).\n' +
    '# Created by `npx sinapse-ai install`. Edit safely or re-run with --reconfigure.\n' +
    '# Empty / `enabled: false` sections = the matching shipped hook is a no-op.\n';
  fs.writeFileSync(configPath, header + dump);
}

/**
 * Build a grounding config from wizard answers. Empty answers leave the
 * section disabled. Non-empty paths flip `enabled: true` for that section.
 */
function buildGroundingFromAnswers(answers = {}, existingConfig = null) {
  const base = existingConfig && existingConfig.grounding
    ? JSON.parse(JSON.stringify(existingConfig))
    : defaultConfig();

  base.version = SCHEMA_VERSION;
  base.grounding = base.grounding || defaultConfig().grounding;

  const vaultPath = (answers.vaultPath || '').trim();
  if (vaultPath) {
    base.grounding.vault = {
      enabled: true,
      path: vaultPath,
      domains: base.grounding.vault?.domains || [],
    };
  }

  const dsPath = (answers.designSystemPath || '').trim();
  if (dsPath) {
    base.grounding.designSystem = {
      enabled: true,
      profileName: base.grounding.designSystem?.profileName || '',
      rootPath: dsPath,
    };
  }

  const brandPath = (answers.brandbookPath || '').trim();
  if (brandPath) {
    base.grounding.brand = {
      enabled: true,
      profileName: base.grounding.brand?.profileName || '',
      brandbookPath: brandPath,
    };
  }

  return base;
}

/**
 * Determine which grounding sections should still be asked given a
 * pre-existing config (used in upsert mode without --reconfigure to avoid
 * double-prompts on already-configured sections).
 */
function pendingGroundingSections(existingConfig) {
  const grounding = existingConfig?.grounding || {};
  return {
    askVault: !grounding.vault?.enabled,
    askDesignSystem: !grounding.designSystem?.enabled,
    askBrand: !grounding.brand?.enabled,
  };
}

function isGroundingEnabled(section, configPath = CONFIG_PATH) {
  const cfg = readGroundingConfig(configPath);
  return Boolean(cfg?.grounding?.[section]?.enabled);
}

module.exports = {
  CONFIG_DIR,
  CONFIG_PATH,
  SCHEMA_VERSION,
  defaultConfig,
  readGroundingConfig,
  writeGroundingConfig,
  buildGroundingFromAnswers,
  pendingGroundingSections,
  isGroundingEnabled,
};
