/**
 * Chrome Brain CLI Module
 * Provides `sinapse chrome-brain install|uninstall|status` commands
 *
 * Story 7.4.1: Chrome Brain Productization
 * @module chrome-brain-installer
 */

'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');
const { atomicWriteFileSync } = require('../lib/fs-utils');

// ============================================================================
// Constants
// ============================================================================

const HOME = os.homedir();
const SINAPSE_DIR = path.join(HOME, '.sinapse');
const SCRIPTS_DIR = path.join(HOME, '.local', 'bin');
const CLAUDE_SETTINGS = path.join(HOME, '.claude', 'settings.json');
const CLAUDE_JSON = path.join(HOME, '.claude.json');

// Node scripts shipped today — cross-platform, run hidden (no console window),
// and never kill a healthy Chrome.
const NODE_SCRIPTS = ['chrome-ensure.cjs', 'chrome-brain-log.cjs'];
// Legacy bash scripts from older installs — proactively removed on (re)install
// and uninstall so they stop popping console windows on Windows.
const LEGACY_SCRIPTS = ['chrome-ensure', 'chrome-debug', 'chrome-brain-log'];
// Pinned MCP version (no `@latest` drift).
const MCP_CHROME_DEVTOOLS_VERSION = '1.4.0';
// Runtime config the Node scripts read (chrome path, port, profile).
const CHROME_BRAIN_CONFIG = path.join(SINAPSE_DIR, 'chrome-brain.json');

const SQUAD_INTEGRATIONS = [
  'squad-animations', 'squad-design', 'squad-cloning', 'squad-claude',
  'squad-paidmedia', 'squad-growth', 'squad-content', 'squad-copy',
  'squad-research', 'squad-cybersecurity', 'squad-commercial',
  'squad-brand', 'squad-storytelling', 'squad-product',
];

// ============================================================================
// Helpers
// ============================================================================

function green(text) { return `\x1b[32m${text}\x1b[0m`; }
function red(text) { return `\x1b[31m${text}\x1b[0m`; }
function yellow(text) { return `\x1b[33m${text}\x1b[0m`; }
function cyan(text) { return `\x1b[36m${text}\x1b[0m`; }
function bold(text) { return `\x1b[1m${text}\x1b[0m`; }

function ok(msg) { console.log(`  ${green('[OK]')} ${msg}`); }
function fail(msg) { console.log(`  ${red('[FAIL]')} ${msg}`); }
function warn(msg) { console.log(`  ${yellow('[WARN]')} ${msg}`); }
function info(msg) { console.log(`  ${cyan('[INFO]')} ${msg}`); }
function step(msg) { console.log(`\n${bold(msg)}`); }

// ============================================================================
// OS & Chrome Detection
// ============================================================================

function detectPlatform() {
  const platform = process.platform;
  if (platform === 'darwin') return 'macos';
  if (platform === 'win32') return 'windows';
  // Check WSL
  try {
    if (process.env.WSL_DISTRO_NAME) return 'wsl';
    const procVersion = fs.readFileSync('/proc/version', 'utf8').toLowerCase();
    if (procVersion.includes('microsoft') || procVersion.includes('wsl')) return 'wsl';
  } catch { /* not WSL */ }
  if (platform === 'linux') return 'linux';
  return 'unknown';
}

