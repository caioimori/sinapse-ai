---
task: team-health-assessment
responsavel: "@patrick-lencioni"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: team_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: health_assessment
    tipo: document
    destino: Console

Checklist:
  - "[ ] 5 disfuncoes avaliadas"
  - "[ ] Disfuncao mais critica identificada"
  - "[ ] Plano de remediacao por camada"
  - "[ ] Metricas de saude definidas"
---

# Task: Team Health Assessment (5 Dysfunctions)

## Metadata
- **Squad:** squad-council
- **Agent:** Patrick Lencioni
- **Complexity:** Standard

## Objetivo
Avaliar a saude de uma equipe usando o modelo das 5 Disfuncoes de Lencioni. Identificar a disfuncao raiz (sempre comecar pela base da piramide) e projetar intervencoes camada por camada. "Not finance. Not strategy. Not technology. It is teamwork that remains the ultimate competitive advantage." — Lencioni

## Pre-Condicoes
- Equipe formada com pelo menos 3 meses de interacao
- Acesso a membros da equipe para avaliacao
- Compromisso da lideranca com o diagnostico

## Passos

### 1. Avaliar a Piramide (Base para Topo)
```
        5. Inattention to RESULTS
       ─────────────────────────
      4. Avoidance of ACCOUNTABILITY
     ─────────────────────────────
    3. Lack of COMMITMENT
   ───────────────────────
  2. Fear of CONFLICT
 ──────────────────────
1. Absence of TRUST (BASE)
```

REGRA: Nao se pode resolver camada superior sem resolver a inferior.

### 2. Avaliar Camada 1: Confianca
| Indicador | Score (1-5) | Evidencia |
|-----------|-----------|-----------|
| Membros admitem fraquezas e erros | | |
| Membros pedem ajuda uns aos outros | | |
| Membros dao beneficio da duvida | | |
| Membros conhecem vida pessoal uns dos outros | | |
| Membros oferecem e aceitam desculpas | | |
| Reunioes sao energizantes, nao temidas | | |

Trust Score = soma / 30

### 3. Avaliar Camada 2: Conflito
| Indicador | Score (1-5) | Evidencia |
|-----------|-----------|-----------|
| Reunioes sao interessantes e nao entediantes | | |
| Membros debatem abertamente sobre ideias | | |
| Conflito e produtivo, nao destrutivo | | |
| Problemas reais sao discutidos, nao evitados | | |
| Membros se ouvem genuinamente em disagreements | | |

Conflict Score = soma / 25

### 4. Avaliar Camada 3: Compromisso
| Indicador | Score (1-5) | Evidencia |
|-----------|-----------|-----------|
| Decisoes sao claras e comunicadas | | |
| Membros saem de reunioes alinhados | | |
| Membros apoiam decisoes mesmo quando discordam | | |
| Prazos sao levados a serio | | |
| Direção e clara (sem ambiguidade) | | |

Commitment Score = soma / 25

### 5. Avaliar Camada 4: Accountability
| Indicador | Score (1-5) | Evidencia |
|-----------|-----------|-----------|
| Membros cobram performance uns dos outros | | |
| Low performers sentem pressao para melhorar | | |
| Membros confrontam comportamentos problematicos | | |
| Standards sao altos e mantidos | | |
| Feedback entre pares e frequente e direto | | |

Accountability Score = soma / 25

### 6. Avaliar Camada 5: Resultados
| Indicador | Score (1-5) | Evidencia |
|-----------|-----------|-----------|
| Membros priorizam resultado coletivo sobre individual | | |
| Egos individuais sao subordinados ao time | | |
| Sucessos sao celebrados coletivamente | | |
| Membros fazem sacrificios pessoais pelo time | | |
| Status e politica nao dirigem comportamento | | |

Results Score = soma / 25

### 7. Identificar Disfuncao Raiz
```
Health Score por camada:
  Trust:          /30 → [HEALTHY/AT-RISK/DYSFUNCTIONAL]
  Conflict:       /25 → [HEALTHY/AT-RISK/DYSFUNCTIONAL]
  Commitment:     /25 → [HEALTHY/AT-RISK/DYSFUNCTIONAL]
  Accountability: /25 → [HEALTHY/AT-RISK/DYSFUNCTIONAL]
  Results:        /25 → [HEALTHY/AT-RISK/DYSFUNCTIONAL]

Thresholds:
  HEALTHY: > 80%
  AT-RISK: 50-80%
  DYSFUNCTIONAL: < 50%
```

A disfuncao mais baixa na piramide que nao e HEALTHY = ponto de partida.

### 8. Projetar Intervencoes por Camada
| Camada | Se DYSFUNCTIONAL | Se AT-RISK |
|--------|-----------------|-----------|
| Trust | Personal histories exercise, MBTI/DISC sharing | Ongoing vulnerability practices |
| Conflict | Mining for conflict, conflict norms | Real-time permission to debate |
| Commitment | Cascading messaging, deadline discipline | Clear meeting outcomes |
| Accountability | Peer accountability partners, team effectiveness exercise | Regular scoreboard review |
| Results | Team scoreboard, public results tracking | Collective reward system |

### 9. Definir Cadencia de Re-Avaliacao
| Cadencia | Formato | Objetivo |
|----------|---------|---------|
| Mensal | Quick pulse (5 perguntas) | Monitorar tendencia |
| Trimestral | Assessment completo | Medir progresso |
| Semestral | Offsite de equipe | Deep dive + realinhamento |

## Output
```yaml
team_health:
  team: ""
  date: ""
  scores:
    trust: "/30"
    conflict: "/25"
    commitment: "/25"
    accountability: "/25"
    results: "/25"
  root_dysfunction: ""
  interventions:
    - layer: ""
      status: ""
      intervention: ""
      timeline: ""
  reassessment_cadence: "monthly/quarterly"
```

## Validacao
- [ ] 5 camadas avaliadas com indicadores especificos
- [ ] Scores calculados com thresholds aplicados
- [ ] Disfuncao raiz identificada (mais baixa na piramide)
- [ ] Intervencoes projetadas da base para o topo
- [ ] Cadencia de re-avaliacao definida
- [ ] Lideranca comprometida com acoes
