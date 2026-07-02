/**
 * SYNAPSE Context Bracket Tracker
 *
 * Calculates the current context bracket (FRESH/MODERATE/DEPLETED/CRITICAL)
 * based on estimated token usage. Provides token budgets and layer filtering
 * per bracket for the SynapseEngine orchestrator.
 *
 * Reads model context window from core-config.yaml → models.registry.
 * Also exposes shouldCompact() — a dual-trigger (percent + absolute)
 * compaction signal, independent of the bracket ladder above.
 *
 * @module core/synapse/context/context-tracker
 * @version 1.2.0
 * @created Story SYN-3 - Context Bracket Tracker
 * @updated Story onda2-p4 - dual-trigger compaction signal (audit AF-20260702 item 2.12)
 */

const fs = require('fs');
const path = require('path');

/**
 * Bracket definitions with thresholds and token budgets.
 *
 * Thresholds represent the percentage of context remaining:
 * - FRESH: 60-100% remaining (lean injection)
 * - MODERATE: 40-60% remaining (standard injection)
 * - DEPLETED: 25-40% remaining (reinforcement injection)
 * - CRITICAL: 0-25% remaining (warning + handoff prep)
 *
 * Token budgets recalibrated by Story onda1-s2 (audit AF-20260702 item 1.6)
 * to the REAL floors of the context-diet regime, measured 2026-07-02 with
 * the real formatter against the real .synapse/constitution (96 rules):
 *
 * - Turn 1 (prompt_count=0 → always FRESH at ~100%): the FULL Constitution
 *   is PROTECTED and measures 7,226 chars ≈ 1,807 tokens (section alone);
 *   whole <synapse-rules> block ≈ 7,324 chars ≈ 1,831 tokens. FRESH=2000
 *   covers this floor with headroom for CONTEXT rules / AGENT section.
 *   (The old FRESH=800 was structurally unreachable — 2.3x over, silent.)
 * - Turns 2+ (constitution emitted as reminder ≤ 1,000 chars ≈ ≤ 250
 *   tokens): the PROTECTED floor drops to ~200-300 tokens. MODERATE /
 *   DEPLETED / CRITICAL can only occur on turns 2+ (bracket is derived
 *   from prompt_count), so they are sized for reminder + AGENT rules
 *   (+ memory hints at DEPLETED+, + handoff warning at CRITICAL).
 *
 * Overflow is now SIGNALED (never silent) — see formatter.enforceTokenBudget()
 * and the [BUDGET OVERFLOW] output marker + metrics.budget in engine.js.
 *
 * @type {Object.<string, {min: number, max: number, tokenBudget: number}>}
 */
const BRACKETS = {
  FRESH:    { min: 60, max: 100, tokenBudget: 2000 },
  MODERATE: { min: 40, max: 60,  tokenBudget: 800 },
  DEPLETED: { min: 25, max: 40,  tokenBudget: 1000 },
  CRITICAL: { min: 0,  max: 25,  tokenBudget: 1200 },
};

/**
 * Token budget constants per bracket (shorthand access).
 * Values mirror BRACKETS — see the measurement basis documented above.
 *
 * @type {Object.<string, number>}
 */
const TOKEN_BUDGETS = {
  FRESH: 2000,
  MODERATE: 800,
  DEPLETED: 1000,
  CRITICAL: 1200,
};

/**
 * Safety multiplier for XML-heavy output (SYNAPSE rules).
 * chars/4 underestimates by 15-25% on XML; 1.2x corrects this.
 * @see NOG-9 research C6-token-budget.md
 */
const XML_SAFETY_MULTIPLIER = 1.2;

