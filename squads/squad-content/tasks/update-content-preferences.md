---
task: update-content-preferences
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

# Task: Update Content Preferences

> Atualizar preferencias de conteudo do cliente baseado em feedback e aprendizados.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-governor (Index) |
| **Co-agents** | content-analyst (Lens) |
| **Trigger** | Feedback do cliente, analise de performance, revisao mensal |
| **Input** | Feedback do cliente, metricas de performance, padroes identificados |
| **Output** | Arquivo de preferencias atualizado com novos aprendizados |
| **Handoff** | → todos os agentes (preferencias sao referencia transversal) |
| **Complexity** | simple |

---

## Fundamentacao

O sistema deve aprender e evoluir com cada interacao. Preferencias de conteudo sao o mecanismo de auto-aprendizado: o que o cliente gosta, o que a audiencia responde, o que nao funciona. Documentar preferencias previne que os mesmos erros se repitam e que as mesmas descobertas sejam feitas repetidamente. Referencia: Quality Rule 3 do Sinapse Quality Framework — auto-learning preferences.

---

## Steps

### Step 1: Coletar Sinais de Preferencia
Fontes: feedback direto do cliente ("adorei esse formato"), metricas (top performers consistentes), padroes de rejeicao (o que e recusado repetidamente), feedback da audiencia (comentarios recorrentes).

### Step 2: Categorizar Preferencia
Tipo: TOM (cliente prefere mais formal/informal), FORMATO (carrosseis > reels), TEMA (pilar X performa melhor), VISUAL (cores quentes > frias), TIMING (publicar de manha > noite), ESTILO (dados > historias).

### Step 3: Registrar com Evidencia
Cada preferencia com: fonte (feedback, dados, padrao), data, confianca (alta se multiplas fontes concordam, baixa se baseado em 1 instancia).

### Step 4: Distribuir para Agentes
Atualizar arquivo de preferencias acessivel por todos os agentes. Arc usa para calibrar escrita, North usa para planejamento, Morph usa para adaptacao.

### Step 5: Revisar Periodicamente
Preferencias podem mudar. Revisao mensal: alguma preferencia foi contradita por dados recentes? Alguma nova preferencia surgiu? Atualizar ou remover conforme necessario.

### Step 6: Handoff

```yaml
handoff:
  artifact: "content-preferences-{client}-updated.md"
  context: "Preferencias atualizadas: {N} novas, {M} modificadas, {R} removidas"
  next: "Distribuido para todos os agentes como referencia transversal"
```
