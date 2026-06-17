/**
 * Guard parity — the shared security guards exist in TWO locations:
 *   - bin/utils/                  (used by the Claude PreToolUse hook,
 *                                  bin/utils/staged-secret-scan.js, the publish
 *                                  gate and the unit tests)
 *   - .sinapse-ai/git-hooks/lib/  (the git core.hooksPath bundle: pre-commit /
 *                                  pre-push)
 *
 * They MUST stay byte-identical. They silently diverged once (an E9 fix to the
 * connection-string pattern landed in the git-hooks copy but not the bin/utils
 * copy, so the Claude hook kept the buggy cross-newline behaviour). This test
 * is the guard against that recurring: edit one, edit both.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..');
const BIN = path.join(REPO, 'bin', 'utils');
const HOOKS = path.join(REPO, '.sinapse-ai', 'git-hooks', 'lib');

const SHARED = [
  'secret-scanner-core.js',
  'staged-secret-scan.js',
  'staged-sql-guard.js',
  'framework-guard.js',
];

describe('security guard parity — bin/utils vs .sinapse-ai/git-hooks/lib (E9)', () => {
  for (const file of SHARED) {
    test(`${file} exists in both locations and is byte-identical`, () => {
      const binPath = path.join(BIN, file);
      const hooksPath = path.join(HOOKS, file);
      expect(fs.existsSync(binPath)).toBe(true);
      expect(fs.existsSync(hooksPath)).toBe(true);
      expect(fs.readFileSync(hooksPath, 'utf8')).toBe(fs.readFileSync(binPath, 'utf8'));
    });
  }
});
