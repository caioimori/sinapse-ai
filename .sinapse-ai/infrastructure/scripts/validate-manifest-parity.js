#!/usr/bin/env node
/**
 * Validate Install Manifest Parity
 *
 * @script .sinapse-ai/infrastructure/scripts/validate-manifest-parity.js
 * @story A.4 - Install Manifest Parity & Regeneration (epic-install-ux-hardening)
 *
 * Purpose:
 *   Catches drift between the real repository and the two source-of-truth
 *   files that track framework entities:
 *     - .sinapse-ai/install-manifest.yaml
 *     - .sinapse-ai/data/entity-registry.yaml
 *
 *   Unlike scripts/validate-manifest.js (which hashes every file in the
 *   manifest), this script focuses on domain-level parity for the 4
 *   domains most likely to drift silently:
 *     - agents      → .sinapse-ai/development/agents/*.md       (top-level)
 *     - tasks       → .sinapse-ai/development/tasks/*.md
 *     - templates   → .sinapse-ai/development/templates/*.{md,yaml}
 *     - checklists  → .sinapse-ai/development/checklists/*.md
 *
 *   It also cross-validates that entity-registry.yaml agrees with the
 *   manifest and with reality on the number of agents and their names.
 *
 * Usage:
 *   node .sinapse-ai/infrastructure/scripts/validate-manifest-parity.js
 *   npm run validate:manifest:parity
 *
 * Options:
 *   --json        Emit machine-readable JSON (for CI)
 *   --root <dir>  Override the repo root (for tests)
 *
 * Exit codes:
 *   0 - Parity OK
 *   1 - Drift detected
 *   2 - Script/internal error
 */

'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Domains to check. Each entry describes one logical domain of entities
// and how to find its real files on disk.
const DOMAINS = [
  {
    name: 'agents',
    dir: 'development/agents',
    // Only top-level .md files count as "agents". Sub-folder MEMORY.md
    // files belong to the agent's memory, not the agent roster.
    recursive: false,
    exts: ['.md'],
    // Exclude internal files that live alongside agents but are not agents.
    exclude: (name) => /^(README|CHANGELOG|INDEX|MEMORY)\.md$/i.test(name),
  },
  {
    name: 'tasks',
    dir: 'development/tasks',
    recursive: false,
    exts: ['.md'],
    exclude: (name) => /^(README|CHANGELOG|INDEX)\.md$/i.test(name),
  },
  {
    name: 'templates',
    dir: 'development/templates',
    recursive: false,
    exts: ['.md', '.yaml', '.yml'],
    exclude: (name) => /^README\.md$/i.test(name),
  },
  {
    name: 'checklists',
    dir: 'development/checklists',
    recursive: false,
    exts: ['.md'],
    exclude: (name) => /^(README|INDEX)\.md$/i.test(name),
  },
];

/**
 * Find every file on disk that belongs to a given domain.
 * @param {string} sinapseCoreDir - Path to `.sinapse-ai/`
 * @param {object} domain - Domain descriptor from DOMAINS
 * @returns {Set<string>} Set of POSIX-style relative paths (e.g.
 *                        `development/agents/developer.md`)
 */
function scanDomain(sinapseCoreDir, domain) {
  const domainDir = path.join(sinapseCoreDir, domain.dir);
  const found = new Set();

  if (!fs.existsSync(domainDir)) return found;

  const entries = fs.readdirSync(domainDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) continue; // not recursing
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!domain.exts.includes(ext)) continue;
    if (domain.exclude && domain.exclude(entry.name)) continue;
    found.add(`${domain.dir}/${entry.name}`);
  }
  return found;
}

/**
 * Collect every manifest entry whose path matches a given domain directory.
 * @param {Array<{path:string}>} manifestFiles
 * @param {object} domain
 * @returns {Set<string>}
 */
function collectManifestEntries(manifestFiles, domain) {
  const set = new Set();
  const prefix = `${domain.dir}/`;
  for (const entry of manifestFiles) {
    const p = String(entry.path || '').replace(/\\/g, '/');
    if (!p.startsWith(prefix)) continue;
    // Only keep top-level (same depth filter as scanDomain) unless
    // the domain is configured as recursive.
    const rest = p.slice(prefix.length);
    if (!domain.recursive && rest.includes('/')) continue;
    const ext = path.extname(rest).toLowerCase();
    if (!domain.exts.includes(ext)) continue;
    if (domain.exclude && domain.exclude(path.basename(rest))) continue;
    set.add(p);
  }
  return set;
}

