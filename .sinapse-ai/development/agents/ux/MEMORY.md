# UX Design Expert Agent Memory (Mosaic)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Key Patterns
- CommonJS (`require`/`module.exports`), NOT ES Modules
- ES2022, Node.js 18+, 2-space indent, single quotes
- kebab-case for files, PascalCase for components

### Project Structure
- `.sinapse-ai/core/` — Core modules
- `docs/` — Documentation and design specs
- `packages/` — Shared packages

### Git Rules
- NEVER push — delegate to @devops
- Conventional commits: `docs:` for design specs, `feat:` for components

### Design Conventions
- Atomic Design principles (atoms → molecules → organisms → templates → pages)
- Design tokens for consistent theming
- WCAG 2.1 AA compliance target

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->


<!-- ENG-GROUNDING:v1 -->
## ⚙️ Núcleo: Engenharia com IA (base do Caio)

> Complemento transversal à munição do seu papel. Base: 60 domínios · 1.617 fichas (kits em `engenharia-software/fase-4-agents/`, núcleo `KIT-ai-engineering`). Código gerado ≠ código verificado.

**Leis invioláveis — Engenharia com IA (núcleo transversal):**
1. Use o MENOR nível de autonomia que resolve (código determinístico > workflow > agente).
2. Spec antes de código; todo artefato traça a um critério de aceite (No Invention); ambiguidade sobe, nunca se infere.
3. Todo loop tem freio: max-iterações/timeout definido ANTES.
4. Ação sem verificação é cega; ação irreversível (push/deploy/delete/migração) exige checkpoint humano.
5. Contexto é finito: cure o mínimo de tokens certos, crítico nas bordas, compacte acima de ~60%, não releia.
6. Eval é o gate; saída de LLM é input NÃO confiável — valide schema + grounding antes de usar.
7. A tool é um contrato (erro = próximo prompt acionável); menos tools de alto valor; privilégio mínimo.

**Gates de frontend (KIT-frontend):** rendering é decisão de produto · server state no TanStack Query · anime só transform/opacity, nunca bloqueie a main thread >50ms · meça no campo (P75/CrUX) · HTML semântico antes de ARIA, contraste ≥4.5:1, prefers-reduced-motion sempre · layout fluido ZERO overflow (320–1920px), sem max-width hardcoded, clamp() fora da dead-zone 32-48px · screenshot desktop+mobile + axe + LCP<2.5s/INP<200ms/CLS<0.1 antes de "pronto".

**Gates de craft de produto (KIT-product-craft):** token SEMÂNTICO, nunca hex/primitivo · pesquise comportamento real (5 usuários ~85%) · 45-75ch, assimetria intencional, identity layer (#0A0A0A, nunca #000) · motion só se ensina algo · conversão reduz fricção antes de motivação, nunca dark pattern · teste dos 5 segundos antes de "pronto".

NUNCA declare "Done" com eval vermelho, critério sem passar, ou ação irreversível sem checkpoint.
<!-- /ENG-GROUNDING:v1 -->
