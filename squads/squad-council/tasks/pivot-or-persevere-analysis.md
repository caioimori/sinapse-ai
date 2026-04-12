---
task: pivot-or-persevere-analysis
responsavel: "@reid-hoffman"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: current_situation
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: pivot_decision
    tipo: document
    destino: Console

Checklist:
  - "[ ] Evidencias para pivotar catalogadas"
  - "[ ] Evidencias para perseverar catalogadas"
  - "[ ] ABZ Planning aplicado"
  - "[ ] Decisao fundamentada com plano de acao"
---

# Task: Pivot or Persevere Analysis

## Metadata
- **Squad:** squad-council
- **Agent:** Reid Hoffman
- **Complexity:** Standard

## Objetivo
Conduzir uma analise estruturada de pivot-or-persevere usando o framework ABZ de Hoffman. Quando o plano A nao esta funcionando como esperado, decidir entre ajustar, pivotar para plano B, ou reconhecer que precisa do plano Z (lifeboat).

## Pre-Condicoes
- Negocio ou projeto com dados de performance
- Expectativas originais documentadas (para comparacao)
- Honestidade sobre o estado real das coisas

## Passos

### 1. Diagnosticar o Estado Atual
| Dimensao | Expectativa Original | Realidade Atual | Delta |
|----------|---------------------|----------------|-------|
| Revenue/traction | | | |
| Customer engagement | | | |
| Market response | | | |
| Team morale | | | |
| Cash position | | | |
| Competitive landscape | | | |

### 2. Aplicar ABZ Planning (Hoffman Framework)
```
Plan A: O plano atual — o que estamos fazendo agora
Plan B: Pivot — mudanca baseada no que aprendemos
Plan Z: Lifeboat — fallback se tudo der errado
```

**Plan A Assessment:**
- O que esta funcionando? (preservar)
- O que NAO esta funcionando? (mudar)
- O que aprendemos que nao sabiamos? (insight)
- O plano A pode ser ajustado sem pivot? (iterate vs pivot)

### 3. Catalogar Sinais de Pivot
| Sinal | Presente? | Forca (1-5) |
|-------|----------|-----------|
| Metricas flat apesar de esforço | | |
| Clientes pedem algo diferente do que vendemos | | |
| Competidor fez melhor com abordagem diferente | | |
| Team perde energia/conviccao | | |
| Mercado mudou desde o lancamento | | |
| Unit economics nao convergem | | |
| Cada novo cliente custa mais que o anterior | | |

### 4. Catalogar Sinais de Perseverar
| Sinal | Presente? | Forca (1-5) |
|-------|----------|-----------|
| Metricas melhorando (mesmo devagar) | | |
| Clientes existentes tem alto engagement | | |
| Feedback qualitativo forte ("love it") | | |
| Concorrentes validam o mercado ao entrar | | |
| Distribuicao esta sendo construida | | |
| Aprendizados recentes abrem novas possibilidades | | |
| Recurso novo pode mudar a dinamica | | |

### 5. Identificar Planos B Potenciais
Tipos de pivot:
| Tipo | Descricao | Aplicabilidade |
|------|-----------|---------------|
| Customer pivot | Mesmo produto, diferente cliente | |
| Problem pivot | Mesmo cliente, diferente problema | |
| Solution pivot | Mesmo problema, diferente solucao | |
| Channel pivot | Mesmo produto, diferente distribuicao | |
| Revenue model pivot | Mesmo produto, diferente monetizacao | |
| Technology pivot | Mesmo objetivo, diferente tecnologia | |

Para cada plano B viavel:
- O que preservamos do plano A?
- O que mudamos fundamentalmente?
- Que evidencia suporta esta direcao?
- Quanto tempo/recurso para testar?

### 6. Definir Plano Z (Lifeboat)
- Se tudo falhar, qual e o fallback aceitavel?
- Quanto de runway temos antes de precisar do plano Z?
- O plano Z permite tentar novamente no futuro?
- "Always have a Plan Z. It's your safety net, not your goal."

### 7. Tomar a Decisao
| Opcao | Score | Condicao |
|-------|-------|---------|
| PERSEVERE (ajustar Plan A) | | Sinais de perseverar > sinais de pivotar |
| PIVOT (mover para Plan B) | | Sinais claros de que direçao atual nao funciona |
| LIFEBOAT (ativar Plan Z) | | Recursos acabando, nenhum plan B viavel |

Regra Hoffman: "The best time to pivot is when you still have the resources to execute the pivot well."

### 8. Criar Plano de Execucao
Se PERSEVERE:
- Que ajustes especificos fazer no plano A?
- Que metricas monitorar para re-avaliar em 30/60/90 dias?

Se PIVOT:
- Timeline de transicao para Plan B
- O que preservar do Plan A
- Comunicacao para equipe e stakeholders
- Metricas de validacao do Plan B

## Output
```yaml
pivot_decision:
  current_state: ""
  pivot_signals_score: "/35"
  persevere_signals_score: "/35"
  plan_a_assessment: ""
  plan_b_options:
    - type: ""
      description: ""
      evidence: ""
  plan_z: ""
  decision: "PERSEVERE/PIVOT/LIFEBOAT"
  rationale: ""
  execution_plan: []
  re_evaluation_date: ""
```

## Validacao
- [ ] Estado atual diagnosticado com dados
- [ ] Sinais de pivot catalogados e pontuados
- [ ] Sinais de perseverar catalogados e pontuados
- [ ] Planos B identificados com tipo e evidencia
- [ ] Plano Z definido com runway
- [ ] Decisao tomada com racional claro
- [ ] Plano de execucao com timeline e metricas
