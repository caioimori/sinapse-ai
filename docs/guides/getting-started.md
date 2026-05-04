# Comecando com SINAPSE-AI

> Guia de onboarding profissional. Objetivo: **first-value em 10 minutos**.

---

## Criterio de Sucesso

Voce atingiu o "first-value" quando estas 3 condicoes forem verdadeiras:

1. Um agente SINAPSE foi ativado
2. O greeting completo foi exibido
3. Um comando util foi executado (`*help` ou equivalente)

**Regra:** complete as 3 condicoes em ate 10 minutos.

---

## Pre-requisitos

| Requisito | Versao Minima | Recomendado |
|-----------|---------------|-------------|
| Node.js | >= 18.0.0 | v20+ |
| npm | >= 9.0.0 | Ultima estavel |
| Claude Code CLI | Ultima versao | — |
| Git | Qualquer | Ultima estavel |

> **Codex CLI** tambem e suportado. Veja [IDE Integration](./ide-integration.md) para outras opcoes.

---

## Instalacao (3 minutos)

### Projeto Novo

```bash
npx sinapse-ai init meu-projeto
cd meu-projeto
```

### Projeto Existente

```bash
cd meu-projeto-existente
npx sinapse-ai install
```

O wizard interativo vai configurar:
- **Idioma** (PT/EN)
- **LLM provider** (Claude, Gemini, Codex)
- **Squads** para instalar (escolha quais dominios ativar)

A instalacao e **nao-destrutiva** — seus arquivos existentes nao sao sobrescritos.

---

## Verificacao (1 minuto)

```bash
npx sinapse-ai doctor
```

Todos os checks devem passar (verde). Se houver warnings, execute:

```bash
npx sinapse-ai doctor --fix
```

---

## Primeiro Agente (3 minutos)

No Claude Code, digite:

```
@developer
```

O agente **Pixel** vai se apresentar com greeting completo, mostrando seu papel, comandos disponiveis e o estado do projeto.

### Comandos Essenciais

| Comando | O que faz |
|---------|-----------|
| `*help` | Lista todos os comandos do agente ativo |
| `*guide` | Guia detalhado de uso |
| `*session-info` | Informacoes da sessao atual |
| `*exit` | Sair do modo agente |

---

## Primeiro Workflow (3 minutos)

```
@sprint-lead
*draft
```

O agente **Sync** vai guiar a criacao da sua primeira story de desenvolvimento. Stories sao o ponto de partida de todo trabalho no SINAPSE — elas definem o que sera implementado, com criterios de aceite claros.

### Fluxo Completo

```
@sprint-lead *draft          --> Cria a story
@product-lead *validate      --> Valida criterios
@developer                   --> Implementa
@quality-gate *review        --> Verifica qualidade
@devops *push                --> Envia para o repositorio
```

---

## Agentes Disponiveis

| Ativacao | Persona | Foco |
|----------|---------|------|
| `@developer` | Pixel | Implementacao de codigo, bug fixes, refactoring |
| `@quality-gate` | Litmus | Testes, quality gates, code review |
| `@architect` | Stratum | Design de sistema, decisoes tecnicas |
| `@project-lead` | Beacon | PRDs, estrategia, roadmap |
| `@product-lead` | Axis | Backlog, validacao de stories, priorizacao |
| `@sprint-lead` | Sync | Criacao de stories, planejamento de sprint |
| `@analyst` | Scope | Pesquisa, analise competitiva |
| `@data-engineer` | Tensor | Database design, migracoes |
| `@ux-design-expert` | Mosaic | UI/UX design, acessibilidade |
| `@devops` | Pipeline | Git operations, CI/CD, deploys |

---

## Greenfield vs Brownfield

| Cenario | Comando | O que acontece |
|---------|---------|----------------|
| **Projeto novo** | `npx sinapse-ai init meu-projeto` | Estrutura completa criada do zero |
| **Projeto existente** | `npx sinapse-ai install` | Installer detecta automaticamente e preserva seus arquivos |

Para projetos existentes, o SINAPSE oferece um workflow de **Brownfield Discovery** que analisa a codebase e gera documentacao de arquitetura e divida tecnica. Ative com:

```
@project-lead *brownfield-create-epic
```

---

## Troubleshooting

| Problema | Solucao |
|----------|---------|
| `sinapse-ai: command not found` | Execute `npx sinapse-ai install` novamente |
| Doctor mostra warnings | Execute `npx sinapse-ai doctor --fix` |
| Agente nao ativa | Verifique se `.sinapse-ai/` existe no projeto |
| Hooks nao funcionam | Verifique `.claude/settings.json` |
| Versao do Node incompativel | Atualize para Node.js >= 18 (`node --version`) |
| Erro no wizard de instalacao | Tente `npx sinapse-ai install --force` |

### Diagnostico Avancado

```bash
# Verificar versao do Node
node --version

# Verificar instalacao
npx sinapse-ai doctor

# Corrigir problemas automaticamente
npx sinapse-ai doctor --fix

# Informacoes do sistema
npx sinapse-ai info
```

---

## Proximos Passos

- **Explorar os squads** — `@snps-orqx *status` mostra todos os dominios disponiveis (alias `@sinapse-orqx` ate v1.3.0)
- **Entender os workflows** — Leia `docs/guides/workflows-overview.md`
- **Integracao com IDEs** — Veja [IDE Integration](./ide-integration.md) para Claude Code, Gemini CLI, Codex CLI, Cursor e GitHub Copilot
- **Contribuir** — Leia [CONTRIBUTING.md](../CONTRIBUTING.md)

---

## Validacao Final

| Criterio | Status |
|----------|--------|
| Agente ativou | PASS / FAIL |
| Greeting exibiu | PASS / FAIL |
| `*help` mostrou comandos | PASS / FAIL |

Se algum criterio falhou, abra uma [issue](https://github.com/caioimori/sinapse-ai/issues/new?template=1-bug-report.yml).

---

_SINAPSE Getting Started Guide v5.0_
