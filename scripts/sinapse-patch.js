#!/usr/bin/env node
/**
 * SINAPSE CODE — Patch de Branding para Claude Code CLI
 * Substitui toda identidade visual do Claude Code pelo branding SINAPSE
 *
 * Uso: node sinapse-patch.js
 * Reverter: npm install -g @anthropic-ai/claude-code
 *
 * Compativel com: macOS, Linux, Windows (via Git Bash / WSL)
 * Requer: Node.js 18+ e Claude Code instalado globalmente via npm
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// ─────────────────────────────────────────────
// Detecta o caminho do Claude Code CLI
// ─────────────────────────────────────────────
function findCliPath() {
  const HOME = os.homedir();

  // Caminhos possiveis (npm global, nvm, default)
  const candidates = [
    path.join(HOME, '.npm-global/lib/node_modules/@anthropic-ai/claude-code/cli.js'),
    path.join(HOME, '.nvm/versions/node', process.version, 'lib/node_modules/@anthropic-ai/claude-code/cli.js'),
    // npm root -g
    '/usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js',
    '/usr/lib/node_modules/@anthropic-ai/claude-code/cli.js',
  ];

  // Tenta npm root -g como fallback
  try {
    const { execSync } = require('child_process');
    const npmRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
    candidates.unshift(path.join(npmRoot, '@anthropic-ai/claude-code/cli.js'));
  } catch {}

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const CLI_PATH = findCliPath();

if (!CLI_PATH) {
  console.error('\n[ERRO] Claude Code CLI nao encontrado.');
  console.error('Certifique-se de ter instalado com: npm install -g @anthropic-ai/claude-code');
  console.error('Depois rode este script novamente.\n');
  process.exit(1);
}

console.log('CLI encontrado em:', CLI_PATH);

// ─────────────────────────────────────────────
// Backup do original
// ─────────────────────────────────────────────
const BACKUP_PATH = CLI_PATH + '.bak';
if (!fs.existsSync(BACKUP_PATH)) {
  fs.copyFileSync(CLI_PATH, BACKUP_PATH);
  console.log('Backup criado:', BACKUP_PATH);
} else {
  console.log('Backup existente sera usado:', BACKUP_PATH);
}

// Sempre parte do backup limpo (idempotente)
let content = fs.readFileSync(BACKUP_PATH, 'utf8');
let changes = 0;

function r(search, replacement, description) {
  const before = content;
  if (typeof search === 'string') {
    content = content.split(search).join(replacement);
  } else {
    content = content.replace(search, replacement);
  }
  if (content !== before) {
    changes++;
    console.log('  +', description);
  }
}

console.log('\n--- Aplicando patch SINAPSE CODE ---\n');

// ═══════════════════════════════════════════════════
// 1. CORES — Claude orange → White (#FFF)
//    Altera todos os 4 temas do Claude Code
// ═══════════════════════════════════════════════════
console.log('[Cores]');
r('claude:"rgb(215,119,87)",claudeShimmer:"rgb(245,149,117)"',
  'claude:"rgb(255,255,255)",claudeShimmer:"rgb(220,220,220)"', 'dark');
r('claude:"rgb(255,153,51)",claudeShimmer:"rgb(255,183,101)",claudeBlue_FOR_SYSTEM_SPINNER:"rgb(51,102,255)",claudeBlueShimmer_FOR_SYSTEM_SPINNER:"rgb(101,152,255)"',
  'claude:"rgb(255,255,255)",claudeShimmer:"rgb(220,220,220)",claudeBlue_FOR_SYSTEM_SPINNER:"rgb(255,255,255)",claudeBlueShimmer_FOR_SYSTEM_SPINNER:"rgb(220,220,220)"', 'light');
r('claude:"rgb(215,119,87)",claudeShimmer:"rgb(235,159,127)"',
  'claude:"rgb(255,255,255)",claudeShimmer:"rgb(220,220,220)"', 'dark-daltonized');
r('claude:"rgb(255,153,51)",claudeShimmer:"rgb(255,183,101)",claudeBlue_FOR_SYSTEM_SPINNER:"rgb(153,204,255)",claudeBlueShimmer_FOR_SYSTEM_SPINNER:"rgb(183,224,255)"',
  'claude:"rgb(255,255,255)",claudeShimmer:"rgb(220,220,220)",claudeBlue_FOR_SYSTEM_SPINNER:"rgb(255,255,255)",claudeBlueShimmer_FOR_SYSTEM_SPINNER:"rgb(220,220,220)"', 'light-daltonized');

// ═══════════════════════════════════════════════════
// 2. ICONE — Sparkle (✻) → Diamond (◆)
//    Inclui animacao e todas as variantes por OS
// ═══════════════════════════════════════════════════
console.log('[Icone]');
r('$s="✻"', '$s="◆"', 'sparkle principal');
r('AY1="∙"', 'AY1="·"', 'dot');
r('["·","✢","✳","✶","✻","✽"]', '["·","◇","◈","◆","◆","◇"]', 'frames macOS');
r('["·","✢","✳","✶","✻","*"]', '["·","◇","◈","◆","◆","◇"]', 'frames Ghostty');
r('["·","✢","*","✶","✻","✽"]', '["·","◇","◈","◆","◆","◇"]', 'frames Linux');
r('"✻ Thinking…"', '"◆ Thinking…"', 'thinking');
r('"✻ Conversation compacted ("', '"◆ Conversation compacted ("', 'compacted');
r('createElement(T,{color:"claude"},"✻ ")', 'createElement(T,{color:"claude"},"◆ ")', 'welcome icon');
r('createElement(T,{color:"claude"}," ✻")', 'createElement(T,{color:"claude"}," ◆")', 'marketplace icon');
r('"[✻] [✻] [✻]"', '"[◆] [◆] [◆]"', 'guest passes');

// ═══════════════════════════════════════════════════
// 3. TEXTO — "Claude Code" → "SINAPSE CODE"
//    Altera titulo, system prompt, UI, mensagens
// ═══════════════════════════════════════════════════
console.log('[Texto]');
r('mL4="Claude Code"', 'mL4="SINAPSE CODE"', 'titulo principal');
r('(" Claude Code ")', '(" SINAPSE CODE ")', 'border title');
r('kP1="You are Claude Code, Anthropic\'s official CLI for Claude."',
  'kP1="You are SINAPSE CODE, an advanced AI coding assistant."', 'system prompt');
r('su7="You are Claude Code, Anthropic\'s official CLI for Claude, running within the Claude Agent SDK."',
  'su7="You are SINAPSE CODE, an advanced AI coding assistant, running within the Agent SDK."', 'system prompt SDK');
r('"Welcome to Claude Code for "', '"Welcome to SINAPSE CODE for "', 'welcome');
r('"Claude Code can be used with your Claude subscription or billed based on API usage through your Console account."',
  '"SINAPSE CODE can be used with your Claude subscription or billed based on API usage through your Console account."', 'login');
r('"Claude Code supports Amazon Bedrock, Microsoft Foundry, and Vertex AI. Set the required environment variables, then restart Claude Code."',
  '"SINAPSE CODE supports Amazon Bedrock, Microsoft Foundry, and Vertex AI. Set the required environment variables, then restart SINAPSE CODE."', '3rd party');
r('"Important: Only use Claude Code with files you trust. Accessing untrusted files may pose security risks"',
  '"Important: Only use SINAPSE CODE with files you trust. Accessing untrusted files may pose security risks"', 'security');
r('"Claude Code login successful"', '"SINAPSE CODE login successful"', 'login success');
r('"Claude Code will be able to read files in this directory and make edits when auto-accept edits is on."',
  '"SINAPSE CODE will be able to read files in this directory and make edits when auto-accept edits is on."', 'add-dir');
r('"Claude Code\'s functionality (eg. to reduce the risk of bugs occurring in the future)."',
  '"SINAPSE CODE\'s functionality (eg. to reduce the risk of bugs occurring in the future)."', 'feedback');
r('"Run /status in Claude Code to check your account."',
  '"Run /status in SINAPSE CODE to check your account."', 'status');
r(/future Claude Code sessions/g, 'future SINAPSE CODE sessions', 'model switch');
r(/Claude Code will automatically update/g, 'SINAPSE CODE will automatically update', 'auto-update');
r('"Please install git and restart Claude Code."', '"Please install git and restart SINAPSE CODE."', 'git install');
r("Claude is up to date!\n", "SINAPSE is up to date!\n", 'up to date');
r("Claude is managed by winget.\n", "SINAPSE is managed by winget.\n", 'winget');
r("Claude is managed by apk.\n", "SINAPSE is managed by apk.\n", 'apk');
r("Claude is managed by a package manager.\n", "SINAPSE is managed by a package manager.\n", 'pkg manager');
r("This tool allows Claude Code to read images", "This tool allows SINAPSE CODE to read images", 'read tool');
r("Claude Code is a multimodal LLM", "SINAPSE CODE is a multimodal LLM", 'multimodal');
r("Default permission mode when Claude Code needs access", "Default permission mode when SINAPSE CODE needs access", 'settings 1');
r("JSON Schema reference for Claude Code settings", "JSON Schema reference for SINAPSE CODE settings", 'settings 2');
r("Environment variables to set for Claude Code sessions", "Environment variables to set for SINAPSE CODE sessions", 'settings 3');
r("standard Claude Code attribution", "standard SINAPSE CODE attribution", 'attribution');
r("Override the default model used by Claude Code", "Override the default model used by SINAPSE CODE", 'model desc');
r("Claude Code auto-stash", "SINAPSE CODE auto-stash", 'git stash');
r("Claude Code was unable to find", "SINAPSE CODE was unable to find", 'win bash');
r("Claude Code on Windows requires git-bash", "SINAPSE CODE on Windows requires git-bash", 'win git-bash');
r("Cost of the Claude Code session", "Cost of the SINAPSE CODE session", 'cost counter');

// ═══════════════════════════════════════════════════
// 4. LOGO — Substitui mascot Clawd por SINAPSE ASCII
//    Figlet-style, renderizado no welcome dashboard
// ═══════════════════════════════════════════════════
console.log('[Logo]');

const LOGO_LINES = [
  "███████╗██╗███╗   ██╗ █████╗ ██████╗ ███████╗███████╗",
  "██╔════╝██║████╗  ██║██╔══██╗██╔══██╗██╔════╝██╔════╝",
  "███████╗██║██╔██╗ ██║███████║██████╔╝███████╗█████╗  ",
  "╚════██║██║██║╚██╗██║██╔══██║██╔═══╝ ╚════██║██╔══╝  ",
  "███████║██║██║ ╚████║██║  ██║██║     ███████║███████╗",
  "╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚══════╝╚══════╝",
];

const newLogo = `function HV6(){let q=z6(2),P;if(q[0]===Symbol.for("react.memo_cache_sentinel")){let lines=[${LOGO_LINES.map(l => JSON.stringify(l)).join(",")}];P=i9.createElement(B,{flexDirection:"column",alignItems:"center"},lines.map((l,i)=>i9.createElement(T,{key:i,color:"claude"},l))),q[0]=P}else P=q[0];return P}`;

// Substitui HV6 (componente principal do mascot)
const hv6Start = content.indexOf("function HV6(A){");
if (hv6Start !== -1) {
  const hv6Area = content.substring(hv6Start);
  let depth = 0, endPos = -1;
  for (let i = hv6Area.indexOf("{"); i < hv6Area.length; i++) {
    if (hv6Area[i] === "{") depth++;
    if (hv6Area[i] === "}") { depth--; if (depth === 0) { endPos = i + 1; break; } }
  }
  if (endPos !== -1) {
    content = content.substring(0, hv6Start) + newLogo + content.substring(hv6Start + endPos);
    changes++;
    console.log('  + HV6 mascot -> SINAPSE logo');
  }
}

// Substitui dKY (fallback Apple Terminal)
const dkyStart = content.indexOf("function dKY(A){");
if (dkyStart !== -1) {
  const dkyArea = content.substring(dkyStart);
  let depth = 0, endPos = -1;
  for (let i = dkyArea.indexOf("{"); i < dkyArea.length; i++) {
    if (dkyArea[i] === "{") depth++;
    if (dkyArea[i] === "}") { depth--; if (depth === 0) { endPos = i + 1; break; } }
  }
  if (endPos !== -1) {
    const newDKY = newLogo.replace("HV6", "dKY");
    content = content.substring(0, dkyStart) + newDKY + content.substring(dkyStart + endPos);
    changes++;
    console.log('  + dKY fallback -> SINAPSE logo');
  }
}

// ═══════════════════════════════════════════════════
// SALVAR
// ═══════════════════════════════════════════════════
fs.writeFileSync(CLI_PATH, content, 'utf8');

console.log(`\n=== Patch aplicado com sucesso: ${changes} alteracoes ===`);
console.log('');
console.log('Feche o terminal e abra novamente para ver as mudancas.');
console.log('');
console.log('Para reverter:');
console.log('  cp "' + BACKUP_PATH + '" "' + CLI_PATH + '"');
console.log('  ou: npm install -g @anthropic-ai/claude-code');
console.log('');
console.log('Para reaplicar apos update do Claude Code:');
console.log('  node sinapse-patch.js');
console.log('');
