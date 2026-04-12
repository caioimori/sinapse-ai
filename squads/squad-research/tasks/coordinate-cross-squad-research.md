---
task: coordinate-cross-squad-research
responsavel: "@research-orqx"
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

# Task: Coordinate Cross-Squad Research

## Metadata
- **Squad:** squad-research
- **Agent:** research-orqx (Prism)
- **Complexity:** COMPLEX
- **Depends on:** orchestrate-research-pipeline
- **Feeds:** Squads solicitantes

## Objetivo
Coordenar pesquisas solicitadas por outros squads, garantindo que briefs sao claros, entregas sao formatadas para o squad destino, e handoffs seguem o protocolo cross-squad.

## Entrada
- Solicitacao de pesquisa de outro squad
- Contexto do squad solicitante (para que precisa do insight)

## Passos

### 1. Receber & Validar Solicitacao
- Identificar squad e agente solicitante
- Validar brief: pergunta clara? contexto suficiente? deadline realista?
- Se brief incompleto: devolver com perguntas especificas
- Registrar no tracker de cross-squad requests

### 2. Traduzir para Research Brief
- Converter solicitacao do squad em research brief padrao
- Adicionar: formato de entrega esperado pelo squad destino
- Definir nivel de profundidade adequado
- Confirmar scope com solicitante

### 3. Atribuir & Executar
- Seguir orchestrate-research-pipeline normal
- Checkpoint adicional: resultado esta no formato util para o squad?

### 4. Formatar Entrega
- Adaptar output para linguagem/formato do squad destino:
  - **brand-system**: foco em posicionamento, territorio, diferenciacao
  - **content-intelligence**: foco em sinais, angulos, dados de audiencia
  - **copywriting-persuasion**: foco em pain points, psychographics, JTBD
  - **digital-experience**: foco em UX benchmarks, usability data
  - **growth-analytics**: foco em market data, benchmarks numericos
  - **commercial-systems**: foco em battle cards, pricing, objecoes

### 5. Handoff Formal
- Entregar via cross-squad handoff protocol
- Incluir: resumo executivo + dados completos + limitacoes
- Confirmar recebimento
- Registrar para historico e reuso

## Saida
- Pesquisa entregue ao squad solicitante no formato adequado
- Handoff documentado
- Registro para reuso futuro

## Validacao
- [ ] Brief validado com squad solicitante
- [ ] Pesquisa executada no nivel correto
- [ ] Output formatado para squad destino
- [ ] Handoff formal realizado
- [ ] Squad destino confirmou utilidade

## Handoffs
```yaml
handoff:
  cross_squad:
    - to: "{squad-solicitante}/orchestrator"
      artifact: "research-output formatado"
      protocol: "cross-squad delivery"
      includes:
        - executive_summary
        - full_data
        - limitations
        - methodology
```

---

*Task operada por: research-orqx (Prism)*
