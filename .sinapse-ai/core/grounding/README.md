# Grounding Hooks (Story 10.47)

Hooks shipped by SINAPSE-AI that read user-supplied grounding sources and
inject relevant context into agent prompts. Each hook is **opt-in**:
absence of `~/.claude/sinapse-ai-config.yaml` or `enabled: false` in the
matching section means the hook is a complete no-op (no I/O, no warnings,
no errors).

| Hook | Reads | Behavior when disabled |
|------|-------|------------------------|
| `vault.cjs` | `~/.claude/sinapse-ai-config.yaml` → `grounding.vault` | no-op |
| `design-system.cjs` | `~/.claude/sinapse-ai-config.yaml` → `grounding.designSystem` | no-op |
| `brand.cjs` | `~/.claude/sinapse-ai-config.yaml` → `grounding.brand` | no-op |

Configure interactively via `npx sinapse-ai install` (Story 10.46+10.47
wizard) or by editing the YAML file directly. See
`docs/guides/grounding-setup.md` for the full guide.

> Note: this story establishes the **shipping foundation** for grounding
> hooks (config schema, no-op default, entry point). The concrete domain
> integration logic (vault parser, DS lookup, brandbook reader) is
> deliberately out-of-scope and will land in follow-up stories per
> grounding type.
