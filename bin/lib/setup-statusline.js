'use strict';

/**
 * Shared statusline + agent-tracker installer (D4).
 *
 * Single source of truth for cabling the SINAPSE statusline feedback loop into
 * a user's global Claude Code config (`~/.claude/`). Consumed by both:
 *   - bin/sinapse-init.js  (setupGlobalStatuslineLegacy)
 *   - packages/installer/src/wizard/index.js
 *
 * What it installs:
 *   - ~/.claude/statusline-script.js          (renders the statusline)
 *   - ~/.claude/hooks/track-agent.cjs         (UserPromptSubmit detector — writes session-cache + injects the agent badge)
 *   - ~/.claude/hooks/track-agent-clear.cjs   (Stop hook — clears session-cache on session end)
 *   - ~/.claude/hooks/track-delegation.cjs    (PreToolUse[Task] — registers real delegations in the cast)
 *   - ~/.claude/agent-badges.json             (id -> {emoji, area, name} — read by the detector + statusline)
 *   - ~/.claude/session-cache/                (per-cwd cache directory)
 *   - settings.statusLine                     (graceful skip if already set)
 *   - settings.hooks.UserPromptSubmit → track-agent.cjs   (idempotent guard)
 *   - settings.hooks.Stop            → track-agent-clear.cjs (idempotent guard)
 *   - settings.hooks.PreToolUse[Task] → track-delegation.cjs (idempotent guard)
 *
 * Design notes:
 *   - FAIL-SOFT: statusline is non-critical. Any unexpected error returns a
 *     result object with `installed:false` + `reason`, never throws.
 *   - Idempotent: re-running never duplicates hook entries or clobbers an
 *     existing user statusLine.
 *   - Detector is now `.cjs` (Node), not the legacy `.sh` (bash) — works on
 *     Windows without a bash dependency.
 */

const os = require('os');
const path = require('path');
const fse = require('fs-extra');
const { atomicWriteFileSync } = require('./fs-utils');

/**
 * Resolve the canonical source paths for the statusline templates.
 * @param {string} sourceCoreDir Absolute path to the installed `.sinapse-ai` directory.
 */
function resolveSources(sourceCoreDir) {
  const templatesDir = path.join(sourceCoreDir, 'product', 'templates', 'statusline');
  return {
    templatesDir,
    script: path.join(templatesDir, 'statusline-script.js'),
    detector: path.join(templatesDir, 'track-agent.cjs'),
    clear: path.join(templatesDir, 'track-agent-clear.cjs'),
    delegation: path.join(templatesDir, 'track-delegation.cjs'),
    badges: path.join(templatesDir, 'agent-badges.json'),
  };
}

/**
 * Check whether an event array already has a hook whose command references `needle`.
 * @param {Array} eventArr settings.hooks[event] array
 * @param {string} needle substring to look for in the command (e.g. "track-agent-clear")
 */
function hasHookCommand(eventArr, needle) {
  if (!Array.isArray(eventArr)) return false;
  return eventArr.some((entry) => {
    if (entry && Array.isArray(entry.hooks)) {
      return entry.hooks.some((h) => h && h.command && h.command.includes(needle));
    }
    return entry && entry.command && entry.command.includes(needle);
  });
}

/**
 * Build the `node "<path>"` command string, escaping backslashes for JSON on Windows.
 * @param {string} targetPath absolute path to the hook script
 */
function nodeCommand(targetPath) {
  return `node "${targetPath.replace(/\\/g, '\\\\')}"`;
}

/**
 * Install the SINAPSE statusline + agent trackers into the user's global Claude config.
 *
 * @param {Object} [opts]
 * @param {string} [opts.sourceCoreDir] Absolute path to the installed `.sinapse-ai` directory.
 *   Defaults to the repo's `.sinapse-ai` relative to this module (`../../.sinapse-ai`).
 * @param {string} [opts.homeDir] Override the home directory (testing). Defaults to os.homedir().
 * @returns {Promise<{installed:boolean, reason?:string, statusLineSet:boolean, detectorHook:boolean, clearHook:boolean, delegationHook:boolean, files:string[]}>}
 */
