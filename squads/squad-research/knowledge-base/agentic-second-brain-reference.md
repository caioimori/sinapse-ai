# Agentic Second Brain Engineering Reference

Comprehensive reference on building agentic Second Brains -- systems where AI agents capture, organize, connect, and retrieve knowledge autonomously, transforming personal vaults into living cognitive infrastructure.

**Sources:** 67 sources (papers, repositories, articles, documentation). Research conducted April 2026.

---

## 1. The Convergence

Three waves converge to create the Agentic Second Brain:

1. **PKM Wave:** local-first markdown vaults with bidirectional links
2. **LLM Wave:** GPT-4, Claude, Gemini -- models capable of reading, summarizing, synthesizing, and producing knowledge
3. **Agentic Wave:** CrewAI, LangGraph, Claude Code, OpenAI Agents SDK -- frameworks giving agents autonomy, tools, and persistent memory

### Why Now (2025-2026)

- Context windows of 1M+ tokens (Claude, Gemini) allow agents to read entire vaults
- MCP (Model Context Protocol) enables LLM-to-filesystem connections
- A-Mem (NeurIPS 2025) formalized agentic memory inspired by Zettelkasten
- Graphiti/Zep: temporal knowledge graphs tracking how facts change
- Context Engineering recognized formally (Karpathy, Willison, 2025) as more important than prompt crafting

### Market Context

- Graph database market: $2.85B (2025), projected $18-20B by 2032-2034
- Knowledge management market: $773B-$885B (2024)
- Gartner: 33% of enterprise apps will include agentic AI by 2028 (vs <1% in 2024)
- Cost of poor data quality: $12.9M/year per organization

---

## 2. Knowledge Architecture (System 1)

### What and Why

Knowledge Architecture is the formal design that organizes, classifies, and relates units of knowledge. Without it, a vault becomes a graveyard of notes -- information accumulated but inaccessible. Architecture determines findability, connectability, evolution, and reasoning capability.

### Frameworks

| Framework | Structure | Focus | Ideal For |
|-----------|-----------|-------|-----------|
| Zettelkasten | Network of atomic interlinked notes | Idea emergence | Research, writing |
| PARA | Projects / Areas / Resources / Archives | Action and productivity | Project management |
| Evergreen Notes | Conceptual notes that evolve | Durable thinking | Deep reflection |
| MOC (Maps of Content) | Index notes aggregating themes | Navigation | Large vaults |
| Knowledge Graph | Entities + relations + attributes | Reasoning and inference | Agentic systems |

### State of the Art

**GraphRAG:** Evolution of traditional RAG incorporating a knowledge graph in retrieval. Instead of pure vector search, the system also queries the graph for relevant entities and relations, combining structural precision with semantic coverage.

**Graphiti (Zep):** Framework for temporal context graphs. Unlike static graphs, Graphiti tracks how facts change over time, maintains provenance for data sources, and supports both prescribed and learned ontology.

**Bi-Temporal Model:** Tracks when an event occurred AND when it was ingested. Each edge includes explicit validity intervals. Conflicts use temporal metadata to update or invalidate -- but not discard -- outdated information.

### Implementation Steps

1. Define base ontology: entity types (Person, Concept, Project, Decision, Insight, Source) and relations
2. Choose granularity: atomic notes (1 idea = 1 note) vs composite notes
3. Implement layers: fixed taxonomy + fluid tags + bidirectional links
4. Automatic graphs: use LLMs to extract entities and relations
5. Evolutionary ontology: allow the system to learn new categories from usage

### Risks

- Over-engineering ontologies nobody can maintain
- Rigid taxonomies that reject emergent knowledge
- Platform lock-in from tool-specific architectures
- Temporal inconsistency polluting the graph without invalidation mechanisms

### Key People

- **Niklas Luhmann** -- Zettelkasten creator (70 books published)
- **Tim Berners-Lee** -- Semantic Web, RDF, OWL foundations
- **Preston Rasmussen** -- Zep/Graphiti temporal graphs paper

