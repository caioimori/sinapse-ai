# Installation FAQ

## Does the no-flag command install both providers?

Yes, for a fresh project:

```bash
npx sinapse-ai@latest install
```

An existing installation keeps its saved provider selection. Use
`--reconfigure` to change it.

## Can I install only one provider?

```bash
npx sinapse-ai@latest install --llm=claude-code
npx sinapse-ai@latest install --llm=codex
```

Single-provider installation is an explicit restriction, not the default.

## Can I use an existing project?

Yes. Run the installer from the repository root and review the resulting diff.
Framework-managed files are refreshed while project-owned content is preserved.

## How do I update?

```bash
npx sinapse-ai@latest update
```

Do not manually copy files from the npm cache or another project.

## How do I verify the installation?

```bash
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

## Does SINAPSE require API keys?

The framework installer does not require model-provider secrets in the
repository. Claude Code and Codex manage their own authentication. Never commit
tokens or put them in issue reports.

## Are squads installed from a separate marketplace?

No public marketplace or separate official squad repository is part of the
current product contract. The 17 bundled squads ship with `sinapse-ai` and are
validated from this repository.

## Where do I get help?

Use [SUPPORT.md](../../SUPPORT.md) and include redacted `status` and `doctor`
output.
