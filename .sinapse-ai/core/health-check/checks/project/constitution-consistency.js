/**
 * Constitution Consistency Check
 *
 * Deep validation that Constitution articles are consistent across
 * all framework documents: constitution.md, generated domain file,
 * CLAUDE.md, AGENTS.md, templates, and rule files.
 *
 * @module sinapse-ai/health-check/checks/project/constitution-consistency
 * @version 1.0.0
 * @constitution Article VII - Ecosystem Metrics Accuracy
 */

const fs = require('fs');
const path = require('path');
const { BaseCheck, CheckSeverity, CheckDomain } = require('../../base-check');

/**
 * Expected articles in Constitution v2.0.0
 * Source of truth: .sinapse-ai/constitution.md
 */
const EXPECTED_ARTICLES = [
  { number: 'I', title: 'CLI First', severity: 'NON-NEGOTIABLE' },
  { number: 'II', title: 'Agent Authority', severity: 'NON-NEGOTIABLE' },
  { number: 'III', title: 'Documentation-First Development', severity: 'NON-NEGOTIABLE' },
  { number: 'IV', title: 'No Invention', severity: 'MUST' },
  { number: 'V', title: 'Quality First', severity: 'MUST' },
  { number: 'VI', title: 'Absolute Imports', severity: 'SHOULD' },
  { number: 'VII', title: 'Ecosystem Metrics Accuracy', severity: 'NON-NEGOTIABLE' },
  { number: 'VIII', title: 'Mandatory Delegation', severity: 'NON-NEGOTIABLE' },
  { number: 'IX', title: 'Safe Collaboration', severity: 'NON-NEGOTIABLE' },
  { number: 'X', title: 'Security & Data Protection', severity: 'NON-NEGOTIABLE' },
];

/**
 * Files that MUST reference the Constitution articles
 */
const CONSTITUTION_CONSUMERS = [
  { path: '.claude/CLAUDE.md', label: 'Project CLAUDE.md' },
  { path: 'AGENTS.md', label: 'AGENTS.md' },
  { path: '.synapse/constitution', label: 'Generated Constitution Domain' },
];

/**
 * Rule files required for NON-NEGOTIABLE articles
 */
const REQUIRED_RULE_FILES = [
  { article: 'III', file: '.claude/rules/documentation-first.md' },
  { article: 'VIII', file: '.claude/rules/mandatory-delegation.md' },
];

class ConstitutionConsistencyCheck extends BaseCheck {
  constructor() {
    super({
      id: 'constitution-consistency',
      name: 'Constitution Consistency',
      description: 'Validates Constitution articles are consistent across all framework documents',
      domain: CheckDomain.PROJECT,
      severity: CheckSeverity.HIGH,
      timeout: 10000,
      cacheable: true,
      tags: ['constitution', 'deep', 'consistency'],
    });
  }

  async execute(context) {
    const projectRoot = context.projectRoot || process.cwd();
    const issues = [];
    const details = { checked: [], issues: [] };

    // Check 1: Constitution source exists
    const constitutionPath = path.join(projectRoot, '.sinapse-ai', 'constitution.md');
    if (!fs.existsSync(constitutionPath)) {
      return this.fail('Constitution source file not found', {
        recommendation: 'Run sinapse install to restore .sinapse-ai/constitution.md',
      });
    }
    details.checked.push('constitution.md exists');

    const constitutionContent = fs.readFileSync(constitutionPath, 'utf8');

    // Check 2: All expected articles exist in source
    for (const article of EXPECTED_ARTICLES) {
      const pattern = new RegExp(`### ${article.number}\\..*${article.title}.*\\(${article.severity}\\)`, 'i');
      if (!pattern.test(constitutionContent)) {
        issues.push(`Article ${article.number} (${article.title}) not found or severity mismatch in constitution.md`);
      }
    }
    details.checked.push('Article presence in source');

    // Check 3: Consumer documents reference articles correctly
    for (const consumer of CONSTITUTION_CONSUMERS) {
      const filePath = path.join(projectRoot, consumer.path);
      if (!fs.existsSync(filePath)) {
        issues.push(`${consumer.label} not found at ${consumer.path}`);
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf8');

      // Check that key article titles appear
      for (const article of EXPECTED_ARTICLES) {
        if (!content.includes(article.title)) {
          issues.push(`${consumer.label} missing reference to "${article.title}"`);
        }
      }
    }
    details.checked.push('Consumer document references');

    // Check 4: Required rule files exist for NON-NEGOTIABLE articles
    for (const rule of REQUIRED_RULE_FILES) {
      const rulePath = path.join(projectRoot, rule.file);
      if (!fs.existsSync(rulePath)) {
        issues.push(`Rule file missing for Article ${rule.article}: ${rule.file}`);
      }
    }
    details.checked.push('Rule files for NON-NEGOTIABLE articles');

    // Check 5: Generated constitution domain file is up-to-date
    const generatedPath = path.join(projectRoot, '.synapse', 'constitution');
    if (fs.existsSync(generatedPath)) {
      const generatedContent = fs.readFileSync(generatedPath, 'utf8');

      for (const article of EXPECTED_ARTICLES) {
        const key = `CONSTITUTION_RULE_ART${EXPECTED_ARTICLES.indexOf(article) + 1}_0`;
        if (!generatedContent.includes(article.title)) {
          issues.push(`Generated constitution missing Article "${article.title}". Run generate-constitution.js`);
        }
      }
    } else {
      issues.push('Generated constitution domain file not found at .synapse/constitution');
    }
    details.checked.push('Generated domain file freshness');

    // Result
    details.issues = issues;
    details.totalChecks = details.checked.length;
    details.totalIssues = issues.length;

    if (issues.length === 0) {
      return this.pass(`Constitution consistent across ${details.totalChecks} validation points`, details);
    }

    if (issues.length <= 2) {
      return this.warn(`${issues.length} minor consistency issue(s) found`, {
        details,
        recommendation: issues.join('; '),
      });
    }

    return this.fail(`${issues.length} consistency issues found across Constitution references`, {
      details,
      recommendation: 'Run sinapse doctor --fix to regenerate constitution and sync documents',
      healable: true,
      healingTier: 2,
    });
  }
}

module.exports = ConstitutionConsistencyCheck;
