---
task: optimize-resources
responsavel: "@performance-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Optimize Resources

## Metadata
- **Agent:** performance-engineer (Lighthouse)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Otimizar recursos (images, JS, CSS, fonts) para melhorar performance de LPs.

## Steps

1. **Image optimization** - Formato: WebP/AVIF (30-50% menor que JPEG). Lazy loading: images abaixo do fold. Srcset: imagens responsivas por viewport. Compressao: quality 80-85% (imperceptivel). Hero image: preload com priority hint
2. **JavaScript optimization** - Identify unused JS (Chrome Coverage tool). Code splitting: carregar apenas o necessario. Defer/async: scripts nao criticos. Third-party audit: quais scripts sao necessarios?
3. **CSS optimization** - Critical CSS inline no head. Unused CSS removal (PurgeCSS). Minification. Preload de stylesheets criticos
4. **Font optimization** - font-display: swap (evitar FOIT). Preload de fonts criticas. Subset: carregar apenas caracteres necessarios. System font stack como fallback
5. **Third-party scripts** - Auditar cada script: necessario? Defer scripts de analytics (nao bloqueiam render). Lazy load widgets (chat, social). Tag Manager: otimizar firing order

## Output
Resource optimization plan com tamanho antes/depois e impacto estimado.

## Quality Gates
- [ ] Images no formato otimo
- [ ] JS unused removido ou deferred
- [ ] CSS critical inline
- [ ] Fonts otimizadas
- [ ] Third-party scripts auditados

## Quando Usar
- Apos Lighthouse audit com score baixo
- Quando page load time > 3s
