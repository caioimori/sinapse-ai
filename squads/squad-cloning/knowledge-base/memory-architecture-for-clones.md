# Memory Architecture for Clones — Infraestrutura Cognitiva

> Como estruturar a memoria operacional de um clone cognitivo para que ele
> recupere o conhecimento certo, no momento certo, ao custo minimo.
> Baseado em: MS-009 Agentic Second Brain (A-Mem, Mem0, Letta, ContextForge, Graphiti).

---

## Por Que Memoria Importa Para Clones

Um clone sem arquitetura de memoria adequada recai em dois problemas:

1. **Context flooding:** Joga tudo no context window — degrada qualidade, aumenta custo
2. **Context starvation:** Deixa conhecimento critico fora do contexto — produz respostas genéricas

A solucao e um sistema de tres tiers que simula como humanos realmente recuperam conhecimento.

---

## Os Tres Tiers de Memoria

```
HOT  ← Context Window Ativo (~20K tokens)
  |
  | promocao semantica automatica
  |
WARM ← Vector DB + Knowledge Graph (<300ms retrieval)
  |
  | recuperacao sob demanda
  |
COLD ← Filesystem + Archive (segundos)
```

### HOT Memory — O Que Fica Sempre Presente

Conteudo que deve estar SEMPRE no system prompt do clone:

```
[Identity Block]        ~1.500 tokens
  - Core axiom (L5)
  - 5-6 core principles (L1 top)
  - Communication tone + greeting (L4)
  - Failure modes e boundaries (L6)

[Active Heuristics]     ~3.000 tokens
  - Top 8-10 heuristics mais invocadas (L2)
  - Gatilhos de ativacao explícitos

[Task Context]          ~15.000 tokens (dinamico)
  - Tarefa atual
  - Historico recente da conversa
  - Resultados de retrieval WARM relevantes
```

**Budget total HOT:** ~20K tokens (10% de uma janela de 200K)

### WARM Memory — Conhecimento Recuperavel Rapidamente

Indexado em vector DB (semantico) + knowledge graph (estrutural):

| Conteudo | Storage | Latencia |
|---------|---------|---------|
| Heuristics completas (L2) | Vector + Graph | <100ms |
| Workflows detalhados (L3) | Vector + Graph | <150ms |
| KBs do clone (todos os tipos) | Vector | <200ms |
| Exemplos concretos e casos | Vector | <200ms |
| Meta-patterns (L5) | Graph traversal | <300ms |

**Trigger de promocao para HOT:** Relevancia semantica com a tarefa atual.
Uma heuristic de pricing fica COLD quando o assunto e copywriting — mas e
promovida para HOT imediatamente quando o assunto muda para estrategia de preco.

### COLD Memory — Arquivo Historico

Fontes brutas e material de referencia:

- Transcricoes completas das fontes originais
- KBs nao-relevantes para tarefa atual
- Historico de versoes do perfil cognitivo
- Material de suporte (livros, artigos completos)

**Acesso:** Apenas quando o agente precisa citar fonte original ou aprofundar
alem do que o WARM contem.

---

## Implementacao no agent.md

### Secao de Memory Configuration

```yaml
memory_architecture:
  hot:
    always_loaded:
      - identity_block          # identity + core principles
      - communication_style     # L4 completo
      - failure_modes           # L6 completo
      - top_heuristics          # Top 8 heuristics (L2)
    token_budget: 20000

  warm:
    retrieval_triggers:
      - task_semantic_match     # Query semantica contra KBs
      - entity_mention          # Nome de topico mencionado na conversa
      - domain_switch           # Mudanca de dominio na conversa
    index_sources:
      - heuristics_complete     # Todas as heuristics (L2)
      - workflows               # Todos os workflows (L3)
      - knowledge_bases         # Todos os KBs gerados
      - examples                # Casos e exemplos concretos

  cold:
    on_demand:
      - source_transcriptions
      - full_kb_archive
      - version_history
```

---

## Tipos de Memoria por Analogia Humana

