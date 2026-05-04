#!/usr/bin/env node
'use strict';

/**
 * SINAPSE Brand Grounding Hook — UserPromptSubmit (framework-shipped).
 *
 * @story GA-1.6
 *
 * Reads `~/.claude/sinapse-ai-config.yaml` `brand` section and, when enabled,
 * injects the first 2000 chars of the user's brandbook as `<brand-grounding>`
 * context.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const HOOK_TIMEOUT_MS = 3500;
const MAX_INJECTION_SIZE = 2000;
const MAX_BRAND_PREVIEW = 2000;
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

function readBrandbook(brandbookPath) {
  try {
    if (!brandbookPath || !fs.existsSync(brandbookPath)) return null;
    const stat = fs.statSync(brandbookPath);
    let target = brandbookPath;
    if (stat.isDirectory()) {
      const candidates = ['brandbook.md', 'README.md', 'guidelines.md', 'brand.md'];
      target = null;
      for (const c of candidates) {
        const full = path.join(brandbookPath, c);
        if (fs.existsSync(full)) { target = full; break; }
      }
      if (!target) {
        const mds = fs.readdirSync(brandbookPath).filter((f) => f.endsWith('.md'));
        if (mds.length > 0) target = path.join(brandbookPath, mds[0]);
      }
      if (!target) return null;
    }
    let content = fs.readFileSync(target, 'utf8');
    if (content.length > MAX_BRAND_PREVIEW) {
      content = content.substring(0, MAX_BRAND_PREVIEW) + '\n[...truncated...]';
    }
    return content;
  } catch {
    return null;
  }
}

function buildInjection(section, brandContent) {
  const profileName = section.profileName || 'Custom Brand';
  const parts = [];
  parts.push(`<brand-grounding name="${profileName}">`);
  parts.push(`Brand detectada: ${profileName}`);
  if (brandContent) {
    parts.push('--- BRANDBOOK (primeiros 2000 chars) ---');
    parts.push(brandContent);
  } else {
    parts.push('(brandbookPath nao encontrado ou vazio)');
  }
  parts.push('</brand-grounding>');

  let full = parts.join('\n');
  if (full.length > MAX_INJECTION_SIZE) {
    const trailer = '\n[...truncated...]\n</brand-grounding>';
    full = full.substring(0, MAX_INJECTION_SIZE - trailer.length) + trailer;
  }
  return full;
}

async function main() {
  const input = await readStdin();
  if (!input || typeof input !== 'object') return;

  const userPrompt = input.prompt || input.user_prompt || input.message || '';
  if (typeof userPrompt !== 'string' || userPrompt.trim().length < MIN_PROMPT_CHARS) return;

  // Anti-double-injection
  if (userPrompt.includes('<brand-grounding')) return;

  const cfg = loadConfig();
  const section = getSection(cfg, 'brand');
  if (!section || !section.brandbookPath) return;

  const brandContent = readBrandbook(section.brandbookPath);
  const context = buildInjection(section, brandContent);

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
  readBrandbook,
  buildInjection,
  CONFIG_PATH,
  MAX_INJECTION_SIZE,
};
