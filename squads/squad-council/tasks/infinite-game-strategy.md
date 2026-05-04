---
task: infinite-game-strategy
responsavel: "@simon-sinek"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: business_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: infinite_strategy
    tipo: document
    destino: Console

Checklist:
  - "[ ] Finite vs infinite thinking diagnosticado"
  - "[ ] Just Cause articulada"
  - "[ ] 5 praticas do infinite game avaliadas"
  - "[ ] Metricas transformadas de finitas para infinitas"
---

# Task: Infinite Game Strategy

## Metadata
- **Squad:** squad-council
- **Agent:** Simon Sinek
- **Complexity:** High

## Objetivo
Transformar a mentalidade e metricas de uma organizacao de "jogo finito" (vencer competidores) para "jogo infinito" (permanecer jogando). Aplicar os 5 requisitos de Sinek para jogar o jogo infinito nos negocios.

## Pre-Condicoes
- Lideranca da organizacao engajada
- Metricas atuais de performance disponiveis
- Disposicao para questionar KPIs tradicionais

## Passos

### 1. Diagnosticar Finite vs Infinite Thinking
| Dimensao | Finite Game (evitar) | Infinite Game (adotar) | Status Atual |
|----------|---------------------|----------------------|-------------|
| Objetivo | Vencer competidores | Avancar a causa | |
| Competidores | Inimigos a derrotar | Worthy rivals | |
| Metricas | Market share, ranking | Impact, sustainability | |
| Estrategia | Vantagem competitiva | Relevancia continua | |
| Horizonte | Trimestral | Geracional | |
| Recursos | Extrair maximo | Regenerar e investir | |
| Mudanca | Ameaca | Oportunidade de adaptacao | |

### 2. Articular a Just Cause
A Just Cause e o motivo pelo qual a organizacao existe alem do lucro:
- Deve ser para algo (proativa, nao reativa)
- Deve ser inclusiva (aberta a quem quiser contribuir)
- Deve ser orientada ao servico (beneficiar outros)
- Deve ser resiliente (sobreviver a produtos, tecnologias, lideres)
- Deve ser idealista (inalcancavel mas inspiradora)

Template: "Imaginamos um mundo onde [visao idealista] e existimos para [contribuicao para essa visao]."

### 3. Identificar Worthy Rivals
Mudar de "competidores a destruir" para "rivals que nos fazem melhores":
| Worthy Rival | O que fazem melhor que nos? | O que aprendemos com eles? | Como nos inspira a melhorar? |
|-------------|---------------------------|---------------------------|----------------------------|
| | | | |

"A worthy rival is another player whose strengths reveal our weaknesses."

### 4. Avaliar Existential Flexibility
Capacidade de fazer mudancas radicais para avancar a Just Cause:
- A organizacao ja fez um pivot estrategico grande?
- Estaria disposta a abandonar produto rentavel se nao servir a causa?
- Existem sacred cows que impedem adaptacao?
- "Existential flexibility is the capacity to initiate an extreme disruption to a business model or strategic course to more effectively advance a Just Cause."

### 5. Avaliar Courageous Leadership
| Pratica | Score (1-5) | Evidencia |
|---------|-----------|-----------|
| Lideres priorizam causa sobre metricas de curto prazo | | |
| Lideres fazem o certo mesmo quando custa caro | | |
| Lideres protegem as pessoas, nao as posicoes | | |
| Lideres admitem erros publicamente | | |
| Lideres investem em cultura mesmo sob pressao | | |

### 6. Construir Trusting Teams
Requisitos para times que jogam o jogo infinito:
| Elemento | Status | Acao Necessaria |
|----------|--------|----------------|
| Psychological safety | | |
| Vulnerabilidade da lideranca | | |
| Performance + trust matrix aplicada | | |
| "Leaders Eat Last" praticado | | |
| Feedback como cuidado, nao controle | | |

### 7. Transformar Metricas
| Metrica Finita (substituir) | Metrica Infinita (adotar) | Como medir |
|----------------------------|--------------------------|-----------|
| Revenue growth % | Customer lifetime value | |
| Market share | Customer love (NPS, retention) | |
| Employee headcount | Employee fulfillment | |
| Competitor comparison | Self-improvement rate | |
| Quarterly profit | Sustainability of operations | |
| Stock price | Stakeholder well-being | |

### 8. Criar Infinite Game Playbook
Praticas para manter o jogo infinito:
- Revisar Just Cause em toda decisao estrategica
- Celebrar aprendizados, nao so vitorias
- Investir em worthy rival relationships
- Treinar lideranca em coragem, nao competicao
- Medir impacto de longo prazo, nao so resultados de curto prazo
- "The true measure of a leader is not how many followers they have, but how many leaders they create"

## Output
```yaml
infinite_game_strategy:
  organization: ""
  current_mindset: "finite/mixed/infinite"
  just_cause: ""
  worthy_rivals: []
  existential_flexibility_score: "/5"
  courageous_leadership_score: "/25"
  trusting_teams_status: ""
  metrics_transformation:
    - from: ""
      to: ""
  infinite_playbook: []
```

## Validacao
- [ ] Diagnostico finite vs infinite completo
- [ ] Just Cause articulada e testada nos 5 criterios
- [ ] Worthy rivals identificados com aprendizados
- [ ] 5 praticas do infinite game avaliadas
- [ ] Metricas finitas transformadas em infinitas
- [ ] Playbook de praticas criado