| Tipo Humano | Analogia Cognitiva | Layer | Como Implementar |
|-------------|-------------------|-------|-----------------|
| **Working Memory** | O que esta "na ponta da lingua" agora | Contexto ativo da tarefa | HOT — Slot dinamico |
| **Semantic Memory** | Conhecimento geral sobre o mundo | L1 Mental Models | WARM/COLD — Knowledge Graph |
| **Procedural Memory** | Saber fazer sem pensar | L3 Workflows | WARM — Recuperado por dominio de tarefa |
| **Episodic Memory** | Lembrar de eventos especificos | Casos e exemplos | WARM — Vector search |
| **Autobiographic Memory** | Quem sou eu, minha historia | Identity + Meta-patterns | HOT — Identity Block |

---

## Estrategia de Context Engineering por Tier de Clone

### Tier 1 (KB-only)
Sem agente — KBs sao consultados diretamente.
Nao ha memory architecture formal.

### Tier 2 (Consultant Clone)
```
System Prompt:
  HOT: Identity + Top 5 heuristics + Communication style
  
Per-turn:
  WARM: Recuperar 2-3 heuristics relevantes + 1-2 KBs relevantes
  Budget: ~30K tokens total
```

### Tier 3 (Full Clone)
```
System Prompt:
  HOT: Identity completo + Top 10 heuristics + Workflows key + Failure modes
  
Per-turn:
  WARM: Hybrid retrieval (BM25 + embeddings) contra KBs completos
  Budget: ~80K tokens (40% de janela de 200K)
  
On-demand:
  COLD: Fontes originais para citacao ou verificacao
```

---

## Token Budget por Layer do DNA

Guia para alocar o context window do clone:

| Conteudo | Tier 2 | Tier 3 | Notas |
|---------|--------|--------|-------|
| Identity + Core Axiom | 800 | 1.500 | Sempre HOT |
| Core Principles (L1) | 1.200 | 2.000 | Sempre HOT |
| Top Heuristics (L2) | 2.000 | 4.000 | Sempre HOT |
| Communication Style (L4) | 800 | 1.200 | Sempre HOT |
| Failure Modes (L6) | 500 | 1.000 | Sempre HOT |
| Task-retrieved KBs | 5.000 | 15.000 | WARM → HOT |
| Conversation history | 3.000 | 10.000 | HOT dinamico |
| **TOTAL** | **~13K** | **~35K** | Dentro do budget |

---

## Content Decay para Memorias de Clone

Assim como vaults de Second Brain degradam, a memoria do clone pode ficar desatualizada.

### Tipos de Decay

| Tipo | Exemplo | Deteccao |
|------|---------|---------|
| **Factual Decay** | Preco que o original praticava mudou | Comparar com fontes recentes |
| **Opiniao Evoluida** | Mudou de posicao sobre topico | Comparar fontes temporais |
| **Contexto Obsoleto** | Heuristic baseada em mercado que mudou | Checar timestamp da fonte |
| **Terminologia** | Usava X, agora usa Y para o mesmo conceito | Analise de vocabulario temporal |

### Protocolo de Review

- **Heuristics taticas (L2):** Review anual — mudam com mercado
- **Mental Models (L1):** Review bienal — mais estaveis
- **Communication Patterns (L4):** Review anual — evolucao do estilo
- **Meta-patterns (L5):** Review a cada 3-5 anos — muito estaveis
- **Workflows (L3):** Review semestral — praticas evoluem rapido

---

## Hybrid Retrieval para Clones

Para WARM memory, usar hybrid search (BM25 + embeddings) ao inves de apenas vector:

```
[Query da conversa]
  |
  +-- BM25 (keyword) ---------> KBs com termos exatos
  |
  +-- Embeddings (semantic) --> KBs semanticamente proximos
  |
  +-- Graph traversal ---------> KBs conectados por entidade
  |
  +-- RRF (fusion) ------------> Top-5 KBs mais relevantes
  |
  +-- Injeta no HOT ------------> Context window enriquecido
```

**Por que BM25 ainda importa:** Para nomes proprios, frameworks nomeados
("Hormozi Offer Framework"), e termos tecnicos — BM25 supera embeddings.

**Resultado esperado:** ~35% reducao em respostas genericas comparado com
retrieval apenas semantico (baseado em resultados do benchmark LongMemEval).

Ver tambem: `confidence-scoring.md` para pesos por tipo de extracao.
Ver tambem: `extraction-patterns.md` para como popular a WARM memory.
