'use strict';

const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const { detectInstalledProviders } = require('../../packages/installer/src/updater');

describe('updater provider detection', () => {
  let root;

  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'sinapse-updater-provider-'));
  });

  afterEach(async () => fs.remove(root));

  test('detects a legacy Codex-only installation for migration', async () => {
    await fs.outputJson(path.join(root, '.codex', 'catalog.json'), {});
    await fs.outputFile(
      path.join(root, '.codex', 'skills', 'sinapse-agent', 'SKILL.md'),
      '# legacy activator\n',
    );

    expect(detectInstalledProviders(root)).toEqual({
      includeClaude: false,
      includeCodex: true,
    });
  });

  test('prefers the recorded provider contract when present', () => {
    expect(detectInstalledProviders(root, ['claude-code'])).toEqual({
      includeClaude: true,
      includeCodex: false,
    });
  });
});
