#!/usr/bin/env node
'use strict';

/**
 * Hook: Enforce Permission Mode — PreToolUse guard
 *
 * RULE: When the project is in "explore" (read-only) mode, Write and Edit
 *       operations are BLOCKED. Read operations are always allowed.
 *       Bash commands classified as write/delete/execute are also blocked.
 *
 * Protocol (Claude Code PreToolUse):
 *   exit 0  → allow (operation proceeds)
 *   exit 2  → block (message shown to model via stderr)
 *
 * Fail-open policy:
 *   - If the permission config cannot be loaded, the hook allows (exit 0).
 *   - If mode is "ask" or "auto", the hook allows (exit 0).
 *   - Any unexpected error: exit 0.
 *
 * @module enforce-permission-mode
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Project root resolution
// ---------------------------------------------------------------------------

function projectRoot() {
  return process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

// ---------------------------------------------------------------------------
// Lightweight mode loader (no yaml dependency — parses the simple key: value)
// ---------------------------------------------------------------------------

/**
 * Parse `permissions.mode` from a minimal YAML config without requiring js-yaml.
 * Handles:
 *   permissions:
 *     mode: explore
 *
 * Returns 'ask' (the safe default) if the file is missing, unreadable, or
 * the key is absent.
 *
 * @param {string} configPath
 * @returns {string} mode name
 */
