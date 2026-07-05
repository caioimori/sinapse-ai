# Memory Systems Reference

> Comprehensive reference for AI agent memory architectures, frameworks, and implementation patterns. Based on MS-009 Agentic Second Brain research (April 2026).

---

## The Memory Problem

The context window is the scarcest resource in agentic systems. A well-designed memory system:
- Cuts token costs by **~90%** vs sending full history
- Reduces latency by **~91%** (Mem0 benchmarks)
- Prevents "lost-in-the-middle" degradation in long conversations
- Enables agents to operate continuously across sessions

**Andrej Karpathy (2025):** "Context engineering is the delicate art and science of filling the context window with just the right information for the next step."

**Simon Willison (2025):** "Context engineering is what we do instead of fine-tuning."

**Mental model:** LLM as CPU, context window as RAM. Your job as engineer = OS managing working memory.

---

## Memory Layer Architecture

### 3 Core Memory Types

| Layer | Human Analogy | Function | Duration | Storage |
|-------|--------------|----------|----------|---------|
| **Working Memory** | Scratchpad | Active task info | Session | Tokens (direct) |
| **Episodic Memory** | Autobiographical | Specific past interactions | Days-Months | Vector search |
| **Semantic Memory** | General knowledge | Facts, concepts, rules | Permanent | Graph + Vector |

### HOT/WARM/COLD Tiers

| Tier | Access Time | Storage | Example |
|------|------------|---------|---------|
| **HOT** | Instant (in context) | In-memory (tokens) | System prompt, current task, last messages |
| **WARM** | < 300ms | Vector DB + Cache | Recent notes, mentioned entities, project decisions |
| **COLD** | On-demand | Filesystem + Archive | Old notes, completed projects, full history |

**Key principle (ContextForge):** A memory becomes HOT not just when accessed, but when semantically crucial to the current task. Even stored weeks ago, semantic relevance pulls it to HOT instantly.

### Token Budget Management

```
TOTAL WINDOW: 200,000 tokens (example — current frontier windows reach 1M)
  |- System Prompt:      ~2,000 tokens (1%)
  |- Agent Persona:      ~1,500 tokens (0.75%)
  |- Memory Context:    ~50,000 tokens (25%)     ← MANAGED
  |    |- HOT (current):  ~20,000
  |    |- WARM (retrieved): ~30,000
  |- User History:      ~20,000 tokens (10%)     ← COMPACTED
  |- Tool Results:      ~50,000 tokens (25%)     ← DYNAMIC
  |- Response Budget:   ~76,500 tokens (38.25%)  ← RESERVED
```

---

## Memory Frameworks Comparison (2026)

### Letta (MemGPT)

**Approach:** Virtual context management inspired by OS memory hierarchy.

**Architecture:**
- **Main context (RAM):** Active working memory — FIFO managed
- **Archival storage (disk):** Searchable long-term memory
- **Recall storage:** Conversation history with semantic search

**Highlights:**
- Letta Code (Dec 2025) — #1 on Terminal-Bench
- Conversations API (Jan 2026) — cross-session shared memory
- V1 architecture designed for GPT-5/Claude 4.5 Sonnet

**Memory Blocks:** Structured memory units agents can read/write directly:
```python
# Agent reads/writes memory blocks explicitly
agent.memory.update("core_memory", "User prefers TypeScript over JavaScript")
facts = agent.memory.search("archival", "project decisions")
```

### Mem0

**Approach:** Memory layer with graph DB backend.

**Performance benchmarks:**
- 26% accuracy gain vs OpenAI Memory
- 91% lower latency
- 90% lower token usage

**Scale (Q3 2025):**
- 41K GitHub stars
- 186M API calls
- $24M Series A (Oct 2025)

**Paper:** Published at ECAI 2025.

**Implementation:**
```python
from mem0 import Memory

m = Memory()
# Store memory
m.add("User prefers dark mode", user_id="caio")
# Search memory
results = m.search("user preferences", user_id="caio")
```

### A-Mem (NeurIPS 2025)

**Approach:** Zettelkasten-inspired agentic memory system.

**Design:** Atomic memory notes with:
- Unique IDs
- Keywords and tags
- Contextual descriptions
- Utility counters (frequency tracking)
- Links between related memories

**Why it matters:** First formal academic paper (NeurIPS 2025) formalizing "agentic memory" inspired by Luhmann's Zettelkasten. Proves that atomic, interconnected memory units outperform monolithic memory stores.

### Graphiti / Zep

**Approach:** Temporal knowledge graph for agent memory.

**Key innovation:** Bi-temporal model tracking:
- WHEN an event occurred
- WHEN it was ingested

