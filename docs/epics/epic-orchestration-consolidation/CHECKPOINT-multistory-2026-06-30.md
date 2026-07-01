# Checkpoint "matar ou dobrar" — Multi-Story (2026-06-30)

> Decisive evaluation of the SINAPSE orchestration engine **under multi-story load**
> (3 dependent stories), the terrain where the engine was supposed to win after the
> trivial single-task benchmark (`CHECKPOINT-e2e-2026-06-30.md`) showed no advantage.
>
> Engineer: evaluation run, model sonnet/high. Real `claude` CLI dispatch
> (`SINAPSE_REAL_DISPATCH=1`, claude 2.1.197, Node v24). Hard timeouts: 8 min/story,
> ~20 min/arm. Sandbox outside the framework repo.

## The honest question

> "Does the SINAPSE orchestration engine produce a result that is **better, cheaper, or
> more portable** than running the same task **natively** (`claude` directly, no
> framework) — on a multi-story task with real dependencies between the parts?"

## The task (identical in both arms)

A no-dependency Node URL shortener, 3 chained stories:

1. **`url-1-codec`** — base62 `encode`/`decode` + tests.
2. **`url-2-store`** — `ShortenerStore.shorten/resolve` using story 1's codec. **Depends on 1.**
3. **`url-3-validation`** — reject non-http(s) URLs + idempotency. **Depends on 2.**

The 1→2→3 chain is deliberate: it exercises ordering, shared state, and gates between phases.

## Methodology

