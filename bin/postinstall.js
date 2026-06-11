#!/usr/bin/env node

/**
 * SINAPSE Setup Orchestrator (formerly the npm `postinstall` lifecycle hook)
 * @story A.1 - Setup Script & Runtime Dirs
 * @story B.1 - Minimalist Install Output Design
 * @security 2026-06 - NO LONGER wired as an npm `postinstall` hook. Auto-running
 *   code on `npm install` is a supply-chain surface: a compromised publish would
 *   execute on every consumer's machine without any explicit action. Setup is now
 *   EXPLICIT — it runs only via `npm run setup` or as part of `npx sinapse-ai install`,
 *   never automatically. The module's behavior is otherwise unchanged.
 *
 * When invoked, it still skips itself when:
 *   - SINAPSE_SKIP_POSTINSTALL=1 is set (explicit opt-out)
 *   - A known CI env var is present (GITHUB_ACTIONS, CI=true, etc.)
 *   - npm was invoked with --ignore-scripts (native npm behavior, nothing to do here)
 *
 * Execution order (see Story A.1 AC 4):
 *   1. env guard (SINAPSE_SKIP_POSTINSTALL / CI)
 *   2. npm run sync:ide -- --ide claude-code
 *   3. mkdir -p .sinapse/handoffs
 *   4. mkdir -p .sinapse/scratchpad
 *   5. sinapse doctor --quiet (exit code 2 = abort, 0/1 = OK)
 *   6. Minimalist summary (Story B.1): 6-8 lines, friendly PT-BR copy.
 *
 * Output modes (Story B.1):
 *   default   ≤ 8 lines. Minimal, non-technical, Portuguese.
 *   --verbose Full legacy detailed output (step lines, doctor details).
 *   --json    Single JSON object: { status, version, agents, squads, warnings, errors }.
 *
 * Exit codes:
 *   0  success OR non-critical warning (framework operational)
 *   2  critical failure (sync:ide failed, or doctor exit >= 2)
 *
 * Note: exit 1 is NOT used. npm treats any non-zero postinstall exit as
 * `command failed`, which scares users when the install is actually operational.
 * Partial installs (doctor WARN, permission fallback) print the "Instalação
 * parcial" message and exit 0 so `npm install` completes cleanly. Callers that
 * want strict behavior should parse `--json` output and check `status: warn`.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');

// ANSI colors (intentionally minimal — no chalk dep at postinstall time)
const c = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

// ─── Flag detection ──────────────────────────────────────────────────────────
// Postinstall runs under npm, so CLI args come via:
//   - process.argv (rare: node bin/postinstall.js --verbose)
//   - npm_config_loglevel (npm install --verbose sets this to "verbose")
//   - env opt-ins for testing: SINAPSE_VERBOSE=1, SINAPSE_JSON=1
//
// In --json mode ALL human-readable output is suppressed and a single JSON
// object is emitted on exit. In --verbose mode the legacy detailed lines are
// shown. Default mode prints only the 6-8 line minimalist summary.

function detectFlags(argv = process.argv.slice(2), env = process.env) {
  const has = (name) => argv.includes(name);
  const npmLogLevel = (env.npm_config_loglevel || '').toLowerCase();
  const verbose =
    has('--verbose')
    || has('-v')
    || env.SINAPSE_VERBOSE === '1'
    || npmLogLevel === 'verbose'
    || npmLogLevel === 'silly';
  const json = has('--json') || env.SINAPSE_JSON === '1';
  const quiet = has('--quiet') || has('-q') || env.SINAPSE_QUIET === '1';
  return { verbose, json, quiet };
}

// ─── Dynamic counts (Story B.1 AC 1, AC 7) ───────────────────────────────────
// Source of truth is the real filesystem, not the manifest (manifest can drift
// — see Story A.4 G5). We count the actual agent definitions and squad dirs.

/**
 * Count real agent definitions under .sinapse-ai/development/agents/*.md.
 * Fails open (returns 0) on any filesystem error.
 */
