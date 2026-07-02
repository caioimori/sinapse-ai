'use strict';

/**
 * Story onda1-s5 (AF-20260702 item 1.7) — Constitution Consistency now scans
 * the install template.
 *
 * Before this story, `.sinapse-ai/product/templates/ide-rules/claude-rules.md`
 * was NOT in either constitution-consistency check's consumer list. That was
 * a blind spot: the template is merged into every fresh `.claude/CLAUDE.md`
 * (see bin/sinapse-init.js), so a stale/incomplete article table in the
 * template regresses new installs even while the repo's own CLAUDE.md stays
 * correct. These tests prove (a) the template is now in scope for both the
 * doctor check and the deep health-check, and (b) a regression in the
 * template is actually caught, not just theoretically possible.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const doctorCheck = require('../../.sinapse-ai/core/doctor/checks/constitution-consistency.js');
const HealthCheckClass = require('../../.sinapse-ai/core/health-check/checks/project/constitution-consistency.js');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const TEMPLATE_REL_PATH = '.sinapse-ai/product/templates/ide-rules/claude-rules.md';

const ALL_ARTICLES = [
  'CLI First',
  'Agent Authority',
  'Documentation-First Development',
  'No Invention',
  'Quality First',
  'Absolute Imports',
  'Ecosystem Metrics Accuracy',
  'Mandatory Delegation',
  'Safe Collaboration',
  'Security & Data Protection',
  'Conservative Default',
];

// { number, title, severity } — mirrors EXPECTED_ARTICLES in the deep
// health-check, which additionally requires the numbered
// "### {number}. {title} (...{severity})" heading format in constitution.md
// itself (Check 2). Consumer files (CLAUDE.md, AGENTS.md, the template) only
// need the bare title as a substring (Check 3), so a plain list is enough
// for those.
const ARTICLE_META = [
  { number: 'I', title: 'CLI First', severity: 'NON-NEGOTIABLE' },
  { number: 'II', title: 'Agent Authority', severity: 'NON-NEGOTIABLE' },
  { number: 'III', title: 'Documentation-First Development', severity: 'NON-NEGOTIABLE' },
  { number: 'IV', title: 'No Invention', severity: 'MUST' },
  { number: 'V', title: 'Quality First', severity: 'MUST' },
  { number: 'VI', title: 'Absolute Imports', severity: 'SHOULD' },
  { number: 'VII', title: 'Ecosystem Metrics Accuracy', severity: 'NON-NEGOTIABLE' },
  { number: 'VIII', title: 'Mandatory Delegation', severity: 'NON-NEGOTIABLE' },
  { number: 'IX', title: 'Safe Collaboration', severity: 'NON-NEGOTIABLE' },
  { number: 'X', title: 'Security & Data Protection', severity: 'NON-NEGOTIABLE' },
  { number: 'XI', title: 'Conservative Default', severity: 'MUST' },
];

function buildConstitutionSource() {
  return ARTICLE_META.map((a) => `### ${a.number}. ${a.title} (${a.severity})`).join('\n\n');
}

/** Builds a minimal fixture project with every consumer file present. */
function buildFixture({ templateArticles = ALL_ARTICLES } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ccc-template-'));
  const allArticlesBlob = ALL_ARTICLES.join('\n');

  fs.mkdirSync(path.join(root, '.sinapse-ai', 'product', 'templates', 'ide-rules'), { recursive: true });
  fs.mkdirSync(path.join(root, '.claude', 'rules'), { recursive: true });
  fs.mkdirSync(path.join(root, '.synapse'), { recursive: true });

  fs.writeFileSync(path.join(root, '.sinapse-ai', 'constitution.md'), buildConstitutionSource());
  fs.writeFileSync(path.join(root, '.claude', 'CLAUDE.md'), allArticlesBlob);
  fs.writeFileSync(path.join(root, 'AGENTS.md'), allArticlesBlob);
  fs.writeFileSync(path.join(root, '.synapse', 'constitution'), allArticlesBlob);
  fs.writeFileSync(path.join(root, '.claude', 'rules', 'documentation-first.md'), 'stub');
  fs.writeFileSync(path.join(root, '.claude', 'rules', 'mandatory-delegation.md'), 'stub');
  fs.writeFileSync(path.join(root, TEMPLATE_REL_PATH), templateArticles.join('\n'));

  return root;
}

describe('constitution-consistency — install template blind spot (AF-20260702 #1.7)', () => {
  describe('doctor check (.sinapse-ai/core/doctor/checks/constitution-consistency.js)', () => {
    test('CONSUMER_FILES now includes the install template path', () => {
      // Regression guard on the source itself: re-require and inspect via a
      // broken fixture below proves behavior, but this locks the literal
      // path so a future refactor cannot silently drop the entry.
      const src = fs.readFileSync(
        path.join(REPO_ROOT, '.sinapse-ai', 'core', 'doctor', 'checks', 'constitution-consistency.js'),
        'utf8',
      );
      expect(src).toContain(TEMPLATE_REL_PATH);
    });

    test('passes against the real repo (template + all consumers in sync)', async () => {
      const result = await doctorCheck.run({ projectRoot: REPO_ROOT });
      expect(result.status).toBe('PASS');
    });

    test('catches a regression: template missing one article title', async () => {
      const missing = 'Conservative Default';
      const root = buildFixture({ templateArticles: ALL_ARTICLES.filter((a) => a !== missing) });
      try {
        const result = await doctorCheck.run({ projectRoot: root });
        expect(result.status).not.toBe('PASS');
        expect(result.message).toContain(TEMPLATE_REL_PATH);
        expect(result.message).toContain(missing);
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    });

    test('passes on a fixture where every consumer (including the template) has all articles', async () => {
      const root = buildFixture();
      try {
        const result = await doctorCheck.run({ projectRoot: root });
        expect(result.status).toBe('PASS');
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    });
  });

  describe('deep health-check (.sinapse-ai/core/health-check/checks/project/constitution-consistency.js)', () => {
    test('CONSTITUTION_CONSUMERS now includes the install template path', () => {
      const src = fs.readFileSync(
        path.join(REPO_ROOT, '.sinapse-ai', 'core', 'health-check', 'checks', 'project', 'constitution-consistency.js'),
        'utf8',
      );
      expect(src).toContain(TEMPLATE_REL_PATH);
    });

    test('catches the same regression via the deep check class', async () => {
      const missing = 'Conservative Default';
      const root = buildFixture({ templateArticles: ALL_ARTICLES.filter((a) => a !== missing) });
      try {
        const check = new HealthCheckClass();
        const result = await check.execute({ projectRoot: root });
        expect(result.status).not.toBe('pass');
        // This check reports consumers by label ("Install Template
        // (claude-rules.md)"), not by raw path — assert on the filename,
        // which is present in both the label and the path.
        const haystack = JSON.stringify(result);
        expect(haystack).toContain('claude-rules.md');
        expect(haystack).toContain(missing);
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    });
  });
});
