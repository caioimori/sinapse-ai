---
task: track-engagement-patterns
responsavel: "@content-analyst"
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

# Task: Track Engagement Patterns

> Rastrear padroes de engajamento da audiencia para identificar o que ressoa e por que.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-analyst (Lens) |
| **Trigger** | Semanal (monitoramento) ou sob demanda |
| **Input** | Dados de engajamento por peca, formato, horario, pilar |
| **Output** | Mapa de padroes com correlacoes e anomalias |
| **Handoff** | → editorial-strategist (North), content-engineer (Arc) |
| **Complexity** | medium |

---

## Fundamentacao

Padroes revelam o que numeros isolados escondem. Uma taxa de engajamento de 3% nao diz muito. Mas "carrosseis educativos postados as 10h nas tercas tem engagement 2.5x maior que a media" e um padrao acionavel. O rastreamento continuo identifica: o que funciona, quando funciona, para quem funciona, e em que formato funciona. Referencia: Sprout Social — engagement benchmarks, Later — engagement patterns research.

---

## Steps

### Step 1: Segmentar Dados
Segmentar engajamento por: formato, pilar, dia da semana, horario, tipo de CTA, tipo de hook, comprimento de caption, uso de hashtags.

### Step 2: Identificar Correlacoes
Quais combinacoes geram melhor resultado? Formato + dia + horario. Pilar + formato + CTA. Hook tipo + formato + audiencia. Buscar correlacoes com significancia estatistica.

### Step 3: Identificar Anomalias
Pecas que performaram muito acima ou abaixo do esperado. Por que? Evento externo, trend, horario atipico, assunto sensivel? Anomalias positivas podem ser replicadas; negativas devem ser evitadas.

### Step 4: Mapear Evolucao Temporal
Padroes mudam ao longo do tempo: o que funcionava ha 3 meses ainda funciona? Algoritmos mudam, audiencia evolui, tendencias rodam. O mapa temporal detecta quando um padrao esta "morrendo".

### Step 5: Gerar Recomendacoes de Padrao
Padroes confirmados viram regras: "Sempre postar carrossel educativo na terca as 10h", "Hook de dado supera hook de pergunta em 2x para pilar X".

### Step 6: Handoff

```yaml
handoff:
  artifact: "engagement-patterns-{period}.md"
  context: "Padroes: {N} correlacoes encontradas, {A} anomalias, {R} regras derivadas"
  next: "editorial-strategist (North) e content-engineer (Arc) para aplicar padroes"
```
