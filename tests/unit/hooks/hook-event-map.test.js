/**
 * tests/unit/hooks/hook-event-map.test.js
 *
 * Validates that HOOK_EVENT_MAP in the installer contains the telemetry hooks
 * and that createClaudeSettingsLocal() would produce entries under the correct
 * Claude Code events: PostToolUse and Stop.
 *
 * Scenarios tested:
 *   A) HOOK_EVENT_MAP contains 'telemetry-post-tool.cjs' → PostToolUse, timeout 3
 *   B) HOOK_EVENT_MAP contains 'telemetry-stop.cjs' → Stop, timeout 5
 *   C) HOOKS_TO_COPY (copyClaudeHooksFolder source list) includes both files
 *   D) createClaudeSettingsLocal generates PostToolUse + Stop entries when hook
 *      files are present in the target directory
 */

'use strict';

const fs   = require('fs');
const os   = require('os');
const path = require('path');

// ---------------------------------------------------------------------------
// Module under test
// ---------------------------------------------------------------------------

const IDE_GEN_PATH = path.resolve(
  __dirname,
  '../../../packages/installer/src/wizard/ide-config-generator.js',
);

let HOOK_EVENT_MAP;
let createClaudeSettingsLocal;
let copyClaudeHooksFolder;

beforeAll(() => {
  jest.resetModules();
  const mod = require(IDE_GEN_PATH);
  HOOK_EVENT_MAP              = mod.HOOK_EVENT_MAP;
  createClaudeSettingsLocal   = mod.createClaudeSettingsLocal;
  copyClaudeHooksFolder       = mod.copyClaudeHooksFolder;
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('HOOK_EVENT_MAP (Frente 4.3 — STREAM A entries)', () => {

  // ── A) telemetry-post-tool.cjs ────────────────────────────────────────────
  // Note: toHaveProperty() splits on dots, so use direct bracket access for
  // keys that contain dots (like filenames ending in '.cjs').

  test('A: HOOK_EVENT_MAP has telemetry-post-tool.cjs → PostToolUse', () => {
    const entry = HOOK_EVENT_MAP['telemetry-post-tool.cjs'];
    expect(entry).toBeDefined();
    expect(entry.event).toBe('PostToolUse');
    expect(entry.matcher).toBeNull();
    expect(entry.timeout).toBe(3);
  });

  // ── B) telemetry-stop.cjs ─────────────────────────────────────────────────

  test('B: HOOK_EVENT_MAP has telemetry-stop.cjs → Stop', () => {
    const entry = HOOK_EVENT_MAP['telemetry-stop.cjs'];
    expect(entry).toBeDefined();
    expect(entry.event).toBe('Stop');
    expect(entry.matcher).toBeNull();
    expect(entry.timeout).toBe(5);
  });

  // ── C) Source hook files exist ────────────────────────────────────────────

  test('C: telemetry-post-tool.cjs exists in .claude/hooks/', () => {
    const p = path.resolve(__dirname, '../../../.claude/hooks/telemetry-post-tool.cjs');
    expect(fs.existsSync(p)).toBe(true);
  });

  test('C: telemetry-stop.cjs exists in .claude/hooks/', () => {
    const p = path.resolve(__dirname, '../../../.claude/hooks/telemetry-stop.cjs');
    expect(fs.existsSync(p)).toBe(true);
  });

  // ── D) createClaudeSettingsLocal produces PostToolUse + Stop entries ───────

  test('D: createClaudeSettingsLocal registers telemetry hooks under PostToolUse and Stop', async () => {
    // Set up a temp project dir with a .claude/hooks/ containing both files
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'snps-hook-map-'));

    try {
      const hooksDir = path.join(tmpDir, '.claude', 'hooks');
      fs.mkdirSync(hooksDir, { recursive: true });

      // Create stub hook files so createClaudeSettingsLocal finds them
      fs.writeFileSync(path.join(hooksDir, 'telemetry-post-tool.cjs'), '// stub', 'utf8');
      fs.writeFileSync(path.join(hooksDir, 'telemetry-stop.cjs'),      '// stub', 'utf8');

      const settingsPath = await createClaudeSettingsLocal(tmpDir);
      expect(settingsPath).toBeTruthy();

      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

      // PostToolUse must exist and contain telemetry-post-tool
      expect(settings.hooks).toHaveProperty('PostToolUse');
      const postToolEntries = settings.hooks['PostToolUse'];
      const hasPostTool = postToolEntries.some(entry =>
        Array.isArray(entry.hooks) &&
        entry.hooks.some(h => h.command && h.command.includes('telemetry-post-tool')),
      );
      expect(hasPostTool).toBe(true);

      // Stop must exist and contain telemetry-stop
      expect(settings.hooks).toHaveProperty('Stop');
      const stopEntries = settings.hooks['Stop'];
      const hasStop = stopEntries.some(entry =>
        Array.isArray(entry.hooks) &&
        entry.hooks.some(h => h.command && h.command.includes('telemetry-stop')),
      );
      expect(hasStop).toBe(true);

    } finally {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch { /* ignore */ }
    }
  });
});
