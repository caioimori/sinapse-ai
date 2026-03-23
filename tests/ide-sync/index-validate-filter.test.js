'use strict';

const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const { commandValidate } = require('../../.sinapse-ai/infrastructure/scripts/ide-sync/index');
const { parseAllAgents } = require('../../.sinapse-ai/infrastructure/scripts/ide-sync/agent-parser');
const claudeTransformer = require('../../.sinapse-ai/infrastructure/scripts/ide-sync/transformers/claude-code');
const { syncGeminiCommands } = require('../../.sinapse-ai/infrastructure/scripts/ide-sync/gemini-commands');

describe('ide-sync commandValidate --ide filter', () => {
  let tmpRoot;
  let previousCwd;

  beforeEach(async () => {
    tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ide-sync-validate-filter-'));
    previousCwd = process.cwd();
    process.chdir(tmpRoot);

    await fs.ensureDir(path.join(tmpRoot, '.sinapse-ai'));
    await fs.writeFile(
      path.join(tmpRoot, '.sinapse-ai', 'core-config.yaml'),
      [
        'ideSync:',
        '  enabled: true',
        '  source: .sinapse-ai/development/agents',
        '  targets:',
        '    claude-code:',
        '      enabled: true',
        '      path: .claude/commands/SINAPSE/agents',
        '      format: full-markdown-yaml',
        '    gemini:',
        '      enabled: true',
        '      path: .gemini/rules/SINAPSE/agents',
        '      format: full-markdown-yaml',
        '  redirects: {}',
      ].join('\n'),
      'utf8',
    );

    await fs.copy(
      path.join(previousCwd, '.sinapse-ai', 'development', 'agents'),
      path.join(tmpRoot, '.sinapse-ai', 'development', 'agents'),
    );

    await fs.ensureDir(path.join(tmpRoot, '.gemini', 'rules', 'SINAPSE', 'agents'));
    const agents = parseAllAgents(path.join(tmpRoot, '.sinapse-ai', 'development', 'agents'));
    for (const agent of agents) {
      const content = claudeTransformer.transform(agent);
      await fs.writeFile(
        path.join(tmpRoot, '.gemini', 'rules', 'SINAPSE', 'agents', agent.filename),
        content,
        'utf8',
      );
    }
    syncGeminiCommands(agents, tmpRoot, { dryRun: false });
  });

  afterEach(async () => {
    process.chdir(previousCwd);
    await fs.remove(tmpRoot);
  });

  it('validates only requested IDE when --ide is provided', async () => {
    await expect(commandValidate({ ide: 'gemini', strict: true, verbose: false })).resolves.toBeUndefined();
  });
});
