---
task: generate-budget-pacing-report
responsavel: "@budget-controller"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: month
    tipo: string
    origem: "usuario"
    obrigatorio: true

Saida:
  - campo: pacing_report
    tipo: document
    destino: "finance-orqx"

Checklist:
  - "[ ] Calcular pacing YTD"
  - "[ ] Projetar EAC"
  - "[ ] Alertar desvios"
---

# Task: Generate Budget Pacing Report

## Metadata
- **Agent:** budget-controller (Vault)
- **Squad:** squad-finance
- **Complexity:** SIMPLE

## Objetivo
Gerar report rapido de pacing do budget mostrando se a empresa esta no ritmo planejado.

## Steps

1. **Calcular pacing:**
   ```
   % do ano decorrido = Mes_atual / 12
   % do budget usado = Actual_YTD / Budget_anual
   Pacing = % budget usado / % ano decorrido

   Pacing = 1.0: on track
   Pacing > 1.1: gastando mais rapido que planejado
   Pacing < 0.9: gastando menos (positivo ou investindo menos)
   ```
2. **Por rubrica:** aplicar mesmo calculo por linha
3. **Projetar EAC:**
   ```
   EAC = Actual_YTD + (Budget_restante × Pacing)
   ```
4. **Alertar** rubricas fora do pacing

## Output
- Pacing geral e por rubrica
- EAC projetado
- Alertas de rubricas fora do ritmo

## Quality Gates
- [ ] Pacing calculado corretamente
- [ ] EAC consistente com tendencia

## Quando Usar
- Check semanal/quinzenal de budget
- Input para reuniao de gestao
