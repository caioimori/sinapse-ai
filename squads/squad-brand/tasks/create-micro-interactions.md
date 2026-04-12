---
task: create-micro-interactions
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

# Task: create-micro-interactions

## Metadata
- **Agent:** brand-motion-vfx (Flux)
- **Squad:** squad-brand
- **Trigger:** `*create-micro-interactions`
- **Inputs:** Motion language, design system componentes, easing curves
- **Outputs:** Micro-interaction specs + CSS/JS code por componente

## Description
Cria micro-interactions que diferenciam a marca — cada hover, click e transicao tem personalidade.

## Steps
1. **Button:** hover (scale 1.02 + shadow expand), press (shrink 0.98), loading (spinner com cor da marca), success (checkmark animate), error (shake 3x)
2. **Input:** focus (glow com cor primaria, border animate), typing (cursor pulse), validation success (icon slide-in), validation error (border shake + red)
3. **Card:** hover (lift 4px + shadow expand + subtle scale 1.01), click (press feedback 0.98)
4. **Navigation:** menu (slide from left/top), active indicator (underline slide), page indicator (dot scale)
5. **Feedback:** toast (slide-in from right + auto-dismiss), progress bar (fill with easing), skeleton (shimmer gradient loop), loading dots (bounce sequence)
6. **Toggle:** slide + color transition + check/X icon morph
7. Para cada: CSS @keyframes + transition values + JS trigger event
8. Definir prefers-reduced-motion alternatives (fade only, no motion)

## Validation Criteria
- 6+ componentes com micro-interactions
- Codigo CSS/JS para cada
- 60fps performance
- prefers-reduced-motion alternatives
- Alinhados com motion language

## Output Format
Micro-interaction spec per component + CSS keyframes + JS event triggers.
