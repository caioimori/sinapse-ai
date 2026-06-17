#!/usr/bin/env node
'use strict';

/**
 * Parametric Codex agent/task activator (decision D7 — pointer-based, no copy).
 *
 * Given any `@agent` or `/command`, this resolver:
 *   1. Finds the agent pointer in `.codex/agents/{id}.md`
 *   2. Reads the pointer's source-of-truth path (squad or dev agent definition)
 *   3. Discovers that agent's real tasks by intersecting the task slugs declared
 *      in the source agent file with the task files that ACTUALLY EXIST on disk
 *      (`squads/{squad}/tasks/*.md` or `.sinapse-ai/development/tasks/*.md`).
 *
 * Every task pointer it emits is verified to exist — it never emits a broken
 * pointer. Works for ALL ~172 agents, not just the 6 hardcoded SDC agents in
 * command-registry.json.
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

const DEV_AGENTS_DIR = '.sinapse-ai/development/agents';
const DEV_TASKS_DIR = '.sinapse-ai/development/tasks';
const CODEX_AGENTS_DIR = '.codex/agents';
const SQUADS_DIR = 'squads';

function normalizeAgentInput(value) {
  return String(value || '').trim().replace(/^@/, '').toLowerCase();
}

function normalizeCommandInput(value) {
  return String(value || '').trim().replace(/^[*/]/, '').toLowerCase();
}

function fileExists(projectRoot, relPath) {
  try {
    return fs.statSync(path.join(projectRoot, relPath)).isFile();
  } catch {
    return false;
  }
}

function readFileSafe(projectRoot, relPath) {
  try {
    return fs.readFileSync(path.join(projectRoot, relPath), 'utf8');
  } catch {
    return null;
  }
}

/**
 * Build a lookup of every codex agent pointer → { id, sourcePath, squad }.
 * The codex agent .md is a thin pointer: it contains a line
 *   "Read the agent definition at: {path}"
 * and optionally "Squad: {squad}".
 */
function loadCodexAgentIndex(projectRoot = PROJECT_ROOT) {
  const dir = path.join(projectRoot, CODEX_AGENTS_DIR);
  let entries = [];
  try {
    entries = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  } catch {
    return {};
  }

  const index = {};
  for (const file of entries) {
    const id = file.replace(/\.md$/, '');
    const raw = readFileSafe(projectRoot, `${CODEX_AGENTS_DIR}/${file}`) || '';

    const sourceMatch = raw.match(/Read the agent definition at:\s*(\S+)/i);
    const squadMatch = raw.match(/Squad:\s*(\S+)/i);
    const activateMatch = raw.match(/Activate agent:\s*(\S+)/i);

    let sourcePath = sourceMatch ? sourceMatch[1].trim() : null;
    let squad = squadMatch ? squadMatch[1].trim() : null;

    // Dev/core agents: pointer references the dev agents dir directly.
    if (!sourcePath && fileExists(projectRoot, `${DEV_AGENTS_DIR}/${id}.md`)) {
      sourcePath = `${DEV_AGENTS_DIR}/${id}.md`;
    }

    if (!squad && sourcePath && sourcePath.startsWith(`${SQUADS_DIR}/`)) {
      const parts = sourcePath.split('/');
      squad = parts[1] || null;
    }

    const aliases = new Set([normalizeAgentInput(id)]);
    if (activateMatch) {
      aliases.add(normalizeAgentInput(activateMatch[1]));
    }

    index[id] = {
      id,
      pointerPath: `${CODEX_AGENTS_DIR}/${file}`,
      sourcePath,
      squad,
      aliases: [...aliases],
    };
  }

  return index;
}

/**
 * Static alias map for well-known short forms that aren't filenames.
 */
const STATIC_ALIASES = {
  dev: 'developer',
  qa: 'quality-gate',
  pm: 'project-lead',
  po: 'product-lead',
  sm: 'sprint-lead',
  imperator: 'snps-orqx',
  'sinapse-orqx': 'snps-orqx',
  sinapse: 'snps-orqx',
  snps: 'snps-orqx',
  'claude-orqx': 'swarm-orqx',
};

function resolveAgentId(index, agentInput) {
  const normalized = normalizeAgentInput(agentInput);

  // Direct filename / id match.
  if (index[normalized]) {
    return index[normalized];
  }

  // Static alias map.
  const aliased = STATIC_ALIASES[normalized];
  if (aliased && index[aliased]) {
    return index[aliased];
  }

  // Search aliases declared in pointers.
  const matches = Object.values(index).filter((entry) =>
    entry.aliases.includes(normalized),
  );
  if (matches.length === 1) {
    return matches[0];
  }
  if (matches.length > 1) {
    throw new Error(`Ambiguous Codex agent "${agentInput}"`);
  }

  return null;
}

/**
 * Extract candidate task slugs from a source agent definition.
 * Handles markdown table rows, numbered/bulleted lists in a ## Tasks section,
 * YAML `tasks:` dependency blocks (core/dev agents), and YAML `commands:`
 * `*name` entries. Slugs are only kept if a matching task file exists (the
 * caller verifies existence).
 */
