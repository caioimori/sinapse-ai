# Uninstallation

Review and commit or back up project-owned work before removing framework
integration. The uninstaller removes files recorded as SINAPSE-managed; it must
not be treated as a general project cleanup command.

Interactive uninstall:

```bash
npx sinapse-ai@latest uninstall
```

Confirmed non-interactive uninstall:

```bash
npx sinapse-ai@latest uninstall --yes
```

Afterward, inspect `git status` and verify that application code, stories,
packages, tests, and custom content remain. Restore unexpected removals from your
normal version-control or backup process before making other changes.

To install again:

```bash
npx sinapse-ai@latest install
```

There are no supported `--complete`, `--keep-data`, selective component, or
framework backup subcommands in the current public CLI. Do not rely on historical
examples that use those flags.
