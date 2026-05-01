/**
 * Shared config loader for grounding hooks.
 *
 * @story 10.47
 *
 * Reads `~/.claude/sinapse-ai-config.yaml` once per call. Pure function: no
 * caching, no side effects, never throws — returns `null` on any error so
 * each hook can short-circuit cleanly.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const CONFIG_PATH = path.join(os.homedir(), '.claude', 'sinapse-ai-config.yaml');

function loadGroundingConfig(configPath = CONFIG_PATH) {
  try {
    if (!fs.existsSync(configPath)) return null;
    const raw = fs.readFileSync(configPath, 'utf8');
    // Lazy-require so absence of js-yaml in a downstream consumer never
    // crashes the hook chain — yaml is shipped via packages/installer
    // dependency tree but downstream installs may strip dev deps.
    let yaml;
    try { yaml = require('js-yaml'); } catch { return null; }
    const parsed = yaml.load(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function isSectionEnabled(section, configPath = CONFIG_PATH) {
  const cfg = loadGroundingConfig(configPath);
  return Boolean(cfg && cfg.grounding && cfg.grounding[section] && cfg.grounding[section].enabled);
}

function getSection(section, configPath = CONFIG_PATH) {
  const cfg = loadGroundingConfig(configPath);
  if (!cfg || !cfg.grounding) return null;
  return cfg.grounding[section] || null;
}

module.exports = {
  CONFIG_PATH,
  loadGroundingConfig,
  isSectionEnabled,
  getSection,
};
