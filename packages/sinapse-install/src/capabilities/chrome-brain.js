/**
 * Chrome Brain — Cross-platform Chrome Browser Automation Installer
 *
 * Installs the Chrome Brain capability for SINAPSE:
 * - Detects Chrome binary across macOS, Linux, Windows, WSL
 * - Creates launcher/logger scripts in user bin directory
 * - Merges PreToolUse/PostToolUse hooks into ~/.claude/settings.json
 * - Adds Chrome DevTools MCP to ~/.claude.json
 * - Copies KB and rule templates to ~/.sinapse/ structure
 * - Validates the full installation
 *
 * @module capabilities/chrome-brain
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { detectOS, OS_TYPE } = require('../os-detector');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEBUG_PORT = 9222;
const DEBUG_PROFILE = path.join(os.homedir(), '.chrome-debug-profile');
const SINAPSE_DIR = path.join(os.homedir(), '.sinapse');
const CLAUDE_DIR = path.join(os.homedir(), '.claude');
const CLAUDE_JSON = path.join(os.homedir(), '.claude.json');
const CLAUDE_SETTINGS = path.join(CLAUDE_DIR, 'settings.json');

const SQUAD_NAMES = [
  'squad-animations',
  'squad-design',
  'squad-cloning',
  'squad-claude',
  'squad-paidmedia',
  'squad-growth',
  'squad-content',
  'squad-copy',
  'squad-research',
  'squad-cybersecurity',
  'squad-commercial',
  'squad-brand',
  'squad-storytelling',
  'squad-product',
];

// ---------------------------------------------------------------------------
// Logging helpers
// ---------------------------------------------------------------------------

let _quiet = false;
const LOG = {
  ok:   (msg) => { if (!_quiet) console.log(`  \x1b[32m[OK]\x1b[0m ${msg}`); },
  fail: (msg) => console.log(`  \x1b[31m[FAIL]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`  \x1b[33m[WARN]\x1b[0m ${msg}`),
  info: (msg) => { if (!_quiet) console.log(`  \x1b[36m[INFO]\x1b[0m ${msg}`); },
  step: (msg) => { if (!_quiet) console.log(`\n\x1b[1m${msg}\x1b[0m`); },
};

// ---------------------------------------------------------------------------
// Chrome Detection
// ---------------------------------------------------------------------------

/**
 * Detects the Chrome (or Chromium) binary path for the current platform.
 * @returns {{ found: boolean, path: string|null, variant: string|null }}
 */
function detectChrome() {
  const platform = process.platform;
  const candidates = [];

  if (platform === 'darwin') {
    candidates.push({
      path: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      variant: 'Google Chrome',
    });
    candidates.push({
      path: '/Applications/Chromium.app/Contents/MacOS/Chromium',
      variant: 'Chromium',
    });
  } else if (platform === 'win32') {
    const pf = process.env.PROGRAMFILES || 'C:\\Program Files';
    const pfx86 = process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)';
    const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
    candidates.push({
      path: path.join(pf, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      variant: 'Google Chrome',
    });
    candidates.push({
      path: path.join(pfx86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      variant: 'Google Chrome (x86)',
    });
    candidates.push({
      path: path.join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      variant: 'Google Chrome (User)',
    });
    // Try 'where' command as fallback
    try {
      const found = execSync('where chrome.exe 2>NUL', { encoding: 'utf8' }).trim().split(/\r?\n/)[0];
      if (found) {
        candidates.push({ path: found, variant: 'Google Chrome (PATH)' });
      }
    } catch {
      // not in PATH
    }
  } else {
    // Linux / WSL
    candidates.push({ path: '/usr/bin/google-chrome', variant: 'Google Chrome' });
    candidates.push({ path: '/usr/bin/google-chrome-stable', variant: 'Google Chrome Stable' });
    candidates.push({ path: '/usr/bin/chromium-browser', variant: 'Chromium' });
    candidates.push({ path: '/usr/bin/chromium', variant: 'Chromium' });
    candidates.push({ path: '/snap/bin/chromium', variant: 'Chromium (Snap)' });
    // Try 'which' as fallback
    for (const bin of ['google-chrome', 'google-chrome-stable', 'chromium-browser', 'chromium']) {
      try {
        const found = execSync(`which ${bin} 2>/dev/null`, { encoding: 'utf8' }).trim();
        if (found && !candidates.some((c) => c.path === found)) {
          candidates.push({ path: found, variant: bin });
        }
      } catch {
        // not found
      }
    }
  }

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate.path)) {
        return { found: true, path: candidate.path, variant: candidate.variant };
      }
    } catch {
      // permission error — skip
    }
  }

  return { found: false, path: null, variant: null };
}

