# Knowledge Graph for Clones — Modelagem de Grafo Cognitivo

> Como construir um knowledge graph do perfil cognitivo de uma pessoa,
> conectando entidades, relacoes e atributos para retrieval estruturado.
> Baseado em: MS-009 Sistema 1 (Knowledge Architecture) e Sistema 4 (Retrieval).

---

## Por Que Knowledge Graph Para Clones

Extrair dados cognitivos como lista plana (heuristics: [...]) e insuficiente
para alta fidelidade. O pensamento humano e intrinsecamente uma rede — mental
models referentiam uns aos outros, heuristics derivam de principios, workflows
implementam modelos mentais.

Um knowledge graph:
- Captura as **relacoes** entre elementos cognitivos (nao apenas os elementos)
- Permite **graph traversal** para recuperar contexto adjacente
- Detecta **inconsistencias** (loop de relacoes que nao deveria existir)
- Habilita **GraphRAG** (retrieval estruturado + semantico combinados)

---

## Ontologia do Clone

### Tipos de No (Node Types)

| Tipo | Descricao | Exemplos |
|------|-----------|---------|
| `Principle` | Mental models e principios fundamentais (L1) | "Value equation determines everything" |
| `Heuristic` | Regras if/then de decisao (L2) | "If CAC > 1/3 LTV, pause scaling" |
| `Workflow` | Processos step-by-step (L3) | "7-step launch process" |
| `Concept` | Conceitos chave usados pela pessoa | "Offer", "Value", "Leverage" |
| `Domain` | Areas de expertise | "Offer creation", "Business acquisition" |
| `Person` | O proprio target + pessoas que influenciaram ele | "Alex Hormozi", "Peter Drucker" |
| `Source` | Fontes de onde foi extraido | "$100M Offers book", "Acquisition.com podcast" |
| `MetaPattern` | Padroes de padroes (L5) | "Simplification drives everything" |
| `FailureMode` | Limites e areas de nao-expertise (L6) | "Does not advise on accounting" |

### Tipos de Relacao (Edge Types)

| Relacao | De → Para | Significado |
|---------|-----------|-------------|
| `DERIVES_FROM` | Heuristic → Principle | Esta heuristic deriva deste principio |
| `IMPLEMENTS` | Workflow → Principle | Este workflow implementa este principio |
| `CONTRADICTS` | Principle ↔ Principle | Tensao documentada entre principios |
| `REFINES` | Principle → Principle | Versao posterior do mesmo principio |
| `APPLIES_TO` | Heuristic → Domain | Esta heuristic se aplica neste dominio |
| `INFLUENCES` | Person → Principle | Esta influencia e documentada |
| `EXTRACTED_FROM` | Qualquer → Source | De onde foi extraido |
| `RELATED_TO` | Concept ↔ Concept | Conexao semantica geral |
| `PART_OF` | Workflow.Step → Workflow | Este step e parte deste workflow |
| `TRIGGERS` | Concept → Heuristic | Este conceito ativa esta heuristic |
| `UNIFIES` | MetaPattern → [Principles] | Este meta-pattern unifica estes principios |

---

## Exemplo: Grafo Cognitivo Minimo (Tier 1)

Para um expert em marketing direto hipotetico:

```
[MetaPattern: "Clarity beats cleverness"]
    |
    | UNIFIES
    |
    +--[Principle: "Simple offers outperform complex ones"]
    |       |
    |       | DERIVES_FROM (x3)
    |       |
    |       +-- [Heuristic: "If offer requires explanation > 30s, simplify"]
    |               |
    |               | EXTRACTED_FROM
    |               +-- [Source: "Book Chapter 4"]
    |
    +--[Principle: "One message, one audience, one action"]
            |
            | IMPLEMENTS
            |
            +-- [Workflow: "Campaign creation process"]
                    |
                    | EXTRACTED_FROM
                    +-- [Source: "Podcast EP 156"]
```

---

## Como Construir o Grafo

### Fase 1 — Extracao de Nos

Para cada item extraido nas 5 camadas do DNA:

```yaml
# Para cada Mental Model (L1) → Criar no Principle
node:
  id: "principle-{hash}"
  type: Principle
  content: "{Texto do principio}"
  confidence: "[DIRETO|INFERIDO|HIPOTESE]"
  sources: ["{source_id_1}", "{source_id_2}"]

# Para cada Heuristic (L2) → Criar no Heuristic
node:
  id: "heuristic-{hash}"
  type: Heuristic
  trigger: "{Situacao de ativacao}"
  action: "{O que fazer}"
  rationale: "{Por que}"
  confidence: "[DIRETO|INFERIDO|HIPOTESE]"
  sources: ["{source_id}"]

# Para cada Workflow (L3) → Criar no Workflow + nos Step
node:
  id: "workflow-{hash}"
  type: Workflow
  name: "{Nome do workflow}"
  steps: ["{step_id_1}", "{step_id_2}"]
  confidence: "[DIRETO|INFERIDO|HIPOTESE]"
```

### Fase 2 — Identificacao de Relacoes

Prompt para LLM identificar relacoes automaticamente:

