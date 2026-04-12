---
task: organize-content-archive
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

# Task: Organize Content Archive

> Organizar e manter o arquivo de conteudo com taxonomia e metadados.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-governor (Index) |
| **Trigger** | Pos-publicacao (rotina) ou pos-auditoria |
| **Input** | Conteudo publicado, taxonomia, metadados de performance |
| **Output** | Conteudo arquivado com classificacao, tags e metadados |
| **Handoff** | → disponivel para consulta por todos os agentes |
| **Complexity** | simple |

---

## Fundamentacao

O arquivo e a memoria institucional do conteudo. Conteudo bem arquivado pode ser reaproveitado, atualizado, atomizado. Conteudo perdido em pastas e conteudo que sera recriado do zero — desperdicio. Referencia: content operations — asset management.

---

## Steps

### Step 1: Classificar Conteudo Publicado
Aplicar taxonomia: categoria primaria, tags secundarias, formato, plataforma, data, status.

### Step 2: Adicionar Metadados de Performance
Para cada peca: metricas-chave na data de arquivo. Permite analise historica e identificacao de padroes.

### Step 3: Vincular a Pilares e Campanhas
Cada peca linkada ao pilar editorial, sprint de origem, e campanha (se aplicavel). Permite rastreabilidade completa.

### Step 4: Manter Arquivo Atualizado
Rotina pos-publicacao: cada peca nova e automaticamente classificada e arquivada. Nenhuma peca fica "solta" sem classificacao.

### Step 5: Handoff

```yaml
handoff:
  artifact: "archive-update-{date}.md"
  context: "Arquivo atualizado: {N} pecas novas classificadas, total {T} no arquivo"
  next: "Disponivel para consulta por todos os agentes do squad"
```
