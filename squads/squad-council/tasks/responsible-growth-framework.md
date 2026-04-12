---
task: responsible-growth-framework
responsavel: "@yvon-chouinard"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: growth_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: growth_framework
    tipo: document
    destino: Console

Checklist:
  - "[ ] Limites de crescimento responsavel definidos"
  - "[ ] Trade-offs crescimento-valores mapeados"
  - "[ ] Metricas de saude (nao so tamanho) projetadas"
  - "[ ] Estrategia de crescimento responsavel documentada"
---

# Task: Responsible Growth Framework

## Metadata
- **Squad:** squad-council
- **Agent:** Yvon Chouinard
- **Complexity:** Standard

## Objetivo
Projetar um framework de crescimento responsavel — crescer sem comprometer valores, qualidade, cultura ou proposito. Questionar a premissa de que "crescer e sempre bom". "Growth for the sake of growth is the ideology of the cancer cell." — Edward Abbey (citado por Chouinard)

## Pre-Condicoes
- Negocio com pressao para crescer (interna ou externa)
- Valores e proposito definidos (idealmente via purpose-profit-alignment)
- Disposicao para questionar growth-at-all-costs

## Passos

### 1. Questionar a Premissa de Crescimento
| Pergunta | Resposta Honesta |
|----------|-----------------|
| POR QUE queremos crescer? | |
| Crescer resolve que problema real? | |
| Quem se beneficia do crescimento? | |
| O que sacrificamos para crescer? | |
| O negocio pode ser excelente SEM crescer mais? | |
| Estamos crescendo para nos ou para investidores? | |

"I wanted to grow Patagonia not for growth's sake, but to do more good."

### 2. Mapear Custos Ocultos do Crescimento
| Custo Oculto | Status Atual | Risco se Crescer 2x | Risco se Crescer 10x |
|-------------|-------------|---------------------|---------------------|
| Qualidade do produto | | | |
| Cultura da equipe | | | |
| Satisfacao do cliente | | | |
| Proposito/missao | | | |
| Sustentabilidade ambiental | | | |
| Saude mental da lideranca | | | |
| Relacionamento com comunidade | | | |
| Capacidade de inovacao | | | |

### 3. Definir "Right Size" vs "Max Size"
Conceito Chouinard: existe um tamanho "certo" para o negocio.
| Dimensao | Tamanho Atual | Right Size | Max Size | Diferenca |
|----------|-------------|-----------|---------|-----------|
| Equipe | | | | |
| Receita | | | | |
| Clientes | | | | |
| Produtos | | | | |
| Mercados | | | | |

"Right Size" = tamanho onde lucro e suficiente, proposito e avancado, qualidade e mantida e pessoas sao saudaveis.

### 4. Projetar Guardrails de Crescimento
| Guardrail | Limite | Se Ultrapassado |
|-----------|--------|----------------|
| Qualidade minima do produto | NPS > X | Pausar crescimento, corrigir |
| Satisfacao de funcionarios | eNPS > Y | Pausar contratacoes |
| Margem bruta | > Z% | Nao subsidiar crescimento |
| Debt ratio | < W | Nao alavancar para crescer |
| Customer satisfaction | CSAT > V | Nao adicionar clientes |
| Environmental impact | < U tons CO2 | Compensar antes de crescer |

### 5. Aplicar o "1% for the Planet" Mindset
Chouinard iniciou "1% for the Planet" — comprometer recursos para impacto:
| Area | Compromisso | Implementacao |
|------|-----------|--------------|
| Meio ambiente | X% da receita | Doacao, praticas sustentaveis |
| Comunidade | Y% do tempo | Voluntariado, mentoria |
| Qualidade | Z% do investimento | R&D, materiais melhores |
| Pessoas | W% do lucro | Beneficios, desenvolvimento |

"If we could just focus on making the best products and taking care of our people, the profits would follow."

### 6. Projetar Crescimento Qualitativo (nao Quantitativo)
| Crescimento Quantitativo (questionar) | Crescimento Qualitativo (priorizar) |
|--------------------------------------|-------------------------------------|
| Mais receita | Melhor margem |
| Mais clientes | Clientes mais satisfeitos |
| Mais produtos | Produtos melhores |
| Mais funcionarios | Funcionarios mais capacitados |
| Mais mercados | Mais impacto nos mercados atuais |

### 7. Definir Metricas de Saude Organizacional
Metricas que importam MAIS que tamanho:
| Metrica | Target | Prioridade sobre Crescimento? |
|---------|--------|------------------------------|
| Revenue per employee | Crescente | Sim |
| Customer lifetime value | Crescente | Sim |
| Employee tenure | > X anos | Sim |
| Product quality score | > Y | Sim |
| Purpose impact metric | Crescente | Sim |
| Founder/leader wellbeing | Saudavel | Sim |

### 8. Criar Responsible Growth Playbook
| Regra | Descricao |
|-------|-----------|
| Grow only with demand | Nao criar demanda artificial |
| Hire behind the curve | Contratar quando realmente precisar, nao antes |
| Quality over speed | Nunca comprometer qualidade para crescer |
| Organic first | Crescimento organico antes de paid/alavancado |
| Say no to bad growth | Rejeitar receita que compromete valores |
| Regenerate, don't extract | O negocio deve deixar o mundo melhor |

### 9. Projetar Cadencia de Revisao
| Cadencia | Revisao | Decisao |
|----------|---------|---------|
| Mensal | Metricas de saude | Continuar/ajustar |
| Trimestral | Guardrails de crescimento | Crescer/pausar/contrair |
| Anual | Alinhamento proposito-crescimento | Redefinir right size |

## Output
```yaml
growth_framework:
  business: ""
  right_size:
    team: ""
    revenue: ""
    customers: ""
  guardrails:
    - metric: ""
      limit: ""
      if_breached: ""
  health_metrics:
    - metric: ""
      target: ""
      priority: "above growth"
  commitments:
    - area: ""
      percentage: ""
  playbook_rules: []
  review_cadence: []
```

## Validacao
- [ ] Premissa de crescimento questionada honestamente
- [ ] Custos ocultos de crescimento mapeados
- [ ] Right size definido (vs max size)
- [ ] Guardrails com limites e acoes se ultrapassados
- [ ] Crescimento qualitativo priorizado sobre quantitativo
- [ ] Metricas de saude definidas com prioridade sobre crescimento
- [ ] Responsible growth playbook criado
