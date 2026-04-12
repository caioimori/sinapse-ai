---
task: manage-cross-squad-handoffs
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

# Task: Manage Cross-Squad Handoffs

## Metadata
- **Squad:** squad-design
- **Agent:** Nexus (design-orqx)
- **Complexity:** Standard

## Objetivo
Gerenciar handoffs bidirecionais entre squad-design e outros squads — validar inbound, preparar outbound.

## Entrada
- DX Brief com dependencias cross-squad
- Assets recebidos de outros squads
- Deliverables prontos para entrega

## Passos

### 1. Validar Inbound Handoffs
| De | O que recebemos | Validacao |
|----|----------------|-----------|
| squad-brand | Brand tokens (cores, tipografia, spacing) | Formato correto (JSON/CSS), naming consistente |
| squad-brand | Visual guidelines, moodboard | Completo, sem ambiguidades |
| squad-copy | Copy aprovada, CTAs, microcopy | Finalizada, sem pending reviews |
| squad-content | Content strategy, SEO briefs | Alinhado com IA do projeto |
| squad-research | User research, personas, insights | Dados atualizados, metodologia documentada |

### 2. Preparar Outbound Handoffs
| Para | O que entregamos | Checklist |
|------|-----------------|-----------|
| squad-growth | Paginas implementadas em staging | UTMs ready, tracking hooks, events definidos |
| squad-product | Component library (Storybook + npm) | Documentada, acessivel, performatica |
| squad-copy | UI copy specs | Character limits, truncation, responsive variants |
| squad-brand | Token feedback | Edge cases, dark mode issues, sugestoes |

### 3. Documentar Handoff
```yaml
handoff:
  direction: [inbound/outbound]
  from_squad: ""
  to_squad: ""
  artifacts: []
  validation_status: [validated/pending/issues]
  notes: ""
```

## Saida
- Handoff log documentado
- Issues de validacao comunicados
- Deliverables entregues ao squad destino

## Validacao
- [ ] Todos inbound assets validados
- [ ] Outbound deliverables completos
- [ ] Handoff log atualizado
- [ ] Issues comunicados aos squads relevantes