```
Dado o seguinte conjunto de elementos cognitivos extraidos de {Nome}:

PRINCIPLES: {lista}
HEURISTICS: {lista}
WORKFLOWS: {lista}

Identifique e liste:
1. Quais heuristics DERIVAM de quais principles? (DERIVES_FROM)
2. Quais workflows IMPLEMENTAM quais principles? (IMPLEMENTS)
3. Existem principles que parecem CONTRADIZER uns aos outros? (CONTRADICTS)
4. Existem conceitos que TRIGGER heuristics especificas? (TRIGGERS)
5. Qual meta-pattern UNIFICA multiplos principles? (UNIFIES)

Para cada relacao, fornecer:
- De: {id do no}
- Para: {id do no}
- Tipo: {tipo da relacao}
- Justificativa: {evidencia da relacao}
- Confianca: [DIRETO|INFERIDO|HIPOTESE]
```

### Fase 3 — Validacao do Grafo

Checks de qualidade antes de usar o grafo:

```
1. Conectividade: Todo no deve ter ao menos 1 aresta
2. Consistencia: Sem loops em DERIVES_FROM (principio A deriva de A)
3. Proporcao: Ratio de DIRETO/INFERIDO deve refletir confidence score
4. Cobertura: Todos os domains do target devem ter nos Principle
5. Proveniencia: Toda aresta com confianca alta tem Source node
```

---

## GraphRAG para Clones

Com o grafo construido, o retrieval muda de busca plana para busca estruturada:

### Retrieval Tradicional (so vector)
```
Query: "Como escalar um negocio de servicos?"
→ Top-5 chunks semanticamente similares
→ Injeta no contexto
```

### GraphRAG (vector + graph)
```
Query: "Como escalar um negocio de servicos?"
→ Vector: Top-5 chunks semanticamente similares
→ Graph: Identificar entidades na query (Concept: "scaling", Domain: "services")
         → Traversal: Quais Principles conectados a "scaling" + "services"?
         → Traversal: Quais Heuristics derivam desses Principles?
         → Traversal: Quais Workflows implementam esses Principles?
→ Fusao (RRF): Combinar resultados vector + graph
→ Contexto mais rico e especifico
```

**Ganho esperado:** Reducao de 35-60% em respostas genericas vs vector-only
(baseado em benchmark interno GraphRAG da Microsoft, adaptado para clones cognitivos)

---

## Schema de Persistencia

Para persistir o grafo em formato processavel:

```yaml
# cognitive_graph_{target_id}.yaml
metadata:
  target: "{Nome}"
  clone_tier: "{1|2|3}"
  confidence_score: "{X}%"
  node_count: {N}
  edge_count: {N}
  created: "{YYYY-MM-DD}"
  
nodes:
  principles:
    - id: "p-001"
      content: "..."
      confidence: "[DIRETO]"
      sources: ["s-001", "s-002"]
  
  heuristics:
    - id: "h-001"
      trigger: "..."
      action: "..."
      rationale: "..."
      confidence: "[INFERIDO]"
      sources: ["s-001"]
  
  meta_patterns:
    - id: "mp-001"
      content: "..."
      unified_principles: ["p-001", "p-003", "p-007"]
      confidence: "[INFERIDO]"

edges:
  - from: "h-001"
    to: "p-001"
    type: "DERIVES_FROM"
    confidence: "[INFERIDO]"
    justification: "..."
  
  - from: "p-001"
    to: "p-003"
    type: "CONTRADICTS"
    confidence: "[HIPOTESE]"
    resolution: "Tensao produtiva: ambos verdadeiros em contextos diferentes"
```

---

## Grafo Bi-Temporal (para Evolucao do Pensamento)

Inspirado no Graphiti (Zep), o grafo de um clone pode rastrear
como o pensamento da pessoa EVOLUIU ao longo do tempo:

```yaml
# Aresta com informacao temporal
edge:
  from: "p-001-v1"  # "Crescimento e tudo" (2018)
  to: "p-001-v2"    # "Crescimento sustentavel supera crescimento rapido" (2023)
  type: "REFINES"
  valid_from: "2018"
  valid_to: "2023"  # Quando foi substituido
  invalidated_by: "p-001-v2"
```

### Como Usar Evolucao Temporal

- Identificar quais principios sao **estaveis** (aparecem em todas as epocas)
- Identificar quais sao **historicos** (valeram em periodo especifico)
- Dar maior peso a principios estaveis no sistema HOT memory
- Documentar evolucoes como meta-pattern (pessoa aprende e refina)

---

## Implementacao Pratica sem Banco de Grafo

Para clones sem infraestrutura de grafo formal (casos simples):

O grafo pode ser representado como **secao no perfil cognitivo** em markdown:

```markdown
## Rede de Conexoes (Mini-Grafo)

### Core Axiom
{MetaPattern central}

### Deriva de:
- {Principio 1} → {Heuristic A}, {Heuristic B}
- {Principio 2} → {Workflow X}
- {Principio 3} → {Heuristic C}

### Tensoes Documentadas
- {Principio 1} ↔ {Principio 3}: {Como a pessoa resolve}

### Influencias Externas Documentadas
- {Pessoa/Livro} → influenciou {Principio X}
```

Esta representacao plana permite ao LLM fazer graph traversal via reasoning,
sem necessidade de banco de grafo formal.

Ver tambem: `extraction-patterns.md` — como extrair os nos do grafo.
Ver tambem: `memory-architecture-for-clones.md` — como usar o grafo em retrieval.
Ver tambem: `cognitive-dna-framework.md` — as 5 camadas que formam os nos.
