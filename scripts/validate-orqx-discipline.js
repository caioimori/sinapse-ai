#!/usr/bin/env node

/**
 * validate-orqx-discipline.js
 *
 * Story master-audit-2026-05-06 / Wave 4 / PR-14.
 *
 * Lint guard that enforces orchestration discipline on squad orchestrators.
 * Squad orqx (matching *-orqx.md, *-chief.md, *-master.md) MUST NOT declare
 * commands with execution verbs. Orchestrators route to specialists.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

const ORQX_FILENAME_PATTERNS = [/-orqx\.md$/i, /-chief\.md$/i, /-master\.md$/i];

const ALLOWED_COMMAND_PATTERNS = [
  /^(route|delegate|orchestrate|coordinate|synthesize)\b/i,
  /^(status|help|plan|brief|classify|conduct|audit)\b/i,
  /^(select|manage|monitor|track|escalate|resolve|onboard)\b/i,
  /^(start|pause|resume|stop|skip|exit)\b/i,
  /^(create|build)-(brief|plan|roadmap|epic|story|workflow|knowledge-base|swipe-file|map|hierarchy|stack|tree|dashboard)\b/i,
];

const FORBIDDEN_COMMAND_PATTERNS = [
  {
    regex: /^(write|generate|design|implement|code|draw|render|compose)-(?!brief|plan|roadmap|map|workflow)/i,
    description: 'Execution verb in orchestrator command (should be specialist task)',
  },
  {
    regex: /^build-(?!brief|plan|roadmap|knowledge-base|swipe-file|map|hierarchy|stack|tree|dashboard|workflow|epic|story)/i,
    description: 'Build verb on domain artifact (should be specialist task)',
  },
  {
    regex: /^create-(?!brief|plan|roadmap|epic|story|workflow|map|hierarchy)/i,
    description: 'Create verb on domain artifact (should be specialist task)',
  },
];

function isOrqxFile(filePath) {
  const filename = path.basename(filePath);
  return ORQX_FILENAME_PATTERNS.some((pattern) => pattern.test(filename));
}

function getTrackedAgents() {
  const out = execSync('git ls-files squads/*/agents/*.md', {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return out.split('\n').filter(Boolean).filter(isOrqxFile);
}

function extractCommands(content) {
  const commands = [];
  const yamlBlocks = content.match(/```ya?ml[\s\S]*?```/g) || [content];
  for (const block of yamlBlocks) {
    const nameMatches = block.matchAll(/(?:^|\n)\s*-?\s*name:\s*["']?(\*?[\w-]+)["']?/g);
    for (const m of nameMatches) {
      if (m[1].startsWith('*') || m[1].includes('-')) {
        commands.push(m[1]);
      }
    }
  }
  const mdMatches = content.matchAll(/(?:^|\n)\s*[-*]\s+(\*[\w-]+)/g);
  for (const m of mdMatches) {
    commands.push(m[1]);
  }
  return [...new Set(commands)];
}

function classifyCommand(cmd) {
  const normalized = cmd.replace(/^\*+/, '');
  for (const rule of FORBIDDEN_COMMAND_PATTERNS) {
    if (rule.regex.test(normalized)) {
      const allowed = ALLOWED_COMMAND_PATTERNS.some((p) => p.test(normalized));
      if (!allowed) {
        return { verdict: 'forbidden', description: rule.description };
      }
    }
  }
  if (ALLOWED_COMMAND_PATTERNS.some((p) => p.test(normalized))) {
    return { verdict: 'allowed' };
  }
  return { verdict: 'unknown' };
}

function scanFile(filePath) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) return { commands: [], violations: [] };
  const content = fs.readFileSync(fullPath, 'utf8');
  const commands = extractCommands(content);
  const violations = [];
  for (const cmd of commands) {
    const result = classifyCommand(cmd);
    if (result.verdict === 'forbidden') {
      violations.push({
        file: filePath,
        command: cmd,
        description: result.description,
      });
    }
  }
  return { commands, violations };
}

function run() {
  const orqxFiles = getTrackedAgents();
  let totalCommands = 0;
  let totalForbidden = 0;
  const allViolations = [];

  for (const file of orqxFiles) {
    const { commands, violations } = scanFile(file);
    totalCommands += commands.length;
    totalForbidden += violations.length;
    allViolations.push(...violations);
  }

  if (allViolations.length === 0) {
    console.log('OK orqx-discipline: no execution-verb commands found in orchestrators.');
    console.log(`   Scanned ${orqxFiles.length} orchestrator files, ${totalCommands} commands total.`);
    return 0;
  }

  console.error('');
  console.error('FAIL orqx-discipline: orchestrator commands with execution verbs found.');
  console.error('');
  console.error(`   ${allViolations.length} violation(s) across ${new Set(allViolations.map((v) => v.file)).size} file(s).`);
  console.error('');
  for (const v of allViolations) {
    console.error(`  ${v.file}`);
    console.error(`    Command:     ${v.command}`);
    console.error(`    Issue:       ${v.description}`);
    console.error(`    Suggestion:  Replace with *route-${v.command.replace(/^\*/, '')} that delegates to a specialist`);
    console.error('');
  }
  console.error('Why this matters:');
  console.error('  Squad orchestrators must ROUTE, not EXECUTE. Execution verbs');
  console.error('  (write/build/generate/design) belong to specialist agents.');
  console.error('  See: docs/audits/2026-05-06-eixo-C-task-level-followup.md');
  console.error('');
  console.error('Allowlist (legitimate orchestrator commands):');
  console.error('  *route-*, *delegate-*, *orchestrate-*, *coordinate-*, *synthesize-*');
  console.error('  *status, *help, *plan, *brief, *classify-*, *conduct-*, *audit-*');
  console.error('  *create-brief, *create-plan, *build-knowledge-base (orchestrator-level)');
  console.error('');
  return 1;
}

if (require.main === module) {
  process.exit(run());
}

module.exports = { run, ALLOWED_COMMAND_PATTERNS, FORBIDDEN_COMMAND_PATTERNS, isOrqxFile };