async function setupStatusline(opts = {}) {
  const result = {
    installed: false,
    statusLineSet: false,
    detectorHook: false,
    clearHook: false,
    delegationHook: false,
    files: [],
  };

  try {
    const homeDir = opts.homeDir || os.homedir();
    const sourceCoreDir =
      opts.sourceCoreDir || path.join(__dirname, '..', '..', '.sinapse-ai');

    const sources = resolveSources(sourceCoreDir);

    // Source templates must exist (statusline-script + the .cjs detector).
    // track-agent-clear is best-effort — if missing we still install the rest.
    if (!(await fse.pathExists(sources.script)) || !(await fse.pathExists(sources.detector))) {
      result.reason = 'source templates missing (statusline-script.js or track-agent.cjs)';
      return result;
    }
    const hasClear = await fse.pathExists(sources.clear);
    const hasDelegation = await fse.pathExists(sources.delegation);

    const claudeDir = path.join(homeDir, '.claude');
    const hooksDir = path.join(claudeDir, 'hooks');
    const globalSettingsPath = path.join(claudeDir, 'settings.json');

    const scriptTarget = path.join(claudeDir, 'statusline-script.js');
    const detectorTarget = path.join(hooksDir, 'track-agent.cjs');
    const clearTarget = path.join(hooksDir, 'track-agent-clear.cjs');
    const delegationTarget = path.join(hooksDir, 'track-delegation.cjs');

    // Ensure directories (hooks + session-cache the trackers write to).
    await fse.ensureDir(hooksDir);
    await fse.ensureDir(path.join(claudeDir, 'session-cache'));

    // Copy templates (overwrite is fine — these are framework-owned).
    await fse.copy(sources.script, scriptTarget);
    result.files.push(scriptTarget);
    await fse.copy(sources.detector, detectorTarget);
    result.files.push(detectorTarget);
    if (hasClear) {
      await fse.copy(sources.clear, clearTarget);
      result.files.push(clearTarget);
    }
    if (hasDelegation) {
      await fse.copy(sources.delegation, delegationTarget);
      result.files.push(delegationTarget);
    }

    // Agent badge map (id -> {emoji, area, name}). Read by the detector hook to
    // inject the speaking agent's badge, and by the statusline to render it.
    // Best-effort: a missing source never blocks the rest of the install.
    if (await fse.pathExists(sources.badges)) {
      const badgesTarget = path.join(claudeDir, 'agent-badges.json');
      await fse.copy(sources.badges, badgesTarget);
      result.files.push(badgesTarget);
    }

    // Read existing global settings (back-compat with any prior config).
    let settings = {};
    try {
      if (await fse.pathExists(globalSettingsPath)) {
        settings = JSON.parse(await fse.readFile(globalSettingsPath, 'utf8'));
      }
    } catch {
      settings = {};
    }

    // statusLine — graceful skip if the user already configured one.
    if (!settings.statusLine) {
      settings.statusLine = {
        type: 'command',
        command: nodeCommand(scriptTarget),
      };
      result.statusLineSet = true;
    }

    // Hooks — register the .cjs detector (UserPromptSubmit) + clear (Stop) +
    // delegation tracker (PreToolUse[Task]), idempotently.
    if (!settings.hooks || typeof settings.hooks !== 'object') {
      settings.hooks = {};
    }

    // PRESERVATION GUARD: if the user's settings carry an event in a legacy /
    // hand-written NON-ARRAY shape, we must not clobber it (that would destroy
    // their hooks). Skip registration for that event instead — never destroy.
    const eventArray = (event) => {
      if (settings.hooks[event] === undefined || settings.hooks[event] === null) {
        settings.hooks[event] = [];
      }
      return Array.isArray(settings.hooks[event]) ? settings.hooks[event] : null;
    };

    const upsArr = eventArray('UserPromptSubmit');
    if (upsArr && !hasHookCommand(upsArr, 'track-agent.cjs')) {
      upsArr.push({
        matcher: '',
        hooks: [{ type: 'command', command: nodeCommand(detectorTarget), timeout: 10 }],
      });
      result.detectorHook = true;
    }

    if (hasClear) {
      const stopArr = eventArray('Stop');
      if (stopArr && !hasHookCommand(stopArr, 'track-agent-clear.cjs')) {
        stopArr.push({
          matcher: '',
          hooks: [{ type: 'command', command: nodeCommand(clearTarget), timeout: 10 }],
        });
        result.clearHook = true;
      }
    }

    // Delegation tracker — PreToolUse on the Task tool: registers each real
    // (programmatic) delegation in the session-cache so auto-routed specialists
    // surface in the badge context and statusline. Observer-only, fail-open.
    if (hasDelegation) {
      const preArr = eventArray('PreToolUse');
      if (preArr && !hasHookCommand(preArr, 'track-delegation.cjs')) {
        preArr.push({
          matcher: 'Task',
          hooks: [{ type: 'command', command: nodeCommand(delegationTarget), timeout: 5 }],
        });
        result.delegationHook = true;
      }
    }

    await fse.ensureDir(path.dirname(globalSettingsPath));
    // Atomic (tmp+rename): a crash mid-write must never leave a torn settings.json
    atomicWriteFileSync(globalSettingsPath, JSON.stringify(settings, null, 2), 'utf8');

    result.installed = true;
    return result;
  } catch (error) {
    // Statusline is non-critical — never block an install.
    result.reason = error && error.message ? error.message : 'unknown error';
    return result;
  }
}

module.exports = {
  setupStatusline,
  // Exported for testing / reuse.
  resolveSources,
  hasHookCommand,
  nodeCommand,
};
