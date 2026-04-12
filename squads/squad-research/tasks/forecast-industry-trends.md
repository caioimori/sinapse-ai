---
task: forecast-industry-trends
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

# Task: Forecast Industry Trends

## Metadata
- **Squad:** squad-research
- **Agent:** trend-forecaster (Horizon)
- **Complexity:** COMPLEX
- **Depends on:** analyze-industry-trends (Scope)
- **Feeds:** todos os squads, @project-lead, @architect

## Objetivo
Projetar tendencias da industria em horizontes de 1, 3 e 5 anos — categorizando por duracao e atribuindo confidence scoring por tendencia.

## Entrada
- Analise de tendencias de industria (Scope)
- Dados historicos do setor
- Sinais fracos detectados
- Macro forces (PESTEL)

## Passos

### 1. Classificar Tendencias por Duracao
- **Fads (<1 ano):** Modismos passageiros, alta volatilidade
  - Sinais: hype subito, nenhuma base estrutural, adocao superficial
- **Micro-trends (1-2 anos):** Mudancas taticas, adaptacoes de mercado
  - Sinais: adocao por early adopters, evidencia em 2-3 mercados
- **Macro-trends (3-5 anos):** Transformacoes significativas do setor
  - Sinais: investimento substancial, mudanca regulatoria, adocao mainstream comecando
- **Mega-trends (decada+):** Forcas estruturais que redefinem industrias
  - Sinais: demograficas, tecnologicas profundas, mudancas civilizacionais

### 2. Mapear Tendencias Identificadas
Para cada tendencia:
- **Nome:** Descritivo e memoravel
- **Categoria:** Fad / Micro / Macro / Mega
- **Descricao:** O que esta mudando e por que
- **Drivers:** O que impulsiona esta tendencia (2-4)
- **Inhibitors:** O que pode frear ou reverter (1-3)
- **Current stage:** Emergente / Crescimento / Mainstream / Declinio
- **Velocidade:** Lenta / Moderada / Rapida / Exponencial

### 3. Projecao por Horizonte

| Horizonte | Foco | Confidence Tipico |
|-----------|------|:-----------------:|
| 1 ano | Micro-trends + macro em aceleracao | HIGH (70-90%) |
| 3 anos | Macro-trends + mega impactando | MEDIUM (40-70%) |
| 5 anos | Mega-trends + cenarios | LOW (20-40%) |

Para cada horizonte:
- Quais tendencias serao dominantes?
- Que mudancas estruturais terao ocorrido?
- Quem serao os winners e losers?
- Que novas oportunidades existirao?

### 4. Confidence Scoring por Tendencia

| Fator | Peso | Score 1-5 |
|-------|:----:|:---------:|
| Evidencia empirica | 30% | Quanto dado suporta |
| Consenso de fontes | 20% | Quantas fontes concordam |
| Base estrutural | 25% | Drivers permanentes vs temporarios |
| Historico de previsao | 15% | Acuracia em previsoes similares |
| Contrarian risk | 10% | Probabilidade de reversal |

- **HIGH confidence (>75%):** Apostar, planejar com base nisto
- **MEDIUM confidence (50-75%):** Preparar, monitorar indicadores
- **LOW confidence (<50%):** Estar ciente, criar opcionalidade

### 5. Implicacoes Estrategicas por Tendencia
- **Impacto no produto/servico:** O que muda?
- **Impacto no mercado:** Cresce, encolhe, transforma?
- **Impacto na competicao:** Novos players, consolidacao?
- **Impacto na audiencia:** Novas necessidades, comportamentos?
- **Acao recomendada:** Investir, monitorar, pivotar, ignorar

## Cross-Squad Handoffs
```yaml
handoffs:
  - to: brand-system
    delivers: tendencias que afetam posicionamento
    format: trend cards com implicacao de marca
  - to: content-intelligence
    delivers: topicos emergentes para conteudo
    format: lista de tendencias com volume potencial
  - to: product-systems
    delivers: tendencias tecnologicas para roadmap
    format: trend timeline com impacto em features
  - to: digital-experience
    delivers: tendencias de comportamento digital
    format: mudancas de UX esperadas
```

## Cross-Squad Handoff
```yaml
handoff:
  to_agent: "@architect"
  command: "*task technology-assessment"
  context: "Tendencias tecnologicas projetadas para 1/3/5 anos"
```

## Saida
- Mapa de tendencias classificadas (fad/micro/macro/mega)
- Projecoes por horizonte (1/3/5 anos)
- Confidence scoring por tendencia
- Implicacoes estrategicas

## Validacao
- [ ] Tendencias classificadas por duracao
- [ ] 3 horizontes de projecao documentados
- [ ] Confidence scoring aplicado a cada tendencia
- [ ] Drivers e inhibitors mapeados
- [ ] Implicacoes estrategicas definidas
- [ ] Cross-squad handoffs formatados

---

*Task operada por: trend-forecaster (Horizon)*
