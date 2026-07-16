'use strict';

/**
 * Story 10.35 — Install --reconfigure flag
 *
 * Verifies that --reconfigure forces language/LLM prompts in upsert mode
 * without wiping existing install artifacts.
 */

const { resolveLlmChoice } = require('../../bin/commands/install');
const { promptLlmChoice } = require('../../bin/lib/prompts');

describe('Story 10.35 — Install --reconfigure flag', () => {
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

  describe('skip logic — language selection', () => {
    /**
     * Mirrors the condition at bin/cli.js (Story 10.35):
     *   let language = (isUpsert && !reconfigure && existing.language) ? existing.language : null;
     */
    function resolveLanguage({ isUpsert, reconfigure, existingLanguage }) {
      return (isUpsert && !reconfigure && existingLanguage) ? existingLanguage : null;
    }

    test('upsert without reconfigure — uses existing language (fast path)', () => {
      const result = resolveLanguage({ isUpsert: true, reconfigure: false, existingLanguage: 'pt' });
      expect(result).toBe('pt');
    });

    test('upsert WITH reconfigure — returns null (forces prompt)', () => {
      const result = resolveLanguage({ isUpsert: true, reconfigure: true, existingLanguage: 'pt' });
      expect(result).toBeNull();
    });

    test('fresh install (no upsert) — returns null regardless of reconfigure', () => {
      const withoutReconfigure = resolveLanguage({ isUpsert: false, reconfigure: false, existingLanguage: null });
      const withReconfigure = resolveLanguage({ isUpsert: false, reconfigure: true, existingLanguage: null });
      expect(withoutReconfigure).toBeNull();
      expect(withReconfigure).toBeNull();
    });

    test('upsert with reconfigure but no existing language — returns null', () => {
      const result = resolveLanguage({ isUpsert: true, reconfigure: true, existingLanguage: null });
      expect(result).toBeNull();
    });
  });

  describe('skip logic — LLM selection', () => {
    test('an explicit provider flag wins over saved configuration', async () => {
      const prompt = jest.fn();
      await expect(resolveLlmChoice({
        requestedLlm: 'codex',
        isUpsert: true,
        existingLlm: 'claude-code',
        prompt,
      })).resolves.toBe('codex');
      expect(prompt).not.toHaveBeenCalled();
    });

    test('upsert without reconfigure preserves the saved provider without prompting', async () => {
      const prompt = jest.fn();
      await expect(resolveLlmChoice({
        isUpsert: true,
        existingLlm: 'claude-code',
        prompt,
      })).resolves.toBe('claude-code');
      expect(prompt).not.toHaveBeenCalled();
    });

    test('reconfigure opens the production prompt even with a saved provider', async () => {
      const prompt = jest.fn().mockResolvedValue('codex');
      await expect(resolveLlmChoice({
        isUpsert: true,
        reconfigure: true,
        existingLlm: 'claude-code',
        prompt,
      })).resolves.toBe('codex');
      expect(prompt).toHaveBeenCalledTimes(1);
    });

    test('fresh and legacy-unconfigured installs default to both without prompting', async () => {
      const prompt = jest.fn();
      await expect(resolveLlmChoice({ prompt })).resolves.toBe('both');
      await expect(resolveLlmChoice({ isUpsert: true, prompt })).resolves.toBe('both');
      expect(prompt).not.toHaveBeenCalled();
    });
  });

  describe('non-TTY guard still applies in reconfigure mode', () => {
    test('promptLlmChoice returns both default in non-TTY even when reconfigure is intended', async () => {
      process.stdin.isTTY = false;
      // reconfigure flag forces the call to promptLlmChoice() — but TTY guard inside still returns default
      const result = await promptLlmChoice();
      expect(result).toBe('both');
    });

    test('promptLlmChoice returns both default when isTTY is undefined', async () => {
      delete process.stdin.isTTY;
      const result = await promptLlmChoice();
      expect(result).toBe('both');
    });
  });
});
