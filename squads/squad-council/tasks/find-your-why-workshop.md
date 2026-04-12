---
task: find-your-why-workshop
responsavel: "@simon-sinek"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: participant_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: why_statement
    tipo: document
    destino: Console

Checklist:
  - "[ ] Historias de contribuicao coletadas"
  - "[ ] Temas recorrentes identificados"
  - "[ ] WHY statement formulado"
  - "[ ] HOWs e WHATs alinhados ao WHY"
---

# Task: Find Your Why Workshop

## Metadata
- **Squad:** squad-council
- **Agent:** Simon Sinek
- **Complexity:** Standard

## Objetivo
Facilitar o exercicio "Find Your Why" de Sinek para descobrir o proposito fundamental de uma pessoa ou organizacao. O WHY nao e inventado — e descoberto atraves de historias de contribuicao e impacto. "People don't buy what you do, they buy why you do it." — Sinek

## Pre-Condicoes
- Participante(s) com disposicao para reflexao profunda
- Tempo para narrativas pessoais (nao pode ser apressado)
- Ambiente seguro para vulnerabilidade

## Passos

### 1. Preparar o Golden Circle
Explicar o framework:
```
  WHY → (centro) Por que existimos? Em que acreditamos?
  HOW → (meio) Como fazemos? Nossos principios diferenciadores?
  WHAT → (externo) O que fazemos? Produtos, servicos?
```
A maioria comunica de fora para dentro. Lideres inspiradores comunicam de dentro para fora.

### 2. Coletar Historias de Contribuicao
Pedir 5-8 historias especificas:
- Momentos em que voce se sentiu mais realizado no trabalho
- Situacoes em que fez diferenca significativa na vida de alguem
- Experiencias que definiram quem voce e profissionalmente
- Momentos de orgulho onde pensou "e POR ISSO que eu faco isso"

Para cada historia:
```yaml
story:
  description: "O que aconteceu?"
  contribution: "Qual foi sua contribuicao especifica?"
  impact: "Que impacto teve na outra pessoa/organizacao?"
  feeling: "O que voce sentiu?"
  why_it_matters: "Por que essa historia e significativa para voce?"
```

### 3. Identificar Temas Recorrentes
Analisar as historias em busca de padroes:
| Tema | Aparece em quantas historias? | Verbo associado | Impacto comum |
|------|------------------------------|-----------------|---------------|
| | | | |

Temas tipicos: empoderar outros, resolver o impossivel, simplificar complexidade, conectar pessoas, inspirar acao, proteger os vulneraveis

### 4. Formular o WHY Statement
Formato Sinek: "Existimos para ______ de modo que ______."
- Primeira parte: CONTRIBUICAO (o que fazemos pelos outros)
- Segunda parte: IMPACTO (o resultado da contribuicao)

Regras:
- Deve ser simples (uma frase)
- Deve ser acionavel (gera decisoes)
- Deve ressoar emocionalmente (sentir, nao apenas entender)
- Deve ser sobre OUTROS (nao sobre nos)
- NAO e um slogan — e uma bussola

### 5. Testar o WHY Statement
| Teste | Pergunta | Resultado |
|-------|---------|----------|
| Autenticidade | Isso reflete quem realmente somos? | |
| Inspiracao | Isso inspira acao, nao apenas concordancia? | |
| Especificidade | Isso nos diferencia de qualquer outra organizacao? | |
| Aplicabilidade | Isso ajuda a tomar decisoes dificeis? | |
| Emocao | Isso gera resposta emocional, nao apenas racional? | |

### 6. Definir os HOWs (Principios de Acao)
HOWs sao os principios que dao vida ao WHY:
| HOW | Descricao | Manifestacao no dia-a-dia |
|-----|-----------|--------------------------|
| | | |

Regras para HOWs:
- Cada HOW e um verbo (acao, nao substantivo)
- 3-5 HOWs no maximo
- Devem ser verificaveis (da para saber se estamos fazendo)

### 7. Alinhar WHATs ao WHY
Revisar produtos, servicos e atividades atuais:
| WHAT (atividade) | Alinhado ao WHY? | Manifesta qual HOW? | Manter/Ajustar/Eliminar |
|------------------|-----------------|---------------------|------------------------|
| | | | |

- WHATs desalinhados do WHY drenam energia e confundem marca
- WHATs alinhados amplificam o WHY

### 8. Criar Plano de Comunicacao do WHY
- Como comunicar o WHY para equipe interna?
- Como integrar o WHY no recrutamento?
- Como manifestar o WHY no marketing?
- Como usar o WHY para tomar decisoes?
- "The goal is not to do business with everybody who needs what you have. The goal is to do business with people who believe what you believe."

## Output
```yaml
why_discovery:
  participant: ""
  stories_collected: 0
  themes_identified: []
  why_statement: "Existimos para _____ de modo que _____."
  hows:
    - principle: ""
      daily_manifestation: ""
  whats_aligned: []
  whats_to_eliminate: []
  communication_plan: ""
```

## Validacao
- [ ] Minimo 5 historias de contribuicao coletadas
- [ ] Temas recorrentes identificados (minimo 3)
- [ ] WHY statement formulado no formato correto
- [ ] 5 testes de qualidade aplicados ao WHY
- [ ] HOWs definidos como verbos acionaveis
- [ ] WHATs revisados e alinhados