// ---------------------------------------------------------------------------
// Script Generators
// ---------------------------------------------------------------------------

/**
 * Returns the bin directory for scripts based on OS.
 * Unix: ~/.local/bin   Windows: ~/.sinapse/bin
 */
function getBinDir(osInfo) {
  if (osInfo.type === OS_TYPE.WINDOWS) {
    return path.join(os.homedir(), '.sinapse', 'bin');
  }
  return path.join(os.homedir(), '.local', 'bin');
}

/**
 * Generates the chrome-ensure script content.
 */
function generateChromeEnsure(chromePath, osInfo) {
  if (osInfo.type === OS_TYPE.WINDOWS) {
    // PowerShell script wrapped in a .cmd launcher
    return `@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$port = if ($args[0]) { $args[0] } else { ${DEBUG_PORT} };" ^
  "$profile = '%USERPROFILE%\\.chrome-debug-profile';" ^
  "$cdp = 'http://127.0.0.1:' + $port + '/json/version';" ^
  "try { $r = Invoke-WebRequest -Uri $cdp -TimeoutSec 1 -UseBasicParsing -ErrorAction Stop; exit 0 } catch {};" ^
  "$running = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue;" ^
  "if (-not $running) {" ^
  "  Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*chrome-debug-profile*' } | Stop-Process -Force -ErrorAction SilentlyContinue;" ^
  "  Start-Sleep -Seconds 1;" ^
  "};" ^
  "Start-Process '${chromePath.replace(/\\/g, '\\\\')}' -ArgumentList '--remote-debugging-port=' + $port, '--user-data-dir=' + $profile, '--no-first-run' -WindowStyle Hidden;" ^
  "for ($i = 1; $i -le 20; $i++) {" ^
  "  Start-Sleep -Milliseconds 500;" ^
  "  try { $r = Invoke-WebRequest -Uri $cdp -TimeoutSec 1 -UseBasicParsing -ErrorAction Stop; exit 0 } catch {};" ^
  "};" ^
  "Write-Error 'BLOCKED: Chrome debug failed to start on port ' + $port + '. Run chrome-debug manually.';" ^
  "exit 1"
`;
  }

  // Unix (macOS / Linux / WSL)
  const portCheck = osInfo.type === OS_TYPE.MACOS
    ? 'lsof -iTCP:$PORT -sTCP:LISTEN'
    : 'ss -tlnp | grep -q ":$PORT " || lsof -iTCP:$PORT -sTCP:LISTEN 2>/dev/null';

  return `#!/bin/bash
PORT="\${1:-${DEBUG_PORT}}"
PROFILE="${DEBUG_PROFILE}"
CDP="http://127.0.0.1:$PORT/json/version"
if curl -sf "$CDP" -o /dev/null --max-time 1; then
  exit 0
fi
if ! ${portCheck} &>/dev/null; then
  pgrep -f "user-data-dir=$PROFILE" | xargs kill 2>/dev/null
  sleep 1
fi
"${chromePath}" \\
  --remote-debugging-port="$PORT" \\
  --user-data-dir="$PROFILE" \\
  --no-first-run \\
  &>/dev/null &
for i in {1..20}; do
  if curl -sf "$CDP" -o /dev/null --max-time 1; then
    exit 0
  fi
  sleep 0.5
done
echo "BLOCKED: Chrome debug failed to start on port $PORT. Run 'chrome-debug' manually." >&2
exit 1
`;
}

/**
 * Generates the chrome-debug script content.
 */
