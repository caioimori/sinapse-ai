---
task: conduct-business-audit
responsavel: "@council-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: business_overview
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: business_audit
    tipo: document
    destino: Console

Checklist:
  - "[ ] 6 dimensoes avaliadas"
  - "[ ] Constraint principal identificado"
  - "[ ] Multi-advisor perspectives coletadas"
  - "[ ] Recomendacoes priorizadas"
---

# Task: Conduct Strategic Business Audit

## Metadata
- **Squad:** squad-council
- **Agent:** Zenith (council-orqx) + all advisors
- **Complexity:** High

## Objetivo
Conduzir auditoria estrategica completa de um negocio usando as perspectivas de todos os conselheiros. Identificar o constraint principal e gerar recomendacoes priorizadas.

## Passos

### 1. Business Snapshot
- Modelo de negocio, mercado, segmento
- Revenue, growth rate, margens
- Team size e composicao
- Estágio (startup, scaling, established)

### 2. Six-Dimension Assessment

| Dimensao | Advisor Primario | Score (1-10) | Insight |
|----------|-----------------|--------------|---------|
| Decision Quality | Ray Dalio | | Principios claros? Root cause diagnosis? |
| Competitive Position | Peter Thiel | | Monopoly? 0-to-1? Moat? |
| Growth Strategy | Reid Hoffman | | Network effects? Scaling readiness? |
| Purpose & Culture | Simon Sinek / Brene Brown | | WHY claro? Trust? |
| Team Health | Patrick Lencioni | | 5 dysfunctions? Working genius gaps? |
| Founder Alignment | Naval / Derek / Yvon | | Leverage? Enough? Purpose? |

### 3. Identify Primary Constraint
- Qual dimensao tem o menor score?
- Esta e a constraint — tudo mais e limitado por ela
- Theory of Constraints: melhorar a constraint melhora tudo

### 4. Multi-Advisor Perspectives
Consultar 3-5 advisors mais relevantes para o constraint:
- Perspectiva de cada um
- Recomendacao especifica
- Tensoes entre perspectivas

### 5. Prioritized Recommendations
1. Acao imediata (constraint principal)
2. Quick wins (melhorias de alto impacto, baixo esforco)
3. Investimentos de longo prazo (compounding)
4. Riscos para mitigar
5. O que PARAR de fazer (tao importante quanto o que comecar)