---

## 3. Ingestion, Capture and Context Normalization (System 2)

### The Problem

Most valuable knowledge is generated in ephemeral contexts -- a conversation with Claude, a meeting, an article read quickly. Without systematic capture, knowledge evaporates.

### State of the Art

**Agentic Context Engineering (ACE):** Academic framework with three specialized components -- Generator, Reflector, and Curator -- representing context as structured bullets instead of monolithic prompts. Each memory entry has metadata (unique IDs, utility counters) and content capturing reusable strategies, domain concepts, or common failure modes.

**Cognee:** Open-source cognitive memory engine combining graph structures with vector embeddings. Modular pipelines for custom extraction, enrichment, and retrieval. 30+ connectors for documents, images, audio, conversations. $7.5M seed (Feb 2026), 1M+ pipeline runs, 70+ companies in production.

### Source Types

| Source | Content Type | Normalization Challenge |
|--------|-------------|------------------------|
| Claude/ChatGPT conversations | Dialogs, decisions, insights | Extract essence from conversational flow |
| Documents (PDF, Word, Slides) | Structured text + tables | OCR, layout parsing, table extraction |
| Web pages | Articles, docs, forums | HTML cleanup, main content extraction |
| Audio/Video | Meetings, podcasts | Transcription + diarization + summary |
| Source code | Logic, patterns, architecture | Intent extraction beyond syntax |
| Manual notes | Drafts, brainstorms | Structuring and connecting |

### Normalization Pipeline

```
[Raw Source]
  -> Extraction (parsing, OCR, transcription)
  -> Cleaning (remove noise, format)
  -> Semantic Chunking (divide by meaning, not tokens)
  -> Enrichment (metadata, tags, entities)
  -> Embedding (vectorization for semantic search)
  -> Indexing (vault + graph + vector store)
  -> Connection (links with existing knowledge)
```

### Implementation

1. One connector per source (API, filesystem watch, clipboard monitor, webhook)
2. Semantic chunking: divide by meaning, each chunk self-contained
3. Entity extractors: LLMs identify people, concepts, decisions, actions
4. Deduplication: verify knowledge exists before creating new note
5. Templates per type: meeting note, article digest, conversation insight
6. Auto-connection: agent identifies related existing notes and creates links

### Risks

- Ingestion without curation generates noise degrading vault quality
- Loss of provenance makes knowledge unverifiable
- Over-chunking destroys context necessary for comprehension

---

## 4. Operational Memory and Context Engineering (System 3)

### The Paradigm Shift

Andrej Karpathy (2025): "Context engineering is the delicate art and science of filling the context window with just the right information for the next step."

Simon Willison: "Context engineering is what we do instead of fine-tuning."

Mental model: think of the LLM as a CPU and the context window as RAM. Your job is analogous to an operating system: load working memory with exactly the right code and data for the task.

### Memory Layers

| Layer | Human Analogy | Function | Duration | Cost |
|-------|--------------|----------|----------|------|
| Working Memory | Scratchpad | Active task information | Session | Direct tokens |
| Episodic Memory | Autobiographical | Specific events, past interactions | Days-Months | Vector search |
| Semantic Memory | General knowledge | Facts, concepts, rules | Permanent | Graph + Vector |

### Storage Tiers

| Tier | Access | Example |
|------|--------|---------|
| HOT | In active context window | System prompt, current task, recent messages |
| WARM | Retrievable in <300ms | Recent notes, mentioned entities, project decisions |
| COLD | Retrievable on demand | Old notes, completed projects, full history |

**ContextForge principle:** Memory becomes HOT not just when accessed, but when semantically crucial for the current task. Relevance pulls it to HOT instantly regardless of age.

### Token Budget Management

