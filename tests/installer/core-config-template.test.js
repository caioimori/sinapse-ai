/**
 * Unit Tests for core-config-template
 *
 * Story ACT-12: Language removed from core-config (delegated to Claude Code settings.json)
 *
 * Test Coverage:
 * - generateCoreConfig no longer includes language field
 * - Config still includes user_profile and other fields
 * - YAML output parses correctly without language
 */

const yaml = require('js-yaml');
const { generateCoreConfig } = require('../../packages/installer/src/config/templates/core-config-template');

describe('core-config-template', () => {
  describe('ACT-12: language removed from core-config', () => {
    test('should NOT include language field in generated config', () => {
      const output = generateCoreConfig();
      const parsed = yaml.load(output);

      expect(parsed).not.toHaveProperty('language');
    });

    test('should ignore language option if passed (backward compat)', () => {
      const output = generateCoreConfig({ language: 'pt' });
      const parsed = yaml.load(output);

      // language param is no longer destructured, so it's just ignored
      expect(parsed).not.toHaveProperty('language');
    });

    test('should still include user_profile', () => {
      const output = generateCoreConfig({ userProfile: 'bob' });
      const parsed = yaml.load(output);

      expect(parsed.user_profile).toBe('bob');
    });

    test('should generate valid YAML without language', () => {
      const output = generateCoreConfig({
        projectType: 'BROWNFIELD',
        selectedIDEs: ['vscode', 'cursor'],
        userProfile: 'bob',
        sinapseVersion: '3.0.0',
      });
      const parsed = yaml.load(output);

      expect(parsed).toBeDefined();
      expect(typeof parsed).toBe('object');
      expect(parsed).not.toHaveProperty('language');
      expect(parsed.user_profile).toBe('bob');
      expect(parsed.project.type).toBe('BROWNFIELD');
      expect(parsed.ide.selected).toContain('vscode');
      expect(parsed.ide.selected).toContain('cursor');
    });
  });

  describe('onda2-p9: models registry section (AC2)', () => {
    test('includes a models section that parses as valid YAML', () => {
      const output = generateCoreConfig();
      const parsed = yaml.load(output);

      expect(parsed.models).toBeDefined();
      expect(parsed.models.active).toBe('claude-fable-5');
      expect(parsed.models.registry).toBeDefined();
    });

    test('active entry mirrors the framework core-config (1M window — never invented)', () => {
      const parsed = yaml.load(generateCoreConfig());
      const active = parsed.models.registry[parsed.models.active];

      expect(active).toBeDefined();
      expect(active.contextWindow).toBe(1000000);
      expect(active.avgTokensPerPrompt).toBe(2000);
    });

    test('ships a conservative fallback entry (200K, matching the source registry)', () => {
      const parsed = yaml.load(generateCoreConfig());
      const fallback = parsed.models.registry['claude-sonnet-5'];

      expect(fallback).toBeDefined();
      expect(fallback.contextWindow).toBe(200000);
      expect(fallback.avgTokensPerPrompt).toBe(1500);
    });

    test('carries the maintenance comment (raw output)', () => {
      const output = generateCoreConfig();
      // Comment block survives because the section is appended raw
      // (yaml.dump cannot emit comments).
      expect(output).toContain('# Context-tracker dynamic model registry');
      expect(output).toContain('keep in sync with the framework repo');
      expect(output).toContain('falls back to a conservative 200000-token window');
    });

    test('models values match the SOURCE core-config.yaml registry (anti-drift)', () => {
      const fs = require('fs');
      const path = require('path');
      const sourceConfig = yaml.load(
        fs.readFileSync(path.resolve(__dirname, '..', '..', '.sinapse-ai', 'core-config.yaml'), 'utf8'),
      );
      const installed = yaml.load(generateCoreConfig());

      // Every entry shipped in the installed template must exist in the source
      // registry with IDENTICAL values (the story forbids inventing windows).
      expect(sourceConfig.models).toBeDefined();
      for (const [id, entry] of Object.entries(installed.models.registry)) {
        expect(sourceConfig.models.registry[id]).toEqual(entry);
      }
      expect(sourceConfig.models.registry[installed.models.active]).toBeDefined();
    });
  });
});

