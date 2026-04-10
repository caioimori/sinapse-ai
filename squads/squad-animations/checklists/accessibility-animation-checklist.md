---
checklist: accessibility-animation-checklist
squad: squad-animations
description: "Checklist de acessibilidade especifico para animacoes web"
used_by:
  - ensure-animation-accessibility
  - review-animation-quality
---

# Accessibility Animation Checklist

## 1. prefers-reduced-motion (OBRIGATORIO)
- [ ] Media query implementada globalmente
- [ ] Todas as animacoes respeitam a preferencia
- [ ] Fallback: crossfade simples ou estado final direto
- [ ] Testado com setting ativado no OS

## 2. WCAG Compliance
- [ ] 2.3.1: Sem conteudo que pisca > 3x por segundo (Level A)
- [ ] 2.3.3: Animacoes de interacao podem ser desabilitadas (Level AAA)
- [ ] 2.2.2: Conteudo em movimento pode ser pausado (Level A)
- [ ] 1.4.12: Text spacing nao quebra com animacao (Level AA)

## 3. Motion Sickness Prevention
- [ ] Parallax suave, sem movimentos bruscos
- [ ] Sem zoom/scale extremo inesperado
- [ ] Sem rotacao continua de viewport
- [ ] Velocidade de scroll controlada
- [ ] Sem auto-scroll forcado

## 4. Focus Management
- [ ] Focus visivel durante e apos animacao
- [ ] Tab order preservado apos reorder animado
- [ ] Focus trap funciona em modals animados
- [ ] Skip links para secoes com animacao pesada

## 5. Screen Readers
- [ ] aria-hidden em elementos puramente decorativos
- [ ] aria-live para conteudo que atualiza por animacao
- [ ] aria-label descritivo em containers animados
- [ ] Texto real acessivel (nao apenas visual via CSS)
- [ ] role="img" com alt em canvas/SVG animados

## 6. Controls
- [ ] Botao pause/play para animacoes longas (> 5 segundos)
- [ ] Controle acessivel via teclado
- [ ] Estado do controle comunicado (aria-pressed)
- [ ] Animacao nao reinicia sem acao do usuario

## 7. Color and Contrast
- [ ] Contraste mantido durante todas as fases da animacao
- [ ] Informacao nao transmitida apenas por cor em movimento
- [ ] Estados hover/focus visiveis sem depender de animacao
- [ ] Texto legivel durante transicoes de background

## Implementacao Minima
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
