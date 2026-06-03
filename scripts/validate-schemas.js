#!/usr/bin/env node
'use strict';

/**
 * Schema Validation GATE — Meta-validation + Kind coverage + Artifact validation
 *
 * Deterministic CI gate. fail-CLOSED. Three layers, all driven by the SAME
 * TemplateValidator (.sinapse-ai/product/templates/engine/validator.js, v2.0.0)
 * that the engine already uses at render time — this gate does NOT reimplement
 * Ajv kind-aware validation, it reuses the validator's Ajv instance, custom
 * formats, schema resolution, data extraction and error formatting.
 *
 * LAYERS:
 *   1. META-VALIDATION (always runs — the value in a public CI with no artifacts):
 *      Discover EVERY *.schema.json in the repo (git ls-files, node_modules
 *      excluded) and compile each one with a fresh Ajv draft-07 instance
 *      (strict:false + ajv-formats + the validator's custom formats). A schema
 *      that does NOT compile (invalid JSON, broken $ref, invalid meta-schema)
 *      -> violation -> exit 1.
 *
 *   2. KIND COVERAGE: for the engine's known templateTypes (adr, dbdr, epic,
 *      pmdr, prd-v2, prd, story, task), reuse TemplateValidator.checkSchemas()
 *      and report found/missing. A known kind with no schema -> violation.
 *
 *   3. ARTIFACT VALIDATION (no-op clean when absent): kind -> glob by CONVENTION
 *      (story -> docs/stories/ ** / *.story.md, epic -> docs/epics/ ** / *.md,
 *      prd -> docs/prd/ ** / *.md). docs/stories and docs/epics are gitignored,
 *      so in public CI there are 0 artifacts -> reported as skipped, NOT a
 *      failure. When artifacts ARE present, extract data via
 *      TemplateValidator.extractDataFromMarkdown (or frontmatter parse) and
 *      validate via TemplateValidator.validate(data, kind); each error is
 *      reported with the instancePath that formatErrors() already produces.
 *      An invalid artifact -> exit 1.
 *
 * Why a SEPARATE Ajv for meta-validation (layer 1): the shared
 * TemplateValidator.ajv has allErrors/verbose on and caches by $id; compiling
 * arbitrary repo schemas (which may share or collide on $id, or be config /
 * infra schemas unrelated to templates) into it would pollute that cache and
 * mask the real "does this schema compile on its own?" question. Layer 1 asks
 * exactly that question, in isolation, per schema.
 *
 * EXIT CODES:
 *   0  -> everything valid (and artifacts, if any, all valid).
 *   1  -> any schema fails to compile, OR a known kind has no schema, OR an
 *         artifact is invalid.
 *   2  -> gate/internal error (cannot load the validator, git discovery fails
 *         with no fallback, etc).
 *
 * FLAGS:
 *   --artifacts <dir>   Use <dir> as the artifact root instead of the repo root
 *                       (used by the jest wrapper / for testing). Globs are
 *                       resolved relative to this root.
 *   --quiet             Suppress the per-schema OK lines; still prints the
 *                       summary and every violation.
 *
 * Will be wired into package.json (NOT touched here) as:
 *   "validate:schemas": "node scripts/validate-schemas.js"
 *
 * Node puro, Windows-nativo, ZERO new dependency (ajv + ajv-formats already deps).
 *
 * @module scripts/validate-schemas
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const REPO_ROOT = path.resolve(__dirname, '..');
const ENGINE_DIR = path.join(REPO_ROOT, '.sinapse-ai', 'product', 'templates', 'engine');
const SCHEMAS_DIR = path.join(ENGINE_DIR, 'schemas');
const VALIDATOR_PATH = path.join(ENGINE_DIR, 'validator.js');

// Engine's known template types (mirrors the schemas the engine ships).
const KNOWN_KINDS = ['adr', 'dbdr', 'epic', 'pmdr', 'prd-v2', 'prd', 'story', 'task'];

// Artifact resolution by CONVENTION (path/filename). Frontmatter has no
// apiVersion/kind, so the kind comes from where the file lives + its suffix.
// `dir` is relative to the artifact root; `suffix` matches filename endings.
const ARTIFACT_CONVENTIONS = [
  { kind: 'story', dir: path.join('docs', 'stories'), suffix: '.story.md' },
  { kind: 'epic', dir: path.join('docs', 'epics'), suffix: '.md' },
  { kind: 'prd', dir: path.join('docs', 'prd'), suffix: '.md' },
];

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const opts = { artifactsRoot: REPO_ROOT, quiet: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--quiet') {
      opts.quiet = true;
    } else if (a === '--artifacts') {
      const next = argv[i + 1];
      if (!next) {
        process.stderr.write(`[validate-schemas] --artifacts requires a directory argument.\n`);
        process.exit(2);
      }
      opts.artifactsRoot = path.resolve(next);
      i += 1;
    } else if (a.startsWith('--artifacts=')) {
      opts.artifactsRoot = path.resolve(a.slice('--artifacts='.length));
    }
  }
  return opts;
}

// ---------------------------------------------------------------------------
// Violation collection
// ---------------------------------------------------------------------------

/** @type {Array<{file:string, message:string}>} */
const violations = [];
function addViolation(file, message) {
  violations.push({ file, message });
}

