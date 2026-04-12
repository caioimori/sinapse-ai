---
task: adapt-for-blog-seo
responsavel: "@platform-specialist"
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

# Task: Adapt for Blog SEO

> Otimizar artigo de blog para SEO on-page e encontrabilidade organica.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Co-agents** | content-engineer (Arc) |
| **Trigger** | Artigo de blog finalizado que precisa otimizacao SEO |
| **Input** | Artigo original, keyword target, dados de SERP, Template Contract Blog |
| **Output** | Artigo otimizado com meta tags, headers, links internos, schema |
| **Handoff** | → content-governor (Index) para validacao final |
| **Complexity** | medium |

---

## Fundamentacao

SEO nao e encher texto de keywords — e garantir que o conteudo seja encontrado por quem precisa dele. SEO on-page moderno foca em: intent match (o conteudo responde o que o usuario busca?), topical authority (o site cobre o tema em profundidade?), e UX signals (o usuario fica e interage?). Referencia: Ahrefs — on-page SEO guide, Brian Dean — definitive guide to SEO, Google Search Central — helpful content guidelines.

---

## Steps

### Step 1: Otimizar Title Tag e Meta Description
Title: keyword principal + modificador + beneficio. Max 60 chars. Meta description: resumo + keyword + CTA implicito. Max 155 chars. Ambos devem incentivar clique.

### Step 2: Estruturar Headers com Keywords
H1: keyword principal. H2s: keywords secundarias/relacionadas. H3s: long-tail e perguntas. Headers formam a estrutura semantica que o Google interpreta.

### Step 3: Otimizar Corpo
Keyword principal nas primeiras 100 palavras. Densidade natural (1-2%). Keywords semanticamente relacionadas (LSI). Paragrafos curtos, listas, imagens a cada 300-400 palavras.

### Step 4: Links Internos e Externos
3-5 links internos para conteudo relacionado (pillar-cluster). 1-2 links externos para fontes autoritativas. Anchor text descritivo (nao "clique aqui").

### Step 5: Otimizar Imagens
Alt text descritivo com keyword quando natural. Nomes de arquivo descritivos. Compressao para velocidade. Formato WebP quando possivel.

### Step 6: Schema Markup
Adicionar schema relevante: Article, FAQ, HowTo, BreadcrumbList. Schema aumenta chances de rich snippets na SERP.

### Step 7: Handoff

```yaml
handoff:
  artifact: "blog-seo-{peca}.md"
  context: "SEO otimizado: keyword '{kw}', {N} links internos, schema '{tipo}', meta tags completas"
  next: "content-governor (Index) para validacao final"
```
