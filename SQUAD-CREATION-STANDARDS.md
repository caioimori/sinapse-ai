# Squad Creation Standards — Sinapse

> Guia definitivo para criar squads de IA com qualidade maxima.
> Todas as regras e padroes aqui documentados foram extraidos da experiencia de criar 9 squads
> (~1,030 arquivos) e da auditoria completa de qualidade.

---

## 1. Estrutura de Diretorios (Obrigatoria)

```
squad-{nome}/
├── squad.yaml              # Manifesto (OBRIGATORIO)
├── agents/                 # Definicoes de agentes (.md)
├── tasks/                  # Tarefas executaveis (.md)
├── workflows/              # Workflows multi-step (.yaml)
├── knowledge-base/         # Knowledge bases (.md) — SINGULAR, nao "knowledge-bases"
├── checklists/             # Checklists de validacao (.md)
├── templates/              # Templates reutilizaveis (.md)
└── preferences/            # Preferencias do squad (opcional)
```

### Regras de Naming
- **Diretorio do squad:** `squad-{nome-em-kebab-case}` (ex: `squad-brand`)
- **Arquivos:** SEMPRE kebab-case (`define-brand-positioning.md`, NAO `defineBrandPositioning.md`)
- **Knowledge base:** SEMPRE `knowledge-base/` (SINGULAR)
- **Regex de validacao:** `/^[a-z0-9]+(-[a-z0-9]+)*$/`

---

## 2. squad.yaml — Manifesto (Formato Obrigatorio)

```yaml
name: squad-{nome}                    # kebab-case, 2-50 chars
version: "1.0.0"                      # SEMVER obrigatorio (NAO "1.0")
description: >
  Descricao completa do squad.
author: Caio Imori
license: UNLICENSED
slashPrefix: {prefixo}                # Prefixo para comandos slash

sinapse:
  minVersion: "1.0.0"
  type: squad

metadata:
  created_at: "YYYY-MM-DD"
  updated_at: "YYYY-MM-DD"
  created_by: "squad-creator (Craft)"
  agents_count: N
  tasks_count: N
  knowledge_bases_count: N
  workflows_count: N
  checklists_count: N
  templates_count: N

# Agents (listar todos)
agents:
  - id: agent-id
    name: PersonaName
    file: agents/agent-id.md
    role: "Descricao do papel"
    tasks:
      - task-name-1
      - task-name-2

# Knowledge bases
knowledge_bases:
  - name: kb-name
    file: knowledge-base/kb-name.md   # SINGULAR: knowledge-base/
    description: "..."

# Workflows
workflows:
  - name: workflow-name
    file: workflows/workflow-name.yaml
    description: "..."

# Checklists
checklists:
  - name: checklist-name
    file: checklists/checklist-name.md

# Templates
templates:
  - name: template-name
    file: templates/template-name.md
```

### Campos OBRIGATORIOS no squad.yaml
| Campo | Tipo | Regra |
|-------|------|-------|
| `name` | string | kebab-case, 2-50 chars |
| `version` | string | Semver (ex: "1.0.0") |
| `description` | string | Descricao clara |
| `sinapse.minVersion` | string | Minimo "1.0.0" |
| `sinapse.type` | string | "squad" |
| `author` | string | Nome do criador |
| `slashPrefix` | string | Prefixo de comando |

---

## 3. Tasks — TASK-FORMAT-SPECIFICATION-V1

**TODA task DEVE ter frontmatter YAML com 7 campos obrigatorios:**

```yaml
---
task: nome-da-task                     # kebab-case, mesmo que o filename
responsavel: "@agent-id"              # ID do agente (NAO persona name)
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

# Task: Nome da Task

## Metadata
- **Agent:** agent-id (PersonaName)
- **Squad:** squad-nome
- **Complexity:** STANDARD | HIGH | CRITICAL
...
```

### ERROS COMUNS a evitar
| Erro | Correto |
|------|---------|
| `responsavel: "@Convert"` (persona) | `responsavel: "@ga-cro-specialist"` (agent ID) |
| Sem frontmatter YAML | SEMPRE incluir os 7 campos |
| `elicit: true` sem formato | Se elicit=true, definir formato de interacao |
| Filename PascalCase | SEMPRE kebab-case |

### Convencao de Nomes de Task
- Prefixar com verbo de acao: `define-`, `create-`, `analyze-`, `build-`, `execute-`
- Agente-especifica: `{agent-prefix}-{action}-{object}` (ex: `ga-cro-run-ab-test`)
- Generica: `{action}-{object}` (ex: `define-brand-positioning`)

---

## 4. Agents — Formato

### Campos Essenciais (obrigatorios)
| Campo | Descricao |
|-------|-----------|
| Name/Persona | Nome humano do agente |
| ID | Identificador kebab-case unico no squad |
| Icon | Emoji representativo |
| Role | Descricao do papel |
| Core Principles | 3-6 principios norteadores |
| Responsibilities | Lista de responsabilidades |

