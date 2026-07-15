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
    const legacyClaudeAgent = path.join(
      targetDir,
      '.claude',
      'commands',
      'SINAPSE',
      'agents',
      'developer.md',
    );
    if (includeClaude) {
      await fs.ensureDir(path.dirname(legacyClaudeAgent));
      await fs.writeFile(
        legacyClaudeAgent,
        '# legacy duplicate\n\n<!-- SINAPSE-MANAGED:claude-command -->\n',
        'utf8',
      );
      await fs.writeFile(
        path.join(path.dirname(legacyClaudeAgent), 'user-custom.md'),
        '# user custom command\n',
        'utf8',
      );
      await fs.ensureDir(path.join(targetDir, '.claude'));
      await fs.writeJson(path.join(targetDir, '.claude', 'settings.local.json'), {
        language: 'Portuguese',
        hooks: {
          Stop: [{ hooks: [{ type: 'command', command: 'node custom-hook.cjs' }] }],
        },
      });
      await fs.writeJson(path.join(targetDir, '.claude', 'settings.json'), {
        hooks: {
          PreToolUse: [{
            hooks: [{
              type: 'command',
              command: 'node "$CLAUDE_PROJECT_DIR/.claude/hooks/doc-first-gate.cjs"',
            }],
          }],
        },
      });
    }
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
        expect(installed.claudeLegacyAgentCommandReconciliation).toMatchObject({
          removed: 1,
          preserved: 1,
        });
        expect(await fs.pathExists(legacyClaudeAgent)).toBe(false);
        expect(await fs.pathExists(
          path.join(path.dirname(legacyClaudeAgent), 'user-custom.md'),
        )).toBe(true);
        expect(installed.claudeNativeAgentFiles).toBe(172);
        expect(installed.claudeNativeSkillFiles).toBe(36);
        const settings = await fs.readJson(path.join(targetDir, '.claude', 'settings.local.json'));
        expect(settings.language).toBe('Portuguese');
        expect(JSON.stringify(settings)).toContain('custom-hook.cjs');
        expect(JSON.stringify(settings)).not.toContain('doc-first-gate.cjs');
        const combinedSettings = [
          await fs.readJson(path.join(targetDir, '.claude', 'settings.json')),
          settings,
        ];
        const docFirstRegistrations = JSON.stringify(combinedSettings).match(/doc-first-gate\.cjs/g) || [];
        expect(docFirstRegistrations).toHaveLength(1);
        expect(validateClaudeNative(targetDir).ok).toBe(true);
        await fs.remove(path.join(targetDir, '.claude', 'hooks', 'doc-first-gate.cjs'));
        expect(validateClaudeNative(targetDir).errors).toContain(
          'Missing Claude governance hook: .claude/hooks/doc-first-gate.cjs',
        );
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