```
TOTAL WINDOW: 200,000 tokens
  |- System Prompt:      ~2,000 (1%)
  |- Agent Persona:      ~1,500 (0.75%)
  |- Memory Context:    ~50,000 (25%)     <- MANAGED
  |- User History:      ~20,000 (10%)     <- COMPACTED
  |- Tool Results:      ~50,000 (25%)     <- DYNAMIC
  |- Response Budget:   ~76,500 (38.25%)  <- RESERVED
```

### Frameworks and Tools

| Tool | Approach | Highlight |
|------|----------|-----------|
| **Letta (MemGPT)** | Virtual context management (OS-inspired) | #1 Terminal-Bench. Conversations API for cross-session shared memory |
| **Mem0** | Memory layer with graph DB | 26% accuracy gain vs OpenAI Memory, 91% less latency, 90% less tokens. $24M Series A |
| **A-Mem** | Zettelkasten-inspired agentic memory | NeurIPS 2025. Atomic notes with keywords, tags, contextual descriptions |
| **OpenMemory** | Local-first persistent memory | SQL-native with temporal graphs and entity tracking |
| **ContextForge** | Three-tier memory system | Auto promotion/demotion. 10x compression ratio |
| **Hindsight** | Four separate memory networks | 91.4% accuracy on DMR benchmark. Open-source |
| **Cognee** | Graph-vector hybrid cognitive engine | $7.5M seed, 1M+ pipeline runs, 30+ data connectors |

### Risks

- Context pollution degrades response quality
- Lost-in-the-middle effect with long contexts
- Memory staleness presenting outdated info as current
- Over-compaction losing critical nuances

---

## 5. Retrieval, Navigation and Discovery (System 4)

### Hybrid Search as Production Standard (2026)

```
[User Query]
  -> BM25 (keyword search) -> Top-K results
  -> Dense Embeddings (semantic) -> Top-K results
  -> Knowledge Graph (structured) -> Entities/Relations
  -> Reciprocal Rank Fusion (RRF) -> Merged and Ranked
  -> Cross-Encoder Reranking -> Final Top-N
  -> LLM Generation with Context
```

**Why BM25 still matters:** Unbeatable for product codes, legal terminology, unique acronyms. For most real RAG applications, full-text search provides precision that vector search alone cannot.

### Vector Database Comparison (2026)

| Database | Ideal For | Scale | Latency (P95) |
|----------|----------|-------|----------------|
| Pinecone | Production enterprise | Billions | <50ms |
| Weaviate | Hybrid search native | Hundreds of millions | <100ms |
| Qdrant | Performance/cost | Hundreds of millions | <100ms |
| Chroma | Rapid prototyping | Millions | Variable |
| pgvector | PostgreSQL integration | 5-100M | Variable |
| Milvus | Cost at scale | Billions | <50ms |

Strategy: Start with pgvector/Chroma for prototype, migrate to Pinecone/Weaviate for production.

### GraphRAG

Experiments report gains in faithfulness, response relevance, and context recall when integrating structured graph contexts AND dense embeddings:

- **Graph:** High-precision evidence, structured by domain
- **Vector:** Nuanced context coverage and edge cases
- **Combined:** Governance via graph + flexibility via vectors

### Zep/Graphiti: Temporal Retrieval

Retrieval P95 of 300ms through hybrid search combining semantic embeddings, keyword (BM25), and direct graph traversal -- no LLM calls during retrieval. 94.8% on DMR benchmark with gpt-4-turbo. Up to 18.5% accuracy gain with 90% latency reduction.

**LazyGraphRAG (Microsoft):** Indexing at vector RAG cost (0.1% of full GraphRAG) with comparable quality for global queries.

### Implementation

1. Dual index: BM25 (full-text) + vector (embeddings) per note
2. Graph layer: entity/relation graph for structured navigation
3. Hybrid fusion: RRF or learned merging
4. Reranking: cross-encoder as second phase
5. Context window packing: select and order chunks for maximum utility
6. Feedback loop: track which results are actually used

