---
task: define-posting-schedule
responsavel: "@platform-specialist"
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

# Task: Define Posting Schedule

> Definir horarios e frequencia otimizados de publicacao por plataforma.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Co-agents** | content-analyst (Lens) |
| **Trigger** | Setup de projeto ou otimizacao trimestral |
| **Input** | Dados de audiencia, analytics por plataforma, benchmarks do setor |
| **Output** | Schedule de publicacao por plataforma com horarios e frequencia |
| **Handoff** | → create-editorial-calendar (North) |
| **Complexity** | medium |

---

## Fundamentacao

Publicar no horario certo pode dobrar o alcance. Cada plataforma tem horarios de pico diferentes, e cada audiencia tem padroes unicos. Dados proprios sempre prevalecem sobre benchmarks genericos. O schedule deve ser testado e ajustado continuamente. Referencia: Sprout Social — best times to post research, Buffer — scheduling experiments.

---

## Steps

### Step 1: Analisar Dados Proprios
Se ha historico: identificar horarios de melhor performance por plataforma. Metricas: alcance, engajamento, cliques. Dados proprios > benchmarks genericos.

### Step 2: Aplicar Benchmarks do Setor
Se sem historico: usar benchmarks. Instagram: 10-11h e 14-15h (dias uteis). LinkedIn: 8-9h e 17-18h (ter-qui). TikTok: 19-21h. Blog: segunda e quinta. Ajustar por timezone da audiencia.

### Step 3: Definir Frequencia por Plataforma
Frequencia sustentavel > frequencia ideal. Se a equipe produz 3 posts/semana com qualidade, nao planejar 7. Qualidade e consistencia > volume.

### Step 4: Criar Calendario Semanal
Grid: plataforma x dia x horario. Visualizar distribuicao para evitar conflitos (2 plataformas no mesmo horario competem por atencao da equipe).

### Step 5: Definir Cadencia de Teste
A cada 30 dias: testar 1 variacao de horario por plataforma. Medir por 2 semanas. Ajustar se melhoria > 10%.

### Step 6: Handoff

```yaml
handoff:
  artifact: "posting-schedule-{client}.md"
  context: "Schedule definido: {N} plataformas, {T} publicacoes/semana total, horarios otimizados"
  next: "create-editorial-calendar (North) para incorporar schedule"
```
