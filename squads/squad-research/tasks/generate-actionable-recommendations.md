---
task: generate-actionable-recommendations
responsavel: "@data-synthesizer"
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

# Task: Generate Actionable Recommendations

## Metadata
- **Squad:** squad-research
- **Agent:** data-synthesizer (Loom)
- **Complexity:** STANDARD
- **Depends on:** sintese de pesquisa completada
- **Feeds:** todos os squads, @project-lead, @architect

## Objetivo
Transformar insights de pesquisa em recomendacoes priorizadas e actionable — cada recomendacao com owner, timeline, metricas e criterios SMART.

## Entrada
- Insights cristalizados (FINDING + IMPLICATION + RECOMMENDATION)
- Contexto estrategico e restricoes do negocio
- Recursos disponiveis (budget, time, team)

## Passos

### 1. Extrair Recomendacoes Brutas
- Coletar todas as recomendacoes dos insights cristalizados
- Remover duplicatas e consolidar similares
- Categorizar: produto, marketing, vendas, operacoes, tecnologia
- Total esperado: 15-30 recomendacoes brutas

### 2. Aplicar Criterios SMART
Para cada recomendacao, reformular como:
- **Specific:** O que exatamente fazer?
- **Measurable:** Como medir sucesso?
- **Achievable:** E viavel com recursos atuais?
- **Relevant:** Alinha com estrategia do negocio?
- **Time-bound:** Ate quando?
- Descartar recomendacoes que nao passam no filtro SMART

### 3. Priorizar com Impact × Feasibility Matrix

| | Alta Feasibility | Baixa Feasibility |
|---|:---:|:---:|
| **Alto Impact** | DO FIRST (Quick Wins) | PLAN (Strategic Bets) |
| **Baixo Impact** | DO LATER (Fill-ins) | DON'T DO (Time Sinks) |

- Impact (1-5): revenue potential, market share, diferenciacao
- Feasibility (1-5): custo, complexidade, dependencies, risk
- Plot cada recomendacao na matriz

### 4. Definir Ownership e Timeline
Para cada recomendacao no quadrante DO FIRST e PLAN:
- **Owner:** Quem lidera a execucao?
- **Squad:** Qual squad recebe?
- **Timeline:** Start date e deadline
- **Dependencies:** Pre-requisitos
- **Investment:** Budget estimado
- **Success metrics:** KPIs especificos
- **Risk:** O que pode dar errado + mitigacao

### 5. Criar Roadmap de Implementacao
- **Immediate (0-30 dias):** Quick wins de alto impacto
- **Short-term (1-3 meses):** Iniciativas com setup moderado
- **Medium-term (3-6 meses):** Strategic bets com planejamento
- **Long-term (6-12 meses):** Transformacoes estruturais
- Sequenciar considerando dependencies

## Cross-Squad Handoffs
```yaml
handoffs:
  - to: product-systems
    delivers: recomendacoes de produto priorizadas
    format: lista SMART com evidence
  - to: commercial-systems
    delivers: recomendacoes de GTM e pricing
    format: action items com metricas
  - to: growth-analytics
    delivers: KPIs e metricas de sucesso
    format: dashboard specs
```

## Cross-Squad Handoff
```yaml
handoff:
  to_agent: "@project-lead"
  command: "*task create-roadmap"
  context: "Recomendacoes priorizadas com SMART criteria"
```

## Saida
- Lista de recomendacoes SMART priorizadas
- Impact × Feasibility matrix visual
- Ownership e timeline definidos
- Roadmap de implementacao (4 horizontes)

## Validacao
- [ ] Recomendacoes passam filtro SMART
- [ ] Priorizadas na matrix impact × feasibility
- [ ] Owner e timeline definidos para top priorities
- [ ] Roadmap com 4 horizontes temporais
- [ ] Metricas de sucesso definidas
- [ ] Cross-squad handoffs formatados

---

*Task operada por: data-synthesizer (Loom)*
