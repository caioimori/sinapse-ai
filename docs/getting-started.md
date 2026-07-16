# Getting Started

Install SINAPSE AI in an existing or new project and route the first request in
about two minutes.

> [Portugues](pt/getting-started.md)

## Requirements

- Node.js 18 or newer (Node.js 22 LTS recommended)
- npm 9 or newer
- Claude Code, Codex, or both
- Git for repository workflows

## Install

Run this command from the project directory:

```bash
npx sinapse-ai@latest install
```

On a fresh project, the no-flag path installs native integration for **Claude
Code and Codex**. Re-running the command preserves the saved provider selection
and project-owned content.

Use an explicit provider only when the project should be restricted:

```bash
npx sinapse-ai@latest install --llm=claude-code
npx sinapse-ai@latest install --llm=codex
```

Use `--reconfigure` to change a saved selection.

## Verify

```bash
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

If the diagnostic finds a repairable configuration problem:

```bash
npx sinapse-ai@latest doctor --fix
```

## Route the first request

Claude Code:

```text
@sinapse-orqx
Plan and implement a small authenticated API change.
```

Codex:

```text
$snps
Plan and implement a small authenticated API change.
```

Direct specialist activation:

| Role | Claude Code | Codex |
|---|---|---|
| Developer | `@developer` | `$sinapse-agent developer` |
| Architect | `@architect` | `$sinapse-agent architect` |
| QA | `@quality-gate` | `$sinapse-agent quality-gate` |

The orchestrator classifies the request and delegates domain work. Code changes
normally require a ready story before implementation.

## Update safely

```bash
npx sinapse-ai@latest update
```

The updater refreshes framework-managed files and preserves project-owned
content. Review the resulting diff before committing. Use `install --force`
only when deliberately refreshing the managed installation.

## Next steps

- [Choose the engineering workflow](framework/software-engineering-applicability.md)
- [Understand installation ownership](installation/README.md)
- [Browse agents](agent-reference-guide.md)
- [Integrate providers](guides/ide-integration.md)
- [Troubleshoot](troubleshooting.md)
- [Get support](../SUPPORT.md)
