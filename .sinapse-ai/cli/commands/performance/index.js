#!/usr/bin/env node
'use strict';

/**
 * sinapse performance — Squad & Agent Performance Ranking
 *
 * Analyzes squad and agent completeness, ranking by:
 * - Asset coverage (agents, tasks, KBs, workflows, templates, checklists)
 * - Metadata completeness
 * - Preferences tracking
 * - Orchestrator enrichment level
 *
 * Usage:
 *   sinapse performance              # Full ranking
 *   sinapse performance --json       # JSON output
 *   sinapse performance --top 5      # Top 5 only
 */

const fs = require('fs');
const path = require('path');

function findProjectRoot() {
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, '.sinapse-ai'))) return dir;
    dir = path.dirname(dir);
  }
  return process.cwd();
}

function analyzeSquad(squadDir, squadName) {
  const result = {
    name: squadName,
    agents: 0,
    tasks: 0,
    kbs: 0,
    workflows: 0,
    templates: 0,
    checklists: 0,
    hasMetadata: false,
    hasPreferences: false,
    orchestratorLines: 0,
    score: 0,
  };

  // Count assets
  const countMd = (subdir) => {
    const dir = path.join(squadDir, subdir);
    if (!fs.existsSync(dir)) return 0;
    return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).length;
  };

  const countAny = (subdir) => {
    const dir = path.join(squadDir, subdir);
    if (!fs.existsSync(dir)) return 0;
    return fs.readdirSync(dir).filter((f) => !f.startsWith('.')).length;
  };

  result.agents = countMd('agents');
  result.tasks = countMd('tasks');
  // Try both naming conventions
  result.kbs = countAny('knowledge-bases') || countAny('knowledge-base');
  result.workflows = countAny('workflows');
  result.templates = countMd('templates') || countAny('templates');
  result.checklists = countMd('checklists') || countAny('checklists');

  // Metadata check
  const yamlPath = path.join(squadDir, 'squad.yaml');
  if (fs.existsSync(yamlPath)) {
    const content = fs.readFileSync(yamlPath, 'utf8');
    result.hasMetadata = /agents_count|total_files/.test(content);
  }

  // Preferences check
  result.hasPreferences = fs.existsSync(path.join(squadDir, 'preferences'));

  // Orchestrator enrichment
  const orqxFile = fs.readdirSync(path.join(squadDir, 'agents')).find((f) => f.includes('-orqx'));
  if (orqxFile) {
    const content = fs.readFileSync(path.join(squadDir, 'agents', orqxFile), 'utf8');
    result.orchestratorLines = content.split('\n').length;
  }

  // Calculate score (weighted)
  result.score =
    (result.agents >= 6 ? 15 : result.agents * 2.5) +
    (result.tasks >= 50 ? 25 : result.tasks * 0.5) +
    (result.kbs >= 8 ? 15 : result.kbs * 1.875) +
    (result.workflows >= 3 ? 10 : result.workflows * 3.33) +
    (result.templates >= 3 ? 10 : result.templates * 3.33) +
    (result.checklists >= 2 ? 5 : result.checklists * 2.5) +
    (result.hasMetadata ? 5 : 0) +
    (result.hasPreferences ? 5 : 0) +
    (result.orchestratorLines >= 100 ? 10 : result.orchestratorLines * 0.1);

  result.score = Math.round(result.score * 10) / 10;

  return result;
}

async function runPerformance(options = {}) {
  const root = findProjectRoot();
  const squadsDir = path.join(root, 'squads');

  if (!fs.existsSync(squadsDir)) {
    console.error('No squads/ directory found.');
    process.exit(1);
  }

  const squadDirs = fs.readdirSync(squadsDir)
    .filter((d) => d.startsWith('squad-') && fs.statSync(path.join(squadsDir, d)).isDirectory());

  const rankings = squadDirs
    .map((d) => analyzeSquad(path.join(squadsDir, d), d))
    .sort((a, b) => b.score - a.score);

  const limit = options.top || rankings.length;
  const display = rankings.slice(0, limit);

  if (options.json) {
    console.log(JSON.stringify({ rankings: display, total: rankings.length }, null, 2));
    return;
  }

  // Pretty output
  console.log(`\n  SINAPSE Performance Ranking — ${rankings.length} Squads`);
  console.log(`  ${'═'.repeat(60)}\n`);

  const maxScore = rankings[0]?.score || 100;

  display.forEach((sq, i) => {
    const rank = i + 1;
    const barLen = Math.round((sq.score / maxScore) * 20);
    const bar = '█'.repeat(barLen) + '░'.repeat(20 - barLen);
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
    const meta = sq.hasMetadata ? '✓' : '✗';
    const pref = sq.hasPreferences ? '✓' : '✗';

    console.log(`  ${String(medal).padEnd(4)} ${sq.name.padEnd(25)} ${bar} ${sq.score.toFixed(1)}`);
    console.log(`       ${sq.agents}a ${sq.tasks}t ${sq.kbs}kb ${sq.workflows}wf ${sq.templates}tpl ${sq.checklists}ck | meta:${meta} pref:${pref} orqx:${sq.orchestratorLines}L`);
    console.log('');
  });
}

module.exports = { runPerformance };

if (require.main === module) {
  const args = process.argv.slice(2);
  const topIdx = args.indexOf('--top');
  runPerformance({
    json: args.includes('--json'),
    top: topIdx >= 0 ? parseInt(args[topIdx + 1], 10) : undefined,
  }).catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}