function extractTaskSlugs(sourceText) {
  if (!sourceText) return [];
  const slugs = new Set();

  const lines = sourceText.split(/\r?\n/);
  let inTasksSection = false;
  let inYamlTasks = false;
  let yamlTasksIndent = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    const indent = line.length - line.replace(/^\s+/, '').length;

    // Track a YAML `tasks:` dependency block (core/dev agents use this).
    if (/^tasks:\s*$/.test(trimmed)) {
      inYamlTasks = true;
      yamlTasksIndent = indent;
      continue;
    }
    if (inYamlTasks) {
      const yamlItem = trimmed.match(/^-\s+([a-z0-9][a-z0-9-]+)(?:\.md)?(?:\s+#.*)?$/i);
      if (yamlItem && indent > yamlTasksIndent) {
        slugs.add(yamlItem[1].toLowerCase());
        continue;
      }
      if (trimmed.length > 0 && indent <= yamlTasksIndent && !/^-\s/.test(trimmed)) {
        inYamlTasks = false;
      } else {
        continue;
      }
    }

    // Track ## Tasks heading scope (until next heading).
    if (/^#{1,6}\s+Tasks?\b/i.test(trimmed)) {
      inTasksSection = true;
      continue;
    }
    if (/^#{1,6}\s+/.test(trimmed) && !/Tasks?\b/i.test(trimmed)) {
      inTasksSection = false;
    }

    // Markdown table row: | audit-meta-ads-account | desc |
    const tableMatch = trimmed.match(/^\|\s*([a-z0-9][a-z0-9-]+)\s*\|/i);
    if (tableMatch && !/^\|?\s*-+/.test(trimmed) && !/^\|\s*task\b/i.test(trimmed)) {
      slugs.add(tableMatch[1].toLowerCase());
    }

    // Numbered or bulleted list item: "1. generate-headline-variations"
    const listMatch = trimmed.match(/^(?:\d+\.|[-*])\s+([a-z0-9][a-z0-9-]+)\s*$/i);
    if (inTasksSection && listMatch) {
      slugs.add(listMatch[1].toLowerCase());
    }

    // YAML dependency task entries inside a ## Tasks section.
    const depMatch = trimmed.match(/^-\s+([a-z0-9][a-z0-9-]+)(?:\.md)?\s*$/i);
    if (inTasksSection && depMatch) {
      slugs.add(depMatch[1].toLowerCase());
    }

    // YAML command entries: '- name: "*define-positioning"'.
    const cmdMatch = trimmed.match(/^-?\s*name:\s*["']?\*([a-z0-9][a-z0-9-]+)["']?/i);
    if (cmdMatch) {
      slugs.add(cmdMatch[1].toLowerCase());
    }
  }

  return [...slugs];
}

/**
 * Discover real tasks for an agent: intersect declared slugs with existing
 * task files. Orchestrators expose every squad task. Specialists fall back to
 * the full squad task pool only when no exact task matched — so no agent is
 * ever left with zero accessible tasks while every pointer references a file
 * that exists on disk.
 */
function resolveAgentTasks(entry, projectRoot = PROJECT_ROOT) {
  const sourceText = entry.sourcePath
    ? readFileSafe(projectRoot, entry.sourcePath)
    : null;

  const declared = extractTaskSlugs(sourceText);

  const taskDirs = [];
  if (entry.squad) {
    taskDirs.push(`${SQUADS_DIR}/${entry.squad}/tasks`);
  }
  taskDirs.push(DEV_TASKS_DIR);

  const resolved = [];
  const seen = new Set();

  for (const slug of declared) {
    for (const dir of taskDirs) {
      const rel = `${dir}/${slug}.md`;
      if (!seen.has(rel) && fileExists(projectRoot, rel)) {
        resolved.push({ command: slug, target: rel, kind: 'task', scope: 'declared' });
        seen.add(rel);
        break;
      }
    }
  }

  const isOrchestrator = /-orqx$/.test(entry.id);
  const shouldExposeSquadPool =
    entry.squad && (isOrchestrator || resolved.length === 0);

  if (shouldExposeSquadPool) {
    const dir = path.join(projectRoot, `${SQUADS_DIR}/${entry.squad}/tasks`);
    let files = [];
    try {
      files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
    } catch {
      files = [];
    }
    for (const f of files) {
      const slug = f.replace(/\.md$/, '');
      const rel = `${SQUADS_DIR}/${entry.squad}/tasks/${f}`;
      if (!seen.has(rel)) {
        resolved.push({
          command: slug,
          target: rel,
          kind: 'task',
          scope: isOrchestrator ? 'squad' : 'squad-pool',
        });
        seen.add(rel);
      }
    }
  }

  return resolved;
}

function resolveCodexAgent(agentInput, projectRoot = PROJECT_ROOT) {
  const index = loadCodexAgentIndex(projectRoot);
  const entry = resolveAgentId(index, agentInput);
  if (!entry) {
    throw new Error(`Unknown Codex agent "${agentInput}"`);
  }

  const tasks = resolveAgentTasks(entry, projectRoot);

  return {
    agentId: entry.id,
    squad: entry.squad,
    sourceOfTruth: entry.sourcePath,
    pointer: entry.pointerPath,
    isOrchestrator: /-orqx$/.test(entry.id),
    taskCount: tasks.length,
    tasks,
  };
}

/**
 * Resolve a specific command (task) for an agent.
 */
function resolveCodexAgentCommand(agentInput, commandInput, projectRoot = PROJECT_ROOT) {
  const agent = resolveCodexAgent(agentInput, projectRoot);
  const normalized = normalizeCommandInput(commandInput);

  const match = agent.tasks.find(
    (t) => normalizeCommandInput(t.command) === normalized,
  );

  if (!match) {
    throw new Error(
      `Unknown Codex command "${commandInput}" for agent "${agent.agentId}"`,
    );
  }

  return {
    agentId: agent.agentId,
    squad: agent.squad,
    commandId: match.command,
    kind: match.kind,
    target: match.target,
    sourceOfTruth: agent.sourceOfTruth,
  };
}

/**
 * Build ecosystem-wide stats: count agents that resolve and total resolvable
 * task pointers (deduped by file). Used by AGENTS.md generation + self-check.
 */
function buildEcosystemStats(projectRoot = PROJECT_ROOT) {
  const index = loadCodexAgentIndex(projectRoot);
  const agentIds = Object.keys(index);

  const squads = new Set();
  let resolvableAgents = 0;
  let agentsWithTasks = 0;
  const uniqueTaskFiles = new Set();

  for (const id of agentIds) {
    let result;
    try {
      result = resolveCodexAgent(id, projectRoot);
    } catch {
      continue;
    }
    if (result.sourceOfTruth && fileExists(projectRoot, result.sourceOfTruth)) {
      resolvableAgents += 1;
    }
    if (result.taskCount > 0) agentsWithTasks += 1;
    // Only real squad directories count (exclude the "core" pseudo-squad).
    if (result.squad && result.squad !== 'core') squads.add(result.squad);
    for (const t of result.tasks) uniqueTaskFiles.add(t.target);
  }

  let squadTaskFiles = 0;
  try {
    const squadDirs = fs
      .readdirSync(path.join(projectRoot, SQUADS_DIR))
      .filter((d) => {
        try {
          return fs.statSync(path.join(projectRoot, SQUADS_DIR, d)).isDirectory();
        } catch {
          return false;
        }
      });
    for (const sq of squadDirs) {
      try {
        squadTaskFiles += fs
          .readdirSync(path.join(projectRoot, SQUADS_DIR, sq, 'tasks'))
          .filter((f) => f.endsWith('.md')).length;
      } catch {
        /* squad without tasks dir */
      }
    }
  } catch {
    /* no squads dir */
  }

  let devTaskFiles = 0;
  try {
    devTaskFiles = fs
      .readdirSync(path.join(projectRoot, DEV_TASKS_DIR))
      .filter((f) => f.endsWith('.md')).length;
  } catch {
    /* no dev tasks dir */
  }

  return {
    totalAgents: agentIds.length,
    resolvableAgents,
    agentsWithTasks,
    squads: squads.size,
    squadTaskFiles,
    devTaskFiles,
    totalTaskFiles: squadTaskFiles + devTaskFiles,
    resolvableTaskPointers: uniqueTaskFiles.size,
  };
}

function parseArgs(argv = process.argv.slice(2)) {
  const flags = new Set(argv.filter((a) => a.startsWith('--')));
  const args = argv.filter((a) => !a.startsWith('--'));
  return {
    agent: args[0],
    command: args[1],
    json: flags.has('--json'),
    stats: flags.has('--stats'),
  };
}

function main() {
  const args = parseArgs();

  if (args.stats) {
    console.log(JSON.stringify(buildEcosystemStats(), null, 2));
    return;
  }

  if (!args.agent) {
    console.error(
      'Usage: node .codex/scripts/resolve-codex-agent.js <agent> [command] [--json] [--stats]',
    );
    process.exit(1);
  }

  try {
    if (args.command) {
      const result = resolveCodexAgentCommand(args.agent, args.command);
      console.log(JSON.stringify(result, null, 2));
    } else {
      const result = resolveCodexAgent(args.agent);
      if (args.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(`Agent: ${result.agentId}`);
        console.log(`Squad: ${result.squad || '(core)'}`);
        console.log(`Source: ${result.sourceOfTruth}`);
        console.log(`Orchestrator: ${result.isOrchestrator}`);
        console.log(`Tasks resolvable: ${result.taskCount}`);
        for (const t of result.tasks.slice(0, 20)) {
          console.log(`  - ${t.command} → ${t.target}`);
        }
        if (result.tasks.length > 20) {
          console.log(`  ... and ${result.tasks.length - 20} more`);
        }
      }
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  PROJECT_ROOT,
  normalizeAgentInput,
  normalizeCommandInput,
  loadCodexAgentIndex,
  resolveAgentId,
  extractTaskSlugs,
  resolveAgentTasks,
  resolveCodexAgent,
  resolveCodexAgentCommand,
  buildEcosystemStats,
  STATIC_ALIASES,
};
