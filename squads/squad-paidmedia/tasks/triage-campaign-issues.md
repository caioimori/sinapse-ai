---
task: triage-campaign-issues
responsavel: "@paidmedia-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: issue_description
    tipo: string
    origem: "alerta ou usuario"
    obrigatorio: true
  - campo: performance_data
    tipo: data
    origem: "plataformas"
    obrigatorio: true

Saida:
  - campo: triage_result
    tipo: document
    destino: "agente responsavel"

Checklist:
  - "[ ] Issue categorizado por severidade"
  - "[ ] Root cause identificado ou hipotese formulada"
  - "[ ] Agente responsavel assignado"
  - "[ ] Acao corretiva definida"
---

# Task: Triage Campaign Issues

## Metadata
- **Agent:** paidmedia-orqx (Apex)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Diagnosticar rapidamente problemas de performance de campanha, categorizar por severidade e rotear para o agente correto com instrucoes claras.

## Inputs
- Descricao do problema ou alerta automatico
- Dados de performance relevantes
- Timeline do problema (quando comecou)

## Steps

1. **Categorizar severidade**
   - CRITICAL: spend >2x target sem conversoes, tracking quebrado, conta suspensa
   - HIGH: CPA >150% do target, ROAS <50% do target, budget esgotado prematuramente
   - MEDIUM: CPA 110-150% do target, CTR drop >30%, creative fatigue detectada
   - LOW: CPA 100-110% do target, variacoes normais de performance

2. **Diagnosticar area do problema**

   | Sintoma | Provavel Causa | Agente |
   |---------|---------------|--------|
   | Sem impressions | Budget, bid, audience, policy | Signal/Query |
   | Impressions sem clicks | Creative, targeting, placement | Canvas + Signal/Query |
   | Clicks sem conversoes | LP, tracking, offer, audience quality | Convert + Lighthouse |
   | CPA alto subito | Competition, fatigue, tracking, sazonalidade | Pulse (diagnostico) |
   | Budget nao gastando | Bid baixo, audience pequena, policy | Signal/Query |
   | Tracking discrepancia | Pixel, CAPI, attribution, dedup | Lighthouse |

3. **Formular hipotese de root cause**
   - O que mudou recentemente? (criativos, budget, audiences, LP, tracking)
   - E um problema de canal ou cross-channel?
   - E um problema de supply (impressions) ou demand (conversao)?

4. **Assignar agente e definir acao**
   - Rotear para agente responsavel com contexto completo
   - Definir acao corretiva especifica
   - Definir prazo baseado na severidade: CRITICAL=2h, HIGH=24h, MEDIUM=48h, LOW=1 week

## Output
Triage document com: severidade, diagnostico, hipotese, agente assignado, acao corretiva, prazo.

## Quality Gates
- [ ] Severidade categorizada corretamente
- [ ] Hipotese de root cause formulada (nao apenas sintoma)
- [ ] Agente correto assignado
- [ ] Acao corretiva e especifica e mensuravel
- [ ] Prazo definido por severidade

## Quando Usar
- Alerta de anomalia de performance
- Queda subita de performance
- Tracking issues detectados
- Budget issues (under/overspend)
- Qualquer problema que precisa de diagnostico rapido
