---
task: contrarian-truth-exercise
responsavel: "@peter-thiel"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: industry_or_domain
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: contrarian_truths
    tipo: document
    destino: Console

Checklist:
  - "[ ] Ortodoxias da industria catalogadas"
  - "[ ] Contrarian truths articuladas"
  - "[ ] Evidencias para cada truth coletadas"
  - "[ ] Implicacoes estrategicas derivadas"
---

# Task: Contrarian Truth Exercise

## Metadata
- **Squad:** squad-council
- **Agent:** Peter Thiel
- **Complexity:** Standard

## Objetivo
Identificar verdades contrarian em uma industria ou dominio — crencas que sao verdadeiras mas que a maioria das pessoas discorda. Esta e a pergunta mais importante de Thiel: "What important truth do very few people agree with you on?"

## Pre-Condicoes
- Industria ou dominio bem conhecido pelo participante
- Profundidade de experiencia no setor
- Coragem intelectual para desafiar consensos

## Passos

### 1. Catalogar Ortodoxias da Industria
Listar as "verdades aceitas" que ninguem questiona:
| Ortodoxia | Fonte | Desde quando? | Quem se beneficia? |
|-----------|-------|-------------|-------------------|
| | | | |

Exemplos de ortodoxias em tech:
- "Move fast and break things"
- "The customer is always right"
- "You need to raise VC money to scale"
- "First mover advantage is everything"

### 2. Questionar cada Ortodoxia
Para cada uma, aplicar o filtro Thiel:
- Isto e baseado em DADOS ou em CONVENCAO?
- Se todo mundo acredita, ha alpha em acreditar?
- Quem foi o ultimo a questionar isto? O que aconteceu?
- "Most people believe X, but the truth is the opposite of X"

### 3. Formular Contrarian Truths
Template: "Most people in [industry] believe [ortodoxia], but the truth is [contrarian view] because [evidence]."

Para cada contrarian truth:
```yaml
contrarian_truth:
  industry_belief: "A maioria acredita que..."
  contrarian_view: "Mas a verdade e que..."
  evidence: "Porque..."
  who_benefits_from_orthodoxy: ""
  who_would_benefit_from_truth: ""
  strength_of_conviction: "/10"
```

### 4. Stress-Test as Truths
Para cada contrarian truth, aplicar devil's advocate:
- E se a ortodoxia estiver certa e eu errado?
- Que evidencia me faria abandonar esta contrarian view?
- Outras pessoas inteligentes discordam — por que?
- E contrarian de verdade ou apenas minority opinion?
- "The best contrarian bets are the ones most people think are crazy"

### 5. Buscar Evidencia de Suporte
| Contrarian Truth | Evidencia Empirica | Case Study | Expert que Concorda |
|-----------------|-------------------|-----------|-------------------|
| | | | |

- Dados quantitativos que suportam
- Exemplos de quem agiu na contrarian truth e venceu
- Analogias de outras industrias

### 6. Avaliar Implicacoes Estrategicas
Se a contrarian truth for verdadeira:
| Implicacao | Quem ganha | Quem perde | Timeline |
|-----------|-----------|-----------|---------|
| | | | |

- Que negocio poderia ser construido em cima desta truth?
- Que estrategia atual precisaria mudar?
- Que investimentos fazem sentido?
- Que riscos emergem?

### 7. Classificar Nivel de Contrarian
| Nivel | Descricao | Risco | Retorno |
|-------|-----------|-------|---------|
| Mild | Minoria pensa assim, nao controverso | Baixo | Baixo |
| Strong | Poucos pensam assim, controverso | Medio | Medio |
| Extreme | Quase ninguem pensa assim, tabu | Alto | Alto |

### 8. Selecionar Truth para Acao
- Qual contrarian truth tem mais potencial de acao?
- Qual e mais defensavel com evidencia?
- Qual tem melhor risk/reward?
- "Definite optimism: believe in a specific better future and work to create it"

## Output
```yaml
contrarian_truths_report:
  industry: ""
  orthodoxies_catalogued: 0
  contrarian_truths:
    - belief: ""
      truth: ""
      evidence: ""
      conviction: "/10"
      level: "mild/strong/extreme"
      strategic_implication: ""
  top_actionable_truth: ""
  recommended_action: ""
```

## Validacao
- [ ] Minimo 5 ortodoxias catalogadas
- [ ] Minimo 3 contrarian truths formuladas
- [ ] Evidencia coletada para cada truth
- [ ] Devil's advocate aplicado (stress-test)
- [ ] Implicacoes estrategicas derivadas
- [ ] Truth mais acionavel selecionada
