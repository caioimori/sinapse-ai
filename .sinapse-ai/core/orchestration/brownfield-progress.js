/**
 * Brownfield Discovery — deterministic progress + QA gate in code.
 *
 * Story onda3-s3-brownfield-progress-gate (AF-20260702 item 3.3).
 *
 * The 10 phases of brownfield-discovery.yaml are executed by agents (prose,
 * orchestrate-then-handoff). What was missing — and what this module adds —
 * is the DETERMINISTIC layer around that prose:
 *
 *   1. resolveBrownfieldProgress(): where the assessment actually stands,
 *      measured from artifacts ON DISK (not from what anyone claims), giving
 *      an exact resume point per phase.
 *   2. evaluateQaGate() / recordRework(): the Phase 7 verdict (APPROVED /
 *      NEEDS WORK) parsed from docs/reviews/qa-review.md by code, with a
 *      persisted rework counter capped at MAX_REWORK — the NEEDS WORK loop
 *      escalates instead of spinning forever.
 *
 * Honesty contract: an unfilled template ("[APPROVED / NEEDS WORK]") is
 * PENDING, not a verdict. Autonomous fan-out of phases 1-3 remains gated on
 * a measured pilot (same pre-registered gate as epic waves — see the epic
 * README of epic-onda3-estrutural); this module is the safe deterministic
 * substrate either way.
 *
 * @module core/orchestration/brownfield-progress
 */

'use strict';

const fs = require('fs');
const path = require('path');

const { fileHasContent } = require('./doc-first-resolver');

const QA_REVIEW_RELPATH = path.join('docs', 'reviews', 'qa-review.md');
const STATE_RELPATH = path.join('.sinapse', 'workflow-state', 'brownfield-discovery.json');

/** Rework ceiling for the Phase 7 loop (NEEDS WORK → fix → re-review). */
const MAX_REWORK = 2;

/** Normalize a step's `creates` (string | string[]) into a string list. */
function listArtifacts(step) {
  if (!step || !step.creates) return [];
  const raw = Array.isArray(step.creates) ? step.creates : [step.creates];
  return raw.filter((a) => typeof a === 'string' && a.trim().length > 0);
}

/** Glob-ish artifacts ("story-X.X-*.md") cannot be verified deterministically. */
function isCheckable(artifact) {
  return !artifact.includes('*');
}

/**
 * Resolve the real state of the brownfield discovery from disk.
 *
 * @param {string} projectRoot
 * @param {Object} workflow - Parsed `workflow` node (needs `.sequence`)
 * @returns {{phases: Array, nextPhase: ?number, complete: boolean}}
 */
function resolveBrownfieldProgress(projectRoot, workflow) {
  const sequence = (workflow && Array.isArray(workflow.sequence)) ? workflow.sequence : [];
  const byPhase = new Map();

  for (const step of sequence) {
    if (!step || typeof step.phase !== 'number') continue;
    if (!byPhase.has(step.phase)) {
      byPhase.set(step.phase, { phase: step.phase, name: step.phase_name || null, steps: [] });
    }
    const artifacts = listArtifacts(step).map((artifact) => {
      const checkable = isCheckable(artifact);
      return {
        path: artifact,
        checkable,
        exists: checkable ? fileHasContent(path.join(projectRoot, artifact)) : null,
      };
    });
    byPhase.get(step.phase).steps.push({
      id: step.step || step.id || null,
      agent: step.agent || null,
      conditional: Boolean(step.condition),
      condition: step.condition || null,
      artifacts,
    });
  }

  const phases = [...byPhase.values()].sort((a, b) => a.phase - b.phase);

  for (const phase of phases) {
    // Required = checkable artifacts of unconditional steps. Conditional steps
    // (e.g. project_has_database) never block completeness — but when their
    // artifacts DO exist they are reported, so nothing done is invisible.
    const required = phase.steps
      .filter((s) => !s.conditional)
      .flatMap((s) => s.artifacts.filter((a) => a.checkable));
    const present = required.filter((a) => a.exists);
    phase.requiredCount = required.length;
    phase.presentCount = present.length;
    if (required.length === 0) {
      phase.status = 'unverifiable';
    } else if (present.length === required.length) {
      phase.status = 'complete';
    } else if (present.length > 0) {
      phase.status = 'partial';
    } else {
      phase.status = 'pending';
    }
  }

  const firstIncomplete = phases.find(
    (p) => p.status === 'pending' || p.status === 'partial',
  );

  return {
    phases,
    nextPhase: firstIncomplete ? firstIncomplete.phase : null,
    complete: phases.length > 0 && !firstIncomplete,
  };
}