/**
 * Diff two sets, returning extras and missings relative to disk.
 * @param {Set<string>} onDisk
 * @param {Set<string>} inManifest
 * @returns {{missingFromManifest:string[], missingFromDisk:string[]}}
 */
function diffSets(onDisk, inManifest) {
  const missingFromManifest = [];
  const missingFromDisk = [];
  for (const p of onDisk) {
    if (!inManifest.has(p)) missingFromManifest.push(p);
  }
  for (const p of inManifest) {
    if (!onDisk.has(p)) missingFromDisk.push(p);
  }
  missingFromManifest.sort();
  missingFromDisk.sort();
  return { missingFromManifest, missingFromDisk };
}

/**
 * Load a YAML file, returning null if it does not exist.
 */
function loadYaml(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  return yaml.load(raw);
}

/**
 * Extract the set of top-level agent names from entity-registry.yaml.
 * Registry shape: entities.agents.{agentName}: { ... }
 * @returns {Set<string>}
 */
function getRegistryAgentNames(registry) {
  const names = new Set();
  const agents = registry && registry.entities && registry.entities.agents;
  if (!agents || typeof agents !== 'object') return names;
  for (const key of Object.keys(agents)) names.add(key);
  return names;
}

/**
 * Run the full parity check.
 * @param {string} repoRoot - Repo root directory
 * @returns {object} report
 */
function runParityCheck(repoRoot) {
  const sinapseCoreDir = path.join(repoRoot, '.sinapse-ai');
  const manifestPath = path.join(sinapseCoreDir, 'install-manifest.yaml');
  const registryPath = path.join(sinapseCoreDir, 'data', 'entity-registry.yaml');

  const report = {
    ok: true,
    errors: [],
    domains: {},
    registry: {
      checked: false,
      agentCountManifest: 0,
      agentCountRegistry: 0,
      agentCountDisk: 0,
      extraInRegistry: [],
      missingInRegistry: [],
    },
  };

  const manifest = loadYaml(manifestPath);
  if (!manifest) {
    report.ok = false;
    report.errors.push(`install-manifest.yaml not found at ${manifestPath}`);
    return report;
  }
  if (!Array.isArray(manifest.files)) {
    report.ok = false;
    report.errors.push('install-manifest.yaml has no `files` array');
    return report;
  }

  for (const domain of DOMAINS) {
    const onDisk = scanDomain(sinapseCoreDir, domain);
    const inManifest = collectManifestEntries(manifest.files, domain);
    const { missingFromManifest, missingFromDisk } = diffSets(onDisk, inManifest);

    const domainOk = missingFromManifest.length === 0 && missingFromDisk.length === 0;
    if (!domainOk) report.ok = false;

    report.domains[domain.name] = {
      ok: domainOk,
      dir: domain.dir,
      diskCount: onDisk.size,
      manifestCount: inManifest.size,
      missingFromManifest,
      missingFromDisk,
    };
  }

  // Cross-validate entity-registry.yaml against manifest + disk for agents.
  const registry = loadYaml(registryPath);
  if (!registry) {
    report.ok = false;
    report.errors.push(`entity-registry.yaml not found at ${registryPath}`);
  } else {
    report.registry.checked = true;
    const agentsDomain = report.domains.agents;
    const diskAgentNames = new Set(
      Array.from(scanDomain(sinapseCoreDir, DOMAINS[0])).map((p) =>
        path.basename(p, '.md'),
      ),
    );
    const registryAgentNames = getRegistryAgentNames(registry);
    report.registry.agentCountDisk = diskAgentNames.size;
    report.registry.agentCountManifest = agentsDomain ? agentsDomain.manifestCount : 0;
    report.registry.agentCountRegistry = registryAgentNames.size;

    // Registry should mention exactly the same agent names as disk.
    for (const name of registryAgentNames) {
      if (!diskAgentNames.has(name)) report.registry.extraInRegistry.push(name);
    }
    for (const name of diskAgentNames) {
      if (!registryAgentNames.has(name)) report.registry.missingInRegistry.push(name);
    }
    report.registry.extraInRegistry.sort();
    report.registry.missingInRegistry.sort();

    if (
      report.registry.extraInRegistry.length > 0 ||
      report.registry.missingInRegistry.length > 0 ||
      report.registry.agentCountRegistry !== report.registry.agentCountDisk
    ) {
      report.ok = false;
    }
  }

  return report;
}

