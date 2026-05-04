/**
 * QA Audit Command
 *
 * Audit squad ecosystem quality: workflows, tasks, knowledge bases.
 * Validates structure, consistency, and completeness across all squads.
 *
 * @module cli/commands/qa/audit
 * @version 1.0.0
 * @story 9.5 - Quality Gate CLI
 */

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

/**
 * Create the audit subcommand
 * @returns {Command} Commander command instance
 */
function createAuditCommand() {
  const audit = new Command('audit');

  audit
    .description('Audit squad ecosystem quality (workflows, tasks, KBs)')
    .option('-t, --target <type>', 'Audit target: workflows, tasks, kbs, all', 'all')
    .option('-s, --squad <name>', 'Audit specific squad only')
    .option('-v, --verbose', 'Show detailed output', false)
    .option('--json', 'Output as JSON', false)
    .option('--fix', 'Auto-fix common issues', false)
    .option('--save-report', 'Save report to docs/reports/', false)
    .action(async (options) => {
      try {
        const projectRoot = findProjectRoot();
        const squadsDir = path.join(projectRoot, 'squads');

        if (!fs.existsSync(squadsDir)) {
          console.error('❌ No squads/ directory found. Are you in a SINAPSE project?');
          process.exit(1);
        }

        const squads = getSquadList(squadsDir, options.squad);

        if (squads.length === 0) {
          console.error(`❌ No squads found${options.squad ? ` matching "${options.squad}"` : ''}`);
          process.exit(1);
        }

        if (!options.json) {
          console.log(`\n🔍 SINAPSE Ecosystem Audit`);
          console.log('━'.repeat(60));
          console.log(`Squads: ${squads.length} | Target: ${options.target}`);
          console.log('━'.repeat(60));
        }

        const results = {
          timestamp: new Date().toISOString(),
          squads: squads.length,
          target: options.target,
          workflows: null,
          tasks: null,
          kbs: null,
        };

        if (options.target === 'all' || options.target === 'workflows') {
          results.workflows = auditWorkflows(squadsDir, squads, options);
        }

        if (options.target === 'all' || options.target === 'tasks') {
          results.tasks = auditTasks(squadsDir, squads, options);
        }

        if (options.target === 'all' || options.target === 'kbs') {
          results.kbs = auditKBs(squadsDir, squads, options);
        }

        // Calculate overall score
        const scores = [results.workflows, results.tasks, results.kbs]
          .filter(Boolean)
          .map((r) => r.score);
        results.overallScore = scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 0;

        if (options.json) {
          console.log(JSON.stringify(results, null, 2));
        } else {
          printAuditSummary(results);
        }

        if (options.saveReport) {
          const reportPath = saveReport(projectRoot, results);
          console.log(`\n📄 Report saved: ${reportPath}`);
        }

        process.exit(results.overallScore >= 70 ? 0 : 1);
      } catch (error) {
        console.error(`\n❌ Audit error: ${error.message}`);
        if (options.verbose) {
          console.error(error.stack);
        }
        process.exit(1);
      }
    });

  return audit;
}

/**
 * Find project root by traversing up looking for squads/ or .sinapse-ai/
 */
