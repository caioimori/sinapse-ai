/**
 * Observability Panel Module
 *
 * Story 11.6: Projeto Bob - Painel de Observabilidade CLI
 *
 * Provides a CLI status panel showing Bob's current work:
 * - Current agent
 * - Pipeline progress
 * - Active terminals
 * - Elapsed time
 *
 * Supports two modes:
 * - minimal: pipeline + errors only (default)
 * - detailed: reasoning + trade-offs + agent explanations
 *
 * @module core/ui/observability-panel
 * @version 1.0.0
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { PanelRenderer } = require('./panel-renderer');

/**
 * TTL (seconds) for session-cache entries. Mirrors the read-side contract
 * shared with the statusline/panel: imperator/specialists older than this
 * are treated as inactive. 6 hours.
 * @constant {number}
 */
const SESSION_CACHE_TTL_SECONDS = 21600;

/**
 * Stable 32-bit string hash. MUST stay byte-identical to the implementation
 * in track-agent.sh and statusline-script.js so all peers resolve the same
 * per-cwd session-cache file.
 * @param {string} str - Input string (typically process.cwd()).
 * @returns {string} Hex hash.
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Reads + parses a JSON file, returning null on any failure (fail-open).
 * @param {string} filePath - Absolute path to the JSON file.
 * @returns {Object|null} Parsed object or null.
 */
function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Panel modes
 * @enum {string}
 */
const PanelMode = {
  MINIMAL: 'minimal',
  DETAILED: 'detailed',
};

/**
 * Pipeline stages
 * @enum {string}
 */
const PipelineStage = {
  PRD: 'PRD',
  EPIC: 'Epic',
  STORY: 'Story',
  DEV: 'Dev',
  QA: 'QA',
  PUSH: 'Push',
};

/**
 * Default panel state
 * @returns {Object} Initial panel state
 */
function createDefaultState() {
  return {
    mode: PanelMode.MINIMAL,
    refresh_rate: 1000,

    pipeline: {
      stages: Object.values(PipelineStage),
      current_stage: null,
      story_progress: '0/0',
      completed_stages: [],
    },

    current_agent: {
      id: null,
      name: null,
      task: null,
      reason: null,
    },

    active_terminals: {
      count: 0,
      list: [],
    },

    elapsed: {
      story_start: null,
      session_start: null,
    },

    tradeoffs: [],

    errors: [],

    next_steps: [],
  };
}

/**
 * Observability Panel class
 */
class ObservabilityPanel {
  /**
   * Creates a new ObservabilityPanel instance
   * @param {Object} options - Panel options
   */
  constructor(options = {}) {
    this.options = {
      refreshRate: 1000,
      mode: PanelMode.MINIMAL,
      width: 60,
      ...options,
    };

    this.state = createDefaultState();
    this.state.mode = this.options.mode;
    this.state.refresh_rate = this.options.refreshRate;
    this.state.elapsed.session_start = Date.now();

    this.renderer = new PanelRenderer({ width: this.options.width });
    this.refreshInterval = null;
    this.isRunning = false;
  }

  /**
   * Starts the panel refresh loop
   * @returns {void}
   */
  start() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.render();