function countAgents() {
  try {
    const dir = path.join(PROJECT_ROOT, '.sinapse-ai', 'development', 'agents');
    if (!fs.existsSync(dir)) return 0;
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile() && d.name.endsWith('.md') && !d.name.startsWith('_'))
      .length;
  } catch {
    return 0;
  }
}

/**
 * Count real squad directories under squads/* (skip dotfiles and .gitkeep).
 * A squad is any subdirectory of squads/.
 */
function countSquads() {
  try {
    const dir = path.join(PROJECT_ROOT, 'squads');
    if (!fs.existsSync(dir)) return 0;
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
      .length;
  } catch {
    return 0;
  }
}

/**
 * Read the installed package version. Fails open with "unknown".
 */
function readVersion() {
  try {
    return require(path.join(PROJECT_ROOT, 'package.json')).version || 'unknown';
  } catch {
    return 'unknown';
  }
}

// ─── First-run detection (Story B.1 AC 5) ────────────────────────────────────
// The ~/.sinapse/.first-run-done flag is created on successful first install.
// On subsequent installs the welcome line is suppressed. Flag creation failures
// are non-fatal (welcome shows again on next install — acceptable degradation).

// NOTE: resolved dynamically so tests can redirect HOME/USERPROFILE between runs.
function sinapseHome() {
  return path.join(os.homedir(), '.sinapse');
}
function firstRunFlag() {
  return path.join(sinapseHome(), '.first-run-done');
}

function isFirstRun() {
  try {
    return !fs.existsSync(firstRunFlag());
  } catch {
    return false;
  }
}

function markFirstRunDone() {
  try {
    const home = sinapseHome();
    if (!fs.existsSync(home)) {
      fs.mkdirSync(home, { recursive: true });
    }
    const flag = firstRunFlag();
    if (!fs.existsSync(flag)) {
      fs.writeFileSync(flag, `${new Date().toISOString()}\n`, 'utf8');
    }
    return true;
  } catch {
    return false; // silent — welcome will show again next install
  }
}

// ─── Output sinks (flag-aware) ───────────────────────────────────────────────
// In --json mode, every human-readable call accumulates into jsonState instead
// of writing to stdout. In --verbose mode, step lines are shown. In default
// mode, only the final summary is printed.

const jsonState = {
  status: 'success',
  version: null,
  agents: 0,
  squads: 0,
  warnings: [],
  errors: [],
};

let FLAGS = { verbose: false, json: false, quiet: false };

