---
task: define-content-hierarchy
responsavel: "@dx-ux-strategist"
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

# Task: Define Content Hierarchy

## Metadata
- **Squad:** squad-design
- **Agent:** Compass (dx-ux-strategist)
- **Complexity:** Standard

## Objetivo
Definir a hierarquia de conteudo para cada template de pagina — priorizar informacoes, definir scanning patterns e garantir que o conteudo mais importante receba atencao proporcional.

## Entrada
- Information architecture
- User research (prioridades dos usuarios)
- Business goals (prioridades do negocio)
- Content inventory

## Passos

### 1. Priorizar Conteudo por Pagina
Para cada page template, classificar conteudo:

| Nivel | Prioridade | Tratamento Visual | Exemplos |
|-------|-----------|-------------------|---------|
| L1 | Critico | Hero, above-the-fold, grande | Headline, CTA principal |
| L2 | Importante | Destaque moderado | Value props, features-chave |
| L3 | Suporte | Tamanho padrao | Detalhes, specs |
| L4 | Contextual | Menor, colapsavel | FAQs, footnotes |

### 2. Mapear Scanning Patterns
| Pattern | Quando | Paginas tipicas |
|---------|--------|----------------|
| F-Pattern | Conteudo denso, text-heavy | Artigos, documentacao |
| Z-Pattern | Paginas simples, CTA-driven | Landing pages, home |
| Layer-Cake | Secoes horizontais | Long-form sales pages |
| Spotted | Scanning por keywords | Tabelas de precos, comparacoes |

### 3. Definir Content Blocks
```yaml
content_hierarchy:
  page_template: ""
  scanning_pattern: ""

  blocks:
    - id: "block-1"
      name: ""
      level: "L1"
      content_type: "[heading/body/media/cta/list/table]"
      character_estimate: ""
      responsive_priority: "[always/tablet+/desktop-only]"
      notes: ""
```

### 4. Validar com User Goals
| User Goal | Content que atende | Nivel |
|-----------|-------------------|-------|
| | | |

### 5. Cross-Reference com SEO
Alinhar hierarquia com:
- Heading structure (H1 > H2 > H3)
- Featured snippets opportunities
- Content above/below the fold

## Saida
- Content hierarchy map por page template
- Scanning pattern recommendations
- Content block specifications
- Handoff para Canvas (visual hierarchy) e squad-copy (copy structure)

## Validacao
- [ ] Hierarquia definida para todos os templates
- [ ] Scanning patterns documentados
- [ ] Content blocks com prioridade e tipo
- [ ] Alinhado com user goals
- [ ] Heading structure semantica
