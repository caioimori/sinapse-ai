# SINAPSE Gemini CLI Extension

Brings SINAPSE multi-agent orchestration to Gemini CLI.

## Installation

```bash
gemini extensions install github.com/SinapseAI/sinapse-ai/packages/gemini-sinapse-extension
```

Or manually copy to `~/.gemini/extensions/sinapse/`

## Features

### Quick Agent Launcher
Use slash commands for fast activation flow (Codex `$`-like UX):
- `/sinapse-menu` - show all quick launch commands
- `/sinapse-dev`
- `/sinapse-architect`
- `/sinapse-qa`
- `/sinapse-devops`
- `/sinapse-orqx`
- and other `/sinapse-<agent-id>` commands

Each launcher returns a ready-to-send activation prompt plus greeting preview.

### Commands
- `/sinapse-status` - Show system status
- `/sinapse-agents` - List available agents
- `/sinapse-validate` - Validate installation
- `/sinapse-menu` - Show quick launch menu
- `/sinapse-agent <id>` - Generic launcher by agent id

### Hooks
Automatic integration with SINAPSE memory and security:
- Session context loading
- Gotchas and patterns injection
- Security validation (blocks secrets)
- Audit logging

## Requirements

- Gemini CLI v0.26.0+
- SINAPSE Core installed (`npx sinapse-ai install`)
- Node.js 18+

## Cross-CLI Compatibility

SINAPSE skills work identically in both Claude Code and Gemini CLI. Same agents, same commands, same format.

## License

MIT

