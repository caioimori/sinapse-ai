# SINAPSE Scripts - Legacy Directory

> **Note**: This directory now contains only legacy/migration scripts and a few active utilities.
> Most scripts have been migrated to the modular structure (Story 6.16).

## Current Structure

Scripts are now organized by domain across three locations:

| Location | Purpose |
|----------|---------|
| `.sinapse-ai/core/` | Core framework modules (elicitation, session) |
| `.sinapse-ai/development/scripts/` | Development scripts (greeting, workflow, hooks) |
| `.sinapse-ai/infrastructure/scripts/` | Infrastructure scripts (git config, validators) |
| `.sinapse-ai/scripts/` (this directory) | Legacy utilities and migration scripts |

## Scripts in This Directory

### Active Scripts

| Script | Description |
|--------|-------------|
| `session-context-loader.js` | Loads session context for agents |
| `command-execution-hook.js` | Hook for command execution |
| `test-template-system.js` | Internal test utility for templates |

### Migration Scripts

| Script | Description |
|--------|-------------|
| `batch-migrate-*.ps1` | Batch migration utilities |
| `migrate-framework-docs.sh` | Documentation migration script |
| `validate-phase1.ps1` | Phase 1 validation script |

## Script Path Mapping

If you're looking for a script that was previously here, use this mapping:

```text
OLD PATH                                      NEW PATH
-----------------------------------------     ------------------------------------------
.sinapse-ai/scripts/context-detector.js      → .sinapse-ai/core/session/context-detector.js
.sinapse-ai/scripts/elicitation-engine.js    → .sinapse-ai/core/elicitation/elicitation-engine.js
.sinapse-ai/scripts/elicitation-session-manager.js → .sinapse-ai/core/elicitation/session-manager.js
.sinapse-ai/scripts/greeting-builder.js      → .sinapse-ai/development/scripts/greeting-builder.js
.sinapse-ai/scripts/workflow-navigator.js    → .sinapse-ai/development/scripts/workflow-navigator.js
.sinapse-ai/scripts/agent-exit-hooks.js      → .sinapse-ai/development/scripts/agent-exit-hooks.js
.sinapse-ai/scripts/git-config-detector.js   → .sinapse-ai/infrastructure/scripts/git-config-detector.js
.sinapse-ai/scripts/project-status-loader.js → .sinapse-ai/infrastructure/scripts/project-status-loader.js
.sinapse-ai/scripts/sinapse-validator.js        → .sinapse-ai/infrastructure/scripts/sinapse-validator.js
.sinapse-ai/scripts/tool-resolver.js         → .sinapse-ai/infrastructure/scripts/tool-resolver.js
.sinapse-ai/scripts/output-formatter.js      → .sinapse-ai/infrastructure/scripts/output-formatter.js
```

## Configuration

The `scriptsLocation` in `core-config.yaml` now uses a modular structure:

```yaml
scriptsLocation:
  core: .sinapse-ai/core
  development: .sinapse-ai/development/scripts
  infrastructure: .sinapse-ai/infrastructure/scripts
  legacy: .sinapse-ai/scripts  # This directory
```

## Usage Examples

### Loading Core Scripts

```javascript
// Elicitation Engine (from core)
const ElicitationEngine = require('./.sinapse-ai/core/elicitation/elicitation-engine');

// Context Detector (from core)
const ContextDetector = require('./.sinapse-ai/core/session/context-detector');
```

### Loading Development Scripts

```javascript
// Greeting Builder
const GreetingBuilder = require('./.sinapse-ai/development/scripts/greeting-builder');

// Workflow Navigator
const WorkflowNavigator = require('./.sinapse-ai/development/scripts/workflow-navigator');
```

### Loading Infrastructure Scripts

```javascript
// Project Status Loader
const { loadProjectStatus } = require('./.sinapse-ai/infrastructure/scripts/project-status-loader');

// Git Config Detector
const GitConfigDetector = require('./.sinapse-ai/infrastructure/scripts/git-config-detector');
```

### Loading Legacy Scripts (this directory)

```javascript
// Session Context Loader
const sessionLoader = require('./.sinapse-ai/scripts/session-context-loader');
```

## Related Documentation

- [Core Config](../core-config.yaml) - scriptsLocation configuration
- [Core Module](../core/README.md) - Core framework modules
- [Development Scripts](../development/scripts/README.md) - Development utilities
- [Infrastructure Scripts](../infrastructure/scripts/README.md) - Infrastructure utilities

## Migration History

| Date | Story | Change |
|------|-------|--------|
| 2025-12-18 | 6.16 | Deleted deprecated scripts, updated documentation |
| 2025-01-15 | 2.2 | Initial script reorganization to modular structure |

---

**Last updated:** 2025-12-18 - Story 6.16 Scripts Path Consolidation
