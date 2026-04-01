# Cross-Squad Routing Rules

> Applies to Imperator (sinapse-orqx) and ALL squad orchestrators (*-orqx).

## Single-Squad Requests

When a request maps cleanly to one domain, route directly:

```
"Crie um headline" → @copy-orqx → @headline-specialist
"Audite a marca" → @brand-orqx → @brand-auditor
"Otimize SEO" → @growth-orqx → @seo-specialist
```

## Multi-Squad Patterns

For requests spanning multiple domains, use established patterns:

| Pattern | Squads | Trigger |
|---------|--------|---------|
| `brand_launch` | brand + design + content + copy + animations | New brand from scratch |
| `go_to_market` | product + commercial + content + paidmedia + growth | Launch product/service |
| `strategic_pivot` | council + research + finance + product | Major direction change |
| `full_digital_presence` | brand + design + content + animations + growth + paidmedia | Complete digital setup |
| `security_compliance_audit` | cybersecurity + research | Security assessment |
| `content_campaign` | content + copy + growth + paidmedia | Multi-channel campaign |
| `course_launch` | courses + content + copy + commercial | Course/workshop launch |

## Routing Priority

1. **Exact match** — Request clearly belongs to one squad
2. **Pattern match** — Request matches a known multi-squad pattern
3. **Diagnostic** — Unclear request → Imperator diagnoses before routing

## Handoff Between Squads

When work flows from one squad to another:
1. Outgoing squad writes deliverables to `docs/` or project files
2. Outgoing orchestrator generates handoff artifact
3. Incoming orchestrator receives artifact + reads deliverables
4. Incoming orchestrator routes to appropriate specialist

## Anti-Patterns

- Never have two squads working on the same file simultaneously
- Never skip the orchestrator (user → specialist directly) for multi-squad work
- Never route to a squad without providing context from the previous squad
