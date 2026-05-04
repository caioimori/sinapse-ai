---
task: mental-model-application
responsavel: "@charlie-munger"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: business_problem
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: model_application
    tipo: document
    destino: Console

Checklist:
  - "[ ] Problema enquadrado corretamente"
  - "[ ] Modelos selecionados de disciplinas distintas"
  - "[ ] Cada modelo aplicado com profundidade"
  - "[ ] Sintese cruzada dos modelos gerada"
---

# Task: Apply Specific Mental Models to Business Problem

## Metadata
- **Squad:** squad-council
- **Agent:** Charlie Munger
- **Complexity:** Standard

## Objetivo
Aplicar modelos mentais especificos e profundos a um problema de negocios concreto. Diferente da analise geral de latticework, esta task foca em selecionar os 3-5 modelos mais relevantes para o problema especifico e aplica-los com rigor analitico.

## Pre-Condicoes
- Problema de negocios claramente definido
- Contexto suficiente para analise significativa
- Abertura para conclusoes contraintuitivas

## Passos

### 1. Enquadrar o Problema com Precisao
- Qual e o problema REAL (nao o sintoma)?
- Quem e afetado e como?
- Qual e o timeframe relevante?
- Que decisao precisa ser tomada?
- "Mostre-me o incentivo e eu mostro o resultado" — quais incentivos operam?

### 2. Selecionar Modelos por Relevancia
Avaliar candidatos do latticework:
| Modelo | Disciplina | Relevancia para o Problema | Selecionado? |
|--------|-----------|---------------------------|-------------|
| Second-Order Thinking | Logica | | |
| Incentive Structures | Psicologia | | |
| Margin of Safety | Engenharia/Financas | | |
| Opportunity Cost | Economia | | |
| Feedback Loops | Sistemas | | |
| Power Laws | Matematica | | |
| Natural Selection | Biologia | | |
| Hanlon's Razor | Filosofia | | |

Selecionar 3-5 modelos de disciplinas DISTINTAS.

### 3. Aplicar Cada Modelo em Profundidade
Para cada modelo selecionado:
```yaml
model_application:
  model_name: ""
  discipline: ""
  core_principle: "Explicacao em uma frase"
  application_to_problem: "Como este modelo ilumina o problema?"
  specific_insight: "O que vemos que nao veriamos sem este modelo?"
  prediction: "O que este modelo prediz que acontecera?"
  action_implied: "O que este modelo sugere que facamos?"
  limitation: "Onde este modelo falha ou nao se aplica?"
```

### 4. Identificar Lollapalooza Effects
- Onde multiplos modelos convergem na mesma direcao?
- Efeito combinado e maior que a soma das partes?
- Quais forcas se reforçam mutuamente?
- Historicamente, que situacoes similares tiveram lollapalooza?

### 5. Verificar Contra-Argumentos
- Que modelos CONTRA-INDICAM a conclusao?
- "Invert, always invert" — o que acontece se estivermos errados?
- Que evidencia nos faria mudar de ideia?
- Estamos selecionando modelos que confirmam o que queremos? (confirmation bias)

### 6. Stress-Test com Exemplos Historicos
- Encontrar 2-3 situacoes historicas analogas
- Como os modelos aplicados teriam previsto o resultado?
- Que modelo teria dado o melhor sinal?
- Que modelo teria enganado?

### 7. Sintetizar Recomendacao
- Conclusao integrando todos os modelos aplicados
- Nivel de confianca baseado em convergencia dos modelos
- Acoes concretas recomendadas
- Riscos residuais que nenhum modelo captura

### 8. Documentar para Aprendizado Futuro
- Quais modelos foram mais uteis para ESTE tipo de problema?
- Adicionar ao catalogo pessoal de "problema → modelos uteis"
- Refinar entendimento dos modelos aplicados
- Identificar modelos que faltam no repertorio

## Output
```yaml
model_application_report:
  problem: ""
  models_applied:
    - model: ""
      discipline: ""
      key_insight: ""
      action_implied: ""
  lollapalooza_effects: []
  counter_arguments: []
  historical_analogies: []
  recommendation: ""
  confidence: "high/medium/low"
  residual_risks: []
```

## Validacao
- [ ] Problema enquadrado com precisao (nao sintoma)
- [ ] 3-5 modelos de disciplinas distintas aplicados
- [ ] Cada modelo aplicado com profundidade (insight + acao + limitacao)
- [ ] Lollapalooza effects identificados
- [ ] Contra-argumentos verificados
- [ ] Recomendacao sintetizada com nivel de confianca
