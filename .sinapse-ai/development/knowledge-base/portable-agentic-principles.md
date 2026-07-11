# Portable Agentic Principles — how frontier models work, distilled for any LLM

> **Agente(s):** ALL agents · **Uso:** consult when designing agent behavior, choosing orchestration shape, porting SINAPSE practices to a different LLM provider, or explaining WHY a framework law exists · **Fonte:** distilled from frontier-model agentic behavior (Claude 5 generation) cross-checked against SINAPSE production audits (AF-20260629, AF-20260702, AF-20260704) · **Complementa:** token-economy-guide.md, agent-communication-protocol.md, gotchas-patterns.md

The power you see in a frontier agentic model is **model × harness**: the model is the brain (reasoning, knowledge, judgment); the harness is the body (tools, gates, memory files, injected rules). Most of that power is portable, because it lives in the harness and the process — not in the model weights. SINAPSE is such a harness. This document names the 10 principles that make any capable LLM work reliably, maps each to where SINAPSE already implements it, and states how to port it to any other provider.

The engine changes. The operating system does not.

---

## 0. Summary table

| # | Principle | One-line law | SINAPSE implementation (examples) |
|---|---|---|---|
| 1 | Loop with brakes | Act → observe → repeat, with stop criteria | Quality gates, phase limits, QA loop |
| 2 | Spec before execution | The model executes what is written, not what you meant | Constitution Art. III, story gate hooks |
| 3 | Context is the scarce resource | Every irrelevant token dilutes the relevant ones | token-economy rule + context-tracker dual-trigger |
| 4 | Tools are contracts | Clear description in, actionable error out | Tool registry, tool-descriptions lint guard |
| 5 | Verification is built in | LLM output is untrusted input | Lint guards, evals, schema validation, QA gate |
| 6 | External versioned memory | The model forgets; files do not | Agent MEMORY.md, epics/stories, audit trail |
| 7 | Guardrails as code | A rule that matters becomes a blocking check | PreToolUse hooks, pre-push guards, CI |
| 8 | Fan-out with distilled synthesis | Many isolated readers, one clean conclusion | Saved audit workflows, handoff artifacts |
| 9 | Effort and model routing | Match model tier AND reasoning depth to the task | token-economy §2 routing table, models registry |
| 10 | Grounding beats memory | Inject current truth; never let the model "remember" it | Entity registry, metadata.json as canonical counts |

---

## 1. Loop with brakes

**What it is.** An agentic model does not answer — it cycles: read context → reason → act (call a tool) → observe the result → reason again, until a done-criterion is met. Each cycle self-corrects, which is why agents finish long tasks without being right on the first try.

**Why it works.** Convergence replaces perfection. But an unbounded loop is a wanderer: without an explicit definition of done and a maximum iteration count, the same mechanism that self-corrects will also run forever or thrash.

**SINAPSE today.** Workflow phases with limits, the QA loop's bounded retry, and gate verdicts (PASS/CONCERNS/FAIL) that end cycles decisively.

**Portable to any LLM.** The loop, the brakes and the done-predicate live in YOUR harness, not in any provider feature: max iterations, wall-clock timeout, and an explicit done-check evaluated outside the model. Native function calling is one adapter for the act step when available — a text-only model with structured replies parsed by the harness runs the same loop. Irreversible actions get a human checkpoint before the loop may proceed.

## 2. Spec before execution

**What it is.** Work starts from a short written spec — objective, scope in/out, acceptance criteria — and only then becomes code.

**Why it works.** The model executes what is written, not what you meant. Ambiguity that costs one sentence in a spec costs a rewrite in an implementation. The larger the task, the higher the interest rate on that debt.

**SINAPSE today.** Constitution Art. III (documentation-first) enforced by blocking hooks: code edits require a story at status Ready with acceptance criteria; large project types require brief → PRD → architecture before any story.

**Portable to any LLM.** Provider-independent — this is process, not API. Keep the spec in the prompt context during execution and require every change to trace back to an acceptance criterion (no-invention rule).

