---
task: manage-content-taxonomy
responsavel: "@content-governor"
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

# Task: Manage Content Taxonomy

> Gerenciar a taxonomia de conteudo que organiza e categoriza todo o inventario.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-governor (Index) |
| **Trigger** | Setup de projeto ou revisao trimestral |
| **Input** | Pilares editoriais, formatos ativos, plataformas, funil |
| **Output** | Taxonomia estruturada com categorias, tags e regras de classificacao |
| **Handoff** | → organize-content-archive |
| **Complexity** | medium |

---

## Fundamentacao

Taxonomia e o sistema de organizacao que permite encontrar, reutilizar e analisar conteudo. Sem taxonomia, conteudo se perde em pastas desorganizadas. Uma boa taxonomia tem: categorias mutuamente exclusivas, tags flexiveis, e hierarquia logica. Referencia: Kristina Halvorson — Content Strategy for the Web, IA (Information Architecture) principles.

---

## Steps

### Step 1: Definir Categorias Primarias
Baseadas nos pilares editoriais. Cada peca pertence a exatamente 1 categoria primaria. Categorias sao mutuamente exclusivas.

### Step 2: Definir Tags Secundarias
Tags flexiveis: formato (carrossel, blog, reel), plataforma, estagio de funil, tipo de conteudo (educativo, inspiracional, comercial), status (draft, publicado, arquivado).

### Step 3: Definir Hierarquia
Pilar → Sub-tema → Peca. Permite navegar de cima para baixo (exploracao) e de baixo para cima (contexto).

### Step 4: Documentar Regras de Classificacao
Para cada tag: criterio claro de aplicacao. Quando usar "educativo" vs "autoridade"? Quando um post e "topo" vs "meio" de funil? Regras eliminam ambiguidade.

### Step 5: Handoff

```yaml
handoff:
  artifact: "content-taxonomy-{client}.md"
  context: "Taxonomia definida: {N} categorias, {T} tags, hierarquia {niveis} niveis"
  next: "organize-content-archive para aplicar taxonomia ao inventario existente"
```
