---
task: design-content-atomization
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

# Task: Design Content Atomization

> Projetar a atomizacao de conteudo pilar em multiplos formatos e plataformas.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Co-agents** | content-engineer (Arc) |
| **Trigger** | Conteudo pilar (blog, video longo, webinar) pronto para distribuicao |
| **Input** | Conteudo pilar original, plataformas ativas, Template Contracts |
| **Output** | Plano de atomizacao com formato derivado por plataforma |
| **Handoff** | → batch-platform-adaptation |
| **Complexity** | complex |

---

## Fundamentacao

Atomizacao e a pratica de transformar 1 peca de conteudo pilar em 8-15 pecas derivadas. Um artigo de blog pode virar: 3 carrosseis, 2 reels, 1 thread, 1 newsletter excerpt, 5 stories, 1 LinkedIn post. Isso maximiza ROI de producao e garante presenca multi-plataforma. Referencia: Gary Vaynerchuk — content model (pillar → micro-content), Jay Baer — repurposing strategy.

---

## Steps

### Step 1: Identificar Atomos
Analisar o conteudo pilar: quais secoes/insights sao "atomos" independentes que funcionam sozinhos? Cada atomo = 1 peca derivada potencial. Um blog de 2000 palavras tipicamente tem 5-10 atomos.

### Step 2: Mapear Atomo → Formato
Para cada atomo: qual formato maximiza o valor? Dado surpreendente → Reel. Framework → Carrossel. Historia → Thread. Dica acionavel → Story. Opiniao → LinkedIn post.

### Step 3: Definir Prioridade de Producao
Nem todo atomo merece ser produzido. Priorizar por: impacto potencial, esforco de producao, cobertura de plataforma. Produzir 8-10 pecas derivadas do pilar mais forte.

### Step 4: Planejar Sequencia de Publicacao
Distribuir pecas derivadas ao longo do tempo: nao publicar tudo no mesmo dia. Sequencia tipica: conteudo pilar → 2-3 teasers (pre) → derivados ao longo de 2 semanas (pos).

### Step 5: Verificar Nao-Redundancia
As pecas derivadas devem agregar valor diferente, nao repetir o mesmo conteudo em formatos diferentes. Cada derivado tem angulo ou profundidade unica.

### Step 6: Handoff

```yaml
handoff:
  artifact: "atomization-plan-{pilar}.md"
  context: "Atomizacao: {N} atomos identificados, {M} derivados planejados, {P} plataformas cobertas"
  next: "batch-platform-adaptation para producao em lote das pecas derivadas"
```
