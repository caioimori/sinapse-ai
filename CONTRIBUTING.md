# Contribuindo com o SINAPSE-AI

Bem-vindo ao **SINAPSE-AI** -- o sistema de orquestracao de agentes de IA para desenvolvimento full stack. Com **17 squads** e **172 agentes** (incluindo 12 agentes core), o SINAPSE transforma a forma como equipes constroem software.

Agradecemos seu interesse em contribuir. Este guia explica nosso fluxo de desenvolvimento, processo de contribuicao e como enviar suas mudancas.

---

## Indice

- [Inicio Rapido](#inicio-rapido)
- [Tipos de Contribuicao](#tipos-de-contribuicao)
- [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
- [Contribuindo com Agentes](#contribuindo-com-agentes)
- [Contribuindo com Tasks](#contribuindo-com-tasks)
- [Contribuindo com Squads](#contribuindo-com-squads)
- [Processo de Code Review](#processo-de-code-review)
- [Sistema de Validacao](#sistema-de-validacao)
- [Branch Protection e Requisitos de PR](#branch-protection-e-requisitos-de-pr)
- [Padroes de Codigo](#padroes-de-codigo)
- [Requisitos de Teste](#requisitos-de-teste)
- [Limites do Framework](#limites-do-framework)
- [Perguntas Frequentes](#perguntas-frequentes)
- [Obtendo Ajuda](#obtendo-ajuda)
- [Trabalhando com Pro](#trabalhando-com-pro)

---

## Inicio Rapido

### Pre-requisitos

- **Node.js** >= 18.0.0
- **npm**
- **Git**
- **Claude Code** ou **Codex CLI** (recomendado para desenvolvimento com agentes)
- **GitHub CLI** (`gh`) -- opcional mas recomendado

### 1. Fork e Clone

```bash
# Fork via interface do GitHub, depois clone seu fork
git clone https://github.com/SEU_USUARIO/sinapse-ai.git
cd sinapse-ai

# Adicione o remote upstream
git remote add upstream https://github.com/caioimori/sinapse-ai.git
```

### 2. Configurar Ambiente de Desenvolvimento

```bash
# Instalar dependencias
npm install

# Instalar SINAPSE no projeto (configura agentes, hooks e estrutura)
npx sinapse-ai install

# Verificar setup
npm test
npm run lint
npm run typecheck
```

### 3. Criar Branch de Trabalho

```bash
git checkout -b feat/nome-da-feature
```

**Convencoes de nomenclatura de branch:**

| Prefixo | Uso |
|---------|-----|
| `feat/` | Novas funcionalidades, agentes, tasks |
| `fix/` | Correcoes de bugs |
| `docs/` | Atualizacoes de documentacao |
| `test/` | Adicoes/melhorias de testes |
| `chore/` | Manutencao e tarefas auxiliares |

### 4. Fazer Suas Mudancas

Siga o guia relevante abaixo para seu tipo de contribuicao.

### 5. Executar Validacao Local

```bash
npm run lint      # Estilo de codigo
npm run typecheck # Verificacao de tipos
npm test          # Executar testes
```

### 6. Push e Criar PR

```bash
git push origin feat/nome-da-feature
```

Depois crie um Pull Request no GitHub apontando para a branch `main`.

---

## Tipos de Contribuicao

| Contribuicao | Descricao | Dificuldade |
|-------------|-----------|-------------|
| **Documentacao** | Corrigir erros, melhorar guias | Facil |
| **Bug Fixes** | Corrigir issues reportados | Facil-Media |
| **Tasks** | Adicionar novos workflows de task | Media |
| **Agentes** | Criar novas personas de agentes IA | Media |
| **Squads** | Pacote de agentes + tasks + workflows | Avancada |
| **Core Features** | Melhorias no framework | Avancada |

### Como comecar cada tipo

**Bug Fixes:**
1. Crie uma issue primeiro descrevendo o bug
2. Referencie a issue no seu PR
3. Inclua teste que reproduz o bug

**Novas Features:**
1. O SINAPSE segue o processo **Documentation-First** -- toda feature precisa de uma story antes da implementacao
2. Proponha via issue de Feature Request ou Discussion
3. Apos aprovacao, a story sera criada e a implementacao pode comecar

**Contribuicoes de Squad:**
1. Use o template de issue **Squad Proposal**
2. Descreva agentes, tasks e base de conhecimento propostos
3. Apos aprovacao dos maintainers, implemente seguindo a estrutura padrao

**Contribuicoes de Agentes e Tasks:**
1. Siga os schemas e templates existentes (veja secoes abaixo)
2. Garanta que o agente/task se integra com o ecossistema existente

**Documentacao:**
1. Sempre bem-vinda -- nao precisa de issue previa para correcoes pequenas
2. Para novos guias, abra uma Discussion primeiro

---

## Fluxo de Desenvolvimento

### Convencoes de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>: <descricao>

<corpo opcional>
```

**Tipos:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Exemplos:**

```bash
git commit -m "feat(agent): adicionar agente security-auditor"
git commit -m "fix: resolver memory leak no config loader"
git commit -m "docs: atualizar guia de contribuicao"
```

### Processo de Pull Request

1. **Criar PR** apontando para a branch `main`
2. **Checks automaticos** executam (lint, typecheck, test, manifest parity, install matrix)
3. **CodeRabbit review** fornece feedback automatizado por IA
4. **Review** -- ver secao "Co-Maintainers e Reviews" abaixo
5. **Merge** apos todos os checks de status obrigatorios passarem (status check `Validation Summary`)

---

## Co-Maintainers e Reviews

O SINAPSE-AI e mantido em colaboracao por dois co-maintainers com autoridade equivalente:

| Maintainer | GitHub | Responsabilidade |
|-----------|--------|------------------|
| Caio Imori | [@caioimori](https://github.com/caioimori) | Co-maintainer, owner do repo |
| Matheus Soier | [@Matheus-soier](https://github.com/Matheus-soier) | Co-maintainer |

### Politica de review

- **Required approving reviews em `main`: 0**. Confiamos nos status checks de CI (`Validation Summary` agrega lint, testes, manifest parity, security scans) e no CodeRabbit.
- **Code owners** ficam listados em `.github/CODEOWNERS` para *atribuicao opcional* de review e para guiar contribuidores externos. Nao bloqueiam merge.
- **Cada co-maintainer pode mergear o proprio PR** apos CI verde, sem depender do outro. Isso mantem o fluxo continuo quando um esta offline.
- **Auto-merge esta habilitado** -- ative com `gh pr merge --squash --auto` no momento da criacao do PR para mergear automaticamente quando CI passar.
- **Reviews mutuos sao incentivados** em mudancas estruturais (Constitution, core, install pipeline, security). Nao sao obrigatorios.

### Convencao de branches

| Quem | Padrao | Exemplo |
|------|--------|---------|
| Caio | `caio/{tipo}/{desc}` | `caio/feat/installer-ux` |
| Soier | `soier/{tipo}/{desc}` | `soier/fix/agent-config` |
| Contribuidor externo | `feat/{desc}`, `fix/{desc}` etc. (ver tabela acima) | `feat/new-squad` |
| Agente IA | `agent/{squad}/{tipo}-{desc}` | `agent/core/feat-dark-mode` |

### Operacoes destrutivas

`git push --force` em `main`, `git reset --hard` em commits publicos e delecao de branches com trabalho nao mergeado **exigem confirmacao explicita** entre os co-maintainers. Branch protection ja bloqueia force push e delecao em `main`.

### Releases

Releases em `latest` no NPM sao publicados via GitHub Actions com OIDC trusted publishing (`.github/workflows/npm-publish.yml`). Ambos co-maintainers podem disparar uma release publicando uma tag `vX.Y.Z`. Ver `docs/guides/release-process.md` (em construcao).

---

## Contribuindo com Agentes

Agentes sao personas de IA com expertise e comandos especificos.

### Localizacao do Arquivo

```
.sinapse-ai/development/agents/seu-agente.md
```

### Estrutura Obrigatoria

```yaml
agent:
  name: NomeDoAgente
  id: agent-id        # kebab-case, unico
  title: Titulo Descritivo
  icon: emoji
  whenToUse: 'Quando ativar este agente'

persona_profile:
  archetype: Builder | Analyst | Guardian | Operator | Strategist
  communication:
    tone: pragmatic | friendly | formal | analytical
    emoji_frequency: none | low | medium | high
    vocabulary:
      - termo-dominio-1
      - termo-dominio-2
    greeting_levels:
      minimal: 'Saudacao curta'
      named: 'Saudacao com nome e personalidade'
      archetypal: 'Saudacao completa arquetipal'
    signature_closing: 'Frase de assinatura'

persona:
  role: "Papel principal do agente"
  style: 'Estilo de comunicacao'
  identity: "Descricao da identidade do agente"
  focus: 'Foco principal do agente'
  core_principles:
    - Principio 1
    - Principio 2

commands:
  - help: Mostrar comandos disponiveis
  - custom-command: Descricao do comando

dependencies:
  tasks:
    - related-task.md
  tools:
    - nome-da-ferramenta
```

### Checklist de Contribuicao de Agentes

- [ ] Agent ID e unico e usa kebab-case
- [ ] `persona_profile` esta completo com archetype e communication
- [ ] Todos os comandos tem descricoes
- [ ] Dependencias listam todas as tasks necessarias
- [ ] Sem credenciais ou dados sensiveis hardcoded
- [ ] Segue padroes existentes no codebase

---

## Contribuindo com Tasks

Tasks sao workflows executaveis que agentes podem rodar.

### Localizacao do Arquivo

```
.sinapse-ai/development/tasks/sua-task.md
```

### Estrutura Obrigatoria

```markdown
# Nome da Task

**Descricao:** O que esta task faz
**Agente(s):** @developer, @quality-gate, etc.
**Elicit:** true | false

---

## Pre-requisitos

- Pre-requisito 1
- Pre-requisito 2

## Passos

### Passo 1: Primeiro Passo
Descricao do que fazer.

### Passo 2: Segundo Passo
Continue com mais passos...

## Entregas

- [ ] Entrega 1
- [ ] Entrega 2

## Tratamento de Erros

Se X acontecer, faca Y.

---

## Dependencias

- `dependencia-1.md`
- `dependencia-2.md`
```

### Checklist de Contribuicao de Tasks

- [ ] Task tem descricao e proposito claros
- [ ] Passos sao sequenciais e logicos
- [ ] Pontos de elicitacao sao claros (se aplicavel)
- [ ] Entregas estao bem definidas
- [ ] Orientacao de tratamento de erros incluida
- [ ] Dependencias existem no codebase

---

## Contribuindo com Squads

Squads sao pacotes de agentes, tasks e workflows relacionados.

### Estrutura de um Squad

```
seu-squad/
  manifest.yaml       # Metadados do squad
  agents/
    seu-agente.md
  tasks/
    sua-task.md
  workflows/
    seu-workflow.yaml
```

### Manifesto do Squad

```yaml
name: seu-squad
version: 1.0.0
description: O que este squad faz
author: Seu Nome
dependencies:
  - base-squad (opcional)
agents:
  - seu-agente
tasks:
  - sua-task
```

### Recursos para Squads

- [Guia de Squads](docs/guides/squads-guide.md) -- Documentacao completa
- [Template de Squad](.sinapse-ai/development/templates/squad-template/) -- Comece de um template funcional
- [Discussoes de Squads](https://github.com/caioimori/sinapse-ai/discussions/categories/ideas) -- Compartilhe ideias

---

## Processo de Code Review

### Checks Automaticos

Quando voce envia um PR, os seguintes checks executam automaticamente:

| Check | Descricao | Obrigatorio |
|-------|-----------|-------------|
| **ESLint** | Estilo e qualidade de codigo | Sim |
| **TypeScript** | Verificacao de tipos | Sim |
| **Jest Tests** | Suite de testes (Node 18 e 20) | Sim |
| **Validation Summary** | Gate agregado | Sim |
| **Build** | Verificacao de build | Nao (advisory) |
| **Coverage** | Relatorio de cobertura | Nao (advisory) |

### CodeRabbit AI Review

[CodeRabbit](https://coderabbit.ai) automaticamente revisa seu PR e fornece feedback sobre:

- Qualidade de codigo e boas praticas
- Preocupacoes de seguranca
- Padroes especificos do SINAPSE (agentes, tasks, workflows)
- Problemas de performance

| Severidade | Acao Necessaria |
|-----------|-----------------|
| **CRITICAL** | Deve corrigir antes do merge |
| **HIGH** | Fortemente recomendado corrigir |
| **MEDIUM** | Considerar corrigir ou documentar como tech debt |
| **LOW** | Melhoria opcional |

### Review de Maintainer

Apos os checks automaticos passarem, um maintainer ira:

1. Verificar se as mudancas atendem os padroes do projeto
2. Checar implicacoes de seguranca
3. Garantir que a documentacao foi atualizada
4. Aprovar ou solicitar mudancas

### Requisitos de Merge

- [ ] Todos os checks de CI passam
- [ ] Pelo menos 1 aprovacao de maintainer
- [ ] Todas as conversas resolvidas
- [ ] Sem conflitos de merge
- [ ] Branch esta atualizada com main

---

## Sistema de Validacao

O SINAPSE implementa uma estrategia de **Defesa em Profundidade** com 3 camadas de validacao:

### Camada 1: Pre-commit (Local)

**Performance:** < 5 segundos

- ESLint com cache
- TypeScript incremental
- IDE sync (auto-stage de arquivos de comando da IDE)

### Camada 2: Pre-push (Local)

**Performance:** < 2 segundos

- Validacao de checkboxes de story
- Verificacao de consistencia de status

### Camada 3: CI/CD (Cloud)

**Performance:** 2-5 minutos

- Lint e type checking completo
- Suite completa de testes
- Relatorio de cobertura
- Validacao de story
- Regras de branch protection

---

## Branch Protection e Requisitos de PR

Todas as mudancas em `main` devem passar por um Pull Request. Pushes diretos sao bloqueados.

### Status Checks Obrigatorios

| Check | Descricao |
|-------|-----------|
| **ESLint** | Estilo e qualidade de codigo |
| **TypeScript Type Checking** | Sem erros de tipo |
| **Jest Tests (Node 18)** | Suite completa em Node 18 |
| **Jest Tests (Node 20)** | Suite completa em Node 20 |
| **Validation Summary** | Gate agregado |

### Regras de Review de PR

- **1 aprovacao necessaria** de um reviewer CODEOWNERS
- **Reviews obsoletos sao descartados** quando novos commits sao pushados
- **Resolucao de conversas obrigatoria** -- todos os threads de review devem ser resolvidos
- **Review de CODEOWNERS obrigatorio** -- mudancas em caminhos criticos precisam da aprovacao do owner designado

### CODEOWNERS

Caminhos criticos requerem aprovacao de `@caioimori @eusoier`:

| Caminho | Razao |
|---------|-------|
| `.sinapse-ai/core/orchestration/` | Camada de orquestracao |
| `.sinapse-ai/core/execution/` | Motor de execucao |
| `packages/` | Installer, CLI, bibliotecas compartilhadas |
| `.github/` | CI/CD workflows, branch protection |
| `.sinapse-ai/core-config.yaml` | Configuracao do framework |

### Force Push e Delecoes

- **Force push para main:** Bloqueado
- **Delecoes de branch:** Bloqueado
- **Admin bypass:** Desabilitado

---

## Padroes de Codigo

### JavaScript/TypeScript

- **Runtime:** ES2022
- **Modulos:** CommonJS (CJS)
- **Indentacao:** 2 espacos
- **Aspas:** Simples (single quotes)
- **Ponto e virgula:** Obrigatorio
- Preferir `const` sobre `let`
- Usar async/await sobre promises
- Adicionar JSDoc para APIs publicas
- Seguir o estilo existente no codebase

### Organizacao de Arquivos

```
.sinapse-ai/
  development/
    agents/        # Definicoes de agentes
    tasks/         # Workflows de tasks
    workflows/     # Workflows multi-step
  core/            # Utilidades core
  product/
    templates/     # Templates de documentos

docs/
  guides/          # Guias do usuario
  architecture/    # Arquitetura do sistema
```

### ESLint e TypeScript

- Extends: `eslint:recommended`, `@typescript-eslint/recommended`
- Target: ES2022
- Strict mode habilitado
- Sem `console.log` em producao (warnings)

---

## Requisitos de Teste

### Cobertura Minima

- **Minimo:** 80% de cobertura (branches, functions, lines, statements)
- **Testes Unitarios:** Obrigatorios para todas as novas funcoes
- **Testes de Integracao:** Obrigatorios para workflows

### Executando Testes

```bash
npm test                    # Executar todos os testes
npm run test:coverage       # Com relatorio de cobertura
npm test -- path/to/test.js # Arquivo especifico
```

---

## Limites do Framework

O SINAPSE usa um modelo de 4 camadas para separar artefatos do framework e do projeto:

| Camada | Mutabilidade | Contribuicoes |
|--------|-------------|---------------|
| **L1** Framework Core | NUNCA modificar | `.sinapse-ai/core/` -- protegido, nao aceita PRs externos |
| **L2** Framework Templates | NUNCA modificar | Tasks, templates, checklists -- extend-only |
| **L3** Project Config | Mutavel (excecoes) | `.sinapse-ai/data/`, configs |
| **L4** Project Runtime | SEMPRE modificar | `docs/`, `packages/`, `tests/` -- onde contribuicoes acontecem |

**Importante:** PRs que modificam arquivos L1 ou L2 serao rejeitados automaticamente. Contribuicoes de agentes, tasks e squads sao muito bem-vindas nas camadas L3/L4.

---

## Perguntas Frequentes

### P: Quanto tempo leva o review?

**R:** Buscamos primeiro review em 24-48 horas. Mudancas complexas podem levar mais.

### P: Posso contribuir sem testes?

**R:** Testes sao fortemente encorajados. Para mudancas apenas de documentacao, testes podem nao ser necessarios.

### P: E se meu PR tiver conflitos?

**R:** Faça rebase da sua branch no main mais recente:

```bash
git fetch upstream
git rebase upstream/main
git push --force-with-lease
```

### P: Posso contribuir em ingles?

**R:** Sim. Aceitamos PRs em portugues e ingles.

### P: Como me torno maintainer?

**R:** Contribuicoes consistentes e de alta qualidade ao longo do tempo. Comece com pequenas correcoes e avance para features maiores.

### P: Meus checks de CI estao falhando. O que fazer?

**R:** Verifique os logs do GitHub Actions:

```bash
gh pr checks  # Ver status dos checks do PR
```

Correcoes comuns:
- Execute `npm run lint -- --fix` para problemas de estilo
- Execute `npm run typecheck` para ver erros de tipo
- Garanta que testes passam localmente antes de fazer push

---

## Obtendo Ajuda

- **GitHub Issues:** [Abrir uma issue](https://github.com/caioimori/sinapse-ai/issues)
- **Discussions:** [Iniciar uma discussao](https://github.com/caioimori/sinapse-ai/discussions)

---

## Trabalhando com Pro

SINAPSE usa um modelo Open Core com um submodulo git privado `pro/`.

### Para Contribuidores Open-Source

**Voce NAO precisa do submodulo pro/.** O clone padrao funciona perfeitamente:

```bash
git clone https://github.com/caioimori/sinapse-ai.git
cd sinapse-ai
npm install && npm test  # Todos os testes passam sem pro/
```

O diretorio `pro/` simplesmente nao existira no seu clone -- isso e esperado e todas as features, testes e CI passam sem ele.

#### Workflow de Fork

Ao fazer fork e sincronizar com upstream, **NAO use `--recurse-submodules`**:

```bash
# Fork via interface do GitHub, depois clone (sem submodulos)
git clone https://github.com/<seu-fork>/sinapse-ai.git
cd sinapse-ai

# Adicionar upstream e sincronizar
git remote add upstream https://github.com/caioimori/sinapse-ai.git
git fetch upstream
git rebase upstream/main

# Push (use --force-with-lease apos rebase)
git push --force-with-lease origin main
```

> **Erro de push de submodulo?** Se voce vir `remote: fatal: did not receive expected object` ao fazer push apos sincronizar, significa que o ponteiro do submodulo `pro/` mudou no upstream e seu fork nao consegue resolver a referencia privada.
>
> **Se seu fork ja teve um push bem-sucedido antes:**
> ```bash
> git checkout origin/main -- pro
> git commit -m "chore: reset pro submodule pointer for fork"
> git push origin main
> ```
>
> **Se este e um fork novo:**
> ```bash
> git rm --cached pro
> git commit -m "chore: remove pro submodule reference for fork"
> git push origin main
> ```

### Para Membros da Equipe (com Acesso Pro)

```bash
# Clone com submodulo
git clone --recurse-submodules https://github.com/caioimori/sinapse-ai.git

# Ou adicionar a clone existente
git submodule update --init pro
```

**Ordem de push:** Sempre faca push das mudancas de `pro/` primeiro, depois `sinapse-ai`.

---

## Recursos Adicionais

- [Guia de Squads](docs/guides/squads-guide.md) -- Criar equipes de agentes
- [Arquitetura](docs/framework/core-architecture.md) -- Design do sistema

---

**Obrigado por contribuir com o SINAPSE-AI!**