**Architecture:**
```
[Conversational Data]
  → Entity extraction
  → Relationship mapping
  → Temporal edge creation (validity intervals)
  → Conflict resolution via metadata timestamps
  → Hybrid search (semantic + BM25 + graph traversal)
```

**Performance:**
- Retrieval P95: 300ms
- No LLM calls during retrieval
- DMR benchmark: 94.8% with gpt-4-turbo (vs 93.4% MemGPT)
- LongMemEval: up to 18.5% accuracy gain, 90% latency reduction

**Use case:** Long-lived agents that need to track how facts change over time (customer relationships, project evolution).

### Hindsight

**Approach:** Four separate memory networks.

**Four networks:**
1. **Facts** — explicit factual claims
2. **Experiences** — episodic events and outcomes
3. **Entities** — named entities with attributes
4. **Beliefs** — inferred preferences and tendencies

**Benchmarks (Dec 2025):**
- 91.4% accuracy on DMR benchmark
- Multi-session: 21% → 79.7%
- Temporal reasoning: 31.6% → 79.7%

**Who:** Open-source by Vectorize.io + Virginia Tech + Washington Post.

### Cognee

**Approach:** Graph-vector hybrid with cognitive engine.

**Features:**
- 30+ connectors (docs, images, audio, conversations)
- Modular pipelines for custom extraction, enrichment, retrieval
- Combines graph structures + vector embeddings

**Scale (Feb 2026):**
- $7.5M seed (backed by OpenAI founders + FAIR)
- 1M+ pipeline runs
- 70+ companies in production

### ContextForge

**Approach:** Three-tier memory with automatic promotion/demotion.

**Storage tiers:**
- HOT: Redis (<10ms access)
- WARM: Qdrant (semantic similarity)
- COLD: PostgreSQL (persistent archive)

**10x compression ratio.**

**Promotion trigger:** Not just recency — semantic relevance to current task. A 6-month-old memory becomes HOT if it's critical for the current query.

### OpenMemory

**Approach:** Local-first persistent memory.

**Key features:**
- SQL-native with temporal graphs
- Entity tracking across sessions
- Works with Claude Desktop
- No external services required

---

## Claude Code Memory System (Production Reference)

### Architecture Details

**MEMORY.md index:** Always loaded into context. Max 200 lines / ~25KB. Acts as a pointer system, never stores raw data.

```markdown
- [User Role](user_role.md) — senior developer, prefers TypeScript
- [Project Config](project_config.md) — monorepo, pnpm workspaces
- [Feedback](feedback_testing.md) — integration tests over mocks
```

**Design principles:**
- Memory = hints, not ground truth
- Always verify against actual codebase before acting
- Strict Write Discipline: update only after successful actions
- MEMORY.md = index (150 chars/line max), not content

### AutoDream Consolidation (4-phase)

```
1. Orient — read MEMORY.md, scan existing memory files
2. Gather — collect new info from daily logs
3. Consolidate — merge observations, resolve conflicts
4. Prune — maintain <= 200 lines / 25KB limit
```

**Triggers (all required):** 24+ hours, 5+ new sessions, no active consolidation, 10+ minutes since last scan.

### Memory Types for Claude Code Agents

| Type | When to save | What to write |
|------|-------------|---------------|
| `user` | Learn role, preferences, expertise | Tailor collaboration style |
| `feedback` | Corrections + validated approaches | Rule + Why + How to apply |
| `project` | Ongoing work context | Fact + Why + How to apply |
| `reference` | External system pointers | Where to find what |

---

## Hybrid Retrieval Architecture

### The Production Standard (2026)

```
[Query]
  → BM25 (keyword search)        → Top-K results
  → Dense Embeddings (semantic)  → Top-K results
  → Knowledge Graph (structured) → Entities/Relations
  → Reciprocal Rank Fusion (RRF) → Merged & Ranked
  → Cross-Encoder Reranking      → Final Top-N
  → LLM Generation with Context
```

**Why BM25 still matters:** Despite embedding advances, BM25 remains unbeatable for product codes, legal terminology, unique acronyms. Hybrid search reduces errors by **35-60%** vs pure semantic retrieval.

**RRF formula:** Documents appearing in top-5 of BOTH search types receive a massive mathematical boost.

### Vector Database Selection (2026)

| Database | Ideal For | Max Scale | P95 Latency |
|----------|-----------|-----------|-------------|
| Pinecone | Enterprise production | Billions | <50ms |
| Weaviate | Hybrid search native | 100s of millions | <100ms |
| Qdrant | Performance/cost ratio | 100s of millions | <100ms |
| Chroma | Rapid prototyping | Millions | Variable |
| pgvector | PostgreSQL integration | 5-100M | Variable |
| Milvus | Cost at scale | Billions | <50ms |

