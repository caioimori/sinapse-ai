# Knowledge Base: Famous Design Systems Study

## Escopo
Analise profunda dos 10 design systems mais influentes da industria — historia, diferenciais, licoes aprendidas e comparacao arquitetural. Fonte: MS-002 Design System Research (2026-04-07).

---

## 1. Material Design (Google)

**Lancamento:** 2014 (M1), 2018 (M2), 2021 (Material 3 / Material You)
**URL:** material.io

Criado por **Matias Duarte** (VP of Design, Google), Material Design e o design system mais influente da historia. Introduziu conceitos que se tornaram industria: superficies com elevacao, motion com significado, tipografia como sistema, color harmony algoritmica.

### Material 3 (Material You — 2021)
- **Dynamic Color:** Gera paleta inteira a partir de uma cor (papel de parede do celular)
- **OKLCH-based color system:** Cores perceptualmente uniformes
- **Expressividade:** Mais personalidade que M2 (border-radius variavel, color themes)
- **W3C DTCG:** Tokens publicados em formato W3C DTCG

### Licoes
- Rigor sistematico (documentacao exaustiva de cada decisao)
- Motion guidelines com principios teoricos (fisica de materiais)
- Accessibility-first (todos os componentes testados com screen readers)
- Token architecture que suporta customizacao profunda

### Implementacoes
- Material Web Components (web)
- Jetpack Compose Material 3 (Android)
- Flutter Material 3

---

## 2. Carbon Design System (IBM)

**Lancamento:** 2017 (open-source)
**URL:** carbondesignsystem.com

Design system da IBM para centenas de produtos enterprise. Foco em: data visualization, complex forms, dashboards, acessibilidade AA/AAA (exigida por contratos federais).

### Diferenciais
- **Grid sofisticado:** 2x Grid (column grid + mini unit grid de 8px)
- **Data visualization system:** Charting guidelines completas (paleta de cores para graficos, tipos de viz)
- **Accessibility como P0:** IBM Federal contracts exigem Section 508 + WCAG AAA
- **Multi-framework:** React, Angular, Vue, Svelte, Web Components
- **Design tokens:** Publicados e documentados com 3 tiers

### Licoes
- Enterprise UX patterns (navigation para produtos complexos)
- Data visualization como componente do design system
- Multi-framework strategy com Web Components como base
- Accessibility rigor que vai alem do minimo (AAA em componentes criticos)

---

## 3. Polaris (Shopify)

**Lancamento:** 2017 (open-source)
**URL:** polaris.shopify.com

Design system do Shopify para 2+ milhoes de comerciantes e milhares de desenvolvedores. Foco em commerce UX e admin interfaces.

### Diferenciais
- **Design principles memoraveis:** "Put merchants first", "Be familiar, be clear", "Be consistent"
- **Token-driven (pioneiro):** Polaris foi um dos primeiros DS a adotar design tokens na pratica
- **RFC process publico:** Qualquer pessoa pode abrir uma RFC no GitHub
- **UX Patterns extensivos:** Nao apenas componentes, mas *como usa-los* em contextos especificos

### Contribution Model
```
Issue → RFC → Design Review → Implementation → Documentation → Release
```
RFC publicas sao comentadas pela comunidade antes de aprovadas. Isso garante que components resolvem problemas reais.

### Licoes
- Principles-driven design (os principios guiam todas as decisoes)
- Contribution model aberto e transparente
- Commerce UX patterns (pagamento, inventario, relatorios)
- Documentacao de "quando usar" e "quando nao usar" para cada componente

---

## 4. Primer (GitHub)

**Lancamento:** 2016 (open-source)
**URL:** primer.style

Design system do GitHub. React-based, usa Radix primitives, profundamente integrado com a cultura open-source.

### Diferenciais
- **React components + acessibilidade:** Todos os componentes sobre Radix UI primitives
- **Primer CSS:** CSS utility framework proprio (precursor do Tailwind no GitHub)
- **ViewComponents:** Componentes Ruby on Rails server-side (design system multi-layer)
- **Brand system:** Octicons (icon set), illustrations system, marketing components
- **Dark mode:** Cidadao de primeira classe — GitHub tem dark mode desde 2020

### Licoes
- Developer-centric design (design para quem usa ferramentas de dev)
- Dark mode architecture (tokens separados para light/dark/dimmed/high-contrast)
- Open-source governance (o design system *e* open-source e aceita PRs da comunidade)
- Icon system como produto separado (Octicons tem sua propria versioning e docs)

