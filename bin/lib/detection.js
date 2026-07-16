// bin/lib/detection.js — install detection, staleness, interactive-mode.
// Story GA-1.2 — extracted from bin/cli.js.

const fs = require('fs');
const path = require('path');
const { HOME, SINAPSE_HOME, YELLOW, DIM, NC } = require('./constants');

// detectExistingInstall — Story 10.20
// Returns { upsert: true, prevMeta, language, llm } when ~/.sinapse/metadata.json
// exists, or { upsert: false } otherwise. Reads ~/.claude/settings.json for
// language reuse.
function detectExistingInstall() {
  const metaPath = path.join(SINAPSE_HOME, 'metadata.json');
  if (!fs.existsSync(metaPath)) return { upsert: false };
  let prevMeta = null;
  try {
    prevMeta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch {
    return { upsert: false };
  }
  let language = null;
  try {
    const settingsPath = path.join(HOME, '.claude', 'settings.json');
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      if (settings && typeof settings.language === 'string') {
        language = settings.language === 'portuguese' ? 'pt' : (settings.language === 'english' ? 'en' : null);
      }
    }
  } catch { /* fall through */ }
  return {
    upsert: true,
    prevMeta,
    language,
    llm: prevMeta && typeof prevMeta.llm === 'string' ? prevMeta.llm : null,
  };
}

// Story 10.40 — Compare installed vs executing version. Returns:
//   { kind: 'none' }     — versions equal or undetectable
//   { kind: 'stale' }    — installed < executing (normal update path)
//   { kind: 'ahead' }    — installed > executing (npx cache likely stale)
function detectStaleness(installedVersion, executingVersion) {
  if (!installedVersion || !executingVersion) return { kind: 'none' };
  if (installedVersion === executingVersion) return { kind: 'none' };
  let semver;
  try {
    semver = require('semver');
  } catch {
    return { kind: 'none' };
  }
  try {
    const iv = semver.valid(semver.coerce(installedVersion)) ? installedVersion : null;
    const ev = semver.valid(semver.coerce(executingVersion)) ? executingVersion : null;
    if (!iv || !ev) return { kind: 'none' };
    if (semver.lt(iv, ev)) return { kind: 'stale' };
    if (semver.gt(iv, ev)) return { kind: 'ahead' };
    return { kind: 'none' };
  } catch {
    return { kind: 'none' };
  }
}

// Story 10.46 — multi-signal interactive-mode detection. Avoids the Git Bash +
// Windows trap where `process.stdin.isTTY === undefined`. Honors CI env vars and
// explicit `--yes` / `--non-interactive` overrides; `--interactive` forces on.
function detectInteractiveMode(argv = process.argv) {
  if (argv.includes('--interactive')) return true;
  if (argv.includes('--non-interactive')) return false;
  if (argv.includes('--yes') || argv.includes('-y')) return false;
  if (process.env.CI === 'true') return false;
  if (process.env.GITHUB_ACTIONS === 'true') return false;
  if (process.env.npm_config_yes === 'true') return false;
  return Boolean(process.stdin.isTTY || process.stdout.isTTY);
}

// Story 10.46 — emit non-interactive warning at most once per CLI invocation so
// users always know defaults were applied silently (was invisible pre-fix).
let nonInteractiveWarned = false;
function warnNonInteractive() {
  if (nonInteractiveWarned) return;
  nonInteractiveWarned = true;
  // stderr so it never pollutes stdout consumers (CI logs, pipes).
  process.stderr.write(
    `${YELLOW}INFO${NC} ambiente nao-interativo detectado, usando defaults pt + Claude Code + Codex ` +
    `${DIM}(use --interactive pra forcar prompts)${NC}\n`,
  );
}

// Story 10.46 — detect first-time use so `npx sinapse-ai` (no args) can hint at
// `install` instead of dumping help. Considered "first run" when neither the
// global metadata nor a local project install is present in the cwd.
function isFirstRun() {
  try {
    if (fs.existsSync(path.join(SINAPSE_HOME, 'metadata.json'))) return false;
    if (fs.existsSync(path.join(process.cwd(), '.sinapse-ai'))) return false;
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  detectExistingInstall,
  detectStaleness,
  detectInteractiveMode,
  warnNonInteractive,
  isFirstRun,
};
