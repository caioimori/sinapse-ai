#!/usr/bin/env node

/**
 * SINAPSE Unified Statusline v3 for Claude Code
 *
 * Displays: Session | Model | Context Bar | Time | Agent | Squad | Project:Branch | Git | Messages | Alert
 *
 * Installed automatically by `npx sinapse-ai install` when no existing statusline is detected.
 * Source: .sinapse-ai/product/templates/statusline/
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

let input = '';
process.stdin.on('data', (chunk) => { input += chunk; });

process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    console.log(buildStatusLine(data));
  } catch (error) {
    console.log(`err: ${error.message}`);
  }
});

function buildStatusLine(data) {
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const dim = '\x1b[2m';
  const red = '\x1b[31m';
  const green = '\x1b[32m';
  const yellow = '\x1b[33m';
  const blue = '\x1b[34m';
  const magenta = '\x1b[35m';
  const cyan = '\x1b[36m';
  const white = '\x1b[37m';
  const orange = '\x1b[38;5;208m';
  const boldBlue = `${bold}${blue}`;
  const boldRed = `${bold}${red}`;

  const parts = [];

  // 1. Session ID (first 8 chars)
  const sessionId = data.session_id || '';
  if (sessionId) parts.push(`${dim}${sessionId.substring(0, 8)}${reset}`);

  // 2. Model — derive from payload (display_name or id), strip parenthetical suffixes
  const rawModel = (data.model?.display_name || data.model?.id || '').replace(/\s*\([^)]*\)/g, '').trim();
  const modelName = rawModel || formatModel(data.model?.id || '');
  if (modelName) parts.push(`${boldBlue}${modelName}${reset}`);

  // 3. Context — progress bar + % + total (in/out)
  const usedPct = data.context_window?.used_percentage ?? null;
  const totalIn = data.context_window?.total_input_tokens ?? 0;
  const totalOut = data.context_window?.total_output_tokens ?? 0;
  if (usedPct !== null) {
    const bar = progressBar(usedPct, 10);
    const pctColor = usedPct > 80 ? red : usedPct > 60 ? yellow : green;
    const totalTokens = totalIn + totalOut;
    const inStr = fmtTokens(totalIn);
    const outStr = fmtTokens(totalOut);
    parts.push(`${bar} ${pctColor}${Math.round(usedPct)}%${reset} ${white}${fmtTokens(totalTokens)}${reset} ${dim}(\u2b07${inStr}/\u2b06${outStr})${reset}`);
  }

  // 4. Time
  const totalDuration = data.cost?.total_duration_ms ?? 0;
  if (totalDuration > 0) {
    const min = Math.floor(totalDuration / 60000);
    const sec = Math.floor((totalDuration % 60000) / 1000);
    parts.push(`${cyan}\u23f1 ${min}m${String(sec).padStart(2, '0')}s${reset}`);
  }

  // 5 & 6. Agent & Squad (from session cache + API fallback)
  const cache = readSessionCache();
  const badges = loadBadges();
  const agentBadge = resolveBadge(cache, badges);
  const activeAgent = cache.agent || data.agent?.name || '';
  const activeSquad = cache.squad || '';
  if (agentBadge) {
    // Public badge: {emoji} {Name} (e.g. "\ud83d\udcbb Pixel") instead of the raw id.
    parts.push(`${cyan}${agentBadge.emoji} ${agentBadge.name}${reset}`);
  } else if (activeAgent) {
    parts.push(`${cyan}\ud83e\udd16 ${activeAgent}${reset}`);
  }
  if (activeSquad) parts.push(`${orange}\ud83c\udfaf ${activeSquad}${reset}`);

  // 6.5 Orchestration \u2014 Imperator + active specialists (TTL 6h)
  // Back-compat: v1 cache lacks imperator/specialists \u2192 block silent (only \ud83e\udd16).
  const TTL = 21600;
  const nowSec = Math.floor(Date.now() / 1000);
  const imperator = cache.imperator;
  if (imperator?.active && (nowSec - imperator.ts) < TTL) {
    parts.push(`${bold}${magenta}\ud83d\udc51 IMPERATOR acionado${reset}`);
  }
  const ativos = (cache.specialists || []).filter(s => nowSec - s.ts < TTL);
  if (ativos.length > 0) {
    parts.push(`${cyan}\ud83e\udded ${ativos.length} especialistas: ${ativos.map(s => (badges && badges[s.id] ? badges[s.id].name : s.id)).join(', ')}${reset}`);
  }

  // 7. Project:Branch
  const gitInfo = getGitInfo();
  if (gitInfo.project) {
    parts.push(`${yellow}${gitInfo.project}${reset}:${magenta}${gitInfo.branch}${reset}`);
  }

  // 8. Git changes
  const linesAdded = data.cost?.total_lines_added ?? 0;
  const linesRemoved = data.cost?.total_lines_removed ?? 0;
  const filesChanged = gitInfo.filesChanged;
  if (linesAdded > 0 || linesRemoved > 0 || filesChanged > 0) {
    const fc = filesChanged > 0 ? `${filesChanged}f ` : '';
    parts.push(`\ud83d\udcdd ${white}${fc}${reset}${green}+${linesAdded}${reset} ${red}-${linesRemoved}${reset}`);
  }

  // 9. Message count (from transcript JSONL)
  const msgCount = countMessages(data.transcript_path);
  if (msgCount > 0) {
    parts.push(`${white}\ud83d\udd22 ${msgCount}${reset}`);
  }

  // 10. Alert >200k
  if (data.exceeds_200k_tokens) {
    parts.push(`${boldRed}\u26a0 >200k!${reset}`);
  }

  return parts.join(' | ');
}

// --- Helpers ---

// Fallback only — used when payload has neither display_name nor id.
// Returns a short family label without hardcoded version numbers (which go stale).
function formatModel(id) {
  if (!id) return '';
  if (id.includes('opus')) return 'Opus';
  if (id.includes('sonnet')) return 'Sonnet';
  if (id.includes('haiku')) return 'Haiku';
  return id.split('-').slice(0, 2).join(' ');
}

function progressBar(pct, width) {
  const filled = Math.round((pct / 100) * width);
  const empty = width - filled;
  const filledColor = pct > 80 ? '\x1b[31m' : pct > 60 ? '\x1b[33m' : '\x1b[32m';
  return `${filledColor}${'\u2588'.repeat(filled)}${'\u2591'.repeat(empty)}\x1b[0m`;
}

function fmtTokens(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

function readSessionCache() {
  // Back-compat: v1 cache {agent,squad} has no imperator/specialists/role —
  // those fields come back null/empty and the orchestration block stays silent.
  try {
    const cacheDir = path.join(os.homedir(), '.claude', 'session-cache');
    const cwd = process.cwd();
    const hash = simpleHash(cwd);
    const cachePath = path.join(cacheDir, `${hash}.json`);
    if (fs.existsSync(cachePath)) {
      const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      return {
        agent: cache.agent || '',
        squad: cache.squad || '',
        role: cache.role || null,
        imperator: cache.imperator || null,
        specialists: Array.isArray(cache.specialists) ? cache.specialists : [],
      };
    }
  } catch {}
  return { agent: '', squad: '', role: null, imperator: null, specialists: [] };
}

function loadBadges() {
  // id -> {emoji, area, name}. Keys are bare ids or "squad/id"; index by the last
  // segment to match what the session-cache stores. Best-effort — null on absence.
  try {
    const p = path.join(os.homedir(), '.claude', 'agent-badges.json');
    const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (!raw || typeof raw !== 'object') return null;
    const byId = {};
    for (const key of Object.keys(raw)) {
      const v = raw[key];
      if (v && v.emoji && v.name) byId[key.split('/').pop()] = v;
    }
    return Object.keys(byId).length ? byId : null;
  } catch {
    return null;
  }
}

function resolveBadge(cache, badges) {
  if (!badges) return null;
  if (cache.role === 'orqx' && cache.agent) {
    return badges[`${cache.agent}-orqx`] || badges[cache.agent] || null;
  }
  if (cache.agent) return badges[cache.agent] || null;
  return null;
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

function getGitInfo() {
  const result = { project: '', branch: '', filesChanged: 0 };
  try {
    const toplevel = execSync('git rev-parse --show-toplevel 2>/dev/null', { encoding: 'utf8', timeout: 3000 }).trim();
    result.project = path.basename(toplevel);
    result.branch = execSync('git rev-parse --abbrev-ref HEAD 2>/dev/null', { encoding: 'utf8', timeout: 3000 }).trim();
    const status = execSync('git status --porcelain 2>/dev/null', { encoding: 'utf8', timeout: 3000 }).trim();
    if (status) {
      result.filesChanged = status.split('\n').filter(l => l.trim()).length;
    }
  } catch {}
  return result;
}

function countMessages(transcriptPath) {
  if (!transcriptPath) return 0;
  try {
    const content = fs.readFileSync(transcriptPath, 'utf8');
    let count = 0;
    for (const line of content.split('\n')) {
      if (!line.trim()) continue;
      try {
        const entry = JSON.parse(line);
        if (entry.type === 'user' || entry.type === 'human') count++;
      } catch {}
    }
    return count;
  } catch {}
  return 0;
}

