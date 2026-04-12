---
task: trust-building-framework
responsavel: "@simon-sinek"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: team_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: trust_framework
    tipo: document
    destino: Console

Checklist:
  - "[ ] Trust vs performance matrix aplicada"
  - "[ ] Circle of Safety diagnosticada"
  - "[ ] Praticas de confianca projetadas"
  - "[ ] Metricas de confianca definidas"
---

# Task: Trust Building Framework

## Metadata
- **Squad:** squad-council
- **Agent:** Simon Sinek
- **Complexity:** Standard

## Objetivo
Construir confianca sistematicamente em uma equipe usando os frameworks de Sinek — Circle of Safety, Trust vs Performance matrix, e "Leaders Eat Last". Confianca nao e abstrata — e construida por comportamentos repetidos que podem ser projetados.

## Pre-Condicoes
- Equipe com desafios de confianca (ou desejo de fortalece-la)
- Lideranca comprometida com mudanca de comportamento
- Disposicao para medir e acompanhar evolucao

## Passos

### 1. Aplicar Trust vs Performance Matrix
Mapear cada membro (anonimamente se necessario):
```
        High Performance
             |
   Toxic     |    High Trust +
   Star      |    High Performance
             |    (ideal)
  -----------+----------
   Low Trust +|   High Trust +
   Low Perf   |   Low Performance
   (address)  |   (develop)
             |
        Low Performance
```
- Navy SEALs preferem High Trust + Medium Performance sobre Low Trust + High Performance
- "I'd rather have a medium performer with high trust than a high performer with low trust"

### 2. Diagnosticar Circle of Safety
| Dimensao | Score (1-5) | Evidencia |
|----------|-----------|-----------|
| Lideranca protege a equipe de ameacas externas | | |
| Pessoas se sentem seguras para errar | | |
| Informacao flui sem filtros politicos | | |
| Conflito e resolvido internamente, sem retaliacao | | |
| Pessoas pedem ajuda sem medo de parecer fracas | | |
| Lideranca assume responsabilidade pelos erros | | |
| Credito e compartilhado, culpa e absorvida | | |

Circle of Safety Score = soma / 35

### 3. Identificar Trust Breakers
Comportamentos que destroem confianca sistematicamente:
| Trust Breaker | Frequencia | Impacto | Quem pratica? |
|-------------|-----------|---------|--------------|
| Falar mal de colegas ausentes | | | |
| Tomar credito pelo trabalho de outros | | | |
| Prometer e nao cumprir | | | |
| Evitar conversas dificeis | | | |
| Microgerenciar | | | |
| Informacao assimetrica (saber e nao compartilhar) | | | |
| Mudar regras sem comunicar | | | |

### 4. Projetar Trust Builders
Comportamentos que constroem confianca:
| Trust Builder | Implementacao | Frequencia | Responsavel |
|-------------|--------------|-----------|------------|
| Leaders Eat Last (lideranca se sacrifica primeiro) | | | |
| Vulnerabilidade primeiro (lider compartilha fraquezas) | | | |
| Reconhecimento publico, correcao privada | | | |
| Check-ins genuinos (como voce REALMENTE esta?) | | | |
| Compartilhar contexto e racional de decisoes | | | |
| Cumprir compromissos pequenos consistentemente | | | |
| Defender membros da equipe quando ausentes | | | |

### 5. Implementar Rituais de Confianca
| Ritual | Descricao | Cadencia | Objetivo |
|--------|-----------|----------|---------|
| Round-robin check-in | Cada pessoa compartilha como esta | Inicio de reuniao | Humanizar |
| Fail Forward | Compartilhar aprendizado de falha | Semanal | Normalizar erro |
| Gratitude circle | Reconhecer contribuicoes | Semanal | Reforço positivo |
| Honest retrospective | O que nao esta funcionando? | Quinzenal | Transparencia |
| Leadership listening | Lider ouve sem responder | Mensal | Empoderamento |

### 6. Definir Metricas de Confianca
| Metrica | Baseline | Target 3M | Target 6M | Como medir |
|---------|---------|----------|----------|-----------|
| Team trust score | | | | Survey anonimo |
| Psychological safety | | | | Edmondson scale |
| Help-seeking behavior | | | | Observacao |
| Voluntary vulnerability | | | | Self-report |
| Conflict resolution speed | | | | Tracking |
| Retention | | | | HR data |

### 7. Criar Accountability System
- Quem monitora a evolucao da confianca?
- Como lidar com trust breakers identificados?
- Como reforçar trust builders consistentemente?
- Cadencia de revisao do framework

### 8. Projetar Escala de Confianca
Como expandir confianca alem da equipe imediata:
- Equipe → departamento → organizacao
- Cada nivel requer praticas diferentes
- Lideranca como modelo em cada nivel
- "Trust is maintained not by technology but by human relationships"

## Output
```yaml
trust_framework:
  team: ""
  current_trust_score: "/35"
  trust_performance_matrix: ""
  circle_of_safety_score: "/35"
  trust_breakers: []
  trust_builders: []
  rituals: []
  metrics:
    - metric: ""
      baseline: ""
      target: ""
  accountability: ""
```

## Validacao
- [ ] Trust vs Performance matrix aplicada
- [ ] Circle of Safety diagnosticada em 7 dimensoes
- [ ] Trust breakers identificados com frequencia e impacto
- [ ] Trust builders projetados com implementacao
- [ ] Rituais de confianca definidos com cadencia
- [ ] Metricas de confianca com baseline e targets
