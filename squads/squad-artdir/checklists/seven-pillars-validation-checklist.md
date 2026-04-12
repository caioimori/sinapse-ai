# 7 Pillars Validation Checklist

> Use este checklist para validar qualquer entrega de art direction contra os 7 pilares.
> Cada item e binario (pass/fail). Score minimo por pilar: 6/10 para PASS.

---

## Pilar 1: Visual Hierarchy & Controlled Attention

- [ ] Focal point claro por viewport (Von Restorff applied)
- [ ] Heading hierarchy consistente (h1 > h2 > h3, sem pulos)
- [ ] Accent color APENAS em elementos de conversao
- [ ] Reading pattern adequado ao tipo de conteudo (F, Z, layer cake)
- [ ] Hick's Law: max 3 opcoes de CTA por viewport
- [ ] Fitts's Law: CTAs min 44x44px, proximos ao conteudo convincente
- [ ] Gestalt proximity: elementos relacionados agrupados
- [ ] Gestalt figure/ground: separacao clara conteudo vs fundo
- [ ] Nenhum viewport sem hierarquia clara
- [ ] Atencao direcionada para conversao, nao para decoracao

**Score: __ /10**

---

## Pilar 2: Color System

- [ ] Max 1 accent + 1 neutral (restricao respeitada)
- [ ] Accent color tem justificativa neuropsicologica documentada
- [ ] WCAG AAA (7:1) em TODOS os CTAs
- [ ] WCAG AA (4.5:1) em TODO o body text
- [ ] WCAG AA (3:1) em texto grande e UI components
- [ ] Cores semanticas funcionais (success, warning, error, info)
- [ ] Color-blindness safe (cor nunca e unico indicador)
- [ ] Dark/light mode e redesenhado (nao invertido)
- [ ] Von Restorff maximizado (accent destoa do neutral)
- [ ] Emotion target alinhado com hue selecionado

**Score: __ /10**

---

## Pilar 3: Typography

- [ ] Font pairing justificado por posicionamento de marca
- [ ] Type scale consistente e modular (ratio documentado)
- [ ] Fluid typography com clamp() (nao breakpoint-based)
- [ ] Tracking tight em headings, normal em body, wide em labels
- [ ] Line-height tight em display, relaxado em body longo
- [ ] Font loading otimizado (swap, preload heading, subset)
- [ ] Tratamentos especiais documentados (gradient text, mono inline, etc.)
- [ ] All-caps tem tracking adicional (+0.05em min)
- [ ] Max line length 65ch para body text
- [ ] Fontes carregam < 200KB total

**Score: __ /10**

---

## Pilar 4: Motion System

- [ ] Toda animacao cita principio Disney ou psicologico
- [ ] Apenas GPU properties animadas (transform, opacity)
- [ ] 60fps target desktop verificado
- [ ] 30fps minimo mobile verificado
- [ ] prefers-reduced-motion cobre 100% das animacoes
- [ ] Easing NUNCA e linear para UI motion
- [ ] Duration micro: 150-400ms, macro: 400-1200ms
- [ ] Stagger cria ritmo (30-120ms entre elementos)
- [ ] will-change usado com parcimonia e removido apos uso
- [ ] Nenhuma animacao > 5s sem controle de pausa

**Score: __ /10**

---

## Pilar 5: Information Architecture

- [ ] Toda secao tem papel cognitivo documentado
- [ ] Sequencia justificada por principio psicologico
- [ ] Progressive disclosure implementado (L1 scan > L2 skim > L3 read > L4 deep)
- [ ] Min 2 Zeigarnik loops identificados e posicionados
- [ ] Peak moment posicionado mid-page (nao primeiro ou ultimo)
- [ ] End moment (footer) e significativo (nao generico)
- [ ] Self-qualification presente antes do hard sell
- [ ] Curiosity gaps entre secoes mantem scroll
- [ ] Goal gradient aplicado (progress aumenta perto do CTA)
- [ ] Pode converter em qualquer ponto da pagina

**Score: __ /10**

---

## Pilar 6: CRO Patterns

- [ ] Social proof presente e verificavel (nomes, fotos, handles reais)
- [ ] Multiple CTAs em diferentes niveis de intencao
- [ ] Risk reversal enderecea top 3 objecoes
- [ ] Comparison table enquadrada favoravelmente (se aplicavel)
- [ ] Impact hypotheses documentadas para cada padrao (metrica + direcao + %)
- [ ] Sticky CTA aparece apos hero scroll
- [ ] CTA copy usa verbo de acao + beneficio (nao "Submit")
- [ ] Scarcity/urgency e REAL (nao fabricada)
- [ ] Form otimizado (multi-step, inline validation, single column)
- [ ] Trust signals no footer (seguranca, compliance, suporte)

**Score: __ /10**

---

## Pilar 7: Layout & Spacing

- [ ] 4px/8px baseline grid enforced
- [ ] Spacing entre secoes: 96-192px (respiracao cognitiva)
- [ ] Full-bleed vs contained justificado por secao
- [ ] Responsive breakpoints testados (320, 640, 1024, 1440px)
- [ ] Max content width enforced (65ch body, 1280-1440px container)
- [ ] Mobile-first layout explicito
- [ ] Container queries para componentes (quando aplicavel)
- [ ] Asymmetric balance usado para direcionalidade
- [ ] Section pacing cria ritmo vertical
- [ ] Nenhum layout orphan (elemento sozinho sem contexto)

**Score: __ /10**

---

## WCAG Compliance (Transversal)

- [ ] Contrast ratios verificados com ferramenta
- [ ] Keyboard navigation completa (Tab + Enter + Escape)
- [ ] Focus states visiveis em TODOS os elementos interativos
- [ ] Skip link presente e funcional
- [ ] Alt text em todas as imagens significativas
- [ ] Form labels presentes e associados
- [ ] aria-live para conteudo dinamico
- [ ] lang attribute no html
- [ ] Touch targets min 44x44px (mobile)
- [ ] Nenhum keyboard trap (exceto modal)

**Score: __ /10**

---

## Performance (Transversal)

- [ ] Lighthouse target > 90
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Animation JS < 100KB gzipped
- [ ] Font files < 200KB total
- [ ] Images otimizadas (WebP/AVIF, lazy loading)
- [ ] Critical CSS inlined
- [ ] Nao-blocking JS (defer/async)
- [ ] Service worker para cache (se aplicavel)

**Score: __ /10**

---

## Verdict

| Resultado | Criterio |
|-----------|---------|
| **PASS** | Todos os pilares >= 7/10, nenhuma violacao WCAG critica |
| **CONCERNS** | Todos os pilares >= 6/10, violacoes WCAG menores |
| **FAIL** | Qualquer pilar < 6/10 OU violacao WCAG critica |

**Overall Score:** __ /90 (soma dos 9 scores)
**Verdict:** ___________
**Reviewer:** ___________
**Date:** ___________