    this.refreshInterval = setInterval(() => {
      this.render();
    }, this.state.refresh_rate);
  }

  /**
   * Stops the panel refresh loop
   * @returns {void}
   */
  stop() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    this.isRunning = false;
    this.clearPanel();
  }

  /**
   * Renders the panel to the terminal
   * @returns {void}
   */
  render() {
    const output = this.state.mode === PanelMode.DETAILED
      ? this.renderer.renderDetailed(this.state)
      : this.renderer.renderMinimal(this.state);

    this.clearPanel();
    process.stdout.write(output);
  }

  /**
   * Clears the panel from the terminal
   * @returns {void}
   */
  clearPanel() {
    // Move cursor up and clear lines
    const lineCount = this.state.mode === PanelMode.DETAILED ? 20 : 8;
    process.stdout.write(`\x1B[${lineCount}A\x1B[0J`);
  }

  /**
   * Updates the panel state
   * @param {Object} updates - State updates
   * @returns {void}
   */
  updateState(updates) {
    if (updates.pipeline) {
      this.state.pipeline = { ...this.state.pipeline, ...updates.pipeline };
    }

    if (updates.current_agent) {
      this.state.current_agent = { ...this.state.current_agent, ...updates.current_agent };
    }

    if (updates.active_terminals) {
      this.state.active_terminals = { ...this.state.active_terminals, ...updates.active_terminals };
    }

    if (updates.tradeoffs) {
      this.state.tradeoffs = updates.tradeoffs;
    }

    if (updates.errors) {
      this.state.errors = updates.errors;
    }

    if (updates.next_steps) {
      this.state.next_steps = updates.next_steps;
    }
  }

  /**
   * Sets the current agent
   * @param {string} id - Agent ID (e.g., '@dev')
   * @param {string} name - Agent name (e.g., 'Dex')
   * @param {string} task - Current task
   * @param {string} reason - Why this agent (detailed mode only)
   * @returns {void}
   */
  setCurrentAgent(id, name, task, reason = null) {
    this.state.current_agent = { id, name, task, reason };
  }

  /**
   * Sets the current pipeline stage
   * @param {string} stage - Stage name from PipelineStage
   * @param {string} storyProgress - Progress string (e.g., '3/8')
   * @returns {void}
   */
  setPipelineStage(stage, storyProgress = null) {
    this.state.pipeline.current_stage = stage;
    if (storyProgress) {
      this.state.pipeline.story_progress = storyProgress;
    }
  }

  /**
   * Marks a pipeline stage as completed
   * @param {string} stage - Stage name from PipelineStage
   * @returns {void}
   */
  completePipelineStage(stage) {
    if (!this.state.pipeline.completed_stages.includes(stage)) {
      this.state.pipeline.completed_stages.push(stage);
    }
  }

  /**
   * Adds an active terminal
   * @param {string} agent - Agent ID
   * @param {number} pid - Process ID
   * @param {string} task - Current task
   * @returns {void}
   */
  addTerminal(agent, pid, task) {
    const terminal = { agent, pid, task };
    this.state.active_terminals.list.push(terminal);
    this.state.active_terminals.count = this.state.active_terminals.list.length;
  }

  /**
   * Removes an active terminal
   * @param {number} pid - Process ID to remove
   * @returns {void}
   */
  removeTerminal(pid) {
    this.state.active_terminals.list = this.state.active_terminals.list.filter(
      (t) => t.pid !== pid,
    );
    this.state.active_terminals.count = this.state.active_terminals.list.length;
  }

  /**
   * Starts story timer
   * @returns {void}
   */
  startStoryTimer() {
    this.state.elapsed.story_start = Date.now();
  }

  /**
   * Adds a trade-off decision (detailed mode)
   * @param {string} choice - The choice made (e.g., 'JWT vs Session')
   * @param {string} selected - Selected option (e.g., 'JWT')
   * @param {string} reason - Reason for the choice
   * @returns {void}
   */
  addTradeoff(choice, selected, reason) {
    this.state.tradeoffs.push({ choice, selected, reason });
  }

  /**
   * Adds an error to display
   * @param {string} message - Error message
   * @returns {void}
   */
  addError(message) {
    this.state.errors.push({ message, timestamp: Date.now() });
  }

  /**
   * Clears errors
   * @returns {void}
   */
  clearErrors() {
    this.state.errors = [];
  }

  /**
   * Sets next steps (detailed mode)
   * @param {string[]} steps - Array of next step descriptions
   * @returns {void}
   */
  setNextSteps(steps) {
    this.state.next_steps = steps;
  }

  /**
   * Toggles between minimal and detailed mode
   * @returns {string} Current mode after toggle
   */
  toggleMode() {
    this.state.mode = this.state.mode === PanelMode.MINIMAL
      ? PanelMode.DETAILED
      : PanelMode.MINIMAL;
    return this.state.mode;
  }

  /**
   * Sets the panel mode
   * @param {string} mode - Mode from PanelMode
   * @returns {void}
   */
  setMode(mode) {
    if (Object.values(PanelMode).includes(mode)) {
      this.state.mode = mode;
    }
  }

  /**
   * Gets elapsed time strings
   * @returns {Object} Formatted elapsed times
   */
  getElapsedTime() {
    const now = Date.now();

    const formatDuration = (ms) => {
      if (!ms || ms < 0) return '0s';
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        return `${hours}h${minutes % 60}m`;
      }
      if (minutes > 0) {
        return `${minutes}m${seconds % 60}s`;
      }
      return `${seconds}s`;
    };

    return {
      story: this.state.elapsed.story_start
        ? formatDuration(now - this.state.elapsed.story_start)
        : '--',
      session: this.state.elapsed.session_start
        ? formatDuration(now - this.state.elapsed.session_start)
        : '--',
    };
  }

  /**
   * Gets the current state (for external consumers)
   * @returns {Object} Current panel state
   */
  getState() {
    return {
      ...this.state,
      elapsed: this.getElapsedTime(),
    };
  }

  /**
   * Renders panel once without starting the loop (for testing)
   * @returns {string} Rendered panel output
   */
  renderOnce() {
    return this.state.mode === PanelMode.DETAILED
      ? this.renderer.renderDetailed(this.state)
      : this.renderer.renderMinimal(this.state);
  }

  /**
   * Live-watches the runtime status sources and drives a panel from them.
   *
   * Decision D2 (MERGE): on every tick it reads BOTH the Bob dashboard status
   * file and the per-cwd session-cache, then maps whichever describes an
   * active orchestration:
   *   - If `bob.orchestration.active` → Bob owns the panel (pipeline,
   *     current_agent, active_terminals from the dashboard).
   *   - Otherwise → the session-cache drives it (imperator → coordinator,
   *     TTL-filtered specialists → active terminals).
   * D7 populates light, state-aware `next_steps` suggestions.
   *
   * Reuses the existing render/start/stop loop — it does NOT spin its own
   * setInterval. Fail-open: any read/parse error leaves prior state intact.
   *
   * @param {string} projectRoot - Project root used to locate bob-status.json.
   * @param {Object} [opts] - Options.
   * @param {number} [opts.refreshRate=1000] - Refresh interval in ms.
   * @returns {{ stop: function(): void, panel: ObservabilityPanel }} Handle.
   */
  static watchFromStatusFile(projectRoot, { refreshRate = 1000 } = {}) {
    const panel = new ObservabilityPanel({ refreshRate });

    const bobStatusPath = path.join(
      projectRoot || process.cwd(),
      '.sinapse',
      'dashboard',
      'bob-status.json',
    );
    const sessionCachePath = path.join(
      os.homedir(),
      '.claude',
      'session-cache',
      `${simpleHash(process.cwd())}.json`,
    );

    const tick = () => {
      try {
        const updates = ObservabilityPanel._buildUpdatesFromSources(
          bobStatusPath,
          sessionCachePath,
        );
        if (updates) panel.updateState(updates);
      } catch {
        // Fail-open: keep last good state.
      }
    };

    // Prime once before the loop so the first frame reflects current state.
    tick();
    panel.start();

    // Reuse the panel's render loop for tick() too — no second setInterval.
    const watchInterval = setInterval(tick, refreshRate);

    return {
      panel,
      stop() {
        clearInterval(watchInterval);
        panel.stop();
      },
    };
  }

  /**
   * Pure mapper: reads both status sources and returns an updateState() patch.
   * Bob wins when its orchestration is active (D2 MERGE), else session-cache.
   *
   * @param {string} bobStatusPath - Absolute path to bob-status.json.
   * @param {string} sessionCachePath - Absolute path to the session-cache.
   * @returns {Object|null} updateState patch, or null when nothing to apply.
   * @private
   */
  static _buildUpdatesFromSources(bobStatusPath, sessionCachePath) {
    const bob = readJsonSafe(bobStatusPath);
    const cache = readJsonSafe(sessionCachePath);

    if (bob && bob.orchestration && bob.orchestration.active) {
      return ObservabilityPanel._mapBob(bob);
    }
    return ObservabilityPanel._mapSessionCache(cache);
  }

  /**
   * Maps a Bob dashboard status object to an updateState() patch.
   * @param {Object} bob - Parsed bob-status.json.
   * @returns {Object} updateState patch.
   * @private
   */
  static _mapBob(bob) {
    const updates = {};

    if (bob.pipeline) {
      updates.pipeline = bob.pipeline;
    }

    if (bob.current_agent) {
      updates.current_agent = bob.current_agent;
    }

    const terminals = bob.active_terminals;
    if (terminals) {
      const list = Array.isArray(terminals.list)
        ? terminals.list
        : (Array.isArray(terminals) ? terminals : []);
      updates.active_terminals = {
        list,
        count: typeof terminals.count === 'number' ? terminals.count : list.length,
      };
    }

    updates.next_steps = ObservabilityPanel._suggestNextSteps({
      imperatorActive: false,
      specialistNames: (updates.active_terminals?.list || []).map(
        (t) => t.agent || t.id || t.label,
      ).filter(Boolean),
      bobActive: true,
    });

    return updates;
  }

  /**
   * Maps a per-cwd session-cache object to an updateState() patch.
   * imperator.active → coordinator; TTL-filtered specialists → terminals.
   * @param {Object|null} cache - Parsed session-cache (v2 shape) or null.
   * @returns {Object} updateState patch.
   * @private
   */
  static _mapSessionCache(cache) {
    const nowSec = Math.floor(Date.now() / 1000);
    const updates = {};

    const imperator = cache && cache.imperator;
    const imperatorActive = !!(
      imperator
      && imperator.active
      && typeof imperator.ts === 'number'
      && (nowSec - imperator.ts) <= SESSION_CACHE_TTL_SECONDS
    );

    const specialists = Array.isArray(cache && cache.specialists)
      ? cache.specialists.filter(
        (s) => s
          && typeof s.ts === 'number'
          && (nowSec - s.ts) <= SESSION_CACHE_TTL_SECONDS,
      )
      : [];

    if (imperatorActive) {
      updates.current_agent = { id: 'coordinator', name: null, task: null, reason: null };
    } else {
      updates.current_agent = { id: null, name: null, task: null, reason: null };
    }

    updates.active_terminals = {
      list: specialists.map((s) => ({
        agent: s.label || s.id,
        pid: null,
        task: null,
      })),
      count: specialists.length,
    };

    updates.next_steps = ObservabilityPanel._suggestNextSteps({
      imperatorActive,
      specialistNames: specialists.map((s) => s.label || s.id).filter(Boolean),
      bobActive: false,
    });

    return updates;
  }

  /**
   * D7 — derives light, state-aware next-step suggestions.
   * @param {Object} ctx - State context.
   * @param {boolean} ctx.imperatorActive - Coordinator is active.
   * @param {string[]} ctx.specialistNames - Active specialist labels.
   * @param {boolean} ctx.bobActive - Bob orchestration is active.
   * @returns {string[]} Suggestions.
   * @private
   */
  static _suggestNextSteps({ imperatorActive, specialistNames = [], bobActive = false }) {
    if (specialistNames.length > 0) {
      return ['Especialistas trabalhando: ' + specialistNames.join(', ')];
    }
    if (imperatorActive || bobActive) {
      return ['Coordenador montando o plano'];
    }
    return [
      'Rode os testes',
      'Crie/valide a story',
      'Invoque @sinapse para orquestrar',
    ];
  }
}

/**
 * Creates a new ObservabilityPanel instance
 * @param {Object} options - Panel options
 * @returns {ObservabilityPanel} Panel instance
 */
function createPanel(options = {}) {
  return new ObservabilityPanel(options);
}

module.exports = {
  ObservabilityPanel,
  createPanel,
  PanelMode,
  PipelineStage,
  createDefaultState,
  simpleHash,
  SESSION_CACHE_TTL_SECONDS,
};

