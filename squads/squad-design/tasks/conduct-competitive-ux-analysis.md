---
task: conduct-competitive-ux-analysis
responsavel: "@dx-ux-strategist"
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

# Task: Conduct Competitive UX Analysis

## Metadata
- **Squad:** squad-design
- **Agent:** Compass (dx-ux-strategist)
- **Complexity:** Standard

## Objetivo
Analisar a experiencia do usuario em produtos concorrentes e benchmarks — identificar padroes, gaps e oportunidades de diferenciacao.

## Entrada
- Lista de concorrentes diretos e indiretos
- Features/fluxos a comparar
- Personas do projeto (para perspectiva de analise)
- Industry benchmarks

## Passos

### 1. Selecionar Concorrentes
| Tipo | Quantidade | Criterio |
|------|-----------|----------|
| Diretos | 3-5 | Mesmo mercado, mesma solucao |
| Indiretos | 2-3 | Mercado adjacente, solucao alternativa |
| Aspiracionais | 1-2 | Melhor UX do setor, benchmark |

### 2. Definir Dimensoes de Analise
| Dimensao | O que avaliar |
|----------|--------------|
| Onboarding | First-time experience, time-to-value |
| Navigation | IA, findability, navigation patterns |
| Core Flows | Tarefas principais, steps, friction |
| Visual Design | Consistencia, modernidade, brand |
| Mobile | Responsividade, mobile-first features |
| Performance | Load time, perceived speed |
| Accessibility | WCAG compliance, keyboard nav |
| Content | Qualidade, tom, helpfulness |
| Error Handling | Mensagens, recovery, prevention |
| Delight | Micro-interactions, surprises, polish |

### 3. Heuristic Walkthrough por Concorrente
Para cada concorrente, executar fluxos-chave como cada persona:
```yaml
competitive_walkthrough:
  competitor: ""
  persona: ""
  flow: ""
  steps_to_complete: 0
  friction_points: []
  delighters: []
  overall_score: "/10"
  notes: ""
```

### 4. Criar Feature Matrix
| Feature/Pattern | Nosso | Comp A | Comp B | Comp C | Best Practice |
|----------------|-------|--------|--------|--------|--------------|
| | | | | | |

### 5. Identificar Oportunidades
| Tipo | Descricao | Fonte |
|------|-----------|-------|
| Gap | Ninguem faz bem | Oportunidade de lideranca |
| Table Stakes | Todos fazem, nos tambem devemos | Paridade |
| Differentiator | Poucos fazem, alto valor | Vantagem competitiva |
| Delight | Ninguem faz, usuarios adorariam | Wow factor |

### 6. Documentar Patterns
Catalogar design patterns observados:
- Navegacao patterns mais eficazes
- Onboarding flows com melhor conversao
- Error handling exemplar
- Mobile patterns inovadores

## Saida
- Competitive UX analysis report
- Feature comparison matrix
- Pattern library (best practices observadas)
- Opportunity map priorizado
- Recommendations para diferenciacao

## Validacao
- [ ] Minimo 5 concorrentes analisados
- [ ] Dimensoes de analise cobertas
- [ ] Walkthroughs executados por persona
- [ ] Feature matrix completa
- [ ] Oportunidades categorizadas e priorizadas
