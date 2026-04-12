---
task: validate-phase-output
responsavel: "@brand-auditor"
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

# Task: validate-phase-output

## Metadata
- **Agent:** brand-auditor (Sentinel)
- **Squad:** squad-brand
- **Trigger:** `*validate-phase` ou phase gate no workflow
- **Inputs:** Outputs da fase atual, guidelines vigentes
- **Outputs:** Phase gate report com decisao

## Description
Valida output de uma fase especifica antes de permitir transicao para proxima.

## Steps
1. Identificar fase: strategy | visual | assets | system | final
2. Carregar checklist especifico da fase
3. Avaliar cada item (0-5) com justificativa escrita:
   - 0: Ausente
   - 1: Presente mas incorreto
   - 2: Parcialmente correto, gaps significativos
   - 3: Correto mas pode melhorar
   - 4: Bom, atende requisitos
   - 5: Excelente, supera expectativa
4. Calcular media ponderada
5. Decisao:
   - **APPROVED (>=4.0):** prosseguir para proxima fase
   - **NEEDS REVISION (3.0-3.9):** listar correcoes especificas, retornar ao agente
   - **REJECTED (<3.0):** retrabalho significativo necessario, escalar para Meridian
6. Gerar phase gate report

## Validation Criteria
- Cada item avaliado com score E justificativa
- Decisao formal com threshold claro
- Se NEEDS REVISION: correcoes sao especificas e acionaveis
- Report documentado para auditoria

## Output Format
Phase gate report com item scores, media, decisao e lista de correcoes.
