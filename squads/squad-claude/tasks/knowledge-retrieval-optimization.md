---
task: knowledge-retrieval-optimization
responsavel: "@skill-craftsman"
responsavel_type: Agent
atomic_layer: Task
elicit: false
Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true
Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"
Checklist:
  - "[ ] Validar inputs"
  - "[ ] Executar steps"
  - "[ ] Verificar qualidade"
  - "[ ] Gerar output"
---

# Knowledge Retrieval Optimization

## Objective

Optimize knowledge retrieval patterns for Claude Code projects so that the right information is available at the right time without wasting context tokens on irrelevant content. Design tiered retrieval strategies that balance immediacy with token efficiency.

## Pre-Conditions

- Knowledge base files exist (KBs, docs, reference material)
- Usage patterns observed (which knowledge is accessed when)
- Context window budget constraints established
- Claude Code rules system understood (paths: frontmatter, directory CLAUDE.md)
- Project workflow stages documented

## Steps

1. **Catalog Knowledge Assets** — Inventory all knowledge sources: KB files, documentation, reference tables, code examples, API specs, and decision records. For each, record: token count, access frequency, usage context (which tasks need it), and staleness risk.
2. **Analyze Access Patterns** — Map which knowledge is needed for which tasks: development tasks need API specs and code patterns, review tasks need quality criteria, setup tasks need configuration references. Create a task-to-knowledge dependency matrix.
3. **Design Retrieval Tiers** — Create a tiered retrieval system: Tier 1 (always in context) — critical rules and conventions, < 2000 tokens; Tier 2 (loaded by path trigger) — file-specific knowledge, loaded via rules with `paths:` frontmatter; Tier 3 (on-demand) — searchable reference material, retrieved via Grep when needed.
4. **Optimize Tier 1 Content** — Review always-loaded content ruthlessly: every token must earn its place. Compress tables, remove explanatory prose Claude already understands, use shorthand notation, and link to Tier 2/3 for details instead of including them.
5. **Configure Tier 2 Triggers** — For each piece of path-conditional knowledge, define the optimal trigger pattern: which file paths should load this knowledge? Too broad = wasted tokens, too narrow = knowledge missing when needed. Test trigger patterns against real workflow scenarios.
6. **Build Tier 3 Search Index** — Organize on-demand knowledge for efficient retrieval: use consistent file naming, add searchable headers and tags, structure content with clear sections that can be extracted independently, and create a search guide documenting what is available and where.
7. **Implement Preloading Heuristics** — Design rules that preload knowledge based on context signals: if the user mentions "database", preload schema reference; if working on tests, preload test patterns; if in a specific directory, preload that component's documentation.
8. **Create Knowledge Freshness Protocol** — Define how knowledge stays current: review schedule per knowledge category, staleness indicators (references to deprecated APIs, old file paths), automated freshness checks (grep for referenced paths that no longer exist), and update workflow.
9. **Measure Retrieval Effectiveness** — Design metrics to evaluate the retrieval system: hit rate (was the right knowledge available when needed?), waste rate (was irrelevant knowledge loaded?), miss rate (was needed knowledge not available?), and latency (how quickly was knowledge retrieved?).
10. **Document Retrieval Architecture** — Create a complete document showing: the tiered system, how to add new knowledge, how to configure triggers, how to search, and how to maintain the system.

## Output

```markdown
# Knowledge Retrieval Optimization

## Knowledge Inventory
| Asset | Tokens | Tier | Trigger | Access Frequency |
|-------|--------|------|---------|-----------------|

## Tier Architecture
| Tier | Strategy | Budget | Content Types |
|------|----------|--------|--------------|
| 1 | Always loaded | {tokens} | {types} |
| 2 | Path-conditional | {tokens max} | {types} |
| 3 | On-demand search | unlimited | {types} |

## Tier 2 Trigger Map
| Knowledge File | Path Pattern | Estimated Loads/Day |
|---------------|-------------|-------------------|

## Preloading Heuristics
| Context Signal | Knowledge Preloaded | Trigger Method |
|---------------|-------------------|---------------|

## Freshness Protocol
| Category | Review Cycle | Staleness Check | Owner |
|----------|-------------|----------------|-------|

## Effectiveness Metrics
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
```

## Quality Criteria

- Tier 1 content must be under 2000 tokens total
- Tier 2 triggers must have zero false-negative rate (never miss loading needed knowledge)
- Tier 3 search must return relevant results within 2 search queries
- Overall retrieval system must reduce token waste by at least 25% vs. flat loading
- Freshness protocol must catch stale references within one review cycle
- Documentation must enable a new team member to understand and extend the system
