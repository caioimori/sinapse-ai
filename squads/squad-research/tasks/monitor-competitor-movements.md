---
task: monitor-competitor-movements
responsavel: "@competitive-intelligence"
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

# Task: Monitor Competitor Movements

## Metadata
- **Squad:** squad-research
- **Agent:** competitive-intelligence (Hawk)
- **Complexity:** STANDARD
- **Depends on:** map-competitive-landscape
- **Feeds:** evaluate-competitive-threats, track-competitor-launches

## Objetivo
Monitorar movimentos de competidores continuamente para antecipar ameacas e oportunidades.

## Entrada
- Lista de competidores a monitorar (top 5-10)
- Frequencia de monitoramento (semanal, quinzenal, mensal)

## Passos

### 1. Configurar Fontes de Monitoramento
- Website/blog: mudancas de pricing, features, messaging
- Social media: posts, campanhas, engajamento
- Press/PR: press releases, cobertura de midia
- Job postings: contratacoes revelam direcao estrategica
- Patents/IP: inovacoes em pipeline
- Funding/M&A: investimentos, aquisicoes
- Events: participacao em eventos, palestras

### 2. Ciclo de Monitoramento
- Para cada competidor, check periodico:
  - Mudou pricing? → Sinal de reposicionamento
  - Lancou feature? → Analise de impacto
  - Mudou messaging? → Mudanca de target
  - Contratou para area X? → Expandindo para X
  - Recebeu funding? → Mais agressividade futura
  - Adquiriu empresa? → Expansao de capability
  - Perdeu executivo? → Instabilidade interna

### 3. Classificacao de Movimento
- **CRITICO:** Impacta diretamente nosso mercado/clientes
- **RELEVANTE:** Pode impactar em 3-6 meses
- **OBSERVAR:** Interessante mas impacto indireto
- **RUIDO:** Nao relevante neste momento

### 4. Alert Protocol
- CRITICO → Alerta imediato para Prism + stakeholders
- RELEVANTE → Incluir no proximo briefing competitivo
- OBSERVAR → Registrar no tracker
- RUIDO → Descartar

### 5. Briefing Periodico
- Compilar movimentos do periodo
- Destacar top 3 mais relevantes
- Implicacoes para nos
- Recomendacoes de acao/reacao

## Saida
- Tracker de movimentos atualizado
- Alertas emitidos (se CRITICO)
- Briefing periodico com top movimentos

## Validacao
- [ ] Fontes configuradas para top competidores
- [ ] Movimentos classificados por impacto
- [ ] Alertas criticos emitidos em tempo real
- [ ] Briefing periodico entregue

---

*Task operada por: competitive-intelligence (Hawk)*
