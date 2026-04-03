# Visao Geral da Arquitetura

> Arquitetura de alto nivel do SINAPSE-AI para novos contribuidores e usuarios.

---

## Diagrama do Sistema

```
+------------------------------------------------------------------+
|                        SINAPSE-AI Framework                       |
|                                                                   |
|  +--------------------+    +----------------------------------+   |
|  |    Constitution     |    |        SYNAPSE Engine            |   |
|  |  (10 artigos)       |    |  (Pipeline de Contexto L0-L7)   |   |
|  |  NON-NEGOTIABLE (6) |    |                                  |   |
|  |  MUST (4)           |    |  L0: Agent Definition            |   |
|  +--------------------+    |  L1: Dependencies                 |   |
|                             |  L2: Project Config               |   |
|  +--------------------+    |  L3: Story Context                |   |
|  |    Hook System      |    |  L4: Session State               |   |
|  |  Pre-commit hooks   |    |  L5: Memory                      |   |
|  |  Pre-push hooks     |    |  L6: Enrichment                  |   |
|  |  Validation gates   |    |  L7: Compaction                  |   |
|  +--------------------+    +----------------------------------+   |
|                                                                   |
|  +------------------------------------------------------------+  |
|  |                    Agent Ecosystem                          |  |
|  |                                                              |  |
|  |  Core (12 agentes)          Squads (18 dominios)            |  |
|  |  +--------+  +--------+    +--------+  +--------+          |  |
|  |  | Pixel  |  | Litmus |    | Brand  |  | Growth |  ...     |  |
|  |  | (dev)  |  | (qa)   |    | Squad  |  | Squad  |          |  |
|  |  +--------+  +--------+    +--------+  +--------+          |  |
|  |  +--------+  +--------+    163 especialistas               |  |
|  |  |Stratum |  |Pipeline|    em 18 squads tematicos           |  |
|  |  | (arch) |  |(devops)|                                     |  |
|  |  +--------+  +--------+                                     |  |
|  +------------------------------------------------------------+  |
|                                                                   |
|  +------------------------------------------------------------+  |
|  |                    Quality Gates                            |  |
|  |  Pre-commit (hooks) → PR Automation (CI) → Human Review    |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

---

## Conceitos Fundamentais

### Agentes

Agentes sao personas especializadas com expertise, comandos e responsabilidades definidas. Cada agente opera dentro de um escopo de autoridade exclusivo.

- **12 agentes core** cobrem o ciclo completo de desenvolvimento de software
- **163 agentes em 18 squads** expandem para dominios especializados
- Cada agente tem persona (nome, estilo), comandos (`*help`, `*task`) e dependencias

Ativacao: `@agent-name` ou `/SINAPSE:agents:agent-name`

### Squads

Squads sao agrupamentos tematicos de agentes especialistas, cada um com um orquestrador (*-orqx) que coordena o trabalho interno.

Exemplos: squad-brand (branding), squad-growth (SEO/analytics), squad-cybersecurity (seguranca).

### Tasks

Tasks sao procedimentos passo-a-passo escritos em linguagem natural (markdown). Definem inputs, outputs, pre/post-conditions e modos de execucao. Tasks sao a unidade atomica de trabalho --- agentes sao executores de tasks.

Localizacao: `.sinapse-ai/development/tasks/`

### Workflows

Workflows conectam tasks em sequencias. O SINAPSE tem 4 workflows primarios (detalhados em [workflows-overview.md](guides/workflows-overview.md)):

1. **Story Development Cycle (SDC)** --- fluxo principal de desenvolvimento
2. **QA Loop** --- ciclo iterativo de revisao-correcao
3. **Spec Pipeline** --- transformacao de requisitos em especificacao
4. **Brownfield Discovery** --- avaliacao de divida tecnica

### Constitution

10 artigos que governam o comportamento de todos os agentes. 6 sao NON-NEGOTIABLE (enforcement automatico via gates), 4 sao MUST (obrigatorios mas sem gate automatico).

Detalhes: `.sinapse-ai/constitution.md`

### Hooks

Scripts executados automaticamente em momentos especificos (pre-commit, pre-push, pre-tool-use). Implementam o enforcement deterministico dos artigos constitucionais.

Detalhes: `.claude/rules/hook-governance.md`

---

## Modelo de 4 Camadas (Boundary Model)

O SINAPSE separa artefatos em 4 camadas com mutabilidade crescente:

```
+------------------------------------------+
|  L1: Framework Core (NEVER modify)       |
|  .sinapse-ai/core/, constitution.md,     |
|  bin/sinapse.js, bin/sinapse-init.js      |
+------------------------------------------+
|  L2: Framework Templates (NEVER modify)  |
|  tasks/, templates/, checklists/,        |
|  workflows/, infrastructure/             |
+------------------------------------------+
|  L3: Project Config (Mutable)            |
|  .sinapse-ai/data/, core-config.yaml,    |
|  agents/*/MEMORY.md                      |
+------------------------------------------+
|  L4: Project Runtime (ALWAYS modify)     |
|  docs/stories/, packages/, squads/,      |
|  tests/                                  |
+------------------------------------------+
```

| Camada | Mutabilidade | Quem edita |
|--------|-------------|------------|
| L1 Core | NUNCA | Apenas framework maintainers |
| L2 Templates | NUNCA | Extend-only (criar novos, nao editar existentes) |
| L3 Config | Com restricoes | Projeto e agentes |
| L4 Runtime | SEMPRE | Todo trabalho de projeto acontece aqui |

**Toggle:** `core-config.yaml` → `boundary.frameworkProtection` controla se deny rules estao ativas.

---

## Fluxo de Ativacao de Agentes

Quando um usuario ativa um agente (`@developer`), o seguinte pipeline executa:

```
1. Usuario digita @developer
        |
        v
2. SYNAPSE Engine detecta ativacao
        |
        v
3. Pipeline de Contexto (8 camadas L0-L7)
   L0: Carrega definicao do agente (persona, comandos)
   L1: Resolve dependencias (tasks, templates)
   L2: Carrega config do projeto (core-config.yaml)
   L3: Injeta contexto da story ativa (se houver)
   L4: Restaura estado da sessao
   L5: Carrega memoria do agente
   L6: Enriquece com dados contextuais
   L7: Compacta para caber na janela de contexto
        |
        v
4. Greeting personalizado exibido
        |
        v
5. Agente HALT --- aguarda comando do usuario
```

O agente NAO executa nenhuma acao automaticamente apos ativacao. Ele apresenta o greeting e aguarda.

---

## SYNAPSE Context Engine

O SYNAPSE e o motor que injeta contexto relevante na janela de cada agente. Opera em 8 camadas:

| Camada | Nome | Conteudo |
|--------|------|----------|
| L0 | Agent Definition | Persona, comandos, expertise |
| L1 | Dependencies | Tasks, templates, checklists necessarios |
| L2 | Project Config | core-config.yaml, tech preferences |
| L3 | Story Context | Story ativa, acceptance criteria, progresso |
| L4 | Session State | Agente ativo, contador de prompts |
| L5 | Memory | Memoria persistente do agente |
| L6 | Enrichment | Dados adicionais (git status, project status) |
| L7 | Compaction | Reducao para caber na janela de contexto |

**Diagnostico:** `npx sinapse-ai doctor` verifica a saude do pipeline.

---

## Quality Gates (3 Camadas)

O SINAPSE implementa qualidade em 3 camadas progressivas:

### Camada 1: Pre-Commit (Local)

Hooks executam automaticamente antes de cada commit:

- `enforce-story-gate.cjs` --- exige story valida
- `enforce-architecture-first.cjs` --- exige docs antes de codigo protegido
- `sql-governance.py` --- bloqueia SQL inseguro
- `enforce-git-push-authority.sh` --- restringe push a @devops

### Camada 2: PR Automation (CI)

Apos push, automacoes de CI executam:

- **CodeRabbit** --- review automatizado de codigo
- **GitHub Actions** --- lint, typecheck, testes
- **Dependabot** --- verificacao de dependencias
- **CodeQL** --- analise de seguranca

### Camada 3: Human Review

Apos automacoes passarem:

- @quality-gate (Litmus) executa QA gate com 7 checks
- Reviewer humano aprova o PR
- Merge so ocorre apos aprovacao

```
Commit → Hooks (BLOCK/PASS) → Push → CI (BLOCK/PASS) → Review → Merge
```

---

## Como Tudo se Conecta

O SINAPSE e um meta-framework de linguagem natural. Nao contem codigo de aplicacao --- contem instrucoes em markdown que agentes de IA seguem para construir software.

**O ciclo completo:**

1. **Usuario descreve o que quer** (em linguagem natural)
2. **Imperator** (orquestrador principal) diagnostica e delega
3. **@sprint-lead (Sync)** cria a story documentando o trabalho
4. **@product-lead (Axis)** valida a story (10 criterios)
5. **@developer (Pixel)** implementa seguindo a story
6. **@quality-gate (Litmus)** verifica qualidade (7 checks)
7. **@devops (Pipeline)** faz push e cria PR
8. **CI + Review** garantem qualidade antes do merge
9. **Constitution + Hooks** garantem que nenhuma etapa foi pulada

Cada etapa e rastreavel, documentada e verificavel. O sistema e desenhado para que erros sejam detectados o mais cedo possivel --- idealmente antes de qualquer codigo ser escrito.

---

_Veja tambem: [Agent Reference](guides/agent-reference.md) | [Workflows Overview](guides/workflows-overview.md) | [Guiding Principles](guiding-principles.md)_
