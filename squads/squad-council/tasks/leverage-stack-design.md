---
task: leverage-stack-design
responsavel: "@naval-ravikant"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: business_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: leverage_stack
    tipo: document
    destino: Console

Checklist:
  - "[ ] 4 tipos de alavancagem avaliados"
  - "[ ] Stack atual mapeado"
  - "[ ] Stack ideal projetado"
  - "[ ] Roadmap de transicao definido"
---

# Task: Leverage Stack Design

## Metadata
- **Squad:** squad-council
- **Agent:** Naval Ravikant
- **Complexity:** High

## Objetivo
Projetar o leverage stack ideal combinando os 4 tipos de alavancagem de Naval (labor, capital, code, media) para maximizar output com minimo de input marginal. "Fortunes require leverage. Business leverage comes from capital, people, and products with no marginal cost of replication." — Naval

## Pre-Condicoes
- Negocio ou projeto com modelo atual definido
- Clareza sobre specific knowledge da equipe
- Disposicao para repensar modelo de entrega

## Passos

### 1. Auditar Stack Atual de Leverage
| Tipo | Definicao Naval | Uso Atual | % do Output | Permissioned? |
|------|----------------|----------|------------|--------------|
| Labor | Pessoas trabalhando para voce | | | Sim (precisa de permissao) |
| Capital | Dinheiro trabalhando para voce | | | Sim (precisa de permissao) |
| Code | Software trabalhando para voce | | | Nao (permissionless) |
| Media | Conteudo trabalhando para voce | | | Nao (permissionless) |

### 2. Avaliar Leverage Permissioned vs Permissionless
Naval's key insight:
- **Permissioned leverage** (labor, capital): precisa de permissao de outros para acessar
- **Permissionless leverage** (code, media): nao precisa de permissao, escala infinita
- "The most interesting forms of leverage are permissionless. They don't require someone else's permission for you to use them."

Onde esta o negocio no espectro?

### 3. Analisar Marginal Cost of Replication
Para cada produto/servico:
| Produto/Servico | Custo Marginal | Escala Atual | Escala Potencial | Bottleneck |
|----------------|---------------|-------------|-----------------|-----------|
| | alto/medio/baixo/zero | | | |

- Custo marginal zero = leverage maximo (software, conteudo digital)
- Custo marginal alto = leverage minimo (servico manual, consultoria hora)

### 4. Projetar Stack Ideal
Principios de design:
1. **Maximizar permissionless leverage** — code e media primeiro
2. **Minimizar dependencia de labor** — automatizar antes de contratar
3. **Capital como acelerador** — nao como fundacao
4. **Specific knowledge como nucleo** — leverage amplifica, nao substitui

```yaml
ideal_stack:
  core: "specific knowledge que nao pode ser copiado"
  primary_leverage: "code/media (permissionless)"
  secondary_leverage: "capital (quando validado)"
  tertiary_leverage: "labor (minimo, altamente alavancado)"
```

### 5. Mapear Transicao por Fase
| Fase | Foco | Leverage Primario | Metricas |
|------|------|------------------|---------|
| 1. Foundation | Validar specific knowledge | Nenhum (work direto) | Product-market fit |
| 2. Code Leverage | Automatizar entrega | Software/tools | Output per person |
| 3. Media Leverage | Amplificar alcance | Content/brand | Audience/reach |
| 4. Capital Leverage | Escalar o que funciona | Investimento | ROI per dollar |
| 5. Labor Leverage | Expandir capacidade | Team (seletivo) | Revenue per employee |

### 6. Identificar Leverage Multipliers
Onde leverage compounds:
- Code + Media = produto digital com distribuicao (SaaS + content marketing)
- Code + Capital = investimento em tecnologia com retorno escalavel
- Media + Labor = equipe criando conteudo com sua marca/voz
- Code + Media + Capital = plataforma com network effects

### 7. Calcular Leverage Ratio
```
Leverage Ratio = Total Output / Direct Hours Worked

Meta por fase:
  Phase 1: 1:1 (sem leverage)
  Phase 2: 1:10 (code multiplica)
  Phase 3: 1:100 (media amplifica)
  Phase 4: 1:1000+ (capital e labor escalam)
```

### 8. Definir Anti-Leverage Traps
Armadilhas a evitar:
- Contratar antes de automatizar (labor trap)
- Levantar capital antes de validar (capital trap)
- Criar conteudo sem specific knowledge (media trap)
- Construir software sem demanda (code trap)
- "Escape competition through authenticity"

## Output
```yaml
leverage_stack:
  current_state:
    labor_pct: ""
    capital_pct: ""
    code_pct: ""
    media_pct: ""
    leverage_ratio: ""
  ideal_state:
    primary: ""
    secondary: ""
    leverage_ratio_target: ""
  transition_roadmap:
    - phase: ""
      focus: ""
      timeline: ""
      key_action: ""
  anti_leverage_traps: []
  leverage_multipliers: []
```

## Validacao
- [ ] 4 tipos de alavancagem auditados no estado atual
- [ ] Permissioned vs permissionless avaliado
- [ ] Custo marginal de replicacao analisado
- [ ] Stack ideal projetado com principios Naval
- [ ] Roadmap de transicao por fases definido
- [ ] Anti-leverage traps identificadas
