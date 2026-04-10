---
task: generate-animation-report
responsavel: "@animations-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: pipeline_status
    tipo: object
    origem: "manage-animation-pipeline"
    obrigatorio: true
  - campo: quality_verdict
    tipo: object
    origem: "review-animation-quality"
    obrigatorio: false

Saida:
  - campo: animation_report
    tipo: document
    destino: "usuario ou squad externa"

Checklist:
  - "[ ] Compilar resultados do pipeline"
  - "[ ] Incluir metricas de performance"
  - "[ ] Listar decisoes tecnicas tomadas"
  - "[ ] Documentar assets entregues"
  - "[ ] Gerar recomendacoes de melhoria"
---

# Task: Generate Animation Report

## Metadata
- **Agent:** animations-orqx (Kinetic)
- **Squad:** squad-animations
- **Complexity:** LOW

## Objetivo
Gerar relatorio completo do projeto de animacao executado.
