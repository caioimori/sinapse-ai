---
task: manage-animation-pipeline
responsavel: "@animations-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: pipeline_state
    tipo: object
    origem: "sistema interno"
    obrigatorio: true

Saida:
  - campo: pipeline_status
    tipo: object
    destino: "generate-animation-report"

Checklist:
  - "[ ] Monitorar status de cada fase"
  - "[ ] Detectar bloqueios e gargalos"
  - "[ ] Realocar agentes se necessario"
  - "[ ] Atualizar timeline estimada"
  - "[ ] Comunicar progresso"
---

# Task: Manage Animation Pipeline

## Metadata
- **Agent:** animations-orqx (Kinetic)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Gerenciar o andamento do pipeline de animacao, identificando problemas e mantendo o fluxo.
