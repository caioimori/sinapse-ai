---
task: apply-mental-models
responsavel: "@charlie-munger"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: problem
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: models_analysis
    tipo: document
    destino: Console

Checklist:
  - "[ ] Minimo 3 modelos mentais aplicados"
  - "[ ] Inversao completada"
  - "[ ] Vieses cognitivos identificados"
  - "[ ] Circulo de competencia avaliado"
---

# Task: Apply Mental Models Lattice

## Metadata
- **Squad:** squad-council
- **Agent:** Charlie Munger
- **Complexity:** Standard

## Objetivo
Aplicar o latticework de modelos mentais de Charlie Munger a um problema ou decisao. Minimo de 3 modelos de disciplinas diferentes, com inversao obrigatoria.

## Passos

### 1. Inversion (OBRIGATORIO)
- O que garantiria o FRACASSO nesta situacao?
- Listar todos os modos de falha
- Sistematicamente evitar cada modo de falha

### 2. Select and Apply Models (minimo 3)
De disciplinas diferentes:
- **Psicologia:** Incentivos, social proof, commitment bias, lollapalooza
- **Matematica:** Compound interest, expected value, decision trees
- **Biologia:** Evolucao, Red Queen, especializacao de nicho
- **Fisica:** Critical mass, entropia, feedback loops
- **Economia:** Custo de oportunidade, vantagem comparativa, margem de seguranca
- **Engenharia:** Redundancia, breakpoints, sistemas

### 3. Bias Check
- Quais vieses cognitivos podem estar operando?
- Incentive-caused bias: quem se beneficia?
- Social proof: estamos seguindo a manada?
- Sunk cost: estamos presos a decisoes passadas?
- Lollapalooza: multiplos vieses operando juntos?

### 4. Circle of Competence
- Estamos dentro do nosso circulo de competencia?
- Se nao, quem devemos consultar?
- Quais sao os limites do nosso conhecimento neste dominio?

### 5. Synthesis
- O que os modelos revelam coletivamente?
- Onde os modelos concordam? Onde divergem?
- Qual e a decisao mais racional dadas todas as lentes?

## Output
```yaml
mental_models_analysis:
  inversion_results: ["{modos de falha a evitar}"]
  models_applied:
    - model: "{nome}"
      discipline: "{disciplina}"
      insight: "{o que revela}"
  biases_identified: ["{vieses em acao}"]
  circle_of_competence: "inside | edge | outside"
  synthesis: "{conclusao integrada}"
  recommendation: "{decisao recomendada}"
```
