#!/usr/bin/env node
/**
 * validate-squad-orqx — Story 10.28
 *
 * Verifies that every squad under `squads/` exposes a reachable
 * orchestrator agent (`*-orqx.md`) with the minimum required YAML
 * metadata block. Companion to the existing scripts/validate-agents.js
 * which validates the 12 core framework agents under
 * `.sinapse-ai/development/agents/`.
 *
 * Checks per orqx file:
 *   1. File exists at squads/{squad}/agents/{name}-orqx.md
 *   2. Contains a recognized identity block (YAML / frontmatter / Markdown)
 *   3. At least one of agent.name / agent.id / agent.title is present
 *   4. agent.id (when declared) matches `{squad}/{name}-orqx` OR the bare
 *      `{name}-orqx` file-base — anything else is a HARD ERROR (id-mismatch)
 *   5. persona.role (or a Role/Papel section) exists — a missing role is a
 *      HARD ERROR (persona-role)
 *
 * Rationale (E8 / auditoria-pos-190): id-mismatch and persona-role were
 * previously `warn` only and never blocked, so a malformed orqx (wrong id /
 * no role) passed the gate silently. They now block (exit 1).
 *
 * Squad-level checks:
 *   - Every directory under squads/ that has agents/ MUST have at least
 *     one *-orqx.md file inside.
 *
 * Exit codes:
 *   0  all squads have reachable orqx agents with valid metadata
 *   1  any squad missing an orqx OR any orqx fails metadata checks
 *
 * Usage:
 *   node scripts/validate-squad-orqx.js
 *   node scripts/validate-squad-orqx.js --json
 *   node scripts/validate-squad-orqx.js --quiet
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SQUADS_DIR = path.join(PROJECT_ROOT, 'squads');

function parseArgs(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  return {
    quiet: args.has('--quiet') || args.has('-q'),
    json: args.has('--json'),
  };
}

function listSquads(squadsDir = SQUADS_DIR) {
  if (!fs.existsSync(squadsDir)) return [];
  return fs
    .readdirSync(squadsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

function findOrqxFiles(squadName, squadsDir = SQUADS_DIR) {
  const agentsDir = path.join(squadsDir, squadName, 'agents');
  if (!fs.existsSync(agentsDir)) return [];
  return fs
    .readdirSync(agentsDir)
    .filter((f) => f.endsWith('-orqx.md'))
    .map((f) => path.join(agentsDir, f));
}

// parseOrqxFormat detects either of the two valid orqx file formats:
//   1. YAML block (`\`\`\`yaml ... \`\`\``) with agent: + persona: keys
//   2. Markdown headings (`# Agent: ...`, `## Identidade`, `## Role`)
// Returns { format, agent, persona } or null if neither shape recognized.
function parseOrqxFormat(content) {
  // Format 0: YAML frontmatter (--- ... ---)
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const block = frontmatterMatch[1];
    const data = { format: 'frontmatter', agent: {}, persona: {} };
    const nameMatch = block.match(/^name:\s*"?([^"\n]+?)"?\s*$/m);
    if (nameMatch) {
      data.agent.id = nameMatch[1].trim();
      data.agent.name = nameMatch[1].trim();
    }
    const descMatch = block.match(/^description:\s*\|?\s*\n((?:\s{2}.+\n?)+)/);
    if (descMatch) {
      data.agent.title = descMatch[1].trim().split('\n')[0].trim();
      data.persona.role = descMatch[1].trim().split('\n')[0].trim();
    } else {
      const inlineDescMatch = block.match(/^description:\s*(.+)$/m);
      if (inlineDescMatch) {
        data.agent.title = inlineDescMatch[1].trim();
        data.persona.role = inlineDescMatch[1].trim();
      }
    }
    if (Object.keys(data.agent).length > 0) return data;
  }

  const yamlMatch = content.match(/```yaml\n([\s\S]*?)\n```/);
  if (yamlMatch) {
    const block = yamlMatch[1];
    const data = { format: 'yaml', agent: {}, persona: {} };
    const agentMatch = block.match(/agent:\s*\n((?:\s{2}.+\n?)+)/);
    if (agentMatch) {
      const lines = agentMatch[1].split('\n');
      for (const line of lines) {
        const m = line.match(/^\s{2}(\w+):\s*"?([^"\n]+?)"?\s*$/);
        if (m) data.agent[m[1]] = m[2];
      }
    }
    const roleMatch = block.match(/persona:[\s\S]*?role:\s*"?([^"\n]+?)"?$/m);
    if (roleMatch) data.persona.role = roleMatch[1].trim();
    // Fall through to markdown branch if YAML extraction yielded nothing.
    if (Object.keys(data.agent).length > 0) return data;
  }

  // Markdown-headings format (squad-design and friends)
  if (/^#\s+Agent:\s/m.test(content) || /\*\*ID:\*\*/.test(content)) {
    const data = { format: 'markdown', agent: {}, persona: {} };
    const titleMatch = content.match(/^#\s+(?:Agent:\s+)?(.+?)$/m);
    if (titleMatch) data.agent.title = titleMatch[1].trim();

    const idMatch = content.match(/\*\*ID:\*\*\s*`?([^\s`]+)`?/);
    if (idMatch) data.agent.id = idMatch[1].trim();

    const nameMatch = content.match(/\*\*Nome:\*\*\s*([^\n]+)/);
    if (nameMatch) data.agent.name = nameMatch[1].trim();

    // Accept "## Role" or "## Papel" (PT-BR alias)
    const roleHeadingMatch = content.match(/^##\s+(?:Role|Papel)\s*\n+([\s\S]+?)(?:\n##|\n$)/m);
    if (roleHeadingMatch) data.persona.role = roleHeadingMatch[1].trim().split('\n')[0];
    // Inline role in list item (e.g. "- **Role:** Product Operations Orchestrator")
    if (!data.persona.role) {
      const inlineRoleMatch = content.match(/\*\*(?:Role|Papel):\*\*\s*([^\n]+)/);
      if (inlineRoleMatch) data.persona.role = inlineRoleMatch[1].trim();
    }

    return data;
  }

  // Table-based identity format (squad-claude orqx files)
  if (/\*\*Agent ID\*\*/.test(content) || /\*\*Name\*\*\s*\|/.test(content)) {
    const data = { format: 'markdown-table', agent: {}, persona: {} };
    const titleMatch = content.match(/^#\s+(.+?)$/m);
    if (titleMatch) data.agent.title = titleMatch[1].trim();

    const nameMatch = content.match(/\*\*Name\*\*\s*\|\s*([^|\n]+)/);
    if (nameMatch) data.agent.name = nameMatch[1].trim();

    const idMatch = content.match(/\*\*Agent ID\*\*\s*\|\s*`?@?([^|`\n]+?)`?\s*\|/);
    if (idMatch) data.agent.id = idMatch[1].trim();

    // Accept "## Role" or "## Papel" (PT-BR alias)
    const roleHeadingMatch = content.match(/^##\s+(?:Role|Papel)\s*\n+([\s\S]+?)(?:\n##|\n$)/m);
    if (roleHeadingMatch) data.persona.role = roleHeadingMatch[1].trim().split('\n')[0];

    return data;
  }

  return null;
}

function validateOrqxFile(filePath) {
  const findings = [];
  const fileName = path.basename(filePath);
  const relPath = path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');
  const squadName = relPath.split('/')[1];
  const expectedId = `${squadName}/${fileName.replace('.md', '')}`;

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    findings.push({ level: 'error', rule: 'read', message: `cannot read: ${err.message}` });
    return findings;
  }

  const data = parseOrqxFormat(content);
  if (!data) {
    findings.push({
      level: 'error',
      rule: 'unrecognized-format',
      message: 'no YAML block and no Markdown identity heading found',
    });
    return findings;
  }

  // At least one of name/id/title must be present so the agent is reachable.
  const hasIdentity = Boolean(data.agent.name || data.agent.id || data.agent.title);
  if (!hasIdentity) {
    findings.push({
      level: 'error',
      rule: 'agent-identity',
      message: 'no agent.name / agent.id / agent.title found in either format',
    });
    return findings;
  }

  // ID match is now a HARD check. The tolerance stays: an orqx may declare its id
  // as the squad-prefixed "{squad}/{name}-orqx" OR the bare file-base "{name}-orqx"
  // (Markdown format often omits the squad prefix). Anything else is a real
  // divergence — a malformed orqx that would be reached under the wrong id — and
  // is an ERROR, not a soft warning.
  if (data.agent.id && data.agent.id !== expectedId) {
    const fileBaseId = path.basename(filePath, '.md');
    if (data.agent.id !== fileBaseId) {
      findings.push({
        level: 'error',
        rule: 'id-mismatch',
        message: `agent.id="${data.agent.id}" does not match "${expectedId}" or "${fileBaseId}"`,
      });
    }
  }

  // persona.role is now REQUIRED. An orqx with no role declared is malformed —
  // the orchestrator persona is undefined. ERROR, not warning.
  if (!data.persona || !data.persona.role) {
    findings.push({
      level: 'error',
      rule: 'persona-role',
      message: 'persona.role / Role section is missing',
    });
  }

  return findings;
}

