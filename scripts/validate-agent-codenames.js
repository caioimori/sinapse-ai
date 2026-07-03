#!/usr/bin/env node
/**
 * validate-agent-codenames — AuditFinding AF-20260629 #32 (+ AF-20260702 #1.10)
 *
 * Rejects DUPLICATE persona codenames (the `name:` field) shared across two or
 * more DISTINCT agents. A codename is an agent's public identity (Pixel, Litmus,
 * Meridian, ...); two unrelated agents answering to the same codename is a
 * collision that confuses routing, selos and the agent badges.
 *
 * Scope (sources scanned):
 *   - squads/{squad}/agents/*.md      (squad specialists + orqx)
 *   - sinapse/agents/*.md             (master squad)
 *   - .sinapse-ai/development/agents/*.md (framework core agents)
 *
 * Codename extraction (AF-20260702 #1.10 closes a blind spot here — the
 * original version only recognized a QUOTED `name: "X"`, so an unquoted
 * `name: X` (also valid YAML) was silently invisible to this guard):
 *   1. YAML `name:` field, first occurrence, quoted OR unquoted
 *      (`name: "Nexus"` and `name: Nexus` are both recognized). In every
 *      agent format the persona block sits at the top, so the first match is
 *      the codename — knowledge-base `name:` entries (mental models,
 *      subagent types, command lists) are nested under a `- ` list marker or
 *      appear far below and don't match the `^\s*name:` (no dash) anchor.
 *   2. If no YAML `name:` is found, fall back to a PROSE declaration — the
 *      two conventions actually in use across agent files with no YAML
 *      persona block: `# Agent: {Name} — {Title}` and a markdown identity
 *      bullet `- **Nome:** {Name}` / `- **Name:** {Name}`. This is how
 *      design-orqx.md declares "Nexus" (plain markdown, not YAML) and why
 *      the pre-fix guard could not see it at all.
 *
 * Files with neither form are skipped — there is no codename to compare.
 *
 * Allow-list: the master orchestrator (Imperator) is intentionally registered
 * under multiple entry-point files (snps-orqx / sinapse-orqx) — same logical
 * agent, dual register (Constitution Article XI). It is NOT a collision.
 *
 * Known pending debt: KNOWN_COLLISIONS_PENDING_TRIAGE (below) lists real,
 * pre-existing collisions this guard now detects but does NOT block on —
 * they are out of scope for the story that fixed this guard's blind spots
 * (see the constant's own comment) and are reported for visibility instead.
 *
 * Exit codes:
 *   0  every codename is unique (modulo the allow-list and pending debt)
 *   1  one or more NOT-yet-triaged codenames are shared by distinct agents
 *
 * Usage:
 *   node scripts/validate-agent-codenames.js
 *   node scripts/validate-agent-codenames.js --json
 *   node scripts/validate-agent-codenames.js --quiet
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

// Source directories that hold agent definition files.
const AGENT_DIRS = [
  path.join(PROJECT_ROOT, 'sinapse', 'agents'),
  path.join(PROJECT_ROOT, '.sinapse-ai', 'development', 'agents'),
];
const SQUADS_DIR = path.join(PROJECT_ROOT, 'squads');

// Codenames allowed to appear in more than one file because they are the SAME
// logical agent registered under multiple alias files (dual register).
const ALLOWED_DUPLICATES = new Set(['Imperator']);

// Known PRE-EXISTING collisions, NOT resolved by this guard (do not block).
//
// AF-20260702 #1.10 fixed two real blind spots: unquoted YAML `name:` and
// prose-only persona declarations (e.g. `# Agent: {Name} — {Title}`, used
// by several squads with no YAML persona block at all — squad-design's
// dx-* roster in particular). Looking at every agent file with both
// extraction paths surfaced 24 pre-existing codename collisions (Scope
// through Vertex) that NO version of this guard had ever seen before.
// Story onda1-s5 fixed one instance ("Nexus") and deliberately deferred
// these 24 to a follow-up triage (Onda 2) rather than blanket-rename
// without individual review (Constitution Article XI — Conservative
// Default).
//
// Story onda2-p7 (2026-07-02) did that triage. Verdict for all 24: every
// single one was a REAL collision between independently-named, established
// agents (never a detector false-positive, never genuinely ambiguous) — the
// palette of short evocative one-word codenames is small enough that 18+
// squads picked the same words independently. Winner kept by: (1) core
// framework agent beats squad agent, (2) squad orchestrator beats squad
// specialist (both cited in .sinapse-ai/development/agents/snps-orqx.md's
// master delegation-matrix), (3) among two specialists, semantic fit to the
// role + which squad already yielded more collisions elsewhere (kept
// squad-design's fragmented dx-* roster internally consistent rather than
// stranding 2 of 8 with stale names). All 27 renames (3 codenames were
// 3-way collisions) shipped with every live reference updated — own file,
// squad README, task "**Agent:**" headers, cross-agent handoff mentions,
// squad.yaml, and the master delegation-matrix in snps-orqx.md — verified
// by re-running this guard (0 blocking, 0 pending) plus a dedicated
// anchored-reference sweep (codename+old-agent-id co-occurrence, checked
// across the WHOLE repo, not just the renamed agent's home squad). Full
// old->new map and per-item reasoning: story `docs/stories/story-o2p7-agents-piloto.md`.
//
// This Set is intentionally EMPTY right now — every previously-known
// pending collision was triaged and resolved. It stays wired into
// `findCollisions()` as a NON-BLOCKING lane for whatever the guard's
// extraction next surfaces (e.g. if squad-content's task format is ever
// scanned the same way, or a new squad ships with an un-checked codename).
// It is deliberately NOT the same mechanism as ALLOWED_DUPLICATES above
// (that Set means "intentional, correct design"); an entry here means
// "known bug, not yet fixed". Removing a name because it was fixed is
// encouraged; ADDING a name to silence a *new* collision is not what this
// list is for — triage it (rename, or prove it's a detector false-positive)
// the same way this story did.
const KNOWN_COLLISIONS_PENDING_TRIAGE = new Set([]);

// Non-agent markdown that may live in an agents/ dir.
const SKIP_FILES = new Set(['README.md', 'MEMORY.md']);

function parseArgs(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  return { quiet: args.has('--quiet') || args.has('-q'), json: args.has('--json') };
}

function isAgentFile(fileName) {
  return (
    fileName.endsWith('.md') &&
    !SKIP_FILES.has(fileName) &&
    !fileName.startsWith('_')
  );
}

function collectAgentDirs() {
  const dirs = [...AGENT_DIRS];
  if (fs.existsSync(SQUADS_DIR)) {
    for (const entry of fs.readdirSync(SQUADS_DIR, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const agentsDir = path.join(SQUADS_DIR, entry.name, 'agents');
      if (fs.existsSync(agentsDir)) dirs.push(agentsDir);
    }
  }
  return dirs;
}

// A codename is 1-3 words: letters, spaces, apostrophes or hyphens only.
// Anchored to end-of-line so it can't accidentally swallow a trailing
// comment or a much longer sentence.
const CODENAME_CHARS = "[A-Za-z][A-Za-z'.-]*(?:\\s[A-Za-z][A-Za-z'.-]*){0,2}";

// YAML persona field: `name: X` or `name: "X"`, no `- ` list-item prefix
// (that would be a nested knowledge-base/command entry, not the persona).
const YAML_NAME_RE = new RegExp(`^[ \\t]*name:[ \\t]*"?(${CODENAME_CHARS})"?[ \\t]*$`, 'm');

// Prose fallback #1: `# Agent: {Name} — {Title}` (common orqx H1 format).
const PROSE_AGENT_HEADER_RE = new RegExp(`^#\\s*Agent:\\s*(${CODENAME_CHARS})\\s*[—-]`, 'm');

// Prose fallback #2: `# {agent-id} — {Name}` whole-line (e.g. content-orqx.md).
const PROSE_ID_HEADER_RE = new RegExp(`^#\\s*[\\w./-]+\\s*[—-]\\s*(${CODENAME_CHARS})\\s*$`, 'm');

// Prose fallback #3: markdown identity bullet `- **Nome:** X` / `- **Name:** X`.
const PROSE_NOME_BULLET_RE = new RegExp(`^-\\s*\\*\\*(?:Nome|Name):\\*\\*\\s*(${CODENAME_CHARS})\\s*$`, 'mi');

/**
 * Extract the agent codename and where it came from.
 *
 * Tries the YAML persona field first (quoted or unquoted); falls back to a
 * prose declaration for agent files with no YAML block at all (e.g.
 * design-orqx.md, which declares its codename in a plain markdown list).
 *
 * @returns {{ codename: string, source: 'yaml'|'prose' }|null}
 */
