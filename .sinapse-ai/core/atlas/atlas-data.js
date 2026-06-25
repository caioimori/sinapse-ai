/**
 * Atlas Data — the single source of truth for the Framework Operating Atlas.
 *
 * Scans the repository ONCE and returns a structured object describing how the
 * SINAPSE framework is composed: workflows, agents, squads, orchestrators,
 * constitutional articles, and non-negotiable rules. Both renderings — the
 * LLM-readable markdown atlas and the visual HTML dashboard — consume this same
 * object, so they can never drift from each other or from the repo.
 *
 * Pure of side effects except filesystem reads. Defensive per-file (a malformed
 * file is skipped, never throws). Counts are derived from disk, so the atlas is
 * always accurate (Constitution Article VII — Ecosystem Metrics Accuracy).
 *
 * @module core/atlas/atlas-data
 */

'use strict';

const fs = require('fs');
const path = require('path');

let yaml;
try {
  yaml = require('js-yaml');
} catch {
  yaml = null;
}

const { FRAMEWORK_FLOWS } = require('./flows');

// ───────────────────────────────────────────────────────────────────────────
// Low-level fs helpers (defensive)
// ───────────────────────────────────────────────────────────────────────────

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

function listDir(dir, kind /* 'file' | 'dir' | undefined */) {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => (kind === 'file' ? e.isFile() : kind === 'dir' ? e.isDirectory() : true))
      .map((e) => e.name);
  } catch {
    return [];
  }
}

function firstMatch(content, re) {
  const m = content.match(re);
  return m ? m[1].trim() : null;
}

function truncate(s, n = 160) {
  if (!s) return '';
  const flat = String(s).replace(/\s+/g, ' ').trim();
  return flat.length > n ? `${flat.slice(0, n - 1)}…` : flat;
}

// ───────────────────────────────────────────────────────────────────────────
// Workflows
// ───────────────────────────────────────────────────────────────────────────

