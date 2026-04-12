---
task: believability-weighted-decisions
responsavel: "@ray-dalio"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: decision_topic
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: weighted_decision
    tipo: document
    destino: Console

Checklist:
  - "[ ] Participantes e believability mapeados"
  - "[ ] Criterios de believability definidos"
  - "[ ] Votacao ponderada executada"
  - "[ ] Decisao final documentada com racional"
---

# Task: Believability-Weighted Decision Making

## Metadata
- **Squad:** squad-council
- **Agent:** Ray Dalio
- **Complexity:** High

## Objetivo
Implementar o sistema de decisao believability-weighted de Dalio — onde opinioes sao ponderadas pela competencia demonstrada de cada participante no dominio da decisao, nao por hierarquia ou volume de voz.

## Pre-Condicoes
- Decisao importante que envolve multiplas perspectivas
- Grupo de participantes identificado
- Compromisso com meritocracia de ideias

## Passos

### 1. Definir a Decisao
- Articular a questao de forma clara e objetiva
- Separar fatos de opinioes
- Identificar o dominio de expertise relevante
- Definir criterios de sucesso para a decisao

### 2. Mapear Participantes e Believability
Para cada participante, avaliar believability no dominio:
| Participante | Track Record | Expertise | Reasoning Ability | Open-Mindedness | Believability Score |
|-------------|-------------|-----------|-------------------|-----------------|-------------------|
| | /5 | /5 | /5 | /5 | /20 |

Criterios de scoring:
- **Track Record (1-5):** Historico comprovado de acertos neste dominio
- **Expertise (1-5):** Profundidade de conhecimento tecnico/pratico
- **Reasoning Ability (1-5):** Capacidade de explicar logica por tras da opiniao
- **Open-Mindedness (1-5):** Disposicao para mudar de ideia com nova evidencia

### 3. Coletar Opinioes Independentes
- Cada participante registra opiniao ANTES de ouvir os outros
- Formato: posicao + racional + probabilidade de estar certo
- Crucial: evitar anchoring e groupthink
- Registrar nivel de confianca individual

### 4. Revelar e Debater
- Revelar todas as opinioes simultaneamente
- Identificar areas de concordancia e divergencia
- Focar debate nas divergencias — por que pessoas believable discordam?
- Aplicar regra Dalio: "If you can't explain why someone disagrees, you don't understand enough"

### 5. Calcular Voto Ponderado
```
Para cada opcao:
  Score = SUM(believability_score_i * vote_i) / SUM(believability_score_i)

Onde:
  believability_score_i = score do participante i (0-20)
  vote_i = posicao do participante i (escala 1-10 de apoio)
```

### 6. Avaliar Divergencias Significativas
- Se participantes highly-believable discordam → investigar mais
- Se participantes low-believable concordam unanimemente → sinal de alerta (groupthink?)
- Se resultado ponderado difere drasticamente do voto simples → entender por que
- Documentar as razoes da divergencia

### 7. Tomar Decisao Final
| Cenario | Acao |
|---------|------|
| Convergencia clara (>70% weighted) | Decidir com confianca |
| Divergencia moderada (50-70%) | Aprofundar debate, buscar nova evidencia |
| Divergencia severa (<50%) | Escalar, buscar expertise externa, ou pilotar |

### 8. Documentar e Aprender
- Registrar decisao final com racional completo
- Incluir vozes dissidentes e seus argumentos
- Definir revisao pos-resultado para calibrar believability
- Atualizar believability scores baseado em resultados historicos

## Output
```yaml
weighted_decision:
  topic: ""
  date: ""
  participants:
    - name: ""
      believability_score: "/20"
      position: ""
      rationale: ""
  weighted_result:
    option_a: "{score}"
    option_b: "{score}"
  final_decision: ""
  confidence: "high/medium/low"
  dissenting_views: []
  review_date: ""
  calibration_notes: ""
```

## Validacao
- [ ] Believability scores atribuidos com criterios claros
- [ ] Opinioes coletadas independentemente antes do debate
- [ ] Calculo ponderado executado corretamente
- [ ] Divergencias investigadas e documentadas
- [ ] Decisao final com racional completo
- [ ] Revisao pos-resultado agendada
