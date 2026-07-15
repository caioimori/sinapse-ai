// bin/commands/uninstall.js — `sinapse-ai uninstall` command + manifest helpers.
// Story GA-1.2 — extracted from bin/cli.js.

const fs = require('fs');
const path = require('path');
const { getLogger } = require('../../.sinapse-ai/core/logger');
const {
  HOME,
  SINAPSE_HOME,
  BIN_DIR,
  CYAN,
  GREEN,
  YELLOW,
  RED,
  BOLD,
  NC,
} = require('../lib/constants');
const { header } = require('../lib/header');
const { rmDirSync } = require('../lib/fs-utils');
const { confirmUninstall } = require('../lib/prompts');
const { runSafe } = require('../../.sinapse-ai/core/utils/spawn-safe');

// The installer sets git `core.hooksPath` to this managed dir. On uninstall we
// must unset it — otherwise git keeps pointing at removed hooks and every future
// commit fails with "cannot run hook" (UNINSTALL-GIT-HOOKS, audit 2026-06-11).
const MANAGED_HOOKS_MARKER = path.join('.sinapse-ai', 'git-hooks');

/**
 * Unset git core.hooksPath IF it points at the SINAPSE-managed hooks dir.
 * Only touches our own config — a user's custom hooksPath is left untouched.
 * @param {string} projectDir - Git project directory (default cwd)
 * @returns {Promise<{unset: boolean, value: string|null}>}
 */
async function removeGitHooksConfig(projectDir = process.cwd()) {
  try {
    const get = await runSafe('git', ['-C', projectDir, 'config', '--get', 'core.hooksPath']);
    const value = (get.stdout || '').trim();
    if (!get.success || !value) return { unset: false, value: null };
    // Normalize separators so the marker matches on Windows and POSIX.
    const normalized = value.replace(/\\/g, '/');
    if (!normalized.includes(MANAGED_HOOKS_MARKER.replace(/\\/g, '/'))) {
      return { unset: false, value }; // not ours — leave it alone
    }
    const unset = await runSafe('git', ['-C', projectDir, 'config', '--unset', 'core.hooksPath']);
    return { unset: unset.success, value };
  } catch {
    return { unset: false, value: null };
  }
}

// Story 10.40 — Remove SINAPSE-authored orqx agents from a global agents dir.
// Returns { removed: N } for reporting. Only touches files matching *-orqx.md
// so we don't accidentally remove user-authored agents.
// Audit 1 P0 (UN-1) — install writes ~170 agent files to ~/.claude/agents/ +
// ~/.codex/agents/ but uninstall historically removed only `*-orqx.md` (~18
// files). Files were left orphaned. Fix: install records every authored
// filename in ~/.sinapse/installed-agents.json; uninstall reads that manifest
// and removes only those files (preserving anything the user added by hand).
const INSTALLED_AGENTS_MANIFEST = path.join(SINAPSE_HOME, 'installed-agents.json');

function recordInstalledAgents(filenames, ides) {
  try {
    fs.mkdirSync(SINAPSE_HOME, { recursive: true });
    fs.writeFileSync(INSTALLED_AGENTS_MANIFEST, JSON.stringify({
      version: 1,
      timestamp: new Date().toISOString(),
      ides,
      filenames: [...filenames].sort(),
    }, null, 2));
  } catch { /* non-critical */ }
}