function plain(s) {
  // Strip ANSI for --json mode (we still want semantic text, no escape codes).
  return String(s).replace(/\x1b\[[0-9;]*m/g, ''); // eslint-disable-line no-control-regex
}

function verboseLog(msg) {
  if (FLAGS.json) return;
  if (!FLAGS.verbose) return;
  process.stdout.write(`${msg}\n`);
}

function warn(msg) {
  if (FLAGS.json) {
    jsonState.warnings.push(plain(msg));
    if (jsonState.status === 'success') jsonState.status = 'warn';
    return;
  }
  if (FLAGS.verbose) {
    process.stdout.write(`${c.yellow}${msg}${c.reset}\n`);
  }
}

function error(msg) {
  if (FLAGS.json) {
    jsonState.errors.push(plain(msg));
    jsonState.status = 'error';
    return;
  }
  // Errors are always shown (even in default minimal mode) because they
  // indicate the install is broken and the user needs to know.
  process.stderr.write(`${c.red}${msg}${c.reset}\n`);
}

/**
 * Return true if we should skip postinstall entirely.
 * Respects SINAPSE_SKIP_POSTINSTALL=1 and common CI signals.
 */
function shouldSkip() {
  if (process.env.SINAPSE_SKIP_POSTINSTALL === '1') {
    return { skip: true, reason: 'SINAPSE_SKIP_POSTINSTALL=1' };
  }
  // Auto-skip on CI unless user explicitly opts in with SINAPSE_FORCE_POSTINSTALL=1.
  // Rationale (Story A.1 Risks): CI pipelines should not have runtime side effects.
  if (process.env.SINAPSE_FORCE_POSTINSTALL === '1') {
    return { skip: false };
  }
  const ciSignals = ['CI', 'GITHUB_ACTIONS', 'GITLAB_CI', 'CIRCLECI', 'TRAVIS', 'JENKINS_URL'];
  for (const key of ciSignals) {
    if (process.env[key]) {
      return { skip: true, reason: `CI detected (${key})` };
    }
  }
  return { skip: false };
}

/**
 * Ensure the project root looks like a real SINAPSE install before we touch anything.
 * Returns false if we should bail out silently (e.g. running from a partial copy).
 */
function isValidInstallRoot() {
  try {
    return fs.existsSync(path.join(PROJECT_ROOT, '.sinapse-ai'));
  } catch {
    return false;
  }
}

/**
 * Spawn a child process and return the raw result. Does NOT throw on non-zero exit.
 * In --json/default mode, child stdio is piped (swallowed) to preserve the minimal
 * output contract. In --verbose mode it is inherited so users see full details.
 */
function run(command, args, opts = {}) {
  const stdio = FLAGS.verbose ? 'inherit' : 'pipe';
  const result = spawnSync(command, args, {
    cwd: PROJECT_ROOT,
    stdio,
    shell: process.platform === 'win32',
    ...opts,
  });
  return result;
}

/**
 * Detect if we're running inside a global npm install.
 * Global installs land in /usr/local/lib/node_modules (Mac/Linux) or
 * %APPDATA%\npm\node_modules (Windows). Agent sync to those paths is pointless
 * — sync:ide must run inside a real project (per-project install).
 */
function isGlobalInstall() {
  if (process.env.npm_config_global === 'true') return true;
  const root = PROJECT_ROOT.replace(/\\/g, '/');
  const globalMarkers = [
    '/lib/node_modules/sinapse-ai',
    '/node_modules/sinapse-ai',
    '/npm/node_modules/sinapse-ai',
  ];
  return globalMarkers.some((m) => root.endsWith(m) || root.includes(m));
}

/**
 * Step 1: sync:ide --ide claude-code.
 * Copies agent definitions to .claude/commands/SINAPSE/agents/ so Claude Code can resolve @developer, etc.
 *
 * Skipped on global installs (no project to sync to). EACCES is treated as a
 * non-critical warning — the user can run `sinapse install` inside their project
 * to complete setup with proper permissions.
 */
function stepSyncIde() {
  if (isGlobalInstall()) {
    verboseLog(`${c.dim}sync:ide pulado (install global — rode 'sinapse install' no seu projeto)${c.reset}`);
    return { ok: true, critical: false, skipped: true };
  }
  verboseLog(`${c.cyan}›${c.reset} Sincronizando agents para Claude Code...`);
  const result = run('npm', ['run', 'sync:ide', '--silent', '--', '--ide', 'claude-code', '--quiet']);
  if (result.error) {
    if (result.error.code === 'EACCES' || result.error.code === 'EPERM') {
      warn("Sem permissão pra sincronizar agents. Rode 'sinapse install' dentro do seu projeto.");
      return { ok: false, critical: false };
    }
    warn(`sync:ide falhou ao iniciar: ${result.error.message} — rode 'sinapse install' no projeto pra completar.`);
    return { ok: false, critical: false };
  }
  if (result.status !== 0) {
    const stderr = result.stderr ? result.stderr.toString() : '';
    if (/EACCES|EPERM|permission denied/i.test(stderr)) {
      warn("Sem permissão pra sincronizar agents (npm global sem write). Rode 'sinapse install' no seu projeto.");
      return { ok: false, critical: false };
    }
    warn(`sync:ide saiu com código ${result.status} — rode 'sinapse install' no projeto pra completar.`);
    return { ok: false, critical: false };
  }
  verboseLog(`${c.green}✓${c.reset} Agents sincronizados`);
  return { ok: true, critical: false };
}

/**
 * Step 2 + 3: create runtime directories (.sinapse/handoffs and .sinapse/scratchpad).
 * Idempotent — no-op if directories already exist.
 * Permission errors are non-critical (warn, continue).
 */
function stepCreateRuntimeDirs() {
  if (isGlobalInstall()) {
    return { ok: true, critical: false, skipped: true };
  }
  const dirs = [
    path.join(PROJECT_ROOT, '.sinapse', 'handoffs'),
    path.join(PROJECT_ROOT, '.sinapse', 'scratchpad'),
  ];
  let softFailures = 0;
  for (const dir of dirs) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (err) {
      if (err.code === 'EACCES' || err.code === 'EPERM') {
        warn(`Sem permissão para criar ${path.relative(PROJECT_ROOT, dir)} — SNPS AI vai tentar criar no primeiro uso.`);
        softFailures += 1;
        continue;
      }
      warn(`Falha ao criar ${dir}: ${err.message} — não-crítico.`);
      softFailures += 1;
      continue;
    }
  }
  if (softFailures === 0) {
    verboseLog(`${c.green}✓${c.reset} Diretórios de runtime prontos (.sinapse/handoffs, .sinapse/scratchpad)`);
  }
  return { ok: softFailures === 0, critical: false };
}

