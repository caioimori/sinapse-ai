# AI-Augmented Research Methods

> Extraído e sintetizado de MS-009 Agentic Second Brain (2026). Cobre o uso de LLMs para literature review, síntese automatizada, context engineering e pipelines de pesquisa aumentada por IA.

## O Shift: De Prompts para Context Engineering

Em 2025, Andrej Karpathy definiu a mudança fundamental:

> *"Context engineering is the delicate art and science of filling the context window with just the right information for the next step."*

Simon Willison complementou: *"Context engineering is what we do instead of fine-tuning."*

**O modelo mental:** Pense no LLM como uma CPU, e o context window como a RAM. O trabalho do pesquisador/agente é análogo a um sistema operacional: carregar a memória de trabalho com exatamente os dados certos para a tarefa.

## LLMs para Literature Review

### Por Que Funciona Agora

Context windows de 1M+ tokens (Claude, Gemini) permitem que agentes leiam corpora inteiros como contexto. O que antes exigia meses de anotação manual e NLP especializado agora é realizável em dias.

**Ganho prático:** Organizações reportando 300-320% ROI na construção de knowledge graphs via LLMs para extração automática de entidades e relações.

### Pipeline de Literature Review Aumentada

```
[Corpus de Fontes]
  --> Ingestão + Chunking Semântico
  --> Extração de Entidades/Relações (LLM)
  --> Construção de Knowledge Graph
  --> Retrieval Híbrido (BM25 + embeddings + graph)
  --> Síntese por LLM com fontes citadas
  --> Crystallization: FINDING + IMPLICATION + RECOMMENDATION
  --> Quality Gate: triangulação e confidence scoring
```

### Prompts de Extração para Literature Review

**Extração de Entidades/Relações:**
```
Dado o texto abaixo, identifique:
1. Entidades: [nome, tipo {Pessoa|Empresa|Conceito|Dado|Tendência}, relevância 1-5]
2. Claims: [afirmação factual, confiança 1-5, evidência citada]
3. Relações: [entidade_a, tipo_relação, entidade_b]
4. Dados quantitativos: [número, contexto, fonte, data]
Texto: {text}
```

**Síntese de Múltiplas Fontes:**
```
A partir dos seguintes {N} trechos de pesquisa:
{trechos com fontes identificadas}

Sintetize:
1. CONSENSUS: O que todas as fontes concordam?
2. DIVERGENCE: Onde as fontes discordam e por quê?
3. GAPS: O que nenhuma fonte endereça?
4. EMERGING: Quais padrões emergem quando as fontes são combinadas?
```

**Quality Gate:**
```
Avalie este insight:
FINDING: {finding}
IMPLICATION: {implication}
RECOMMENDATION: {recommendation}
FONTES: {sources}

Questione:
1. O finding é suportado pelas fontes citadas? (1-5)
2. A implication segue logicamente do finding? (1-5)
3. A recommendation é acionável? (1-5)
4. Que evidência refutaria este insight?
5. Que biases podem estar presentes?
```

## Agentic RAG (Retrieval-Augmented Generation Ativo)

Evolução do RAG passivo para sistema ativo que planeja e itera:

### RAG Passivo (Defasado)
```
Query → Retrieve → Generate → Done
```
Problema: Se o retrieval trouxe informação errada ou insuficiente, a geração é comprometida sem chance de correção.

### Agentic RAG (Estado da Arte 2026)
```
Query
  → Plan: Decompor em sub-queries
  → Retrieve: Executar retrieval para cada sub-query
  → Reason: Agente avalia cobertura e qualidade
  → Critique: As fontes respondem a query suficientemente?
  → If NO: Reformular sub-queries, buscar mais fontes
  → Repeat (max 3 ciclos)
  → Generate: Resposta com fontes explícitas
```

**Referência acadêmica:** arXiv 2501.09136 — survey formal sobre Agentic RAG.

## Sistemas de Memória para Pesquisa Persistente

### Camadas de Memória

| Camada | Análogo Humano | Função | Duração | Custo |
|--------|----------------|--------|---------|-------|
| **Working** | Scratchpad | Informação ativa da tarefa | Sessão | Tokens diretos |
| **Episodic** | Memória autobiográfica | Pesquisas passadas, decisões | Dias-Meses | Vector search |
| **Semantic** | Conhecimento geral | Fatos, frameworks, regras | Permanente | Graph + Vector |

### Ferramentas de Memória de Pesquisa

| Ferramenta | Abordagem | Benchmark | Custo |
|-----------|-----------|-----------|-------|
| **Mem0** | Graph DB + vector layers | 26% accuracy gain; 91% menor latência | $24M Series A |
| **Zep/Graphiti** | Temporal graph | 94.8% accuracy DMR | Open-source + cloud |
| **A-Mem (NeurIPS 2025)** | Zettelkasten-inspired | Notas atômicas com tags e context | Acadêmico |
| **Hindsight** | 4 redes separadas (fatos, experiências, entidades, crenças) | 91.4% DMR accuracy; multi-session 21%→79.7% | Open-source (Virginia Tech + Washington Post) |

