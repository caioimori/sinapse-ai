---
task: conduct-rapid-scan
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

# Task: Conduct Rapid Scan

## Metadata
- **Squad:** squad-research
- **Agent:** deep-researcher (Sage)
- **Complexity:** SIMPLE
- **Depends on:** research brief ou pergunta direta
- **Feeds:** Prism (para decisao de aprofundamento)

## Objetivo
Scan rapido (15-30 min) sobre topico para orientacao inicial, triagem de oportunidade ou decisao de investir em pesquisa mais profunda.

## Entrada
- Pergunta ou topico a investigar
- Contexto minimo (por que precisa saber)

## Passos

### 1. Definir Escopo (2 min)
- 1 pergunta central, max 2 sub-perguntas
- Timer: 30 min maximo total

### 2. Consulta Rapida (15-20 min)
- 2-3 fontes Tier 3-4 (industria + mercado)
- Google/web para contexto rapido
- Se disponivel: dados internos relevantes
- NAO buscar papers academicos ou dados primarios (isso e ANALYZE+)

### 3. Sintese (5-8 min)
- Top 3-5 findings com fonte
- 1 insight principal (F+I+R)
- Recomendacao: aprofundar (ANALYZE/DEEP DIVE) ou suficiente?
- Confidence level: LOW (scan) — sinalizar ao stakeholder

## Saida
- Resumo executivo de 1 pagina (max)
- 3-5 key findings com fonte
- Recomendacao de proximo passo
- Confidence level declarado

## Validacao
- [ ] Executado em ≤30 min
- [ ] 2-3 fontes consultadas
- [ ] Key findings documentados
- [ ] Recomendacao de profundidade incluida

---

*Task operada por: deep-researcher (Sage)*
