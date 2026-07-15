# Epic: Codex Native Runtime Parity v2

> Status: Approved for story decomposition
> Created: 2026-07-12
> Owner: Project Lead
> Scope boundary: additive Codex integration only; Claude Code behavior remains unchanged.

## Executive summary

SINAPSE already exposes 172 agents and 1,347 resolvable task pointers to Codex, but the current integration is primarily a Markdown compatibility layer. Critical journeys such as spec, plan and orchestrate still depend on the Claude execution runtime, Codex project hooks do not translate `apply_patch`, four public spec commands do not resolve, and the Codex story-delivery route validates a story before drafting it.

This epic creates a native, project-local Codex runtime that reads the existing SINAPSE sources of truth at runtime. It preserves every Claude Code surface and does not modify protected L1/L2 paths.

## Problem statement

The current green validators establish file and pointer presence, not operational parity. A clean Codex installation cannot natively discover the 172 agents as custom TOML agents, cannot rely on the Claude hook payload contract for write protection, and cannot complete the canonical PRD -> Epic -> Story -> Spec -> Plan -> Development -> QA chain without broken aliases or a Claude-specific dispatcher.

## Objective

Make SINAPSE behave natively and safely in Codex CLI for planning, PRDs, project documentation, epics, stories, specs, implementation planning and bounded iterative delivery, while retaining the canonical Claude implementation byte-for-byte.

## Functional requirements

1. Generate additive `.codex/agents/*.toml` definitions for every resolvable SINAPSE agent while preserving the existing Markdown adapters.
2. Provide project-local Codex configuration for native multi-agent execution and hooks without pinning a model or overwriting user configuration.
3. Translate real Codex hook payloads, including multi-file `apply_patch`, into the existing SINAPSE guard contracts and fail closed for protected paths, secrets, unsafe Git operations and destructive SQL.
4. Resolve canonical public commands and normalized `sinapse-*` aliases, including every phase required by the spec-driven pipeline.
5. Resolve workflows from canonical task and workflow files at runtime, using task-first precedence when documents drift.
6. Correct Codex SDC routing to Project Lead -> Sprint Lead draft -> Product Lead validate -> Developer -> Quality Gate -> DevOps.
7. Make the delegation matrix and compatibility parity artifact equivalent and validate that equivalence.
8. Provide native Codex skills for supreme routing, spec-driven delivery and a bounded `@loop` equivalent with at most three correction iterations.
9. Provide an additive `sinapse-codex` entry point for doctor, resolution and workflow preparation without invoking Claude or changing the shared SINAPSE launcher.
10. Make the package and installer deliver and regenerate the native Codex artifacts idempotently and project-locally.
11. Replace presence-only confidence with strict parsers, hook fixtures, command execution checks, installer checks and golden workflow journeys.

## Non-functional requirements

- Zero edits under `.sinapse-ai/core/**`, `.sinapse-ai/constitution.md`, `bin/sinapse*.js`, protected L2 trees, `.sinapse-ai/infrastructure/**` or `.claude/**`.
- No model or reasoning-effort override in distributed configuration; inherit the user's Codex host capabilities.
- No secrets, absolute personal paths, nested Codex invocation or implicit global installation.
- Generated artifacts must be deterministic and idempotent.
- Windows and POSIX-compatible Node implementation using dependencies already present in the repository.
- Quality gates: lint, typecheck where applicable, tests, build and Codex-native validation.
- Preserve the user's preexisting worktree change in `.sinapse-ai/data/entity-registry.yaml`.

## Out of scope

- Replacing or refactoring the Claude master orchestrator or provider factory.
- Modifying canonical protected tasks, templates, checklists or workflows to hide Codex integration defects.
- Pushing, opening a PR, releasing or changing global Codex configuration.
- Promising bit-identical model output between Claude and Codex; parity means equivalent workflow authority, inputs, gates and artifacts.

## Delivery stories

1. **CODEX-V2-1 — Native foundation and safety:** project configuration, TOML agent generation, hook adapter, resolver aliases, SDC parity, strict validation and regression tests.
2. **CODEX-V2-2 — Spec-driven runtime:** workflow resolver, `sinapse-spec-driven`, `sinapse-loop` and additive `sinapse-codex` commands.
3. **CODEX-V2-3 — Distribution and golden journeys:** installer integration, packaging, clean-project E2E and documentation.

The current implementation session may deliver the three stories as one validated integrated story because they share a single compatibility boundary and require one end-to-end gate.

## Risks and mitigations

| Risk                        | Mitigation                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| Claude regression           | Do not edit `.claude/**` or shared protected runtime; add explicit unchanged-surface assertions. |
| Generated artifact drift    | Use one deterministic generator and a check mode in CI.                                          |
| Hook false negatives        | Test real `apply_patch` payload fixtures, including multiple files.                              |
| Hook portability failures   | Use repository-relative Node commands and `commandWindows`; avoid personal paths.                |
| Infinite iterative workflow | Keep loop opt-in, persisted in runtime state and capped at three iterations.                     |
| Validator false greens      | Parse content and execute critical resolutions instead of checking existence only.               |
| User config collision       | Ship project-local defaults and never overwrite global config.                                   |

## Definition of done

- [ ] All 172 agents have deterministic native TOML adapters and remain resolvable through legacy Markdown pointers.
- [ ] Protected writes and secret fixtures are blocked through real Codex hook payloads; safe writes pass.
- [ ] PRD, Epic, Story and all spec-pipeline public commands resolve to existing canonical tasks.
- [ ] SDC order and delegation artifacts match the canonical workflow.
- [ ] Codex-native spec, plan, orchestrate and bounded loop surfaces exist and do not invoke Claude.
- [ ] Package installation delivers the complete Codex layer idempotently in a temporary project.
- [ ] Strict native validators and golden journeys pass.
- [ ] Existing Codex, framework, lint, test and build gates pass.
- [ ] No protected or Claude Code file changed, and the user's preexisting worktree change remains untouched.
