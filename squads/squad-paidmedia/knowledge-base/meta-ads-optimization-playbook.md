# Meta Ads Optimization Playbook

## Marginal CPA Analysis

### Conceito
CPA marginal = custo de cada conversao ADICIONAL. Diferente do CPA medio, o marginal mostra quanto custa a PROXIMA conversao. Essencial para decisoes de budget.

### Como Calcular
1. Exportar dados diarios: spend e conversions por campanha (30+ dias)
2. Ordenar dias por spend (menor para maior)
3. Dividir em quartis (4 faixas de 25% cada)
4. Para cada quartil: CPA = spend do quartil / conversoes do quartil
5. CPA marginal do Q4 vs Q1 mostra quanto a eficiencia cai com mais spend

### Interpretacao
| CPA Marginal Q4/Q1 | Status | Acao |
|---------------------|--------|------|
| <1.2x | Eficiente | Headroom para escalar |
| 1.2-1.5x | Aceitavel | Escalar com cautela |
| 1.5-2.0x | Diminishing returns | Perto do limite |
| >2.0x | Ineficiente | Reduzir spend ou reestruturar |

## Budget Efficiency Tiers

### Tier System por Ad Set
| Tier | CPA vs Target | Acao | Budget Adjustment |
|------|-------------|------|-------------------|
| S | <70% do target | Escalar agressivamente | +20%/semana |
| A | 70-100% do target | Escalar moderadamente | +10-15%/semana |
| B | 100-130% do target | Manter e otimizar | Manter |
| C | 130-170% do target | Reduzir e investigar | -20% |
| D | >170% do target | Pausar ou reestruturar | Pausar |

### Regra de Budget Minimo
- Cada ad set precisa de budget >= 5x CPA target/dia para sair da learning phase
- Se CPA target = $50 → minimum $250/dia por ad set
- Se budget nao permite → consolidar ad sets (menos = melhor)

## Creative Fatigue Detection

### Indicadores de Fadiga
| Indicador | Threshold Amarelo | Threshold Vermelho |
|-----------|------------------|-------------------|
| Frequency | >2.5 | >4.0 |
| CTR WoW change | -10% a -20% | >-20% |
| CPA WoW change | +15% a +30% | >+30% |
| Days active | >21 dias | >45 dias |
| Hook rate (3s views/impressions) | -15% | >-25% |

### Lifecycle de um Criativo
```
Launch (D0-D3) → Learning (D3-D7) → Peak (D7-D21) → Decline (D21-D45) → Fatigue (D45+)
```

### Acoes por Stage
- Peak: escalar budget, usar como base para iteracoes
- Decline: preparar substituicao, reduzir budget gradualmente
- Fatigue: pausar, substituir, documentar learning

## Frequency Cap Management

### Thresholds por Tier
| Tier | Frequency Ideal | Max Aceitavel | Janela |
|------|----------------|---------------|--------|
| Cold | 1.5-2.0 | 3.0 | 7 dias |
| Warm | 2.0-3.0 | 4.0 | 7 dias |
| Hot | 3.0-5.0 | 7.0 | 7 dias |

### Quando Frequency sobe demais
1. Audience muito pequena → expandir ou consolidar
2. Budget muito alto para o tamanho da audience → reduzir ou diversificar
3. Poucos criativos → adicionar mais variacoes
4. Placement limitado → expandir placements

## CAPI Implementation Guide

### Prioridade de Implementacao
1. **Purchase/Lead event** — mais importante para otimizacao
2. **Add to Cart / Initiate Checkout** — segundo mais importante
3. **View Content / Page View** — menos critico mas bom ter

### Event Match Quality (EMQ) Optimization
| EMQ Score | Status | Acao |
|-----------|--------|------|
| 8-10 | Excelente | Manter |
| 6-8 | Bom | Adicionar mais parametros |
| 4-6 | Precisa trabalho | Implementar hashed PII |
| <4 | Critico | Revisar implementacao CAPI |

### Parametros que melhoram EMQ
- **em** (email, hashed SHA256) — maior impacto
- **fn** (first name, hashed)
- **ln** (last name, hashed)
- **ph** (phone, hashed)
- **external_id** (user ID do sistema)
- **client_ip_address** e **client_user_agent** — automaticos via server

### Deduplication
- Enviar mesmo `event_id` via Pixel (browser) e CAPI (server)
- Meta deduplica automaticamente quando event_id match
- Se dedup ratio >95%: um dos dois nao esta firing
- Se dedup ratio <50%: event_ids nao estao matching

## Optimization Cadence

### Daily (Signal monitora)
- Delivery check: campanhas gastando conforme esperado?
- Anomalias: CPA spike, spend zerado, errors?
- Learning phase: ads stuck?

### Weekly (Signal + Apex)
- Creative performance review
- Audience performance review
- Budget rebalancing (se necessario)
- New creative deployment

### Bi-Weekly (Signal + Canvas)
- Creative fatigue check completo
- New test hypothesis formulation
- Winner scaling

### Monthly (Apex + Pulse)
- Full performance report
- CPA marginal recalculation
- Budget reallocation decision
- Scaling roadmap review
