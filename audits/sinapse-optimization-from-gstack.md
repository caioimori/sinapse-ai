# SINAPSE × gstack — Backlog de Otimização & FAQ

> AuditFinding nível framework · estudo (read-only, sem implementação)
> Complementa: `audits/gstack-reverse-engineering-analysis.md` (engenharia reversa + segurança)
> Alvo de referência: https://github.com/garrytan/gstack (MIT, Garry Tan / YC)
> Objetivo: capturar o que vale **extrair do gstack** para potencializar o SINAPSE, de forma
> **medível e objetiva** — sem adotar o stack inteiro (as camadas de orquestração colidem).

---

## 0. TL;DR

- gstack **não** é a ferramenta de observabilidade/controle de swarm que avaliamos antes; é um
  **framework de skills/workflow** — mesma categoria conceitual do SINAPSE.
- O artigo viral ("20x", "810×", hackathon do garoto de 18 anos) é **marketing**. O *objeto*
  (gstack) é real, sério e bem-feito; a *narrativa* é ruído de FOMO.
- SINAPSE está num **eixo diferente e mais largo** (eng + design + negócio + DB + 18 squads +
  governança constitucional). gstack é **mais polido na borda de engenharia**.
- Há **5 gaps reais** onde vale garimpar o gstack. Nenhum exige adotar o stack inteiro.

---

## 1. Números reais (verificados)

| Eixo | gstack | SINAPSE (v1.7.0) |
|------|--------|------------------|
| Unidade de trabalho | ~50 skills (slash commands MD) | 211 tasks + 10 agentes framework + 18 squads |
| Workflows | implícito nas skills | 16 workflows YAML |
| Governança | leve, opt-in | Constituição L1-L4, gates NON-NEGOTIABLE |
| Browser | `/browse` (daemon Bun+CDP, ~100ms) | Chrome Brain (auto-instala no setup) |
| Cross-model | sim (Claude/GPT/Gemini) | Claude + Codex (instala agentes p/ ambos) |
| Domínio de negócio | nenhum (100% eng) | 18 squads (brand, copy, finance, growth…) |
| CLI próprio | não (vive dentro do Claude Code) | sim (`bin/sinapse*.js`) |

---

## 2. Diff skill-por-skill (resumo)

Legenda: ✅ SINAPSE à frente/empate · 🟡 empate, gstack mais afiado · 🔴 gap real (gstack ganha)

| Fase | gstack | Equivalente SINAPSE | Status |
|------|--------|---------------------|--------|
| Plan | `/office-hours` | analyst-facilitate-brainstorming + advanced-elicitation | 🟡 |
| Plan | `/plan-eng-review` | @architect + architect-analyze-impact | ✅ |
| Plan | `/autoplan` | spec-pipeline.yaml | ✅ |
| Build | **`/design-shotgun`** (variantes visuais paralelas no browser) | nano-banana (gera, não compara ao vivo) | 🔴 |
| Build | `/design-html` | generate-ai-frontend-prompt + build-component | 🟡 |
| Review | `/review` | @quality-gate + qa-review-build | ✅ |
| Review | **`/codex`** (2ª opinião cross-model GPT) | — (Claude-only no runtime) | 🔴 |
| Test | `/qa` | qa-test-design + qa-fix-issues | ✅ |
| Test | `/browse` | Chrome Brain + qa-browser-console-check | 🟡 |
| Test | **`/canary`** (monitor pós-deploy) | — | 🔴 |
| Ship | `/ship` | @devops + pre-push-quality-gate | ✅ |
| Reflect | **`/retro`** (retro automatizada) | — | 🔴 |
| Reflect | `/document-release` | document-project + generate-documentation | ✅ |
| Util | `/careful` `/freeze` `/guard` | L1-L4 + gates NON-NEGOTIABLE | ✅ |
| Util | GBrain (3 trust levels) | MEMORY.md + "memory as hints" | 🟡 |
| Util | **iOS** (`/ios-qa` etc.) | — | 🔴 |

**Onde SINAPSE ganha de lavada:** 18 squads de domínio, CLI-first, gates constitucionais,
~40 tasks de DB/RLS, 4× mais superfície de tasks.

---

## 3. Backlog de extração — MEDÍVEL E OBJETIVO

> Cada item: o que extrair · onde absorve no SINAPSE · esforço (S/M/L) · métrica de sucesso objetiva.
> Ordem = prioridade por ROI. **Nenhum item importa o stack do gstack — só o conceito.**

