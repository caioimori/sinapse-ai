---
task: analyze-audience-behavior
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

# Task: Analyze Audience Behavior

> Analisar comportamento da audiencia para entender preferencias, habitos e evolucao.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-analyst (Lens) |
| **Co-agents** | signal-intelligence (Radar) |
| **Trigger** | Mensal ou quando metricas indicam mudanca de comportamento |
| **Input** | Demographics, dados de comportamento, padroes de engajamento, dados de audiencia |
| **Output** | Perfil atualizado de audiencia com insights comportamentais |
| **Handoff** | → editorial-strategist (North), content-engineer (Arc) |
| **Complexity** | medium |

---

## Fundamentacao

Audiencia nao e estatica — evolui. Quem te seguia ha 6 meses pode nao ser o mesmo perfil de quem te segue hoje. A analise comportamental revela: quando sua audiencia esta online, com que formatos interage, que temas gera mais saves (sinalizando valor), e como o perfil demografico esta mudando. Referencia: Sprout Social — audience analysis, HubSpot — buyer persona evolution.

---

## Steps

### Step 1: Analisar Demographics
Idade, genero, localizacao, idioma. Mudou em relacao ao periodo anterior? Crescimento em algum segmento inesperado?

### Step 2: Analisar Comportamento de Consumo
Quando estao online? Quanto tempo passam no conteudo? Quais formatos consomem ate o final? Quais abandonam no meio?

### Step 3: Analisar Comportamento de Engajamento
O que gera likes (facil), o que gera saves (valioso), o que gera shares (identificacao), o que gera comments (opiniao). Cada tipo de engajamento revela algo diferente.

### Step 4: Identificar Segmentos de Audiencia
Dentro da audiencia total: existem segmentos distintos? "Profissionais juniores que salvam conteudo educativo" vs "Decisores que compartilham opiniao". Segmentos requerem abordagens diferentes.

### Step 5: Mapear Evolucao
Como a audiencia mudou nos ultimos 3-6 meses? A composicao esta mudando? O comportamento esta mudando? A estrategia deve acompanhar.

### Step 6: Handoff

```yaml
handoff:
  artifact: "audience-analysis-{period}.md"
  context: "Audiencia: {N} segmentos, comportamento {evolucao}, insights {I}"
  next: "editorial-strategist (North) e content-engineer (Arc) para calibrar producao"
```
