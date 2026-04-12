---
task: verify-algorithmic-hooks
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

# Task: Verify Algorithmic Hooks

> Verificar se hooks e elementos de retencao estao otimizados para sinais algoritmicos de cada plataforma.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Co-agents** | platform-specialist (Morph), content-analyst (Lens) |
| **Trigger** | Pre-publicacao de conteudo de alto investimento |
| **Input** | Conteudo finalizado, padroes de retencao por plataforma, dados de top performers |
| **Output** | Verificacao de hooks com score de retencao estimada e ajustes |
| **Handoff** | → content-governor (Index) para publicacao |
| **Complexity** | medium |

---

## Fundamentacao

Algoritmos de plataformas sao maquinas de retencao: eles distribuem conteudo que mantem usuarios na plataforma. Cada plataforma mede retencao de forma diferente: Instagram mede saves e shares, TikTok mede completion rate, LinkedIn mede dwell time, YouTube mede watch time. Hooks e pattern interrupts sao os mecanismos que maximizam esses sinais. Verificar hooks antes da publicacao e um quality gate que garante que o conteudo esta otimizado para distribuicao. Referencia: Brendan Kane — Hook Point, padroes algoritmicos de cada plataforma.

---

## Steps

### Step 1: Identificar Sinais Algoritmicos da Plataforma
Para a plataforma-alvo: quais sinais o algoritmo prioriza? Instagram: saves > shares > comments > likes. TikTok: completion rate > replays > shares. LinkedIn: dwell time > comments (>15 words). YouTube: watch time > CTR.

### Step 2: Verificar Hook Principal
O hook dos primeiros 1-3 segundos/linhas esta otimizado para o sinal principal? Para video: o hook cria retencao visual imediata? Para texto: as primeiras linhas geram click em "ver mais"? Score 1-5.

### Step 3: Verificar Pattern Interrupts
Para conteudo > 15s ou > 3 slides: existem pattern interrupts a cada 5-8 segundos? Cada interrupt reseta a atencao e previne abandono. Quantidade adequada para a duracao/tamanho?

### Step 4: Verificar Save/Share Triggers
O conteudo tem elementos que geram save (valor de referencia, frameworks, listas) ou share (identificacao, humor, provocacao)? Sem triggers explicitos, saves e shares dependem de sorte.

### Step 5: Verificar CTA Algoritmico
O CTA esta posicionado para maximizar o sinal desejado? "Salve para consultar depois" (save trigger). "Mande para alguem que precisa" (share trigger). "Comente sua opiniao" (engagement trigger).

### Step 6: Emitir Score de Retencao Estimada
Score composto: hook (30%) + interrupts (25%) + triggers (25%) + CTA (20%). Score >= 7: otimizado. 5-6: aceitavel. < 5: requer ajustes.

### Step 7: Handoff

```yaml
handoff:
  artifact: "algorithmic-hooks-check-{peca}.md"
  context: "Hooks verificados: score {score}/10, {N} ajustes sugeridos, plataforma {plataforma}"
  next: "content-governor (Index) para gate final de publicacao"
```
