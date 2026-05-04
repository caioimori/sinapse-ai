---
task: monopoly-strategy-design
responsavel: "@peter-thiel"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: business_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: monopoly_strategy
    tipo: document
    destino: Console

Checklist:
  - "[ ] Mercado inicial pequeno e dominavel identificado"
  - "[ ] Moat strategy desenhada com 4+ camadas"
  - "[ ] Path de expansao concentrica definido"
  - "[ ] Durabilidade a 10-20 anos avaliada"
---

# Task: Monopoly Strategy Design

## Metadata
- **Squad:** squad-council
- **Agent:** Peter Thiel
- **Complexity:** High

## Objetivo
Projetar o caminho para monopolio de categoria — nao monopolio ilegal, mas dominio tao completo de um nicho que competicao se torna irrelevante. "Competition is for losers. If you want to create and capture lasting value, build a monopoly." — Thiel

## Pre-Condicoes
- Negocio ou produto com proposta de valor definida
- Entendimento do mercado atual e competidores
- Disposicao para pensar em timeframes de 10-20 anos

## Passos

### 1. Definir o Mercado Minimo Dominavel
Erro classico: definir mercado grande demais e ser irrelevante nele.
- Qual e o menor mercado onde podemos ser dominantes?
- Quantos clientes iniciais precisamos para 80%+ market share?
- "Start small and monopolize. The perfect target market is a small group of particular people concentrated together and served by few or no competitors."

| Mercado | Tamanho | Players | Nossa Share Potencial | Fit |
|---------|---------|---------|---------------------|-----|
| Macro (evitar) | | | | |
| Nicho 1 | | | | |
| Nicho 2 | | | | |
| Micro-nicho (ideal) | | | | |

### 2. Projetar as 4 Camadas de Moat
| Camada | Descricao | Como Construir | Timeline | Defensabilidade |
|--------|-----------|---------------|---------|----------------|
| Proprietary Technology | 10x melhor que alternativas | | | |
| Network Effects | Cada usuario torna produto melhor | | | |
| Economies of Scale | Custo diminui com volume | | | |
| Branding | Associacao mental insubstituivel | | | |

Cada camada reforça as outras. Projetar como se retroalimentam.

### 3. Desenhar Path de Expansao Concentrica
```
[Micro-nicho] → [Nicho adjacente] → [Categoria] → [Mercado amplo]

Exemplo Amazon:
Books → DVDs → All products → Cloud → Everything
```
| Fase | Mercado | Moat Dominante | Prerequisito | Timeline |
|------|---------|---------------|-------------|---------|
| 1 | Micro-nicho | Tech 10x | Product-market fit | |
| 2 | Nicho adjacente | + Network effects | Dominio fase 1 | |
| 3 | Categoria | + Scale economies | Dominio fase 2 | |
| 4 | Mercado amplo | + Brand | Dominio fase 3 | |

### 4. Analisar Durabilidade (10-20 Anos)
| Ameaca | Probabilidade | Defesa | Resiliencia |
|--------|-------------|-------|------------|
| Novo entrante com tech superior | | | |
| Regulacao adversa | | | |
| Mudanca de comportamento | | | |
| Substituto de categoria | | | |
| Commoditizacao | | | |

"Will this business be around a decade from now?"

### 5. Definir Competition-Avoidance Strategy
- Como evitar competicao direta durante o crescimento?
- Onde competidores pensam que nao vale a pena competir?
- "Don't disrupt. Avoid competition as much as possible."
- Como parecer pequeno e inofensivo ate ser grande demais para parar?

### 6. Calcular Power Law Returns
Thiel's insight: distribuicao de retornos segue power law.
- Este negocio pode ser o "outlier" do portfolio/carreira?
- Potencial de retorno e 100x ou 2x? (se 2x, nao vale o esforço)
- O upside compensa completamente o risco?

### 7. Projetar Flywheel de Monopolio
Identificar o ciclo virtuoso que se auto-reforça:
```
[Acao A] → gera → [Resultado B] → que causa → [Efeito C] → que amplifica → [Acao A]
```
Exemplo: Mais usuarios → mais dados → melhor produto → mais usuarios

### 8. Definir Metricas de Monopolio
| Metrica | Target Fase 1 | Target Fase 2 | Target Monopolio |
|---------|-------------|-------------|-----------------|
| Market share no nicho | >50% | >70% | >80% |
| Pricing power | Premium 2x | Premium 3x | Price maker |
| Customer acquisition cost trend | Decrescente | Decrescente | Organico >70% |
| Competitor response | Ignoram | Copiam | Desistem |

## Output
```yaml
monopoly_strategy:
  business: ""
  minimum_viable_market: ""
  moat_layers:
    - layer: ""
      timeline: ""
      investment: ""
  expansion_path:
    - phase: ""
      market: ""
      moat_dominant: ""
  durability_assessment: ""
  competition_avoidance: ""
  flywheel: ""
  target_metrics: []
```

## Validacao
- [ ] Mercado minimo dominavel definido (nao grande demais)
- [ ] 4 camadas de moat projetadas com timeline
- [ ] Path de expansao concentrica com prerequisitos
- [ ] Durabilidade 10-20 anos avaliada
- [ ] Estrategia de evitar competicao definida
- [ ] Flywheel de monopolio desenhado
- [ ] Metricas de monopolio com targets por fase
