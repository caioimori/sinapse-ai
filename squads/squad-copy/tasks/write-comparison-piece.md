---
task: write-comparison-piece
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

# Task: Write Comparison Piece

## Metadata
- **Squad:** squad-copy
- **Agent:** long-form-writer (Saga)
- **Complexity:** STANDARD
- **Depends on:** competitive analysis, product features, copy brief
- **Feeds:** conversion-writer (Spark), squad-content

## Objetivo
Escrever comparison piece (vs. page, alternative page) que posiciona a marca como melhor escolha — sendo honesto o suficiente para gerar confianca mas estrategico o suficiente para vencer.

## Entrada
- Feature matrix (marca vs. competitors)
- Competitive analysis (de squad-research)
- Audiencia e criterios de decisao
- Pontos fortes e fracos honestos

## Passos

### 1. Escolher Tipo de Comparacao
| Tipo | Formato | Quando Usar | SEO Value |
|------|---------|-------------|-----------|
| Vs. Page | "[Marca] vs [Competitor]" | Competitor forte, busca direta | Alto |
| Alternatives | "Top [N] Alternativas a [Competitor]" | Competitor dominante | Alto |
| Category | "Best [Categoria] Tools in [Ano]" | Lideranca de categoria | Muito Alto |
| Migration | "Switching from [Competitor] to [Marca]" | Roubar market share | Medio |
| Comparison Guide | "How to Choose [Categoria]" | Educar + posicionar | Alto |

### 2. Framework de Posicionamento
**Principio: Nao ataque — posicione.**

**Matriz de Comparacao Estrategica:**
```
CRITERIO          | NOS    | ELES   | IMPORTANCIA
Criterio forte 1  | ✅✅   | ✅     | ⭐⭐⭐ (alta)
Criterio forte 2  | ✅✅   | ❌     | ⭐⭐⭐ (alta)
Criterio neutro   | ✅     | ✅     | ⭐⭐ (media)
Criterio fraco    | ✅     | ✅✅   | ⭐ (baixa)
```

**Estrategia:**
- Enfatizar criterios onde vence E que importam para o leitor
- Ser honesto onde perde (gera credibilidade)
- Reframear criterios fracos ("eles tem mais features, nos temos simplicidade")
- Mudar os criterios de comparacao se necessario (Blue Ocean)

### 3. Estrutura da Comparison Piece
**Vs. Page (1000-2000 palavras):**

```
1. HEADLINE
   "[Marca] vs [Competitor]: Qual e Melhor para [Caso de Uso]?"

2. TL;DR (100-150 palavras)
   - Resumo honesto: para quem [Marca] e melhor, para quem [Competitor] e melhor
   - Tabela rapida de comparacao (3-5 criterios top)

3. OVERVIEW (200-300 palavras)
   - O que cada ferramenta faz (neutro, factual)
   - Para quem cada uma foi desenhada

4. COMPARACAO DETALHADA (500-800 palavras)
   - Criterio 1 (nosso forte): Deep dive
   - Criterio 2 (nosso forte): Deep dive
   - Criterio 3 (empate): Analise honesta
   - Criterio 4 (ponto deles): Reconhecer + reframe
   - Criterio 5 (nosso forte): Deep dive

5. PRICING COMPARISON (100-200 palavras)
   - Tabela de planos lado a lado
   - TCO (Total Cost of Ownership) se favoravel

6. QUEM DEVE ESCOLHER QUEM (100-200 palavras)
   - "Escolha [Marca] se..."
   - "Escolha [Competitor] se..." (honestidade gera confianca)

7. VEREDICTO (100-150 palavras)
   - Recomendacao clara com justificativa
   - CTA para trial/demo

8. FAQ (200-300 palavras)
   - Perguntas comuns sobre a migracao/escolha
```

### 4. Regras de Escrita
**O que FAZER:**
- Ser factual e verificavel em cada claim
- Mostrar screenshots/evidencias quando possivel
- Admitir onde o competitor e melhor (gera MUITA credibilidade)
- Focar em casos de uso, nao em features isoladas
- Usar linguagem do comprador ("quando voce precisa de X...")
- Incluir reviews/testimonials de quem migrou
- Atualizar frequentemente (dados desatualizados = perda de confianca)

**O que NAO FAZER:**
- Nunca insultar ou denegrir o competitor
- Nunca mentir ou exagerar vantagens
- Nunca ignorar pontos fortes do competitor
- Nunca usar linguagem emocional negativa
- Nunca comparar precos sem contexto de valor
- Nunca escrever como se fosse propaganda

### 5. SEO e Distribuicao
**Otimizacao:**
- Keyword principal: "[Marca] vs [Competitor]"
- Keywords secundarios: "[Competitor] alternative", "[Competitor] vs [Marca]"
- Schema markup: FAQ, Comparison, Review
- Internal links para feature pages relevantes
- External links para reviews de terceiros

**Adaptacoes:**
| Canal | Formato |
|-------|---------|
| Blog post | Full comparison piece |
| Landing page | Condensed + CTA forte |
| Email | Key differentiators + link |
| Social | Quick comparison graphic |
| Ad copy | Strongest differentiator |
| Sales enablement | Battle card derivado |

## Cross-Squad Handoff
```yaml
handoffs:
  - to: conversion-writer (Spark)
    delivers: Comparison para conversao em LP
    format: Key differentiators + CTA copy
  - to: squad-research
    delivers: Comparison para validacao de dados
    format: Draft com claims para fact-check
  - to: squad-content
    delivers: Comparison para SEO e distribuicao
    format: Full piece + SEO brief
```

## Saida
- Comparison piece completa (1000-2000 palavras)
- Feature comparison table
- TL;DR summary
- FAQ section
- Battle card derivado (1 pager para sales)

## Validacao
- [ ] Tom neutro e factual (nao propaganda)
- [ ] Pontos fortes do competitor reconhecidos
- [ ] Criterios de comparacao relevantes para audiencia
- [ ] Claims verificaveis e atualizados
- [ ] "Escolha eles se..." incluido (honestidade)
- [ ] CTA claro
- [ ] SEO otimizado para keywords comparativos
- [ ] Tabela de comparacao visual incluida

---

*Task operada por: long-form-writer (Saga)*