/**
 * Default configuration values — the FALLBACK only.
 *
 * The EFFECTIVE maxContext is derived from
 * `models.registry[models.active].contextWindow` in core-config.yaml via
 * getModelConfig() below (reused as-is by estimateContextPercent() and
 * shouldCompact() — one read path, no duplication/cycle). These DEFAULTS
 * apply only when the config file, the `models` section, or the active
 * registry entry is missing/invalid.
 *
 * As of Story onda2-p4 (audit AF-20260702 item 2.12), that fallback path is
 * still what REAL `npx sinapse-ai install` outputs hit: the shipped
 * core-config.yaml template has no `models` section, so installed projects
 * fall back to 200000 even when the user's actual model has a 1M window.
 * Adding that section to the install template is a separate, deliberate
 * decision (P8/DEC-01) — intentionally not part of this story.
 */
const DEFAULTS = Object.freeze({
  avgTokensPerPrompt: 1500,
  maxContext: 200000,
});

/** Cache for model config by project root (read once per root per process). */
const _modelConfigCache = new Map();

function cloneModelConfig(config) {
  return { ...config };
}

function cacheModelConfig(root, config) {
  const cachedConfig = Object.freeze(cloneModelConfig(config));
  _modelConfigCache.set(root, cachedConfig);
  return cloneModelConfig(cachedConfig);
}

function isPositiveFiniteNumber(value) {
  return Number.isFinite(value) && value > 0;
}

/**
 * Resolve the project root used for model config lookup.
 *
 * @param {string|null} basePath - Optional project root override
 * @returns {string}
 */
function resolveConfigRoot(basePath) {
  return path.resolve(basePath || path.resolve(__dirname, '..', '..', '..', '..'));
}

/**
 * Read model configuration from core-config.yaml → models section.
 * Returns { contextWindow, avgTokensPerPrompt } for the active model.
 * Falls back to DEFAULTS if config is missing or malformed.
 *
 * @param {string|null} [basePath=null] - Project root override (defaults to __dirname-based resolution)
 * @returns {{ maxContext: number, avgTokensPerPrompt: number }}
 */
function getModelConfig(basePath = null) {
  const root = resolveConfigRoot(basePath);
  if (_modelConfigCache.has(root)) return cloneModelConfig(_modelConfigCache.get(root));

  try {
    const yaml = require('js-yaml');
    const configPath = path.join(root, '.sinapse-ai', 'core-config.yaml');
    if (!fs.existsSync(configPath)) {
      return cacheModelConfig(root, DEFAULTS);
    }

    const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
    const models = config && config.models;
    if (!models || !models.registry || !models.active) {
      return cacheModelConfig(root, DEFAULTS);
    }

    const activeModel = models.registry[models.active];
    if (!activeModel || !isPositiveFiniteNumber(activeModel.contextWindow)) {
      return cacheModelConfig(root, DEFAULTS);
    }

    const modelConfig = {
      maxContext: activeModel.contextWindow,
      avgTokensPerPrompt: isPositiveFiniteNumber(activeModel.avgTokensPerPrompt)
        ? activeModel.avgTokensPerPrompt
        : DEFAULTS.avgTokensPerPrompt,
    };
    return cacheModelConfig(root, modelConfig);
  } catch (err) {
    if (process.env.DEBUG || process.env.SINAPSE_DEBUG) {
      console.warn('[context-tracker] Failed to load model config, using defaults:', err.message);
    }
    return cacheModelConfig(root, DEFAULTS);
  }
}

/**
 * Layer configurations per bracket.
 *
 * FRESH: L0 (Constitution), L1 (Global), L2 (Agent), L7 (Star-Command if explicit)
 * MODERATE: All 8 layers active
 * DEPLETED: All layers + memory hints enabled
 * CRITICAL: All layers + memory hints + handoff warning
 */
const LAYER_CONFIGS = {
  FRESH:    { layers: [0, 1, 2, 7], memoryHints: false, handoffWarning: false },
  MODERATE: { layers: [0, 1, 2, 3, 4, 5, 6, 7], memoryHints: false, handoffWarning: false },
  DEPLETED: { layers: [0, 1, 2, 3, 4, 5, 6, 7], memoryHints: true, handoffWarning: false },
  CRITICAL: { layers: [0, 1, 2, 3, 4, 5, 6, 7], memoryHints: true, handoffWarning: true },
};

