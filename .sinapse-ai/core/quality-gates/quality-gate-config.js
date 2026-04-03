/**
 * Quality Gate Configuration Loader
 *
 * Reads configuration from quality-gate-config.yaml or accepts inline config.
 * Supports 3 layers with configurable checks per layer and sensible defaults
 * for SINAPSE projects.
 *
 * @module core/quality-gates/quality-gate-config
 * @version 1.0.0
 * @story 10.4 — Quality Gates Module
 */

const fs = require('fs');
const path = require('path');

/**
 * Default YAML config path relative to the module
 */
const DEFAULT_CONFIG_PATH = path.join(__dirname, 'quality-gate-config.yaml');

/**
 * Sensible defaults for SINAPSE projects.
 * These are used when no YAML config is available or as fallback values.
 */
const DEFAULTS = {
  version: '2.0',

  layer1: {
    enabled: true,
    failFast: true,
    checks: {
      lint: {
        enabled: true,
        command: 'npm run lint',
        failOn: 'error',
        timeout: 60000,
      },
      typecheck: {
        enabled: true,
        command: 'npm run typecheck',
        timeout: 120000,
      },
      test: {
        enabled: true,
        command: 'npm test',
        timeout: 300000,
        coverage: {
          enabled: true,
          minimum: 80,
        },
      },
      'secret-scan': {
        enabled: true,
        patterns: [
          '\\.env$',
          'credentials\\.json$',
          '\\.pem$',
          '\\.key$',
        ],
        contentPatterns: [
          'AKIA[A-Z0-9]{16}',
          'sk_live_[A-Za-z0-9]+',
          'ghp_[A-Za-z0-9]{36}',
          'password\\s*[:=]\\s*["\'][^"\']+["\']',
        ],
        timeout: 10000,
      },
      'story-gate': {
        enabled: true,
        requireStoryFile: true,
        requireReadyStatus: true,
        storyDir: 'docs/stories',
        timeout: 5000,
      },
    },
  },

  layer2: {
    enabled: true,
    coderabbit: {
      enabled: true,
      command: "wsl bash -c 'cd ${PROJECT_ROOT} && ~/.local/bin/coderabbit --prompt-only -t uncommitted'",
      timeout: 900000,
      blockOn: ['CRITICAL'],
      warnOn: ['HIGH'],
      documentOn: ['MEDIUM'],
      ignoreOn: ['LOW'],
    },
    'coverage-threshold': {
      enabled: true,
      minimum: 80,
      failOn: 'decrease',
    },
    'story-validation': {
      enabled: true,
      requireAcceptanceCriteria: true,
      requireScope: true,
      requireComplexityEstimate: false,
    },
    'dependency-audit': {
      enabled: true,
      command: 'npm audit --audit-level=high',
      blockOn: ['critical', 'high'],
      timeout: 60000,
    },
    quinn: {
      enabled: true,
      autoReview: true,
      agentPath: '.claude/commands/SINAPSE/agents/quality-gate.md',
      severity: {
        block: ['CRITICAL'],
        warn: ['HIGH', 'MEDIUM'],
      },
    },
  },

  layer3: {
    enabled: true,
    requireSignoff: true,
    assignmentStrategy: 'auto',
    defaultReviewer: '@architect',
    checklist: {
      enabled: true,
      template: 'strategic-review-checklist',
      minItems: 5,
    },
    signoff: {
      required: true,
      expiry: 86400000,
    },
    'reviewer-assignment': {
      enabled: true,
      strategy: 'auto',
      fallback: '@architect',
      codeownerRequired: true,
    },
    'approval-count': {
      minimum: 1,
      requireCodeowner: true,
    },
    escalation: {
      enabled: true,
      staleTimeout: 86400000,
      reminderInterval: 14400000,
      escalateTo: '@tech-lead',
    },
  },

  notifications: {
    enabled: true,
    channels: ['console', 'file'],
    notificationsPath: '.sinapse/notifications',
  },

  reports: {
    location: '.sinapse/qa-reports',
    format: 'json',
    retention: 30,
    includeMetrics: true,
  },

  status: {
    location: '.sinapse/qa-status.json',
    updateOnChange: true,
  },

  focusAreas: {
    strategicAreas: [
      'architecture',
      'business-logic',
      'security',
      'ux',
      'performance',
      'data-integrity',
    ],
    skipAreas: [
      'syntax',
      'formatting',
      'simple-logic',
      'naming-conventions',
      'import-order',
    ],
  },

  humanReview: {
    statusPath: '.sinapse/qa-status.json',
    reviewRequestsPath: '.sinapse/human-review-requests',
  },
};

