---
task: evaluate-market-entry
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

# Task: Evaluate Market Entry

## Metadata
- **Squad:** squad-research
- **Agent:** market-analyst (Scope)
- **Complexity:** COMPLEX
- **Depends on:** size-market-tam-sam-som, map-competitive-landscape (Hawk)
- **Feeds:** commercial-systems, brand-system

## Objetivo
Avaliar viabilidade de entrada em novo mercado com analise completa: sizing, competicao, barreiras, timing, e recomendacao GO/NO-GO.

## Entrada
- Mercado candidato
- Produto/servico a oferecer
- Capabilities e recursos disponiveis

## Passos

### 1. Market Sizing (resumido)
- TAM/SAM/SOM do mercado-alvo (ou handoff de size-market)
- Growth rate e projecao

### 2. Competitive Landscape (handoff Hawk)
- Players existentes e market share
- Barreiras competitivas
- White spaces

### 3. Barreiras de Entrada
- **Capital:** investimento necessario
- **Regulacao:** licencas, compliance, restricoes
- **Tecnologia:** capability gap
- **Marca:** awareness necessario
- **Rede:** network effects do incumbent
- **Talento:** equipe necessaria
- Score barreiras: BAIXA / MEDIA / ALTA

### 4. Timing Assessment
- **Too early:** mercado nao pronto (educacao necessaria, sem demand)
- **Right time:** demand crescente, early majority emergindo
- **Too late:** mercado saturado, incumbents consolidados
- Evidencia para classificacao

### 5. Fit Assessment
- Nossos capabilities vs requisitos do mercado
- Sinergia com mercados existentes
- Brand fit: nossa marca funciona neste mercado?
- Canabilizacao: entra em conflito com mercado existente?

### 6. Financial Assessment (estimativa)
- Investimento estimado para entrada
- Time to break-even estimado
- Revenue projetada em 12/24/36 meses
- ROI estimado

### 7. GO/NO-GO Decision

| Criterio | Score (1-5) | Peso |
|----------|:-----------:|:----:|
| Market size & growth | | 20% |
| Competitive opportunity | | 20% |
| Barreiras de entrada | | 15% |
| Timing | | 15% |
| Strategic fit | | 15% |
| Financial viability | | 15% |
| **Score Final** | | |

- **Score ≥4.0:** GO — investir
- **Score 3.0-3.9:** CONDITIONAL GO — validar com piloto
- **Score <3.0:** NO-GO — nao entrar (ou revisar premissas)

## Saida
- Market entry assessment completo
- Decision: GO / CONDITIONAL GO / NO-GO
- Se GO: roadmap de entrada
- Se NO-GO: justificativa e alternativas

## Validacao
- [ ] 6 criterios avaliados com dados
- [ ] Barreiras de entrada mapeadas
- [ ] Timing classificado com evidencia
- [ ] Decision com score e justificativa

---

*Task operada por: market-analyst (Scope)*
