<!--
  Tradução: PT-BR
  Original: /docs/guides/agent-selection-guide.md
  Última sincronização: 2026-01-29
-->

# Guia de Seleção de Agentes

> [EN](../../guides/agent-selection-guide.md) | **PT** | [ES](../../es/guides/agent-selection-guide.md)

---

## Referência Rápida para Escolher o Agente Correto

**Última Atualização:** 2026-01-29 (ADE v2.2.0)

---

## Árvore de Decisão Rápida

```
Precisa de pesquisa/análise? → @analyst
   ↓
Precisa de PRD/epic? → @pm
   ↓
Precisa de arquitetura? → @architect
   ↓
Precisa de banco de dados? → @data-engineer
   ↓
Precisa de stories? → @sm
   ↓
Precisa de implementação? → @dev
   ↓
Precisa de testes/QA? → @qa
   ↓
Precisa de deploy? → @devops
```

---

## Referência Rápida de Agentes

| Agente                       | Ícone | Use Para                                                                                                           | NÃO Use Para                                    |
| ---------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| **@analyst** (Atlas)         | 🔍    | Pesquisa de mercado, análise competitiva, brainstorming, extração de padrões                                       | Criação de PRD, arquitetura, stories            |
| **@pm** (Morgan)             | 📋    | PRD, epics, estratégia de produto, coleta de requisitos, escrita de specs                                          | Pesquisa, arquitetura, stories detalhadas       |
| **@architect** (Aria)        | 🏛️    | Arquitetura de sistema, design de API, stack tecnológica, avaliação de complexidade, planejamento de implementação | Pesquisa, PRD, schema de banco de dados         |
| **@data-engineer** (Dara)    | 📊    | Schema de banco de dados, RLS, migrations, otimização de queries                                                   | Arquitetura de app, seleção de tecnologia de BD |
| **@sm** (River)              | 🌊    | User stories, planejamento de sprint, refinamento de backlog                                                       | PRD, epics, pesquisa, implementação             |
| **@dev** (Dex)               | 💻    | Implementação de story, codificação, testes, execução de subtasks, recuperação                                     | Criação de story, deploy                        |
| **@qa** (Quinn)              | 🧪    | Code review, testes, garantia de qualidade, crítica de spec, revisão estruturada                                   | Implementação                                   |
| **@po** (Pax)                | 🎯    | Gerenciamento de backlog, critérios de aceitação, priorização                                                      | Criação de epic, arquitetura                    |
| **@ux-design-expert** (Nova) | 🎨    | Design UI/UX, wireframes, design systems                                                                           | Implementação                                   |
| **@devops** (Gage)           | ⚙️    | Git ops, criação de PR, deploy, CI/CD, gerenciamento de worktrees, migrações                                       | Git local, implementação                        |
| **@sinapse-orqx** (Orion)     | 👑    | Desenvolvimento do framework, orquestração multi-agente                                                            | Tarefas rotineiras (use agentes especializados) |

---

## 🤖 Comandos ADE por Agente (v2.2.0)

### @devops (Gage) - Infraestrutura & Operações

**Gerenciamento de Worktrees:**
| Comando | Descrição |
|---------|-----------|
| `*create-worktree {story}` | Criar worktree Git isolada para desenvolvimento de story |
| `*list-worktrees` | Listar todas as worktrees ativas com status |
| `*merge-worktree {story}` | Fazer merge da worktree concluída de volta ao main |
| `*cleanup-worktrees` | Remover worktrees obsoletas/já mergeadas |

**Gerenciamento de Migrações:**
| Comando | Descrição |
|---------|-----------|
| `*inventory-assets` | Gerar inventário de migração dos assets V2 |
| `*analyze-paths` | Analisar dependências de paths e impacto da migração |
| `*migrate-agent` | Migrar um único agente do formato V2 para V3 |
| `*migrate-batch` | Migração em lote de todos os agentes com validação |

---

### @project-lead (Morgan) - Gestão de Produto

**Spec Pipeline:**
| Comando | Descrição |
|---------|-----------|
| `*gather-requirements` | Elicitar e documentar requisitos dos stakeholders |
| `*write-spec` | Gerar documento de especificação formal a partir dos requisitos |

---

### @architect (Aria) - Arquitetura de Sistema

**Spec Pipeline:**
| Comando | Descrição |
|---------|-----------|
| `*assess-complexity` | Avaliar complexidade da story e estimar esforço |

**Execution Engine:**
| Comando | Descrição |
|---------|-----------|
| `*create-plan` | Criar plano de implementação com fases e subtasks |
| `*create-context` | Gerar contexto de projeto e arquivos para story |

**Memory Layer:**
| Comando | Descrição |
|---------|-----------|
| `*map-codebase` | Gerar mapa do codebase (estrutura, serviços, padrões) |

---

### @analyst (Atlas) - Pesquisa & Análise

**Spec Pipeline:**
| Comando | Descrição |
|---------|-----------|
| `*research-deps` | Pesquisar dependências e restrições técnicas |

**Memory Layer:**
| Comando | Descrição |
|---------|-----------|
| `*extract-patterns` | Extrair e documentar padrões de código do codebase |