function validateAllSquads(squadsDir = SQUADS_DIR) {
  const squads = listSquads(squadsDir);
  const results = [];
  for (const squad of squads) {
    const orqxFiles = findOrqxFiles(squad, squadsDir);
    if (orqxFiles.length === 0) {
      // Some squad directories don't have agents/ at all (legacy/utility),
      // skip those silently. Only flag as ERROR if agents/ exists but no orqx.
      const agentsDir = path.join(squadsDir, squad, 'agents');
      if (fs.existsSync(agentsDir)) {
        results.push({
          squad,
          orqxFiles: [],
          findings: [
            { level: 'error', rule: 'no-orqx', message: 'squad has agents/ but no *-orqx.md' },
          ],
        });
      }
      continue;
    }
    for (const filePath of orqxFiles) {
      results.push({ squad, orqxFile: filePath, findings: validateOrqxFile(filePath) });
    }
  }
  return results;
}

function summarize(results) {
  const summary = { total: results.length, pass: 0, warn: 0, error: 0 };
  for (const r of results) {
    const hasError = r.findings.some((f) => f.level === 'error');
    const hasWarn = r.findings.some((f) => f.level === 'warn');
    if (hasError) summary.error += 1;
    else if (hasWarn) summary.warn += 1;
    else summary.pass += 1;
  }
  return summary;
}

