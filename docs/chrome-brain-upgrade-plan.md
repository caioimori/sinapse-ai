# Chrome Brain Upgrade Plan — Persistent Sessions, Memory & Auto-Learning

> **Date:** 2026-04-10
> **Author:** @analyst (Scope) via Imperator
> **Status:** Research Complete — Ready for Implementation
> **Chrome Version Detected:** 146.0.7680.178 (well above 144 requirement)

---

## 1. Current Setup Analysis

### 1.1 Architecture (as-is)

```
Chrome (porta 9222, perfil ~/.chrome-debug-profile)
  |-- chrome-devtools-mcp (29 tools) -- CDP fast path
  |-- dev-browser (Playwright)       -- complex scraping, batch
  |-- claude-in-chrome (Extension)   -- visual fallback
```

### 1.2 MCP Configuration (current — ~/.claude.json)

```json
"chrome-devtools": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "chrome-devtools-mcp@latest", "--browser-url=http://127.0.0.1:9222"]
},
"dev-browser": {
  "command": "cmd",
  "args": ["/c", "dev-browser", "--connect"],
  "env": { "CDP_URL": "http://127.0.0.1:9222" }
}
```

### 1.3 Hooks (current — ~/.claude/settings.json)

- **PreToolUse**: `chrome-ensure` script runs before any `mcp__chrome-devtools__*`, `mcp__claude-in-chrome__*`, `mcp__dev-browser__*` tool call
- **PostToolUse**: `chrome-brain-log` script logs usage and tracks screenshot count

### 1.4 Scripts (current — ~/.sinapse/bin/)

| Script | Purpose | Location |
|--------|---------|----------|
| `chrome-ensure` | Auto-launch Chrome debug instance | `~/.sinapse/bin/chrome-ensure` |
| `chrome-debug` | Manual launch for debug Chrome | `~/.sinapse/bin/chrome-debug` |
| `chrome-brain-log` | Session logger + screenshot counter | `~/.sinapse/bin/chrome-brain-log` |

### 1.5 Key Problems with Current Setup

| Problem | Impact | Root Cause |
|---------|--------|------------|
| **New browser instance every time** | Must re-login to every service | `chrome-ensure` launches a fresh `~/.chrome-debug-profile` that has no saved sessions |
| **Debug profile is empty** | No cookies, no localStorage, no extensions | Profile directory `~/.chrome-debug-profile` doesn't exist yet (never persisted) |
| **CAPTCHA on every session** | Blocks automated workflows | Fresh profile = no Google session = CAPTCHA everywhere |
| **No memory across sessions** | Agent forgets what it browsed/learned | Learnings Log is manual, no structured extraction |
| **No auto-learning** | Patterns discovered in one session lost | Only manual entries in chrome-brain.md |
| **`--autoConnect` not used** | Missing the best feature of chrome-devtools-mcp v0.12.1+ | Config uses `--browser-url` instead of `--autoConnect` |
| **Connection drops in long sessions** | MCP becomes unreliable over time | Known issue #1094 — no reconnection strategy |

---

## 2. What's Possible (Research Findings)

### 2.1 Two Connection Strategies

Chrome DevTools MCP supports two fundamentally different approaches:

#### Strategy A: `--browserUrl` (Current — Manual Debug Profile)

```
User starts Chrome with --remote-debugging-port=9222 --user-data-dir=~/.chrome-debug-profile
  --> MCP connects via --browserUrl=http://127.0.0.1:9222
  --> Sessions persist in ~/.chrome-debug-profile
  --> Works on Chrome 136+
```

**Pros:** Full control, sessions persist, works on all platforms.
**Cons:** Requires separate Chrome instance, user must log in once to the debug profile.

#### Strategy B: `--autoConnect` (New — Connect to User's Active Browser)

```
User opens their normal Chrome (any profile)
  --> User enables remote debugging at chrome://inspect/#remote-debugging
  --> MCP connects via --autoConnect
  --> Uses the user's REAL browser with ALL their logins
  --> No separate profile needed
```