/**
 * Calculate the context bracket based on remaining context percentage.
 *
 * @param {number} contextPercent - Percentage of context remaining (0-100)
 * @returns {string} Bracket name: 'FRESH' | 'MODERATE' | 'DEPLETED' | 'CRITICAL'
 */
function calculateBracket(contextPercent) {
  if (typeof contextPercent !== 'number' || isNaN(contextPercent)) {
    return 'CRITICAL';
  }

  if (contextPercent >= 60) {
    return 'FRESH';
  }
  if (contextPercent >= 40) {
    return 'MODERATE';
  }
  if (contextPercent >= 25) {
    return 'DEPLETED';
  }
  return 'CRITICAL';
}

/**
 * Estimate the percentage of context remaining based on prompt count.
 *
 * Formula: 100 - ((promptCount * avgTokensPerPrompt) / maxContext * 100)
 * Result is clamped to 0-100 range.
 *
 * Reads maxContext and avgTokensPerPrompt from core-config.yaml → models.registry
 * for the active model. Options parameter can override for testing.
 *
 * @param {number} promptCount - Number of prompts in current session
 * @param {Object} [options={}] - Configuration options (override config values)
 * @param {number} [options.avgTokensPerPrompt] - Average tokens per prompt
 * @param {number} [options.maxContext] - Maximum context window size in tokens
 * @returns {number} Percentage of context remaining (0.0 to 100.0)
 */
function estimateContextPercent(promptCount, options = {}) {
  const modelConfig = getModelConfig();
  const {
    avgTokensPerPrompt = modelConfig.avgTokensPerPrompt,
    maxContext = modelConfig.maxContext,
  } = options;

  if (typeof promptCount !== 'number' || isNaN(promptCount) || promptCount < 0) {
    return 100;
  }

  if (maxContext <= 0) {
    return 0;
  }

  const usedTokens = promptCount * avgTokensPerPrompt * XML_SAFETY_MULTIPLIER;
  const percent = 100 - (usedTokens / maxContext * 100);
  return Math.max(0, Math.min(100, percent));
}

/**
 * Absolute ceiling (tokens) of live conversation history before compaction
 * is recommended — independent of window size.
 *
 * Story onda2-p4 (audit AF-20260702 item 2.12): a pure percentage trigger
 * does not scale to 1M-token windows — 60% of a 1M window is 600,000
 * tokens of live history, far past the point where instruction coherence
 * degrades ("context amnesia", see .claude/rules/token-economy.md §1,
 * measured/calibrated for the 200K window). This constant is the midpoint
 * of the 150-180K range the audit recommended as the interim absolute cap
 * while the 1M-window trigger itself remains pending real measurement.
 *
 * @type {number}
 */
const COMPACTION_ABSOLUTE_CEILING = 165000;

/**
 * Percentage of the active context window used before compaction is
 * recommended — mirrors token-economy.md §1 ("Auto-compact: 60%").
 *
 * @type {number}
 */
const COMPACTION_PERCENT_TRIGGER = 0.6;

/**
 * Determine whether compaction is recommended right now.
 *
 * DUAL trigger (Story onda2-p4 / audit item 2.12): fires at whichever
 * comes first — COMPACTION_PERCENT_TRIGGER (60%) of the active context
 * window, or the absolute COMPACTION_ABSOLUTE_CEILING (~165K tokens of
 * live history). Reads maxContext/avgTokensPerPrompt from getModelConfig()
 * — the SAME registry-aware source estimateContextPercent() uses, no
 * duplicate read path — overridable via options for testing.
 *
 * Equivalence at today's real windows: real installs fall back to the 200K
 * DEFAULTS (see DEFAULTS above), where 60% of 200K is 120,000 tokens —
 * always smaller than the 165K ceiling. The percent trigger always wins
 * there, so behavior is IDENTICAL to the pre-existing 60%-of-window rule
 * (zero regression). Above ~275K (COMPACTION_ABSOLUTE_CEILING /
 * COMPACTION_PERCENT_TRIGGER) — e.g. the 1M registry entries — the
 * absolute ceiling wins and compaction is recommended far earlier than a
 * naive 60%-of-window rule would allow.
 *
 * @param {number} promptCount - Number of prompts in the current session
 * @param {Object} [options={}] - Configuration options (override config values, mirrors estimateContextPercent)
 * @param {number} [options.avgTokensPerPrompt] - Average tokens per prompt
 * @param {number} [options.maxContext] - Maximum context window size in tokens
 * @returns {boolean} True when compaction is recommended now
 */
