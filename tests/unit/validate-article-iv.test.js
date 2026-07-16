/**
 * Unit tests — validate-article-iv.js pure functions.
 * Story onda3-s1-article-iv-traceability (AF-20260702 item 3.2).
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  extractStoryRefs,
  extractAcceptanceCriteria,
  extractFileList,
  isProductFile,
  matchFilesToStory,
  findStoryFile,
} = require('../../scripts/validate-article-iv');

describe('validate-article-iv (Article IV traceability)', () => {
  describe('extractStoryRefs', () => {
    it('extracts refs from conventional commit trailers', () => {
      const text = 'feat: encode urls [Story 2.1]\n\nfix: decode [Story url-2-store]';
      expect(extractStoryRefs(text)).toEqual(['2.1', 'url-2-store']);
    });

    it('dedupes repeated refs and is case-insensitive on the keyword', () => {
      const text = '[story abc] more [Story abc] and [STORY abc]';
      expect(extractStoryRefs(text)).toEqual(['abc']);
    });

    it('returns empty array when no refs present', () => {
      expect(extractStoryRefs('chore: no story here')).toEqual([]);
    });
  });

  describe('extractAcceptanceCriteria', () => {
    it('parses unchecked and checked ACs in engine format', () => {
      const story = [
        '## Acceptance Criteria',
        '',
        '- [ ] AC1: encode(62) === "10"',
        '- [x] AC2: decode round-trips',
        '- [ ] not an AC',
      ].join('\n');
      const acs = extractAcceptanceCriteria(story);
      expect(acs).toHaveLength(2);
      expect(acs[0]).toEqual({ id: 'AC1', checked: false, text: 'encode(62) === "10"' });
      expect(acs[1]).toEqual({ id: 'AC2', checked: true, text: 'decode round-trips' });
    });
  });

  describe('extractFileList', () => {
    it('extracts first token of each bullet until the next section', () => {
      const story = [
        '## File List',
        '',
        '- scripts/validate-article-iv.js (novo)',
        '- package.json (script npm)',
        '* tests/unit/validate-article-iv.test.js',
        '',
        '## Change Log',
        '- 2026-07-03: criada',
      ].join('\n');
      expect(extractFileList(story)).toEqual([
        'scripts/validate-article-iv.js',
        'package.json',
        'tests/unit/validate-article-iv.test.js',
      ]);
    });

    it('returns empty when the section is absent', () => {
      expect(extractFileList('# Story sem file list')).toEqual([]);
    });

    it('normalizes backslashes to forward slashes', () => {
      const story = '## File List\n- scripts\\validate-article-iv.js';
      expect(extractFileList(story)).toEqual(['scripts/validate-article-iv.js']);
    });

    it('removes Markdown code formatting from paths', () => {
      const story = '## File List\n- `scripts/validate-article-iv.js`';
      expect(extractFileList(story)).toEqual(['scripts/validate-article-iv.js']);
    });
  });

  describe('isProductFile', () => {
    it('accepts product prefixes', () => {
      expect(isProductFile('bin/sinapse.js')).toBe(true);
      expect(isProductFile('.sinapse-ai/core/orchestration/gate-evaluator.js')).toBe(true);
      expect(isProductFile('scripts/validate-all.js')).toBe(true);
    });

    it('rejects docs, tests, mirrors and generated artifacts', () => {
      expect(isProductFile('docs/epics/x/README.md')).toBe(false);
      expect(isProductFile('tests/unit/foo.test.js')).toBe(false);
      expect(isProductFile('.claude/commands/SINAPSE/agents/developer.md')).toBe(false);
      expect(isProductFile('.sinapse-ai/install-manifest.yaml')).toBe(false);
      expect(isProductFile('.sinapse-ai/data/entity-registry.yaml')).toBe(false);
    });

    it('rejects paths outside any product prefix', () => {
      expect(isProductFile('README.md')).toBe(false);
      expect(isProductFile('package.json')).toBe(false);
    });
  });

  describe('matchFilesToStory', () => {
    const fileList = ['scripts/validate-article-iv.js', '.sinapse-ai/core/orchestration/'];

    it('maps exact entries and directory-prefix entries', () => {
      const changed = [
        'scripts/validate-article-iv.js',
        '.sinapse-ai/core/orchestration/gate-evaluator.js',
      ];
      const { mapped, orphans } = matchFilesToStory(changed, fileList);
      expect(mapped).toEqual(changed);
      expect(orphans).toEqual([]);
    });

    it('flags unmapped product files as orphans', () => {
      const { mapped, orphans } = matchFilesToStory(['bin/sinapse.js'], fileList);
      expect(mapped).toEqual([]);
      expect(orphans).toEqual(['bin/sinapse.js']);
    });

    it('tolerates entries written as suffix (relative style)', () => {
      const { mapped } = matchFilesToStory(
        ['packages/installer/src/wizard/index.js'],
        ['wizard/index.js'],
      );
      expect(mapped).toEqual(['packages/installer/src/wizard/index.js']);
    });
  });

  describe('findStoryFile', () => {
    let tmpDir;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'a4-stories-'));
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('finds by filename containing the slugged ref', () => {
      const file = path.join(tmpDir, 'onda3-s1-article-iv-traceability.md');
      fs.writeFileSync(file, '# story');
      expect(findStoryFile(tmpDir, 'onda3-s1-article-iv-traceability')).toBe(file);
    });

    it('finds by content containing the literal ref when filename differs', () => {
      const file = path.join(tmpDir, 'qualquer-nome.md');
      fs.writeFileSync(file, 'feat implementa X [Story 9.9] fim');
      expect(findStoryFile(tmpDir, '9.9')).toBe(file);
    });

    it('returns null when nothing matches', () => {
      expect(findStoryFile(tmpDir, 'inexistente')).toBeNull();
    });

    it('searches subdirectories recursively', () => {
      const sub = path.join(tmpDir, 'epics');
      fs.mkdirSync(sub);
      const file = path.join(sub, 'story-5.5-alguma-coisa.md');
      fs.writeFileSync(file, '# story');
      expect(findStoryFile(tmpDir, '5.5')).toBe(file);
    });
  });
});
