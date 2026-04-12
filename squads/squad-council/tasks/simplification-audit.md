---
task: simplification-audit
responsavel: "@derek-sivers"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: business_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: simplification_report
    tipo: document
    destino: Console

Checklist:
  - "[ ] Complexidades desnecessarias identificadas"
  - "[ ] Cada elemento justificado ou eliminado"
  - "[ ] Versao simplificada projetada"
  - "[ ] Plano de subtracao implementavel"
---

# Task: Simplification Audit

## Metadata
- **Squad:** squad-council
- **Agent:** Derek Sivers
- **Complexity:** Standard

## Objetivo
Auditar e simplificar processos, ofertas e estruturas de negocio usando a filosofia Sivers de simplicidade radical. "The more you add, the more you dilute. The more you subtract, the more you reveal." Cada elemento deve justificar sua existencia ou ser eliminado.

## Pre-Condicoes
- Negocio, processo ou oferta definida para auditoria
- Disposicao para cortar (nao apenas adicionar)
- Coragem para desafiar "sempre fizemos assim"

## Passos

### 1. Inventariar Tudo
Listar TODOS os elementos do sistema sob auditoria:
| # | Elemento | Tipo | Existe Desde | Ultima vez que foi questionado |
|---|---------|------|-------------|------------------------------|
| | | processo/produto/feature/reuniao/report/role | | |

"If you're not embarrassed by how simple your business is, it's probably too complex."

### 2. Aplicar o Teste de Existencia
Para cada elemento:
| Teste | Pergunta | Resposta |
|-------|---------|---------|
| Necessidade | Se removessemos, alguem reclamaria? | |
| Valor | Quanto valor isto gera vs quanto custa? | |
| Duplicacao | Outro elemento faz a mesma coisa? | |
| Historico | Existe por necessidade atual ou habito? | |
| Complexidade | A complexidade e justificada pelo valor? | |

### 3. Classificar por Essencialidade
| Classificacao | Criterio | Acao |
|--------------|---------|------|
| ESSENTIAL | Remove e o sistema quebra | Manter e otimizar |
| USEFUL | Agrega valor mensuravel | Manter e simplificar |
| NICE-TO-HAVE | Agrega valor marginal | Candidato a eliminacao |
| LEGACY | Existe por habito, nao necessidade | Eliminar |
| HARMFUL | Gera mais custo que valor | Eliminar imediatamente |

### 4. Aplicar a Regra Sivers: "What Would This Look Like If It Were Easy?"
Para cada processo/produto core:
| Processo | Versao Atual (complexa) | Versao "If Easy" | O que muda? |
|----------|----------------------|-----------------|------------|
| | | | |

"Most people overestimate what they need. A business plan? No. Just start. A big team? No. Stay small."

### 5. Auditar Comunicacao
| Comunicacao | Para Quem | Frequencia | Necessaria? | Simplificacao |
|------------|----------|-----------|------------|--------------|
| Reports | | | | |
| Emails | | | | |
| Reunioes | | | | |
| Aprovacoes | | | | |
| Documentacao | | | | |

### 6. Auditar Ofertas/Produtos
| Oferta | % da Receita | % do Esforço | Revenue/Effort Ratio | Acao |
|--------|-------------|-------------|---------------------|------|
| | | | | manter/simplificar/eliminar |

"One product, done incredibly well, is better than ten products done okay."

### 7. Projetar Versao Simplificada
Depois das eliminacoes:
```
ANTES:
  Elementos: X
  Processos: Y
  Produtos: Z
  Complexidade (subjetiva): /10

DEPOIS:
  Elementos: X'
  Processos: Y'
  Produtos: Z'
  Complexidade (subjetiva): /10

Reducao: ___%
```

### 8. Criar Plano de Subtracao
| Semana | O que Eliminar/Simplificar | Impacto Esperado | Risco | Rollback? |
|--------|--------------------------|-----------------|-------|----------|
| 1 | Quick wins (obvios) | | Baixo | |
| 2-3 | Medium impact | | Medio | |
| 4+ | Strategic simplifications | | Alto | |

Regra Sivers: "If it's not useful or beautiful, don't keep it."

### 9. Estabelecer "Complexity Budget"
Limites para prevenir re-complexificacao:
- Maximo de N processos
- Maximo de N produtos/ofertas
- Cada novo elemento adicionado = um eliminado (one-in-one-out)
- Revisao trimestral de complexidade

## Output
```yaml
simplification_report:
  scope: ""
  date: ""
  inventory:
    total_elements: 0
    essential: 0
    useful: 0
    nice_to_have: 0
    legacy: 0
    harmful: 0
  eliminations: []
  simplifications: []
  before_after:
    elements_before: 0
    elements_after: 0
    reduction_pct: ""
  complexity_budget: ""
  subtraction_plan: []
```

## Validacao
- [ ] Inventario completo de elementos
- [ ] Cada elemento testado (necessidade, valor, duplicacao)
- [ ] Classificacao por essencialidade aplicada
- [ ] "If it were easy" aplicado aos processos core
- [ ] Versao simplificada projetada com metricas
- [ ] Plano de subtracao com timeline
- [ ] Complexity budget definido para prevenir re-complexificacao
