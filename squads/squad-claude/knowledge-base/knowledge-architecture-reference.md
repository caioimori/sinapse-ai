# Knowledge Architecture Reference

> GraphRAG, temporal knowledge graphs, ontologies, taxonomies, and PKM frameworks. Based on MS-009 Agentic Second Brain research (April 2026).

---

## Knowledge Architecture Fundamentals

Knowledge architecture is the formal design of how knowledge is structured, classified, and related within a system. It determines:

- **Findability:** How agents and humans locate relevant information
- **Connectivity:** How ideas relate and form meaning networks
- **Evolution:** How new knowledge integrates without fragmenting existing knowledge
- **Reasoning:** How agents make inferences over stored knowledge

**Without architecture:** A vault becomes a "knowledge cemetery" — information accumulated but inaccessible.

---

## Knowledge Organization Frameworks

### Zettelkasten

**Origin:** Niklas Luhmann, 1960-1990. Produced 70 books from ~90,000 interlinked notes.

**Principles:**
- **Atomicity:** One idea = one note
- **Permanent notes:** Write in your own words, not copy-paste
- **Links:** Every note connected to related notes
- **Emergence:** Knowledge emerges from the network, not the hierarchy

**For agents:** A-Mem (NeurIPS 2025) formally proved Zettelkasten-inspired memory outperforms flat storage in agentic contexts.

```
note-001.md: "Context windows limit agent working memory"
  links_to: [note-042, note-007]
  
note-042.md: "Compaction preserves user requests but loses reasoning"
  links_to: [note-001, note-089]
  
note-007.md: "CLAUDE.md content survives compaction"
  links_to: [note-001, note-042]
```

### PARA Method

**Origin:** Tiago Forte, Building a Second Brain (2022).

| Folder | Contains | Lifespan |
|--------|---------|---------|
| **P**rojects | Active work with end date | Weeks-Months |
| **A**reas | Ongoing responsibilities | Indefinite |
| **R**esources | Reference material | Long-term |
| **A**rchives | Completed/inactive items | Permanent |

**For vaults:**
```
vault/
├── Projects/    → Active sprints, current epics
├── Areas/       → Squad capabilities, client relationships
├── Resources/   → KB files, research, frameworks
└── Archives/    → Completed stories, old research
```

### Evergreen Notes

**Origin:** Andy Matuschak, 2019+.

**Core principle:** Notes are "evergreen" when they:
- Are written for future you (not just today)
- Use concepts, not just references
- Get updated as understanding deepens
- Link to related evergreen notes

**Difference from zettelkasten:** Evergreen emphasizes **continuous refinement**; zettelkasten emphasizes **density of connections**.

### Maps of Content (MOC)

Index notes that aggregate related topics. Not content themselves — navigation aids.

```markdown
# MOC: Claude Code Architecture

## Core Systems
- [[agent-loop]] — The fundamental while(true) loop
- [[tool-system]] — 184 tools, 40 registered, ~20 enabled
- [[memory-architecture]] — 3-layer: MEMORY.md + topics + transcripts

## Context Management
- [[compaction-system]] — 5-layer pipeline
- [[prompt-caching]] — 14 cache-break vectors
- [[deferred-tools]] — 93% token reduction

## Multi-Agent
- [[coordinator-mode]] — 4-phase orchestration
- [[fork-model]] — Cache-sharing for parallelism
- [[worktree-isolation]] — Git-based blast radius control
```

### Knowledge Graph

Formal graph structure with nodes (entities) and edges (relationships).

```
Entities: Person, Concept, Project, Decision, Insight, Source
Relations: relates-to, depends-on, contradicts, evolved-from, authored-by
```

**Best for:** Agentic systems where agents need to reason over structured knowledge.

---

## Ontology Design

### What is an Ontology?

A formal specification of concepts and relationships in a domain. The difference between a taxonomy (hierarchy) and an ontology (full semantic web of relationships).

### Base Ontology for Second Brains

