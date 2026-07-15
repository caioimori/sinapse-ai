/**
 * Unit tests for scripts/validate-install-docs.js (Story 10.13, Task 4.5).
 *
 * The validator is pure: it takes a `rootDir` and scans the markdown files
 * under the configured public doc directories. We exercise it by building
 * two tiny fixture filesystems under os.tmpdir() — one "clean" tree that
 * must pass, and one "dirty" tree that must fail with the exact violations
 * we expect.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  validateInstallDocs,
  computeAllowedLineSet,
} = require('../../scripts/validate-install-docs');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

function makeTmpRoot(label) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `sinapse-validate-docs-${label}-`));
  fs.mkdirSync(path.join(root, 'docs', 'installation'), { recursive: true });
  return root;
}

function writeDoc(root, relPath, content) {
  const abs = path.join(root, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
}

function cleanup(root) {
  try {
    fs.rmSync(root, { recursive: true, force: true });
  } catch {
    /* best effort */
  }
}

describe('validate-install-docs', () => {
  describe('documented provider adapters', () => {
    test('representative Claude and Codex adapter paths exist', () => {
      for (const id of ['developer', 'brand-orqx']) {
        expect(fs.existsSync(path.join(PROJECT_ROOT, '.claude', 'agents', `sinapse-${id}.md`))).toBe(true);
        expect(fs.existsSync(path.join(PROJECT_ROOT, '.codex', 'agents', `${id}.toml`))).toBe(true);
        expect(fs.existsSync(path.join(PROJECT_ROOT, '.codex', 'agents', `${id}.md`))).toBe(true);
      }

      const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf8'));
      expect(pkg.scripts).toHaveProperty('sync:ide:claude');
      expect(pkg.scripts).toHaveProperty('sync:ide:codex');
      expect(pkg.scripts).not.toHaveProperty('sync:ide:gemini');
    });
  });

  describe('clean fixture', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('clean');
      writeDoc(
        root,
        'README.md',
        [
          '# Project',
          '',
          '## Install',
          '',
          '```bash',
          'npx sinapse-ai install',
          'npx sinapse-ai update',
          'npx sinapse-ai uninstall',
          'A Linux path such as `/dev/null` is not an agent command.',
          'Claude documentation may link to https://example.com/skills.',
          'Codex docs live at https://example.com/codex/skills.',
          'Claude Code may mention `/skills` as a literal reference.',
          'Contact the GitHub team @dev-platform for support.',
          'Use @developer in Claude Code and $sinapse-agent developer in Codex.',
          'Inspect both .codex/agents/ and .agents/skills/ adapter paths.',
          '```',
          '',
        ].join('\n'),
      );
      writeDoc(
        root,
        'docs/installation/README.md',
        ['# Installation', '', 'Run `npx sinapse-ai install` to get started.', ''].join('\n'),
      );
      writeDoc(
        root,
        'docs/installation/chrome-brain.md',
        [
          '# Chrome Brain',
          '',
          '```bash',
          'npx sinapse-ai chrome-brain install',
          '```',
          '',
          '### Internal (developer-only)',
          '',
          '```bash',
          './scripts/install-chrome-brain.sh',
          '/dev',
          '@dev',
          '```',
          '',
          '## Next section',
          '',
          'Back to public docs.',
          '',
        ].join('\n'),
      );
    });

    afterAll(() => cleanup(root));

    test('returns ok=true with zero violations', () => {
      const result = validateInstallDocs(root);
      expect(result.ok).toBe(true);
      expect(result.violations).toEqual([]);
      // We should have scanned all three fixture files.
      expect(result.scanned.length).toBeGreaterThanOrEqual(3);
    });

    test('respects the internal (developer-only) allow-list block', () => {
      // The fixture has `install-chrome-brain.sh` inside an Internal section —
      // if the allow-list is broken this would produce a violation.
      const result = validateInstallDocs(root);
      expect(result.violations).toEqual([]);
    });
  });

  describe('dirty fixture', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('dirty');
      writeDoc(
        root,
        'docs/installation/bad.md',
        [
          '# Bad doc',
          '',
          'Run `sinapse install` to set up the framework.',
          'Then run `sinapse-minimal` for a lightweight mode.',
          'Power users can invoke `./scripts/install-squads.sh` directly.',
          'In Codex, open the `/skills` flow.',
          'Activate a custom agent with `/my-agent`.',
          'Activate the developer with `/dev`.',
          'Agent commands (`@dev`) are obsolete.',
          'In Codex, activate @architect.',
          'Run `*init-project-status` after activation.',
          'Install the SINAPSE-FullStack framework.',
          'Greeting: Dex (Builder) ready.',
          '',
        ].join('\n'),
      );
    });

    afterAll(() => cleanup(root));

    test('returns ok=false and reports one violation per forbidden pattern hit', () => {
      const result = validateInstallDocs(root);
      expect(result.ok).toBe(false);
      expect(result.violations.length).toBeGreaterThanOrEqual(3);

      const ruleIds = result.violations.map((v) => v.ruleId).sort();
      expect(ruleIds).toEqual(
        expect.arrayContaining([
          'legacy-sinapse-install',
          'sinapse-minimal-binary',
          'install-squads-script',
          'legacy-codex-skills-flow',
          'legacy-custom-agent-slash-command',
          'legacy-dev-slash-activation',
          'legacy-dev-at-activation',
          'legacy-codex-at-activation',
          'unresolvable-init-project-status',
          'legacy-sinapse-fullstack-name',
          'legacy-developer-codename',
        ]),
      );
    });

    test('every violation carries a file, line, column, reason and snippet', () => {
      const result = validateInstallDocs(root);
      for (const v of result.violations) {
        expect(typeof v.file).toBe('string');
        expect(typeof v.line).toBe('number');
        expect(v.line).toBeGreaterThan(0);
        expect(typeof v.col).toBe('number');
        expect(typeof v.ruleId).toBe('string');
        expect(typeof v.reason).toBe('string');
        expect(typeof v.snippet).toBe('string');
      }
    });
  });

  describe('computeAllowedLineSet', () => {
    test('marks every line of an internal section as allowed, closing at the next heading', () => {
      const lines = [
        '# Public',
        '',
        'sinapse install', // line 2 — public, forbidden
        '',
        '### Internal (developer-only)',
        '',
        'sinapse-minimal', // line 6 — allowed
        './scripts/install-chrome-brain.sh', // line 7 — allowed
        '',
        '## Next section',
        '',
        'sinapse install', // line 11 — public again
      ];
      const allowed = computeAllowedLineSet(lines);

      expect(allowed.has(2)).toBe(false); // pre-internal
      expect(allowed.has(4)).toBe(true); // heading line itself
      expect(allowed.has(6)).toBe(true); // inside internal
      expect(allowed.has(7)).toBe(true); // inside internal
      expect(allowed.has(9)).toBe(false); // closing heading — back to public
      expect(allowed.has(11)).toBe(false); // post-internal
    });
  });
});