**Pros:** Zero login needed, uses real cookies/sessions, feels native.
**Cons:** Requires Chrome 144+, requires user to enable remote debugging once, approval dialog on each connection, known stability issues in long sessions (issue #1094).

### 2.2 Chrome 136+ Security Constraint

Starting from Chrome 136, `--remote-debugging-port` is BLOCKED on the default Chrome profile. You MUST use either:
- A custom `--user-data-dir` (Strategy A), or
- The `chrome://inspect/#remote-debugging` toggle (Strategy B)

This is a security feature — Chrome's default profile data is encrypted with profile-specific keys.

### 2.3 Recommended: Dual-Mode Architecture

Use BOTH strategies with automatic fallback:

```
1. Try --autoConnect first (user's real browser, if Chrome 144+ and remote debugging enabled)
2. Fall back to --browserUrl (dedicated debug profile with persistent sessions)
```

This gives the user the best of both worlds: zero-friction when their Chrome is running, persistent debug profile when it's not.

---

## 3. Configuration Changes

### 3.1 MCP Configuration (new — ~/.claude.json)

Replace the current `chrome-devtools` entry:

```json
"chrome-devtools": {
  "command": "cmd",
  "args": [
    "/c",
    "npx",
    "-y",
    "chrome-devtools-mcp@latest",
    "--autoConnect",
    "--no-usage-statistics",
    "--no-performance-crux"
  ]
}
```

**Why `--autoConnect`:** Connects directly to the user's running Chrome instance. No separate debug profile needed. All existing logins, cookies, and sessions are immediately available.

**Why `--no-usage-statistics` and `--no-performance-crux`:** Reduces network overhead and telemetry.

**Removed `--browser-url`:** The `--autoConnect` flag handles discovery automatically.

### 3.2 Fallback Configuration (when --autoConnect fails)

If `--autoConnect` fails (Chrome not running, remote debugging not enabled, or Chrome < 144), the `chrome-ensure` script should launch a dedicated debug Chrome. Update the fallback MCP entry:

```json
"chrome-devtools-fallback": {
  "command": "cmd",
  "args": [
    "/c",
    "npx",
    "-y",
    "chrome-devtools-mcp@latest",
    "--browser-url=http://127.0.0.1:9222",
    "--no-usage-statistics"
  ]
}
```

**Note:** In practice, only ONE MCP entry is needed. The `chrome-ensure` hook handles the fallback logic.

### 3.3 Updated chrome-ensure Script

The `chrome-ensure` script needs these changes:

```bash
#!/bin/bash
# Chrome Brain — chrome-ensure v2 (persistent sessions + autoConnect)

PORT="${1:-9222}"
CHROME_DEBUG_PROFILE="$HOME/.chrome-debug-profile"
CDP="http://127.0.0.1:$PORT/json/version"

# === STRATEGY 1: Check if user's Chrome has remote debugging active ===
# autoConnect handles this via the MCP server itself.
# We just need to ensure SOME Chrome is reachable.

# Fast path: already running (~50ms)
if curl -sf "$CDP" -o /dev/null --max-time 1 2>/dev/null; then
  exit 0
fi

# === STRATEGY 2: Launch dedicated debug Chrome with persistent profile ===

# Kill only stale debug-profile instances (never normal Chrome)
if command -v taskkill &>/dev/null; then
  tasklist /FI "IMAGENAME eq chrome.exe" /NH 2>/dev/null | \
    grep -i "chrome-debug-profile" | \
    awk '{print $2}' | \
    while read pid; do taskkill /PID "$pid" /F 2>/dev/null; done
elif command -v pgrep &>/dev/null; then
  pgrep -f "user-data-dir=$CHROME_DEBUG_PROFILE" 2>/dev/null | \
    xargs kill 2>/dev/null || true
fi
sleep 1

# Launch Chrome with persistent debug profile
"C:/Program Files/Google/Chrome/Application/chrome.exe" \
  --remote-debugging-port="$PORT" \
  --user-data-dir="$CHROME_DEBUG_PROFILE" \
  --no-first-run \
  --disable-default-apps \
  --disable-popup-blocking \
  --disable-translate \
  --disable-background-timer-throttling \
  --disable-renderer-backgrounding \
  --disable-backgrounding-occluded-windows \
  &>/dev/null &

# Wait for startup (max 10 seconds)
for i in $(seq 1 20); do
  if curl -sf "$CDP" -o /dev/null --max-time 1 2>/dev/null; then
    exit 0
  fi
  sleep 0.5
done

echo "BLOCKED: Chrome debug failed to start on port $PORT." >&2
exit 1
```

**Key additions:**
- `--disable-background-timer-throttling` — Prevents Chrome from throttling background tabs (critical for long automation)
- `--disable-renderer-backgrounding` — Keeps renderers active even when tabs aren't focused
- `--disable-backgrounding-occluded-windows` — Prevents Chrome from suspending occluded windows
- `--disable-default-apps` — Faster startup, no unnecessary apps
- `--disable-popup-blocking` — Prevents popups from being blocked during automation

### 3.4 One-Time Setup Steps for User

#### For --autoConnect (recommended, zero-friction):

1. Open Chrome (normal, any profile)
2. Navigate to `chrome://inspect/#remote-debugging`
3. Toggle ON "Discover network targets"
4. Done. Chrome will now accept MCP connections with a one-click approval dialog.

#### For persistent debug profile (fallback):

1. Run `chrome-debug` once manually
2. Log into key services (Google, GitHub, LinkedIn, etc.) in the debug Chrome window
3. Close the debug Chrome
4. Done. All sessions persist in `~/.chrome-debug-profile/`

---

## 4. Memory & Learning Architecture

### 4.1 Three-Layer Memory Model

```
Layer 1: Session Memory (volatile)
  |-- What was browsed this session
  |-- Screenshots taken, pages visited
  |-- Errors encountered, workarounds found
  |-- Stored in: ~/.chrome-brain/session-YYYYMMDD.log (already exists)

Layer 2: Knowledge Memory (persistent, structured)
  |-- Validated patterns and techniques
  |-- Site-specific selectors and workflows
  |-- Authentication flows per service
  |-- Stored in: ~/.sinapse/sinapse/knowledge-base/chrome-brain.md (exists, needs structure)

Layer 3: Semantic Memory (persistent, searchable)
  |-- Extracted facts from browsed pages
  |-- Competitive intelligence gathered
  |-- Research findings organized by topic
  |-- Stored in: ~/.sinapse/chrome-brain/memory/ (new)
```

### 4.2 Auto-Learning Pipeline

After EVERY browser automation task, the PostToolUse hook triggers an extraction step:

```
PostToolUse (chrome-brain-log)
  |
  v
[1] Log tool usage (existing)
  |
  v
[2] Check: was this a significant interaction? (new)
      - Page navigation to new domain? YES
      - Form submission completed? YES
      - Error encountered and resolved? YES
      - New pattern discovered? YES
      - Routine screenshot? NO (skip)
  |
  v
[3] Extract learning artifact (new)
      - Site: domain, selectors used, auth method
      - Pattern: what worked, what didn't
      - Gotcha: unexpected behavior
  |
  v
[4] Append to Learnings Log (new, automated)
      ~/.sinapse/sinapse/knowledge-base/chrome-brain.md
```

### 4.3 Memory File Structure (new)

```
~/.sinapse/chrome-brain/
  |-- memory/
  |   |-- sites/
  |   |   |-- google.com.yaml        # Selectors, auth flow, CAPTCHA notes
  |   |   |-- github.com.yaml        # Login flow, API patterns
  |   |   |-- linkedin.com.yaml      # Profile scraping patterns
  |   |   |-- {domain}.yaml          # Auto-created per domain
  |   |
  |   |-- patterns/
  |   |   |-- form-filling.yaml      # Multi-step form patterns
  |   |   |-- site-cloning.yaml      # Cloning workflow patterns
  |   |   |-- captcha-handling.yaml   # CAPTCHA strategies
  |   |   |-- auth-flows.yaml        # Authentication patterns
  |   |
  |   |-- research/
  |       |-- YYYY-MM-DD-{topic}.yaml # Research session outputs
  |
  |-- sessions/
      |-- session-YYYYMMDD.log        # Daily session logs (existing, moved here)
      |-- .screenshot-count           # Counter (existing, moved here)
```

### 4.4 Site Memory Schema (per domain)

```yaml
# ~/.sinapse/chrome-brain/memory/sites/{domain}.yaml
domain: example.com
last_visited: "2026-04-10T14:30:00Z"
visits: 5

auth:
  method: google_oauth  # or: email_password, magic_link, api_key, none
  login_url: https://example.com/login
  selectors:
    email_input: "input[name='email']"
    password_input: "input[name='password']"
    submit_button: "button[type='submit']"
  notes: "Has reCAPTCHA on login. Use --autoConnect to bypass."

pages:
  - path: /dashboard
    selectors:
      main_content: ".dashboard-content"
      sidebar: ".sidebar-nav"
    notes: "Loads async. Wait for .dashboard-content to appear."

  - path: /settings
    selectors:
      form: "#settings-form"
    notes: "Multi-tab form. Each tab loads dynamically."

gotchas:
  - "Rate-limits after 10 requests/minute. Add 6s delay between navigations."
  - "Uses shadow DOM for dropdown menus. Use evaluate_script to pierce."

patterns_used:
  - form-filling
  - site-cloning
```

### 4.5 Auto-Learning Hook (chrome-brain-learn.sh)

New script added to PostToolUse pipeline:

```bash
#!/bin/bash
# Chrome Brain — chrome-brain-learn (auto-learning extraction)
# Called by PostToolUse hook after chrome-brain-log
# Extracts learnings from significant interactions

MEMORY_DIR="$HOME/.sinapse/chrome-brain/memory"
SITES_DIR="$MEMORY_DIR/sites"
SESSION_FILE="$HOME/.chrome-brain/session-$(date +%Y%m%d).log"
LEARN_QUEUE="$HOME/.chrome-brain/.learn-queue"

mkdir -p "$SITES_DIR" "$MEMORY_DIR/patterns" "$MEMORY_DIR/research" 2>/dev/null || true

TOOL_NAME="${HOOK_TOOL_NAME:-unknown}"

# Only process significant interactions
case "$TOOL_NAME" in
  *navigate_page*|*fill*|*fill_form*|*click*|*evaluate_script*)
    # Queue for learning extraction (async, non-blocking)
    echo "$(date +%H:%M:%S) $TOOL_NAME" >> "$LEARN_QUEUE" 2>/dev/null || true
    ;;
esac

# Always exit 0 — never block
exit 0
```

### 4.6 Knowledge Consolidation (periodic)

A consolidation process runs when the user explicitly requests it (via `/lembrar` or `*consolidate-learnings`):

1. Read all entries from `~/.chrome-brain/.learn-queue`
2. Group by domain
3. Update/create site memory files
4. Append new patterns to chrome-brain.md Learnings Log
5. Clear the queue

This avoids real-time overhead while ensuring nothing is lost.

---

## 5. CAPTCHA Strategy (with Persistent Sessions)

### 5.1 Primary Strategy: Avoid CAPTCHA Entirely

With `--autoConnect` to the user's real Chrome:
- Google services: already logged in, no CAPTCHA
- Most sites: existing cookies bypass bot detection
- reCAPTCHA: recognizes the browser as "trusted" based on cookie history

### 5.2 Secondary Strategy: Persistent Debug Profile

With the dedicated `~/.chrome-debug-profile`:
- Log into Google once manually
- Google session persists across restarts
- reCAPTCHA trust score builds over time
- After 2-3 manual solves, automated browsing is trusted

### 5.3 Tertiary Strategy: CDP Raw Events (existing)

When CAPTCHA is unavoidable:
- Use `Input.dispatchMouseEvent` to interact with cross-origin iframes
- Calculate coordinates from iframe position
- Limit to 3-4 attempts before pausing (Google detects automation loops)

### 5.4 Strategy Selection (automated)

```
Is --autoConnect active? --> YES --> Skip CAPTCHA handling (already trusted)
                        --> NO  --> Is debug profile logged into Google?
                                    --> YES --> Likely no CAPTCHA
                                    --> NO  --> Use CDP raw events (max 3 attempts)
                                                --> Failed? --> Ask user to solve manually
```

---

## 6. Connection Stability (Long Sessions)

### 6.1 Known Issue

Chrome DevTools MCP issue #1094 documents connection drops in long-running sessions with `--autoConnect`. The MCP server restarts repeatedly, causing approval dialog spam.

### 6.2 Mitigation Strategy

Add a health-check wrapper to `chrome-ensure`:

```bash
# Health check: verify connection is still alive
check_connection_health() {
  local response
  response=$(curl -sf "http://127.0.0.1:$PORT/json/list" --max-time 2 2>/dev/null)
  if [ -n "$response" ]; then
    return 0  # Healthy
  fi
  return 1  # Unhealthy
}
```

Add to the PreToolUse hook: if the connection is unhealthy, restart only the debug-profile Chrome (not the MCP server). The MCP server handles reconnection automatically.

### 6.3 Session Rotation Reminder

The existing screenshot counter should also trigger a health check:
- At 12 screenshots: check connection health + suggest rotation
- At 15 screenshots: force rotation (save state, suggest new session)

---

## 7. Step-by-Step Implementation Plan

### Phase 1: Persistent Sessions (Immediate — 30 min)

| Step | Action | Files Changed |
|------|--------|---------------|
| 1.1 | Update MCP config to use `--autoConnect` | `~/.claude.json` |
| 1.2 | Update `chrome-ensure` script with new flags | `~/.sinapse/bin/chrome-ensure` |
| 1.3 | Update `chrome-debug` script with new flags | `~/.sinapse/bin/chrome-debug` |
| 1.4 | Enable remote debugging in Chrome | User action: `chrome://inspect/#remote-debugging` |
| 1.5 | Test: navigate to an authenticated site | Manual verification |

**Exact config change for Step 1.1:**

In `~/.claude.json`, replace:
```json
"chrome-devtools": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "chrome-devtools-mcp@latest", "--browser-url=http://127.0.0.1:9222"]
}
```

With:
```json
"chrome-devtools": {
  "command": "cmd",
  "args": [
    "/c", "npx", "-y", "chrome-devtools-mcp@latest",
    "--autoConnect",
    "--no-usage-statistics",
    "--no-performance-crux"
  ]
}
```

### Phase 2: Memory Architecture (1-2 hours)

| Step | Action | Files Changed |
|------|--------|---------------|
| 2.1 | Create memory directory structure | `~/.sinapse/chrome-brain/memory/` |
| 2.2 | Create `chrome-brain-learn.sh` script | `~/.sinapse/bin/chrome-brain-learn` |
| 2.3 | Add PostToolUse hook for learning | `~/.claude/settings.json` |
| 2.4 | Update `chrome-brain.md` KB with memory section | `~/.sinapse/sinapse/knowledge-base/chrome-brain.md` |
| 2.5 | Create consolidation command | New agent command `*consolidate-learnings` |

### Phase 3: Auto-Learning Pipeline (2-3 hours)

| Step | Action | Files Changed |
|------|--------|---------------|
| 3.1 | Create site memory schema template | `~/.sinapse/chrome-brain/memory/sites/_template.yaml` |
| 3.2 | Create pattern extraction logic in autoload rule | `.sinapse-ai/development/templates/chrome-brain/rules/chrome-brain-autoload.md` |
| 3.3 | Add "after-task learning check" to autoload rule | Same as 3.2 |
| 3.4 | Update installer to create memory dirs | `bin/modules/chrome-brain-installer.js` |
| 3.5 | Test end-to-end: browse -> learn -> persist -> recall | Manual verification |

### Phase 4: Connection Stability (1 hour)

| Step | Action | Files Changed |
|------|--------|---------------|
| 4.1 | Add health check to `chrome-ensure` | `~/.sinapse/bin/chrome-ensure` |
| 4.2 | Add reconnection logic to `chrome-ensure` | Same as 4.1 |
| 4.3 | Update session rotation in `chrome-brain-log` | `~/.sinapse/bin/chrome-brain-log` |

### Phase 5: Installer Update (1 hour)

| Step | Action | Files Changed |
|------|--------|---------------|
| 5.1 | Update `chrome-brain-installer.js` with new config | `bin/modules/chrome-brain-installer.js` |
| 5.2 | Add `--autoConnect` as default MCP config | Same as 5.1 |
| 5.3 | Add memory directory creation to install | Same as 5.1 |
| 5.4 | Add Chrome version check (warn if < 144) | Same as 5.1 |
| 5.5 | Update installation docs | `docs/installation/chrome-brain.md` |

---

## 8. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| `--autoConnect` fails in Claude Code sandbox | Medium | High | Keep `--browserUrl` as fallback, `chrome-ensure` handles it |
| Chrome approval dialog annoys user | Medium | Low | One-click approval, happens once per MCP server start |
| Connection drops in long sessions | High | Medium | Health check + auto-reconnect in `chrome-ensure` |
| Memory files grow too large | Low | Low | Cap at 100 site files, archive old ones |
| Privacy: agent accesses user's real browser | Medium | High | Document clearly, user explicitly enables remote debugging |

---

## 9. Security Considerations

- **Remote debugging port (9222)** is accessible only to localhost processes
- **`--autoConnect`** requires explicit user consent via Chrome dialog for each connection
- **Debug profile** (`~/.chrome-debug-profile`) should NOT be used for sensitive browsing (banking, etc.)
- **Memory files** stored locally in `~/.sinapse/` — no cloud sync by default
- **Site memory** should NEVER store passwords or tokens — only selectors and flow patterns
- **`.chrome-debug-profile`** should be in `.gitignore` (it's not in a repo, but defensive)

---

## 10. Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Time to first authenticated action | 2-5 min (manual login) | 0 sec (autoConnect) or 5 sec (persistent profile) |
| CAPTCHA encounters per session | 1-3 | 0 (via persistent sessions) |
| Learnings retained across sessions | 0 (manual only) | 100% (auto-extracted) |
| Connection stability (long sessions) | Drops after ~30 min | Stable with auto-reconnect |
| Site-specific knowledge available | 0 sites | Growing library per domain visited |

---

## Appendix A: Chrome DevTools MCP Full Flag Reference

| Flag | Description |
|------|-------------|
| `--autoConnect` | Auto-connect to locally running Chrome 144+ |
| `--browser-url` / `-u` | URL to running Chrome debug instance |
| `--ws-endpoint` / `-w` | WebSocket endpoint alternative |
| `--ws-headers` | Custom WebSocket headers (JSON) |
| `--headless` | Run headless (no UI) |
| `--executable-path` / `-e` | Custom Chrome binary path |
| `--isolated` | Temp user-data-dir, auto-cleaned |
| `--user-data-dir` | Chrome profile directory |
| `--channel` | Chrome channel: stable/canary/beta/dev |
| `--log-file` | Debug log file path |
| `--viewport` | Initial viewport (e.g., 1280x720) |
| `--proxy-server` | Proxy configuration |
| `--accept-insecure-certs` | Ignore cert errors |
| `--experimental-vision` | Enable coordinate-based tools |
| `--experimental-screencast` | Screencast tools (requires ffmpeg) |
| `--chrome-arg` | Additional Chrome launch args |
| `--ignore-default-chrome-arg` | Disable default args |
| `--category-emulation` | Toggle emulation tools (default: true) |
| `--category-performance` | Toggle performance tools (default: true) |
| `--category-network` | Toggle network tools (default: true) |
| `--performance-crux` | Toggle CrUX API (default: true) |
| `--usage-statistics` | Toggle telemetry (default: true) |
| `--slim` | Minimal 3-tool set |

## Appendix B: Sources

- [Chrome DevTools MCP — Official Blog (Google)](https://developer.chrome.com/blog/chrome-devtools-mcp-debug-your-browser-session)
- [Chrome DevTools MCP — GitHub Repository](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Issue #140 — Automatic Connection to Existing Session](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/140)
- [Issue #1094 — Long-Running Session Instability](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/1094)
- [Issue #1149 — autoConnect + Claude Code](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/1149)
- [Automating Authenticated Sites (Scalified)](https://scalified.com/blog/chrome-devtools-mcp-authentication)
- [Chrome Debugging Profile Setup (raf.dev)](https://raf.dev/blog/chrome-debugging-profile-mcp/)
- [Chrome 136 Security Changes](https://developer.chrome.com/blog/remote-debugging-port)
- [Chrome CDP Skill — Connect to Live Sessions](https://github.com/pasky/chrome-cdp-skill)
- [browser-use Issue #1520 — Chrome 136+ Default Profile](https://github.com/browser-use/browser-use/issues/1520)
