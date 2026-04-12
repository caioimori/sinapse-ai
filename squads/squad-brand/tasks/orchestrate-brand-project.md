---
task: orchestrate-brand-project
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

# Task: orchestrate-brand-project

## Metadata
- **Agent:** brand-orqx (Meridian)
- **Squad:** squad-brand
- **Trigger:** `*start-brand-project` ou novo projeto de marca
- **Inputs:** Briefing do cliente, tipo de projeto (novo/redesign/extensao), materiais existentes (se houver)
- **Outputs:** Projeto coordenado com timeline, status tracking, entregas por fase

## Description
Orquestra um projeto completo de marca do zero ao brand system final. Coordena todos os 9 agentes do squad em sequencia logica, gerenciando phase gates com Sentinel entre cada transicao de fase.

## Steps
1. Receber e analisar briefing do cliente (tipo, escopo, urgencia)
2. Classificar projeto: novo (zero-to-brand), redesign (diagnosis primeiro), extensao (application cycle)
3. Selecionar workflow adequado (zero-to-brand-system-cycle, brand-diagnosis-cycle, brand-application-cycle)
4. Carregar client-briefing-template se informacoes incompletas
5. Acionar Athena para brand-discovery com briefing completo
6. Monitorar progresso de cada fase
7. Em cada transicao: acionar Sentinel para phase-gate validation
8. Se APPROVED: preparar handoff para proxima fase com contexto completo
9. Se NEEDS REVISION: retornar ao agente responsavel com lista de correcoes
10. Coordenar fases paralelas quando possivel (visual + sonic, assets + collateral)
11. Na fase final: acionar Atlas para compilacao e delivery package
12. Entregar projeto concluido com audit report e brand consistency score

## Validation Criteria
- Todas as 9 fases executadas na ordem correta
- Phase gates validados por Sentinel entre cada transicao
- Nenhuma fase pulada sem justificativa documentada
- Handoffs com contexto completo entre agentes
- Brand consistency score >= 85 na auditoria final

## Output Format
```yaml
project:
  name: "{brand_name}"
  type: "new|redesign|extension"
  status: "in_progress|completed"
  current_phase: "{phase_name}"
  phases_completed: [list]
  brand_score: {number}
  delivery_package: "{path}"
```
