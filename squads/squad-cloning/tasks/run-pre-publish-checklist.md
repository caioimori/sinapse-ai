---
task: run-pre-publish-checklist
responsavel: "@squad-assembler"
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

# Task: run-pre-publish-checklist

## Metadata
- **Agent:** squad-assembler (Assembly)
- **Squad:** squad-cloning
- **Complexity:** STANDARD

## Objetivo
Executar pre-deploy checklist

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