function rel(p, root = REPO_ROOT) {
  return path.relative(root, p).split(path.sep).join('/') || path.basename(p);
}

// ---------------------------------------------------------------------------
// Load the engine's TemplateValidator (REUSE — do not reimplement Ajv).
// ---------------------------------------------------------------------------

let TemplateValidator;
try {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  ({ TemplateValidator } = require(VALIDATOR_PATH));
  if (typeof TemplateValidator !== 'function') {
    throw new Error('validator.js did not export a TemplateValidator class');
  }
} catch (err) {
  process.stderr.write(
    `[validate-schemas] FATAL: could not load TemplateValidator from\n` +
      `  ${VALIDATOR_PATH}\n` +
      `  reason: ${err.message}\n`
  );
  process.exit(2);
}

// One shared validator instance for kind-coverage + artifact validation. It
// resolves schemas from the engine schemas dir and carries the custom formats
// (semver, slug, story-id, epic-id) the engine schemas may rely on.
const validator = new TemplateValidator({ schemasDir: SCHEMAS_DIR });

// ---------------------------------------------------------------------------
// Ajv factory for LAYER 1 meta-validation (fresh, isolated, per schema).
// Mirrors the validator's own config (strict:false, ajv-formats, custom
// formats) so "compiles in the gate" == "compiles in the engine".
// ---------------------------------------------------------------------------

// Draft-07 is the default (matches the engine's TemplateValidator and the bulk
// of the repo). But the repo is heterogeneous: a schema may legitimately declare
// a NEWER meta-schema (e.g. draft 2020-12 in .codex/*.parity.schema.json).
// Forcing such a schema through the draft-07 compiler is a FALSE failure — it is
// valid, just newer. So the meta-validator is draft-AWARE: it picks the Ajv
// build by the schema's declared `$schema`. All builds ship INSIDE the `ajv`
// package (ajv, ajv/dist/2020, ajv/dist/2019) -> ZERO new dependency.
let AjvDraft07;
let Ajv2020;
let Ajv2019;
let addFormats;
try {
  // eslint-disable-next-line global-require
  AjvDraft07 = require('ajv'); // draft-07 (also draft-06/04 via addMetaSchema, default here)
  // eslint-disable-next-line global-require
  addFormats = require('ajv-formats');
} catch (err) {
  process.stderr.write(
    `[validate-schemas] FATAL: ajv / ajv-formats not available (expected as deps): ${err.message}\n`
  );
  process.exit(2);
}
try {
  // eslint-disable-next-line global-require
  Ajv2020 = require('ajv/dist/2020');
} catch {
  Ajv2020 = null; // graceful: a 2020-12 schema then fails with an actionable message
}
try {
  // eslint-disable-next-line global-require
  Ajv2019 = require('ajv/dist/2019');
} catch {
  Ajv2019 = null;
}

