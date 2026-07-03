/**
 * init-non-tty.test.js
 *
 * Story onda2-p6 — `npx sinapse-ai init` crashed with ERR_USE_AFTER_CLOSE in
 * a non-interactive shell (CI, piped stdin, AI agents) because initProject()
 * called the wizard without a `quiet` flag, so it always took the interactive
 * inquirer.prompt() branch for language/LLM selection. `install` already
 * avoided this by passing quiet:true unconditionally (bin/commands/install.js).
 *
 * This tests the decision point (shouldRunInitQuiet), not the full wizard —
 * the same testing convention already used for TTY-related fixes in this repo
 * (see tests/installer/non-tty-install.test.js and
 * tests/installer/install-reconfigure.test.js): isolate the fallback logic
 * rather than executing the heavy, side-effecting install flow end-to-end.
 */

'use strict';

const { shouldRunInitQuiet } = require('../../bin/sinapse.js');

describe('shouldRunInitQuiet — init non-TTY fallback (Story onda2-p6)', () => {
  describe('explicit interactive argument', () => {
    it('returns true (quiet) when not interactive', () => {
      expect(shouldRunInitQuiet(false)).toBe(true);
    });

    it('returns false (interactive) when a TTY is present', () => {
      expect(shouldRunInitQuiet(true)).toBe(false);
    });
  });

  describe('default parameter — real TTY/env detection', () => {
    let originalStdinIsTTY;
    let originalStdoutIsTTY;
    let originalCI;
    let originalGithubActions;

    beforeEach(() => {
      originalStdinIsTTY = process.stdin.isTTY;
      originalStdoutIsTTY = process.stdout.isTTY;
      // detectInteractiveMode() treats CI/GITHUB_ACTIONS as an always-false
      // override regardless of TTY state — clear them so the "stays
      // interactive" case below is deterministic when this suite itself runs
      // inside GitHub Actions (where CI=true is standard).
      originalCI = process.env.CI;
      originalGithubActions = process.env.GITHUB_ACTIONS;
      delete process.env.CI;
      delete process.env.GITHUB_ACTIONS;
    });

    afterEach(() => {
      if (typeof originalStdinIsTTY === 'undefined') {
        delete process.stdin.isTTY;
      } else {
        process.stdin.isTTY = originalStdinIsTTY;
      }
      if (typeof originalStdoutIsTTY === 'undefined') {
        delete process.stdout.isTTY;
      } else {
        process.stdout.isTTY = originalStdoutIsTTY;
      }
      if (typeof originalCI === 'undefined') {
        delete process.env.CI;
      } else {
        process.env.CI = originalCI;
      }
      if (typeof originalGithubActions === 'undefined') {
        delete process.env.GITHUB_ACTIONS;
      } else {
        process.env.GITHUB_ACTIONS = originalGithubActions;
      }
    });

    it('falls back to quiet mode when both stdin and stdout are not a TTY (the reported crash scenario)', () => {
      process.stdin.isTTY = false;
      process.stdout.isTTY = false;

      expect(shouldRunInitQuiet()).toBe(true);
    });

    it('falls back to quiet mode when isTTY is undefined (piped/closed stdio)', () => {
      delete process.stdin.isTTY;
      delete process.stdout.isTTY;

      expect(shouldRunInitQuiet()).toBe(true);
    });

    it('stays interactive when stdin and stdout are both a real TTY', () => {
      process.stdin.isTTY = true;
      process.stdout.isTTY = true;

      expect(shouldRunInitQuiet()).toBe(false);
    });
  });
});
