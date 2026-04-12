# Design System Master Reference

> Comprehensive reference for design system architecture, tokens, components, accessibility, tooling, and governance.
> Source: MS-002 Research (46 sources, 10 major design systems analyzed)

---

## Table of Contents

1. [Design System Architecture](#1-design-system-architecture)
2. [Design Tokens](#2-design-tokens)
3. [Foundations](#3-foundations)
4. [Component Architecture](#4-component-architecture)
5. [Accessibility (a11y)](#5-accessibility-a11y)
6. [Design-to-Code Pipeline](#6-design-to-code-pipeline)
7. [Component Libraries Comparison](#7-component-libraries-comparison)
8. [Documentation & Governance](#8-documentation--governance)
9. [Testing & Quality](#9-testing--quality)
10. [DesignOps](#10-designops)
11. [Performance & Optimization](#11-performance--optimization)
12. [Famous Design Systems Comparison](#12-famous-design-systems-comparison)
13. [Brazilian Context](#13-brazilian-context)
14. [Advanced Patterns](#14-advanced-patterns)
15. [Actionable Checklists](#15-actionable-checklists)

---

## 1. Design System Architecture

### 1.1 The 5-Layer Model (EightShapes / Nathan Curtis)

A well-architected design system follows separation of concerns. Dependencies flow bottom-up: changing a foundation propagates to all consuming components.

```
+-------------------------------------------+
|           5. TEMPLATES                    |  Full page layouts
+-------------------------------------------+
|           4. PATTERNS                     |  UI compositions (forms, nav, cards)
+-------------------------------------------+
|           3. COMPONENTS                   |  Reusable elements (Button, Input)
+-------------------------------------------+
|           2. TOKENS                       |  Design values (colors, spacing, type)
+-------------------------------------------+
|           1. FOUNDATIONS                  |  Principles, brand, voice & tone
+-------------------------------------------+
```

| Layer | Description | Change Frequency |
|-------|-------------|------------------|
| **Foundations** | Design principles, brand personality, voice & tone. "Prefer clarity over beauty" (Polaris), "Adaptive, not rigid" (Carbon) | Rarely modified |
| **Tokens** | Numeric representation of design decisions. `color.primary.500`, `spacing.4` | Moderate |
| **Components** | Reusable UI elements with documented API, states, a11y, and tests | Regular |
| **Patterns** | Compositions solving recurring UX problems (login form, search, onboarding) | Regular |
| **Templates** | Complete page layouts combining patterns in real contexts | As needed |

### 1.2 System of Systems

Large organizations need a **federated architecture** -- a family of coordinated systems.

**Umbrella Model (Google):**
Core system (Material Design) defines principles, tokens, components. Each platform (Android, Flutter, Web) implements respecting native conventions.

**Hub & Spoke Model (Salesforce):**
Lightning Design System is the hub. Each product (Sales Cloud, Service Cloud) is a spoke extending the hub with specialized components.

**Multi-Brand Model (Natura &Co):**
Core system of "neutral" tokens and components themed via brand tokens. Same `<Button>` renders green for Natura, pink for Avon -- changing only tokens, not the component.

### 1.3 Governance Models

| Model | How It Works | Pros | Cons | Adopted By |
|-------|-------------|------|------|------------|
| **Centralized** | Dedicated team creates and maintains everything | Max consistency, high quality | Bottleneck, slow to meet demands | Salesforce, IBM, Microsoft |
| **Federated** | Product teams contribute; core team curates | Fast, high engagement | Inconsistency risk, coordination overhead | Smaller orgs |
| **Hybrid** | Core team maintains foundations + core components; product teams contribute via RFC | Best of both worlds | Requires rigorous review processes | Shopify, Atlassian, GitHub |

### 1.4 Contribution Models

**RFC Process (Request for Comments):**
1. Proposer creates RFC document (problem, proposed solution, API, a11y)
2. Review period (7-14 days) -- community and core team feedback
3. Decision: accept, modify, or reject
4. Implementation (by proposer or core team)
5. Code review + design review
6. Publication + documentation

**Promotion Model:**
1. Product team creates local component for their need
2. If useful for other teams, candidate for promotion
3. Core team evaluates: reuse potential, quality, a11y
4. If approved, component migrates to central system

---

## 2. Design Tokens

### 2.1 What Are Design Tokens

Concept created by **Jina Anne** (2014, Salesforce Lightning). A design token is a **named design decision** storing visual attributes (color, typography, spacing, elevation, animation) as data, not code.

### 2.2 W3C DTCG Specification

The **W3C Design Tokens Community Group** published its first stable version (2025.10). Style Dictionary 4.0, Token Studio, Supernova, and Specify all support it. It is now the de facto industry standard.

**JSON format:**
```json
{
  "color": {
    "primary": {
      "$value": "#0066FF",
      "$type": "color",
      "$description": "Primary brand color for CTAs and key interactive elements"
    }
  },
  "spacing": {
    "medium": {
      "$value": "16px",
      "$type": "dimension"
    }
  }
}
```

**Defined types:**

| Type | Examples |
|------|---------|
| `color` | `#FF0000`, `oklch(0.63 0.26 29)` |
| `dimension` | `16px`, `1rem` |
| `fontFamily` | `"Inter", sans-serif` |
| `fontWeight` | `400`, `bold` |
| `duration` | `200ms` |
| `cubicBezier` | `[0.4, 0, 0.2, 1]` |
| `number` | `1.5` (line-height, opacity) |
| `border` | Composition of width + color + style |
| `transition` | Composition of duration + delay + timingFunction |
| `shadow` | Composition of offsetX + offsetY + blur + spread + color |
| `gradient` | Linear/radial with stops |
| `typography` | Composition of fontFamily + fontSize + fontWeight + lineHeight + letterSpacing |

### 2.3 3-Tier Token Taxonomy

```
Global (blue.500) --> Alias (color.brand.primary) --> Component (button.primary.background.default)
```

**Tier 1 -- Global Tokens (Primitives):**
Raw values without semantic context. The complete palette of options.

```json
{
  "blue": {
    "50":  { "$value": "#EBF5FF" },
    "500": { "$value": "#0066FF" },
    "900": { "$value": "#001433" }
  }
}
```

**Tier 2 -- Alias Tokens (Semantic):**
References to global tokens with contextual meaning.

```json
{
  "color": {
    "brand": {
      "primary":   { "$value": "{blue.500}" }
    },
    "feedback": {
      "success": { "$value": "{green.500}" },
      "error":   { "$value": "{red.500}" }
    },
    "surface": {
      "default":  { "$value": "{gray.50}" },
      "elevated": { "$value": "{white}" }
    }
  }
}
```

**Tier 3 -- Component Tokens (Specific):**
Tokens bound to specific components.

```json
{
  "button": {
    "primary": {
      "background": {
        "default": { "$value": "{color.brand.primary}" },
        "hover":   { "$value": "{blue.600}" },
        "active":  { "$value": "{blue.700}" }
      }
    }
  }
}
```

### 2.4 Multi-Theme Tokens

Components reference only alias tokens. Theme switching changes only the alias-layer mappings.

```json
{
  "theme": {
    "light": {
      "color.surface.default": { "$value": "{white}" },
      "color.text.primary":    { "$value": "{gray.900}" }
    },
    "dark": {
      "color.surface.default": { "$value": "{gray.900}" },
      "color.text.primary":    { "$value": "{gray.50}" }
    }
  }
}
```

Figma Variables (2023+) support modes (light, dark, brand-a, brand-b) natively.

### 2.5 Style Dictionary

The most-used token transformer. Receives JSON tokens and generates outputs for any platform.

```javascript
export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{ destination: 'variables.css', format: 'css/variables' }]
    },
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'build/ios/',
      files: [{ destination: 'StyleDictionary.swift', format: 'ios-swift/class.swift' }]
    },
    android: {
      transformGroup: 'android',
      buildPath: 'build/android/',
      files: [{ destination: 'values/tokens.xml', format: 'android/resources' }]
    }
  }
};
```

**Typical pipeline with Tokens Studio:**
```
Figma (Tokens Studio) --> Push to GitHub --> CI/CD --> Style Dictionary build --> Publish npm package
```

### 2.6 Token-Driven Development

**Golden rule:** If you can see it, there is a token for it. No hardcoded values allowed.

```css
/* FORBIDDEN */
.button { background-color: #0066FF; padding: 8px 16px; }

/* CORRECT */
.button {
  background-color: var(--color-brand-primary);
  padding: var(--spacing-2) var(--spacing-4);
}
```

Stylelint can enforce this automatically with `color-no-hex: true`.

---

## 3. Foundations

### 3.1 Color Systems -- OKLCH

The industry is migrating from HSL to **OKLCH** (2020, Bjorn Ottosson). In OKLCH, colors with the same Lightness (L) actually appear the same perceived luminosity -- unlike HSL where yellow and blue at the same lightness look drastically different.

```css
:root {
  --blue-50:  oklch(97% 0.02 250);
  --blue-100: oklch(93% 0.04 250);
  --blue-500: oklch(58% 0.20 250);
  --blue-900: oklch(18% 0.08 250);
}
```

CSS natively supports OKLCH: `color: oklch(58% 0.20 250)`.

**Lea Verou** (MIT, CSS Working Group) is the primary advocate. Tailwind CSS v4 adopted OKLCH for its modernized color palette.

**Semantic color mapping:**
```
Primitive Scale:            Semantic Mapping:
blue.50  (lightest)         --> surface.info.subtle
blue.500                    --> interactive.primary.default
blue.600                    --> interactive.primary.hover
blue.700                    --> interactive.primary.active
```

### 3.2 Typography -- Type Scales & Fluid Typography

**Modular scales** (Tim Brown, modularscale.com) use a ratio to generate sizes:

| Ratio | Name | Values (base 16px) |
|-------|------|---------------------|
| 1.125 | Major Second | 14, 16, 18, 20, 23 |
| 1.200 | Minor Third | 13, 16, 19, 23, 28 |
| 1.250 | Major Third | 13, 16, 20, 25, 31 |
| 1.333 | Perfect Fourth | 12, 16, 21, 28, 38 |
| 1.500 | Perfect Fifth | 11, 16, 24, 36, 54 |

Larger ratios = more dramatic (landing pages). Smaller ratios = more utilitarian (dashboards).

**Fluid Typography (Utopia.fyi):**
Interpolate smoothly between breakpoints using `clamp()`:

```css
--font-size-body: clamp(1rem, 0.9rem + 0.45vw, 1.25rem);
--font-size-h1:   clamp(2rem, 1.6rem + 1.82vw, 3rem);
```

Eliminates media queries for typography -- size adapts continuously to viewport.

**Variable Fonts:**
One file replaces 9+ static font files. Support any weight in a range.

```css
@font-face {
  font-family: 'Inter Variable';
  src: url('Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
```

Top variable fonts for interfaces: Inter (Rasmus Andersson), Roboto Flex (Google), Source Sans Variable (Adobe).

### 3.3 Spacing -- 4px/8px Grid

Industry standard: 4px base with geometric scale.

```
Spacing scale (4px base):
0   = 0px     1   = 4px     2   = 8px     3   = 12px
4   = 16px    6   = 24px    8   = 32px    12  = 48px
16  = 64px    20  = 80px    24  = 96px
```

Used by Material Design, Tailwind CSS, Shopify Polaris. 4px divides well across any device pixel ratio.

### 3.4 Elevation & Shadow

Shadow tokens encode spatial hierarchy:

```json
{
  "shadow": {
    "xs":  { "$value": "0 1px 2px 0 rgba(0,0,0,0.05)" },
    "sm":  { "$value": "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)" },
    "md":  { "$value": "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)" },
    "lg":  { "$value": "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)" },
    "xl":  { "$value": "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" }
  }
}
```

In dark mode, use **surface color elevation** (lighter surfaces for higher elevation) instead of traditional shadows.

### 3.5 Motion & Animation Tokens

```json
{
  "motion": {
    "duration": {
      "instant": { "$value": "50ms" },
      "fast":    { "$value": "100ms" },
      "normal":  { "$value": "200ms" },
      "slow":    { "$value": "300ms" },
      "slower":  { "$value": "500ms" }
    },
    "easing": {
      "default": { "$value": "cubic-bezier(0.4, 0, 0.2, 1)" },
      "in":      { "$value": "cubic-bezier(0.4, 0, 1, 1)" },
      "out":     { "$value": "cubic-bezier(0, 0, 0.2, 1)" },
      "spring":  { "$value": "cubic-bezier(0.175, 0.885, 0.32, 1.275)" }
    }
  }
}
```

Key Disney principles for UI: Easing (slow in/out), Anticipation, Follow-through, Secondary action.

### 3.6 Iconography Systems

Modern standard (2024-2026): **SVG inline via React/Vue components** with tree-shaking.

| Approach | Examples | Advantage | Disadvantage |
|----------|----------|-----------|--------------|
| SVG inline (components) | Phosphor, Lucide | Max control, tree-shakeable | Larger bundle if not optimized |
| SVG sprites | Material Icons | Good for web, customizable | Requires build pipeline |
| Icon fonts | Font Awesome | Easy to use | A11y issues, layout shifts |

Icon system specs:
- **Grid:** 24x24 or 16x16 with 2px padding
- **Stroke width:** 1.5px or 2px (consistent across set)
- **Corner radius:** Consistent (sharp, rounded, or mixed)
- **Optical sizing:** Adjust visual size for complexity (complex icons appear smaller)

---

## 4. Component Architecture

### 4.1 Atomic Design (Brad Frost)

| Level | Analogy | Description | Examples |
|-------|---------|-------------|----------|
| **Atoms** | Atom | Basic irreducible elements | Button, Input, Label, Icon, Badge |
| **Molecules** | Molecule | Groups of atoms working together | Search Field, Form Field |
| **Organisms** | Organism | Sections composed of molecules/atoms | Header, Product Card |
| **Templates** | Blueprint | Layouts without real content | Dashboard Layout, Settings Layout |
| **Pages** | Final page | Templates with real content | Dashboard with data |

Most systems in practice use: **Primitives --> Components --> Patterns --> Layouts**.

### 4.2 Component API Design Principles

**1. Declarative over imperative:**
```tsx
// GOOD
<Button variant="primary" size="lg" loading>Submit</Button>

// BAD
<Button className="btn btn-primary btn-lg">
  {loading ? <Spinner /> : "Submit"}
</Button>
```

**2. Sensible defaults:**
```tsx
<Button>Click me</Button>
// Equivalent to: variant="primary", size="md", disabled={false}, loading={false}
```

**3. Composition over configuration:**
```tsx
// GOOD -- composition (flexible)
<Card>
  <Card.Header><Card.Title>Title</Card.Title></Card.Header>
  <Card.Body>Content</Card.Body>
</Card>

// BAD -- configuration (rigid)
<Card title="Title" body="Content" />
```

**4. Strict TypeScript types:**
```tsx
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}
```

### 4.3 Headless Components

Separate **logic/behavior** from **visual presentation**. The component manages state, a11y, keyboard navigation -- but applies no styles.

| Library | Maintained By | Approach |
|---------|---------------|----------|
| **Radix UI** | WorkOS | Unstyled React components with impeccable a11y |
| **Headless UI** | Tailwind Labs | Components for Tailwind CSS (React + Vue) |
| **React Aria** | Adobe | Accessibility hooks for React (base of Spectrum) |
| **Ark UI** | Chakra (Segun Adebayo) | Headless multi-framework (React, Vue, Solid) |
| **Melt UI** | Community | Headless components for Svelte |

```tsx
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="backdrop" />
    <Dialog.Content className="modal">
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

**shadcn/ui** (112K+ GitHub stars, Apr 2026) is built on Radix UI + Tailwind CSS. Not an npm package -- a collection of copy-paste components. Changed how the industry thinks about component libraries. In 2025-2026, AI tools (Claude Code, v0, Lovable) adopted shadcn as default UI library.

### 4.4 Compound Components Pattern

Parent and child components share state implicitly via React Context:

```tsx
<Select>
  <Select.Trigger>Choose a fruit</Select.Trigger>
  <Select.Content>
    <Select.Item value="apple">Apple</Select.Item>
    <Select.Item value="banana">Banana</Select.Item>
  </Select.Content>
</Select>
```

### 4.5 Polymorphic Components

Render as different HTML elements via `as` or `asChild` prop:

```tsx
<Button>Click me</Button>           // renders <button>
<Button as="a" href="/page">Go</Button>  // renders <a>
<Button as={Link} href="/page">Nav</Button>  // renders <Link>
```

Radix uses `asChild` which is more type-safe -- the trigger delegates rendering to the child, merging props and event handlers.

---

## 5. Accessibility (a11y)

### 5.1 WCAG 2.2

Version 2.2 (October 2023, approved as ISO/IEC 40500:2025 in October 2025) has 86 success criteria across three levels:

| Level | Meaning | Criteria |
|-------|---------|----------|
| **A** | Minimum -- remove critical barriers | 30 |
| **AA** | Recommended standard (target for most DS) | 24 |
| **AAA** | Maximum -- exceptional accessibility | 32 |

**Key WCAG 2.2 additions for design systems:**

| Criterion | ID | Impact |
|-----------|-----|--------|
| Focus Not Obscured (Min) | 2.4.11 AA | Focus indicator must not be fully covered by fixed elements |
| Dragging Movements | 2.5.7 AA | Every drag action must have single-pointer alternative |
| Target Size (Minimum) | 2.5.8 AA | Interaction targets minimum 24x24 CSS pixels |
| Accessible Authentication | 3.3.8 AA | Auth must not require cognitive test |
| Redundant Entry | 3.3.7 A | Don't ask for info already provided in session |

### 5.2 ARIA Patterns

| Component | Role | Key ARIA | Keyboard |
|-----------|------|----------|----------|
| Dialog/Modal | `dialog` | `aria-modal`, `aria-labelledby` | Esc closes, focus trap |
| Tabs | `tablist`, `tab`, `tabpanel` | `aria-selected`, `aria-controls` | Arrow keys navigate |
| Accordion | `heading`, `button`, `region` | `aria-expanded`, `aria-controls` | Enter/Space toggle |
| Menu | `menu`, `menuitem` | `aria-expanded`, `aria-haspopup` | Arrow keys navigate |
| Combobox | `combobox`, `listbox`, `option` | `aria-expanded`, `aria-activedescendant` | Arrow keys + typing |
| Tooltip | `tooltip` | `aria-describedby` | Esc closes, focus shows |
| Alert | `alert` | `aria-live="assertive"` | None -- auto announcement |

**Fundamental rule:** Use semantic HTML first. ARIA is a complement, not a substitute. `<button>` is better than `<div role="button">`.

### 5.3 Color Contrast Requirements

| Type | AA | AAA |
|------|-----|-----|
| Normal text (< 18pt / < 14pt bold) | 4.5:1 | 7:1 |
| Large text (>= 18pt / >= 14pt bold) | 3:1 | 4.5:1 |
| UI components and graphics | 3:1 | -- |

Tools: Stark (Figma plugin), axe DevTools (browser), Lighthouse (Chrome), Polypane.

### 5.4 Focus Management

1. Be focusable via `tabindex="0"` if not native elements
2. Show visible focus indicator -- outline with minimum 3:1 contrast
3. Maintain logical tab order following visual order
4. Trap focus in modals
5. Restore focus when closing modals

```css
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
:focus:not(:focus-visible) {
  outline: none;
}
```

### 5.5 Automated a11y Testing

Automated tests detect ~30-40% of a11y issues. The rest requires manual testing (keyboard nav, screen reader, content review).

**axe-core (Deque Systems):** 100+ WCAG rules. Used as browser extension, in jest-axe, cypress-axe, Storybook addon-a11y, and CI/CD (@axe-core/playwright).

```tsx
import { axe } from 'jest-axe';

test('Button has no a11y violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 5.6 Inclusive Design (Microsoft Toolkit)

Three categories of exclusion:
- **Permanent:** Blind, deaf, amputee
- **Temporary:** Eye inflammation, broken arm
- **Situational:** Driving (cannot look), noisy environment, holding a baby

Designing for permanent exclusion benefits everyone. Captions were created for deaf users but are used by 80% of audiences.

---

## 6. Design-to-Code Pipeline

### 6.1 Figma-to-Code Approaches

| Approach | Description | Quality |
|----------|-------------|---------|
| Manual inspection | Developer opens Dev Mode, inspects props, recreates | Slow, error-prone |
| Code generators | Anima, Locofy, Builder.io export from Figma | Starting point, rarely prod-ready |
| Token + component mapping | DS defines tokens/components in both Figma and code | State of the art |
| **Code Connect** (Figma 2024) | Maps Figma components directly to codebase components | Revolutionary -- eliminates ambiguity |

With Code Connect, when a developer inspects a Button in Figma, they see:
```tsx
import { Button } from '@mylib/components';
<Button variant="primary" size="lg">{props.label}</Button>
```

### 6.2 Figma Feature Timeline

| Feature | Year | Impact |
|---------|------|--------|
| Components | 2016 | Design element reuse |
| Auto Layout | 2019 (major 2022) | Responsive layout without manual constraints |
| Variants | 2020 | Multiple variants in one component |
| Dev Mode | 2023 | Optimized inspection for developers |
| Variables | 2023 | Native design tokens with modes (light/dark) |
| Code Connect | 2024 | Direct Figma-to-code component mapping |
| Multi-edit | 2024 | Edit multiple component instances simultaneously |
| Git Integration | 2025-2026 | Branch, commit, merge to GitHub/GitLab |
| Bidirectional Code Sync | 2025-2026 | Figma components sync with React codebases |
| MCP Server | 2025-2026 | Dev Mode as context for AI code generation |

### 6.3 Storybook (v8 --> v9 --> v10)

Standard tool for isolated component development and documentation. Used by Shopify, GitHub, Airbnb, IBM, Microsoft.

| Version | Key Feature | Description |
|---------|-------------|-------------|
| v8 (Mar 2024) | Portable stories | Stories reusable in unit tests |
| v8 | Visual tests built-in | Native Chromatic integration |
| v9 (Mid 2025) | Storybook Test | Partnership with Vitest |
| v9 | Install size -50% | Significant dependency reduction |
| v10 (Oct 2025) | ESM-only | Additional 29% install size reduction |
| v10 | CSF Factories | New story definition format (preview) |

**Essential addons:**

| Addon | Function |
|-------|----------|
| Controls | Modify props interactively |
| Actions | Log events (onClick, onChange) |
| Viewport | Simulate different screen sizes |
| a11y | Accessibility audit (axe-core) |
| Interactions | Interaction tests with Play Functions |
| Visual Tests | Chromatic visual regression |
| Docs | Automatic MDX documentation |

### 6.4 Visual Regression Testing

**Chromatic** (by Storybook creators): Renders each story in real browsers, captures screenshots, compares with baseline, requires human approval for intentional changes.

```yaml
# .github/workflows/chromatic.yml
name: Chromatic
on: push
jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - run: npm ci
      - uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_TOKEN }}
```

Alternatives: Percy (BrowserStack), Playwright screenshots (DIY).

### 6.5 Single Source of Truth Pipeline

```
Tokens (SSOT for visual values)
  --> Figma Variables (via Tokens Studio sync)
  --> CSS Variables (via Style Dictionary)
  --> iOS/Android constants (via Style Dictionary)

Components (SSOT for behavior)
  --> Figma Components (design)
  --> React Components (code)
  --> Storybook Stories (docs + tests)
  --> Code Connect (Figma <-> code mapping)
```

---

## 7. Component Libraries Comparison

### 7.1 React Libraries

| Library | Stars | Philosophy | CSS Approach | Best For |
|---------|-------|-----------|-------------|----------|
| **MUI** | 97K+ | Material Design implementation | Emotion (CSS-in-JS) | Material-styled apps |
| **shadcn/ui** | 112K+ | Copy-paste components (Radix + Tailwind) | Tailwind CSS | Full ownership, modern stack |
| **Ant Design** | 93K+ | Enterprise components (Alibaba) | CSS-in-JS | Admin panels, dashboards |
| **Chakra UI** | 38K+ | A11y-first, great DX (Segun Adebayo) | Emotion, v3 on Ark UI | Accessible apps |
| **Mantine** | 27K+ | All-in-one (130+ components) | Custom | Full-featured needs |
| **Radix Themes** | 5K+ | Visual layer on Radix primitives | CSS Variables | Cohesive out-of-box design |

### 7.2 CSS Approaches

| Approach | Library | Runtime | Trade-off |
|----------|---------|---------|-----------|
| Utility-first | **Tailwind CSS** (94K+ stars) | Zero | Verbose classnames, max flexibility |
| CSS Modules | Native | Zero | Scoped, simple, predictable |
| CSS-in-TypeScript | **vanilla-extract** (9K+) | Zero | Type-safe styles, compiled to CSS |
| Utility + Recipes | **Panda CSS** (5K+) | Zero | Combines Tailwind + CSS-in-JS benefits |
| Tagged templates | **styled-components** (40K+) | Runtime | Declining due to performance overhead |

**Tailwind CSS v4 (Jan 2025):** Rewritten engine (5x faster full builds, 100x+ incremental), CSS-first config (no tailwind.config.js), automatic content detection, OKLCH color palette, native cascade layers.

### 7.3 Web Components

Native browser standards (Custom Elements + Shadow DOM). Write once, use in any framework.

**Lit (Google, 18K+ stars):** Primary library for Web Components with reactive properties, scoped styles, efficient templates.

Used by: Google (Material Web), SAP (UI5), Salesforce (Lightning Web Components), ING Bank.

Best use case: organizations with multiple frameworks.

---

## 8. Documentation & Governance

### 8.1 Living Documentation Principles

1. **Co-located with code** -- story/doc lives in same directory as component
2. **Auto-extracted** -- TypeScript types generate prop tables automatically
3. **Interactive** -- reader can change props and see results in real time
4. **Contextualized** -- shows when to use, when NOT to use, alternatives
5. **Versioned** -- versioned with code, not separately

### 8.2 Storybook + MDX

```mdx
import { Meta, Canvas, Controls, ArgsTable } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

# Button

## When to use
- **Primary:** Main action on a page (max 1 per view)
- **Secondary:** Supporting actions

## When NOT to use
- For navigation -- use `<Link>` instead
- For toggling state -- use `<Toggle>` instead

<Canvas of={ButtonStories.Primary} />
<Controls />
<ArgsTable of={ButtonStories} />
```

### 8.3 Documentation Platforms

| Platform | Differentiator |
|----------|---------------|
| **Zeroheight** | Connects Figma, Storybook, code. Non-technical contributors |
| **Supernova** | Auto-syncs with Figma. Multi-brand, end-to-end |
| **Knapsack** | Multi-framework (React, Vue, Angular, WC) in same docs |

### 8.4 Versioning Strategy (SemVer)

```
MAJOR: Breaking changes (rename prop, remove component)
MINOR: New backward-compatible features (add prop, add component)
PATCH: Bug fixes, performance improvements
```

**Breaking change management:**
1. Mark as deprecated with clear message
2. Provide codemods (jscodeshift) for automatic migration
3. Document migration guide
4. Maintain deprecated for 1-2 minor releases
5. Remove in next major release

### 8.5 RFC Process Template

```
RFC-001: Add Stepper Component

## Motivation
3 product teams independently implemented steppers.

## Detailed Design
- API: <Stepper steps={[...]} currentStep={1} />
- Variants: horizontal, vertical
- Accessibility: ARIA progressbar pattern

## Alternatives Considered
1. Extend Tabs (rejected: wrong mental model)
2. Third-party (rejected: doesn't follow our tokens)

## Timeline
- Design: 2 weeks | Dev: 3 weeks | Testing: 1 week | Docs: 1 week
```

---

## 9. Testing & Quality

### 9.1 Testing Strategy

| Type | What to Test | Tools |
|------|-------------|-------|
| **Visual regression** | Screenshot diff across versions | Chromatic, Percy, Playwright |
| **Unit** | Rendering, props, events, states | Testing Library + Vitest/Jest |
| **Accessibility** | Roles, aria attributes, keyboard nav | jest-axe, Storybook addon-a11y |
| **Interaction** | Complex user flows in stories | Storybook Play Functions |
| **Cross-browser** | All supported browsers | Playwright, BrowserStack |
| **Performance** | Bundle size, render time | size-limit, React DevTools |

### 9.2 Unit Testing Example

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 9.3 Interaction Testing (Storybook Play Functions)

```tsx
export const WithFormValidation: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Leave email empty and submit', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    });
    await step('Verify error message', async () => {
      await expect(canvas.getByText('Email is required')).toBeInTheDocument();
    });
  },
};
```

### 9.4 Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| Bundle size per component | < 5KB gzipped (atom), < 20KB (organism) | bundlephobia, size-limit |
| Runtime performance | < 16ms render (60fps) | React DevTools Profiler |
| First render | < 100ms for visible component | Lighthouse |
| Re-render | Minimize unnecessary re-renders | why-did-you-render |

### 9.5 Cross-Browser Matrix

| Browser | Version | Engine |
|---------|---------|--------|
| Chrome | Latest 2 | Blink |
| Firefox | Latest 2 | Gecko |
| Safari | Latest 2 | WebKit |
| Edge | Latest 2 | Blink |
| Safari iOS | Latest 2 | WebKit |
| Chrome Android | Latest | Blink |

---

## 10. DesignOps

### 10.1 Team Models

| Model | Structure | Adopted By |
|-------|-----------|------------|
| **Centralized** | 3-8 dedicated (1-2 designers, 2-4 engineers, 1 PM) | Salesforce, IBM, Microsoft |
| **Federated** | No dedicated team; community contributors + board | Smaller organizations |
| **Hybrid** | Small core team (2-4) + product contributors via RFC | Shopify, GitHub, Atlassian |

### 10.2 Adoption Metrics

| Metric | How to Measure | Target |
|--------|---------------|--------|
| Coverage | % of screens using system components | > 80% |
| Adoption rate | % of teams using the system | > 90% |
| Token compliance | % of visual values via tokens (vs hardcoded) | > 95% |
| Component reuse | # instances per component | > 10 (avg) |
| Contribution rate | # PRs from product teams / month | 2-5 |
| Satisfaction (NPS) | Quarterly survey | > 50 |
| Time to implement | Average time to implement new screen | > 40% reduction |
| Design-dev parity | % components with Figma + code equivalent | > 90% |

**Measurement tools:** Omlet (codebase adoption analysis), Figma Analytics, Custom ESLint rules.

### 10.3 ROI

```
ROI = ((Hours saved * Cost/hour) - Investment) / Investment

Industry benchmark (Sparkbox 2023):
- 34% average dev time reduction
- 29% average visual bug reduction
- 89% report consistency improvement
- Salesforce: $2B+ annual savings from Lightning DS
- Shopify: 50% reduction in new screen build time
```

### 10.4 Maturity Model (InVision)

| Level | Name | Characteristics |
|-------|------|-----------------|
| 1 | **Ad Hoc** | No system. Individual components. Total inconsistency |
| 2 | **Emerging** | Basic style guide. Some conventions. Inconsistent adoption |
| 3 | **Defined** | Formal DS. Tokens, components, docs. Dedicated/partial team |
| 4 | **Managed** | Mature system. Adoption metrics. Clear governance. Federated contribution |
| 5 | **Optimized** | System as product. Continuous innovation. Industry benchmark |

### 10.5 Design System as a Product

**Dan Mall** ("Design That Scales", 2022): Design systems fail when treated as projects (end when budget runs out) and thrive when treated as products (evolve continuously based on user feedback).

Practices: user research with consumer teams, public roadmap, detailed changelogs, weekly office hours, usage analytics, deprecation notices.

---

## 11. Performance & Optimization

### 11.1 Tree-Shaking

Requirements:
1. **ESM exports** -- `import/export`, not CommonJS
2. **sideEffects: false** in package.json
3. **Per-component exports**

```json
{
  "sideEffects": false,
  "exports": {
    ".": { "import": "./dist/index.mjs" },
    "./button": { "import": "./dist/button.mjs" },
    "./modal": { "import": "./dist/modal.mjs" }
  }
}
```

### 11.2 Code-Splitting

```tsx
const DataTable = React.lazy(() => import('@mylib/components/data-table'));

<Suspense fallback={<Skeleton />}>
  <DataTable data={data} />
</Suspense>
```

### 11.3 CSS Optimization

- **CSS Layers:** `@layer reset, tokens, components, utilities;` -- controls specificity without `!important`
- **Critical CSS:** Extract above-the-fold CSS and inline in HTML (Critters, Next.js native)
- **CSS Purging:** Remove unused CSS (Tailwind does automatically; PurgeCSS for traditional CSS)

### 11.4 Core Web Vitals Impact

| Metric | How DS Affects It | Optimization |
|--------|-------------------|-------------|
| **LCP** | Heavy components delay render | Lazy loading, code-splitting |
| **INP** | Slow event handlers | Optimize renders, useCallback/useMemo |
| **CLS** | Components without explicit dimensions | Skeleton loaders, aspect-ratio, reserve space |

---

## 12. Famous Design Systems Comparison

### 12.1 Architectural Comparison

| Design System | Token Format | CSS Approach | Framework | Components |
|--------------|-------------|-------------|-----------|------------|
| **Material Design** (Google) | W3C DTCG | CSS custom properties | Multi (Web, Flutter, Android) | 50+ |
| **Carbon** (IBM) | Custom JSON | Sass + CSS vars | Multi (React, Vue, Angular, Svelte) | 80+ |
| **Polaris** (Shopify) | Custom JSON | CSS Modules | React | 60+ |
| **Primer** (GitHub) | JSON | Styled Components + CSS | React | 60+ |
| **Atlassian DS** | Custom | Emotion | React | 70+ |
| **Lightning** (Salesforce) | Custom (pioneer) | BEM CSS | LWC (Web Components) | 100+ |
| **Spectrum** (Adobe) | Custom | CSS Modules | React (+ React Aria) | 70+ |
| **Fluent** (Microsoft) | Custom | Griffel (atomic) | React | 80+ |
| **Geist** (Vercel) | Tailwind | Tailwind CSS | React | 30+ |

### 12.2 What to Learn from Each

| System | Key Lesson |
|--------|-----------|
| **Material Design** | Systematic rigor, exhaustive docs, motion guidelines, token architecture |
| **Carbon (IBM)** | Enterprise UX, data visualization, multi-framework strategy, a11y rigor |
| **Polaris (Shopify)** | Principles-driven design, contribution model, commerce UX patterns |
| **Primer (GitHub)** | Developer-centric design, dark mode architecture, open-source governance |
| **Atlassian DS** | Enterprise patterns, pragmatic governance, scaling across products |
| **Lightning (Salesforce)** | Design tokens as concept (pioneer), enterprise patterns, a11y compliance |
| **Spectrum (Adobe)** | 3-layer architecture (behavior/state/visual), React Aria, i18n |
| **Fluent (Microsoft)** | Enterprise scale, high-contrast a11y, atomic CSS optimization |
| **HIG (Apple)** | Platform-native design, haptics/spatial, design for delight |
| **Geist (Vercel)** | Modern minimalism, developer-first UX, font as brand identity |

---

## 13. Brazilian Context

### 13.1 Notable Brazilian Design Systems

**Natura Design System (Natura &Co):**
Multi-brand system (Natura, Avon, The Body Shop). Uses design tokens for theming and Storybook for documentation.

**NuDS (Nubank Design System):**
100+ reusable components and screen templates. Custom typeface **Nu Sans** (32 fonts: 2 optical sizes, 3 widths, 4 weights with italics, by Blackletra Type Foundry). Iconic purple color treated as fundamental design token. Brand color updates deployed in a single sprint thanks to token architecture.

**Itau Design System:**
Robust system for digital channels (app, internet banking, ATMs). Focus on cross-channel consistency and regulatory a11y compliance. 2025 digital overhaul aims for 75% of retail customers served exclusively via digital channels.

**VTEX Styleguide:**
E-commerce platform. One of few genuinely open-source Brazilian design systems. React components for admin panel construction.

**RD Station:**
Internal DS for marketing/CRM products. React-based with focus on cross-product consistency.

**Magazine Luiza (Magalu):**
DS to unify app, site, and marketplace experience. Includes "Lu" (digital avatar) as brand system element.

### 13.2 Brazilian Regulatory Requirements

| Regulation | What It Requires |
|-----------|-----------------|
| **LBI** (Lei 13.146/2015) | Digital accessibility mandatory for companies with presence in Brazil |
| **e-MAG** | Brazilian WCAG (government sites must comply) |
| **Decreto 10.645/2021** | Accessibility seal and periodic audits for government sites |

**Implications:** Components MUST meet WCAG AA minimum. Digital accessibility is a legal obligation, not a competitive differentiator. Fines can be applied by the Public Ministry.

### 13.3 Brazil-Specific Design Challenges

| Challenge | Design System Impact |
|-----------|---------------------|
| Device diversity | Many low-cost Android devices with small screens, less processing power |
| Variable connectivity | Components must work in low-bandwidth (progressive loading, graceful degradation) |
| PIX payments | E-commerce/fintech DS must include PIX-specific patterns (QR code, copy-paste, expiration timer) |
| WhatsApp-first (120M+ users) | Consider WhatsApp integration patterns (click-to-chat, notifications, chatbots) |
| Multilingual ops | International companies (Natura, Nubank) need i18n for Spanish, English |

---

## 14. Advanced Patterns

### 14.1 Theming Architecture

```tsx
function ThemeProvider({ theme, children }) {
  return (
    <div data-theme={theme.name} style={tokensToCSSVars(theme.tokens)}>
      {children}
    </div>
  );
}

<ThemeProvider theme={lightTheme}><App /></ThemeProvider>
<ThemeProvider theme={darkTheme}><App /></ThemeProvider>
<ThemeProvider theme={brandBTheme}><App /></ThemeProvider>
```

**Dark mode pitfalls:**
- Not "invert colors" -- needs redesigned palette
- Images/illustrations need dark variants
- Shadows don't work (use surface elevation instead)
- Reduce color saturation (vibrant colors in dark are aggressive)
- Pure white (#FFFFFF) is aggressive -- use off-white (#E0E0E0)

### 14.2 Controlled vs Uncontrolled

Components should support both modes via `useControllableState`:

```tsx
function useControllableState({ value, defaultValue, onChange }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const setValue = useCallback((next) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }, [isControlled, onChange]);
  return [currentValue, setValue];
}
```

### 14.3 Slots Pattern

Consumers replace internal parts of a component without reimplementing:

```tsx
<Card>
  <Card.Slot name="header"><CustomHeader /></Card.Slot>
  <Card.Slot name="body"><p>Content</p></Card.Slot>
  <Card.Slot name="footer"><CustomFooter /></Card.Slot>
</Card>
```

### 14.4 RTL Support

Use CSS Logical Properties (supported in all modern browsers):

```css
/* Old (not RTL-safe) */
margin-left: 16px;
text-align: left;

/* Modern (RTL-safe) */
margin-inline-start: 16px;
text-align: start;
```

### 14.5 Responsive Design Tokens

```css
:root {
  --spacing-page-gutter: clamp(16px, 2vw + 8px, 32px);
  --font-size-heading-1: clamp(28px, 4vw + 12px, 48px);
}
```

### 14.6 Animation Vocabulary

| Pattern | When to Use | Example |
|---------|-------------|---------|
| Fade | Elements appearing/disappearing without moving | Tooltip, notification |
| Slide | Elements entering from a direction | Drawer, panel, sheet |
| Scale | Elements growing/shrinking | Modal opening, zoom |
| Morph | Elements changing shape/position | Shared element transition |
| Stagger | Group animating in sequence | List items appearing |
| Spring | Physics-based spring animation | Drag and drop, pull to refresh |

**Framer Motion** (23K+ stars) is the most-used React animation library for design systems.

### 14.7 Design Linting

**Stylelint** enforces token usage:
```json
{
  "rules": {
    "color-no-hex": true,
    "declaration-property-value-allowed-list": {
      "color": ["/var\\(--/"],
      "background-color": ["/var\\(--/"]
    }
  }
}
```

**Custom ESLint** enforces DS component usage:
```javascript
// Ban raw HTML elements in favor of DS components
const banned = ['button', 'input', 'select', 'textarea'];
if (banned.includes(node.name.name)) {
  context.report({ message: `Use DS component instead of <${node.name.name}>` });
}
```

---

## 15. Actionable Checklists

### 15.1 Design System Setup Checklist

- [ ] Define design principles (3-5 core principles)
- [ ] Establish token taxonomy (global --> alias --> component)
- [ ] Set up color system with OKLCH scales (10-12 levels per hue)
- [ ] Define type scale with fluid typography (`clamp()`)
- [ ] Create spacing scale (4px base)
- [ ] Define elevation/shadow tokens
- [ ] Define motion tokens (duration + easing)
- [ ] Choose icon system (SVG components recommended)
- [ ] Set up Style Dictionary for multi-platform token output
- [ ] Configure Tokens Studio for Figma-Git sync
- [ ] Set up Storybook for component development
- [ ] Configure Chromatic for visual regression testing
- [ ] Set up jest-axe for automated a11y testing
- [ ] Define governance model (centralized, federated, or hybrid)
- [ ] Create contribution RFC template
- [ ] Set up size-limit for bundle monitoring

### 15.2 Component Quality Checklist

- [ ] TypeScript interface with strict types (no `any`)
- [ ] Sensible default props
- [ ] All visual values use tokens (no hardcoded colors/spacing)
- [ ] Supports all states: default, hover, active, focus, disabled, loading
- [ ] Accessible: correct ARIA roles, keyboard navigation, focus management
- [ ] passes jest-axe tests
- [ ] Storybook story for each variant and state
- [ ] Unit tests: rendering, props, events, states
- [ ] Visual regression baseline captured
- [ ] Documentation: when to use, when NOT to use, API reference
- [ ] Bundle size within targets (< 5KB atom, < 20KB organism)
- [ ] Works in light and dark themes
- [ ] Supports controlled and uncontrolled modes (form components)

### 15.3 Pre-Release Checklist

- [ ] All components pass visual regression
- [ ] All a11y tests pass
- [ ] All unit/interaction tests pass
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Bundle size within limits
- [ ] Breaking changes documented with migration guide
- [ ] Deprecated APIs have codemod available
- [ ] Changelog updated
- [ ] Storybook docs updated
- [ ] SemVer correctly applied (MAJOR/MINOR/PATCH)

### 15.4 Adoption Health Checklist

- [ ] Component coverage > 80% of screens
- [ ] Token compliance > 95% (no hardcoded values)
- [ ] Team adoption > 90%
- [ ] Design-dev parity > 90% (Figma + code equivalents)
- [ ] NPS score > 50 from consumer teams
- [ ] Office hours held weekly
- [ ] Public roadmap maintained
- [ ] Analytics tracking component usage

---

## Key People Reference

| Person | Contribution |
|--------|-------------|
| **Brad Frost** | Atomic Design (2013/2016) -- composicional hierarchy |
| **Nathan Curtis** | EightShapes -- DS operations, governance, component API design |
| **Jina Anne** | Design Tokens concept (2014, Salesforce), W3C DTCG co-chair |
| **Dan Mall** | "Design That Scales" (2022) -- DS as product, team models |
| **Alla Kholmatova** | "Design Systems" (2017) -- theoretical frameworks |
| **Lea Verou** | OKLCH advocacy, CSS Working Group, "CSS Secrets" |
| **Adam Wathan** | Tailwind CSS -- utility-first revolution |
| **Sarah Drasner** | Animation engineering, "SVG Animations" |
| **Heydon Pickering** | "Inclusive Components" -- accessible component patterns |
| **Segun Adebayo** | Chakra UI, Panda CSS, Ark UI |
| **Matias Duarte** | Material Design architect (Google) |
| **Rasmus Andersson** | Inter font -- most-used interface font 2024-2026 |

---

## Essential Books

| Book | Author | Extract |
|------|--------|---------|
| "Atomic Design" | Brad Frost (2016) | Compositional hierarchy, Pattern Lab |
| "Design Systems" | Alla Kholmatova (2017) | Functional vs perceptual patterns, principles framework |
| "Refactoring UI" | Wathan & Schoger (2018) | Visual design rules for foundations |
| "Inclusive Components" | Heydon Pickering (2019) | ARIA patterns, keyboard nav, screen reader testing |
| "Design That Scales" | Dan Mall (2022) | Team models, contribution models, selling DS to executives |
| "Expressive Design Systems" | Yesenia Perez-Cruz (2019) | Brand expression via tokens |
| "The Design of Everyday Things" | Don Norman (1988/2013) | Affordance, signifiers -- philosophical base for any DS |
| "Grid Systems in Graphic Design" | Muller-Brockmann (1961) | Mathematical grids -- foundation for spacing tokens |

---

*Design System Master Reference -- SINAPSE squad-design knowledge base*
*Source: MS-002 Research (46 sources, 10 major DS analyzed, 20+ key people referenced)*
