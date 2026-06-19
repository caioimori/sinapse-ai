#!/usr/bin/env node
'use strict';

/**
 * Hook: Enforce Mandatory Delegation — Constitution Article VIII
 *
 * RULE: Orchestrator agents (*-orqx) must NEVER execute domain work directly.
 *       They can only read, search, and delegate via Agent/SendMessage.
 *
 * Protocol (Claude Code PreToolUse):
 *   exit 0  → allow
 *   exit 2  → block (message shown to model via stderr)
 *
 * Fail-open: if the active agent is unknown, allow (Hook Design Principle #1).
 *
 * Active-agent signal (first match wins):
 *   1. process.env.SINAPSE_ACTIVE_AGENT — explicit signal set by the
 *      orchestration layer when it activates/spawns an agent. This is the
 *      reliable channel; the session-state file is a secondary fallback.
 *   2. .sinapse/session-state.json → { lastAgent } — written by the session
 *      lifecycle when available.
 *   Neither present → unknown agent → fail-open (allow).
 *
 * NOTE (audit 2026-06-11, Article VIII): the AUTONOMOUS path now populates the
 * signal — the SubagentDispatcher sets SINAPSE_ACTIVE_AGENT in the env of every
 * agent it spawns, so this hook enforces correctly when the engine spawns an
 * orchestrator. The INTERACTIVE path (a human typing `@some-orqx` in chat) is
 * intentionally NOT wired here: enforcing it would block a solo operator's own
 * edits, so it stays opt-in (set SINAPSE_ACTIVE_AGENT yourself, or add a
 * prompt-parsing writer) rather than changing chat behavior by default.
 *
 * Exception: sinapse-orqx is allowed Write/Edit in .sinapse-ai/ paths
 *            (framework governance — operates above the story layer).
 *
 * @module enforce-delegation
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Agent IDs that are orchestrators (must delegate, never execute). */
const ORCHESTRATOR_PATTERN = /-orqx$/;

/** Tools that orchestrators are NOT allowed to use. */
const BLOCKED_TOOLS = ['Write', 'Edit', 'Bash', 'NotebookEdit'];

/** Paths where sinapse-orqx IS allowed to Write/Edit (framework governance). */
const FRAMEWORK_GOVERNANCE_PATHS = [
  '.sinapse-ai/', '.claude/', '.sinapse/', 'bin/',
  'package.json', 'core-config.yaml',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function projectRoot() {
  return process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

function relativize(filePath, root) {
  const normalized = filePath.replace(/\\/g, '/');
  const normalizedRoot = root.replace(/\\/g, '/');
  if (normalized.startsWith(normalizedRoot)) {
    return normalized.slice(normalizedRoot.length).replace(/^\/+/, '');
  }
  return normalized;
}

/**
 * Resolve the active agent id. Explicit env signal wins; session-state file is
 * the fallback. Returns the agent ID string or null if unknown (fail-open).
 * @param {string} root - Project root
 * @returns {string|null}
 */
function getActiveAgent(root) {
  // 1. Explicit, reliable signal from the orchestration layer.
  const envAgent = (process.env.SINAPSE_ACTIVE_AGENT || '').trim();
  if (envAgent) return envAgent;

  // 2. Session-state file fallback. Validate the resolved path stays within the
  //    project (defense-in-depth against a manipulated root — P2-003).
  const sessionStatePath = path.join(root, '.sinapse', 'session-state.json');
  const resolvedRoot = path.resolve(root);
  if (!path.resolve(sessionStatePath).startsWith(resolvedRoot)) {
    return null;
  }
  try {
    const state = JSON.parse(fs.readFileSync(sessionStatePath, 'utf8'));
    return state.lastAgent || null;
  } catch {
    return null; // fail-open
  }
}

function isOrchestrator(agentId) {
  return ORCHESTRATOR_PATTERN.test(agentId);
}

function isFrameworkGovernancePath(rel) {
  return FRAMEWORK_GOVERNANCE_PATHS.some((fp) => rel.startsWith(fp) || rel === fp);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    process.exit(0); // fail-open
  }

  const toolName = input.tool_name || '';

  // Only intercept domain-execution tools
  if (!BLOCKED_TOOLS.includes(toolName)) {
    process.exit(0);
  }

  const root = projectRoot();
  const agentId = getActiveAgent(root);

  // If no agent tracked or not an orchestrator, allow
  if (!agentId || !isOrchestrator(agentId)) {
    process.exit(0);
  }

  // Special case: sinapse-orqx allowed for framework governance
  if (agentId === 'sinapse-orqx') {
    if (toolName === 'Write' || toolName === 'Edit') {
      const filePath = (input.tool_input || {}).file_path || '';
      if (filePath) {
        const rel = relativize(filePath, root);
        if (isFrameworkGovernancePath(rel)) {
          process.exit(0); // Framework governance exception
        }
      }
    }
    // sinapse-orqx blocked for non-governance Write/Edit and all Bash
    // (it should delegate to @developer or @devops)
  }

  // BLOCK
  const delegationMap = {
    Write: '@developer (Dex)',
    Edit: '@developer (Dex)',
    Bash: '@developer (Dex) or @devops (Gage)',
    NotebookEdit: '@developer (Dex)',
  };

  const delegate = delegationMap[toolName] || '@developer';

  process.stderr.write(
    '\nMANDATORY DELEGATION BLOCK (Constitution Article VIII)\n' +
    `Agent: ${agentId} (orchestrator)\n` +
    `Tool: ${toolName}\n` +
    'Orchestrators NEVER execute domain work directly.\n' +
    `Delegate to ${delegate} for this operation.\n`,
  );
  process.exit(2);
}

main();
