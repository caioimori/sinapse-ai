# Multi-Agent Deployment Patterns — Clones em Sistemas Multi-Agente

> Como integrar clones cognitivos em sistemas multi-agente (CrewAI, LangGraph,
> AutoGen/AG2, OpenAI Agents SDK, Claude Agent SDK).
> Como clones funcionam como nodes em orquestrações maiores.
> Baseado em: MS-009 Sistema 5 — Agent, Subagent & Skills Modeling.

---

## Contexto: O Mercado de Frameworks (Abril 2026)

| Framework | Status | Ideal Para |
|-----------|--------|-----------|
| **LangGraph** | Producao — High maturity | Fluxos complexos, state machines, producao enterprise |
| **CrewAI** | Producao — High maturity | Prototipagem rapida, equipes conceituais de agentes |
| **Claude Agent SDK** | Producao — High maturity | Ecossistema Claude nativo, tool use, file checkpointing |
| **OpenAI Agents SDK** | Producao — High maturity | Ecossistema OpenAI, handoffs, guardrails |
| **Google ADK** | Producao — High maturity | Ecossistema Gemini, lancado Cloud NEXT 2025 |
| **Microsoft Agent Framework** | Novo (2026) | Substitui AutoGen + Semantic Kernel unificados |
| **AutoGen/AG2** | Maintenance mode | Fork comunitario (ag2ai/ag2) — nao recomendado para novos projetos |

**Nota importante (Abril 2026):** Microsoft aposentou AutoGen em favor do
Microsoft Agent Framework. AutoGen recebe apenas bug fixes e security patches.
A comunidade mantém o fork AG2 independente.

---

## Padrao 1: Clone como Especialista no CrewAI

O padrao mais simples — o clone e um "agent" dentro de uma crew:

```python
from crewai import Agent, Task, Crew

clone_hormozi = Agent(
    role="Alex Hormozi Clone — Offer Creation Expert",
    goal="Analyze and create high-value offers using Hormozi's documented methodology",
    backstory="""
    You are a cognitive clone of Alex Hormozi, with 88% confidence score (Tier 3).
    Your expertise is in offer creation, business acquisition, and scaling.
    Core principle: 'The value equation determines everything about an offer.'
    You speak directly, use simple language, and always quantify.
    You decline to advise on: accounting, legal matters, technical implementation.
    Based on documented sources: DotCom Secrets, Expert Secrets, $100M Offers, podcasts.
    """,
    verbose=True,
    allow_delegation=False  # Clone nao delega — ele e o especialista
)

task_offer_review = Task(
    description="Review this offer and improve it using Alex Hormozi's documented methodology",
    agent=clone_hormozi,
    expected_output="Revised offer with rationale based on documented Hormozi principles"
)
```

### Regras para Clone em CrewAI

1. **allow_delegation=False:** Clone e especialista terminal, nao orquestrador
2. **backstory inclui confidence score:** Transparencia sobre qualidade
3. **backstory inclui failure modes:** "You decline to advise on X"
4. **backstory inclui fonte:** "Based on documented sources: ..."
5. **Nome do role menciona "Clone":** Deixa claro que e representacao

---

## Padrao 2: Clone como Node no LangGraph

Para fluxos mais complexos com state management:

```python
from langgraph.graph import StateGraph, State
from typing import TypedDict

class CloningState(TypedDict):
    query: str
    clone_response: str
    confidence_used: float
    sources_activated: list[str]

def hormozi_clone_node(state: CloningState) -> CloningState:
    """
    Node que implementa o clone Hormozi.
    Carrega memory WARM sob demanda baseado na query.
    """
    # Retrieval WARM para a query especifica
    relevant_kbs = retrieve_warm_memory(
        query=state["query"],
        clone_id="alex-hormozi",
        top_k=3
    )
    
    # Montar contexto: HOT (always) + WARM (retrieved)
    system_prompt = build_clone_context(
        hot_memory=HORMOZI_HOT_MEMORY,  # Sempre carregado
        warm_memory=relevant_kbs
    )
    
    response = claude_invoke(
        system=system_prompt,
        message=state["query"]
    )
    
    return {
        **state,
        "clone_response": response,
        "confidence_used": 0.88,
        "sources_activated": [kb.name for kb in relevant_kbs]
    }

# Construir o grafo
workflow = StateGraph(CloningState)
workflow.add_node("hormozi_clone", hormozi_clone_node)
workflow.add_node("quality_validator", validate_clone_output)
workflow.add_edge("hormozi_clone", "quality_validator")
```

### Vantagens do LangGraph para Clones

- **Traceable:** Cada decisao do clone e rastreavel no grafo
- **Interruptible:** Pode pausar para revisao humana em pontos criticos
- **State management:** Mantém contexto entre multiplos turnos
- **Conditional routing:** Pode rotear para clone diferente baseado no topico

---

## Padrao 3: Clone como Subagente no Claude Agent SDK

Para integracao nativa com Claude Code e ecossistema Anthropic:

```markdown
# Agent Definition: clone-{source-mind}

---
name: clone-alex-hormozi
description: >
  Cognitive clone of Alex Hormozi (88% confidence, Tier 3).
  Specialist in offer creation, business acquisition, and scaling.
  Use when: offer analysis, pricing strategy, business growth.
model: claude-sonnet-4-6
tools:
  - Read  # Para acessar KBs
allowed_tools: Read
---

You are a cognitive clone of Alex Hormozi...
{system prompt completo do agent.md}
```

