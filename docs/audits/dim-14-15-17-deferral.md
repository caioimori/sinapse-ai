# Dimensions 14, 15, 17 — Deferred to Post-GA

> **Epic:** `docs/epics/epic-clinical-audit-pre-ga.md`
> **Status:** **DEFERRED** (out-of-scope for v1.0.0 GA)
> **Decision date:** 2026-04-28
> **Decision-maker:** @architect (Aria, Visionary), pending Caio reactivation
> **Caio override:** can reactivate any deferred dimension by saying so explicitly

## Why these three are deferred

The pre-GA audit epic enumerates 17 dimensions. Block 2 (this work) covered Phase 4 (actors): Dim 3 Agents, 4 Subagents, 5 Workers, 6 Squads, 7 Clones. Phase 5 of the epic — Dim 14 (Pesquisas), 15 (Base de conhecimento), 17 (Alucinações) — is grouped under "cognition" and was not in scope for Block 2.

This document captures **per-dimension deferral rationale** so Caio can decide whether to reactivate any of them before GA.

---

## Dimension 14 — Pesquisas (Research)

**Original scope (epic line 34):** "tech-search, deep research pipelines, vault grounding, WebFetch/WebSearch contracts" — primary executor @analyst.

### Why deferred to post-GA

1. **Already partially covered by Dim 5 (Workers).** The `tech-search` skill is the primary research mechanism (`.claude/skills/tech-search/SKILL.md`). Dim 5 inspected it as a Haiku-worker pattern (F5-3, F5-4). The remaining surface (vault grounding, WebFetch/WebSearch contracts) is observational, not behavioral.
2. **No CRITICAL/HIGH risk surfaced in adjacent dimensions.** Dims 1, 2, 8, 9, 10 all touched research-adjacent paths and produced 0 P0 findings. Research pipelines do not directly affect install/runtime correctness for v1 GA.
3. **Vault grounding is global rule, not repo concern.** `vault-grounding.cjs` lives in `~/.claude/hooks/` (per `~/.claude/CLAUDE.md` "Second Brain — Grounding Universal"). The `sinapse-ai` repo does not control or ship this hook. Auditing it would either require reading the hook (out-of-scope per task constraint: "Auditoria APENAS no repo `sinapse-ai`") or analyzing observed behavior (post-GA telemetry).
4. **Out-of-scope evidence:** the constraint in this audit's task explicitly says "`~/.claude/` global do Caio fica intocado".

### What would trigger reactivation

- A user reports inconsistent or hallucinated research output via `/tech-search`.
- Telemetry post-GA shows WebSearch/WebFetch failure modes (e.g. timeouts, rate limits not handled).
- An incident involving the framework producing un-cited claims that should have been research-grounded.

### Suggested post-GA path

If reactivated, scope: (a) audit `.claude/skills/tech-search/SKILL.md` against actual usage logs, (b) verify WebFetch redirect handling and 15-min cache behavior matches docs, (c) test vault-grounding fallback when no vault routing matches.

---

## Dimension 15 — Base de conhecimento (Knowledge Base)

**Original scope (epic line 35):** "Second Brain, vault routing, domain rules, rule-injection layers" — primary executor @analyst.

### Why deferred to post-GA

1. **Same scope-boundary issue as Dim 14.** Vault grounding lives in `~/.claude/`, outside this repo. Auditing the repo would only verify references TO the vault (e.g. `~/.claude/CLAUDE.md` cites it), not the vault itself.
2. **Knowledge bases inside squads are covered by Dim 6.** The drift in `knowledge_bases_count` across 5 squads is filed as F6-1 (P1). What remains is *content quality* of KBs, which is not what a clinical audit produces — content quality is a domain-expert review (e.g. brand expert reviews squad-brand KBs), not an architectural one.
3. **Rule-injection layers are documented and load deterministically.** The hook `synapse-engine.cjs` (`~/.claude/rules/hook-governance.md` UserPromptSubmit table) is the rule-injection layer. It is global, not repo-shipped. Same boundary as Dim 14.
4. **Domain rules are individually cited across other dimensions.** Dim 2 (Workflows), Dim 9 (Skills), Dim 10 (Tools), Dim 16 (Token Economy) each cite the relevant `~/.claude/rules/*.md`. The cross-cutting "are all rules consistent?" question is exactly Dim 17 territory (which is also deferred — see below).

