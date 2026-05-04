# Chrome Brain — Browser Automation for SINAPSE

Chrome Brain is a **cross-squad capability** that gives ALL SINAPSE agents the power to control Chrome in real-time: navigate sites, clone pages, fill forms, audit performance, extract data, and create 3D animations.

## Quick Install

```bash
npx sinapse-ai chrome-brain install
```

That is the only command you need. Chrome Brain is a sub-capability of the
canonical installer, so it follows the same rule as every other SINAPSE
install/update/uninstall path: `npx sinapse-ai <cmd>` is the single public
entry point.

### Internal (developer-only)

> The snippets in this section are for framework contributors working inside
> the repository clone. They are NOT instructions for end users — the
> `npx sinapse-ai chrome-brain install` command above invokes the same script
> under the hood.

```bash
# Run the installer script directly from a repo checkout
chmod +x scripts/install-chrome-brain.sh
./scripts/install-chrome-brain.sh
```

## What Gets Installed

| Component | Location | Purpose |
|-----------|----------|---------|
| `chrome-ensure` | `~/.local/bin/` | Auto-launch Chrome debug (hook) |
| `chrome-debug` | `~/.local/bin/` | Manual Chrome debug launch |
| `chrome-brain-log` | `~/.local/bin/` | Session logger (hook) |
| PreToolUse hooks | `~/.claude/settings.json` | Auto-launch before chrome tools |
| PostToolUse hooks | `~/.claude/settings.json` | Log usage after chrome tools |
| Chrome DevTools MCP | `~/.claude.json` | 29 browser control tools |
| Autoload rule | `~/.sinapse/.claude/rules/` | Auto-activation triggers |
| Master KB | `~/.sinapse/sinapse/knowledge-base/` | Patterns, NSN mode, learnings |
| 13 squad integrations | `~/.sinapse/squad-*/knowledge-base/` | Per-squad handoff protocols |

## How It Works

```
1. User says "abre o site google.com" (or any browser trigger)
2. Chrome Brain auto-activates (no command needed)
3. PreToolUse hook runs chrome-ensure → Chrome starts on port 9222
4. Agent uses Chrome DevTools MCP (29 tools) to execute the task
5. PostToolUse hook logs usage and tracks screenshot count
6. Results handed off to the domain squad for processing
```

## Verify Installation

```bash
npx sinapse-ai chrome-brain status
```

## Uninstall

```bash
npx sinapse-ai chrome-brain uninstall
```

## Supported Platforms

- macOS (Google Chrome)
- Linux (google-chrome, chromium-browser, chromium)
- Windows (via Git Bash / WSL)

## Requirements

- Node.js >= 20
- Google Chrome or Chromium
- SINAPSE framework (`~/.sinapse/` must exist)

## Architecture

```
Chrome (--remote-debugging-port=9222)
  |
  +-- Chrome DevTools MCP (29 tools) — navigate, click, fill, screenshot, audit
  +-- dev-browser (Playwright) — complex scraping, batch operations
  +-- claude-in-chrome (Extension) — visual fallback
```

**Tooling priority:** Chrome DevTools MCP > dev-browser > claude-in-chrome

## Session Limits

- Max 15 screenshots per session
- Rotate at 12 screenshots (warning)
- Prefer `evaluate_script` over `take_snapshot` (lighter)

## NSN Mode (Never Say Never)

When any agent hits a barrier, it MUST try 3+ alternatives before escalating. Search the web for workarounds, try different tools, configure and test. Max 5 cycles.

## Full Reference

After installation, the complete knowledge base is at:
`~/.sinapse/sinapse/knowledge-base/chrome-brain.md`
