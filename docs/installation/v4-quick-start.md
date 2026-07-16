# Quick Start

> This filename is retained for existing links. It documents the current
> public CLI, not a separate v4 installer.
>
> [Portugues](../pt/installation/v4-quick-start.md)

## Requirements

- Node.js 18 or newer; Node.js 22 LTS is recommended.
- npm 9 or newer.
- Claude Code, Codex, or both.
- Git for versioned projects.

## Install in a project

From an existing repository:

```bash
npx sinapse-ai@latest install
```

For a new project, create its directory first and run the same installer:

```bash
mkdir my-project
cd my-project
git init
npx sinapse-ai@latest install
```

With no flags, a fresh installation configures Claude Code and Codex. Re-running
the command updates framework-managed files while preserving project-owned
content and the saved provider selection.

## Verify

```bash
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Review `git status` after installation before committing generated integration
files.

## Activate SINAPSE

| Provider | Activation |
|---|---|
| Claude Code | `@sinapse-orqx` |
| Codex | `$snps` |

The orchestrator routes the request to the appropriate specialist. Direct Codex
activation is also available through `$sinapse-agent <agent-id>`.

## Deliver software

The primary workflow is:

```text
@sprint-lead draft -> @product-lead validate -> @developer implement -> @quality-gate gate -> @devops PR/release
```

Select the exact workflow with the
[software engineering applicability guide](../framework/software-engineering-applicability.md).

## Next steps

- [Installation contract](README.md)
- [Agent reference](../agent-reference-guide.md)
- [Claude and Codex integration](../guides/ide-integration.md)
- [Troubleshooting](troubleshooting.md)
- [Support](../../SUPPORT.md)
