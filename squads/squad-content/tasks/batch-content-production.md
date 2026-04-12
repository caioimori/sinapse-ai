---
task: batch-content-production
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

# Task: Batch Content Production

> Produzir multiplas pecas de conteudo em lote otimizando eficiencia e consistencia.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Co-agents** | content-orqx (Nexus), platform-specialist (Morph) |
| **Trigger** | Sprint semanal ou producao em volume |
| **Input** | Lista de briefs, Espinhas Dorsais pre-definidas, Template Contracts |
| **Output** | Lote de pecas produzidas e validadas |
| **Handoff** | → content-governor (Index) para validacao em lote |
| **Complexity** | complex |

---

## Fundamentacao

Batching e a tecnica de produtividade mais eficaz para content production. Produzir 5 carrosseis de uma vez e 3x mais rapido que produzir 1 por dia — porque o custo de context switching e eliminado. O batching respeita: mesmo formato em sequencia, mesmo pilar em bloco, mesma plataforma por vez. Referencia: Andrea Fryrear — Agile Content Marketing, batching methodology.

---

## Steps

### Step 1: Organizar Lote por Formato
Agrupar pecas do sprint por formato: todos os carrosseis primeiro, depois todos os posts de texto, depois roteiros. Nao alternar entre formatos.

### Step 2: Preparar Espinhas Dorsais em Lote
Para todas as pecas do lote: definir TESE + MECANISMO + PROVA + DIRECAO. Fazer todas as Espinhas Dorsais antes de comecar a escrever. Separar fase de pensar da fase de escrever.

### Step 3: Produzir Textos em Sequencia
Escrever todas as pecas do mesmo formato em sequencia. Manter brand voice consistente. Revisar Template Contracts antes de iniciar cada bloco.

### Step 4: Cross-Check de Consistencia
Verificar: nenhuma peca do lote contradiz outra? Os angulos sao complementares, nao redundantes? O tom esta consistente? Vocabulario de marca mantido?

### Step 5: Validacao em Lote
Submeter lote completo para Index validar em uma passagem. Isso e mais eficiente que validar peca por peca.

### Step 6: Handoff

```yaml
handoff:
  artifact: "batch-production-{sprint}.md"
  context: "Batch produzido: {N} pecas, {F} formatos, {P} plataformas, tempo total {X}"
  next: "content-governor (Index) para validacao em lote"
```