function readInstalledAgentsManifest() {
  try {
    if (!fs.existsSync(INSTALLED_AGENTS_MANIFEST)) return null;
    const raw = fs.readFileSync(INSTALLED_AGENTS_MANIFEST, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.filenames)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function removeInstalledAgentsFrom(dir, manifestOverride = null) {
  if (!fs.existsSync(dir)) return { removed: 0, existed: false };
  let removed = 0;
  let candidates;

  const manifest = manifestOverride || readInstalledAgentsManifest();
  if (manifest && Array.isArray(manifest.filenames)) {
    // Manifest path — surgical removal of exactly what install wrote.
    candidates = manifest.filenames;
  } else {
    // Backward-compat fallback for installs predating the manifest
    // (rc.10 and earlier). Heuristic: SINAPSE-authored files end in
    // `-orqx.md`, OR start with `name: sinapse-` in their frontmatter.
    try {
      candidates = fs.readdirSync(dir).filter((f) => {
        if (f.endsWith('.toml')) {
          try { return /SINAPSE/i.test(fs.readFileSync(path.join(dir, f), 'utf8').slice(0, 4000)); } catch { return false; }
        }
        if (!f.endsWith('.md')) return false;
        if (/-orqx\.md$/.test(f)) return true;
        try {
          const head = fs.readFileSync(path.join(dir, f), 'utf8').slice(0, 600);
          return /^\s*name:\s*sinapse-/im.test(head);
        } catch { return false; }
      });
    } catch { return { removed: 0, existed: true }; }
  }

  for (const f of candidates) {
    const filepath = path.join(dir, f);
    if (!fs.existsSync(filepath)) continue;
    try {
      fs.unlinkSync(filepath);
      removed++;
    } catch { /* best-effort */ }
  }
  return { removed, existed: true };
}

// Backward-compat alias for callers that still import `removeOrqxAgentsFrom`.
// Kept exported until any external consumer migrates. Behavior now identical
// to `removeInstalledAgentsFrom` (delegates to the manifest-aware path).
function removeOrqxAgentsFrom(dir) {
  return removeInstalledAgentsFrom(dir);
}

const MANAGED_GLOBAL_SKILL_IDS = ['snps', 'sinapse', 'snps-orqx', 'sinapse-agent'];
const MANAGED_GLOBAL_SKILL_MARKER = 'SINAPSE-MANAGED:global-skill';

function removeManagedGlobalSkills(home = HOME) {
  let removed = 0;
  for (const skillId of MANAGED_GLOBAL_SKILL_IDS) {
    const skillDir = path.join(home, '.agents', 'skills', skillId);
    const skillPath = path.join(skillDir, 'SKILL.md');
    if (!fs.existsSync(skillPath)) continue;
    try {
      const content = fs.readFileSync(skillPath, 'utf8');
      if (!content.includes(MANAGED_GLOBAL_SKILL_MARKER)) continue;
      fs.unlinkSync(skillPath);
      if (fs.readdirSync(skillDir).length === 0) fs.rmdirSync(skillDir);
      removed++;
    } catch { /* best-effort */ }
  }
  return { removed };
}

function reconcileInstalledAgents(home, desiredFilenames) {
  const manifest = readInstalledAgentsManifest();
  if (!manifest) return { removed: 0 };
  const desired = new Set(desiredFilenames);
  let removed = 0;
  for (const filename of manifest.filenames) {
    if (desired.has(filename)) continue;
    const providerDir = filename.endsWith('.toml')
      ? path.join(home, '.codex', 'agents')
      : path.join(home, '.claude', 'agents');
    const filepath = path.join(providerDir, filename);
    if (!fs.existsSync(filepath)) continue;
    try {
      fs.unlinkSync(filepath);
      removed++;
    } catch { /* best-effort */ }
  }
  return { removed };
}

// Story 10.40 — Strip SINAPSE-owned keys from ~/.claude/settings.json without
// touching anything else the user put there. Safe if the file is missing or
// already clean.
function cleanClaudeSettingsJson(settingsPath) {
  if (!fs.existsSync(settingsPath)) return { touched: false };
  let raw;
  try {
    raw = fs.readFileSync(settingsPath, 'utf8');
  } catch {
    return { touched: false };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { touched: false, invalid: true };
  }
  if (!parsed || typeof parsed !== 'object') return { touched: false };
  let touched = false;
  for (const key of ['language', 'sinapse']) {
    if (Object.prototype.hasOwnProperty.call(parsed, key)) {
      delete parsed[key];
      touched = true;
    }
  }
  if (touched) {
    fs.writeFileSync(settingsPath, JSON.stringify(parsed, null, 2) + '\n');
  }
  return { touched };
}

async function cmdUninstall(opts = {}) {
  const logger = getLogger();
  header();

  // AC 2 — confirmation + TTY guard + --yes flag
  const yes = !!opts.yes;
  if (!yes) {
    if (!process.stdin.isTTY) {
      logger.error(`${RED}Desinstalação em ambiente não-interativo exige --yes.${NC}`);
      logger.error(`Tente: ${CYAN}npx sinapse-ai uninstall --yes${NC}`);
      process.exit(1);
    }
    const confirmed = await confirmUninstall();
    if (!confirmed) {
      logger.always(`\n${YELLOW}Uninstall cancelled.${NC}\n`);
      return;
    }
  }

  logger.always(`${BOLD}Uninstalling Sinapse...${NC}\n`);
  const installedAgentsManifest = readInstalledAgentsManifest();

  // Paths that are fully SINAPSE-owned (directory or launcher file)
  const ownedItems = [
    [SINAPSE_HOME, '~/.sinapse/'],
    [path.join(HOME, '.claude', 'commands', 'SINAPSE'), '~/.claude/commands/SINAPSE/'],
    [path.join(BIN_DIR, 'sinapse'), '~/bin/sinapse'],
    [path.join(BIN_DIR, 'sinapse.cmd'), '~/bin/sinapse.cmd'],
    // Story onda2-p9 — project-level context-engine runtime at cwd (parity
    // with runUninstall in bin/sinapse.js). Fully SINAPSE-generated
    // (constitution derived from .sinapse-ai/constitution.md + sessions/
    // metrics runtime state); regenerated by any future install.
    [path.join(process.cwd(), '.synapse'), './.synapse/ (context engine runtime)'],
  ];

  for (const [p, label] of ownedItems) {
    if (fs.existsSync(p)) {
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        rmDirSync(p);
      } else {
        fs.unlinkSync(p);
      }
      logger.always(`  ${GREEN}✓${NC} Removed ${label}`);
    } else {
      logger.always(`  ${YELLOW}-${NC} ${label} (not found)`);
    }
  }

  // Audit 1 P0 (UN-1) — remove every SINAPSE-authored agent file recorded
  // in ~/.sinapse/installed-agents.json (or fall back to a name heuristic on
  // pre-manifest installs). Previously this only removed `*-orqx.md`.
  const claudeAgentsDir = path.join(HOME, '.claude', 'agents');
  const codexAgentsDir = path.join(HOME, '.codex', 'agents');

  const claudeRemoved = removeInstalledAgentsFrom(claudeAgentsDir, installedAgentsManifest);
  if (!claudeRemoved.existed) {
    logger.always(`  ${YELLOW}-${NC} ~/.claude/agents/ SINAPSE files (dir not found)`);
  } else if (claudeRemoved.removed === 0) {
    logger.always(`  ${YELLOW}-${NC} ~/.claude/agents/ SINAPSE files (none present)`);
  } else {
    logger.always(`  ${GREEN}✓${NC} Removed ~/.claude/agents/ SINAPSE files (${claudeRemoved.removed} files)`);
  }

  const codexRemoved = removeInstalledAgentsFrom(codexAgentsDir, installedAgentsManifest);
  if (!codexRemoved.existed) {
    logger.always(`  ${YELLOW}-${NC} ~/.codex/agents/ SINAPSE files (dir not found)`);
  } else if (codexRemoved.removed === 0) {
    logger.always(`  ${YELLOW}-${NC} ~/.codex/agents/ SINAPSE files (none present)`);
  } else {
    logger.always(`  ${GREEN}✓${NC} Removed ~/.codex/agents/ SINAPSE files (${codexRemoved.removed} files)`);
  }

  // Story 10.40 — clean SINAPSE-owned keys from ~/.claude/settings.json
  const skillsRemoved = removeManagedGlobalSkills(HOME);
  if (skillsRemoved.removed > 0) {
    logger.always(`  ${GREEN}OK${NC} Removed global SINAPSE skills (${skillsRemoved.removed})`);
  } else {
    logger.always(`  ${YELLOW}-${NC} Global SINAPSE skills (none present)`);
  }

  const settingsPath = path.join(HOME, '.claude', 'settings.json');
  const settingsClean = cleanClaudeSettingsJson(settingsPath);
  if (settingsClean.touched) {
    logger.always(`  ${GREEN}✓${NC} Cleaned SINAPSE keys from ~/.claude/settings.json`);
  } else if (settingsClean.invalid) {
    logger.always(`  ${YELLOW}-${NC} ~/.claude/settings.json (invalid JSON, skipped)`);
  } else {
    logger.always(`  ${YELLOW}-${NC} ~/.claude/settings.json (no SINAPSE keys found)`);
  }

  // UNINSTALL-GIT-HOOKS — reset git hooks config so commits keep working.
  const hooksResult = await removeGitHooksConfig(process.cwd());
  if (hooksResult.unset) {
    logger.always(`  ${GREEN}✓${NC} Reset git core.hooksPath (was SINAPSE-managed)`);
  } else if (hooksResult.value) {
    logger.always(`  ${YELLOW}-${NC} git core.hooksPath kept (custom, not SINAPSE-managed)`);
  } else {
    logger.always(`  ${YELLOW}-${NC} git core.hooksPath (not set)`);
  }

  logger.always(`\n${GREEN}Sinapse uninstalled.${NC}`);
  logger.always(`${YELLOW}Note:${NC} PATH entry in shell RC files was not removed. Clean up manually if desired.\n`);
}

module.exports = {
  cmdUninstall,
  recordInstalledAgents,
  readInstalledAgentsManifest,
  removeInstalledAgentsFrom,
  removeOrqxAgentsFrom,
  removeManagedGlobalSkills,
  reconcileInstalledAgents,
  cleanClaudeSettingsJson,
  removeGitHooksConfig,
  INSTALLED_AGENTS_MANIFEST,
};
