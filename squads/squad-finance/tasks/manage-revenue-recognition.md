---
task: manage-revenue-recognition
responsavel: "@revenue-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: contracts
    tipo: array
    origem: "comercial, billing"
    obrigatorio: true

Saida:
  - campo: revenue_recognition_schedule
    tipo: document
    destino: "finance-orqx, contabilidade"

Checklist:
  - "[ ] Classificar modelo de reconhecimento por contrato"
  - "[ ] Calcular receita reconhecida vs diferida"
  - "[ ] Validar com entrega real"
  - "[ ] Gerar schedule de reconhecimento"
---

# Task: Manage Revenue Recognition

## Metadata
- **Agent:** revenue-analyst (Flow)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Gerenciar reconhecimento de receita por contrato, garantindo que receita reconhecida = valor entregue.

## Steps

1. **Classificar modelo por contrato:**
   ```
   | Modelo | Reconhecimento | Exemplo |
   |--------|---------------|---------|
   | Milestone | Na entrega de cada milestone | Projeto de desenvolvimento |
   | Time & Material | Horas efetivamente trabalhadas | Alocacao de equipe |
   | Retainer | Linear mensal | Suporte mensal |
   | Subscription | Linear mensal | SaaS |
   | Fixed Price | % completion | Projeto escopo fechado |
   ```
2. **Para cada contrato:**
   ```
   Valor_contratado: R$ X
   Receita_reconhecida: R$ Y (baseado no modelo)
   Receita_diferida: X - Y (recebido mas nao reconhecido)
   Receita_accrued: reconhecida mas nao faturada ainda
   ```
3. **Schedule de reconhecimento:**
   ```
   | Mes | Reconhecido | Acumulado | % do Total |
   ```
4. **Validar com delivery real** (conversar com PM/equipe)

## Output
- Schedule de reconhecimento por contrato
- Total: reconhecida, diferida, accrued
- Projecao de reconhecimento futuro
- Flags: contratos com divergencia delivery vs reconhecimento

## Quality Gates
- [ ] Cada contrato com modelo definido
- [ ] Reconhecimento alinhado com entrega real
- [ ] Diferida e accrued reconciliados

## Quando Usar
- Fechamento mensal
- Auditoria financeira
- Planejamento de receita
