/**
 * Squad Agent Resolver
 *
 * epic: orchestration-consolidation, F2 — makes the 177 squad personas (plus the
 * framework agents) addressable BY CODE. Before this, the SubagentDispatcher knew
 * only ~10 generic agents (@dev/@qa/...) and built a one-line "You are @x" prompt,
 * discarding the real persona. This indexes every agent .md across `squads/` and
 * the framework agent dirs, and loads the FULL persona on demand.
 *
 * Convention (verified across all squads): the agent id IS the file basename in
 * kebab-case (e.g. `penetration-tester.md` -> id `penetration-tester`), which
 * matches the embedded `id:` field. We key by basename for robustness and also
 * register the embedded id / display name as aliases when present.
 *
 * @module core/registry/squad-agent-resolver
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

/** Directories scanned for agent definitions, relative to projectRoot. */
const AGENT_DIRS = [
  'squads', // squads/<squad>/agents/<id>.md
  path.join('.sinapse-ai', 'agents'),
  path.join('.sinapse-ai', 'development', 'agents'),
];

/**
 * Short-form aliases used across the framework (dispatcher agentMapping, CLAUDE.md
 * command table) → canonical file id. Lets '@dev' resolve to the developer persona
 * instead of falling through to a one-line generic prompt.
 */
const ALIASES = {
  dev: 'developer',
  qa: 'quality-gate',
  pm: 'project-lead',
  po: 'product-lead',
  sm: 'sprint-lead',
  ux: 'ux-design-expert',
  'ux-expert': 'ux-design-expert',
  // Imperator orchestrator ships as snps-orqx.md (SINAPSE canonical, @snps alias);
  // 'sinapse-orqx' is the verbal/canonical reference that must resolve to that file.
  'sinapse-orqx': 'snps-orqx',
};

