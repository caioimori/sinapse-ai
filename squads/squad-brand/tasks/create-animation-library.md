---
task: create-animation-library
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

# Task: create-animation-library

## Metadata
- **Agent:** brand-motion-vfx (Flux)
- **Squad:** squad-brand
- **Trigger:** `*create-animation-library`
- **Inputs:** Motion language, micro-interactions, page transitions, video templates
- **Outputs:** Animation library em 3 formatos (CSS, Lottie, AE)

## Description
Compila TODAS as animacoes em biblioteca reutilizavel organizada por categoria.

## Steps
1. Organizar por categoria:
   - **Entrances:** fade-in, slide-up, slide-left, scale-in, flip-in, bounce-in
   - **Exits:** fade-out, slide-down, slide-right, scale-out, flip-out
   - **Emphasis:** pulse, shake, bounce, wiggle, heartbeat, flash
   - **Loading:** spinner, dots-bounce, skeleton-shimmer, progress-fill
   - **Transitions:** crossfade, slide-over, morph, stagger-cascade
2. Para cada animacao documentar: duration, easing, delay, iteration
3. Exportar em 3 formatos:
   - CSS @keyframes (para web)
   - Lottie JSON (para apps e web)
   - After Effects presets (para video)
4. Criar naming convention: `brand-{category}-{name}` (ex: `brand-entrance-fade-in`)
5. Documentar uso recomendado (quando usar cada animacao)
6. Incluir prefers-reduced-motion variants

## Validation Criteria
- 20+ animacoes organizadas em 5 categorias
- 3 formatos de export
- Naming convention consistente
- Documentacao de uso
- prefers-reduced-motion

## Output Format
/animation-library/ com css/, lottie/, ae-presets/ + catalog doc.
