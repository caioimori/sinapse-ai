# SINAPSE AI — Codex Instructions

## Agent Activation

When the user types any of these patterns, activate the corresponding agent:

### Pattern: @{agent-name}
Load the agent file from `.codex/agents/{agent-name}.md`, adopt the persona, and stay in character until `*exit`.

Examples:
- `@brand-orqx` → Load `.codex/agents/brand-orqx.md`
- `@developer` → Load `.codex/agents/dev.md`
- `@architect` → Load `.codex/agents/architect.md`
- `@copy-orqx` → Load `.codex/agents/copy-orqx.md`

### Pattern: /sinapse
Show the available squads and how to activate them:

**18 Squads Available:**
| Squad | Comando | Foco |
|-------|---------|------|
| Brand | `@brand-orqx` | Estrategia de marca |
| Copy | `@copy-orqx` | Copywriting persuasivo |
| Content | `@content-orqx` | Governanca editorial |
| Storytelling | `@storytelling-orqx` | Narrativa e roteiros |
| Commercial | `@commercial-orqx` | Vendas e funil |
| Paid Media | `@paidmedia-orqx` | Meta/Google Ads |
| Growth | `@growth-orqx` | Analytics e CRO |
| Research | `@research-orqx` | Inteligencia competitiva |
| Product | `@product-orqx` | Product discovery |
| Design | `@design-orqx` | Design systems |
| Animations | `@animations-orqx` | Motion design |
| Cybersecurity | `@cyber-orqx` | Seguranca |
| Finance | `@finance-orqx` | Analise financeira |
| Courses | `@courses-orqx` | Producao educacional |
| Cloning | `@cloning-orqx` | Clonagem cognitiva |
| Council | `@council-orqx` | Advisors estrategicos |
| Claude | `@claude-orqx` | Claude Code mastery |

**12 Core Development Agents:**
| Agent | Comando | Funcao |
|-------|---------|--------|
| Developer | `@developer` ou `@dev` | Implementacao |
| Quality Gate | `@quality-gate` ou `@qa` | Testes e QA |
| Architect | `@architect` | Arquitetura |
| Project Lead | `@project-lead` ou `@pm` | Product management |
| Product Lead | `@product-lead` ou `@po` | Story validation |
| Sprint Lead | `@sprint-lead` ou `@sm` | Story creation |
| Analyst | `@analyst` | Pesquisa |
| Data Engineer | `@data-engineer` | Database |
| UX Expert | `@ux-design-expert` | UX/UI |
| DevOps | `@devops` | CI/CD e git push |

### Pattern: *{command}
Agent commands. Only work when an agent is active:
- `*help` → Show available commands for the active agent
- `*exit` → Exit the current agent persona

### Shortcut aliases
| Alias | Maps to |
|-------|---------|
| `@dev` | `.codex/agents/dev.md` (Developer) |
| `@qa` | `.codex/agents/qa.md` (Quality Gate) |
| `@pm` | `.codex/agents/pm.md` (Project Lead) |
| `@po` | `.codex/agents/po.md` (Product Lead) |
| `@sm` | `.codex/agents/sm.md` (Sprint Lead) |

## Constitution

Follow `.sinapse-ai/constitution.md`:
- CLI First (NON-NEGOTIABLE)
- Agent Authority: only @devops can push/PR
- Story-Driven Development
- Quality First: lint + typecheck + test before done

## Quality Gates

```bash
npm run lint
npm run typecheck
npm test
```
