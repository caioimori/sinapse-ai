/**
 * Story 10.33 — Install non-TTY handling
 *
 * Regression tests ensuring that fresh `npx sinapse-ai install` succeeds when
 * stdin is not a TTY (CI, Docker, scripts, AI agents).
 *
 * Coverage:
 * - promptLlmChoice() returns 'claude-code' default without prompting
 * - promptFileExists() returns computed defaultChoice without prompting
 */

const path = require('path');
const os = require('os');
const fs = require('fs');
const fse = require('fs-extra');

const { promptLlmChoice } = require('../../bin/cli');
const { promptFileExists } = require('../../packages/installer/src/wizard/ide-config-generator');

describe('Story 10.33 — Install non-TTY handling', () => {
  let originalIsTTY;

  beforeEach(() => {
    originalIsTTY = process.stdin.isTTY;
  });

  afterEach(() => {
    if (typeof originalIsTTY === 'undefined') {
      delete process.stdin.isTTY;
    } else {
      process.stdin.isTTY = originalIsTTY;
    }
  });

  describe('promptLlmChoice()', () => {
    test('returns claude-code default when stdin.isTTY is false', async () => {
      process.stdin.isTTY = false;

      const result = await promptLlmChoice();

      expect(result).toBe('claude-code');
    });

    test('returns claude-code default when stdin.isTTY is undefined', async () => {
      delete process.stdin.isTTY;

      const result = await promptLlmChoice();

      expect(result).toBe('claude-code');
    });

    test('does not throw ERR_USE_AFTER_CLOSE in non-TTY mode', async () => {
      process.stdin.isTTY = false;

      await expect(promptLlmChoice()).resolves.toBeDefined();
    });
  });

  describe('promptFileExists()', () => {
    let tempFile;

    beforeEach(async () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-test-non-tty-'));
      tempFile = path.join(tempDir, 'CLAUDE.md');
      await fse.writeFile(tempFile, '# existing content\n');
    });

    afterEach(async () => {
      if (tempFile) {
        await fse.remove(path.dirname(tempFile));
      }
    });

    test('Story 10.38: always returns merge for CLAUDE.md regardless of projectType', async () => {
      // Greenfield
      let result = await promptFileExists(tempFile, { projectType: 'GREENFIELD' });
      expect(result).toBe('merge');

      // Brownfield
      result = await promptFileExists(tempFile, { projectType: 'BROWNFIELD' });
      expect(result).toBe('merge');

      // Existing SINAPSE install
      result = await promptFileExists(tempFile, { projectType: 'EXISTING_SINAPSE' });
      expect(result).toBe('merge');
    });

    test('Story 10.38: ignores forceMerge/noMerge flags (merge is unconditional)', async () => {
      let result = await promptFileExists(tempFile, { forceMerge: true });
      expect(result).toBe('merge');

      result = await promptFileExists(tempFile, { noMerge: true });
      expect(result).toBe('merge');
    });

    test('Story 10.38: does not prompt user (works in non-TTY)', async () => {
      process.stdin.isTTY = false;
      const result = await promptFileExists(tempFile, { projectType: 'BROWNFIELD' });
      expect(result).toBe('merge');
    });

    test('Story 10.38: falls back to backup for file types without merge strategy', async () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-test-nomerge-'));
      const unknownFile = path.join(tempDir, 'config.unknown');
      await fse.writeFile(unknownFile, 'stuff');

      const result = await promptFileExists(unknownFile, { projectType: 'GREENFIELD' });
      expect(result).toBe('backup');

      await fse.remove(tempDir);
    });
  });
});
