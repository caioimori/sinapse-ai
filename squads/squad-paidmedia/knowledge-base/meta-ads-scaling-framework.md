# Meta Ads Scaling Framework

## 4-Phase Scaling Roadmap

### Phase 1: Foundation ($0-$2K/day)
**Objetivo:** Validar product-market fit de ads, estabelecer baseline de CPA e encontrar primeiros winners.

**Readiness Criteria para entrar:**
- Pixel + CAPI implementados e funcionando
- Landing page com CVR >benchmark do vertical
- Min 3 conceitos de criativo prontos
- Budget: min $50/day por ad set

**O que fazer nesta fase:**
1. Configurar 2-3 campanhas (Cold + Warm + Hot)
2. Testar 3-5 audiences diferentes em Cold
3. Testar 3-5 criativos diferentes por audience
4. Rodar por 7-14 dias sem mexer
5. Identificar: qual audience + criativo = melhor CPA?

**Criterios de saida (para Phase 2):**
- [ ] CPA estavel por 14+ dias (variacao <15%)
- [ ] 3+ criativos com CPA < target
- [ ] Tracking 100% funcional (confirmado end-to-end)
- [ ] Audience architecture funcionando (Cold/Warm/Hot)

**Creative Velocity:** 2 novos criativos/semana

### Phase 2: Early Scale ($2K-$10K/day)
**Objetivo:** Escalar audiences e criativos que funcionam, diversificar canais.

**O que fazer:**
1. Escalar budget gradualmente (+15-20%/semana nos winners)
2. Expandir audiences: Broad, LAL 1-3%, novas seeds
3. Testar Advantage+ Shopping Campaigns
4. Iniciar creative testing framework formal
5. Adicionar Google Ads como segundo canal (se nao ativo)

**Criterios de saida (para Phase 3):**
- [ ] CPA marginal <1.3x CPA medio
- [ ] 4+ novos criativos/semana em producao
- [ ] 2+ canais ativos (Meta + Google)
- [ ] Creative testing framework operacional
- [ ] Broad targeting testado

**Creative Velocity:** 4 novos criativos/semana

### Phase 3: Growth ($10K-$50K/day)
**Objetivo:** Otimizar cross-channel, automatizar bidding, aumentar creative velocity.

**O que fazer:**
1. Implementar attribution cross-channel
2. Smart Bidding ativo em Google (tCPA ou tROAS)
3. Advantage+ Shopping em Meta (full funnel)
4. Creative pipeline escalavel (equipe ou AI)
5. Testar novos formatos (UGC, Dynamic Creative)
6. Budget rebalancing semanal entre canais

**Criterios de saida (para Phase 4):**
- [ ] Attribution model validado
- [ ] 8+ novos criativos/semana
- [ ] Automated bidding estavel
- [ ] Equipe de producao criativa escalavel
- [ ] CPA estavel mesmo com volume crescente

**Creative Velocity:** 8 novos criativos/semana

### Phase 4: Optimization ($50K+/day)
**Objetivo:** Marginal gains, incrementality testing, advanced automation.

**O que fazer:**
1. Incrementality testing (conversion lift studies)
2. Advanced bidding (portfolio strategies, value optimization)
3. Cross-channel budget optimization algoritmico
4. Creative AI automation (variantes automaticas)
5. Advanced analytics (MMM, attribution refinement)

**Creative Velocity:** 12+ novos criativos/semana

## Scaling Rules (NON-NEGOTIABLE)

### Budget Progression
- **Max +20% por semana por campanha** — nunca dobrar budget
- **Nunca mudar mais de 1 variavel ao escalar** — se aumentar budget, nao mudar audience
- **Respeitar learning phase** — apos mudanca de budget >20%, esperar 7 dias
- **CBO preferred** — deixar Meta otimizar entre ad sets

### Risk Triggers (Rollback Imediato)
| Trigger | Acao |
|---------|------|
| CPA >1.5x target por 3 dias | Voltar para budget anterior |
| ROAS <50% do target por 3 dias | Reduzir budget 30% |
| Frequency >5 em Cold audiences | Pausar scaling, refresh criativos |
| CTR drop >40% WoW | Investigar fatigue, pausar se confirmado |
| Tracking break detectado | STOP TOTAL ate resolver |

### Creative Velocity Requirements
O calculo de criativos necessarios:
- **Formula:** criativos/semana = (spend_diario / $500) * 1 criativo base
- **$2K/day** = 4/semana
- **$5K/day** = 10/semana
- **$10K/day** = 20/semana (split entre iteracoes e novos)

### Budget Increase Decision Tree
```
CPA estavel por 7+ dias?
├── SIM → CPA marginal <1.3x average?
│   ├── SIM → Creative fatigue <30% dos ads?
│   │   ├── SIM → AUMENTAR +15-20%
│   │   └── NAO → PAUSAR, refresh criativos primeiro
│   └── NAO → NaO AUMENTAR, otimizar primeiro
└── NAO → NaO AUMENTAR, estabilizar primeiro
```
