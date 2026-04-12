---
task: coordinate-cross-channel-strategy
responsavel: "@paidmedia-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: performance_data
    tipo: data
    origem: "Pulse / plataformas"
    obrigatorio: true

Saida:
  - campo: cross_channel_strategy
    tipo: document
    destino: "Signal + Query"

Checklist:
  - "[ ] Dados de todos os canais consolidados"
  - "[ ] Overlap de audiences identificado"
  - "[ ] Canibalismo entre canais mapeado"
  - "[ ] Strategy doc aprovado"
---

# Task: Coordinate Cross-Channel Strategy

## Metadata
- **Agent:** paidmedia-orqx (Apex)
- **Squad:** squad-paidmedia
- **Complexity:** HIGH

## Objetivo
Alinhar estrategia entre Meta Ads e Google Ads para maximizar cobertura de funil, minimizar overlap e otimizar alocacao de budget cross-channel.

## Inputs
- Performance data de todos os canais (ultimos 30/60/90 dias)
- Attribution data (cross-channel paths)
- Budget total disponivel
- Objetivos de negocio atualizados

## Steps

1. **Consolidar dados cross-channel**
   - Coletar KPIs de cada canal: spend, impressions, clicks, conversions, CPA, ROAS
   - Normalizar metricas para comparacao (attribution window, conversion definition)
   - Mapear assisted conversions e cross-channel paths

2. **Mapear funil cross-channel**
   - Google Search: intent-based (mid/bottom funnel)
   - Google Display/YouTube: awareness (top funnel)
   - Meta Feed/Stories: discovery (top/mid funnel)
   - Meta Retargeting: consideration/conversion (mid/bottom funnel)
   - Pmax/Advantage+: full funnel (algoritmico)

3. **Identificar overlaps e canibalismo**
   - Audiences em retargeting Meta vs RLSA Google
   - Brand search Google vs brand awareness Meta
   - Similar audiences Meta vs in-market Google
   - Identificar dupla atribuicao

4. **Definir papel de cada canal no funil**
   - Assign primary role por canal
   - Definir metricas primarias por role (awareness = CPM/reach, consideration = CTR/CPC, conversion = CPA/ROAS)
   - Budget allocation proporcional ao role

5. **Gerar strategy document**
   - Channel roles e responsibilities
   - Budget split com justificativa
   - Audience strategy por canal (quem ataca o que)
   - Creative strategy por canal (formato e mensagem)
   - Measurement framework

## Output
Documento `cross-channel-strategy.md` com channel roles, budget split, audience strategy e measurement framework.

## Quality Gates
- [ ] Dados de todos os canais ativos incluidos
- [ ] Attribution data considerada (nao apenas last-click)
- [ ] Overlaps identificados e endereçados
- [ ] Budget split justificado com dados
- [ ] Cada canal tem role claro no funil

## Quando Usar
- Planejamento mensal/trimestral cross-channel
- Quando ha suspeita de overlap/canibalismo entre canais
- Quando budget total muda significativamente
