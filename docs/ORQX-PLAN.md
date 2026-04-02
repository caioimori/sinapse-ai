# SINAPSE Framework — Plano de Orquestracao: Refinamento Total

**Data:** 2026-03-24
**Autor:** Imperator (Sinapse Master)
**Status:** Em Execucao
**Versao:** 1.0

---

## Visao Estrategica

Transformar o SINAPSE de um framework derivado em um **produto autoral, produtizado e pronto para distribuicao em massa**. Zero referencias externas, instalacao zero-error, documentacao didatica, e experiencia padronizada para TODOS os usuarios — de iniciantes a devs avancados.

**Publico-alvo:**
- Empreendedores que querem construir, empacotar e vender produtos com IA
- Empresas que querem otimizar workflows e aumentar produtividade
- Desenvolvedores que querem um framework completo de AI agents

**Resultado esperado:** Qualquer pessoa roda `npx sinapse-ai install`, responde 3 perguntas, e tem um ambiente completo funcionando.

---

## Estado Atual (Pre-Refinamento)

| Dimensao | Score | Notas |
|----------|-------|-------|
| AIOX Contamination | LIMPO | Fase 1 executada em 2026-03-24 |
| Installation Flow | BOM | Wizard v4, 8 fases, multi-IDE |
| Agent Greetings | PARCIAL | Core 100%, Orqx 65%, Squads 95% |
| Documentation | EXCELENTE | Multi-lang, CI/CD, governance |
| Cross-LLM Support | BOM | 6 IDEs suportadas |

---

## FASE 1: Purga AIOX [COMPLETA]

**Status:** DONE (2026-03-24)

Arquivos limpos:
- [x] `.github/CODEOWNERS` — @caioimori -> @caioimori
- [x] `CONTRIBUTING.md` — @caioimori -> @caioimori
- [x] `CONTINUITY-PLAN.md` — Thiago Finch refs removidas
- [x] `package-lock.json` (root) — entries aiox-install + aiox-pro-cli removidas
- [x] `.sinapse-ai/scripts/diagnostics/health-dashboard/package-lock.json` — @aiox -> @sinapse
- [x] Verificacao final: `grep -ri "aiox|pedrovaleriolopez|internal-reference"` = ZERO matches

---

## FASE 2: Padronizacao de Greetings + Filtragem de Comandos

**Status:** EM ANDAMENTO (parcial)
**Agentes:** @developer (implementacao) + @quality-gate (validacao)

### Decisao Estrategica: Somente Orqx Sao Visiveis
- **19 comandos visiveis:** 18 orqx + sinapse-orqx (renomeado de sinapse-orqx)
- **~160 specialist agents:** Backend-only, chamados internamente pelos orqx
- **Usuarios nunca chamam especialistas diretamente**

### Rename: sinapse-orqx → sinapse-orqx
- [x] Arquivo de comando renomeado (.claude/commands/SINAPSE/agents/sinapse-orqx.md)
- [ ] Agent definition renomeado (~/.sinapse/sinapse/agents/)
- [ ] Squad manifest atualizado
- [ ] Referencias no codebase atualizadas

### Objetivo
Somente os 19 orqx devem ter greeting/activation instructions E aparecer como comandos.

### Template Padrao (Referencia: Core Agents)
```
{icon} {Name} the {Archetype} ready to {verb}! [{Permission Badge}]

**Role:** {role description}

## Quick Commands
- *help — Mostrar comandos disponiveis
- *status — Ver estado atual
- {specific commands...}

— {Name}, {action phrase} {emoji}
```

### Trabalho Necessario
1. Auditar os ~7 orqx agents que desviam do padrao (35%)
2. Auditar os ~6 specialist agents sem greeting definido (5%)
3. Corrigir cada agent definition file
4. Validar que unified-activation-pipeline.js resolve corretamente
5. Testar 1 agent por squad (17 testes minimos)

### Acceptance Criteria
- [ ] 100% dos orqx agents seguem template padrao
- [ ] 100% dos specialist agents tem greeting_levels definido
- [ ] Teste de ativacao passa para 1 agent de cada squad
- [ ] greeting-builder.js gera output correto para todos os niveis

---

## FASE 3: Instalacao Zero-Error

**Status:** PENDENTE
**Agentes:** @architect (review) + @developer (fixes) + @quality-gate (testing)

### Objetivo
`npx sinapse-ai install` funciona 100% em qualquer maquina, qualquer SO, com qualquer LLM target.