function detectChrome() {
  const platform = detectPlatform();
  const candidates = [];

  if (platform === 'macos') {
    candidates.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
    candidates.push('/Applications/Chromium.app/Contents/MacOS/Chromium');
  } else if (platform === 'windows') {
    const pf = process.env.PROGRAMFILES || 'C:\\Program Files';
    const pf86 = process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)';
    const localAppData = process.env.LOCALAPPDATA || path.join(HOME, 'AppData', 'Local');
    candidates.push(path.join(pf, 'Google', 'Chrome', 'Application', 'chrome.exe'));
    candidates.push(path.join(pf86, 'Google', 'Chrome', 'Application', 'chrome.exe'));
    candidates.push(path.join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe'));
  } else {
    // Linux / WSL
    const linuxCandidates = [
      'google-chrome', 'google-chrome-stable', 'chromium-browser', 'chromium',
    ];
    for (const cmd of linuxCandidates) {
      try {
        const result = execSync(`which ${cmd} 2>/dev/null`, { encoding: 'utf8' }).trim();
        if (result) candidates.push(result);
      } catch { /* not found */ }
    }
    candidates.push('/usr/bin/google-chrome');
    candidates.push('/usr/bin/google-chrome-stable');
    candidates.push('/usr/bin/chromium-browser');
    candidates.push('/usr/bin/chromium');
    candidates.push('/snap/bin/chromium');
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

// ============================================================================
// JSON Merge (safe, no python3)
// ============================================================================

function readJson(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (error) {
    warn(`Could not parse ${filePath}: ${error.message}`);
  }
  return {};
}

function writeJson(filePath, data) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  // Atomic (tmp+rename): these are user config files (settings.json, .mcp.json)
  atomicWriteFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function mergeHooks(settingsPath, hookDefs) {
  const settings = readJson(settingsPath);
  if (!settings.hooks) settings.hooks = {};

  const hookKey = (matcher, entry) => {
    const cmd = entry?.hooks?.[0]?.command || '';
    return `${matcher}::${cmd}`;
  };
  for (const [hookType, hookList] of Object.entries(hookDefs)) {
    const existing = settings.hooks[hookType] || [];
    const newKeys = new Set(hookList.map(h => hookKey(h.matcher, h)));
    // Dedupe by (matcher + command) so SessionStart matcher="" doesn't
    // collide with other modules' SessionStart hooks (e.g. another
    // session-start grounding hook).
    const filtered = existing.filter(e => !newKeys.has(hookKey(e.matcher, e)));
    filtered.push(...hookList);
    settings.hooks[hookType] = filtered;
  }

  writeJson(settingsPath, settings);
}

function removeHooks(settingsPath, matchers) {
  const settings = readJson(settingsPath);
  if (!settings.hooks) return;

  for (const hookType of Object.keys(settings.hooks)) {
    settings.hooks[hookType] = (settings.hooks[hookType] || []).filter(e => {
      // Drop entries whose matcher is in the explicit list
      if (matchers.includes(e.matcher)) return false;
      // Also drop SessionStart entries owned by Chrome Brain (identify by command)
      if (hookType === 'SessionStart') {
        const cmd = e?.hooks?.[0]?.command || '';
        if (/chrome-ensure/i.test(cmd)) return false;
      }
      return true;
    });
    if (settings.hooks[hookType].length === 0) {
      delete settings.hooks[hookType];
    }
  }

  if (Object.keys(settings.hooks).length === 0) {
    delete settings.hooks;
  }

  writeJson(settingsPath, settings);
}

// ============================================================================
// Install
// ============================================================================

function installScripts(chromePath, platform) {
  step('Installing scripts...');

  const scriptsDir = platform === 'windows'
    ? path.join(SINAPSE_DIR, 'bin')
    : SCRIPTS_DIR;

  fs.mkdirSync(scriptsDir, { recursive: true });

  // Remove legacy extensionless bash scripts from older installs — on Windows
  // they spawned a console window and could not run reliably.
  for (const dir of [scriptsDir, SCRIPTS_DIR, path.join(SINAPSE_DIR, 'bin')]) {
    for (const name of LEGACY_SCRIPTS) {
      try {
        const p = path.join(dir, name);
        if (fs.existsSync(p)) fs.unlinkSync(p);
      } catch { /* best-effort */ }
    }
  }

  // Copy the cross-platform Node scripts from the template package.
  const templateDir = findTemplateDir();
  const srcDir = templateDir ? path.join(templateDir, 'scripts') : null;
  for (const name of NODE_SCRIPTS) {
    const dest = path.join(scriptsDir, name);
    const src = srcDir ? path.join(srcDir, name) : null;
    if (src && fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      try { fs.chmodSync(dest, 0o755); } catch { /* no-op on Windows */ }
      ok(`${name} -> ${dest}`);
    } else {
      warn(`${name} template not found — skipped`);
    }
  }

  // Write the runtime config the Node scripts read.
  const config = {
    chromePath,
    port: 9222,
    profile: path.join(HOME, '.chrome-debug-profile'),
  };
  writeJson(CHROME_BRAIN_CONFIG, config);
  ok(`config -> ${CHROME_BRAIN_CONFIG}`);

  return scriptsDir;
}

// Remove every legacy / duplicate Chrome Brain hook before re-adding the clean
// canonical set. Self-healing: fixes installs that accumulated a SessionStart
// auto-launch, extensionless bash commands, or duplicate regex matchers.
function cleanLegacyChromeHooks(settingsPath) {
  const settings = readJson(settingsPath);
  if (!settings.hooks) return;
  const isChromeCmd = (cmd) => /chrome-ensure|chrome-brain-log/i.test(cmd || '');
  const isChromeMatcher = (m) => /chrome-devtools|claude-in-chrome|dev-browser/i.test(m || '');

  for (const type of Object.keys(settings.hooks)) {
    let arr = settings.hooks[type] || [];
    if (type === 'SessionStart') {
      // Strip ONLY chrome commands from SessionStart; keep co-located hooks.
      arr = arr
        .map((e) => {
          if (Array.isArray(e.hooks)) e.hooks = e.hooks.filter((h) => !isChromeCmd(h && h.command));
          return e;
        })
        .filter((e) => Array.isArray(e.hooks) && e.hooks.length > 0);
    } else {
      arr = arr.filter((e) => {
        const cmd = e && e.hooks && e.hooks[0] && e.hooks[0].command;
        if (isChromeCmd(cmd)) return false;
        if ((type === 'PreToolUse' || type === 'PostToolUse') && isChromeMatcher(e.matcher)) return false;
        return true;
      });
    }
    if (arr.length === 0) delete settings.hooks[type];
    else settings.hooks[type] = arr;
  }
  if (settings.hooks && Object.keys(settings.hooks).length === 0) delete settings.hooks;
  writeJson(settingsPath, settings);
}

function installHooks() {
  step('Merging hooks into ~/.claude/settings.json...');

  // 1) Clean any legacy / duplicate chrome hooks first (idempotent self-heal).
  try { cleanLegacyChromeHooks(CLAUDE_SETTINGS); } catch { /* best-effort */ }

  const binDir = detectPlatform() === 'windows'
    ? path.join(SINAPSE_DIR, 'bin')
    : SCRIPTS_DIR;
  const ensure = path.join(binDir, 'chrome-ensure.cjs').replace(/\\/g, '/');
  const log = path.join(binDir, 'chrome-brain-log.cjs').replace(/\\/g, '/');
  const nodeCmd = (p) => `node "${p}"`;
  const matchers = ['mcp__chrome-devtools__*', 'mcp__claude-in-chrome__*', 'mcp__dev-browser__*'];

  // NO SessionStart hook on purpose — launching Chrome at every session start
  // pops a window unprompted. The lazy PreToolUse hook below runs chrome-ensure
  // only right before a browser tool call, so Chrome comes up exactly when (and
  // only when) it is needed.
  const hookDefs = {
    PreToolUse: matchers.map((m) => ({ matcher: m, hooks: [{ type: 'command', command: nodeCmd(ensure) }] })),
    PostToolUse: matchers.map((m) => ({ matcher: m, hooks: [{ type: 'command', command: nodeCmd(log) }] })),
  };

  try {
    mergeHooks(CLAUDE_SETTINGS, hookDefs);
    ok('Hooks merged (lazy PreToolUse + PostToolUse, no SessionStart)');
  } catch (error) {
    fail(`Failed to merge hooks: ${error.message}`);
  }
}

function installMcp(platform) {
  step('Configuring Chrome DevTools + dev-browser MCP...');

  const config = readJson(CLAUDE_JSON);
  if (!config.mcpServers) config.mcpServers = {};

  // --- Chrome DevTools MCP (pinned version — no @latest drift) ---
  const cdpMcp = `chrome-devtools-mcp@${MCP_CHROME_DEVTOOLS_VERSION}`;
  if (platform === 'windows') {
    config.mcpServers['chrome-devtools'] = {
      command: 'cmd',
      args: ['/c', 'npx', '-y', cdpMcp, '--browser-url=http://127.0.0.1:9222'],
    };
  } else {
    config.mcpServers['chrome-devtools'] = {
      command: 'npx',
      args: ['-y', cdpMcp, '--browser-url=http://127.0.0.1:9222'],
    };
  }

  // --- dev-browser MCP (Story 7.4.2) ---
  // Install dev-browser globally first
  try {
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    execSync(`${npmCmd} install -g dev-browser`, { stdio: 'pipe', timeout: 120000 });
    ok('dev-browser installed globally');
  } catch {
    // Optional dependency — never block install. Keep the message to ONE calm line
    // (the raw npm/EPERM/EEXIST stderr is intentionally swallowed; it scares users and
    // is not actionable). The MCP entry is still written below so a later manual
    // `npm install -g dev-browser` activates it.
    warn('dev-browser (navegador automatico opcional) nao instalado — segue normal. Opcional depois: npm install -g dev-browser');
    // Do NOT throw — continue with rest of install
  }

  // Add dev-browser MCP entry regardless (user may install manually later)
  if (platform === 'windows') {
    config.mcpServers['dev-browser'] = {
      command: 'cmd',
      args: ['/c', 'dev-browser', '--connect'],
      env: { CDP_URL: 'http://127.0.0.1:9222' },
    };
  } else {
    config.mcpServers['dev-browser'] = {
      command: 'dev-browser',
      args: ['--connect'],
      env: { CDP_URL: 'http://127.0.0.1:9222' },
    };
  }

  try {
    writeJson(CLAUDE_JSON, config);
    ok('Chrome DevTools + dev-browser MCP configured in ~/.claude.json');
  } catch (error) {
    fail(`Failed to configure MCP: ${error.message}`);
  }
}

function installKnowledgeBase() {
  step('Installing knowledge base and rules...');

  // Find template directory (inside the npm package)
  const templateDir = findTemplateDir();
  if (!templateDir) {
    warn('Template directory not found — creating minimal KB files');
    createMinimalKB();
    return;
  }

  // Copy autoload rule
  const rulesSrc = path.join(templateDir, 'rules', 'chrome-brain-autoload.md');
  const rulesDest = path.join(SINAPSE_DIR, '.claude', 'rules', 'chrome-brain-autoload.md');
  copyFile(rulesSrc, rulesDest, 'chrome-brain-autoload.md rule');

  // Copy master KB
  const kbSrc = path.join(templateDir, 'knowledge-base', 'chrome-brain.md');
  const kbDest = path.join(SINAPSE_DIR, 'sinapse', 'knowledge-base', 'chrome-brain.md');
  copyFile(kbSrc, kbDest, 'master KB chrome-brain.md');

  // Copy squad integration files
  const integrationsDir = path.join(templateDir, 'squad-integrations');
  if (fs.existsSync(integrationsDir)) {
    for (const squad of SQUAD_INTEGRATIONS) {
      const src = path.join(integrationsDir, `${squad}.md`);
      const dest = path.join(SINAPSE_DIR, squad, 'knowledge-base', 'chrome-brain-integration.md');
      copyFile(src, dest, `${squad}/chrome-brain-integration.md`);
    }
  } else {
    warn('Squad integrations template directory not found');
  }
}

function findTemplateDir() {
  // Try multiple locations
  const candidates = [
    // When running from npm package (npx sinapse-ai)
    path.join(__dirname, '..', '..', '.sinapse-ai', 'development', 'templates', 'chrome-brain'),
    // When running from git repo
    path.join(process.cwd(), '.sinapse-ai', 'development', 'templates', 'chrome-brain'),
    // When installed as devDependency
    path.join(process.cwd(), 'node_modules', 'sinapse-ai', '.sinapse-ai', 'development', 'templates', 'chrome-brain'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  return null;
}

function copyFile(src, dest, label) {
  try {
    if (fs.existsSync(src)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      ok(label);
    } else {
      warn(`Template not found: ${src}`);
    }
  } catch (error) {
    fail(`Failed to copy ${label}: ${error.message}`);
  }
}

function createMinimalKB() {
  // Create minimal chrome-brain.md if templates not available
  const kbDir = path.join(SINAPSE_DIR, 'sinapse', 'knowledge-base');
  fs.mkdirSync(kbDir, { recursive: true });
  const kbPath = path.join(kbDir, 'chrome-brain.md');
  if (!fs.existsSync(kbPath)) {
    atomicWriteFileSync(kbPath, [
      '# Chrome Brain — Browser Automation Capability',
      '',
      '> Cross-squad capability for browser automation.',
      '> Auto-activated. NSN Mode always on.',
      '',
      '## Browser Automation Tool Selection',
      '',
      '| Task | Preferred Tool | Why |',
      '|------|---------------|-----|',
      '| Navigate, click, fill form | chrome-devtools-mcp (CDP) | Fastest, direct browser control |',
      '| Screenshot, Lighthouse audit | chrome-devtools-mcp (CDP) | Built-in |',
      '| Scraping with JS logic | dev-browser (Playwright) | evaluate(), full DOM access |',
      '| Batch / loops / headless | dev-browser (Playwright) | Headless mode supported |',
      '| Cross-origin iframes | dev-browser or CDP Input events | CDP has InputEvent.dispatch |',
      '| Visual fallback, coordinates | claude-in-chrome extension | Screen-level computer use |',
      '',
      '**Priority:** CDP > dev-browser > claude-in-chrome',
      '',
      '## Learnings Log',
      '',
      '> Updated automatically when NSN Mode resolves new barriers.',
      '',
    ].join('\n'), 'utf8');
    ok('Minimal chrome-brain.md created');
  }

  // Create claude-in-chrome.md KB (Story 7.4.2)
  const cicKbPath = path.join(kbDir, 'claude-in-chrome.md');
  if (!fs.existsSync(cicKbPath)) {
    atomicWriteFileSync(cicKbPath, [
      '# claude-in-chrome — Chrome Extension for Visual Browser Interaction',
      '',
      '> Manual install required. This extension cannot be auto-installed via CLI.',
      '',
      '## Installation',
      '',
      '1. Open Chrome and navigate to the Chrome Web Store',
      '2. Search for "claude-in-chrome" or visit:',
      '   https://chromewebstore.google.com/detail/claude-in-chrome',
      '3. Click "Add to Chrome" and confirm',
      '',
      '## MCP Configuration',
      '',
      'The extension manages its own MCP registration automatically.',
      'Do NOT manually add a "claude-in-chrome" entry to ~/.claude.json.',
      '',
      '## When to Use',
      '',
      'Use as visual fallback when CDP and Playwright cannot handle the task.',
      '**Priority:** CDP > dev-browser > claude-in-chrome',
      '',
    ].join('\n'), 'utf8');
    ok('claude-in-chrome.md KB created');
  }
}

// ============================================================================
// Uninstall
// ============================================================================

function uninstallChromeBrain() {
  console.log(`\n${bold(cyan('Chrome Brain — Uninstall'))}\n`);

  let removed = 0;

  // Remove scripts (current Node + any legacy bash) + runtime config
  step('Removing scripts...');
  for (const name of [...NODE_SCRIPTS, ...LEGACY_SCRIPTS]) {
    for (const dir of [SCRIPTS_DIR, path.join(SINAPSE_DIR, 'bin')]) {
      const scriptPath = path.join(dir, name);
      if (fs.existsSync(scriptPath)) {
        fs.unlinkSync(scriptPath);
        ok(`Removed ${scriptPath}`);
        removed++;
      }
    }
  }
  try {
    if (fs.existsSync(CHROME_BRAIN_CONFIG)) {
      fs.unlinkSync(CHROME_BRAIN_CONFIG);
      ok(`Removed ${CHROME_BRAIN_CONFIG}`);
      removed++;
    }
  } catch { /* best-effort */ }

  // Remove hooks
  step('Removing hooks from settings...');
  const matchers = [
    'mcp__chrome-devtools__*',
    'mcp__claude-in-chrome__*',
    'mcp__dev-browser__*',
  ];

  if (fs.existsSync(CLAUDE_SETTINGS)) {
    removeHooks(CLAUDE_SETTINGS, matchers);
    ok('Hooks removed from ~/.claude/settings.json');
    removed++;
  }

  // Remove MCP config (chrome-devtools + dev-browser)
  step('Removing MCP configuration...');
  if (fs.existsSync(CLAUDE_JSON)) {
    const config = readJson(CLAUDE_JSON);
    let mcpChanged = false;
    if (config.mcpServers) {
      for (const key of ['chrome-devtools', 'dev-browser']) {
        if (config.mcpServers[key]) {
          delete config.mcpServers[key];
          mcpChanged = true;
          removed++;
        }
      }
    }
    if (mcpChanged) {
      writeJson(CLAUDE_JSON, config);
      ok('Removed chrome-devtools + dev-browser from ~/.claude.json');
    }
  }

  // Remove KB files
  step('Removing knowledge base files...');
  const kbFiles = [
    path.join(SINAPSE_DIR, '.claude', 'rules', 'chrome-brain-autoload.md'),
    path.join(SINAPSE_DIR, 'sinapse', 'knowledge-base', 'chrome-brain.md'),
    path.join(SINAPSE_DIR, 'sinapse', 'knowledge-base', 'claude-in-chrome.md'),
  ];

  for (const file of kbFiles) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      ok(`Removed ${path.basename(file)}`);
      removed++;
    }
  }

  for (const squad of SQUAD_INTEGRATIONS) {
    const file = path.join(SINAPSE_DIR, squad, 'knowledge-base', 'chrome-brain-integration.md');
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      removed++;
    }
  }
  ok(`Removed ${SQUAD_INTEGRATIONS.length} squad integration files`);

  console.log(`\n${bold('Uninstall complete.')} Removed ${removed} items.`);
}

// ============================================================================
// Status
// ============================================================================

function getChromeBrainStatus() {
  console.log(`\n${bold(cyan('Chrome Brain — Status'))}\n`);

  let installed = 0;
  let total = 0;

  // Chrome detection
  total++;
  const chromePath = detectChrome();
  if (chromePath) {
    ok(`Chrome found: ${chromePath}`);
    installed++;
  } else {
    fail('Chrome not found');
  }

  // Scripts
  for (const name of NODE_SCRIPTS) {
    total++;
    const scriptPath = path.join(SCRIPTS_DIR, name);
    const altPath = path.join(SINAPSE_DIR, 'bin', name);
    if (fs.existsSync(scriptPath) || fs.existsSync(altPath)) {
      ok(`Script: ${name}`);
      installed++;
    } else {
      fail(`Script: ${name} not found`);
    }
  }

  // Hooks
  total++;
  if (fs.existsSync(CLAUDE_SETTINGS)) {
    const settings = readJson(CLAUDE_SETTINGS);
    const preHooks = (settings.hooks?.PreToolUse || []).map(h => h.matcher);
    if (preHooks.includes('mcp__chrome-devtools__*')) {
      ok('Hooks: PreToolUse + PostToolUse configured');
      installed++;
    } else {
      fail('Hooks: not configured');
    }
  } else {
    fail('Hooks: ~/.claude/settings.json not found');
  }

  // MCP (chrome-devtools)
  total++;
  if (fs.existsSync(CLAUDE_JSON)) {
    const config = readJson(CLAUDE_JSON);
    if (config.mcpServers?.['chrome-devtools']) {
      ok('MCP: chrome-devtools configured');
      installed++;
    } else {
      fail('MCP: chrome-devtools not configured');
    }
  } else {
    fail('MCP: ~/.claude.json not found');
  }

  // MCP (dev-browser)
  total++;
  if (fs.existsSync(CLAUDE_JSON)) {
    const config = readJson(CLAUDE_JSON);
    if (config.mcpServers?.['dev-browser']) {
      ok('MCP: dev-browser configured');
      installed++;
    } else {
      fail('MCP: dev-browser not configured');
    }
  } else {
    fail('MCP: ~/.claude.json not found');
  }

  // dev-browser global install
  total++;
  try {
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    execSync(`${npmCmd} list -g dev-browser`, { stdio: 'pipe', timeout: 10000 });
    ok('dev-browser: installed globally');
    installed++;
  } catch {
    fail('dev-browser: not installed globally (run: npm install -g dev-browser)');
  }

  // KB (chrome-brain.md)
  total++;
  const kbPath = path.join(SINAPSE_DIR, 'sinapse', 'knowledge-base', 'chrome-brain.md');
  if (fs.existsSync(kbPath)) {
    ok('KB: chrome-brain.md');
    installed++;
  } else {
    fail('KB: chrome-brain.md not found');
  }

  // KB (claude-in-chrome.md)
  total++;
  const cicKbPath = path.join(SINAPSE_DIR, 'sinapse', 'knowledge-base', 'claude-in-chrome.md');
  if (fs.existsSync(cicKbPath)) {
    ok('KB: claude-in-chrome.md');
    installed++;
  } else {
    fail('KB: claude-in-chrome.md not found');
  }

  // claude-in-chrome advisory
  info('claude-in-chrome: Chrome extension (manual install from Chrome Web Store)');

  // Squad integrations
  total++;
  let squadCount = 0;
  for (const squad of SQUAD_INTEGRATIONS) {
    const file = path.join(SINAPSE_DIR, squad, 'knowledge-base', 'chrome-brain-integration.md');
    if (fs.existsSync(file)) squadCount++;
  }
  if (squadCount === SQUAD_INTEGRATIONS.length) {
    ok(`Squad integrations: ${squadCount}/${SQUAD_INTEGRATIONS.length}`);
    installed++;
  } else if (squadCount > 0) {
    warn(`Squad integrations: ${squadCount}/${SQUAD_INTEGRATIONS.length}`);
  } else {
    fail('Squad integrations: none found');
  }

  // Summary
  console.log(`\n${bold('Summary:')} ${installed}/${total} checks passed`);

  if (installed === total) {
    console.log(green('\nChrome Brain is fully installed and operational.'));
  } else if (installed > 0) {
    console.log(yellow('\nChrome Brain is partially installed. Run `sinapse chrome-brain install` to complete.'));
  } else {
    console.log(red('\nChrome Brain is not installed. Run `sinapse chrome-brain install` to set up.'));
  }

  return { installed, total, chromePath };
}

// ============================================================================
// Main Entry Point
// ============================================================================

async function runChromeBrain(subArgs) {
  const subCommand = subArgs[0];

  switch (subCommand) {
    case 'install': {
      console.log('');
      console.log(bold(cyan('  Chrome Brain — SINAPSE Install')));
      console.log(cyan('  Browser Automation Capability for All Squads'));
      console.log('');

      const platform = detectPlatform();
      info(`Platform: ${platform}`);

      // Step 1: Detect Chrome
      step('Step 1/5 — Detecting Chrome...');
      const chromePath = detectChrome();
      if (!chromePath) {
        fail('Google Chrome not found on this system');
        console.log('\n  Install Chrome from https://google.com/chrome and try again.');
        process.exit(1);
      }
      ok(`Chrome found: ${chromePath}`);

      // Step 2: Install scripts
      step('Step 2/5 — Installing scripts...');
      installScripts(chromePath, platform);

      // Step 3: Configure hooks
      step('Step 3/5 — Configuring hooks...');
      installHooks();

      // Step 4: Configure MCP
      step('Step 4/5 — Configuring MCP...');
      installMcp(platform);

      // Step 5: Install KB
      step('Step 5/5 — Installing knowledge base...');
      installKnowledgeBase();

      // claude-in-chrome instructions (Story 7.4.2)
      console.log(`\n${bold(yellow('Manual step required: claude-in-chrome extension'))}`);
      console.log('  Install from Chrome Web Store:');
      console.log('    https://chromewebstore.google.com/detail/claude-in-chrome');
      console.log('  The extension manages its own MCP registration — no CLI config needed.');

      // Summary
      console.log(`\n${bold(green('Chrome Brain installed successfully!'))}`);
      console.log(`\n  ${cyan('Tools installed:')}`);
      console.log('    chrome-devtools-mcp   # CDP: fast clicks, screenshots, Lighthouse');
      console.log('    dev-browser           # Playwright: scraping, batch, headless');
      console.log('    claude-in-chrome      # Visual fallback (manual Chrome extension)');
      console.log(`\n  ${cyan('To test:')}`);
      console.log('    chrome-debug          # Launch Chrome with debug port');
      console.log('    chrome-ensure         # Auto-launch (used by hooks)');
      console.log(`\n  ${cyan('In Claude Code:')}`);
      console.log('    "abre o site google.com"  # Chrome Brain auto-activates');
      break;
    }

    case 'uninstall':
      uninstallChromeBrain();
      break;

    case 'status':
      getChromeBrainStatus();
      break;

    case 'login': {
      // Open the fixed-profile debug Chrome so the user logs into all accounts
      // ONCE. The profile persists, so this never needs to be repeated.
      const binDir = detectPlatform() === 'windows' ? path.join(SINAPSE_DIR, 'bin') : SCRIPTS_DIR;
      const ensure = path.join(binDir, 'chrome-ensure.cjs');
      console.log(`\n${bold(cyan('Chrome Brain — Login'))}`);
      if (!fs.existsSync(ensure)) {
        fail('chrome-ensure.cjs nao encontrado — rode `sinapse chrome-brain install` primeiro.');
        break;
      }
      console.log('  Abrindo a janela fixa do Chrome Brain. Logue em todas as suas contas uma');
      console.log('  vez — o perfil persiste, voce nao precisa logar de novo.\n');
      const { spawn } = require('child_process');
      const child = spawn(process.execPath, [ensure, '--visible'], { detached: true, stdio: 'ignore', windowsHide: true });
      child.unref();
      ok('Janela aberta (ou ja estava aberta).');
      break;
    }

    default:
      console.log(`
${bold('sinapse chrome-brain')} — Browser Automation Capability

${bold('USAGE:')}
  sinapse chrome-brain install     Install Chrome Brain (scripts, hooks, MCP, KB)
  sinapse chrome-brain login       Open the fixed window to log into your accounts once
  sinapse chrome-brain uninstall   Remove Chrome Brain completely
  sinapse chrome-brain status      Check installation status

${bold('WHAT IT DOES:')}
  Gives ALL SINAPSE agents the full browser automation stack:
    - chrome-devtools-mcp (CDP): fast clicks, screenshots, Lighthouse
    - dev-browser (Playwright): scraping, batch, headless
    - claude-in-chrome (extension): visual fallback, computer use
  Auto-activates when needed. No manual commands required after install.
`);
  }
}

module.exports = {
  runChromeBrain,
  detectChrome,
  detectPlatform,
  getChromeBrainStatus,
  installScripts,
  installHooks,
  installMcp,
  installKnowledgeBase,
  uninstallChromeBrain,
};
