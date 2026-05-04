---
task: triage-research-request
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

# Task: Triage Research Request

## Metadata
- **Squad:** squad-research
- **Agent:** research-orqx (Prism)
- **Complexity:** SIMPLE
- **Depends on:** —
- **Feeds:** orchestrate-research-pipeline, prioritize-research-requests

## Objetivo
Triar nova demanda de pesquisa rapidamente: a demanda e valida? Qual o nivel? Qual agente? Qual a urgencia?

## Entrada
- Nova demanda de pesquisa (texto livre ou brief parcial)
- Origem (squad, pessoa, contexto)

## Passos

### 1. Validacao Rapida
- A pergunta e clara e investigavel? (Se nao: devolver pedindo refinamento)
- Ja foi pesquisada antes? (Checar research repository)
- E responsabilidade deste squad? (Se nao: redirecionar)

### 2. Classificacao
- **Nivel (Pyramid):** SCAN | ANALYZE | DEEP DIVE | DEFINITIVE
- **Dominio:** General | Audience | Competitive | Market | Trends
- **Urgencia:** CRITICA (<24h) | ALTA (<3d) | NORMAL (<1 sem) | BAIXA (backlog)
- **Origem:** Interna | Cross-Squad | Novo Projeto

### 3. Routing Rapido
- CRITICA + SCAN → executar imediatamente (Sage)
- CRITICA + ANALYZE+ → alocar agente prioritario agora
- ALTA → incluir no sprint corrente
- NORMAL → backlog para proximo sprint
- BAIXA → backlog geral

### 4. Resposta ao Solicitante
- Confirmar: "Recebido. Nivel: X. Agente: Y. Timeline estimada: Z."
- Se deprioritizada: "Registrada no backlog. Estimativa: X."

## Saida
- Demanda classificada e roteada
- Solicitante notificado

## Validacao
- [ ] Pergunta validada como investigavel
- [ ] Nivel, dominio e urgencia classificados
- [ ] Agente atribuido ou backlog registrado
- [ ] Solicitante notificado com timeline

---

*Task operada por: research-orqx (Prism)*
