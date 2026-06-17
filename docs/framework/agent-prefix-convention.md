# Agent Prefix Convention (Codex)

> Decision D5 of the Codex-parity program (E8). Defines how an agent signals
> *which* agent is speaking in environments without a status line.

## Why this exists

In Claude Code, the active agent is shown by the status line — the user always
knows whether Imperator, the developer, or a squad specialist is responding.
**Codex CLI has no status line.** Without a convention, every agent's output
looks identical and the user loses track of who is acting. D5 adopts a cheap,
text-only marker instead of trying to emulate a status line (which the platform
does not support).

## The convention

An agent prefixes its **activation greeting** and **handoff/routing lines** with
its name in brackets:

```
[Imperator] Diagnosed your briefing — routing to the brand squad.
[Brand Strategist] Positioning locked. Handing back to [Imperator].
```

- Plain text, no emoji (survives terminals/log pipes that strip emoji). The
  master agent's greeting may still carry its `👑 Imperator` banner; the bracket
  marker is the machine-stable signal.
- The bracket name matches the agent's display name (e.g. `[Imperator]`,
  `[Developer]`, `[Brand Strategist]`).

## Scope (conservative by default)

| Where | Prefix required? |
|-------|------------------|
| Coordinator activation greeting (Imperator / squad `*-orqx`) | **Yes** |
| Cross-agent handoff / routing announcements | **Yes** |
| A specialist's first line when it takes over a turn | **Yes** |
| Every subsequent line of a long answer | No (would bloat tokens across 172 agents) |
| One-line confirmations | No |

The goal is *discoverability of who is acting*, not decorating every sentence.
This keeps the token cost negligible while restoring the "who is speaking"
signal that Codex otherwise lacks.

## Claude Code vs Codex

- **Codex:** apply the bracket prefix per the table above.
- **Claude Code:** the status line already shows the active agent — the prefix
  is optional (the greeting banner is enough).

## Enforcement

This is a **convention**, not a hard gate (an agent's runtime output cannot be
blocked by a git hook). The golden-journey test
(`tests/integration/golden-journey.test.js`) checks that this convention is
documented and that the coordinator greeting carries the `[Imperator]` identity
marker. Security enforcement (secret / SQL / boundary) is separate and *is*
gated by the git hooks.
