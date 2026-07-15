<!--
  Tradução: PT-BR
  Original: /docs/guides/user-guide.md
  Última sincronização: 2026-01-29
-->

# Guia do Usuário SINAPSE

> **PT-BR**

---

Guia completo para usar o SINAPSE - o Sistema Orquestrado por IA para Desenvolvimento Full Stack.

**Versão:** 1.21.0
**Última Atualização:** 2026-07-02

---

## Início Rápido

### Pré-requisitos

Antes de usar o SINAPSE, certifique-se de ter:

- **Node.js** versão 18.0.0 ou superior
- **npm** versão 9.0.0 ou superior
- **Git** para controle de versão
- Uma chave de API de provedor de IA (Anthropic, OpenAI ou compatível)

### Instalação

```bash
# Novo projeto (Greenfield)
npx sinapse-ai init my-project

# Projeto existente (Brownfield)
cd existing-project
npx sinapse-ai install
```

### Primeiros Passos

```bash
# Navegue até seu projeto
cd my-project

# Liste agentes disponíveis
npx sinapse-ai agents list

# Claude Code: ative um agente
@developer

# Obtenha ajuda
*help
```

No Codex, use `$snps` para roteamento ou `$sinapse-agent developer` para ativação direta.

---

## Conceitos Fundamentais

### Filosofia

> **"Estrutura é Sagrada. Tom é Flexível."**

O SINAPSE fornece estrutura orquestrada enquanto permite flexibilidade na comunicação. Isso significa:

- **Fixo:** Posições de templates, ordem de seções, formatos de métricas, estrutura de arquivos, workflows
- **Flexível:** Mensagens de status, escolhas de vocabulário, uso de emojis, personalidade, tom

### A Diferença do SINAPSE

| Desenvolvimento Tradicional com IA | SINAPSE                                        |
| ---------------------------------- | ------------------------------------------- |
| Agentes descoordenados             | 172 agentes especializados em 17 squads     |
| Resultados inconsistentes          | Workflows estruturados com quality gates    |
| Contexto perdido entre sessões     | Memória persistente e aprendizado           |
| Reinventando a roda                | Tasks, workflows e squads reutilizáveis     |

---

## Agentes

O SINAPSE inclui 172 agentes especializados em 17 squads. A tabela abaixo destaca os agentes core de desenvolvimento:

Os IDs da tabela usam a sintaxe `@agent-name` do Claude Code. No Codex, use
`$sinapse-agent agent-id`; para o orquestrador principal, use `$snps`.

| Agente    | ID               | Arquétipo    | Responsabilidade          |
| --------- | ---------------- | ------------ | ------------------------- |
| **Pixel** | `@developer` | Construtor   | Implementação de código   |
| **Litmus** | `@quality-gate` | Guardião     | Garantia de qualidade     |
| **Stratum** | `@architect` | Arquiteto    | Arquitetura técnica       |
| **Axis** | `@product-lead` | Visionário   | Backlog do produto        |
| **Beacon** | `@project-lead` | Equilibrador | Estratégia do produto     |
| **Sync** | `@sprint-lead` | Facilitador  | Facilitação de processos  |
| **Scope** | `@analyst` | Explorador   | Análise de negócios       |
| **Tensor** | `@data-engineer` | Arquiteto    | Engenharia de dados       |
| **Pipeline** | `@devops` | Otimizador   | CI/CD e operações         |
| **Mosaic** | `@ux-design-expert` | Criador      | Experiência do usuário    |
| **Imperator** | `@snps-orqx` | Orquestrador | Orquestração do framework |

### Ativação de Agentes

```bash
# Claude Code: ative um agente usando sintaxe @
@developer                # Ativar Pixel (Desenvolvedor)
@quality-gate                 # Ativar Litmus (QA)
@architect          # Ativar Stratum (Arquiteto)
@snps-orqx        # Ativar Imperator (Orquestrador)

# Comandos de agente usam prefixo *
*help               # Mostrar comandos disponíveis
*task <name>        # Executar task específica
*exit               # Desativar agente
```

Ativação no Codex:

```text
$snps
$sinapse-agent developer
```

### Contexto do Agente

Quando um agente está ativo:

- Siga a persona e expertise específicas daquele agente
- Use os padrões de workflow designados do agente
- Mantenha a perspectiva do agente durante toda a interação

---

## Tasks

Tasks são o ponto de entrada principal no SINAPSE. Tudo é uma task.

### Arquitetura Task-First

```
Requisição do Usuário --> Task --> Execução do Agente --> Saída
                           |
                      Workflow (se multi-etapa)
```

### Executando Tasks

```bash
# Executar uma task específica
*task develop-story --story=1.1

# Listar tasks disponíveis
sinapse tasks list

# Obter ajuda da task
*task --help
```

### Categorias de Tasks

| Categoria           | Exemplos                                |
| ------------------- | --------------------------------------- |
| **Desenvolvimento** | develop-story, code-review, refactor    |
| **Qualidade**       | run-tests, validate-code, security-scan |
| **Documentação**    | generate-docs, update-readme            |
| **Workflow**        | create-story, manage-sprint             |

