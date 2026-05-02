/**
 * Brand grounding hook — opt-in BYO.
 *
 * @story 10.47
 *
 * Reads the user's brandbook path from `~/.claude/sinapse-ai-config.yaml`
 * (`grounding.brand`). Returns a stub envelope when configured, `null`
 * otherwise. Concrete brandbook parser (positioning, MVV, tone-of-voice
 * extraction) lands in a follow-up.
 */

'use strict';

const configLoader = require('./config-loader.cjs');

function brandGroundingHook(_context = {}) {
  const section = configLoader.getSection('brand');
  if (!section || !section.enabled || !section.brandbookPath) return null;

  return {
    source: 'brand',
    profileName: section.profileName || '',
    brandbookPath: section.brandbookPath,
    note: 'Brand grounding configured. Concrete brandbook parser ships in a follow-up story.',
  };
}

module.exports = brandGroundingHook;
module.exports.brandGroundingHook = brandGroundingHook;
