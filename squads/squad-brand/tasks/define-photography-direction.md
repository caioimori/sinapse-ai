---
task: define-photography-direction
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

# Task: define-photography-direction

## Metadata
- **Agent:** brand-identity-designer (Iris)
- **Squad:** squad-brand
- **Trigger:** `*define-photography-direction`
- **Inputs:** Personalidade, moodboard, photography-styles.md
- **Outputs:** Photography style guide

## Description
Define direcao fotografica completa — estilo, iluminacao, composicao, color treatment, subjects e DON'Ts.

## Steps
1. Mapear personalidade para atributos fotograficos
2. Definir estilo principal: editorial, lifestyle, studio, documental
3. Definir iluminacao: natural, studio 3-point, dramatic, soft diffused
4. Definir composicao: rule of thirds, centered, asymmetric, negative space
5. Definir color treatment: natural, desaturated, high-contrast, duotone (com cores da marca)
6. Definir subjects permitidos: pessoas, produtos, ambientes, abstratos
7. Definir direcao de modelo: poses, expressoes, diversidade, autenticidade
8. Criar DON'Ts fotograficos (6+ exemplos do que evitar)
9. Adaptar por contexto: social, web hero, product shot, team photo, editorial
10. Criar 3-5 exemplos de referencia (fotos que representam o estilo)

## Validation Criteria
- Estilo e especifico (nao "fotos bonitas")
- DON'Ts sao claros com exemplos
- Qualquer fotografo/IA consegue reproduzir seguindo o guia
- Adaptacao por contexto (social ≠ web hero ≠ editorial)

## Output Format
Photography style guide com estilo, iluminacao, composicao, treatment, subjects, DON'Ts e exemplos.
