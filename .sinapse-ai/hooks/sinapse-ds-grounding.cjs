#!/usr/bin/env node
'use strict';

/**
 * SINAPSE Design System Grounding Hook — UserPromptSubmit (framework-shipped).
 *
 * @story GA-1.6
 *
 * Reads `~/.claude/sinapse-ai-config.yaml` (Story 10.47 schema) `designSystem`
 * section. Activates only when the user prompt contains UI keywords
 * (PT + EN). Injects the first 3000 chars of the DS law file as
 * `<ds-grounding>` context.
 *
 * Coexistence: Caio's personal `~/.claude/hooks/design-system-grounding.cjs`
 * reads `ds-routing.json` and is unaffected by this file.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const HOOK_TIMEOUT_MS = 3500;
const MAX_INJECTION_SIZE = 3000; // chars (story says 3000 for DS)
const MAX_LAW_PREVIEW = 3000;
const MIN_PROMPT_CHARS = 15;
const CONFIG_PATH = path.join(os.homedir(), '.claude', 'sinapse-ai-config.yaml');

const UI_KEYWORDS = [
  // PT
  'pagina', 'página', 'lp', 'landing', 'componente', 'interface', 'tela',
  'layout', 'hero', 'dashboard', 'carrossel', 'slide', 'mockup',
  'wireframe', 'prototipo', 'protótipo', 'design', 'visual', 'site',
  'website', 'menu', 'navbar', 'footer', 'botao', 'botão', 'card', 'cards',
  'secao', 'seção', 'frontend', 'front-end', 'figma', 'react', 'tailwind',
  'nextjs', 'next.js', 'redesign', 'tipografia', 'paleta',
  // EN
  'page', 'component', 'screen', 'section', 'button', 'typography',
  'palette', 'web app', 'ui ', ' ui',
];

// Candidate filenames to read as the DS law, in priority order.
const LAW_CANDIDATES = [
  '0.0-guidelines.md',
  'guidelines.md',
  'principles.md',
  'README.md',
  'tokens.json',
  'design-system.md',
];

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

function loadConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) return null;
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    let yaml;
    try { yaml = require('js-yaml'); } catch { return null; }
    const parsed = yaml.load(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
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

function isUIPrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') return false;
  if (prompt.trim().length < MIN_PROMPT_CHARS) return false;
  const lower = prompt.toLowerCase();
  return UI_KEYWORDS.some((k) => lower.includes(k));
}

function findLawFile(rootPath) {
  try {
    if (!rootPath || !fs.existsSync(rootPath)) return null;
    const stat = fs.statSync(rootPath);
    if (!stat.isDirectory()) {
      // If user passed a file directly, use it.
      return rootPath;
    }
    for (const candidate of LAW_CANDIDATES) {
      const full = path.join(rootPath, candidate);
      if (fs.existsSync(full)) return full;
    }
    // Fallback: first .md/.json in the dir
    const entries = fs.readdirSync(rootPath).filter(
      (f) => f.endsWith('.md') || f.endsWith('.json')
    );
    if (entries.length > 0) return path.join(rootPath, entries[0]);
    return null;
  } catch {
    return null;
  }
}

function readLaw(lawFile) {
  try {
    if (!lawFile || !fs.existsSync(lawFile)) return null;
    let content = fs.readFileSync(lawFile, 'utf8');
    if (content.length > MAX_LAW_PREVIEW) {
      content = content.substring(0, MAX_LAW_PREVIEW) + '\n[...truncated...]';
    }
    return content;
  } catch {
    return null;
  }
}

function buildInjection(section, lawContent, projectCwd) {
  const profileName = section.profileName || 'Custom DS';
  const rootPath = section.rootPath || '';
  const parts = [];
  parts.push(`<ds-grounding source="filesystem" name="${profileName}" project="${projectCwd}">`);
  parts.push(`DS detectado: ${profileName}`);
  parts.push(`Localizacao: ${rootPath}`);
  if (lawContent) {
    parts.push('--- LEI DO DS (primeiros 3000 chars) ---');
    parts.push(lawContent);
  } else {
    parts.push('(nenhum arquivo de lei encontrado em rootPath)');
  }
  parts.push('</ds-grounding>');

  let full = parts.join('\n');
  if (full.length > MAX_INJECTION_SIZE) {
    const trailer = '\n[...truncated...]\n</ds-grounding>';
    full = full.substring(0, MAX_INJECTION_SIZE - trailer.length) + trailer;
  }
  return full;
}

async function main() {
  const input = await readStdin();
  if (!input || typeof input !== 'object') return;

  const userPrompt = input.prompt || input.user_prompt || input.message || '';
  if (!isUIPrompt(userPrompt)) return;

  // Anti-double-injection
  if (userPrompt.includes('<ds-grounding')) return;

  const cfg = loadConfig();
  const section = getSection(cfg, 'designSystem');
  if (!section || !section.rootPath) return;

  const lawFile = findLawFile(section.rootPath);
  const lawContent = readLaw(lawFile);
  const projectCwd = input.cwd || process.cwd();
  const context = buildInjection(section, lawContent, projectCwd);

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
  loadConfig,
  getSection,
  isUIPrompt,
  findLawFile,
  readLaw,
  buildInjection,
  UI_KEYWORDS,
  CONFIG_PATH,
  MAX_INJECTION_SIZE,
};
