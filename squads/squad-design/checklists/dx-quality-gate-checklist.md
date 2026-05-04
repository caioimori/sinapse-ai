# DX Quality Gate Checklist

## Uso
Aplicar ANTES de entregar qualquer deliverable digital. Cobre UX, UI, design system, frontend, acessibilidade e performance. Os dois quality gates (a11y + performance) sao BLOQUEANTES.

## UX Quality
- [ ] Personas documentadas e consultadas
- [ ] User flows mapeados para tarefas principais
- [ ] Arquitetura de informacao validada
- [ ] Content hierarchy definida
- [ ] Nielsen's heuristics avaliadas (score >= 7/10 cada)
- [ ] Mobile experience considerada desde o inicio

## UI Quality
- [ ] Hierarquia visual clara (primary, secondary, tertiary)
- [ ] Grid system consistente (8pt base)
- [ ] Spacing consistente (usando tokens)
- [ ] Typography hierarchy clara (max 3-4 niveis)
- [ ] Color usage semantico (nao decorativo)
- [ ] Todos os component states desenhados (default, hover, active, focus, disabled, error)
- [ ] Dark mode projetado (se aplicavel)
- [ ] Mobile-first responsivo
- [ ] Empty states e error states projetados
- [ ] Design handoff specs completos

## Design System
- [ ] Tokens em 3 camadas (Primitive → Semantic → Component)
- [ ] Zero hardcoded values no codigo
- [ ] Naming convention consistente
- [ ] Component APIs documentadas
- [ ] Storybook stories completos por componente
- [ ] Dark mode via token redirection (nao duplicacao)
- [ ] Token export pipeline funcional

## Frontend
- [ ] Semantic HTML como baseline
- [ ] TypeScript strict mode
- [ ] Componentes testados (unit + integration)
- [ ] Responsivo testado em todos breakpoints
- [ ] Error boundaries implementados
- [ ] Loading states implementados
- [ ] Code splitting implementado
- [ ] Build sem warnings

## Accessibility (GATE BLOQUEANTE)
- [ ] WCAG 2.2 Level AA — audit automatizado (axe-core) = 0 critical
- [ ] Keyboard navigation funcional em TODA a pagina
- [ ] Focus visible em TODOS elementos interativos
- [ ] Contraste de cores verificado (WCAG 4.5:1 texto, 3:1 UI)
- [ ] ARIA patterns corretos por componente
- [ ] Screen reader testado (NVDA ou VoiceOver)
- [ ] Alt text em todas as imagens informativas
- [ ] Formularios com labels associados
- [ ] Skip navigation link presente
- [ ] prefers-reduced-motion respeitado
- [ ] Target size >= 24x24px (WCAG 2.5.8)
- [ ] Headings em ordem hierarquica (h1 → h2 → h3)

## Performance (GATE BLOQUEANTE)
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] Lighthouse Score >= 90
- [ ] JavaScript bundle < 300KB total
- [ ] CSS < 50KB
- [ ] Imagens otimizadas (WebP/AVIF, srcset, lazy loading)
- [ ] Fontes otimizadas (font-display, preconnect)
- [ ] Sem recursos render-blocking nao-essenciais
- [ ] Performance budget documentado

## Motion & Interaction
- [ ] Animacoes com proposito (nao decorativas)
- [ ] 60fps em todas as animacoes
- [ ] GPU-only properties (transform, opacity)
- [ ] prefers-reduced-motion respeitado
- [ ] Duracoes dentro da escala definida
- [ ] Easing curves da biblioteca (nao custom sem razao)

## Cross-Browser & Cross-Device
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] iOS Safari
- [ ] Chrome Android
- [ ] Tablet layout testado

## Score Minimo para Entrega
- UX Quality: >= 80%
- UI Quality: >= 85%
- Design System: >= 85%
- Frontend: >= 90%
- **Accessibility: 100% (BLOQUEANTE — todos obrigatorios)**
- **Performance: 100% (BLOQUEANTE — todos obrigatorios)**
- Motion: >= 80%
- Cross-Browser: 100% (todos obrigatorios)
