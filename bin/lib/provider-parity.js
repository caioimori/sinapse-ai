'use strict';

const {
  CANONICAL_AGENT_COUNT,
  GLOBAL_PROVIDER_SKILL_IDS,
  GLOBAL_SUPPLEMENTAL_PROVIDER_SKILL_IDS,
} = require('./provider-contract');

const REQUIRED_GLOBAL_PROVIDER_SKILL_IDS = Object.freeze([
  ...GLOBAL_PROVIDER_SKILL_IDS,
  ...GLOBAL_SUPPLEMENTAL_PROVIDER_SKILL_IDS,
]);

function normalizeCanonicalCatalog(canonicalCatalog, extension) {
  if (!canonicalCatalog || typeof canonicalCatalog === 'number') {
    throw new Error('Provider adapter parity requires the canonical agent ID catalog');
  }
  const entries = [...canonicalCatalog].map((entry) => (typeof entry === 'string'
    ? { id: entry.replace(/\.md$/, ''), file: entry }
    : entry));
  const sourceIds = entries.map((entry) => entry.id);
  const sourceSet = new Set(sourceIds);
  if (sourceSet.size !== sourceIds.length) {
    const duplicates = [...sourceSet]
      .filter((id) => sourceIds.filter((item) => item === id).length > 1);
    throw new Error(`Canonical agent catalog contains duplicate IDs: ${duplicates.join(', ')}`);
  }
  if (entries.length !== CANONICAL_AGENT_COUNT) {
    throw new Error(`Canonical agent catalog must contain exactly ${CANONICAL_AGENT_COUNT} unique IDs, found ${entries.length}`);
  }
  const files = entries.map((entry) => entry.file.replace(/\.md$/, extension));
  return { count: CANONICAL_AGENT_COUNT, files: new Set(files) };
}

function describeCatalogDivergence(provider, actualFiles, canonical) {
  const actual = new Set(actualFiles);
  const problems = [];
  if (actualFiles.length !== canonical.count) {
    problems.push(`${provider}: ${actualFiles.length}/${canonical.count}`);
  }
  if (canonical.files) {
    if (actual.size !== actualFiles.length) {
      const duplicates = [...actual].filter((file) => actualFiles.filter((item) => item === file).length > 1);
      problems.push(`${provider} duplicate: ${duplicates.join(', ')}`);
    }
    const missing = [...canonical.files].filter((file) => !actual.has(file));
    const orphaned = [...actual].filter((file) => !canonical.files.has(file));
    if (missing.length) problems.push(`${provider} missing: ${missing.join(', ')}`);
    if (orphaned.length) problems.push(`${provider} orphaned: ${orphaned.join(', ')}`);
  }
  return problems;
}

function assertProviderAdapterParity(llmChoice, adapters, canonicalCatalog) {
  if (!['claude-code', 'codex', 'both'].includes(llmChoice)) {
    throw new Error(`Invalid LLM choice for provider parity: ${llmChoice}`);
  }
  const problems = [];
  const claudeCatalog = normalizeCanonicalCatalog(canonicalCatalog, '.md');
  const codexCatalog = normalizeCanonicalCatalog(canonicalCatalog, '.toml');
  if (llmChoice === 'claude-code' || llmChoice === 'both') {
    problems.push(...describeCatalogDivergence('Claude Code', adapters.claude, claudeCatalog));
    const claudeSkills = new Set(adapters.claudeAvailableSkills || adapters.claudeSkills || []);
    const missingSkills = REQUIRED_GLOBAL_PROVIDER_SKILL_IDS.filter((skillId) => !claudeSkills.has(skillId));
    if (missingSkills.length) problems.push(`Claude Code global skills missing: ${missingSkills.join(', ')}`);
  }
  if (llmChoice === 'codex' || llmChoice === 'both') {
    problems.push(...describeCatalogDivergence('Codex', adapters.codex, codexCatalog));
    const codexSkills = new Set(adapters.availableSkills || adapters.skills || []);
    const missingSkills = REQUIRED_GLOBAL_PROVIDER_SKILL_IDS.filter((skillId) => !codexSkills.has(skillId));
    if (missingSkills.length) problems.push(`Codex global skills missing: ${missingSkills.join(', ')}`);
  }
  if (problems.length) {
    throw new Error(`Provider adapter parity failed (${problems.join('; ')})`);
  }
  return claudeCatalog.count;
}

module.exports = { assertProviderAdapterParity, REQUIRED_GLOBAL_PROVIDER_SKILL_IDS };
