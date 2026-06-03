# SINAPSE Eval Harness — Foundation

Deterministic evaluation layer for the IDS verification gates (G1-G5). It scores
a real `GateResult` (the exact output of `gate.verify(context)`) against a closed
set of deterministic predicates. No clock, no network, no LLM, no `eval()` —
total determinism, fully Windows-native, zero new network dependencies.

> **Article XI (additive, non-breaking):** the harness only *reads* a
> `GateResult`. It never mutates the result and never touches
> `.sinapse-ai/core/ids/verification-gate.js` or any gate implementation.

## Directory layout

```
tests/evals/
  _lib/
    predicates.js               # closed set of deterministic predicates (kind -> fn)
    score.js                    # toScore / evaluateCase -> universal Score shape
    eval-contract.schema.json   # JSON Schema (draft-07) for evals.json + triggers.json
  <gateLower>/                  # one folder per gate, e.g. g5/
    evals.json                  # per-gate test cases
    triggers.json               # phase routing assertions for the gate
  eval-harness.test.js          # jest wrapper — runs runner + linter (CI via npm test)
  README.md                     # this file

scripts/
  eval-runner.js                # runs each gate's evals.json against the real gate
  validate-evals.js             # Camada-1 structural linter (CI gate)
```

## The `GateResult` shape (input to the harness)

```js
{
  gateId, agent, timestamp, context,
  result: { passed:bool, blocking:bool, warnings:string[], opportunities:object[] },
  override: { reason, correctionPrompt, report } | null,
  executionMs, circuitBreakerState
}
```

- **G1-G4** are advisory: `result.passed === true`, never `blocking`.
- **G5** (semantic-handshake) measures: given a planning constraint (e.g. "use
  PostgreSQL") and proposed code that violates it (e.g. contains `sqlite`), it
  returns `result.passed === false` plus `override.correctionPrompt`.

## Predicate kinds (closed set)

Each predicate receives a `GateResult` and returns a boolean. Defined in
`tests/evals/_lib/predicates.js`.

| kind | arg | true when |
|------|-----|-----------|
| `passed_true` | — | `result.passed === true` |
| `passed_false` | — | `result.passed === false` |
| `blocking_true` | — | `result.blocking === true` |
| `blocking_false` | — | `result.blocking === false` |
| `has_warnings` | — | `result.warnings` is non-empty |
| `has_opportunities` | — | `result.opportunities` is non-empty |
| `opportunities_min` | `int` | `result.opportunities.length >= arg` |
| `warning_matches` | `regex string` | some warning matches `new RegExp(arg)` |
| `correction_prompt_present` | — | `override.correctionPrompt` is non-empty |
| `correction_prompt_matches` | `regex string` | `override.correctionPrompt` matches `new RegExp(arg)` |
| `execution_under_ms` | `int` | `executionMs < arg` (false if `executionMs` absent) |

Regex args are compiled with `new RegExp(string)` only — treated as data, never
as executable code.

## File contract

### `evals.json` (per gate, at `tests/evals/<gateLower>/evals.json`)

```json
{
  "gateId": "G5",
  "phase": "2_development",
  "cases": [
    {
      "id": "kebab-case-id",
      "description": "what this case exercises",
      "context": { "...": "passed verbatim to gate.verify(context)" },
      "expectations": [
        { "id": "e1", "description": "...", "kind": "passed_false" },
        { "id": "e2", "description": "...", "kind": "blocking_true" },
        { "id": "e3", "description": "...", "kind": "correction_prompt_matches", "arg": "TECH-POSTGRESQL" }
      ]
    }
  ]
}
```

- Each case has **at least 3 expectations**.
- `phase` is one of: `epic_creation`, `story_creation`, `story_validation`,
  `2_development` (the SDC phases mapped by `GateEvaluator`).

### `triggers.json`

```json
{
  "gateId": "G5",
  "positives": ["2_development"],
  "negatives": ["epic_creation", "story_creation", "story_validation"]
}
```

- `positives`: phases whose `getGatesForPhase(phase)` MUST include this gate.
- `negatives`: phases whose `getGatesForPhase(phase)` MUST NOT include it.

## Scoring (universal Score shape)

`tests/evals/_lib/score.js` exports `toScore` and `evaluateCase`.

```js
const { toScore, evaluateCase } = require('./_lib/score');

// gateResult was produced by: await gate.verify(caseObj.context)
const score = toScore(gateResult, expectations, { threshold: 1.0 });
// => { score: 0..1, reason, success, threshold, details:[{id,passed,reason}] }

const caseScore = evaluateCase(gateResult, caseObj, { threshold: 1.0 });
// => { id, description, score, reason, success, threshold, details }
```

- `score` = fraction of expectations whose predicate passed.
- `success` = `score >= threshold` (default `threshold = 1.0` => all must pass).

## How to run

Wired into package.json (`npm run <name>`) and into the jest suite
(`tests/evals/eval-harness.test.js`, so CI covers it via `npm test`):

```bash
# Execute the eval suite: load each gate's evals.json, run gate.verify(context),
# score with _lib/score.js, print pass/fail per case.    (npm run eval)
node scripts/eval-runner.js

# Validate every evals.json / triggers.json against _lib/eval-contract.schema.json
# and the >=3-expectations / closed-kind contract.        (npm run validate:evals)
node scripts/validate-evals.js
```

Both run with plain Node (no network, no new deps).
