---
task: track-emerging-technologies
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

# Task: Track Emerging Technologies

## Metadata
- **Squad:** squad-research
- **Agent:** trend-forecaster (Horizon)
- **Complexity:** STANDARD
- **Depends on:** technology landscape
- **Feeds:** digital-experience, product-systems, @architect, @dev

## Objetivo
Rastrear tecnologias emergentes relevantes para o mercado — classificar maturidade, avaliar impacto potencial e posicionar em timeline.

## Entrada
- Setor/industria de foco
- Stack tecnologico atual
- Roadmap de produto existente
- Technology adoption map (se disponivel)

## Passos

### 1. Inventario de Tecnologias Emergentes
Fontes para scanning:
- **Research labs:** MIT, Stanford, Google Research, Microsoft Research
- **Venture capital:** YC, a16z, Sequoia portfolio trends
- **Open source:** GitHub trending, new frameworks/libraries
- **Industry reports:** Gartner, Forrester, CB Insights
- **Patent databases:** Google Patents, USPTO trends
- **Conferences:** CES, Web Summit, NeurIPS, industry-specific

### 2. Classificar Maturidade

| Estagio | Descricao | Timeline para Mainstream |
|---------|-----------|:------------------------:|
| Research | Apenas em laboratorio, papers | 5-10+ anos |
| Prototype | PoCs existem, sem produto | 3-5 anos |
| Early Adoption | Startups usando, poucos cases | 1-3 anos |
| Growth | Adocao acelerando, investimento pesado | 6-18 meses |
| Mainstream | Amplamente adotado, commoditizando | Ja esta aqui |

### 3. Avaliar Impacto Potencial

Para cada tecnologia relevante:
- **Aplicabilidade:** Quao relevante para nosso mercado? (1-5)
- **Disruption potential:** Pode mudar as regras do jogo? (1-5)
- **Complementaridade:** Amplifica nossa oferta atual? (1-5)
- **Competitive risk:** Competidores ja estao adotando? (1-5)
- **Implementation complexity:** Quao dificil e adotar? (1-5)

### 4. Impact vs Timeline Matrix

```
  Alto Impact  |  MONITOR    |  INVEST
               |  (futuro)   |  (agora)
  -------------|-------------|-------------
  Baixo Impact |  IGNORE     |  EXPERIMENT
               |  (noise)    |  (low risk)
               |-------------|-------------
               | Longo Timeline | Curto Timeline
```

### 5. Technology Radar (Formato ThoughtWorks)
Organizar em 4 aneis:
- **ADOPT:** Tecnologias prontas para uso em producao
- **TRIAL:** Tecnologias para pilotar em projetos reais
- **ASSESS:** Tecnologias para avaliar com PoC
- **HOLD:** Tecnologias para monitorar sem investimento
- Dividir em quadrantes: Languages, Frameworks, Tools, Platforms

## Cross-Squad Handoffs
```yaml
handoffs:
  - to: digital-experience
    delivers: tecnologias para frontend/UX
    format: radar com recomendacoes
  - to: product-systems
    delivers: tecnologias para features/capabilities
    format: impact assessment com timeline
```

## Cross-Squad Handoff
```yaml
handoff:
  to_agent: "@architect"
  command: "*task assess-architecture"
  context: "Technology radar com tecnologias emergentes avaliadas"
  to_agent_alt: "@developer"
  command_alt: "*task spike"
  context_alt: "Tecnologias no anel TRIAL para PoC"
```

## Saida
- Inventario de tecnologias emergentes
- Classificacao de maturidade
- Impact assessment por tecnologia
- Impact vs Timeline matrix
- Technology Radar (ThoughtWorks format)

## Validacao
- [ ] Scanning de fontes realizado (min 5 fontes)
- [ ] Tecnologias classificadas por maturidade
- [ ] Impact assessment com scores
- [ ] Technology Radar com 4 aneis
- [ ] Recomendacoes de ADOPT/TRIAL/ASSESS/HOLD

---

*Task operada por: trend-forecaster (Horizon)*