---

### @quality-gate (Quinn) - Garantia de Qualidade

**Spec Pipeline:**
| Comando | Descrição |
|---------|-----------|
| `*critique-spec {story}` | Revisar e criticar especificação quanto à completude |

**QA Evolution (Revisão em 10 Fases):**
| Comando | Descrição |
|---------|-----------|
| `*review-build {story}` | Revisão QA estruturada em 10 fases - gera qa_report.md |
| `*request-fix {issue}` | Solicitar correção específica do @developer com contexto |
| `*verify-fix {issue}` | Verificar se a correção foi implementada corretamente |

---

### @developer (Dex) - Desenvolvimento

**Execution Engine:**
| Comando | Descrição |
|---------|-----------|
| `*execute-subtask` | Executar subtask seguindo workflow de 13 passos com auto-crítica |

**Recovery System:**
| Comando | Descrição |
|---------|-----------|
| `*track-attempt` | Rastrear tentativa de implementação (registra em recovery/attempts.json) |
| `*rollback` | Reverter para último estado bom (--hard para pular confirmação) |

**QA Loop:**
| Comando | Descrição |
|---------|-----------|
| `*apply-qa-fix` | Aplicar correção solicitada pelo QA (lê qa_report.md para contexto) |

**Memory Layer:**
| Comando | Descrição |
|---------|-----------|
| `*capture-insights` | Capturar insights da sessão (descobertas, padrões, gotchas) |
| `*list-gotchas` | Listar gotchas conhecidos de .sinapse/gotchas.md |

---

## Cenários Comuns

### "Quero construir uma nova funcionalidade" (Tradicional)

```
1. @analyst *brainstorm - Ideação
2. @project-lead *create-prd - Requisitos de produto
3. @architect *create-architecture - Design técnico
4. @data-engineer *create-schema - Design de banco de dados
5. @sprint-lead *create-next-story - User stories
6. @developer *develop - Implementação
7. @quality-gate *review - Verificação de qualidade
8. @devops *create-pr - Deploy
```

### "Quero construir usando ADE Spec Pipeline" (Autônomo)

```
1. @project-lead *gather-requirements - Coletar e estruturar requisitos
2. @architect *assess-complexity - Avaliar complexidade
3. @analyst *research-deps - Pesquisar bibliotecas/APIs
4. @project-lead *write-spec - Gerar especificação
5. @quality-gate *critique-spec - Validar qualidade da spec
   ↓
[Spec Aprovada]
   ↓
6. @architect *create-plan - Criar plano de implementação
7. @architect *create-context - Gerar arquivos de contexto
8. @developer *execute-subtask 1.1 - Executar com 13 passos + auto-crítica
9. @quality-gate *review-build - Revisão QA em 10 fases
   ↓
[Se encontrar problemas]
   ↓
10. @quality-gate *request-fix - Solicitar correção
11. @developer *apply-qa-fix - Aplicar correção
12. @quality-gate *verify-fix - Verificar
```

### "Estou travado na implementação"

```
1. @developer *track-attempt - Registrar a tentativa falha
2. @developer *rollback - Reverter para último estado bom
3. @developer *list-gotchas - Verificar armadilhas conhecidas
4. @developer *execute-subtask --approach alternative - Tentar abordagem diferente
```

### "Preciso entender o codebase existente"

```
1. @architect *map-codebase - Gerar mapa de estrutura/serviços/padrões
2. @analyst *extract-patterns - Documentar padrões de código
3. @developer *capture-insights - Registrar descobertas
```

### "Preciso de desenvolvimento paralelo de stories"

```
1. @devops *create-worktree STORY-42 - Isolar branch
2. @developer *execute-subtask - Trabalhar em isolamento
3. @devops *merge-worktree STORY-42 - Fazer merge quando concluído
4. @devops *cleanup-worktrees - Limpar branches obsoletas
```

---

## Padrões de Delegação

### Fluxo do Spec Pipeline

```
@project-lead *gather-requirements
    ↓
@architect *assess-complexity
    ↓
@analyst *research-deps
    ↓
@project-lead *write-spec
    ↓
@quality-gate *critique-spec
```

### Fluxo de Execução

```
@architect *create-plan
    ↓
@architect *create-context
    ↓
@developer *execute-subtask (loops)
    ↓
@quality-gate *review-build
```

### QA Loop

```
@quality-gate *review-build
    ↓ (problemas encontrados)
@quality-gate *request-fix
    ↓
@developer *apply-qa-fix
    ↓
@quality-gate *verify-fix
    ↓ (loop até limpo)
```

### Fluxo de Recuperação

```
@developer falha subtask
    ↓
@developer *track-attempt
    ↓
Retries < 3? → @developer tenta com variação
    ↓
@developer *rollback → tenta abordagem diferente
```

---

## Documentação Completa

- **[Guia Completo do ADE](./ade-guide.md)** - Tutorial completo do Autonomous Development Engine
- **[Matriz de Responsabilidade de Agentes](../../architecture/agent-responsibility-matrix.md)** - Definições completas de limites

---

**Versão:** 2.0 | **ADE:** v2.2.0 | **Data:** 2026-01-29
