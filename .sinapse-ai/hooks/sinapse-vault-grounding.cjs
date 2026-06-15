#!/usr/bin/env node
'use strict';

/**
 * SINAPSE Vault Grounding Hook — UserPromptSubmit (framework-shipped).
 *
 * @story GA-1.6
 *
 * Reads `~/.claude/sinapse-ai-config.yaml` (Story 10.47 schema) and, if the
 * `vault` section is enabled, injects `<vault-grounding>` context into the
 * Claude Code prompt. Closes the gap left by Story 10.47 (which shipped the
 * wizard + library hooks but no executable Claude Code hooks).
 *
 * Coexistence with personal hooks: this file lives at
 *   .sinapse-ai/hooks/sinapse-vault-grounding.cjs
 * and reads `sinapse-ai-config.yaml`. The user's personal
 * `~/.claude/hooks/vault-grounding.cjs` (if present) reads `vault-routing.json`. The two
 * files do not collide (different filenames, different config sources, and
 * fail-open guarantees that running both is safe).
 *
 * Contract:
 *   stdin  : JSON `{ "prompt": "...", "session_id": "...", "cwd": "..." }`
 *   stdout : JSON `{ "hookSpecificOutput": { "hookEventName":
 *            "UserPromptSubmit", "additionalContext": "<vault-grounding>...</vault-grounding>" } }`
 *   exit 0 always (fail-open: silent on every error path).
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const HOOK_TIMEOUT_MS = 3500;
const MAX_INJECTION_SIZE = 6000; // chars
const MAX_NOTES = 5;
const MAX_NOTE_PREVIEW = 500; // chars per note
const MIN_PROMPT_CHARS = 10;
const CONFIG_PATH = path.join(os.homedir(), '.claude', 'sinapse-ai-config.yaml');

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    let settled = false;
    const finish = (val) => { if (!settled) { settled = true; resolve(val); } };
    try {
      process.stdin.setEncoding('utf8');
      process.stdin.on('error', () => finish(null));
      process.stdin.on('data', (chunk) => { data += chunk; });
      process.stdin.on('end', () => {
        try { finish(JSON.parse(data)); } catch { finish(null); }
      });
    } catch {
      finish(null);
    }
  });
}

// Story 10.47: delegate to the shared grounding config loader instead of
// duplicating the read+parse. The require is guarded so the hook stays
// fail-open even if the shared module is somehow absent at runtime.
function loadConfig() {
  try {
    return require('../core/grounding/config-loader.cjs').loadGroundingConfig(CONFIG_PATH);
  } catch {
    return null;
  }
}

function getSection(cfg, name) {
  if (!cfg || !cfg.grounding) return null;
  const s = cfg.grounding[name];
  if (!s || typeof s !== 'object' || !s.enabled) return null;
  return s;
}

/**
 * Pick top-N markdown notes from the vault root, ranked by mtime descending.
 * Returns [{ name, content }]. Truncates each note to MAX_NOTE_PREVIEW chars.
 */
function pickNotes(vaultPath) {
  try {
    if (!vaultPath || !fs.existsSync(vaultPath)) return [];
    const stat = fs.statSync(vaultPath);
    if (!stat.isDirectory()) return [];

    const entries = fs.readdirSync(vaultPath, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.md'))
      .map((e) => {
        const full = path.join(vaultPath, e.name);
        try {
          const s = fs.statSync(full);
          return { name: e.name, full, mtime: s.mtimeMs };
        } catch { return null; }
      })
      .filter(Boolean);

    entries.sort((a, b) => b.mtime - a.mtime);

    const notes = [];
    for (const ent of entries.slice(0, MAX_NOTES)) {
      try {
        let content = fs.readFileSync(ent.full, 'utf8');
        if (content.length > MAX_NOTE_PREVIEW) {
          content = content.substring(0, MAX_NOTE_PREVIEW) + '\n[...truncated...]';
        }
        notes.push({ name: ent.name, content });
      } catch { /* skip unreadable */ }
    }
    return notes;
  } catch {
    return [];
  }
}

function buildInjection(section, notes) {
  const domain = (Array.isArray(section.domains) && section.domains.length)
    ? section.domains.join(',')
    : 'default';
  const parts = [];
  parts.push(`<vault-grounding domain="${domain}" mode="summary" vault="${section.path}">`);
  parts.push('Indice do vault (top notas mais recentes):');
  if (notes.length === 0) {
    parts.push('(nenhuma nota .md encontrada no path do vault)');
  } else {
    for (const n of notes) {
      parts.push(`--- ${n.name} ---`);
      parts.push(n.content);
    }
  }
  parts.push('</vault-grounding>');

  let full = parts.join('\n');
  if (full.length > MAX_INJECTION_SIZE) {
    const trailer = '\n[...truncated...]\n</vault-grounding>';
    full = full.substring(0, MAX_INJECTION_SIZE - trailer.length) + trailer;
  }
  return full;
}

async function main() {
  const input = await readStdin();
  if (!input || typeof input !== 'object') return;

  const userPrompt = input.prompt || input.user_prompt || input.message || '';
  if (typeof userPrompt !== 'string' || userPrompt.trim().length < MIN_PROMPT_CHARS) return;

  // Anti-double-injection: if the prompt already contains <vault-grounding>,
  // assume another hook (or a previous run) has already injected it.
  if (userPrompt.includes('<vault-grounding')) return;

  const cfg = loadConfig();
  const section = getSection(cfg, 'vault');
  if (!section || !section.path) return;

  const notes = pickNotes(section.path);
  const context = buildInjection(section, notes);

  const output = JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: context,
    },
  });

  await new Promise((resolve) => {
    let settled = false;
    const finish = () => { if (!settled) { settled = true; resolve(); } };
    try {
      const flushed = process.stdout.write(output, () => finish());
      if (flushed) setImmediate(finish);
    } catch {
      finish();
    }
  });
}

function run() {
  const timer = setTimeout(() => process.exit(0), HOOK_TIMEOUT_MS);
  timer.unref();
  main()
    .then(() => { clearTimeout(timer); process.exitCode = 0; })
    .catch(() => { clearTimeout(timer); process.exitCode = 0; });
}

if (require.main === module) run();

module.exports = {
  // Exposed for tests — the executable contract is stdin/stdout.
  loadConfig,
  getSection,
  pickNotes,
  buildInjection,
  CONFIG_PATH,
  MAX_INJECTION_SIZE,
};
