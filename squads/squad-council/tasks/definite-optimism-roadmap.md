---
task: definite-optimism-roadmap
responsavel: "@peter-thiel"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: vision_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: optimism_roadmap
    tipo: document
    destino: Console

Checklist:
  - "[ ] Visao definida de futuro especifico"
  - "[ ] Plano concreto com marcos"
  - "[ ] Recursos e capacidades mapeados"
  - "[ ] Anti-patterns de indefinite thinking eliminados"
---

# Task: Definite Optimism Roadmap

## Metadata
- **Squad:** squad-council
- **Agent:** Peter Thiel
- **Complexity:** Standard

## Objetivo
Criar um roadmap baseado em "definite optimism" de Thiel — a crenca de que o futuro pode ser especificamente melhor E que podemos planejar para construi-lo. Contra o "indefinite optimism" que domina Silicon Valley (acreditar que o futuro sera melhor sem saber como).

## Pre-Condicoes
- Visao ou ambicao de longo prazo definida
- Disposicao para planejar (vs "lean startup" indefinido)
- Coragem para apostar em uma visao especifica

## Passos

### 1. Diagnosticar Mentalidade Atual
Thiel's 4 quadrantes:
| | Otimista | Pessimista |
|---|---------|-----------|
| **Definido** | Planejar futuro melhor (engenheiros, China) | Preparar para pior (Europa) |
| **Indefinido** | "Sera melhor, nao sei como" (SV) | "Sera pior, nao sei como" (estagnacao) |

Onde esta sua organizacao? Se indefinido otimista, esta task corrige isso.

### 2. Articular a Visao Definida
Completar: "Em [timeframe], [entidade] tera construido [resultado especifico] que [impacto no mundo]."
- NAO: "Seremos a melhor empresa de X" (vago)
- SIM: "Em 2028, teremos construido [produto especifico] que [resolve problema Y] para [Z pessoas]"
- A visao deve ser especifica o suficiente para ser falsificavel

### 3. Definir o "Secret" que Fundamenta a Visao
- Que verdade voce enxerga que o mercado nao enxerga?
- Por que VOCE (e nao outro) pode construir este futuro?
- Que convergencia de fatores torna isto possivel agora?
- "Every great business is built around a secret that's hidden from the outside"

### 4. Construir o Plano Concreto (Anti-Lean)
Thiel critica o "lean startup" como indefinite thinking:
| Approach | Indefinite (evitar) | Definite (adotar) |
|----------|-------------------|-------------------|
| Estrategia | "Pivotar ate achar" | "Construir o que planejamos" |
| Produto | MVP minimo | Produto 10x desde o inicio |
| Timeline | "Quando estiver pronto" | Marcos concretos com datas |
| Metricas | Vanity metrics | Metricas de monopolio |

### 5. Mapear Recursos Necessarios
| Recurso | Atual | Necessario | Gap | Plano de Aquisicao |
|---------|-------|-----------|-----|-------------------|
| Tecnologia | | | | |
| Talento | | | | |
| Capital | | | | |
| Distribuicao | | | | |
| Tempo | | | | |

### 6. Construir Marcos de Progresso
| Marco | Entregavel Concreto | Deadline | Criterio de Sucesso | Dependencias |
|-------|-------------------|---------|-------------------|-------------|
| M1 | | | | |
| M2 | | | | |
| M3 | | | | |
| M4 | | | | |
| M5 | | | | |

Cada marco deve ser verificavel — nao "progresso", mas "X construido e funcionando"

### 7. Eliminar Indefinite Thinking Patterns
Anti-patterns a eliminar:
- "Vamos testar e ver" → Substituir por: "Vamos construir X porque acreditamos em Y"
- "O mercado vai decidir" → Substituir por: "Vamos criar o mercado"
- "Pivotar se necessario" → Substituir por: "Ajustar execucao, manter visao"
- "Diversificar apostas" → Substituir por: "Concentrar no que acreditamos"
- "Ser agil e flexivel" → Substituir por: "Ser determinado e focado"

### 8. Definir Conviction Checkpoints
Momentos planejados para reafirmar ou ajustar a visao:
| Checkpoint | Data | Pergunta | Se SIM | Se NAO |
|-----------|------|---------|--------|--------|
| C1 | | A visao ainda e valida? | Acelerar | Investigar |
| C2 | | O secret se confirmou? | Dobrar aposta | Recalibrar |
| C3 | | O plano esta funcionando? | Escalar | Ajustar execucao |

## Output
```yaml
definite_optimism_roadmap:
  vision: ""
  timeframe: ""
  secret: ""
  current_quadrant: "definite-optimist/indefinite-optimist/etc"
  milestones:
    - milestone: ""
      deliverable: ""
      deadline: ""
      success_criteria: ""
  resources_needed: []
  indefinite_patterns_eliminated: []
  conviction_checkpoints: []
```

## Validacao
- [ ] Visao especifica e falsificavel articulada
- [ ] Secret identificado e fundamentado
- [ ] Plano concreto com marcos e deadlines
- [ ] Recursos mapeados com gaps e plano de aquisicao
- [ ] Indefinite thinking patterns eliminados
- [ ] Conviction checkpoints definidos com decisoes pre-planejadas