function registerCustomFormats(ajv) {
  // Same custom formats the TemplateValidator registers — so a schema that
  // uses "format": "semver" | "slug" | "story-id" | "epic-id" still compiles
  // here (with strict:false an unknown format would not throw, but mirroring
  // keeps the gate semantically identical to the engine).
  ajv.addFormat('semver', { validate: (s) => /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?(\+[a-zA-Z0-9.]+)?$/.test(s) });
  ajv.addFormat('slug', { validate: (s) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) });
  ajv.addFormat('story-id', { validate: (s) => /^\d+\.\d+$/.test(s) });
  ajv.addFormat('epic-id', { validate: (s) => /^EPIC-[A-Z0-9]+$/.test(s) });
}

/** Resolve which Ajv constructor compiles a schema, from its `$schema` URI. */
function ajvCtorFor(schema) {
  const meta = typeof schema.$schema === 'string' ? schema.$schema : '';
  if (/2020-12/.test(meta)) return { ctor: Ajv2020, draft: 'draft 2020-12' };
  if (/2019-09/.test(meta)) return { ctor: Ajv2019, draft: 'draft 2019-09' };
  // draft-07 / draft-06 / draft-04 / unspecified -> default Ajv (draft-07).
  return { ctor: AjvDraft07, draft: 'draft-07' };
}

function newAjvFor(schema) {
  const { ctor, draft } = ajvCtorFor(schema);
  if (!ctor) {
    const err = new Error(
      `meta-schema ${draft} requested but the matching Ajv build is unavailable in this environment`
    );
    err.unsupportedDraft = true;
    throw err;
  }
  const ajv = new ctor({ allErrors: true, strict: false, validateFormats: true });
  addFormats(ajv);
  registerCustomFormats(ajv);
  return { ajv, draft };
}

// ---------------------------------------------------------------------------
// Schema discovery — git ls-files (preferred), recursive readdir (fallback).
// The dot-prefixed dirs (.sinapse-ai, .codex) break a naive Glob, so we either
// ask git or walk the tree ourselves. node_modules is always excluded.
// ---------------------------------------------------------------------------

function discoverViaGit() {
  try {
    const out = execFileSync('git', ['ls-files', '*.schema.json'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const files = out
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .filter((l) => !l.split('/').includes('node_modules'))
      .map((l) => path.join(REPO_ROOT, l));
    return files.length ? files : null;
  } catch {
    return null;
  }
}

function discoverViaWalk(dir, acc) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      discoverViaWalk(full, acc);
    } else if (e.isFile() && e.name.endsWith('.schema.json')) {
      acc.push(full);
    }
  }
  return acc;
}

function discoverSchemas() {
  const viaGit = discoverViaGit();
  if (viaGit) return { files: viaGit.sort(), method: 'git ls-files' };
  const walked = discoverViaWalk(REPO_ROOT, []);
  return { files: walked.sort(), method: 'recursive readdir' };
}

// ---------------------------------------------------------------------------
// LAYER 1 — meta-validation: each schema compiles in isolation.
// ---------------------------------------------------------------------------

