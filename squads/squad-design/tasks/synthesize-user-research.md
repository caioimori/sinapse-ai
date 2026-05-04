---
task: synthesize-user-research
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

# Task: Synthesize User Research

## Metadata
- **Squad:** squad-design
- **Agent:** Compass (dx-ux-strategist)
- **Complexity:** Complex

## Objetivo
Sintetizar dados de pesquisa com usuarios em insights acionaveis — transformar dados brutos (entrevistas, surveys, analytics) em findings estruturados que informam decisoes de design.

## Entrada
- Dados brutos de pesquisa (transcrições, recordings, notas)
- Dados quantitativos (surveys, analytics, heatmaps)
- Contexto do projeto (DX Brief, objectives)
- Research plan original

## Passos

### 1. Organizar Dados por Fonte
| Fonte | Tipo | Volume | Confiabilidade |
|-------|------|--------|---------------|
| Entrevistas | Qualitativo | N participantes | Alta (direto) |
| Surveys | Quantitativo | N respostas | Media (self-report) |
| Analytics | Quantitativo | N sessoes | Alta (comportamental) |
| Usability tests | Misto | N sessoes | Alta (observado) |
| Heatmaps | Quantitativo | N clicks/scrolls | Alta (comportamental) |

### 2. Codificar Dados Qualitativos
Aplicar coding framework:
- **Aberto:** Identificar temas emergentes
- **Axial:** Agrupar codigos em categorias
- **Seletivo:** Identificar temas centrais

### 3. Triangular Fontes
Cruzar findings entre fontes para validar:
| Finding | Entrevistas | Survey | Analytics | Confianca |
|---------|-----------|--------|-----------|-----------|
| | [Sim/Nao] | [Sim/Nao] | [Sim/Nao] | [Alta/Media/Baixa] |

### 4. Priorizar Insights
Usar Impact-Frequency Matrix:
| | Alta Frequencia | Baixa Frequencia |
|--|----------------|-----------------|
| **Alto Impacto** | P0 — Critico | P1 — Importante |
| **Baixo Impacto** | P2 — Quick Win | P3 — Nice-to-have |

### 5. Documentar Insights
```yaml
research_synthesis:
  project: ""
  date: ""
  sources: []
  total_participants: 0

  key_insights:
    - id: "INS-001"
      insight: ""
      evidence:
        - source: ""
          data_point: ""
      confidence: "[high/medium/low]"
      priority: "[P0/P1/P2/P3]"
      design_implication: ""

  themes:
    - name: ""
      insights: []
      design_opportunity: ""

  recommendations:
    - recommendation: ""
      supporting_insights: []
      effort: "[low/medium/high]"
      impact: "[low/medium/high]"
```

### 6. Criar Artifacts de Saida
- Affinity diagram (agrupamento visual)
- Insight cards (1 por insight)
- Recommendations deck (priorizadas)
- Raw data appendix

## Saida
- Research synthesis report
- Prioritized insight list
- Design recommendations
- Handoff para Canvas (visual design) e Stratum (system implications)

## Validacao
- [ ] Todas as fontes de dados processadas
- [ ] Triangulacao entre >= 2 fontes
- [ ] Insights priorizados por impact/frequency
- [ ] Design implications claras para cada insight
- [ ] Recommendations acionaveis
