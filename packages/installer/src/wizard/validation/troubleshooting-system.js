/**
 * Troubleshooting System
 * Task 1.8.6: Provides actionable troubleshooting for errors
 *
 * Story onda2-p6 (AF-20260702 item 2.9) — migrated to i18n (PT+EN), following
 * the pattern established in the sibling module report-generator.js (100% i18n).
 *
 * @module wizard/validation/troubleshooting-system
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const { t, tf, tList } = require('../i18n');

// Canonical repo + docs locations. The legacy `docs.SinapseAI.com` domain never
// existed; every help link points at real, shipped docs in the GitHub repo
// (see package.json "bugs"/"repository").
const REPO_URL = 'https://github.com/caioimori/sinapse-ai';
const DOCS_BASE = `${REPO_URL}/blob/main/docs`;

/**
 * Troubleshooting database
 * Maps error codes to detailed troubleshooting information.
 *
 * `problemKey`/`causesKey`/`solutionsKey` point at i18n.js entries (resolved
 * at display time via t()/tList(), so the active language always wins).
 * `docs` and `priority` are not natural-language content — left as-is.
 */
const TROUBLESHOOTING_DATABASE = {
  ENV_FILE_MISSING: {
    problemKey: 'troubleshootEnvFileMissingProblem',
    causesKey: 'troubleshootEnvFileMissingCauses',
    solutionsKey: 'troubleshootEnvFileMissingSolutions',
    docs: `${DOCS_BASE}/installation/troubleshooting.md`,
    priority: 'critical',
  },

  CORE_CONFIG_MISSING: {
    problemKey: 'troubleshootCoreConfigMissingProblem',
    causesKey: 'troubleshootCoreConfigMissingCauses',
    solutionsKey: 'troubleshootCoreConfigMissingSolutions',
    docs: `${DOCS_BASE}/troubleshooting.md`,
    priority: 'high',
  },

  MCP_HEALTH_CHECK_FAILED: {
    problemKey: 'troubleshootMcpHealthCheckFailedProblem',
    causesKey: 'troubleshootMcpHealthCheckFailedCauses',
    solutionsKey: 'troubleshootMcpHealthCheckFailedSolutions',
    docs: `${DOCS_BASE}/troubleshooting.md`,
    priority: 'medium',
  },

  ALL_MCP_HEALTH_CHECKS_FAILED: {
    problemKey: 'troubleshootAllMcpHealthChecksFailedProblem',
    causesKey: 'troubleshootAllMcpHealthChecksFailedCauses',
    solutionsKey: 'troubleshootAllMcpHealthChecksFailedSolutions',
    docs: `${DOCS_BASE}/troubleshooting.md`,
    priority: 'high',
  },

  GITIGNORE_CRITICAL_MISSING: {
    problemKey: 'troubleshootGitignoreCriticalMissingProblem',
    causesKey: 'troubleshootGitignoreCriticalMissingCauses',
    solutionsKey: 'troubleshootGitignoreCriticalMissingSolutions',
    docs: `${DOCS_BASE}/security/security-best-practices.md`,
    priority: 'high',
  },

  DEPS_INSTALL_FAILED: {
    problemKey: 'troubleshootDepsInstallFailedProblem',
    causesKey: 'troubleshootDepsInstallFailedCauses',
    solutionsKey: 'troubleshootDepsInstallFailedSolutions',
    docs: `${DOCS_BASE}/installation/troubleshooting.md`,
    priority: 'critical',
  },

  CRITICAL_DEPS_MISSING: {
    problemKey: 'troubleshootCriticalDepsMissingProblem',
    causesKey: 'troubleshootCriticalDepsMissingCauses',
    solutionsKey: 'troubleshootCriticalDepsMissingSolutions',
    docs: `${DOCS_BASE}/installation/troubleshooting.md`,
    priority: 'high',
  },

  VULNERABILITIES_FOUND: {
    problemKey: 'troubleshootVulnerabilitiesFoundProblem',
    causesKey: 'troubleshootVulnerabilitiesFoundCauses',
    solutionsKey: 'troubleshootVulnerabilitiesFoundSolutions',
    docs: 'https://docs.npmjs.com/cli/v8/commands/npm-audit',
    priority: 'medium',
  },

  ENV_PERMISSIONS_INSECURE: {
    problemKey: 'troubleshootEnvPermissionsInsecureProblem',
    causesKey: 'troubleshootEnvPermissionsInsecureCauses',
    solutionsKey: 'troubleshootEnvPermissionsInsecureSolutions',
    docs: `${DOCS_BASE}/security/security-best-practices.md`,
    priority: 'medium',
  },
};

/**
 * Offer troubleshooting for errors
 *
 * @param {Array} errors - Array of error objects
 */
