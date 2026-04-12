---
task: manage-phase-transition
responsavel: "@brand-orqx"
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

# Task: manage-phase-transition

## Metadata
- **Agent:** brand-orqx (Meridian)
- **Squad:** squad-brand
- **Trigger:** Fase atual concluida, precisa transicionar para proxima
- **Inputs:** Approval report de Sentinel, outputs da fase atual, proximo agente
- **Outputs:** Handoff executado, proxima fase iniciada

## Description
Gerencia a transicao entre fases do workflow de criacao de marca. Verifica aprovacao, prepara contexto e executa handoff para o proximo agente.

## Steps
1. Receber approval report de Sentinel para fase atual
2. Verificar decisao: APPROVED / NEEDS REVISION / REJECTED
3. Se NEEDS REVISION: retornar outputs ao agente com lista de correcoes, aguardar re-entrega
4. Se REJECTED: escalar para reuniao de realinhamento, documentar motivo
5. Se APPROVED: identificar proxima fase no workflow
6. Coletar todos os outputs relevantes da fase atual
7. Preparar pacote de handoff com: outputs, decisions, guidelines, constraints
8. Acionar proximo agente com contexto completo
9. Confirmar que proximo agente recebeu e compreendeu o contexto
10. Atualizar status do projeto (fase atual, progresso, timeline)

## Validation Criteria
- Phase gate tem decisao formal documentada (APPROVED/REVISION/REJECTED)
- Handoff contem todos os outputs necessarios para proxima fase
- Proximo agente confirmou recebimento do contexto
- Status do projeto atualizado

## Output Format
```yaml
transition:
  from_phase: "{phase_name}"
  to_phase: "{next_phase_name}"
  gate_decision: "APPROVED"
  handoff_context:
    outputs: [list]
    decisions: [list]
    constraints: [list]
  next_agent: "{agent_name}"
  status: "transitioned"
```
