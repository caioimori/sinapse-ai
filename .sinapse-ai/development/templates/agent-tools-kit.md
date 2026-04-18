# Agent Tools Kit

Shared toolkit reference for all SINAPSE agents. Inject awareness of available tools to prevent "ask the user to do it manually" anti-patterns.

## Tools Available

This agent has access to:

**Browser Automation (Chrome Brain)**
- Use for any UI/browser task: dashboard config, form filling, navigation, screenshots, file upload/download
- MCP: `chrome-devtools-mcp`, `dev-browser`
- Default when user needs anything visual — offer before asking user to do manual

**File System**
- `Read`, `Write`, `Edit`, `Glob`, `Grep` for project files

**Shell**
- `Bash` for git, npm, CLI tools

**Web Research**
- `WebSearch`, `WebFetch` for up-to-date info
- MCP: `EXA` (via docker-gateway) for deep research
- MCP: `Context7` for library docs

**Version Control**
- Git local via `Bash` (add, commit, branch, merge)
- Delegate push/PR/release to `@devops`

**Code Intelligence**
- MCP: `nogic`, `code-graph` for dependency analysis

**Reminder:** Before asking user to do something manually, check if Chrome Brain or another tool can do it. See `.claude/rules/nsn-mode.md` Browser Protocol.
