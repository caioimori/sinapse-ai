---
name: chrome-brain
description: Intelligent browser automation with persistent sessions, memory, and auto-learning
trigger: When any agent needs to browse, scrape, test UI, or interact with web services
---

# Chrome Brain — Intelligent Browser Skill

## Connection Architecture

```
Priority 1: --autoConnect (user's real Chrome, all sessions preserved)
Priority 2: --browserUrl (persistent debug profile, seeded from user's Chrome)
Priority 3: Launch fresh Chrome (last resort)
```

**Setup (one-time):** Open Chrome → `chrome://inspect/#remote-debugging` → Enable toggle.

## Available Tools (29 via chrome-devtools MCP)

| Category | Tools | Use When |
|----------|-------|----------|
| Navigation | navigate_page, new_page, close_page, list_pages, select_page | Open/switch pages |
| Interaction | click, fill, fill_form, type_text, press_key, hover, drag, upload_file | Interact with UI |
| Capture | take_screenshot, take_snapshot, take_memory_snapshot | Visual verification |
| Scripting | evaluate_script | Extract data, manipulate DOM |
| Monitoring | list_console_messages, list_network_requests, get_network_request | Debug, intercept |
| Performance | performance_start_trace, performance_stop_trace, lighthouse_audit | Performance testing |
| Dialog | handle_dialog, wait_for | Handle alerts, wait for elements |
| Device | emulate, resize_page | Test responsive, mobile |

## CAPTCHA Protocol

```
1. DETECT: Check for CAPTCHA indicators (iframe[src*=recaptcha], .cf-turnstile, .h-captcha)
2. AVOID FIRST:
   - autoConnect = user's real Chrome = already authenticated = rare CAPTCHAs
   - --disable-blink-features=AutomationControlled (stealth mode active)
   - Human-like delays between actions (200-500ms)
3. IF CAPTCHA APPEARS:
   a. Simple checkbox: try click() — sometimes works with real Chrome profile
   b. Visual challenge: take_screenshot → notify user "CAPTCHA detected, please solve"
   c. Cloudflare Turnstile: usually auto-passes with real Chrome profile
4. NEVER: Use CAPTCHA-solving services without explicit user authorization
```

## Auto-Learning Protocol

After every browsing session, extract and store:

```yaml
# ~/.chrome-brain/memory.jsonl (appended automatically by PostToolUse hook)
session_log:
  urls_visited: []
  data_extracted: {}
  errors_encountered: []
  patterns_discovered: []
```

## Best Practices

1. **Screenshots budget:** Max 12 per session (warning at 12, critical at 15)
2. **Always take_screenshot after navigation** to verify page loaded correctly
3. **Use evaluate_script for data extraction** (faster than multiple clicks)
4. **Check console messages** for JavaScript errors before interacting
5. **Use wait_for** before clicking elements that load asynchronously
6. **Prefer fill_form** over individual fill() calls for multi-field forms
7. **Use emulate** to test mobile layouts before desktop

## Session Persistence

- Cookies, localStorage, and sessions persist between uses (autoConnect)
- No need to re-login to services between sessions
- If session expires, user logs in once in their normal Chrome — done

## Security Notes

- autoConnect exposes all user cookies/tokens to the MCP client
- Never navigate to untrusted URLs in authenticated sessions
- Prefer using a dedicated tab for automation work
- Close sensitive tabs before running automated browsing tasks
