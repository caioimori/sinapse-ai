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
 * Fail-open: if session state is unreadable or agent is unknown, allow.
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
 * Read the active agent from session state.
 * Returns the agent ID string or null if unknown.
 */
function getActiveAgent(root) {
  const sessionStatePath = path.join(root, '.sinapse', 'session-state.json');
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
    `\nMANDATORY DELEGATION BLOCK (Constitution Article VIII)\n` +
    `Agent: ${agentId} (orchestrator)\n` +
    `Tool: ${toolName}\n` +
    `Orchestrators NEVER execute domain work directly.\n` +
    `Delegate to ${delegate} for this operation.\n`,
  );
  process.exit(2);
}

main();