/**
 * Parse the Phase 7 verdict out of qa-review.md content.
 *
 * @param {string} content
 * @returns {'approved'|'needs_work'|'pending'|'malformed'}
 */
function parseQaGateStatus(content) {
  if (typeof content !== 'string') return 'malformed';
  const m = content.match(/gate status:\s*(.*)$/im);
  if (!m) return 'pending';
  const value = m[1].trim();
  const hasApproved = /approved/i.test(value);
  const hasNeedsWork = /needs\s+work/i.test(value);
  // The unfilled template is "[APPROVED / NEEDS WORK]" — both tokens present
  // means the reviewer never picked. That is PENDING, never a verdict.
  if (hasApproved && hasNeedsWork) return 'pending';
  if (hasApproved) return 'approved';
  if (hasNeedsWork) return 'needs_work';
  return 'malformed';
}

function statePath(projectRoot) {
  return path.join(projectRoot, STATE_RELPATH);
}

function readState(projectRoot) {
  try {
    const parsed = JSON.parse(fs.readFileSync(statePath(projectRoot), 'utf8'));
    return { reworkCount: 0, ...parsed };
  } catch {
    return { reworkCount: 0 };
  }
}

function writeState(projectRoot, state) {
  const file = statePath(projectRoot);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

/**
 * Evaluate the Phase 7 QA gate deterministically (read-only — never mutates
 * the rework counter; that is recordRework's job).
 *
 * @param {string} projectRoot
 * @returns {{verdict: string, reworkCount: number, maxRework: number, escalate: boolean, reviewPath: string, reason?: string}}
 */
function evaluateQaGate(projectRoot) {
  const reviewPath = path.join(projectRoot, QA_REVIEW_RELPATH);
  const state = readState(projectRoot);
  const base = {
    reworkCount: state.reworkCount,
    maxRework: MAX_REWORK,
    reviewPath: QA_REVIEW_RELPATH,
  };

  if (!fileHasContent(reviewPath)) {
    return { ...base, verdict: 'pending', escalate: false, reason: 'qa-review.md ausente ou vazio' };
  }

  let content;
  try {
    content = fs.readFileSync(reviewPath, 'utf8');
  } catch (error) {
    return { ...base, verdict: 'malformed', escalate: false, reason: `qa-review.md ilegível: ${error.message}` };
  }

  const verdict = parseQaGateStatus(content);
  const escalate = verdict === 'needs_work' && state.reworkCount >= MAX_REWORK;
  return { ...base, verdict, escalate };
}

/**
 * Record one NEEDS WORK → rework loop iteration. Call it when the flow
 * returns to Phase 4 after a NEEDS WORK verdict. At MAX_REWORK the gate
 * escalates instead of looping.
 *
 * @param {string} projectRoot
 * @returns {{reworkCount: number, escalate: boolean}}
 */
function recordRework(projectRoot) {
  const state = readState(projectRoot);
  state.reworkCount += 1;
  state.lastReworkAt = new Date().toISOString();
  writeState(projectRoot, state);
  return { reworkCount: state.reworkCount, escalate: state.reworkCount >= MAX_REWORK };
}

/** Reset the rework counter (new assessment cycle). */
function resetQaGateState(projectRoot) {
  writeState(projectRoot, { reworkCount: 0 });
}

module.exports = {
  resolveBrownfieldProgress,
  parseQaGateStatus,
  evaluateQaGate,
  recordRework,
  resetQaGateState,
  MAX_REWORK,
};