### Mudancas Estrategicas
1. **Linguas:** Remover ES (Espanhol) e ZH (Chines) do wizard. Manter apenas PT + EN.
2. **Modos de Instalacao:**
   - "Rapido" (default) — Instala tudo automaticamente, ZERO decisoes tecnicas
   - "Personalizado" — Escolhe tech stack, IDEs, configuracoes avancadas
3. **Comando `sinapse`:** Ativar Claude Code com personalizacao SINAPSE completa
4. **IDEs Primarias:** Claude Code + Codex (prioridade maxima). Demais como bonus.

### Checklist de Validacao
- [ ] Greenfield install funciona em Windows 11 limpo
- [ ] Greenfield install funciona em macOS limpo
- [ ] Greenfield install funciona em Ubuntu limpo
- [ ] Brownfield upgrade funciona sem perda de dados
- [ ] Wizard pergunta apenas lingua + modo (Rapido/Personalizado) no modo Rapido
- [ ] Modo Personalizado oferece: IDE, tech preset, environment
- [ ] `sinapse` no terminal abre Claude Code com framework carregado
- [ ] `sinapse install` roda wizard
- [ ] `sinapse doctor` roda diagnostico
- [ ] Post-install validator reporta 0 erros
- [ ] Hooks do Claude Code (.claude/hooks/*) instalados corretamente
- [ ] IDE sync funciona para Claude Code e Codex

### Analise: Modo Avancado (Bob vs Advanced)

**Decisao:** MANTER ambos, renomear:
- "Rapido" = antigo "bob" (recomendado, default, esconde complexidade)
- "Personalizado" = antigo "advanced" (opt-in, mostra detalhes)

**Justificativa:** O mass market NUNCA ve o modo personalizado — e opt-in. Remover cortaria power users que pagam mais e evangelizam o produto. Default = Rapido, que resolve 95% dos casos.

---

## FASE 4: Documentacao Didatica

**Status:** PENDENTE
**Agentes:** @analyst (review) + @developer (updates) + @ux-design-expert (UX writing)

### Objetivo
Qualquer pessoa que acessar o repositorio no GitHub entende imediatamente:
1. O que e o SINAPSE
2. Como instalar
3. Como usar
4. Onde encontrar ajuda

### Trabalho Necessario
1. **README.md** — Revisar para clareza e didatica:
   - [ ] Quick start em 3 passos (install, activate, use)
   - [ ] Demo GIF/screenshot do CLI em acao
   - [ ] Badge de versao NPM atualizado
   - [ ] Remover qualquer referencia a ES/ZH que nao existe mais
2. **docs/installation/** — Guia por IDE:
   - [ ] Claude Code (primario, detalhado)
   - [ ] Codex (primario, detalhado)
   - [ ] Gemini, Cursor, Copilot (secundarios, basico)
3. **docs/getting-started.md** — Validar que esta atualizado com v5
4. **docs/glossary.md** — Termos atuais (orqx, squad, agent, etc.)
5. **docs/roadmap.md** — Atualizado com visao 2026
6. **CONTRIBUTING.md** — Simplificar fluxo para novos contribuidores
7. **Remover docs/zh/ e docs/es/** — Nao mais suportados

### Acceptance Criteria
- [ ] README tem quick start em 3 passos
- [ ] Cada IDE tem guia proprio em docs/installation/
- [ ] Zero paginas desatualizadas referenciando v3 ou v4
- [ ] Glossario completo com 100% dos termos do framework
- [ ] Nenhuma referencia a linguas removidas (ES, ZH)

---

## FASE 5: Code Audit Profundo

**Status:** PENDENTE
**Agentes:** @quality-gate (scan) + @developer (fixes) + @devops (release)

### Objetivo
Pente fino em cada arquivo do framework. Zero assinaturas escondidas, zero easter eggs, zero watermarks.

### Scan Targets
- [ ] Todos os .js/.ts/.cjs/.mjs — strings hardcoded, console.log, watermarks
- [ ] Todos os .yaml/.yml — references externas em configs
- [ ] Todos os .json — author/contributor fields
- [ ] Todos os .md — URLs externas, nomes de pessoas
- [ ] Todos os .sh/.bat — scripts com refs externas
- [ ] `.github/workflows/` — actions com refs externas
- [ ] `scripts/` — automacoes com refs externas
- [ ] `packages/` — package.json internos (author, contributors, repository)
- [x] Git tags — verificar se alguma tag referencia AIOX (VERIFIED 2026-04-02: ZERO tags AIOX)
- [x] Git commit messages — verificar se tem refs problematicas (informativo, nao rewrite)
- [x] GitHub Issues/PRs/Labels/Milestones — VERIFIED 2026-04-02: 0 issues, 0 PRs, 0 AIOX labels, description=SINAPSE

### Pos-Audit
- [ ] Regenerar package-lock.json limpo (`npm install`)
- [ ] Rodar npm run lint
- [ ] Rodar npm run typecheck
- [ ] Rodar npm test
- [ ] Validar install-manifest.yaml atualizado
- [ ] @devops: commit final + tag de release

### Acceptance Criteria
- [ ] `grep -ri "aiox\|internal-reference\|pedrovaleriolopez\|alan.nicolas"` = ZERO matches
- [ ] Nenhum package.json interno com author/contributor externo
- [ ] Nenhuma URL apontando para repo externo nao-autorizado
- [ ] Todos os quality gates passam (lint, typecheck, test, build)
- [ ] Release tag criada

---

## TIMELINE DE EXECUCAO

```
Semana 1 (2026-03-24):
  Fase 1 [DONE] ████████████████████████████████████ 100%

Semana 2 (2026-03-25):
  Fase 2 [PARC] ████████████████████░░░░░░░░░░░░░░░  55%
  Fase 4 [DONE] ████████████████████████████████████ 100%
    - README.md + README.en.md reescritos (voz autoral SINAPSE)
    - CAIO-VOICE.md + CONTINUITY-PLAN.md removidos
    - Refs Pedro Valerio/OpenClaw/Mega Brain/nomes antigos limpas (55+ arquivos)
    - AGENTS.md reescrito para Codex (19 orqx + 12 core + 151 specialists)
    - Paridade Codex 100% (178 = 178 agents)
    - Global ~/.claude/CLAUDE.md + 9 rules globais limpos de AIOX
    - claude-code-mastery padronizado (config.yaml → squad.yaml)
    - _example movido para docs/examples/squads/
    - 16 agents reorganizados em squads naturais (chiefs + design + utils)
    - 18 wrappers autonomos YOLO criados para todos os orqx
    - Mission Routers ricos construidos (7 via chiefs + 11 novos)
    - Comandos * diferenciados por squad (docs/SQUAD-COMMANDS-REFERENCE.md)
  Fase 5 [PEND] ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0%

  >>> RELEASE: SINAPSE v7.0.0 — Autonomous Squad Edition
```

---

## DECISOES ESTRATEGICAS REGISTRADAS

| # | Decisao | Justificativa |
|---|---------|---------------|
| 1 | @caioimori como unico maintainer no CODEOWNERS | Autoria completa |
| 2 | BMad Method attribution mantida SOMENTE em LICENSE | Obrigacao MIT, invisivel ao usuario |
| 3 | Linguas: PT + EN only | Foco, menos manutencao |
| 4 | Modos: Rapido (default) + Personalizado | Mass market + power users |
| 5 | Claude Code + Codex como IDEs primarias | Maior base de usuarios |
| 6 | Zero refs externas em qualquer lugar visivel | Produto 100% autoral |
| 7 | `sinapse` no terminal = Claude + SINAPSE framework | UX unificada |
| 8 | Arquitetura de 3 camadas: Orqx (persona) + Wrapper YOLO + Chief (premium) | Flexibilidade: interativo, autonomo, ou premium |
| 9 | Chiefs dentro de squads naturais, nao soltos | Acesso a KB do squad aumenta qualidade |
| 10 | Mission Routers com task mappings reais para todos os 18 squads | Routing preciso em vez de "adivinha a task" |
| 11 | Comandos * autoexplicativos e dominio-especificos | Diferenciacao do AIOX, UX clara |

---

## AGENTES ENVOLVIDOS

| Fase | @architect | @developer | @quality-gate | @devops | @ux | @analyst |
|------|-----------|------|-----|---------|-----|---------|
| 1    |           | X    | X   |         |     |         |
| 2    |           | X    | X   |         | X   |         |
| 3    | X         | X    | X   |         |     |         |
| 4    |           | X    |     |         | X   | X       |
| 5    |           | X    | X   | X       |     |         |

---

*Documento vivo — atualizado conforme progresso das fases.*
*Imperator — SINAPSE Framework Orchestration*
