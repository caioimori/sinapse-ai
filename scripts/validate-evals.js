#!/usr/bin/env node
'use strict';

/**
 * Eval Harness — Camada-1 LINTER (Structural Contract Validator)
 *
 * Deterministic CI gate. Validates EVERY eval contract under tests/evals/<gate>/:
 *   - evals.json   : gateId/phase/cases shape + per-case + per-expectation rules.
 *   - triggers.json: positives[]/negatives[] non-empty, no overlap.
 *
 * Single source of truth for predicate kinds + arg requirements:
 *   tests/evals/_lib/predicates.js  (PREDICATE_KINDS, ARG_REQUIRED).
 *   The closed kind set is NEVER duplicated here — it is imported.
 *
 * Hard guarantees:
 *   - Node puro, Windows-nativo, zero NEW dependency.
 *   - The >=3-expectations check and the kind-in-closed-set check are EXPLICIT
 *     in this code (not delegated to the JSON Schema), per contract.
 *   - The tests/evals/_lib/eval-contract.schema.json is used as an OPTIONAL
 *     reference layer when a draft-07 validator (ajv) is already installed.
 *     If ajv is absent, validation proceeds fully via the explicit checks.
 *
 * EXIT CODES:
 *   0  -> all contracts valid.
 *   1  -> at least one violation (each printed with file path + actionable fix).
 *   2  -> harness/internal error (e.g. predicates.js missing/unreadable).
 *
 * Wired into package.json as:
 *   "validate:evals": "node scripts/validate-evals.js"
 *
 * @module scripts/validate-evals
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const REPO_ROOT = path.resolve(__dirname, '..');
const EVALS_ROOT = path.join(REPO_ROOT, 'tests', 'evals');
const PREDICATES_PATH = path.join(EVALS_ROOT, '_lib', 'predicates.js');
const SCHEMA_PATH = path.join(EVALS_ROOT, '_lib', 'eval-contract.schema.json');

// ---------------------------------------------------------------------------
// Single source of truth — closed predicate set imported from the foundation.
// ---------------------------------------------------------------------------

let PREDICATE_KINDS;
let ARG_REQUIRED;
try {
  const predicates = require(PREDICATES_PATH);
  PREDICATE_KINDS = predicates.PREDICATE_KINDS;
  ARG_REQUIRED = predicates.ARG_REQUIRED;
  if (!Array.isArray(PREDICATE_KINDS) || PREDICATE_KINDS.length === 0) {
    throw new Error('PREDICATE_KINDS is not a non-empty array');
  }
  if (!ARG_REQUIRED || typeof ARG_REQUIRED !== 'object') {
    throw new Error('ARG_REQUIRED is not an object');
  }
} catch (err) {
  process.stderr.write(
    '[validate-evals] FATAL: could not load the closed predicate set from\n' +
      `  ${PREDICATES_PATH}\n` +
      `  reason: ${err.message}\n` +
      '  The foundation predicate library must exist and export PREDICATE_KINDS + ARG_REQUIRED.\n',
  );
  process.exit(2);
}

const KIND_SET = new Set(PREDICATE_KINDS);

// Kinds whose required arg is an INTEGER vs a non-empty STRING (regex source).
// Derived from the foundation contract; only applies to ARG_REQUIRED kinds.
const INT_ARG_KINDS = new Set(['opportunities_min', 'execution_under_ms']);
const STR_ARG_KINDS = new Set(['warning_matches', 'correction_prompt_matches']);

// Phase enum (mirrors GateEvaluator phases + schema). Used for triggers + evals.
const PHASE_ENUM = ['epic_creation', 'story_creation', 'story_validation', '2_development'];
const PHASE_SET = new Set(PHASE_ENUM);
const GATE_ID_RE = /^G[1-9][0-9]*$/;
const KEBAB_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ---------------------------------------------------------------------------
// Violation collection
// ---------------------------------------------------------------------------

/** @type {Array<{file:string, message:string}>} */
const violations = [];

function addViolation(file, message) {
  violations.push({ file, message });
}

// ---------------------------------------------------------------------------
// Optional Ajv reference layer (only if already installed — zero new dep).
// ---------------------------------------------------------------------------

let ajvLayer = null;
try {
  ajvLayer = buildAjvLayer();
} catch (_err) {
  ajvLayer = null;
}

