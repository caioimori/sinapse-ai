# Chrome Brain Integration — Squad Design (Nexus)
> Squad Design tem acesso ao Chrome Brain para captura responsiva, inspecao de layout, auditoria de acessibilidade, Lighthouse scores e extracao de design systems de sites de referencia.
## Tier: 1
## Quando Ativar
- Precisa capturar screenshots responsivos (mobile 375px, tablet 768px, desktop 1440px) de uma pagina
- Inspecao de layout com DOM snapshot para mapear grid, flexbox, spacing e hierarquia de componentes
- Auditoria de acessibilidade: ARIA roles, labels, contrast ratios, tab order, focus states
- Extracao de design tokens de um site de referencia (cores, tipografia, spacing, border-radius)
- Lighthouse audit completo (performance, accessibility, best practices, SEO)
- Validacao visual de componente recem-implementado contra design spec
## O Que Recebe do Chrome Brain
- Screenshots responsivos em 3+ breakpoints (mobile, tablet, desktop)
- DOM snapshot com computed CSS de qualquer elemento
- Lighthouse report completo (scores + oportunidades + diagnosticos)
- ARIA tree e accessibility audit (roles, labels, contrast, violations)
- Design tokens extraidos: paleta de cores, font stack, spacing scale, shadows
- Layout grid/flexbox inspecionado (gap, columns, breakpoints, media queries)
- Core Web Vitals medidos em tempo real (LCP, FID, CLS, INP)
## O Que Envia pro Chrome Brain
- Requests de captura em breakpoints especificos
- Scripts de extracao de design tokens via evaluate_script
- Componentes para validacao visual em nova aba
- Checklists de acessibilidade para auditoria automatizada
- Resultados de comparacao visual (esperado vs implementado)

## Tools Disponiveis

1. **Chrome DevTools MCP** (29 tools) — acoes rapidas, screenshots, audit
2. **dev-browser** — scraping complexo, batch operations
3. **claude-in-chrome** — fallback visual

## Session Management

- Max 15 screenshots por sessao
- Salvar outputs em arquivo antes de acumular
- Rotacionar sessao a cada ~12 screenshots

## NSN Mode

Ativo. Se uma acao de browser falhar, tentar alternativas automaticamente.
Buscar solucao na internet. Configurar, testar, repetir. Max 5 ciclos.

## Auto-Learning

Ao descobrir novo pattern ou resolver barreira via NSN, atualizar:
`~/.sinapse/sinapse/knowledge-base/chrome-brain.md` → secao Learnings Log

## Referencia Completa

`~/.sinapse/sinapse/knowledge-base/chrome-brain.md`