## 3. Context is the scarce resource

**What it is.** The context window is finite working memory, and everything in it competes for attention. An irrelevant token is not just cost — it dilutes the relevant ones and degrades output quality.

**Why it works (mechanically).** Attention is shared. Clean context = focused model = higher quality AND lower cost. The two goals are the same goal.

**SINAPSE today.** The token-economy rule (compaction trigger at the LESSER of 60% of the window and an absolute alive-history ceiling, executable in the context tracker), surgical reads (offset/limit), parallel independent calls, handoff artifacts instead of full persona reloads.

**Portable to any LLM.** Curate what enters every prompt: retrieve the minimum sufficient facts, summarize long histories, place critical instructions at the edges, and compact before the window degrades. Sub-tasks return distilled summaries, never raw dumps.

## 4. Tools are contracts

**What it is.** A tool is a typed socket: name, description, strict input schema. The model's tool-use quality depends less on "intelligence" and more on contract clarity.

**Why it works.** Ambiguous descriptions produce wrong calls; error messages that do not teach the next step produce infinite trial-and-error. Few high-value tools beat many overlapping ones.

**SINAPSE today.** The tool registry with usage priority, and a lint guard that validates tool descriptions. Agents prefer native tools over shell equivalents by rule.

**Portable to any LLM.** Most providers ship native function/tool calling (OpenAI-style tools, Gemini function declarations, Claude tools); where it is absent, the same contract holds over structured text replies parsed by the harness. Port the discipline, not the syntax: one sentence of purpose + one of constraints per tool; errors that state what to do next; least agency (only the tools the task needs).

## 5. Verification is built in

**What it is.** LLM output is untrusted input — to your system AND to the model's own next step. "Done" is claimed only after exercising the change: run the test, take the screenshot, execute the flow.

**Why it works.** Models fail plausibly: output that LOOKS right survives review by reading, but not review by execution. Under pressure to complete, a model fills gaps with plausible inventions — verification is the antidote, and every production failure becomes a regression eval.

**SINAPSE today.** 13 parallel lint guards on pre-commit/pre-push, schema validation on structured outputs, the eval suite with gate evaluator, adversarial verification in audit workflows (findings survive only if independent skeptics fail to refute them), and the QA gate agent as final arbiter.

**Portable to any LLM.** Validate structure (JSON schema) AND content (does the claimed file:line exist? does the test pass?). Never optimize a prompt without a baseline eval; never trust a self-reported success.

## 6. External versioned memory

**What it is.** Models do not learn between sessions. All continuity — project state, decisions, gotchas — is context engineering: files re-presented each session, not "remembering."

**Why it works.** Weights are frozen at training; the session window is ephemeral. Anything worth keeping must live outside the model, in versioned, greppable text.

**SINAPSE today.** Per-agent MEMORY.md files (with the "memory as hints, verify against the codebase" law), versioned epics and audit reports as institutional memory, stories as work-state, git history as the ultimate audit trail.

**Portable to any LLM.** Files or a database — provider-irrelevant. Two disciplines matter: store only what would surprise a future session (never what code/git already records), and treat recalled memory as a hypothesis to verify, never as ground truth.

## 7. Guardrails as code

**What it is.** A rule that matters is enforced by a deterministic check that BLOCKS, not by a paragraph the model may forget.

**Why it works.** Models are non-deterministic: the same instruction produces different compliance across runs. Code does not. Instructions calibrate behavior; interceptors guarantee it.

**SINAPSE today.** PreToolUse hooks that block code writes without a Ready story; pre-push guards (external references, personal leaks, manifest parity, metrics accuracy, orchestrator discipline); CI as the last gate. The framework's own history shows the pattern: every rule that caused an incident became a hook.

**Portable to any LLM.** Wrap the model with interceptors in YOUR runtime: validate before executing any model-initiated action, scan diffs before commit, gate deploys on sync checks. If a rule's violation would be expensive, it must be impossible, not discouraged.