function loadPermissionMode(configPath) {
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    // Match "mode: <value>" under a "permissions:" block
    const match = content.match(/^\s*mode:\s*["']?(\w+)["']?\s*$/m);
    if (match) {
      return match[1].toLowerCase();
    }
  } catch {
    // File missing or unreadable — fail-open
  }
  return 'ask';
}

// ---------------------------------------------------------------------------
// Operation classifier (mirrors OperationGuard.classifyOperation)
// ---------------------------------------------------------------------------

const SAFE_COMMANDS = [
  'git status', 'git log', 'git diff', 'git branch', 'git show',
  'git ls-files', 'git remote -v',
  'ls', 'pwd', 'cat', 'head', 'tail', 'wc', 'find', 'grep', 'which',
  'file', 'stat',
  'npm list', 'npm outdated', 'npm audit', 'npm view', 'npm search',
  'yarn list', 'yarn info', 'bun pm ls',
  'node --version', 'npm --version', 'yarn --version', 'bun --version',
  'git --version', 'python --version', 'python3 --version',
  'uname', 'whoami', 'hostname', 'date', 'uptime', 'df -h', 'free -h',
  'env', 'printenv',
  'curl -I', 'ping -c', 'nslookup', 'dig',
  'ps aux', 'top -l 1', 'htop',
  'gh auth status', 'gh repo view', 'gh pr list', 'gh pr view',
  'gh issue list', 'gh issue view', 'gh api',
];

const DESTRUCTIVE_PATTERNS = [
  /\brm\s+(-[rf]+\s+)?/,
  /\brmdir\b/,
  /\bunlink\b/,
  /\bgit\s+reset\s+--hard\b/,
  /\bgit\s+push\s+--force\b/,
  /\bgit\s+push\s+-f\b/,
  /\bgit\s+clean\s+-[fd]+/,
  /\bgit\s+checkout\s+\.\s*$/,
  /\bgit\s+restore\s+\.\s*$/,
  /\bgit\s+stash\s+drop\b/,
  /\bgit\s+branch\s+-[dD]\b/,
  /\bDROP\s+(TABLE|DATABASE|INDEX|VIEW)\b/i,
  /\bDELETE\s+FROM\b/i,
  /\bTRUNCATE\b/i,
  /\bALTER\s+TABLE\b.*\bDROP\b/i,
  /\bkill\s+-9\b/,
  /\bkillall\b/,
  /\bshutdown\b/,
  /\breboot\b/,
  /\bnpm\s+uninstall\b/,
  /\byarn\s+remove\b/,
  /\bbun\s+remove\b/,
];

const WRITE_PATTERNS = [
  /[^<]>/,
  />>/,
  /\bmkdir\b/,
  /\btouch\b/,
  /\bmv\b/,
  /\bcp\b/,
  /\bln\b/,
  /\bchmod\b/,
  /\bchown\b/,
  /\bsed\s+-i\b/,
  /\bawk\s+-i\b/,
  /\bgit\s+add\b/,
  /\bgit\s+commit\b/,
  /\bgit\s+push\b/,
  /\bgit\s+merge\b/,
  /\bgit\s+rebase\b/,
  /\bgit\s+cherry-pick\b/,
  /\bgit\s+stash\b/,
  /\bnpm\s+install\b/,
  /\bnpm\s+i\b/,
  /\bnpm\s+ci\b/,
  /\byarn\s+add\b/,
  /\byarn\s+install\b/,
  /\bbun\s+install\b/,
  /\bbun\s+add\b/,
];

/**
 * Classify a Bash command as read/write/delete/execute.
 * @param {string} command
 * @returns {string}
 */
function classifyBashCommand(command) {
  const normalized = command.trim().toLowerCase();
  for (const safe of SAFE_COMMANDS) {
    if (normalized.startsWith(safe.toLowerCase())) return 'read';
  }
  for (const pat of DESTRUCTIVE_PATTERNS) {
    if (pat.test(command)) return 'delete';
  }
  for (const pat of WRITE_PATTERNS) {
    if (pat.test(command)) return 'write';
  }
  return 'execute';
}

/**
 * Classify a tool call into an operation type.
 * @param {string} tool
 * @param {Object} params
 * @returns {string}
 */
function classifyOperation(tool, params) {
  if (['Read', 'Glob', 'Grep', 'WebFetch', 'WebSearch'].includes(tool)) return 'read';
  if (['Write', 'Edit', 'NotebookEdit'].includes(tool)) return 'write';
  if (tool === 'Bash') return classifyBashCommand(params.command || '');
  if (tool === 'Task') {
    const readOnlyAgents = ['Explore', 'Plan', 'claude-code-guide'];
    return readOnlyAgents.includes(params.subagent_type) ? 'read' : 'execute';
  }
  if (tool.startsWith('mcp__')) return 'execute';
  return 'read'; // default to read (safe)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // Parse stdin — fail-open on any parse error
  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    process.exit(0);
  }

  const toolName = (input.tool_name || '').trim();
  const toolInput = input.tool_input || {};

  // Resolve project root
  const root = projectRoot();
  const configPath = path.join(root, '.sinapse', 'config.yaml');

  // Load permission mode — fail-open if unresolvable
  let mode;
  try {
    mode = loadPermissionMode(configPath);
  } catch {
    process.exit(0);
  }

  // Only enforce in explore mode. All other modes: allow.
  if (mode !== 'explore') {
    process.exit(0);
  }

  // Classify the operation
  let operation;
  try {
    operation = classifyOperation(toolName, toolInput);
  } catch {
    process.exit(0); // fail-open
  }

  // In explore mode, only reads are allowed
  if (operation === 'read') {
    process.exit(0);
  }

  // Build context for the block message
  let detail = '';
  if (toolName === 'Bash' && toolInput.command) {
    const cmd = toolInput.command;
    detail = `\nCommand: ${cmd.length > 120 ? cmd.slice(0, 120) + '...' : cmd}`;
  } else if (toolInput.file_path) {
    detail = `\nFile: ${toolInput.file_path}`;
  }

  // BLOCK — exit 2
  process.stderr.write(
    `\nPERMISSION-MODE BLOCK [Explore / Read-Only]\n` +
    `Tool: ${toolName}  Operation: ${operation}${detail}\n` +
    `\n` +
    `The project is in Explore (read-only) mode. Write, Edit, and destructive\n` +
    `Bash commands are not allowed in this mode.\n` +
    `\n` +
    `To enable writes, change the permission mode:\n` +
    `  *mode ask    — confirm before each change\n` +
    `  *mode auto   — full autonomy (no prompts)\n` +
    `\n` +
    `Or update .sinapse/config.yaml:\n` +
    `  permissions:\n` +
    `    mode: ask\n`,
  );
  process.exit(2);
}

main();
