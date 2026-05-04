---
task: scan-daily-signals
responsavel: "@signal-intelligence"
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

# Task: Scan Daily Signals

> Varredura diaria de sinais em todas as fontes configuradas para o cliente.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | signal-intelligence (Radar) |
| **Co-agents** | — |
| **Trigger** | Diario (matinal) |
| **Input** | Fontes configuradas (configure-signal-sources), pilares editoriais |
| **Output** | Log de sinais do dia, classificados por temperatura |
| **Handoff** | → classify-signal-temperature, alert-opportunity-windows (se HOT) |
| **Complexity** | medium |

---

## Fundamentacao

Deteccao diaria e a base da inteligencia de conteudo. Sinais time-sensitive perdem valor a cada hora. Varredura matinal sistematica garante que nenhuma oportunidade escapa e que o pipeline tem combustivel fresco diariamente. Referencia: Contently micro-trend AI — deteccao precoce como vantagem competitiva.

---

## Steps

### Step 1: Varrer Fontes Primarias
Percorrer fontes configuradas: redes sociais (trending, hashtags, mentions), portais de noticias do setor, newsletters recebidas, Google Trends.

### Step 2: Varrer Fontes Secundarias
Verificar: ferramentas de analytics (BuzzSumo, SparkToro), foruns (Reddit, comunidades), podcasts/YouTube recentes do nicho.

### Step 3: Filtrar por Relevancia
Para cada sinal detectado: conecta com algum pilar editorial? E relevante para o setor do cliente? Descartar ruido.

### Step 4: Classificar Temperatura
Aplicar classificacao: HOT (janela < 24h, SPV alto), WARM (janela 7d, SPV moderado), COLD (evergreen, SPV baixo). Usar classify-signal-temperature se necessario.

### Step 5: Registrar e Encaminhar
Registrar todos os sinais no log diario. Se HOT: alerta imediato para Nexus via alert-opportunity-windows.

### Step 6: Handoff

```yaml
handoff:
  artifact: "daily-signal-log-{date}.md"
  context: "Scan diario completo: {N} sinais detectados ({HOT}/{WARM}/{COLD})"
  next: "content-orqx (Nexus) se HOT, acumular para curate-weekly-briefing se WARM"
```
