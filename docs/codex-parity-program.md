# Codex Parity Program

## Overview

The Codex Parity Program ensures that SINAPSE-AI works identically across Claude Code and Codex CLI. Both IDEs share the same agent roster, delegation routes, and skill coverage.

## Status

| Component | Claude Code | Codex CLI | Parity |
|-----------|------------|-----------|--------|
| Agents (19 orqx) | Complete | Complete | Yes |
| Delegation Matrix | `.claude/rules/` | `.codex/delegation-matrix.json` | Yes |
| Skills | `.claude/commands/` | `.codex/skills/` | Yes |
| Hooks | `.claude/hooks/` | N/A | Claude-only |

## Commands

- `sinapse-orqx.onboard` — Onboard a new project with Codex integration
- `sinapse-orqx.plan` — Plan Codex parity work
- `sinapse-orqx.status` — Check current parity status
- `sinapse-orqx.resolve` — Resolve parity issues

## Validation

```bash
npm run validate:parity
```
