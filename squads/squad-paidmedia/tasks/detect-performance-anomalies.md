---
task: detect-performance-anomalies
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: performance_data
    tipo: data
    origem: "Google Ads"
    obrigatorio: true

Saida:
  - campo: anomaly_report
    tipo: document
    destino: "Apex + Pulse"
---

# Task: Detect Performance Anomalies

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Detectar anomalias de performance via z-score analysis para identificar mudancas significativas rapidamente.

## Steps

1. **Coletar dados diarios (ultimos 30-60 dias)**
   - CPA diario, ROAS diario, CTR diario, CVR diario, CPC diario
   - Spend diario, impressions diarias, conversoes diarias

2. **Calcular baseline e desvio padrao**
   - Media dos ultimos 30 dias (excluindo ultimos 3 dias para detectar mudancas recentes)
   - Desvio padrao dos ultimos 30 dias
   - Z-score = (valor_atual - media) / desvio_padrao

3. **Classificar anomalias**
   - |z| < 1.5: variacao normal — ignorar
   - |z| 1.5-2.0: variacao notavel — monitorar
   - |z| 2.0-3.0: anomalia significativa — investigar
   - |z| > 3.0: anomalia critica — acao imediata

4. **Contextualizar anomalias**
   - Mudanca recente de budget? (causa interna)
   - Mudanca de criativos/ads? (causa interna)
   - Sazonalidade ou evento externo? (causa externa)
   - Competidor entrou/saiu do leilao? (causa externa)
   - Tracking issue? (falso positivo)

5. **Recomendar acao**
   - Anomalia positiva (CPA caiu): investigar causa, replicar
   - Anomalia negativa (CPA subiu): diagnosticar, corrigir
   - Falso positivo (tracking): escalar para Lighthouse

## Output
Anomaly report com metricas, z-scores, classificacao, contexto e acoes.

## Quality Gates
- [ ] Z-score calculado para metricas-chave
- [ ] Anomalias contextualizadas (causa provavel)
- [ ] Falsos positivos identificados
- [ ] Acoes definidas para anomalias significativas

## Quando Usar
- Monitoramento diario automatizado
- Quando performance muda subitamente
- Review semanal de performance