| # | Extrair do gstack | Absorve em (agente/task SINAPSE) | Esforço | Métrica de sucesso (objetiva) |
|---|-------------------|----------------------------------|---------|-------------------------------|
| 1 | **`/design-shotgun`** — gerar 3-6 variantes visuais em paralelo e comparar no browser | @ux-design-expert + nova task `ux-design-shotgun` + Chrome Brain | M | Dado 1 briefing de UI, produz ≥3 variantes HTML abertas lado-a-lado no browser em 1 comando, sem passo manual |
| 2 | **Trust levels de memória** (read-write / read-only / deny) | regra de memória dos agentes (`MEMORY.md`) + core-config | S | Cada agente declara nível de acesso à própria memória; tentativa de escrita em `read-only` é bloqueada e logada |
| 3 | **`/canary`** — loop de monitoramento pós-deploy (console errors, regressões) | @devops + nova task `canary-postdeploy` | M | Após deploy, roda N ciclos de verificação de URL e falha o gate se aparecer erro de console novo vs baseline |
| 4 | **`/codex` cross-model** — 2ª opinião de GPT no review | @quality-gate + Codex (já instalado no setup) | M | Em PR, `*codex-review` retorna achados de um modelo não-Claude; divergências entre modelos são listadas |
| 5 | **`/retro`** — retrospectiva automatizada por período | @sprint-lead + nova task `sprint-retro` | S | Gera relatório semanal com métricas DORA reais (deploy freq, lead time) a partir do git/stories |
| — | iOS nativo, `/make-pdf`, `/scrape`→`/skillify` | (não prioritário) | — | nice-to-have; reavaliar se surgir demanda real |

**Regra de ouro:** itens 1 e 3 cruzam com a análise anterior (browser/observabilidade) — são onde
"spawn paralelo + observabilidade visual" *vale a pena*. Itens 2 e 5 são baratos (S). Item 4 depende
do Codex já estar configurado (e está, no install).

---

## 4. Onboarding inicial — estado real & gap

> Pedido: "a 1ª experiência precisa ser funcional — perguntar idioma (PT/EN), LLM (Claude/Codex/ambos)
> e se o projeto é greenfield ou brownfield."

| Item do onboarding | Estado | Evidência |
|--------------------|--------|-----------|
| Idioma PT/EN | ✅ Já implementado | `bin/commands/install.js:82-118` (inquirer + fallback readline; salva em `~/.claude/settings.json`) |
| LLM Claude / Codex / ambos | ✅ Já implementado | `promptLlmChoice()` → instala agentes em `~/.claude/agents` e/ou `~/.codex/agents` (`install.js:277-297`) |
| Browser funcional na 1ª run | ✅ Já implementado | Chrome Brain auto-instala (`install.js:380-399`) |
| Resumo pré-instalação | ✅ Já implementado | `install.js:157-166` (mostra idioma + IDE + modo antes de agir) |
| Greenfield / brownfield | 🔴 **NÃO perguntado — proposital** | `project-intelligence.md` **proíbe** perguntar; faz auto-detecção (Initial State Audit, 8 dimensões). É um anti-pattern explícito: *"Asking user 'is this a new or existing project?'"* |

### Decisão (CONFLITO resolvido)
O pedido de adicionar prompt greenfield/brownfield **conflitava** com `project-intelligence.md`
(NON-NEGOTIABLE: auto-detecta, nunca pergunta).

**✅ DECIDIDO — Opção A (manter regra):** não perguntar; melhorar a **mensagem** do Initial State
Audit para que o usuário *veja* o tipo detectado e possa corrigir ("Detectei brownfield Next.js —
correto?"). Mantém a regra NON-NEGOTIABLE intacta e dá sensação de controle. Esforço S.

> Opção B (emendar a regra para perguntar de fato) foi **descartada** — exigiria emenda constitucional.

### Inconsistência menor encontrada (a verificar)
- `package.json` diz `version: 1.7.0`, mas o greeting gerado no install ainda mostra `v1.0`
  (`install.js:608`). Cosmético, mas é "Metrics Accuracy" (Art. VII). [NEEDS VERIFICATION se intencional]

---

## 5. FAQ

**O gstack deixa o Claude Code "20x mais forte"?**
Não há baseline. É número de vaidade. O gstack adiciona processo estruturado; o ganho real é
organização, não multiplicador mágico.

**Devo instalar o gstack por cima do SINAPSE?**
Não. As camadas de orquestração colidem (governança opt-in vs. constitucional). Garimpe conceitos
(seção 3), não o stack.

**O gstack é seguro?**
Sim, para uso pessoal/dev, com ressalvas — ver `gstack-reverse-engineering-analysis.md` §3
(cookies do Chromium, túnel ngrok opt-in, modo `--team` auto-update). Sem malware.

**Qual a maior coisa que o SINAPSE não tem e o gstack tem?**
Variantes visuais paralelas comparadas no browser (`/design-shotgun`) e 2ª opinião cross-model
(`/codex`). Ambos extraíveis como conceito.

**Qual a maior vantagem do SINAPSE sobre o gstack?**
Largura (18 squads de negócio, não só eng) + governança constitucional + CLI-first + DB/RLS profundo.

---

## 6. Próximos passos sugeridos (ainda estudo — nada implementado)

1. Decidir o conflito de onboarding: **(A)** confirmar tipo detectado vs **(B)** emendar a regra.
2. Se topar avançar, criar **stories** (Documentation-First) para os itens 1, 2, 3 do backlog
   — começando pelo item 2 (S, mais barato) ou item 1 (maior ROI visual).
3. Corrigir a inconsistência de versão `v1.0` → `v1.7.0` no greeting (item de qualidade rápido).
