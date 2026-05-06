# Retrieval-Augmented Generation (RAG)

> BM25+embeddings+graph hybrid retrieval, chunking strategies, and production RAG patterns. Based on MS-009 research (April 2026).

---

## RAG Fundamentals

**RAG (Retrieval-Augmented Generation):** Augmenting LLM responses with retrieved external knowledge, rather than relying solely on model training data.

**Why RAG matters for agents:**
- Grounds responses in verified, current information
- Prevents hallucination by anchoring to source documents
- Enables access to knowledge beyond training cutoff
- Allows agents to operate over private/proprietary knowledge bases
- Reduces fine-tuning costs (context engineering instead)

**Patrick Lewis et al. (Facebook AI Research, 2020):** The foundational paper establishing RAG as a paradigm. "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks."

---

## The 2026 Production Standard: Hybrid Search

Single-modality retrieval is no longer production-grade. The standard is hybrid:

```
[User Query]
  │
  ├── BM25 (keyword search) ──────────────────┐
  │                                           │
  ├── Dense Embeddings (semantic) ────────────┤
  │                                           │
  └── Knowledge Graph (structured) ──────────┤
                                             │
                                     Reciprocal Rank Fusion (RRF)
                                             │
                                     Cross-Encoder Reranking
                                             │
                                     Final Top-N to LLM
```

**Why each component:**

| Component | Strengths | Weaknesses |
|-----------|----------|------------|
| BM25 | Exact matches, product codes, legal terms, acronyms | Misses semantic similarity |
| Dense embeddings | Semantic similarity, paraphrase matching | Misses exact terms |
| Knowledge graph | Structural relationships, entity chains | Misses unstructured content |

**Hybrid reduces errors by 35-60% vs pure semantic retrieval.**

---

## BM25 (Best Match 25)

The gold standard for keyword-based retrieval, still essential in 2026.

**Scoring formula:**
```
BM25(d, q) = Σ IDF(qi) × [f(qi,d) × (k1+1)] / [f(qi,d) + k1×(1-b+b×|d|/avgdl)]
```

Where:
- `IDF(qi)` — inverse document frequency of term qi
- `f(qi,d)` — frequency of term qi in document d
- `k1` — term saturation (typically 1.2-2.0)
- `b` — length normalization (typically 0.75)
- `avgdl` — average document length

**Best for:** Product codes, UUIDs, unique identifiers, technical terms, proper nouns, legal/medical terminology.

---

## Dense Embeddings

**How they work:** Documents and queries converted to high-dimensional vectors. Similar meanings → nearby in vector space → retrieved together.

**Embedding models (2026):**

| Model | Dimensions | Strengths |
|-------|-----------|----------|
| text-embedding-3-large (OpenAI) | 3,072 | General purpose, MTEB SOTA |
| voyage-3 (Anthropic) | 1,024 | Claude-optimized, multilingual |
| cohere-embed-v3 | 1,024 | Classification, search |
| e5-large-v2 (free) | 1,024 | Open-source quality |
| bge-m3 (free) | 1,024 | Multi-lingual, long-context |

**Selection guidance:**
- Production with Anthropic stack: Voyage-3
- Cost-sensitive: bge-m3 (self-hosted)
- Multilingual: bge-m3 or voyage-3

---

## Reciprocal Rank Fusion (RRF)

Merges rankings from multiple retrieval systems without requiring score normalization.

**Formula:**
```
RRF(d) = Σ 1 / (k + rank_i(d))
```

Where `k` = 60 (standard), `rank_i(d)` = rank of document d in retrieval system i.

**Why RRF works:** A document appearing in top-5 across multiple retrieval types gets a massive score boost. Captures "universal relevance."

**Alternative: Learned merging** — train a small model to weight retrieval sources based on query type. Better for domain-specific applications with training data.

---

## Cross-Encoder Reranking

Two-stage retrieval architecture:

**Stage 1 (Bi-encoder):** Fast approximate search — retrieves top-K candidates using embeddings.

**Stage 2 (Cross-encoder):** Slow, precise scoring — reads query + document together for more accurate relevance.

```
[Query] + [Document 1] → Score: 0.92
[Query] + [Document 2] → Score: 0.87
[Query] + [Document 3] → Score: 0.71
```

**Models:** `cross-encoder/ms-marco-MiniLM-L-6-v2` (open-source), Cohere Rerank (API).

**When to use:** When top-K from bi-encoder stage contains irrelevant results that hurt LLM response quality.

---

## Chunking Strategies

How documents are split for indexing. Critical for retrieval quality.

### Chunking Methods

| Method | Description | Best For |
|--------|-------------|---------|
| **Fixed-size** | Split every N characters/tokens | Baseline, simple docs |
| **Sentence-based** | Split at sentence boundaries | Prose text |
| **Semantic** | Split at topic changes (detected by LLM/embeddings) | Complex documents |
| **Recursive** | Try paragraphs → sentences → words | Variable-length content |
| **Document-aware** | Respect markdown headers, code blocks | Technical docs, KB files |
| **Parent-child** | Store full section + child chunks | Knowledge retrieval |

