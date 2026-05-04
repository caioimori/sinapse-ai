---
task: process-content-rejection
responsavel: "@content-governor"
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

# Task: Process Content Rejection

> Processar rejeicao de conteudo com feedback estruturado e rastreamento de padroes.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-governor (Index) |
| **Co-agents** | content-engineer (Arc) |
| **Trigger** | Conteudo reprovado em qualquer gate de qualidade |
| **Input** | Conteudo rejeitado, motivos de rejeicao, historico de rejeicoes |
| **Output** | Feedback estruturado + analise de padrao de rejeicao |
| **Handoff** | → content-engineer (Arc) para revisao |
| **Complexity** | simple |

---

## Fundamentacao

Rejeicao sem feedback e desperdicio. Cada rejeicao e uma oportunidade de aprendizado: por que falhou? E um padrao recorrente? O sistema precisa de ajuste? A rejeicao estruturada gera dados que alimentam o ciclo de melhoria. Referencia: feedback loops em quality management systems.

---

## Steps

### Step 1: Documentar Motivo de Rejeicao
Categorizar: TC violation, brand inconsistency, quality below threshold, compliance risk, originality issue. Ser especifico: nao "qualidade baixa" — mas "TESE vaga, score 3/10 em especificidade".

### Step 2: Fornecer Feedback Acionavel
Para cada motivo: o que precisa mudar? Sugestao concreta. "Hook generico — reescrever com dado especifico ou pergunta provocativa."

### Step 3: Analisar Padrao
Esta rejeicao e recorrente? Mesmo tipo de erro aparece frequentemente? Se sim: flag para ajuste sistêmico (melhorar brief, recalibrar TC, treinar equipe).

### Step 4: Rastrear Metricas de Rejeicao
Taxa de rejeicao por agente, por formato, por pilar. Taxa saudavel: 10-20%. Muito baixa (0-5%): standards provavelmente frouxos. Muito alta (>30%): briefs provavelmente inadequados.

### Step 5: Handoff

```yaml
handoff:
  artifact: "rejection-feedback-{peca}.md"
  context: "Rejeitado: motivo '{motivo}', feedback acionavel fornecido, padrao {recorrente/novo}"
  next: "content-engineer (Arc) para revisao com feedback"
```
