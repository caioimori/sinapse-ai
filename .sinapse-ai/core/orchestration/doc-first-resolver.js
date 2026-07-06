/**
 * Doc-First Resolver — deterministic "what does this project need before code?"
 *
 * Single source of truth for the Documentation-First contract (Constitution
 * Article III). Given a project root (and optionally a user brief), it answers,
 * with NO LLM reasoning and NO side effects:
 *
 *   - projectType : site | lp | app | platform | saas | api | service | feature | fix
 *   - workflow    : which greenfield workflow applies (reuses greenfield-handler map)
 *   - artifacts   : the upstream docs required before stories (brief/prd/spec/arch)
 *   - gate        : is the minimal doc-first gate satisfied? (PRD + epic + a Ready story)
 *
 * Two consumers share this module so they never drift:
 *   1. `sinapse route "<brief>"` — read-only observability of the routing decision.
 *   2. The doc-first PreToolUse gate hook — blocks code writes when `gate.satisfied`
 *      is false. The module is intentionally dependency-light (fs/path + the
 *      greenfield-handler constants only) so it is safe and fast to require inside
 *      a hook. It NEVER constructs the heavy BobOrchestrator (locks, panels, etc.).
 *
 * @module core/orchestration/doc-first-resolver
 * @version 1.0.0
 */

'use strict';

const fs = require('fs');
const path = require('path');

const {
  GREENFIELD_WORKFLOW_BY_TYPE,
  resolveGreenfieldWorkflow,
} = require('./greenfield-handler');

// ═══════════════════════════════════════════════════════════════════════════════════
//                              PROJECT TYPE CLASSIFICATION
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * Keyword → project_type map. Mirrors the classification matrix in
 * `.claude/rules/documentation-first.md` and `project-intelligence.md`.
 * Order matters: more specific buckets are tested before broader ones.
 * @constant
 */
const TYPE_KEYWORDS = Object.freeze([
  { type: 'fix', words: ['bug', 'conserta', 'corrige', 'corrigir', 'ajusta', 'ajustar', 'tweak', 'hotfix'] },
  { type: 'refactor', words: ['refatora', 'refatorar', 'refactor', 'renomeia', 'renomear', 'limpa', 'cleanup'] },
  { type: 'lp', words: ['landing page', 'landing', 'lp', 'sales page', 'captura', 'squeeze'] },
  { type: 'saas', words: ['saas', 'software as a service', 'multi-tenant', 'multitenant'] },
  { type: 'platform', words: ['plataforma', 'platform', 'dashboard', 'admin', 'portal', 'painel'] },
  { type: 'app', words: ['app mobile', 'mobile', 'ios', 'android', 'react native', 'flutter', 'aplicativo'] },
  { type: 'api', words: ['api', 'backend', 'microservice', 'microsserviço', 'rest', 'graphql'] },
  { type: 'service', words: ['worker', 'cron', 'etl', 'integration', 'integração', 'automation', 'automação'] },
  { type: 'site', words: ['site', 'website', 'web site', 'institucional', 'página', 'pagina'] },
  { type: 'feature', words: ['feature', 'funcionalidade', 'implementa', 'implementar', 'adiciona'] },
]);

/** Escape a string for safe use inside a RegExp. */
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Classify a brief string into a project_type. Returns `null` when the brief is
 * empty or no keyword matches (caller decides the fallback). Matching is by whole
 * word/phrase boundary (so "Asaas" does NOT match the keyword "saas").
 * @param {string} [brief]
 * @returns {string|null}
 */
