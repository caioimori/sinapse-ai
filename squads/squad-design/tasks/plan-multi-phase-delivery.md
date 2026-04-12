---
task: plan-multi-phase-delivery
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

# Task: Plan Multi-Phase Delivery

## Metadata
- **Squad:** squad-design
- **Agent:** Nexus (design-orqx)
- **Complexity:** Standard

## Objetivo
Planejar a entrega de projetos complexos em fases incrementais — definir milestones, dependencias entre fases, e criterios de progressao.

## Entrada
- DX Brief completo
- Workflow selecionado
- Estimativas de esforco por agente
- Constraints de timeline do cliente

## Passos

### 1. Decompor em Milestones
Para cada tipo de projeto:

| Tipo | Milestones Tipicos |
|------|--------------------|
| New Build | Discovery → Wireframes → Visual Design → Design System → MVP Frontend → Polish → Launch |
| Redesign | Audit → Strategy → Design → Migration Plan → Incremental Build → QA → Launch |
| Design System | Foundation → Primitives → Core Components → Patterns → Documentation → Adoption |
| Landing Page | Brief → Copy+Design → Build → QA → Launch |

### 2. Mapear Dependencias
```yaml
delivery_plan:
  project: ""
  total_phases: 0

  phases:
    - id: "phase-1"
      name: ""
      agents: []
      duration_estimate: ""
      depends_on: []
      deliverables: []
      gate: ""

    - id: "phase-2"
      name: ""
      agents: []
      duration_estimate: ""
      depends_on: ["phase-1"]
      deliverables: []
      gate: ""
```

### 3. Identificar Paralelismo
| Combinacao | Paralelizavel? | Condicao |
|-----------|---------------|----------|
| UX Research + Brand Tokens | Sim | Sem dependencia |
| Visual Design + IA | Parcial | IA informa layouts |
| Component Build + Documentation | Sim | Doc pode iniciar com API spec |
| A11y Audit + Performance Audit | Sim | Independentes |
| Frontend Build + Motion Design | Parcial | Motion specs informam implementacao |

### 4. Definir Criterios de Progressao
Cada fase tem criterios claros para avancar:
- Deliverables completos e aprovados
- Quality gate da fase passado
- Handoffs documentados
- Stakeholder sign-off (se aplicavel)

### 5. Calcular Timeline
- Somar duracoes sequenciais
- Aplicar reducao por paralelismo
- Adicionar buffer (15-20% para standard, 25-30% para complex)
- Validar contra constraints do cliente

## Saida
- Delivery plan com fases, dependencias e timeline
- Diagrama de Gantt simplificado (texto)
- Criterios de progressao por fase
- Riscos e mitigacoes identificados

## Validacao
- [ ] Todas as fases mapeadas
- [ ] Dependencias corretas (sem ciclos)
- [ ] Paralelismo identificado
- [ ] Timeline realista com buffer
- [ ] Criterios de progressao definidos