### Parent-Child Chunking (Recommended for KB)

```
Parent chunk: Full section (e.g., "## Memory Architecture")
  → Stored for retrieval (full context)
  
Child chunks: Individual paragraphs within section
  → Used for search (narrow matches)
  → When matched, return parent chunk (full context)
```

**Why:** Narrow chunks retrieve more precisely; full sections provide sufficient context for LLM.

### Chunk Size Guidelines

| Content Type | Recommended Size | Overlap |
|-------------|-----------------|---------|
| Technical documentation | 512-1024 tokens | 10-20% |
| Conversational notes | 256-512 tokens | 5-10% |
| Code snippets | 256-512 tokens | 0% (no overlap) |
| Legal/formal documents | 1024-2048 tokens | 15-20% |
| Research papers | 512-1024 tokens | 10-15% |

**Key rule:** Each chunk should be **semantically self-contained** — understandable without surrounding context.

---

## GraphRAG (Microsoft Research + Production)

### What GraphRAG Adds

Standard RAG: "What do these chunks say?"
GraphRAG: "What do ENTITIES and their RELATIONSHIPS say?"

**Two query modes:**
- **Local query:** Specific fact lookup about known entities
- **Global query:** Theme/pattern questions across entire corpus

### LazyGraphRAG (2026 Innovation)

Full GraphRAG requires expensive upfront indexing (extract all entities and relationships).

**LazyGraphRAG:** Defers expensive analysis to query time.
- Index cost: ~0.1% of full GraphRAG
- Quality: Comparable for global queries
- Trade-off: Higher latency per query

**Use when:** Cost of upfront indexing prohibitive; data changes frequently.

---

## Agentic RAG

State of the art — agents that **plan, retrieve, reason, critique, and refine** in loops.

### Agentic RAG Loop

```
[Question]
  ↓
[Decompose into sub-questions]
  ↓
For each sub-question:
  [Query formulation] → refined search terms
  [Retrieval] → top-K results
  [Relevance check] → is this actually useful?
  [Gap detection] → what's missing?
  If insufficient → reformulate query and retry (max N)
  ↓
[Cross-reference all findings]
[Identify convergences and contradictions]
[Synthesize into coherent answer]
[Verify citations are accurate]
  ↓
[Final response with citations]
```

**Survey:** arXiv 2501.09136 — "Agentic RAG" as formal research area.

### SINAPSE Research Pipeline (analogous)

```
@analyst receives research request
  → Decompose into sub-questions
  → For each: search vault + web + papers
  → Extract claims and assess credibility
  → Cross-reference sources
  → Synthesize structured output
  → Deposit results in vault (audit trail)
```

---

## RAG Evaluation

### Core Metrics

| Metric | What It Measures | Target |
|--------|-----------------|--------|
| Retrieval Precision | % retrieved chunks actually relevant | > 70% |
| Retrieval Recall | % relevant chunks retrieved | > 60% |
| Answer Faithfulness | Answer grounded in retrieved context | > 90% |
| Answer Relevance | Answer addresses the question | > 85% |
| Context Relevance | Retrieved context relevant to question | > 70% |
| Latency P95 | Time to first token | < 3s |

### RAGAS Framework

Open-source RAG evaluation (Exploding Topics, 2023):
```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision

results = evaluate(
    dataset=test_cases,
    metrics=[faithfulness, answer_relevancy, context_precision]
)
```

### Common Failure Modes

| Failure | Cause | Fix |
|---------|-------|-----|
| Hallucination | LLM ignores retrieved context | Better prompting: "Based ONLY on context" |
| Retrieved wrong content | Poor chunking or embedding quality | Improve chunking, upgrade embeddings |
| Missing relevant content | Incomplete retrieval | Hybrid search, increase top-K |
| Context too long | Too many chunks retrieved | Cross-encoder reranking, reduce K |
| Outdated information | Stale index | Index update schedule |

---

## RAG for SINAPSE Knowledge Base

### Current Knowledge Flow

```
User query → Claude Code
  → (no automated retrieval)
  → Claude reads KB files manually when needed
```

### Recommended Enhancement

```
User query → SINAPSE agent
  → Query formulation
  → Hybrid search over KB + stories + architecture docs
  → Top-N relevant chunks
  → Grounded response with KB citations
```

### Implementation Approach

1. **Index KB files:** Embed all KB files (*.md in knowledge-base/)
2. **Index stories:** Embed active stories (docs/stories/)
3. **Index architecture docs:** Embed docs/architecture/
4. **Search API:** Expose search endpoint via MCP server
5. **Agent integration:** Add `*search-kb` skill that agents call when needing reference

### Chunking KB Files

KB files are structured markdown. Use document-aware chunking:

```python
# Split at H2 headers (##)
# Keep H1 context in each chunk as prefix
# Minimum chunk: 100 tokens
# Maximum chunk: 1500 tokens
# Overlap: 10% between consecutive sections
```

Each chunk prefixed with: `{file_name} > {h1_title} > {h2_section}`

Example: `memory-systems-reference.md > Memory Frameworks Comparison > Letta (MemGPT)`
