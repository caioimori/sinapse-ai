---
task: write-sales-letter
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

# Task: Write Sales Letter

## Metadata
- **Squad:** squad-copy
- **Agent:** long-form-writer (Saga)
- **Complexity:** COMPLEX
- **Depends on:** copy brief, headline aprovado, message hierarchy
- **Feeds:** persuasion-psychologist (Nudge), copy-editor (Chisel)

## Objetivo
Escrever sales letter completa que guia o leitor do problema até a acao — usando storytelling, provas e persuasao sequencial para criar "The Slippery Slide" (Sugarman).

## Entrada
- Copy brief com audiencia e awareness level
- Headline e subheadlines aprovados
- Message hierarchy e proof points
- Oferta e pricing definidos

## Passos

### 1. Determinar Estrutura por Awareness Level
| Awareness | Estrutura | Comprimento |
|-----------|-----------|-------------|
| Unaware | Problema → Agitacao → Descoberta → Solucao → Oferta | Longa (3000-5000 palavras) |
| Problem Aware | Empatia → Amplificacao → Solucao → Prova → Oferta | Media-Longa (2000-4000) |
| Solution Aware | Mecanismo unico → Diferenciacao → Prova → Oferta | Media (1500-3000) |
| Product Aware | Oferta irresistivel → Prova → Urgencia → CTA | Curta-Media (1000-2000) |
| Most Aware | Oferta direta → Bonus → Deadline → CTA | Curta (500-1500) |

### 2. Escrever Opening (The Lead)
**Tipos de Lead (por Michael Masterson/Mark Ford):**
- **Direct Lead:** Vai direto ao beneficio principal (Product/Most Aware)
- **Indirect Lead:** Historia ou analogia antes de revelar (Unaware/Problem)
- **Offer Lead:** Comeca com a oferta irresistivel (Most Aware)
- **Promise Lead:** Promessa bold do resultado (Solution/Product)
- **Problem Lead:** Articula a dor melhor que o leitor faria (Problem Aware)
- **Secret Lead:** Revela algo desconhecido (Unaware/Problem)
- **Story Lead:** Narrativa envolvente que espelha o leitor (qualquer nivel)
- **Proclamation Lead:** Declaracao audaciosa que desafia crencas (Unaware)

**Regra dos primeiros 300 palavras:**
- Deve prender atencao E criar momentum
- Nenhum paragrafo > 3 linhas
- Frases curtas alternando com medias
- Zero jargao tecnico no opening

### 3. Construir The Body (Slippery Slide)
**Sequencia persuasiva:**
1. **Empatia profunda:** "Eu sei como voce se sente porque..."
2. **Amplificacao do problema:** Consequencias de NAO resolver
3. **Ponte para solucao:** "Existe outro caminho..."
4. **Mecanismo unico:** POR QUE funciona (nao apenas O QUE faz)
5. **Provas em camadas:**
   - Social proof (testimonials, numeros)
   - Authority proof (credenciais, estudos)
   - Demonstracao proof (antes/depois, resultados)
6. **Objection handling:** Antecipa e dissolve cada objecao
7. **Future pacing:** Faz o leitor SENTIR o resultado

**Tecnicas de Slippery Slide:**
- Cada paragrafo cria curiosidade para o proximo
- Open loops (perguntas que serao respondidas adiante)
- Bucket brigades: "Mas aqui esta o melhor...", "E tem mais..."
- Subheadlines que funcionam como mini-headlines
- Variacao de ritmo (longo → curto → impacto)

### 4. Construir The Offer Stack
**Formato:**
```
PRODUTO PRINCIPAL .............. Valor R$X.XXX
  + Bonus 1: [nome] ........... Valor R$XXX
  + Bonus 2: [nome] ........... Valor R$XXX
  + Bonus 3: [nome] ........... Valor R$XXX

VALOR TOTAL: R$X.XXX

SEU INVESTIMENTO HOJE: R$XXX
(Economia de XX%)
```

**Regras do Offer Stack:**
- Valor percebido > 10x o preco
- Cada bonus resolve uma objecao especifica
- Nomear bonus com beneficio (nao feature)
- Bonus devem ser desejaveis independentemente

### 5. Escrever The Close
**Elementos do fechamento:**
1. **Resumo de valor:** Recapitula tudo que recebe
2. **Garantia:** Risk reversal (quanto mais forte, melhor)
3. **Urgencia/escassez:** Real, nunca fabricada
4. **CTA principal:** Claro, especifico, action-oriented
5. **PS (Post-scriptum):** Segundo elemento mais lido apos headline
   - PS 1: Reforce beneficio principal OU urgencia
   - PS 2 (opcional): Testimonial curto OU garantia

### 6. Aplicar Formatting para Leitura
- **Paragrafos curtos:** Max 3-4 linhas
- **Subheadlines:** A cada 200-300 palavras
- **Bold:** Frases-chave para scanners
- **Bullets:** Para listas de beneficios
- **Indentation/boxes:** Para testimonials e callouts
- **Whitespace:** Generoso para nao intimidar

## Cross-Squad Handoff
```yaml
handoffs:
  - to: conversion-writer (Spark)
    delivers: Sales letter framework para adaptacao em LP
    format: Estrutura + copy blocks reutilizaveis
  - to: persuasion-psychologist (Nudge)
    delivers: Sales letter para review de persuasao
    format: Copy completa com notas de intencao por secao
```

## Saida
- Sales letter completa (1000-5000 palavras conforme awareness)
- Offer stack formatado
- PS section
- Notas de intencao por secao (para review)

## Validacao
- [ ] Lead type apropriado para awareness level
- [ ] Slippery Slide — cada secao puxa para proxima
- [ ] Mecanismo unico explicado (nao apenas features)
- [ ] Provas em 3+ camadas (social, authority, demo)
- [ ] Objecoes top 5 endereçadas
- [ ] Offer stack com valor percebido > 10x
- [ ] Garantia incluida com risk reversal
- [ ] CTA claro e especifico
- [ ] PS reforça elemento persuasivo chave
- [ ] Formatting otimizado para leitura

---

*Task operada por: long-form-writer (Saga)*
