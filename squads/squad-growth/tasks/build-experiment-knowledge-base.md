---
task: build-experiment-knowledge-base
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

# Task: Build Experiment Knowledge Base

## Metadata
- **Squad:** squad-growth
- **Agent:** Convert (ga-cro-specialist)
- **Complexity:** Standard

## Objetivo
Construir knowledge base de experimentos — documentar todos os testes, resultados, learnings e padroes para acelerar futuras decisoes de otimizacao.

## Entrada
- Completed experiment results
- Analysis reports
- Team learnings

## Passos

### 1. KB Entry Template
```yaml
experiment:
  id: "EXP-{number}"
  name: "{descriptive name}"
  date: "YYYY-MM-DD"
  owner: "Convert"
  status: "Completed"

  context:
    page: "/signup"
    audience: "All visitors"
    traffic: "1,500/day"
    duration: "21 days"

  hypothesis: "IF... THEN... BECAUSE..."

  result:
    verdict: "Winner/Loser/Inconclusive"
    primary_metric:
      name: "Form completion rate"
      control: "32%"
      variant: "41%"
      lift: "+28%"
      p_value: 0.003
      significant: true
    secondary_metrics: []
    guardrail_impact: "None"

  learnings:
    - "Reducing form fields from 8 to 4 increased completion by 28%"
    - "Mobile users showed 35% lift (higher than desktop 22%)"
    - "No impact on lead quality (guardrail maintained)"

  tags: ["forms", "signup", "simplification", "mobile"]
  related: ["EXP-003", "EXP-007"]
```

### 2. KB Organization
| Categoria | Filtros |
|-----------|---------|
| By page/flow | Homepage, signup, pricing, checkout |
| By element | Headlines, CTAs, forms, social proof, images |
| By result | Winners, losers, inconclusive |
| By metric | Conversion rate, bounce rate, engagement |
| By segment | Desktop, mobile, new, returning |
| By date | Quarter, year |

### 3. Pattern Recognition
| Pattern | Frequency | Insight | Confidence |
|---------|----------|---------|-----------|
| Shorter forms win | 4/5 tests | Simplification improves conversion | High |
| Social proof helps | 3/4 tests | Testimonials lift trust | Medium |
| CTA copy matters | 2/3 tests | Action-oriented > generic | Medium |
| Video beats image | 1/2 tests | Context-dependent | Low |

### 4. Anti-Patterns (What Doesn't Work)
| Anti-Pattern | Tests | Learning |
|-------------|-------|---------|
| | Count | Why it failed |

### 5. Searchability
| Feature | Implementation |
|---------|-------------|
| Full-text search | Search across all experiment entries |
| Tag filtering | Filter by tags (forms, mobile, etc.) |
| Date range | Filter by experiment date |
| Result filter | Show only winners/losers |
| Related experiments | Cross-link related tests |

## Saida
- Experiment knowledge base
- Pattern analysis document
- Anti-pattern documentation
- Searchable experiment catalog

## Validacao
- [ ] Todos os experimentos documentados
- [ ] Template consistente em todas as entradas
- [ ] Learnings extraidos e claros
- [ ] Patterns identificados
- [ ] Anti-patterns documentados
- [ ] KB acessivel e pesquisavel
- [ ] Tags aplicados para filterability