function metaValidate(schemaFiles, opts) {
  let okCount = 0;
  for (const file of schemaFiles) {
    const relPath = rel(file);
    let raw;
    try {
      raw = fs.readFileSync(file, 'utf8');
    } catch (err) {
      addViolation(relPath, `cannot read schema file: ${err.message}`);
      continue;
    }
    let schema;
    try {
      schema = JSON.parse(raw);
    } catch (err) {
      addViolation(relPath, `invalid JSON: ${err.message}`);
      continue;
    }
    // Fresh Ajv per schema -> no $id cache collisions across the repo's
    // template / config / infra / quality / codex schemas. Draft-aware so a
    // schema that declares a newer meta-schema is not a false failure.
    try {
      const { ajv, draft } = newAjvFor(schema);
      ajv.compile(schema); // throws on broken $ref, invalid meta-schema, bad keywords
      okCount += 1;
      if (!opts.quiet) process.stdout.write(`  ok    ${relPath} (${draft})\n`);
    } catch (err) {
      addViolation(relPath, `does not compile: ${err.message}`);
    }
  }
  return okCount;
}

// ---------------------------------------------------------------------------
// LAYER 2 — kind coverage via the validator's own checkSchemas().
// ---------------------------------------------------------------------------

async function kindCoverage() {
  const result = await validator.checkSchemas(KNOWN_KINDS);
  for (const missing of result.missing) {
    addViolation(
      rel(SCHEMAS_DIR),
      `known template kind '${missing}' has no schema (expected ${missing}.schema.json in ${rel(SCHEMAS_DIR)}/).`
    );
  }
  return result; // { complete, found, missing }
}

// ---------------------------------------------------------------------------
// LAYER 3 — artifact validation by convention (no-op clean when absent).
// ---------------------------------------------------------------------------

/** Recursively collect files under `dir` ending with `suffix`. */
function collectArtifacts(dir, suffix, acc) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc; // dir absent -> no-op
  }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      collectArtifacts(full, suffix, acc);
    } else if (e.isFile() && e.name.endsWith(suffix)) {
      acc.push(full);
    }
  }
  return acc;
}

/**
 * Minimal YAML frontmatter parser (--- ... ---). Engine artifacts have no
 * apiVersion/kind, but a story/epic/prd may carry scalar + simple list/nested
 * frontmatter. We parse what we safely can; deep structures fall back to the
 * markdown-body extraction the validator already provides.
 */
function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const body = m[1];
  const data = {};
  const lines = body.split(/\r?\n/);
  let pendingKey = null;
  let pendingList = null;
  for (const line of lines) {
    if (line.trim() === '') continue;
    const listItem = line.match(/^\s*-\s+(.*)$/);
    if (listItem && pendingKey) {
      if (!pendingList) {
        pendingList = [];
        data[pendingKey] = pendingList;
      }
      pendingList.push(coerce(listItem[1].trim()));
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (kv) {
      pendingKey = kv[1];
      pendingList = null;
      const val = kv[2].trim();
      if (val === '') {
        // could be a list/object on following lines
        data[pendingKey] = '';
      } else {
        data[pendingKey] = coerce(val);
      }
    }
  }
  return data;
}

