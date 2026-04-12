---
task: optimize-funnel-conversion-copy
responsavel: "@funnel-copywriter"
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

# Task: Optimize Funnel Conversion Copy

## Metadata
- **Squad:** squad-copy
- **Agent:** funnel-copywriter (Flow)
- **Complexity:** STANDARD
- **Depends on:** funil existente, dados de conversao por etapa
- **Feeds:** growth-analytics squad, paid-media squad, copy-strategist (Quill)

## Objetivo
Auditar e otimizar copy de funil existente para melhorar conversion rate em cada etapa. Identificar gargalos, diagnosticar causas e aplicar fixes de copy baseados em dados e principios de persuasao. O objetivo e maximizar revenue per visitor (RPV) ao longo de todo o funil.

## Entrada
- Copy atual de cada etapa do funil
- Metricas de conversao por etapa (CR%, drop-off, RPV)
- Dados de heatmap/scroll depth (se disponiveis)
- Dados de A/B tests anteriores (se disponiveis)
- Audiencia e awareness level

## Passos

### 1. Diagnosticar Gargalos por Etapa
**Benchmarks de conversao por etapa:**
| Etapa | Benchmark | Se Abaixo | Diagnostico Provavel |
|-------|-----------|-----------|---------------------|
| Ad → Opt-in | >30% | Headline fraco ou promessa desalinhada | Reescrever headline/bullets |
| Opt-in → Tripwire | >10% | Bridge page fraca ou tripwire irrelevante | Melhorar conexao LM→tripwire |
| Tripwire → Upsell | >15% | Upsell nao complementa ou preco alto | Refazer pitch de complementaridade |
| Sales Page | >2-5% | Multiple issues possiveis | Analise secao por secao |
| Order Bump | >20% | Copy fraca ou oferta irrelevante | Reescrever 3-5 linhas |
| Checkout → Purchase | >60% | Friccao no checkout | Simplificar + reafirmar |

### 2. Auditar Headline e Above-the-Fold
- O headline comunica resultado CLARO em < 10 palavras?
- Subheadline explica COMO ou PARA QUEM?
- CTA esta visivel sem scroll?
- Social proof imediato (logo bar, numeros, rating)?
- Imagem/video reforça (nao distrai do) headline?

### 3. Otimizar Secao por Secao
**Para cada secao com alto drop-off:**

**Lead/Opening:**
- Testar tipo de lead diferente (direct vs story vs problem)
- Verificar se primeiras 3 linhas prendem atencao
- Remover TUDO que nao serve ao hook

**Body/Mecanismo:**
- Mecanismo esta claro em linguagem simples?
- Analogia ajuda ou confunde?
- Proof stack esta posicionado perto das claims?

**Offer Stack:**
- Valor percebido > 10x o preco?
- Bonus nomeados com beneficio (nao feature)?
- Preco anchor antes do preco real?

**Close/CTA:**
- Garantia esta forte e visivel?
- CTA repete 3x (minimo)?
- Urgencia e REAL (nao fabricada)?

### 4. Criar Variacoes para A/B Test
**Priorizar testes por impacto:**
| Prioridade | Elemento | Variacoes | Metrica |
|-----------|----------|-----------|---------|
| 1 | Headline | 3 variacoes | Conversao |
| 2 | CTA text/design | 3 variacoes | Click rate |
| 3 | Offer stack | 2 variacoes | AOV |
| 4 | Social proof section | 2 variacoes | Conversao |
| 5 | Price anchor | 2 variacoes | Conversao |

### 5. Verificar Congruencia Pos-Otimizacao
- Mudancas em uma etapa nao quebraram messaging de outra?
- Big Idea ainda consistente do ad ao thank you?
- Tom e linguagem consistentes apos edits?
- Promessas do ad ainda cumpridas na LP?

## Cross-Squad Handoff
```yaml
handoffs:
  - to: growth-analytics squad
    delivers: Recomendacoes de otimizacao com metricas baseline
    format: Report por etapa com diagnostico e fix
  - to: paid-media squad
    delivers: Insights de funil para otimizacao de campanha
    format: Dados de conversao + recomendacoes de targeting
```

## Saida
- Diagnostico por etapa do funil (gargalos identificados)
- Copy otimizada para cada gargalo
- Variacoes para A/B testing priorizadas
- Checklist de congruencia verificada
- RPV projetado apos otimizacoes

## Validacao
- [ ] Diagnostico cobre todas as etapas do funil
- [ ] Benchmarks de referencia por etapa documentados
- [ ] Copy otimizada para cada gargalo identificado
- [ ] Variacoes A/B com hipotese e metrica definidas
- [ ] Congruencia de messaging mantida pos-otimizacao
- [ ] Recomendacoes priorizadas por impacto estimado
- [ ] Headlines testados (3+ variacoes)
- [ ] CTAs especificos e orientados a beneficio

---

*Task operada por: funnel-copywriter (Flow)*
