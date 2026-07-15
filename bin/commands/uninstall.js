// bin/commands/uninstall.js — `sinapse-ai uninstall` command + manifest helpers.
// Story GA-1.2 — extracted from bin/cli.js.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const legacyClaudeCommandHashes = require('../../packages/installer/src/migrations/legacy-claude-agent-command-hashes.json');
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

function installedAgentsManifestPath(home = HOME) {
  return home === HOME
    ? INSTALLED_AGENTS_MANIFEST
    : path.join(home, '.sinapse', 'installed-agents.json');
}

function digestFile(filePath) {
  try {
    return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
  } catch {
    return null;
  }
}

function providerAgentPath(home, provider, filename) {
  const providerDir = provider === 'codex'
    ? path.join(home, '.codex', 'agents')
    : path.join(home, '.claude', 'agents');
  return path.join(providerDir, filename);
}

function inferProviderFromAgentDir(dir) {
  const normalized = path.resolve(dir).replace(/\\/g, '/').toLowerCase();
  if (normalized.includes('/.codex/agents')) return 'codex';
  if (normalized.includes('/.claude/agents')) return 'claude-code';
  return null;
}

function recordInstalledAgents(filenames, ides, home = HOME) {
  try {
    const manifestPath = installedAgentsManifestPath(home);
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    const artifacts = [...filenames].map((filename) => {
      const provider = filename.endsWith('.toml') ? 'codex' : 'claude-code';
      return {
        provider,
        filename,
        sha256: digestFile(providerAgentPath(home, provider, filename)),
      };
    });
    fs.writeFileSync(manifestPath, JSON.stringify({
      version: 2,
      timestamp: new Date().toISOString(),
      ides,
      filenames: [...filenames].sort(),
      artifacts: artifacts.sort((a, b) => `${a.provider}/${a.filename}`.localeCompare(`${b.provider}/${b.filename}`)),
    }, null, 2));
  } catch { /* non-critical */ }
}

