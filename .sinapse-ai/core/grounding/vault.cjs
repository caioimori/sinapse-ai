/**
 * Vault grounding hook — opt-in BYO.
 *
 * @story 10.47
 *
 * Reads the user's vault path from `~/.claude/sinapse-ai-config.yaml`
 * (`grounding.vault`) and is the entry point for future context injection
 * from a markdown notes vault.
 *
 * Today this hook is a **structural no-op**: when the section is enabled
 * it returns a stub envelope describing the available vault path so
 * downstream tooling can detect the integration point. When disabled or
 * missing config, returns `null` silently. The concrete vault parser and
 * relevance scorer land in a follow-up story.
 */

'use strict';

// Use module reference (not destructuring) so tests can stub
// configLoader.getSection at runtime via jest mocks.
const configLoader = require('./config-loader.cjs');

function vaultGroundingHook(_context = {}) {
  const section = configLoader.getSection('vault');
  if (!section || !section.enabled || !section.path) return null;

  return {
    source: 'vault',
    path: section.path,
    domains: Array.isArray(section.domains) ? section.domains : [],
    note: 'Vault grounding configured. Concrete content injection ships in a follow-up story.',
  };
}

module.exports = vaultGroundingHook;
module.exports.vaultGroundingHook = vaultGroundingHook;
