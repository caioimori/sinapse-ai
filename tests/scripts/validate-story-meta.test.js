'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  parseArgs,
  findStoryFiles,
  parseFrontmatter,
  extractHeadingStatus,
  findMissingSections,
  validateFile,
  summarize,
  formatReport,
  VALID_STATUSES,
  REQUIRED_SECTIONS,
} = require('../../scripts/validate-story-meta');

function makeTempProject() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-storymeta-'));
  const dir = path.join(root, 'docs', 'stories');
  fs.mkdirSync(dir, { recursive: true });
  return { root, dir };
}

function writeStory(dir, filename, content) {
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

describe('validate-story-meta', () => {
  describe('parseArgs', () => {
    it('recognizes --staged', () => {
      expect(parseArgs(['--staged']).staged).toBe(true);
    });
    it('recognizes --quiet', () => {
      expect(parseArgs(['--quiet']).quiet).toBe(true);
    });
    it('recognizes --json', () => {
      expect(parseArgs(['--json']).json).toBe(true);
    });
    it('defaults all flags to false', () => {
      const args = parseArgs([]);
      expect(args.staged).toBe(false);
      expect(args.quiet).toBe(false);
      expect(args.json).toBe(false);
    });
  });

  describe('VALID_STATUSES + REQUIRED_SECTIONS', () => {
    it('exposes the canonical status enum', () => {
      expect(VALID_STATUSES.has('Draft')).toBe(true);
      expect(VALID_STATUSES.has('Ready')).toBe(true);
      expect(VALID_STATUSES.has('InProgress')).toBe(true);
      expect(VALID_STATUSES.has('InReview')).toBe(true);
      expect(VALID_STATUSES.has('Done')).toBe(true);
      expect(VALID_STATUSES.has('Inprogress')).toBe(false);
    });
    it('exposes the hard-required section list (AC + Scope only)', () => {
      expect(REQUIRED_SECTIONS).toContain('## Acceptance Criteria');
      expect(REQUIRED_SECTIONS).toContain('## Scope');
      expect(REQUIRED_SECTIONS).not.toContain('## Status');
      expect(REQUIRED_SECTIONS).not.toContain('## Story');
    });
  });

  describe('parseFrontmatter', () => {
    it('parses valid YAML frontmatter', () => {
      const content = '---\nid: "10.99"\nstatus: "Draft"\n---\n# Story 10.99';
      const fm = parseFrontmatter(content);
      expect(fm.id).toBe('10.99');
      expect(fm.status).toBe('Draft');
    });
    it('returns null when no frontmatter present', () => {
      expect(parseFrontmatter('# Story without frontmatter\n## Status: Done')).toBeNull();
    });
    it('reports parse errors as a sentinel object', () => {
      const fm = parseFrontmatter('---\nid: [unclosed\n---\n');
      expect(fm).not.toBeNull();
      expect(fm.__parse_error).toBeDefined();
    });
  });

  describe('extractHeadingStatus', () => {
    it('extracts the status from "## Status: Done"', () => {
      expect(extractHeadingStatus('# Title\n\n## Status: Done\n')).toBe('Done');
    });
    it('extracts status without colon', () => {
      expect(extractHeadingStatus('## Status InReview')).toBe('InReview');
    });
    it('returns null when no Status heading present', () => {
      expect(extractHeadingStatus('# Title\n\n## Story\nfoo')).toBeNull();
    });
  });

  describe('findMissingSections', () => {
    it('reports both hard-required sections when none present', () => {
      const missing = findMissingSections('# Title only');
      expect(missing).toEqual(REQUIRED_SECTIONS);
    });
    it('reports zero when both hard sections present', () => {
      const content = '## Acceptance Criteria\ny\n## Scope\nz';
      expect(findMissingSections(content)).toEqual([]);
    });
    it('reports only the missing ones', () => {
      const content = '## Acceptance Criteria\nx\n';
      const missing = findMissingSections(content);
      expect(missing).toContain('## Scope');
      expect(missing).not.toContain('## Acceptance Criteria');
    });
  });

  describe('validateFile — frontmatter rules', () => {
    let project;
    beforeEach(() => {
      project = makeTempProject();
    });

    it('returns a single WARN for a story with no frontmatter at all', () => {
      const filePath = writeStory(
        project.dir,
        '10.99-grandfathered.story.md',
        '# Story 10.99\n\n## Status: Done\n## Story\nx\n## Acceptance Criteria\ny\n## Scope\nz',
      );
      const findings = validateFile(filePath);
      const frontmatterMissing = findings.find((f) => f.rule === 'frontmatter-missing');
      expect(frontmatterMissing).toBeDefined();
      expect(frontmatterMissing.level).toBe('warn');
    });

    it('flags an invalid status enum as ERROR', () => {
      const filePath = writeStory(
        project.dir,
        '10.99-bad-status.story.md',
        '---\nid: "10.99"\nstatus: "Inprogress"\n---\n# Story\n## Status: Inprogress\n## Story\nx\n## Acceptance Criteria\ny\n## Scope\nz',
      );
      const findings = validateFile(filePath);
      const statusError = findings.find((f) => f.rule === 'status-enum');
      expect(statusError).toBeDefined();
      expect(statusError.level).toBe('error');
    });

    it('flags heading-frontmatter status mismatch as ERROR', () => {
      const filePath = writeStory(
        project.dir,
        '10.99-mismatch.story.md',
        '---\nid: "10.99"\nstatus: "Done"\n---\n# Story\n## Status: InReview\n## Story\nx\n## Acceptance Criteria\ny\n## Scope\nz',
      );
      const findings = validateFile(filePath);
      const mismatch = findings.find((f) => f.rule === 'status-heading-mismatch');
      expect(mismatch).toBeDefined();
      expect(mismatch.level).toBe('error');
    });

    it('flags id-filename mismatch as ERROR', () => {
      const filePath = writeStory(
        project.dir,
        '10.99-misnamed.story.md',
        '---\nid: "10.42"\nstatus: "Done"\n---\n# Story\n## Status: Done\n## Story\nx\n## Acceptance Criteria\ny\n## Scope\nz',
      );
      const findings = validateFile(filePath);
      const idMismatch = findings.find((f) => f.rule === 'id-filename-mismatch');
      expect(idMismatch).toBeDefined();
      expect(idMismatch.level).toBe('error');
    });

    it('flags missing hard sections as ERROR when frontmatter present', () => {
      const filePath = writeStory(
        project.dir,
        '10.99-incomplete.story.md',
        '---\nid: "10.99"\nstatus: "Draft"\n---\n# Story\n## Status: Draft\n## Story\nx\n',
      );
      const findings = validateFile(filePath);
      const sectionErrors = findings.filter((f) => f.rule === 'section-missing');
      expect(sectionErrors.length).toBeGreaterThan(0);
      expect(sectionErrors.every((f) => f.level === 'error')).toBe(true);
    });

    it('downgrades missing hard sections to WARN for grandfathered stories without frontmatter', () => {
      const filePath = writeStory(
        project.dir,
        '10.99-old.story.md',
        '# Story 10.99\n\n## Status: Done\n',
      );
      const findings = validateFile(filePath);
      const sectionWarnings = findings.filter((f) => f.rule === 'section-missing');
      expect(sectionWarnings.length).toBeGreaterThan(0);
      expect(sectionWarnings.every((f) => f.level === 'warn')).toBe(true);
    });

    it('flags missing soft sections as WARN when frontmatter present (cosmetic)', () => {
      const filePath = writeStory(
        project.dir,
        '10.99-no-prose.story.md',
        '---\nid: "10.99"\nstatus: "Done"\n---\n# Story\n## Contexto\nfoo\n## Acceptance Criteria\ny\n## Scope\nz',
      );
      const findings = validateFile(filePath);
      const softWarns = findings.filter((f) => f.rule === 'soft-section-missing');
      expect(softWarns.length).toBe(2);
      expect(softWarns.every((f) => f.level === 'warn')).toBe(true);
      const errors = findings.filter((f) => f.level === 'error');
      expect(errors).toEqual([]);
    });

    it('returns zero findings for a fully compliant story', () => {
      const filePath = writeStory(
        project.dir,
        '10.99-clean.story.md',
        '---\nid: "10.99"\nstatus: "Done"\n---\n# Story\n## Status: Done\n## Story\nx\n## Acceptance Criteria\ny\n## Scope\nz',
      );
      expect(validateFile(filePath)).toEqual([]);
    });
  });

  describe('findStoryFiles (default scope = git-tracked, hermetic)', () => {
    // Initialize a real git repo and TRACK files so git ls-files sees them.
    // The default scope is git-tracked-only (Wave 2), so untracked drafts must
    // be invisible — this is exactly what makes the validator hermetic.
    function makeGitProject() {
      const { root, dir } = makeTempProject();
      const git = (args) =>
        spawnSync('git', args, { cwd: root, encoding: 'utf8' });
      git(['init', '-q']);
      git(['config', 'user.email', 'test@example.com']);
      git(['config', 'user.name', 'Test']);
      git(['config', 'commit.gpgsign', 'false']);
      return { root, dir, git };
    }

    function track(git, root, relPath) {
      // docs/stories is gitignored in the real repo, so force-add to track.
      git(['add', '-f', relPath]);
    }

    it('returns empty array outside a git repo / when nothing is tracked', () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-storymeta-empty-'));
      expect(findStoryFiles(root)).toEqual([]);
    });

    it('lists only tracked .story.md files (untracked drafts ignored)', () => {
      const project = makeGitProject();
      writeStory(project.dir, '10.1-real.story.md', '# real');
      writeStory(project.dir, 'README.md', '# not a story');
      writeStory(project.dir, '10.2-also.story.md', '# also real');
      // Track all three; only the .story.md ones should come back.
      track(project.git, project.root, 'docs/stories/10.1-real.story.md');
      track(project.git, project.root, 'docs/stories/README.md');
      track(project.git, project.root, 'docs/stories/10.2-also.story.md');

      const files = findStoryFiles(project.root).sort();
      expect(files).toHaveLength(2);
      expect(files.every((f) => f.endsWith('.story.md'))).toBe(true);
    });

    it('does NOT scan untracked local drafts (hermetic default)', () => {
      const project = makeGitProject();
      writeStory(project.dir, '10.9-draft.story.md', '# untracked draft');
      // Intentionally NOT tracked.
      expect(findStoryFiles(project.root)).toEqual([]);
    });
  });

  describe('summarize + main exit logic', () => {
    it('counts pass/warn/error correctly', () => {
      const results = [
        { findings: [] },
        { findings: [{ level: 'warn', rule: 'x', message: 'y' }] },
        { findings: [{ level: 'error', rule: 'x', message: 'y' }] },
        { findings: [{ level: 'error', rule: 'x' }, { level: 'warn', rule: 'y' }] },
      ];
      const s = summarize(results);
      expect(s.total).toBe(4);
      expect(s.pass).toBe(1);
      expect(s.warn).toBe(1);
      expect(s.error).toBe(2);
    });

    it('formatReport produces a stable string with PASS/WARN/ERROR tags', () => {
      const results = [
        { filePath: '/tmp/clean.story.md', findings: [] },
        {
          filePath: '/tmp/dirty.story.md',
          findings: [{ level: 'error', rule: 'status-enum', message: 'bad' }],
        },
      ];
      const s = summarize(results);
      const report = formatReport(results, s);
      expect(report).toContain('PASS');
      expect(report).toContain('ERROR');
      expect(report).toContain('Summary: 2 file(s) — 1 pass, 0 warn, 1 error');
    });
  });
});
