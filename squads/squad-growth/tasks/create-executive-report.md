---
task: create-executive-report
responsavel: "@ga-data-analyst"
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

# Task: Create Executive Report

## Metadata
- **Squad:** squad-growth
- **Agent:** Insight (ga-data-analyst)
- **Complexity:** Standard

## Objetivo
Criar executive report de analytics — traduzir dados complexos em narrativa clara e acionavel para stakeholders C-level, focando em insights de negocio e recomendacoes estrategicas.

## Entrada
- Analytics data (periodo atual vs anterior)
- KPI definitions and targets
- Business context and goals
- Audience level (C-level, VP, Manager)

## Passos

### 1. Report Structure
| Secao | Conteudo | Tamanho |
|-------|---------|---------|
| Executive Summary | 3-5 bullet points com highlights | 1/2 pagina |
| KPI Scorecard | Metricas-chave vs targets | 1 pagina |
| Performance Deep-Dive | Top 3 insights detalhados | 2-3 paginas |
| Channel Performance | Revenue/ROI por canal | 1 pagina |
| Recommendations | Acoes priorizadas com impacto estimado | 1 pagina |
| Appendix | Metodologia, data sources, glossario | 1 pagina |

### 2. KPI Scorecard Template
| KPI | Target | Actual | Trend | Status |
|-----|--------|--------|-------|--------|
| Revenue | | | ↑↓→ | 🟢🟡🔴 |
| Conversion Rate | | | ↑↓→ | 🟢🟡🔴 |
| CAC | | | ↑↓→ | 🟢🟡🔴 |
| LTV | | | ↑↓→ | 🟢🟡🔴 |
| LTV:CAC Ratio | | | ↑↓→ | 🟢🟡🔴 |
| Traffic (sessions) | | | ↑↓→ | 🟢🟡🔴 |
| Active Users (MAU) | | | ↑↓→ | 🟢🟡🔴 |
| NPS | | | ↑↓→ | 🟢🟡🔴 |

### 3. Data Storytelling Framework
| Elemento | Descricao | Exemplo |
|----------|----------|---------|
| Context | Situacao de fundo | "No Q1, lancamos 3 novas features..." |
| Conflict | O desafio ou surpresa | "Apesar disso, retencao D30 caiu 12%..." |
| Resolution | Insight e recomendacao | "A analise mostra que users que nao completam onboarding..." |
| Action | Proximo passo concreto | "Recomendamos investir em onboarding redesign..." |

### 4. Visualization Best Practices
| Insight | Chart Recomendado | Evitar |
|---------|-------------------|--------|
| Trend over time | Line chart | Pie chart |
| Comparison | Bar chart (horizontal) | 3D charts |
| Part of whole | Stacked bar, treemap | Pie com muitos slices |
| Distribution | Histogram, box plot | Tables grandes |
| Correlation | Scatter plot | Multiple y-axes |
| KPI status | Scorecard com indicators | Dense tables |
| Funnel | Funnel chart | Bar chart |

### 5. Audience Calibration
| Audiencia | Nivel de Detalhe | Foco | Formato |
|----------|-----------------|------|---------|
| CEO/Board | Muito alto | Revenue, growth, market | 5 slides max |
| VP/Director | Alto | Channel performance, ROI | 10 slides |
| Manager | Medio | Tactical metrics, experiments | 15 slides |
| Analyst | Detalhado | Methodology, data quality | Full report |

### 6. Insight Quality Checklist
| Criterio | Descricao |
|----------|----------|
| Actionable | Leva a uma decisao ou acao especifica |
| Quantified | Inclui numeros e impacto estimado |
| Contextualized | Comparado com benchmark ou periodo anterior |
| Surprising | Nao e algo que ja era obvio |
| Timely | Relevante para decisoes atuais |
| Verified | Cross-checked com multiplas fontes |

### 7. Recommendation Framework
| Recomendacao | Impacto Estimado | Esforco | Confianca | Prioridade |
|-------------|-----------------|---------|----------|-----------|
| | R$ ou % | Baixo/Medio/Alto | Alta/Media/Baixa | P0/P1/P2 |

## Saida
- Executive report (formato adequado a audiencia)
- KPI scorecard
- Top 3 insights narrativos
- Recomendacoes priorizadas com impacto estimado
- Appendix com metodologia

## Validacao
- [ ] Executive summary em 3-5 bullets
- [ ] KPIs com targets, actuals e trends
- [ ] Insights seguem framework Context-Conflict-Resolution
- [ ] Visualizacoes adequadas ao tipo de dado
- [ ] Calibrado para a audiencia correta
- [ ] Recomendacoes quantificadas e priorizadas
- [ ] Sem jargao tecnico desnecessario
