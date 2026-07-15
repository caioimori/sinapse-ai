'use strict';

const childProcess = require('child_process');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const { installSinapseCore } = require('../../packages/installer/src/installer/sinapse-ai-installer');
const { syncCodexLocalFirst } = require('../../.sinapse-ai/infrastructure/scripts/sync-codex-local-first');
const { syncCodexNativeAgents } = require('../../.codex/scripts/sync-codex-native');
const { validateNativeCodex } = require('../../.codex/scripts/validate-codex-native');
const { validateClaudeNative } = require('../../scripts/validate-provider-adapters');

describe('dual CLI clean-install matrix', () => {
  jest.setTimeout(180000);
  const cases = [
    ['claude-code', true, false],
    ['codex', false, true],
    ['both', true, true],
  ];

  test.each(cases)('%s installs only its selected native surfaces', async (_mode, includeClaude, includeCodex) => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'sinapse-dual-cli-'));
    const targetDir = path.join(tempRoot, 'project');
    await fs.ensureDir(targetDir);
    const execSpy = jest.spyOn(childProcess, 'exec').mockImplementation(
      (_command, _options, callback) => {
        callback(null, '', '');
        return { kill: jest.fn() };
      },
    );
    try {
      const installed = await installSinapseCore({ targetDir, includeClaude, includeCodex });
      expect(installed.success).toBe(true);
      expect(await fs.pathExists(path.join(targetDir, '.claude', 'agents'))).toBe(includeClaude);
      expect(await fs.pathExists(path.join(targetDir, '.claude', 'skills'))).toBe(includeClaude);
      expect(await fs.pathExists(path.join(targetDir, '.codex', 'agents'))).toBe(includeCodex);
      expect(await fs.pathExists(path.join(targetDir, '.agents', 'skills'))).toBe(includeCodex);

      if (includeClaude) {
        expect(installed.claudeNativeAgentFiles).toBe(172);
        expect(installed.claudeNativeSkillFiles).toBe(36);
        expect(validateClaudeNative(targetDir).ok).toBe(true);
      }
      if (includeCodex) {
        expect(syncCodexLocalFirst({ projectRoot: targetDir, quiet: true }).ok).toBe(true);
        syncCodexNativeAgents(targetDir);
        expect(validateNativeCodex(targetDir).ok).toBe(true);
      }
    } finally {
      execSpy.mockRestore();
      await fs.remove(tempRoot);
    }
  });
});
