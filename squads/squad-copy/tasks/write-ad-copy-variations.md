---
task: write-ad-copy-variations
responsavel: "@ad-copywriter"
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

# Task: Write Ad Copy Variations

## Metadata
- **Squad:** squad-copy
- **Agent:** ad-copywriter (Spark)
- **Complexity:** STANDARD
- **Depends on:** copy brief, audiencia, plataforma(s), landing page definida
- **Feeds:** paid-media squad, funnel-copywriter (Flow), copy-editor (Chisel)

## Objetivo
Criar pacote de variacoes de ad copy para Meta, Google, LinkedIn ou TikTok — com 40+ hooks, variacoes completas organizadas por angulo e formato, prontas para teste em escala. Volume + variedade = dados para otimizacao.

## Entrada
- Plataforma(s) alvo (Meta, Google, LinkedIn, TikTok)
- Objetivo da campanha (awareness, consideration, conversion)
- Audiencia e awareness level
- Oferta e landing page de destino
- Key benefits e proof points
- Restricoes de compliance da plataforma

## Passos

### 1. Gerar 40+ Hooks
**Distribuir por categoria:**

| Categoria | Quantidade | Foco |
|-----------|-----------|------|
| Problema/Dor | 8 hooks | Identificar a dor que o lead sente |
| Resultado/Beneficio | 8 hooks | Promessa do resultado |
| Curiosidade | 8 hooks | Criar intriga e desejo de saber |
| Social Proof | 6 hooks | Depoimentos e numeros |
| Urgencia/Escassez | 5 hooks | Motivar acao imediata |
| Contraintuitivo | 5 hooks | Desafiar crencas comuns |

**Formulas por categoria:**
- Problema: "Cansado de [X]?", "[Dor] esta custando [consequencia]"
- Resultado: "Como [persona] conseguiu [resultado] em [prazo]"
- Curiosidade: "O que [expert] nao quer que voce saiba sobre [X]"
- Social Proof: "[N] [personas] ja [resultado]", "[Nome]: '[quote]'"
- Urgencia: "Antes que [deadline/consequencia]"
- Contraintuitivo: "Pare de [acao comum]. Faca [oposto] ao inves."

### 2. Selecionar Top 15 Hooks e Desenvolver Completo
**Para cada hook selecionado, escrever versao completa:**

**Meta Ads format:**
```
PRIMARY TEXT (125 chars above fold, ate 1000 total):
[Hook]
[Body — 2-3 frases expandindo]
[Social proof ou beneficio adicional]
[CTA com link]

HEADLINE (27-40 chars): [Beneficio principal]
DESCRIPTION (27 chars): [Complemento]
```

**Google RSA format:**
```
HEADLINES (15x, 30 chars cada):
1. [Keyword + beneficio]
2. [Resultado numerico]
...15 variacoes

DESCRIPTIONS (4x, 90 chars cada):
1. [Proposta de valor completa]
2. [Social proof + CTA]
3. [Diferencial + urgencia]
4. [Beneficio + garantia]
```

**LinkedIn format:**
```
INTRO TEXT (150 chars above fold, ate 600):
[Hook profissional]
[Insight de valor]
[CTA]

HEADLINE (70 chars): [Proposta de valor B2B]
```

### 3. Organizar por Angulo de Copy
**Agrupar variacoes:**
| Angulo | Descricao | Hooks | Variacoes |
|--------|-----------|-------|-----------|
| Pain-first | Foca na dor e consequencias | 5-8 | 3-4 completas |
| Aspiration | Foca no resultado desejado | 5-8 | 3-4 completas |
| Authority | Foca em expertise e prova | 4-6 | 2-3 completas |
| Story | Foca em narrativa pessoal | 3-5 | 2-3 completas |
| Comparison | Foca em alternativas vs produto | 3-5 | 2-3 completas |

### 4. Verificar Compliance
**Checklist por plataforma:**
- [ ] Meta: sem claims de renda especifica, sem "voce" em health ads
- [ ] Google: keywords no headline, sem superlativos nao comprováveis
- [ ] LinkedIn: tom profissional, sem clickbait excessivo
- [ ] TikTok: linguagem nativa, anti-polished, sem hard sell
- [ ] Geral: nenhum claim que nao possa ser comprovado

### 5. Definir Plano de Teste
**Estrutura de teste:**
| Fase | O que testar | Quantidade | Duracao | Metrica |
|------|-------------|-----------|---------|---------|
| 1 | Hooks (headline) | 5-8 hooks | 3-5 dias | CTR |
| 2 | Body copy (top hooks) | 3-4 bodies por hook | 5-7 dias | Conversao |
| 3 | CTA variations | 3 CTAs por winner | 3-5 dias | Conversao |
| 4 | Scale winners | Top 3-5 combos | Ongoing | ROAS |

## Cross-Squad Handoff
```yaml
handoffs:
  - to: paid-media squad
    delivers: Ad copy variations organizadas por angulo e plataforma
    format: Spreadsheet com hooks, copies, e plano de teste
  - to: funnel-copywriter (Flow)
    delivers: Messaging e hooks para alinhamento com landing page
    format: Big Idea + top hooks + tom definido
```

## Saida
- 40+ hooks organizados por categoria
- 15 variacoes completas por plataforma
- Agrupamento por angulo de copy
- Compliance check por plataforma
- Plano de teste A/B priorizado

## Validacao
- [ ] 40+ hooks gerados em 6 categorias
- [ ] 15+ variacoes completas no formato da plataforma
- [ ] Angulos de copy variados (pain, aspiration, authority, story, comparison)
- [ ] Compliance verificada por plataforma
- [ ] Plano de teste definido com metricas
- [ ] Hooks com max 7-10 palavras (thumb-stopping)
- [ ] CTAs especificos (nao "saiba mais")
- [ ] Congruencia com landing page de destino

---

*Task operada por: ad-copywriter (Spark)*