```yaml
entity_types:
  - Person
  - Organization
  - Concept
  - Project
  - Decision
  - Insight
  - Source
  - Tool
  - Pattern

relationship_types:
  - relates-to        # bidirectional, general
  - depends-on        # A cannot exist without B
  - contradicts       # A and B are in tension
  - evolved-from      # A is a refinement of B
  - authored-by       # A was created by B
  - applies-to        # A is applicable in context B
  - invalidates       # A makes B obsolete
  - supports          # A provides evidence for B
  - implements        # A is a concrete realization of B
```

### Hybrid Ontology (Prescrita + Aprendida)

**Prescrita:** Defined upfront — stable entity types, core relationships.

**Aprendida:** LLMs extract new categories and relationships from usage patterns over time.

**Graphiti implementation:**
- Fixed ontology: defines core entity types and relationship types
- Learned ontology: agent adds new relationship types as patterns emerge
- Version tracking: ontology changes are versioned with timestamps

### Over-Engineering Risks

- Complex ontologies that neither humans nor agents can maintain
- Rigid taxonomies that don't accommodate emergent knowledge
- Tool-specific architectures that create lock-in
- Inconsistency: outdated facts polluting the graph without invalidation mechanism

---

## GraphRAG Architecture

### What is GraphRAG?

Evolution of standard RAG (Retrieval-Augmented Generation) that incorporates a knowledge graph in the retrieval process.

**Standard RAG:** Query → Vector similarity → Top-K chunks → Generate

**GraphRAG:**
```
Query
  → Vector similarity → Top-K chunks (semantic coverage)
  → Entity extraction from query
  → Graph traversal → Related entities and relations (structural precision)
  → RRF fusion → Merged, ranked context
  → Cross-encoder reranking → Final top-N
  → LLM Generation
```

### Why GraphRAG Wins

| Approach | Strength | Weakness |
|----------|---------|----------|
| Vector-only | Semantic nuance, edge cases | Misses exact matches, acronyms |
| BM25-only | Exact matches, terminology | Misses semantic similarity |
| Graph-only | Structural reasoning | Misses unstructured content |
| GraphRAG (hybrid) | Best of all three | More complex to maintain |

**Hybrid search reduces errors by 35-60% vs pure semantic retrieval.**

### LazyGraphRAG (Microsoft, 2026)

Index at the cost of vector RAG (0.1% of full GraphRAG cost) with comparable quality for global queries. Defers expensive graph analysis to query time.

---

## Temporal Knowledge Graphs

### The Problem with Static Graphs

Facts change over time. Without temporal modeling:
- "X works at Company A" might be outdated
- "Framework Y is the best choice" may no longer be true
- Project statuses, team structures, technology choices all evolve

### Bi-Temporal Model (Graphiti/Zep)

Two time dimensions tracked per fact:

```
Fact edge:
  content: "User prefers TypeScript over Python"
  event_time: "2025-03-15"     ← When this was true in the world
  ingestion_time: "2025-03-16" ← When we learned about it
  valid_from: "2025-03-15"     ← Start of validity
  valid_to: null               ← Still valid (null = current)
  source: "user_statement_session_42"
```

**When conflict arises:**
```
Old fact: valid_to = new_fact.valid_from  (invalidated, not deleted)
New fact: created with new valid_from
```

This preserves history while ensuring current queries return current state.

### Temporal Query Patterns

```python
# Current facts only
graph.query("preferences", temporal="current")

# Historical view
graph.query("preferences", temporal={"at": "2025-01-01"})

# Change history
graph.query("preferences", temporal="all_versions")

# What changed this week
graph.query("*", temporal={"since": "2025-03-10"})
```

---

## Knowledge Quality Framework

### Quality Score Formula

```
Quality Score = 
  0.25 × accuracy +      # Verifiable facts? Sources cited?
  0.20 × completeness +  # All sections filled? Links present?
  0.20 × freshness +     # Time since last review
  0.20 × utility +       # Retrieval frequency, user feedback
  0.15 × connectivity    # Number and quality of links
```

