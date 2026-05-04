---
task: courage-culture-design
responsavel: "@brene-brown"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: organization_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: courage_culture
    tipo: document
    destino: Console

Checklist:
  - "[ ] Estado atual de coragem avaliado"
  - "[ ] BRAVING inventory aplicado"
  - "[ ] Cultura de shame vs cultura de guilt diferenciadas"
  - "[ ] Praticas organizacionais de coragem projetadas"
---

# Task: Design a Culture of Courage

## Metadata
- **Squad:** squad-council
- **Agent:** Brene Brown
- **Complexity:** High

## Objetivo
Projetar uma cultura organizacional de coragem — onde pessoas podem ser vulneraveis, discordar, falhar e crescer sem medo. Usar o framework BRAVING de Brown e os principios de Dare to Lead para transformar cultura de proteção em cultura de ousadia.

## Pre-Condicoes
- Lideranca comprometida com mudanca cultural
- Diagnostico de cultura atual disponivel ou a realizar
- Entendimento de que mudanca cultural leva tempo

## Passos

### 1. Diagnosticar Cultura Atual
| Dimensao | Cultura de Medo (0) | Cultura de Coragem (10) | Score Atual |
|----------|-------------------|------------------------|------------|
| Feedback | Evitado ou punitivo | Frequente e construtivo | |
| Erro | Escondido e punido | Compartilhado e aprendido | |
| Conflito | Passivo-agressivo ou explosivo | Direto e respeitoso | |
| Inovacao | Ideias arriscadas suprimidas | Experimentacao encorajada | |
| Diversidade | Conformidade recompensada | Diferenca celebrada | |
| Lideranca | Command and control | Servant leadership | |

### 2. Aplicar BRAVING Inventory
Framework de confianca organizacional:
| Elemento | Significado | Score (1-5) | Evidencia |
|----------|-----------|-----------|-----------|
| **B**oundaries | Limites respeitados | | |
| **R**eliability | Promessas cumpridas | | |
| **A**ccountability | Erros reconhecidos | | |
| **V**ault | Confidencias mantidas | | |
| **I**ntegrity | Pratica alinhada ao discurso | | |
| **N**on-judgment | Pedir ajuda sem julgamento | | |
| **G**enerosity | Assumir melhor intencao | | |

BRAVING Score = soma / 35

### 3. Diferenciar Shame Culture vs Guilt Culture
| Shame Culture (toxico) | Guilt Culture (saudavel) |
|-----------------------|------------------------|
| "Voce E um fracasso" | "Voce COMETEU um erro" |
| Identidade atacada | Comportamento corrigido |
| Silencio, segredo, julgamento | Abertura, aprendizado, crescimento |
| Gera medo e proteção | Gera responsabilidade e mudanca |
| "Nao erre" | "Erre rapido e aprenda" |

Diagnosticar: a organizacao opera com shame ou guilt?

### 4. Identificar Courage Blockers
| Blocker | Tipo | Impacto | Acao |
|---------|------|---------|------|
| "Aqui nao e lugar para emocoes" | Cultural | | |
| Lideranca nao pratica vulnerabilidade | Comportamental | | |
| Promocao baseada apenas em resultados | Estrutural | | |
| Falta de psychological safety | Ambiental | | |
| Historico de retaliacao | Historico | | |

### 5. Projetar Courage Practices Organizacionais
| Pratica | Nivel | Implementacao | Timeline |
|---------|-------|--------------|---------|
| Vulnerability-first leadership | C-level | Lideres compartilham falhas primeiro | Semana 1 |
| "Clear is Kind" feedback protocol | Todos | Treinamento + pratica supervisionada | Mes 1 |
| Rumble rooms (espacos para conversas dificeis) | Equipes | Sala + facilitacao | Mes 1 |
| Failure celebration | Organizacional | Ritual mensal de "brilhantes fracassos" | Mes 2 |
| Values in action audit | Trimestral | Revisar se valores sao vividos | Mes 3 |
| Courage recognition | Continuo | Reconhecer atos de coragem (nao so resultados) | Mes 1 |

### 6. Treinar Lideranca em Rumbling Skills
Competencias para conversas corajosas:
- Curiosity over certainty ("tell me more")
- Listening to understand, not to respond
- Staying in the discomfort (nao sair prematuramente)
- Naming emotions without judging
- Finding common ground without sacrificing truth

### 7. Definir Metricas de Coragem
| Metrica | Baseline | Target 6M | Target 12M | Instrumento |
|---------|---------|----------|----------|------------|
| BRAVING score | | | | Survey anonimo |
| Help-seeking behavior | | | | Observacao |
| Innovative ideas submitted | | | | Tracking |
| Voluntary vulnerability incidents | | | | Self-report |
| Conflict resolution satisfaction | | | | Survey |
| Retention of diverse talent | | | | HR data |

### 8. Criar Sustentabilidade
- Cultura muda lentamente — esperar 12-18 meses para mudancas visiveis
- Lideranca deve modelar continuamente (nao um evento unico)
- Celebrar progresso incremental
- Reconhecer regressoes como normais, nao como fracassos
- "You can choose courage, or you can choose comfort, but you cannot choose both"

## Output
```yaml
courage_culture:
  organization: ""
  current_culture_score: "/60"
  braving_score: "/35"
  shame_vs_guilt: "shame/guilt/mixed"
  courage_blockers: []
  courage_practices: []
  leadership_training: []
  metrics:
    - metric: ""
      baseline: ""
      target_6m: ""
  sustainability_plan: ""
```

## Validacao
- [ ] Diagnostico de cultura em 6 dimensoes
- [ ] BRAVING inventory completo com scores
- [ ] Shame vs guilt culture diferenciada
- [ ] Courage blockers identificados com acoes
- [ ] Practices organizacionais projetadas com timeline
- [ ] Metricas definidas com baseline e targets
