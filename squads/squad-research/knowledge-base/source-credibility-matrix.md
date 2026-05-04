# Source Credibility Matrix

## 5-Tier Classification

### Tier 1: PRIMARY (Dados Proprios)
- **O que e:** Dados que voce coletou diretamente
- **Exemplos:** Entrevistas com clientes, surveys proprios, analytics do produto, A/B tests, dados de CRM
- **Credibilidade:** Maxima — voce controla metodologia e coleta
- **Limitacoes:** Pode ter vieses de selecao, sample size limitado
- **Custo/Esforco:** Alto
- **Validade tipica:** 6-12 meses

### Tier 2: ACADEMIC (Peer-Reviewed)
- **O que e:** Pesquisa academica revisada por pares
- **Exemplos:** Papers em journals (HBR, Journal of Marketing), meta-analises, systematic reviews, teses de PhD
- **Credibilidade:** Alta — metodologia rigida, revisao por pares
- **Limitacoes:** Pode estar datado (2-5 anos de atraso), academico demais para negocio
- **Custo/Esforco:** Medio (acesso a journals pode ser pago)
- **Validade tipica:** 2-5 anos (metodologia), 1-2 anos (dados)

### Tier 3: INDUSTRY (Consultorias/Analistas)
- **O que e:** Reports de empresas especializadas
- **Exemplos:** McKinsey, BCG, Bain, Gartner, Forrester, Statista, CB Insights, Nielsen, Kantar
- **Credibilidade:** Boa — metodologia profissional, dados amplos
- **Limitacoes:** Pode ter bias de cliente, dados agregados (perda de nuance), paywall
- **Custo/Esforco:** Medio-Alto (reports caros)
- **Validade tipica:** 1-2 anos

### Tier 4: MARKET (Publicacoes Comerciais)
- **O que e:** Publicacoes do mercado, noticias de industria
- **Exemplos:** TechCrunch, Bloomberg, trade publications, newsletters especializadas, analyst notes
- **Credibilidade:** Moderada — verificar contra outras fontes
- **Limitacoes:** Pode ser sensacionalista, bias editorial, nao peer-reviewed
- **Custo/Esforco:** Baixo
- **Validade tipica:** 3-6 meses (noticias), 1 ano (analises)

### Tier 5: SOCIAL (Fontes Sociais)
- **O que e:** Conteudo gerado por usuarios e comunidades
- **Exemplos:** Reddit, Twitter/X, forums, reviews (G2, Capterra), comentarios, podcasts, blogs
- **Credibilidade:** Baixa — verificar SEMPRE, usar para sentiment e hipoteses
- **Limitacoes:** Anonimo, sem verificacao, bias de selecao, astroturfing
- **Custo/Esforco:** Muito baixo
- **Validade tipica:** 1-3 meses

## Minimum Requirements por Depth Level

| Depth Level | Min Fontes | Min Tier | Triangulacao |
|------------|:-----------:|:--------:|:------------:|
| SCAN | 2-3 | Tier 4 | Nao obrigatorio |
| ANALYZE | 5-8 | Tier 3 | 2 fontes por claim |
| DEEP DIVE | 10-15 | Tier 2 | 3+ fontes por claim |
| DEFINITIVE | 20+ | Tier 1 | Todas as claims |

## Triangulacao Rules
1. **Regra de 3:** Claim importante precisa de 3 fontes independentes
2. **Multi-tier:** Idealmente fontes de tiers diferentes (ex: Tier 1 + Tier 3 + Tier 4)
3. **Multi-type:** Misturar quantitativo + qualitativo
4. **Convergencia:** Se 3+ fontes concordam → HIGH confidence
5. **Divergencia:** Se fontes discordam → investigar, declarar incerteza

## Red Flags por Tier

| Red Flag | Descricao |
|----------|-----------|
| Fonte unica | Claim baseada em 1 fonte so |
| Circular sourcing | Fonte A cita B que cita A |
| Dados sem metodologia | Numero sem explicacao de como foi obtido |
| Outdated | Dados >2 anos em mercado dinamico |
| Conflito de interesse | Fonte tem incentivo financeiro no resultado |
| Sample size oculto | "Pesquisa mostra que..." sem n= |
| Cherry picking | Selecao seletiva de dados que suportam tese |

## Source Documentation Template

```
**Fonte:** [Nome/Titulo]
**Tier:** [1-5]
**Autor/Org:** [Quem]
**Data:** [Quando publicado]
**Metodologia:** [Como coletado]
**Sample:** [n=, populacao]
**Credibilidade:** [HIGH/MEDIUM/LOW]
**Biases potenciais:** [Quais]
**URL/Referencia:** [Link]
```

---

*Knowledge base da squad-research*
