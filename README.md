[![npm version](https://img.shields.io/npm/v/sinapse-ai.svg)](https://www.npmjs.com/package/sinapse-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)
[![CI](https://github.com/caioimori/sinapse-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/caioimori/sinapse-ai/actions/workflows/ci.yml)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](CONTRIBUTING.md)

# SINAPSE-AI

> **Squads de IA que constroem com voce, nao para voce.**

[**Portugues**] | [English](README.en.md)

---

## O que e o SINAPSE?

SINAPSE e um framework open source que organiza **175 agentes de IA em 18 squads especializados**, operando direto no terminal via Claude Code ou Codex CLI. Cada agente tem um papel definido, cada squad domina uma disciplina, e o sistema inteiro e governado por uma **Constitution com enforcement real** — 19 hooks ativos que bloqueiam violacoes em tempo de execucao, nao depois.

Diferente de ferramentas que apenas conversam com IA, o SINAPSE estrutura o trabalho. Antes de qualquer linha de codigo, o pipeline **Documentation-First** exige que uma story seja criada, validada e rastreada. Isso nao e uma sugestao — e uma regra que o framework impoe automaticamente. Nenhum agente escreve codigo sem uma story aprovada.

O resultado e um sistema onde desenvolvimento, branding, copy, cybersecurity, growth, design e mais de uma dezena de outros dominios operam com a mesma disciplina: squads especializados, workflows automaticos, quality gates antes de merge, e tudo governado por principios inegociaveis. Tudo via CLI.

---

## Quick Start

### 1. Instale

```bash
# Projeto novo
npx sinapse-ai init meu-projeto

# Projeto existente
cd seu-projeto && npx sinapse-ai install
```

### 2. Verifique

```bash
npx sinapse-ai doctor
```

```
  SINAPSE Doctor v7.7.11
  ----------------------
  [PASS] Node.js >= 18
  [PASS] .sinapse-ai/ structure
  [PASS] core-config.yaml
  [PASS] IDE: claude-code
  [PASS] 18 squads loaded
  [PASS] 175 agents available
  [PASS] Constitution v2.2.0

  Result: ALL CHECKS PASSED
```

### 3. Ative seu primeiro agente

No **Claude Code**:
```
@developer          # Ativa o agente de desenvolvimento
*help               # Lista comandos disponiveis
```

No **Codex CLI**:
```
/skills             # Lista todos os agentes
$sinapse-dev        # Ativa o developer
```

Pronto. Voce tem 18 squads operando no seu terminal.

---

## O que voce quer fazer?

| Objetivo | Comece aqui |
|----------|-------------|
| Comecar um projeto novo | [Getting Started](docs/getting-started.md) |
| Entender a arquitetura | [Architecture Overview](docs/architecture-overview.md) |
| Ver os agentes disponiveis | [Agent Reference](docs/guides/agent-reference.md) |
| Entender os workflows | [Workflows](docs/GUIDING-PRINCIPLES.md) |
| Contribuir com o framework | [Contributing](CONTRIBUTING.md) |
| Reportar vulnerabilidade | [Security](SECURITY.md) |

---

## Arquitetura: CLI First

```
CLI First  >  Observability Second  >  UI Third
```

Toda inteligencia vive no terminal. Dashboards observam. A UI nunca e requisito para operar o sistema. Esse e o Artigo I da Constitution — inegociavel.

---

## IDE Support

| IDE | Status | Ativacao | Destaques |
|-----|--------|----------|-----------|
| **Claude Code** | Completo | `@agent-name` | Hooks, rules contextuais, deny/allow, Chrome Brain auto-launch |
| **Codex CLI** | Completo | `/skills` ou `$skill-name` | Skills nativas, multi-model, `codex exec` para CI/CD |

Ambas as IDEs tem acesso a todos os 18 squads, 175 agentes, workflows e knowledge bases. O installer detecta e configura automaticamente.

---

## Agentes Core

O SINAPSE inclui 12 agentes core que cobrem o ciclo completo de desenvolvimento:

| Agente | Persona | Papel |
|--------|---------|-------|
| `sinapse-orqx` | **Imperator** | Orquestrador principal — routing, diagnostico, coordenacao cross-squad |
| `developer` | **Pixel** | Implementacao de codigo, story development |
| `quality-gate` | **Litmus** | Testes, QA, quality gates, verdicts |
| `architect` | **Stratum** | Arquitetura, design tecnico, decisoes de tecnologia |
| `project-lead` | **Beacon** | Product management, epics, spec pipeline |
| `product-lead` | **Axis** | Validacao de stories, backlog, priorizacao |
| `sprint-lead` | **Sync** | Criacao de stories, sprints, templates |
| `analyst` | **Scope** | Pesquisa, analise de negocios, inteligencia |
| `data-engineer` | **Tensor** | Database design, migrations, RLS, otimizacao |
| `ux-design-expert` | **Mosaic** | UX/UI design, experiencia do usuario |
| `devops` | **Pipeline** | CI/CD, git push (exclusivo), releases, PRs |
| `squad-creator` | **Loom** | Criacao de novos squads personalizados |

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

Esse fluxo e automatico. O framework garante que nenhuma etapa seja pulada.

---

## 18 Squads Especializados

Cada squad e uma equipe autonoma com orquestrador, agentes especialistas, knowledge base, tasks e workflows proprios. Todos sao gratuitos e open source.

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
| **squad-content** | Governanca editorial, estrategia de conteudo | 7 |
| **squad-product** | Product discovery, estrategia, operacoes | 7 |
| **squad-growth** | Analytics, CRO, SEO, growth hacking | 7 |
| **squad-finance** | Budget, pricing, profitability analysis | 5 |
| **claude-code-mastery** | Dominio avancado do Claude Code como ferramenta | 8 |

**Total: 18 squads, 175 agentes especializados**

Cada squad e ativado via seu orquestrador:

```
@brand-orqx         # Squad de brand
@copy-orqx          # Squad de copy
@cyber-orqx         # Squad de cybersecurity
@research-orqx      # Squad de research
@growth-orqx        # Squad de growth
```

O orquestrador recebe seu pedido e delega automaticamente ao especialista correto dentro do squad.

---

## Constitution

O SINAPSE e governado por uma **Constitution formal** (v2.2.0) com 10 artigos. Nao sao diretrizes — sao regras que o framework impoe via hooks e gates automaticos.

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

**6 artigos sao NON-NEGOTIABLE** — violacoes sao bloqueadas automaticamente.

### Enforcement Real

O SINAPSE nao apenas documenta regras — ele as impoe:

- **19 hooks ativos** interceptam operacoes em tempo real
- `enforce-git-push-authority.sh` — bloqueia push por agentes nao autorizados
- `enforce-story-gate.cjs` — bloqueia codigo sem story validada
- `sql-governance.py` — bloqueia SQL perigoso (injection patterns)
- `enforce-delegation.cjs` — bloqueia orquestradores executando trabalho de dominio
- `enforce-architecture-first.cjs` — bloqueia codigo em paths protegidos sem documentacao

Se um agente tenta violar a Constitution, a operacao e bloqueada antes de executar. Nao depois.

---

## Workflows

O SINAPSE opera com 4 workflows principais:

### 1. Story Development Cycle (SDC) — Principal

O fluxo padrao para todo desenvolvimento:

```
  Briefing
     |
  @sprint-lead *draft        [Cria story]
     |
  @product-lead *validate    [Valida com checklist de 10 pontos]
     |
  @developer *develop        [Implementa em YOLO/Interactive/Pre-Flight]
     |
  @quality-gate *qa-gate     [7 quality checks, verdict: PASS/FAIL]
     |
  @devops *push              [Push + PR com reviewer assignment]
```

### 2. QA Loop — Ciclo Iterativo

```
  @quality-gate review  -->  verdict
         |                      |
     APPROVE              REJECT --> @developer fix --> re-review
         |                                              (max 5x)
       Done
```

### 3. Spec Pipeline — Pre-Implementacao

Para features complexas que precisam de especificacao formal:

```
  Gather --> Assess --> Research --> Write Spec --> Critique --> Plan
  (@pm)    (@arch)    (@analyst)     (@pm)        (@qa)      (@arch)
```

### 4. Brownfield Discovery — Avaliacao de Legado

Avaliacao completa de 10 fases para projetos existentes, cobrindo arquitetura, database, frontend, technical debt e plano de acao.

---

## Documentation-First Development

Todo desenvolvimento no SINAPSE segue um pipeline de documentacao automatico. Isso e o Artigo III da Constitution — NON-NEGOTIABLE.

```
Briefing do usuario
       |
   Epic definida (ou existente identificada)
       |
   Story criada em docs/stories/ com:
     - Acceptance criteria (Given/When/Then)
     - Escopo definido (IN/OUT)
     - Dependencias mapeadas
     - Estimativa de complexidade
       |
   Story validada por @product-lead (status >= Ready)
       |
   Implementacao liberada
```

Se voce pedir "implementa feature X", o SINAPSE cria a story primeiro, valida, e so entao implementa. Se voce pedir para pular a documentacao, o framework recusa. Sem excecoes.

---

## Chrome Brain

Todos os agentes do SINAPSE podem controlar o Chrome em tempo real: navegar sites, auditar performance, extrair dados, preencher formularios.

```bash
# Verificar status
sinapse chrome-brain status

# Instalar/reinstalar
sinapse chrome-brain install
```

**No Claude Code:** auto-ativa por hooks. Zero configuracao manual.
**No Codex CLI:** via MCP ou skill chrome-cdp.

**Suporte:** macOS, Linux, Windows (Git Bash/WSL)

---

## Seguranca

A seguranca e o Artigo X da Constitution — NON-NEGOTIABLE desde o primeiro commit.

### 25 Deployment Blockers

Nenhum projeto vai para producao sem passar por todos:

- **Tier 1 (10 blockers absolutos):** RLS em toda tabela, zero API keys hardcoded, service_role nunca no frontend, MFA obrigatorio, APIs autenticadas, SQL parametrizado, sem vulnerabilidades critical/high, sem secrets no codebase, sem credenciais default, TLS obrigatorio.

- **Tier 2 (7 blockers de compliance):** DPO designado, capacidade de notificacao de breach em 3 dias, mecanismo de consentimento, portal de direitos do titular, SCCs para transferencia internacional, protecao de dados de criancas, politica de privacidade publicada.

- **Tier 3 (8 blockers operacionais):** Inventario de ativos, logging centralizado, plano de resposta a incidentes, verificacao de backup, vulnerability scanning, segmentacao de rede, avaliacao de vendors, SSL enforcement no database.

### LGPD

Compliance total com a Lei Geral de Protecao de Dados e parte do framework. Consentimento, direitos do titular, notificacao de breach, DPO — tudo documentado e enforced.

Veja [SECURITY.md](SECURITY.md) para detalhes completos e politica de reporte de vulnerabilidades.

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

Use `@squad-creator` (Loom) para criacao guiada, ou veja o [Guia de Squads](docs/guides/squads-guide.md).

---

## Instalacao Detalhada

### Requisitos

- **Node.js 18+** (v20+ recomendado)
- **Claude Code** e/ou **Codex CLI** instalados
- **Git** configurado

### Comandos

```bash
# Criar projeto novo com wizard interativo
npx sinapse-ai init meu-projeto

# Instalar em projeto existente
cd seu-projeto && npx sinapse-ai install

# Atualizar instalacao existente
npx sinapse-ai@latest install

# Diagnostico completo
npx sinapse-ai doctor

# Diagnostico com auto-fix
npx sinapse-ai doctor --fix

# Informacoes do sistema
npx sinapse-ai info

# Remover instalacao
npx sinapse-ai uninstall
```

O wizard detecta seu ambiente, configura a IDE selecionada, instala os squads e ativa o Chrome Brain automaticamente.

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
sinapse chrome-brain install     # Instalar Chrome Brain
sinapse chrome-brain status      # Status do Chrome Brain
```

---

## Qualidade e Validacao

```bash
npm run lint           # ESLint
npm run typecheck      # TypeScript
npm test               # Testes
npm run test:coverage  # Cobertura
```

Pre-commit e pre-push hooks validam automaticamente antes de cada operacao.

---

## Estrutura do Projeto

```
sinapse-ai/
  .sinapse-ai/              # Core do framework
    core/                   # Modulos principais (orchestration, memory, permissions)
    data/                   # Knowledge base, entity registry
    development/            # Agents, tasks, templates, checklists, scripts
    infrastructure/         # CI/CD templates, scripts
  bin/                      # CLI executaveis (sinapse-init.js, sinapse.js)
  docs/                     # Documentacao
    stories/                # Development stories (active/, completed/)
  packages/                 # Shared packages
  squads/                   # Squad expansions
  tests/                    # Testes
```

---

## Claude Code vs Codex CLI

Ambas as IDEs suportam o ecossistema completo. A escolha depende do seu fluxo de trabalho:

| Funcionalidade | Claude Code | Codex CLI |
|---------------|:-----------:|:---------:|
| 18 squads, 175 agentes | SIM | SIM |
| Knowledge bases, tasks, workflows | SIM | SIM |
| Documentation-First Development | SIM | SIM |
| Chrome Brain | Auto-launch via hooks | Via MCP ou skill |
| Context engine dinamico | SIM | Parcial (via instructions) |
| Hooks (19 ativos) | SIM | Parcial (Bash only) |
| Skills nativas | NAO | SIM |
| Multi-model | NAO | SIM |
| CI/CD non-interactive | NAO | SIM (`codex exec`) |

**Claude Code** para experiencia integrada e automatizada.
**Codex CLI** para flexibilidade de modelo e automacao CI/CD.

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

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes completos sobre processo, code standards e guidelines.

---

## Legal

| Documento | Link |
|-----------|------|
| Licenca | [MIT](LICENSE) |
| Privacidade | [Politica de Privacidade](docs/legal/privacy.md) |
| Termos de Uso | [Termos](docs/legal/terms.md) |
| Seguranca | [SECURITY.md](SECURITY.md) |
| Codigo de Conduta | [Code of Conduct](CODE_OF_CONDUCT.md) |
| Contribuicao | [CONTRIBUTING.md](CONTRIBUTING.md) |

---

## Maintainers

- [@caioimori](https://github.com/caioimori) -- Lead Maintainer
- [@Matheus-soier](https://github.com/Matheus-soier) -- Co-Maintainer

---

[![Contributors](https://contrib.rocks/image?repo=caioimori/sinapse-ai)](https://github.com/caioimori/sinapse-ai/graphs/contributors)

---

Construido para quem constroi.

**[Voltar ao topo](#sinapse-ai)**