/**
 * Step: generate the SYNAPSE context-engine runtime (.synapse/ domain files).
 * Compiles the L0 constitution domain from .sinapse-ai/constitution.md so the
 * UserPromptSubmit context engine actually injects rules. Without this, the
 * engine is inert (the hook silently emits no context). Tolerant + non-critical:
 * the wrapper always exits 0 and the engine degrades gracefully if absent.
 */
function stepGenerateSynapse() {
  if (isGlobalInstall()) {
    return { ok: true, critical: false, skipped: true };
  }
  verboseLog(`${c.cyan}›${c.reset} Gerando runtime do motor de contexto (.synapse/)...`);
  const script = path.join(PROJECT_ROOT, 'scripts', 'generate-synapse-runtime.js');
  if (!fs.existsSync(script)) {
    return { ok: true, critical: false, skipped: true };
  }
  // Run in-process (not a subprocess) — faster, and keeps the shared run()
  // sequence (sync:ide → doctor) intact for callers/tests. The wrapper's
  // generate() is tolerant and never throws; preserve our own exit code since
  // the underlying generator sets process.exitCode=1 on a miss.
  const savedExit = process.exitCode;
  let ok = false;
  try {
    const { generate } = require(script);
    ok = generate();
  } catch (err) {
    warn(`Geração do .synapse/ falhou: ${err.message} — não-crítico (motor degrada).`);
  } finally {
    process.exitCode = savedExit;
  }
  if (ok) {
    verboseLog(`${c.green}✓${c.reset} Runtime do motor de contexto pronto (.synapse/constitution)`);
  }
  // Always non-critical: the engine degrades gracefully without domains.
  return { ok: true, critical: false };
}

/**
 * Step 4: sinapse doctor --quiet.
 * Exit code semantics (per Story A.1 Dev Notes + Story A.3):
 *   0 = PASS (ok)
 *   1 = WARN only (ok, no abort)
 *   2 = FAIL (critical — abort postinstall with non-zero exit)
 */
function stepDoctor() {
  if (isGlobalInstall()) {
    return { ok: true, critical: false, skipped: true };
  }
  verboseLog(`${c.cyan}›${c.reset} Verificando saúde da instalação...`);
  const doctorBin = path.join(PROJECT_ROOT, 'bin', 'sinapse.js');
  if (!fs.existsSync(doctorBin)) {
    warn('bin/sinapse.js não encontrado — pulando doctor check');
    return { ok: true, critical: false };
  }
  const result = run(process.execPath, [doctorBin, 'doctor', '--quiet']);
  if (result.error) {
    warn(`doctor falhou ao iniciar: ${result.error.message} — não-crítico`);
    return { ok: false, critical: false };
  }
  if (result.status === 0) {
    verboseLog(`${c.green}✓${c.reset} Saúde da instalação: PASS`);
    return { ok: true, critical: false };
  }
  if (result.status === 1) {
    warn("Saúde da instalação: WARN — rode 'sinapse doctor' para detalhes");
    return { ok: false, critical: false };
  }
  // Exit code 2 or anything higher is treated as critical per Story A.1 Dev Notes.
  error(`Saúde da instalação: FAIL (exit ${result.status}) — rode 'sinapse doctor' para detalhes`);
  return { ok: false, critical: true };
}

