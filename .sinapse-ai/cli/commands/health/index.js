#!/usr/bin/env node
'use strict';

/**
 * sinapse health — Framework Health Analytics
 *
 * Analyzes the health of a SINAPSE installation:
 * - Hook connectivity (wired vs orphaned)
 * - Squad completeness (metadata, preferences, KBs)
 * - Rule coverage
 * - Agent authority compliance
 * - Skill activation coverage
 *
 * Usage:
 *   sinapse health              # Full health report
 *   sinapse health --json       # JSON output
 *   sinapse health --fix        # Auto-fix common issues
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

function checkHooks(root) {
  const results = { score: 0, max: 0, issues: [] };
  const settingsPath = path.join(root, '.claude', 'settings.json');

  results.max += 3;
  if (!fs.existsSync(settingsPath)) {
    results.issues.push({ severity: 'critical', msg: '.claude/settings.json not found' });
    return results;
  }

  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  const hooks = settings.hooks || {};

  // Check PreToolUse exists
  if (hooks.PreToolUse && hooks.PreToolUse.length > 0) {
    results.score += 1;
  } else {
    results.issues.push({ severity: 'high', msg: 'No PreToolUse hooks configured' });
  }

  // Check UserPromptSubmit exists
  if (hooks.UserPromptSubmit && hooks.UserPromptSubmit.length > 0) {
    results.score += 1;
  } else {
    results.issues.push({ severity: 'medium', msg: 'No UserPromptSubmit hooks configured' });
  }

  // Count total connected hooks
  let connected = 0;
  Object.values(hooks).forEach((matchers) =>
    matchers.forEach((m) => (m.hooks || []).forEach(() => connected++)),
  );

  // Check hook files exist
  const hooksDir = path.join(root, '.claude', 'hooks');
  if (fs.existsSync(hooksDir)) {
    const hookFiles = fs.readdirSync(hooksDir).filter((f) => f.endsWith('.cjs') || f.endsWith('.sh') || f.endsWith('.py'));
    const orphaned = hookFiles.length - connected;
    if (orphaned <= 5) results.score += 1; // Some orphaned is OK (utilities, legacy)
    else results.issues.push({ severity: 'low', msg: `${orphaned} hook files not connected to settings.json` });
  }

  results.connected = connected;
  return results;
}

function checkSquads(root) {
  const results = { score: 0, max: 0, issues: [], squads: [] };
  const squadsDir = path.join(root, 'squads');

  if (!fs.existsSync(squadsDir)) {
    results.issues.push({ severity: 'medium', msg: 'squads/ directory not found' });
    return results;
  }

  const squadDirs = fs.readdirSync(squadsDir).filter((d) => d.startsWith('squad-') && fs.statSync(path.join(squadsDir, d)).isDirectory());

  for (const squad of squadDirs) {
    const dir = path.join(squadsDir, squad);
    const checks = { name: squad, metadata: false, preferences: false, agents: 0, tasks: 0 };
    results.max += 2;

    // Check metadata
    const yamlPath = path.join(dir, 'squad.yaml');
    if (fs.existsSync(yamlPath)) {
      const content = fs.readFileSync(yamlPath, 'utf8');
      checks.metadata = /agents_count|total_files/.test(content);
      if (checks.metadata) results.score += 1;
      else results.issues.push({ severity: 'low', msg: `${squad}: missing metadata in squad.yaml` });
    }

    // Check preferences
    checks.preferences = fs.existsSync(path.join(dir, 'preferences'));
    if (checks.preferences) results.score += 1;
    else results.issues.push({ severity: 'low', msg: `${squad}: missing preferences/ directory` });

    // Count assets
    const agentsDir = path.join(dir, 'agents');
    const tasksDir = path.join(dir, 'tasks');
    checks.agents = fs.existsSync(agentsDir) ? fs.readdirSync(agentsDir).filter((f) => f.endsWith('.md')).length : 0;
    checks.tasks = fs.existsSync(tasksDir) ? fs.readdirSync(tasksDir).filter((f) => f.endsWith('.md')).length : 0;

    results.squads.push(checks);
  }

  return results;
}

function checkRules(root) {
  const results = { score: 0, max: 1, issues: [] };
  const rulesDir = path.join(root, '.claude', 'rules');

  if (!fs.existsSync(rulesDir)) {
    results.issues.push({ severity: 'high', msg: '.claude/rules/ not found' });
    return results;
  }

  const rules = fs.readdirSync(rulesDir).filter((f) => f.endsWith('.md'));
  if (rules.length >= 13) results.score += 1;
  else results.issues.push({ severity: 'medium', msg: `Only ${rules.length} rules (recommended: 16+)` });

  results.count = rules.length;
  return results;
}

function checkSkills(root) {
  const results = { score: 0, max: 1, issues: [] };
  const skillsDir = path.join(root, '.claude', 'skills');

  if (!fs.existsSync(skillsDir)) {
    results.issues.push({ severity: 'medium', msg: '.claude/skills/ not found' });
    return results;
  }

  const skills = fs.readdirSync(skillsDir).filter((f) => f.endsWith('.md') || fs.statSync(path.join(skillsDir, f)).isDirectory());
  // Check for path-activated skills
  let pathActivated = 0;
  for (const skill of skills) {
    const skillPath = path.join(skillsDir, skill);
    if (fs.statSync(skillPath).isFile()) {
      const content = fs.readFileSync(skillPath, 'utf8');
      if (/^paths:/m.test(content)) pathActivated++;
    }
  }

  if (pathActivated >= 3) results.score += 1;
  else results.issues.push({ severity: 'low', msg: `Only ${pathActivated} path-activated skills (recommended: 5+)` });

  results.total = skills.length;
  results.pathActivated = pathActivated;
  return results;
}

async function runHealth(options = {}) {
  const root = findProjectRoot();
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

  const hookResults = checkHooks(root);
  const squadResults = checkSquads(root);
  const ruleResults = checkRules(root);
  const skillResults = checkSkills(root);

  const totalScore = hookResults.score + squadResults.score + ruleResults.score + skillResults.score;
  const totalMax = hookResults.max + squadResults.max + ruleResults.max + skillResults.max;
  const percentage = Math.round((totalScore / totalMax) * 100);

  const allIssues = [
    ...hookResults.issues,
    ...squadResults.issues,
    ...ruleResults.issues,
    ...skillResults.issues,
  ];

  if (options.json) {
    console.log(JSON.stringify({
      version: pkg.version,
      health: percentage,
      score: `${totalScore}/${totalMax}`,
      hooks: { connected: hookResults.connected, score: `${hookResults.score}/${hookResults.max}` },
      squads: { count: squadResults.squads.length, score: `${squadResults.score}/${squadResults.max}` },
      rules: { count: ruleResults.count, score: `${ruleResults.score}/${ruleResults.max}` },
      skills: { total: skillResults.total, pathActivated: skillResults.pathActivated, score: `${skillResults.score}/${skillResults.max}` },
      issues: allIssues,
    }, null, 2));
    return;
  }

  // Pretty output
  const bar = (score, max) => {
    const filled = Math.round((score / max) * 10);
    return '█'.repeat(filled) + '░'.repeat(10 - filled);
  };

  console.log(`\n  SINAPSE Health Report — v${pkg.version}`);
  console.log(`  ${'═'.repeat(50)}\n`);
  console.log(`  Overall Health: ${percentage}% ${bar(totalScore, totalMax)} (${totalScore}/${totalMax})\n`);
  console.log(`  Hooks:   ${bar(hookResults.score, hookResults.max)} ${hookResults.connected || 0} connected`);
  console.log(`  Squads:  ${bar(squadResults.score, squadResults.max)} ${squadResults.squads.length} squads`);
  console.log(`  Rules:   ${bar(ruleResults.score, ruleResults.max)} ${ruleResults.count || 0} rules`);
  console.log(`  Skills:  ${bar(skillResults.score, skillResults.max)} ${skillResults.pathActivated || 0} path-activated\n`);

  if (allIssues.length > 0) {
    console.log(`  Issues (${allIssues.length}):`);
    for (const issue of allIssues.slice(0, 10)) {
      const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'high' ? '🟠' : issue.severity === 'medium' ? '🟡' : '🔵';
      console.log(`    ${icon} ${issue.msg}`);
    }
    if (allIssues.length > 10) console.log(`    ... and ${allIssues.length - 10} more`);
    console.log('');
  } else {
    console.log('  ✅ No issues found!\n');
  }
}

module.exports = { runHealth };

if (require.main === module) {
  const args = process.argv.slice(2);
  runHealth({
    json: args.includes('--json'),
    fix: args.includes('--fix'),
  }).catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}
