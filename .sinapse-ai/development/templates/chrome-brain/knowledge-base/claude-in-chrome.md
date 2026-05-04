# claude-in-chrome — Chrome Extension for Visual Browser Interaction

> Manual install required. This extension cannot be auto-installed via CLI.

---

## What It Does

claude-in-chrome is a Chrome extension that acts as an MCP server directly from
within Chrome. It exposes browser automation tools via a local WebSocket, enabling
screen-level visual interaction (computer use) as a fallback when CDP and Playwright
cannot handle a task (e.g., complex visual layouts, canvas elements, iframes).

---

## Installation

1. Open Chrome and navigate to the Chrome Web Store
2. Search for "claude-in-chrome" or visit:
   https://chromewebstore.google.com/detail/claude-in-chrome
3. Click "Add to Chrome" and confirm
4. The extension icon should appear in the Chrome toolbar
5. Click the extension icon and follow the setup wizard

---

## MCP Configuration

The extension manages its own MCP registration automatically after install.
**Do NOT** manually add a "claude-in-chrome" entry to ~/.claude.json.

If the extension is installed and Chrome is running with debug port 9222,
claude-in-chrome tools will be available to Claude Code automatically.

---

## When to Use

| Scenario | Use claude-in-chrome? |
|----------|----------------------|
| CDP tools handle the task | No — use chrome-devtools-mcp |
| Playwright can scrape/interact | No — use dev-browser |
| Complex visual layout, canvas, WebGL | Yes |
| Cross-origin iframe interaction | Maybe — try CDP Input events first |
| Screen coordinate-based interaction | Yes |

**Priority:** CDP > dev-browser > claude-in-chrome (visual fallback only)

---

## Troubleshooting

- **Extension not showing tools:** Ensure Chrome is running with --remote-debugging-port=9222
- **Tools timeout:** Restart Chrome via chrome-debug script, then reload extension
- **Extension disabled:** Check chrome://extensions and re-enable

---

## Reference

- Master KB: ~/.sinapse/sinapse/knowledge-base/chrome-brain.md
- Chrome Brain auto-activation rule: ~/.sinapse/.claude/rules/chrome-brain-autoload.md