function shouldCompact(promptCount, options = {}) {
  const modelConfig = getModelConfig();
  const {
    avgTokensPerPrompt = modelConfig.avgTokensPerPrompt,
    maxContext = modelConfig.maxContext,
  } = options;

  if (typeof promptCount !== 'number' || isNaN(promptCount) || promptCount < 0) {
    return false;
  }

  if (maxContext <= 0) {
    return true;
  }

  const usedTokens = promptCount * avgTokensPerPrompt * XML_SAFETY_MULTIPLIER;
  const triggerTokens = Math.min(maxContext * COMPACTION_PERCENT_TRIGGER, COMPACTION_ABSOLUTE_CEILING);
  return usedTokens >= triggerTokens;
}

/**
 * Get the maximum token budget for injection at the given bracket.
 *
 * @param {string} bracket - Bracket name ('FRESH' | 'MODERATE' | 'DEPLETED' | 'CRITICAL')
 * @returns {number|null} Max tokens for injection, or null for invalid bracket
 */
function getTokenBudget(bracket) {
  if (TOKEN_BUDGETS[bracket] !== undefined) {
    return TOKEN_BUDGETS[bracket];
  }
  return null;
}

/**
 * Get the active layer configuration for a given bracket.
 *
 * Returns an object with:
 * - layers: array of active layer numbers (0-7)
 * - memoryHints: whether memory hints should be included
 * - handoffWarning: whether a context handoff warning should be shown
 *
 * @param {string} bracket - Bracket name ('FRESH' | 'MODERATE' | 'DEPLETED' | 'CRITICAL')
 * @returns {{ layers: number[], memoryHints: boolean, handoffWarning: boolean }|null}
 *   Layer config object, or null for invalid bracket
 */
function getActiveLayers(bracket) {
  const config = LAYER_CONFIGS[bracket];
  if (!config) {
    return null;
  }
  // Return a copy to prevent mutation
  return {
    layers: [...config.layers],
    memoryHints: config.memoryHints,
    handoffWarning: config.handoffWarning,
  };
}

/**
 * Check if the given bracket requires a context handoff warning.
 *
 * @param {string} bracket - Bracket name
 * @returns {boolean} True if bracket is CRITICAL
 */
function needsHandoffWarning(bracket) {
  return bracket === 'CRITICAL';
}

/**
 * Check if the given bracket should include memory hints.
 *
 * @param {string} bracket - Bracket name
 * @returns {boolean} True if bracket is DEPLETED or CRITICAL
 */
function needsMemoryHints(bracket) {
  return bracket === 'DEPLETED' || bracket === 'CRITICAL';
}

/**
 * Reset the model config cache. Useful for tests or after config changes.
 *
 * @param {string|null} [basePath=null] - Optional project root override
 */
function resetModelConfigCache(basePath = null) {
  if (basePath === null) {
    _modelConfigCache.clear();
    return;
  }
  _modelConfigCache.delete(resolveConfigRoot(basePath));
}

module.exports = {
  calculateBracket,
  estimateContextPercent,
  shouldCompact,
  getTokenBudget,
  getActiveLayers,
  needsHandoffWarning,
  needsMemoryHints,
  getModelConfig,
  resetModelConfigCache,
  BRACKETS,
  TOKEN_BUDGETS,
  DEFAULTS,
  XML_SAFETY_MULTIPLIER,
  COMPACTION_ABSOLUTE_CEILING,
  COMPACTION_PERCENT_TRIGGER,
};

