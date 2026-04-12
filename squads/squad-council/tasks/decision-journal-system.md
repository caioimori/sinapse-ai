---
task: decision-journal-system
responsavel: "@ray-dalio"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: decision_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: journal_system
    tipo: document
    destino: Console

Checklist:
  - "[ ] Template de registro definido"
  - "[ ] Processo de revisao desenhado"
  - "[ ] Metricas de calibracao estabelecidas"
  - "[ ] Sistema de aprendizado continuo projetado"
---

# Task: Implement Decision Journal System

## Metadata
- **Squad:** squad-council
- **Agent:** Ray Dalio
- **Complexity:** Standard

## Objetivo
Implementar um sistema de Decision Journal inspirado em Dalio — registrar decisoes no momento em que sao tomadas, com racional, expectativas e probabilidades, para depois revisar e calibrar o processo decisorio ao longo do tempo.

## Pre-Condicoes
- Decisor ou equipe comprometida com o processo
- Disposicao para registrar decisoes antes de saber o resultado
- Compromisso com revisao periodica

## Passos

### 1. Definir Escopo de Decisoes
Nem toda decisao merece registro. Definir criterios:
| Criterio | Registrar? | Exemplo |
|----------|-----------|---------|
| Impacto financeiro > X | Sim | Investimento, pricing |
| Impacto em pessoas > Y | Sim | Contratacao, demissao |
| Irreversivel ou dificil de reverter | Sim | Arquitetura, parcerias |
| Estrategica (afeta direcao) | Sim | Mercado, produto |
| Operacional rotineira | Nao | Compra de material |

### 2. Criar Template de Registro
Para cada decisao registrada no momento da decisao:
```yaml
decision_entry:
  id: "DEC-{YYYY}-{NNN}"
  date: ""
  decision_maker: ""
  context: "Qual e a situacao? Que informacao tenho?"
  decision: "O que estou decidindo fazer?"
  alternatives_considered:
    - alternative: ""
      pros: []
      cons: []
      reason_rejected: ""
  rationale: "POR QUE esta opcao e a melhor?"
  expected_outcome: "O que espero que aconteca?"
  probability_of_success: "X%"
  confidence_level: "high/medium/low"
  key_assumptions: []
  what_would_change_my_mind: ""
  emotions_at_decision_time: ""
  review_date: ""
```

### 3. Estabelecer Processo de Registro
- Registrar ANTES de conhecer o resultado (crucial)
- Incluir estado emocional honestamente
- Documentar todas as alternativas consideradas
- Atribuir probabilidades explicitas
- Nunca editar registros antigos (append-only)

### 4. Projetar Ciclo de Revisao
| Frequencia | O que revisar | Objetivo |
|-----------|--------------|----------|
| Mensal | Decisoes dos ultimos 30 dias | Resultados iniciais |
| Trimestral | Decisoes do trimestre | Calibracao de confianca |
| Anual | Todas as decisoes do ano | Padroes e evolucao |

### 5. Definir Metricas de Calibracao
- **Brier Score:** Precisao das probabilidades atribuidas
- **Hit Rate:** % de decisoes com resultado esperado
- **Calibration Curve:** Confianca vs acerto real
- **Pattern Detection:** Vieses recorrentes identificados
- **Speed-to-Decision:** Tempo medio para decidir por categoria

### 6. Implementar Revisao Pos-Resultado
```yaml
decision_review:
  decision_id: "DEC-{YYYY}-{NNN}"
  review_date: ""
  actual_outcome: ""
  outcome_vs_expected: "better/as-expected/worse"
  what_i_got_right: ""
  what_i_got_wrong: ""
  was_it_luck_or_skill: ""
  principle_extracted: ""
  would_decide_differently: "yes/no"
  updated_mental_model: ""
```

### 7. Criar Feedback Loop para Principios
- Decisoes com resultado positivo → validam ou geram principios
- Decisoes com resultado negativo → Pain + Reflection = Progress
- Padroes de erro → novos principios preventivos
- Padroes de acerto → reforco de principios existentes

### 8. Definir Governanca do Sistema
- Quem tem acesso ao journal?
- Nivel de transparencia (radical transparency Dalio-style?)
- Protecao contra hindsight bias (registros imutaveis)
- Integracao com tomada de decisao em grupo (believability-weighted)

## Output
```yaml
journal_system:
  scope_criteria: []
  template: "{decision entry template}"
  review_cadence:
    monthly: true
    quarterly: true
    annual: true
  calibration_metrics:
    - metric: "Brier Score"
      target: "< 0.25"
    - metric: "Calibration"
      target: "> 80%"
  governance:
    access: ""
    immutability: true
    transparency_level: ""
  integration_with_principles: true
```

## Validacao
- [ ] Template de registro completo e pratico
- [ ] Escopo de decisoes definido com criterios claros
- [ ] Processo de revisao com cadencias estabelecidas
- [ ] Metricas de calibracao definidas com targets
- [ ] Feedback loop para principios projetado
- [ ] Governanca e acesso definidos
