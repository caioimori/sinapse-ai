---
task: triage-financial-alerts
responsavel: "@finance-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: alerts
    tipo: array
    origem: "agentes da squad, sistemas financeiros"
    obrigatorio: true

Saida:
  - campo: triaged_alerts
    tipo: document
    destino: "stakeholders relevantes"

Checklist:
  - "[ ] Coletar alertas de todos os agentes"
  - "[ ] Classificar por severidade"
  - "[ ] Atribuir responsavel e prazo"
  - "[ ] Comunicar alertas criticos imediatamente"
---

# Task: Triage Financial Alerts

## Metadata
- **Agent:** finance-orqx (Ledger)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Triar alertas financeiros de todos os agentes, classificar por severidade e encaminhar para acao imediata quando necessario.

## Inputs
- Alertas de cada agente:
  - Margin: projeto com margem negativa, cliente nao-rentavel
  - Mint: rate realization abaixo de 75%, pricing abaixo do floor
  - Vault: budget estourado, cash runway < 3 meses, variance > 15%
  - Flow: aging > 60 dias, concentracao > 30%, DSO > 60

## Steps

1. **Coletar alertas** de todos os agentes
2. **Classificar severidade:**
   - CRITICO: cash runway < 3 meses, cliente > 40% receita com aging > 90
   - ALTO: margem negativa em projeto ativo, budget variance > 20%
   - MEDIO: DSO > 60, rate realization < 75%, concentracao > 25%
   - BAIXO: variance 5-15%, aging 30-60 dias
3. **Definir acao:** para cada alerta, definir acao, responsavel e prazo
4. **Comunicar:** alertas CRITICOS imediatamente, ALTO em 24h, MEDIO semanal

## Output
- Lista de alertas priados com severidade, acao, responsavel e prazo
- Alertas criticos em destaque
- Tendencia: alertas novos vs resolvidos vs recorrentes

## Quality Gates
- [ ] Nenhum alerta critico ignorado
- [ ] Todos os alertas tem acao definida
- [ ] Responsaveis notificados dentro do prazo

## Quando Usar
- Check semanal de saude financeira
- Anomalia detectada por qualquer agente
- Pre-reuniao de diretoria
