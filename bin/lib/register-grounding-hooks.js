// bin/lib/register-grounding-hooks.js — register the 3 framework grounding
// hooks (sinapse-vault, sinapse-ds, sinapse-brand) in `~/.claude/settings.json`.
//
// @story GA-1.6
//
// Contract:
// - Idempotent: re-running never duplicates an entry.
// - Non-destructive: existing UserPromptSubmit hooks (e.g. Caio's personal
//   `vault-grounding.cjs`, terminal-bus, etc.) are preserved.
// - Fail-soft: every error is caught and logged via `notify`; settings.json
//   is never left in a corrupted state (we read → mutate → write atomically).

'use strict';

const fs = require('fs');
const path = require('path');

const HOOK_FILENAMES = [
  'sinapse-vault-grounding.cjs',
  'sinapse-ds-grounding.cjs',
  'sinapse-brand-grounding.cjs',
];

const HOOK_TIMEOUT_MS = 4000;

/**
 * Convert a path to forward slashes for use inside a JSON string. Claude Code
 * on Windows tolerates both, but forward slashes avoid double-escaping issues.
 */
function toForwardSlash(p) {
  return p.replace(/\\/g, '/');
}

/**
 * Build a UserPromptSubmit hook entry block for a given hook absolute path.
 */
function buildHookEntry(absHookPath) {
  return {
    type: 'command',
    command: `node "${toForwardSlash(absHookPath)}"`,
    timeout: HOOK_TIMEOUT_MS,
  };
}

/**
 * Determine if a UserPromptSubmit `hooks[].command` entry already references
 * one of our hook filenames. Filename-based detection lets us survive path
 * differences (case, trailing slash, .sinapse-ai relocation).
 */
function commandReferencesHook(commandStr, hookFilename) {
  if (!commandStr || typeof commandStr !== 'string') return false;
  return commandStr.includes(hookFilename);
}

/**
 * Register all 3 grounding hooks in settings.json.
 *
 * @param {object} opts
 * @param {string} opts.settingsPath  Absolute path to `~/.claude/settings.json`.
 * @param {string} opts.hooksDir      Absolute path to `<install>/.sinapse-ai/hooks`.
 * @param {function} [opts.notify]    Optional logger `(msg) => void`.
 * @returns {{added: string[], skipped: string[], errors: string[]}}
 */
function registerGroundingHooks(opts) {
  const { settingsPath, hooksDir } = opts;
  const notify = typeof opts.notify === 'function' ? opts.notify : () => {};
  const result = { added: [], skipped: [], errors: [] };

  let settings = {};
  try {
    if (fs.existsSync(settingsPath)) {
      const raw = fs.readFileSync(settingsPath, 'utf8');
      settings = raw.trim() ? JSON.parse(raw) : {};
    }
  } catch (err) {
    result.errors.push(`Could not parse ${settingsPath}: ${err.message}`);
    notify(`WARN: skipping grounding hook registration — ${err.message}`);
    return result;
  }

  if (!settings || typeof settings !== 'object') settings = {};
  if (!settings.hooks || typeof settings.hooks !== 'object') settings.hooks = {};
  if (!Array.isArray(settings.hooks.UserPromptSubmit)) settings.hooks.UserPromptSubmit = [];

  // Find or create the matcher block we'll mutate. Prefer an existing block
  // with `matcher === ''` (the default catch-all) so we group with whatever
  // is already there.
  let block = settings.hooks.UserPromptSubmit.find(
    (b) => b && typeof b === 'object' && (b.matcher === '' || b.matcher === undefined || b.matcher === null),
  );
  if (!block) {
    block = { matcher: '', hooks: [] };
    settings.hooks.UserPromptSubmit.push(block);
  }
  if (!Array.isArray(block.hooks)) block.hooks = [];

  for (const hookName of HOOK_FILENAMES) {
    const absHookPath = path.join(hooksDir, hookName);

    // Skip registration if the hook file does not exist on disk — registering
    // a missing file would crash Claude Code on every prompt.
    if (!fs.existsSync(absHookPath)) {
      result.errors.push(`Hook file missing: ${absHookPath}`);
      notify(`WARN: hook file missing, skipping ${hookName}`);
      continue;
    }

    // Idempotency: skip if any existing entry references this filename.
    const alreadyRegistered = settings.hooks.UserPromptSubmit.some((b) => {
      if (!b || !Array.isArray(b.hooks)) return false;
      return b.hooks.some((h) => h && commandReferencesHook(h.command, hookName));
    });

    if (alreadyRegistered) {
      result.skipped.push(hookName);
      continue;
    }

    block.hooks.push(buildHookEntry(absHookPath));
    result.added.push(hookName);
    notify(`Registered hook: ${hookName.replace(/\.cjs$/, '')}`);
  }

  // Persist only if we changed something
  if (result.added.length > 0) {
    try {
      fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
    } catch (err) {
      result.errors.push(`Could not write ${settingsPath}: ${err.message}`);
      notify(`WARN: could not write settings.json — ${err.message}`);
    }
  }

  return result;
}

module.exports = {
  registerGroundingHooks,
  HOOK_FILENAMES,
  HOOK_TIMEOUT_MS,
  // Exposed for tests
  buildHookEntry,
  commandReferencesHook,
};
