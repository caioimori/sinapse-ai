---
task: flag-content-for-amplification
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

# Task: Flag Content for Amplification

> Identificar conteudo com potencial de amplificacao (paid boost, repost, collab).

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Co-agents** | content-analyst (Lens) |
| **Trigger** | Pos-publicacao quando conteudo mostra sinais de performance acima da media |
| **Input** | Metricas de performance inicial (primeiras 24-48h), benchmarks |
| **Output** | Lista de conteudo flagged com recomendacao de amplificacao |
| **Handoff** | → content-orqx (Nexus) para decisao de investimento |
| **Complexity** | simple |

---

## Fundamentacao

Amplificar conteudo que ja esta performando organicamente e a melhor alocacao de budget. Pagar para boostar conteudo que nao engaja organicamente e desperdicio. O flag identifica "vencedores" cedo para maximizar ROI de amplificacao. Referencia: Facebook/Meta — boost top performers strategy, Gary Vaynerchuk — $1.80 strategy.

---

## Steps

### Step 1: Monitorar Performance Inicial
Nas primeiras 24-48h: o conteudo esta acima do benchmark medio? Metricas: engagement rate vs media, share/save rate vs media, reach growth velocity.

### Step 2: Aplicar Criterios de Flag
Flag se: engagement rate > 1.5x media, OU share rate > 2x media, OU save rate > 2x media, OU velocity de alcance acima do normal. Pelo menos 1 criterio atendido.

### Step 3: Classificar Tipo de Amplificacao
(1) BOOST: pago — investir budget para escalar alcance. (2) REPOST: organico — repostar em outra plataforma/horario. (3) COLLAB: parceria — propor a creator/parceiro para co-amplificacao.

### Step 4: Estimar ROI
Para BOOST: estimativa de alcance adicional por investimento. Para REPOST: potencial de alcance incremental. Para COLLAB: alcance combinado.

### Step 5: Handoff

```yaml
handoff:
  artifact: "amplification-flags-{date}.md"
  context: "Flagged: {N} pecas para amplificacao, tipos: {B} boost, {R} repost, {C} collab"
  next: "content-orqx (Nexus) para decisao de investimento"
```