function readInstalledAgentsManifest(home = HOME) {
  try {
    const manifestPath = installedAgentsManifestPath(home);
    if (!fs.existsSync(manifestPath)) return null;
    const raw = fs.readFileSync(manifestPath, 'utf8');
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
  const manifest = manifestOverride || readInstalledAgentsManifest();
  const provider = inferProviderFromAgentDir(dir);
  let candidates;

  if (manifest?.version >= 2 && Array.isArray(manifest.artifacts)) {
    candidates = manifest.artifacts.filter((artifact) => {
      if (!artifact || typeof artifact.filename !== 'string') return false;
      return provider ? artifact.provider === provider : true;
    });
  } else {
    // Legacy manifests did not record provider or digests. Ownership must be
    // proven by the marker in the actual provider directory before deletion.
    const filenames = Array.isArray(manifest?.filenames)
      ? manifest.filenames
      : fs.readdirSync(dir);
    candidates = filenames.map((filename) => ({ filename, sha256: null, legacy: true }));
  }

  for (const { filename, sha256, legacy } of candidates) {
    const filepath = path.join(dir, filename);
    if (!fs.existsSync(filepath)) continue;
    try {
      if (sha256) {
        if (digestFile(filepath) !== sha256) continue;
      } else {
        // A v2 entry without a digest does not prove the installer wrote it.
        if (!legacy) continue;
        const content = fs.readFileSync(filepath, 'utf8');
        if (!content.includes('SINAPSE-MANAGED:global-agent')) continue;
      }
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

const MANAGED_GLOBAL_SKILL_IDS = ['snps', 'sinapse', 'snps-orqx', 'sinapse-orqx', 'sinapse-agent', 'react-bits-frontend'];
const MANAGED_GLOBAL_SKILL_MARKER = 'SINAPSE-MANAGED:global-skill';

function removeManagedGlobalSkills(home = HOME, options = {}) {
  let removed = 0;
  const providers = options.providers || ['codex', 'claude-code'];
  const skillRoots = [];
  if (providers.includes('codex')) skillRoots.push(path.join(home, '.agents', 'skills'));
  if (providers.includes('claude-code')) skillRoots.push(path.join(home, '.claude', 'skills'));
  for (const skillsRoot of skillRoots) {
    for (const skillId of MANAGED_GLOBAL_SKILL_IDS) {
      const skillDir = path.join(skillsRoot, skillId);
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
  }
  return { removed };
}

function reconcileInstalledAgents(home, desiredFilenames) {
  const manifest = readInstalledAgentsManifest(home);
  const desired = new Set(desiredFilenames);
  const desiredByProvider = {
    'claude-code': new Set([...desired].filter((name) => name.endsWith('.md'))),
    codex: new Set([...desired].filter((name) => name.endsWith('.toml'))),
  };
  let removed = 0;
  const legacyArtifacts = (manifest?.filenames || []).map((filename) => ({
    provider: filename.endsWith('.toml') ? 'codex' : 'claude-code',
    filename,
    sha256: null,
  }));
  const manifestArtifacts = Array.isArray(manifest?.artifacts) ? manifest.artifacts : legacyArtifacts;
  const manifestOwned = new Set(manifestArtifacts.map(({ provider, filename }) => `${provider}/${filename}`));
  const versionedOwned = new Set(Array.isArray(manifest?.artifacts)
    ? manifestArtifacts.map(({ provider, filename }) => `${provider}/${filename}`)
    : []);
  const managedMarker = 'SINAPSE-MANAGED:global-agent';
  for (const { provider, filename, sha256 } of manifestArtifacts) {
    if (!desiredByProvider[provider] || desiredByProvider[provider].has(filename)) continue;
    const filepath = providerAgentPath(home, provider, filename);
    if (!fs.existsSync(filepath)) continue;
    try {
      const content = fs.readFileSync(filepath, 'utf8');
      const digestMatches = Boolean(sha256) && digestFile(filepath) === sha256;
      const legacyMarkerMatches = !Array.isArray(manifest?.artifacts) && content.includes(managedMarker);
      if (sha256 ? !digestMatches : !legacyMarkerMatches) continue;
      fs.unlinkSync(filepath);
      removed++;
    } catch { /* best-effort */ }
  }

  for (const [provider, providerDir, extension] of [
    ['claude-code', path.join(home, '.claude', 'agents'), '.md'],
    ['codex', path.join(home, '.codex', 'agents'), '.toml'],
    ['codex', path.join(home, '.codex', 'agents'), '.md'],
  ]) {
    if (!fs.existsSync(providerDir)) continue;
    for (const filename of fs.readdirSync(providerDir).filter((name) => name.endsWith(extension))) {
      if (desiredByProvider[provider].has(filename)) continue;
      const filepath = path.join(providerDir, filename);
      try {
        const content = fs.readFileSync(filepath, 'utf8');
        if (versionedOwned.has(`${provider}/${filename}`)) continue;
        if (!manifestOwned.has(`${provider}/${filename}`) && !content.includes(managedMarker)) continue;
        // A manifest entry alone is not proof of current ownership: users can
        // replace a formerly managed file. Only marked artifacts reach this
        // sweep; exact recorded content was handled by the digest path above.
        if (!content.includes(managedMarker)) continue;
        fs.unlinkSync(filepath);
        removed++;
      } catch { /* best-effort */ }
    }
  }

  const legacyCommands = path.join(home, '.claude', 'commands', 'SINAPSE', 'agents');
  let legacyCommandDirectoryRemoved = false;
  let legacyCommandsRemoved = 0;
  let legacyCommandsPreserved = 0;
  if (fs.existsSync(legacyCommands)) {
    for (const entry of fs.readdirSync(legacyCommands, { withFileTypes: true })) {
      const filePath = path.join(legacyCommands, entry.name);
      if (!entry.isFile()) {
        legacyCommandsPreserved++;
        continue;
      }
      try {
        const content = fs.readFileSync(filePath);
        const digest = crypto.createHash('sha256').update(content).digest('hex');
        const knownHashes = legacyClaudeCommandHashes.files[entry.name] || [];
        if (!knownHashes.includes(digest)) {
          legacyCommandsPreserved++;
          continue;
        }
        fs.unlinkSync(filePath);
        legacyCommandsRemoved++;
      } catch {
        legacyCommandsPreserved++;
      }
    }
    try {
      if (fs.readdirSync(legacyCommands).length === 0) {
        fs.rmdirSync(legacyCommands);
        legacyCommandDirectoryRemoved = true;
      }
    } catch { /* best-effort */ }
  }
  return {
    removed,
    legacyCommandDirectoryRemoved,
    legacyCommandsRemoved,
    legacyCommandsPreserved,
  };
}

function hasManagedInstalledAgents(home = HOME) {
  const manifest = readInstalledAgentsManifest(home);
  if (!manifest) {
    for (const [providerDir, extensions] of [
      [path.join(home, '.claude', 'agents'), new Set(['.md'])],
      [path.join(home, '.codex', 'agents'), new Set(['.toml', '.md'])],
    ]) {
      try {
        for (const filename of fs.readdirSync(providerDir)) {
          if (!extensions.has(path.extname(filename))) continue;
          try {
            const content = fs.readFileSync(path.join(providerDir, filename), 'utf8');
            if (content.includes('SINAPSE-MANAGED:global-agent')) return true;
          } catch { /* unreadable or non-regular entries are not evidence */ }
        }
      } catch { /* missing or unreadable provider dir */ }
    }
    return false;
  }
  const versioned = Array.isArray(manifest?.artifacts);
  const artifacts = versioned
    ? manifest.artifacts
    : (manifest?.filenames || []).map((filename) => ({
      provider: filename.endsWith('.toml') ? 'codex' : 'claude-code',
      filename,
      sha256: null,
    }));
  return artifacts.some(({ provider, filename, sha256 }) => {
    const filePath = providerAgentPath(home, provider, filename);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return sha256
        ? digestFile(filePath) === sha256
        : !versioned && content.includes('SINAPSE-MANAGED:global-agent');
    } catch {
      return false;
    }
  });
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
  hasManagedInstalledAgents,
  cleanClaudeSettingsJson,
  removeGitHooksConfig,
  INSTALLED_AGENTS_MANIFEST,
};
