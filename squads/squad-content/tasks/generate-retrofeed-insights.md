---
task: generate-retrofeed-insights
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

# Task: Generate Retrofeed Insights

> Gerar insights de retrofeed que alimentam Radar, North e Arc com aprendizados de performance.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-analyst (Lens) |
| **Co-agents** | signal-intelligence (Radar), editorial-strategist (North), content-engineer (Arc) |
| **Trigger** | Mensal (ciclo de feedback) ou pos-analise de performance |
| **Input** | Analises de performance, padroes, scores, benchmarks |
| **Output** | Pacote de retrofeed com insights acionaveis por agente destinatario |
| **Handoff** | → Radar (calibracao de sinais), North (ajuste de estrategia), Arc (calibracao de producao) |
| **Complexity** | complex |

---

## Fundamentacao

Retrofeed e o mecanismo que fecha o loop: dados de performance alimentam decisoes futuras. Sem retrofeed, cada sprint comeca do zero — os mesmos erros se repetem e as mesmas descobertas sao feitas. O retrofeed estruturado direciona cada agente com insights especificos para sua funcao. Referencia: Deming cycle (PDCA) applied to content — Plan, Do, Check, Act.

---

## Steps

### Step 1: Compilar Insights para Radar
O que o Radar deve monitorar diferente? Quais sinais geraram melhor conteudo? Quais fontes foram mais valiosas? Quais temas trending tiveram performance real? Recalibrar: thresholds de temperatura, fontes prioritarias, keywords.

### Step 2: Compilar Insights para North
O que North deve planejar diferente? Quais pilares performam melhor? Que proporcao de mix ideal baseado em dados reais? Quais formatos priorizar? Que cadencia funciona melhor?

### Step 3: Compilar Insights para Arc
O que Arc deve produzir diferente? Quais hooks funcionam? Quais CTAs convertem? Qual profundidade ideal por formato? Quais Espinhas Dorsais mais fortes? Padroes de escrita de top performers.

### Step 4: Compilar Insights para Index
Os standards de qualidade estao calibrados? O score pre-pub prediz performance real? Quais criterios de qualidade precisam recalibracao?

### Step 5: Formatar como Pacote de Retrofeed
Cada agente recebe: 3-5 insights com dado de suporte, acao recomendada, e prioridade (alta/media/baixa). O pacote e atomico — cada agente consome apenas seu bloco.

### Step 6: Handoff

```yaml
handoff:
  artifact: "retrofeed-{period}.md"
  context: "Retrofeed gerado: {R} insights para Radar, {N} para North, {A} para Arc, {I} para Index"
  next: "Distribuido para Radar, North, Arc, Index para incorporar no proximo ciclo"
```
