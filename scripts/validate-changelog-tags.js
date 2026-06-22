#!/usr/bin/env node
/**
 * Validate Changelog Tags
 *
 * Guards against release/version drift: every published git version tag MUST
 * have a matching `## [x.y.z]` heading in CHANGELOG.md. This catches the failure
 * mode where semantic-release publishes a version but the CHANGELOG entry was
 * never committed back to the repo (the root cause of the 1.9.0 -> 1.12.2 drift).
 *
 * Usage:
 *   node scripts/validate-changelog-tags.js
 *   npm run validate:changelog
 *
 * Exit codes:
 *   0 - Every version tag has a CHANGELOG heading (or git unavailable -> SKIP)
 *   1 - One or more version tags are missing a CHANGELOG heading
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CHANGELOG_PATH = path.join(ROOT, 'CHANGELOG.md');

// Matches a clean semver core: x.y.z (no pre-release/build suffix).
const SEMVER_RE = /^\d+\.\d+\.\d+$/;

/**
 * List git version tags, normalized (leading `v` stripped) and filtered to
 * clean `x.y.z` semver. Returns null if git is unavailable (offline / no repo).
 * @returns {string[]|null}
 */
function listVersionTags() {
  let raw;
  try {
    raw = execFileSync('git', ['tag', '-l'], { cwd: ROOT, encoding: 'utf8' });
  } catch {
    return null; // git not available or not a repo
  }

  return raw
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.replace(/^v/, ''))
    .filter((t) => SEMVER_RE.test(t));
}

/**
 * Collect all `## [x.y.z]` headings from CHANGELOG.md.
 * @returns {Set<string>}
 */
function collectChangelogVersions() {
  const content = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  const headings = new Set();
  const re = /^##\s*\[(\d+\.\d+\.\d+)\]/gm;
  let m;
  while ((m = re.exec(content)) !== null) {
    headings.add(m[1]);
  }
  return headings;
}

function main() {
  const tags = listVersionTags();

  if (tags === null) {
    console.log('SKIP — git is unavailable; cannot cross-check tags vs CHANGELOG.');
    process.exit(0);
  }

  if (!fs.existsSync(CHANGELOG_PATH)) {
    console.error('FAIL — CHANGELOG.md not found.');
    process.exit(1);
  }

  const documented = collectChangelogVersions();
  const missing = tags.filter((t) => !documented.has(t)).sort();

  if (missing.length > 0) {
    console.error('FAIL — version tags without a CHANGELOG heading:');
    for (const v of missing) {
      console.error(`   - ${v}  (expected "## [${v}]" in CHANGELOG.md)`);
    }
    console.error('');
    console.error('Add the missing entries to CHANGELOG.md before releasing.');
    process.exit(1);
  }

  console.log(`OK — all ${tags.length} version tag(s) have a CHANGELOG heading.`);
  process.exit(0);
}

main();
