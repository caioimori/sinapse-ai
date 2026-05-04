# Installer Templates

Generic example configurations for SINAPSE-AI features that ship with the
framework. Users can copy these as starting points when configuring
manually instead of re-running the wizard.

| Template | Used by | Story |
|----------|---------|-------|
| `vault-routing.example.json` | Vault grounding hook | 10.47 |
| `ds-routing.example.json` | Design-system grounding hook | 10.47 |
| `brand-routing.example.json` | Brand grounding hook | 10.47 |

The interactive wizard (`npx sinapse-ai install`) writes the equivalent
config to `~/.claude/sinapse-ai-config.yaml` automatically. These JSON
templates exist as additional documentation: minimal, comment-rich, and
**generic** (no SINAPSE-specific paths).
