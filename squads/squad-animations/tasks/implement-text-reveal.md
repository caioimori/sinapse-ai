---
task: implement-text-reveal
responsavel: "@scroll-narrative-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: text_reveal_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: text_reveal
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Selecionar tipo (word-by-word, line-by-line, char-by-char, highlight)"
  - "[ ] Vincular progresso ao scroll position"
  - "[ ] Configurar ScrollTrigger com scrub"
  - "[ ] Implementar split text"
  - "[ ] Garantir legibilidade durante reveal"
---

# Task: Implement Text Reveal

## Metadata
- **Agent:** scroll-narrative-engineer (Parallax)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Implementar text reveals driven por scroll — texto que aparece progressivamente conforme o scroll, word-by-word, line-by-line ou com highlight effect. Tecnica iconica de scroll storytelling (Apple style).

## Pre-Conditions
- Texto final definido e aprovado
- Tipo de reveal escolhido
- ScrollTrigger disponivel
- Font carregada (evitar FOUT durante reveal)

## Passos

### 1. Classificar Tipo de Text Reveal
| Tipo | Visual | Exemplo |
|------|--------|---------|
| Word-by-word opacity | Palavras clareiam progressivamente | Apple product pages |
| Line-by-line slide | Linhas deslizam de baixo | Editorial storytelling |
| Char-by-char | Caracteres aparecem sequencialmente | Typewriter scroll |
| Highlight sweep | Background color revela texto | Medium/blog style |
| Clip reveal | Texto revelado por clip-path | Premium feel |

### 2. Split Text para Animacao
```javascript
import SplitType from 'split-type';
const text = new SplitType('.reveal-text', {
  types: 'words', // ou 'lines', 'chars'
});
// Cada word/line/char recebe classe e index
```

### 3. Word-by-Word Opacity (Apple Style)
```javascript
const words = document.querySelectorAll('.reveal-text .word');
gsap.set(words, { opacity: 0.2 });
gsap.to(words, {
  opacity: 1,
  stagger: 0.05,
  scrollTrigger: {
    trigger: '.reveal-section',
    start: 'top 60%',
    end: 'bottom 40%',
    scrub: true,
  }
});
```

### 4. Line-by-Line Reveal
```javascript
const lines = document.querySelectorAll('.reveal-text .line');
gsap.from(lines, {
  opacity: 0,
  y: 20,
  stagger: 0.15,
  scrollTrigger: {
    trigger: '.reveal-section',
    start: 'top 70%',
    end: 'bottom 30%',
    scrub: 1,
  }
});
```

### 5. Highlight Sweep
```css
.highlight-word {
  background: linear-gradient(90deg, var(--color-highlight) 50%, transparent 50%);
  background-size: 200% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  transition: background-position 0.3s ease;
}
.highlight-word.active {
  background-position: 0 0;
}
```

### 6. Clip-Path Reveal
```javascript
gsap.from('.clip-reveal', {
  clipPath: 'inset(0 100% 0 0)',
  scrollTrigger: {
    trigger: '.clip-reveal',
    start: 'top 70%',
    end: 'top 30%',
    scrub: true,
  }
});
```

### 7. Color Transition Reveal
```javascript
// Texto comeca cinza, fica colorido conforme scroll
gsap.to(words, {
  color: 'var(--color-text)',
  stagger: 0.03,
  scrollTrigger: {
    trigger: '.reveal-section',
    start: 'top center',
    end: 'bottom center',
    scrub: true,
  }
});
// Initial: color: var(--color-text-muted)
```

### 8. Acessibilidade
```html
<!-- Texto completo acessivel para screen readers -->
<p class="reveal-text" aria-label="Full paragraph text here">
  <span class="word" aria-hidden="true">Each</span>
  <span class="word" aria-hidden="true">word</span>
  <!-- ... -->
</p>
```

### 9. Reduced Motion
```javascript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.set(words, { opacity: 1, color: 'var(--color-text)' });
  text.revert(); // Undo split
}
```

### 10. Cleanup
```javascript
function cleanup() {
  text.revert(); // Restore original HTML
  ScrollTrigger.getAll().forEach(st => st.kill());
}
```

## Output
- Text reveal scroll animation
- SplitType integration
- ScrollTrigger scrub configuration
- Multiple reveal style options
- Accessibility (aria-label, aria-hidden)
- Reduced motion fallback

## Quality Criteria
- [ ] Texto legivel durante TODA a revelacao
- [ ] Scroll scrub suave (sem pulos de palavras)
- [ ] Screen readers leem texto completo
- [ ] Font carregada antes do reveal iniciar
- [ ] prefers-reduced-motion: texto visivel instantaneo
- [ ] SplitType cleanup no unmount
- [ ] 60fps durante scroll reveal
- [ ] Start/end triggers nao cortam texto
