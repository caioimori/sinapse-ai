---
task: write-whitepaper-persuasive
responsavel: "@long-form-writer"
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

# Task: Write Persuasive Whitepaper

## Metadata
- **Squad:** squad-copy
- **Agent:** long-form-writer (Saga)
- **Complexity:** COMPLEX
- **Depends on:** research data, copy brief, message hierarchy
- **Feeds:** conversion-writer (Spark), squad-content

## Objetivo
Escrever whitepaper que educa E persuade — posicionando a marca como autoridade enquanto guia o leitor ate a conclusao de que a solucao da marca e a melhor. Diferente de whitepaper academico: equilibra credibilidade com conversao.

## Entrada
- Tema e thesis central
- Dados de pesquisa e estatisticas
- Audiencia (decision-makers, tecnicos, etc.)
- Copy brief com objetivo de conversao
- CTA desejado (demo, trial, contato)

## Passos

### 1. Definir Thesis e Angulo
**Framework:**
- **Thesis:** Uma declaracao que o whitepaper vai provar
- **Angulo:** A perspectiva UNICA que diferencia dos outros
- **Tension:** O que a industria acredita vs. o que os dados mostram

**Tipos de whitepaper persuasivo:**
| Tipo | Objetivo | Quando Usar |
|------|----------|-------------|
| Problem-Solution | Definir problema e apresentar solucao | Product Aware |
| Research-Backed | Provar thesis com dados | Solution Aware |
| Industry Report | Posicionar como thought leader | Problem Aware |
| How-to Guide | Educar e demonstrar expertise | Solution Aware |
| Contrarian View | Desafiar sabedoria convencional | Unaware/Problem |

### 2. Estruturar o Whitepaper
**Estrutura persuasiva (2000-5000 palavras):**

```
1. TITULO + SUBTITULO
   - Titulo: Beneficio ou provocacao (nao generico)
   - Subtitulo: Especificidade (numeros, audiencia, resultado)

2. EXECUTIVE SUMMARY (200-300 palavras)
   - O problema em 2-3 frases
   - O que este whitepaper revela
   - Para quem e (auto-qualificacao)
   - O que vai aprender (promise)

3. O PROBLEMA (500-800 palavras)
   - Dimensao do problema (dados macro)
   - Impacto especifico no leitor
   - Por que solucoes tradicionais falham
   - O custo de nao resolver (urgencia)

4. O INSIGHT (300-500 palavras)
   - A descoberta/perspectiva que muda tudo
   - Dados que suportam o insight
   - Por que isso nao e obvio

5. A SOLUCAO (600-1000 palavras)
   - Framework ou metodologia
   - Como funciona (mecanismo)
   - Evidencias (cases, dados, estudos)
   - Comparacao com alternativas (posicionar sem vender)

6. IMPLEMENTACAO (400-600 palavras)
   - Passos praticos
   - Quick wins vs. long-term
   - Recursos necessarios
   - Erros comuns a evitar

7. RESULTADOS ESPERADOS (300-500 palavras)
   - Benchmarks e metricas
   - Cases resumidos
   - ROI projetado

8. CONCLUSAO + CTA (200-300 palavras)
   - Recapitulacao do insight
   - Next steps claros
   - CTA soft (nao venda agressiva)

9. SOBRE [MARCA] (100-150 palavras)
   - Posicionamento como autoridade no tema
   - Credenciais relevantes
   - CTA secundario
```

### 3. Equilibrar Educacao e Persuasao
**Proporcao ideal:** 80% educacao + 20% persuasao

**Regras:**
- NUNCA mencionar produto antes da pagina 3
- Dados de terceiros ANTES de dados proprios
- Deixar o leitor CONCLUIR que precisa da solucao
- Cada secao deve ter valor standalone (teste: tiraria essa secao e compartilharia?)
- Citar fontes crediveis (pesquisas, especialistas)

**Tecnicas de persuasao sutil:**
- **Framing:** Apresentar dados de forma que favoreça a conclusao desejada
- **Implied expertise:** Demonstrar conhecimento profundo sem se auto-promover
- **Strategic gaps:** Mostrar o "como" parcialmente — para o "como completo", fale conosco
- **Social proof embedded:** Cases e dados naturalmente woven na narrativa

### 4. Design e Formatting
**Elementos visuais (briefar designer):**
- Graficos para dados complexos
- Pull quotes para insights-chave
- Infograficos para processos
- Callout boxes para stats impactantes
- Table of contents navegavel

**Formatting para scanning:**
- Subheadlines descritivos (nao genericos)
- Bullets para listas
- Bold para key phrases
- Sidebars para contexto adicional

### 5. Otimizar para Conversao
**Gate strategy:**
- Ungated executive summary (pre-qualifica interesse)
- Gated full whitepaper (captura lead)
- Landing page com copy que vende o whitepaper

**Follow-up sequence:**
- Email 1: Agradecimento + link
- Email 2: Insight adicional relacionado
- Email 3: Case study que complementa
- Email 4: CTA para conversa

## Cross-Squad Handoff
```yaml
handoffs:
  - to: conversion-writer (Spark)
    delivers: LP copy para gate do whitepaper
    format: Landing page brief + key benefits
  - to: squad-content
    delivers: Whitepaper para distribuicao
    format: PDF + executive summary + social snippets
  - to: squad-research
    delivers: Whitepaper para validacao de dados
    format: Draft com sources marcadas
```

## Saida
- Whitepaper completo (2000-5000 palavras)
- Executive summary standalone
- 5-10 social snippets extraidos
- Brief para landing page de download
- Sequencia de follow-up emails (briefing)

## Validacao
- [ ] Thesis clara e provada ao longo do documento
- [ ] Angulo unico (diferenciado de whitepapers genericos)
- [ ] Proporcao 80/20 educacao/persuasao
- [ ] Produto NAO mencionado antes da pagina 3
- [ ] Min 5 fontes externas citadas
- [ ] Cases/dados como evidencia
- [ ] CTA soft (nao venda agressiva)
- [ ] Formatting para scanning
- [ ] Executive summary funciona standalone

---

*Task operada por: long-form-writer (Saga)*
