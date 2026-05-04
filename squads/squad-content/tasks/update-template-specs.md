---
task: update-template-specs
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

# Task: Update Template Specs

> Atualizar especificacoes de Template Contract existente quando plataformas mudam regras.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Co-agents** | content-governor (Index) |
| **Trigger** | Mudanca de specs da plataforma ou feedback de performance |
| **Input** | Template Contract atual, novas specs, dados de performance |
| **Output** | Template Contract atualizado com changelog |
| **Handoff** | → content-governor (Index) para atualizar enforcement |
| **Complexity** | simple |

---

## Fundamentacao

Plataformas mudam specs constantemente: Instagram muda limites de caracteres, LinkedIn altera formato de carrossel, TikTok atualiza duracoes. Template Contracts desatualizados geram conteudo fora de spec — que pode ser cortado, mal renderizado ou subotimizado. Atualizacao proativa evita problemas reativos.

---

## Steps

### Step 1: Identificar Mudanca
Qual spec mudou? Fonte da mudanca (comunicado oficial, observacao pratica, feedback de performance)?

### Step 2: Avaliar Impacto
Quantos Template Contracts sao afetados? Quanto conteudo em producao precisa ser ajustado? Prioridade: alto impacto (muitos TCs afetados) > baixo impacto.

### Step 3: Atualizar Template Contract
Modificar campos afetados. Adicionar entry no changelog do TC: data, mudanca, motivo, impacto.

### Step 4: Notificar Pipeline
Comunicar mudanca para Arc (producao) e Index (validacao). Conteudo em producao pode precisar de ajuste.

### Step 5: Handoff

```yaml
handoff:
  artifact: "template-contract-{identificador}-updated.yaml"
  context: "TC atualizado: '{identificador}', {N} campos alterados, changelog registrado"
  next: "content-governor (Index) para atualizar regras de enforcement"
```
