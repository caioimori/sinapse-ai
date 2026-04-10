# Codex Integration Process

## Overview

Process for integrating Codex CLI with the SINAPSE-AI framework, ensuring parity with Claude Code.

## Steps

1. **Agent Sync** — Ensure all agents in `.claude/` have corresponding entries in `.codex/agents/`
2. **Delegation Matrix** — Maintain `.codex/delegation-matrix.json` with all orchestrators and routes
3. **Skills Parity** — Mirror `.claude/commands/` skills in `.codex/skills/`
4. **Validation** — Run `npm run validate:parity` to verify cross-IDE consistency

## Validation

```bash
npm run validate:parity
```

## Contract

The compatibility contract at `.sinapse-ai/infrastructure/contracts/compatibility/sinapse-4.0.4.yaml` defines which checks must pass for each IDE.
