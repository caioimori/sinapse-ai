---
task: optimize-for-algorithm
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

# Task: Optimize for Algorithm

> Otimizar conteudo para maximizar distribuicao algoritmica em cada plataforma.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Co-agents** | content-analyst (Lens) |
| **Trigger** | Antes da publicacao ou quando performance cai |
| **Input** | Conteudo finalizado, dados de algoritmo atuais, metricas recentes |
| **Output** | Conteudo otimizado com ajustes algoritmicos |
| **Handoff** | → content-governor (Index) para validacao final |
| **Complexity** | medium |

---

## Fundamentacao

Algoritmos mudam constantemente, mas os principios permanecem: plataformas querem manter usuarios engajados. Conteudo que retém atencao, gera interacao e mantem usuarios na plataforma sera distribuido. Otimizar para algoritmo nao e manipular — e alinhar o conteudo com o que a plataforma e os usuarios valorizam. Referencia: Adam Mosseri — Instagram ranking signals, Richard van der Blom — LinkedIn algorithm.

---

## Steps

### Step 1: Identificar Sinais de Ranking
Para a plataforma alvo: quais sao os sinais de ranking atuais? Instagram: saves, shares, time spent, engagement velocity. LinkedIn: dwell time, comments >15 words. TikTok: watch time, completion rate, replays.

### Step 2: Auditar Conteudo Atual
O conteudo atual esta otimizado para esses sinais? Checklist: tem hook forte (retencao)? Tem CTA que gera acao (engajamento)? Mantem na plataforma (sem links externos)?

### Step 3: Aplicar Otimizacoes
Ajustes especificos por sinal: adicionar save trigger ("salve para consultar depois"), adicionar share trigger ("marque alguem que..."), remover links externos do corpo, adicionar perguntas para comentarios.

### Step 4: Verificar Timing
Publicar no horario de pico da audiencia. Os primeiros 30-60 minutos de engajamento determinam a distribuicao algortimica.

### Step 5: Handoff

```yaml
handoff:
  artifact: "algo-optimization-{peca}.md"
  context: "Otimizado para algoritmo {plataforma}: {N} ajustes aplicados, sinais priorizados: {sinais}"
  next: "content-governor (Index) para validacao final"
```
