---
task: analyze-macro-forces
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

# Task: Analyze Macro Forces

## Metadata
- **Squad:** squad-research
- **Agent:** trend-forecaster (Horizon)
- **Complexity:** STANDARD
- **Depends on:** mercado definido
- **Feeds:** evaluate-market-entry (Scope), run-scenario-planning

## Objetivo
Executar analise PESTEL completa — mapeando forcas macro que impactam o mercado com score de impacto e velocidade por forca.

## Entrada
- Mercado/industria a analisar
- Geografias relevantes
- Horizonte temporal (1-5 anos)

## Passos

### 1. Mapear Forcas PESTEL
**P — Political:**
- Estabilidade politica, politicas governamentais
- Trade policies, tarifas, relacoes internacionais
- Politicas de inovacao, incentivos fiscais
- Tensoes geopoliticas relevantes

**E — Economic:**
- Crescimento do PIB, inflacao, taxas de juros
- Poder de compra, renda disponivel
- Taxas de cambio, custo de capital
- Ciclo economico (expansao/recessao)

**S — Social:**
- Tendencias demograficas (envelhecimento, urbanizacao)
- Mudancas culturais e de valores
- Comportamento do consumidor, expectativas
- Educacao, consciencia social

**T — Technological:**
- Inovacoes emergentes, automacao, AI
- Infraestrutura digital, conectividade
- Investimento em P&D no setor
- Velocidade de adocao tecnologica

**E — Environmental:**
- Regulacoes ambientais, sustentabilidade
- Mudancas climaticas e impacto no setor
- Demanda por produtos/servicos verdes
- Supply chain sustainability

**L — Legal:**
- Leis de protecao de dados (LGPD, GDPR)
- Regulacoes setoriais especificas
- Propriedade intelectual, patentes
- Leis trabalhistas, compliance

### 2. Scoring por Forca

| Forca | Impacto (1-5) | Velocidade (1-5) | Direcao | Priority Score |
|-------|:-------------:|:-----------------:|:-------:|:--------------:|
| P1 | | | +/- | Impacto × Velocidade |

- **Impacto:** 1=negligivel, 5=transformador
- **Velocidade:** 1=decadas, 5=meses
- **Direcao:** + (favoravel) ou - (desfavoravel)
- **Priority Score:** Impacto × Velocidade (top 10 forcas priorizadas)

### 3. Cross-Force Interactions
- Quais forcas se REFORCAM mutuamente?
  - Ex: Regulacao ambiental (L) + consciencia social (S) → demanda green acelerada
- Quais forcas se ANULAM?
  - Ex: Crise economica (E) vs adocao tecnologica (T)
- Quais forcas criam TENSAO?
  - Ex: Inovacao rapida (T) vs regulacao lenta (L)
- Mapear interacoes como rede (force → force, tipo de interacao)

### 4. Implicacoes por Forca Prioritaria
Para cada forca no Top 10:
- Cenario otimista: como essa forca nos beneficia
- Cenario pessimista: como essa forca nos prejudica
- Acoes proativas: o que fazer para se posicionar
- Indicadores de monitoramento

### 5. PESTEL Summary
- Resumo de 1 pagina com as 5-7 forcas mais criticas
- Visual radar/spider chart com scores
- Implicacoes estrategicas consolidadas
- Input direto para scenario planning

## Saida
- PESTEL completo com scoring
- Top 10 forcas priorizadas
- Cross-force interactions mapeadas
- Implicacoes e acoes por forca
- Summary visual (radar chart)

## Validacao
- [ ] 6 categorias PESTEL cobertas
- [ ] Scoring de impacto e velocidade atribuido
- [ ] Cross-force interactions identificadas
- [ ] Top 10 forcas priorizadas
- [ ] Implicacoes estrategicas documentadas

---

*Task operada por: trend-forecaster (Horizon)*
