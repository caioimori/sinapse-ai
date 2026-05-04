---
task: create-web-templates
responsavel: "@brand-creative-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: create-web-templates

## Metadata
- **Agent:** brand-creative-engineer (Forge)
- **Squad:** squad-brand
- **Trigger:** `*create-web-template`
- **Inputs:** Design system, visual guidelines, motion specs
- **Outputs:** Web page templates HTML/CSS responsivos

## Description
Cria templates de pagina web em HTML/CSS implementaveis, usando design system e micro-interactions.

## Steps
1. Criar Landing Page: hero (headline + CTA + imagem), features section, testimonials, pricing, footer
2. Criar About Page: historia, equipe, valores, timeline
3. Criar Service/Product Page: hero, beneficios, detalhes, CTA
4. Aplicar design system de Grid (tokens, componentes, grid)
5. Responsivo mobile-first (mobile → tablet → desktop → wide)
6. Incluir micro-interactions de Flux (hover, scroll reveal, transitions)
7. Garantir acessibilidade (ARIA, keyboard nav, contrast)
8. Otimizar performance (lazy loading, critical CSS)
9. Documentar secoes customizaveis

## Validation Criteria
- 3+ page templates criados
- Responsivo em 4 breakpoints
- Design system aplicado (tokens, componentes)
- Acessibilidade WCAG AA
- Performance otimizada

## Output Format
Pasta /assets/web-templates/ com HTML/CSS por pagina + documentacao.
