---
task: triage-content-requests
responsavel: "@content-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Triage Content Requests

> Priorizar e distribuir requests de conteudo que chegam ao pipeline.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-orqx (Nexus) |
| **Co-agents** | editorial-strategist (North) |
| **Trigger** | Novo request de conteudo (interno ou externo) |
| **Input** | Request com descricao, urgencia e contexto |
| **Output** | Request classificado, priorizado e encaminhado |
| **Handoff** | → content-engineer (Arc) ou editorial-strategist (North) |
| **Complexity** | simple |

---

## Fundamentacao

Requests de conteudo chegam de multiplas fontes (cliente, vendas, marketing, sinais do Radar). Sem triage, tudo parece urgente e nada e priorizado. Triage sistematico garante que recursos sao alocados por impacto, nao por volume de pedidos.

---

## Steps

### Step 1: Classificar Request

- Tipo: novo conteudo, adaptacao, urgente (sinal HOT), revisao
- Formato: carrossel, post, video, blog, newsletter, thread
- Plataforma: Instagram, LinkedIn, TikTok, blog, etc.

### Step 2: Verificar Pre-Requisitos

- Existe Espinha Dorsal para o tema? Se nao: acionar Arc
- Existe template contract para o formato? Se nao: acionar Morph
- Brand guidelines disponiveis? Se nao: acionar coordinate-cross-squad

### Step 3: Priorizar

Matriz impacto × urgencia:
- P1 (urgente + alto impacto): fazer agora
- P2 (alto impacto + nao urgente): sprint atual
- P3 (medio impacto): proximo sprint
- P4 (baixo impacto): backlog

### Step 4: Encaminhar

- P1: direto para Arc (fast-track)
- P2-P3: adicionar ao backlog de North para sprint planning
- P4: documentar no backlog para priorizacao futura

### Step 5: Handoff

```yaml
handoff:
  artifact: "triage-log-{date}.md"
  context: "Request triado como P{N}, encaminhado para {agent}"
  next: "content-engineer (Arc) ou editorial-strategist (North)"
```
