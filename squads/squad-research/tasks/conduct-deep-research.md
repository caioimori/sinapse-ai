---
task: conduct-deep-research
responsavel: "@deep-researcher"
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

# Task: Conduct Deep Research

## Metadata
- **Squad:** squad-research
- **Agent:** deep-researcher (Sage)
- **Complexity:** COMPLEX
- **Depends on:** research brief (via Prism)
- **Feeds:** data-synthesizer (Loom), squad solicitante

## Objetivo
Conduzir pesquisa profunda multi-fonte sobre qualquer topico, entregando insights cristalizados com FINDING + IMPLICATION + RECOMMENDATION.

## Entrada
- Research brief preenchido (pergunta, nivel, fontes, deadline)
- Contexto do uso pretendido (para que serve o insight)

## Passos

### 1. Decomposicao da Pergunta
- Quebrar pergunta central em 3-7 sub-perguntas investigaveis
- Cada sub-pergunta deve ser respondivel independentemente
- Mapear dependencias entre sub-perguntas
- Definir prioridade: quais sub-perguntas sao must-have vs nice-to-have

### 2. Mapeamento de Fontes
- Para cada sub-pergunta, mapear fontes por tier:
  - **Tier 1 (Primaria):** dados proprios, surveys, entrevistas
  - **Tier 2 (Academica):** papers, meta-analises, pesquisas publicadas
  - **Tier 3 (Industria):** McKinsey, Gartner, Forrester, analistas
  - **Tier 4 (Mercado):** trade publications, midia especializada
  - **Tier 5 (Social):** social listening, forums, reviews
- Para DEEP DIVE: minimo 10 fontes, maioria Tier 1-3
- Para DEFINITIVE: minimo 20 fontes, todos os tiers

### 3. Coleta Sistematica
- Comecar por Tier 1-2 (alta credibilidade)
- Expandir para Tier 3-4 para contexto
- Tier 5 para sentimento e perspectivas alternativas
- Para cada dado coletado: registrar fonte, tier, data, relevancia
- Flag dados surpreendentes ou contra-intuitivos para verificacao extra

### 4. Triangulacao
- Para cada claim principal: verificar em 2+ fontes independentes
- Se fontes concordam: HIGH confidence
- Se fontes divergem: investigar causa (metodologia? periodo? definicoes?)
- Se fonte unica: marcar como "unverified — single source"

### 5. Pattern Recognition
- O que se repete entre fontes? (convergencia)
- O que contradiz? (tensao — investigar)
- O que ninguem menciona mas deveria? (gap — sinalizar)
- O que surpreende? (insight potencial)

### 6. Insight Crystallization
- Para cada insight principal, aplicar formula:
  - **FINDING:** O que foi descoberto (dado + evidencia)
  - **IMPLICATION:** O que isso significa (so what?)
  - **RECOMMENDATION:** O que fazer com isso (now what?)
- Ranquear insights por impacto × confidence
- Top 3-5 insights como highlights

### 7. Declaracao de Limitacoes
- O que NAO foi possivel investigar e por que
- Vieses potenciais nas fontes utilizadas
- Areas que precisam de pesquisa adicional
- Confidence level geral (HIGH/MEDIUM/LOW)

### 8. Formatacao por Nivel
- **SCAN:** Resumo 1 pagina, top 3 findings, recomendacao
- **ANALYZE:** Report 3-5 paginas, insights F+I+R, fontes
- **DEEP DIVE:** Dossie 10-20 paginas, analise completa
- **DEFINITIVE:** Pesquisa 30+ paginas, publicavel

## Saida
- Pesquisa completa no formato do nivel solicitado
- Insights cristalizados (F+I+R)
- Fontes classificadas por tier
- Limitacoes declaradas

## Validacao
- [ ] Pergunta central respondida
- [ ] Fontes classificadas no Source Credibility Matrix
- [ ] Triangulacao aplicada (claims principais com 2+ fontes)
- [ ] Insights com FINDING + IMPLICATION + RECOMMENDATION
- [ ] Limitacoes declaradas
- [ ] Formato adequado ao nivel do Pyramid

---

*Task operada por: deep-researcher (Sage)*
