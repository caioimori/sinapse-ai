---
task: network-effects-analysis
responsavel: "@reid-hoffman"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: product_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: network_analysis
    tipo: document
    destino: Console

Checklist:
  - "[ ] Tipo de network effect identificado"
  - "[ ] Forca e defensabilidade avaliadas"
  - "[ ] Estrategia de bootstrap projetada"
  - "[ ] Metricas de rede definidas"
---

# Task: Network Effects Analysis

## Metadata
- **Squad:** squad-council
- **Agent:** Reid Hoffman
- **Complexity:** High

## Objetivo
Analisar e projetar network effects para um produto ou negocio. Identificar que tipo de network effect e possivel, quao forte seria, como fazer bootstrap, e como defender contra competidores. "A network effect occurs when a product becomes more valuable as more people use it." — Hoffman

## Pre-Condicoes
- Produto ou negocio com potencial de interacao entre usuarios
- Entendimento dos stakeholders e participantes
- Dados de uso atual (se produto existente)

## Passos

### 1. Classificar Tipo de Network Effect
| Tipo | Descricao | Exemplos | Aplicavel? |
|------|-----------|----------|-----------|
| Direct | Mesmo tipo de usuario se beneficia | Telefone, WhatsApp | |
| Indirect (2-sided) | Dois grupos se beneficiam mutuamente | Marketplace, plataforma | |
| Data | Mais dados = produto melhor | Waze, Spotify | |
| Protocol/Standard | Adocao cria padrao | TCP/IP, USB | |
| Social | Amigos no produto = mais valor | Facebook, LinkedIn | |
| Expertise | Mais uso = mais conhecimento compartilhado | Stack Overflow, GitHub | |

### 2. Mapear os Lados da Rede
Para cada "lado" do network:
```yaml
network_side:
  name: ""
  participants: ""
  value_they_get: ""
  value_they_provide: ""
  current_size: 0
  growth_rate: ""
  chicken_egg_problem: ""
```

### 3. Avaliar Forca do Network Effect
| Dimensao | Score (1-5) | Evidencia |
|----------|-----------|-----------|
| Valor incremental por novo usuario | | |
| Custo de switching | | |
| Dificuldade de multi-homing | | |
| Velocidade de propagacao | | |
| Defensabilidade contra fork/clone | | |
| Persistencia (o efeito dura?) | | |

Network Effect Strength = media ponderada dos scores

### 4. Identificar Chicken-and-Egg Problem
Toda rede comeca vazia. Como resolver:
| Estrategia | Descricao | Viabilidade | Custo |
|-----------|-----------|------------|-------|
| Single-user utility | Util mesmo sem rede | | |
| Seeding | Pre-popular com conteudo/usuarios | | |
| Marquee users | Atrair usuarios influentes primeiro | | |
| Subsidize one side | Gratis para um lado, cobrar do outro | | |
| Constrain geography | Comecar em 1 cidade/comunidade | | |
| Fake it till you make it | Simular atividade inicial | | |
| Come for the tool, stay for the network | Valor standalone + rede | | |

### 5. Projetar Bootstrap Strategy
Fase-a-fase:
| Fase | Usuarios | Estrategia | Metrica-Chave | Investimento |
|------|---------|-----------|--------------|-------------|
| Pre-launch | 0-100 | | | |
| Critical mass | 100-1K | | | |
| Growth | 1K-10K | | | |
| Dominance | 10K+ | | | |

### 6. Analisar Riscos de Rede
| Risco | Probabilidade | Mitigacao |
|-------|-------------|-----------|
| Negative network effects (spam, toxicidade) | | |
| Winner-take-all competition | | |
| Disintermediation (usuarios pulam a plataforma) | | |
| Regulatory risk | | |
| Multi-homing (usuarios em multiplas redes) | | |
| Network collapse (efeito inverso) | | |

### 7. Definir Metricas de Rede
| Metrica | Descricao | Target |
|---------|-----------|--------|
| Network density | Conexoes/usuario | |
| Liquidity | Match rate ou transacoes/usuario | |
| Engagement loops | Frequencia de interacao | |
| Viral coefficient (k) | Novos usuarios por usuario | >1 |
| Time to value | Tempo ate primeiro valor | |
| DAU/MAU ratio | Stickiness | |

### 8. Projetar Defensibilidade de Longo Prazo
- Como network effects criam moat ao longo do tempo?
- Que dados se acumulam e geram vantagem cumulativa?
- Como switching costs aumentam com uso?
- "Networks have a natural tendency toward winner-take-all" — como garantir que somos nos?

## Output
```yaml
network_analysis:
  product: ""
  network_type: ""
  sides: []
  strength_score: "/5"
  bootstrap_strategy: ""
  critical_mass_target: 0
  chicken_egg_solution: ""
  key_metrics: []
  risks: []
  defensibility_assessment: ""
```

## Validacao
- [ ] Tipo de network effect classificado corretamente
- [ ] Lados da rede mapeados com valor
- [ ] Forca avaliada em 6 dimensoes
- [ ] Chicken-and-egg problem diagnosticado com solucao
- [ ] Bootstrap strategy fase-a-fase definida
- [ ] Metricas de rede estabelecidas com targets
- [ ] Riscos identificados com mitigacao
