#!/usr/bin/env node
'use strict';

/**
 * staged-protected-files-guard — blocks a commit that DELETES (or untracks) a
 * protected, committed-but-critical framework file.
 *
 * Why: on 2026-06-20 a "snapshot migracao notebook" sweep (`git add -A`) untracked
 * `.sinapse-ai/core/registry/service-registry.json` (the committed registry drift
 * detector, ~12k lines), bundled it with unrelated work, and pushed it. The
 * framework-boundary guard is a no-op in contributor mode
 * (boundary.frameworkProtection=false), so nothing stopped the deletion. This guard
 * is ALWAYS on and narrowly targets that class of damage — it never touches normal
 * edits, only the removal of a curated set of protected paths.
 *
 * Intentional removal (done in a story) bypasses with: git commit --no-verify
 *
 * Self-contained: Node built-ins + `git` only (matches the other lib guards so it
 * bundles into <hooksDir>/lib/ with no extra deps).
 */

const { spawnSync } = require('child_process');

// Curated, high-signal list. Keep small to guarantee zero false positives on
// normal work. These files are committed on purpose and must never be removed by
// an automated sweep without an explicit story.
const PROTECTED = ['.sinapse-ai/core/registry/service-registry.json'];

function stagedDeletions() {
  // --no-renames forces a rename-away of a protected file to surface as a real
  // deletion (D) of the old path, so moving the file out also trips the guard.
  const res = spawnSync('git', ['diff', '--cached', '--name-status', '--no-renames'], {
    encoding: 'utf8',
  });
  if (!res || res.status !== 0 || typeof res.stdout !== 'string') return [];
  const deleted = [];
  for (const line of res.stdout.split('\n')) {
    if (!line) continue;
    const parts = line.split('\t');
    const status = parts[0];
    const file = (parts[parts.length - 1] || '').replace(/\\/g, '/');
    if (status === 'D') deleted.push(file);
  }
  return deleted;
}

const offenders = stagedDeletions().filter((f) => PROTECTED.includes(f));

if (offenders.length > 0) {
  process.stderr.write(
    'SINAPSE Protected Files: blocking commit — it deletes/untracks a protected file:\n',
  );
  for (const f of offenders) process.stderr.write('  - ' + f + '\n');
  process.stderr.write(
    '\nThese files are committed on purpose (e.g. service-registry.json is the registry\n' +
      'drift detector). They must not be removed by an automated sweep (git add -A) or a\n' +
      'machine-migration snapshot. If this removal is intentional, do it in a story and\n' +
      'bypass once with:  git commit --no-verify\n',
  );
  process.exit(1);
}

process.exit(0);
