#!/usr/bin/env node

/**
 * SINAPSE NPX Installer - Entry Point
 *
 * Usage:
 *   npx @synkra/sinapse-install          # Interactive installation
 *   npx @synkra/sinapse-install --dry-run # Preview what would be done
 *   npx @synkra/sinapse-install --version # Show version
 *
 * @package @synkra/sinapse-install
 */

'use strict';

const { Command } = require('commander');
const { runInstaller } = require('../src/installer');
const pkg = require('../package.json');

const program = new Command();

program
  .name('sinapse-install')
  .description('NPX installer for SINAPSE - AI-Orchestrated System for Full Stack Development')
  .version(pkg.version, '-v, --version', 'Output the current version')
  .option('--dry-run', 'Preview what would be done without making changes')
  .option('--verbose', 'Enable verbose output')
  .option('--profile <type>', 'Set profile directly (bob or advanced)', '')
  .option('--skip-deps', 'Skip dependency checking')
  .option('--no-color', 'Disable colored output')
  .action(async (options) => {
    try {
      await runInstaller({
        dryRun: options.dryRun || false,
        verbose: options.verbose || false,
        profile: options.profile || null,
        skipDeps: options.skipDeps || false,
        color: options.color !== false,
      });
    } catch (error) {
      if (options.verbose) {
        console.error('Installation failed:', error);
      } else {
        console.error('Installation failed:', error.message);
      }
      process.exit(1);
    }
  });

program.parse(process.argv);
