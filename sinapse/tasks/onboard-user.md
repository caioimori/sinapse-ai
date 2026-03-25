---
task: onboard-user
responsavel: "@sinapse-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: user_context
    tipo: object
    origem: "user input"
    obrigatorio: false

Saida:
  - campo: onboarding_guide
    tipo: document
    destino: "user"

Checklist:
  - "[ ] Entender o perfil do usuario"
  - "[ ] Apresentar o ecossistema"
  - "[ ] Recomendar squads relevantes"
  - "[ ] Fornecer quick-start commands"
---

# Task: Onboard User

## Metadata
- **Squad:** squad-sinapse
- **Agent:** Imperator (sinapse-orqx)
- **Complexity:** Simple

## Objetivo
Guiar um novo usuario pelo ecossistema Sinapse, ajudando-o a entender o que esta disponivel, qual squad e mais relevante para suas necessidades, e como comecar a usar.

## Entrada
- User background (opcional): tipo de negocio, industria, goals
- Focus area (opcional): se o usuario ja sabe o dominio de interesse

## Passos

### 1. Welcome & Discovery

Se o usuario nao forneceu contexto:

```
BEM-VINDO AO SINAPSE
==========================

Eu sou o Imperator, o Sinapse Master. Coordeno 15 squads especializadas com
127+ agentes de IA e 965+ tasks prontas para usar.

Para te direcionar ao melhor especialista, preciso entender:

1. Qual e o seu negocio/projeto?
2. Qual e o seu objetivo principal agora?
3. Em que fase esta? (ideia, construcao, crescimento, otimizacao)
```

### 2. Profile Classification

Classificar o usuario em um perfil:

| Perfil | Squads Prioritarias | Primeira Acao |
|--------|-------------------|--------------|
| Founder pre-launch | strategic-council, product-systems, brand-system | Strategic vision |
| Founder building | product-systems, digital-experience, brand-system | Product development |
| Founder growing | growth-analytics, paid-media, commercial-systems | Growth engine |
| Marketer | content-intelligence, copywriting-persuasion, paid-media | Content strategy |
| Designer | brand-system, digital-experience, creative-animations | Design system |
| Developer | claude-mastery, creative-animations, digital-experience | Claude mastery |
| Sales/Revenue | commercial-systems, financial-intelligence | Revenue architecture |
| Strategist | strategic-council, research-intelligence | Strategic counsel |
| Security-focused | cyber-defense | Security audit |

### 3. Personalized Guide

```
SEU GUIA PERSONALIZADO
======================

Com base no seu perfil ({perfil}), recomendo comecar por:

TOP 3 SQUADS PARA VOCE:

1. {squad 1} — {por que e relevante}
   Invoke: /{prefix}:agents:{orchestrator}
   Start with: {task recomendada}

2. {squad 2} — {por que e relevante}
   Invoke: /{prefix}:agents:{orchestrator}
   Start with: {task recomendada}

3. {squad 3} — {por que e relevante}
   Invoke: /{prefix}:agents:{orchestrator}
   Start with: {task recomendada}

QUICK START:
- Para comecar imediatamente: invoke a squad #1 acima
- Para uma visao estrategica: /council:agents:council-orqx
- Para ver tudo disponivel: *status
- Para qualquer duvida: fale comigo (Imperator)
```

### 4. Ecosystem Map (condensed)

```
O QUE CADA SQUAD FAZ:

ESTRATEGIA          → strategic-council (10 advisors de classe mundial)
PESQUISA            → research-intelligence (inteligencia competitiva)
MARCA               → brand-system (identidade visual completa)
PRODUTO             → product-systems (discovery a delivery)
UX/UI               → digital-experience (experiencia digital)
CONTEUDO            → content-intelligence (estrategia editorial)
COPY                → copywriting-persuasion (textos que convertem)
ANIMACOES           → creative-animations (Three.js, shaders, motion)
NARRATIVA           → narrative-masters (storytelling e pitch)
GROWTH              → growth-analytics (SEO, analytics, organico)
MIDIA PAGA          → paid-media (Meta, Google, TikTok, LinkedIn)
COMERCIAL           → commercial-systems (vendas, CRM, pipeline)
FINANCEIRO          → financial-intelligence (pricing, P&L, budget)
SEGURANCA           → cyber-defense (compliance, pentest)
CLAUDE CODE         → claude-mastery (automacao, prompt engineering)
```

### 5. Follow-up

Oferecer proximos passos:
- "Quer que eu te direcione para uma squad agora?"
- "Quer um strategic brief sobre o seu negocio?"
- "Quer ver todas as tasks disponiveis de uma squad especifica?"

## Saida
- Personalized onboarding guide
- Top 3 squad recommendations with invocation commands
- Ecosystem overview condensado
- Quick start instructions

## Validacao
- [ ] Perfil do usuario identificado
- [ ] Squads recomendadas sao relevantes para o perfil
- [ ] Invocation commands fornecidos e corretos
- [ ] Linguagem clara e acolhedora
- [ ] Proximos passos oferecidos
