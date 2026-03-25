# Task: Build Status

> **Command:** `*build-status {story-id}` or `*build-status --all`
> **Agent:** @developer
> **Story:** 8.4 - Build Recovery & Resume
> **AC:** AC4

---

## Purpose

Display current status of autonomous builds including progress, metrics, and health indicators.

---

## Usage

```bash
# Single build status
*build-status {story-id}

# All active builds
*build-status --all
```

### Arguments

| Argument | Required | Description                              |
| -------- | -------- | ---------------------------------------- |
| story-id | No\*     | Story identifier (required unless --all) |
| --all    | No       | Show all active builds                   |

---

## Workflow

```yaml
steps:
  - name: Load State
    action: |
      If --all: Find all build-state.json files
      Else: Load specific story's state

  - name: Check Abandoned
    action: |
      Verify last activity timestamp
      Mark as abandoned if > 1 hour inactive
    threshold: 3600000ms (1 hour)

  - name: Calculate Metrics
    action: |
      - Progress percentage
      - Duration since start
      - Average time per subtask
      - Failure count

  - name: Format Output
    action: |
      Display formatted status with:
      - Visual progress bar
      - Current phase/subtask
      - Metrics summary
      - Recent failures (if any)
      - Notifications count
```

---

## Output Example

### Single Build

```
Build Status: story-8.4
──────────────────────────────────────────────────
Status:      IN_PROGRESS
Started:     2026-01-29T10:00:00Z
Duration:    1h 30m
Last Check:  2026-01-29T11:25:00Z

Progress:    [████████████░░░░░░░░░░░░░░░░░░] 40%
             4/10 subtasks

Current:     2.3
Phase:       phase-2

Metrics:
  Attempts:  6
  Failures:  2
  Avg Time:  12m/subtask
  Checkpts:  4

📬 1 unread notification(s)

Recent Failures:
  • [2.2] TypeError: Cannot read property...
──────────────────────────────────────────────────
```

### All Builds

```
All Active Builds
══════════════════════════════════════════════════════════════════════
◐ story-8.4              in_progress  4/10     1h 30m
✓ story-7.2              completed    8/8      45m
✗ story-6.1              failed       3/5      2h 15m
○ story-9.1              pending      0/12     0s

══════════════════════════════════════════════════════════════════════
```

---

## Status Icons

| Icon | Status      | Description       |
| ---- | ----------- | ----------------- |
| ○    | pending     | Build not started |
| ◐    | in_progress | Build running     |
| ◑    | paused      | Build paused      |
| ✗    | abandoned   | No activity > 1h  |
| ✗    | failed      | Build failed      |
| ✓    | completed   | Build successful  |

---

## Health Indicators

The status includes health checks:

1. **Abandoned Detection** - Warns if no activity for > 1 hour
2. **Stuck Detection** - Warns if same subtask failing repeatedly
3. **Notification Count** - Shows unread notifications

---

## Integration

- **Uses:** `BuildStateManager.getStatus()`, `BuildStateManager.getAllBuilds()`
- **Checks:** Abandoned state (AC5)
- **Format:** CLI-friendly with colors and progress bars

---

## Related Commands

- `*build-resume {story-id}` - Resume paused/failed build
- `*build {story-id}` - Start new build
- `*build-log {story-id}` - View attempt log
- `*build-cleanup` - Clean abandoned builds

---

_Task file for Story 8.4 - Build Recovery & Resume_
