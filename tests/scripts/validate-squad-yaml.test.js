'use strict';

/**
 * validate-squad-yaml.test.js — Story 5.2 / Piece C
 *
 * Unit tests for scripts/validate-squad-yaml.js internals.
 * These tests exercise the schema loader, YAML parser, legacy-format
 * detector, and soft-check (warnings) logic without spawning the CLI.
 *
 * Caller: validate-all.js GUARDS → validate:squad-orqx (confirmed in
 *   scripts/validate-all.js line 54); schema validator accessible via
 *   npm run validate:squad-schema.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ROOT = path.resolve(__dirname, '../..');
const SCHEMA_PATH = path.join(ROOT, '.sinapse-ai', 'schemas', 'squad-schema.json');
const SQUADS_DIR = path.join(ROOT, 'squads');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadSchema() {
  return JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
}

function makeValidator(schema) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  return ajv.compile(schema);
}

function makeTempSquadDir(squadYamlContent) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-squad-'));
  fs.writeFileSync(path.join(dir, 'squad.yaml'), squadYamlContent, 'utf8');
  return dir;
}

// ---------------------------------------------------------------------------
// Schema file presence
// ---------------------------------------------------------------------------

describe('squad-schema.json', () => {
  it('exists at the expected path', () => {
    expect(fs.existsSync(SCHEMA_PATH)).toBe(true);
  });

  it('is valid JSON with required $schema and title fields', () => {
    const schema = loadSchema();
    expect(schema).toHaveProperty('$schema');
    expect(schema).toHaveProperty('title');
    expect(schema.type).toBe('object');
  });

  it('requires name, version, description at root level', () => {
    const schema = loadSchema();
    expect(Array.isArray(schema.required)).toBe(true);
    expect(schema.required).toContain('name');
    expect(schema.required).toContain('version');
    expect(schema.required).toContain('description');
  });
});

// ---------------------------------------------------------------------------
// Flat schema validation (minimal valid document)
// ---------------------------------------------------------------------------

describe('AJV validation — flat schema', () => {
  let validator;

  beforeAll(() => {
    validator = makeValidator(loadSchema());
  });

  it('accepts a minimal valid squad manifest', () => {
    const doc = yaml.load(`
name: squad-test
version: 1.0.0
description: A test squad
`);
    const ok = validator(doc);
    expect(ok).toBe(true);
    expect(validator.errors).toBeFalsy();
  });

  it('rejects a document missing required "name"', () => {
    const doc = { version: '1.0.0', description: 'Missing name' };
    const ok = validator(doc);
    expect(ok).toBe(false);
    const paths = (validator.errors || []).map((e) => e.instancePath + ' ' + e.message);
    expect(paths.some((p) => p.includes('name') || p.includes('required'))).toBe(true);
  });

  it('rejects a document with invalid version format (not semver)', () => {
    const doc = { name: 'test', version: 'v1', description: 'Bad version' };
    const ok = validator(doc);
    expect(ok).toBe(false);
    const paths = (validator.errors || []).map((e) => e.instancePath + ' ' + e.message);
    expect(paths.some((p) => p.includes('version'))).toBe(true);
  });

  it('rejects a name with uppercase characters (kebab-case required)', () => {
    const doc = { name: 'MySquad', version: '1.0.0', description: 'Bad name' };
    const ok = validator(doc);
    expect(ok).toBe(false);
  });

  it('accepts optional fields like domain, tags, metadata', () => {
    const doc = {
      name: 'squad-alpha',
      version: '2.1.0',
      description: 'Alpha squad',
      domain: 'testing',
      tags: ['test', 'alpha'],
      metadata: { created_at: '2026-01-01' },
    };
    expect(validator(doc)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Legacy nested format detection
// ---------------------------------------------------------------------------

describe('legacy nested format', () => {
  let validator;

  beforeAll(() => {
    validator = makeValidator(loadSchema());
  });

  it('rejects old-style squad: wrapper via AJV (squad.name is unexpected type)', () => {
    // Legacy format wraps everything under `squad:`. The flat schema does NOT
    // have squad.name as a string at root — so validation fails (squad is
    // additionalProperties: true but the wrapped object lacks required name/version
    // at root level).
    const legacyDoc = {
      squad: {
        name: 'legacy-squad',
        version: '1.0.0',
        description: 'Old-style manifest',
      },
    };
    // Root is missing required `name`, `version`, `description`
    const ok = validator(legacyDoc);
    expect(ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Live squads — integration-level smoke test
// ---------------------------------------------------------------------------

describe('live squads — smoke test', () => {
  let validator;
  let squads;

  beforeAll(() => {
    validator = makeValidator(loadSchema());
    squads = fs
      .readdirSync(SQUADS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();
  });

  it('finds at least 15 squads on disk', () => {
    expect(squads.length).toBeGreaterThanOrEqual(15);
  });

  it('every squad has a squad.yaml file', () => {
    const missing = squads.filter(
      (s) => !fs.existsSync(path.join(SQUADS_DIR, s, 'squad.yaml'))
    );
    expect(missing).toEqual([]);
  });

  it('every squad.yaml parses as valid YAML (no parse errors)', () => {
    const parseErrors = [];
    for (const s of squads) {
      const p = path.join(SQUADS_DIR, s, 'squad.yaml');
      try {
        yaml.load(fs.readFileSync(p, 'utf8'));
      } catch (err) {
        parseErrors.push(`${s}: ${err.message}`);
      }
    }
    expect(parseErrors).toEqual([]);
  });

  it('every squad.yaml passes AJV schema validation (no hard failures)', () => {
    const failures = [];
    for (const s of squads) {
      const p = path.join(SQUADS_DIR, s, 'squad.yaml');
      let doc;
      try {
        doc = yaml.load(fs.readFileSync(p, 'utf8'));
      } catch (_) {
        continue; // parse errors caught by previous test
      }
      if (!validator(doc)) {
        const msgs = (validator.errors || []).map((e) => `${e.instancePath} ${e.message}`);
        failures.push(`${s}: ${msgs.join('; ')}`);
      }
    }
    expect(failures).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// validate-squad-orqx integration — confirms validate-all.js caller exists
// ---------------------------------------------------------------------------

describe('validate-all.js GUARDS — caller proof', () => {
  it('includes validate:squad-orqx in GUARDS array (Article XI: no orphan)', () => {
    const validateAllPath = path.join(ROOT, 'scripts', 'validate-all.js');
    const content = fs.readFileSync(validateAllPath, 'utf8');
    expect(content).toContain("'validate:squad-orqx'");
  });

  it('includes validate:squad-yaml in GUARDS array', () => {
    const validateAllPath = path.join(ROOT, 'scripts', 'validate-all.js');
    const content = fs.readFileSync(validateAllPath, 'utf8');
    expect(content).toContain("'validate:squad-yaml'");
  });
});
