#!/usr/bin/env node

/**
 * validate-article-iv.js — Constitution Article IV (No Invention) traceability check.
 *
 * Story onda3-s1-article-iv-traceability (AF-20260702 item 3.2).
 *
 * What it does (deterministic, no LLM):
 *   1. Resolves the push range: merge-base(HEAD, origin/main)..HEAD.
 *   2. Extracts story refs ("[Story xyz]") from commit messages in the range.
 *   3. Locates each referenced story under docs/stories/ and extracts its
 *      acceptance criteria ("- [ ] ACn:") and its "## File List" section.
 *   4. Compares changed PRODUCT files against the union of the stories'
 *      File Lists. A changed product file mapped by no story is an ORPHAN.
 *
 * Calibration mode (default): orphans are WARNINGS, exit 0. Pass --strict
 * (or ARTICLE_IV_STRICT=1) to turn orphans into a failure (exit 1). The
 * warning phase exists to calibrate the matcher before it gets teeth —
 * mirrors the rollout the audit prescribed ("órfão começa como warning").
 *
 * Why this runs at pre-push and NOT in GitHub CI: docs/stories/ is local-only
 * (gitignored by design — stories are working artifacts). CI has no stories
 * to trace against, so the only honest home for this check is the developer
 * machine, where the stories exist. When stories are unavailable the check
 * reports ARTICLE_IV_SKIPPED and exits 0 — an explicit skip, never a fake pass.
 *
 * Usage:
 *   npm run validate:article-iv
 *   node scripts/validate-article-iv.js [--strict] [--base <ref>]
 */

'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Prefixes that count as product surface for traceability purposes.
// Aligned with enforce-story-gate.cjs CODE_PATHS plus the framework tree
// (.sinapse-ai) and scripts/, which are product in this repo.
const PRODUCT_PREFIXES = [
  'packages/',
  'src/',
  'app/',
  'lib/',
  'bin/',
  'components/',
  'pages/',
  'api/',
  'services/',
  'scripts/',
  '.sinapse-ai/',
];

// Never traced: docs, tests, mirrors, CI plumbing and generated artifacts —
// they either have their own governance or are regenerated mechanically.
const EXCLUDED_PREFIXES = [
  'docs/',
  'tests/',
  '.claude/',
  '.codex/',
  '.github/',
  'audits/',
  'governance/',
];

const GENERATED_FILES = [
  '.sinapse-ai/install-manifest.yaml',
  '.sinapse-ai/data/entity-registry.yaml',
  '.sinapse-ai/manifests/agents.csv',
  '.sinapse-ai/manifests/workers.csv',
  '.sinapse-ai/manifests/tasks.csv',
];

const STORY_REF_RE = /\[story\s+([^\]]+)\]/gi;
const AC_RE = /^- \[( |x)\] (AC\d+):\s*(.*)$/gim;

/** Extract unique story refs ("[Story 2.1]" → "2.1") from free text. */
function extractStoryRefs(text) {
  const refs = new Set();
  let m;
  STORY_REF_RE.lastIndex = 0;
  while ((m = STORY_REF_RE.exec(text)) !== null) {
    const ref = m[1].trim();
    if (ref) refs.add(ref);
  }
  return [...refs];
}

/** Extract acceptance criteria from story markdown. */
function extractAcceptanceCriteria(storyContent) {
  const acs = [];
  let m;
  AC_RE.lastIndex = 0;
  while ((m = AC_RE.exec(storyContent)) !== null) {
    acs.push({ id: m[2].toUpperCase(), checked: m[1] === 'x', text: m[3].trim() });
  }
  return acs;
}

/**
 * Extract path-ish entries from the story's "## File List" section.
 * Accepts list items like "- path/to/file.js (novo)" — the first
 * whitespace-delimited token of each bullet is taken as the path.
 */
function extractFileList(storyContent) {
  const lines = storyContent.split(/\r?\n/);
  const entries = [];
  let inSection = false;
  for (const line of lines) {
    if (/^##\s+file list\s*$/i.test(line.trim())) {
      inSection = true;
      continue;
    }
    if (inSection && /^##\s+/.test(line.trim())) break;
    if (!inSection) continue;
    const bullet = line.trim().match(/^[-*]\s+(.*)$/);
    if (!bullet) continue;
    const token = bullet[1].trim().split(/\s+/)[0];
    if (token) {
      entries.push(
        token
          .replace(/[,;]$/, '')
          .replace(/^`+|`+$/g, '')
          .replace(/\\/g, '/'),
      );
    }
  }
  return entries;
}

/** True when a changed path counts as traceable product surface. */
function isProductFile(rel) {
  const norm = rel.replace(/\\/g, '/');
  if (GENERATED_FILES.includes(norm)) return false;
  if (EXCLUDED_PREFIXES.some((p) => norm.startsWith(p))) return false;
  return PRODUCT_PREFIXES.some((p) => norm.startsWith(p));
}

/**
 * Match changed product files against File List entries.
 * A file is mapped when some entry equals it, is a prefix directory of it,
 * or the file path ends with the entry (tolerates entries written relative).
 */
function matchFilesToStory(changedProductFiles, fileListEntries) {
  const norm = (s) => s.replace(/\\/g, '/').toLowerCase();
  const entries = fileListEntries.map(norm);
  const mapped = [];
  const orphans = [];
  for (const file of changedProductFiles) {
    const f = norm(file);
    const hit = entries.some(
      (e) => e === f || f.startsWith(e.endsWith('/') ? e : `${e}/`) || f.endsWith(e),
    );
    (hit ? mapped : orphans).push(file);
  }
  return { mapped, orphans };
}

/** Recursively collect .md files under a directory. */
function walkMarkdown(dir) {
  const out = [];
  let items = [];
  try {
    items = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) out.push(...walkMarkdown(full));
    else if (item.name.endsWith('.md')) out.push(full);
  }
  return out;
}