function formatReport(results, summary) {
  const lines = [];
  for (const r of results) {
    const tag = r.findings.some((f) => f.level === 'error')
      ? 'ERROR'
      : r.findings.some((f) => f.level === 'warn')
        ? 'WARN '
        : 'PASS ';
    const label = r.orqxFile ? path.relative(PROJECT_ROOT, r.orqxFile).replace(/\\/g, '/') : `${r.squad} (no orqx)`;
    lines.push(`${tag} ${label}`);
    for (const f of r.findings) {
      lines.push(`  [${f.level}] ${f.rule}: ${f.message}`);
    }
  }
  lines.push('');
  lines.push(
    `Summary: ${summary.total} orqx file(s) — ${summary.pass} pass, ${summary.warn} warn, ${summary.error} error`,
  );
  return lines.join('\n');
}

function main() {
  const args = parseArgs();
  const results = validateAllSquads();
  const summary = summarize(results);

  if (args.json) {
    console.log(JSON.stringify({ results, summary }, null, 2));
  } else if (!args.quiet) {
    console.log('=== validate-squad-orqx ===');
    console.log(formatReport(results, summary));
  }

  return summary.error > 0 ? 1 : 0;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = {
  parseArgs,
  listSquads,
  findOrqxFiles,
  parseOrqxFormat,
  validateOrqxFile,
  validateAllSquads,
  summarize,
  formatReport,
  main,
};
