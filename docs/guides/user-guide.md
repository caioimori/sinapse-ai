# User Guide

SINAPSE AI adds governed agents, skills, rules, hooks, and workflows to Claude
Code and Codex.

SINAPSE includes 172 specialized agents across 17 domain squads.

```bash
npx sinapse-ai@latest install
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

| Intent | Claude Code | Codex |
|---|---|---|
| Route any request | `@sinapse-orqx` | `$snps` |
| Use a developer directly | `@developer` | `$sinapse-agent developer` |
| Use QA directly | `@quality-gate` | `$sinapse-agent quality-gate` |

The orchestrator classifies and delegates. Material code changes move through a
ready story, implementation, QA, and the protected PR flow.

Continue with:

- [Getting started](../getting-started.md)
- [Agent reference](../agent-reference-guide.md)
- [Engineering applicability](../framework/software-engineering-applicability.md)
- [Provider integration](ide-integration.md)
- [Support](../../SUPPORT.md)
