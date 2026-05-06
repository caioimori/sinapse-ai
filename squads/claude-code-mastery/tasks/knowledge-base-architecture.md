---
task: knowledge-base-architecture
responsavel: "@project-integrator"
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

# Knowledge Base Architecture

## Objective

Design a knowledge base architecture for AI-assisted projects that organizes reference material, patterns, and domain knowledge into an efficient, searchable, and maintainable structure. Ensure knowledge is accessible to AI agents at the right time with minimal context window overhead.

## Pre-Conditions

- Knowledge domains and categories identified for the project
- Content sources available (documentation, code patterns, decision records, guides)
- Token budget constraints defined per knowledge category
- Claude Code rules system understood (for integration with retrieval)
- Maintenance ownership and update cadence established

## Steps

1. **Audit Existing Knowledge** — Inventory all existing knowledge scattered across the project: README files, inline comments, wiki pages, Slack messages, code patterns, architectural decisions, and tribal knowledge. Estimate the total volume and identify gaps.
2. **Define Knowledge Taxonomy** — Create a hierarchical taxonomy: top-level domains (architecture, patterns, tools, processes), mid-level categories (per domain), and leaf-level topics (specific knowledge items). Each node should have a clear scope statement.
3. **Design File Structure** — Map the taxonomy to a file structure: one file per major category, consistent naming convention (kebab-case, descriptive names), clear directory hierarchy, and index files for navigation. Balance between too many small files (hard to find) and too few large files (wasteful token loading).
4. **Create Content Templates** — Design templates for each knowledge type: reference guides (structured tables, concise explanations), pattern libraries (name, context, solution, example), decision records (context, decision, consequences), and how-to guides (steps with examples).
5. **Write Content Guidelines** — Establish quality standards for KB entries: write for AI consumption (structured, scannable, no fluff), include concrete examples, use tables over paragraphs, keep entries self-contained (no cross-file dependencies for understanding), and version each entry.
6. **Design Search and Retrieval** — Create retrieval mechanisms: consistent headers and tags for grep-based search, file naming that enables glob-based discovery, integration with Claude Code rules system (path-conditional loading), and a KB index file listing all entries with descriptions.
7. **Implement Tiered Loading** — Classify KB content into loading tiers: always-loaded (critical conventions, under 1000 tokens), path-conditional (loaded when working on related files), and on-demand (searched and loaded when needed). Minimize always-loaded content.
8. **Build Maintenance Workflow** — Define how the KB stays current: who owns each section, review schedule (monthly for active areas, quarterly for stable), contribution process (how to add new entries), deprecation process (how to retire outdated entries), and quality review checklist.
9. **Create Cross-Reference System** — Design how KB entries reference each other: use consistent link format, maintain a dependency graph (which entries reference which), and detect broken references automatically. Avoid circular dependencies.
10. **Validate Architecture** — Test the KB architecture: can an AI agent find the right knowledge for 10 sample questions? Is the token overhead acceptable? Are there gaps in coverage? Is the structure intuitive for new contributors?

## Output

```markdown
# Knowledge Base Architecture

## Taxonomy
```
knowledge-base/
├── {domain-1}/
│   ├── {category-1}.md
│   └── {category-2}.md
├── {domain-2}/
│   ├── {category-1}.md
│   └── {category-2}.md
└── KB-INDEX.md
```

## Content Templates
### Reference Guide Template
{template}

### Pattern Library Template
{template}

### Decision Record Template
{template}

## Loading Tiers
| Tier | Content | Token Budget | Loading Method |
|------|---------|-------------|---------------|

## Maintenance Schedule
| Section | Owner | Review Cycle | Last Reviewed |
|---------|-------|-------------|--------------|

## Search Guide
| Query Type | Method | Example |
|-----------|--------|---------|
| Find by topic | Grep header | `grep "## {topic}"` |
| Find by tag | Grep tag | `grep "tags:.*{tag}"` |
| Browse domain | Glob | `ls knowledge-base/{domain}/` |

## Quality Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Coverage (domains with KB) | 100% | {%} |
| Freshness (entries updated < 90d) | 80% | {%} |
| Token efficiency (useful/total) | > 70% | {%} |
```

## Quality Criteria

- Taxonomy must cover all identified knowledge domains with no orphan entries
- Always-loaded content must total under 1000 tokens
- Every KB entry must follow the appropriate content template
- Search must return relevant results for 90% of test queries within 2 attempts
- Maintenance workflow must have clear ownership for every section
- Architecture must be extensible (adding a new domain requires no structural changes)
