---
task: define-motion-language
responsavel: "@brand-motion-vfx"
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

# Task: define-motion-language

## Metadata
- **Agent:** brand-motion-vfx (Flux)
- **Squad:** squad-brand
- **Trigger:** `*define-motion-language`
- **Inputs:** Personalidade da marca, design system tokens, componentes
- **Outputs:** Motion principles + easing curves + duration scale

## Description
Define linguagem de movimento da marca — como a marca se MOVE expressa sua personalidade.

## Steps
1. Derivar motion principles (3-5 regras) da personalidade:
   - Ex energetica: "Movimento rapido com bounce", "Entradas dramaticas"
   - Ex premium: "Movimento suave e controlado", "Transicoes elegantes"
2. Definir easing curves padrao:
   - Entrada (elements appearing): ease-out / cubic-bezier(0, 0, 0.2, 1)
   - Saida (elements leaving): ease-in / cubic-bezier(0.4, 0, 1, 1)
   - Transicao (state change): ease-in-out / cubic-bezier(0.4, 0, 0.2, 1)
   - Custom (brand signature): cubic-bezier(custom values)
3. Definir duration scale:
   - micro: 100ms (button feedback, toggle)
   - small: 200ms (hover effects, small reveals)
   - medium: 300ms (modals, drawers, page elements)
   - large: 500ms (page transitions, hero animations)
   - xl: 800ms (complex sequences, brand moments)
4. Definir stagger pattern: 50ms entre items em listas/grids
5. Definir spring physics se personalidade energetica (tension, friction, mass)
6. Documentar com exemplos CSS (keyframes + transition values)
7. Definir prefers-reduced-motion alternatives

## Validation Criteria
- 3-5 motion principles com justificativa
- Easing curves para 3 tipos de movimento
- Duration scale de 5 niveis
- prefers-reduced-motion respeitado
- Codigo CSS documentado

## Output Format
Motion language doc com principles, curves, durations, stagger, CSS code.