```python
# Invocacao via Claude Agent SDK
import anthropic

client = anthropic.Anthropic()

# Carregar o clone como subagente
result = client.agents.run(
    agent_id="clone-alex-hormozi",
    messages=[{"role": "user", "content": "Analise esta oferta..."}]
)
```

---

## Padrao 4: Multi-Clone Panel (Debate de Perspectivas)

Padrao avancado: multiplos clones debatem um problema:

```python
from crewai import Agent, Task, Crew, Process

# Definir 3 clones com perspectivas diferentes
hormozi_clone = Agent(
    role="Alex Hormozi Clone — Offer & Scale Expert",
    backstory="...",
    allow_delegation=False
)

brunson_clone = Agent(
    role="Russell Brunson Clone — Funnel & Persuasion Expert",
    backstory="...",
    allow_delegation=False
)

halbert_clone = Agent(
    role="Gary Halbert Clone — Direct Response Copywriting Expert",
    backstory="...",
    allow_delegation=False
)

synthesizer = Agent(
    role="Synthesis Agent",
    goal="Identify common ground and unique insights from multiple perspectives",
    backstory="You synthesize diverse expert perspectives without bias",
    allow_delegation=False
)

tasks = [
    Task(
        description="Analyze this marketing campaign from your documented perspective",
        agent=hormozi_clone
    ),
    Task(
        description="Analyze this marketing campaign from your documented perspective",
        agent=brunson_clone
    ),
    Task(
        description="Analyze this marketing campaign from your documented perspective",
        agent=halbert_clone
    ),
    Task(
        description="Synthesize the three perspectives into actionable recommendations",
        agent=synthesizer,
        context=[task1, task2, task3]  # Recebe outputs dos outros
    )
]

panel = Crew(
    agents=[hormozi_clone, brunson_clone, halbert_clone, synthesizer],
    tasks=tasks,
    process=Process.sequential
)
```

### Quando Usar Multi-Clone Panel

- Decisoes estratégicas onde perspectivas diferentes agregam valor
- Criacao de conteudo que precisa de "best of all worlds"
- Auditoria de estratégias (cada clone testa sua lente)
- Treinamento/educacao (ver como diferentes experts abordam o mesmo problema)

**Limitacao:** O custo aumenta linearmente com o numero de clones. Para
producao, usar apenas quando o valor adicional justifica o custo.

---

## Padrao 5: Clone com Memory Persistente (Letta/MemGPT)

Para clones que precisam lembrar de interacoes anteriores:

```python
from letta import create_client

client = create_client()

# Criar agente com memoria persistente
clone_agent = client.create_agent(
    name="clone-alex-hormozi",
    memory=ChatMemory(
        human="User building a SaaS product",
        persona="You are a cognitive clone of Alex Hormozi..."
    ),
    system=HORMOZI_SYSTEM_PROMPT,
    tools=["core_memory_append", "core_memory_replace", "archival_memory_search"]
)

# Interagir — o clone lembra de conversas anteriores
response_1 = client.send_message(
    agent_id=clone_agent.id,
    message="Meu produto atual e X com preco Y"
)

# Em sessao futura, o clone lembra do contexto
response_2 = client.send_message(
    agent_id=clone_agent.id,
    message="Devo mudar o preco?"
    # Clone lembra: "produto X com preco Y" da sessao anterior
)
```

### Quando Usar Memory Persistente

- Clone que atua como consultor recorrente para o mesmo usuario/empresa
- Quando o contexto acumula ao longo de semanas/meses
- Quando o clone precisa "aprender" sobre o contexto especifico do usuario

**Atencao:** Memory persistente aumenta complexidade e custo. Usar apenas quando
o beneficio de lembrar o contexto e claro e recorrente.

---

## Governance de Clones em Sistemas Multi-Agente

### Regras de Autoridade

| Operacao | Clone pode fazer? | Notas |
|---------|-------------------|-------|
| Responder perguntas no dominio | Sim | Dentro de confidence score |
| Dar recomendacoes | Sim, com contextualizacao | "Baseado no que [nome] documentou..." |
| Executar acoes (codigo, escrita) | Sim, se ferramentas permitidas | Depende de `allowed_tools` |
| Apresentar-se como a pessoa real | NAO | Sempre como "clone cognitivo" |
| Opinar em areas fora do dominio | Com disclaimer | Marcar como fora do escopo |
| Criar conteudo "no nome de" sem supervisao | Nao recomendado | Ver ethical-guidelines.md |

### Handoff Protocol para Clones

Quando o clone recebe uma pergunta fora do seu dominio:

```
Resposta padrao:
"Isso esta alem do que {Nome} documenta extensivamente.
Baseado nas suas fontes, o mais proximo que posso chegar e [X].
Para conselho especializado em [area], recomendo [recurso]."
```

---

## Metricas de Performance em Producao

| Metrica | Meta | Alertar se |
|---------|------|-----------|
| Clone activation rate | > 80% das perguntas no dominio | < 60% |
| Out-of-domain rate | < 15% das respostas | > 25% |
| Confidence tag compliance | 100% das extracoes tagadas | < 95% |
| Fidelity score (por sampling) | >= 70% | < 55% |
| Boundary violation rate | < 2% | > 5% |

Ver tambem: `memory-architecture-for-clones.md` para como estruturar a memoria.
Ver tambem: `clone-quality-assurance.md` para validacao de fidelidade.
Ver tambem: `ethical-guidelines.md` para uso etico em sistemas automatizados.
