---
task: orchestrate-campaign-launch
responsavel: "@paidmedia-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: campaign_brief
    tipo: document
    origem: "cliente ou stakeholder"
    obrigatorio: true
  - campo: budget_total
    tipo: number
    origem: "cliente"
    obrigatorio: true
  - campo: objetivos
    tipo: list
    origem: "cliente"
    obrigatorio: true

Saida:
  - campo: campaign_plan
    tipo: document
    destino: "agentes especializados"

Checklist:
  - "[ ] Brief decomposto em tasks por agente"
  - "[ ] Budget alocado por canal"
  - "[ ] Timeline definido com milestones"
  - "[ ] Tracking validado por Lighthouse"
  - "[ ] Criativos aprovados por Canvas"
  - "[ ] Landing pages validadas por Convert"
---

# Task: Orchestrate Campaign Launch

## Metadata
- **Agent:** paidmedia-orqx (Apex)
- **Squad:** squad-paidmedia
- **Complexity:** HIGH

## Objetivo
Coordenar lancamento completo de campanha cross-channel, desde o brief ate o go-live, garantindo que todos os agentes entreguem suas partes no prazo e com qualidade.

## Inputs
- Brief de campanha (objetivo, publico, budget, timeline)
- Metas de negocio (CPA target, ROAS target, volume target)
- Assets disponiveis (criativos, landing pages, tracking)

## Steps

1. **Analisar brief e definir estrategia cross-channel**
   - Identificar objetivo primario (awareness, consideration, conversion)
   - Determinar mix de canais (Meta % vs Google % vs outros %)
   - Definir KPIs primarios e secundarios por canal

2. **Alocar budget por canal e tier**
   - Usar dados historicos de CPA/ROAS por canal (se disponiveis)
   - Se conta nova: split 60% Meta / 40% Google (ajustar por vertical)
   - Definir budget por tier: Cold 60% / Warm 25% / Hot 15%

3. **Delegar tasks para agentes especializados**
   - Signal: campaign structure + audience architecture (Meta)
   - Query: campaign structure + keyword portfolio (Google)
   - Canvas: creative brief + producao de criativos
   - Convert: landing page audit + otimizacao
   - Lighthouse: tracking setup + validation

4. **Definir timeline com milestones**
   - D-14: Brief aprovado, tracking setup iniciado
   - D-10: Criativos em producao, LP em otimizacao
   - D-7: Criativos entregues, LP otimizada
   - D-3: Campaigns configuradas, tracking validado
   - D-1: Pre-launch checklist completo
   - D0: Launch
   - D+3: First optimization review
   - D+7: Week 1 report

5. **Validar pre-launch checklist**
   - Executar campaign-launch-checklist completo
   - Gate: TODOS os items devem ser checked

6. **Launch e monitoramento inicial**
   - Ativar campanhas conforme timeline
   - Monitorar primeiras 24h (delivery, spend, CPM, CTR)
   - Pulse gera first-day report

## Output
Documento `campaign-launch-plan.md` contendo:
- Estrategia cross-channel
- Alocacao de budget por canal/tier
- Timeline com milestones
- Task assignments por agente
- Pre-launch checklist status
- KPIs e targets por canal

## Quality Gates
- [ ] Todos os canais tem tracking validado
- [ ] Budget alocado com justificativa de dados
- [ ] Criativos aprovados e specs corretos por plataforma
- [ ] Landing pages com score >80 no Lighthouse
- [ ] Pre-launch checklist 100% completo
- [ ] First-day monitoring plan definido

## Quando Usar
- Lancamento de nova campanha (qualquer canal)
- Relaunch de campanha com mudanca significativa de estrategia
- Nova conta com setup completo
