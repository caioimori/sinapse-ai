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
// dx-* roster in particular). Actually looking at every agent file with
// both extraction paths surfaced this much wider set of pre-existing
// codename collisions that NO version of this guard had ever seen before —
// most because one or both sides only ever declared their codename in
// prose, which nothing checked until now.
//
// Story onda1-s5 (AF-20260702 item 1.10) authorized fixing exactly ONE of
// these — "Nexus" (design-orqx keeps it; swarm-orqx and content-orqx were
// renamed) — because that was the one instance the audit's adversarial
// verification manually confirmed. Renaming the agents below was explicitly
// OUT of this story's scope (see "Escopo OUT: Uniformização de schema dos
// 189 agents (Onda 2)" in the story) — several span squads never touched by
// this change, and blanket-renaming them here would be exactly the kind of
// unreviewed, ungrounded cross-squad rename Constitution Article XI
// (Conservative Default) warns against.
//
// This list exists so the guard can ship as a REAL, enforceable CI/pre-push
// gate today without retroactively blocking every future push over debt
// nobody has triaged yet. It is deliberately NOT the same mechanism as
// ALLOWED_DUPLICATES above (that Set means "intentional, correct design");
// every entry here means "known bug, not yet fixed — see Onda 2 backlog".
// Removing a name from this list (because it was actually fixed) is
// encouraged; ADDING a name here to silence a *new* collision is not what
// this list is for.
const KNOWN_COLLISIONS_PENDING_TRIAGE = new Set([
  'Scope', // .sinapse-ai/development/agents/analyst.md vs squads/squad-research/agents/market-analyst.md
  'Loom', // .sinapse-ai/development/agents/squad-creator.md vs squads/squad-research/agents/data-synthesizer.md
  'Apex', // squads/squad-design/agents/dx-performance-engineer.md vs squads/squad-paidmedia/agents/paidmedia-orqx.md
  'Beacon', // .sinapse-ai/development/agents/project-lead.md vs squads/squad-design/agents/dx-accessibility-specialist.md
  'Canvas', // squads/squad-design/agents/dx-ui-designer.md vs squads/squad-paidmedia/agents/creative-strategist.md
  'Compass', // squads/squad-courses/agents/curriculum-designer.md vs squads/squad-design/agents/dx-ux-strategist.md
  'Convert', // squads/squad-design, squad-growth, squad-paidmedia (cro-persuasion / ga-cro-specialist / cro-specialist)
  'Flow', // squads/squad-copy/agents/funnel-copywriter.md vs squads/squad-finance/agents/revenue-analyst.md
  'Flux', // squads/squad-animations/agents/css-motion-artist.md vs squads/squad-brand/agents/brand-motion-vfx.md
  'Forge', // squads/squad-cloning/agents/agent-forger.md vs squads/squad-copy/agents/direct-response-writer.md
  'Horizon', // squads/squad-finance/agents/forecast-strategist.md vs squads/squad-research/agents/trend-forecaster.md
  'Kinetic', // squads/squad-animations/agents/animations-orqx.md vs squads/squad-design/agents/dx-interaction-designer.md
  'Ledger', // squads/squad-commercial/agents/cs-revops-analyst.md vs squads/squad-finance/agents/finance-orqx.md
  'Lens', // squads/squad-animations, squad-content, squad-paidmedia (animation-interpreter / content-analyst / pm-creative-performance-analyst)
  'Mint', // squads/squad-commercial/agents/cs-offer-designer.md vs squads/squad-finance/agents/pricing-strategist.md
  'Mosaic', // .sinapse-ai/development/agents/ux-design-expert.md vs squads/squad-product/agents/ps-product-ops-specialist.md
  'Pipeline', // .sinapse-ai/development/agents/devops.md vs squads/squad-commercial/agents/commercial-orqx.md
  'Pulse', // squads/squad-growth, squad-paidmedia, squad-research (ga-campaign-analyst / campaign-analyst / audience-intelligence)
  'Signal', // squads/squad-growth/agents/ga-analytics-engineer.md vs squads/squad-paidmedia/agents/meta-ads-specialist.md
  'Spark', // squads/squad-copy/agents/ad-copywriter.md vs squads/squad-copy/agents/conversion-writer.md
  'Stratum', // .sinapse-ai/development/agents/architect.md vs squads/squad-design/agents/dx-design-system-architect.md
  'Tempo', // squads/squad-animations/agents/motion-choreographer.md vs squads/squad-product/agents/ps-delivery-manager.md
  'Vault', // squads/squad-commercial/agents/cs-crm-specialist.md vs squads/squad-finance/agents/budget-controller.md
  'Vertex', // squads/squad-animations/agents/threejs-architect.md vs squads/squad-design/agents/platform-aesthetic-director.md
]);

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
