# SINAPSE Telemetry — Privacy Policy

> **Status:** STUB — disabled by default. No real endpoint is active yet.
> **Story:** C.1 — Exit Codes, Auto-Doctor & Opt-in Telemetry
> **Last updated:** 2026-04-15

## TL;DR

- **Telemetry is OFF by default.** SINAPSE sends nothing until you explicitly opt in.
- When enabled, we collect **only** anonymized failure categories — no paths, no usernames, no code, no project data.
- You can turn it off any time with `sinapse telemetry disable`.
- This is currently a **stub** — no real HTTP requests are made. See [Current status](#current-status-stub).

## Why telemetry?

SINAPSE is open-source and distributed via `npm install -g sinapse-ai`. When an install fails on a contributor's machine we often have no way of knowing — the user gets a cryptic error and gives up. Opt-in telemetry lets users who want to help improve SINAPSE share anonymized failure signals so the team can prioritize fixes.

If you do not want to participate: do nothing. Telemetry stays off.

## What we collect (when you opt in)

Exactly four fields per event:

| Field | Type | Example | Purpose |
|-------|------|---------|---------|
| `category` | string | `doctor-fail` | Which failure category was triggered |
| `platform` | `win32` \| `darwin` \| `linux` | `win32` | Which OS family the failure happened on |
| `version` | string | `10.0.0-rc.3` | Which SINAPSE version is installed |
| `timestamp` | ISO 8601 string | `2026-04-15T12:34:56.789Z` | When the event occurred |

The `category` field is restricted to a closed list of predefined values:

- `doctor-fail` — `sinapse doctor` returned a FAIL verdict
- `sync-ide-fail` — IDE sync (`npm run sync:ide`) failed during postinstall
- `permission-error` — Filesystem permission error (EACCES / EPERM) during install
- `runtime-dir-fail` — Could not create `.sinapse/handoffs` or `.sinapse/scratchpad`
- `unknown` — Catch-all for unclassified failures

Any category outside this list is coerced to `unknown` before sending.

## What we do NOT collect

Ever. Under any circumstances. By design — these fields do not exist in the payload schema:

- File paths, file names, or directory structures
- Usernames, machine names, or hostnames
- IP addresses (no real endpoint = no IPs)
- Source code, git history, commit messages, branch names
- Environment variables (beyond `SINAPSE_TELEMETRY` state)
- Stack traces, error messages, or log output
- Timing data, performance metrics, or usage patterns
- Project names or package names you install alongside SINAPSE
- Any other personally identifiable information (PII)

If you inspect `.sinapse-ai/core/telemetry/index.js` you will see that the payload is built by a single function (`buildPayload`) with a frozen schema. There is no code path that adds additional fields.

## How to enable / disable

**Enable (opt in):**

```bash
sinapse telemetry enable
```

This writes `{ "telemetry": true }` to `~/.sinapse/config.json`. A confirmation message is printed.

**Disable (opt out):**

```bash
sinapse telemetry disable
```

**Check current state:**

```bash
sinapse telemetry status
```

**Force via environment variable (CI, containers, test runs):**

```bash
SINAPSE_TELEMETRY=1 sinapse ...   # force on
SINAPSE_TELEMETRY=0 sinapse ...   # force off (wins over config file)
```

The env var overrides whatever is in the config file, every time. Unset the var to go back to config-file behavior.

## Where the opt-in state is stored

```
~/.sinapse/config.json
```

Example contents:

```json
{
  "telemetry": true
}
```

This is a per-user file. It is never committed, never synced between machines, and never read by any other SINAPSE component. Deleting the file is equivalent to `sinapse telemetry disable` (the missing key is treated as opt-out).

## Current status: STUB

At the time of writing (Story C.1), the telemetry module is a **stub implementation**:

- `send(event)` builds the anonymized payload and logs it at **debug** level only.
- **No HTTP request is made. Ever. There is no endpoint URL in the code.**
- A `TODO(follow-up-story)` comment in `.sinapse-ai/core/telemetry/index.js` marks exactly where the real endpoint would be wired in a follow-up story.

This means: even with telemetry enabled **on purpose**, nothing leaves your machine today. The policy above is forward-looking — it describes the contract the real endpoint will honor once the follow-up story is completed and reviewed.

## When will the real endpoint go live?

Before any real endpoint is activated, the SINAPSE team will:

1. Finalize this privacy policy (legal review pending).
2. Publish the endpoint URL in the CHANGELOG.
3. Ship a dedicated release note explaining the change.
4. Keep the opt-in model — users who never enabled telemetry will never be enrolled.

Until all four are done, `send()` remains a stub.

## Contact

Found a bug in the telemetry implementation? Think we are collecting something we should not? Open an issue at <https://github.com/caioimori/sinapse-ai/issues> or email the maintainers listed in `package.json`.

## Audit trail

- **2026-04-15** — Initial stub created (Story C.1). Payload schema frozen. No endpoint.
