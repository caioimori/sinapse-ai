---
task: create-page-transitions
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

# Task: create-page-transitions

## Metadata
- **Agent:** brand-motion-vfx (Flux)
- **Squad:** squad-brand
- **Trigger:** `*create-page-transitions`
- **Inputs:** Motion language, design system, web templates
- **Outputs:** Page transition specs + scroll animation specs + code

## Description
Define transicoes entre paginas e scroll-triggered animations.

## Steps
1. **Page transitions:** fade (universal), slide (lateral=navegacao, vertical=progresso), morph (shared elements), stagger-children (grid items cascade)
2. **Timing:** exit animation (200ms) + delay (100ms) + enter animation (300ms) = 600ms total
3. **Elements:** nav persists (no animation), content animates, hero morphs if applicable
4. **Scroll animations:**
   - Reveal-on-scroll: fade-up para content sections (threshold 0.2)
   - Parallax: background move at 0.5x scroll speed
   - Sticky sections: pin during scroll (for storytelling)
   - Progress indicators: scroll-linked progress bar
   - Number counters: animate from 0 to value on viewport entry
5. Implementar com IntersectionObserver (NAO scroll events — performance)
6. Definir prefers-reduced-motion: disable parallax, use fade-only
7. Documentar CSS + JS implementation

## Validation Criteria
- 4+ tipos de page transition
- 5+ tipos de scroll animation
- IntersectionObserver (nao scroll events)
- prefers-reduced-motion
- 60fps performance

## Output Format
Transition/scroll specs + CSS + JS IntersectionObserver code.
