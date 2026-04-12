---
task: update-brand-preferences
responsavel: "@brand-auditor"
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

# Task: Update Brand Preferences Log

> Atualizar o registro de preferencias do projeto apos cada ciclo de aprovacao para alimentar auto-learning progressivo.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-auditor (Sentinel) |
| **Co-agents** | Todos os agents que participaram do ciclo de aprovacao |
| **Trigger** | Apos CADA ciclo de aprovacao do cliente (discovery, identity, collateral, etc.) |
| **Input** | Feedback do cliente, opcoes apresentadas, opcoes aceitas/rejeitadas, comentarios |
| **Output** | `preferences/{projeto}-preferences.md` atualizado |
| **Handoff** | → Todos os agents do squad (para referencia em proximas entregas) |
| **Complexity** | simple |

---

## Fundamentacao

Auto-learning e um diferenciador critico entre uma squad que "faz tasks" e uma squad que "evolui com o uso". Cada decisao de aprovacao/rejeicao do cliente contem informacao valiosa sobre:
- Preferencias esteticas
- Padroes de decisao
- Red flags a evitar
- Expectativas nao verbalizadas

Documentar isso sistematicamente reduz rodadas de revisao, aumenta acertos na primeira entrega, e cria inteligencia cumulativa por projeto e por perfil de cliente.

---

## Steps

### Step 1: Coletar Dados do Ciclo

Apos aprovacao/rejeicao de entregaveis, registrar:

| Dado | O que capturar |
|------|---------------|
| **Opcoes apresentadas** | Todas as alternativas oferecidas |
| **Opcoes aceitas** | O que o cliente aprovou |
| **Opcoes rejeitadas** | O que o cliente recusou |
| **Feedback verbatim** | Palavras exatas do cliente (nao interpretar) |
| **Motivo de rejeicao** | Por que rejeitou (se declarado) |
| **Numero de rodadas** | Quantas iteracoes ate aprovacao |
| **Tempo de decisao** | Quanto tempo levou para decidir |
| **Quem decidiu** | Se houve consulta a terceiros |

### Step 2: Identificar Padroes

Analisar dados coletados buscando:

| Padrao | Pergunta |
|--------|---------|
| **Estetico** | Que estilo visual e consistentemente preferido? |
| **Tonal** | Que tom de comunicacao e aceito vs rejeitado? |
| **Decisorio** | Como o cliente decide? (rapido/lento, visual/textual, solo/grupo) |
| **Prioridade** | O que o cliente prioriza? (estetica, funcionalidade, diferenciacao, seguranca) |
| **Aversao** | O que o cliente consistentemente rejeita? |

### Step 3: Atualizar Preference Log

Abrir `preferences/{projeto}-preferences.md` e atualizar:

- [ ] Secao de preferencias visuais (cores, tipografia, estilo)
- [ ] Secao de preferencias estrategicas (tom, posicionamento)
- [ ] Padroes de decisao do cliente
- [ ] Historico de revisoes (nova entrada)
- [ ] Score de alinhamento (recalcular metricas)
- [ ] Insights (se novos padroes emergiram)

### Step 4: Comunicar Insights ao Squad

Apos atualizacao, comunicar insights relevantes:

```yaml
communication:
  to_all_agents:
    summary: "Preference log atualizado para {projeto}"
    key_insights:
      - "{insight 1 — ex: cliente prefere paletas dessaturadas}"
      - "{insight 2 — ex: rejeita tipografias script}"
    action_required: "Considerar nas proximas entregas"
```

### Step 5: Calcular Score de Evolucao

| Metrica | Calculo | Meta |
|---------|---------|------|
| Taxa de acerto first-try | Entregas aceitas sem revisao / total | ≥60% (melhoria progressiva) |
| Reducao de rodadas | Media de rodadas atual vs media anterior | Tendencia de queda |
| Velocidade de decisao | Tempo medio de aprovacao | Tendencia de queda |

### Step 6: Handoff

```yaml
handoff:
  artifact: "preferences/{projeto}-preferences.md"
  context: "Preference log atualizado com dados do ciclo {fase}"
  broadcast: true
  next: "Todos os agents devem consultar preference log antes de iniciar proxima entrega"
```
