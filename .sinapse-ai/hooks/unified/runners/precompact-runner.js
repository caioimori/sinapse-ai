/**
 * PreCompact Hook Runner - Session Digest Trigger
 *
 * Captures session knowledge before context compact via PreCompact hook.
 *
 * Note: This hook is currently a no-op. Session digest extraction logic
 * was previously gated behind a PRO tier (deprecated in 2026-05-06 audit).
 * The hook registration is preserved so a future implementation can
 * plug in without changing the hook contract.
 *
 * @module .sinapse-ai/hooks/unified/runners/precompact-runner
 * @see Story MIS-3 - Session Digest (PreCompact Hook)
 */

'use strict';

/**
 * PreCompact hook handler - currently a no-op.
 *
 * Returns immediately without performing any work. NEVER blocks the
 * compact operation. A future session-digest implementation can add
 * fire-and-forget logic here.
 *
 * @param {Object} _context - Hook context from Claude Code (unused)
 * @returns {Promise<void>}
 */
async function onPreCompact(_context) {
  // No-op: session digest extraction not implemented in this build.
  // Hook is preserved for forward compatibility with the PreCompact event.
  return;
}

/**
 * Get hook configuration for registration
 *
 * @returns {Object} Hook configuration metadata
 */
function getHookConfig() {
  return {
    name: 'precompact-session-digest',
    event: 'PreCompact',
    handler: onPreCompact,
    timeout: 5000,
    description: 'Capture session knowledge before context compact (MIS-3) — no-op',
  };
}

module.exports = {
  onPreCompact,
  getHookConfig,
};
