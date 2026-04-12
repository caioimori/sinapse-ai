---
task: assess-market-maturity
responsavel: "@market-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Assess Market Maturity

## Metadata
- **Squad:** squad-research
- **Agent:** market-analyst (Scope)
- **Complexity:** SIMPLE
- **Depends on:** analyze-industry-trends
- **Feeds:** evaluate-market-entry, forecast-market-growth

## Objetivo
Classificar maturidade do mercado para calibrar estrategia — mercado nascente requer educacao, maduro requer diferenciacao.

## Entrada
- Mercado a avaliar
- Dados de industria

## Passos

### 1. Classificar no Ciclo de Vida

| Stage | Caracteristicas | Estrategia Dominante |
|-------|----------------|---------------------|
| **Nascente** | Poucos players, sem padrao, educacao necessaria | Evangelizar, definir categoria |
| **Crescimento** | Entrantes rapidos, mercado expandindo, winner-takes-most | Crescer rapido, capturar share |
| **Maduro** | Crescimento estabiliza, consolidacao, competicao por margem | Diferenciar, eficiencia, loyalty |
| **Declinio** | Encolhimento, substituicao, exit de players | Colher lucro, pivotar, ou sair |

### 2. Evidencias de Classificacao
- Growth rate historico (acelerando = crescimento, estabilizando = maduro)
- Numero de players (crescendo = crescimento, consolidando = maduro)
- Inovacao (rapida = nascente/crescimento, incremental = maduro)
- Barreiras de entrada (baixas = nascente/crescimento, altas = maduro)
- Padronizacao (baixa = nascente, alta = maduro)

### 3. Implicacoes Estrategicas
- Em que stage estamos? O que isso implica?
- Que estrategia funciona neste stage?
- Quanto tempo ate o proximo stage?
- O que muda quando transicionar?

## Saida
- Classificacao de maturidade com justificativa
- Evidencias documentadas
- Implicacoes estrategicas
- Projecao de transicao

## Validacao
- [ ] Stage classificado com evidencias
- [ ] Implicacoes estrategicas derivadas
- [ ] Projecao de transicao estimada

---

*Task operada por: market-analyst (Scope)*
