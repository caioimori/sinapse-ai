#!/usr/bin/env node
'use strict';

/**
 * Eval Harness — Runner (CLI)
 *
 * Discovers eval suites under `tests/evals/<gate>/evals.json`, runs each case
 * against the REAL verification gate (the exact same class the SDC workflow uses
 * via GateEvaluator), scores the GateResult with the deterministic scorer, and
 * prints a JSON report per gate plus a final aggregate block.
 *
 * Usage:
 *   node scripts/eval-runner.js          # run every gate that has tests/evals/<gate>/evals.json
 *   node scripts/eval-runner.js G5       # run only the G5 suite
 *
 * Exit code (FAIL-CLOSED — eval is a test, not production runtime):
 *   0  -> every case in every suite succeeded (success === true)
 *   1  -> at least one case failed, OR a suite file was malformed/unrunnable
 *
 * Hard guarantees:
 *   - Reads gates from the barrel (.sinapse-ai/core/ids/index.js). Never mutates
 *     a gate or verification-gate.js.
 *   - Pure Node, zero new dependencies, Windows-native paths via `path`.
 *   - Malformed evals.json produce an ACTIONABLE error naming the file.
 *
 * @module scripts/eval-runner
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const REPO_ROOT = path.resolve(__dirname, '..');
const EVALS_ROOT = path.resolve(REPO_ROOT, 'tests', 'evals');
const IDS_BARREL = path.resolve(REPO_ROOT, '.sinapse-ai', 'core', 'ids', 'index.js');
const SCORE_LIB = path.resolve(EVALS_ROOT, '_lib', 'score.js');

// Folders under tests/evals/ that are libraries, not gate suites.
const RESERVED_DIRS = new Set(['_lib']);

// ---------------------------------------------------------------------------
// Quiet logger — suppresses gate console noise during eval runs.
// ---------------------------------------------------------------------------

const QUIET_LOGGER = { info() {}, warn() {}, error() {}, log() {} };

// ---------------------------------------------------------------------------
// Lazy module loads (so a missing barrel produces an actionable message, not a
// raw stack at require time).
// ---------------------------------------------------------------------------

function loadIdsBarrel() {
  if (!fs.existsSync(IDS_BARREL)) {
    fail(`IDS barrel not found at ${IDS_BARREL}. Cannot instantiate gates.`);
  }
  try {
    return require(IDS_BARREL);
  } catch (err) {
    fail(`Failed to load IDS barrel ${IDS_BARREL}: ${err.message}`);
  }
}

function loadScoreLib() {
  if (!fs.existsSync(SCORE_LIB)) {
    fail(`Scorer not found at ${SCORE_LIB}.`);
  }
  try {
    return require(SCORE_LIB);
  } catch (err) {
    fail(`Failed to load scorer ${SCORE_LIB}: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// Gate factory — maps a gateId to a constructed gate instance.
//
// Mirrors GateEvaluator._buildGate wiring (timeoutMs + quiet logger). G3/G5
// take extra deps; G3 needs a RegistryLoader, the rest need a decisionEngine.
// We reuse the barrel's classes so the eval exercises the production gate.
// ---------------------------------------------------------------------------

function makeGateFactory(ids) {
  const {
    G1EpicCreationGate,
    G2StoryCreationGate,
    G3StoryValidationGate,
    G4DevContextGate,
    G5SemanticHandshakeGate,
    RegistryLoader,
    IncrementalDecisionEngine,
  } = ids;

  // Lazily built, shared across gates within one runner invocation.
  let registryLoader = null;
  let decisionEngine = null;

  function getRegistryLoader() {
    if (!registryLoader) registryLoader = new RegistryLoader();
    return registryLoader;
  }
  function getDecisionEngine() {
    if (!decisionEngine) decisionEngine = new IncrementalDecisionEngine(getRegistryLoader());
    return decisionEngine;
  }

  const logger = QUIET_LOGGER;

  return function buildGate(gateId) {
    switch (gateId) {
      case 'G1':
        return new G1EpicCreationGate({ decisionEngine: getDecisionEngine(), logger });
      case 'G2':
        return new G2StoryCreationGate({ decisionEngine: getDecisionEngine(), logger });
      case 'G3':
        return new G3StoryValidationGate({
          decisionEngine: getDecisionEngine(),
          registryLoader: getRegistryLoader(),
          logger,
        });
      case 'G4':
        return new G4DevContextGate({ decisionEngine: getDecisionEngine(), logger });
      case 'G5':
        return new G5SemanticHandshakeGate({ logger });
      default:
        return null;
    }
  };
}

// ---------------------------------------------------------------------------
// Suite discovery
// ---------------------------------------------------------------------------

/**
 * Discover every `tests/evals/<gate>/evals.json`.
 * @returns {Array<{ gateDir:string, gateFolder:string, evalsPath:string }>}
 */
