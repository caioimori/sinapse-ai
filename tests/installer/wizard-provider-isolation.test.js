'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const { _testing } = require('../../packages/installer/src/wizard');

describe('wizard provider isolation', () => {
  test.each([
    ['claude-code', true, false],
    ['codex', false, true],
    ['both', true, true],
  ])('%s configures only its selected provider payloads', (selection, claude, codex) => {
    expect(_testing.shouldConfigureClaude(selection)).toBe(claude);
    expect(_testing.shouldConfigureCodex(selection)).toBe(codex);
  });

  test('Codex-only language setup does not create Claude settings', async () => {
    const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-wizard-provider-'));
    try {
      const written = await _testing.writeProviderLanguageSettings({
        selectedLLM: 'codex',
        language: 'pt',
        projectDir,
      });
      expect(written).toBe(false);
      expect(fs.existsSync(path.join(projectDir, '.claude', 'settings.json'))).toBe(false);
    } finally {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }
  });

  test('Claude language setup writes the selected provider settings', async () => {
    const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-wizard-provider-'));
    try {
      const written = await _testing.writeProviderLanguageSettings({
        selectedLLM: 'claude-code',
        language: 'pt',
        projectDir,
      });
      expect(written).toBe(true);
      expect(fs.existsSync(path.join(projectDir, '.claude', 'settings.json'))).toBe(true);
    } finally {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }
  });
});