/**
 * Find the story file for a ref: filename containing the slugged ref, or
 * story content containing the literal "[Story <ref>]".
 */
function findStoryFile(storiesDir, ref) {
  const slug = ref.toLowerCase().replace(/\s+/g, '-');
  const files = walkMarkdown(storiesDir);
  for (const file of files) {
    const base = path.basename(file, '.md').toLowerCase();
    if (base.includes(slug)) return file;
  }
  const needle = `[story ${ref.toLowerCase()}]`;
  for (const file of files) {
    try {
      if (fs.readFileSync(file, 'utf8').toLowerCase().includes(needle)) return file;
    } catch {
      /* unreadable file — keep scanning */
    }
  }
  return null;
}

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
}

function main() {
  const argv = process.argv.slice(2);
  const strict = argv.includes('--strict') || process.env.ARTICLE_IV_STRICT === '1';
  const baseIdx = argv.indexOf('--base');
  const baseRef = baseIdx !== -1 ? argv[baseIdx + 1] : process.env.ARTICLE_IV_BASE || 'origin/main';

  let mergeBase;
  try {
    mergeBase = git(['merge-base', 'HEAD', baseRef]).trim();
  } catch {
    console.log(`ARTICLE_IV_SKIPPED: cannot resolve merge-base with ${baseRef} (no remote?).`);
    process.exit(0);
  }

  const changed = git(['diff', '--name-only', `${mergeBase}..HEAD`])
    .split(/\r?\n/)
    .filter(Boolean);
  const commitText = git(['log', '--format=%B', `${mergeBase}..HEAD`]);

  const refs = extractStoryRefs(commitText);
  if (refs.length === 0) {
    console.log('article-iv: no story refs in push range — nothing to trace.');
    process.exit(0);
  }

  const storiesDir = path.join(ROOT, 'docs', 'stories');
  if (!fs.existsSync(storiesDir)) {
    console.log('ARTICLE_IV_SKIPPED: docs/stories unavailable (local-only artifact).');
    process.exit(0);
  }

  const fileListUnion = [];
  const foundStories = [];
  const missingRefs = [];
  for (const ref of refs) {
    const storyFile = findStoryFile(storiesDir, ref);
    if (!storyFile) {
      missingRefs.push(ref);
      continue;
    }
    const content = fs.readFileSync(storyFile, 'utf8');
    foundStories.push({ ref, file: path.relative(ROOT, storyFile), acs: extractAcceptanceCriteria(content).length });
    fileListUnion.push(...extractFileList(content));
  }

  if (foundStories.length === 0) {
    console.log(
      `ARTICLE_IV_SKIPPED: no referenced story found locally (refs: ${refs.join(', ')}).`,
    );
    process.exit(0);
  }

  const productChanged = changed.filter(isProductFile);
  const { mapped, orphans } = matchFilesToStory(productChanged, fileListUnion);

  console.log('=== article-iv traceability ===');
  for (const s of foundStories) {
    console.log(`story [${s.ref}] -> ${s.file} (${s.acs} ACs)`);
  }
  if (missingRefs.length) {
    console.log(`refs without local story (skipped): ${missingRefs.join(', ')}`);
  }
  console.log(`product files changed: ${productChanged.length} | mapped: ${mapped.length} | orphans: ${orphans.length}`);

  if (orphans.length > 0) {
    console.log('');
    console.log('ORPHAN product files (changed but absent from every referenced File List):');
    for (const f of orphans) console.log(`  WARN  ${f}`);
    console.log('');
    console.log('Fix: add the file to the story\'s "## File List", or move the change to its own story.');
    if (strict) {
      console.log('article-iv: FAIL (strict mode).');
      process.exit(1);
    }
    console.log('article-iv: WARN-only (calibration mode) — not blocking.');
    process.exit(0);
  }

  console.log('article-iv: OK — full traceability.');
  process.exit(0);
}

module.exports = {
  extractStoryRefs,
  extractAcceptanceCriteria,
  extractFileList,
  isProductFile,
  matchFilesToStory,
  findStoryFile,
};

if (require.main === module) main();