function buildAjvLayer() {
  const Ajv = require('ajv');
  if (!fs.existsSync(SCHEMA_PATH)) return null;
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
  // strict:false silences Ajv 8 strictTypes noise on the union-typed `arg`
  // (the per-kind allOf already narrows it); explicit checks remain authoritative.
  const ajv = new Ajv({ allErrors: true, strict: false });
  ajv.addSchema(schema, 'eval-contract');
  const ref = (def) => ajv.compile({ $ref: `eval-contract#/definitions/${def}` });
  return { validateEval: ref('EvalFile'), validateTriggers: ref('TriggersFile') };
}

function ajvErrorsToLines(errors) {
  if (!errors || !errors.length) return [];
  return errors.map((e) => {
    const where = e.instancePath || e.dataPath || '(root)';
    return `schema: ${where} ${e.message}`;
  });
}

// ---------------------------------------------------------------------------
// Filesystem helpers
// ---------------------------------------------------------------------------

function readJson(file) {
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch (err) {
    return { ok: false, error: `cannot read file: ${err.message}` };
  }
  try {
    return { ok: true, data: JSON.parse(raw) };
  } catch (err) {
    return { ok: false, error: `invalid JSON: ${err.message}` };
  }
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/** Discover gate folders under tests/evals/ (every dir except _lib / _*). */
function discoverGateDirs() {
  let entries;
  try {
    entries = fs.readdirSync(EVALS_ROOT, { withFileTypes: true });
  } catch (err) {
    process.stderr.write(`[validate-evals] FATAL: cannot read ${EVALS_ROOT}: ${err.message}\n`);
    process.exit(2);
  }
  return entries
    .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
    .map((d) => path.join(EVALS_ROOT, d.name))
    .sort();
}

// ---------------------------------------------------------------------------
// Structural validators (EXPLICIT — these are the contract, not the schema).
// ---------------------------------------------------------------------------

function validateExpectation(file, caseId, caseIndex, exp, expIndex, seenExpIds) {
  const loc = `case[${caseIndex}] '${caseId}' -> expectation[${expIndex}]`;

  if (!isPlainObject(exp)) {
    addViolation(file, `${loc}: must be an object.`);
    return;
  }

  // id
  if (typeof exp.id !== 'string' || exp.id.length === 0) {
    addViolation(file, `${loc}: missing/empty 'id' (string required, unique within the case).`);
  } else if (seenExpIds.has(exp.id)) {
    addViolation(file, `${loc}: duplicate expectation id '${exp.id}' within case '${caseId}'.`);
  } else {
    seenExpIds.add(exp.id);
  }

  // kind — EXPLICIT closed-set check against the foundation.
  if (typeof exp.kind !== 'string' || exp.kind.length === 0) {
    addViolation(file, `${loc}: missing 'kind' (string required).`);
    return;
  }
  if (!KIND_SET.has(exp.kind)) {
    addViolation(
      file,
      `${loc}: unknown predicate kind '${exp.kind}'. Allowed (closed set from predicates.js): ${PREDICATE_KINDS.join(', ')}.`,
    );
    return;
  }

  // arg — required + typed per the foundation's ARG_REQUIRED contract.
  const needsArg = ARG_REQUIRED[exp.kind] === true;
  const hasArg = exp.arg !== undefined;

  if (needsArg && !hasArg) {
    addViolation(
      file,
      `${loc}: predicate '${exp.kind}' requires an 'arg' field${
        INT_ARG_KINDS.has(exp.kind) ? ' (integer >= 0)' : STR_ARG_KINDS.has(exp.kind) ? ' (non-empty regex string)' : ''
      }.`,
    );
  }

  if (needsArg && hasArg) {
    if (INT_ARG_KINDS.has(exp.kind)) {
      if (typeof exp.arg !== 'number' || !Number.isInteger(exp.arg) || exp.arg < 0) {
        addViolation(
          file,
          `${loc}: predicate '${exp.kind}' arg must be an integer >= 0 (got ${JSON.stringify(exp.arg)}).`,
        );
      }
    } else if (STR_ARG_KINDS.has(exp.kind)) {
      if (typeof exp.arg !== 'string' || exp.arg.length === 0) {
        addViolation(
          file,
          `${loc}: predicate '${exp.kind}' arg must be a non-empty regex string (got ${JSON.stringify(exp.arg)}).`,
        );
      } else {
        // Best-effort: ensure the regex source compiles (data only — new RegExp).
        try {
           
          new RegExp(exp.arg);
        } catch (reErr) {
          addViolation(
            file,
            `${loc}: predicate '${exp.kind}' arg is not a valid regex: ${reErr.message} (source: ${JSON.stringify(exp.arg)}).`,
          );
        }
      }
    }
  }

  // arg present but NOT expected -> warn-as-violation (keeps contract tight).
  if (!needsArg && hasArg) {
    addViolation(
      file,
      `${loc}: predicate '${exp.kind}' does not accept an 'arg' field — remove it (got ${JSON.stringify(exp.arg)}).`,
    );
  }
}

function validateCase(file, caseObj, caseIndex, seenCaseIds) {
  if (!isPlainObject(caseObj)) {
    addViolation(file, `case[${caseIndex}]: must be an object.`);
    return;
  }

  // id (kebab-case, unique)
  const caseId = typeof caseObj.id === 'string' ? caseObj.id : `<index ${caseIndex}>`;
  if (typeof caseObj.id !== 'string' || caseObj.id.length === 0) {
    addViolation(file, `case[${caseIndex}]: missing 'id' (kebab-case string required).`);
  } else if (!KEBAB_RE.test(caseObj.id)) {
    addViolation(file, `case[${caseIndex}] '${caseObj.id}': 'id' must be kebab-case (^[a-z0-9]+(-[a-z0-9]+)*$).`);
  } else if (seenCaseIds.has(caseObj.id)) {
    addViolation(file, `case[${caseIndex}] '${caseObj.id}': duplicate case id within the file.`);
  } else {
    seenCaseIds.add(caseObj.id);
  }

  // context (object, passed verbatim to gate.verify)
  if (!isPlainObject(caseObj.context)) {
    addViolation(file, `case[${caseIndex}] '${caseId}': missing 'context' (object required — passed to gate.verify()).`);
  }

  // expectations (array, >= 3 — EXPLICIT)
  if (!Array.isArray(caseObj.expectations)) {
    addViolation(file, `case[${caseIndex}] '${caseId}': missing 'expectations' (array required).`);
    return;
  }
  if (caseObj.expectations.length < 3) {
    addViolation(
      file,
      `case[${caseIndex}] '${caseId}': needs at least 3 expectations (has ${caseObj.expectations.length}). Add ${
        3 - caseObj.expectations.length
      } more.`,
    );
  }

  const seenExpIds = new Set();
  caseObj.expectations.forEach((exp, i) => validateExpectation(file, caseId, caseIndex, exp, i, seenExpIds));
}

function validateEvalFile(file, data) {
  if (!isPlainObject(data)) {
    addViolation(file, 'root must be a JSON object.');
    return;
  }

  // gateId
  if (typeof data.gateId !== 'string' || data.gateId.length === 0) {
    addViolation(file, 'missing \'gateId\' (string required, e.g. "G5").');
  } else if (!GATE_ID_RE.test(data.gateId)) {
    addViolation(file, `'gateId' must match ^G[1-9][0-9]*$ (got ${JSON.stringify(data.gateId)}).`);
  }

  // phase
  if (typeof data.phase !== 'string' || data.phase.length === 0) {
    addViolation(file, 'missing \'phase\' (string required).');
  } else if (!PHASE_SET.has(data.phase)) {
    addViolation(file, `'phase' must be one of: ${PHASE_ENUM.join(', ')} (got ${JSON.stringify(data.phase)}).`);
  }

  // cases (array >= 1)
  if (!Array.isArray(data.cases)) {
    addViolation(file, 'missing \'cases\' (array required).');
    return;
  }
  if (data.cases.length < 1) {
    addViolation(file, '\'cases\' must contain at least 1 case (has 0).');
  }

  const seenCaseIds = new Set();
  data.cases.forEach((c, i) => validateCase(file, c, i, seenCaseIds));

  // Optional Ajv reference layer.
  if (ajvLayer && ajvLayer.validateEval) {
    const okAjv = ajvLayer.validateEval(data);
    if (!okAjv) {
      ajvErrorsToLines(ajvLayer.validateEval.errors).forEach((line) => addViolation(file, line));
    }
  }
}

function validateTriggersFile(file, data) {
  if (!isPlainObject(data)) {
    addViolation(file, 'root must be a JSON object.');
    return;
  }

  // gateId
  if (typeof data.gateId !== 'string' || data.gateId.length === 0) {
    addViolation(file, 'missing \'gateId\' (string required, e.g. "G5").');
  } else if (!GATE_ID_RE.test(data.gateId)) {
    addViolation(file, `'gateId' must match ^G[1-9][0-9]*$ (got ${JSON.stringify(data.gateId)}).`);
  }

  const checkPhaseArray = (key, requireNonEmpty) => {
    const arr = data[key];
    if (!Array.isArray(arr)) {
      addViolation(file, `missing '${key}' (array of phases required).`);
      return [];
    }
    if (requireNonEmpty && arr.length === 0) {
      addViolation(file, `'${key}' must be non-empty (at least 1 phase).`);
    }
    arr.forEach((p, i) => {
      if (typeof p !== 'string' || !PHASE_SET.has(p)) {
        addViolation(
          file,
          `'${key}[${i}]' must be one of: ${PHASE_ENUM.join(', ')} (got ${JSON.stringify(p)}).`,
        );
      }
    });
    return arr;
  };

  const positives = checkPhaseArray('positives', true);
  // Contract: both non-empty. Schema only requires positives minItems 1, but the
  // task spec requires negatives non-empty too -> enforce explicitly.
  const negatives = checkPhaseArray('negatives', true);

  // No overlap between positives and negatives.
  const posSet = new Set(positives.filter((p) => typeof p === 'string'));
  const overlap = negatives.filter((p) => typeof p === 'string' && posSet.has(p));
  if (overlap.length > 0) {
    addViolation(
      file,
      `'positives' and 'negatives' overlap on: ${[...new Set(overlap)].join(', ')}. A phase cannot be both.`,
    );
  }

  // Optional Ajv reference layer.
  if (ajvLayer && ajvLayer.validateTriggers) {
    const okAjv = ajvLayer.validateTriggers(data);
    if (!okAjv) {
      ajvErrorsToLines(ajvLayer.validateTriggers.errors).forEach((line) => addViolation(file, line));
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function rel(p) {
  return path.relative(REPO_ROOT, p).split(path.sep).join('/');
}

function main() {
  const gateDirs = discoverGateDirs();

  if (gateDirs.length === 0) {
    process.stdout.write(`[validate-evals] No gate folders found under ${rel(EVALS_ROOT)}/ (nothing to validate).\n`);
    process.exit(0);
  }

  let filesChecked = 0;

  for (const dir of gateDirs) {
    const evalsFile = path.join(dir, 'evals.json');
    const triggersFile = path.join(dir, 'triggers.json');

    // evals.json — required per gate folder.
    if (!fs.existsSync(evalsFile)) {
      addViolation(rel(evalsFile), `missing required file 'evals.json' in gate folder ${rel(dir)}/.`);
    } else {
      filesChecked += 1;
      const parsed = readJson(evalsFile);
      if (!parsed.ok) {
        addViolation(rel(evalsFile), parsed.error);
      } else {
        validateEvalFile(rel(evalsFile), parsed.data);
      }
    }

    // triggers.json — required per gate folder.
    if (!fs.existsSync(triggersFile)) {
      addViolation(rel(triggersFile), `missing required file 'triggers.json' in gate folder ${rel(dir)}/.`);
    } else {
      filesChecked += 1;
      const parsed = readJson(triggersFile);
      if (!parsed.ok) {
        addViolation(rel(triggersFile), parsed.error);
      } else {
        validateTriggersFile(rel(triggersFile), parsed.data);
      }
    }
  }

  // Report.
  const refLayer = ajvLayer ? 'ajv (draft-07) reference layer: ON' : 'ajv reference layer: OFF (explicit checks only)';
  process.stdout.write(
    `[validate-evals] gate folders: ${gateDirs.length} | files checked: ${filesChecked} | ${refLayer}\n`,
  );
  process.stdout.write(`[validate-evals] predicate kinds (closed set, ${PREDICATE_KINDS.length}): ${PREDICATE_KINDS.join(', ')}\n`);

  if (violations.length === 0) {
    process.stdout.write('[validate-evals] OK — all eval contracts are structurally valid.\n');
    process.exit(0);
  }

  process.stdout.write(`\n[validate-evals] FAIL — ${violations.length} violation(s):\n`);
  // Group by file for readability.
  const byFile = new Map();
  for (const v of violations) {
    if (!byFile.has(v.file)) byFile.set(v.file, []);
    byFile.get(v.file).push(v.message);
  }
  for (const [file, msgs] of byFile) {
    process.stdout.write(`\n  ${file}\n`);
    for (const m of msgs) {
      process.stdout.write(`    - ${m}\n`);
    }
  }
  process.stdout.write('\n');
  process.exit(1);
}

main();