### What would trigger reactivation

- A user reports that a rule in `~/.claude/rules/*.md` contradicts shipped behavior in `sinapse-ai`.
- A new rule is added that needs ratification across the repo.
- KB drift (F6-1) is not fixed and starts producing hallucinated KB references.

### Suggested post-GA path

If reactivated, scope: (a) inventory all `~/.claude/rules/*.md` (15 per memory entry "Claude Code Setup Audit"), (b) cross-reference each to its citation point in `sinapse-ai`, (c) flag rules that are cited but not shipped, or shipped but not documented.

---

## Dimension 17 — Alucinações (Anti-Hallucination)

**Original scope (epic line 37):** "Anti-hallucination checks, no-invention gate, verification protocols, file:line citation discipline" — primary executor @quality-gate.

### Why deferred to post-GA

1. **The audit epic itself is the anti-hallucination contract.** `epic-clinical-audit-pre-ga.md:7` says "every claim in an audit story MUST cite `file:line` of the current codebase". Every dimension audit (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 16) has applied this contract. Auditing the contract from inside the contract is recursive — better done from outside (e.g. external review post-GA).
2. **Constitutional Article IV ("No Invention") is enforced at gate level.** `~/.claude/rules/workflow-execution.md` (Spec Pipeline Constitutional Gate): "Every statement in spec.md MUST trace to FR-*, NFR-*, CON-*, or research finding". This is enforced per-spec, not per-codebase. A repo-level audit would observe spec compliance, not measure new violation rates.
3. **The signal is empirical, not architectural.** "How often does the framework produce hallucinated output?" is answered by usage telemetry, not by reading code. Pre-GA telemetry on this is not yet collected at scale; post-GA it will be.
4. **Verification protocols are scattered across rules and not centralized.** A meaningful Dim 17 audit requires a single source of "what counts as anti-hallucination". That source does not exist as a single document today (it is implicit across `token-economy.md`, `workflow-execution.md`, `coderabbit-integration.md`, hook governance, etc.). Authoring that source IS itself a Dim-17 prerequisite — which makes Dim 17 a chicken-and-egg item for the pre-GA window.

### What would trigger reactivation

- Caio decides to author a centralized anti-hallucination policy (`~/.claude/rules/anti-hallucination.md` or `.sinapse-ai/development/policies/anti-hallucination.md`). Once that exists, the audit can compare observed behavior to it.
- A user reports a high-profile hallucination incident from a SINAPSE-spawned agent (e.g. invented file paths, invented function signatures).
- v1.1 / v2.0 planning surfaces hallucination control as a feature axis.

### Suggested post-GA path

If reactivated, scope: (a) author the centralized anti-hallucination policy, (b) audit existing rules to identify implicit anti-hallucination clauses and cite them, (c) add automated checks (e.g. CI fail if a story or audit cites a `file:line` that doesn't exist).

---

## Summary

| Dim | Theme | Deferral reason | Pre-GA action? | Post-GA when reactivated |
|---|---|---|---|---|
| 14 | Pesquisas | Scope boundary (vault is global, not repo); no risk surfaced | None | Audit tech-search skill against usage logs |
| 15 | Base de conhecimento | Scope boundary (vault); KB drift in repo already filed as F6-1 | Fix F6-1 (Dim 6 R1+R2) | Cross-reference all `~/.claude/rules/*.md` to repo citations |
| 17 | Alucinações | Recursive (audit-of-audit-contract); needs central policy first; empirical signal not yet | None | Author central policy, then measure |

## Reactivation policy

Caio can reactivate any of these by saying so explicitly. Suggested form: "auditar dim 14 agora" / "rodar dim 17 com escopo X". The deferred status here is a default, not a hard close.

## Change Log

- 2026-04-28 — Deferral document authored as part of Block 2 (pre-GA clinical audit). Dim 14, 15, 17 deferred to post-GA with per-dimension rationale. @architect (Aria, Visionary).
