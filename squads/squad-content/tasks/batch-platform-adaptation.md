---
task: batch-platform-adaptation
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

# Task: Batch Platform Adaptation

> Adaptar conteudo para multiplas plataformas em lote otimizando eficiencia.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Co-agents** | content-engineer (Arc) |
| **Trigger** | Conteudo pilar pronto para distribuicao multi-plataforma |
| **Input** | Conteudo original, plano de atomizacao, Template Contracts por plataforma |
| **Output** | Pecas adaptadas para todas as plataformas-alvo |
| **Handoff** | → content-governor (Index) para validacao em lote |
| **Complexity** | medium |

---

## Fundamentacao

Adaptar 1 peca para 5 plataformas individualmente e 5x o esforco. Batching de adaptacao agrupa por plataforma: todas as adaptacoes Instagram juntas, todas LinkedIn juntas. Isso mantem consistencia e reduz context switching. Referencia: Gary Vaynerchuk — content production at scale.

---

## Steps

### Step 1: Agrupar por Plataforma
Do plano de atomizacao: organizar derivados por plataforma-alvo. Processar uma plataforma por vez para manter consistencia.

### Step 2: Carregar Template Contracts
Para cada plataforma: carregar TCs relevantes. Verificar se estao atualizados antes de iniciar.

### Step 3: Adaptar em Sequencia por Plataforma
Para cada plataforma: adaptar todas as pecas daquela plataforma em sequencia. Manter tom consistente. Verificar TC por peca.

### Step 4: Cross-Check de Consistencia
Verificar: a mesma mensagem central e mantida em todas as plataformas? O tom e apropriado para cada uma? Nenhuma peca contradiz outra?

### Step 5: Compilar Entrega
Pacote completo por plataforma com todas as pecas adaptadas, prontas para publicacao.

### Step 6: Handoff

```yaml
handoff:
  artifact: "batch-adaptation-{sprint}.md"
  context: "Batch adaptado: {N} pecas para {P} plataformas, TCs validados"
  next: "content-governor (Index) para validacao em lote"
```
