# Linux Installation

## Requirements

- A maintained x64 or arm64 Linux distribution
- Node.js 18 or newer; Node.js 22 LTS is recommended
- npm 9 or newer
- Git
- Claude Code, Codex, or both

From a shell in the target project:

```bash
node --version
npm --version
npx sinapse-ai@latest install
```

The default fresh install configures both providers. Use
`--llm=claude-code` or `--llm=codex` only for an intentional single-provider
project.

Verify the result:

```bash
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

The project directory must be writable by the current user. Do not run the
installer with `sudo`; correct ownership or the Node/npm setup instead. See
[troubleshooting](troubleshooting.md) for recovery steps.
