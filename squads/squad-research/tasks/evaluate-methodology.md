---
task: evaluate-methodology
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

# Task: Evaluate Methodology

## Metadata
- **Squad:** squad-research
- **Agent:** deep-researcher (Sage)
- **Complexity:** STANDARD
- **Depends on:** —
- **Feeds:** validate-research-sources, conduct-literature-review

## Objetivo
Avaliar a metodologia de uma pesquisa ou estudo para determinar confiabilidade dos resultados e adequacao para uso em decisoes.

## Entrada
- Pesquisa/estudo a avaliar
- Contexto: como os resultados serao usados

## Passos

### 1. Identificar Tipo de Pesquisa
- Quantitativa (survey, experimento, analise de dados)
- Qualitativa (entrevistas, etnografia, case study)
- Mista (mixed methods)
- Meta-analise (analise de analises)

### 2. Avaliar Desenho
- Pergunta de pesquisa clara?
- Desenho adequado para a pergunta?
- Variáveis definidas e operacionalizadas?
- Grupo de controle (se experimental)?
- Vieses de selecao controlados?

### 3. Avaliar Amostra
- Tamanho adequado para conclusoes?
- Representativa da populacao-alvo?
- Metodo de amostragem declarado?
- Taxa de resposta (se survey)?
- Vieses de sobrevivencia?

### 4. Avaliar Execucao
- Coleta de dados sistematica?
- Analise estatistica adequada?
- Correlacao confundida com causacao?
- Resultados negativos reportados?
- Limitacoes declaradas pelos autores?

### 5. Score de Confiabilidade

| Dimensao | Score (1-5) |
|----------|:-----------:|
| Clareza da pergunta | |
| Adequacao do desenho | |
| Qualidade da amostra | |
| Rigor da execucao | |
| Transparencia | |
| **Media** | |

- **≥4.0:** Confiavel para decisoes estrategicas
- **3.0-3.9:** Usar com cautela, buscar corroboracao
- **<3.0:** Nao usar como base de decisao

### 6. Recomendacao de Uso
- USAR: metodologia robusta, resultados confiaveis
- USAR COM CAUTELA: limitacoes identificadas mas aceitaveis
- NAO USAR: problemas metodologicos graves
- COMPLEMENTAR: usar junto com outras fontes, nao isoladamente

## Saida
- Avaliacao metodologica com score
- Forcas e fraquezas da metodologia
- Recomendacao de uso

## Validacao
- [ ] Tipo de pesquisa identificado
- [ ] 5 dimensoes avaliadas
- [ ] Score de confiabilidade calculado
- [ ] Recomendacao de uso atribuida

---

*Task operada por: deep-researcher (Sage)*
