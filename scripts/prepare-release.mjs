#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import semanticRelease from 'semantic-release';

const root = process.cwd();
const checkOnly = process.argv.includes('--check');
const configPath = path.join(root, '.releaserc.json');
const packagePath = path.join(root, 'package.json');
const lockPath = path.join(root, 'package-lock.json');
const changelogPath = path.join(root, 'CHANGELOG.md');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const analysisPlugins = config.plugins.slice(0, 2);

const result = await semanticRelease(
  {
    branches: config.branches,
    tagFormat: config.tagFormat,
    plugins: analysisPlugins,
    dryRun: true,
    noCi: true,
  },
  {
    cwd: root,
    env: process.env,
    stdout: process.stdout,
    stderr: process.stderr,
  },
);

if (!result) {
  process.stdout.write('No releasable commits found.\n');
  process.exit(0);
}

const { version, notes } = result.nextRelease;
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const packageLock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
const changelog = fs.readFileSync(changelogPath, 'utf8');
const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const changelogHasVersion = new RegExp(`^## \\[${escapedVersion}\\]`, 'm').test(changelog);
const versionMatches =
  packageJson.version === version &&
  packageLock.version === version &&
  packageLock.packages?.['']?.version === version;

if (checkOnly) {
  if (!versionMatches || !changelogHasVersion) {
    process.stderr.write(
      `Release ${version} is not prepared. Run the Release Preparation workflow first.\n`,
    );
    process.exit(1);
  }
  process.stdout.write(`Release ${version} is prepared.\n`);
  process.exit(0);
}

if (!versionMatches) {
  packageJson.version = version;
  packageLock.version = version;
  packageLock.packages ??= {};
  packageLock.packages[''] ??= {};
  packageLock.packages[''].version = version;
  fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  fs.writeFileSync(lockPath, `${JSON.stringify(packageLock, null, 2)}\n`);
}

if (!changelogHasVersion) {
  const marker = '## [Unreleased]';
  if (!changelog.includes(marker)) {
    throw new Error('CHANGELOG.md must contain an Unreleased section.');
  }
  const releaseDate = new Date().toISOString().slice(0, 10);
  const releaseNotes = notes
    .trim()
    .replace(/^#\s+[^\r\n]+(?:\r?\n)+/, '')
    .trim();
  const releaseBlock = [
    `## [${version}] - ${releaseDate}`,
    releaseNotes,
  ]
    .filter(Boolean)
    .join('\n\n');
  const updated = changelog.replace(marker, `${marker}\n\n${releaseBlock}`);
  fs.writeFileSync(changelogPath, updated);
}

process.stdout.write(`Prepared release ${version}.\n`);
