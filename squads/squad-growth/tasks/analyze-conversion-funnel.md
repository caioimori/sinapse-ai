---
task: analyze-conversion-funnel
responsavel: "@ga-cro-specialist"
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

# Task: Analyze Conversion Funnel

## Metadata
- **Squad:** squad-growth
- **Agent:** Convert (ga-cro-specialist)
- **Complexity:** Standard

## Objetivo
Analisar funil de conversao — mapear cada etapa, medir drop-offs, segmentar por dimensoes e identificar os maiores gargalos de conversao.

## Entrada
- Funnel definition (steps)
- Analytics event data (30+ days)
- Segmentation dimensions

## Passos

### 1. Funnel Definition
| Step | Evento | Descricao |
|------|--------|----------|
| 1 | page_view (landing) | Visitante chega |
| 2 | sign_up_start | Inicia registro |
| 3 | sign_up_complete | Completa registro |
| 4 | activation_event | Realiza acao de valor |
| 5 | purchase | Converte para pago |

### 2. Funnel Metrics
| Step | Users | Conv Rate | Drop-off | Drop-off % |
|------|-------|----------|---------|-----------|
| Landing | 10,000 | 100% | — | — |
| Sign-up start | | | | |
| Sign-up complete | | | | |
| Activation | | | | |
| Purchase | | | | |

### 3. Segmented Funnel Analysis
| Segmento | Step 1→2 | Step 2→3 | Step 3→4 | Step 4→5 | Total |
|----------|---------|---------|---------|---------|-------|
| Desktop | | | | | |
| Mobile | | | | | |
| Organic | | | | | |
| Paid | | | | | |
| New users | | | | | |
| Return users | | | | | |

### 4. Drop-off Analysis
| Biggest Drop-off | De → Para | Taxa | Causa Provavel | Acao |
|-----------------|---------|------|---------------|------|
| #1 | | | | |
| #2 | | | | |
| #3 | | | | |

### 5. Time Between Steps
| Step Transition | Median Time | P75 Time | Ideal | Issue? |
|----------------|------------|---------|-------|--------|
| Landing → Sign-up | | | < 3 min | |
| Sign-up → Activation | | | < 24h | |
| Activation → Purchase | | | < 7d | |

## Saida
- Funnel analysis report
- Conversion rates per step
- Segmented funnel comparison
- Top 3 drop-off points with root causes
- Optimization recommendations

## Validacao
- [ ] Funnel mapeado com todos os steps
- [ ] Conversion rates calculados
- [ ] Segmentacao por device, channel, user type
- [ ] Top drop-offs identificados
- [ ] Causas provaveis documentadas
- [ ] Acoes recomendadas por drop-off