/**
 * Story B.1 — render the minimalist summary.
 *
 * Default output (≤ 8 lines — the blank lines count):
 *
 *   [Bem-vindo ao SINAPSE! 🎉]  ← only on first run
 *   SINAPSE {version} instalado ✓
 *   {N} agents · {M} squads prontos
 *
 *   Teste:   sinapse doctor
 *   Começar: @sinapse no Claude Code
 *
 *   Docs:    https://sinapse.club
 *
 * In --verbose mode the caller has already printed detailed step output, so we
 * still render the minimal summary at the end as a recap.
 *
 * In --json mode this function populates jsonState and is a no-op on stdout;
 * the caller will flush jsonState at process exit.
 *
 * @param {{ firstRun?: boolean }} [opts]
 * @returns {{ lineCount: number, lines: string[] }}
 */
function renderFinalSummary(opts = {}) {
  const version = readVersion();
  const agents = countAgents();
  const squads = countSquads();
  const firstRun = Boolean(opts.firstRun);

  // Populate JSON state even if we'll never print human output.
  jsonState.version = version;
  jsonState.agents = agents;
  jsonState.squads = squads;
  jsonState.firstRun = firstRun;

  if (FLAGS.json) {
    return { lineCount: 0, lines: [] };
  }
  if (FLAGS.quiet) {
    return { lineCount: 0, lines: [] };
  }

  // Pluralization: Portuguese "agent(s)" / "squad(s)". 1 is singular.
  const agentsWord = agents === 1 ? 'agent' : 'agents';
  const squadsWord = squads === 1 ? 'squad' : 'squads';
  const prontosWord = squads === 1 && agents === 1 ? 'pronto' : 'prontos';

  const isGlobal = isGlobalInstall();
  const lines = [];
  if (firstRun) {
    lines.push(`${c.bold}Bem-vindo ao SNPS AI!${c.reset} 🎉`);
  }
  lines.push(`${c.bold}SNPS AI ${version}${c.reset} instalado ${c.green}✓${c.reset}`);
  if (!isGlobal) {
    lines.push(`${c.dim}${agents} ${agentsWord} · ${squads} ${squadsWord} ${prontosWord}${c.reset}`);
  }
  lines.push('');
  if (isGlobal) {
    lines.push(`Próximo passo:`);
    lines.push(`  cd ${c.cyan}seu-projeto${c.reset}`);
    lines.push(`  ${c.cyan}sinapse install${c.reset}`);
  } else {
    lines.push(`Teste:   ${c.cyan}sinapse doctor${c.reset}`);
    lines.push(`Começar: ${c.cyan}@sinapse${c.reset} no Claude Code`);
  }
  lines.push('');
  lines.push(`Docs:    ${c.dim}https://sinapse.club${c.reset}`);

  for (const line of lines) {
    process.stdout.write(`${line}\n`);
  }

  return { lineCount: lines.length, lines };
}

/**
 * Story C.1 AC 3 — Partial install user message.
 *
 * When postinstall exits with code 1 (warnings) or 2 (failure), show a single
 * non-technical one-liner so the user knows SOMETHING is off and where to look.
 * Suppressed in --quiet and --json modes (exit code alone signals the failure).
 */
function renderPartialInstallMessage() {
  if (FLAGS.json) return;
  if (FLAGS.quiet) return;
  const msg = `${c.yellow}Instalação parcial — rode 'sinapse doctor' pra ver o quê${c.reset}`;
  try {
    process.stdout.write(`${msg}\n`);
  } catch {
    /* ignore */
  }
}

/**
 * Flush the JSON state (single-object output). Safe to call multiple times.
 */
