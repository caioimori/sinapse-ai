---
task: predict-content-performance
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

# Task: Predict Content Performance

> Prever performance de conteudo antes da publicacao baseado em padroes historicos.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-analyst (Lens) |
| **Trigger** | Pre-publicacao (opcional, para priorizacao) |
| **Input** | Conteudo finalizado, historico de performance, padroes identificados |
| **Output** | Score preditivo com range estimado de performance |
| **Handoff** | → content-orqx (Nexus) para priorizacao |
| **Complexity** | medium |

---

## Fundamentacao

Previsao de performance permite alocar recursos antes da publicacao: conteudo com alta previsao de performance merece mais investimento em distribuicao/amplificacao. A previsao usa padroes historicos: combinacao de formato + tema + timing + hook type que historicamente performam bem. Nao e ciencia exata — e probabilidade informada. Referencia: predictive analytics in content marketing.

---

## Steps

### Step 1: Identificar Atributos da Peca
Formato, pilar, sub-tema, tipo de hook, tipo de CTA, comprimento, plataforma, dia/horario planejado. Esses sao os "features" da previsao.

### Step 2: Comparar com Historico
Pecas anteriores com atributos similares: como performaram? Media, mediana, range. Quanto mais dados historicos, mais confiavel a previsao.

### Step 3: Aplicar Padroes de Top Performers
A peca possui atributos de top performers identificados? Se sim: ajustar previsao para cima. Se possui atributos de underperformers: ajustar para baixo.

### Step 4: Emitir Score Preditivo
Score 1-10 com confianca (alta, media, baixa). Range estimado: engagement rate esperado entre X% e Y%. A confianca depende da quantidade de dados historicos.

### Step 5: Handoff

```yaml
handoff:
  artifact: "performance-prediction-{peca}.md"
  context: "Previsao: score {score}/10, range {min}-{max}%, confianca {nivel}"
  next: "content-orqx (Nexus) para priorizacao de publicacao e investimento"
```
