# Installation and Updates

The canonical installation path for new and existing projects is:

```bash
npx sinapse-ai@latest install
```

Run it from the project directory. With no flags, a fresh installation configures
Claude Code and Codex. Re-runs preserve the saved provider selection and
project-owned content.

## Requirements

- Node.js 18 or newer; Node.js 22 LTS is recommended.
- npm 9 or newer.
- Claude Code, Codex, or both.
- Git for collaboration and review.

## Provider selection

```bash
# Fresh default: both providers
npx sinapse-ai@latest install

# Deliberately restrict a project
npx sinapse-ai@latest install --llm=claude-code
npx sinapse-ai@latest install --llm=codex

# Change a saved provider selection
npx sinapse-ai@latest install --reconfigure
```

## Ownership and updates

The installer distinguishes framework-managed files from project-owned files.
Re-running `install` refreshes the managed surface; it does not treat
application code, stories, packages, tests, or custom squads as disposable.

```bash
npx sinapse-ai@latest install
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Review the diff after every installation. `install --force` is for a
deliberate managed-surface refresh, not routine upgrades.

## Platform guides

- [Windows](windows.md)
- [macOS](macos.md)
- [Linux](linux.md)
- [npx behavior](npx-install.md)
- [Troubleshooting](troubleshooting.md)
- [Uninstallation](uninstallation.md)

Platform guides supplement this contract. The canonical `@latest install` path
and current CLI help remain the source of truth for provider options.
