---
task: assess-contrarian-thesis
responsavel: "@peter-thiel"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: consensus_view
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: contrarian_analysis
    tipo: document
    destino: Console

Checklist:
  - "[ ] Consenso atual mapeado com premissas"
  - "[ ] Premissas desafiadas uma a uma"
  - "[ ] Tese contraria articulada"
  - "[ ] Power law implications avaliadas"
---

# Task: Develop Contrarian Thesis

## Metadata
- **Squad:** squad-council
- **Agent:** Peter Thiel
- **Complexity:** Standard

## Objetivo
Desafiar o consenso sobre um topico e desenvolver uma tese contraria fundamentada. Identificar onde a sabedoria convencional esta errada e que oportunidade isso cria.

## Passos

### 1. Map the Consensus
- O que a maioria das pessoas acredita sobre este topico?
- Quais premissas sustentam essa crenca?
- De onde vem essa crenca? (mimesis, evidencia, ideologia?)

### 2. Challenge Each Premise
Para cada premissa do consenso:
- E realmente verdade? Que evidencia a sustenta?
- Que evidencia a contradiz?
- E uma verdade universal ou especifica de contexto?
- Quem se beneficia de manter essa premissa?

### 3. Develop Contrarian View
- Se o consenso esta errado, o que e verdade?
- Que mundo emerge se a tese contraria estiver certa?
- Que oportunidade isso cria?
- Por que poucos veem isso?

### 4. Definite vs Indefinite
- Somos optimistas definidos (plano especifico) ou indefinidos (esperanca vaga)?
- Qual e o plano concreto para explorar esta tese?
- Que acoes especificas a tese sugere?

### 5. Power Law Check
- Se a tese contraria estiver certa, o resultado e 10x ou 100x?
- Vale o risco assimetrico (perda limitada, ganho ilimitado)?
- Segue a logica do power law (poucos resultados dominam)?
