---
task: define-image-treatments
responsavel: "@brand-identity-designer"
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

# Task: define-image-treatments

## Metadata
- **Agent:** brand-identity-designer (Iris)
- **Squad:** squad-brand
- **Trigger:** `*define-image-treatments`
- **Inputs:** Paleta, photography direction, graphic vocabulary
- **Outputs:** Image treatment rules document

## Description
Define tratamentos de imagem padrao — filtros, overlays, crops e adaptacoes por contexto.

## Steps
1. Definir filtros padrao: duotone (com cores da marca), overlay de cor, B&W, desaturated
2. Definir overlays: gradient (cores + direcao), textura, pattern
3. Definir crop rules: aspect ratios por uso (1:1, 16:9, 4:5, 3:2), safe zone para texto
4. Definir tratamento por contexto: social (vibrant), web (balanced), print (high-quality)
5. Criar exemplos antes/depois para cada tratamento
6. Documentar settings tecnicos (CSS filter values, blend modes, opacity)
7. Definir DON'Ts (filtros proibidos, distorcoes, over-processing)

## Validation Criteria
- Tratamentos sao reproduziveis (settings documentados)
- Exemplos antes/depois para cada tipo
- Adaptacao por contexto definida

## Output Format
Image treatment guide com filtros, overlays, crops, exemplos e settings tecnicos.