async function offerTroubleshooting(errors) {
  if (!errors || errors.length === 0) {
    return;
  }

  console.log('');
  console.log(chalk.bold.cyan('═══════════════════════════════════════════════'));
  console.log(chalk.bold.cyan('🔧 ' + t('troubleshootGuideTitle')));
  console.log(chalk.bold.cyan('═══════════════════════════════════════════════'));
  console.log('');

  // Group errors by code
  const errorsByCode = {};
  errors.forEach(error => {
    const code = error.code || 'UNKNOWN';
    if (!errorsByCode[code]) {
      errorsByCode[code] = [];
    }
    errorsByCode[code].push(error);
  });

  // Sort by priority
  const errorCodes = Object.keys(errorsByCode).sort((a, b) => {
    const priorityA = TROUBLESHOOTING_DATABASE[a]?.priority || 'low';
    const priorityB = TROUBLESHOOTING_DATABASE[b]?.priority || 'low';
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[priorityA] - priorityOrder[priorityB];
  });

  // Display troubleshooting for each error code
  for (const code of errorCodes) {
    const errorInstances = errorsByCode[code];
    const troubleshooting = TROUBLESHOOTING_DATABASE[code];

    if (troubleshooting) {
      displayTroubleshooting(code, troubleshooting, errorInstances);
    } else {
      displayGenericTroubleshooting(code, errorInstances);
    }
  }

  // Ask if user wants to see full logs
  const { viewLogs } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'viewLogs',
      message: t('troubleshootViewLogsPrompt'),
      default: false,
    },
  ]);

  if (viewLogs) {
    console.log('');
    console.log(chalk.bold('📄 ' + t('troubleshootInstallationLogsTitle')));
    console.log(chalk.dim('  - .sinapse/install-log.txt'));
    console.log(chalk.dim('  - .sinapse/install-errors.log'));
    console.log('');
    console.log(chalk.dim(t('troubleshootViewWithCat')));
  }

  // Offer to open documentation
  const { openDocs } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'openDocs',
      message: t('troubleshootOpenDocsPrompt'),
      default: false,
    },
  ]);

  if (openDocs) {
    console.log('');
    console.log(chalk.green('📚 ' + t('troubleshootDocumentationTitle')));
    console.log(chalk.green(`  ${DOCS_BASE}/troubleshooting.md`));
    console.log('');
  }

  // Offer support contact
  console.log('');
  console.log(chalk.bold('💬 ' + t('troubleshootNeedHelpTitle')));
  console.log(chalk.dim(`  - ${tf('troubleshootGithubIssuesLine', { url: `${REPO_URL}/issues` })}`));
  console.log(chalk.dim(`  - ${tf('troubleshootDocumentationLine', { url: `${DOCS_BASE}/troubleshooting.md` })}`));
  console.log('');
}

/**
 * Display troubleshooting for a specific error
 * @private
 */
function displayTroubleshooting(code, troubleshooting, errorInstances) {
  const priorityIcon = {
    critical: chalk.red('🔴'),
    high: chalk.yellow('🟡'),
    medium: chalk.blue('🔵'),
    low: chalk.gray('⚪'),
  }[troubleshooting.priority] || '⚪';

  console.log(chalk.bold(`${priorityIcon} ${t(troubleshooting.problemKey)}`));
  console.log('');

  // Show affected items
  if (errorInstances.length > 1) {
    console.log(chalk.dim(tf('troubleshootAffectedItems', { count: errorInstances.length })));
    errorInstances.slice(0, 3).forEach(err => {
      if (err.file) {
        console.log(chalk.dim(`  - ${err.file}`));
      } else if (err.mcp) {
        console.log(chalk.dim(`  - ${err.mcp}`));
      }
    });
    if (errorInstances.length > 3) {
      console.log(chalk.dim(tf('troubleshootAndMore', { count: errorInstances.length - 3 })));
    }
    console.log('');
  }

  // Show causes
  const causes = tList(troubleshooting.causesKey);
  if (causes.length > 0) {
    console.log(chalk.bold(t('troubleshootPossibleCauses')));
    causes.forEach((cause, i) => {
      console.log(`  ${i + 1}. ${cause}`);
    });
    console.log('');
  }

  // Show solutions
  console.log(chalk.bold.green(t('troubleshootSolutionsHeading')));
  tList(troubleshooting.solutionsKey).forEach((solution, i) => {
    console.log(chalk.green(`  ${i + 1}. ${solution}`));
  });
  console.log('');

  // Show documentation link
  if (troubleshooting.docs) {
    console.log(chalk.dim('📖 ' + tf('troubleshootDocsLine', { url: troubleshooting.docs })));
    console.log('');
  }

  console.log(chalk.dim('─────────────────────────────────────────────────'));
  console.log('');
}

/**
 * Display generic troubleshooting
 * @private
 */
function displayGenericTroubleshooting(code, errorInstances) {
  console.log(chalk.bold(`⚠️  ${code}`));
  console.log('');

  errorInstances.forEach(err => {
    console.log(`  ${err.message}`);
    if (err.solution) {
      console.log(chalk.green(`  → ${err.solution}`));
    }
  });

  console.log('');
  console.log(chalk.bold.green(t('troubleshootGeneralSolutions')));
  console.log(chalk.green('  ' + t('troubleshootGeneralSolution1')));
  console.log(chalk.green('  ' + t('troubleshootGeneralSolution2')));
  console.log(chalk.green('  ' + t('troubleshootGeneralSolution3')));
  console.log(chalk.green('  ' + t('troubleshootGeneralSolution4')));
  console.log('');

  console.log(chalk.dim('─────────────────────────────────────────────────'));
  console.log('');
}

module.exports = {
  offerTroubleshooting,
  TROUBLESHOOTING_DATABASE,
};
