---
task: audit-tag-manager-setup
responsavel: "@performance-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Audit Tag Manager Setup

## Metadata
- **Agent:** performance-engineer (Lighthouse)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Auditar setup de Google Tag Manager (GTM) e firing order para garantir tracking correto e performance.

## Steps

1. **Inventariar tags** - Todas as tags configuradas. Status: ativo, pausado, erro. Firing frequency: quantas vezes por pageview?
2. **Verificar triggers** - Triggers corretos para cada tag. Nao ha tags firing em todas as paginas que deveriam ser especificas. Nao ha triggers conflitantes
3. **Verificar data layer** - Data layer structure documentada. Variables necessarias presentes. Nao ha PII (personally identifiable info) no data layer sem hash
4. **Performance impact** - Tags que bloqueiam render (devem ser async). Tags heavy (>100KB de JS). Firing order otimizado (essenciais primeiro, analytics depois)
5. **Best practices** - Naming conventions para tags, triggers, variables. Folder organization. Version control (publicar com notas). Workspace management

## Output
GTM audit report com inventario, issues e recomendacoes.

## Quality Gates
- [ ] Todas as tags inventariadas
- [ ] Triggers verificados
- [ ] Performance impact avaliado
- [ ] Best practices verificadas

## Quando Usar
- Auditoria de conta nova
- Quando tracking nao funciona como esperado
- Antes de adicionar novas tags
