---
task: create-loading-animation
responsavel: "@css-motion-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: loading_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: loading_animation
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Selecionar tipo (spinner, skeleton, progress, branded)"
  - "[ ] Implementar com CSS puro (zero JS)"
  - "[ ] Loop infinito suave"
  - "[ ] Usar cores do brand system"
  - "[ ] Tamanho configuravel"
---

# Task: Create Loading Animation

## Metadata
- **Agent:** css-motion-artist (Flux)
- **Squad:** squad-animations
- **Complexity:** LOW

## Objetivo
Criar animacoes de loading — spinners, skeletons, progress bars e branded loaders. Devem ser leves (CSS puro), acessiveis e comunicar progresso ou atividade de forma clara.

## Pre-Conditions
- Tipo de loading definido (indeterminate spinner vs determinate progress)
- Brand colors e tokens disponiveis
- Contexto de uso (button, page, content area, overlay)
- Tamanhos necessarios (sm, md, lg)

## Passos

### 1. Classificar Tipo de Loading
| Tipo | Quando Usar | Duracao Tipica |
|------|-------------|----------------|
| Spinner | Operacao curta (< 3s) | Indeterminate |
| Skeleton | Content loading, page load | Until content ready |
| Progress bar | Upload, download, steps | Determinate |
| Branded | Page initial load, splash | 1-3s fixed |
| Dots/pulse | Chat typing, processing | Indeterminate |

### 2. Implementar Spinner CSS Puro
```css
.spinner {
  width: var(--spinner-size, 24px);
  height: var(--spinner-size, 24px);
  border: 3px solid var(--color-border-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 3. Implementar Skeleton Loading
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 0%,
    var(--skeleton-shine) 50%,
    var(--skeleton-base) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}
@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 4. Implementar Progress Bar
```css
.progress-bar {
  height: 4px;
  background: var(--color-border-light);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 300ms ease-out;
  border-radius: 2px;
}
```

### 5. Implementar Dots Loader
```css
.dots span {
  display: inline-block;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: dot-pulse 1.2s ease-in-out infinite;
}
.dots span:nth-child(2) { animation-delay: 0.2s; }
.dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot-pulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
```

### 6. Configurar Tamanhos
| Size | Spinner | Skeleton Height | Contexto |
|------|---------|----------------|----------|
| sm | 16px | 12px | Inline, button |
| md | 24px | 16px | Content area |
| lg | 40px | 20px | Page level |
| xl | 64px | — | Full page overlay |

### 7. Acessibilidade
```html
<div class="spinner" role="status" aria-label="Loading...">
  <span class="sr-only">Loading...</span>
</div>
```
- `role="status"` para live region announcements
- `aria-label` descritivo
- `aria-busy="true"` no container de conteudo

### 8. Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .spinner { animation-duration: 1.5s; } /* Slower, not removed */
  .skeleton { animation: none; background: var(--skeleton-base); }
  .dots span { animation: none; opacity: 1; transform: none; }
}
```

### 9. Branded Loader
- Usar logo ou icone da marca como elemento animado
- Manter simples: scale, opacity ou rotation
- Duracao fixa: 1-3 segundos
- Considerar SVG animated logo

### 10. Timing de Exibicao
- Delay de 200ms antes de mostrar loader (evitar flash em cargas rapidas)
- Se carregamento > 3s, considerar progress indicator
- Transicao suave ao remover loader (fade-out 200ms)

## Output
- CSS puro com variantes de loading (spinner, skeleton, progress, dots)
- Tamanhos configuraveis via CSS custom properties
- Acessibilidade: role, aria-label, sr-only
- Reduced motion alternatives
- Demo HTML com todos tipos
- Guidelines de quando usar cada tipo

## Quality Criteria
- [ ] Zero JavaScript (CSS puro)
- [ ] Loops suaves sem micro-stutter
- [ ] Cores do brand system aplicadas
- [ ] role="status" e aria-label presentes
- [ ] prefers-reduced-motion respeitado
- [ ] Delay de 200ms antes de exibir
- [ ] Tamanhos configuraveis (CSS variables)
- [ ] Cross-browser sem prefixes necessarios
