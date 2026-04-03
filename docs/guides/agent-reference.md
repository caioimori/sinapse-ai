# Referencia de Agentes

> Indice navegavel de todos os agentes do ecossistema SINAPSE-AI.

---

## 12 Agentes Core

Os agentes core cobrem o ciclo completo de desenvolvimento de software.

| ID | Persona | Papel | Comandos Principais |
|----|---------|-------|---------------------|
| `@developer` | Pixel | Implementacao de codigo | `*develop`, `*task`, `*improve-code-quality` |
| `@quality-gate` | Litmus | Testes e qualidade | `*qa-gate`, `*qa-loop`, `*review` |
| `@architect` | Stratum | Arquitetura e design tecnico | `*create-doc architecture`, `*assess-complexity` |
| `@project-lead` | Beacon | Product Management e epics | `*create-epic`, `*execute-epic`, `*spec-pipeline` |
| `@product-lead` | Axis | Product Owner, stories e backlog | `*validate-story-draft`, `*create-story`, `*backlog` |
| `@sprint-lead` | Sync | Scrum Master e criacao de stories | `*draft`, `*create-story`, `*sprint-plan` |
| `@analyst` | Scope | Pesquisa e analise | `*research`, `*analyze`, `*report` |
| `@data-engineer` | Tensor | Database e engenharia de dados | `*create-migration`, `*schema-design`, `*db-audit` |
| `@ux-design-expert` | Mosaic | UX/UI design | `*create-wireframe`, `*ux-audit`, `*design-system` |
| `@devops` | Pipeline | CI/CD, git push (EXCLUSIVO) | `*push`, `*release`, `*setup-ci` |
| `@sinapse-orqx` | Imperator | Orquestrador principal | `*diagnose`, `*route`, `*orchestrate` |
| `@squad-creator` | Loom | Criacao de novos squads | `*create-squad`, `*scaffold` |

---

## 18 Squads

Squads sao agrupamentos tematicos de agentes especialistas. Cada squad tem um orquestrador (*-orqx) que coordena o trabalho interno.

| Squad | Agentes | Dominio | Orquestrador |
|-------|---------|---------|-------------|
| squad-animations | Especialistas em motion | Animacoes web, micro-interacoes | @animations-orqx (Kinetic) |
| squad-brand | Especialistas em marca | Branding, identidade visual | @brand-orqx (Meridian) |
| squad-claude | Especialistas Claude Code | Mastery de Claude Code | @claude-orqx (Nucleus) |
| squad-cloning | Especialistas em clonagem | Clonagem cognitiva de personas | @cloning-orqx (Helix) |
| squad-commercial | Especialistas em vendas | Vendas, CRM, pipeline | @commercial-orqx (Pipeline) |
| squad-content | Especialistas em conteudo | Editorial, estrategia de conteudo | @content-orqx |
| squad-copy | Especialistas em copy | Copywriting, persuasao | @copy-orqx (Quill) |
| squad-council | Conselheiros estrategicos | Conselho estrategico, decisoes | @council-orqx (Zenith) |
| squad-courses | Especialistas em cursos | Cursos, workshops, educacao | @courses-orqx (Syllabus) |
| squad-cybersecurity | Especialistas em seguranca | Seguranca, compliance, LGPD | @cyber-orqx (Fortress) |
| squad-design | Especialistas em design | UX/UI, design system | @design-orqx (Nexus) |
| squad-finance | Especialistas financeiros | Financeiro, pricing, valuation | @finance-orqx (Ledger) |
| squad-growth | Especialistas em growth | SEO, analytics, growth hacking | @growth-orqx (Catalyst) |
| squad-paidmedia | Especialistas em midia paga | Ads, campanhas, ROAS | @paidmedia-orqx (Apex) |
| squad-product | Especialistas em produto | Roadmap, discovery, metricas | @product-orqx (Vector) |
| squad-research | Especialistas em pesquisa | Pesquisa, inteligencia competitiva | @research-orqx (Prism) |
| squad-storytelling | Especialistas em narrativa | Storytelling, pitch, apresentacoes | @storytelling-orqx (Arc) |
| claude-code-mastery | Especialistas avancados | Tecnicas avancadas de Claude Code | (integrado ao squad-claude) |

**Total: 175 agentes** (12 core + 163 em squads)

---

## Como Ativar Agentes

### Metodo 1: Comando direto

```
@developer
```

Digite `@` seguido do ID do agente. O SYNAPSE Engine carrega a persona, dependencias e contexto automaticamente.

