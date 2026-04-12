---
task: map-signal-to-pillar
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

# Task: Map Signal to Pillar

> Conectar sinais detectados aos pilares editoriais do cliente para garantir relevancia.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | signal-intelligence (Radar) |
| **Trigger** | Apos classificacao de temperatura |
| **Input** | Sinal classificado, pilares editoriais definidos por North |
| **Output** | Sinal mapeado para pilar + estagio de funil |
| **Handoff** | → curate-weekly-briefing ou editorial-strategist (North) |
| **Complexity** | simple |

---

## Fundamentacao

Sinal sem conexao com pilar editorial e ruido — gera conteudo off-brand. O mapeamento forca disciplina: se o sinal nao conecta com nenhum pilar, ou o sinal e irrelevante, ou os pilares estao incompletos. Em ambos os casos, o sistema se auto-corrige.

---

## Steps

### Step 1: Identificar Pilar
Para cada sinal: qual pilar editorial e mais relevante? Se nenhum pilar conecta, descartar ou flag como possivel gap nos pilares.

### Step 2: Identificar Estagio de Funil
O sinal gera conteudo de: TOPO (awareness, alcance), MEIO (autoridade, educacao), FUNDO (conversao, CTA)?

### Step 3: Sugerir Formato
Baseado no pilar + funil + plataforma: qual formato ideal? Carrossel para educativo, Reel para awareness, blog para autoridade, thread para opinion.

### Step 4: Handoff

```yaml
handoff:
  artifact: "signal-mapping"
  context: "Sinal '{sinal}' → Pilar: {pilar}, Funil: {estagio}, Formato sugerido: {formato}"
  next: "curate-weekly-briefing para compilacao"
```
