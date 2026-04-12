---
task: design-pillar-cluster-model
responsavel: "@content-engineer"
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

# Task: Design Pillar-Cluster Model

> Projetar modelo pillar-cluster para SEO e autoridade tematica.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Co-agents** | editorial-strategist (North) |
| **Trigger** | Estrategia de blog/SEO ou construcao de autoridade tematica |
| **Input** | Pilares editoriais, keywords de SEO, conteudo existente |
| **Output** | Modelo pillar-cluster com paginas pilar, clusters e links internos |
| **Handoff** | → write-blog-article para producao das paginas |
| **Complexity** | complex |

---

## Fundamentacao

O modelo pillar-cluster e a estrategia de SEO mais eficaz para autoridade tematica. Uma "pagina pilar" (2000-5000 palavras) cobre um tema amplo; "paginas cluster" (800-1500 palavras) aprofundam subtemas; links internos conectam tudo. O Google interpreta essa estrutura como sinal de expertise profunda. Referencia: HubSpot — pillar page strategy, Ahrefs — topic clusters.

---

## Steps

### Step 1: Identificar Temas Pilar
Quais pilares editoriais tem potencial de SEO? Cada tema pilar deve ter: volume de busca significativo, amplidão para gerar 8-15 clusters, relevancia comercial para o cliente.

### Step 2: Mapear Clusters por Pilar
Para cada pilar: quais subtemas especificos tem busca? Usar dados de keyword research. Cada cluster = 1 artigo focado em 1 keyword long-tail. Minimo 8 clusters por pilar.

### Step 3: Projetar Pagina Pilar
Estrutura da pagina pilar: introducao abrangente, secoes para cada cluster (resumo + link), FAQ, recursos adicionais. Comprimento: 2000-5000 palavras. Formato: guia definitivo.

### Step 4: Planejar Links Internos
Cada cluster linka para a pagina pilar. A pagina pilar linka para todos os clusters. Clusters relacionados linkam entre si. Desenhar o mapa de links antes de escrever.

### Step 5: Definir Ordem de Producao
Comecar pela pagina pilar (ancora todo o cluster) → depois os clusters de maior volume → depois os de long-tail. Ordem importa porque links internos precisam existir.

### Step 6: Handoff

```yaml
handoff:
  artifact: "pillar-cluster-{tema}.md"
  context: "Modelo pillar-cluster: {N} pilares, {M} clusters totais, mapa de links definido"
  next: "write-blog-article para producao sequencial das paginas"
```
