#!/usr/bin/env node
/**
 * SINAPSE Agent/Squad Tracker (Detector) — Session-Cache v2
 *
 * Called via Claude Code UserPromptSubmit hook.
 *
 * This file REPLACES the legacy `track-agent.sh` bash wrapper. It is a native
 * Node implementation (no bash, no `node -e` string), so it runs portably on
 * Windows (Git Bash, PowerShell, cmd) and POSIX without quoting headaches.
 *
 * Detects in the user prompt:
 *   - @master            (sinapse / snps / sinapse-orqx / snps-orqx) -> imperator
 *   - @x-orqx            -> squad orchestrator (role=orqx, agent=base)
 *   - @id                -> specialist (role=specialist, push into specialists[])
 *   - /ns:agents:name    -> same classification as @name
 *   - /squad:cmd         -> sets squad (when not :agents:)
 *   - *exit / *reset     -> clears agent/squad/role/specialists + imperator.active
 *
 * Writes the per-CWD cache to:
 *   ~/.claude/session-cache/{simpleHash(cwd)}.json   (Session-Cache v2 shape)
 *
 * FAIL-OPEN: any error -> exit 0 without writing. Never blocks the prompt.
 *
 * Installed automatically by `npx sinapse-ai install`.
 * Source: .sinapse-ai/product/templates/statusline/
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const MASTERS = new Set(['sinapse', 'snps', 'sinapse-orqx', 'snps-orqx']);
const SPECIALIST_CAP = 6;
const BADGE_TTL = 21600; // 6h — mirrors the statusline freshness window.
const IMPERATOR_KEY = 'snps-orqx'; // badge key for the master / Imperator voice.

// Identical to track-agent.sh and statusline-script.js.
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(16);
}

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

// Read stdin synchronously (fd 0). Returns '' on any failure.
function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

// Normalize an existing cache object to the v2 shape (migrate v1 {agent,squad}).
function normalizeCache(raw) {
  const base = {
    version: 2,
    agent: '',
    squad: '',
    role: null,
    imperator: { active: false, ts: 0 },
    specialists: [],
    updated: '',
  };
  if (!raw || typeof raw !== 'object') return base;

  base.agent = typeof raw.agent === 'string' ? raw.agent : '';
  base.squad = typeof raw.squad === 'string' ? raw.squad : '';
  base.role = typeof raw.role === 'string' ? raw.role : null;

  if (raw.imperator && typeof raw.imperator === 'object') {
    base.imperator = {
      active: !!raw.imperator.active,
      ts: Number.isFinite(raw.imperator.ts) ? raw.imperator.ts : 0,
    };
  }

  if (Array.isArray(raw.specialists)) {
    base.specialists = raw.specialists
      .filter((s) => s && typeof s === 'object' && typeof s.id === 'string' && s.id)
      .map((s) => ({
        id: s.id,
        label: typeof s.label === 'string' && s.label ? s.label : s.id,
        icon: typeof s.icon === 'string' && s.icon ? s.icon : '🤖',
        ts: Number.isFinite(s.ts) ? s.ts : nowSec(),
      }));
  }

  return base;
}

// Classify a bare agent/master name (already lowercased) and mutate cache.
function applyName(cache, name, ts) {
  if (!name) return;
  const lower = name.toLowerCase();

  if (MASTERS.has(lower)) {
    // Master -> imperator. Does NOT enter specialists.
    cache.imperator = { active: true, ts };
    cache.role = 'imperator';
    return;
  }

  if (lower.endsWith('-orqx')) {
    // Squad orchestrator. agent = base (without -orqx). Not a specialist.
    cache.role = 'orqx';
    cache.agent = lower.replace(/-orqx$/, '');
    return;
  }

  // Specialist.
  cache.role = 'specialist';
  cache.agent = lower;

  const exists = cache.specialists.some((s) => s.id.toLowerCase() === lower);
  if (!exists) {
    cache.specialists.push({ id: lower, label: lower, icon: '🤖', ts });
    if (cache.specialists.length > SPECIALIST_CAP) {
      // Drop the one with the lowest ts (oldest).
      let minIdx = 0;
      for (let i = 1; i < cache.specialists.length; i++) {
        if (cache.specialists[i].ts < cache.specialists[minIdx].ts) minIdx = i;
      }
      cache.specialists.splice(minIdx, 1);
    }
  }
}

// ── Badge injection ──────────────────────────────────────────────────────────
// The detector also surfaces the speaking agent's public badge to the model via
// the UserPromptSubmit `additionalContext` channel, so every response can open
// with the right seal. Pure best-effort: any failure → no injection, never block.

// Load ~/.claude/agent-badges.json and index by last path segment. Keys are
// either bare ids ("developer") or "squad/id" ("squad-brand/brand-orqx"); the
// session-cache only ever stores the bare id, so we index on the last segment.
function loadBadges() {
  try {
    const p = path.join(os.homedir(), '.claude', 'agent-badges.json');
    const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (!raw || typeof raw !== 'object') return null;
    const byId = {};
    for (const key of Object.keys(raw)) {
      const v = raw[key];
      if (!v || typeof v !== 'object' || !v.emoji || !v.name) continue;
      byId[key.split('/').pop()] = v;
    }
    return Object.keys(byId).length ? byId : null;
  } catch {
    return null;
  }
}

function fullBadge(b) {
  return `▌ ${b.emoji} · SNPS · ${b.area || ''} · ${b.name}`.replace(/ ·  · /, ' · ');
}
function shortBadge(b) {
  return `▌ ${b.emoji} ${b.name}`;
}

// Resolve the primary speaking voice. cache.role reflects the LAST classified
// mention, so it doubles as the recency signal (imperator vs orqx vs specialist).
function resolvePrimary(cache, byId) {
  if (cache.role === 'imperator') return byId[IMPERATOR_KEY] || null;
  if (cache.role === 'orqx' && cache.agent) {
    return byId[`${cache.agent}-orqx`] || byId[cache.agent] || null;
  }
  if (cache.agent) return byId[cache.agent] || null;
  if (cache.imperator && cache.imperator.active) return byId[IMPERATOR_KEY] || null;
  return null;
}

// Build the additionalContext string, or null when no SINAPSE voice is active.
function buildBadgeContext(cache) {
  const byId = loadBadges();
  if (!byId) return null;

  const now = nowSec();
  const primary = resolvePrimary(cache, byId);

  // The specialist roster is only meaningful while the Imperator is coordinating
  // a multi-agent orchestration; a plain specialist↔specialist switch shows just
  // the active voice (no roster noise).
  const imperatorActive =
    cache.imperator && cache.imperator.active && now - (cache.imperator.ts || 0) < BADGE_TTL;
  const specs = imperatorActive
    ? (cache.specialists || [])
        .filter((s) => s && s.id && s.id !== cache.agent && now - (s.ts || 0) < BADGE_TTL)
        .map((s) => byId[s.id])
        .filter(Boolean)
    : [];

  if (!primary && specs.length === 0) return null;

  const lines = [];
  lines.push('<sinapse-selo>');
  lines.push('Identidade pública dos agentes SINAPSE. Aplique o protocolo de selo na sua resposta.');
  lines.push('');
  if (primary) {
    lines.push(`Voz ativa → cheio: ${fullBadge(primary)}   curto: ${shortBadge(primary)}`);
  }
  if (specs.length) {
    lines.push('Especialistas em jogo nesta orquestração:');
    for (const b of specs) lines.push(`  • ${fullBadge(b)}   (curto: ${shortBadge(b)})`);
  }
  lines.push('');
  lines.push('Protocolo (NON-NEGOTIABLE):');
  lines.push('1. Abra a resposta com o selo do agente que está falando — 1ª linha, SÓ na troca de voz. Mesma voz em blocos seguidos não repete o selo.');
  lines.push('2. Estreia da voz nesta conversa = selo CHEIO. Volta de uma voz já apresentada = selo CURTO.');
  lines.push('3. Orquestrador (Imperator / -orqx): selo → apresenta o PLANO → ESPERA o "pode ir" do usuário → executa os handoffs (cada agente entra com seu selo) → consolida no fim.');
  lines.push('4. O selo (emoji · SNPS · área · nome) É a identidade pública — nunca exponha @ids técnicos nem estrutura interna ao usuário.');
  lines.push('</sinapse-selo>');

  return lines.join('\n');
}

function emitBadge(cache) {
  try {
    const ctx = buildBadgeContext(cache);
    if (!ctx) return;
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'UserPromptSubmit',
          additionalContext: ctx,
        },
      })
    );
  } catch {
    /* fail-soft: a badge is never worth blocking a prompt. */
  }
}

