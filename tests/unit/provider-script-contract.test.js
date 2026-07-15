'use strict';

const fs = require('fs');
const path = require('path');
const pkg = require('package.json');

describe('provider validation script contract', () => {
  test('public gates validate native surfaces instead of retired mirrors', () => {
    for (const name of [
      'validate:claude-integration',
      'validate:claude-sync',
      'validate:codex-sync',
      'validate:codex-skills',
      'validate:parity',
      'validate:parity:fast',
    ]) {
      expect(pkg.scripts[name]).not.toMatch(/validate-claude-integration|validate-codex-sync|codex-skills-sync\/validate|validate-parity\.js/);
    }
    expect(pkg.scripts['validate:parity']).toContain('validate-provider-adapters.js');
    expect(pkg.scripts['validate:parity']).toContain('.codex/scripts/validate-codex-native.js');
    expect(pkg.scripts['validate:codex-sync']).toContain('validate-codex-native.js');
    expect(pkg.scripts['sync:skills:codex']).toContain('.codex/scripts/sync-codex-native.js');
    expect(pkg.scripts['sync:skills:codex:global']).toContain('--llm=codex --global-only');
    expect(pkg.scripts['sync:skills:codex:global']).not.toContain('codex-skills-sync');
  });

  test('install matrix derives the Codex skill count from the candidate payload', () => {
    const script = fs.readFileSync(path.join(
      __dirname,
      '..',
      '..',
      '.github',
      'workflows',
      'install-matrix',
      'run-provider-mode.js',
    ), 'utf8');

    expect(script).toContain("path.join(packageRoot, '.agents', 'skills')");
    expect(script).not.toMatch(/expectedCodexSkills\s*=\s*includeCodex\s*\?\s*\d+/);
  });
});
