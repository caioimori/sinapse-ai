# Knowledge Graph Construction

> Extraído e sintetizado de MS-009 Agentic Second Brain (2026) — 67 fontes consultadas.

## O Que E e Por Que Importa

Knowledge graphs transformam texto não estruturado em redes de entidades e relações que permitem raciocínio estruturado, inferência e navegação semântica. Em 2025, organizações reportando 300-320% ROI na construção de KGs, com LLMs tornando viável em dias o que antes levava meses de NLP especializado.

## Arquiteturas de Knowledge Graph

### Grafo Estático (Tradicional)
- Entidades e relações fixas, extraídas uma vez
- Bom para: domínios estáveis, taxonomias corporativas
- Limitação: não acompanha evolução de fatos ao longo do tempo

### Grafo Temporal (Graphiti/Zep)
Modelo bi-temporal que rastreia **quando um evento ocorreu** E **quando foi ingerido**:
- Cada aresta inclui intervalos de validade explícitos
- Conflitos resolvidos via metadata temporal (invalidar, não descartar)
- Suporte a ontologia prescrita + aprendida
- Retrieval P95 de 300ms via busca híbrida (embeddings + BM25 + graph traversal), sem LLM calls durante recuperação
- **Benchmarks:** 94.8% accuracy DMR com gpt-4-turbo; 18.5% ganho em LongMemEval com 90% redução de latência

### GraphRAG (Microsoft Research)
Evolução do RAG tradicional que incorpora um knowledge graph no retrieval:

```
[Query]
  --> Graph Traversal (entidades/relações relevantes)
  --> Vector Search (cobertura semântica)
  --> Combinação via RRF (Reciprocal Rank Fusion)
  --> LLM Generation com contexto estruturado + semântico
```

**LazyGraphRAG:** Indexação ao custo de vector RAG (0.1% do custo GraphRAG full) com qualidade comparável para queries globais — estratégia recomendada para começar.

**Ganhos reportados:** Melhora em faithfulness, relevância de resposta e context recall vs RAG puro.

## Frameworks de Organização do Conhecimento

| Framework | Estrutura | Foco | Ideal Para |
|-----------|-----------|------|-----------|
| **Zettelkasten** | Rede de notas atômicas interligadas | Emergência de ideias | Pesquisa, escrita |
| **PARA** | Projects / Areas / Resources / Archives | Ação e produtividade | Gestão de projetos |
| **Evergreen Notes** | Notas conceituais que evoluem | Pensamento duradouro | Reflexão profunda |
| **MOC (Maps of Content)** | Notas-índice que agregam temáticas | Navegação | Vaults grandes |
| **Knowledge Graph** | Entidades + relações + atributos | Raciocínio e inferência | Sistemas agênticos |

## Processo de Construção de Ontologia

### 1. Definir Tipos de Entidade
Exemplos para research: Pessoa, Conceito, Mercado, Empresa, Tendência, Fonte, Decisão, Insight, Projeto

### 2. Definir Tipos de Relação
- `relaciona-se-com`, `depende-de`, `contradiz`, `evolui-de`
- `é-evidência-de`, `refuta`, `suporta`, `pertence-a`
- `concorre-com`, `complementa`, `antecede`

### 3. Granularidade
- **Notas atômicas:** 1 ideia = 1 nó (Zettelkasten)
- **Notas compostas:** 1 tema = 1 nó com seções (PARA)
- **Escolha:** Atômico para raciocínio profundo, composto para produtividade

### 4. Extração Automática via LLM
```python
# Prompt pattern para extração de entidades/relações
"""
Dado o texto abaixo, extraia:
1. Entidades: [nome, tipo, atributos principais]
2. Relações: [entidade_a, tipo_relação, entidade_b, confiança 1-5]
3. Fatos temporais: [fato, data/período, validade]
Texto: {text}
"""
```

### 5. Ontologia Evolutiva
- Permitir que o sistema aprenda novas categorias do uso
- Graphiti: ontologia híbrida (prescrita + aprendida automaticamente)
- Revisar ontologia mensalmente nos primeiros 3 meses

## Vector Databases: Comparativo 2026

| Database | Ideal Para | Scale Max | Latência (P95) | Compliance |
|----------|-----------|-----------|----------------|------------|
| **Pinecone** | Produção enterprise | Bilhões | <50ms | SOC 2 II, ISO 27001 |
| **Weaviate** | Hybrid search nativo | Centenas de milhões | <100ms | SOC 2 II, HIPAA |
| **Qdrant** | Performance/custo | Centenas de milhões | <100ms | SOC 2 II |
| **Chroma** | Prototipagem rápida | Milhões | Variável | Open-source |
| **pgvector** | PostgreSQL integration | 5-100M | Variável | Herda do PG |
| **Milvus** | Custo em escala | Bilhões | <50ms | Open-source |

**Estratégia:** Começar com pgvector/Chroma para prototipo → migrar para Pinecone/Weaviate para produção.

## Métricas de Saúde do Knowledge Graph

| Métrica | O Que Mede | Target |
|---------|-----------|--------|
| Connection density | Links por nó (média) | >3 links/nota |
| Coverage completeness | % tópicos cobertos vs demandados | >80% |
| Orphan nodes | Nós sem conexões | <5% |
| Graph diameter | Distância média entre nós | <6 hops |
| Decay rate | % nós desatualizados por período | <10%/mês |

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Over-engineering ontológico | Começar simples, expandir baseado em uso |
| Rigidez taxonômica | Usar tags fluidas + taxonomia fixa |
| Lock-in ferramental | Formato open (markdown + JSON) como base |
| Inconsistência temporal | Modelo bi-temporal obrigatório para fatos mutáveis |
| Grafo disconnected | Processo de auto-conexão ao ingesting nova nota |

## Pessoas-Chave

- **Niklas Luhmann** — Criador do Zettelkasten (70 livros, 90,000 fichas)
- **Tim Berners-Lee** — Semantic Web, RDF, OWL — fundamentos de ontologias machine-readable
- **Preston Rasmussen** — Autor do paper Zep/Graphiti sobre grafos temporais para memória de agentes

---

*Knowledge base da squad-research | Fonte: MS-009 Agentic Second Brain*
