#!/usr/bin/env node

/**
 * wave-gate.js — deterministic wave gate for harness-based epic waves.
 *
 * Story onda3-s5-epic-waves-wrapper-pilot (AF-20260702 item 3.5).
 *
 * The HÍBRIDO verdict (2026-06-30) killed the homegrown multi-story engine.
 * The wave path that remains viable is a THIN WRAPPER over the harness:
 * fan-out per story into isolated workdirs/worktrees, then THIS gate decides
 * whether the wave may advance — by measurement, not by claim:
 *
 *   1. TESTS GREEN: the story's test command exits 0 (default `node --test`).
 *   2. FILES ACTUALLY WRITTEN: the story dir contains real product files
 *      (excluding plan/, docs/, node_modules, dotfiles and markdown) — the
 *      echo of the empty-build honesty fix: a wave never advances on a story
 *      that produced zero code.
 *
 * Verdict per story and for the wave: APPROVED / NEEDS_WORK (exit 0 / 1).
 *
 * Usage:
 *   node scripts/wave-gate.js --stories <dir1> <dir2> [...] \
 *     [--test-cmd "node --test"] [--json]
 *
 * Adoption status: utility + pilot instrument. Whether the wave wrapper
 * becomes product is decided EXCLUSIVELY by the pre-registered measurement
 * (tests/evals/epic-gates/PROTOCOL.md) — see the checkpoint in
 * docs/epics/epic-onda3-estrutural/.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DEFAULT_TEST_CMD = 'node --test';

/** Directory/file names that never count as written product files. */
const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'plan', 'docs', '.sinapse']);

/**
 * Recursively list product files written in a story dir.
 * Markdown and dotfiles are not product; plan/ and docs/ are artifacts of
 * planning, not implementation (a plan is not an implementation).
 *
 * @param {string} dir
 * @param {number} [depth]
 * @returns {string[]} Relative paths of product files
 */
function scanWrittenFiles(dir, depth = 0) {
  if (depth > 6) return [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      out.push(
        ...scanWrittenFiles(path.join(dir, entry.name), depth + 1).map((f) =>
          path.join(entry.name, f),
        ),
      );
      continue;
    }
    if (entry.name.endsWith('.md')) continue;
    out.push(entry.name);
  }
  return out;
}

/**
 * Parse a `node --test` (TAP-ish) summary out of test output. Best effort —
 * the EXIT CODE is the source of truth; counts are telemetry.
 *
 * @param {string} output
 * @returns {{pass: ?number, fail: ?number}}
 */
function parseNodeTestSummary(output) {
  const grab = (re) => {
    const m = String(output).match(re);
    return m ? parseInt(m[1], 10) : null;
  };
  return {
    pass: grab(/^#\s*pass\s+(\d+)/im),
    fail: grab(/^#\s*fail\s+(\d+)/im),
  };
}

/**
 * Evaluate one story dir: run its tests and verify real files were written.
 *
 * @param {string} storyDir
 * @param {{testCmd?: string}} [options]
 * @returns {{story: string, verdict: string, filesWritten: number, files: string[], tests: {exitCode: ?number, pass: ?number, fail: ?number, skipped?: boolean}, reasons: string[]}}
 */
function evaluateStory(storyDir, options = {}) {
  const testCmd = options.testCmd || DEFAULT_TEST_CMD;
  const reasons = [];

  const files = scanWrittenFiles(storyDir);
  if (files.length === 0) {
    reasons.push('zero product files written (a plan is not an implementation)');
  }

  let tests = { exitCode: null, pass: null, fail: null };
  if (files.length === 0) {
    // Nothing to test — do not mask the real failure with a confusing test error.
    tests = { exitCode: null, pass: null, fail: null, skipped: true };
  } else {
    try {
      const output = execSync(testCmd, {
        cwd: storyDir,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 120000,
      });
      tests = { exitCode: 0, ...parseNodeTestSummary(output) };
    } catch (error) {
      const output = `${error.stdout || ''}\n${error.stderr || ''}`;
      tests = {
        exitCode: typeof error.status === 'number' ? error.status : 1,
        ...parseNodeTestSummary(output),
      };
      reasons.push(`tests failed (exit ${tests.exitCode}${tests.fail != null ? `, ${tests.fail} failing` : ''})`);
    }
  }

  return {
    story: storyDir,
    verdict: reasons.length === 0 ? 'APPROVED' : 'NEEDS_WORK',
    filesWritten: files.length,
    files,
    tests,
    reasons,
  };
}

/**
 * Evaluate a whole wave (list of story dirs).
 *
 * @param {string[]} storyDirs
 * @param {{testCmd?: string}} [options]
 * @returns {{verdict: string, stories: Array}}
 */
function evaluateWave(storyDirs, options = {}) {
  const stories = storyDirs.map((dir) => evaluateStory(dir, options));
  return {
    verdict: stories.every((s) => s.verdict === 'APPROVED') ? 'APPROVED' : 'NEEDS_WORK',
    stories,
  };
}

function main() {
  const argv = process.argv.slice(2);
  const json = argv.includes('--json');

  const testCmdIdx = argv.indexOf('--test-cmd');
  const testCmd = testCmdIdx !== -1 ? argv[testCmdIdx + 1] : DEFAULT_TEST_CMD;

  const storiesIdx = argv.indexOf('--stories');
  if (storiesIdx === -1) {
    console.error('Usage: node scripts/wave-gate.js --stories <dir1> [dir2 ...] [--test-cmd "..."] [--json]');
    process.exit(2);
  }
  const storyDirs = [];
  for (let i = storiesIdx + 1; i < argv.length && !argv[i].startsWith('--'); i += 1) {
    storyDirs.push(path.resolve(argv[i]));
  }
  if (storyDirs.length === 0) {
    console.error('wave-gate: --stories requires at least one directory.');
    process.exit(2);
  }

  const wave = evaluateWave(storyDirs, { testCmd });

  if (json) {
    console.log(JSON.stringify(wave, null, 2));
  } else {
    console.log(`=== wave-gate (${storyDirs.length} story(ies)) ===`);
    for (const s of wave.stories) {
      const testInfo = s.tests.skipped
        ? 'tests skipped (nothing to test)'
        : `tests exit ${s.tests.exitCode}${s.tests.pass != null ? ` (${s.tests.pass} pass/${s.tests.fail} fail)` : ''}`;
      console.log(`  ${s.verdict.padEnd(10)} ${path.basename(s.story)} — ${s.filesWritten} file(s), ${testInfo}`);
      for (const r of s.reasons) console.log(`             - ${r}`);
    }
    console.log('');
    console.log(`wave verdict: ${wave.verdict}`);
  }

  process.exit(wave.verdict === 'APPROVED' ? 0 : 1);
}

module.exports = {
  scanWrittenFiles,
  parseNodeTestSummary,
  evaluateStory,
  evaluateWave,
};

if (require.main === module) main();