### Metodo 2: Comando completo

```
/SINAPSE:agents:developer
```

Formato completo com namespace. Util em ambientes onde `@` tem outro significado.

### O que acontece na ativacao

1. SYNAPSE Engine detecta o comando
2. Pipeline de 8 camadas (L0-L7) carrega contexto
3. Greeting personalizado e exibido
4. Agente aguarda seu comando (HALT)

**O agente NAO executa acoes automaticamente.** Ele apresenta o greeting e espera.

---

## Como Usar Comandos

Todos os comandos de agentes usam o prefixo `*`:

| Comando | Funcao | Exemplo |
|---------|--------|---------|
| `*help` | Lista comandos disponiveis do agente ativo | `*help` |
| `*create-story` | Cria uma story de desenvolvimento | `*create-story` |
| `*task {nome}` | Executa uma task especifica | `*task develop-story` |
| `*exit` | Sai do modo agente atual | `*exit` |

### Exemplos de Uso

```
@developer          --> ativa Pixel (developer)
*help               --> lista comandos do Pixel
*develop            --> inicia desenvolvimento da story
*task fix-qa-issues --> executa task de correcao de QA
```

```
@quality-gate       --> ativa Litmus (QA)
*qa-gate            --> executa quality gate na story
*qa-loop 8.15       --> inicia loop de QA para story 8.15
```

```
@sprint-lead        --> ativa Sync (Scrum Master)
*draft              --> cria rascunho de nova story
*create-story       --> cria story completa
```

---

## Protocolo de Handoff entre Agentes

Quando voce troca de agente (`@developer` → `@quality-gate`), o SINAPSE executa um protocolo de compactacao:

1. **Agente anterior** gera um artefato de handoff (~379 tokens) com:
   - Story ativa e status
   - Decisoes tomadas
   - Arquivos modificados
   - Blockers ativos
   - Proxima acao sugerida

2. **Agente novo** recebe:
   - Sua propria persona completa
   - Artefato de handoff do agente anterior
   - NAO recebe a persona completa do agente anterior

**Resultado:** economia de 33-57% de contexto por troca de agente.

Limite: maximo 3 handoffs retidos. O mais antigo e descartado no 4o switch.

---

## Criando Agentes Customizados

O SINAPSE permite criar novos squads com agentes especializados usando @squad-creator (Loom):

```
@squad-creator
*create-squad
```

Loom guia voce pelo processo:

1. Define o dominio do squad
2. Identifica especialistas necessarios
3. Cria a estrutura de arquivos (orquestrador + especialistas)
4. Registra no ecossistema

**Localizacao dos squads:** `squads/squad-{nome}/`

Cada squad segue a mesma estrutura:
```
squads/squad-{nome}/
  squad.yaml          # Configuracao do squad
  agents/             # Definicoes dos agentes
  tasks/              # Tasks especificas do dominio
  templates/          # Templates do dominio
```

---

## Mapeamento Agente → Codebase

Cada agente core tem diretorios primarios de atuacao:

| Agente | Diretorios Principais |
|--------|----------------------|
| @developer (Pixel) | `packages/`, `.sinapse-ai/core/`, `bin/` |
| @architect (Stratum) | `docs/architecture/`, system design |
| @data-engineer (Tensor) | `packages/db/`, migrations, schema |
| @quality-gate (Litmus) | `tests/`, `*.test.js`, quality gates |
| @product-lead (Axis) | Stories, epics, requirements |
| @devops (Pipeline) | `.github/`, CI/CD, git operations |

---

## Autoridade Exclusiva

Cada agente tem operacoes que SOMENTE ele pode executar:

| Operacao | Agente Exclusivo | Outros Agentes |
|----------|-----------------|----------------|
| `git push` | @devops (Pipeline) | BLOQUEADO |
| Criar PR | @devops (Pipeline) | BLOQUEADO |
| Criar story | @sprint-lead (Sync) | BLOQUEADO |
| Validar story | @product-lead (Axis) | BLOQUEADO |
| Decisoes de arquitetura | @architect (Stratum) | BLOQUEADO |
| Verdicts de qualidade | @quality-gate (Litmus) | BLOQUEADO |

Violacoes de autoridade sao bloqueadas via hooks (Constitution Art. II).

---

_Veja tambem: [Workflows Overview](workflows-overview.md) | [Architecture Overview](../architecture-overview.md) | [Guiding Principles](../GUIDING-PRINCIPLES.md)_
