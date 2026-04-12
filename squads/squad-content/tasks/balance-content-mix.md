---
task: balance-content-mix
responsavel: "@editorial-strategist"
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

# Task: Balance Content Mix

> Equilibrar o mix de conteudo entre educativo, entretenimento, inspiracional e comercial.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | editorial-strategist (North) |
| **Co-agents** | content-analyst (Lens) |
| **Trigger** | Mensal ou quando metricas indicam desequilibrio |
| **Input** | Historico de publicacoes, metricas por tipo, feedback da audiencia |
| **Output** | Analise de mix com recomendacoes de rebalanceamento |
| **Handoff** | → create-editorial-calendar |
| **Complexity** | simple |

---

## Fundamentacao

O mix de conteudo ideal segue o principio de Gary Vaynerchuk: "Jab, jab, jab, right hook" — dar valor 3x antes de pedir algo. Traduzido em proporcoes: ~40% educativo, ~25% inspiracional/entretenimento, ~20% autoridade/thought leadership, ~15% comercial/CTA. O desequilibrio mais comum e excesso de conteudo comercial, que erode confianca. Referencia: Gary Vaynerchuk — Jab Jab Jab Right Hook, Jay Baer — Youtility.

---

## Steps

### Step 1: Classificar Producao Recente
Ultimas 4-8 semanas: cada peca e EDUCATIVA (ensina algo), INSPIRACIONAL (motiva/emociona), ENTRETENIMENTO (diverte/engaja), AUTORIDADE (posiciona como expert), ou COMERCIAL (vende/CTA)?

### Step 2: Calcular Proporcoes Reais
Distribuicao real por tipo. Comparar com benchmark do setor e com proporcoes ideais definidas na estrategia.

### Step 3: Identificar Desequilibrios
Mapear desvios: excesso de comercial? Falta de autoridade? Zero entretenimento? Cada desequilibrio tem impacto diferente: muito comercial = perda de followers, pouco educativo = baixo save rate.

### Step 4: Recomendar Ajustes
Para cada desequilibrio: acao corretiva concreta. Exemplo: "Reduzir posts comerciais de 30% para 15%. Substituir por 2 carrosseis educativos/semana."

### Step 5: Handoff

```yaml
handoff:
  artifact: "content-mix-analysis-{date}.md"
  context: "Mix atual: E{X}% I{Y}% A{Z}% C{W}%, {N} ajustes recomendados"
  next: "create-editorial-calendar para aplicar rebalanceamento"
```