let _jsonFlushed = false;
function flushJson() {
  if (!FLAGS.json || _jsonFlushed) return;
  _jsonFlushed = true;
  try {
    process.stdout.write(`${JSON.stringify(jsonState)}\n`);
  } catch {
    /* ignore */
  }
}

function main(argvOverride) {
  // Reset module-level state so repeated calls (from tests) are isolated.
  FLAGS = detectFlags(argvOverride || process.argv.slice(2));
  jsonState.status = 'success';
  jsonState.version = null;
  jsonState.agents = 0;
  jsonState.squads = 0;
  jsonState.warnings = [];
  jsonState.errors = [];
  jsonState.firstRun = false;
  _jsonFlushed = false;

  const skip = shouldSkip();
  if (skip.skip) {
    verboseLog(`Postinstall skipped (${skip.reason})`);
    if (FLAGS.json) {
      jsonState.status = 'skipped';
      jsonState.skipReason = skip.reason;
      flushJson();
    }
    return 0;
  }

  if (!isValidInstallRoot()) {
    // Silently bail — package may be partially copied or invoked from an unexpected context.
    if (FLAGS.json) {
      jsonState.status = 'skipped';
      jsonState.skipReason = 'not-sinapse-root';
      flushJson();
    }
    return 0;
  }

  verboseLog(`${c.dim}SNPS AI postinstall — configurando ambiente...${c.reset}`);

  const syncIde = stepSyncIde();
  if (syncIde.critical) {
    renderPartialInstallMessage();
    if (FLAGS.json) flushJson();
    return 2;
  }

  const runtimeDirs = stepCreateRuntimeDirs();
  if (runtimeDirs.critical) {
    renderPartialInstallMessage();
    if (FLAGS.json) flushJson();
    return 2;
  }

  // Compile the SYNAPSE context-engine runtime (.synapse/). Non-critical.
  const synapseGen = stepGenerateSynapse();

  const doctor = stepDoctor();
  if (doctor.critical) {
    renderPartialInstallMessage();
    if (FLAGS.json) flushJson();
    return 2;
  }

  // Capture first-run BEFORE creating the flag file so the welcome line shows
  // on this install only.
  const firstRun = isFirstRun();

  // Render the minimalist summary (Story B.1 AC 1, AC 4, AC 7).
  renderFinalSummary({ firstRun });

  // Mark first-run AFTER the summary so a crash during rendering does not
  // suppress the welcome line on the next attempt.
  if (firstRun) {
    markFirstRunDone();
  }

  // Non-critical warnings: show user the "partial install" message but exit 0
  // so `npm install` does not report `command failed`. Critical failures have
  // already returned 2 above. The `--json` output still carries `status: warn`
  // for pipelines that want to act on it. [Story 10.39]
  if (!syncIde.ok || !runtimeDirs.ok || !synapseGen.ok || !doctor.ok) {
    renderPartialInstallMessage();
    if (FLAGS.json) {
      if (jsonState.status === 'success') jsonState.status = 'warn';
      flushJson();
    }
    return 0;
  }

  if (FLAGS.json) flushJson();
  return 0;
}

// Export for unit tests; only run if invoked directly.
module.exports = {
  main,
  detectFlags,
  shouldSkip,
  isGlobalInstall,
  isValidInstallRoot,
  stepSyncIde,
  stepCreateRuntimeDirs,
  stepGenerateSynapse,
  stepDoctor,
  renderFinalSummary,
  renderPartialInstallMessage,
  countAgents,
  countSquads,
  readVersion,
  isFirstRun,
  markFirstRunDone,
  flushJson,
  sinapseHome,
  firstRunFlag,
  _getJsonState: () => jsonState,
  _getFlags: () => FLAGS,
  _setFlags: (f) => { FLAGS = { ...FLAGS, ...f }; },
};

if (require.main === module) {
  try {
    const code = main();
    process.exit(code);
  } catch (err) {
    error(`Postinstall falhou inesperadamente: ${err && err.stack ? err.stack : err}`);
    // Non-critical — don't block the install on unexpected errors.
    process.exit(0);
  }
}
