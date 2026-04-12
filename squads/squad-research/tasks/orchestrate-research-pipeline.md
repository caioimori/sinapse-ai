---
task: orchestrate-research-pipeline
responsavel: "@research-orqx"
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

# Task: Orchestrate Research Pipeline

## Metadata
- **Squad:** squad-research
- **Agent:** research-orqx (Prism)
- **Complexity:** COMPLEX
- **Depends on:** triage-research-request
- **Feeds:** Todos os agentes downstream

## Objetivo
Orquestrar o pipeline completo de pesquisa desde a demanda ate a entrega final, garantindo nivel de profundidade correto, agente adequado e quality gates cumpridos.

## Entrada
- Demanda de pesquisa (interna ou cross-squad)
- Contexto: pergunta, objetivo, urgencia, stakeholder

## Passos

### 1. Intake & Classificacao
- Receber demanda via triage ou diretamente
- Validar: pergunta e clara e investigavel?
- Classificar no Research Depth Pyramid:
  - **SCAN**: 15-30 min, 2-3 fontes, resumo 1 pag
  - **ANALYZE**: 1-3h, 5-8 fontes, report 3-5 pags
  - **DEEP DIVE**: 4-8h, 10-15 fontes, dossie 10-20 pags
  - **DEFINITIVE**: Multi-dia, 20+ fontes, pesquisa 30+ pags

### 2. Atribuicao de Agente
- Mapear natureza da pesquisa ao agente correto:
  - Pesquisa multi-fonte generica → Sage
  - Audiencia, persona, JTBD → Pulse
  - Competidores, landscape → Hawk
  - Mercado, sizing, industria → Scope
  - Tendencias, cenarios, futuro → Horizon
- Se pesquisa envolve 2+ dominios: definir agente lead + supporting

### 3. Criacao de Research Brief
- Preencher research-brief-template com:
  - Pergunta central + sub-perguntas
  - Nivel de profundidade (Pyramid)
  - Fontes sugeridas (por tier)
  - Formato de entrega esperado
  - Deadline
  - Stakeholder e uso pretendido do output

### 4. Execucao & Monitoring
- Atribuir brief ao agente
- Checkpoints de progresso (daily para DEEP DIVE+)
- Intervir se: prazo em risco, escopo inflando, bloqueio

### 5. Quality Gate Pre-Entrega
- Aplicar research-quality-checklist:
  - Pergunta original respondida?
  - Fontes classificadas (Source Credibility Matrix)?
  - Insights cristalizados (FINDING + IMPLICATION + RECOMMENDATION)?
  - Limitacoes declaradas?
  - Formato adequado ao nivel?

### 6. Entrega & Routing
- Se entrega interna: encaminhar para Loom sintetizar (se necessario)
- Se entrega cross-squad: aplicar cross-squad delivery protocol
- Confirmar recebimento com stakeholder
- Registrar pesquisa no research repository

## Saida
- Pipeline gerenciado end-to-end
- Research brief preenchido
- Quality gate aplicado
- Pesquisa entregue ao stakeholder correto

## Validacao
- [ ] Demanda classificada no Pyramid
- [ ] Agente correto atribuido
- [ ] Brief completo preenchido
- [ ] Quality checklist aplicado
- [ ] Stakeholder confirmou recebimento

## Handoffs
```yaml
handoff:
  internal:
    - to: "deep-researcher (Sage)"
      when: "Pesquisa multi-fonte profunda"
      artifact: "research-brief preenchido"
    - to: "audience-intelligence (Pulse)"
      when: "Pesquisa de audiencia/persona"
      artifact: "research-brief preenchido"
    - to: "competitive-intelligence (Hawk)"
      when: "Analise competitiva"
      artifact: "research-brief preenchido"
    - to: "market-analyst (Scope)"
      when: "Market analysis/sizing"
      artifact: "research-brief preenchido"
    - to: "trend-forecaster (Horizon)"
      when: "Trend/scenario analysis"
      artifact: "research-brief preenchido"
    - to: "data-synthesizer (Loom)"
      when: "Sintese final necessaria"
      artifact: "pesquisas individuais completadas"
  cross_squad:
    - to: "content-intelligence/Nexus"
      when: "Insights para planejamento editorial"
      artifact: "research report formatado"
    - to: "brand-system/Meridian"
      when: "Insights de posicionamento"
      artifact: "competitive/market analysis"
```

---

*Task operada por: research-orqx (Prism)*
