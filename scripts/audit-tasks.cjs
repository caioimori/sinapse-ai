/**
 * SINAPSE Task Audit Script
 * Audits task markdown files for structural completeness across the whole framework.
 *
 * Scope: squad tasks (squads/<name>/tasks), the framework core tasks
 * (.sinapse-ai/development/tasks) and the master-squad tasks (sinapse/tasks).
 *
 * The checks are FORMAT-AGNOSTIC: a task is credited for a trait whether it is
 * declared in YAML frontmatter OR in a markdown section (## Metadata,
 * ## Task Definition, ## Inputs, ## Steps, etc.). This measures real completeness
 * instead of conformance to one rigid template — which is what produced thousands
 * of false "critical" flags before.
 *
 * Usage: node scripts/audit-tasks.cjs [--fix] [--json]
 *   --fix   Add basic frontmatter to tasks missing any structured header
 *   --json  Output raw JSON instead of the summary
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const ROOT = path.resolve(__dirname, '..');
const FIX_MODE = process.argv.includes('--fix');
const JSON_MODE = process.argv.includes('--json');

// Task sources scanned, in order. Paths are relative to ROOT.
const SOURCE_PATTERNS = [
  'squads/*/tasks/*.md',
  '.sinapse-ai/development/tasks/*.md',
  'sinapse/tasks/*.md',
];

// ── Scoring weights (sum = 100) ──────────────────────────────────
const CHECKS = [
  { id: 'has_header',         weight: 20, label: 'Structured header (frontmatter OR ## Metadata / ## Task Definition)' },
  { id: 'has_identity',       weight: 10, label: 'Identifiable (task/id/name field OR # title)' },
  { id: 'has_responsavel',    weight: 10, label: 'Owner declared (responsavel/agent field OR ## Agent / ## Owner)' },
  { id: 'has_entrada',        weight: 10, label: 'Inputs declared (field OR ## Input / ## Entrada / ## Context)' },
  { id: 'has_saida',          weight: 10, label: 'Outputs declared (field OR ## Output / ## Saida / ## Acceptance)' },
  { id: 'has_title',          weight: 10, label: 'Has # title' },
  { id: 'has_steps',          weight: 20, label: 'Has a process (## Steps/Process/Workflow/... OR numbered steps)' },
  { id: 'min_content_length', weight: 10, label: 'Content >= 200 chars' },
];

const MAX_SCORE = CHECKS.reduce((s, c) => s + c.weight, 0);

// ── Detection helpers ────────────────────────────────────────────
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : null;
}

// True if the body has a `## Heading` whose text starts with one of `names`.
function hasSection(body, names) {
  const re = new RegExp('^#{2,4}\\s+(' + names.join('|') + ')(?:\\b|\\s|:|$)', 'mi');
  return re.test(body);
}

// True if the frontmatter declares one of `fields` as a key.
function fmHas(fm, fields) {
  if (!fm) return false;
  const re = new RegExp('^\\s*(' + fields.join('|') + ')\\s*:', 'mi');
  return re.test(fm);
}

// True if the body contains a numbered procedure of at least 3 steps.
function hasNumberedSteps(body) {
  const m = body.match(/^\s*\d+[.)]\s+\S/gm);
  return !!m && m.length >= 3;
}

const METADATA_SECTIONS = ['Metadata', 'Task Definition', 'Definição', 'Overview', 'Visão Geral'];
const OWNER_SECTIONS = ['Agent', 'Owner', 'Responsável', 'Responsible', 'Persona', 'Executor'];
const INPUT_SECTIONS = ['Input', 'Inputs', 'Entrada', 'Entradas', 'Context', 'Contexto', 'Prerequisites', 'Pré-requisitos', 'Pre-requisitos'];
const OUTPUT_SECTIONS = ['Output', 'Outputs', 'Saída', 'Saida', 'Saídas', 'Saidas', 'Deliverable', 'Deliverables', 'Result', 'Results', 'Acceptance', 'Critérios', 'Criterios'];
const STEP_SECTIONS = ['Steps', 'Step', 'Description', 'Etapas', 'Process', 'Processo', 'Workflow', 'Execution', 'Execução', 'Instructions', 'Instruções', 'Procedure', 'Activities', 'Activity', 'Phases', 'Fases', 'Fluxo', 'How', 'Como', 'Task Definition'];

// ── Audit a single file ──────────────────────────────────────────
function auditFile(filePath, group) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath, '.md');
  const fm = parseFrontmatter(content);
  const body = fm ? content.slice(content.indexOf('---', 3) + 3).trim() : content;

  const results = {};
  const issues = [];

  results.has_title = /^#\s+\S/m.test(body);
  if (!results.has_title) issues.push('No # title');

  results.has_header = !!fm || hasSection(body, METADATA_SECTIONS);
  if (!results.has_header) issues.push('No structured header (frontmatter or Metadata/Task Definition section)');

  results.has_identity = fmHas(fm, ['task', 'id', 'name', 'slug', 'title']) || results.has_title;
  if (!results.has_identity) issues.push('Not identifiable (no task/id/name field and no title)');

  results.has_responsavel = fmHas(fm, ['responsavel', 'responsável', 'responsible', 'agent', 'owner', 'persona', 'executor']) || hasSection(body, OWNER_SECTIONS);
  if (!results.has_responsavel) issues.push('No owner/agent declared');

  results.has_entrada = fmHas(fm, ['entrada', 'entradas', 'input', 'inputs', 'context', 'contexto', 'prerequisites']) || hasSection(body, INPUT_SECTIONS);
  if (!results.has_entrada) issues.push('No inputs declared');

  results.has_saida = fmHas(fm, ['saida', 'saída', 'saidas', 'output', 'outputs', 'deliverable', 'result', 'acceptance']) || hasSection(body, OUTPUT_SECTIONS);
  if (!results.has_saida) issues.push('No outputs/acceptance declared');

  results.has_steps = hasSection(body, STEP_SECTIONS) || hasNumberedSteps(body);
  if (!results.has_steps) issues.push('No process (steps/workflow/numbered procedure)');

  results.min_content_length = content.length >= 200;
  if (!results.min_content_length) issues.push(`Content too short (${content.length} chars)`);

  let score = 0;
  for (const check of CHECKS) {
    if (results[check.id]) score += check.weight;
  }
  const pct = Math.round((score / MAX_SCORE) * 100);

  return { file: filename, path: filePath, group, score: pct, results, issues };
}

// ── Fix: add a minimal frontmatter to files lacking any header ────
function fixFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath, '.md');
  const frontmatter = [
    '---',
    `task: ${filename}`,
    'responsavel: "TBD"',
    'responsavel_type: Agent',
    'atomic_layer: Task',
    '---',
    '',
  ].join('\n');
  fs.writeFileSync(filePath, frontmatter + content, 'utf-8');
}

// ── Group a file by its source location ──────────────────────────
function groupFor(absPath) {
  const rel = path.relative(ROOT, absPath).replace(/\\/g, '/');
  if (rel.startsWith('squads/')) return rel.split('/')[1];
  if (rel.startsWith('.sinapse-ai/development/tasks/')) return 'core/development';
  if (rel.startsWith('sinapse/tasks/')) return 'sinapse-master';
  return rel.split('/')[0];
}

// ── Main ─────────────────────────────────────────────────────────
async function main() {
  let files = [];
  for (const pattern of SOURCE_PATTERNS) {
    const matched = await glob(pattern, { cwd: ROOT, absolute: true });
    files = files.concat(matched);
  }
  // De-dupe (defensive) and sort for stable output.
  files = Array.from(new Set(files)).sort();

  if (files.length === 0) {
    console.error('No task files found.');
    process.exit(1);
  }

  const groupMap = {};
  const allResults = [];
  let fixedCount = 0;

  for (const filePath of files) {
    const group = groupFor(filePath);
    if (!groupMap[group]) groupMap[group] = { tasks: [], totalScore: 0 };

    if (FIX_MODE) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const fm = parseFrontmatter(content);
      if (!fm && !hasSection(content, METADATA_SECTIONS)) {
        fixFrontmatter(filePath);
        fixedCount++;
      }
    }

    const result = auditFile(filePath, group);
    groupMap[group].tasks.push(result);
    groupMap[group].totalScore += result.score;
    allResults.push(result);
  }

  // ── Build report ───────────────────────────────────────────────
  const groupSummaries = [];
  for (const [name, data] of Object.entries(groupMap).sort((a, b) => a[0].localeCompare(b[0]))) {
    const avg = Math.round(data.totalScore / data.tasks.length);
    const critical = data.tasks.filter(t => t.score < 50).length;
    const warning = data.tasks.filter(t => t.score >= 50 && t.score < 70).length;
    groupSummaries.push({
      group: name,
      taskCount: data.tasks.length,
      avgScore: avg,
      critical,
      warning,
      passing: data.tasks.length - critical - warning,
    });
  }

  const issueFreq = {};
  for (const r of allResults) {
    for (const iss of r.issues) issueFreq[iss] = (issueFreq[iss] || 0) + 1;
  }
  const commonIssues = Object.entries(issueFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([issue, count]) => ({ issue, count, pct: Math.round((count / allResults.length) * 100) }));

  const overallAvg = Math.round(allResults.reduce((s, r) => s + r.score, 0) / allResults.length);
  const problemFiles = allResults.filter(r => r.score < 70).sort((a, b) => a.score - b.score);

  const report = {
    summary: {
      totalFiles: allResults.length,
      totalGroups: groupSummaries.length,
      overallAvgScore: overallAvg,
      passingFiles: allResults.filter(r => r.score >= 70).length,
      warningFiles: allResults.filter(r => r.score >= 50 && r.score < 70).length,
      criticalFiles: allResults.filter(r => r.score < 50).length,
      fixedInThisRun: fixedCount,
    },
    groupSummaries,
    commonIssues,
    problemFiles: problemFiles.map(f => ({ file: f.file, group: f.group, score: f.score, issues: f.issues })),
  };

  if (JSON_MODE) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log('\n=== SINAPSE Task Audit Report ===\n');
    console.log(`Total files: ${report.summary.totalFiles}`);
    console.log(`Total groups: ${report.summary.totalGroups}`);
    console.log(`Overall avg score: ${report.summary.overallAvgScore}%`);
    console.log(`Passing (>=70): ${report.summary.passingFiles}`);
    console.log(`Warning (50-69): ${report.summary.warningFiles}`);
    console.log(`Critical (<50): ${report.summary.criticalFiles}`);
    if (fixedCount > 0) console.log(`Fixed (frontmatter added): ${fixedCount}`);

    console.log('\n--- Group Summary ---\n');
    console.log('Group'.padEnd(30) + 'Tasks'.padEnd(8) + 'Avg'.padEnd(6) + 'Crit'.padEnd(6) + 'Warn'.padEnd(6) + 'Pass');
    console.log('-'.repeat(62));
    for (const s of groupSummaries) {
      console.log(
        s.group.padEnd(30) +
        String(s.taskCount).padEnd(8) +
        `${s.avgScore}%`.padEnd(6) +
        String(s.critical).padEnd(6) +
        String(s.warning).padEnd(6) +
        String(s.passing)
      );
    }

    console.log('\n--- Common Issues ---\n');
    for (const iss of commonIssues) {
      console.log(`  ${iss.count} files (${iss.pct}%) — ${iss.issue}`);
    }

    if (problemFiles.length > 0) {
      console.log(`\n--- Problem Files (score < 70): ${problemFiles.length} files ---\n`);
      for (const f of problemFiles.slice(0, 50)) {
        console.log(`  [${f.score}%] ${f.group}/${f.file}: ${f.issues.join('; ')}`);
      }
      if (problemFiles.length > 50) console.log(`  ... and ${problemFiles.length - 50} more`);
    }
  }

  // Write JSON report (create the directory first — this used to crash with ENOENT).
  const jsonPath = path.join(ROOT, 'docs', 'reports', '9.3-task-audit.json');
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\nJSON saved to: ${jsonPath}`);
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
