---
task: hell-yes-or-no-prioritization
responsavel: "@derek-sivers"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: options_to_evaluate
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: prioritization_result
    tipo: document
    destino: Console

Checklist:
  - "[ ] Todas as opcoes listadas e avaliadas"
  - "[ ] Hell Yes vs No claramente separados"
  - "[ ] Opcoes eliminadas com justificativa"
  - "[ ] Foco resultante definido"
---

# Task: Hell Yes or No Prioritization

## Metadata
- **Squad:** squad-council
- **Agent:** Derek Sivers
- **Complexity:** Standard

## Objetivo
Aplicar o framework "Hell Yeah or No" de Sivers para priorizacao radical. Quando voce diz sim para algo mediano, esta dizendo nao para algo incrivel. Eliminar o "pretty good" para abrir espaco para o "amazing". "If you're not saying 'HELL YEAH!' about something, say no."

## Pre-Condicoes
- Lista de opcoes, projetos, oportunidades ou compromissos para avaliar
- Honestidade sobre o que realmente gera entusiasmo
- Coragem para dizer nao a coisas "boas"

## Passos

### 1. Listar TUDO que Compete por Atencao
Sem filtro, listar todas as opcoes:
| # | Opcao/Oportunidade | Status Atual | Tempo/Semana | Energy Drain/Gain |
|---|-------------------|-------------|-------------|-------------------|
| | | doing/considering/paused | | drain/neutral/gain |

### 2. Aplicar o Teste "Hell Yeah?"
Para cada item, perguntar honestamente:
```
Quando penso neste item, minha reacao visceral e:
  [ ] HELL YEAH! (excitacao genuina, energia, entusiasmo)
  [ ] Yeah, sure (ok, por que nao)
  [ ] Hmm, maybe (talvez, preciso pensar)
  [ ] Not really (nao, mas sinto obrigacao)
```

REGRA SIVERS: Tudo que nao e "HELL YEAH!" e "NO".

### 3. Investigar os "Hell Yeahs"
Para cada item marcado como Hell Yeah:
| Item | Por que Hell Yeah? | Alinhado com valores? | Unicamente qualificado? | Oportunidade unica? |
|------|-------------------|---------------------|----------------------|-------------------|
| | | | | |

Filtros adicionais de Sivers:
- "Se essa oportunidade aparecesse daqui a um mes, ainda seria Hell Yeah?"
- "Se eu tivesse que comecar hoje, estaria animado?"
- "Se ninguem soubesse que estou fazendo isso, ainda faria?"

### 4. Investigar os "Nos"
Para cada item que NAO e Hell Yeah:
| Item | Por que nao e Hell Yeah? | O que estou perdendo ao manter? | Custo de oportunidade |
|------|------------------------|-------------------------------|---------------------|
| | | | |

Razoes comuns para manter "nos":
- Obrigacao social ("ja prometi")
- Sunk cost ("ja investi tanto")
- FOMO ("e se perder a oportunidade?")
- Ego ("as pessoas esperam que eu faca")
- Inercia ("ja estou fazendo, por que parar?")

### 5. Executar o "Elimination Round"
Para cada item marcado como No:
| Item | Acao | Timeline | Comunicacao |
|------|------|---------|------------|
| | STOP (parar imediatamente) | | |
| | DELEGATE (passar para alguem) | | |
| | COMPLETE (terminar e nao renovar) | | |
| | DECLINE (recusar formalmente) | | |

### 6. Calcular Foco Resultante
Antes:
- X opcoes competindo por atencao
- Y horas/semana distribuidas

Depois:
- Z opcoes (Hell Yeahs apenas)
- Y horas/semana concentradas

"When you say no to most things, you leave room in your life to really throw yourself completely into that rare thing that makes you say 'HELL YEAH!'"

### 7. Criar "No Default" System
Projetar sistema para manter o filtro ativo:
- Default para qualquer nova oportunidade: NO
- Para virar YES, deve passar no teste Hell Yeah
- Revisao mensal: algum YES virou mediano? → eliminar
- "If it's not a clear yes, it's a clear no"

### 8. Lidar com Consequencias do Nao
| Consequencia | Estrategia |
|-------------|-----------|
| Pessoas ficam decepcionadas | "I'm sorry, I can't right now" — sem explicacao elaborada |
| FOMO intenso | Lembrar: cada SIM a algo mediano = NAO a algo incrivel |
| Culpa | "Saying no is an act of self-respect" |
| Solidao temporaria | Usar o tempo livre para o que realmente importa |

## Output
```yaml
prioritization_result:
  total_evaluated: 0
  hell_yeahs: []
  eliminated:
    - item: ""
      action: "stop/delegate/complete/decline"
      timeline: ""
  focus_before:
    options: 0
    hours_distributed: ""
  focus_after:
    options: 0
    hours_concentrated: ""
  no_default_system: ""
```

## Validacao
- [ ] Todas as opcoes listadas sem filtro
- [ ] Teste Hell Yeah aplicado honestamente a cada uma
- [ ] Hell Yeahs investigados com filtros adicionais
- [ ] Nos com plano de eliminacao (stop/delegate/complete/decline)
- [ ] Foco resultante calculado (antes vs depois)
- [ ] No Default System projetado para futuro