---

## Workflows

Workflows orquestram múltiplas tasks e agentes para operações complexas.

### Workflows Disponíveis

| Workflow                  | Caso de Uso                           |
| ------------------------- | ------------------------------------- |
| `greenfield-ui`           | Novo site / landing page / app        |
| `greenfield-fullstack`    | Nova plataforma / SaaS                |
| `greenfield-service`      | Nova API / serviço de backend         |
| `brownfield-fullstack`    | Adicionar SINAPSE a projeto existente |
| `spec-pipeline`           | Briefing complexo (spec primeiro)     |
| `story-development-cycle` | Implementar uma única story           |

### Executando Workflows

Você não chama os workflows pelo nome — descreva o que quer e o SINAPSE escolhe
o certo (greenfield vs brownfield, UI vs fullstack vs service).

```bash
# Descreva o projeto — o SINAPSE classifica e roda o workflow certo
sinapse build "nova plataforma SaaS para gestão de academia"

# Veja qual workflow um briefing dispararia (sem executar)
sinapse route "adicionar dark mode na plataforma"

# Rodar o ciclo de desenvolvimento de uma story existente
sinapse orchestrate <story-id>
```

### Orchestrate — Escopo Suportado (Medido)

O `sinapse orchestrate` é confiável para **1 story por vez**. Orquestração
autônoma de múltiplas stories encadeadas no mesmo diretório de trabalho **não é
suportada** — isso foi medido diretamente (fluxo nativo: 3/3 stories, 64s, 1
chamada; o pipeline orchestrate: 1/3 stories, ~13,5min, com contaminação de
estado entre stories) e o caminho multi-story autônomo foi abandonado em favor
do fluxo nativo. Detalhes completos: [KNOWN-LIMITATIONS.md](https://github.com/caioimori/sinapse-ai/blob/main/docs/epics/epic-orchestration-consolidation/KNOWN-LIMITATIONS.md).

| Uso                                                  | Suportado?                  |
| ------------------------------------------------------ | ---------------------------- |
| `orchestrate` de **1 story** (spec + plano + build)     | ✅ Sim, confiável             |
| `orchestrate` de **múltiplas stories** encadeadas       | ❌ Não — use o caminho nativo |

---

## Squads

Squads são equipes modulares de agentes de IA que estendem a funcionalidade do SINAPSE.

### O que é um Squad?

Um squad é um pacote autocontido contendo:

| Componente    | Propósito                               |
| ------------- | --------------------------------------- |
| **Agents**    | Personas de IA específicas do domínio   |
| **Tasks**     | Workflows executáveis                   |
| **Workflows** | Orquestrações multi-etapa               |
| **Config**    | Padrões de código, tech stack           |
| **Templates** | Templates de geração de documentos      |
| **Tools**     | Integrações de ferramentas customizadas |

### Níveis de Distribuição

```
Nível 1: LOCAL        --> ./squads/        (hoje — gerenciado no seu projeto)
Nível 2: REGISTRY     --> compartilhamento (roadmap)
Nível 3: MARKETPLACE  --> squads pagos     (roadmap)
```

### Usando Squads

Os squads ficam no diretório `squads/` do seu projeto. Para adicionar um, coloque
a pasta dele ali; para construir um novo, gere-o com o agente squad-creator:

```bash
# Criar seu próprio squad
@squad-creator
*create-squad my-custom-squad
```

> A distribuição remota de squads (navegar / baixar de um registro) está no
> roadmap — hoje os squads são gerenciados diretamente em `squads/`.

### Squads Oficiais

| Squad           | Descrição                          |
| --------------- | ---------------------------------- |
| `etl-squad`     | Coleta e transformação de dados    |
| `creator-squad` | Utilitários de geração de conteúdo |

---

## Uso Básico

### Estrutura do Projeto

```
my-project/
├── .sinapse-ai/                # Configuração do framework
│   ├── development/agents/    # Definições de agentes
│   ├── development/tasks/     # Workflows de tasks
│   ├── product/templates/     # Templates de documentos
│   └── product/checklists/    # Checklists de validação
├── docs/
│   ├── stories/               # Stories de desenvolvimento
│   ├── architecture/          # Arquitetura do sistema
│   └── guides/                # Guias do usuário
├── squads/                    # Squads locais
└── src/                       # Código fonte da aplicação
```

### Comandos Comuns

```bash
# Comandos do SINAPSE Master
*help                # Mostrar comandos disponíveis
*create-story        # Criar nova story
*task {name}         # Executar task específica
*workflow {name}     # Executar workflow

# Comandos de Desenvolvimento
npm run dev          # Iniciar desenvolvimento
npm test             # Executar testes
npm run lint         # Verificar estilo de código
npm run build        # Build do projeto
```

### Desenvolvimento Orientado a Stories

1. **Criar uma story** - Use `*create-story` para definir requisitos
2. **Trabalhar a partir de stories** - Todo desenvolvimento começa com uma story em `docs/stories/`
3. **Atualizar progresso** - Marque checkboxes conforme tasks completam: `[ ]` --> `[x]`
4. **Rastrear mudanças** - Mantenha a seção File List na story
5. **Seguir critérios** - Implemente exatamente o que os critérios de aceitação especificam

---

## Configuração

### Arquivo Principal de Configuração

A configuração principal está em `.sinapse-ai/core/config/`:

```yaml
# sinapse.config.yaml
version: 2.1.0
projectName: my-project

features:
  - agents
  - tasks
  - workflows
  - squads
  - quality-gates

ai:
  provider: anthropic
  model: opus # alias de família (opus | sonnet | haiku) — o CLI resolve a versão atual; nunca fixe um id datado

environment: development
```

### Variáveis de Ambiente

```bash
# Configuração do Provedor de IA
ANTHROPIC_API_KEY=sua-chave-anthropic-api
# ou
OPENAI_API_KEY=sua-chave-openai-api

# Configurações do Framework
NODE_ENV=development
SINAPSE_DEBUG=false
```

### Integração com Provedores

O SINAPSE sincroniza os mesmos agentes canônicos para os dois provedores suportados:

- Agentes do Claude Code: `.claude/agents/` (ative com `@developer`)
- Agentes e skills do Codex: `.codex/agents/` e `.agents/skills/` (ative com `$snps` ou `$sinapse-agent developer`)

```bash
# Sincronizar adapters do Claude Code e Codex
npm run sync:ide
```

---

## Solução de Problemas

### Problemas Comuns

**Agente não ativa**

```bash
# Verificar se agente existe
ls .sinapse-ai/development/agents/

# Verificar configuração
sinapse doctor
```

**Execução de task falha**

```bash
# Verificar definição da task
cat .sinapse-ai/development/tasks/{task-name}.md

# Executar com saída verbose
*task {name} --verbose
```

**Problemas de memória/contexto**

```bash
# Limpar cache
rm -rf .sinapse-ai/core/cache/*

# Reconstruir índice
sinapse rebuild
```

### Obtendo Ajuda

- **GitHub Discussions**: [github.com/caioimori/sinapse-ai/discussions](https://github.com/caioimori/sinapse-ai/discussions)
- **Issue Tracker**: [github.com/caioimori/sinapse-ai/issues](https://github.com/caioimori/sinapse-ai/issues)
- **Discord**: [Entre no nosso servidor](https://discord.gg/gk8jAdXWmj)

---

## Próximos Passos

### Caminho de Aprendizado

1. **Início Rápido** - Siga este guia para começar
2. **Referência de Agentes** - Aprenda sobre as capacidades de cada agente: [Guia de Referência de Agentes](../agent-reference-guide.md)
3. **Arquitetura** - Entenda o sistema: [Visão Geral da Arquitetura](../architecture/ARCHITECTURE-INDEX.md)
4. **Squads** - Estenda funcionalidades: [Guia de Squads](./squads-guide.md)

### Tópicos Avançados

- [Guia de Quality Gates](./quality-gates.md)
- [Estratégia Multi-Repo](../architecture/multi-repo-strategy.md)
- [Integração MCP](./mcp-global-setup.md)
- [Integração com IDE](../../ide-integration.md)

---

## Melhores Práticas

### 1. Comece com Stories

Sempre crie uma story antes de implementar funcionalidades:

```bash
@snps-orqx
*create-story
```

### 2. Use o Agente Certo

Escolha o agente apropriado para cada task:

| Task               | Agente     |
| ------------------ | ---------- |
| Escrever código    | @developer       |
| Revisar código     | @quality-gate        |
| Projetar sistema   | @architect |
| Definir requisitos | @product-lead        |

### 3. Siga Quality Gates

O SINAPSE implementa quality gates em 3 camadas:

1. **Camada 1 (Local)**: Hooks de pre-commit, linting, verificação de tipos
2. **Camada 2 (CI/CD)**: Testes automatizados, review do CodeRabbit
3. **Camada 3 (Humano)**: Review de arquitetura, aprovação final

### 4. Mantenha o Contexto

Mantenha o contexto entre sessões:

- Usando desenvolvimento orientado a stories
- Atualizando checkboxes de progresso
- Documentando decisões nas stories

### 5. Aproveite os Squads

Não reinvente a roda — explore os squads que já vêm em `squads/` antes de
construir um agente novo do zero.

---

## Documentação Relacionada

- [Primeiros Passos](../getting-started.md)
- [Guia de Instalação](../installation/README.md)
- [Guia de Referência de Agentes](../agent-reference-guide.md)
- [Visão Geral da Arquitetura](../architecture/ARCHITECTURE-INDEX.md)
- [Guia de Squads](./squads-guide.md)
- [Solução de Problemas](../troubleshooting.md)

---

_Guia do Usuário SINAPSE v1.21.0_
