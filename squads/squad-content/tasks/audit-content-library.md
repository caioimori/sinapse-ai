---
task: audit-content-library
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

# Task: Audit Content Library

> Auditar a biblioteca de conteudo existente para avaliar qualidade, cobertura e oportunidades.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-governor (Index) |
| **Co-agents** | content-analyst (Lens), editorial-strategist (North) |
| **Trigger** | Trimestral ou onboarding de novo projeto |
| **Input** | Inventario completo de conteudo publicado, pilares, metricas |
| **Output** | Relatorio de auditoria com score por peca, gaps e recomendacoes |
| **Handoff** | → editorial-strategist (North) para ajustes, content-analyst (Lens) para deep-dive |
| **Complexity** | complex |

---

## Fundamentacao

Auditar conteudo existente revela: pecas que podem ser atualizadas (mais barato que criar do zero), formatos que funcionam vs que nao funcionam, gaps tematicos, e debt de conteudo (pecas desatualizadas que prejudicam autoridade). Referencia: Andy Crestodina — content audit framework, HubSpot — historical optimization.

---

## Steps

### Step 1: Inventariar Todo Conteudo
Listar todas as pecas publicadas: titulo, formato, plataforma, data, pilar, metricas. Para blogs: URL, traffic, keywords rankeadas.

### Step 2: Classificar por Performance
Para cada peca: acima da media, na media, ou abaixo da media. Metricas variam por formato: blog (traffic, time on page), social (engagement rate, saves).

### Step 3: Avaliar Qualidade
Score de qualidade 1-5: (1) Alinhamento com pilar, (2) Profundidade, (3) Atualidade (dados/exemplos ainda validos?), (4) Brand voice consistency, (5) Template Contract compliance.

### Step 4: Identificar Acoes por Peca
Para cada peca: MANTER (boa performance, atual), ATUALIZAR (bom tema, dados desatualizados), CONSOLIDAR (multiplas pecas sobre mesmo tema), ARQUIVAR (irrelevante/desatualizado), REMOVER (prejudicial).

### Step 5: Mapear Gaps
Cruzar inventario com pilares: quais pilares tem pouco conteudo? Quais formatos estao sub-representados? Quais sub-temas nunca foram cobertos?

### Step 6: Gerar Relatorio
Relatorio executivo: total de pecas, distribuicao por score, acoes prioritarias, gaps criticos, recomendacoes de reaproveitamento.

### Step 7: Handoff

```yaml
handoff:
  artifact: "content-audit-{client}-{date}.md"
  context: "Auditoria: {N} pecas auditadas, {M} para atualizar, {G} gaps criticos, score medio {S}"
  next: "editorial-strategist (North) para incorporar gaps no planejamento"
```
