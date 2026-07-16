# macOS Installation

## Requirements

- A supported macOS release on Apple Silicon or Intel
- Node.js 18 or newer; Node.js 22 LTS is recommended
- npm 9 or newer
- Git
- Claude Code, Codex, or both

From Terminal in the target project:

```bash
node --version
npm --version
npx sinapse-ai@latest install
```

No architecture-specific SINAPSE flag is required. The default fresh install
configures both supported providers; use `--llm=claude-code` or `--llm=codex`
only when the project intentionally supports one.

Verify the result:

```bash
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Do not use `sudo` to compensate for a broken Node/npm installation. Correct the
Node installation or project ownership instead. See
[troubleshooting](troubleshooting.md) for safe recovery steps.