## 8. Fan-out with distilled synthesis

**What it is.** For wide work (audit 50 files, research 10 sources), dispatch parallel sub-agents — each with its OWN isolated context — and collect distilled, structured conclusions. The orchestrator keeps the map; workers eat the details.

**Why it works.** It multiplies effective context (N windows instead of one), cuts wall-clock time, and diversity of lenses catches what redundancy cannot. The failure mode is equally mechanical: raw dumps flowing back re-pollute the orchestrator — synthesis must be distilled and schema-shaped.

**SINAPSE today.** Saved audit workflows (multi-front discovery → severity-graduated adversarial verification → synthesis with GO/NO_GO verdict) and the compact handoff artifact between agents. Measured boundary: fan-out serves ANALYSIS; autonomous multi-story implementation lost to the assisted path 3/3 in production measurement — orchestrate reading, assist writing.

**Portable to any LLM.** Any API that allows concurrent calls supports this. Give each worker a self-contained prompt (workers see nothing implicit), force structured returns, and add adversarial verifiers for any finding you will act on.

## 9. Effort and model routing

**What it is.** Two dials, one decision: which model tier AND how much reasoning depth per task. Architecture decisions get the frontier tier at maximum deliberation; renames get the cheap tier at minimal deliberation.

**Why it works.** Reasoning depth is paid in tokens and latency; over-deliberating a trivial task buys nothing, and under-deliberating a hard one buys rework. Routing is the largest cost lever that does not touch quality.

**SINAPSE today.** The token-economy §2 routing table (task class → model → effort, with the subagent threshold), the executable models registry (context windows driving compaction), and the statusline announcing the active model.

**Portable to any LLM.** Every provider ships tiers (mini/standard/pro equivalents) and most expose a reasoning-depth control. Encode a task-class → (tier, depth) table as DATA consumed by your runtime, not prose repeated in prompts. Make the table risk-aware: for low-stakes work, when in doubt start one tier lower and escalate on failure; high-impact or irreversible tasks go straight to the frontier tier at full deliberation. Fall back by provider capability, never by defaulting downward.

## 10. Grounding beats memory

**What it is.** For anything that changes — counts, prices, configs, current state — inject the current truth into the prompt from a canonical source. Never let the model answer from its training memory or from stale notes.

**Why it works.** Training knowledge has a cutoff and no awareness of YOUR system's present state. Hallucination is worst exactly where confidence feels highest: familiar-looking facts.

**SINAPSE today.** metadata.json and the entity registry as the single source for ecosystem counts (Constitution Art. VII: exact numbers, updated in the same operation), registries in data/ consumed by code, and the metrics-accuracy lint guard.

**Portable to any LLM.** Retrieval-then-answer for anything mutable: fetch from the canonical source at prompt time, cite it, and forbid unsourced numbers. If two documents can state the same metric, one of them must be generated from the other.

---

## 11. Porting checklist — minimum harness for any LLM

Nine steps, in dependency order. Each maps to the principles above.

1. **Write the spec gate** (P2): no execution without a written objective + acceptance criteria.
2. **Define few, contract-clean tools** (P4) with actionable errors.
3. **Wrap the loop with brakes** (P1): max iterations, timeout, done-predicate, human checkpoint for irreversible actions.
4. **Add interceptors** (P7): validate every model-initiated action before it runs; block on violation.
5. **Validate every output** (P5): schema first, then content; production failures become regression evals.
6. **Budget the context** (P3): curate the minimum sufficient facts per call, cap tool output, and compact before the window degrades.
7. **Externalize memory** (P6): versioned files; recalled facts are hypotheses.
8. **Route by task class and risk** (P9): tier + reasoning depth as a data table.
9. **Ground mutable facts** (P10) and **fan out wide work** (P8) with distilled, verified synthesis.

A harness with these nine properties makes a mid-tier model reliable and a frontier model formidable. Skipping them makes even the best model an eloquent liability.
