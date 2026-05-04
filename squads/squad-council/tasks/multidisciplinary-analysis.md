---
task: multidisciplinary-analysis
responsavel: "@charlie-munger"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: challenge
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: cross_discipline_report
    tipo: document
    destino: Console

Checklist:
  - "[ ] Minimo 5 disciplinas consultadas"
  - "[ ] Insights unicos por disciplina documentados"
  - "[ ] Convergencias e divergencias mapeadas"
  - "[ ] Sintese integradora produzida"
---

# Task: Multidisciplinary Cross-Discipline Analysis

## Metadata
- **Squad:** squad-council
- **Agent:** Charlie Munger
- **Complexity:** High

## Objetivo
Analisar um desafio de negocios atraves de multiplas lentes disciplinares simultaneamente — psicologia, economia, biologia, fisica, matematica, historia, filosofia. "You must know the big ideas in the big disciplines, and use them routinely." — Munger

## Pre-Condicoes
- Desafio complexo que resiste a analise unidimensional
- Abertura para perspectivas nao-convencionais
- Tempo para analise profunda (nao superficial)

## Passos

### 1. Definir o Desafio Central
- Articular o desafio em uma frase clara
- Identificar por que abordagens convencionais nao resolveram
- Que suposicoes estao implicitas na forma como o problema e normalmente enquadrado?
- Reformular o problema de 3 maneiras diferentes

### 2. Aplicar Lente Psicologica
| Conceito | Aplicacao ao Desafio |
|----------|---------------------|
| Incentive structures | Que incentivos estao operando? Estao alinhados? |
| Social proof | Estamos seguindo a manada? |
| Commitment/consistency bias | Estamos presos a decisoes anteriores? |
| Loss aversion | Estamos supervalorizando o que podemos perder? |
| Availability heuristic | Estamos julgando pela informacao mais recente/vivida? |
| Authority bias | Estamos deferindo a autoridade vs evidencia? |

### 3. Aplicar Lente Economica
| Conceito | Aplicacao ao Desafio |
|----------|---------------------|
| Opportunity cost | O que estamos deixando de fazer? |
| Comparative advantage | Onde temos vantagem real vs percebida? |
| Supply/demand dynamics | Que forcas de mercado estao em jogo? |
| Tragedy of the commons | Ha recursos compartilhados sendo degradados? |
| Moral hazard | Alguem esta tomando riscos porque outro paga? |
| Externalities | Que custos/beneficios nao estamos contabilizando? |

### 4. Aplicar Lente Biologica
| Conceito | Aplicacao ao Desafio |
|----------|---------------------|
| Evolution/adaptation | O que sobrevive e o que e eliminado? |
| Red Queen effect | Estamos correndo so para ficar no mesmo lugar? |
| Niche specialization | Ha um nicho onde prosperamos? |
| Symbiosis/parasitism | Que relacoes sao mutualmente beneficas vs parasitarias? |
| Immune response | Que defesas naturais existem contra ameacas? |

### 5. Aplicar Lente de Sistemas/Fisica
| Conceito | Aplicacao ao Desafio |
|----------|---------------------|
| Entropy | O sistema tende a desordem? Que energia mantem a ordem? |
| Critical mass | Ha um ponto de inflexao proximo? |
| Feedback loops | Que loops positivos/negativos operam? |
| Inertia | Que forcas resistem a mudanca? |
| Leverage points | Onde pequena intervencao gera grande efeito? |

### 6. Aplicar Lente Matematica/Estatistica
| Conceito | Aplicacao ao Desafio |
|----------|---------------------|
| Power laws | A distribuicao e 80/20? Onde focar? |
| Compound effects | O que cresce exponencialmente se investirmos agora? |
| Expected value | Qual e o valor esperado de cada opcao? |
| Base rates | Qual e a taxa base de sucesso para iniciativas similares? |
| Regression to the mean | Resultados atuais sao sustentaveis ou reverterao a media? |

### 7. Aplicar Lente Historica
- Que situacoes analogas aconteceram historicamente?
- O que funcionou e o que falhou?
- Que padroes se repetem?
- Estamos cometendo o mesmo erro que outros cometeram?

### 8. Sintetizar Insights Cross-Disciplina
| Insight | Disciplina de Origem | Corroborado por | Contradito por |
|---------|---------------------|-----------------|----------------|
| | | | |

- Onde multiplas disciplinas convergem? (alta confianca)
- Onde divergem? (requer investigacao)
- Que insights surpresa emergem do cruzamento?

### 9. Formular Recomendacao Integrada
- Recomendacao principal que honra multiplas perspectivas
- Riscos identificados por cada lente que nao podem ser ignorados
- Sequencia de acoes que respeita as dinamicas de sistema
- Metricas de diferentes disciplinas para monitorar

## Output
```yaml
multidisciplinary_report:
  challenge: ""
  disciplines_applied: []
  key_insights:
    - insight: ""
      origin_discipline: ""
      corroborated_by: []
  convergences: []
  divergences: []
  recommendation: ""
  risks_by_lens: []
  monitoring_metrics: []
```

## Validacao
- [ ] Minimo 5 disciplinas aplicadas com profundidade
- [ ] Cada disciplina gerou pelo menos 1 insight unico
- [ ] Convergencias e divergencias mapeadas explicitamente
- [ ] Analogias historicas identificadas
- [ ] Recomendacao integra multiplas perspectivas
- [ ] Nenhuma disciplina dominante (verdadeiro cross-discipline)
