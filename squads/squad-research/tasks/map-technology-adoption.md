---
task: map-technology-adoption
responsavel: "@trend-forecaster"
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

# Task: Map Technology Adoption

## Metadata
- **Squad:** squad-research
- **Agent:** trend-forecaster (Horizon)
- **Complexity:** STANDARD
- **Depends on:** dados de tendencias tecnologicas
- **Feeds:** digital-experience, product-systems, @architect

## Objetivo
Mapear adocao tecnologica usando Rogers (Diffusion), Moore (Chasm) e Gartner (Hype Cycle) — avaliar posicao atual e projetar evolucao.

## Entrada
- Tecnologias relevantes para o mercado/industria
- Dados de adocao (market penetration, growth rates)
- Sinais de mercado (investimento, startups, enterprise adoption)

## Passos

### 1. Rogers — Diffusion of Innovation
Classificar cada tecnologia na curva de adocao:
- **Innovators (2.5%):** Experimentadores, tech-first
- **Early Adopters (13.5%):** Visionarios, buscam vantagem competitiva
- **Early Majority (34%):** Pragmaticos, querem solucao comprovada
- **Late Majority (34%):** Conservadores, adotam por pressao
- **Laggards (16%):** Resistentes, adotam por necessidade

### 2. Moore — Crossing the Chasm Analysis
Para tecnologias entre Early Adopters e Early Majority:
- **O Chasm existe?** Evidencia de gap entre visionarios e pragmaticos
- **Bowling alley:** Nicho inicial para cruzar (qual segmento adotou primeiro?)
- **Tornado:** Sinais de adocao acelerada (mainstream adoption starting?)
- **Main street:** Commoditizacao (preco cai, features padronizam)
- **Chasm crossing strategy:** O que e necessario para cruzar?

### 3. Gartner Hype Cycle Positioning
Classificar cada tecnologia:
- **Innovation Trigger:** Tecnologia nova, poucos produtos
- **Peak of Inflated Expectations:** Hype maximo, expectativas irrealistas
- **Trough of Disillusionment:** Realidade, falhas vissiveis
- **Slope of Enlightenment:** Uso pratico emerge, cases reais
- **Plateau of Productivity:** Mainstream, ROI comprovado

### 4. Impact Assessment
Para cada tecnologia mapeada:
- **Relevancia para nosso mercado:** 1-5
- **Timeline de impacto:** Imediato / 1-2 anos / 3-5 anos / 5+ anos
- **Tipo de impacto:** Enabler / Disruptor / Commodity
- **Risco de nao adotar:** Alto / Medio / Baixo
- **Investimento necessario:** Alto / Medio / Baixo

### 5. Technology Adoption Roadmap
- **Adotar agora:** Tecnologias no Slope/Plateau com alta relevancia
- **Pilotar:** Tecnologias no Trough com potencial de Slope
- **Monitorar:** Tecnologias no Peak/Trigger com alta incerteza
- **Ignorar:** Tecnologias com baixa relevancia ou em declinio
- Timeline visual com milestones de adocao

## Cross-Squad Handoffs
```yaml
handoffs:
  - to: digital-experience
    delivers: tecnologias para adotar em UX/UI
    format: lista com readiness e timeline
  - to: product-systems
    delivers: tecnologias para roadmap de produto
    format: adoption roadmap com prioridades
```

## Cross-Squad Handoff
```yaml
handoff:
  to_agent: "@architect"
  command: "*task technology-assessment"
  context: "Mapa de adocao tecnologica com Rogers/Moore/Gartner"
```

## Saida
- Mapa de adocao (Rogers) por tecnologia
- Chasm analysis para tecnologias criticas
- Hype Cycle positioning
- Technology adoption roadmap

## Validacao
- [ ] Tecnologias classificadas em Rogers curve
- [ ] Chasm analysis para tecnologias em transicao
- [ ] Gartner Hype Cycle positioning
- [ ] Impact assessment com scores
- [ ] Roadmap com 4 categorias (adotar/pilotar/monitorar/ignorar)

---

*Task operada por: trend-forecaster (Horizon)*
