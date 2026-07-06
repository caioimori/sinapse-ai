#!/usr/bin/env node
/**
 * Advisory guard: acceptance criteria in executable Given/When/Then form
 * (Story mesa2-acs-gwt-guard, AF-20260704 Mesa #3).
 *
 * GWT is the documented "preferred" AC format (story-lifecycle.md), but stories
 * historically copy free-form numbered lists from the epic. This guard flags ACs
 * that are NOT in GWT so authors can tighten them — it is advisory by design:
 *
 *   - Exit 0 always (WARN-only), mirroring validate-article-iv, UNLESS
 *     STORY_ACS_STRICT=1 is set and at least one non-GWT AC is found.
 *   - `docs/stories/` is gitignored (local, unversioned), so in CI there are
 *     typically no story files — the guard degrades gracefully to a PASS with
 *     "nothing to lint" instead of failing.
 *
 * The core is a pure function (`lintStoryAcs`) so tests can drive it with
 * fixtures; the CLI wrapper walks the default story dir.
 *
 * @module scripts/validate-story-acs
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

/** Default lint target: local story files (gitignored — may be absent in CI). */
const DEFAULT_STORIES_DIR = 'docs/stories';

/** Heading that opens the acceptance-criteria section (case-insensitive). */
const AC_HEADING = /^#{1,6}\s+acceptance\s+criteria\b/i;

/** Any markdown heading — closes the AC section. */
const ANY_HEADING = /^#{1,6}\s+/;

/** A list item (bullet `-`/`*` with optional checkbox, or `N.` numbered). */
const LIST_ITEM = /^\s*(?:[-*]\s+(?:\[[ xX]\]\s+)?|\d+[.)]\s+)(.+)$/;

/**
 * True when a single AC's text is in executable Given/When/Then form — it must
 * mention all three keywords (order-agnostic, case-insensitive).
 *
 * @param {string} text
 * @returns {boolean}
 */
function isGwt(text) {
  const t = text.toLowerCase();
  return /\bgiven\b/.test(t) && /\bwhen\b/.test(t) && /\bthen\b/.test(t);
}

/**
 * Extract the acceptance-criteria list items from a story's markdown body and
 * classify each as GWT or not.
 *
 * @param {string} content - full markdown of a story file
 * @returns {{ total: number, gwt: number, nonGwt: Array<{ text: string }> }}
 */
function lintStoryAcs(content) {
  const lines = String(content).split(/\r?\n/);
  const items = [];

  let inSection = false;
  let current = null; // accumulates a multi-line AC item

  const flush = () => {
    if (current !== null) {
      items.push(current.trim());
      current = null;
    }
  };

  for (const line of lines) {
    if (!inSection) {
      if (AC_HEADING.test(line)) inSection = true;
      continue;
    }
    // A new heading ends the AC section.
    if (ANY_HEADING.test(line)) {
      flush();
      break;
    }
    const m = line.match(LIST_ITEM);
    if (m) {
      flush();
      current = m[1];
    } else if (current !== null && line.trim() !== '') {
      // continuation line of the current AC item
      current += ' ' + line.trim();
    } else if (current !== null && line.trim() === '') {
      flush();
    }
  }
  flush();

  const nonGwt = items.filter((t) => !isGwt(t)).map((text) => ({ text }));
  return { total: items.length, gwt: items.length - nonGwt.length, nonGwt };
}

/** Recursively collect `.md` files under a directory. */
function walkMarkdown(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkMarkdown(p, out);
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

/** CLI entry point. */
function main() {
  const strict = process.env.STORY_ACS_STRICT === '1';
  const dir = path.join(ROOT, DEFAULT_STORIES_DIR);
  const files = walkMarkdown(dir);

  if (files.length === 0) {
    console.log(
      `story-acs: no story files under ${DEFAULT_STORIES_DIR}/ (gitignored) — nothing to lint. PASS.`,
    );
    process.exit(0);
  }

  let totalAcs = 0;
  let totalNonGwt = 0;
  const report = [];

  for (const file of files) {
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    const { total, nonGwt } = lintStoryAcs(content);
    if (total === 0) continue; // not an AC-bearing story
    totalAcs += total;
    if (nonGwt.length > 0) {
      totalNonGwt += nonGwt.length;
      report.push({ file: path.relative(ROOT, file), nonGwt });
    }
  }

  if (totalNonGwt === 0) {
    console.log(`story-acs: ${totalAcs} AC(s) across ${files.length} file(s), all GWT-shaped. PASS.`);
    process.exit(0);
  }

  const level = strict ? 'FAIL' : 'WARN';
  console.log(`story-acs [${level}]: ${totalNonGwt}/${totalAcs} AC(s) are not in Given/When/Then form:`);
  for (const r of report) {
    console.log(`  ${r.file}`);
    for (const { text } of r.nonGwt) {
      const preview = text.length > 90 ? text.slice(0, 87) + '...' : text;
      console.log(`    - ${preview}`);
    }
  }
  console.log(
    strict
      ? '\nSTORY_ACS_STRICT=1 → failing. Rewrite the ACs above as "Given <ctx>, When <action>, Then <outcome>."'
      : '\nAdvisory only (exit 0). Prefer "Given <ctx>, When <action>, Then <outcome>." Set STORY_ACS_STRICT=1 to enforce.',
  );
  process.exit(strict ? 1 : 0);
}

if (require.main === module) main();

module.exports = { lintStoryAcs, isGwt };
