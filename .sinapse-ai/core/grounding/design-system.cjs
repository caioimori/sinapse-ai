/**
 * Design system grounding hook — opt-in BYO.
 *
 * @story 10.47
 *
 * Reads the user's design-system root from
 * `~/.claude/sinapse-ai-config.yaml` (`grounding.designSystem`). Returns a
 * stub envelope when configured, `null` otherwise. The concrete DS resolver
 * (token lookup, component registry, brandbook diff) lands in a follow-up.
 */

'use strict';

const configLoader = require('./config-loader.cjs');

function designSystemGroundingHook(_context = {}) {
  const section = configLoader.getSection('designSystem');
  if (!section || !section.enabled || !section.rootPath) return null;

  return {
    source: 'designSystem',
    profileName: section.profileName || '',
    rootPath: section.rootPath,
    note: 'Design system grounding configured. Concrete DS resolver ships in a follow-up story.',
  };
}

module.exports = designSystemGroundingHook;
module.exports.designSystemGroundingHook = designSystemGroundingHook;
