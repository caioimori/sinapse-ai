# Windows Installation

## Requirements

- Windows 10 or 11
- Node.js 18 or newer; Node.js 22 LTS is recommended
- npm 9 or newer
- Git
- Claude Code, Codex, or both

From PowerShell in the target project:

```powershell
node --version
npm --version
npx sinapse-ai@latest install
```

The default fresh install configures both supported providers. To select one
provider deliberately, use `--llm=claude-code` or `--llm=codex`.

If PowerShell blocks the `npx.ps1` shim under an organization policy, use the
equivalent executable without weakening the machine-wide execution policy:

```powershell
npx.cmd sinapse-ai@latest install
```

Verify from the same project directory:

```powershell
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Paths containing spaces are supported. Do not run the installer from your user
home unless that directory is intentionally the project. See
[troubleshooting](troubleshooting.md) for recovery steps.
