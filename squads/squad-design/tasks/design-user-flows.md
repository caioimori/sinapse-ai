---
task: design-user-flows
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

# Task: Design User Flows

## Metadata
- **Squad:** squad-design
- **Agent:** Compass (dx-ux-strategist)
- **Complexity:** Standard

## Objetivo
Projetar user flows detalhados para cada tarefa critica — documentar cada step, decisao, branch e estado do sistema que o usuario encontra.

## Entrada
- Personas e scenarios
- Journey maps (macro view)
- Information architecture
- Business rules e logic
- Error scenarios

## Passos

### 1. Identificar Flows Criticos
Priorizar por:
| Flow | Persona | Frequencia | Revenue Impact | Complexity |
|------|---------|-----------|---------------|-----------|
| | | | | |

### 2. Mapear Flow Completo
Para cada flow:

```yaml
user_flow:
  name: ""
  persona: ""
  trigger: ""  # O que inicia o flow
  goal: ""  # O que o usuario quer alcançar
  success_state: ""

  steps:
    - id: "step-1"
      type: "[action/decision/system/wait]"
      description: ""
      screen: ""
      inputs: []
      outputs: []
      next:
        success: "step-2"
        error: "error-1"

  decision_points:
    - id: "decision-1"
      question: ""
      options:
        - label: ""
          next: ""

  error_states:
    - id: "error-1"
      condition: ""
      message: ""
      recovery: ""

  edge_cases:
    - scenario: ""
      handling: ""
```

### 3. Identificar Happy Path vs Edge Cases
| Tipo | Descricao | Probabilidade |
|------|-----------|--------------|
| Happy Path | Fluxo ideal sem erros | ~70% |
| Alternate Path | Variacao valida | ~20% |
| Error Path | Algo deu errado | ~8% |
| Edge Case | Cenario raro | ~2% |

### 4. Mapear System States
Para cada step, definir o estado do sistema:
- Loading states
- Empty states
- Partial states
- Error states
- Success states

### 5. Validar Completude
- Todos os paths levam a um estado final?
- Todos os erros tem recovery?
- Existe sempre um "escape hatch"?
- O flow respeita a11y requirements?

## Saida
- User flow diagrams por flow critico
- Step-by-step documentation
- Error handling specifications
- Edge case documentation
- Handoff para Canvas (screen design) e Scaffold (implementation)

## Validacao
- [ ] Flows criticos mapeados
- [ ] Happy path + alternate + error paths
- [ ] Decision points documentados
- [ ] System states definidos
- [ ] Edge cases considerados
- [ ] Recovery paths existem para todos os erros