function coerce(v) {
  if (/^-?\d+$/.test(v)) return parseInt(v, 10);
  if (/^-?\d+\.\d+$/.test(v) && !/^\d+\.\d+$/.test(v)) return parseFloat(v); // avoid eating story ids like 3.6
  if (v === 'true') return true;
  if (v === 'false') return false;
  // strip surrounding quotes
  const q = v.match(/^["'](.*)["']$/);
  return q ? q[1] : v;
}

/**
 * Build the data object for an artifact. Prefer the validator's own extractor
 * (markdown body `**Key:** value`), merged with frontmatter (frontmatter wins
 * on key collision since it is the structured source).
 */
function extractArtifactData(content) {
  let bodyData = {};
  try {
    bodyData = validator.extractDataFromMarkdown(content, {}) || {};
  } catch {
    bodyData = {};
  }
  const fm = parseFrontmatter(content) || {};
  return { ...bodyData, ...fm };
}

async function validateArtifacts(opts) {
  const summary = { kinds: {}, total: 0, valid: 0, invalid: 0 };

  for (const conv of ARTIFACT_CONVENTIONS) {
    const root = path.join(opts.artifactsRoot, conv.dir);
    const files = collectArtifacts(root, conv.suffix, []);
    summary.kinds[conv.kind] = files.length;
    summary.total += files.length;

    for (const file of files) {
      const relPath = rel(file, opts.artifactsRoot);
      let content;
      try {
        content = fs.readFileSync(file, 'utf8');
      } catch (err) {
        addViolation(relPath, `cannot read artifact: ${err.message}`);
        summary.invalid += 1;
        continue;
      }
      const data = extractArtifactData(content);
      let result;
      try {
        // REUSE: kind-aware Ajv validate; errors already formatted as
        // "<instancePath>: <message> (<details>)" by validator.formatErrors().
        result = await validator.validate(data, conv.kind);
      } catch (err) {
        addViolation(relPath, `validation error for kind '${conv.kind}': ${err.message}`);
        summary.invalid += 1;
        continue;
      }
      if (result.isValid) {
        summary.valid += 1;
        if (!opts.quiet) process.stdout.write(`  ok    ${relPath} (${conv.kind})\n`);
      } else {
        summary.invalid += 1;
        for (const e of result.errors) {
          addViolation(relPath, `[${conv.kind}] ${e}`);
        }
      }
    }
  }
  return summary;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  // LAYER 1 — meta-validation (always).
  const { files: schemaFiles, method } = discoverSchemas();
  if (schemaFiles.length === 0) {
    process.stderr.write(`[validate-schemas] FATAL: no *.schema.json discovered (method: ${method}).\n`);
    process.exit(2);
  }
  if (!opts.quiet) process.stdout.write(`[validate-schemas] meta-validating ${schemaFiles.length} schema(s) (${method}):\n`);
  const compiledOk = metaValidate(schemaFiles, opts);

  // LAYER 2 — kind coverage.
  const coverage = await kindCoverage();

  // LAYER 3 — artifacts (no-op clean when absent).
  const artifacts = await validateArtifacts(opts);

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  process.stdout.write(`\n[validate-schemas] summary\n`);
  process.stdout.write(
    `  schemas checked : ${schemaFiles.length} (${compiledOk} compiled OK, ${schemaFiles.length - compiledOk} failed)\n`
  );
  process.stdout.write(
    `  kinds covered   : ${coverage.found.length}/${KNOWN_KINDS.length} ` +
      `(found: ${coverage.found.join(', ') || 'none'}` +
      `${coverage.missing.length ? ` | missing: ${coverage.missing.join(', ')}` : ''})\n`
  );
  if (artifacts.total === 0) {
    process.stdout.write(`  artifacts       : 0 artifacts found (skipped)\n`);
  } else {
    const perKind = Object.entries(artifacts.kinds)
      .map(([k, n]) => `${k}:${n}`)
      .join(', ');
    process.stdout.write(
      `  artifacts       : ${artifacts.total} validated (${artifacts.valid} valid, ${artifacts.invalid} invalid) [${perKind}]\n`
    );
  }

  if (violations.length === 0) {
    process.stdout.write(`\n[validate-schemas] OK — all schemas compile, all known kinds covered, all artifacts valid.\n`);
    process.exit(0);
  }

  process.stdout.write(`\n[validate-schemas] FAIL — ${violations.length} violation(s):\n`);
  const byFile = new Map();
  for (const v of violations) {
    if (!byFile.has(v.file)) byFile.set(v.file, []);
    byFile.get(v.file).push(v.message);
  }
  for (const [file, msgs] of byFile) {
    process.stdout.write(`\n  ${file}\n`);
    for (const m of msgs) process.stdout.write(`    - ${m}\n`);
  }
  process.stdout.write(`\n`);
  process.exit(1);
}

main().catch((err) => {
  process.stderr.write(`[validate-schemas] FATAL (uncaught): ${err && err.stack ? err.stack : err}\n`);
  process.exit(2);
});