---

## 6. Agent, Subagent and Skills Modeling (System 5)

### Reasoning Patterns

| Pattern | Description | Ideal Use |
|---------|-------------|-----------|
| ReAct | Reason + Act in loop | Tasks with tools |
| Tree of Thought | Explore multiple reasoning paths | Problems with multiple solutions |
| Graph of Thought | Reasoning as graph, merge/refine thoughts | Complex multi-source synthesis |
| Chain of Thought | Step-by-step linear reasoning | Sequential problems |
| Reflection | Agent evaluates own output | Quality and self-correction |

### Multi-Agent Orchestration Frameworks (2026)

| Framework | Architecture | Control | Maturity |
|-----------|-------------|---------|----------|
| LangGraph | State machine with directed graph | Maximum | High |
| CrewAI | Role-playing + task delegation | Medium | High |
| OpenAI Agents SDK | Agents with handoffs and guardrails | Medium | High |
| Claude Agent SDK | Claude-native with tool use | Medium | High |
| Google ADK | Agent Development Kit | Medium | High |
| Microsoft Agent Framework | Unifies AutoGen + Semantic Kernel | Medium-High | New (2026) |
| deepagents (LangChain) | Batteries-included agent harness | Medium | High |

**Note:** Microsoft retired AutoGen in favor of the new Microsoft Agent Framework. AutoGen remains in maintenance mode; the community fork AG2 continues independently.

### Architecture for Second Brain

```
[Main Orchestrator]
  |-- [Capture Agent]     -- Monitor sources, ingest
  |-- [Curation Agent]    -- Connect, tag, classify
  |-- [Research Agent]    -- Search, navigate, discover
  |-- [Synthesis Agent]   -- Summarize, combine, produce
  |-- [Quality Agent]     -- Validate, score, suggest
  |-- [Maintenance Agent] -- Detect decay, archive, clean
```

### Skills as Capability Units

Skills are modular capabilities agents can invoke:
- `/capture` -- Capture insight from conversation
- `/connect` -- Find and create links between related notes
- `/remember` -- Retrieve relevant knowledge from vault
- `/synthesize` -- Combine multiple notes into synthesis
- `/pipeline` -- Execute complete research pipeline
- `/graph` -- Visualize knowledge connections

### Implementation

1. Agent-per-concern, not one super-agent
2. Shared state via state graph or shared memory
3. Tool registry: catalog of available tools per agent
4. Handoff protocol: formal transfer between agents
5. Skill system: atomic functions agents can compose
6. Guardrails: authority limits per agent

---

## 7. Automations, Hooks and Operational Pipelines (System 6)

### Automation Types

| Type | Trigger | Example |
|------|---------|---------|
| Event Hook | Specific action occurs | End of Claude conversation -> capture insights |
| Cron Job | Temporal schedule | 11pm BRT daily -> review day's sessions |
| Watch | Filesystem change | New file in folder -> automatic ingestion |
| Webhook | External HTTP request | GitHub push -> update project notes |
| Threshold | Metric exceeds limit | Note not accessed for 90 days -> flag for review |
| Pipeline | Transformation chain | Conversation -> chunks -> entities -> notes -> links |

### Conversation-to-Knowledge Pipeline

```
[Claude Code session ends]
  -> Hook: PreCompact captures session digest
  -> Cron (11pm BRT): Haiku reviews all day's sessions
  -> Extract: decisions, insights, facts, actions
  -> For each insight:
      -> Check if already exists in vault
      -> If new: create note with appropriate template
      -> If existing: enrich note with new context
      -> Create links with related notes
  -> Update indices and graphs
  -> Generate daily summary
```

### Automation Patterns for Second Brain

