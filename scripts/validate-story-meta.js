#!/usr/bin/env node
/**
 * validate-story-meta — Story 10.19
 *
 * Validator for `docs/stories/*.story.md` files.
 *
 * Scope (hermetic):
 *   The DEFAULT scope is git-TRACKED story files only (`git ls-files`).
 *   docs/stories/ is gitignored, so untracked local drafts are NOT scanned
 *   by default — the result is deterministic and identical locally and in CI
 *   (a clean checkout with no tracked stories is simply a no-op). Use
 *   `--staged` to scope to staged stories (lint-staged on commit).
 *
 * What it checks:
 *   1. Files lack YAML frontmatter            -> WARN  (grandfathered)
 *   2. Frontmatter status not in enum          -> ERROR
 *   3. ## Status heading != frontmatter status -> ERROR
 *   4. Required sections missing               -> ERROR (with frontmatter)
 *                                                 WARN  (without frontmatter)
 *   5. Frontmatter id not in filename prefix   -> ERROR
 *
 * Exit codes:
 *   0  no ERRORs   (PASS or PASS+WARN)
 *   1  any ERROR
 *
 * Usage:
 *   node scripts/validate-story-meta.js                Full scan
 *   node scripts/validate-story-meta.js --staged       Only staged stories
 *   node scripts/validate-story-meta.js --quiet        Suppress per-file output
 */

'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { spawnSync } = require('child_process');

const VALID_STATUSES = new Set(['Draft', 'Ready', 'InProgress', 'InReview', 'Done']);
// Hard-required for any story: AC + Scope. The other two (Status, Story)
// are convention but can be satisfied by frontmatter alone in newer stories
// that drop the prose heading.
const REQUIRED_SECTIONS = ['## Acceptance Criteria', '## Scope'];
const SOFT_SECTIONS = ['## Status', '## Story'];

function parseArgs(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  return {
    staged: args.has('--staged'),
    quiet: args.has('--quiet') || args.has('-q'),
    json: args.has('--json'),
  };
}

function findStoryFiles(projectRoot, opts = {}) {
  if (opts.staged) {
    const result = spawnSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACM'], {
      cwd: projectRoot,
      encoding: 'utf8',
    });
    if (result.status !== 0) return [];
    return result.stdout
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('docs/stories/') && line.endsWith('.story.md'))
      .map((rel) => path.join(projectRoot, rel));
  }
  // Default scope: git-TRACKED story files only (hermetic — same result
  // locally and in CI). docs/stories/ is gitignored, so untracked local drafts
  // must NOT be scanned by default; only files actually committed are checked.
  // This mirrors validate-no-personal-leaks.js (git ls-files as source of truth).
  // NB: use the DIRECTORY pathspec ('docs/stories') and filter by suffix in JS.
  // A glob like 'docs/stories/**/*.story.md' would (per git pathspec semantics)
  // match only NESTED files and MISS stories directly in docs/stories/.
  const result = spawnSync('git', ['ls-files', 'docs/stories'], {
    cwd: projectRoot,
    encoding: 'utf8',
  });
  if (result.status !== 0 || !result.stdout) return [];
  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.endsWith('.story.md'))
    .map((rel) => path.join(projectRoot, rel));
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  try {
    return yaml.load(match[1]);
  } catch (err) {
    return { __parse_error: err.message };
  }
}

