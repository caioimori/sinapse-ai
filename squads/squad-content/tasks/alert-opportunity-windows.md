---
task: alert-opportunity-windows
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

# Task: Alert Opportunity Windows

> Alertar sobre janelas de oportunidade time-sensitive para producao rapida.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | signal-intelligence (Radar) |
| **Co-agents** | content-orqx (Nexus) |
| **Trigger** | Sinal HOT detectado com janela curta |
| **Input** | Sinal classificado como HOT (SPV >= 4, janela < 24h) |
| **Output** | Alerta formatado para Nexus com sinal, janela e recomendacao |
| **Handoff** | → content-orqx (Nexus) para triage-urgent-signal |
| **Complexity** | simple |

---

## Fundamentacao

Velocidade e diferenciador em content marketing. Ser o primeiro a publicar sobre um trending topic gera 3-5x mais engajamento que ser o quinto. O alerta precisa ser rapido, claro e acionavel — sem analise excessiva que consuma a janela.

---

## Steps

### Step 1: Confirmar Urgencia
Verificar: SPV >= 4? Janela < 24h? Conecta com pilares? Se todos sim: emitir alerta.

### Step 2: Formatar Alerta
Alerta contém: sinal (1 frase), SPV score, janela estimada, pilar conectado, formato sugerido, angulo recomendado.

### Step 3: Enviar para Nexus
Entregar alerta para Nexus acionar triage-urgent-signal.

### Step 4: Handoff

```yaml
handoff:
  artifact: "opportunity-alert-{signal}.md"
  context: "Alerta HOT: {sinal}, SPV {score}, janela {horas}h"
  next: "content-orqx (Nexus) para triage-urgent-signal"
```
