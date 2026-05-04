---
task: orchestrate-financial-analysis
responsavel: "@finance-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: analysis_request
    tipo: string
    origem: "usuario ou squad externa"
    obrigatorio: true
  - campo: financial_data
    tipo: object
    origem: "planilhas, ERP, dashboards"
    obrigatorio: false

Saida:
  - campo: coordinated_analysis
    tipo: document
    destino: "stakeholders, squad-commercial"

Checklist:
  - "[ ] Identificar tipo de analise necessaria"
  - "[ ] Definir agentes envolvidos"
  - "[ ] Coletar dados necessarios"
  - "[ ] Distribuir tasks para agentes"
  - "[ ] Consolidar outputs"
  - "[ ] Gerar report executivo"
---

# Task: Orchestrate Financial Analysis

## Metadata
- **Agent:** finance-orqx (Ledger)
- **Squad:** squad-finance
- **Complexity:** CRITICAL

## Objetivo
Coordenar analise financeira multi-agente, distribuindo tasks para os especialistas corretos e consolidando outputs em visao executiva unificada.

## Inputs
- Descricao da analise necessaria
- Dados financeiros disponiveis (opcional — sera solicitado se necessario)
- Periodo de analise
- Stakeholders e nivel de detalhe desejado

## Steps

1. **Classificar demanda:** rentabilidade | pricing | budget | receita | holistica
2. **Mapear agentes:** quais agentes precisam ser acionados
3. **Definir sequencia:** dependencias entre analises (ex: revenue antes de margin)
4. **Distribuir tasks:** delegar para agentes com contexto claro
5. **Coletar outputs:** receber analises individuais
6. **Consolidar:** unificar em visao coerente com executive summary
7. **Apresentar:** report com destaques, riscos e recomendacoes

## Output
- Executive summary (3x3: 3 destaques, 3 riscos, 3 acoes)
- Analises detalhadas por area
- Dashboard visual com metricas-chave
- Recomendacoes priorizadas

## Quality Gates
- [ ] Todas as analises necessarias foram incluidas
- [ ] Dados estao consistentes entre analises
- [ ] Executive summary e compreensivel para nao-financeiro
- [ ] Recomendacoes sao acionaveis com prazo e responsavel

## Quando Usar
- Demanda envolve multiplos aspectos financeiros
- Review periodico (mensal, trimestral)
- Decisao estrategica que precisa de fundamentacao financeira
