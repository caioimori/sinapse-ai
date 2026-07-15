---
name: react-bits-frontend
description: Select, install, adapt, combine, optimize, and audit official React Bits components for React, Next.js, Vite, Astro islands, and SINAPSE frontend projects. Use for animated text, cursors, reveals, cards, navigation, galleries, WebGL backgrounds, shaders, particles, motion systems, React Bits CLI/MCP commands, component props/dependencies, or when improving an existing page with React Bits while preserving accessibility, mobile performance, lifecycle cleanup, design-system fit, and license compliance.
---

# React Bits Frontend

Use the source-grounded SINAPSE corpus to implement React Bits as application code,
not as a black-box library.

## Locate the corpus

Resolve the SINAPSE package/repository root, then read
`docs/framework/react-bits/index.md`. Read only the category needed:

- `animations.md` for wrappers, cursors, trails, transitions and interactive effects.
- `text-animations.md` for headline, counter, scramble, marquee and reveal work.
- `components.md` for cards, navigation, galleries, inputs and compound UI.
- `backgrounds.md` for Canvas/WebGL/shader/particle backgrounds.
- `implementation-playbook.md` for integration, composition, accessibility and tuning.
- `audit-findings.md` when dependency, prop, variant or upstream accuracy matters.
- `inventory.json` for exact machine-readable props, dependencies and variant state.

If the corpus cannot be found, read `references/corpus-map.md`, then verify current
facts against the official registry and source before implementation.

## Workflow

1. Inspect the target stack, component architecture, design tokens, performance budget
   and existing animation/scroll ownership.
2. Translate the visual request into a user-experience function.
3. Search the relevant catalog and shortlist at most three candidates.
4. Compare visual fit, dependencies, runtime engine, props, interaction model,
   accessibility, mobile cost and compatibility with existing effects.
5. Open the official source for the selected variant. Treat source and registry as
   authoritative when docs conflict.
6. Run `npm view <package>` for every declared dependency before installing it.
7. Prefer TS-TW or TS-CSS in TypeScript projects. Never use the three empty CurvedInput
   variants recorded in the snapshot; use JS-CSS or verify that upstream fixed them.
8. Install through shadcn/jsrepo or copy manually. Keep upstream provenance and the
   required license notice for substantial copies.
9. Wrap the imported component behind a local application component. Map design
   tokens, content, breakpoints and quality presets at that boundary.
10. Implement reduced-motion behavior, semantic fallback, keyboard/focus behavior,
    cleanup and static/mobile fallback.
11. Test load, resize, route unmount/remount, long scroll, coarse pointer, reduced
    motion and low-power mobile. Measure frame time and memory.
12. Report component, variant, source SHA/URL, dependencies, adaptations, fallbacks and
    remaining risks.

## Composition rules

- Use one dominant motion effect per viewport and no more than two support effects.
- Prefer the lowest-cost engine that satisfies the visual objective.
- Allow only one owner for smooth scroll, custom cursor and each render loop.
- Do not stack multiple heavy WebGL/physics backgrounds without an explicit budget.
- Pause offscreen/hidden loops and dispose GPU resources on unmount.
- Preserve content and interaction when animation is disabled or fails.

## Accuracy rules

- Do not repeat the promotional “140+” as an exact count. The pinned snapshot has 139.
- Do not infer functional variants from registry names alone; inspect source bytes/code.
- Use registry JSON for install dependencies and source for actual API/behavior.
- Note documentation typos and per-variant divergences from `audit-findings.md`.
- Do not redistribute React Bits components as a standalone library, bundle, or port.