## Automação de Pesquisa: Tipos e Padrões

### Tipos de Automação por Trigger

| Tipo | Gatilho | Exemplo |
|------|---------|---------|
| **Event Hook** | Ação específica | Fim de sessão → extrair insights |
| **Cron Job** | Temporal | Daily → review de fontes monitoradas |
| **Watch** | Mudança em filesystem | Novo documento → ingestão automática |
| **Threshold** | Métrica ultrapassa limite | Tópico com +50 menções → flag para análise |
| **Pipeline** | Cadeia de transformações | URL → scrape → chunk → embed → indexar |

### Pipeline Operacional: Fonte para Insight

```
[Fonte (paper, artigo, relatório)]
  --> Extração (parsing, OCR se necessário)
  --> Limpeza (remover ruído, formatar)
  --> Chunking semântico (dividir por significado, não tokens)
  --> Enriquecimento (metadata, tags, entidades via LLM)
  --> Embedding (vetorização para busca semântica)
  --> Indexação (vault + vector store + knowledge graph)
  --> Conexão (links automáticos com conhecimento existente)
  --> Quality Score (completude, precisão, frescor)
```

## AI para Categorias Específicas de Pesquisa

### Market Intelligence Automatizada
- **Tools:** Perplexity (pesquisa com citações), EXA (semantic search), Apify (web scraping)
- **Pattern:** Query → Multi-source search → Cross-validation → Synthesis
- **Output:** Brief estruturado com confidence levels

### Competitive Monitoring
- **Frequency:** Daily scan de fontes configuradas
- **Sources:** Blogs de concorrentes, job postings (sinais de estratégia), patent filings, press releases
- **Alert logic:** Tópico novo → flag para análise manual; Threshold de menções → síntese automática

### Trend Detection
- **Weak signals:** Identificar temas emergindo em Hacker News, arXiv, GitHub trending ANTES de serem mainstream
- **Signal amplification:** Mesmo tópico aparecendo em 3+ canais independentes = sinal forte
- **Velocity tracking:** Aceleração de menções sobre um tópico em 30 dias

## Verification Protocols: Pesquisa com IA Honesta

### O Problema do Alucinometer
LLMs podem "aluciná-la" fatos com alta confiança. Para pesquisa séria:

**Regra de verificação:** Todo dado quantitativo gerado por LLM DEVE ter uma fonte verificável. Se o LLM não pode citar a fonte, tratar como hipótese a verificar, não como dado.

### 84-Correction Methodology (Referência MS-009)
Framework para verificação sistemática de claims geradas por IA:

1. **Geração:** LLM produz claims com fontes sugeridas
2. **Verificação de existência:** As fontes citadas existem?
3. **Verificação de conteúdo:** As fontes dizem o que o LLM afirma?
4. **Verificação de contexto:** O claim está sendo usado com o contexto correto?
5. **Triangulação:** 2+ fontes independentes suportam o claim?
6. **Confidence assignment:** Baseado no número de passes superados

### Red Flags em Saídas de LLM

| Red Flag | O Que Fazer |
|----------|-------------|
| Dados precisos sem fonte ("cresceu 47% em 2024") | Buscar fonte; se não encontrar, remover |
| Data muito recente além do cutoff do modelo | Sempre verificar via WebSearch |
| Contradição entre LLMs diferentes | Investigar — um ou ambos estão errados |
| Achados muito convenientes para a hipótese | Pre-mortem bias check |
| Números redondos demais ($10B, 50%, etc.) | Verificar — LLMs tendem a arredondar |

## Ferramentas de AI Research Recomendadas

| Ferramenta | Uso | Custo |
|-----------|-----|-------|
| **Perplexity Pro** | Pesquisa com citações em tempo real | ~$20/mês |
| **EXA** | Semantic search de qualidade | API pricing |
| **Claude (com Projects)** | Deep research com contexto persistente | Pro/Team |
| **Elicit** | Literature review científico | Freemium |
| **Consensus** | Síntese de evidências científicas | Freemium |
| **Research Rabbit** | Mapeamento de literatura acadêmica | Gratuito |
| **Semantic Scholar** | Indexação de papers com AI summaries | Gratuito |
| **Connected Papers** | Grafo visual de citações | Freemium |

## Ética e Limitações

- **Transparência:** Declarar quando pesquisa usa AI-augmentation nos métodos
- **Verificação humana:** AI acelera, não substitui verificação crítica de claims importantes
- **Bias amplification:** LLMs podem amplificar biases presentes nos dados de treinamento
- **Knowledge cutoff:** Sempre verificar datas — informações pós-cutoff requerem WebSearch
- **Attribution:** Manter provenance chain clara (qual LLM gerou, qual fonte verificou)

---

*Knowledge base da squad-research | Fonte: MS-009 Agentic Second Brain*
