---
task: analyze-content-performance
responsavel: "@content-analyst"
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

# Task: Analyze Content Performance

> Analisar performance de conteudo publicado para gerar insights acionaveis.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-analyst (Lens) |
| **Co-agents** | editorial-strategist (North) |
| **Trigger** | Semanal (report rapido), mensal (deep dive), trimestral (analise completa) |
| **Input** | Metricas de todas as plataformas, KPIs definidos, historico de performance |
| **Output** | Report de performance com insights, tendencias e recomendacoes |
| **Handoff** | → editorial-strategist (North) e content-orqx (Nexus) |
| **Complexity** | complex |

---

## Fundamentacao

Dados sem analise sao numeros. Analise sem insight e descricao. Insights sem acao sao desperdicio. A analise de performance deve responder: O QUE funcionou? POR QUE funcionou? O QUE FAZER diferente? O ciclo completo — dados → analise → insight → acao — e o que transforma conteudo bom em conteudo excelente ao longo do tempo. Referencia: Avinash Kaushik — "so what?" test, Robert Rose — content marketing measurement.

---

## Steps

### Step 1: Consolidar Dados
Coletar metricas de todas as plataformas: alcance, impressoes, engajamento, saves, shares, cliques, conversoes. Normalizar por plataforma (engagement rate, nao numeros absolutos).

### Step 2: Analisar vs KPIs
Para cada KPI definido: on track, ahead, ou behind? Green/yellow/red por metrica. Tendencia: melhorando, estavel, ou piorando?

### Step 3: Identificar Top Performers
Top 5 pecas por metrica principal. Para cada: por que performou bem? Tema, formato, timing, hook, CTA? Padroes entre top performers?

### Step 4: Identificar Underperformers
Bottom 5 pecas. Para cada: por que falhou? Tema errado, formato inadequado, timing ruim, hook fraco? Padroes entre underperformers?

### Step 5: Extrair Insights Acionaveis
De top + bottom: quais insights geram acao? "Carrosseis educativos com hook de dado performam 3x melhor que com hook de pergunta" e acionavel. "O engajamento variou" nao e.

### Step 6: Gerar Recomendacoes
3-5 recomendacoes concretas para o proximo ciclo: formatos a priorizar, temas a explorar, horarios a testar, CTAs a ajustar.

### Step 7: Handoff

```yaml
handoff:
  artifact: "performance-report-{period}.md"
  context: "Performance: {N} pecas analisadas, top performer '{top}', {R} recomendacoes, KPIs {status}"
  next: "editorial-strategist (North) para ajustar estrategia, content-orqx (Nexus) para proxima sprint"
```
