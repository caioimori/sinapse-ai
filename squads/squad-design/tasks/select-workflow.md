---
task: select-workflow
responsavel: "@design-orqx"
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

# Task: Select Workflow

## Metadata
- **Squad:** squad-design
- **Agent:** Nexus (design-orqx)
- **Complexity:** Standard

## Objetivo
Selecionar o workflow correto com base na classificacao do projeto e configurar a sequencia de execucao.

## Entrada
- Classificacao do projeto (de classify-project-type)
- DX Brief completo

## Passos

### 1. Consultar Matriz de Decisao
| Tipo de Projeto | Workflow | Fases | Duracao Tipica |
|----------------|---------|-------|---------------|
| New Build / Redesign | zero-to-digital-product-cycle | 6 | 4-12 semanas |
| Component Library | design-system-build-cycle | 6 | 3-8 semanas |
| Landing Page / Campanha | landing-page-sprint | 3 | 1-2 semanas |
| Performance ruim | performance-remediation-cycle | 4 | 1-3 semanas |
| Compliance a11y | a11y-compliance-cycle | 4 | 2-4 semanas |
| Pesquisa UX | ux-research-sprint | 4 | 1-3 semanas |

### 2. Avaliar Necessidade de Workflow Hibrido
Se o projeto combina mais de um tipo:
- **Build + Design System:** zero-to-digital-product-cycle com Phase 3 extendida
- **Build + Research:** ux-research-sprint ANTES de zero-to-digital-product-cycle
- **Performance + A11y:** Executar ambos em paralelo (Apex + Beacon)

### 3. Configurar Gates e Agentes
Definir quais gates sao obrigatorios e quais agentes estao ativos para o workflow selecionado.

### 4. Documentar Selecao

## Saida
```yaml
workflow_selection:
  primary: [nome do workflow]
  secondary: [se hibrido]
  phases: [numero]
  active_agents: [lista]
  gates:
    - name: [gate]
      blocking: [true/false]
  estimated_duration: [semanas]
```

## Validacao
- [ ] Workflow adequado ao tipo de projeto
- [ ] Hibrido justificado (se aplicavel)
- [ ] Gates configurados
- [ ] Timeline estimada
