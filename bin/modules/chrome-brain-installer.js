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

// ============================================================================
// Constants
// ============================================================================

const HOME = os.homedir();
const SINAPSE_DIR = path.join(HOME, '.sinapse');
const SCRIPTS_DIR = path.join(HOME, '.local', 'bin');
const CLAUDE_SETTINGS = path.join(HOME, '.claude', 'settings.json');
const CLAUDE_JSON = path.join(HOME, '.claude.json');

const SCRIPTS = ['chrome-ensure', 'chrome-debug', 'chrome-brain-log'];

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
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function mergeHooks(settingsPath, hookDefs) {
  const settings = readJson(settingsPath);
  if (!settings.hooks) settings.hooks = {};

  for (const [hookType, hookList] of Object.entries(hookDefs)) {
    const existing = settings.hooks[hookType] || [];
    const newMatchers = new Set(hookList.map(h => h.matcher));
    // Keep existing entries that don't conflict
    const filtered = existing.filter(e => !newMatchers.has(e.matcher));
    filtered.push(...hookList);
    settings.hooks[hookType] = filtered;
  }

  writeJson(settingsPath, settings);
}

function removeHooks(settingsPath, matchers) {
  const settings = readJson(settingsPath);
  if (!settings.hooks) return;

  for (const hookType of Object.keys(settings.hooks)) {
    settings.hooks[hookType] = (settings.hooks[hookType] || [])
      .filter(e => !matchers.includes(e.matcher));
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
// Script Generation (cross-platform)
// ============================================================================

function sanitizeChromePath(chromePath) {
  // Validate Chrome path contains only safe characters to prevent shell injection
  const sanitized = chromePath.replace(/\\/g, '/');
  if (!/^[a-zA-Z0-9\s/\-_.:()\[\]]+$/.test(sanitized)) {
    throw new Error(`Unsafe Chrome path detected: ${chromePath}`);
  }
  return sanitized;
}

function generateChromeEnsure(chromePath, platform) {
  const safePath = sanitizeChromePath(chromePath);
  const chromeCmd = `"${safePath}"`;

  return `#!/bin/bash
# Chrome Brain — chrome-ensure (auto-launch)
# Called by PreToolUse hook before any chrome-devtools or claude-in-chrome tool
# Cross-platform: macOS, Linux, Windows Git Bash

PORT="\${1:-9222}"
CHROME_DEBUG_PROFILE="$HOME/.chrome-debug-profile"
CDP="http://127.0.0.1:$PORT/json/version"

# Fast path: check if already running (~50ms)
if curl -sf "$CDP" -o /dev/null --max-time 1 2>/dev/null; then
  exit 0
fi

# Kill stale debug profile instances only (never normal Chrome)
pgrep -f "user-data-dir=$CHROME_DEBUG_PROFILE" 2>/dev/null | xargs kill 2>/dev/null || true
sleep 1

# Launch Chrome with debug flags
${chromeCmd} \\
  --remote-debugging-port="$PORT" \\
  --user-data-dir="$CHROME_DEBUG_PROFILE" \\
  --no-first-run \\
  &>/dev/null &

# Wait for startup (max 10 seconds)
for i in $(seq 1 20); do
  if curl -sf "$CDP" -o /dev/null --max-time 1 2>/dev/null; then
    exit 0
  fi
  sleep 0.5
done

echo "BLOCKED: Chrome debug failed to start on port $PORT. Run 'chrome-debug' manually." >&2
exit 1
`;
}

function generateChromeDebug(chromePath, platform) {
  const safePath = sanitizeChromePath(chromePath);
  const chromeCmd = `"${safePath}"`;

  return `#!/bin/bash
# Chrome Brain — chrome-debug (manual launch)
# User runs this directly if auto-launch doesn't work

PORT="\${1:-9222}"
CHROME_DEBUG_PROFILE="$HOME/.chrome-debug-profile"

# Check if already running
if curl -s "http://127.0.0.1:$PORT/json/version" &>/dev/null; then
  echo "Chrome debug already running on port $PORT"
  exit 0
fi

# Kill only debug profile instances
pgrep -f "user-data-dir=$CHROME_DEBUG_PROFILE" 2>/dev/null | xargs kill 2>/dev/null || true
sleep 2

echo "Launching Chrome with remote debugging on port $PORT..."

${chromeCmd} \\
  --remote-debugging-port="$PORT" \\
  --user-data-dir="$CHROME_DEBUG_PROFILE" \\
  --no-first-run \\
  &>/dev/null &

# Wait for startup
for i in $(seq 1 15); do
  if curl -s "http://127.0.0.1:$PORT/json/version" &>/dev/null; then
    echo "Chrome ready on port $PORT"
    exit 0
  fi
  sleep 1
done

echo "ERROR: Chrome failed to start with debugging"
exit 1
`;
}

function generateChromeBrainLog() {
  return `#!/bin/bash
# Chrome Brain — chrome-brain-log (session logger)
# Called by PostToolUse hook after every chrome tool call
# Tracks usage and warns about screenshot limits

LOG_DIR="$HOME/.chrome-brain"
TODAY=$(date +%Y%m%d)
LOG_FILE="$LOG_DIR/session-$TODAY.log"
COUNTER_FILE="$LOG_DIR/.screenshot-count"
COUNTER_DATE_FILE="$LOG_DIR/.screenshot-date"
mkdir -p "$LOG_DIR"

# Reset counter daily
LAST_DATE=$(cat "$COUNTER_DATE_FILE" 2>/dev/null || echo "")
if [ "$LAST_DATE" != "$TODAY" ]; then
  echo "0" > "$COUNTER_FILE"
  echo "$TODAY" > "$COUNTER_DATE_FILE"
fi

TOOL_NAME="\${HOOK_TOOL_NAME:-unknown}"
TIMESTAMP=$(date +%H:%M:%S)

echo "$TIMESTAMP $TOOL_NAME" >> "$LOG_FILE"

if echo "$TOOL_NAME" | grep -qE "take_screenshot|take_snapshot"; then
  COUNT=$(cat "$COUNTER_FILE" 2>/dev/null || echo 0)
  COUNT=$((COUNT + 1))
  echo "$COUNT" > "$COUNTER_FILE"

  if [ "$COUNT" -eq 12 ]; then
    echo "WARNING: 12 screenshots in this session. Consider saving state and rotating." >&2
  elif [ "$COUNT" -ge 15 ]; then
    echo "CRITICAL: 15+ screenshots. Session at risk of exceeding 20MB API limit. Save state NOW." >&2
  fi
fi

exit 0
`;
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

  const scripts = {
    'chrome-ensure': generateChromeEnsure(chromePath, platform),
    'chrome-debug': generateChromeDebug(chromePath, platform),
    'chrome-brain-log': generateChromeBrainLog(),
  };

  for (const [name, content] of Object.entries(scripts)) {
    const scriptPath = path.join(scriptsDir, name);
    fs.writeFileSync(scriptPath, content, { encoding: 'utf8', mode: 0o755 });
    try {
      fs.chmodSync(scriptPath, 0o755);
    } catch { /* Windows doesn't support chmod */ }
    ok(`${name} created at ${scriptPath}`);
  }

  // Check PATH
  const pathDirs = (process.env.PATH || '').split(path.delimiter);
  if (!pathDirs.includes(scriptsDir)) {
    warn(`${scriptsDir} not in PATH. Add to your shell profile: export PATH="${scriptsDir}:$PATH"`);
  }

  return scriptsDir;
}

function installHooks() {
  step('Merging hooks into ~/.claude/settings.json...');

  const binDir = detectPlatform() === 'windows'
    ? path.join(SINAPSE_DIR, 'bin')
    : SCRIPTS_DIR;
  const ensureCmd = path.join(binDir, 'chrome-ensure').replace(/\\/g, '/');
  const logCmd = path.join(binDir, 'chrome-brain-log').replace(/\\/g, '/');
  const hookDefs = {
    PreToolUse: [
      { matcher: 'mcp__chrome-devtools__*', hooks: [{ type: 'command', command: ensureCmd }] },
      { matcher: 'mcp__claude-in-chrome__*', hooks: [{ type: 'command', command: ensureCmd }] },
    ],
    PostToolUse: [
      { matcher: 'mcp__chrome-devtools__*', hooks: [{ type: 'command', command: logCmd }] },
      { matcher: 'mcp__claude-in-chrome__*', hooks: [{ type: 'command', command: logCmd }] },
    ],
  };

  try {
    mergeHooks(CLAUDE_SETTINGS, hookDefs);
    ok('Hooks merged into ~/.claude/settings.json');
  } catch (error) {
    fail(`Failed to merge hooks: ${error.message}`);
  }

  // Also create standalone hooks in ~/.sinapse/.claude/settings.json
  const sinapseSettings = path.join(SINAPSE_DIR, '.claude', 'settings.json');
  try {
    writeJson(sinapseSettings, { hooks: hookDefs });
    ok('Standalone hooks at ~/.sinapse/.claude/settings.json');
  } catch (error) {
    warn(`Could not create standalone hooks: ${error.message}`);
  }
}

function installMcp(platform) {
  step('Configuring Chrome DevTools MCP...');

  const config = readJson(CLAUDE_JSON);
  if (!config.mcpServers) config.mcpServers = {};

  if (platform === 'windows') {
    config.mcpServers['chrome-devtools'] = {
      command: 'cmd',
      args: ['/c', 'npx', '-y', 'chrome-devtools-mcp@latest', '--browser-url=http://127.0.0.1:9222'],
    };
  } else {
    config.mcpServers['chrome-devtools'] = {
      command: 'npx',
      args: ['chrome-devtools-mcp@latest', '--browser-url=http://127.0.0.1:9222'],
    };
  }

  try {
    writeJson(CLAUDE_JSON, config);
    ok('Chrome DevTools MCP configured in ~/.claude.json');
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
    fs.writeFileSync(kbPath, [
      '# Chrome Brain — Browser Automation Capability',
      '',
      '> Cross-squad capability for browser automation.',
      '> Auto-activated. NSN Mode always on.',
      '',
      '## Learnings Log',
      '',
      '> Updated automatically when NSN Mode resolves new barriers.',
      '',
    ].join('\n'), 'utf8');
    ok('Minimal chrome-brain.md created');
  }
}

// ============================================================================
// Uninstall
// ============================================================================

function uninstallChromeBrain() {
  console.log(`\n${bold(cyan('Chrome Brain — Uninstall'))}\n`);

  let removed = 0;

  // Remove scripts
  step('Removing scripts...');
  for (const name of SCRIPTS) {
    for (const dir of [SCRIPTS_DIR, path.join(SINAPSE_DIR, 'bin')]) {
      const scriptPath = path.join(dir, name);
      if (fs.existsSync(scriptPath)) {
        fs.unlinkSync(scriptPath);
        ok(`Removed ${scriptPath}`);
        removed++;
      }
    }
  }

  // Remove hooks
  step('Removing hooks from settings...');
  const matchers = [
    'mcp__chrome-devtools__*',
    'mcp__claude-in-chrome__*',
  ];

  if (fs.existsSync(CLAUDE_SETTINGS)) {
    removeHooks(CLAUDE_SETTINGS, matchers);
    ok('Hooks removed from ~/.claude/settings.json');
    removed++;
  }

  const sinapseSettings = path.join(SINAPSE_DIR, '.claude', 'settings.json');
  if (fs.existsSync(sinapseSettings)) {
    fs.unlinkSync(sinapseSettings);
    ok('Removed ~/.sinapse/.claude/settings.json');
    removed++;
  }

  // Remove MCP config
  step('Removing MCP configuration...');
  if (fs.existsSync(CLAUDE_JSON)) {
    const config = readJson(CLAUDE_JSON);
    if (config.mcpServers && config.mcpServers['chrome-devtools']) {
      delete config.mcpServers['chrome-devtools'];
      writeJson(CLAUDE_JSON, config);
      ok('Removed chrome-devtools from ~/.claude.json');
      removed++;
    }
  }

  // Remove KB files
  step('Removing knowledge base files...');
  const kbFiles = [
    path.join(SINAPSE_DIR, '.claude', 'rules', 'chrome-brain-autoload.md'),
    path.join(SINAPSE_DIR, 'sinapse', 'knowledge-base', 'chrome-brain.md'),
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
  for (const name of SCRIPTS) {
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

  // MCP
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

  // KB
  total++;
  const kbPath = path.join(SINAPSE_DIR, 'sinapse', 'knowledge-base', 'chrome-brain.md');
  if (fs.existsSync(kbPath)) {
    ok('KB: chrome-brain.md');
    installed++;
  } else {
    fail('KB: chrome-brain.md not found');
  }

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

      // Summary
      console.log(`\n${bold(green('Chrome Brain installed successfully!'))}`);
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

    default:
      console.log(`
${bold('sinapse chrome-brain')} — Browser Automation Capability

${bold('USAGE:')}
  sinapse chrome-brain install     Install Chrome Brain (scripts, hooks, MCP, KB)
  sinapse chrome-brain uninstall   Remove Chrome Brain completely
  sinapse chrome-brain status      Check installation status

${bold('WHAT IT DOES:')}
  Gives ALL SINAPSE agents the ability to control Chrome in real-time:
  navigate sites, clone pages, fill forms, audit performance, extract data.
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
