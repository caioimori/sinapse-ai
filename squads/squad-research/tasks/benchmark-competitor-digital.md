---
task: benchmark-competitor-digital
responsavel: "@competitive-intelligence"
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

# Task: Benchmark Competitor Digital

## Metadata
- **Squad:** squad-research
- **Agent:** competitive-intelligence (Hawk)
- **Complexity:** STANDARD
- **Depends on:** map-competitive-landscape
- **Feeds:** growth-analytics, digital-experience

## Objetivo
Benchmarkar presenca digital dos competidores — trafego, SEO, social, conteudo — para identificar oportunidades e gaps.

## Entrada
- Lista de competidores a benchmarkar
- Nossas metricas digitais (para comparacao)

## Passos

### 1. Trafego Web (SimilarWeb)
- Visits mensais estimadas
- Fontes de trafego: organico, pago, social, referral, direto
- Geografia principal
- Top paginas (por trafego)
- Bounce rate e tempo no site

### 2. SEO (SEMrush/Ahrefs)
- Domain authority/rating
- Keywords ranqueadas (total + top 10)
- Keywords em comum (overlap)
- Keywords que eles ranqueiam e nos nao (gap)
- Backlinks (quantidade e qualidade)
- Conteudo: blog frequency, top posts

### 3. Social Media
- Followers por plataforma
- Engagement rate (media)
- Frequencia de postagem
- Tipo de conteudo predominante
- Top posts (por engagement)
- Growth rate (followers/mes)

### 4. Conteudo & Thought Leadership
- Blog: frequencia, temas, qualidade percebida
- Newsletter: tem? Frequencia? Estimativa de base
- Podcast/video: presenca, consistencia
- Webinars/eventos: frequencia, temas
- Downloads (lead magnets): que oferecem

### 5. Paid Media (estimativas)
- Google Ads: investimento estimado (SEMrush)
- Social ads: presenca no Facebook Ad Library
- Temas de ads: que messaging usam em paid
- Landing pages: qualidade, CTA

### 6. Tabela Comparativa

| Metrica | Nos | Comp 1 | Comp 2 | Comp 3 |
|---------|-----|--------|--------|--------|
| Trafego/mes | | | | |
| DA/DR | | | | |
| Keywords top 10 | | | | |
| Followers total | | | | |
| Engagement rate | | | | |
| Blog posts/mes | | | | |

### 7. Oportunidades & Gaps
- Onde eles sao superiores → aprender ou diferenciar
- Onde nos somos superiores → explorar
- Canais que ninguem explora → first mover advantage
- Conteudo que falta no mercado → oportunidade

## Saida
- Benchmark digital completo (tabela comparativa)
- Analise de gaps e oportunidades
- Recomendacoes de investimento digital

## Validacao
- [ ] Trafego, SEO, social, conteudo analisados
- [ ] Tabela comparativa preenchida
- [ ] Gaps identificados
- [ ] Recomendacoes priorizadas

## Handoffs
```yaml
handoff:
  cross_squad:
    - to: "growth-analytics/orchestrator"
      artifact: "benchmark digital, SEO gaps"
      context: "Para estrategia de growth baseada em competitive intelligence"
    - to: "digital-experience/orchestrator"
      artifact: "UX benchmark, landing page analysis"
      context: "Para otimizacao de experiencia digital"
```

---

*Task operada por: competitive-intelligence (Hawk)*
