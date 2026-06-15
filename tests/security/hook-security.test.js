'use strict';

/**
 * Hook Security Properties Tests
 * Story 8.10: Security Test Suite
 *
 * Validates that security hooks follow fail-open design principles:
 * - All hooks exist and are non-empty
 * - settings.json has hooks properly registered
 * - Hook scripts follow required conventions
 *
 * @module tests/security/hook-security.test
 */

const fs = require('fs');
const path = require('path');

const HOOKS_DIR = path.join(__dirname, '../../.claude/hooks');
const SETTINGS_PATH = path.join(__dirname, '../../.claude/settings.json');

// ---------------------------------------------------------------------------
// Hook file discovery
// ---------------------------------------------------------------------------

const hookFiles = fs.existsSync(HOOKS_DIR)
  ? fs.readdirSync(HOOKS_DIR).filter(
    (f) => f.endsWith('.cjs') || f.endsWith('.py') || f.endsWith('.sh'),
  )
  : [];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Hook Security Properties (Story 8.10)', () => {
  describe('hooks directory', () => {
    test('hooks directory exists', () => {
      expect(fs.existsSync(HOOKS_DIR)).toBe(true);
    });

    test('at least 10 hook files exist', () => {
      expect(hookFiles.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('hook file integrity', () => {
    test.each(hookFiles)('hook %s is non-empty (>50 bytes)', (hookFile) => {
      const content = fs.readFileSync(path.join(HOOKS_DIR, hookFile), 'utf8');
      expect(content.length).toBeGreaterThan(50);
    });

    test.each(hookFiles)('hook %s has a shebang or use-strict', (hookFile) => {
      const content = fs.readFileSync(path.join(HOOKS_DIR, hookFile), 'utf8');
      const firstLine = content.split('\n')[0].trim();
      // CJS hooks should have 'use strict' or shebang
      // Python hooks should have #!/usr/bin/env python3 or similar
      // Shell hooks should have #!/usr/bin/env bash or similar
      const hasShebang = firstLine.startsWith('#!');
      const hasUseStrict = content.includes("'use strict'") || content.includes('"use strict"');
      expect(hasShebang || hasUseStrict).toBe(true);
    });
  });

  describe('settings.json hook registration', () => {
    let settings;

    beforeAll(() => {
      if (fs.existsSync(SETTINGS_PATH)) {
        settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
      }
    });

    test('settings.json exists', () => {
      expect(fs.existsSync(SETTINGS_PATH)).toBe(true);
    });

    test('hooks section is defined', () => {
      expect(settings).toBeDefined();
      expect(settings.hooks).toBeDefined();
    });

    test('UserPromptSubmit hooks are registered', () => {
      expect(settings.hooks.UserPromptSubmit).toBeDefined();
      expect(settings.hooks.UserPromptSubmit.length).toBeGreaterThanOrEqual(1);
    });

    test('PreToolUse hooks are registered', () => {
      expect(settings.hooks.PreToolUse).toBeDefined();
      expect(settings.hooks.PreToolUse.length).toBeGreaterThanOrEqual(1);
    });

    test('PreCompact hooks are registered', () => {
      expect(settings.hooks.PreCompact).toBeDefined();
      expect(settings.hooks.PreCompact.length).toBeGreaterThanOrEqual(1);
    });

    test('PreToolUse has Bash matcher for git push authority', () => {
      const bashMatchers = settings.hooks.PreToolUse.filter(
        (entry) => entry.matcher === 'Bash',
      );
      expect(bashMatchers.length).toBeGreaterThanOrEqual(1);

      const hasGitPush = bashMatchers.some((entry) =>
        entry.hooks.some((h) => h.command.includes('enforce-git-push-authority')),
      );
      expect(hasGitPush).toBe(true);
    });

    test('PreToolUse has Write|Edit matcher for secret scanning', () => {
      const writeMatchers = settings.hooks.PreToolUse.filter(
        (entry) => entry.matcher && entry.matcher.includes('Write'),
      );
      expect(writeMatchers.length).toBeGreaterThanOrEqual(1);

      const hasSecretScanning = writeMatchers.some((entry) =>
        entry.hooks.some((h) => h.command.includes('secret-scanning')),
      );
      expect(hasSecretScanning).toBe(true);
    });

    test('PreToolUse has SQL governance hook', () => {
      const allHookCommands = settings.hooks.PreToolUse.flatMap(
        (entry) => entry.hooks.map((h) => h.command),
      );
      const hasSqlGovernance = allHookCommands.some(
        (cmd) => cmd.includes('sql-governance'),
      );
      expect(hasSqlGovernance).toBe(true);
    });

    test('PreToolUse has delegation enforcement hook', () => {
      const allHookCommands = settings.hooks.PreToolUse.flatMap(
        (entry) => entry.hooks.map((h) => h.command),
      );
      const hasDelegation = allHookCommands.some(
        (cmd) => cmd.includes('enforce-delegation'),
      );
      expect(hasDelegation).toBe(true);
    });

    test('all registered hooks have timeout <= 10 seconds', () => {
      const allHooks = Object.values(settings.hooks).flat();
      for (const entry of allHooks) {
        const hooks = entry.hooks || [];
        for (const hook of hooks) {
          if (hook.timeout !== undefined) {
            expect(hook.timeout).toBeLessThanOrEqual(10);
          }
        }
      }
    });
  });

  describe('fail-open design verification', () => {
    const cjsHooks = hookFiles.filter((f) => f.endsWith('.cjs'));

    test.each(cjsHooks)('CJS hook %s uses process.exit(0) for fail-open', (hookFile) => {
      const content = fs.readFileSync(path.join(HOOKS_DIR, hookFile), 'utf8');
      // Hooks should have at least one process.exit(0) for the allow/fail-open path
      expect(content).toContain('process.exit(0)');
    });

    test.each(cjsHooks)('CJS hook %s uses process.exit(2) for block', (hookFile) => {
      const content = fs.readFileSync(path.join(HOOKS_DIR, hookFile), 'utf8');
      // Hooks that enforce rules should exit(2) to block
      // Wrappers may not have exit(2) -- that is acceptable
      // Some hooks are wrappers, observers, or warn-only -- they never block
      const WARN_ONLY_HOOKS = [
        'wrapper',       // synapse-wrapper, precompact-wrapper
        'precompact',    // precompact-session-digest
        'write-path-validation', // warn-only path checker
        'synapse-engine',        // context injection, never blocks
        'enforce-nsn-guard',     // NSN Mode guard — WARN only (stderr + exit 0)
        'telemetry',             // telemetry observers — fail-open, always exit 0, never block
        'code-intel',            // code-intel-pretool — injects additionalContext, ALLOW-only by design (hook-governance.md)
      ];
      const isWarnOnly = WARN_ONLY_HOOKS.some((kw) => hookFile.includes(kw));
      if (!isWarnOnly) {
        expect(content).toContain('process.exit(2)');
      }
    });
  });
});