function classifyProjectType(brief) {
  if (!brief || typeof brief !== 'string') return null;
  const haystack = brief.toLowerCase();
  for (const { type, words } of TYPE_KEYWORDS) {
    if (words.some((w) => new RegExp(`\\b${escapeRegExp(w)}\\b`, 'i').test(haystack))) {
      return type;
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════════
//                              REQUIRED ARTIFACTS PER PROJECT TYPE
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * Upstream artifacts required BEFORE the first story, keyed by greenfield
 * workflow. Mirrors the "Required upstream artifacts per project type" table in
 * `documentation-first.md`. `feature` / `fix` / `refactor` do not require the
 * upstream re-doc chain (they ride on an existing project).
 * @constant
 */
const REQUIRED_ARTIFACTS_BY_WORKFLOW = Object.freeze({
  'greenfield-ui': [
    { id: 'brief', path: 'docs/project-brief.md' },
    { id: 'prd', path: 'docs/prd.md' },
    { id: 'front-end-spec', path: 'docs/front-end-spec.md' },
    { id: 'architecture', path: 'docs/front-end-architecture.md' },
  ],
  'greenfield-fullstack': [
    { id: 'brief', path: 'docs/project-brief.md' },
    { id: 'prd', path: 'docs/prd.md' },
    { id: 'front-end-spec', path: 'docs/front-end-spec.md' },
    { id: 'architecture', path: 'docs/fullstack-architecture.md' },
  ],
  'greenfield-service': [
    { id: 'brief', path: 'docs/project-brief.md' },
    { id: 'prd', path: 'docs/prd.md' },
    { id: 'architecture', path: 'docs/service-architecture.md' },
  ],
});

/** Project types that bypass the upstream greenfield doc-chain. */
const LIGHT_TYPES = Object.freeze(['feature', 'fix', 'refactor']);

// ═══════════════════════════════════════════════════════════════════════════════════
//                              PROJECT MATURITY
// ═══════════════════════════════════════════════════════════════════════════════════

/** Directories whose presence (with real files) signals existing application code. */
const CODE_DIRS = Object.freeze(['src', 'app', 'packages', 'components', 'pages', 'lib']);

/**
 * Assess project maturity for gate scoping. Two signals matter:
 *
 *   - isFrameworkRepo : this IS the SINAPSE framework's own repo (package.json
 *                       name === 'sinapse-ai'). Framework development operates
 *                       above the story layer (Constitution Art. III exception),
 *                       so the doc-first gate must never block it.
 *   - isGreenfield    : the project has no substantial application code yet — a
 *                       brand-new project. The hard doc-first gate applies HERE
 *                       (this is the "criar um site → straight to code" case).
 *                       Existing projects defer to the lighter story-gate.
 *
 * @param {string} projectRoot
 * @returns {{ isFrameworkRepo: boolean, isGreenfield: boolean }}
 */
function assessProjectMaturity(projectRoot) {
  let isFrameworkRepo = false;
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
    if (pkg && pkg.name === 'sinapse-ai') isFrameworkRepo = true;
  } catch {
    // no package.json — fine
  }

  // Greenfield = no substantial application code yet. A lone package.json does
  // NOT flip this off — otherwise scaffolding package.json first (an exempt
  // file) would bypass the gate. Only populated code dirs count as "existing".
  const hasCode = CODE_DIRS.some((d) => dirHasAnyFile(path.join(projectRoot, d)));
  const isGreenfield = !hasCode;

  return { isFrameworkRepo, isGreenfield };
}

// ═══════════════════════════════════════════════════════════════════════════════════
//                              MINIMAL DOC-FIRST GATE
// ═══════════════════════════════════════════════════════════════════════════════════

const VALID_STORY_STATUSES = Object.freeze(['ready', 'inprogress', 'inreview', 'done']);

/** True if a `docs/prd.md` (or sharded `docs/prd/`) exists and is non-trivial. */
function hasPrd(projectRoot) {
  const file = path.join(projectRoot, 'docs', 'prd.md');
  if (fileHasContent(file)) return true;
  return dirHasMarkdown(path.join(projectRoot, 'docs', 'prd'));
}

/** True if at least one epic exists under `docs/epics/` or `docs/stories/epics/`. */
function hasEpic(projectRoot) {
  return (
    dirHasMarkdown(path.join(projectRoot, 'docs', 'epics')) ||
    dirHasMarkdown(path.join(projectRoot, 'docs', 'stories', 'epics'))
  );
}

/** True if at least one story under `docs/stories/` is at a >= Ready status. */
function hasReadyStory(projectRoot) {
  const dir = path.join(projectRoot, 'docs', 'stories');
  return walkMarkdown(dir).some((f) => storyStatusIsReady(f));
}

/**
 * Parse a story file's frontmatter `status:` and decide whether it is >= Ready.
 * Uses a bounded, non-greedy regex (the greedy `[\w\s]*` form historically
 * captured the next line — see the story-gate memory).
 * @param {string} file
 * @returns {boolean}
 */
function storyStatusIsReady(file) {
  let content;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch {
    return false;
  }
  const m = content.match(/status:\s*["']?([a-z][a-z ]*?)["']?\s*(?:\r?\n|$)/i);
  if (!m) return false;
  const status = m[1].toLowerCase().replace(/\s+/g, '');
  return VALID_STORY_STATUSES.includes(status);
}

// ═══════════════════════════════════════════════════════════════════════════════════
//                    SPEC SUBSTANCE (AF-20260704 M2)
// ═══════════════════════════════════════════════════════════════════════════════════
// A story can be `Ready` yet empty. The status gate alone lets a substanceless
// story unlock implementation, which violates No Invention (Art. IV). These checks
// verify the story actually carries the required sections + at least one acceptance
// criterion, and flag missing traceability as a (non-blocking) concern.

const STORY_SECTION_PATTERNS = Object.freeze({
  acceptanceCriteria: /^#{1,4}\s*(acceptance criteria|crit[eé]rios? de aceita)/im,
  scope: /^#{1,4}\s*(scope|escopo)/im,
  description: /^#{1,4}\s*(description|descri[cç][aã]o)/im,
});
/** A markdown checkbox item with real content. */
const AC_CHECKBOX = /^\s*[-*]\s*\[[ xX]\]\s+\S/m;
/** A Given/When/Then triple (executable AC form). */
const AC_GWT = /given[\s\S]{0,120}when[\s\S]{0,120}then/i;
/** Signals that the story traces to evidence/requirement (No Invention). */
const AC_TRACEABILITY = /(evid[eê]ncia|\bFR-\d|\bNFR-\d|\bCON-\d|\bAC\d|\bepic\b|\bstory\b|audit)/i;

/**
 * Inspect a story file for substance (required sections + ≥1 acceptance criterion).
 * Never throws — a read error degrades open (warn-and-proceed), so a filesystem
 * hiccup can never block development (circuit-breaker principle).
 * @param {string} file
 * @returns {{ok:boolean, missingSections:string[], hasAcItem:boolean, hasTraceability:boolean, degraded?:boolean}}
 */
function storyHasSubstance(file) {
  let content;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch {
    return { ok: true, missingSections: [], hasAcItem: true, hasTraceability: true, degraded: true };
  }
  const missingSections = [];
  if (!STORY_SECTION_PATTERNS.description.test(content)) missingSections.push('Descrição/Description');
  if (!STORY_SECTION_PATTERNS.acceptanceCriteria.test(content)) missingSections.push('Acceptance Criteria');
  if (!STORY_SECTION_PATTERNS.scope.test(content)) missingSections.push('Escopo/Scope');
  const hasAcItem = AC_CHECKBOX.test(content) || AC_GWT.test(content);
  const hasTraceability = AC_TRACEABILITY.test(content);
  const ok = missingSections.length === 0 && hasAcItem;
  return { ok, missingSections, hasAcItem, hasTraceability };
}

/**
 * Substance verdict across a project's Ready stories. A project satisfies the
 * substance gate when AT LEAST ONE Ready story is substantive (mirrors how
 * `hasReadyStory` treats "some Ready story exists"). Returns the best verdict.
 * @param {string} projectRoot
 */
function readyStorySubstance(projectRoot) {
  const dir = path.join(projectRoot, 'docs', 'stories');
  const readyFiles = walkMarkdown(dir).filter((f) => storyStatusIsReady(f));
  if (readyFiles.length === 0) {
    return { ok: false, missingSections: [], hasAcItem: false, hasTraceability: false, noReadyStory: true };
  }
  const verdicts = readyFiles.map(storyHasSubstance);
  return verdicts.find((v) => v.ok) || verdicts[0];
}

// ═══════════════════════════════════════════════════════════════════════════════════
//                              MAIN RESOLVER
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * Resolve the full doc-first picture for a project.
 *
 * @param {Object} [opts]
 * @param {string} [opts.projectRoot=process.cwd()] - Project root.
 * @param {string} [opts.brief] - User briefing (used to classify project type).
 * @param {string} [opts.projectType] - Explicit type override (skips classification).
 * @returns {{
 *   brief: string|null,
 *   projectType: string,
 *   classified: boolean,
 *   isLightType: boolean,
 *   workflow: string|null,
 *   artifacts: Array<{id:string, path:string, exists:boolean}>,
 *   gate: { prd:boolean, epic:boolean, readyStory:boolean, satisfied:boolean, missing:string[] }
 * }}
 */
function resolveDocFirstState(opts = {}) {
  const projectRoot = opts.projectRoot || process.cwd();
  const brief = opts.brief || null;
  const classifiedType = opts.projectType || classifyProjectType(brief);
  const projectType = classifiedType || 'site'; // safe default: assume a full project needs docs
  const isLightType = LIGHT_TYPES.includes(projectType);

  const workflow = isLightType ? null : resolveGreenfieldWorkflow(projectType);

  const artifacts = (REQUIRED_ARTIFACTS_BY_WORKFLOW[workflow] || []).map((a) => ({
    id: a.id,
    path: a.path,
    exists: fileHasContent(path.join(projectRoot, a.path)),
  }));

  const prd = hasPrd(projectRoot);
  const epic = hasEpic(projectRoot);
  const readyStory = hasReadyStory(projectRoot);
  // M2: a Ready story must also carry substance (sections + ≥1 AC). Evaluated
  // only when a Ready story exists, so this never changes the "no story" message.
  const substance = readyStory
    ? readyStorySubstance(projectRoot)
    : { ok: false, missingSections: [], hasAcItem: false, hasTraceability: false };

  // Light types ride on an existing project: the minimal gate is "a Ready story"
  // (the existing story-gate). Full projects additionally need PRD + epic.
  const missing = [];
  if (!readyStory) {
    missing.push('story (status >= Ready)');
  } else if (!substance.ok) {
    // Block: a Ready story without required sections / any AC is not implementable.
    const lack = substance.missingSections.length
      ? substance.missingSections.join(', ')
      : 'nenhum acceptance criterion';
    missing.push(`story substance (falta: ${lack})`);
  }
  if (!isLightType) {
    if (!prd) missing.push('PRD (docs/prd.md)');
    if (!epic) missing.push('epic (docs/epics/)');
  }
  const satisfied = missing.length === 0;

  // Non-blocking concerns (Art. IV No Invention): a substantive story that lacks
  // any traceability signal to evidence/requirement is flagged, not blocked.
  const concerns = [];
  if (readyStory && substance.ok && !substance.hasTraceability) {
    concerns.push('story sem rastreabilidade explícita (Art. IV) — cite evidência/requisito/AC');
  }

  return {
    brief,
    projectType,
    classified: Boolean(classifiedType),
    isLightType,
    workflow,
    artifacts,
    gate: {
      prd,
      epic,
      readyStory,
      substance: substance.ok,
      satisfied,
      missing,
      concerns,
    },
    maturity: assessProjectMaturity(projectRoot),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════════
//                              FS HELPERS (lean, no deps)
// ═══════════════════════════════════════════════════════════════════════════════════

function fileHasContent(file) {
  try {
    const stat = fs.statSync(file);
    return stat.isFile() && stat.size > 0;
  } catch {
    return false;
  }
}

function dirHasMarkdown(dir) {
  try {
    return fs.readdirSync(dir).some((f) => f.toLowerCase().endsWith('.md'));
  } catch {
    return false;
  }
}

/** True if `dir` exists and contains at least one regular file (any depth-1 entry). */
function dirHasAnyFile(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true }).some((e) => e.isFile() || e.isDirectory());
  } catch {
    return false;
  }
}

/** Recursively collect `.md` files under a dir (bounded depth, fail-safe). */
function walkMarkdown(dir, depth = 0) {
  if (depth > 4) return [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...walkMarkdown(full, depth + 1));
    } else if (e.name.toLowerCase().endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

module.exports = {
  classifyProjectType,
  resolveDocFirstState,
  assessProjectMaturity,
  // M2 (AF-20260704): spec substance checks, exported for reuse + testing.
  storyHasSubstance,
  readyStorySubstance,
  REQUIRED_ARTIFACTS_BY_WORKFLOW,
  TYPE_KEYWORDS,
  // re-exported for callers that want the raw map
  GREENFIELD_WORKFLOW_BY_TYPE,
  // Onda3-S2 (AF-20260702 item 3.4): exported so artifact gates share ONE
  // definition of "artifact exists and is non-empty" instead of forking it.
  fileHasContent,
};