class SquadAgentResolver {
  /**
   * @param {string} projectRoot - Project root directory
   */
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this._index = null; // Map<normalizedKey, entry> — built lazily
    this._personaCache = new Map(); // id -> persona content
  }

  /**
   * Normalize an agent reference for lookup: strip leading '@', lowercase,
   * collapse separators. So '@penetration-tester', 'penetration_tester' and
   * 'Penetration Tester' all resolve to the same key.
   * @param {string} ref
   * @returns {string}
   */
  static normalizeKey(ref) {
    return String(ref || '')
      .replace(/^@/, '')
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-');
  }

  /**
   * Build (once) the index of every agent definition on disk.
   * @returns {Map<string, Object>} normalizedKey -> { id, name, squad, filePath }
   */
  buildIndex() {
    if (this._index) return this._index;
    const index = new Map();

    const addEntry = (filePath, squad) => {
      const base = path.basename(filePath, '.md');
      if (!base || base.toUpperCase() === 'README') return;
      const key = SquadAgentResolver.normalizeKey(base);
      // First writer wins for a given key, but squad agents take precedence over
      // framework duplicates only if a squad entry isn't already registered.
      if (!index.has(key)) {
        index.set(key, { id: base, name: base, squad, filePath });
      }
    };

    for (const rel of AGENT_DIRS) {
      const dir = path.join(this.projectRoot, rel);
      if (!fs.existsSync(dir)) continue;

      if (rel === 'squads') {
        // squads/<squad>/agents/*.md
        let squadDirs = [];
        try {
          squadDirs = fs.readdirSync(dir, { withFileTypes: true });
        } catch {
          squadDirs = [];
        }
        for (const sd of squadDirs) {
          if (!sd.isDirectory()) continue;
          const agentsDir = path.join(dir, sd.name, 'agents');
          if (!fs.existsSync(agentsDir)) continue;
          for (const f of this._listMd(agentsDir)) {
            addEntry(path.join(agentsDir, f), sd.name);
          }
        }
      } else {
        // flat dir of *.md
        for (const f of this._listMd(dir)) {
          addEntry(path.join(dir, f), null);
        }
      }
    }

    this._index = index;
    return index;
  }

  /**
   * List .md files in a directory (non-recursive), tolerant of read errors.
   * @param {string} dir
   * @returns {string[]}
   * @private
   */
  _listMd(dir) {
    try {
      return fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.md'));
    } catch {
      return [];
    }
  }

  /**
   * Resolve an agent reference to its index entry.
   * @param {string} ref - e.g. '@penetration-tester', 'dev', 'cloud-security-engineer'
   * @returns {Object|null} { id, name, squad, filePath } or null when unknown
   */
  resolve(ref) {
    const index = this.buildIndex();
    const key = SquadAgentResolver.normalizeKey(ref);
    return index.get(key) || index.get(ALIASES[key]) || null;
  }

  /**
   * True when the reference maps to a known agent definition on disk.
   * @param {string} ref
   * @returns {boolean}
   */
  has(ref) {
    return this.resolve(ref) !== null;
  }

  /**
   * Load the full persona markdown for an agent reference.
   * @param {string} ref
   * @returns {string|null} persona content, or null when unknown/unreadable
   */
  loadPersona(ref) {
    const entry = this.resolve(ref);
    if (!entry) return null;
    if (this._personaCache.has(entry.id)) return this._personaCache.get(entry.id);
    let content = null;
    try {
      content = fs.readFileSync(entry.filePath, 'utf8');
    } catch {
      content = null;
    }
    this._personaCache.set(entry.id, content);
    return content;
  }

  /**
   * All known agent ids (sorted), for diagnostics / `sinapse` listing.
   * @returns {string[]}
   */
  listIds() {
    return [...this.buildIndex().values()].map((e) => e.id).sort();
  }

  /**
   * Count of indexed agents.
   * @returns {number}
   */
  size() {
    return this.buildIndex().size;
  }

  /**
   * Normalized metadata for an agent, extracted from whatever structure the
   * file uses (frontmatter, `# Agent: X`, `# X`, or an embedded ```yaml block).
   * This is the uniform schema (SCHEMA-001 closure) without mutating the 199
   * heterogeneous persona files — the canonical shape is DERIVED, not imposed.
   *
   * @param {string} ref
   * @returns {{id, name, squad, type, hasStructuredYaml, file}|null}
   */
  describe(ref) {
    const entry = this.resolve(ref);
    if (!entry) return null;
    const content = this.loadPersona(entry.id) || '';
    return {
      id: entry.id,
      name: SquadAgentResolver.extractName(content, entry.id),
      squad: entry.squad || 'framework',
      type: /-orqx$/.test(entry.id) ? 'orchestrator' : 'specialist',
      hasStructuredYaml: /```ya?ml/.test(content) || /^\s*agent:\s*$/m.test(content),
      file: entry.filePath,
    };
  }

  /**
   * Describe every indexed agent (sorted by id) — the uniform registry view.
   * @returns {Array<Object>}
   */
  list() {
    return this.listIds().map((id) => this.describe(id));
  }

  /**
   * Best-effort display name from heterogeneous structures. Falls back to a
   * title-cased id so the result is never empty.
   * @param {string} content - File content
   * @param {string} id - Canonical id (filename)
   * @returns {string}
   */
  static extractName(content, id) {
    const src = String(content || '');
    // 1. YAML frontmatter `name:`
    const fm = src.match(/^---\s*\n([\s\S]*?)\n---/);
    if (fm) {
      const m = fm[1].match(/^\s*name:\s*["']?([^"'\n]+)["']?\s*$/m);
      if (m && m[1].trim()) return m[1].trim();
    }
    // 2. Embedded yaml `name:` (inside an ```yaml block or agent: section)
    const ym = src.match(/^\s*name:\s*["']?([^"'\n]+)["']?\s*$/m);
    if (ym && ym[1].trim()) return ym[1].trim();
    // 3. `# Agent: Name`
    const ah = src.match(/^#\s*Agent:\s*(.+?)\s*$/m);
    if (ah && ah[1].trim()) return ah[1].trim();
    // 4. First `# Heading`
    const h1 = src.match(/^#\s+(.+?)\s*$/m);
    if (h1 && h1[1].trim()) return h1[1].trim().replace(/^@/, '');
    // 5. Title-cased id
    return String(id)
      .split('-')
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(' ');
  }
}

module.exports = SquadAgentResolver;
module.exports.SquadAgentResolver = SquadAgentResolver;
// Canonical short-form → file-id alias map. Single source of truth, consumed by the
// activation pipeline (agent-config-loader) so '@dev' etc. load the real persona file.
module.exports.ALIASES = ALIASES;
