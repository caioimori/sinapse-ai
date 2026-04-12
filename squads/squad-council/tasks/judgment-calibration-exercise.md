---
task: judgment-calibration-exercise
responsavel: "@naval-ravikant"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: decision_domain
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: calibration_report
    tipo: document
    destino: Console

Checklist:
  - "[ ] Historico de decisoes revisado"
  - "[ ] Vieses pessoais identificados"
  - "[ ] Calibracao atual medida"
  - "[ ] Praticas de melhoria definidas"
---

# Task: Judgment Calibration Exercise

## Metadata
- **Squad:** squad-council
- **Agent:** Naval Ravikant
- **Complexity:** Standard

## Objetivo
Calibrar o julgamento do decisor — a habilidade mais valiosa segundo Naval. "Judgment is the most important skill. It's the leveraged skill." Medir precisao atual, identificar vieses sistematicos e projetar praticas para melhoria continua.

## Pre-Condicoes
- Historico de decisoes para analise (idealmente de decision journal)
- Dominio de decisao definido
- Honestidade radical sobre erros passados

## Passos

### 1. Definir o que e Bom Julgamento (Naval's Framework)
Componentes do julgamento segundo Naval:
- **Clear thinking:** Pensar com clareza, sem emocao excessiva
- **Long-term orientation:** Preferir resultados de longo prazo
- **Accountability:** Disposicao para arcar com consequencias
- **Reading the world:** Entender como o mundo realmente funciona
- "Wisdom is knowing the long-term consequences of your actions"

### 2. Revisar Historico de Decisoes
Ultimas 10-20 decisoes significativas:
| Decisao | Data | Resultado | Acertei? | Sorte ou Skill? | O que aprendi? |
|---------|------|----------|---------|-----------------|----------------|
| | | | | | |

### 3. Medir Calibracao Atual
Para cada decisao onde atribuiu probabilidade:
```
Calibracao = Correlacao entre confianca atribuida e taxa real de acerto

Exemplo:
- Decisoes com "90% confianca": acertou X% → deve ser ~90%
- Decisoes com "70% confianca": acertou Y% → deve ser ~70%
- Decisoes com "50% confianca": acertou Z% → deve ser ~50%
```
- Overconfident: confianca > taxa de acerto
- Underconfident: confianca < taxa de acerto
- Well-calibrated: confianca ≈ taxa de acerto

### 4. Identificar Vieses Sistematicos
| Vies | Descricao | Evidencia no Historico | Frequencia |
|------|-----------|----------------------|------------|
| Optimism bias | Superestimar probabilidade de sucesso | | |
| Sunk cost | Continuar investindo em decisoes ruins | | |
| Recency bias | Peso excessivo em eventos recentes | | |
| Confirmation bias | Buscar informacao que confirma crencas | | |
| Status quo bias | Preferir nao mudar vs mudar | | |
| Narrative fallacy | Criar historias que explicam demais | | |

### 5. Aplicar Principios Naval de Clear Thinking
- "If you can't decide, the answer is no"
- "If you have two choices, choose the harder one in the short term"
- "Desire is a contract you make to be unhappy until you get what you want"
- "The moment of suffering is a moment of truth"

Para cada principio, avaliar: estou aplicando isso nas minhas decisoes?

### 6. Projetar Debiasing Practices
| Vies Identificado | Pratica de Correcao | Frequencia |
|-------------------|-------------------|------------|
| Overconfidence | Atribuir probabilidades antes de decidir | Toda decisao |
| Sunk cost | Pre-definir kill criteria | Inicio de projetos |
| Confirmation bias | Buscar ativamente evidencia contraria | Antes de decidir |
| Recency bias | Consultar base rates historicas | Decisoes de investimento |

### 7. Estabelecer Metricas de Evolucao
- Brier Score por trimestre (melhorando?)
- Hit rate por categoria de decisao
- Tempo medio para decisao (speed of judgment)
- Ratio de decisoes reversas (mudou de ideia com boa razao?)

### 8. Criar Rotina de Calibracao
- Diario: meditacao + journaling (Naval recomenda)
- Semanal: revisar decisoes da semana
- Mensal: medir calibracao e vieses
- Trimestral: revisao profunda do decision journal
- "A calm mind, a fit body, and a house full of love" — preconditions for judgment

## Output
```yaml
calibration_report:
  domain: ""
  decisions_reviewed: 0
  current_calibration:
    overconfident_pct: ""
    underconfident_pct: ""
    well_calibrated_pct: ""
  systematic_biases:
    - bias: ""
      frequency: ""
      debiasing_practice: ""
  judgment_score: "/10"
  improvement_plan:
    daily: ""
    weekly: ""
    monthly: ""
    quarterly: ""
  naval_principles_applied: []
```

## Validacao
- [ ] Minimo 10 decisoes historicas revisadas
- [ ] Calibracao atual medida quantitativamente
- [ ] Vieses sistematicos identificados com evidencia
- [ ] Debiasing practices definidas por vies
- [ ] Metricas de evolucao estabelecidas
- [ ] Rotina de calibracao projetada
