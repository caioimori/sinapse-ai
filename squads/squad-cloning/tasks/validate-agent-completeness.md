---
task: validate-agent-completeness
responsavel: "@agent-forger"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "pipeline"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "next phase"

Checklist:
  - "[ ] Validar inputs"
  - "[ ] Executar steps"
  - "[ ] Verificar qualidade"
  - "[ ] Gerar output"
---

# Task: validate-agent-completeness

## Metadata
- **Agent:** agent-forger (Forge)
- **Squad:** squad-cloning
- **Complexity:** STANDARD

## Objetivo
Validar contra standards

## Steps
1. Receber inputs da fase anterior
2. Executar operacao principal
3. Validar output contra criterios
4. Entregar artefato para proxima fase

## Criterios de Qualidade
- Output segue formato esperado
- Nenhum dado inventado
- Tags de confianca aplicadas
- Gaps documentados
