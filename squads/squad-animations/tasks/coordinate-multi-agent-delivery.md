---
task: coordinate-multi-agent-delivery
responsavel: "@animations-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: execution_plan
    tipo: document
    origem: "orchestrate-animation-project"
    obrigatorio: true
  - campo: agent_outputs
    tipo: array
    origem: "agentes especializados"
    obrigatorio: true

Saida:
  - campo: integrated_delivery
    tipo: document
    destino: "review-animation-quality"

Checklist:
  - "[ ] Coletar outputs de cada agente"
  - "[ ] Verificar compatibilidade entre partes"
  - "[ ] Integrar codigo de multiplos agentes"
  - "[ ] Resolver conflitos de implementacao"
  - "[ ] Validar resultado integrado"
---

# Task: Coordinate Multi-Agent Delivery

## Metadata
- **Agent:** animations-orqx (Kinetic)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Coordenar a entrega quando multiplos agentes trabalham no mesmo projeto, integrando outputs e resolvendo conflitos.
