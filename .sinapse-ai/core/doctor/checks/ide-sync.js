/**
 * Doctor Check: IDE Sync
 *
 * Validates that the IDE-side agents directory mirrors the framework's
 * full expected set, not just the framework-core agents.
 *
 * Audit 1 P1 (DOC-1): the previous version compared only
 * `.sinapse-ai/development/agents/` (12 framework agents) against the
 * IDE dir. Result: `12/12 ✓` was reported as PASS even when ~188 squad
 * orqx files were missing — false positive. The IDE dir actually
 * receives every agent the installer copies (framework + squad orqx +
 * any other commands published by Phase 2 of `cmdInstallGlobal`).
 *
 * @module sinapse-ai/doctor/checks/ide-sync
 * @story INS-4.1, Audit 1 P1
 */

const path = require('path');
const fs = require('fs');

const name = 'ide-sync';

function listMd(dir) {
  if (!fs.existsSync(dir)) return [];
  try {
    return fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }
}

function listOrqxFiles(squadsRoot) {
  // Walk every squads/SQUAD/agents/*-orqx.md
  const out = [];
  if (!fs.existsSync(squadsRoot)) return out;
  let squadDirs = [];
  try {
    squadDirs = fs.readdirSync(squadsRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  } catch { return out; }

  for (const squadName of squadDirs) {
    const agentsDir = path.join(squadsRoot, squadName, 'agents');
    for (const f of listMd(agentsDir)) {
      if (f.endsWith('-orqx.md')) out.push(f);
    }
  }
  return out;
}

async function run(context) {
  const projectRoot = context.projectRoot;
  const agentsSourceDir = path.join(projectRoot, '.sinapse-ai', 'development', 'agents');
  const agentsIdeDir = path.join(projectRoot, '.claude', 'commands', 'SINAPSE', 'agents');
  const squadsRoot = path.join(projectRoot, 'squads');

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

  const frameworkAgents = listMd(agentsSourceDir);
  const orqxAgents = listOrqxFiles(squadsRoot);
  const ideFiles = listMd(agentsIdeDir);

  // Expected = framework agents + every squad orqx file.
  // (Specialist agents inside squads ride into the IDE through the
  // skills registry / subagent stubs, not through this dir, so they are
  // intentionally out of scope for this check.)
  const expectedCount = frameworkAgents.length + orqxAgents.length;
  const ideCount = ideFiles.length;

  if (ideCount === 0) {
    return {
      check: name,
      status: 'FAIL',
      message: `IDE dir empty (expected ~${expectedCount} agents)`,
      fixCommand: 'npx sinapse-ai install --force',
    };
  }

  // Allow IDE to carry slightly more than expected (skills/plugin extras),
  // but flag if it carries fewer than the framework + orqx baseline.
  if (ideCount < expectedCount) {
    return {
      check: name,
      status: 'WARN',
      message: `IDE has ${ideCount} agents, expected ≥ ${expectedCount} (${frameworkAgents.length} framework + ${orqxAgents.length} orqx)`,
      fixCommand: 'npx sinapse-ai install --force',
    };
  }

  return {
    check: name,
    status: 'PASS',
    message: `${ideCount} agents synced (expected ≥ ${expectedCount})`,
    fixCommand: null,
  };
}

// Story A.3: IDE sync mirrors agents; exceptions indicate broken install state.
const onError = 'fail';

module.exports = { name, run, onError };

