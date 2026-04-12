---
task: meeting-structure-overhaul
responsavel: "@patrick-lencioni"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: organization_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: meeting_system
    tipo: document
    destino: Console

Checklist:
  - "[ ] Reunioes atuais auditadas"
  - "[ ] 4 tipos de reuniao projetados"
  - "[ ] Conflito produtivo incorporado"
  - "[ ] Cadencia implementavel definida"
---

# Task: Meeting Structure Overhaul

## Metadata
- **Squad:** squad-council
- **Agent:** Patrick Lencioni
- **Complexity:** Standard

## Objetivo
Redesenhar completamente a estrutura de reunioes usando o framework de Lencioni — "Death by Meeting" mostra que reunioes ruins nao sao por serem muitas, mas por serem mal estruturadas. Implementar os 4 tipos de reuniao com conflito produtivo embutido.

## Pre-Condicoes
- Calendario atual de reunioes disponivel
- Feedback da equipe sobre dor com reunioes
- Autoridade para reestruturar cadencia

## Passos

### 1. Auditar Reunioes Atuais
Para cada reuniao existente:
| Reuniao | Frequencia | Duracao | Participantes | Objetivo Real | Efetividade (1-5) |
|---------|-----------|---------|--------------|-------------|-------------------|
| | | | | | |

Sintomas de reunioes disfuncionais:
- [ ] Reunioes sao entediantes
- [ ] Decisoes nao sao tomadas
- [ ] Mesmos topicos voltam toda semana
- [ ] Operacional se mistura com estrategico
- [ ] Pessoas saem sem saber o que foi decidido
- [ ] Conflito produtivo e evitado

### 2. Implementar os 4 Tipos de Reuniao (Lencioni)
| Tipo | Frequencia | Duracao | Proposito | Formato |
|------|-----------|---------|----------|---------|
| **Daily Check-in** | Diaria | 5-10 min | Alinhamento tatico rapido | Standing, sem agenda fixa |
| **Weekly Tactical** | Semanal | 45-90 min | Resolver problemas da semana | Agenda definida no inicio |
| **Monthly Strategic** | Mensal | 2-4 horas | 1-2 topicos estrategicos profundos | Debate + decisao |
| **Quarterly Off-Site** | Trimestral | 1-2 dias | Revisao estrategica, team building | Fora do escritorio |

### 3. Projetar Daily Check-in
- Formato: cada pessoa em 60 segundos diz o que esta fazendo HOJE
- NAO e: status report, resolucao de problemas, update de projetos
- SIM e: alinhamento rapido, detectar conflitos de prioridade
- Regras: standing, sem laptops, sem tangentes
- Se tiver topico para discutir → agendar bilateral

### 4. Projetar Weekly Tactical
Formato Lencioni:
```
00:00-00:05  Lightning Round — cada pessoa: 2-3 prioridades da semana
00:05-00:10  Progress Review — dashboard/scoreboard compartilhado
00:10-00:15  Real-Time Agenda — baseado no lightning round, definir topicos
00:15-01:00  Discuss & Decide — resolver topicos levantados
01:00-01:15  Cascading Communication — o que comunicar para equipes
```
REGRA: NUNCA trazer topicos estrategicos para a weekly tactical.

### 5. Projetar Monthly Strategic
- Maximo 2 topicos por sessao (profundidade > breadth)
- Pre-work obrigatorio (leitura, dados, analise)
- Debate real encorajado — "mining for conflict"
- Decisao obrigatoria no final (mesmo sem unanimidade)
- Acompanhamento na proxima weekly tactical

### 6. Projetar Quarterly Off-Site
| Bloco | Duracao | Topico | Formato |
|-------|---------|--------|---------|
| 1 | 2h | Revisao estrategica | Apresentacao + debate |
| 2 | 2h | Saude organizacional | Team assessment + exercicios |
| 3 | 2h | Planejamento do proximo trimestre | Workshop colaborativo |
| 4 | 2h | Team building | Atividade nao-profissional |

### 7. Incorporar Conflito Produtivo
"If people don't weigh in, they can't buy in" — Lencioni
| Pratica | Implementacao | Reuniao |
|---------|--------------|---------|
| Real-time permission | "Preciso que discordem se nao concordam" | Todas |
| Mining for conflict | Lider busca desacordo ativamente | Monthly |
| Disagree and commit | Debate + decisao final respeitada | Weekly + Monthly |
| Conflict norms | Regras de debate acordadas pela equipe | Estabelecer uma vez |

### 8. Definir Metricas de Efetividade
| Metrica | Antes | Depois (target) | Como medir |
|---------|-------|-----------------|-----------|
| Horas/semana em reuniao | | -30% | Calendario |
| Decisoes por reuniao | | >2 | Tracking |
| Satisfacao com reunioes | | >7/10 | Pulse survey |
| Topicos que retornam | | -80% | Tracking |
| Conflito produtivo | | >3/5 | Observacao |

## Output
```yaml
meeting_system:
  organization: ""
  current_meetings_audited: 0
  new_structure:
    daily_checkin:
      duration: "5-10 min"
      format: ""
    weekly_tactical:
      duration: "45-90 min"
      format: ""
    monthly_strategic:
      duration: "2-4 hours"
      topics_per_session: 2
    quarterly_offsite:
      duration: "1-2 days"
      format: ""
  conflict_practices: []
  metrics:
    - metric: ""
      target: ""
  transition_plan: ""
```

## Validacao
- [ ] Reunioes atuais auditadas com efetividade
- [ ] 4 tipos de reuniao projetados com formato detalhado
- [ ] Daily check-in simples e disciplinado
- [ ] Weekly tactical com real-time agenda
- [ ] Monthly strategic com debate profundo
- [ ] Conflito produtivo incorporado em cada tipo
- [ ] Metricas de efetividade com targets
