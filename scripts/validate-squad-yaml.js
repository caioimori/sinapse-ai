#!/usr/bin/env node

/**
 * validate-squad-yaml.js
 *
 * Onda 3 / Frente C.
 *
 * Validates every squads/&lt;squad&gt;/squad.yaml against the canonical
 * flat schema at .sinapse-ai/schemas/squad-schema.json.
 *
 * Usage:
 *   node scripts/validate-squad-yaml.js            # validate all squads
 *   node scripts/validate-squad-yaml.js --squad X  # validate one squad
 *   node scripts/validate-squad-yaml.js --strict   # treat warnings as errors
 *
 * Exit codes:
 *   0 — all squad.yaml files valid
 *   1 — validation failures
 *   2 — script / IO error
 */

'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ROOT = path.resolve(__dirname, '..');
const SQUADS_DIR = path.join(ROOT, 'squads');
const SCHEMA_PATH = path.join(ROOT, '.sinapse-ai', 'schemas', 'squad-schema.json');

const args = process.argv.slice(2);
const singleSquad = (() => {
  const idx = args.indexOf('--squad');
  return idx >= 0 ? args[idx + 1] : null;
})();
const STRICT = args.includes('--strict');
const JSON_OUT = args.includes('--json');

function loadSchema() {
  if (!fs.existsSync(SCHEMA_PATH)) {
    console.error(`Schema not found: ${SCHEMA_PATH}`);
    process.exit(2);
  }
  return JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
}

function listSquads() {
  return fs
    .readdirSync(SQUADS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

function readSquadYaml(squadName) {
  const p = path.join(SQUADS_DIR, squadName, 'squad.yaml');
  if (!fs.existsSync(p)) return null;
  const content = fs.readFileSync(p, 'utf8');
  try {
    return yaml.load(content);
  } catch (err) {
    return { __parse_error: err.message };
  }
}

function detectLegacyNested(doc) {
  // Detect old style: top-level `squad:` wrapping everything.
  if (doc && typeof doc === 'object' && doc.squad && typeof doc.squad === 'object' && doc.squad.name) {
    return true;
  }
  return false;
}

function validateOne(squadName, schema, validator) {
  const doc = readSquadYaml(squadName);
  if (doc === null) {
    return { squadName, status: 'missing', errors: ['no squad.yaml found'] };
  }
  if (doc && doc.__parse_error) {
    return { squadName, status: 'parse-error', errors: [doc.__parse_error] };
  }
  if (detectLegacyNested(doc)) {
    return {
      squadName,
      status: 'fail',
      errors: [
        'Legacy nested format detected (top-level `squad:` wrapper). Migrate to flat schema: fields at root level.'
      ]
    };
  }
  const ok = validator(doc);
  if (!ok) {
    return {
      squadName,
      status: 'fail',
      errors: (validator.errors || []).map((e) => `${e.instancePath || '/'} ${e.message}`)
    };
  }

  // Soft checks (warnings).
  const warnings = [];
  if (!doc.description) warnings.push('description is empty');
  if (doc.components && doc.components.agents) {
    const agentsDir = path.join(SQUADS_DIR, squadName, 'agents');
    if (fs.existsSync(agentsDir)) {
      const onDisk = new Set(fs.readdirSync(agentsDir).filter((f) => f.endsWith('.md')));
      for (const declared of doc.components.agents) {
        if (!onDisk.has(declared)) {
          warnings.push(`components.agents declares "${declared}" but file is missing on disk`);
        }
      }
      for (const f of onDisk) {
        if (!doc.components.agents.includes(f)) {
          warnings.push(`agent file "${f}" exists on disk but is not declared in components.agents`);
        }
      }
    }
  }
  return { squadName, status: warnings.length ? 'warn' : 'ok', errors: [], warnings };
}

function main() {
  const schema = loadSchema();
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validator = ajv.compile(schema);

  const targets = singleSquad ? [singleSquad] : listSquads();
  const results = targets.map((s) => validateOne(s, schema, validator));

  if (JSON_OUT) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log('Squad YAML validation');
    console.log('---------------------');
    for (const r of results) {
      const tag =
        r.status === 'ok' ? '\x1b[32mok\x1b[0m' :
        r.status === 'warn' ? '\x1b[33mwarn\x1b[0m' :
        r.status === 'missing' ? '\x1b[33mmissing\x1b[0m' :
        '\x1b[31mfail\x1b[0m';
      console.log(`  ${tag.padEnd(20)} ${r.squadName}`);
      for (const e of r.errors || []) console.log(`     - ${e}`);
      if (!STRICT) {
        // only show warnings if not strict (otherwise printed as errors below)
        for (const w of r.warnings || []) console.log(`     ~ ${w}`);
      }
    }
    const fails = results.filter((r) => r.status === 'fail' || r.status === 'parse-error' || r.status === 'missing').length;
    const warns = results.filter((r) => r.status === 'warn').length;
    const oks = results.filter((r) => r.status === 'ok').length;
    console.log('');
    console.log(`Summary: ${oks} ok, ${warns} warn, ${fails} fail (of ${results.length})`);
  }

  const failCount = results.filter((r) => r.status === 'fail' || r.status === 'parse-error' || r.status === 'missing').length;
  const warnCount = results.filter((r) => r.status === 'warn').length;
  if (failCount > 0) process.exit(1);
  if (STRICT && warnCount > 0) process.exit(1);
  process.exit(0);
}

main();
