---
task: create-scroll-storytelling
responsavel: "@scroll-narrative-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: story_content
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: scroll_story
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Mapear narrativa em secoes scrollaveis"
  - "[ ] Definir trigger points por secao"
  - "[ ] Implementar transicoes entre secoes"
  - "[ ] Sincronizar texto, imagens e animacoes"
  - "[ ] Criar progress indicator"
  - "[ ] Testar flow narrativo completo"
---

# Task: Create Scroll Storytelling

## Metadata
- **Agent:** scroll-narrative-engineer (Parallax)
- **Squad:** squad-animations
- **Complexity:** CRITICAL

## Objetivo
Criar experiencia de storytelling baseada em scroll, onde a narrativa se desenrola conforme o usuario scrolla. Combina pinned sections, text reveals, image transitions e animacoes sincronizadas em uma jornada coesa.

## Pre-Conditions
- Narrativa/conteudo completo definido
- Secoes e capitulos mapeados
- Assets (imagens, videos, ilustracoes) disponveis
- Motion choreography definida pelo motion-choreographer
- Performance budget (stories sao pesadas)

## Passos

### 1. Mapear Narrativa em Secoes
| Secao | Tipo | Scroll Distance | Conteudo |
|-------|------|----------------|----------|
| Intro | Pinned | 150vh | Hero + text reveal |
| Chapter 1 | Scroll | 200vh | Parallax + images |
| Transition | Pinned | 100vh | Color shift + morphing |
| Chapter 2 | Horizontal | 300vh | Gallery/timeline |
| Conclusion | Scroll | 150vh | CTA + summary |

### 2. Criar Wrapper Structure
```html
<article class="scroll-story">
  <section class="story-chapter" data-chapter="intro">
    <div class="sticky-content"><!-- Pinned content --></div>
  </section>
  <section class="story-chapter" data-chapter="1">
    <div class="scroll-content"><!-- Free scroll --></div>
  </section>
  <!-- ... -->
</article>
```

### 3. Implementar Master Timeline
```javascript
const masterTL = gsap.timeline();
// Each section has its own ScrollTrigger
chapters.forEach((chapter, i) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: chapter,
      start: 'top top',
      end: chapter.dataset.pin ? `+=${chapter.dataset.duration}` : 'bottom top',
      pin: !!chapter.dataset.pin,
      scrub: 1,
    }
  });
  // Add chapter-specific animations to tl
  buildChapterAnimations(tl, chapter);
});
```

### 4. Sincronizar Texto e Imagens
```javascript
function buildChapterAnimations(tl, chapter) {
  const texts = chapter.querySelectorAll('.story-text');
  const images = chapter.querySelectorAll('.story-image');
  // Text fades in, then image, then text out
  texts.forEach((text, i) => {
    tl.from(text, { opacity: 0, y: 30 }, i * 0.3)
      .from(images[i], { opacity: 0, scale: 0.95 }, i * 0.3 + 0.15);
  });
}
```

### 5. Transicoes entre Capitulos
```javascript
// Background color transition between chapters
gsap.to('.scroll-story', {
  backgroundColor: chapter.dataset.bgColor,
  scrollTrigger: {
    trigger: chapter,
    start: 'top 80%',
    end: 'top 20%',
    scrub: true,
  }
});
```

### 6. Progress Indicator com Chapter Labels
```javascript
const chapters = gsap.utils.toArray('.story-chapter');
chapters.forEach((chapter, i) => {
  const dot = document.querySelector(`.progress-dot[data-index="${i}"]`);
  ScrollTrigger.create({
    trigger: chapter,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => dot.classList.add('active'),
    onLeaveBack: () => dot.classList.remove('active'),
  });
});
```

### 7. Audio/Video Sync (Opcional)
```javascript
// Play video when chapter is in view
ScrollTrigger.create({
  trigger: '.video-chapter',
  start: 'top center',
  end: 'bottom center',
  onEnter: () => video.play(),
  onLeave: () => video.pause(),
  onEnterBack: () => video.play(),
  onLeaveBack: () => video.pause(),
});
```

### 8. Mobile Adaptation
- Reduzir pin durations em 30-50%
- Simplificar animacoes paralelas para sequenciais
- Remover parallax layers
- Considerar 1-column layout vertical

### 9. Performance Optimization
- Lazy load images/videos fora do viewport
- Unpin sections ja passadas (`onLeave: () => st.kill()`)
- Limit simultaneous ScrollTriggers ativos
- Use `gsap.set()` para estados iniciais (nao animate from hidden)

### 10. Testing Checklist
- Scroll suave do inicio ao fim sem jank
- Cada transicao de capitulo fluida
- Back-scroll funciona (reverse animations)
- Mobile touch scroll funcional
- Progress indicator sincronizado
- prefers-reduced-motion: all content visible, no animation

## Output
- Complete scroll storytelling experience
- Chapter-based ScrollTrigger setup
- Text/image/video synchronization
- Progress indicator com chapter labels
- Mobile-adapted version
- Performance optimizations

## Quality Criteria
- [ ] Narrativa fluida do inicio ao fim
- [ ] 60fps durante todo o scroll
- [ ] Transicoes entre capitulos suaves
- [ ] Progress indicator atualiza corretamente
- [ ] Mobile: funcional com touch scroll
- [ ] Back-scroll reverte animacoes
- [ ] prefers-reduced-motion: conteudo acessivel
- [ ] Lazy loading ativo para assets pesados
