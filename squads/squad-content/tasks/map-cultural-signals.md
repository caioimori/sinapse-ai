---
task: map-cultural-signals
responsavel: "@signal-intelligence"
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

# Task: Map Cultural Signals

> Mapear movimentos culturais com relevancia e seguranca para a marca do cliente.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | signal-intelligence (Radar) |
| **Co-agents** | — |
| **Trigger** | Sinal cultural detectado (meme, movimento, debate publico) |
| **Input** | Sinal cultural, brand guidelines, posicionamento da marca |
| **Output** | Avaliacao de relevancia + risco + recomendacao de acao |
| **Handoff** | → editorial-strategist (North) se relevante, descarte se arriscado |
| **Complexity** | complex |

---

## Fundamentacao

Sinais culturais sao os mais poderosos para engajamento — e os mais arriscados. Um meme bem usado pode viralizar. Um posicionamento cultural forcado pode destruir reputacao. A avaliacao deve ser rapida (janela curta) mas criteriosa (risco alto). Referencia: Rachel Botsman — trust framework aplicado a decisoes de posicionamento cultural.

---

## Steps

### Step 1: Detectar Sinal Cultural
Identificar: memes emergentes, debates publicos, movimentos sociais, datas simbolicas, fenomenos de cultura pop, tendencias esteticas/comportamentais.

### Step 2: Avaliar Conexao com Marca
Consultar brand guidelines: o sinal conecta com posicionamento, valores ou pilares da marca? Se forcado, descartar.

### Step 3: Avaliar Risco
Criterios: controverso? Politicamente sensivel? Pode alienar parte da audiencia? Pode ser mal interpretado? Se risco > beneficio, documentar mas NAO recomendar.

### Step 4: Definir Angulo Seguro
Se relevante E seguro: qual angulo a marca pode usar sem ser oportunista? Como contribuir para a conversa (nao apenas surfar)?

### Step 5: Handoff

```yaml
handoff:
  artifact: "cultural-signal-assessment-{signal}.md"
  context: "Sinal cultural avaliado: {relevante/arriscado/irrelevante}, angulo {definido/descartado}"
  next: "editorial-strategist (North) se aprovado, arquivo se descartado"
```