| Pattern | Frequency | Agent | Action |
|---------|-----------|-------|--------|
| Daily Digest | 1x/day | Capture | Review sessions, extract insights |
| Connection Discovery | Continuous | Curation | Find links between new and existing notes |
| Decay Detection | 1x/week | Maintenance | Identify outdated notes |
| Graph Update | Continuous | Curation | Keep knowledge graph synchronized |
| Quality Scoring | 1x/week | Quality | Score notes by completeness, connections, relevance |
| Monthly Review | 1x/month | Synthesis | Generate knowledge retrospective |

---

## 8. Governance, Quality and Vault Evolution (System 7)

### Content Decay Types

| Type | Example | Detection |
|------|---------|-----------|
| Factual | Framework version changed | Compare with external sources |
| Contextual | Project was cancelled | Status tracking |
| Relevance | Topic no longer priority | Usage analytics |
| Structural | Broken links, obsolete tags | Graph validation |
| Temporal | Note has date but no review deadline | Metadata check |

### Lifecycle Management

```
[DRAFT] -> [REVIEWED] -> [PUBLISHED] -> [EVERGREEN]
                              |               |
                              v               v
                        [NEEDS UPDATE]  [DEPRECATED]
                              |               |
                              v               v
                        [UPDATED]       [ARCHIVED]
```

### Quality Scoring

| Dimension | Weight | Metrics |
|-----------|--------|---------|
| Completeness | 20% | All sections filled? Links present? |
| Accuracy | 25% | Verifiable facts? Sources cited? |
| Connection | 15% | Number and quality of links |
| Freshness | 20% | Time since last review, access frequency |
| Utility | 20% | Retrieval frequency, user feedback |

**Score interpretation:**
- >= 80: Evergreen (high confidence)
- 60-79: Healthy (periodic review)
- 40-59: Needs Attention (flag for review)
- < 40: At Risk (archival candidate)

### Implementation

1. Mandatory metadata: created_date, updated_date, review_date, status, owner, quality_score
2. Review cycles by content type (technical notes: quarterly, decisions: semi-annual, facts: continuous)
3. Automated scoring by quality agent
4. Decay alerts when notes fall below threshold
5. Git for entire vault -- every change traceable
6. Provenance chain: each note knows its origin

---

## 9. Knowledge Analytics and Cognitive Observability (System 8)

### Telemetry Metrics

| Metric | What It Measures | Why It Matters |
|--------|-----------------|----------------|
| Retrieval Hit Rate | % of searches returning useful results | Index quality |
| Knowledge Coverage | % of topics covered vs demanded | Vault gaps |
| Note Utilization | Access frequency per note | Content relevance |
| Connection Density | Links per note (avg and distribution) | Network richness |
| Decay Rate | % of notes becoming outdated per period | Vault health |
| Ingestion Velocity | Notes created per day/week | Capture pace |
| Synthesis Rate | Synthetic notes vs raw notes | Knowledge maturity |
| Agent Token Usage | Tokens consumed per operation | Operational cost |
| Query Latency | Retrieval response time | Performance |
| Context Relevance | Relevance score of retrieved context | RAG quality |

### Observability Tools (2025-2026)

| Tool | Focus |
|------|-------|
| LangWatch | LLM observability -- traces, evaluations, guardrails |
| Datadog LLM Obs | Enterprise integration with existing stack |
| Langfuse | Open-source -- traces, scores, datasets |
| Arize Phoenix | ML observability -- drift detection, embeddings |
| Monte Carlo | Data observability -- quality for RAG |

---

## 10. Research, Synthesis and Knowledge Production (System 10)

### Deep Research (2025-2026)

- **OpenAI Deep Research:** Retrieves, reads, critiques, synthesizes hundreds of papers in under an hour
- **Google Gemini Deep Research:** Synthesizes from dozens of independent sources
- **The AI Scientist (Sakana AI):** Creates research ideas, writes code, runs experiments, writes manuscripts, performs peer review. Published in Nature (March 2026)

### Research Pipeline