---

## 5. Atlassian Design System

**Lancamento:** 2018 (evolucao do ADG — Atlassian Design Guidelines)
**URL:** atlassian.design

Sistema maduro para produtos enterprise: Jira, Confluence, Trello, Bitbucket.

### Diferenciais
- **Atlassian Design Tokens:** Plataforma propria com 3-tier token system
- **Emotion-based styling** com theme provider sofisticado
- **Pattern library extensiva:** Navigation, onboarding, empty states, error states
- **Pragmatismo:** Foco em "good enough at scale" — nao perfeicao

### Licoes
- Enterprise patterns (onboarding para produtos complexos, empty states)
- Scaling governance: como manter consistencia com dezenas de times e 4 produtos grandes
- Pragmatic approach (nem sempre o design mais bonito — o que funciona para milhoes de usuarios)

---

## 6. Lightning Design System (Salesforce)

**Lancamento:** 2015 (open-source — pioneiro)
**URL:** lightningdesignsystem.com

Um dos primeiros design systems enterprise publicados. Criado com forte influencia de **Jina Anne** (que cunhou "design tokens").

### Diferenciais
- **Pioneiro em design tokens (2014):** Jina Anne criou o conceito durante o desenvolvimento do SLDS
- **Lightning Web Components (LWC):** Web Components como tecnologia base
- **Blueprints extensivos:** Patterns documentados em detalhe com exemplos HTML
- **Section 508:** Acessibilidade exigida por contratos governamentais nos EUA

### Licoes
- Design tokens como single source of truth (o conceito nasceu aqui)
- Enterprise patterns para CRM (formularios complexos, tabelas, dashboards)
- Accessibility compliance para regulatorio (Section 508, ADA)
- Web Components como estrategia de longo prazo para cross-framework

---

## 7. Spectrum (Adobe)

**Lancamento:** 2019 (open-source)
**URL:** spectrum.adobe.com

Design system da Adobe, construido sobre React Aria (hooks de acessibilidade) e React Spectrum (componentes estilizados).

### Arquitetura Unica (3 Camadas)
```
React Aria        ← Behavior + Accessibility (ARIA, keyboard, focus)
React Stately     ← State management (controlled/uncontrolled, selection)
React Spectrum    ← Visual (tokens, theming, CSS)
```

Cada camada e separada e pode ser usada independentemente.

### Diferenciais
- **React Aria:** A melhor biblioteca de acessibilidade da industria — resolve problemas que ninguem mais resolveu (date pickers, color pickers, comboboxes acessiveis)
- **Cross-platform:** Web + iOS via React Native
- **Internationalization nativa:** RTL, number formatting, date formatting, locale-aware sorting
- **Adaptive:** UI adapta para mouse, touch e keyboard naturalmente

### Licoes
- Layered architecture (behavior/state/visual separation permite maxima flexibilidade)
- Accessibility-first como arquitetura (nao como addon)
- i18n como cidadao de primeira classe
- Hooks como API publica de comportamento

---

## 8. Fluent (Microsoft)

**Lancamento:** 2017 (Fluent Design System), 2022 (Fluent 2)
**URL:** fluent2.microsoft.design

Design system da Microsoft para Windows, Office, Teams, Azure. Foco em produtividade enterprise e cross-platform.

### Diferenciais
- **Fluent UI React:** 18K+ stars, usado em produtos Microsoft com bilhoes de usuarios
- **Griffel:** CSS-in-JS engine com zero runtime usando atomic CSS (semelhante ao Stylex)
- **Themes nativos:** Light, Dark, High Contrast (Windows accessibility feature)
- **Cross-platform:** Web, Windows (WinUI 3), iOS, Android

### Licoes
- Enterprise scale (bilhoes de usuarios impoe constraints diferentes)
- High-contrast accessibility (Windows High Contrast Mode e feature nativa — DS deve suportar)
- CSS atomic optimization (Griffel gera CSS atomico, minimizando bundle)
- Cross-platform design language sem abandonar convencoes de cada plataforma

---

## 9. Human Interface Guidelines (Apple)

**Lancamento:** 1987 (Mac original), evoluido continuamente
**URL:** developer.apple.com/design

As HIG sao o design system mais antigo em uso continuo. Nao sao open-source mas a documentacao e extremamente detalhada.