### Formato Aceito: Markdown com Headers

```markdown
# Agent: PersonaName — Role Title

## Identidade
- **ID:** agent-id
- **Nome:** PersonaName
- **Icon:** EMOJI
- **Arquetipo:** ArchetypeName
- **Squad:** squad-nome

## Role
Descricao completa do papel.

## Principios
1. Principio 1
2. Principio 2

## Responsabilidades
- Responsabilidade 1
- Responsabilidade 2

## Delegacao
| Tarefa | Delegar para |
|--------|-------------|
| ... | ... |

## Cross-Squad Handoffs
...
```

### Formato Aceito: YAML Code Block (mais machine-parseable)

```markdown
# agent-id — PersonaName

\`\`\`yaml
agent:
  name: "PersonaName"
  id: "squad-name/agent-id"
  title: "Role Title"
  icon: "EMOJI"

persona:
  role: "Descricao do papel"
  core_principles:
    - "Principio 1"
    - "Principio 2"
\`\`\`
```

---

## 5. Knowledge Bases — Formato

- Diretorio: `knowledge-base/` (SINGULAR)
- Formato: Markdown (.md)
- Conteudo: Frameworks, metodologias, referencias, patterns
- Deve incluir: fontes academicas, autores referencia, exemplos praticos
- Naming: kebab-case descritivo (`research-frameworks-encyclopedia.md`)

---

## 6. Workflows — Formato

```yaml
name: workflow-name
description: "Descricao"
trigger: "Quando este workflow e acionado"
agents_involved:
  - agent-id-1
  - agent-id-2

phases:
  - name: "Phase 1: Nome"
    agent: agent-id
    tasks:
      - task-name-1
    output: "artifact-name.md"
    quality_gate: "Criterios de qualidade"

  - name: "Phase 2: Nome"
    agent: agent-id-2
    depends_on: ["Phase 1"]
    tasks:
      - task-name-2
```

---

## 7. Metricas de Qualidade Minimas

| Metrica | Minimo | Ideal |
|---------|--------|-------|
| Agents | 6 | 7-12 |
| Tasks | 50 | 65-100 |
| Workflows | 3 | 6 |
| Knowledge Bases | 8 | 9-17 |
| Checklists | 2 | 3 |
| Templates | 3 | 5-7 |
| Tasks por agent (media) | 2 | 8-12 |

---

## 8. Cross-Squad Integration

Todo squad deve documentar:

1. **Inbound handoffs:** O que recebe de outros squads
2. **Outbound handoffs:** O que entrega para outros squads
3. **Shared knowledge bases:** KBs que servem como ponte

### Exemplo de Handoff no Agent
```yaml
cross_squad_handoffs:
  inbound:
    - from: squad-research
      artifact: "research-report.md"
      when: "Pesquisa concluida"
  outbound:
    - to: squad-content
      artifact: "brand-guidelines.md"
      when: "Guidelines finalizadas"
```

---

## 9. Checklist Pre-Publicacao

- [ ] `squad.yaml` tem TODOS os campos obrigatorios
- [ ] `version` em formato semver (X.Y.Z)
- [ ] `sinapse` section com minVersion e type
- [ ] TODOS os tasks tem frontmatter YAML com 7 campos
- [ ] `responsavel` usa agent ID (NAO persona name)
- [ ] Diretorio `knowledge-base/` (SINGULAR)
- [ ] TODOS os filenames em kebab-case
- [ ] Minimo 6 agents, 50 tasks, 3 workflows, 8 KBs
- [ ] Cross-squad handoffs documentados
- [ ] Cada agent tem: name, ID, icon, role, principles
- [ ] Workflows referenciam tasks e agents existentes
- [ ] Knowledge bases tem fontes e referencias

---

## 10. Mapa dos 9 Squads Existentes

| # | Squad | Agents | Tasks | Workflows | KBs | Total |
|---|-------|--------|-------|-----------|-----|-------|
| 01 | squad-brand | 12 | 91 | 4 | 17 | 136 |
| 02 | squad-content | 7 | 90 | 6 | 15 | 130 |
| 03 | squad-research | 7 | 72 | 6 | 12 | 108 |
| 04 | squad-copy | 7 | 68 | 6 | 11 | 104 |
| 05 | squad-design | 8 | 101 | 6 | 11 | 138 |
| 06 | squad-growth | 7 | 72 | 6 | 9 | 105 |
| 07 | squad-commercial | 7 | 66 | 6 | 9 | 99 |
| 08 | squad-product | 7 | 75 | 6 | 9 | 107 |
| 09 | squad-operations-hub | 7 | 70 | 6 | 9 | 102 |
| **TOTAL** | **9 squads** | **69** | **705** | **52** | **102** | **~1,029** |

---

*Documento criado em 2026-03-15. Baseado na auditoria completa dos 9 squads.*