function discoverSuites() {
  if (!fs.existsSync(EVALS_ROOT)) {
    return [];
  }
  const entries = fs.readdirSync(EVALS_ROOT, { withFileTypes: true });
  const suites = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (RESERVED_DIRS.has(entry.name)) continue;
    const evalsPath = path.resolve(EVALS_ROOT, entry.name, 'evals.json');
    if (fs.existsSync(evalsPath)) {
      suites.push({
        gateFolder: entry.name,
        gateDir: path.resolve(EVALS_ROOT, entry.name),
        evalsPath,
      });
    }
  }
  // Deterministic ordering by folder name.
  suites.sort((a, b) => a.gateFolder.localeCompare(b.gateFolder));
  return suites;
}

// ---------------------------------------------------------------------------
// Suite loading + shallow validation (actionable errors that name the file).
// ---------------------------------------------------------------------------

/**
 * Read + parse + shallow-validate an evals.json file.
 * Throws an Error with an actionable, file-scoped message on any problem.
 * @param {string} evalsPath
 * @returns {{ gateId:string, phase?:string, cases:Array<object> }}
 */
function loadSuite(evalsPath) {
  let raw;
  try {
    raw = fs.readFileSync(evalsPath, 'utf8');
  } catch (err) {
    throw new Error(`Cannot read eval suite '${evalsPath}': ${err.message}`);
  }

  let suite;
  try {
    suite = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Malformed JSON in '${evalsPath}': ${err.message}`);
  }

  if (!suite || typeof suite !== 'object' || Array.isArray(suite)) {
    throw new Error(`Eval suite '${evalsPath}' must be a JSON object.`);
  }
  if (typeof suite.gateId !== 'string' || !/^G[1-9][0-9]*$/.test(suite.gateId)) {
    throw new Error(
      `Eval suite '${evalsPath}' has missing/invalid "gateId" (expected /^G[1-9][0-9]*$/, got ${JSON.stringify(
        suite.gateId,
      )}).`,
    );
  }
  if (!Array.isArray(suite.cases)) {
    throw new Error(`Eval suite '${evalsPath}' is missing a "cases" array.`);
  }

  suite.cases.forEach((caseObj, i) => {
    const where = `'${evalsPath}' case[${i}]${caseObj && caseObj.id ? ` (id="${caseObj.id}")` : ''}`;
    if (!caseObj || typeof caseObj !== 'object' || Array.isArray(caseObj)) {
      throw new Error(`${where} must be an object.`);
    }
    if (typeof caseObj.id !== 'string' || caseObj.id.length === 0) {
      throw new Error(`${where} is missing a non-empty string "id".`);
    }
    if (!caseObj.context || typeof caseObj.context !== 'object' || Array.isArray(caseObj.context)) {
      throw new Error(`${where} is missing a "context" object (passed verbatim to gate.verify()).`);
    }
    if (!Array.isArray(caseObj.expectations) || caseObj.expectations.length === 0) {
      throw new Error(`${where} is missing a non-empty "expectations" array.`);
    }
  });

  return suite;
}

// ---------------------------------------------------------------------------
// Running a single suite
// ---------------------------------------------------------------------------

/**
 * Run every case in a loaded suite against its gate and score the results.
 *
 * @param {object} suite — { gateId, phase?, cases[] } from loadSuite().
 * @param {string} evalsPath — for error messages.
 * @param {function} buildGate — gateId -> gate instance.
 * @param {function} evaluateCase — scorer from score.js.
 * @returns {Promise<object>} per-gate report.
 */
async function runSuite(suite, evalsPath, buildGate, evaluateCase) {
  const gate = buildGate(suite.gateId);
  if (!gate) {
    throw new Error(
      `Eval suite '${evalsPath}' targets unknown gateId "${suite.gateId}". ` +
        'Known gates: G1, G2, G3, G4, G5.',
    );
  }
  if (typeof gate.verify !== 'function') {
    throw new Error(`Gate "${suite.gateId}" (from '${evalsPath}') has no verify() method.`);
  }

  const cases = [];
  let passedCount = 0;

  for (const caseObj of suite.cases) {
    let gateResult;
    try {
      gateResult = await gate.verify(caseObj.context);
    } catch (err) {
      // VerificationGate.verify() is fail-open and should not throw; if it does,
      // record the case as a hard failure with an actionable reason.
      cases.push({
        id: caseObj.id,
        score: 0,
        success: false,
        reason: `gate.verify() threw: ${err.message}`,
        failedExpectations: (caseObj.expectations || []).map((e) => ({
          id: e && e.id,
          reason: 'gate.verify() threw before scoring',
        })),
      });
      continue;
    }

    const scored = evaluateCase(gateResult, caseObj);
    if (scored.success) passedCount += 1;

    const failedExpectations = (scored.details || [])
      .filter((d) => !d.passed)
      .map((d) => ({ id: d.id, reason: d.reason }));

    cases.push({
      id: scored.id,
      score: scored.score,
      success: scored.success,
      reason: scored.reason,
      failedExpectations,
    });
  }

  return {
    gateId: suite.gateId,
    phase: suite.phase || null,
    source: evalsPath,
    cases,
    summary: {
      total: cases.length,
      passed: passedCount,
      failed: cases.length - passedCount,
    },
  };
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

async function main() {
  const argv = process.argv.slice(2);
  const requestedGate = (argv[0] || '').trim();

  if (requestedGate && !/^G[1-9][0-9]*$/i.test(requestedGate)) {
    fail(
      `Invalid gateId argument "${requestedGate}". Expected something like "G5", ` +
        'or no argument to run all suites.',
    );
  }

  const allSuites = discoverSuites();

  let suites = allSuites;
  if (requestedGate) {
    const target = requestedGate.toUpperCase();
    const targetFolder = target.toLowerCase();
    suites = allSuites.filter(
      (s) => s.gateFolder.toLowerCase() === targetFolder || s.gateFolder.toLowerCase() === target.toLowerCase(),
    );
    if (suites.length === 0) {
      fail(
        `No eval suite found for gate "${target}". Expected ` +
          `${path.resolve(EVALS_ROOT, targetFolder, 'evals.json')}.`,
      );
    }
  }

  // Nothing to do — clean exit, never crash (per smoke-run contract).
  if (suites.length === 0) {
    const empty = {
      runner: 'eval-runner',
      evalsRoot: EVALS_ROOT,
      gates: [],
      summary: { gates: 0, cases: 0, passed: 0, failed: 0, malformedSuites: 0 },
      success: true,
    };
    process.stdout.write(JSON.stringify(empty, null, 2) + '\n');
    process.exit(0);
  }

  const ids = loadIdsBarrel();
  const { evaluateCase } = loadScoreLib();
  const buildGate = makeGateFactory(ids);

  const reports = [];
  const malformed = [];

  for (const suiteRef of suites) {
    let suite;
    try {
      suite = loadSuite(suiteRef.evalsPath);
    } catch (err) {
      // Actionable, file-scoped error. Record as malformed -> fail-closed.
      malformed.push({ source: suiteRef.evalsPath, error: err.message });
      process.stderr.write(`[eval-runner] ${err.message}\n`);
      continue;
    }

    let report;
    try {
      report = await runSuite(suite, suiteRef.evalsPath, buildGate, evaluateCase);
    } catch (err) {
      malformed.push({ source: suiteRef.evalsPath, error: err.message });
      process.stderr.write(`[eval-runner] ${err.message}\n`);
      continue;
    }

    reports.push(report);
    // Per-gate report block.
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  }

  // Aggregate.
  const totalCases = reports.reduce((acc, r) => acc + r.summary.total, 0);
  const totalPassed = reports.reduce((acc, r) => acc + r.summary.passed, 0);
  const totalFailed = reports.reduce((acc, r) => acc + r.summary.failed, 0);
  const success = totalFailed === 0 && malformed.length === 0;

  const aggregate = {
    runner: 'eval-runner',
    evalsRoot: EVALS_ROOT,
    gates: reports.map((r) => ({
      gateId: r.gateId,
      total: r.summary.total,
      passed: r.summary.passed,
      failed: r.summary.failed,
    })),
    malformedSuites: malformed,
    summary: {
      gates: reports.length,
      cases: totalCases,
      passed: totalPassed,
      failed: totalFailed,
      malformedSuites: malformed.length,
    },
    success,
  };

  process.stdout.write('=== AGGREGATE ===\n');
  process.stdout.write(JSON.stringify(aggregate, null, 2) + '\n');

  // FAIL-CLOSED: any failed case or malformed suite -> exit 1.
  process.exit(success ? 0 : 1);
}

// ---------------------------------------------------------------------------
// Fatal helper — actionable message, exit 1 (fail-closed).
// ---------------------------------------------------------------------------

function fail(message) {
  process.stderr.write(`[eval-runner] ERROR: ${message}\n`);
  process.exit(1);
}

main().catch((err) => {
  // Last-resort guard: any unexpected throw fails closed with a stack.
  process.stderr.write(`[eval-runner] FATAL: ${err && err.stack ? err.stack : err}\n`);
  process.exit(1);
});
