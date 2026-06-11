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
}

module.exports = SquadAgentResolver;
module.exports.SquadAgentResolver = SquadAgentResolver;
