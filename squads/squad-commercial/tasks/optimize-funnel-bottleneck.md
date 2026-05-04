---
task: optimize-funnel-bottleneck
responsavel: "@cs-funnel-architect"
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

# Task: Optimize Funnel Bottleneck

## Metadata
- **Squad:** squad-commercial
- **Agent:** Cascade (cs-funnel-architect)
- **Complexity:** Standard

## Objetivo
Otimizar um bottleneck especifico no funil — sprint focado em melhorar a conversao de um unico estagio identificado como o maior leak.

## Entrada
- Funnel conversion audit (from audit-funnel-conversions)
- Bottleneck identified (specific stage)
- Current conversion rate and target
- Available resources and timeline

## Passos

### 1. Bottleneck Diagnosis
```
BOTTLENECK: [Stage] → [Stage]
Current Conversion: X%
Target Conversion: Y%
Gap: Z percentage points
Impact: +R$ /month if fixed (back-of-envelope)
```

### 2. Root Cause Analysis (5 Whys)
| Why | Finding |
|-----|---------|
| 1. Why is conversion low at this stage? | |
| 2. Why does that happen? | |
| 3. Why? | |
| 4. Why? | |
| 5. Root cause: | |

### 3. Common Bottleneck Fixes
| Bottleneck | Common Causes | Potential Fixes |
|-----------|-------------|----------------|
| Visit→Lead | Low-value content, bad CTAs, form friction | Better lead magnets, fewer form fields, exit intent |
| Lead→MQL | Wrong leads, poor scoring, no nurture | Tighten ICP, implement scoring, build sequences |
| MQL→SQL | Slow response, misalignment with sales | Faster routing, alignment on criteria, better SLAs |
| SQL→Opp | Poor discovery, weak qualification | Discovery training, MEDDIC enforcement |
| Opp→Proposal | No urgency, unclear value | Value framing, deadline creation, competitive pressure |
| Proposal→Close | Price objections, indecision | Three-options, guarantees, social proof, urgency |

### 4. Optimization Sprint Plan
| Week | Activity | Owner | Deliverable |
|------|---------|-------|------------|
| 1 | Deep analysis + hypothesis | Cascade | Root cause + 3 hypotheses |
| 2 | Design changes + build | Cascade + relevant agent | New assets/processes |
| 3 | Launch + monitor | Cascade + Vault | Changes live, tracking active |
| 4 | Analyze results + iterate | Cascade | Results report, next steps |

### 5. Success Measurement
| Metric | Baseline | Target | Actual |
|--------|---------|--------|--------|
| Stage conversion rate | % | % | |
| Volume through stage | /week | /week | |
| Impact on downstream | | | |
| Revenue impact | R$/mo | R$/mo | |

## Saida
- Root cause analysis
- Optimization plan with timeline
- Changes implemented
- Results measured and documented

## Validacao
- [ ] Root cause identified (not just symptoms)
- [ ] Hypothesis-driven changes (not random)
- [ ] Measurable improvement target set
- [ ] Results tracked for at least 2 weeks
