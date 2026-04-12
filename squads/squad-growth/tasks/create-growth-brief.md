---
task: create-growth-brief
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

# Task: Create Growth Brief

## Metadata
- **Squad:** squad-growth
- **Agent:** Catalyst (growth-orqx)
- **Complexity:** Complex

## Objetivo
Criar growth brief completo — definir North Star Metric, mapear AARRR funnel, estabelecer OKRs de growth e alinhar time em torno de metricas que importam.

## Entrada
- Business objectives
- Analytics maturity classification
- Current metrics and benchmarks
- Product/service description
- Target audience

## Passos

### 1. North Star Metric Definition
| Aspecto | Definicao |
|---------|----------|
| Metric name | |
| Formula | |
| Current value | |
| Target value | |
| Timeframe | |
| Why this metric | |
| Leading indicators | |
| Lagging indicators | |

**Criterios da North Star Metric:**
- Mede valor entregue ao cliente
- Correlaciona com revenue de longo prazo
- Todos os times podem influenciar
- Mensuravel e acionavel
- Leading indicator de crescimento sustentavel

### 2. AARRR Funnel Mapping
| Stage | Definicao | Metric | Current | Target | Gap |
|-------|----------|--------|---------|--------|-----|
| Acquisition | Como usuarios descobrem | Visitors, signups | | | |
| Activation | Primeiro valor experimentado | Time to value, activation rate | | | |
| Retention | Usuarios voltam | D1/D7/D30 retention | | | |
| Revenue | Usuarios pagam | ARPU, conversion to paid | | | |
| Referral | Usuarios recomendam | NPS, viral coefficient | | | |

### 3. Growth OKRs
```yaml
okrs:
  objective: "Accelerate measurable growth"
  key_results:
    - kr: "Increase North Star Metric from X to Y"
      target: ""
      current: ""
      confidence: "high/medium/low"
    - kr: "Improve activation rate from X% to Y%"
      target: ""
      current: ""
    - kr: "Reduce churn rate from X% to Y%"
      target: ""
      current: ""
    - kr: "Achieve experiment velocity of N tests/month"
      target: ""
      current: ""
```

### 4. Input Metrics (Leading Indicators)
| Input Metric | Influences | Current | Target |
|-------------|-----------|---------|--------|
| Traffic volume | Acquisition | | |
| Signup rate | Acquisition → Activation | | |
| Time to first value | Activation | | |
| Feature adoption rate | Activation → Retention | | |
| DAU/MAU ratio | Retention | | |
| NPS score | Referral | | |

### 5. Growth Constraints
| Constraint | Impact | Mitigation |
|-----------|--------|-----------|
| Data maturity | | Level-appropriate tactics |
| Budget | | Prioritize organic + product-led |
| Team size | | Automate, focus on highest leverage |
| Technical debt | | Tracking before optimization |
| Market maturity | | Competitive differentiation |

## Saida
- Growth brief document
- North Star Metric definition
- AARRR funnel mapping
- Growth OKRs
- Input metrics dashboard spec
- Growth constraints analysis

## Validacao
- [ ] North Star Metric definida com criterios
- [ ] AARRR funnel mapeado com metricas
- [ ] OKRs de growth estabelecidos
- [ ] Leading indicators identificados
- [ ] Constraints mapeados com mitigacoes
- [ ] Brief aprovado por stakeholders
