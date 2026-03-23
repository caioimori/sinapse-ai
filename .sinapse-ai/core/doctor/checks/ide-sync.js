/**
 * Doctor Check: IDE Sync
 *
 * Validates agents in .claude/commands/SINAPSE/agents/ match
 * .sinapse-ai/development/agents/ (count and names).
 *
 * @module sinapse-ai/doctor/checks/ide-sync
 * @story INS-4.1
 */

const path = require('path');
const fs = require('fs');

const name = 'ide-sync';

async function run(context) {
  const agentsSourceDir = path.join(context.projectRoot, '.sinapse-ai', 'development', 'agents');
  const agentsIdeDir = path.join(context.projectRoot, '.claude', 'commands', 'SINAPSE', 'agents');

  if (!fs.existsSync(agentsSourceDir)) {
    return {
      check: name,
      status: 'FAIL',
      message: 'Source agents directory not found',
      fixCommand: 'npx sinapse-ai install --force',
    };
  }

  if (!fs.existsSync(agentsIdeDir)) {
    return {
      check: name,
      status: 'WARN',
      message: 'IDE agents directory not found (.claude/commands/SINAPSE/agents/)',
      fixCommand: 'npx sinapse-ai install --force',
    };
  }

  let sourceAgents, ideFiles;
  try {
    sourceAgents = fs.readdirSync(agentsSourceDir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace('.md', ''));
  } catch (_err) {
    return {
      check: name,
      status: 'FAIL',
      message: 'Cannot read source agents directory',
      fixCommand: 'npx sinapse-ai install --force',
    };
  }

  try {
    ideFiles = fs.readdirSync(agentsIdeDir)
      .filter((f) => f.endsWith('.md'));
  } catch (_err) {
    return {
      check: name,
      status: 'WARN',
      message: 'Cannot read IDE agents directory',
      fixCommand: 'npx sinapse-ai install --force',
    };
  }

  const ideAgents = ideFiles.map((f) => f.replace('.md', ''));
  const sourceCount = sourceAgents.length;
  const ideCount = ideAgents.length;

  if (sourceCount === ideCount) {
    return {
      check: name,
      status: 'PASS',
      message: `${ideCount}/${sourceCount} agents synced`,
      fixCommand: null,
    };
  }

  return {
    check: name,
    status: 'WARN',
    message: `IDE has ${ideCount} agents, source has ${sourceCount}`,
    fixCommand: 'npx sinapse-ai install --force',
  };
}

module.exports = { name, run };