function extractHeadingStatus(content) {
  const match = content.match(/^##\s*Status\s*:?\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

function findMissingSections(content) {
  return REQUIRED_SECTIONS.filter((section) => {
    const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`^${escaped}\\b`, 'm');
    return !re.test(content);
  });
}

function validateFile(filePath) {
  const findings = [];
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    findings.push({ level: 'error', rule: 'read', message: `cannot read file: ${err.message}` });
    return findings;
  }

  const frontmatter = parseFrontmatter(content);
  const hasFrontmatter = frontmatter !== null && !frontmatter.__parse_error;
  const fileName = path.basename(filePath);

  if (frontmatter && frontmatter.__parse_error) {
    findings.push({
      level: 'error',
      rule: 'frontmatter-parse',
      message: `YAML frontmatter parse error: ${frontmatter.__parse_error}`,
    });
  }

  if (!hasFrontmatter && !frontmatter) {
    findings.push({
      level: 'warn',
      rule: 'frontmatter-missing',
      message: 'no YAML frontmatter (grandfathered — older story format)',
    });
  }

  if (hasFrontmatter) {
    if (!frontmatter.status || !VALID_STATUSES.has(frontmatter.status)) {
      findings.push({
        level: 'error',
        rule: 'status-enum',
        message: `frontmatter status="${frontmatter.status}" is not in [${[...VALID_STATUSES].join(', ')}]`,
      });
    }

    const headingStatus = extractHeadingStatus(content);
    if (headingStatus && frontmatter.status && headingStatus !== frontmatter.status) {
      findings.push({
        level: 'error',
        rule: 'status-heading-mismatch',
        message: `## Status heading says "${headingStatus}" but frontmatter says "${frontmatter.status}"`,
      });
    }

    if (frontmatter.id) {
      const idStr = String(frontmatter.id);
      if (!fileName.startsWith(`${idStr}-`) && !fileName.startsWith(`${idStr}.`)) {
        findings.push({
          level: 'error',
          rule: 'id-filename-mismatch',
          message: `frontmatter id="${idStr}" does not match filename prefix`,
        });
      }
    }
  }

  const missingHard = findMissingSections(content);
  for (const section of missingHard) {
    findings.push({
      level: hasFrontmatter ? 'error' : 'warn',
      rule: 'section-missing',
      message: `missing required section: ${section}`,
    });
  }

  // Soft sections: only flag for files WITH frontmatter, and only as WARN.
  // For grandfathered files (no frontmatter), the existing frontmatter-missing
  // WARN already conveys "old format", so we don't pile on more noise.
  if (hasFrontmatter) {
    for (const section of SOFT_SECTIONS) {
      const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`^${escaped}\\b`, 'm');
      if (!re.test(content)) {
        findings.push({
          level: 'warn',
          rule: 'soft-section-missing',
          message: `convention: ${section} heading is missing (frontmatter satisfies the data, this is cosmetic)`,
        });
      }
    }
  }

  return findings;
}

function summarize(results) {
  const summary = { total: results.length, pass: 0, warn: 0, error: 0 };
  for (const r of results) {
    const hasError = r.findings.some((f) => f.level === 'error');
    const hasWarn = r.findings.some((f) => f.level === 'warn');
    if (hasError) summary.error += 1;
    else if (hasWarn) summary.warn += 1;
    else summary.pass += 1;
  }
  return summary;
}

function formatReport(results, summary) {
  const lines = [];
  for (const r of results) {
    if (r.findings.length === 0) {
      lines.push(`PASS  ${path.relative(process.cwd(), r.filePath)}`);
      continue;
    }
    const hasError = r.findings.some((f) => f.level === 'error');
    const tag = hasError ? 'ERROR' : 'WARN ';
    lines.push(`${tag} ${path.relative(process.cwd(), r.filePath)}`);
    for (const finding of r.findings) {
      lines.push(`  [${finding.level}] ${finding.rule}: ${finding.message}`);
    }
  }
  lines.push('');
  lines.push(
    `Summary: ${summary.total} file(s) — ${summary.pass} pass, ${summary.warn} warn, ${summary.error} error`,
  );
  return lines.join('\n');
}

function main() {
  const args = parseArgs();
  const projectRoot = process.cwd();
  const files = findStoryFiles(projectRoot, { staged: args.staged });

  if (files.length === 0) {
    if (!args.quiet) {
      console.log('=== validate-story-meta ===');
      console.log('No git-tracked story files found — skipping (untracked local drafts are not scanned by default).');
    }
    return 0;
  }

  const results = files.map((filePath) => ({
    filePath,
    findings: validateFile(filePath),
  }));
  const summary = summarize(results);

  if (args.json) {
    console.log(JSON.stringify({ results, summary }, null, 2));
  } else if (!args.quiet) {
    console.log('=== validate-story-meta ===');
    console.log(formatReport(results, summary));
  }

  return summary.error > 0 ? 1 : 0;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = {
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
};