function generateChromeDebug(chromePath, osInfo) {
  if (osInfo.type === OS_TYPE.WINDOWS) {
    return `@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$port = if ($args[0]) { $args[0] } else { ${DEBUG_PORT} };" ^
  "$profile = '%USERPROFILE%\\.chrome-debug-profile';" ^
  "try { $r = Invoke-WebRequest -Uri ('http://127.0.0.1:' + $port + '/json/version') -TimeoutSec 1 -UseBasicParsing -ErrorAction Stop; Write-Host 'Chrome debug already running on port' $port; exit 0 } catch {};" ^
  "Write-Host 'Killing existing debug Chrome instances...';" ^
  "Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*chrome-debug-profile*' } | Stop-Process -Force -ErrorAction SilentlyContinue;" ^
  "Start-Sleep -Seconds 2;" ^
  "Write-Host 'Launching Chrome with remote debugging on port' $port '...';" ^
  "Start-Process '${chromePath.replace(/\\/g, '\\\\')}' -ArgumentList '--remote-debugging-port=' + $port, '--user-data-dir=' + $profile, '--no-first-run' -WindowStyle Hidden;" ^
  "for ($i = 1; $i -le 15; $i++) {" ^
  "  Start-Sleep -Seconds 1;" ^
  "  try { $r = Invoke-WebRequest -Uri ('http://127.0.0.1:' + $port + '/json/version') -TimeoutSec 1 -UseBasicParsing -ErrorAction Stop; Write-Host 'Chrome ready on port' $port; exit 0 } catch {};" ^
  "};" ^
  "Write-Error 'ERROR: Chrome failed to start with debugging';" ^
  "exit 1"
`;
  }

  return `#!/bin/bash
PORT="\${1:-${DEBUG_PORT}}"
PROFILE="${DEBUG_PROFILE}"
if curl -s "http://127.0.0.1:$PORT/json/version" &>/dev/null; then
  echo "Chrome debug already running on port $PORT"
  exit 0
fi
echo "Killing existing debug Chrome instances..."
pgrep -f "user-data-dir=$PROFILE" | xargs kill 2>/dev/null
sleep 2
echo "Launching Chrome with remote debugging on port $PORT..."
"${chromePath}" \\
  --remote-debugging-port="$PORT" \\
  --user-data-dir="$PROFILE" \\
  --no-first-run \\
  &>/dev/null &
for i in {1..15}; do
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

/**
 * Generates the chrome-brain-log script content.
 */
function generateChromeBrainLog(osInfo) {
  if (osInfo.type === OS_TYPE.WINDOWS) {
    return `@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$logDir = '%USERPROFILE%\\.chrome-brain';" ^
  "$logFile = Join-Path $logDir ('session-' + (Get-Date -Format 'yyyyMMdd') + '.log');" ^
  "$counterFile = Join-Path $logDir '.screenshot-count';" ^
  "New-Item -ItemType Directory -Path $logDir -Force | Out-Null;" ^
  "$toolName = if ($env:HOOK_TOOL_NAME) { $env:HOOK_TOOL_NAME } else { 'unknown' };" ^
  "$ts = Get-Date -Format 'HH:mm:ss';" ^
  "Add-Content -Path $logFile -Value ('$ts $toolName');" ^
  "if ($toolName -match 'take_screenshot|take_snapshot') {" ^
  "  $count = 0;" ^
  "  if (Test-Path $counterFile) { $count = [int](Get-Content $counterFile) };" ^
  "  $count++;" ^
  "  Set-Content -Path $counterFile -Value $count;" ^
  "  if ($count -eq 12) { Write-Warning 'WARNING: 12 screenshots in this session. Consider saving state and rotating.' };" ^
  "  if ($count -ge 15) { Write-Error 'CRITICAL: 15+ screenshots. Session at risk of exceeding 20MB API limit. Save state NOW.' };" ^
  "};" ^
  "exit 0"
`;
  }

  return `#!/bin/bash
LOG_DIR="$HOME/.chrome-brain"
LOG_FILE="$LOG_DIR/session-$(date +%Y%m%d).log"
COUNTER_FILE="$LOG_DIR/.screenshot-count"
mkdir -p "$LOG_DIR"
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

// ---------------------------------------------------------------------------
// JSON Merge Helpers
// ---------------------------------------------------------------------------

/**
 * Safely reads a JSON file. Returns empty object on failure.
 */
function readJsonSafe(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    LOG.warn(`Could not parse ${filePath}: ${err.message}`);
  }
  return {};
}

