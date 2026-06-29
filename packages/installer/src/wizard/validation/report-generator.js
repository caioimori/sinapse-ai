/**
 * Validation Report Generator
 * Task 1.8.5: Generates comprehensive validation report
 *
 * @module wizard/validation/report-generator
 */

const chalk = require('chalk');
const { t, tf } = require('../i18n');

/**
 * Generate formatted validation report
 *
 * @param {Object} validationResults - Results from validateInstallation
 * @returns {Promise<string>} Formatted report
 */
async function generateReport(validationResults) {
  const lines = [];

  // Header
  lines.push('');
  lines.push(chalk.bold.cyan('═══════════════════════════════════════════════'));
  lines.push(chalk.bold.cyan('🔍 ' + t('reportTitle')));
  lines.push(chalk.bold.cyan('═══════════════════════════════════════════════'));
  lines.push('');

  // File Structure Section
  if (validationResults.components.files) {
    const fileResults = validationResults.components.files;
    lines.push(formatComponentSection(t('reportIdeConfig'), fileResults, 'IDE Config'));
    lines.push(formatComponentSection(t('reportEnvConfig'), fileResults, 'Environment'));
    lines.push(formatComponentSection(t('reportCoreConfig'), fileResults, 'Core Config'));
    if (fileResults.checks.some((c) => c.component === 'MCP Config')) {
      lines.push(formatComponentSection(t('reportMcpConfig'), fileResults, 'MCP Config'));
    }
  }

  // MCP Health Checks Section
  if (validationResults.components.mcps && validationResults.components.mcps.healthChecks) {
    lines.push(formatMCPSection(validationResults.components.mcps));
  }

  // Dependencies Section
  if (validationResults.components.dependencies) {
    lines.push(formatDependenciesSection(validationResults.components.dependencies));
  }

  // Overall Status
  lines.push('');
  lines.push(chalk.bold('═══════════════════════════════════════════════'));
  lines.push(formatOverallStatus(validationResults));
  lines.push(chalk.bold('═══════════════════════════════════════════════'));

  // Warnings Section - only show high severity warnings
  const importantWarnings = validationResults.warnings.filter(
    (w) => w.severity === 'high' || w.severity === 'critical',
  );
  if (importantWarnings.length > 0) {
    lines.push('');
    lines.push(chalk.bold.yellow('⚠️  ' + tf('reportWarnings', { count: importantWarnings.length })));
    importantWarnings.forEach((warning) => {
      lines.push(chalk.yellow(`  - ${warning.message}`));
      if (warning.solution) {
        lines.push(chalk.dim('    ' + tf('reportSolution', { solution: warning.solution })));
      }
    });
  }

  // Errors Section
  if (validationResults.errors.length > 0) {
    lines.push('');
    lines.push(chalk.bold.red('❌ ' + tf('reportErrors', { count: validationResults.errors.length })));
    validationResults.errors.forEach((error) => {
      lines.push(chalk.red(`  - ${error.message}`));
      if (error.solution) {
        lines.push(chalk.dim('    ' + tf('reportSolution', { solution: error.solution })));
      }
    });
  }

  // Next Steps - only show for errors
  if (
    validationResults.overallStatus === 'partial' ||
    validationResults.overallStatus === 'failed'
  ) {
    lines.push('');
    lines.push(chalk.bold.red('❌ ' + t('reportNextSteps')));
    lines.push(chalk.red('  ' + t('reportNextStep1')));
    lines.push(chalk.red('  ' + t('reportNextStep2')));
    lines.push(chalk.red('  ' + t('reportNextStep3')));
  }
  // Success cases show completion message in showCompletion()

  lines.push('');

  return lines.join('\n');
}

/**
 * Format a component section
 * @private
 */
function formatComponentSection(title, componentResults, componentName) {
  const checks = componentResults.checks.filter((c) => c.component === componentName);

  if (checks.length === 0) return '';

  const passed = checks.filter((c) => c.status === 'success').length;
  const total = checks.length;
  const allSuccess = passed === total;
  const icon = allSuccess ? chalk.green('✅') : chalk.yellow('⚠️');

  const lines = [`${icon} ${chalk.bold(title)}: ${tf('reportChecksPassed', { passed, total })}`];

  // Only show individual checks if there are failures
  if (!allSuccess) {
    checks
      .filter((c) => c.status !== 'success')
      .forEach((check) => {
        const message = check.file ? `${check.message} (${check.file})` : check.message;
        lines.push(`  ${chalk.yellow('⚠')} ${message}`);
      });
  }

  lines.push('');

  return lines.join('\n');
}

