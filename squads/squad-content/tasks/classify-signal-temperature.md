---
task: classify-signal-temperature
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

# Task: Classify Signal Temperature

> Classificar sinais detectados por temperatura (HOT/WARM/COLD) com criterios objetivos e SPV.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | signal-intelligence (Radar) |
| **Trigger** | Cada sinal detectado no scan diario |
| **Input** | Sinal bruto, pilares editoriais, SPV criteria |
| **Output** | Sinal classificado: temperatura + SPV score + janela |
| **Handoff** | → alert-opportunity-windows (HOT) ou curate-weekly-briefing (WARM) |
| **Complexity** | simple |

---

## Fundamentacao

Classificacao objetiva elimina viés de urgencia. Sem criterios claros, tudo parece HOT. Com scoring estruturado, recursos sao alocados proporcionalmente ao potencial real. Referencia: viral-potential-scoring.md (SPV framework).

---

## Steps

### Step 1: Calcular SPV (5 criterios, 1-5 cada)
1. Share trigger (alguem compartilharia?) 2. Save trigger (alguem salvaria?) 3. Tensao cognitiva (gera curiosidade?) 4. Especificidade (e concreto?) 5. Timing (e o momento certo?)

### Step 2: Classificar Temperatura
- HOT: SPV medio >= 4 E janela < 24h → acao imediata
- WARM: SPV medio >= 3 E janela < 7d → briefing semanal
- COLD: SPV medio < 3 OU evergreen → arquivo para referencia

### Step 3: Definir Janela de Oportunidade
Estimar tempo util do sinal: flash (< 24h), curta (1-3 dias), media (1 semana), longa (evergreen).

### Step 4: Handoff

```yaml
handoff:
  artifact: "signal-classification"
  context: "Sinal '{sinal}' classificado: {temp}, SPV {score}, janela {tempo}"
  next: "alert-opportunity-windows se HOT, curate-weekly-briefing se WARM, arquivo se COLD"
```
