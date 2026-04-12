---
task: detect-weak-signals
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

# Task: Detect Weak Signals

## Metadata
- **Squad:** squad-research
- **Agent:** trend-forecaster (Horizon)
- **Complexity:** COMPLEX
- **Depends on:** monitoramento continuo
- **Feeds:** brand-system, product-systems, @architect

## Objetivo
Detectar sinais fracos que podem indicar mudancas maiores no mercado — antes que se tornem obvios para todos.

## Entrada
- Fontes de sinais fracos (patentes, papers, startups, regulacao, social)
- Contexto de industria/mercado
- Tendencias ja mapeadas (para filtrar sinais conhecidos)

## Passos

### 1. Scanning de Fontes de Sinais Fracos
- **Patent filings:** Novas patentes em areas adjacentes
- **Academic papers:** Pesquisas recentes em journals relevantes
- **Startup funding:** Rodadas de investimento em nichos emergentes (Crunchbase, PitchBook)
- **Regulatory proposals:** Projetos de lei, consultas publicas, sandboxes
- **Social media:** Padroes emergentes, hashtags crescentes, comunidades novas
- **Conference talks:** Temas novos em eventos de industria
- **Job postings:** Novas funcoes sendo criadas por empresas lideres
- **M&A activity:** Aquisicoes em areas inesperadas

### 2. Classificar Signal Strength

| Nivel | Nome | Descricao | Acao |
|:-----:|------|-----------|------|
| 1 | NOISE | Evento isolado, sem padrao | Registrar, ignorar |
| 2 | WHISPER | 2-3 ocorrencias, possivel padrao | Monitorar |
| 3 | SIGNAL | Padrao claro, multiplas fontes | Analisar profundamente |
| 4 | TREND | Amplamente reconhecido, acelerando | Planejar resposta |
| 5 | CERTAINTY | Inevitavel, questao de quando | Agir imediatamente |

### 3. Analise de Sinais Promissores (Level 2-3)
Para cada sinal WHISPER ou SIGNAL:
- **O que estamos observando?** (descricao factual)
- **Por que pode ser importante?** (implicacao potencial)
- **Que evidencia precisamos?** (para confirmar/refutar)
- **Quem mais esta prestando atencao?** (competidores, investidores)
- **Qual o timeline provavel?** (quando se torna mainstream)
- **E nosso sinal consistente com outros?** (convergencia)

### 4. Pattern Recognition Cross-Signal
- Agrupar sinais por tema/dominio
- Buscar convergencia: 3+ sinais apontando mesma direcao = alta probabilidade
- Buscar divergencia: sinais contraditorios = incerteza (cenario planning)
- Mapear cadeia causal: sinal A → sinal B → tendencia C
- Identificar tipping points: que evento transformaria sinal em tendencia?

### 5. Early Warning System
- Definir indicadores para cada sinal Level 2-3
- **Leading indicators:** O que aparece ANTES da mudanca
- **Lagging indicators:** O que confirma que a mudanca OCORREU
- Frequencia de monitoramento: semanal (Level 3), mensal (Level 2)
- Threshold de escalonamento: quando elevar o level de atencao

## Cross-Squad Handoffs
```yaml
handoffs:
  - to: brand-system
    delivers: sinais que podem afetar percecao de marca
    format: signal cards com implicacao
  - to: product-systems
    delivers: sinais tecnologicos e de comportamento
    format: signal briefs com timeline estimado
```

## Cross-Squad Handoff
```yaml
handoff:
  to_agent: "@architect"
  command: "*task assess-technology"
  context: "Sinais fracos tecnologicos detectados para avaliacao"
```

## Saida
- Inventario de sinais fracos classificados (Level 1-5)
- Analise de sinais promissores (Level 2-3)
- Padroes cross-signal identificados
- Early warning system configurado

## Validacao
- [ ] Fontes de sinais fracos escaneadas (min 5 tipos)
- [ ] Sinais classificados por strength (1-5)
- [ ] Sinais Level 2-3 analisados em profundidade
- [ ] Padroes cross-signal mapeados
- [ ] Early warning indicators definidos

---

*Task operada por: trend-forecaster (Horizon)*
