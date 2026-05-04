---
task: optimize-ad-set-targeting
responsavel: "@meta-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: ad_set_data
    tipo: data
    origem: "Meta Ads Manager"
    obrigatorio: true

Saida:
  - campo: optimization_plan
    tipo: document
    destino: "Signal (implementacao)"
---

# Task: Optimize Ad Set Targeting

## Metadata
- **Agent:** meta-ads-specialist (Signal)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Otimizar targeting de ad sets individuais com base em dados de performance, breakdown demographics e placement.

## Steps

1. **Analisar breakdowns de performance**
   - Age + Gender: identificar cohorts que convertem melhor
   - Placement: Facebook Feed, Instagram Feed, Stories, Reels performance
   - Device: Mobile vs Desktop
   - Region (se aplicavel)

2. **Identificar desperdicio**
   - Cohorts com spend >10% e zero conversoes
   - Placements com CPA >2x da media
   - Devices com CVR <50% da media

3. **Otimizar targeting**
   - Se usar Advantage+ Placements: manter (Meta otimiza bem)
   - Se manual: remover placements com CPA >2x e volume insignificante
   - Age/gender: NAO restringir demograficamente a menos que dados fortissimos (>100 conversoes)
   - Geografico: excluir regioes sem conversoes em 30+ dias (se spend significativo)

4. **Otimizar optimization event**
   - Se conversoes insuficientes (<50/semana): subir no funil (purchase → ATC → view content)
   - Se conversoes abundantes (>100/semana): descer no funil (ATC → purchase → purchase ROAS)
   - Considerar value optimization se ROAS e metrica primaria

## Output
Plano de otimizacao por ad set com mudancas especificas e impacto esperado.

## Quality Gates
- [ ] Breakdowns analisados com dados de 14+ dias
- [ ] Mudancas baseadas em volume estatisticamente relevante
- [ ] Nao restringir targeting sem dados fortes (>100 conversoes)

## Quando Usar
- Otimizacao quinzenal de ad sets
- Quando ad set tem CPA alto persistente
