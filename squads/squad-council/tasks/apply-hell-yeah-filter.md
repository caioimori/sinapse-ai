---
task: apply-hell-yeah-filter
responsavel: "@derek-sivers"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: opportunities
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: filtered_decisions
    tipo: document
    destino: Console

Checklist:
  - "[ ] Oportunidades listadas"
  - "[ ] Hell Yeah or No aplicado a cada uma"
  - "[ ] Inversao aplicada (fazer o oposto)"
  - "[ ] Enough definido"
---

# Task: Apply Hell Yeah or No Filter

## Metadata
- **Squad:** squad-council
- **Agent:** Derek Sivers
- **Complexity:** Simple

## Objetivo
Aplicar o filtro "Hell Yeah or No" a uma lista de oportunidades, decisoes ou compromissos. Simplificar eliminando tudo que nao e um "sim entusiastico."

## Passos

### 1. List Everything
- Liste todas as oportunidades, projetos, compromissos em consideracao
- Inclua os que voce ja disse sim (revisar tambem)

### 2. Hell Yeah or No Test
Para cada item:
| Oportunidade | Hell Yeah? | Se nao, por que disse sim? | Acao |
|-------------|-----------|---------------------------|------|
| | Sim/Nao | Medo, obrigacao, pressao social? | Keep/Drop |

### 3. The Opposite Test
- Para cada decisao "convencional," o que acontece se fizer o oposto?
- Todos dizem para crescer — e se ficar pequeno?
- Todos dizem para diversificar — e se focar em uma coisa?
- Todos dizem para planejar — e se simplesmente comecar?

### 4. Enough Check
- Quanto e suficiente? (dinheiro, clientes, features, tamanho)
- Voce ja passou do "enough" e nao percebeu?
- O que acontece se parar de buscar mais?

### 5. Donkey Prevention
- Tentando fazer muitas coisas ao mesmo tempo?
- Que coisas podem ser sequenciadas ao inves de paralelizadas?
- Qual e a UNICA coisa mais importante agora?

## Output
- Lista filtrada: Hell Yeah items (manter)
- Lista de eliminacao: items para eliminar ou delegar
- Uma unica prioridade: o que fazer AGORA
