---
task: diagnose-and-route
responsavel: "@sinapse-master"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: user_request
    tipo: string
    origem: "user input"
    obrigatorio: true

Saida:
  - campo: routing_decision
    tipo: document
    destino: "squad orchestrator"

Checklist:
  - "[ ] Analisar request do usuario"
  - "[ ] Classificar dominio(s) envolvido(s)"
  - "[ ] Resolver ambiguidades"
  - "[ ] Gerar routing decision com invocation command"
---

# Task: Diagnose and Route

## Metadata
- **Squad:** squad-sinapse
- **Agent:** Imperator (sinapse-master)
- **Complexity:** Standard

## Objetivo
Analisar qualquer request do usuario, identificar qual(is) squad(s) deve(m) tratar, e rotear com contexto estruturado. Esta e a task mais executada do Imperator — todo pedido passa por aqui primeiro.

## Entrada
- User request (texto livre)
- Optional: context about current project or ongoing work

## Passos

### 1. Request Analysis
Extrair do pedido:
- **Intent:** O que o usuario quer alcançar?
- **Domain signals:** Quais palavras-chave indicam o dominio?
- **Complexity:** Single-squad ou multi-squad?
- **Urgency:** Implied timeline?

### 2. Domain Classification

Mapear contra a routing table:

| Dominio | Squad | Prefix | Orchestrator | Invocacao |
|---------|-------|--------|-------------|-----------|
| Branding/identidade | brand-system | brand | Meridian | `/brand:agents:brand-orchestrator` |
| Vendas/CRM/pipeline | commercial-systems | commercial | Pipeline | `/commercial:agents:cs-orchestrator` |
| Conteudo/editorial | content-intelligence | content | content-orchestrator | `/content:agents:content-orchestrator` |
| Copywriting/persuasao | copywriting-persuasion | copywriting | Quill | `/copywriting:agents:copy-strategist` |
| Animacoes/Three.js | creative-animations | ca | Kinetic | `/ca:agents:ca-orchestrator` |
| UX/UI/experiencia | digital-experience | digital-experience | Nexus | `/digital-experience:agents:dx-orchestrator` |
| Financeiro/pricing | financial-intelligence | finance | Ledger | `/finance:agents:fi-orchestrator` |
| Growth/SEO/analytics | growth-analytics | growth | Catalyst | `/growth:agents:ga-orchestrator` |
| Midia paga/ads | paid-media | pm | Apex | `/pm:agents:pm-orchestrator` |
| Produto/discovery | product-systems | product | Vector | `/product:agents:ps-orchestrator` |
| Pesquisa/competitivo | research-intelligence | research | Prism | `/research:agents:research-orchestrator` |
| Claude Code/prompts | claude-mastery | claude | Orion | `/claude:agents:cm-orchestrator` |
| Estrategia/advisory | strategic-council | council | Zenith | `/council:agents:council-orchestrator` |
| Narrativa/pitch | narrative-masters | narrative | Arc | `/narrative:agents:narrative-orchestrator` |
| Seguranca/compliance | cyber-defense | cyber | Fortress | `/cyber:agents:cyber-orchestrator` |

### 3. Ambiguity Resolution

Se o dominio nao e claro, aplicar regras de desambiguacao:

| Sinal Ambiguo | Pergunta Clarificadora |
|---------------|----------------------|
| "Copy para ads" | "Voce precisa escrever o texto do anuncio (copywriting) ou gerenciar a campanha de midia paga (paid-media)?" |
| "Design system" | "E para a marca (brand-system) ou para o produto digital (digital-experience)?" |
| "Metricas" | "Metricas de growth organico, midia paga, ou financeiras?" |
| "Pesquisa" | "Pesquisa de mercado/competitiva (research) ou pesquisa com usuarios (product/UX)?" |
| "Pricing" | "Modelagem de precos/oferta (commercial) ou analise financeira de pricing (finance)?" |
| "Storytelling" | "Historia da marca (brand), pitch/apresentacao (narrative), ou conteudo (content)?" |

**Regra:** No maximo 1 pergunta clarificadora. Se 2+ dominios sao igualmente provaveis, apresentar ambos e deixar o usuario escolher.

### 4. Routing Decision

Gerar output estruturado:

```
ROUTING DECISION
================
Request: {resumo do pedido}
Domain: {dominio primario}
Squad: squad-{name}
Orchestrator: {name} ({codename})
Invocation: /{prefix}:agents:{orchestrator-id}

Context for Squad:
- Objective: {o que o usuario quer}
- Constraints: {restricoes mencionadas}
- Expected Output: {tipo de entrega esperada}

Confidence: High / Medium / Low
Rationale: {por que esta squad}
```

### 5. Multi-Squad Detection

Se 2+ squads sao necessarias:
- Listar todas as squads envolvidas
- Indicar que a task `compose-multi-squad-plan` deve ser executada
- Nao rotear para squad individual ate o plano estar pronto

## Saida
- Routing decision document
- Invocation command para o usuario
- Context summary para o squad orchestrator
- Flag se multi-squad plan e necessario

## Validacao
- [ ] Request analisado com intent claro
- [ ] Squad identificada com confianca >= Medium
- [ ] Invocation command fornecido
- [ ] Context para squad structurado
- [ ] Ambiguidades resolvidas (ou pergunta feita)
