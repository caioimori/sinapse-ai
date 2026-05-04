# Hybrid Retrieval Patterns

> Extraído e sintetizado de MS-009 Agentic Second Brain (2026) — estado da arte em retrieval para sistemas RAG e Second Brains.

## Princípio Central

**Hybrid search (BM25 + embeddings + graph traversal) é o padrão de produção em 2026.** Sistemas com retrieval monomodal (apenas semântico OU apenas keyword) são considerados subótimos. A combinação reduz erros em 35-60% versus retrieval semântico puro.

## Por Que BM25 Ainda Importa

Apesar dos avanços em embeddings, BM25 permanece imbatível para:
- Códigos de produto exatos e SKUs
- Terminologia legal e regulatória específica
- Acrônimos únicos e jargões técnicos
- Nomes próprios e marcas

Para a maioria das aplicações RAG reais, full-text search fornece precisão que vector search não alcança confiavelmente.

## A Stack Híbrida de Produção

```
[Query do Usuário]
  |
  +-- BM25 (keyword search)        --> Top-K resultados
  |
  +-- Dense Embeddings (semantic)  --> Top-K resultados
  |
  +-- Knowledge Graph (structured) --> Entidades + Relações
  |
  --> Reciprocal Rank Fusion (RRF) --> Merged & Ranked
  |
  --> Cross-Encoder Reranking      --> Final Top-N
  |
  --> LLM Generation com Context
```

## Reciprocal Rank Fusion (RRF)

**A fórmula que une os mundos:** Se um documento aparece no Top-5 de AMBOS keyword e semantic search, recebe boost massivo — garantindo que documentos relevantes por ambos critérios sejam priorizados.

```python
# Fórmula RRF
rrf_score = sum(1 / (k + rank_i) for i in retrieval_systems)
# k = constante (tipicamente 60)
# rank_i = posição do documento no sistema i
```

**Por que funciona:** Documentos consistentemente relevantes em múltiplos sistemas recebem scores cumulativos, enquanto falsos positivos (relevantes em apenas 1 sistema) ficam abaixo.

## Camadas de Retrieval

### Camada 1: BM25 (Full-Text)
- **Ferramenta:** Elasticsearch, OpenSearch, Typesense, Meilisearch
- **Força:** Termos exatos, queries específicas
- **Configurar:** Field weighting (título > corpo), stemming para pt-BR

### Camada 2: Dense Embeddings (Semantic)
- **Modelos recomendados 2026:**
  - `text-embedding-3-large` (OpenAI) — melhor qualidade geral
  - `voyage-3` (Voyage AI) — melhor custo/benefício para pt-BR
  - `bge-m3` (open-source) — multilingual, self-hosted
- **Vector DB:** pgvector (início) → Weaviate/Pinecone (produção)
- **Força:** Sinonímia, variações linguísticas, contexto semântico

### Camada 3: Knowledge Graph (Structural)
- **Quando usar:** Queries sobre relações, entidades conectadas, raciocínio multi-hop
- **Força:** "Quais empresas competem com X no mercado Y?"
- **Implementação:** Graphiti para temporal, Neo4j para estático

### Camada 4: Cross-Encoder Reranking
- **O que é:** Segundo estágio de ranking com modelo mais pesado
- **Modelos:** `cross-encoder/ms-marco-MiniLM-L-6-v2` (open-source)
- **Trade-off:** +latência vs +precisão (usar apenas no Top-20, não no full corpus)

## Agentic RAG (Estado da Arte 2026)

Evolução do RAG passivo para RAG ativo — agente que planeja, recupera, raciocina e itera:

```
[Query]
  --> Plan: Quais sub-queries são necessárias?
  --> Retrieve: Executar retrieval para cada sub-query
  --> Reason: Síntese dos resultados
  --> Critique: Os resultados respondem a query?
  --> Refine: Se não, reformular e repetir (max 3 ciclos)
  --> Generate: Resposta final com fontes
```

**Referência acadêmica:** arXiv 2501.09136 — survey formal sobre Agentic RAG.

## Tiers de Armazenamento para Retrieval

| Tier | Acesso | Armazenamento | Latência | Exemplo |
|------|--------|---------------|----------|---------|
| **HOT** | Context window | In-memory (tokens) | <1ms | Tarefa atual, últimas mensagens |
| **WARM** | Recuperável | Vector DB + Cache | <300ms | Notas recentes, entidades do projeto |
| **COLD** | Sob demanda | Filesystem + Archive | >1s | Notas antigas, projetos concluídos |

**Princípio do ContextForge:** Uma nota se torna HOT não apenas por acesso recente, mas por relevância semântica à tarefa atual — mesmo armazenada semanas atrás.

## Token Budget para Contexto RAG

```
TOTAL WINDOW: 200,000 tokens (Claude exemplo)
  |- System Prompt:      ~2,000 tokens (1%)
  |- Agent Persona:      ~1,500 tokens (0.75%)
  |- Memory Context:    ~50,000 tokens (25%)  ← GERENCIADO via retrieval
  |    |- HOT (current):  ~20,000
  |    |- WARM (retrieved): ~30,000
  |- Tool Results:      ~50,000 tokens (25%)  ← DINÂMICO
  |- Response Budget:   ~76,500 tokens (38%)  ← RESERVADO
```

## Ferramentas de Memória Híbrida (2026)

| Ferramenta | Abordagem | Destaque |
|-----------|-----------|----------|
| **Mem0** | Graph DB + vector | 26% accuracy gain vs OpenAI Memory, 91% menor latência, 90% menos tokens. $24M Series A (Out 2025) |
| **Zep/Graphiti** | Temporal graph | 94.8% accuracy DMR; retrieval P95 300ms sem LLM calls |
| **Cognee** | Graph-vector hybrid | $7.5M seed (Fev 2026); 30+ conectores, 1M+ pipeline runs |
| **Letta (MemGPT)** | Virtual context (OS-inspired) | Memory blocks read/write; Conversations API cross-session |
| **ContextForge** | Three-tier HOT/WARM/COLD | 10x compression ratio; auto-promoção/remoção entre tiers |

## Implementação Passo a Passo

1. **Dual Index:** BM25 index (Elasticsearch/Typesense) + vector index (pgvector) para cada documento
2. **Graph Layer:** Extrair entidades/relações durante ingestão com LLM
3. **Hybrid Fusion:** Implementar RRF com k=60 como ponto de partida
4. **Reranking:** Adicionar cross-encoder apenas para Top-20 resultados do RRF
5. **Context Packing:** Selecionar e ordenar chunks para maximizar utilidade no context window
6. **Feedback Loop:** Rastrear quais resultados o agente realmente usa para melhorar rankings

## Riscos

| Risco | Sinal | Mitigação |
|-------|-------|-----------|
| Semantic drift | Embeddings retornando resultados off-topic | Reembarcar modelos periodicamente, monitorar retrieval quality |
| Index staleness | Respostas referenciando informação desatualizada | Pipeline de re-indexação automática ao update de nota |
| Over-retrieval | Contexto poluído com muito material | Limit Top-N, threshold de relevância mínimo |
| Single-modality bias | Perder resultados keyword-específicos | Sempre manter BM25 ativo ao lado de embeddings |

---

*Knowledge base da squad-research | Fonte: MS-009 Agentic Second Brain*
