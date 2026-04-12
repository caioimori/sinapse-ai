---
task: design-information-architecture
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

# Task: Design Information Architecture

## Metadata
- **Squad:** squad-design
- **Agent:** Compass (dx-ux-strategist)
- **Complexity:** Complex

## Objetivo
Projetar a arquitetura de informacao — organizar, estruturar e rotular conteudo de forma que usuarios encontrem o que precisam intuitivamente.

## Entrada
- User research synthesis
- Personas e journey maps
- Content inventory (se existente)
- Business requirements
- Card sorting results (se disponivel)

## Passos

### 1. Auditar Conteudo Existente
| Tipo | Quantidade | Status | Notas |
|------|-----------|--------|-------|
| Paginas | | | |
| Features | | | |
| Content types | | | |
| Media assets | | | |

### 2. Definir Taxonomia
Organizar conteudo em categorias logicas:
- **Top-down:** Baseado em business goals e modelo mental dos stakeholders
- **Bottom-up:** Baseado em card sorting e modelos mentais dos usuarios
- **Resultado:** Hibrido validado

### 3. Criar Sitemap
```yaml
sitemap:
  - page: "Home"
    path: "/"
    priority: "primary"
    children:
      - page: ""
        path: ""
        children: []
```

Niveis de navegacao:
- **Primario:** Ate 7 items (+/- 2, Miller's Law)
- **Secundario:** Ate 7 items por categoria
- **Terciario:** Contextual, progressive disclosure

### 4. Definir Navigation Patterns
| Pattern | Quando usar | Exemplo |
|---------|------------|---------|
| Global nav | Sempre visivel | Header menu |
| Local nav | Dentro de secao | Sidebar |
| Contextual nav | Relacionado ao conteudo | Related items |
| Breadcrumbs | Hierarquia profunda | Category > Sub > Page |
| Search | Conteudo vasto | Search bar |
| Faceted nav | Filtering complexo | Product catalog |

### 5. Criar Labeling System
Principios de rotulacao:
- Familiar ao usuario (nao jargao interno)
- Consistente em todo o produto
- Conciso mas descritivo
- Validado via tree testing

### 6. Validar com Tree Testing
Preparar cenarios de teste:
```yaml
tree_test:
  task: ""
  expected_path: []
  success_criteria: "Findability >= 80%"
```

### 7. Documentar IA
- Sitemap completo
- Navigation model
- Content model (types, relationships)
- Search strategy
- URL structure

## Saida
- Sitemap hierarquico
- Navigation model documentado
- Content model
- Labeling system
- Tree test results (se executado)
- Handoff para Canvas (layouts) e Scaffold (routing)

## Validacao
- [ ] Sitemap cobre todas as paginas/features
- [ ] Navegacao primaria <= 7 items
- [ ] Labels validados com usuarios
- [ ] URL structure semantica e consistente
- [ ] Modelo de conteudo definido
- [ ] Accessibility da navegacao considerada
