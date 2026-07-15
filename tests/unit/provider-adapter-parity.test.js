'use strict';

const { assertProviderAdapterParity } = require('../../bin/lib/provider-parity');
const { GLOBAL_PROVIDER_SKILL_IDS } = require('../../bin/lib/provider-contract');

const canonical = () => Array.from({ length: 172 }, (_, index) => `agent-${index}.md`);
const claude = () => canonical();
const codex = () => canonical().map((file) => file.replace(/\.md$/, '.toml'));

describe('provider adapter parity', () => {
  test('returns the canonical count when both provider catalogs match', () => {
    expect(assertProviderAdapterParity('both', {
      claude: claude(),
      claudeAvailableSkills: GLOBAL_PROVIDER_SKILL_IDS,
      codex: codex(),
      availableSkills: GLOBAL_PROVIDER_SKILL_IDS,
    }, canonical())).toBe(172);
  });

  test('rejects divergent provider counts in both mode', () => {
    expect(() => assertProviderAdapterParity('both', {
      claude: claude(),
      claudeAvailableSkills: GLOBAL_PROVIDER_SKILL_IDS,
      codex: codex().slice(0, -1),
      availableSkills: GLOBAL_PROVIDER_SKILL_IDS,
    }, canonical())).toThrow('Provider adapter parity failed (Codex: 171/172');
  });

  test('validates only Claude Code in claude-code mode', () => {
    expect(assertProviderAdapterParity('claude-code', {
      claude: claude(),
      claudeAvailableSkills: GLOBAL_PROVIDER_SKILL_IDS,
      codex: [],
    }, canonical())).toBe(172);
  });

  test('validates only Codex in codex mode', () => {
    expect(assertProviderAdapterParity('codex', {
      claude: [],
      codex: codex(),
      availableSkills: GLOBAL_PROVIDER_SKILL_IDS,
    }, canonical())).toBe(172);
  });

  test('rejects an invalid LLM choice', () => {
    expect(() => assertProviderAdapterParity('unknown', {
      claude: [],
      codex: [],
    }, canonical())).toThrow('Invalid LLM choice for provider parity: unknown');
  });

  test('validates exact canonical identities and alias skills for both providers', () => {
    expect(assertProviderAdapterParity('both', {
      claude: claude(),
      claudeSkills: GLOBAL_PROVIDER_SKILL_IDS,
      codex: codex(),
      skills: GLOBAL_PROVIDER_SKILL_IDS,
    }, canonical())).toBe(172);
  });

  test('rejects a same-count missing and orphaned canonical adapter', () => {
    expect(() => assertProviderAdapterParity('codex', {
      claude: [],
      codex: [...codex().slice(0, -1), 'orphan.toml'],
      skills: GLOBAL_PROVIDER_SKILL_IDS,
    }, canonical())).toThrow('Codex missing: agent-171.toml; Codex orphaned: orphan.toml');
  });

  test('rejects duplicate canonical adapters', () => {
    expect(() => assertProviderAdapterParity('claude-code', {
      claude: [...claude().slice(0, -1), 'agent-0.md'],
      claudeAvailableSkills: GLOBAL_PROVIDER_SKILL_IDS,
      codex: [],
    }, canonical())).toThrow('Claude Code duplicate: agent-0.md');
  });

  test('rejects a missing alias skill separately from agent parity', () => {
    expect(() => assertProviderAdapterParity('claude-code', {
      claude: claude(),
      claudeSkills: GLOBAL_PROVIDER_SKILL_IDS.filter((id) => id !== 'snps-orqx'),
      codex: [],
    }, canonical())).toThrow('Claude Code alias skills missing: snps-orqx');
  });

  test('accepts preserved user-owned aliases reported as available but not written', () => {
    expect(assertProviderAdapterParity('codex', {
      claude: [],
      codex: codex(),
      skills: [],
      availableSkills: GLOBAL_PROVIDER_SKILL_IDS,
    }, canonical())).toBe(172);
  });

  test('rejects duplicate IDs in the canonical catalog before provider comparison', () => {
    const duplicateCatalog = canonical();
    duplicateCatalog[171] = duplicateCatalog[0];
    expect(() => assertProviderAdapterParity('codex', {
      claude: [],
      codex: codex(),
      availableSkills: GLOBAL_PROVIDER_SKILL_IDS,
    }, duplicateCatalog)).toThrow('Canonical agent catalog contains duplicate IDs: agent-0');
  });

  test('rejects any canonical total other than exactly 172', () => {
    expect(() => assertProviderAdapterParity('codex', {
      claude: [],
      codex: codex().slice(0, -1),
      availableSkills: GLOBAL_PROVIDER_SKILL_IDS,
    }, canonical().slice(0, -1))).toThrow('must contain exactly 172 unique IDs, found 171');
  });
});