/**
 * Quality Gate Configuration
 *
 * Loads configuration from YAML file, merges with inline overrides,
 * and provides a typed accessor API with dot-notation path support.
 */
class QualityGateConfig {
  /**
   * Create a new config instance
   * @param {Object} overrides - Inline config overrides merged on top of defaults
   */
  constructor(overrides = {}) {
    this._data = this._deepMerge(DEFAULTS, overrides);
  }

  /**
   * Load configuration from a YAML file and merge with defaults
   * @param {string} [configPath] - Path to YAML config file
   * @returns {Promise<QualityGateConfig>} Loaded config instance
   */
  static async loadFromFile(configPath) {
    const filePath = configPath || DEFAULT_CONFIG_PATH;

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = QualityGateConfig._parseYaml(content);
      return new QualityGateConfig(parsed);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File not found — use defaults silently
        return new QualityGateConfig({});
      }
      // Parse error or other issue — warn and use defaults
      console.warn(`[QualityGateConfig] Could not load ${filePath}: ${error.message}. Using defaults.`);
      return new QualityGateConfig({});
    }
  }

  /**
   * Get a config value by dot-notation path
   *
   * @param {string} keyPath - Dot-separated path (e.g. 'layer1.checks.lint.enabled')
   * @param {*} [defaultValue] - Fallback if path not found
   * @returns {*} Config value or defaultValue
   *
   * @example
   *   config.get('layer1.checks.lint.enabled')     // true
   *   config.get('layer1.checks.lint.timeout')      // 60000
   *   config.get('nonexistent.path', 'fallback')    // 'fallback'
   */
  get(keyPath, defaultValue) {
    if (!keyPath || typeof keyPath !== 'string') return defaultValue;

    const parts = keyPath.split('.');
    let current = this._data;

    for (const part of parts) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return defaultValue;
      }
      current = current[part];
    }

    return current !== undefined ? current : defaultValue;
  }

  /**
   * Set a config value by dot-notation path
   * @param {string} keyPath - Dot-separated path
   * @param {*} value - Value to set
   */
  set(keyPath, value) {
    if (!keyPath || typeof keyPath !== 'string') return;

    const parts = keyPath.split('.');
    let current = this._data;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (current[part] === undefined || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }

    current[parts[parts.length - 1]] = value;
  }

  /**
   * Get checks configured for a specific layer
   * @param {number|string} layer - Layer number (1, 2, 3) or name
   * @returns {Object} Checks configuration for the layer
   */
  getChecksForLayer(layer) {
    const layerKey = typeof layer === 'number' ? `layer${layer}` : layer;
    return this.get(`${layerKey}.checks`, {});
  }

  /**
   * Check if a specific layer is enabled
   * @param {number|string} layer - Layer number or name
   * @returns {boolean} Whether the layer is enabled
   */
  isLayerEnabled(layer) {
    const layerKey = typeof layer === 'number' ? `layer${layer}` : layer;
    return this.get(`${layerKey}.enabled`, true);
  }

  /**
   * Return a plain object copy of the full config
   * @returns {Object} Plain config object
   */
  toPlainObject() {
    return JSON.parse(JSON.stringify(this._data));
  }

  /**
   * Deep merge two objects (target wins on conflict for non-object values)
   * @param {Object} base - Base object
   * @param {Object} overrides - Override object (takes precedence)
   * @returns {Object} Merged object
   * @private
   */
  _deepMerge(base, overrides) {
    if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) {
      return overrides !== undefined ? overrides : base;
    }
    if (!base || typeof base !== 'object' || Array.isArray(base)) {
      return overrides;
    }

    const result = { ...base };

    for (const key of Object.keys(overrides)) {
      if (
        key in result &&
        typeof result[key] === 'object' && !Array.isArray(result[key]) &&
        typeof overrides[key] === 'object' && !Array.isArray(overrides[key])
      ) {
        result[key] = this._deepMerge(result[key], overrides[key]);
      } else {
        result[key] = overrides[key];
      }
    }

    return result;
  }

  /**
   * Minimal YAML parser for the quality-gate-config.yaml format.
   *
   * Handles:
   * - key: value pairs (strings, numbers, booleans)
   * - Nested objects via indentation
   * - Arrays with "- item" syntax
   * - Comments (lines starting with #)
   * - Quoted strings
   *
   * Does NOT handle: multi-line strings, anchors/aliases, flow style.
   * For full YAML support, use js-yaml externally.
   *
   * @param {string} content - YAML content
   * @returns {Object} Parsed object
   * @static
   * @private
   */
  static _parseYaml(content) {
    const lines = content.split('\n');
    const root = {};
    const stack = [{ indent: -1, obj: root }];

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.replace(/\s+$/, '');

      // Skip empty lines and comments
      if (!trimmed || trimmed.match(/^\s*#/)) continue;

      // Calculate indentation
      const indent = rawLine.search(/\S/);
      if (indent < 0) continue;

      // Pop stack to find the right parent
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      const parent = stack[stack.length - 1].obj;
      const lineContent = trimmed.trim();

      // Array item: "- value"
      if (lineContent.startsWith('- ')) {
        const arrayValue = lineContent.substring(2).trim();
        // Find which key in the parent this belongs to
        const parentKeys = Object.keys(parent);
        const lastKey = parentKeys[parentKeys.length - 1];

        if (lastKey && !Array.isArray(parent[lastKey])) {
          // The previous key had no value — it's an array container
          if (parent[lastKey] === null || parent[lastKey] === undefined) {
            parent[lastKey] = [];
          }
        }

        if (lastKey && Array.isArray(parent[lastKey])) {
          parent[lastKey].push(QualityGateConfig._parseValue(arrayValue));
        }
        continue;
      }

      // Key: value pair
      const colonIndex = lineContent.indexOf(':');
      if (colonIndex === -1) continue;

      const key = lineContent.substring(0, colonIndex).trim();
      const rawValue = lineContent.substring(colonIndex + 1).trim();

      if (rawValue === '' || rawValue === '|' || rawValue === '>') {
        // Nested object or empty value
        parent[key] = {};
        stack.push({ indent, obj: parent[key] });
      } else {
        parent[key] = QualityGateConfig._parseValue(rawValue);

        // Check if next lines are array items for this key
        if (i + 1 < lines.length) {
          const nextTrimmed = lines[i + 1].trim();
          if (nextTrimmed.startsWith('- ')) {
            // Override the scalar — this key starts an array
            // Only if value was empty-ish or the array indicator follows
          }
        }
      }
    }

    return root;
  }

  /**
   * Parse a scalar YAML value
   * @param {string} raw - Raw string value
   * @returns {*} Parsed value (string, number, boolean, null)
   * @static
   * @private
   */
  static _parseValue(raw) {
    if (!raw || raw === '~' || raw === 'null') return null;

    // Remove inline comments
    const withoutComment = raw.replace(/\s+#.*$/, '');

    // Quoted strings
    if (
      (withoutComment.startsWith('"') && withoutComment.endsWith('"')) ||
      (withoutComment.startsWith("'") && withoutComment.endsWith("'"))
    ) {
      return withoutComment.slice(1, -1);
    }

    // Booleans
    if (withoutComment === 'true' || withoutComment === 'True' || withoutComment === 'TRUE') return true;
    if (withoutComment === 'false' || withoutComment === 'False' || withoutComment === 'FALSE') return false;

    // Numbers
    if (/^-?\d+$/.test(withoutComment)) return parseInt(withoutComment, 10);
    if (/^-?\d+\.\d+$/.test(withoutComment)) return parseFloat(withoutComment);

    return withoutComment;
  }
}

module.exports = { QualityGateConfig };