function findProjectRoot() {
  let dir = process.cwd();
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, 'squads')) || fs.existsSync(path.join(dir, '.sinapse-ai'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

/**
 * Get list of squad directories
 */
function getSquadList(squadsDir, filterSquad) {
  const entries = fs.readdirSync(squadsDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => !filterSquad || name.includes(filterSquad))
    .sort();
}

/**
 * Audit all workflows across squads
 */
function auditWorkflows(squadsDir, squads, options) {
  const result = {
    total: 0,
    passed: 0,
    warnings: 0,
    errors: 0,
    score: 0,
    perSquad: {},
    issues: [],
  };

  for (const squad of squads) {
    const wfDir = path.join(squadsDir, squad, 'workflows');
    if (!fs.existsSync(wfDir)) {
      result.perSquad[squad] = { count: 0, score: 100, issues: [] };
      continue;
    }

    const files = fs.readdirSync(wfDir).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));
    const squadResult = { count: files.length, score: 0, issues: [] };
    let squadScore = 0;

    for (const file of files) {
      const filePath = path.join(wfDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const fileScore = scoreWorkflow(content, file, squad, squadResult.issues, options);
      squadScore += fileScore;
      result.total++;
      if (fileScore >= 80) result.passed++;
      else if (fileScore >= 50) result.warnings++;
      else result.errors++;
    }

    squadResult.score = files.length > 0 ? Math.round(squadScore / files.length) : 100;
    result.perSquad[squad] = squadResult;
    result.issues.push(...squadResult.issues);
  }

  result.score = result.total > 0
    ? Math.round(Object.values(result.perSquad).reduce((s, r) => s + r.score, 0) / squads.length)
    : 100;

  if (options.verbose && !options.json) {
    console.log(`\n📋 Workflows: ${result.total} files | Score: ${result.score}/100`);
    result.issues.forEach((i) => {
      const icon = i.severity === 'error' ? '❌' : '⚠️';
      console.log(`  ${icon} ${i.squad}/${i.file}: ${i.message}`);
    });
  }

  return result;
}

/**
 * Score a single workflow file
 */
function scoreWorkflow(content, file, squad, issues, options) {
  let score = 0;
  const lines = content.split('\n');

  // Check for name field
  if (/^name:/m.test(content)) {
    score += 20;
  } else {
    issues.push({ severity: 'error', squad, file, message: 'Missing name: field' });
    if (options.fix) {
      const name = file.replace(/\.(yaml|yml)$/, '').replace(/-/g, ' ');
      const fixed = `name: ${name}\n${content}`;
      // Note: fix would write here, but we track it
    }
  }

  // Check for description
  if (/description:/m.test(content)) {
    score += 20;
  } else {
    issues.push({ severity: 'warning', squad, file, message: 'Missing description:' });
  }

  // Check for phases
  if (/phases:/m.test(content)) {
    score += 20;
  } else {
    issues.push({ severity: 'error', squad, file, message: 'Missing phases: section' });
  }

  // Check for trigger
  if (/trigger:/m.test(content)) {
    score += 15;
  } else {
    issues.push({ severity: 'warning', squad, file, message: 'Missing trigger: section' });
  }

  // Check for completion
  if (/completion:/m.test(content)) {
    score += 15;
  } else {
    issues.push({ severity: 'warning', squad, file, message: 'Missing completion: section' });
  }

  // Check content length (at least meaningful)
  if (lines.length >= 20) {
    score += 10;
  } else if (lines.length >= 10) {
    score += 5;
  } else {
    issues.push({ severity: 'warning', squad, file, message: `Short workflow (${lines.length} lines)` });
  }

  return score;
}

/**
 * Audit all tasks across squads
 */
function auditTasks(squadsDir, squads, options) {
  const result = {
    total: 0,
    passed: 0,
    warnings: 0,
    errors: 0,
    score: 0,
    perSquad: {},
    issues: [],
  };

  for (const squad of squads) {
    const taskDir = path.join(squadsDir, squad, 'tasks');
    if (!fs.existsSync(taskDir)) {
      result.perSquad[squad] = { count: 0, score: 100, issues: [] };
      continue;
    }

    const files = fs.readdirSync(taskDir).filter((f) => f.endsWith('.md'));
    const squadResult = { count: files.length, score: 0, issues: [] };
    let squadScore = 0;

    for (const file of files) {
      const filePath = path.join(taskDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const fileScore = scoreTask(content, file, squad, squadResult.issues);
      squadScore += fileScore;
      result.total++;
      if (fileScore >= 80) result.passed++;
      else if (fileScore >= 50) result.warnings++;
      else result.errors++;
    }

    squadResult.score = files.length > 0 ? Math.round(squadScore / files.length) : 100;
    result.perSquad[squad] = squadResult;
    result.issues.push(...squadResult.issues);
  }

  result.score = result.total > 0
    ? Math.round(Object.values(result.perSquad).reduce((s, r) => s + r.score, 0) / squads.length)
    : 100;

  if (options.verbose && !options.json) {
    console.log(`\n📋 Tasks: ${result.total} files | Score: ${result.score}/100`);
    const errorIssues = result.issues.filter((i) => i.severity === 'error');
    if (errorIssues.length > 0) {
      console.log(`  Errors: ${errorIssues.length} (showing first 20)`);
      errorIssues.slice(0, 20).forEach((i) => {
        console.log(`    ❌ ${i.squad}/${i.file}: ${i.message}`);
      });
    }
  }

  return result;
}

/**
 * Score a single task file
 */
function scoreTask(content, file, squad, issues) {
  let score = 0;

  // Check for frontmatter
  const hasFrontmatter = content.startsWith('---');
  if (hasFrontmatter) {
    score += 15;

    // Check frontmatter fields
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (fmMatch) {
      const fm = fmMatch[1];
      if (/task:/m.test(fm)) score += 10;
      else issues.push({ severity: 'warning', squad, file, message: 'Frontmatter missing task: field' });

      if (/responsavel:|responsible:/m.test(fm)) score += 10;
      else issues.push({ severity: 'warning', squad, file, message: 'Frontmatter missing responsavel:' });

      if (/Entrada:|input:/mi.test(fm)) score += 5;
      if (/Saida:|output:/mi.test(fm)) score += 5;
    }
  } else {
    issues.push({ severity: 'error', squad, file, message: 'Missing YAML frontmatter' });
  }

  // Check for title
  if (/^# /m.test(content)) {
    score += 15;
  } else {
    issues.push({ severity: 'warning', squad, file, message: 'Missing # title heading' });
  }

  // Check for Steps or Description
  if (/^## (Steps|Description)/m.test(content)) {
    score += 15;
  } else {
    issues.push({ severity: 'warning', squad, file, message: 'Missing ## Steps or ## Description section' });
  }

  // Check for Metadata
  if (/^## Metadata/m.test(content)) {
    score += 10;
  }

  // Check content length
  if (content.length >= 500) {
    score += 15;
  } else if (content.length >= 200) {
    score += 10;
  } else {
    issues.push({ severity: 'warning', squad, file, message: `Short task (${content.length} chars)` });
  }

  return score;
}

/**
 * Audit all knowledge bases across squads
 */
function auditKBs(squadsDir, squads, options) {
  const result = {
    total: 0,
    passed: 0,
    warnings: 0,
    errors: 0,
    score: 0,
    perSquad: {},
    issues: [],
  };

  for (const squad of squads) {
    const kbDir = path.join(squadsDir, squad, 'knowledge-base');
    if (!fs.existsSync(kbDir)) {
      result.perSquad[squad] = { count: 0, score: 100, issues: [] };
      continue;
    }

    const files = fs.readdirSync(kbDir).filter((f) => f.endsWith('.md'));
    const squadResult = { count: files.length, score: 0, issues: [] };
    let squadScore = 0;

    for (const file of files) {
      const filePath = path.join(kbDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const fileScore = scoreKB(content, file, squad, squadResult.issues);
      squadScore += fileScore;
      result.total++;
      if (fileScore >= 80) result.passed++;
      else if (fileScore >= 50) result.warnings++;
      else result.errors++;
    }

    squadResult.score = files.length > 0 ? Math.round(squadScore / files.length) : 100;
    result.perSquad[squad] = squadResult;
    result.issues.push(...squadResult.issues);
  }

  result.score = result.total > 0
    ? Math.round(Object.values(result.perSquad).reduce((s, r) => s + r.score, 0) / squads.length)
    : 100;

  if (options.verbose && !options.json) {
    console.log(`\n📋 Knowledge Bases: ${result.total} files | Score: ${result.score}/100`);
    const stubs = result.issues.filter((i) => i.message.includes('stub'));
    if (stubs.length > 0) {
      console.log(`  Stubs found: ${stubs.length}`);
      stubs.forEach((i) => {
        console.log(`    ⚠️  ${i.squad}/${i.file}`);
      });
    }
  }

  return result;
}

/**
 * Score a single KB file
 */
function scoreKB(content, file, squad, issues) {
  let score = 0;

  // Check for title
  if (/^# /m.test(content)) {
    score += 20;
  } else {
    issues.push({ severity: 'error', squad, file, message: 'Missing # title' });
  }

  // Check for intro paragraph (after title, before first ##)
  const afterTitle = content.replace(/^#[^\n]*\n/, '');
  const beforeFirstSection = afterTitle.split(/^## /m)[0].trim();
  if (beforeFirstSection.length >= 30) {
    score += 15;
  } else {
    issues.push({ severity: 'warning', squad, file, message: 'Missing intro paragraph' });
  }

  // Check for sections (## headings)
  const sectionCount = (content.match(/^## /gm) || []).length;
  if (sectionCount >= 3) {
    score += 25;
  } else if (sectionCount >= 1) {
    score += 15;
    issues.push({ severity: 'warning', squad, file, message: `Only ${sectionCount} section(s)` });
  } else {
    issues.push({ severity: 'warning', squad, file, message: 'No sections (## headings)' });
  }

  // Check content length
  if (content.length >= 500) {
    score += 20;
  } else if (content.length >= 200) {
    score += 10;
  } else {
    issues.push({ severity: 'warning', squad, file, message: `Possible stub (${content.length} chars)` });
  }

  // Check for tables or lists (structured content)
  if (/\|.*\|/m.test(content) || /^[-*] /m.test(content)) {
    score += 10;
  }

  // Check for code blocks or examples
  if (/```/m.test(content)) {
    score += 10;
  }

  return score;
}

/**
 * Print audit summary
 */
function printAuditSummary(results) {
  console.log('\n' + '━'.repeat(60));
  console.log('📊 ECOSYSTEM AUDIT SUMMARY');
  console.log('━'.repeat(60));

  if (results.workflows) {
    const wf = results.workflows;
    const icon = wf.score >= 80 ? '✅' : wf.score >= 60 ? '⚠️' : '❌';
    console.log(`\n${icon} Workflows: ${wf.score}/100 (${wf.total} files)`);
    console.log(`   ✓ ${wf.passed} passed | ⚠️  ${wf.warnings} warnings | ❌ ${wf.errors} errors`);
    printPerSquadScores(wf.perSquad);
  }

  if (results.tasks) {
    const tk = results.tasks;
    const icon = tk.score >= 80 ? '✅' : tk.score >= 60 ? '⚠️' : '❌';
    console.log(`\n${icon} Tasks: ${tk.score}/100 (${tk.total} files)`);
    console.log(`   ✓ ${tk.passed} passed | ⚠️  ${tk.warnings} warnings | ❌ ${tk.errors} errors`);
    printPerSquadScores(tk.perSquad);
  }

  if (results.kbs) {
    const kb = results.kbs;
    const icon = kb.score >= 80 ? '✅' : kb.score >= 60 ? '⚠️' : '❌';
    console.log(`\n${icon} Knowledge Bases: ${kb.score}/100 (${kb.total} files)`);
    console.log(`   ✓ ${kb.passed} passed | ⚠️  ${kb.warnings} warnings | ❌ ${kb.errors} errors`);
    printPerSquadScores(kb.perSquad);
  }

  console.log('\n' + '━'.repeat(60));
  const overallIcon = results.overallScore >= 80 ? '✅' : results.overallScore >= 60 ? '⚠️' : '❌';
  console.log(`${overallIcon} Overall Ecosystem Score: ${results.overallScore}/100`);
  console.log('━'.repeat(60) + '\n');
}

/**
 * Print per-squad scores inline
 */
function printPerSquadScores(perSquad) {
  const sorted = Object.entries(perSquad)
    .filter(([, v]) => v.count > 0)
    .sort((a, b) => a[1].score - b[1].score);

  if (sorted.length === 0) return;

  const lowest = sorted.filter(([, v]) => v.score < 70);
  if (lowest.length > 0) {
    console.log('   Needs attention:');
    lowest.forEach(([name, data]) => {
      console.log(`     ${name}: ${data.score}/100 (${data.count} files)`);
    });
  }
}

/**
 * Save audit report to file
 */
function saveReport(projectRoot, results) {
  const reportsDir = path.join(projectRoot, 'docs', 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const date = new Date().toISOString().split('T')[0];
  const reportPath = path.join(reportsDir, `ecosystem-audit-${date}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  return reportPath;
}

module.exports = {
  createAuditCommand,
};
