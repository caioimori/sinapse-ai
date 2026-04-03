/**
 * SINAPSE Task Audit Script
 * Audits all task markdown files across squads for structural compliance.
 *
 * Usage: node scripts/audit-tasks.cjs [--fix] [--json]
 *   --fix   Add basic frontmatter to tasks missing it entirely
 *   --json  Output raw JSON instead of summary
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const ROOT = path.resolve(__dirname, '..');
const SQUADS_DIR = path.join(ROOT, 'squads');
const FIX_MODE = process.argv.includes('--fix');
const JSON_MODE = process.argv.includes('--json');

// ── Scoring weights ──────────────────────────────────────────────
const CHECKS = [
  { id: 'has_frontmatter',    weight: 20, label: 'Has YAML frontmatter' },
  { id: 'has_task_field',     weight: 15, label: 'Frontmatter has task: field' },
  { id: 'has_responsavel',    weight: 10, label: 'Frontmatter has responsavel/responsible' },
  { id: 'has_entrada',        weight: 10, label: 'Frontmatter has Entrada/input' },
  { id: 'has_saida',          weight: 10, label: 'Frontmatter has Saida/output' },
  { id: 'has_title',          weight: 10, label: 'Has # Task: or # title' },
  { id: 'has_steps',          weight: 10, label: 'Has ## Steps or ## Description' },
  { id: 'has_metadata',       weight: 5,  label: 'Has ## Metadata section' },
  { id: 'min_content_length', weight: 10, label: 'Content >= 200 chars' },
];

const MAX_SCORE = CHECKS.reduce((s, c) => s + c.weight, 0);

// ── Parse frontmatter ────────────────────────────────────────────
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  return match[1];
}

// ── Audit a single file ──────────────────────────────────────────
function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath, '.md');
  const fm = parseFrontmatter(content);
  const body = fm ? content.slice(content.indexOf('---', 3) + 3).trim() : content;

  const results = {};
  const issues = [];

  // 1. Has frontmatter
  results.has_frontmatter = !!fm;
  if (!fm) issues.push('Missing frontmatter entirely');

  // 2. task: field
  results.has_task_field = fm ? /^task:/m.test(fm) : false;
  if (!results.has_task_field && fm) issues.push('Missing task: field in frontmatter');

  // 3. responsavel / responsible
  results.has_responsavel = fm ? /^(responsavel|responsible):/m.test(fm) : false;
  if (!results.has_responsavel && fm) issues.push('Missing responsavel/responsible field');

  // 4. Entrada / input
  results.has_entrada = fm ? /^(Entrada|input):/m.test(fm) : false;
  if (!results.has_entrada && fm) issues.push('Missing Entrada/input section');

  // 5. Saida / output
  results.has_saida = fm ? /^(Saida|output):/m.test(fm) : false;
  if (!results.has_saida && fm) issues.push('Missing Saida/output section');

  // 6. Title
  results.has_title = /^#\s+.+/m.test(body);
  if (!results.has_title) issues.push('Missing # title in body');

  // 7. Steps / Description
  results.has_steps = /^##\s+(Steps|Description|Etapas)/mi.test(body);
  if (!results.has_steps) issues.push('Missing ## Steps or ## Description');

  // 8. Metadata
  results.has_metadata = /^##\s+Metadata/mi.test(body);
  if (!results.has_metadata) issues.push('Missing ## Metadata section');

  // 9. Content length
  results.min_content_length = content.length >= 200;
  if (!results.min_content_length) issues.push(`Content too short (${content.length} chars)`);

  // Score
  let score = 0;
  for (const check of CHECKS) {
    if (results[check.id]) score += check.weight;
  }
  const pct = Math.round((score / MAX_SCORE) * 100);

  return { file: filename, path: filePath, score: pct, results, issues };
}

// ── Fix: add frontmatter to files missing it ─────────────────────
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
  return true;
}

// ── Main ─────────────────────────────────────────────────────────
async function main() {
  const pattern = path.join(SQUADS_DIR, '*/tasks/*.md').replace(/\\/g, '/');
  const files = await glob(pattern);

  if (files.length === 0) {
    console.error('No task files found.');
    process.exit(1);
  }

  const squadMap = {};
  const allResults = [];
  let fixedCount = 0;

  for (const filePath of files) {
    const rel = path.relative(SQUADS_DIR, filePath);
    const squadName = rel.split(/[/\\]/)[0];

    if (!squadMap[squadName]) {
      squadMap[squadName] = { tasks: [], totalScore: 0, issues: [] };
    }

    // Fix mode: add frontmatter before auditing
    if (FIX_MODE) {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (!content.startsWith('---')) {
        fixFrontmatter(filePath);
        fixedCount++;
      }
    }

    const result = auditFile(filePath);
    squadMap[squadName].tasks.push(result);
    squadMap[squadName].totalScore += result.score;
    allResults.push(result);
  }

  // ── Build report ───────────────────────────────────────────────
  const squadSummaries = [];
  for (const [name, data] of Object.entries(squadMap).sort((a, b) => a[0].localeCompare(b[0]))) {
    const avg = Math.round(data.totalScore / data.tasks.length);
    const critical = data.tasks.filter(t => t.score < 50).length;
    const warning = data.tasks.filter(t => t.score >= 50 && t.score < 70).length;
    squadSummaries.push({
      squad: name,
      taskCount: data.tasks.length,
      avgScore: avg,
      critical,
      warning,
      passing: data.tasks.length - critical - warning,
    });
  }

  // Issue frequency
  const issueFreq = {};
  for (const r of allResults) {
    for (const iss of r.issues) {
      issueFreq[iss] = (issueFreq[iss] || 0) + 1;
    }
  }
  const commonIssues = Object.entries(issueFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([issue, count]) => ({ issue, count, pct: Math.round((count / allResults.length) * 100) }));

  const overallAvg = Math.round(allResults.reduce((s, r) => s + r.score, 0) / allResults.length);
  const problemFiles = allResults.filter(r => r.score < 70).sort((a, b) => a.score - b.score);

  const report = {
    summary: {
      totalFiles: allResults.length,
      totalSquads: squadSummaries.length,
      overallAvgScore: overallAvg,
      passingFiles: allResults.filter(r => r.score >= 70).length,
      warningFiles: allResults.filter(r => r.score >= 50 && r.score < 70).length,
      criticalFiles: allResults.filter(r => r.score < 50).length,
      fixedInThisRun: fixedCount,
    },
    squadSummaries,
    commonIssues,
    problemFiles: problemFiles.map(f => ({
      file: f.file,
      squad: path.relative(SQUADS_DIR, f.path).split(/[/\\]/)[0],
      score: f.score,
      issues: f.issues,
    })),
  };

  if (JSON_MODE) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    // Human-readable output
    console.log('\n=== SINAPSE Task Audit Report ===\n');
    console.log(`Total files: ${report.summary.totalFiles}`);
    console.log(`Total squads: ${report.summary.totalSquads}`);
    console.log(`Overall avg score: ${report.summary.overallAvgScore}%`);
    console.log(`Passing (>=70): ${report.summary.passingFiles}`);
    console.log(`Warning (50-69): ${report.summary.warningFiles}`);
    console.log(`Critical (<50): ${report.summary.criticalFiles}`);
    if (fixedCount > 0) console.log(`Fixed (frontmatter added): ${fixedCount}`);

    console.log('\n--- Squad Summary ---\n');
    console.log('Squad'.padEnd(30) + 'Tasks'.padEnd(8) + 'Avg'.padEnd(6) + 'Crit'.padEnd(6) + 'Warn'.padEnd(6) + 'Pass');
    console.log('-'.repeat(62));
    for (const s of squadSummaries) {
      console.log(
        s.squad.padEnd(30) +
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
        const squad = path.relative(SQUADS_DIR, f.path).split(/[/\\]/)[0];
        console.log(`  [${f.score}%] ${squad}/${f.file}: ${f.issues.join('; ')}`);
      }
      if (problemFiles.length > 50) {
        console.log(`  ... and ${problemFiles.length - 50} more`);
      }
    }
  }

  // Write JSON for report generation
  const jsonPath = path.join(ROOT, 'docs', 'reports', '9.3-task-audit.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\nJSON saved to: ${jsonPath}`);
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
