#!/usr/bin/env node
'use strict';

/**
 * Codex-to-Claude hook compatibility bridge.
 *
 * Codex reports file edits as one `apply_patch` invocation whose patch is in
 * `tool_input.command`. Claude hooks expect one Write/Edit payload per file.
 * This bridge expands every patch target, applies Codex-native fail-closed
 * policies, and then invokes the existing portable Node.js guards without
 * changing their source or their Claude registration.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const WRITE_GUARDS = [
  'enforce-permission-mode.cjs',
  'enforce-framework-boundary.cjs',
  'enforce-architecture-first.cjs',
  'write-path-validation.cjs',
  'enforce-story-gate.cjs',
  'doc-first-gate.cjs',
  'enforce-nsn-guard.cjs',
  'code-intel-pretool.cjs',
  'enforce-delegation.cjs',
  'secret-scanning.cjs',
];

const BASH_GUARDS = [
  'enforce-permission-mode.cjs',
  'enforce-delegation.cjs',
  'verify-packages.cjs',
];

const PROTECTED_PREFIXES = [
  '.sinapse-ai/core/',
  '.sinapse-ai/development/tasks/',
  '.sinapse-ai/development/templates/',
  '.sinapse-ai/development/checklists/',
  '.sinapse-ai/development/workflows/',
  '.sinapse-ai/infrastructure/',
];

const PROTECTED_FILES = new Set([
  '.sinapse-ai/constitution.md',
]);

const PLACEHOLDER_PATTERN = /(?:example|sample|dummy|fake|placeholder|changeme|replace[_-]?me|your[_-]?(?:key|token|secret)|redacted)/i;

function readInput() {
  const raw = fs.readFileSync(0, 'utf8');
  if (!raw.trim()) throw new Error('empty hook input');
  const input = JSON.parse(raw);
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('hook input must be a JSON object');
  }
  return input;
}

function findProjectRoot(input) {
  const starts = [input && input.cwd, process.cwd()].filter(Boolean);

  for (const start of starts) {
    let current = path.resolve(start);
    while (true) {
      const hasCodex = fs.existsSync(path.join(current, '.codex'));
      const hasClaude = fs.existsSync(path.join(current, '.claude'));
      if (hasCodex || hasClaude) return current;
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }

  const git = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: starts[0] || process.cwd(),
    encoding: 'utf8',
    windowsHide: true,
  });
  if (git.status === 0 && git.stdout.trim()) return path.resolve(git.stdout.trim());
  return path.resolve(starts[0] || process.cwd());
}

function stripOptionalQuotes(value) {
  const trimmed = String(value || '').trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function normalizeTarget(filePath, root) {
  const raw = stripOptionalQuotes(filePath);
  if (!raw || raw.includes('\0')) throw new Error('patch target is empty or invalid');

  const looksWindowsAbsolute = /^[A-Za-z]:[\\/]/.test(raw);
  const absolute = path.isAbsolute(raw) || looksWindowsAbsolute
    ? path.resolve(raw)
    : path.resolve(root, raw);
  const relative = path.relative(root, absolute).replace(/\\/g, '/');

  if (!relative || relative === '..' || relative.startsWith('../') || path.isAbsolute(relative)) {
    throw new Error(`patch target escapes the project root: ${raw}`);
  }

  return relative.replace(/^\.\//, '');
}

function parsePatchTargets(command, root) {
  if (typeof command !== 'string' || !command.trim()) {
    throw new Error('apply_patch input is missing tool_input.command');
  }

  const header = /^\*\*\* (Add|Update|Delete) File:\s*(.+?)\s*$/gm;
  const matches = [...command.matchAll(header)];
  if (matches.length === 0) throw new Error('apply_patch contains no file target');

  const targets = [];
  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const segmentStart = match.index + match[0].length;
    const segmentEnd = index + 1 < matches.length ? matches[index + 1].index : command.length;
    const segment = command.slice(segmentStart, segmentEnd).replace(/\*\*\* End Patch\s*$/, '');
    const operation = match[1];
    const target = {
      operation,
      filePath: normalizeTarget(match[2], root),
      content: segment,
    };
    targets.push(target);

    // apply_patch can rename an updated file. Treat the destination as another
    // write target so a safe source cannot be moved into a protected path.
    const move = segment.match(/^\*\*\* Move to:\s*(.+?)\s*$/m);
    if (move) {
      targets.push({
        operation: 'Update',
        filePath: normalizeTarget(move[1], root),
        content: segment,
      });
    }
  }
  return targets;
}

function isProtectedPath(filePath) {
  // Windows resolves path segments case-insensitively. Normalize policy checks
  // on every platform so a mixed-case path cannot bypass the same protected
  // file when the hook runs on Windows.
  const normalized = filePath.replace(/\\/g, '/').replace(/^\.\//, '').toLowerCase();
  if (PROTECTED_FILES.has(normalized)) return true;
  if (PROTECTED_PREFIXES.some((prefix) => normalized.startsWith(prefix))) return true;
  return /^bin\/sinapse[^/]*\.js$/i.test(normalized);
}

function fallbackSecretFindings(content) {
  const patterns = [
    /AKIA[0-9A-Z]{16}/,
    /gh(?:p|o|u|s|r)_[A-Za-z0-9_]{30,}/,
    /github_pat_[A-Za-z0-9_]{22,}/,
    /sk-proj-[A-Za-z0-9_-]{40,}/,
    /sk-(?:svcacct|admin)-[A-Za-z0-9_-]{20,}/,
    /sk-ant-[A-Za-z0-9-]{20,}/,
    /AIza[0-9A-Za-z_-]{35}/,
    /(?:postgres(?:ql)?|mysql|mongodb|redis):\/\/[^:\s]+:[^@\s]+@/i,
    /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY(?: BLOCK)?-----/,
    /(?:api[_-]?key|access[_-]?token|password|passwd|secret)\s*[:=]\s*["']?[^\s"']{12,}/i,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(content);
    if (match && !PLACEHOLDER_PATTERN.test(match[0])) return [{}];
  }
  return [];
}

function findSecrets(content, filePath, root) {
  try {
    const scanner = require(path.join(root, 'bin', 'utils', 'secret-scanner-core.js'));
    if (!scanner || typeof scanner.scanContent !== 'function') return fallbackSecretFindings(content);
    return scanner.scanContent(content, { filePath });
  } catch {
    return fallbackSecretFindings(content);
  }
}

function sqlPolicyViolation(command) {
  const sql = command
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    // Preserve shell options such as `psql --command`; SQL comments written
    // with the conventional `-- ` form are safe to remove globally. Mutation
    // tails receive a stricter comment pass below.
    .replace(/--(?=\s)[^\r\n]*/g, ' ');

  if (/\bDROP\s+(?:TABLE|DATABASE|SCHEMA|MATERIALIZED\s+VIEW|VIEW|INDEX|FUNCTION|PROCEDURE|TRIGGER|TYPE|POLICY|ROLE|USER|EXTENSION|SEQUENCE|DOMAIN|OWNED|COLLATION|SERVER|TABLESPACE)\b/i.test(sql)) {
    return 'DROP statement';
  }
  if (/\bTRUNCATE\b/i.test(sql)) return 'TRUNCATE statement';
  if (/\bALTER\s+(?:TABLE|VIEW|TYPE|DATABASE|SEQUENCE|DOMAIN)\b[\s\S]*?\bDROP\b/i.test(sql)) {
    return 'ALTER ... DROP statement';
  }

  const statements = sql.split(';');
  for (const statement of statements) {
    const deleteMatch = /\bDELETE\s+FROM\b/i.exec(statement);
    const updateMatch = /\bUPDATE\b[\s\S]{1,500}?\bSET\b/i.exec(statement);
    for (const [match, violation] of [
      [deleteMatch, 'DELETE without WHERE'],
      [updateMatch, 'UPDATE without WHERE'],
    ]) {
      if (!match) continue;
      const mutation = statement
        .slice(match.index)
        .replace(/--[^\r\n]*/g, ' ')
        .replace(/'(?:''|[^'])*'/g, "''")
        .replace(/\s+/g, ' ');
      if (!/\bWHERE\b\s+(?:[\w[\]`"($:@?])/i.test(mutation)) return violation;
    }
  }
  return null;
}

function normalizePolicyCommand(command) {
  return String(command || '')
    // Common POSIX token separators and escape-based command obfuscation.
    .replace(/\$\{?IFS\}?/gi, ' ')
    .replace(/\\\r?\n/g, '')
    .replace(/(?<=[A-Za-z0-9_])\\(?=[A-Za-z0-9_])/g, '')
    // Shell concatenates adjacent quoted word fragments (DR""OP, p'u'sh).
    // Remove only quotes between word characters so SQL string literals such
    // as note='WHERE' remain quoted for the SQL policy's literal stripping.
    .replace(/(?<=[A-Za-z0-9_])["']+(?=[A-Za-z0-9_])/g, '')
    .replace(/\s+/g, ' ');
}

function gitPushPolicyViolation(command, activeAgent = process.env.SINAPSE_ACTIVE_AGENT) {
  const pushPattern = /\bgit(?:\.exe)?(?:\s+(?!push\b)\S+){0,8}\s+push\b/ig;
  const pushes = [...command.matchAll(pushPattern)];
  if (pushes.length === 0) return null;

  const normalizedAgent = String(activeAgent || '').trim().replace(/^@/, '').toLowerCase();
  if (normalizedAgent !== 'devops') {
    return 'git push is exclusive to @devops';
  }

  for (const push of pushes) {
    const segment = command.slice(push.index).split(/&&|\|\||;|\r?\n/, 1)[0];
    if (/(?:^|\s)(?:--force(?:-with-lease|-if-includes)?|-f)(?:\s|$)/i.test(segment)) {
      return 'force-push is forbidden';
    }
    if (/(?:^|\s)(?:--all|--mirror|--tags|--delete|-d)(?:\s|$)/i.test(segment)) {
      return 'git push must name an explicit non-protected branch';
    }

    const tokens = (segment.match(/"[^"]*"|'[^']*'|\S+/g) || [])
      .map((token) => token.replace(/^['"]|['"]$/g, ''));
    const pushIndex = tokens.findIndex((token) => token.toLowerCase() === 'push');
    if (pushIndex < 0) return 'git push could not be classified safely';

    const positional = tokens.slice(pushIndex + 1).filter((token) => !token.startsWith('-'));
    // Require both a remote and at least one explicit refspec. A bare push can
    // resolve to main/master through local configuration, so it fails closed.
    if (positional.length < 2) return 'git push must name an explicit non-protected branch';

    const refspecs = positional.slice(1);
    for (const refspec of refspecs) {
      if (refspec.startsWith('+')) return 'force-push refspec is forbidden';
      if (refspec.startsWith(':')) return 'branch deletion through git push is forbidden';
      const target = (refspec.includes(':') ? refspec.split(':').pop() : refspec)
        .replace(/^refs\/heads\//i, '');
      if (
        !target ||
        /^(?:HEAD|main|master)$/i.test(target) ||
        !/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(target)
      ) {
        return 'direct push to main/master or an implicit branch is forbidden';
      }
    }
  }
  return null;
}

function commandPolicyViolation(command) {
  if (typeof command !== 'string') return 'shell input is missing tool_input.command';
  const normalizedCommand = normalizePolicyCommand(command);
  const gitViolation = gitPushPolicyViolation(normalizedCommand);
  if (gitViolation) return gitViolation;
  return sqlPolicyViolation(normalizedCommand);
}

function toClaudeWritePayload(input, target) {
  const base = {
    ...input,
    hook_event_name: 'PreToolUse',
    tool_name: target.operation === 'Add' ? 'Write' : 'Edit',
  };

  if (target.operation === 'Add') {
    base.tool_input = { file_path: target.filePath, content: target.content };
  } else if (target.operation === 'Delete') {
    base.tool_input = {
      file_path: target.filePath,
      old_string: target.content,
      new_string: '',
    };
  } else {
    base.tool_input = {
      file_path: target.filePath,
      old_string: '',
      new_string: target.content,
    };
  }
  return base;
}

function runGuard(root, guardName, payload) {
  const guardPath = path.join(root, '.claude', 'hooks', guardName);
  if (!fs.existsSync(guardPath)) return { status: 0, stdout: '', stderr: '' };

  const result = spawnSync(process.execPath, [guardPath], {
    cwd: root,
    env: {
      ...process.env,
      CLAUDE_PROJECT_DIR: root,
      SINAPSE_PROJECT_DIR: root,
    },
    input: JSON.stringify(payload),
    encoding: 'utf8',
    timeout: 5000,
    windowsHide: true,
  });

  if (result.error) {
    return {
      status: 2,
      stdout: '',
      stderr: `${guardName} failed: ${result.error.message}`,
    };
  }
  return {
    status: result.status == null ? 2 : result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function runGuards(root, guards, payloads) {
  const context = [];
  const warnings = [];
  for (const payload of payloads) {
    for (const guard of guards) {
      const result = runGuard(root, guard, payload);
      if (result.status === 2) {
        return {
          blocked: true,
          reason: result.stderr.trim() || `${guard} blocked the operation`,
          context,
          warnings,
        };
      }
      if (result.status !== 0) {
        return {
          blocked: true,
          reason: `${guard} failed closed with exit code ${result.status}`,
          context,
          warnings,
        };
      }
      if (result.stdout.trim()) context.push(result.stdout.trim());
      if (result.stderr.trim()) warnings.push(result.stderr.trim());
    }
  }
  return { blocked: false, context, warnings };
}

function deny(eventName, reason) {
  const safeReason = String(reason || 'Blocked by SINAPSE Codex hook policy').slice(0, 4000);
  if (eventName === 'PermissionRequest') {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PermissionRequest',
        decision: { behavior: 'deny', message: safeReason },
      },
    }));
  } else {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: safeReason,
      },
    }));
  }
}

function emitContext(context, warnings) {
  const additionalContext = context.filter(Boolean).join('\n\n').slice(0, 12000);
  const systemMessage = warnings.filter(Boolean).join('\n').slice(0, 4000);
  if (!additionalContext && !systemMessage) return;

  const output = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
    },
  };
  if (additionalContext) output.hookSpecificOutput.additionalContext = additionalContext;
  if (systemMessage) output.systemMessage = systemMessage;
  process.stdout.write(JSON.stringify(output));
}

function handlePreTool(input, eventName, root) {
  const toolName = String(input.tool_name || '').trim();
  const toolInput = input.tool_input && typeof input.tool_input === 'object'
    ? input.tool_input
    : {};

  if (toolName === 'apply_patch') {
    let targets;
    try {
      targets = parsePatchTargets(toolInput.command, root);
    } catch (error) {
      deny(eventName, `Malformed apply_patch blocked (fail-closed): ${error.message}`);
      return;
    }

    for (const target of targets) {
      if (isProtectedPath(target.filePath)) {
        deny(eventName, `Protected framework path blocked: ${target.filePath}`);
        return;
      }
      if (findSecrets(target.content, target.filePath, root).length > 0) {
        deny(eventName, `Secret-like content blocked in ${target.filePath}`);
        return;
      }
    }

    const payloads = targets.map((target) => toClaudeWritePayload(input, target));
    const result = runGuards(root, WRITE_GUARDS, payloads);
    if (result.blocked) deny(eventName, result.reason);
    else emitContext(result.context, result.warnings);
    return;
  }

  if (toolName === 'Bash') {
    const violation = commandPolicyViolation(toolInput.command);
    if (violation) {
      deny(eventName, `Unsafe shell command blocked: ${violation}`);
      return;
    }
    const result = runGuards(root, BASH_GUARDS, [input]);
    if (result.blocked) deny(eventName, result.reason);
    else emitContext(result.context, result.warnings);
  }
}

function runLifecycleGuard(root, guardName, input, transformToolName) {
  const payload = transformToolName
    ? { ...input, tool_name: transformToolName }
    : input;
  const result = runGuard(root, guardName, payload);
  if (result.status === 2) {
    process.stderr.write(result.stderr || `${guardName} blocked the event`);
    process.exitCode = 2;
    return;
  }
  if (result.stdout) process.stdout.write(result.stdout);
}

function emitAuthorityContext(eventName, input, root) {
  const agentType = String(input.agent_type || '').trim();
  const audience = agentType ? ` for subagent ${agentType}` : '';
  const agentsPath = fs.existsSync(path.join(root, 'AGENTS.md')) ? 'root AGENTS.md' : 'project instructions';
  process.stdout.write(
    `SINAPSE authority context${audience}: read ${agentsPath} before acting. ` +
    'Canonical agents, tasks, workflows, and the Constitution remain under .sinapse-ai/ and squads/. ' +
    'Follow the validated Story Development Cycle, preserve L1/L2 protected paths, delegate domain work, ' +
    'and reserve git push, PR, and release operations for @devops. ' +
    `Lifecycle event: ${eventName}.`,
  );
}

function main() {
  const eventFromArg = process.argv[2] || '';
  let input;
  try {
    input = readInput();
  } catch (error) {
    if (eventFromArg === 'PreToolUse' || eventFromArg === 'PermissionRequest') {
      deny(eventFromArg, `Invalid hook payload blocked (fail-closed): ${error.message}`);
    }
    return;
  }

  const eventName = eventFromArg || input.hook_event_name || '';
  const root = findProjectRoot(input);

  if (eventName === 'SessionStart' || eventName === 'SubagentStart') {
    emitAuthorityContext(eventName, input, root);
    return;
  }
  if (eventName === 'SubagentStop') {
    // Explicitly supported as a no-op. Parent orchestration consumes the
    // subagent handoff; no continuation or recursive delegation is requested.
    return;
  }
  if (eventName === 'PreToolUse' || eventName === 'PermissionRequest') {
    handlePreTool(input, eventName, root);
    return;
  }
  if (eventName === 'UserPromptSubmit') {
    runLifecycleGuard(root, 'synapse-wrapper.cjs', input);
    return;
  }
  if (eventName === 'PreCompact') {
    runLifecycleGuard(root, 'precompact-wrapper.cjs', input);
    return;
  }
  if (eventName === 'PostToolUse') {
    const telemetryTool = input.tool_name === 'apply_patch' ? 'Edit' : null;
    runLifecycleGuard(root, 'telemetry-post-tool.cjs', input, telemetryTool);
    return;
  }
  if (eventName === 'Stop') {
    // Telemetry only. This hook never returns a continuation decision, so Stop
    // cannot create an implicit or unbounded loop.
    runLifecycleGuard(root, 'telemetry-stop.cjs', input);
  }
}

main();

module.exports = {
  commandPolicyViolation,
  gitPushPolicyViolation,
  isProtectedPath,
  normalizeTarget,
  normalizePolicyCommand,
  parsePatchTargets,
  sqlPolicyViolation,
  toClaudeWritePayload,
};
