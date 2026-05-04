// bin/lib/constants.js — paths, ANSI colors, platform flags.
// Story GA-1.2 — extracted from bin/cli.js (lines 21-36).

const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..', '..');
const VERSION = require(path.join(ROOT, 'package.json')).version;
const HOME = os.homedir();
const SINAPSE_HOME = path.join(HOME, '.sinapse');
const CLAUDE_COMMANDS_DIR = path.join(HOME, '.claude', 'commands', 'SINAPSE', 'agents');
const BIN_DIR = path.join(HOME, 'bin');
const IS_WIN = process.platform === 'win32';

const WHITE = '\x1b[38;2;255;255;255m';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const NC = '\x1b[0m';

module.exports = {
  ROOT,
  VERSION,
  HOME,
  SINAPSE_HOME,
  CLAUDE_COMMANDS_DIR,
  BIN_DIR,
  IS_WIN,
  WHITE,
  CYAN,
  GREEN,
  YELLOW,
  RED,
  BOLD,
  DIM,
  NC,
};