function parseWorkflow(file, source) {
  const content = readText(file);
  const base = path.basename(file).replace(/\.ya?ml$/i, '');
  const entry = { id: base, name: base, description: '', type: '', source, file: relFromRoot(file) };
  if (!content) return entry;

  if (yaml) {
    try {
      const doc = yaml.load(content) || {};
      const wf = doc.workflow || doc;
      if (wf && typeof wf === 'object') {
        entry.id = String(wf.id || base);
        entry.name = String(wf.name || wf.id || base);
        entry.description = truncate(wf.description || '');
        entry.type = String(wf.type || '');
      }
      return entry;
    } catch {
      // fall through to regex
    }
  }
  entry.id = firstMatch(content, /^\s*id:\s*["']?([^"'\n]+)/m) || base;
  entry.name = firstMatch(content, /^\s*name:\s*["']?([^"'\n]+)/m) || entry.id;
  entry.description = truncate(firstMatch(content, /^\s*description:\s*["']?([^\n]+)/m) || '');
  return entry;
}

function collectWorkflows(root) {
  const out = [];
  const fwDir = path.join(root, '.sinapse-ai', 'development', 'workflows');
  for (const f of listDir(fwDir, 'file').filter((n) => /\.ya?ml$/i.test(n))) {
    out.push(parseWorkflow(path.join(fwDir, f), 'framework'));
  }
  const squadsDir = path.join(root, 'squads');
  for (const squad of listDir(squadsDir, 'dir')) {
    const wfDir = path.join(squadsDir, squad, 'workflows');
    for (const f of listDir(wfDir, 'file').filter((n) => /\.ya?ml$/i.test(n))) {
      const wf = parseWorkflow(path.join(wfDir, f), `squad:${squad}`);
      wf.squad = squad;
      out.push(wf);
    }
  }
  return out;
}

// ───────────────────────────────────────────────────────────────────────────
// Agents
// ───────────────────────────────────────────────────────────────────────────

function parseAgent(file, squad) {
  const content = readText(file) || '';
  const base = path.basename(file).replace(/\.md$/i, '');

  // Agent files come in two shapes: a YAML block (agent:/persona:) and a
  // markdown-prose card (# Agent: Name — Title, "- **ID:** ...", "- **Nome:** ...").
  // Parse both so the atlas covers every agent.
  const headingTitle = firstMatch(content, /^#\s*Agent:\s*[^\n—–-]+[—–-]\s*([^\n]+)/m);

  const id =
    firstMatch(content, /^\s*id:\s*["']?([A-Za-z0-9_-]+)/m) ||
    firstMatch(content, /\*\*ID:\*\*\s*([A-Za-z0-9_-]+)/i) ||
    base;
  const title =
    firstMatch(content, /^\s*title:\s*["']?([^\n"']+)/m) || headingTitle || '';
  const role =
    firstMatch(content, /^\s*role:\s*["']?([^\n"']+)/m) || headingTitle || '';
  const persona =
    firstMatch(content, /^\s*name:\s*["']?([^\n"']+)/m) ||
    firstMatch(content, /\*\*Nome:\*\*\s*([^\n]+)/i) ||
    '';
  // Match the canonical counter: an orchestrator is an agent whose id/file ends
  // in `-orqx` (the 17 squad orqx + the master). Chief/triage agents that say
  // "Orchestrator" in their title are NOT counted (they are not -orqx files).
  const isOrqx = /-orqx$/.test(id) || /-orqx$/.test(base);
  return {
    id,
    persona: persona.trim(),
    title: truncate(title, 80),
    role: truncate(role, 110),
    squad: squad || 'framework',
    isOrqx,
    file: relFromRoot(file),
  };
}

function collectAgents(root) {
  const out = [];
  const fwDir = path.join(root, '.sinapse-ai', 'development', 'agents');
  for (const f of listDir(fwDir, 'file').filter((n) => n.endsWith('.md') && !n.includes('.backup') && !n.startsWith('test-'))) {
    out.push(parseAgent(path.join(fwDir, f), 'framework'));
  }
  const squadsDir = path.join(root, 'squads');
  for (const squad of listDir(squadsDir, 'dir')) {
    const aDir = path.join(squadsDir, squad, 'agents');
    for (const f of listDir(aDir, 'file').filter((n) => n.endsWith('.md') && !n.includes('.backup') && !n.startsWith('test-'))) {
      out.push(parseAgent(path.join(aDir, f), squad));
    }
  }
  return out;
}

// ───────────────────────────────────────────────────────────────────────────
// Squads, Articles, Rules
// ───────────────────────────────────────────────────────────────────────────

function collectSquads(root, agents, workflows) {
  const squadsDir = path.join(root, 'squads');
  return listDir(squadsDir, 'dir').map((squad) => {
    const readme = readText(path.join(squadsDir, squad, 'README.md')) || '';
    const heading = firstMatch(readme, /^#\s+(.+)$/m) || squad;
    return {
      id: squad,
      name: heading.trim(),
      agents: agents.filter((a) => a.squad === squad).length,
      workflows: workflows.filter((w) => w.squad === squad).length,
      orqx: agents.filter((a) => a.squad === squad && a.isOrqx).map((a) => a.id),
    };
  });
}

function collectArticles(root) {
  const content = readText(path.join(root, '.sinapse-ai', 'constitution.md'));
  if (!content) return [];
  const out = [];
  // Articles are headings like "### III. Documentation-First Development (NON-NEGOTIABLE)"
  // The roman numeral followed by "." distinguishes articles from other headings
  // (e.g. "### Amendment Process").
  const re = /^#{2,4}\s+([IVXLC]+)\.\s+([^\n(]+?)\s*(?:\(([^)]+)\))?\s*$/gim;
  let m;
  while ((m = re.exec(content)) !== null) {
    out.push({
      number: m[1].trim(),
      title: m[2].trim(),
      severity: (m[3] || '').trim() || 'MUST',
    });
  }
  return out;
}

function collectRules(root) {
  const dir = path.join(root, '.claude', 'rules');
  return listDir(dir, 'file')
    .filter((n) => n.endsWith('.md'))
    .map((n) => {
      const content = readText(path.join(dir, n)) || '';
      const heading = firstMatch(content, /^#\s+(.+)$/m) || n.replace(/\.md$/, '');
      return { id: n.replace(/\.md$/, ''), title: truncate(heading.replace(/\s*\(.*$/, ''), 90) };
    });
}

// ───────────────────────────────────────────────────────────────────────────
// Root helper
// ───────────────────────────────────────────────────────────────────────────

let ROOT = process.cwd();
function relFromRoot(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

// ───────────────────────────────────────────────────────────────────────────
// Public API
// ───────────────────────────────────────────────────────────────────────────

/**
 * Build the full atlas data object from the repository.
 * @param {object} [opts]
 * @param {string} [opts.root=process.cwd()] - Repo root.
 * @param {string} [opts.generatedAt] - ISO timestamp to stamp (pass in; the
 *   module never calls Date.now itself so output stays deterministic for tests).
 * @returns {object} Structured atlas data.
 */
function buildAtlasData(opts = {}) {
  ROOT = opts.root || process.cwd();

  const workflows = collectWorkflows(ROOT);
  const agents = collectAgents(ROOT);
  const squads = collectSquads(ROOT, agents, workflows);
  const articles = collectArticles(ROOT);
  const rules = collectRules(ROOT);

  const frameworkAgents = agents.filter((a) => a.squad === 'framework');
  const squadAgents = agents.filter((a) => a.squad !== 'framework');
  const orqx = agents.filter((a) => a.isOrqx);

  const counts = {
    squads: squads.length,
    agentsTotal: agents.length,
    frameworkAgents: frameworkAgents.length,
    squadAgents: squadAgents.length,
    orqx: orqx.length,
    workflowsTotal: workflows.length,
    frameworkWorkflows: workflows.filter((w) => w.source === 'framework').length,
    squadWorkflows: workflows.filter((w) => w.source !== 'framework').length,
    articles: articles.length,
    rules: rules.length,
  };

  return {
    generatedAt: opts.generatedAt || null,
    counts,
    flows: FRAMEWORK_FLOWS,
    workflows,
    agents,
    squads,
    articles,
    rules,
  };
}

module.exports = { buildAtlasData };
