---
task: evaluate-regulatory-landscape
responsavel: "@market-analyst"
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

# Task: Evaluate Regulatory Landscape

## Metadata
- **Squad:** squad-research
- **Agent:** market-analyst (Scope)
- **Complexity:** STANDARD
- **Depends on:** mercado definido
- **Feeds:** evaluate-market-entry, run-porter-five-forces (Hawk)

## Objetivo
Avaliar cenario regulatorio do mercado — leis, regulacoes, compliance — que podem ser barreira ou moat estrategico.

## Entrada
- Mercado/setor a analisar
- Geografias relevantes
- Produto/servico especifico

## Passos

### 1. Mapeamento Regulatorio
- Leis aplicaveis (LGPD, GDPR, regulacao setorial)
- Orgaos reguladores relevantes
- Certificacoes/licencas necessarias
- Restricoes de operacao

### 2. Impacto no Negocio
- Barreiras de entrada criadas pela regulacao
- Custos de compliance
- Restricoes de produto/servico
- Requisitos de dados/privacidade

### 3. Tendencias Regulatorias
- Regulacoes em tramitacao
- Tendencias de enforcement (ficando mais rigido ou flexivel?)
- Precedentes judiciais relevantes
- Movimentos regulatorios em mercados similares (indica futuro)

### 4. Regulacao como Moat
- Compliance rigoroso pode ser DIFERENCIAL (confianca)
- Certificacoes como barreira para novos entrantes
- First-mover advantage em regulacao nova

### 5. Risk Assessment
- **Alto risco:** regulacao pode inviabilizar o modelo
- **Medio risco:** regulacao exige adaptacao significativa
- **Baixo risco:** regulacao e manageable
- **Oportunidade:** regulacao favorece nossa posicao

## Saida
- Mapa regulatorio completo
- Impacto no negocio avaliado
- Tendencias regulatorias
- Risk assessment

## Validacao
- [ ] Regulacoes relevantes mapeadas
- [ ] Impacto no negocio avaliado
- [ ] Tendencias identificadas
- [ ] Risk level classificado

---

*Task operada por: market-analyst (Scope)*
