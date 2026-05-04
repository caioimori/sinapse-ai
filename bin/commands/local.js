// bin/commands/local.js — `install --local` and `update --local` commands.
// Story GA-1.2 — extracted from bin/cli.js.

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { getLogger } = require('../../.sinapse-ai/core/logger');
const { ROOT, CYAN, RED, NC } = require('../lib/constants');
const { header } = require('../lib/header');

function runBash(script) {
  const logger = getLogger();
  const scriptPath = path.join(ROOT, script);
  if (!fs.existsSync(scriptPath)) {
    logger.error(`${RED}Script not found: ${script}${NC}`);
    process.exit(1);
  }

  let scriptContent = fs.readFileSync(scriptPath, 'utf8').replace(/\r\n/g, '\n');
  let rootForBash = ROOT.replace(/\\/g, '/');

  try {
    const bashCheck = execSync('bash -c "echo $OSTYPE"', { encoding: 'utf8' }).trim();
    if (!bashCheck.includes('msys')) {
      rootForBash = rootForBash.replace(/^([A-Za-z]):/, (_, l) => '/mnt/' + l.toLowerCase());
    }
  } catch {
    rootForBash = rootForBash.replace(/^([A-Za-z]):/, (_, l) => '/mnt/' + l.toLowerCase());
  }

  const injection = `export SCRIPT_DIR="${rootForBash}"\n`;
  if (scriptContent.startsWith('#!/')) {
    const nl = scriptContent.indexOf('\n');
    scriptContent = scriptContent.slice(0, nl + 1) + injection + scriptContent.slice(nl + 1);
  } else {
    scriptContent = injection + scriptContent;
  }

  const child = spawn('bash', ['-s'], { cwd: process.cwd(), stdio: ['pipe', 'inherit', 'inherit'] });
  child.stdin.write(scriptContent);
  child.stdin.end();
  child.on('close', (code) => process.exit(code || 0));
}

function cmdInstallLocal() {
  const logger = getLogger();
  header();
  logger.always(`${CYAN}▸ Installing squads in current project...${NC}\n`);
  runBash('scripts/install-squads.sh');
}

function cmdUpdateLocal() {
  const logger = getLogger();
  header();
  logger.always(`${CYAN}▸ Updating squads in current project...${NC}\n`);
  runBash('scripts/update-squads.sh');
}

module.exports = {
  cmdInstallLocal,
  cmdUpdateLocal,
  runBash,
};
