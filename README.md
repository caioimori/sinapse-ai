# SINAPSE AI

> [English](README.en.md) | **Portugues**

[![npm](https://img.shields.io/npm/v/sinapse-ai.svg)](https://www.npmjs.com/package/sinapse-ai)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-success.svg)](LICENSE)

> **174 agentes de IA. 19 squads especializados. Uma CLI.**
>
> O SINAPSE AI e um framework open source que organiza agentes de IA em squads especializados para resolver problemas reais de negocios, marketing, desenvolvimento, copy, design e mais. Funciona direto no seu terminal com Claude Code, Codex CLI ou qualquer IDE compativel.

---

## O que e o SINAPSE AI

O SINAPSE AI nao e mais um chatbot. E um sistema de orquestracao onde cada agente tem um papel claro, cada squad domina uma disciplina, e tudo funciona via CLI.

**O que voce ganha ao instalar:**

- **19 orquestradores (orqx)** prontos para ativar direto no terminal
- **174 agentes especializados** com knowledge bases proprias
- **Workflows completos** de planejamento, desenvolvimento, QA e deploy
- **Story-Driven Development** com rastreamento automatico de progresso
- **Compatibilidade multi-IDE**: Claude Code e Codex CLI

### Arquitetura: CLI First

```
CLI First > Observability Second > UI Third
```

Toda inteligencia vive na CLI. Dashboards observam. A UI nunca e requisito.

---

## Instalacao (2 minutos)

```bash
# Novo projeto
npx sinapse-ai init meu-projeto

# Projeto existente
cd seu-projeto && npx sinapse-ai install

# Atualizar instalacao existente
npx sinapse-ai@latest install
```

O wizard detecta seu ambiente, configura sua IDE, instala os squads e ativa o **Chrome Brain** (browser automation) automaticamente.

```bash
# Diagnostico
npx sinapse-ai doctor

# Informacoes do sistema
npx sinapse-ai info
```

**Requisitos:** Node.js 18+ (v20+ recomendado)

---

## Squads Disponiveis

Cada squad e uma equipe de agentes especializados com knowledge base, workflows e tasks proprias. Todos os squads sao **gratuitos e open source**.

| Squad | Foco | Agentes |
|-------|------|---------|
| **squad-brand** | Estrategia de marca, arquetipos, auditoria | 15 |
| **squad-copy** | Copywriting persuasivo, headlines, conversao | 14 |
| **squad-council** | Advisors estrategicos (Munger, Dalio, Thiel) | 11 |
| **squad-storytelling** | Narrativa, roteiros, frameworks de historia | 11 |
| **squad-commercial** | Vendas, funil, revenue, pipeline | 11 |
| **squad-animations** | Motion design, CSS, particulas, 3D | 9 |
| **squad-paidmedia** | Meta Ads, Google Ads, campanhas, otimizacao | 10 |
| **squad-claude** | Claude Code, MCP, integracao avancada | 10 |
| **squad-cloning** | Clonagem cognitiva, mind synthesis | 9 |
| **squad-courses** | Cursos, curriculos, assessments, launch | 8 |
| **squad-cybersecurity** | Seguranca, threat intel, pentest | 9 |
| **squad-design** | Design systems, componentes, tokens | 15 |
| **squad-content** | Governanca editorial, estrategia de conteudo | 7 |
| **squad-product** | Product discovery, estrategia, operacoes | 7 |
| **squad-research** | Market analysis, inteligencia competitiva | 8 |
| **squad-growth** | Analytics, CRO, SEO, growth hacking | 7 |
| **squad-finance** | Budget, pricing, profitability analysis | 5 |
| **claude-code-mastery** | Dominio avancado do Claude Code | 8 |

**Total: 19 squads, 174 agentes especializados**

---

## Chrome Brain — Browser Automation

Todos os agentes do SINAPSE podem controlar o Chrome em tempo real: navegar sites, clonar paginas, preencher formularios, auditar performance e extrair dados.

**Instalado automaticamente** pelo wizard. Zero configuracao manual.

```bash
# Verificar status
sinapse chrome-brain status

# Reinstalar/atualizar
sinapse chrome-brain install
```

**Como funciona:**
1. Voce diz: "abre o site google.com"
2. Chrome Brain auto-ativa (sem comando manual)
3. Chrome inicia automaticamente na porta 9222
4. Agente usa 29 tools do Chrome DevTools MCP
5. Resultado entregue ao squad do dominio

**Suporte:** macOS, Linux, Windows (Git Bash/WSL)

---

## Como Usar

### No Claude Code

Ative qualquer orquestrador pelo nome:

```
/sinapse            # Orquestrador principal
@brand-orqx         # Squad de brand
@copy-orqx          # Squad de copy
@research-orqx      # Squad de research
```

Ou use os agentes de desenvolvimento:

```
@developer           # Implementacao de codigo
@quality-gate        # Testes e qualidade
@architect           # Arquitetura e design
@sprint-lead         # Criacao de stories
@product-lead        # Validacao de stories
@project-lead        # Product management
@analyst             # Pesquisa e analise
@data-engineer       # Database design
@devops              # CI/CD e git push (exclusivo)
```

### No Codex CLI

```
/skills              # Lista todos os agentes disponiveis
sinapse-dev          # Ativa o developer
sinapse-architect    # Ativa o architect
```

### Comandos dos Agentes

Dentro de qualquer agente, use `*` para comandos:

```
*help                # Comandos disponiveis
*create-story        # Criar story de desenvolvimento
*task <nome>         # Executar task especifica
*exit                # Sair do agente
```

---

## Agentes de Desenvolvimento

O SINAPSE vem com 12 agentes core para o ciclo completo de desenvolvimento:

| Agente | Persona | Escopo |
|--------|---------|--------|
| `sinapse-orqx` | Imperator | Orquestrador principal de todos os squads |
| `developer` | Dex | Implementacao de codigo |
| `quality-gate` | Quinn | Testes, QA e quality gates |
| `architect` | Aria | Arquitetura e design tecnico |
| `project-lead` | Morgan | Product management e epics |
| `product-lead` | Pax | Validacao de stories e backlog |
| `sprint-lead` | River | Criacao de stories e sprints |
| `analyst` | Alex | Pesquisa e analise de negocios |
| `data-engineer` | Dara | Database design e migrations |
| `ux-design-expert` | Uma | UX/UI design e experiencia |
| `devops` | Gage | CI/CD, git push (exclusivo) |
| `squad-creator` | - | Criacao de novos squads |

### Workflow de Desenvolvimento

```
@sprint-lead cria story > @product-lead valida > @developer implementa > @quality-gate testa > @devops push
```

---

## Story-Driven Development

Todo desenvolvimento no SINAPSE segue stories:

1. **Stories em** `docs/stories/` com acceptance criteria claros
2. **Progresso rastreado** via checkboxes `[ ]` > `[x]`
3. **File List** mantida atualizada na story
4. **Quality gates** automaticos antes de merge

---

## Criando Seu Proprio Squad

Qualquer pessoa pode criar um squad para qualquer dominio:

```
squads/meu-squad/
  squad.yaml            # Manifesto do squad
  agents/               # Agentes especializados
  knowledge-base/       # Base de conhecimento
  tasks/                # Tasks executaveis
  workflows/            # Workflows do squad
```

Use `@squad-creator` ou veja o [Guia de Squads](docs/guides/squads-guide.md).

---

## IDEs Suportadas

| IDE | Como ativar |
|-----|------------|
| **Claude Code** | `@agent-name` ou `/sinapse` |
| **Codex CLI** | `/skills` > `sinapse-<agent>` ou `@agent-name` |

---

## CLI

```bash
npx sinapse-ai init <projeto>      # Criar projeto
npx sinapse-ai install             # Instalar no projeto atual
npx sinapse-ai update              # Atualizar
npx sinapse-ai doctor              # Diagnostico
npx sinapse-ai doctor --fix        # Corrigir problemas
npx sinapse-ai info                # Info do sistema
npx sinapse-ai uninstall           # Remover
sinapse chrome-brain install       # Instalar Chrome Brain
sinapse chrome-brain status        # Status do Chrome Brain
```

---

## Qualidade e Validacao

```bash
npm run lint           # ESLint
npm run typecheck      # TypeScript
npm test               # Testes
npm run test:coverage  # Cobertura
```

Pre-commit e pre-push hooks validam automaticamente.

---

## Documentacao

| Recurso | Link |
|---------|------|
| Guia do Usuario | [docs/guides/user-guide.md](docs/guides/user-guide.md) |
| Arquitetura | [docs/pt/architecture/](docs/pt/architecture/) |
| Guia de Squads | [docs/guides/squads-guide.md](docs/guides/squads-guide.md) |
| Primeiros Passos | [docs/getting-started.md](docs/getting-started.md) |
| Troubleshooting | [docs/troubleshooting.md](docs/troubleshooting.md) |
| Principios | [docs/GUIDING-PRINCIPLES.md](docs/GUIDING-PRINCIPLES.md) |

---

## Contribuindo

```bash
git clone https://github.com/SinapseAI/sinapse-ai.git
cd sinapse-ai && npm install
```

1. Fork o repositorio
2. Crie sua branch (`git checkout -b feat/minha-feature`)
3. Commit (`git commit -m 'feat: descricao'`)
4. Push (`git push origin feat/minha-feature`)
5. Abra um Pull Request

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

---

## Legal

| Doc | Link |
|-----|------|
| Licenca | [MIT](LICENSE) |
| Privacidade | [Privacy](docs/legal/privacy.md) |
| Termos | [Terms](docs/legal/terms.md) |
| Conduta | [Code of Conduct](CODE_OF_CONDUCT.md) |
| Seguranca | [Security](docs/security.md) |

---

## Contribuidores

[![Contributors](https://contrib.rocks/image?repo=SinapseAI/sinapse-ai)](https://github.com/SinapseAI/sinapse-ai/graphs/contributors)

---

Construido para quem constroi.

**[Voltar ao topo](#sinapse-ai)**
