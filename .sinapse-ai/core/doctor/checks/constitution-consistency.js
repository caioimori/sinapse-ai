/**
 * Doctor Check: Constitution Consistency
 *
 * Deep validation that Constitution articles are consistent across
 * all framework documents. Checks source, generated domain, CLAUDE.md,
 * AGENTS.md, and required rule files.
 *
 * @module sinapse-ai/doctor/checks/constitution-consistency
 * @constitution Article VII - Ecosystem Metrics Accuracy
 * @tag deep
 */

const path = require('path');
const fs = require('fs');

const name = 'constitution-consistency';

/**
 * Articles that MUST appear in consumer documents
 * Key articles only — we check titles, not full content
 */
const KEY_ARTICLES = [
  'CLI First',
  'Agent Authority',
  'Documentation-First Development',
  'No Invention',
  'Quality First',
  'Absolute Imports',
  'Ecosystem Metrics Accuracy',
  'Mandatory Delegation',
];

/**
 * Files that should reference Constitution articles
 */
const CONSUMER_FILES = [
  '.claude/CLAUDE.md',
  'AGENTS.md',
  '.synapse/constitution',
];

/**
 * Rule files required for NON-NEGOTIABLE articles
 */
const REQUIRED_RULES = [
  '.claude/rules/documentation-first.md',
  '.claude/rules/mandatory-delegation.md',
];

async function run(context) {
  const root = context.projectRoot;
  const issues = [];

  // Check 1: Constitution source exists
  const srcPath = path.join(root, '.sinapse-ai', 'constitution.md');
  if (!fs.existsSync(srcPath)) {
    return {
      check: name,
      status: 'FAIL',
      message: 'Constitution source not found at .sinapse-ai/constitution.md',
      fixCommand: 'sinapse install',
    };
  }

  const srcContent = fs.readFileSync(srcPath, 'utf8');

  // Check 2: All key articles present in source
  for (const article of KEY_ARTICLES) {
    if (!srcContent.includes(article)) {
      issues.push(`Source missing article: "${article}"`);
    }
  }

  // Check 3: Consumer files reference articles
  for (const relPath of CONSUMER_FILES) {
    const filePath = path.join(root, relPath);
    if (!fs.existsSync(filePath)) {
      issues.push(`Consumer file missing: ${relPath}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    for (const article of KEY_ARTICLES) {
      if (!content.includes(article)) {
        issues.push(`${relPath} missing "${article}"`);
      }
    }
  }

  // Check 4: Required rule files exist
  for (const rulePath of REQUIRED_RULES) {
    const fullPath = path.join(root, rulePath);
    if (!fs.existsSync(fullPath)) {
      issues.push(`Required rule file missing: ${rulePath}`);
    }
  }

  // Result
  if (issues.length === 0) {
    return {
      check: name,
      status: 'PASS',
      message: `Constitution consistent (${KEY_ARTICLES.length} articles, ${CONSUMER_FILES.length} consumers, ${REQUIRED_RULES.length} rules)`,
      fixCommand: null,
    };
  }

  return {
    check: name,
    status: issues.length <= 2 ? 'WARN' : 'FAIL',
    message: `${issues.length} consistency issue(s): ${issues.slice(0, 3).join('; ')}${issues.length > 3 ? ` (+${issues.length - 3} more)` : ''}`,
    fixCommand: 'sinapse doctor --fix',
  };
}

module.exports = { name, run };
