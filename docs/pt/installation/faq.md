<!--
  Tradução: PT-BR
  Original: /docs/en/installation/faq.md
  Última sincronização: 2026-01-26
-->

# FAQ do SINAPSE

> 🌐 [EN](../../installation/faq.md) | **PT**

---

**Versão:** 2.1.0
**Última Atualização:** 2025-01-24

---

## Sumário

- [Perguntas sobre Instalação](#perguntas-sobre-instalação)
- [Atualizações e Manutenção](#atualizações-e-manutenção)
- [Uso Offline e Air-Gapped](#uso-offline-e-air-gapped)
- [IDE e Configuração](#ide-e-configuração)
- [Agentes e Workflows](#agentes-e-workflows)
- [Squads](#squads)
- [Uso Avançado](#uso-avançado)

---

## Perguntas sobre Instalação

### Q1: Por que npx ao invés de npm install -g?

**Resposta:** Recomendamos `npx sinapse-ai install` ao invés de instalação global por várias razões:

1. **Sempre a Versão Mais Recente**: npx baixa a versão mais recente automaticamente
2. **Sem Poluição Global**: Não adiciona aos seus pacotes npm globais
3. **Isolamento de Projeto**: Cada projeto pode ter sua própria versão
4. **Sem Problemas de Permissão**: Evita problemas comuns de permissão npm global
5. **Amigável para CI/CD**: Funciona perfeitamente em pipelines automatizados

**Se você preferir instalação global:**

```bash
npm install -g sinapse-ai
sinapse-ai install
```

---

### Q2: Quais são os requisitos de sistema?

**Resposta:**

| Componente     | Mínimo                             | Recomendado     |
| -------------- | ---------------------------------- | --------------- |
| **Node.js**    | 18.0.0                             | 20.x LTS        |
| **npm**        | 9.0.0                              | 10.x            |
| **Espaço em Disco** | 100 MB                        | 500 MB          |
| **RAM**        | 2 GB                               | 8 GB            |
| **SO**         | Windows 10, macOS 12, Ubuntu 20.04 | Versões mais recentes |

**Verifique seu sistema:**

```bash
node --version  # Deve ser 18+
npm --version   # Deve ser 9+
```

---

### Q3: Posso instalar o SINAPSE em um projeto existente?

**Resposta:** Sim! O SINAPSE foi projetado tanto para projetos greenfield quanto brownfield.

**Para projetos existentes:**

```bash
cd /path/to/existing-project
npx sinapse-ai install
```

O instalador irá:

- Criar o diretório `.sinapse-ai/` (arquivos do framework)
- Criar adapters do Claude Code e Codex (`.claude/`, `.codex/` e `.agents/skills/`)
- NÃO modificar seu código-fonte existente
- NÃO sobrescrever documentação existente a menos que você escolha

**Importante:** Diretórios existentes dos provedores são reconciliados de forma conservadora; mantenha arquivos customizados fora dos nomes gerenciados pelo framework.

---

### Q4: Quanto tempo leva a instalação?

**Resposta:**

| Cenário                 | Tempo         |
| ----------------------- | ------------- |
| **Primeira instalação** | 2-5 minutos   |
| **Atualizar existente** | 1-2 minutos   |
| **Apenas Squad**        | 30-60 segundos |

Fatores que afetam o tempo de instalação:

- Velocidade da conexão de internet
- Status do cache npm
- Número de IDEs selecionadas
- Squads selecionados

---

### Q5: Quais arquivos o SINAPSE cria no meu projeto?

**Resposta:** O SINAPSE cria a seguinte estrutura:

```text
your-project/
├── .sinapse-ai/                 # Runtime, configuração e assets de desenvolvimento
│   └── core-config.yaml         # Configuração do framework
│
├── .claude/                    # Claude Code (se selecionado)
│   ├── agents/                 # Adapters de agentes nativos do Claude
│   └── skills/                 # Skills do Claude Code
│
├── .codex/                     # Codex (se selecionado)
│   └── agents/                 # Descritores de agentes nativos do Codex
│
├── .agents/skills/             # Skills SINAPSE compatíveis com Codex
│
├── docs/                       # Estrutura de documentação
│   ├── stories/                # Stories de desenvolvimento
│   ├── architecture/           # Docs de arquitetura
│   └── prd/                    # Requisitos de produto
│
└── squads/                      # 17 squads e seus assets
```

---

## Atualizações e Manutenção

### Q6: Como atualizo o SINAPSE para a versão mais recente?

**Resposta:**

```bash
# Atualizar via npx (recomendado)
npx sinapse-ai update

# Ou reinstalar a versão mais recente
npx sinapse-ai install --force-upgrade

# Verificar versão atual
npx sinapse-ai status
```

**O que é atualizado:**

- Arquivos `.sinapse-ai/` (agentes, tarefas, templates)
- Configurações de IDE
- Squads (se instalados)

**O que é preservado:**

- Suas modificações customizadas em `core-config.yaml`
- Sua documentação (`docs/`)
- Seu código-fonte

---

### Q7: Com que frequência devo atualizar?

**Resposta:** Recomendamos:

| Tipo de Atualização    | Frequência  | Comando                         |
| ---------------------- | ----------- | ------------------------------- |
| **Patches de segurança** | Imediatamente | `npx sinapse-ai update` |
| **Atualizações menores** | Mensalmente | `npx sinapse-ai update` |
| **Versões maiores**    | Trimestralmente | Revisar changelog primeiro    |

**Verificar atualizações:**

```bash
npm show sinapse-ai version
npx sinapse-ai status
```

---

### Q8: Posso fazer rollback para uma versão anterior?

**Resposta:** Sim, várias opções:

**Opção 1: Reinstalar versão específica**

```bash
npx sinapse-ai@1.1.0 install --force-upgrade
```

**Opção 2: Usar Git para restaurar**

```bash
# Se .sinapse-ai está no controle de versão
git checkout HEAD~1 -- .sinapse-ai/
```

**Opção 3: Restaurar do backup**

```bash
# O instalador cria backups
mv .sinapse-ai .sinapse-ai.failed
mv .sinapse-ai.backup .sinapse-ai
```

---

## Uso Offline e Air-Gapped

### Q9: Posso usar o SINAPSE sem internet?

**Resposta:** Sim, com alguma preparação:

**Configuração inicial (requer internet):**

```bash
# Instalar uma vez com internet
npx sinapse-ai install

# Empacotar para uso offline
tar -czvf sinapse-offline.tar.gz .sinapse-ai/ .claude/ .codex/ .agents/ squads/
```

**Na máquina air-gapped:**

```bash
# Extrair o pacote
tar -xzvf sinapse-offline.tar.gz

# Os agentes SINAPSE funcionam sem internet
# (Eles não requerem chamadas de API externas)
```

**Limitações sem internet:**

- Não é possível atualizar para novas versões
- Integrações MCP (ClickUp, GitHub) não funcionarão
- Não é possível buscar documentação de bibliotecas (Context7)

---

### Q10: Como transfiro o SINAPSE para um ambiente air-gapped?

**Resposta:**

1. **Na máquina conectada:**

   ```bash
   # Instalar e empacotar
   npx sinapse-ai install
   cd your-project
   tar -czvf sinapse-transfer.tar.gz .sinapse-ai/ .claude/ .codex/ .agents/ squads/ docs/
   ```

2. **Transferir o arquivo** via USB, transferência segura, etc.

3. **Na máquina air-gapped:**

   ```bash
   cd your-project
   tar -xzvf sinapse-transfer.tar.gz
   ```

4. **Configurar IDE manualmente** se necessário (os caminhos podem diferir)

---

## IDE e Configuração

### Q11: Quais IDEs o SINAPSE suporta?

**Resposta:**

| IDE                | Status         | Ativação de Agentes |
| ------------------ | -------------- | ------------------- |
| **Claude Code**    | Suporte Completo | `@developer`, `@quality-gate`, etc. |
| **Codex CLI**      | Suporte Completo | `$snps` ou `$sinapse-agent <id>` |

---

### Q12: Posso configurar o SINAPSE para múltiplas IDEs?

**Resposta:** Sim. Claude Code e Codex podem usar a mesma instalação canônica
do SINAPSE. Execute `npx sinapse-ai install`; o instalador gera os adapters
nativos de cada provedor:

- Agentes do Claude Code: `.claude/agents/`
- Agentes do Codex: `.codex/agents/`
- Skills do Codex: `.agents/skills/`

Ative com `@developer` no Claude Code ou `$sinapse-agent developer` no Codex.
Use `$snps` no Codex quando quiser que o orquestrador principal roteie o pedido.

---

### Q13: Como configuro o SINAPSE para um novo membro da equipe?

**Resposta:**

Se `.sinapse-ai/` está commitado no seu repositório:

```bash
# Novo membro da equipe apenas clona
git clone your-repo
cd your-repo

# Gerar ou reconciliar os adapters do Claude Code e Codex
npx sinapse-ai install
```

Se `.sinapse-ai/` não está commitado:

```bash
git clone your-repo
cd your-repo
npx sinapse-ai install
```

**Melhor prática:** Commitar `.sinapse-ai/` para compartilhar configurações de agentes consistentes.

---

## Agentes e Workflows

### Q14: Quais agentes estão incluídos?

**Resposta:** O SINAPSE inclui **172 agentes em 17 squads**. A camada de squads
reúne 160 membros e a camada do framework reúne 12. O conjunto do framework é:

| Agente | Persona | Papel |
| ------ | ------- | ----- |
| `snps-orqx` | Imperator | Orquestrador principal cross-squad |
| `developer` | Pixel | Implementação full-stack e debugging |
| `quality-gate` | Litmus | Testes, revisão e quality gates |
| `architect` | Stratum | Arquitetura e decisões de tecnologia |
| `project-lead` | Beacon | Product management e epics |
| `product-lead` | Axis | Validação de stories e priorização |
| `sprint-lead` | Sync | Criação de stories e facilitação de sprints |
| `analyst` | Scope | Pesquisa e análise de negócios |
| `data-engineer` | Tensor | Database design, migrations e RLS |
| `ux-design-expert` | Mosaic | UX/UI e design systems |
| `devops` | Pipeline | CI/CD, autoridade exclusiva de push e releases |
| `squad-creator` | Loom | Criação e extensão de squads |

No Claude Code, ative um agente com `@agent-id`. No Codex, use `$snps` para
roteamento ou `$sinapse-agent agent-id` para ativação direta. Os dois provedores
resolvem as mesmas fontes canônicas de agentes e tasks.

---

### Q15: Como crio um agente customizado?

**Resposta:** Mantenha os agentes do framework imutáveis e crie extensões pelo
workflow de squads. No Claude Code, ative `@squad-creator`; no Codex, use
`$sinapse-agent squad-creator`. Depois de validar a definição, execute
`npx sinapse-ai@latest install --reconfigure` para regenerar os adapters.

---

### Q16: O que é "yolo mode"?

**Resposta:** Yolo mode é o modo de desenvolvimento autônomo onde o agente:

- Implementa tarefas de stories sem confirmação passo a passo
- Toma decisões autonomamente baseado nos requisitos da story
- Registra todas as decisões em `.ai/decision-log-{story-id}.md`
- Pode ser parado a qualquer momento

**Habilitar yolo mode:** Ative `@developer` no Claude Code ou
`$sinapse-agent developer` no Codex e execute:

```text
*develop-yolo docs/stories/your-story.md
```

**Quando usar:**

- Para stories bem definidas com critérios de aceitação claros
- Quando você confia na tomada de decisão do agente
- Para tarefas repetitivas

**Quando NÃO usar:**

- Para mudanças arquiteturais complexas
- Quando os requisitos são ambíguos
- Para código crítico de produção

---

## Squads

### Q17: O que são Squads?

**Resposta:** Squads são add-ons opcionais que estendem as capacidades do SINAPSE:

| Pack           | Funcionalidades                                                |
| -------------- | -------------------------------------------------------------- |
| **squad-brand** | Integração ClickUp, automação de processos, workflows especializados |

**Instalar um Squad:**

```bash
npx sinapse-ai install --Squads squad-brand
```

**Listar packs disponíveis:**

```bash
npx sinapse-ai install
```

---

### Q18: Posso criar meu próprio Squad?

**Resposta:** Sim! Squads seguem esta estrutura:

```
my-expansion/
├── pack.yaml           # Manifesto do pack
├── README.md           # Documentação
├── agents/             # Agentes customizados
│   └── my-agent.md
├── tasks/              # Tarefas customizadas
│   └── my-task.md
├── templates/          # Templates customizados
│   └── my-template.yaml
└── workflows/          # Workflows customizados
    └── my-workflow.yaml
```

**Exemplo de pack.yaml:**

```yaml
name: my-expansion
version: 1.0.0
description: My custom Squad
dependencies:
  sinapse-ai: ">=1.0.0"
agents:
  - my-agent
tasks:
  - my-task
```

---

## Uso Avançado

### Q19: Como integro o SINAPSE com CI/CD?

**Resposta:**

**Exemplo de GitHub Actions:**

```yaml
name: CI with SINAPSE
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npx sinapse-ai install --full --ide claude-code
      - run: npm test
```

**Exemplo de GitLab CI:**

```yaml
test:
  image: node:18
  script:
    - npx sinapse-ai install --full
    - npm test
```

---

### Q20: Como customizo o core-config.yaml?

**Resposta:** O arquivo `core-config.yaml` controla o comportamento do framework:

```yaml
# Fragmentação de documento
prd:
  prdSharded: true
  prdShardedLocation: docs/prd

# Localização de stories
devStoryLocation: docs/stories

# Arquivos carregados pelo agente dev
devLoadAlwaysFiles:
  - docs/framework/coding-standards.md
  - docs/framework/tech-stack.md

# Configuração do Git
git:
  showConfigWarning: true
  cacheTimeSeconds: 300

# Status do projeto nas saudações dos agentes
projectStatus:
  enabled: true
  showInGreeting: true
```

**Após editar, reinicie sua IDE para aplicar as mudanças.**

---

### Q21: Como contribuo para o SINAPSE?

**Resposta:**

1. **Faça fork do repositório:** https://github.com/caioimori/sinapse-ai

2. **Crie um branch de feature:**

   ```bash
   git checkout -b feature/my-feature
   ```

3. **Faça mudanças seguindo os padrões de código:**
   - Leia `docs/framework/coding-standards.md`
   - Adicione testes para novas funcionalidades
   - Atualize a documentação

4. **Envie um pull request:**
   - Descreva suas mudanças
   - Vincule a issues relacionadas
   - Aguarde a revisão

**Tipos de contribuições bem-vindas:**

- Correção de bugs
- Novos agentes
- Melhorias de documentação
- Squads
- Integrações de IDE

---

### Q22: Onde posso obter ajuda?

**Resposta:**

| Recurso             | Link                                                       |
| ------------------- | ---------------------------------------------------------- |
| **Documentação**    | `docs/` no seu projeto                                     |
| **Solução de Problemas** | [troubleshooting.md](./troubleshooting.md)            |
| **Issues no GitHub** | https://github.com/caioimori/sinapse-ai/issues              |
| **Código-fonte**    | https://github.com/caioimori/sinapse-ai                      |

**Antes de pedir ajuda:**

1. Consulte este FAQ
2. Consulte o [Guia de Solução de Problemas](./troubleshooting.md)
3. Pesquise issues existentes no GitHub
4. Inclua informações do sistema e mensagens de erro na sua pergunta

---

## Documentação Relacionada

- [Guia de Solução de Problemas](./troubleshooting.md)
- [Padrões de Código](../framework/coding-standards.md)
