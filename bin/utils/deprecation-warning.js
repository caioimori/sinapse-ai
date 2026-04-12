/**
 * Deprecation Warning Helper
 *
 * Emits a single deprecation notice on stderr when a legacy binary is invoked.
 * Written to stderr (not stdout) to avoid polluting pipes or scripts that
 * capture the functional output of the canonical commands.
 *
 * The warning NEVER blocks execution, NEVER changes exit code, and is
 * emitted exactly ONCE per process invocation (idempotent).
 *
 * See Story 10.13 AC 9 for the exact format contract.
 */

'use strict';

let emitted = false;

/**
 * Emit a deprecation warning for a legacy binary.
 *
 * @param {string} binaryName - The legacy binary name (e.g. 'sinapse', 'sinapse-minimal', 'sinapse-graph').
 * @param {string} [subcmd]   - The subcommand that was invoked (e.g. 'install', 'update'). If omitted or
 *                              unknown, the warning points users at `npx sinapse-ai --help`.
 */
function emitDeprecationWarning(binaryName, subcmd) {
  if (emitted) return;
  emitted = true;

  const knownSubcmds = new Set(['install', 'update', 'uninstall']);
  const replacement =
    subcmd && knownSubcmds.has(subcmd)
      ? `npx sinapse-ai ${subcmd}`
      : 'npx sinapse-ai --help';

  // ANSI yellow for the [DEPRECATED] tag (matches the project convention in bin/cli.js).
  const tag = '\x1b[33m[DEPRECATED]\x1b[0m';
  const msg =
    `${tag} The \`${binaryName}\` binary is deprecated. ` +
    `Use \`${replacement}\` instead. ` +
    'This alias will be removed in the next major version (v11).\n';

  // Writing directly to stderr keeps stdout clean for piping/scripting.
  process.stderr.write(msg);
}

module.exports = { emitDeprecationWarning };
