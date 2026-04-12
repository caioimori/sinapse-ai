---
task: classify-analytics-maturity
responsavel: "@growth-orqx"
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

# Task: Classify Analytics Maturity

## Metadata
- **Squad:** squad-growth
- **Agent:** Catalyst (growth-orqx)
- **Complexity:** Standard

## Objetivo
Classificar o nivel de maturidade de analytics do projeto — avaliar infraestrutura de dados existente, qualidade de tracking, cultura data-driven e capacidade de experimentacao.

## Entrada
- Current analytics tools inventory
- Existing tracking implementation
- Team capabilities and structure
- Business objectives

## Passos

### 1. Maturity Level Assessment
| Level | Nome | Descricao | Indicadores |
|-------|------|----------|-------------|
| 0 | No Analytics | Sem tracking implementado | Zero ferramentas, sem dados |
| 1 | Basic Tracking | GA basico, pageviews | GA instalado, sem eventos custom |
| 2 | Event Tracking | Eventos estruturados, goals | Event taxonomy, conversions tracked |
| 3 | Data-Driven | Analise avancada, segmentacao | Cohorts, funnels, attribution |
| 4 | Optimization | Experimentacao continua, ML | A/B testing, predictive, automated |

### 2. Avaliar Dimensoes
| Dimensao | Score 1-5 | Criterios |
|----------|----------|----------|
| Infraestrutura | | Ferramentas, integracoes, data pipeline |
| Data Quality | | Accuracy, completeness, consistency |
| Event Coverage | | % de user flows com tracking |
| Analysis Capability | | Segmentacao, cohorts, attribution |
| Experimentation | | A/B testing capability, velocity |
| Privacy Compliance | | Consent management, LGPD/GDPR |
| Team Skills | | Analistas, ferramentas, processos |
| Data Culture | | Decisoes data-driven, dashboards usados |

### 3. Gap Analysis
| Area | Current State | Target State | Gap | Priority |
|------|-------------|-------------|-----|---------|
| Tracking | | | | P0-P3 |
| Analysis | | | | |
| Experimentation | | | | |
| Privacy | | | | |
| Tooling | | | | |

### 4. Roadmap por Level
| De → Para | Acoes Prioritarias | Timeline |
|-----------|-------------------|---------|
| 0 → 1 | Instalar GA4, basic pageview tracking | 1-2 semanas |
| 1 → 2 | Event taxonomy, custom events, goals | 2-4 semanas |
| 2 → 3 | CDP, advanced analysis, attribution | 4-8 semanas |
| 3 → 4 | A/B platform, ML models, automation | 8-16 semanas |

## Saida
- Analytics maturity report
- Dimension scores (1-5 por dimensao)
- Gap analysis with priorities
- Maturity roadmap

## Validacao
- [ ] Todas as 8 dimensoes avaliadas
- [ ] Level classificado (0-4)
- [ ] Gaps identificados com prioridade
- [ ] Roadmap de evolucao definido
- [ ] Quick wins identificados