function main() {
  const input = readStdin();
  if (!input) process.exit(0);

  let prompt = '';
  try {
    const j = JSON.parse(input);
    prompt = j.prompt || j.message || '';
  } catch {
    process.exit(0);
  }
  if (!prompt || typeof prompt !== 'string') process.exit(0);

  const cacheDir = path.join(os.homedir(), '.claude', 'session-cache');
  try {
    fs.mkdirSync(cacheDir, { recursive: true });
  } catch {
    process.exit(0);
  }

  const cacheFile = path.join(cacheDir, `${simpleHash(process.cwd())}.json`);

  let cache;
  try {
    cache = normalizeCache(JSON.parse(fs.readFileSync(cacheFile, 'utf8')));
  } catch {
    cache = normalizeCache(null);
  }

  const ts = nowSec();
  let changed = false;

  // *exit / *reset -> full reset (wins over everything in the prompt).
  if (/(^|\s)\*(exit|reset)\b/.test(prompt)) {
    cache.agent = '';
    cache.squad = '';
    cache.role = null;
    cache.specialists = [];
    cache.imperator = { active: false, ts: cache.imperator.ts || 0 };
    changed = true;
  } else {
    // /ns:agents:name  (e.g. /SINAPSE:agents:developer) -> classify as @name.
    const nsMatch = prompt.match(/\/[a-zA-Z_-]+:agents:([a-zA-Z_-]+)/);
    if (nsMatch) {
      applyName(cache, nsMatch[1], ts);
      changed = true;
    }

    // @name  -> classify (master / -orqx / specialist).
    const agentMatch = prompt.match(/@([a-zA-Z_-]+)/);
    if (agentMatch) {
      applyName(cache, agentMatch[1], ts);
      changed = true;
    }

    // /squad:cmd  (NOT :ns:agents:name) -> set squad.
    // Guard: skip any /word:... whose command segment is `agents` (the
    // namespaced-agent form /ns:agents:name), which is handled above.
    const squadMatch = prompt.match(/\/([a-zA-Z_-]+):([a-zA-Z_-]+)/);
    if (squadMatch && squadMatch[2].toLowerCase() !== 'agents') {
      cache.squad = squadMatch[1];
      changed = true;
    }
  }

  if (changed) {
    cache.version = 2;
    cache.updated = new Date().toISOString();
    try {
      fs.writeFileSync(cacheFile, JSON.stringify(cache));
    } catch {
      /* cache write is best-effort — still try to inject the badge below. */
    }
  }

  // Inject the active agent's badge even on continuation turns (no new mention
  // keeps the same voice active). Fail-soft and silent when no voice is active.
  emitBadge(cache);

  process.exit(0);
}

try {
  main();
} catch {
  process.exit(0);
}
