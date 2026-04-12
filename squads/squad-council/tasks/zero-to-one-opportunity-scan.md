---
task: zero-to-one-opportunity-scan
responsavel: "@peter-thiel"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: market_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: opportunity_map
    tipo: document
    destino: Console

Checklist:
  - "[ ] Mercado escaneado sistematicamente"
  - "[ ] Oportunidades 0-to-1 diferenciadas de 1-to-n"
  - "[ ] Secrets identificados"
  - "[ ] Top oportunidades rankeadas"
---

# Task: Zero-to-One Opportunity Scan

## Metadata
- **Squad:** squad-council
- **Agent:** Peter Thiel
- **Complexity:** High

## Objetivo
Escanear sistematicamente um mercado para identificar oportunidades genuinamente 0-to-1 — coisas que ninguem esta construindo mas que o mundo precisa. "What important truth do very few people agree with you on? What valuable company is nobody building?" — Thiel

## Pre-Condicoes
- Mercado ou industria definida para scan
- Conhecimento basico do estado atual do mercado
- Mentalidade contrarian (disposicao para ver diferente)

## Passos

### 1. Mapear o Estado Atual do Mercado
| Dimensao | Estado Atual | Tendencia | Consenso do Mercado |
|----------|-------------|-----------|-------------------|
| Tecnologia dominante | | | |
| Modelo de negocio padrao | | | |
| Players estabelecidos | | | |
| Regulacao | | | |
| Comportamento do consumidor | | | |

### 2. Identificar Consensos Nao-Questionados
Listar crenças que "todo mundo sabe" neste mercado:
- "Todo mundo sabe que X e verdade" — mas e mesmo?
- "O futuro sera Y" — baseado em que evidencia?
- "Z nunca vai funcionar" — alguem tentou de verdade?
- "O mercado e grande demais para um novo player" — sera?

Para cada consenso, questionar: isto e um fato ou uma opiniao compartilhada?

### 3. Buscar Secrets (Thiel Framework)
Dois tipos de secrets:
| Tipo | Pergunta | Como encontrar |
|------|----------|---------------|
| Secrets about nature | O que e verdade que ninguem descobriu? | Pesquisa, experimentacao |
| Secrets about people | O que as pessoas nao admitem? | Observacao, empatia |

Metodo de busca:
- Que problemas as pessoas reclamam mas aceitam como inevitaveis?
- Que solucoes existem mas sao terriveis e ninguem melhora?
- Que mercados sao "too small" para incumbents mas crescendo rapido?
- Que tecnologias novas habilitam algo que antes era impossivel?

### 4. Filtrar Oportunidades (0-to-1 Test)
Para cada oportunidade identificada:
| Criterio | Peso | Score (1-5) | Ponderado |
|----------|------|-----------|----------|
| Cria categoria nova (vs melhora existente) | 3x | | |
| 10x melhor que alternativas | 2x | | |
| Defensavel (monopoly potential) | 3x | | |
| Timing correto (por que agora?) | 2x | | |
| Secret identificavel | 2x | | |
| Mercado pequeno mas dominavel | 1x | | |

### 5. Avaliar Last Mover Advantage
Para cada oportunidade 0-to-1:
- Pode ser o ULTIMO grande player neste espaco?
- Qual e a defensabilidade a longo prazo (10-20 anos)?
- "It's much better to be the last mover — the one who makes the last great development"
- Que moat se construira ao longo do tempo?

### 6. Aplicar Monopoly Viability Test
| Caracteristica de Monopolio | Potencial | Timeline |
|----------------------------|----------|---------|
| Proprietary Technology (10x) | | |
| Network Effects | | |
| Economies of Scale | | |
| Branding | | |
| Switching Costs | | |
| Data Advantage | | |

### 7. Rankear Oportunidades
| Rank | Oportunidade | Score 0-to-1 | Secret | Monopoly Potential | Timing |
|------|-------------|-------------|--------|-------------------|--------|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

### 8. Definir Exploration Path
Para o Top 3:
- Que hipotese precisa ser validada primeiro?
- Qual e o experimento mais barato para testar?
- Quem seria o first customer ideal?
- Que team seria necessario para executar?

## Output
```yaml
opportunity_scan:
  market: ""
  date: ""
  consensos_questionados: []
  secrets_found:
    - type: "nature/people"
      description: ""
      evidence: ""
  opportunities:
    - name: ""
      zero_to_one_score: "/60"
      secret: ""
      monopoly_potential: "high/medium/low"
      timing: ""
      exploration_path: ""
  top_recommendation: ""
```

## Validacao
- [ ] Mercado mapeado com consensos identificados
- [ ] Minimo 3 consensos questionados com argumentacao
- [ ] Secrets de natureza e de pessoas buscados
- [ ] Filtro 0-to-1 aplicado com scoring
- [ ] Monopoly viability avaliada para top oportunidades
- [ ] Exploration path concreto para Top 3