**Strategy:** Start with pgvector or Chroma for prototype, migrate to Pinecone or Weaviate for production.

### Agentic RAG

State of the art: systems that **plan, retrieve, reason, critique, and refine** in loops until sufficient confidence.

Survey: arXiv 2501.09136 — "Agentic RAG as the next paradigm."

```
[Question]
  → Decompose into sub-questions
  → For each sub-question:
      → Retrieve relevant context
      → Evaluate relevance and completeness
      → If insufficient → refine query and retry
  → Cross-reference findings
  → Synthesize final answer
  → Verify citations
```

---

## Implementation Patterns

### Pattern 1: Priority Queue Memory Retrieval

```python
def retrieve_relevant_memories(query, agent_state):
    # Scoring formula
    relevance_score = (
        0.4 * semantic_similarity(query, memory) +
        0.3 * recency_score(memory.timestamp) +
        0.2 * frequency_score(memory.access_count) +
        0.1 * importance_score(memory.importance_flag)
    )
    return sorted(memories, key=relevance_score, reverse=True)[:MAX_HOT_MEMORIES]
```

### Pattern 2: Sliding Window + Summary

```
Keep last N messages in full fidelity
  + Compact summary of everything before
  = Context that fits window without losing information
```

**Claude Code implementation:** `merge_compact_summaries()` generates "Previously compacted context" vs "Newly compacted context" multi-stage summaries.

### Pattern 3: Memory Blocks (Letta-style)

```python
# Structured blocks agents can explicitly read/write
class AgentMemory:
    core_memory: str      # Always in context (e.g., user profile)
    recall_storage: list  # Searchable conversation history
    archival_storage: db  # Unlimited external storage
    
    def update(self, block: str, content: str):
        """Agent explicitly updates its own memory"""
        
    def search(self, block: str, query: str) -> list:
        """Agent searches external memory"""
```

### Pattern 4: Temporal Knowledge Graph

```python
# Track how facts change over time
fact = KnowledgeFact(
    content="User works at Acme Corp",
    valid_from="2025-01",
    valid_to=None,          # Still valid
    ingested_at="2025-01-15",
    source="user_statement"
)

# When conflict arises:
old_fact.valid_to = new_fact.valid_from  # Invalidate, don't delete
```

---

## Memory Governance

### Quality Scoring for Memories

| Dimension | Weight | Metrics |
|-----------|--------|---------|
| Completeness | 20% | All sections filled? Sources present? |
| Accuracy | 25% | Verifiable facts? Sources cited? |
| Connectivity | 15% | Links to related memories |
| Freshness | 20% | Time since last review, access frequency |
| Utility | 20% | Retrieval frequency, user feedback |

**Score thresholds:**
- >= 80: Evergreen (high confidence)
- 60-79: Healthy (periodic review)
- 40-59: Needs Attention (flag for review)
- < 40: At Risk (candidate for archival)

### Content Decay Detection

| Decay Type | Example | Detection Method |
|------------|---------|-----------------|
| **Factual** | Framework version changed | Compare with external sources |
| **Contextual** | Project was cancelled | Status tracking |
| **Relevance** | Topic no longer a priority | Usage analytics |
| **Structural** | Broken links, obsolete tags | Graph validation |
| **Temporal** | Note has date but no review deadline | Metadata check |

### The ROT Problem

Without governance, knowledge systems accumulate ROT (Redundant, Outdated, Trivial content):
- Organizations lose $12.9M/year on poor data quality (Gartner, 2021)
- ROT content pollutes AI agent responses
- Solution: lifecycle stages + automated scoring + decay alerts

---

## SINAPSE Memory Integration

### Current Architecture

Claude Code's built-in memory (`~/.claude/agent-memory/sinapse-claude/`) follows the 3-layer pattern:

```
MEMORY.md (index, always loaded)
  → user_*.md (user profile files)
  → feedback_*.md (feedback files)
  → project_*.md (project context files)
  → reference_*.md (external system pointers)
```

### Recommended Enhancements

1. **AutoDream-equivalent:** Periodic consolidation of memory files (SINAPSE could run this as a daily hook)
2. **Quality scoring:** Add `quality_score` frontmatter to memory files
3. **Decay tracking:** Add `review_by` dates to time-sensitive memories
4. **Team memory:** Shared memory across agents using `teamMemPaths.ts` pattern
5. **Semantic deduplication:** Before writing new memory, check for semantic overlap with existing files