- **Sandbox:** `C:\Users\<user>\...\scratchpad\motor-multistory\` with `arm-a-motor\` and
  `arm-b-native\`. Nothing written to the framework repo except this report.
- **Arm A (motor):** 3 stories prepared as `docs/stories/*.md` (status `Ready`, ACs in the
  engine's `- [ ] AC1:` format) + an epic. Ran the canonical CLI path
  `node bin/sinapse.js orchestrate <story-id>` with `SINAPSE_REAL_DISPATCH=1`, in dependency
  order (1 → 2 → 3), each a separate process in the same working dir (so story 2 can consume
  story 1's `src/codec.js`, etc.). The CLI drives `MasterOrchestrator.executeFullPipeline()`
  → Epic 3 (Spec) → Epic 4 (Execution/BuildOrchestrator → real `claude` per subtask) → Epic 6
  (QA Loop).
- **Arm B (native):** one `claude --print --dangerously-skip-permissions` call with a single
  briefing of all 3 stories, in `arm-b-native\`.
- **Scoreboard:** ran the generated tests (`node --test`) in **both** arms; counted passes,
  `claude` invocations, wall time, and whether the engine's gates/state caught a real error or
  just added latency/failure.

## Arm B (native) — baseline

| Metric | Value |
|---|---|
| `claude` invocations | **1** |
| Wall time | **64 s** |
| Files produced | `src/codec.js`, `src/store.js`, `test/{codec,store,validation}.test.js` |
| Stories delivered | **3 / 3** |
| Tests | **9 pass / 0 fail** (`node --test`) |

One call, one minute, all three dependent stories implemented correctly and verified.

## Arm A (motor) — canonical pipeline, per story

| Story | Verdict | Wall | Code produced | Tests | What happened |
|---|---|---|---|---|---|
| `url-1-codec` | ❌ **FAILED** | 6m38s | `src/codec.js` + `test/codec.test.js` (high quality) | **5 pass / 0 fail** | Epic 3 spec + Epic 4 build were **good**. Pipeline reported FAILED because **Epic 6 QA could not run** (see Bug 2). |
| `url-2-store` | 🚫 **BLOCKED** | 3m08s | **none** | n/a | Epic 4 **skipped all subtasks** (stale shared build-state from story 1) → wrote no `store.js`. Epic4→6 gate then **approved an empty build (5.0)**; Epic6→7 blocked. |
| `url-3-validation` | 🚫 **BLOCKED** | 3m45s | **none** | n/a | Same stale-state skip → no code. Blocked. |

**Arm A combined `node --test`: 5 tests, 5 pass** — but only because the suite contains only the
codec (story 1). Stories 2 and 3 delivered **zero** functionality.

- **Stories delivered: 1 / 3.**
- **Total wall: ~13m31s** (+ ~2 min of Epic 3 spec generation in an earlier partial run that
  state-resumed into story 1; the `claude` spec call genuinely ran).
- **`claude` invocations:** story 1 alone issued **dozens** (real build subtasks + plan + spec +
  ~10 failed QA calls; the exact count is unreliable because story 1's log was contaminated by an
  earlier killed run sharing the log path). Net order-of-magnitude: **tens of calls vs native's 1**.

### Quality of what the engine *did* produce (it is good)

The engine is **not** a stub on the single-story happy path:

- **Epic 3 spec** (`docs/stories/url-1-codec/spec.md`) — accurate, complete, correctly derived the
  alphabet ordering and `encode(62) === "10"` boundary. (Minor: the analyst's identity badge
  `▌ 🔍 · SNPS · ANÁLISE · Scope` leaked into the artifact — agent-output-format concern.)
- **Epic 4 plan** (in `plan/build-state.json`) — real, AC-grounded subtasks with concrete
  `files` and executable `verification` commands (e.g. `node -e "...console.assert(encode(62)==='10')"`).
- **Epic 4 build** — the produced `src/codec.js` is clean, documented, and correct (5/5 tests).

The failure is **not** code quality. It is **coordination**: state isolation, the QA loop, and the gates.

## Scoreboard

| Dimension | Native (Arm B) | Motor (Arm A) | Winner |
|---|---|---|---|
| **Correctness** | 3/3 stories, 9/9 tests | 1/3 stories, 5/5 on the one it did | **Native** (3× the delivered scope) |
| **Cost** | 1 call, 64 s | ~tens of calls, ~13.5 min wall | **Native** (~13× wall, ~40×+ calls, for ⅓ the output) |
| **Coordination value** | n/a (single shot) | **Negative** — see below | **Native** |
| **Determinism / portability** | single portable call, no host state | stateful (`.sinapse/`, `plan/build-state.json`), non-portable, Windows nested-spawn failure, leaves stale state that corrupts the next run | **Native** |

### Did the motor's coordination earn its cost? No — it actively harmed the result.

- **State contamination broke the dependency chain** (the whole point of multi-story). Story 1's
  `completedSubtasks: [1.1,2.1,3.1,4.1]` persisted in a **shared, non-story-scoped**
  `plan/build-state.json`. Stories 2 and 3 loaded it, concluded "already done," and **skipped all
  implementation** → zero code. (Bug 1.)
- **The QA gate caught nothing** — Epic 6's review/fix `claude` calls failed on every attempt
  (Windows nested-spawn `exit 3221225794` / `0xC0000142`), so QA stubbed for all three stories.
  (Bug 2.)
- **A gate false-approved an empty build** — story 2 wrote no files yet `epic4_to_epic6` returned
  `approved (score 5.0)`. (Bug 3.)
- **The one genuine win:** the **honesty invariants** held. Story 1 was reported `FAILED` (not
  fake-green) because Epic 6 stubbed; the engine never claimed a success it didn't earn.

## Verdict — **KILL / HYBRID**

On the exact terrain where the engine was supposed to win, it delivered **less** (1/3 stories vs
3/3), cost **far more** (~13× wall, tens of calls vs 1), and its coordination layer **actively
degraded** the outcome: a non-story-scoped build state silently broke stories 2 and 3, the QA loop
could not execute, and a gate approved an empty build. Native `claude` produced all three dependent
stories, correctly, in one minute and one call.

This is **not** "the engine adds latency but is otherwise fine." Under multi-story load the engine
**exposed a correctness-breaking state-isolation bug** and a broken QA stage. The multi-story case
is worse than the trivial case, not better.

**What is salvageable (the HYBRID):** the single-story spec → plan → build path is genuinely good
(accurate spec, AC-grounded plan, correct code, working honesty invariants). A defensible future is:
keep Epic 3/Epic 4 for **single** stories, and **do not** run multi-story through the current engine
until (a) build/orchestrator state is story-scoped, (b) the QA loop's nested-`claude` spawn is fixed
on Windows, and (c) the Epic4→6 gate refuses to approve a build that wrote no files. Until then,
native (or a thin per-story wrapper) is the cheaper, more correct, more portable choice.

There is **no multi-story DAG executor** on the CLI: `orchestrate` runs one story per process;
cross-story ordering is the operator's job. So even "respecting dependency order" was done by the
human, not the engine — and the engine still corrupted the shared state between those ordered runs.

## Bugs found (file:line)

1. **CRITICAL — cross-story build-state contamination.**
   `.sinapse-ai/core/execution/build-orchestrator.js` persists `build-state.json` under
   `rootPath/plan/` (`DEFAULT_CONFIG.planDir = 'plan'`, ~L74-103; state/plan path resolves to
   `ctx.worktree?.path || this.rootPath` since `epic-4-executor.js:177` sets `useWorktree:false`).
   The path is **not story-scoped**, so `completedSubtasks` from one story make the next story skip
   all subtasks. Evidence: `plan/build-state.json` shows `storyId:"url-1-codec"`,
   `completedSubtasks:["1.1","2.1","3.1","4.1"]` reused across the story 2 and story 3 runs →
   `ℹ Skipping completed subtask: 1.1..4.1` → no `store.js`/validation code. **This breaks any
   multi-story run sharing a working directory.**

2. **MAJOR — Epic 6 QA `claude` spawn fails on Windows (nested invocation).**
   Epic 6's review/fix agent calls returned `Claude exited with code 3221225794` (`0xC0000142`,
   DLL init failure) on **all** attempts (3 iterations × 3 retries × review+fix), across all three
   stories → Epic 6 always falls back to STUB ("no real review agent wired"). The QA gate therefore
   inspected nothing. Path: `.sinapse-ai/core/orchestration/executors/epic-6-executor.js` QA loop →
   nested `claude` via the dispatcher/spawn-safe.

3. **MAJOR — Epic4→Epic6 gate approves an empty build.**
   Story 2 wrote zero files (all subtasks skipped) yet `Gate verdict: approved (score: 5.0)` for
   `epic4_to_epic6`. The gate has no "did the build actually produce/modify files?" check. Path:
   `.sinapse-ai/core/orchestration/gate-evaluator.js` (epic4_to_epic6 criteria).

4. **MINOR — broken require (dead module).**
   `.sinapse-ai/core/orchestration/executors/epic-4-executor.js` requires
   `../../infrastructure/scripts/plan-tracker`, which does not exist → `PlanTracker` is always
   `null` ("PlanTracker not available: Cannot find module ..."). Degrades gracefully but the plan
   tracker is effectively dead.

5. **MINOR / smell — redundant buildOptions double-pass.**
   `.sinapse-ai/core/orchestration/executors/epic-4-executor.js:175-182` constructs an options
   object (`useWorktree:false, autoMerge:false, runQA:false, ...buildOptions`) but then calls
   `builder.build(storyId, context.buildOptions || {})` — passing the wrong object. Harmless only
   because the constructor already merged the same defaults; still confusing/fragile.

6. **MINOR — persona badge leaks into artifact.**
   The analyst's identity selo `▌ 🔍 · SNPS · ANÁLISE · Scope` appears at the top of the generated
   `spec.md` (agent-output-format violation — internal badge in a deliverable).

## What I would measure next (if anyone wants to "double" later)

1. Re-run multi-story after story-scoping `build-state.json` (e.g. `plan/<storyId>/build-state.json`)
   — does the dependency chain then deliver 3/3?
2. Fix/replace the Epic 6 nested-`claude` spawn on Windows and re-check whether QA ever catches a
   real defect that native misses (the actual coordination value test).
3. Add a "build wrote files" precondition to the Epic4→6 gate and confirm it blocks the empty-build
   false-approve.