function extractCodenameWithSource(content) {
  const yamlMatch = content.match(YAML_NAME_RE);
  if (yamlMatch) return { codename: yamlMatch[1].trim(), source: 'yaml' };

  const proseMatch =
    content.match(PROSE_AGENT_HEADER_RE) ||
    content.match(PROSE_ID_HEADER_RE) ||
    content.match(PROSE_NOME_BULLET_RE);
  if (proseMatch) return { codename: proseMatch[1].trim(), source: 'prose' };

  return null;
}

/**
 * Extract just the codename string (back-compat convenience wrapper).
 * @returns {string|null}
 */
function extractCodename(content) {
  const result = extractCodenameWithSource(content);
  return result ? result.codename : null;
}

function collectCodenames() {
  const byName = new Map(); // codename -> [{ path, source }, ...]
  for (const dir of collectAgentDirs()) {
    let files;
    try {
      files = fs.readdirSync(dir).filter(isAgentFile);
    } catch {
      continue;
    }
    for (const file of files) {
      const filePath = path.join(dir, file);
      let content;
      try {
        content = fs.readFileSync(filePath, 'utf8');
      } catch {
        continue;
      }
      const found = extractCodenameWithSource(content);
      if (!found) continue;
      const relPath = path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');
      if (!byName.has(found.codename)) byName.set(found.codename, []);
      byName.get(found.codename).push({ path: relPath, source: found.source });
    }
  }
  return byName;
}