/**
 * Render a human-readable report.
 */
function printReport(report) {
  const line = '='.repeat(60);
  console.log(line);
  console.log('SINAPSE Install Manifest Parity Report');
  console.log(line);

  if (report.errors.length > 0) {
    console.log('');
    console.log('ERRORS:');
    for (const err of report.errors) console.log(`  - ${err}`);
  }

  console.log('');
  console.log('Domains:');
  for (const [name, info] of Object.entries(report.domains)) {
    const status = info.ok ? 'OK' : 'DRIFT';
    console.log(
      `  ${name.padEnd(11)} ${status.padEnd(6)} disk=${info.diskCount} manifest=${info.manifestCount}`,
    );
    if (info.missingFromManifest.length > 0) {
      console.log(`    Missing from manifest (${info.missingFromManifest.length}):`);
      for (const p of info.missingFromManifest.slice(0, 20)) console.log(`      + ${p}`);
      if (info.missingFromManifest.length > 20) {
        console.log(`      ... and ${info.missingFromManifest.length - 20} more`);
      }
    }
    if (info.missingFromDisk.length > 0) {
      console.log(`    In manifest but missing on disk (${info.missingFromDisk.length}):`);
      for (const p of info.missingFromDisk.slice(0, 20)) console.log(`      - ${p}`);
      if (info.missingFromDisk.length > 20) {
        console.log(`      ... and ${info.missingFromDisk.length - 20} more`);
      }
    }
  }

  if (report.registry.checked) {
    const r = report.registry;
    const status =
      r.extraInRegistry.length === 0 &&
      r.missingInRegistry.length === 0 &&
      r.agentCountDisk === r.agentCountRegistry
        ? 'OK'
        : 'DRIFT';
    console.log('');
    console.log(`Entity Registry cross-check: ${status}`);
    console.log(
      `  agents: disk=${r.agentCountDisk} manifest=${r.agentCountManifest} registry=${r.agentCountRegistry}`,
    );
    if (r.extraInRegistry.length > 0) {
      console.log(`  Extra in registry (${r.extraInRegistry.length}):`);
      for (const n of r.extraInRegistry) console.log(`      ! ${n}`);
    }
    if (r.missingInRegistry.length > 0) {
      console.log(`  Missing from registry (${r.missingInRegistry.length}):`);
      for (const n of r.missingInRegistry) console.log(`      ? ${n}`);
    }
  }

  console.log('');
  console.log('-'.repeat(60));
  if (report.ok) {
    console.log('PARITY OK — manifest, disk, and registry agree.');
  } else {
    console.log('PARITY DRIFT — fix with:');
    console.log('  1. npm run generate:manifest');
    console.log('  2. review entity-registry.yaml agents section');
    console.log('  3. rerun npm run validate:manifest:parity');
  }
  console.log('-'.repeat(60));
}

function parseArgs(argv) {
  const opts = { json: false, root: process.cwd() };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') opts.json = true;
    else if (a === '--root' && argv[i + 1]) {
      opts.root = argv[++i];
    }
  }
  return opts;
}

function main() {
  const opts = parseArgs(process.argv);
  try {
    const report = runParityCheck(opts.root);
    if (opts.json) {
      process.stdout.write(JSON.stringify(report, null, 2) + '\n');
    } else {
      printReport(report);
    }
    process.exit(report.ok ? 0 : 1);
  } catch (err) {
    console.error('validate-manifest-parity: internal error:', err && err.message);
    if (process.env.DEBUG) console.error(err && err.stack);
    process.exit(2);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  runParityCheck,
  scanDomain,
  collectManifestEntries,
  diffSets,
  getRegistryAgentNames,
  DOMAINS,
};
