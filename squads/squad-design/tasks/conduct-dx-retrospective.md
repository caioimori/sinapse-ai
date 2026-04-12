---
task: conduct-dx-retrospective
responsavel: "@design-orqx"
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

# Task: Conduct DX Retrospective

## Metadata
- **Squad:** squad-design
- **Agent:** Nexus (design-orqx)
- **Complexity:** Standard

## Objetivo
Conduzir retrospectiva do projeto DX — capturar aprendizados, medir resultados contra objetivos, e gerar recomendacoes para futuros projetos.

## Entrada
- DX Brief original (objetivos e metricas)
- Quality gate reports de todas as fases
- Timeline planejada vs real
- Feedback de stakeholders
- Handoff logs

## Passos

### 1. Comparar Planejado vs Realizado
| Dimensao | Planejado | Realizado | Delta |
|----------|-----------|-----------|-------|
| Timeline | | | |
| Escopo (features) | | | |
| Quality gates passados | | | |
| Iteracoes de QA | | | |
| Handoffs cross-squad | | | |

### 2. Avaliar Metricas de Qualidade
| Metrica | Target | Resultado | Status |
|---------|--------|-----------|--------|
| Lighthouse a11y | >= 95 | | |
| LCP (p75) | < 2.5s | | |
| INP (p75) | < 200ms | | |
| CLS (p75) | < 0.1 | | |
| Lighthouse performance | >= 90 | | |
| Test coverage | >= 80% | | |
| Design fidelity | >= 95% | | |

### 3. Coletar Feedback por Agente
Para cada agente ativo no projeto:
- O que funcionou bem?
- O que poderia melhorar?
- Blockers encontrados?
- Handoff friction?

### 4. Identificar Padroes
| Categoria | Observacao | Frequencia | Impacto |
|-----------|-----------|-----------|---------|
| Workflow | | | |
| Handoffs | | | |
| Quality | | | |
| Tooling | | | |
| Communication | | | |

### 5. Gerar Recomendacoes
```yaml
retrospective:
  project: ""
  date: ""

  what_went_well:
    - ""

  what_to_improve:
    - area: ""
      issue: ""
      recommendation: ""
      priority: "[high/medium/low]"

  action_items:
    - action: ""
      owner: ""
      deadline: ""

  process_improvements:
    - ""

  knowledge_captured:
    - topic: ""
      learning: ""
      applies_to: "[all projects / specific type]"
```

### 6. Atualizar Knowledge Base
- Registrar learnings na KB do squad
- Atualizar checklists se gaps identificados
- Propor ajustes em workflows se necessario

## Saida
- Retrospective report completo
- Action items com owners e deadlines
- Knowledge base updates
- Process improvement proposals

## Validacao
- [ ] Metricas comparadas (planejado vs real)
- [ ] Feedback de todos os agentes ativos coletado
- [ ] Padroes identificados e categorizados
- [ ] Recomendacoes priorizadas
- [ ] Action items atribuidos
- [ ] Knowledge base atualizada
