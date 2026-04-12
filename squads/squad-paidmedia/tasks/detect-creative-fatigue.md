---
task: detect-creative-fatigue
responsavel: "@meta-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: ad_performance_data
    tipo: data
    origem: "Meta Ads Manager"
    obrigatorio: true

Saida:
  - campo: fatigue_report
    tipo: document
    destino: "Canvas + Signal"
---

# Task: Detect Creative Fatigue

## Metadata
- **Agent:** meta-ads-specialist (Signal)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Identificar criativos com sinais de fadiga e recomendar acoes (refresh, pausar, substituir).

## Steps

1. **Coletar metricas de fatigue por ad**
   - Frequency (ultimos 7 dias)
   - CTR trend (WoW comparativo)
   - CPA trend (WoW comparativo)
   - Days active
   - Total impressions

2. **Aplicar modelo de fatigue detection**
   - **Green (saudavel):** Frequency <2.5, CTR estavel, CPA estavel
   - **Yellow (atencao):** Frequency 2.5-3.5 OU CTR drop 10-20% WoW
   - **Orange (fadiga inicial):** Frequency 3.5-5 OU CTR drop 20-30% WoW OU CPA up 15-30%
   - **Red (fadiga critica):** Frequency >5 OU CTR drop >30% OU CPA up >30% OU age >45 dias

3. **Recomendacoes por status**
   - Green: manter, sem acao
   - Yellow: monitorar, preparar variacao
   - Orange: reduzir budget, iniciar variacao do criativo
   - Red: pausar, substituir por novo criativo imediatamente

4. **Calcular creative runway**
   - Com base no trend de frequency e CTR decay, estimar dias restantes
   - Formula simples: dias restantes ≈ (frequency_limit - frequency_atual) / (frequency_delta_daily)
   - Alertar Canvas se runway <7 dias em >50% dos ads ativos

## Output
Tabela de fatigue status por ad com status (Green/Yellow/Orange/Red), metricas e recomendacao.

## Quality Gates
- [ ] Todos os ads ativos analisados
- [ ] Metricas de 7+ dias usadas (nao single day)
- [ ] Creative runway calculado
- [ ] Canvas alertado se refresh urgente

## Quando Usar
- Monitoramento semanal rotineiro
- Quando CPA sobe sem mudanca de budget/targeting
- Antes de scaling (garantir criativos saudaveis)
