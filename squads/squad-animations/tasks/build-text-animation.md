---
task: build-text-animation
responsavel: "@css-motion-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: text_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: text_animation
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Selecionar tipo (split chars, split words, split lines, typewriter, scramble)"
  - "[ ] Implementar splitting com SplitType ou manual"
  - "[ ] Configurar stagger timing"
  - "[ ] Definir easing por caractere/palavra"
  - "[ ] Garantir acessibilidade (aria-label no container)"
  - "[ ] Limpar DOM apos animacao se necessario"
---

# Task: Build Text Animation

## Metadata
- **Agent:** css-motion-artist (Flux)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Criar animacoes de texto — split characters, word reveals, line-by-line entrances, typewriter effects e text scramble. Manter legibilidade e acessibilidade como prioridade maxima.

## Pre-Conditions
- Texto final definido (nao animar texto placeholder)
- Font carregada antes da animacao iniciar (FOUT prevention)
- Acessibilidade: texto completo disponivel para screen readers
- Trigger definido (page load, scroll, click)

## Passos

### 1. Classificar Tipo de Text Animation
| Tipo | Complexidade | Melhor Para |
|------|-------------|-------------|
| Fade-in words | Baixa | Subtitulos, paragrafos |
| Split characters | Media | Headlines, hero text |
| Line reveal | Media | Paragrafos, quotes |
| Typewriter | Baixa | Terminal, code, chat |
| Scramble/decode | Alta | Tech, cyber, reveal |
| Clip reveal | Media | Headlines com impacto |

### 2. Implementar Split Characters
```javascript
// SplitType approach
import SplitType from 'split-type';
const text = new SplitType('.headline', { types: 'chars' });
// Cada char recebe classe .char e CSS variable --char-index
```
```css
.headline .char {
  opacity: 0;
  transform: translateY(20px);
  animation: char-in 400ms ease-out both;
  animation-delay: calc(var(--char-index) * 30ms);
}
@keyframes char-in {
  to { opacity: 1; transform: translateY(0); }
}
```

### 3. Implementar Line Reveal (Clip)
```css
.line-reveal {
  clip-path: inset(0 100% 0 0);
  animation: reveal-line 600ms cubic-bezier(0.77, 0, 0.18, 1) both;
}
@keyframes reveal-line {
  to { clip-path: inset(0 0% 0 0); }
}
```

### 4. Implementar Typewriter
```css
.typewriter {
  width: 0;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid currentColor;
  animation:
    typing 2s steps(30) forwards,
    blink 0.5s step-end infinite;
}
@keyframes typing { to { width: 100%; } }
@keyframes blink { 50% { border-color: transparent; } }
```

### 5. Implementar Word Stagger
```css
.word {
  display: inline-block;
  opacity: 0;
  transform: translateY(8px);
  animation: word-in 300ms ease-out both;
  animation-delay: calc(var(--word-index) * 60ms);
}
@keyframes word-in {
  to { opacity: 1; transform: translateY(0); }
}
```

### 6. Configurar Stagger Timing
| Elementos | Stagger | Total Maximo |
|-----------|---------|-------------|
| 1-10 chars | 30-50ms | 500ms |
| 10-30 chars | 20-30ms | 800ms |
| 30+ chars | 15-20ms | 1000ms |
| Words | 50-80ms | 800ms |
| Lines | 100-150ms | 600ms |

### 7. Garantir Acessibilidade
```html
<!-- Screen reader ve texto completo -->
<h1 class="headline" aria-label="Welcome to our platform">
  <span class="char" aria-hidden="true">W</span>
  <span class="char" aria-hidden="true">e</span>
  <!-- ... -->
</h1>
```

### 8. Prevenir FOUT (Flash of Unstyled Text)
```css
.headline {
  font-display: block;
  visibility: hidden;
}
.fonts-loaded .headline {
  visibility: visible;
}
```

### 9. Cleanup DOM apos Animacao
```javascript
// Reverter split apos animacao
text.revert(); // SplitType cleanup
```

### 10. Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .headline .char, .word, .line-reveal, .typewriter {
    animation: none;
    opacity: 1;
    transform: none;
    clip-path: none;
    width: auto;
  }
}
```

## Output
- Codigo CSS/JS para text animation escolhida
- SplitType integration se necessario
- Acessibilidade: aria-label, aria-hidden
- Reduced motion fallback
- FOUT prevention strategy
- Demo HTML com texto animado

## Quality Criteria
- [ ] Texto legivel durante TODA a animacao
- [ ] Screen readers leem texto completo (aria-label)
- [ ] Font carregada antes da animacao iniciar
- [ ] Stagger total nao excede 1 segundo
- [ ] prefers-reduced-motion mostra texto instantaneo
- [ ] DOM limpo apos animacao (revert split)
- [ ] 60fps durante split animation
- [ ] Cross-browser (SplitType polyfill se necessario)