### Diferenciais
- **Platform-native:** Nunca tenta ser cross-platform — cada plataforma tem sua propria HIG
- **SF Symbols:** 5000+ icones com 9 weights, 3 scales, variable color — sistema de icones mais sofisticado da industria
- **Haptics guidelines:** Toque como canal de feedback (design para sensacao fisica)
- **Spatial computing (visionOS):** Apple Vision Pro como nova fronteira do design system

### Licoes
- Platform-native design (nao tentar criar uma unica UI para todos os contextos)
- Attention to detail (cada guideline e baseada em research extenso)
- Haptics como dimensao de UX (vibration patterns como parte do design language)
- Design for delight (nao apenas usabilidade — encantamento)

---

## 10. Geist (Vercel)

**Lancamento:** 2023 (open-source)
**URL:** vercel.com/geist

O design system mais recente e moderno desta lista. Criado pela Vercel (empresa por tras do Next.js), reflete a estetica minimalist-developer.

### Diferenciais
- **Geist Font:** Fonte propria (Geist Sans + Geist Mono) — tipografia como identidade de marca
- **Minimalismo extremo:** Poucos componentes, muito bem feitos
- **Dark-first:** Design para dark mode como primaria, light como variacao
- **Tailwind-native:** Tokens como classes Tailwind, nao CSS separado
- **shadcn/ui influence:** Copy-paste philosophy

### Licoes
- Modern minimalism (menos e mais — curadoria rigorosa de componentes)
- Developer-first UX (design para quem usa ferramentas de dev)
- Font como brand identity (criar uma fonte propria como estrategia de diferenciacao)
- Dark-first design (invertendo o default)

---

## Comparacao Arquitetural

| Design System | Token Format | CSS Approach | Framework | Open Source | Componentes |
|--------------|-------------|-------------|-----------|-------------|-------------|
| Material Design | W3C DTCG | CSS custom properties | Multi (Web, Flutter, Android) | Sim | 50+ |
| Carbon (IBM) | Custom JSON | Sass + CSS vars | Multi (React, Vue, Angular, Svelte) | Sim | 80+ |
| Polaris (Shopify) | Custom JSON | CSS Modules | React | Sim | 60+ |
| Primer (GitHub) | JSON | Styled Components + CSS | React | Sim | 60+ |
| Atlassian DS | Custom | Emotion | React | Parcial | 70+ |
| Lightning (Salesforce) | Custom (pioneiro) | BEM CSS | LWC (Web Components) | Sim | 100+ |
| Spectrum (Adobe) | Custom | CSS Modules | React (+ React Aria) | Sim | 70+ |
| Fluent (Microsoft) | Custom | Griffel (atomic) | React | Sim | 80+ |
| HIG (Apple) | N/A | SwiftUI/UIKit | Native (iOS/macOS) | Nao | N/A |
| Geist (Vercel) | Tailwind | Tailwind CSS | React | Sim | 30+ |

---

## The Component Gallery

**componentgallery.design** — Catalogo de como os mesmos componentes (Button, Input, Modal) sao implementados em 60+ design systems. Recurso essencial para benchmarking e padronizacao de nomenclatura.

Exemplo: o componente "Popover" e chamado de "Popover" em Radix, "Overlay" em Spectrum, "Popup" em MUI, e "Floating" em Floating UI. Ver como diferentes sistemas resolvem o mesmo problema e invaluavel para decisoes de API design.

---

## Licoes Universais

| Licao | Fonte | Aplicacao |
|-------|-------|-----------|
| Tokens como single source of truth | Jina Anne (Salesforce, 2014) | Token-driven development — sem valores hardcoded |
| Design system como produto, nao projeto | Dan Mall | Roadmap, metricas, versioning, changelog |
| Acessibilidade como arquitetura | Adobe Spectrum | React Aria como camada separada |
| Governance define velocidade | Shopify Polaris | RFC process antes de implementar |
| Documentacao viva | Storybook ecosystem | Docs colocalizedas com codigo |
| Tokens fluem de baixo para cima | Nathan Curtis | L1 → L2 → L3, nunca ao contrario |
| Motion e fundacao, nao feature | Material Design | Motion tokens como parte das foundations |

---

## Referencias
- material.io/design
- carbondesignsystem.com
- polaris.shopify.com
- primer.style
- atlassian.design
- lightningdesignsystem.com
- spectrum.adobe.com
- fluent2.microsoft.design
- developer.apple.com/design
- vercel.com/geist
- componentgallery.design
- MS-002 Design System Research — SINAPSE (2026-04-07)
