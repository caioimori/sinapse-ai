# Grounding Setup Guide

> Story 10.47 — opt-in BYO (Bring Your Own) vault, design system, brand.

## What is grounding?

Most agent frameworks assume the LLM already knows everything about your
business. SINAPSE-AI assumes the opposite: it ships three optional
**grounding** channels that connect agents to your real context.

| Channel | Purpose | Disabled = |
|---------|---------|------------|
| **Vault** | Inject context from your markdown notes vault into agent prompts | Hook is a no-op |
| **Design System** | Resolve tokens / components / layouts from your DS source-of-truth so agents stop generating generic `max-w-7xl shadcn-default` UIs | Hook is a no-op (high-quality fallback principles still apply at the framework level) |
| **Brand** | Read your brandbook (positioning, MVV, tone-of-voice) so copy and UX nasce aligned to your brand | Hook is a no-op |

All three are independent. Configure the ones that matter, skip the rest.

## When does each one make sense?

- **Enable vault grounding** if you keep a structured markdown knowledge base with notes about your projects, clients, decisions, or domain. Agents reference these instead of inventing.
- **Enable design system grounding** if your project has a defined visual identity (tokens, components, layout primitives). Without it, design agents fall back to generic principles — still good, but not yours.
- **Enable brand grounding** if you have a brandbook with positioning, MVV, tone-of-voice. Especially valuable for copy + storytelling squads.
- **Skip all three** if you're prototyping or evaluating. The framework defaults are high-quality enough to ship; you can come back later via `--reconfigure`.

## How to configure

### Option A — interactive wizard (recommended)

```bash
npx sinapse-ai install            # first run, prompts every section
npx sinapse-ai install --reconfigure   # re-run prompts on an existing install
```

The wizard asks one question per section. Each accepts a path or empty
(skip). Empty answers leave the section disabled and the corresponding
shipped hook stays a complete no-op.

### Option B — manual edit

The wizard writes to `~/.claude/sinapse-ai-config.yaml`. You can create or
edit this file directly using the schema below.

```yaml
version: "1"
grounding:
  vault:
    enabled: true
    path: "/absolute/path/to/your/vault"
    domains: []           # optional: list of domain tags to filter on
  designSystem:
    enabled: true
    profileName: "my-product-ds"
    rootPath: "/absolute/path/to/your/design-system"
  brand:
    enabled: false
    profileName: ""
    brandbookPath: ""
```

Generic JSON examples for copy-paste reference live in
`packages/installer/templates/`:

- `vault-routing.example.json`
- `ds-routing.example.json`
- `brand-routing.example.json`

## How fallback works

When a section is disabled (or the YAML file is absent altogether), the
shipped grounding hook for that section returns `null`. Agents proceed
without that channel of context. There are **no warnings, no errors, no
log noise** — only silence.

Design system grounding has an additional safety net: even with the hook
disabled, the framework's design-system rules still apply
high-quality fallback principles (no hardcoded `max-w-7xl`, fluid
typography, semantic tokens) so generated UIs do not collapse into
generic SaaS templates.

## Schema versioning

The top-level `version` field allows future migrations. Always check
`~/.claude/sinapse-ai-config.yaml` after a major SINAPSE-AI upgrade. If
the schema bumps, the installer will migrate it on the next run; manual
edits should preserve unknown keys.

## Privacy

Paths configured here stay local on your machine. SINAPSE-AI does not
ship vault contents anywhere. The grounding hooks read locally and
inject only what the agent's working context requires for the task at
hand.

## How the hooks work (Story GA-1.6)

After running `sinapse-ai install` (or `update`), three executable hooks
are placed in `~/.sinapse/hooks/` and registered in
`~/.claude/settings.json` under `UserPromptSubmit`:

| Hook | Reads from config | Activates when | Injects |
|------|-------------------|---------------|---------|
| `sinapse-vault-grounding.cjs` | `grounding.vault` | Any prompt ≥ 10 chars | `<vault-grounding>` with up to 5 most-recent vault notes (500 chars each, 6000 total cap) |
| `sinapse-ds-grounding.cjs` | `grounding.designSystem` | Prompt contains UI keywords (PT + EN: `pagina`, `componente`, `layout`, `react`, `tailwind`, etc.) | `<ds-grounding>` with the first 3000 chars of the DS law file (`0.0-guidelines.md`, `principles.md`, `README.md`, …) |
| `sinapse-brand-grounding.cjs` | `grounding.brand` | Any prompt ≥ 10 chars | `<brand-grounding>` with the first 2000 chars of the brandbook |

All three follow the same contract:

- **Fail-open** — any error (missing config, malformed YAML, unreadable
  file, timeout) exits 0 silently. Claude Code never sees a broken
  prompt because grounding misfired.
- **Anti-double-injection** — if the prompt already contains the
  matching tag (e.g. another tool or a previous hook ran), the hook is
  a no-op.
- **Timeout 3500 ms** — each hook short-circuits on its own timer so a
  slow filesystem can't stall agent activation.
- **Size caps** — vault 6000 / DS 3000 / brand 2000 chars. Truncated
  with a `[...truncated...]` marker.

### Coexistence with personal hooks

If you also maintain personal global hooks (e.g.
`~/.claude/hooks/vault-grounding.cjs` reading from
`~/.claude/vault-routing.json`), the framework hooks are
**file-name-prefixed** with `sinapse-` and **read a different config
file** (`~/.claude/sinapse-ai-config.yaml`). Both can run side-by-side
without conflict — the fail-open guarantee makes any duplication
harmless.

### Disabling temporarily

Open `~/.claude/sinapse-ai-config.yaml` and set the section's
`enabled: false`. Re-running `sinapse-ai install --reconfigure` lets you
update paths interactively.

## What grounding does NOT do (today)

Story `10.47` shipped the **foundation** (schema, wizard, no-op library
hooks). Story `GA-1.6` (this entry) ships **executable hooks** that
inject real context. The concrete domain integration logic — parsing
note frontmatter, walking a deep DS token tree, reading a
brandbook PDF — still lands in follow-up stories per channel.

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| "Vault grounding configured" message but no notes injected | Concrete parser not yet shipped (out-of-scope for 10.47) | Wait for follow-up story, or open an issue if blocking |
| Hook errors during agent run | Should not happen — hooks short-circuit on any error | Check `~/.claude/sinapse-ai-config.yaml` is valid YAML; report issue if persistent |
| Wizard does not re-ask grounding questions | Upsert mode — already configured | Run with `--reconfigure` to re-prompt |

---

*See also:* [`README.md`](../../README.md), [`packages/installer/templates/README.md`](../../packages/installer/templates/README.md).