**Score thresholds:**
- >= 80: Evergreen (high confidence)
- 60-79: Healthy (periodic review)
- 40-59: Needs Attention
- < 40: At Risk (candidate for archival)

### Content Decay Types

| Type | Example | Detection |
|------|---------|-----------|
| **Factual decay** | Framework version changed | Compare with external sources |
| **Contextual decay** | Project was cancelled | Status field tracking |
| **Relevance decay** | Topic no longer a priority | Usage analytics |
| **Structural decay** | Broken links, obsolete tags | Graph validation |
| **Temporal decay** | Note has date but no review deadline | Metadata check |

### Knowledge Lifecycle

```
[DRAFT] 
  → [REVIEWED] (validated by agent or human)
  → [PUBLISHED] (stable, referenced by others)
  → [EVERGREEN] (proven, highly connected)
     |
     ↓ (decay detected)
  [NEEDS UPDATE]
     |
     ↓ (updated) or (abandoned)
  [UPDATED] or [DEPRECATED]
     |              |
     ↓              ↓
  [PUBLISHED]   [ARCHIVED]
```

---

## Vector Database Decision Guide

### Selection Criteria

| Criterion | Consideration |
|-----------|--------------|
| Scale | How many vectors? (millions vs billions) |
| Latency | P95 acceptable? (<50ms vs <100ms) |
| Hybrid search | Native BM25 + vector support? |
| Compliance | SOC 2, HIPAA required? |
| Cost | Cloud managed vs self-hosted |
| Ecosystem | Integration with existing tools |

### Decision Matrix (2026)

| Database | Best For | Scale | P95 | SOC 2 |
|----------|---------|-------|-----|-------|
| Pinecone | Enterprise, managed | Billions | <50ms | Yes |
| Weaviate | Hybrid search native | 100s M | <100ms | Yes |
| Qdrant | Performance/cost | 100s M | <100ms | Yes |
| Chroma | Prototyping | Millions | Variable | No |
| pgvector | PostgreSQL users | 5-100M | Variable | Inherits |
| Milvus | Cost at scale | Billions | <50ms | No |

**Strategy:** pgvector → Qdrant → Weaviate (as scale/requirements grow).

---

## Local-First Vault as Second Brain Infrastructure

A markdown vault on the filesystem (one file per note, plain text, version-controlled) is the most portable substrate for a Second Brain. No vendor lock-in, agents can read/write directly, and everything is greppable.

### Optimal Vault Structure

```
vault/
├── 00-inbox/              # Quick capture, unprocessed
├── 01-daily/              # Daily notes, session logs
├── 02-projects/           # Active project notes
├── 03-areas/              # Ongoing responsibilities
├── 04-resources/          # Reference material
├── 05-archive/            # Completed/inactive
├── 06-templates/          # Note templates
├── 07-agents/             # Agent configurations + memory
├── 08-analytics/          # Vault health metrics
├── _attachments/          # Images, PDFs, media
└── _data/                 # Structured data (JSON, YAML)
```

---

## SINAPSE Knowledge Architecture

### Current State

SINAPSE uses a document-first approach:
- Stories in `docs/stories/`
- Architecture in `docs/architecture/`
- KB files in `squads/{squad}/knowledge-base/`

### Recommended Enhancements

1. **MOC files** — Create index notes for each major domain in KB
2. **Frontmatter standards** — Add `created_date`, `updated_date`, `review_by`, `status`, `links_to` to KB files
3. **Quality scoring** — Periodic audit of KB files using quality formula
4. **Decay detection** — Flag KB files not updated in 90+ days
5. **Graph visualization** — Use `sinapse graph` to visualize knowledge connections

### KB File Template

```yaml
---
title: {Title}
type: reference|guide|pattern|architecture
status: draft|reviewed|published|evergreen|deprecated
created: {date}
updated: {date}
review_by: {date}
quality_score: {number}
tags: [tag1, tag2]
links_to: [file1.md, file2.md]
---
```