```
[Question/Topic]
  -> Decompose into sub-questions
  -> Parallel search across multiple sources
  -> For each source:
      -> Retrieval (web, vault, papers)
      -> Claim/fact extraction
      -> Credibility evaluation
  -> Cross-reference between sources
  -> Identify convergences and divergences
  -> Structured synthesis
  -> Citation verification
  -> Formatted output (note, article, report)
```

### Synthesis Methods

| Method | Description | When to Use |
|--------|-------------|-------------|
| Aggregation | Combine facts from multiple sources | Topic overview |
| Comparison | Contrast approaches/perspectives | Decisions between alternatives |
| Narrative | Build coherent story from facts | Communication and teaching |
| Framework | Extract mental model from data | Structural comprehension |
| Gap Analysis | Identify what is MISSING | Direct future research |
| Contradiction | Identify conflicts between sources | Validation and verification |

### Research Tools (2026)

| Tool | Type | Highlight |
|------|------|-----------|
| Elicit | Paper discovery + synthesis | 138M papers, 99.4% screening accuracy |
| Consensus | Evidence-based answers | Scientific corpus search |
| Scite.ai | Citation analysis | Verify if papers were supported/contrasted |
| Perplexity | General research | Web search + inline citations |

---

## 11. Infrastructure, Portability and Resilience (System 11)

### Core Principles

| Principle | Implementation |
|-----------|---------------|
| Local-First | Filesystem local as source of truth |
| Plain Text | Markdown as universal format |
| Git-Versioned | Full change history traceable |
| Cloud-Synced | Backup as secondary layer |
| Portable | No specific runtime dependencies |
| Resilient | 3-2-1 backup strategy |

### Filesystem Design

```
vault/
  00-inbox/              # Quick capture, unprocessed
  01-daily/              # Daily notes, session logs
  02-projects/           # Active project notes
  03-areas/              # Ongoing responsibility areas
  04-resources/          # Reference material
  05-archive/            # Archived projects and notes
  06-templates/          # Templates for new note types
  07-agents/             # Agent configuration and memory
  08-analytics/          # Metrics and vault health reports
  _attachments/          # Images, PDFs, media
  _data/                 # Structured data (JSON, YAML)
```

### Backup Strategy (3-2-1)

| Layer | Medium | Frequency | Retention |
|-------|--------|-----------|-----------|
| L1 | Git local (commits) | Every change | Unlimited |
| L2 | Cloud sync (OneDrive) | Real-time | 30 days of versions |
| L3 | Git remote (GitHub/private) | Daily push | Unlimited |
| L4 | External SSD (encrypted) | Weekly | Unlimited |

---

## 12. Key People and References

### Researchers and Practitioners

| Person | Contribution |
|--------|-------------|
| Niklas Luhmann | Zettelkasten creator, proved knowledge architecture scales |
| Tiago Forte | Popularized "Building a Second Brain" (BASB) with PARA method |
| Andy Matuschak | Evergreen Notes concept |
| Andrej Karpathy | Defined Context Engineering (2025) |
| Simon Willison | "Context engineering is what we do instead of fine-tuning" |
| Vannevar Bush | Memex concept (1945) |
| Doug Engelbart | "Augmenting Human Intellect" framework (1962) |

### Key Tools and Frameworks

| Tool | Category | Differentiator |
|------|----------|---------------|
| Graphiti/Zep | Temporal graph | Bi-temporal model, provenance tracking |
| Mem0 | Memory layer | 26% accuracy gain, 90% token reduction |
| Letta (MemGPT) | Virtual context | OS-inspired, #1 Terminal-Bench |
| Cognee | Cognitive engine | Graph-vector hybrid, 30+ connectors |
| ContextForge | Three-tier memory | Auto promotion/demotion, 10x compression |

---

*Knowledge base compiled from research conducted by Scope (Research Analyst) -- SINAPSE Research Initiative*
*Research: MS-009 Agentic Second Brain Engineering | 67 sources | April 2026*
