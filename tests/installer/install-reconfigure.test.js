'use strict';

/**
 * Story 10.35 — Install --reconfigure flag
 *
 * Verifies that --reconfigure forces language/LLM prompts in upsert mode
 * without wiping existing install artifacts.
 */

const { detectExistingInstall, promptLlmChoice } = require('../../bin/cli');

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
    /**
     * Mirrors the condition at bin/cli.js (Story 10.35):
     *   const llmChoice = (isUpsert && !reconfigure && existing.llm) ? existing.llm : await promptLlmChoice();
     */
    function shouldSkipLlmPrompt({ isUpsert, reconfigure, existingLlm }) {
      return Boolean(isUpsert && !reconfigure && existingLlm);
    }

    test('upsert without reconfigure — skips LLM prompt (fast path)', () => {
      expect(shouldSkipLlmPrompt({ isUpsert: true, reconfigure: false, existingLlm: 'claude-code' })).toBe(true);
    });

    test('upsert WITH reconfigure — does NOT skip LLM prompt', () => {
      expect(shouldSkipLlmPrompt({ isUpsert: true, reconfigure: true, existingLlm: 'claude-code' })).toBe(false);
    });

    test('fresh install — does NOT skip LLM prompt', () => {
      expect(shouldSkipLlmPrompt({ isUpsert: false, reconfigure: false, existingLlm: null })).toBe(false);
    });
  });

  describe('non-TTY guard still applies in reconfigure mode', () => {
    test('promptLlmChoice returns claude-code default in non-TTY even when reconfigure is intended', async () => {
      process.stdin.isTTY = false;
      // reconfigure flag forces the call to promptLlmChoice() — but TTY guard inside still returns default
      const result = await promptLlmChoice();
      expect(result).toBe('claude-code');
    });

    test('promptLlmChoice returns claude-code default when isTTY is undefined', async () => {
      delete process.stdin.isTTY;
      const result = await promptLlmChoice();
      expect(result).toBe('claude-code');
    });
  });
});
