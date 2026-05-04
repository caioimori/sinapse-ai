# Cross-Squad Integration Protocol

## Inbound Requests (Recebendo de Outros Squads)

### Formato de Request
```yaml
research_request:
  from_squad: [nome do squad]
  requester: [agente]
  type: [ad-hoc | sprint-task | strategic]
  question: [pergunta clara]
  context: [por que precisa disso]
  depth: [SCAN | ANALYZE | DEEP DIVE | DEFINITIVE]
  deadline: [data]
  output_format: [brief | report | data | deck]
```

### Priorizacao de Requests
1. **P0 (Urgente):** Bloqueia decisao critica, deadline <48h
2. **P1 (Alta):** Impacta sprint ativo, deadline <1 semana
3. **P2 (Media):** Planejamento futuro, deadline <2 semanas
4. **P3 (Baixa):** Nice to have, sem deadline rigido

### SLA por Prioridade
- P0: Resposta em 4h, entrega em 24h (SCAN ou ANALYZE)
- P1: Resposta em 24h, entrega em 3-5 dias
- P2: Resposta em 48h, entrega em 1-2 semanas
- P3: Backlog, entrega quando possivel

## Outbound Deliverables (Entregando para Outros Squads)

### brand-system
- **Precisa de:** Personas com valores e arquetipos, insights culturais, posicionamento competitivo
- **Formato:** Persona cards + psychographic summary + competitive positioning map
- **Agentes que recebem:** Meridian (orchestrator), Prism (brand strategist)

### content-intelligence
- **Precisa de:** Topicos prioritarios, dados de audiencia, tendencias de busca
- **Formato:** Topic list com volume/relevancia + audience preference matrix
- **Agentes que recebem:** Nexus (orchestrator), Radar (trend detector)

### copywriting-persuasion
- **Precisa de:** Pain points, JTBD, gatilhos emocionais, objecoes
- **Formato:** Messaging framework inputs + objection handling guide
- **Agentes que recebem:** Voice strategist, persuasion architect

### digital-experience
- **Precisa de:** Journey maps, behavior data, tech trends, UX benchmarks
- **Formato:** Journey maps + touchpoint data + UX trend brief
- **Agentes que recebem:** UX researcher, experience architect

### growth-analytics
- **Precisa de:** TAM/SAM/SOM, segments, growth rates, conversion benchmarks
- **Formato:** Data tables + projections + benchmark report
- **Agentes que recebem:** Growth strategist, data analyst

### commercial-systems
- **Precisa de:** Battle cards, pricing data, market sizing, ICP
- **Formato:** Sales enablement package (battle cards + pricing comparison + ICP scorecard)
- **Agentes que recebem:** Sales strategist, pricing analyst

### product-systems
- **Precisa de:** Market gaps, opportunities, tech radar, unmet needs
- **Formato:** Opportunity cards + tech radar + competitive feature matrix
- **Agentes que recebem:** Product strategist, feature analyst

## Handoff Artifact Format

```yaml
research_handoff:
  id: RH-{YYYY}-{NNN}
  from: squad-research
  from_agent: [agent name (persona)]
  to: [squad destino]
  to_agent: [agent destino]
  date: [YYYY-MM-DD]
  type: [personas | market-data | competitive-intel | trends | report]
  deliverables:
    - name: [nome do deliverable]
      format: [md | yaml | csv | pdf]
      path: [caminho do arquivo]
  summary: [1-2 frases do que esta sendo entregue]
  confidence: [HIGH | MEDIUM | LOW]
  freshness: [data da pesquisa mais recente]
  next_refresh: [quando deve ser atualizado]
```

## Quality Standards para Deliverables Cross-Squad
1. Todo deliverable deve ter confidence level
2. Todo dado deve ter fonte e data
3. Insights devem seguir FINDING + IMPLICATION + RECOMMENDATION
4. Formato deve ser o esperado pelo squad destino
5. Freshness declarada (quando os dados foram coletados)

## Feedback Loop
- Squads receptores podem solicitar revisoes
- Formato: "Request clarification on [item] because [reason]"
- SLA para revisao: 48h
- Se feedback muda conclusao → notificar TODOS os squads que receberam o deliverable original

---

*Knowledge base da squad-research*