/**
 * Format MCP section
 * @private
 */
function formatMCPSection(mcpResults) {
  const healthChecks = mcpResults.healthChecks;

  if (!healthChecks || healthChecks.length === 0) {
    return chalk.dim('  ' + t('reportMcpsNotInstalled') + '\n');
  }

  const totalMCPs = healthChecks.length;
  const healthyMCPs = healthChecks.filter((h) => h.status === 'success').length;
  const warningMCPs = healthChecks.filter((h) => h.status === 'warning').length;
  const failedMCPs = healthChecks.filter((h) => h.status === 'failed').length;

  const icon =
    healthyMCPs === totalMCPs
      ? chalk.green('✅')
      : healthyMCPs > 0
        ? chalk.yellow('⚠️')
        : chalk.red('❌');

  const lines = [
    `${icon} ${chalk.bold(t('reportMcpInstallation'))} (${healthyMCPs}/${totalMCPs} ${t('reportMcpHealthy')}${warningMCPs > 0 ? `, ${warningMCPs} ${t('reportMcpWarnings')}` : ''}${failedMCPs > 0 ? `, ${failedMCPs} ${t('reportMcpFailed')}` : ''})`,
  ];

  healthChecks.forEach((health) => {
    let statusIcon, statusText;

    switch (health.status) {
      case 'success':
        statusIcon = chalk.green('✓');
        statusText = chalk.green(health.message);
        break;
      case 'warning':
        statusIcon = chalk.yellow('⚠');
        statusText = chalk.yellow(health.message);
        break;
      case 'failed':
        statusIcon = chalk.red('✗');
        statusText = chalk.red(health.message);
        break;
      case 'skipped':
        statusIcon = chalk.dim('-');
        statusText = chalk.dim(health.message);
        break;
      default:
        statusIcon = '?';
        statusText = health.message;
    }

    const responseTime = health.responseTime ? chalk.dim(` (${health.responseTime}ms)`) : '';

    lines.push(`  ${statusIcon} ${health.mcp} - ${statusText}${responseTime}`);
  });

  lines.push('');

  return lines.join('\n');
}

/**
 * Format dependencies section
 * @private
 */
function formatDependenciesSection(depsResults) {
  const allSuccess = depsResults.checks.every(
    (c) => c.status === 'success' || c.status === 'skipped',
  );
  const icon = allSuccess ? chalk.green('✅') : chalk.yellow('⚠️');

  const lines = [`${icon} ${chalk.bold(t('reportDependencies'))}`];

  depsResults.checks.forEach((check) => {
    let statusIcon, statusText;

    switch (check.status) {
      case 'success':
        statusIcon = chalk.green('✓');
        statusText = check.message;
        break;
      case 'skipped':
        statusIcon = chalk.dim('-');
        statusText = chalk.dim(check.message);
        break;
      default:
        statusIcon = chalk.yellow('⚠');
        statusText = check.message;
    }

    lines.push(`  ${statusIcon} ${check.component}: ${statusText}`);
  });

  lines.push('');

  return lines.join('\n');
}

/**
 * Format overall status
 * @private
 */
function formatOverallStatus(validationResults) {
  const status = validationResults.overallStatus;
  const errorCount = validationResults.errors.length;

  switch (status) {
    case 'success':
    case 'warning':
      // Treat warnings as success - they're just informational
      return chalk.bold.green(`${t('reportOverallStatus')}: ✅ ${t('reportAllPassed')}`);

    case 'partial':
      return chalk.bold.yellow(
        `${t('reportOverallStatus')}: ⚠️  ${tf('reportPartialSuccess', { count: errorCount })}`,
      );

    case 'failed':
      return chalk.bold.red(
        `${t('reportOverallStatus')}: ❌ ${tf('reportFailedStatus', { count: errorCount })}`,
      );

    default:
      return chalk.bold.gray(`${t('reportOverallStatus')}: ❓ ${t('reportUnknownStatus')}`);
  }
}

module.exports = {
  generateReport,
};
