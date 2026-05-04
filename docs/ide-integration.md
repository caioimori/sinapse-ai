# IDE Integration — Compatibility Matrix

## Supported IDEs

| IDE | Status | Instructions File | Delegation | Skills |
|-----|--------|------------------|------------|--------|
| Claude Code | Works | `.claude/CLAUDE.md` | `.claude/rules/mandatory-delegation.md` | `.claude/commands/` |
| Codex CLI | Limited | `.codex/instructions.md` | `.codex/delegation-matrix.json` | `.codex/skills/` |

## Parity Requirements

### Claude Code
- CLAUDE.md with full agent activation rules
- Rules in `.claude/rules/` for governance
- Hooks in `.claude/hooks/` for enforcement
- Skills in `.claude/commands/` for slash commands

### Codex
- instructions.md with agent activation rules
- Delegation matrix in `.codex/delegation-matrix.json`
- Delegation parity in `.codex/delegation-parity.json`
- Skills in `.codex/skills/`
- Agents in `.codex/agents/`

## Cross-IDE Contracts

Both IDEs must maintain:
1. Same agent roster (19 orchestrators + framework agents)
2. Same delegation routes
3. Same skill coverage
4. Handoff packet schema compatibility

## Release Contract

Current release: 9.3.0
Contract path: `.sinapse-ai/infrastructure/compatibility-contract.yaml`