/**
 * @returns {{ blocking: Array, pending: Array }} blocking = real collisions
 *   this run should fail on; pending = known pre-existing collisions logged
 *   for visibility but excluded from the exit code (see
 *   KNOWN_COLLISIONS_PENDING_TRIAGE above).
 */
function findCollisions(byName) {
  const blocking = [];
  const pending = [];
  for (const [codename, entries] of byName) {
    if (entries.length <= 1) continue;
    const files = [...entries].sort((a, b) => a.path.localeCompare(b.path));
    if (ALLOWED_DUPLICATES.has(codename)) continue;
    if (KNOWN_COLLISIONS_PENDING_TRIAGE.has(codename)) {
      pending.push({ codename, files });
      continue;
    }
    blocking.push({ codename, files });
  }
  const byCodename = (a, b) => a.codename.localeCompare(b.codename);
  return { blocking: blocking.sort(byCodename), pending: pending.sort(byCodename) };
}

function formatReport(byName, { blocking, pending }) {
  const lines = [];
  const totalAgents = [...byName.values()].reduce((n, entries) => n + entries.length, 0);
  lines.push(`Scanned ${totalAgents} agent file(s) with a codename; ${byName.size} distinct codename(s).`);

  if (blocking.length === 0) {
    lines.push('OK — every codename is unique (master dual-register + known pending debt excluded).');
  } else {
    lines.push('');
    lines.push(`FAIL — ${blocking.length} duplicate codename(s) found:`);
    for (const c of blocking) {
      lines.push(`  "${c.codename}" used by ${c.files.length} agents:`);
      for (const f of c.files) lines.push(`    - ${f.path}${f.source === 'prose' ? ' (prose)' : ''}`);
    }
    lines.push('');
    lines.push('Fix: rename the least-canonical side to a unique codename.');
  }

  if (pending.length > 0) {
    lines.push('');
    lines.push(
      `NOTE — ${pending.length} known pre-existing collision(s) NOT blocking this run ` +
        '(tracked debt, see KNOWN_COLLISIONS_PENDING_TRIAGE — schema uniformization backlog):',
    );
    for (const c of pending) {
      lines.push(`  "${c.codename}" used by ${c.files.length} agents:`);
      for (const f of c.files) lines.push(`    - ${f.path}${f.source === 'prose' ? ' (prose)' : ''}`);
    }
  }

  return lines.join('\n');
}

function main() {
  const args = parseArgs();
  const byName = collectCodenames();
  const { blocking, pending } = findCollisions(byName);

  if (args.json) {
    console.log(JSON.stringify({ collisions: blocking, pendingCollisions: pending, distinct: byName.size }, null, 2));
  } else if (!args.quiet) {
    console.log('=== validate-agent-codenames ===');
    console.log(formatReport(byName, { blocking, pending }));
  }

  return blocking.length > 0 ? 1 : 0;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = {
  parseArgs,
  extractCodename,
  extractCodenameWithSource,
  collectAgentDirs,
  collectCodenames,
  findCollisions,
  formatReport,
  main,
  ALLOWED_DUPLICATES,
  KNOWN_COLLISIONS_PENDING_TRIAGE,
};
