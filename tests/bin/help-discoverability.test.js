/**
 * help-discoverability.test.js
 *
 * Regression guard: every command the CLI dispatcher handles MUST be listed in
 * `sinapse --help`. Added after an audit found 11 real commands (performance,
 * routing-intel, create, mode, orchestrate, graph, mcp, generate, health, pro,
 * uninstall) that worked but were invisible in help — undiscoverable for users.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BIN = path.resolve(__dirname, '../../bin/sinapse.js');

// Flag aliases handled as `case` labels but that are not user-facing commands.
const FLAG_ALIASES = new Set(['--help', '--version', '-h', '-v']);

function dispatchedCommands() {
  const src = fs.readFileSync(BIN, 'utf8');
  const cmds = new Set();
  for (const m of src.matchAll(/case '([a-z][a-z-]*|--?[a-z-]+)':/g)) {
    if (!FLAG_ALIASES.has(m[1])) cmds.add(m[1]);
  }
  return [...cmds];
}

describe('CLI help discoverability', () => {
  let helpText;

  beforeAll(() => {
    helpText = execFileSync('node', [BIN, '--help'], { encoding: 'utf8' });
  });

  it('renders help without crashing', () => {
    expect(helpText).toContain('USAGE:');
  });

  it('lists every dispatched command in --help', () => {
    const missing = dispatchedCommands().filter(
      (cmd) => !new RegExp(`sinapse ${cmd}\\b`).test(helpText),
    );
    expect(missing).toEqual([]);
  });
});
