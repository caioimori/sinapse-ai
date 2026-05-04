---
task: optimize-existing-copy
responsavel: "@conversion-writer"
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

# Task: Optimize Existing Copy

## Metadata
- **Squad:** squad-copy
- **Agent:** conversion-writer (Spark)
- **Complexity:** STANDARD
- **Depends on:** copy existente, dados de performance, user feedback
- **Feeds:** copy-editor (Chisel), squad-growth

## Objetivo
Otimizar copy existente para melhorar conversao — usando dados, heurísticas e testes para encontrar e corrigir pontos de perda no funil de copy.

## Entrada
- Copy atual (LP, email, ad, etc.)
- Dados de performance (conversion rate, bounce, time on page)
- Heatmaps/scroll maps (se disponíveis)
- User feedback/surveys (se disponíveis)
- Benchmarks de industria

## Passos

### 1. Diagnosticar Problemas de Copy
**Auditoria de Conversao (por secao):**

| Sinal | Diagnostico | Acao |
|-------|-------------|------|
| Alto bounce rate | Headline/hero falha | Reescrever headline + above-the-fold |
| Scroll curto | Perda de interesse apos hero | Melhorar transicao hero → body |
| Scroll longo mas baixa conversao | Copy convence mas CTA falha | Otimizar CTA + oferta |
| Alto tempo na pagina mas baixa conversao | Confusao ou objecoes | Simplificar + FAQ |
| Click em FAQ alto | Objecoes nao respondidas | Enderecar objecoes no body |
| Abandono no formulario | Fricao ou medo | Reduzir campos + trust signals |

### 2. Framework de Otimizacao LIFT
**LIFT Model (por Chris Goward):**

| Fator | Pergunta | Otimizacao |
|-------|----------|------------|
| **Value Proposition** | O valor e claro e compelling? | Reescrever headline/subheadline |
| **Relevance** | A copy fala com a audiencia certa? | Ajustar linguagem e exemplos |
| **Clarity** | E facil entender a oferta? | Simplificar, remover jargao |
| **Urgency** | Existe razao para agir AGORA? | Adicionar deadline ou escassez real |
| **Anxiety** | Existem medos nao endereçados? | Adicionar garantia, trust signals |
| **Distraction** | Existem elementos que desviam atencao? | Remover links, opcoes, ruido |

### 3. Otimizacoes Quick-Win
**Mudancas de alto impacto, baixo esforço:**

**Headline:**
- Adicionar numero especifico ("47%" vs "muitos")
- Adicionar timeframe ("em 30 dias" vs "rapidamente")
- Trocar feature por beneficio

**CTA:**
- Trocar "Submit" / "Saiba Mais" por acao especifica
- Adicionar friction reducer abaixo do botao
- Mudar para primeira pessoa ("Quero Meu Acesso")

**Social Proof:**
- Adicionar numeros ("10,000+ clientes")
- Mover testimonials para mais perto do CTA
- Adicionar fotos reais aos testimonials

**Formulario:**
- Remover campos nao essenciais
- Adicionar progress indicator
- Mostrar beneficio ao lado do formulario

**Formatting:**
- Quebrar paragrafos longos
- Adicionar subheadlines entre secoes
- Bold em key phrases
- Whitespace entre secoes

### 4. Processo de Teste
**Priorizacao de testes (ICE Score):**
| Teste | Impact | Confidence | Ease | Score |
|-------|:------:|:----------:|:----:|:-----:|
| Headline A/B | 5 | 4 | 5 | 14 |
| CTA copy | 4 | 4 | 5 | 13 |
| Social proof placement | 4 | 3 | 4 | 11 |
| Form reduction | 4 | 4 | 3 | 11 |
| Body copy rewrite | 5 | 3 | 2 | 10 |

**Regras de teste:**
- 1 variavel por teste (isolar)
- Significancia estatistica antes de declarar winner
- Min 100 conversoes por variante
- Rodar por min 1 semana (ciclos de comportamento)

### 5. Documentar Otimizacoes
**Template de otimizacao:**
```yaml
optimization:
  id: OPT-001
  element: "Hero headline LP principal"
  before: "A Melhor Plataforma de Marketing"
  after: "Aumente Suas Vendas em 47% nos Proximos 90 Dias"
  hypothesis: "Headline com numero especifico e timeframe
               aumentara CTR em 15%+"
  metric: Click-through to pricing
  result: TBD
  lift: TBD
  learnings: TBD
```

## Cross-Squad Handoff
```yaml
handoffs:
  - to: copy-editor (Chisel)
    delivers: Copy otimizada para review final
    format: Before/after + rationale
  - to: squad-growth
    delivers: Testes para implementacao
    format: Variantes + hipoteses + metricas
```

## Saida
- Diagnostico de problemas com dados
- Quick-wins implementados
- Variantes para A/B testing (priorizadas)
- Documentacao before/after com rationale

## Validacao
- [ ] Diagnostico baseado em dados (nao opiniao)
- [ ] LIFT model aplicado
- [ ] Quick-wins identificados e implementados
- [ ] Min 3 testes A/B desenhados
- [ ] ICE scoring para priorizacao
- [ ] Before/after documentado
- [ ] Hipoteses falsificaveis
- [ ] Metricas de sucesso definidas

---

*Task operada por: conversion-writer (Spark)*
