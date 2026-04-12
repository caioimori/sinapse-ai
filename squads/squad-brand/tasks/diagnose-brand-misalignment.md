---
task: diagnose-brand-misalignment
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

# Task: diagnose-brand-misalignment

## Metadata
- **Agent:** brand-auditor (Sentinel)
- **Squad:** squad-brand
- **Trigger:** `*diagnose-inconsistency` ou inconsistencia detectada
- **Inputs:** Elemento inconsistente, guidelines vigentes
- **Outputs:** Diagnosis report com causa raiz + recomendacao

## Description
Diagnostica inconsistencias de marca — identifica causa raiz e recomenda correcao + prevencao.

## Steps
1. Identificar o sintoma: o que exatamente esta inconsistente?
2. Rastrear a guideline violada (qual regra foi quebrada?)
3. Identificar causa raiz:
   - Guideline ausente (nao existe regra para isso)
   - Guideline mal interpretada (existe mas foi entendida errado)
   - Guideline ignorada (existe, foi entendida, mas nao seguida)
   - Guideline desatualizada (regra antiga que nao se aplica mais)
4. Mapear impacto: quais outros assets podem ter o mesmo problema?
5. Recomendar correcao com referencia a guideline especifica
6. Sugerir prevencao (como evitar que aconteca de novo)
7. Encaminhar para agente responsavel com diagnosis completo

## Validation Criteria
- Causa raiz identificada (nao apenas sintoma)
- Impacto mapeado (nao so o item imediato)
- Correcao e especifica e referencia guidelines
- Prevencao sugerida
- Agente responsavel identificado

## Output Format
Diagnosis report com sintoma, causa raiz, impacto, correcao, prevencao, responsavel.
