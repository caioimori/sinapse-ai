# Grounding Hooks (Story 10.47 + GA-1.6)

Hooks shipped by SINAPSE-AI that read user-supplied grounding sources and
inject relevant context into agent prompts. Each hook is **opt-in**:
absence of `~/.claude/sinapse-ai-config.yaml` or `enabled: false` in the
matching section means the hook is a complete no-op (no I/O, no warnings,
no errors).

## Architecture: Two layers

### Layer 1 — Executable hooks (`.sinapse-ai/hooks/`, story GA-1.6) ✅ ACTIVE

These are the hooks Claude Code actually runs via `UserPromptSubmit`. They
read real files and inject context into prompts. Registered automatically
during `npx sinapse-ai install` into `~/.claude/settings.json`.

| Executable hook | Reads | Injects |
|-----------------|-------|---------|
| `sinapse-vault-grounding.cjs` | `grounding.vault.path` → top-5 `.md` notes | `<vault-grounding>` |
| `sinapse-ds-grounding.cjs` | `grounding.designSystem.rootPath` → DS law file | `<ds-grounding>` |
| `sinapse-brand-grounding.cjs` | `grounding.brand.brandbookPath` → brandbook | `<brand-grounding>` |

**Caller:** `bin/lib/register-grounding-hooks.js` (invoked by `bin/commands/install.js`
phase 6b). Hook registration is idempotent and non-destructive.

### Layer 2 — Library resolvers (`core/grounding/`, story 10.47) — DEFER

These library stubs (`vault.cjs`, `design-system.cjs`, `brand.cjs`) are
shallow wrappers around `config-loader.cjs`. They return a structured envelope
describing what is configured, but do **not** inject context into prompts.

**Why defer:** The executable hooks in Layer 1 (GA-1.6) already implement
the concrete content injection logic directly. The library resolvers were
designed as the "integration point" for future use cases where something
other than the Claude Code hook chain needs to consume grounding data
(e.g., a CLI command, a report generator, or a programmatic API). No such
consumer exists today.

**Trigger to activate library resolvers:** a concrete caller (e.g., a new
CLI sub-command `sinapse grounding status`, or a report generator) that
needs to query grounding config programmatically. At that point, extend
`vault.cjs` / `design-system.cjs` / `brand.cjs` to read actual files and
return rich structured data. Do **not** create a caller just to justify
activating these resolvers (Article XI — no orphans).

**Current callers of library resolvers:** `bin/lib/prompts.js` and
`bin/commands/update.js` import `grounding-config` (the wizard package, not
these library hooks). The library hooks themselves have no production caller
beyond their own test suite.

| Library resolver | Status | Defer trigger |
|-----------------|--------|---------------|
| `vault.cjs` | stub — returns config envelope | new CLI/API consumer |
| `design-system.cjs` | stub — returns config envelope | new CLI/API consumer |
| `brand.cjs` | stub — returns config envelope | new CLI/API consumer |
| `config-loader.cjs` | functional — reads YAML | used by all three stubs |

---

## Configuration

Configure interactively via `npx sinapse-ai install` (Story 10.46+10.47
wizard) or by editing the YAML file directly. See
`docs/guides/grounding-setup.md` for the full guide.

`~/.claude/sinapse-ai-config.yaml` schema:

```yaml
version: '1'
grounding:
  vault:
    enabled: true
    path: /abs/path/to/vault
    domains: [sinapse, personal]
  designSystem:
    enabled: true
    profileName: SINAPSE
    rootPath: /abs/path/to/brandbook
  brand:
    enabled: true
    profileName: SINAPSE
    brandbookPath: /abs/path/to/brandbook/0.0-guidelines.md
```
