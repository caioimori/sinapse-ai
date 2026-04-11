#!/usr/bin/env node
/**
 * setup-project-infra.js — Apply gitflow & infrastructure templates to a project
 *
 * Checks which templates are missing from the target project and copies only
 * missing ones (never overwrites). Run via: sinapse setup-infra [target-dir]
 */

const fs = require('fs');
const path = require('path');

const C = {
  reset: '\x1b[0m', green: '\x1b[32m', yellow: '\x1b[33m',
  cyan: '\x1b[36m', bold: '\x1b[1m',
};

function log(color, symbol, msg) {
  console.log(`${color}${symbol} ${msg}${C.reset}`);
}

const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates');

// Mapping: template source -> project destination
const TEMPLATE_MAP = [
  // GitHub templates
  { src: 'github/PULL_REQUEST_TEMPLATE.md', dest: '.github/PULL_REQUEST_TEMPLATE.md' },
  { src: 'github/issue-templates/bug_report.md', dest: '.github/ISSUE_TEMPLATE/bug_report.md' },
  { src: 'github/issue-templates/feature_request.md', dest: '.github/ISSUE_TEMPLATE/feature_request.md' },
  { src: 'github/ci-template.yml', dest: '.github/workflows/ci.yml' },
  { src: 'github/CODEOWNERS.template', dest: '.github/CODEOWNERS', transform: true },
  // Config templates
  { src: 'config/env.example', dest: '.env.example' },
];

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function detectProjectName(targetDir) {
  const pkgPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try { return JSON.parse(fs.readFileSync(pkgPath, 'utf-8')).name || path.basename(targetDir); }
    catch { /* fall through */ }
  }
  return path.basename(targetDir);
}

function detectMaintainer(targetDir) {
  try {
    const { execSync } = require('child_process');
    const name = execSync('git config user.name', { cwd: targetDir, encoding: 'utf-8' }).trim();
    return name.toLowerCase().replace(/\s+/g, '') || 'maintainer';
  } catch { return 'maintainer'; }
}

function applyGitignoreAdditions(targetDir) {
  const additions = fs.readFileSync(path.join(TEMPLATES_DIR, 'config', 'gitignore-additions.tmpl'), 'utf-8');
  const gitignorePath = path.join(targetDir, '.gitignore');
  const marker = '# SINAPSE Project Ignores';

  if (fs.existsSync(gitignorePath)) {
    const existing = fs.readFileSync(gitignorePath, 'utf-8');
    if (existing.includes(marker)) {
      log(C.yellow, '[SKIP]', '.gitignore already has SINAPSE patterns');
      return;
    }
    fs.appendFileSync(gitignorePath, '\n' + additions);
    log(C.green, '[ADD]', '.gitignore updated with SINAPSE patterns');
  } else {
    fs.writeFileSync(gitignorePath, additions);
    log(C.green, '[NEW]', '.gitignore created');
  }
}

function run(targetDir) {
  targetDir = path.resolve(targetDir || process.cwd());
  const projectName = detectProjectName(targetDir);
  const maintainer = detectMaintainer(targetDir);

  console.log(`\n${C.cyan}${C.bold}=== SINAPSE Project Infrastructure Setup ===${C.reset}`);
  console.log(`Target:     ${targetDir}`);
  console.log(`Project:    ${projectName}`);
  console.log(`Maintainer: ${maintainer}\n`);

  let added = 0, skipped = 0;

  for (const entry of TEMPLATE_MAP) {
    const destPath = path.join(targetDir, entry.dest);

    if (fs.existsSync(destPath)) {
      log(C.yellow, '[SKIP]', `${entry.dest} (already exists)`);
      skipped++;
      continue;
    }

    ensureDir(destPath);
    let content = fs.readFileSync(path.join(TEMPLATES_DIR, entry.src), 'utf-8');

    if (entry.transform) {
      content = content
        .replace(/\{\{PROJECT_NAME\}\}/g, projectName)
        .replace(/\{\{MAINTAINER\}\}/g, maintainer);
    }

    // Replace common variables in all templates
    content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
    content = content.replace(/\{\{NODE_VERSION\}\}/g, '20');

    fs.writeFileSync(destPath, content);
    log(C.green, '[ADD]', entry.dest);
    added++;
  }

  // Handle .gitignore separately (merge, don't overwrite)
  applyGitignoreAdditions(targetDir);

  console.log(`\n${C.cyan}${C.bold}=== Summary ===${C.reset}`);
  console.log(`Added: ${added} | Skipped: ${skipped}`);
  console.log(`\nRun again safely anytime — existing files are never overwritten.\n`);
}

// CLI entry
if (require.main === module) {
  run(process.argv[2]);
}

module.exports = { run };
