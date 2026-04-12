---
task: triage-urgent-signal
responsavel: "@content-orqx"
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

# Task: Triage Urgent Signal

> Protocolo fast-track para sinais HOT com bypass controlado do pipeline normal.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-orqx (Nexus) |
| **Co-agents** | signal-intelligence (Radar), content-engineer (Arc), content-governor (Index) |
| **Trigger** | Alerta HOT do Radar com janela de oportunidade curta |
| **Input** | Sinal HOT classificado com SPV >= 4, janela de oportunidade |
| **Output** | Conteudo publicado em < 2 horas |
| **Handoff** | → content-analyst (Lens) para monitoramento imediato |
| **Complexity** | complex |

---

## Fundamentacao

Oportunidades virais tem janela curta — um trending topic hoje e irrelevante amanha. O pipeline normal (Radar→North→Arc→Morph→Index) leva 2-5 dias, inviavel para sinais time-sensitive. O protocolo fast-track e um bypass CONTROLADO: nao elimina qualidade, comprime tempo. Referencia: Brendan Kane Hook Point — 3-second window applies to trend windows too.

---

## Steps

### Step 1: Validar Urgencia

Receber alerta HOT do Radar e validar:
- Janela de oportunidade real? (< 24h = urgente, 24-48h = acelerado, > 48h = pipeline normal)
- SPV >= 4? (se < 4, redirecionar para pipeline normal)
- Conecta com pilares editoriais? (se nao, descartar)
- Risco reputacional? (se sim, nao publicar sem revisao completa)

### Step 2: Criar Briefing Rapido

Se confirmado HOT:
- Briefing em 1 paragrafo: tema, angulo, formato, plataforma
- Espinha Dorsal express: tese + mecanismo + direcao (prova pode ser reduzida)
- Template contract a usar

### Step 3: Bypass para Arc

Enviar diretamente para Arc (skip North planning):
- Arc produz conteudo em modo fast-track
- Verificacao algoritmica mantida (nao pular)
- Contagem de caracteres mantida (nao pular)

### Step 4: QA Express

Index faz QA com checklist reduzido:
- Template contract compliance: SIM/NAO
- Brand voice: SIM/NAO
- Factual accuracy: SIM/NAO
- Se 3/3: APPROVED express

### Step 5: Publicar e Monitorar

- Publicar imediatamente
- Lens monitora performance nas primeiras 2 horas
- Se performance abaixo do esperado: avaliar se timing era correto

### Step 6: Handoff

```yaml
handoff:
  artifact: "fast-track-{signal}-{date}.md"
  context: "Conteudo urgente publicado via fast-track em {tempo} minutos"
  next: "content-analyst (Lens) para monitoramento imediato"
```