/**
 * Writes a JSON file with pretty-printing.
 */
function writeJson(filePath, data) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

/**
 * Merges Chrome Brain hooks into ~/.claude/settings.json.
 * Preserves all existing hooks — only replaces entries with matching matchers.
 */
function mergeHooks() {
  const newHooks = {
    PreToolUse: [
      { matcher: 'mcp__chrome-devtools__*', hooks: [{ type: 'command', command: 'chrome-ensure' }] },
      { matcher: 'mcp__claude-in-chrome__*', hooks: [{ type: 'command', command: 'chrome-ensure' }] },
    ],
    PostToolUse: [
      { matcher: 'mcp__chrome-devtools__*', hooks: [{ type: 'command', command: 'chrome-brain-log' }] },
      { matcher: 'mcp__claude-in-chrome__*', hooks: [{ type: 'command', command: 'chrome-brain-log' }] },
    ],
  };

  const settings = readJsonSafe(CLAUDE_SETTINGS);
  if (!settings.hooks) {
    settings.hooks = {};
  }

  for (const [hookType, hookList] of Object.entries(newHooks)) {
    const existing = settings.hooks[hookType] || [];
    const newMatchers = new Set(hookList.map((h) => h.matcher));
    const filtered = existing.filter((e) => !newMatchers.has(e.matcher));
    filtered.push(...hookList);
    settings.hooks[hookType] = filtered;
  }

  writeJson(CLAUDE_SETTINGS, settings);
}

/**
 * Adds Chrome DevTools MCP server to ~/.claude.json.
 */
