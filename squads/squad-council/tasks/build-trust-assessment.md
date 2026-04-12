---
task: build-trust-assessment
responsavel: "@brene-brown"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: team_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: trust_assessment
    tipo: document
    destino: Console

Checklist:
  - "[ ] BRAVING inventory aplicado"
  - "[ ] Armoring behaviors identificados"
  - "[ ] Trust gaps mapeados"
  - "[ ] Acoes de construcao de confianca definidas"
---

# Task: Build Trust Assessment (BRAVING)

## Metadata
- **Squad:** squad-council
- **Agent:** Brene Brown
- **Complexity:** Standard

## Objetivo
Avaliar niveis de confianca em uma equipe ou relacionamento usando o BRAVING inventory e identificar acoes concretas para construir confianca.

## Passos

### 1. BRAVING Inventory
| Elemento | Score (1-5) | Evidencia | Gap |
|----------|-------------|-----------|-----|
| **B**oundaries — Limites respeitados? | | | |
| **R**eliability — Fazem o que prometem? | | | |
| **A**ccountability — Assumem erros? | | | |
| **V**ault — Guardam confidencias? | | | |
| **I**ntegrity — Escolhem coragem > conforto? | | | |
| **N**on-judgment — Pedem ajuda sem julgamento? | | | |
| **G**enerosity — Assumem interpretacao generosa? | | | |

### 2. Armoring Behaviors Check
- Perfeccionismo presente? (escudo contra shame)
- Numbing presente? (busyness, overwork)
- Cinismo presente? (sarcasmo como armadura)
- Foreboding joy? (recusa em curtir momentos bons)

### 3. Vulnerability Assessment
- O lider esta modelando vulnerabilidade?
- E seguro admitir erros nesta equipe?
- As pessoas pedem ajuda abertamente?
- Feedback honesto e dado com regularidade?

### 4. Trust Building Actions
Para cada gap no BRAVING:
- Acao especifica para melhorar
- Quem e responsavel
- Timeline
- Como medir progresso

### 5. Rumble Readiness
- A equipe esta pronta para conversas dificeis?
- Habilidades de rumble: naming emotions, "the story I'm telling myself"
- Precisam de facilitacao externa ou podem autogerir?
