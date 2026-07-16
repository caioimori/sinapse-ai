# Installation Troubleshooting

Start with exact environment and framework diagnostics:

```bash
node --version
npm --version
npm config get registry
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

## `npx` is not recognized

Install a supported Node.js LTS release and open a new terminal. Verify that
`node`, `npm`, and `npx` resolve from the same installation.

## Wrong target directory

Run the installer from the project root, not the user home, npm cache, or a
temporary directory:

```bash
cd /path/to/project
npx sinapse-ai@latest install
```

## Provider selection is not what you expect

Existing projects preserve their saved selection. Reconfigure deliberately:

```bash
npx sinapse-ai@latest install --reconfigure
```

## Files appear stale after a release

Compare `npm view sinapse-ai version` with diagnostic output and follow
[npx-cache.md](npx-cache.md). Use an exact version only to reproduce drift.

## Permission errors

Do not use `sudo` to write into a project. Ensure the current user owns the
project and npm cache. On Windows, close processes that may hold files and retry
from a normal PowerShell session before using elevation.

## Partial or interrupted installation

Preserve the project, inspect `git status`, then run:

```bash
npx sinapse-ai@latest doctor --fix
npx sinapse-ai@latest install --force
```

`--force` refreshes managed surfaces. Review the diff; do not delete project
directories as a recovery shortcut.

## Still blocked

Open a request through [SUPPORT.md](../../SUPPORT.md) with redacted logs,
platform, Node.js/npm versions, provider selection, and the minimal reproduction.
