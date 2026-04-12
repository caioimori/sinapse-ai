---
task: map-audience-journey
responsavel: "@audience-intelligence"
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

# Task: Map Audience Journey

## Metadata
- **Squad:** squad-research
- **Agent:** audience-intelligence (Pulse)
- **Complexity:** COMPLEX
- **Depends on:** build-audience-persona
- **Feeds:** content-intelligence/North, digital-experience, commercial-systems

## Objetivo
Mapear jornada completa da audiencia desde o primeiro contato ate advocacy, identificando touchpoints, emocoes, pain points e momentos decisivos.

## Entrada
- Persona(s) construida(s)
- Dados de touchpoints (analytics, CRM, heatmaps)
- Contexto: produto/servico, canais ativos

## Passos

### 1. Definir Stages da Jornada
- **Awareness:** Descoberta do problema/necessidade
- **Consideration:** Pesquisa de solucoes
- **Decision:** Escolha e compra
- **Onboarding:** Primeiras experiencias
- **Retention:** Uso recorrente e valor percebido
- **Advocacy:** Recomendacao e defesa

### 2. Para Cada Stage — Mapear
- **Acoes:** O que a pessoa FAZ neste stage?
- **Touchpoints:** Onde interage com a marca? (site, social, email, vendas)
- **Pensamentos:** O que esta pensando? Que perguntas tem?
- **Emocoes:** Como se sente? (ansioso, empolgado, confuso, confiante)
- **Pain Points:** O que frustra ou atrapalha neste stage?
- **Oportunidades:** O que podemos fazer para melhorar a experiencia?

### 3. Identificar Moments of Truth
- **Primeiro momento:** O que faz a pessoa notar a marca pela primeira vez?
- **Momento de consideracao:** O que a convence a avaliar seriamente?
- **Momento de decisao:** O que faz escolher NOS (vs competidor)?
- **Momento de verdade:** Primeira experiencia real — confirma ou frustra?
- **Momento de advocacy:** O que a faz recomendar espontaneamente?

### 4. Gap Analysis
- Onde a experiencia real NAO corresponde a expectativa?
- Onde perdemos pessoas (drop-offs)?
- Onde a competicao oferece experiencia superior?
- Onde ha friccao desnecessaria?

### 5. Priorizacao de Melhorias
- Ranquear gaps por: impacto no negocio × facilidade de resolver
- Quick wins (alto impacto + facil)
- Strategic investments (alto impacto + complexo)
- Nice to haves (baixo impacto)

### 6. Visualizacao
- Mapa visual com lanes (acoes, pensamentos, emocoes, pain points)
- Curva emocional (altos e baixos da jornada)
- Marcacao de moments of truth
- Marcacao de oportunidades

## Saida
- Journey map visual completo
- Moments of truth identificados
- Gap analysis com priorizacao
- Recomendacoes de melhoria priorizadas

## Validacao
- [ ] Todos os stages mapeados
- [ ] Touchpoints reais identificados (nao hipoteticos)
- [ ] Moments of truth definidos
- [ ] Gaps priorizados por impacto × facilidade
- [ ] Visualizacao criada

## Handoffs
```yaml
handoff:
  cross_squad:
    - to: "content-intelligence/North"
      artifact: "journey map, perguntas por stage"
      context: "Para alinhar conteudo ao stage correto do funil"
    - to: "digital-experience/orchestrator"
      artifact: "journey map, pain points digitais"
      context: "Para otimizar touchpoints digitais"
    - to: "commercial-systems/orchestrator"
      artifact: "moments of truth de decisao, objecoes por stage"
      context: "Para alinhar processo de vendas a jornada real"
```

---

*Task operada por: audience-intelligence (Pulse)*