function mergeMcpConfig(osInfo) {
  const config = readJsonSafe(CLAUDE_JSON);
  if (!config.mcpServers) {
    config.mcpServers = {};
  }

  if (osInfo.type === OS_TYPE.WINDOWS) {
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

  writeJson(CLAUDE_JSON, config);
}

// ---------------------------------------------------------------------------
// Template / KB Content
// ---------------------------------------------------------------------------

function getAutoloadRuleContent() {
  return `# Chrome Brain — Auto-Activation & Auto-Learning Rule

> CRITICAL: This capability auto-activates and auto-learns. No command needed.

## Auto-Activation

When the user's prompt matches ANY of these patterns, Chrome Brain is active:

- **Browser**: abrir/navegar/acessar site, URL, pagina, chrome, aba
- **Cloning**: clonar/replicar/copiar site, pagina, hero, layout, animacao
- **Forms**: preencher/cadastrar/signup/login formulario, form, conta
- **Audit**: auditar/analisar/inspecionar site, performance, Lighthouse
- **Scraping**: extrair/scrape/coletar dados, conteudo, HTML, CSS
- **Animation**: animacao 3D, Three.js, WebGL, shader, canvas

## Protocol

1. Chrome connection is guaranteed by PreToolUse hook (chrome-ensure)
2. Select tooling: CDP > dev-browser > claude-in-chrome
3. Execute with NSN Mode enabled (never say "I can't" — try 3+ alternatives)
4. Track screenshot count — max 15 per session
5. Handoff results to domain squad when applicable

## Auto-Learning — MANDATORY

After completing ANY browser automation task, evaluate:

1. **Did something unexpected happen?** (error, workaround, new pattern)
2. **Did NSN Mode activate?** (barrier encountered and resolved)
3. **Is the solution generalizable?** (useful for future sessions)

If YES to any:
- Append the learning to the Learnings Log section in:
  ~/.sinapse/sinapse/knowledge-base/chrome-brain.md

## Session Management

Track screenshots mentally. When approaching 12:
1. Save current state to handoff file
2. Suggest session rotation to user
3. Never exceed 15 screenshots in a single session

## Knowledge Base

Full reference: ~/.sinapse/sinapse/knowledge-base/chrome-brain.md
`;
}

function getMasterKbContent() {
  return `# Chrome Brain — Browser Automation Capability

> Cross-squad capability que da a TODOS os agents do SINAPSE o poder de
> navegar, clonar, preencher, auditar e scrape qualquer site via Chrome real.
> Auto-ativado. Sem comando manual. NSN Mode sempre ligado.

---

## Arquitetura

\`\`\`
Chrome (porta 9222, perfil ~/.chrome-debug-profile)
  +-- Chrome DevTools MCP (29 tools) — acoes rapidas, screenshots, Lighthouse
  +-- dev-browser (Playwright) — scraping complexo, batch, headless
  +-- claude-in-chrome (Extension) — fallback visual, coordenadas de tela
\`\`\`

**Prioridade de tooling:** CDP > dev-browser > claude-in-chrome

**Auto-launch:** Hook PreToolUse roda chrome-ensure antes de qualquer tool chrome.

---

## Decisao de Tooling

| Cenario | Ferramenta |
|---------|-----------|
| Click, fill, navegar | Chrome DevTools MCP |
| Screenshot/snapshot | Chrome DevTools MCP |
| Performance/Lighthouse | Chrome DevTools MCP |
| Network/Console | Chrome DevTools MCP |
| Scraping com logica JS | dev-browser evaluate() |
| Batch/loops | dev-browser |
| Headless | dev-browser --headless |
| Iframe cross-origin | claude-in-chrome ou CDP Input.dispatchMouseEvent |

---

## NSN Mode — Nunca Diga Nunca

Quando encontrar barreira:
1. Classificar — permission? technical? knowledge? external?
2. Buscar workaround via web search
3. Tentar alternativas — minimo 3 abordagens diferentes
4. Configurar e testar
5. Repetir (max 5 ciclos)
6. Escalar ao usuario com detalhes

---

## Session Management

- Max 15 screenshots por sessao
- Max 10 snapshots por sessao
- Preferir evaluate_script sobre take_snapshot
- Rotacionar sessao a cada ~12 screenshots

---

## Learnings Log

> Secao atualizada automaticamente quando NSN Mode resolve problemas novos.

`;
}

function getSquadIntegrationContent(squadName) {
  const footer = `## Tools Disponiveis

1. **Chrome DevTools MCP** (29 tools) — acoes rapidas, screenshots, audit
2. **dev-browser** — scraping complexo, batch operations
3. **claude-in-chrome** — fallback visual

## Session Management

- Max 15 screenshots por sessao
- Salvar outputs em arquivo antes de acumular
- Rotacionar sessao a cada ~12 screenshots

## NSN Mode

Ativo. Se uma acao de browser falhar, tentar alternativas automaticamente.

## Referencia Completa

~/.sinapse/sinapse/knowledge-base/chrome-brain.md
`;

  return `# Chrome Brain Integration — ${squadName}

> This squad has access to Chrome Brain for browser automation tasks.
> Auto-activated when browser interaction is needed.

## Tier: 2

## When to Activate

- User task requires browser interaction relevant to this squad's domain
- Data extraction from web sources
- Visual validation of deliverables in browser
- Automated form filling or navigation

## What This Squad Receives from Chrome Brain

- DOM snapshots and screenshots
- Extracted data (text, styles, assets)
- Performance and accessibility audits
- Network and console monitoring data

## What This Squad Sends to Chrome Brain

- URLs and targets for capture
- Custom extraction scripts
- Deliverables for visual validation

${footer}`;
}

// ---------------------------------------------------------------------------
// Core Install / Uninstall
// ---------------------------------------------------------------------------

/**
 * Full Chrome Brain installation.
 *
 * @param {Object} [options={}]
 * @param {boolean} [options.dryRun=false] Log actions without writing files
 * @param {boolean} [options.skipMcp=false] Skip MCP config merge
 * @param {boolean} [options.skipHooks=false] Skip hook merge
 * @param {boolean} [options.skipKb=false] Skip knowledge base copy
 * @param {boolean} [options.skipScripts=false] Skip script creation
 * @returns {{ success: boolean, chrome: object, errors: string[] }}
 */
function installChromeBrain(options = {}) {
  const { dryRun = false, skipMcp = false, skipHooks = false, skipKb = false, skipScripts = false, quiet = false } = options;
  _quiet = quiet;
  const errors = [];
  const osInfo = detectOS();

  LOG.step('Chrome Brain Installer');
  LOG.info(`OS: ${osInfo.type} | Platform: ${osInfo.platform} | Arch: ${osInfo.arch}`);

  // --- Step 1: Detect Chrome ---
  LOG.step('Step 1 — Detecting Chrome...');
  const chrome = detectChrome();
  if (!chrome.found) {
    LOG.fail('Google Chrome not found. Install Chrome and retry.');
    return { success: false, chrome, errors: ['Chrome not found'] };
  }
  LOG.ok(`${chrome.variant} at ${chrome.path}`);

  // --- Step 2: Create scripts ---
  if (!skipScripts) {
    LOG.step('Step 2 — Creating launcher scripts...');
    const binDir = getBinDir(osInfo);
    const ext = osInfo.type === OS_TYPE.WINDOWS ? '.cmd' : '';
    const scripts = {
      [`chrome-ensure${ext}`]: generateChromeEnsure(chrome.path, osInfo),
      [`chrome-debug${ext}`]: generateChromeDebug(chrome.path, osInfo),
      [`chrome-brain-log${ext}`]: generateChromeBrainLog(osInfo),
    };

    try {
      if (!dryRun) {
        fs.mkdirSync(binDir, { recursive: true });
      }
      for (const [name, content] of Object.entries(scripts)) {
        const filePath = path.join(binDir, name);
        if (dryRun) {
          LOG.info(`[DRY-RUN] Would create ${filePath}`);
        } else {
          fs.writeFileSync(filePath, content, 'utf8');
          // Make executable on Unix
          if (osInfo.type !== OS_TYPE.WINDOWS) {
            fs.chmodSync(filePath, 0o755);
          }
          LOG.ok(`${name} created`);
        }
      }

      // Warn if binDir not in PATH
      const pathDirs = (process.env.PATH || '').split(path.delimiter);
      if (!pathDirs.some((d) => d === binDir || d === binDir + path.sep)) {
        LOG.warn(`${binDir} may not be in your PATH. Add it to your shell profile.`);
      }
    } catch (err) {
      const msg = `Failed to create scripts: ${err.message}`;
      LOG.fail(msg);
      errors.push(msg);
    }
  }

  // --- Step 3: Merge hooks ---
  if (!skipHooks) {
    LOG.step('Step 3 — Merging hooks into ~/.claude/settings.json...');
    try {
      if (dryRun) {
        LOG.info('[DRY-RUN] Would merge hooks into settings.json');
      } else {
        fs.mkdirSync(CLAUDE_DIR, { recursive: true });
        mergeHooks();
        LOG.ok('Hooks merged into ~/.claude/settings.json');
      }
    } catch (err) {
      const msg = `Failed to merge hooks: ${err.message}`;
      LOG.fail(msg);
      errors.push(msg);
    }
  }

  // --- Step 4: MCP config ---
  if (!skipMcp) {
    LOG.step('Step 4 — Adding Chrome DevTools MCP to ~/.claude.json...');
    try {
      if (dryRun) {
        LOG.info('[DRY-RUN] Would merge MCP config');
      } else {
        mergeMcpConfig(osInfo);
        LOG.ok('Chrome DevTools MCP added to ~/.claude.json');
      }
    } catch (err) {
      const msg = `Failed to merge MCP config: ${err.message}`;
      LOG.fail(msg);
      errors.push(msg);
    }
  }

  // --- Step 5: KB and rules ---
  if (!skipKb) {
    LOG.step('Step 5 — Installing knowledge base and rules...');
    const kbFiles = [
      {
        path: path.join(SINAPSE_DIR, '.claude', 'rules', 'chrome-brain-autoload.md'),
        content: getAutoloadRuleContent(),
        label: 'chrome-brain-autoload.md rule',
      },
      {
        path: path.join(SINAPSE_DIR, 'sinapse', 'knowledge-base', 'chrome-brain.md'),
        content: getMasterKbContent(),
        label: 'master KB chrome-brain.md',
      },
    ];

    // Squad integration files
    for (const squad of SQUAD_NAMES) {
      kbFiles.push({
        path: path.join(SINAPSE_DIR, squad, 'knowledge-base', 'chrome-brain-integration.md'),
        content: getSquadIntegrationContent(squad),
        label: `${squad}/chrome-brain-integration.md`,
      });
    }

    for (const file of kbFiles) {
      try {
        if (dryRun) {
          LOG.info(`[DRY-RUN] Would create ${file.label}`);
        } else {
          fs.mkdirSync(path.dirname(file.path), { recursive: true });
          fs.writeFileSync(file.path, file.content, 'utf8');
          LOG.ok(file.label);
        }
      } catch (err) {
        const msg = `Failed to create ${file.label}: ${err.message}`;
        LOG.fail(msg);
        errors.push(msg);
      }
    }
  }

  // --- Step 6: Validate ---
  LOG.step('Step 6 — Validating installation...');
  if (!dryRun) {
    const status = getChromeBrainStatus();
    const total = Object.values(status.components).filter((v) => v === true).length;
    const count = Object.keys(status.components).length;
    if (total === count) {
      LOG.ok(`All ${count} components validated successfully`);
    } else {
      LOG.warn(`${total}/${count} components validated — check warnings above`);
    }
  }

  const success = errors.length === 0;
  if (success) {
    LOG.step('Chrome Brain installed successfully!');
  } else {
    LOG.step(`Chrome Brain installed with ${errors.length} error(s)`);
  }

  return { success, chrome, errors };
}

/**
 * Removes the Chrome Brain capability.
 *
 * @param {Object} [options={}]
 * @param {boolean} [options.dryRun=false] Log actions without deleting files
 * @param {boolean} [options.keepKb=false] Preserve knowledge base files
 * @returns {{ success: boolean, removed: string[], errors: string[] }}
 */
function uninstallChromeBrain(options = {}) {
  const { dryRun = false, keepKb = false } = options;
  const osInfo = detectOS();
  const removed = [];
  const errors = [];

  LOG.step('Chrome Brain Uninstaller');

  // --- Remove scripts ---
  const binDir = getBinDir(osInfo);
  const ext = osInfo.type === OS_TYPE.WINDOWS ? '.cmd' : '';
  const scriptNames = [`chrome-ensure${ext}`, `chrome-debug${ext}`, `chrome-brain-log${ext}`];

  for (const name of scriptNames) {
    const filePath = path.join(binDir, name);
    try {
      if (fs.existsSync(filePath)) {
        if (dryRun) {
          LOG.info(`[DRY-RUN] Would remove ${filePath}`);
        } else {
          fs.unlinkSync(filePath);
          LOG.ok(`Removed ${name}`);
        }
        removed.push(filePath);
      }
    } catch (err) {
      errors.push(`Failed to remove ${name}: ${err.message}`);
    }
  }

  // --- Remove hooks from settings.json ---
  try {
    const settings = readJsonSafe(CLAUDE_SETTINGS);
    if (settings.hooks) {
      const chromeMatchers = new Set([
        'mcp__chrome-devtools__*',
        'mcp__claude-in-chrome__*',
      ]);
      let changed = false;
      for (const hookType of ['PreToolUse', 'PostToolUse']) {
        if (Array.isArray(settings.hooks[hookType])) {
          const before = settings.hooks[hookType].length;
          settings.hooks[hookType] = settings.hooks[hookType].filter(
            (e) => !chromeMatchers.has(e.matcher),
          );
          if (settings.hooks[hookType].length < before) {
            changed = true;
          }
        }
      }
      if (changed) {
        if (dryRun) {
          LOG.info('[DRY-RUN] Would remove Chrome hooks from settings.json');
        } else {
          writeJson(CLAUDE_SETTINGS, settings);
          LOG.ok('Removed Chrome hooks from settings.json');
        }
        removed.push(CLAUDE_SETTINGS);
      }
    }
  } catch (err) {
    errors.push(`Failed to clean hooks: ${err.message}`);
  }

  // --- Remove MCP from claude.json ---
  try {
    const config = readJsonSafe(CLAUDE_JSON);
    if (config.mcpServers && config.mcpServers['chrome-devtools']) {
      if (dryRun) {
        LOG.info('[DRY-RUN] Would remove chrome-devtools from ~/.claude.json');
      } else {
        delete config.mcpServers['chrome-devtools'];
        writeJson(CLAUDE_JSON, config);
        LOG.ok('Removed chrome-devtools MCP from ~/.claude.json');
      }
      removed.push(CLAUDE_JSON);
    }
  } catch (err) {
    errors.push(`Failed to clean MCP config: ${err.message}`);
  }

  // --- Remove KB files ---
  if (!keepKb) {
    const kbPaths = [
      path.join(SINAPSE_DIR, '.claude', 'rules', 'chrome-brain-autoload.md'),
      path.join(SINAPSE_DIR, 'sinapse', 'knowledge-base', 'chrome-brain.md'),
    ];
    for (const squad of SQUAD_NAMES) {
      kbPaths.push(path.join(SINAPSE_DIR, squad, 'knowledge-base', 'chrome-brain-integration.md'));
    }
    for (const kbPath of kbPaths) {
      try {
        if (fs.existsSync(kbPath)) {
          if (dryRun) {
            LOG.info(`[DRY-RUN] Would remove ${path.basename(kbPath)}`);
          } else {
            fs.unlinkSync(kbPath);
            LOG.ok(`Removed ${path.basename(kbPath)}`);
          }
          removed.push(kbPath);
        }
      } catch (err) {
        errors.push(`Failed to remove ${kbPath}: ${err.message}`);
      }
    }
  }

  const success = errors.length === 0;
  LOG.step(success ? 'Chrome Brain uninstalled.' : `Uninstall completed with ${errors.length} error(s)`);
  return { success, removed, errors };
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

/**
 * Checks installation status of all Chrome Brain components.
 *
 * @returns {{
 *   installed: boolean,
 *   chrome: { found: boolean, path: string|null, variant: string|null },
 *   components: {
 *     chromeDetected: boolean,
 *     scriptsInstalled: boolean,
 *     hooksConfigured: boolean,
 *     mcpConfigured: boolean,
 *     ruleInstalled: boolean,
 *     masterKbInstalled: boolean,
 *     squadKbCount: number
 *   }
 * }}
 */
function getChromeBrainStatus() {
  const osInfo = detectOS();
  const chrome = detectChrome();
  const binDir = getBinDir(osInfo);
  const ext = osInfo.type === OS_TYPE.WINDOWS ? '.cmd' : '';

  // Check scripts
  const scriptsInstalled = ['chrome-ensure', 'chrome-debug', 'chrome-brain-log']
    .every((name) => fs.existsSync(path.join(binDir, `${name}${ext}`)));

  // Check hooks
  let hooksConfigured = false;
  try {
    const settings = readJsonSafe(CLAUDE_SETTINGS);
    const pre = settings.hooks?.PreToolUse || [];
    const post = settings.hooks?.PostToolUse || [];
    const hasPre = pre.some((h) => h.matcher === 'mcp__chrome-devtools__*');
    const hasPost = post.some((h) => h.matcher === 'mcp__chrome-devtools__*');
    hooksConfigured = hasPre && hasPost;
  } catch {
    // not configured
  }

  // Check MCP
  let mcpConfigured = false;
  try {
    const config = readJsonSafe(CLAUDE_JSON);
    mcpConfigured = !!config.mcpServers?.['chrome-devtools'];
  } catch {
    // not configured
  }

  // Check rule
  const ruleInstalled = fs.existsSync(
    path.join(SINAPSE_DIR, '.claude', 'rules', 'chrome-brain-autoload.md'),
  );

  // Check master KB
  const masterKbInstalled = fs.existsSync(
    path.join(SINAPSE_DIR, 'sinapse', 'knowledge-base', 'chrome-brain.md'),
  );

  // Count squad KBs
  let squadKbCount = 0;
  for (const squad of SQUAD_NAMES) {
    if (fs.existsSync(path.join(SINAPSE_DIR, squad, 'knowledge-base', 'chrome-brain-integration.md'))) {
      squadKbCount++;
    }
  }

  const components = {
    chromeDetected: chrome.found,
    scriptsInstalled,
    hooksConfigured,
    mcpConfigured,
    ruleInstalled,
    masterKbInstalled,
    squadKbComplete: squadKbCount === SQUAD_NAMES.length,
  };

  const installed = Object.values(components).every((v) => v === true);

  return { installed, chrome, components, squadKbCount };
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  installChromeBrain,
  uninstallChromeBrain,
  getChromeBrainStatus,
  detectChrome,
};
