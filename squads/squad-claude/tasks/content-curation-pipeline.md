---
task: content-curation-pipeline
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

# Content Curation Pipeline

## Objective

Build a content curation pipeline that systematically discovers, evaluates, transforms, and organizes knowledge from various sources into the project's knowledge base. Create a repeatable process for turning raw information into high-quality, AI-optimized knowledge entries.

## Pre-Conditions

- Knowledge base architecture established (from knowledge-base-architecture task)
- Content sources identified (documentation, APIs, research, team expertise)
- Quality criteria for KB entries defined
- Token efficiency targets established
- Curation schedule and ownership determined

## Steps

1. **Define Source Inventory** — Catalog all potential content sources: official documentation (framework docs, API references), internal documentation (READMEs, wikis, ADRs), community knowledge (blog posts, Stack Overflow, GitHub issues), and team expertise (interviews, pair sessions, code reviews).
2. **Create Discovery Process** — Design how new content is discovered: scheduled scans of documentation changes (version updates, new features), monitoring of team questions (repeated questions indicate KB gaps), tracking of error patterns (common mistakes need KB entries), and watching technology announcements.
3. **Build Evaluation Rubric** — Create a rubric for evaluating candidate content: relevance (directly applicable to project?), accuracy (verified and current?), uniqueness (not already in KB?), stability (will this remain true for > 3 months?), and token value (information density high enough?). Score 1-5 on each dimension.
4. **Design Transformation Pipeline** — Define how raw content becomes a KB entry: extract key information (remove fluff, examples, explanations of basics), restructure for AI consumption (tables, bullet points, code blocks), add project-specific context (how this applies to our codebase), and compress to target token count.
5. **Implement Quality Review** — Create a review process for new KB entries: technical accuracy check (is the information correct?), format compliance check (follows template?), token efficiency check (within budget?), integration check (fits the taxonomy?), and uniqueness check (no duplication?).
6. **Create Versioning Strategy** — Design how KB entries are versioned: semantic versioning for major rewrites vs. minor updates, changelog per entry, date stamping for freshness tracking, and deprecation marking for outdated entries that are pending removal.
7. **Build Freshness Monitoring** — Implement staleness detection: track source update dates, flag entries when their source is updated, schedule periodic review cycles per content category, and auto-generate freshness reports with entries needing attention.
8. **Design Deduplication Process** — Create a process for detecting and resolving duplicate content: scan for overlapping topics across KB files, merge related entries, maintain a single source of truth per topic, and create references instead of copies.
9. **Implement Metrics Tracking** — Track curation pipeline health: entries added per month, entries updated per month, entries deprecated, average entry quality score, total token footprint trend, and gap analysis (topics without coverage).
10. **Create Automation Hooks** — Set up automation where possible: PostToolUse hooks that detect when documentation files are updated and flag corresponding KB entries for review, scheduled reminders for periodic content reviews, and automated freshness reports.

## Output

```markdown
# Content Curation Pipeline

## Source Registry
| Source | Type | Update Frequency | Priority |
|--------|------|-----------------|----------|

## Discovery Schedule
| Activity | Frequency | Trigger | Owner |
|----------|-----------|---------|-------|

## Evaluation Rubric
| Dimension | Weight | 1 (Poor) | 3 (Adequate) | 5 (Excellent) |
|-----------|--------|----------|--------------|---------------|

## Transformation Steps
1. Extract → {method}
2. Restructure → {format}
3. Contextualize → {how}
4. Compress → {target tokens}

## Review Checklist
- [ ] Technical accuracy verified
- [ ] Format follows template
- [ ] Token count within budget
- [ ] Taxonomy placement correct
- [ ] No duplicate content

## Pipeline Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Entries added/month | {target} | {how} |
| Freshness (< 90 days) | > 80% | {how} |
| Quality score average | > 4.0 | {how} |
| Token efficiency | > 70% | {how} |

## Automation
| Hook/Script | Trigger | Action |
|------------|---------|--------|
```

## Quality Criteria

- Pipeline must process at least 5 content sources per evaluation cycle
- Every entry must pass the evaluation rubric with a score of 3.5+ average
- Transformation must reduce source content by at least 50% in token count
- Deduplication must identify and resolve overlapping entries within 1 review cycle
- Freshness monitoring must flag stale entries within 7 days of source update
- Pipeline metrics must be tracked and reported monthly
