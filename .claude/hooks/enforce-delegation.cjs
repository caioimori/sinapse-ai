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
 * Active-agent signal: process.env.SINAPSE_ACTIVE_AGENT, set by the
 * orchestration layer (SubagentDispatcher) in the env of every agent it
 * spawns. This is the ONLY signal this hook reads today — see the note on
 * getActiveAgent() below for why the old session-state.json fallback is gone.
 * No signal present → unknown agent → fail-open (allow).
 *
 * Scope, stated honestly (audit AF-20260702 item 2.5 — supersedes and
 * replaces the 2026-06-11 note this used to carry): the AUTONOMOUS path
 * (pipeline/motor `sinapse orchestrate`) is genuinely closed — the
 * SubagentDispatcher sets SINAPSE_ACTIVE_AGENT for every agent it spawns, so
 * this hook blocks a spawned orchestrator for real. The INTERACTIVE path (a
 * human typing `@some-orqx` in the same chat session) has no process
 * boundary to attach an env var to, so nothing sets SINAPSE_ACTIVE_AGENT
 * there — delegation in that path is enforced as a prompt instruction
 * (Constitution Art. VIII text + rules injection), not a deterministic gate.
 * Inferring the active agent from the last Task/slash-command in interactive
 * chat is a real option but is new engineering, not a bug fix — tracked as
 * an Onda 3 candidate, intentionally not built as part of this fix.
 *
 * Exception: sinapse-orqx is allowed Write/Edit in .sinapse-ai/ paths
 *            (framework governance — operates above the story layer).
 *
 * @module enforce-delegation
 */

const fs = require('fs');

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
 * Resolve the active agent id from the explicit orchestration-layer signal.
 * Returns the agent ID string, or null if unknown (fail-open).
 *
 * History (audit AF-20260702, item 2.5): this used to also fall back to
 * reading `.sinapse/session-state.json` → { lastAgent }. That fallback was
 * removed as verified dead code: its only writer — `onCommandComplete()` in
 * `.sinapse-ai/development/scripts/agent-exit-hooks.js` — is gated behind
 * `registerHook(agentFramework)`, which has zero call sites anywhere in the
 * codebase (grep-verified). A reader with no writer is theater, not a real
 * fallback. If a real writer is ever wired up, add the fallback back
 * alongside it — don't resurrect a reader that nothing feeds.
 *
 * @returns {string|null}
 */
function getActiveAgent() {
  const envAgent = (process.env.SINAPSE_ACTIVE_AGENT || '').trim();
  return envAgent || null;
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
  const agentId = getActiveAgent();

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
