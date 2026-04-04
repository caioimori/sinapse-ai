[![npm version](https://img.shields.io/npm/v/sinapse-ai.svg)](https://www.npmjs.com/package/sinapse-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)
[![CI](https://github.com/caioimori/sinapse-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/caioimori/sinapse-ai/actions/workflows/ci.yml)

```
 ____  ___ _   _    _    ____  ____  _____
/ ___|/ _ \ \ | |  / \  |  _ \/ ___|| ____|
\___ \ | | |  \| | / _ \ | |_) \___ \|  _|
 ___) | |_| | |\  |/ ___ \|  __/ ___) | |___
|____/ \___/|_| \_/_/   \_\_|   |____/|_____|
```

> **Squads de IA que constroem com voce, nao para voce.**

[**Portugues**] | [English](README.en.md)

---

## O que e o SINAPSE?

SINAPSE e um meta-framework open source que organiza **186 agentes de IA em 18 squads especializados**, operando direto no terminal via Claude Code ou Codex CLI. Cada agente tem um papel definido, cada squad domina uma disciplina, e o sistema inteiro e governado por uma **Constitution com enforcement real** — 19 hooks ativos que bloqueiam violacoes em tempo de execucao.

O conceito central e simples: em vez de um unico assistente de IA tentando fazer tudo, o SINAPSE estrutura o trabalho em equipes especializadas. Um squad de branding cuida da identidade visual. Um squad de cybersecurity cuida de compliance e pentest. Um squad de copywriting cuida de persuasao e conversao. Cada um com sua propria knowledge base, workflows e tasks — totalizando **1.425 tasks executaveis** prontas para uso.

Diferente de ferramentas que apenas conversam com IA, o SINAPSE impoe disciplina. O pipeline **Documentation-First** exige que uma story seja criada e validada antes de qualquer linha de codigo. Quality gates rodam automaticamente antes de merge. Agentes nao autorizados sao bloqueados de fazer push. Tudo isso via hooks que interceptam operacoes em tempo real — nao depois.

---

## Quick Start

### 1. Instale

```bash
npx sinapse-ai install
```

O wizard detecta seu ambiente, configura a IDE e instala os squads automaticamente.

### 2. Verifique

```bash
npx sinapse-ai doctor
```

### 3. Ative seu primeiro agente

```
@developer          # Ativa o agente de desenvolvimento
*help               # Lista comandos disponiveis
```

Pronto. Voce tem 18 squads operando no seu terminal.

---

## Arquitetura

### CLI First

```
CLI First  >  Observability Second  >  UI Third
```

Toda inteligencia vive no terminal. Dashboards observam. A UI nunca e requisito para operar o sistema. Esse e o Artigo I da Constitution — inegociavel.

### Modelo de 4 Camadas

O SINAPSE separa artefatos do framework e do projeto em 4 camadas com protecao automatica:

| Camada | Mutabilidade | Conteudo |
|--------|-------------|----------|
| **L1** Framework Core | Nunca | `.sinapse-ai/core/`, `bin/`, Constitution |
| **L2** Templates | Nunca | Tasks, templates, checklists, workflows |
| **L3** Configuracao | Com restricoes | Entity registry, agent memory, config |
| **L4** Projeto | Sempre | Stories, packages, squads, testes |

Deny rules em `.claude/settings.json` reforcam isso deterministicamente.

### Constitution

O SINAPSE e governado por uma Constitution formal com 10 artigos e 19 hooks de enforcement:

| Artigo | Principio | Severidade |
|--------|-----------|------------|
| I | CLI First | NON-NEGOTIABLE |
| II | Agent Authority | NON-NEGOTIABLE |
| III | Documentation-First Development | NON-NEGOTIABLE |
| IV | No Invention | MUST |
| V | Quality First | MUST |
| VI | Absolute Imports | SHOULD |
| VII | Ecosystem Metrics Accuracy | NON-NEGOTIABLE |
| VIII | Mandatory Delegation | NON-NEGOTIABLE |
| IX | Safe Collaboration | NON-NEGOTIABLE |
| X | Security & Data Protection | NON-NEGOTIABLE |

6 artigos sao NON-NEGOTIABLE — violacoes sao bloqueadas automaticamente antes de executar.

---

## Sistema de Agentes

O SINAPSE inclui 12 agentes core que cobrem o ciclo completo de desenvolvimento:

| Agente | Persona | Papel |
|--------|---------|-------|
| `sinapse-orqx` | **Imperator** | Orquestrador principal — routing e coordenacao cross-squad |
| `developer` | **Pixel** | Implementacao de codigo e story development |
| `quality-gate` | **Litmus** | Testes, QA e quality gates |
| `architect` | **Stratum** | Arquitetura e decisoes de tecnologia |
| `project-lead` | **Beacon** | Product management e epics |
| `product-lead` | **Axis** | Validacao de stories e priorizacao |
| `sprint-lead` | **Sync** | Criacao de stories e sprints |
| `analyst` | **Scope** | Pesquisa e analise de negocios |
| `data-engineer` | **Tensor** | Database design, migrations e RLS |
| `ux-design-expert` | **Mosaic** | UX/UI design |
| `devops` | **Pipeline** | CI/CD, git push (exclusivo), releases |
| `squad-creator` | **Loom** | Criacao de novos squads |

Ative qualquer agente com `@agent-name` e use `*help` para ver seus comandos.

### Workflow de Desenvolvimento

```
@sprint-lead cria story
       |
@product-lead valida
       |
@developer implementa
       |
@quality-gate testa
       |
@devops push + PR
```

O framework garante que nenhuma etapa seja pulada.

---

## 18 Squads Especializados

Cada squad e uma equipe autonoma com orquestrador, agentes especialistas, knowledge base, tasks e workflows proprios.

| Squad | Dominio | Agentes |
|-------|---------|---------|
| **squad-brand** | Estrategia de marca, arquetipos, auditoria visual | 15 |
| **squad-design** | Design systems, componentes, tokens, UI | 15 |
| **squad-copy** | Copywriting persuasivo, headlines, conversao | 14 |
| **squad-council** | Advisors estrategicos (Munger, Dalio, Thiel, ...) | 11 |
| **squad-storytelling** | Narrativa, roteiros, frameworks de historia | 11 |
| **squad-commercial** | Vendas, funil, revenue, pipeline comercial | 11 |
| **squad-paidmedia** | Meta Ads, Google Ads, campanhas, otimizacao | 10 |
| **squad-claude** | Claude Code avancado, MCP, integracao profunda | 10 |
| **squad-animations** | Motion design, CSS, particulas, 3D | 9 |
| **squad-cloning** | Clonagem cognitiva, mind synthesis, digital twins | 9 |
| **squad-cybersecurity** | Threat intel, pentest, compliance, LGPD | 9 |
| **squad-courses** | Cursos, curriculos, assessments, launch educacional | 8 |
| **squad-research** | Market analysis, inteligencia competitiva | 8 |
| **claude-code-mastery** | Dominio avancado do Claude Code como ferramenta | 8 |
| **squad-content** | Governanca editorial, estrategia de conteudo | 7 |
| **squad-product** | Product discovery, estrategia, operacoes | 7 |
| **squad-growth** | Analytics, CRO, SEO, growth hacking | 7 |
| **squad-finance** | Budget, pricing, profitability analysis | 5 |

**Total: 18 squads, 186 agentes especializados, 1.425 tasks**

Cada squad e ativado via seu orquestrador:

```
@brand-orqx         # Squad de brand
@copy-orqx          # Squad de copy
@cyber-orqx         # Squad de cybersecurity
@research-orqx      # Squad de research
```

O orquestrador recebe seu pedido e delega automaticamente ao especialista correto dentro do squad.

---

## IDE Support

O SINAPSE suporta duas IDEs com integracoes profundas:

| IDE | Ativacao | Destaques |
|-----|----------|-----------|
| **Claude Code** | `@agent-name` | Hooks, rules contextuais, deny/allow, Chrome Brain |
| **Codex CLI** | `/skills` ou `$skill-name` | Skills nativas, multi-model, `codex exec` para CI/CD |

Ambas as IDEs tem acesso a todos os 18 squads, 186 agentes, workflows e knowledge bases. O installer detecta e configura automaticamente.

### Tabela de Paridade

| Funcionalidade | Claude Code | Codex CLI |
|---------------|:-----------:|:---------:|
| Ativacao de agentes (@agent) | Completo | Completo |
| Hooks constitucionais (19) | Completo | Parcial (5) |
| Story-driven development | Completo | Completo |
| Quality gates | Completo | Completo |
| Enforcement de delegacao | Completo | Parcial |
| Secret scanning | Completo | Manual |
| Integracao CodeRabbit | Completo | N/A |
| Sistema de skills | Completo | Comandos |
| MCP servers | Completo | N/A |
| Terminal Bus | Completo | N/A |

**Claude Code** para a experiencia mais integrada e automatizada.
**Codex CLI** para flexibilidade de modelo e automacao CI/CD.

---

## Qualidade e Seguranca

### Enforcement Constitucional

O SINAPSE nao apenas documenta regras — ele as impoe com **19 hooks ativos**:

- `enforce-git-push-authority.sh` — bloqueia push por agentes nao autorizados
- `enforce-story-gate.cjs` — bloqueia codigo sem story validada
- `sql-governance.py` — bloqueia SQL perigoso (injection patterns)
- `enforce-delegation.cjs` — bloqueia orquestradores executando trabalho de dominio
- `enforce-architecture-first.cjs` — bloqueia codigo em paths protegidos sem documentacao

### 25 Deployment Blockers (3 Tiers)

Nenhum projeto vai para producao sem passar por todos:

- **Tier 1** — 10 blockers absolutos: RLS, zero hardcoded keys, service_role protegido, MFA, APIs autenticadas, SQL parametrizado
- **Tier 2** — 7 blockers de compliance: DPO, consentimento, direitos do titular, notificacao de breach (LGPD)
- **Tier 3** — 8 blockers operacionais: logging, backup, vulnerability scanning, incident response

### Quality Gates

```bash
npm run lint           # ESLint
npm run typecheck      # TypeScript
npm test               # Testes
npm run test:coverage  # Cobertura
```

Pre-commit e pre-push hooks validam automaticamente antes de cada operacao.

---

## Documentacao

| Recurso | Link |
|---------|------|
| Getting Started | [docs/guides/getting-started.md](docs/guides/getting-started.md) |
| Arquitetura | [docs/framework/core-architecture.md](docs/framework/core-architecture.md) |
| Guia de Squads | [docs/guides/squads-guide.md](docs/guides/squads-guide.md) |
| Referencia de Agentes | [docs/guides/agent-reference.md](docs/guides/agent-reference.md) |
| Workflows | [docs/guides/workflows-guide.md](docs/guides/workflows-guide.md) |
| Seguranca | [SECURITY.md](SECURITY.md) |
| Contribuicao | [CONTRIBUTING.md](CONTRIBUTING.md) |

---

## CLI Reference

```bash
npx sinapse-ai init <nome>       # Criar projeto
npx sinapse-ai install           # Instalar no projeto atual
npx sinapse-ai update            # Atualizar framework
npx sinapse-ai doctor            # Diagnostico do sistema
npx sinapse-ai doctor --fix      # Diagnostico com correcao
npx sinapse-ai info              # Informacoes do sistema
npx sinapse-ai uninstall         # Remover framework
```

---

## Contribuindo

```bash
git clone https://github.com/caioimori/sinapse-ai.git
cd sinapse-ai && npm install
```

1. Fork o repositorio
2. Crie sua branch (`git checkout -b feat/minha-feature`)
3. Commit (`git commit -m 'feat: descricao'`)
4. Push (`git push origin feat/minha-feature`)
5. Abra um Pull Request

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes completos.

---

## Legal

| Documento | Link |
|-----------|------|
| Licenca | [MIT](LICENSE) |
| Seguranca | [SECURITY.md](SECURITY.md) |
| Codigo de Conduta | [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) |
| Contribuicao | [CONTRIBUTING.md](CONTRIBUTING.md) |

---

## Maintainers

- [@caioimori](https://github.com/caioimori) — Lead Maintainer
- [@Matheus-soier](https://github.com/Matheus-soier) — Co-Maintainer

---

Construido para quem constroi.

**[Voltar ao topo](#sinapse-ai)**
