# Sub-domínio 3 — Docs consistency

**Pergunta:** docs/guides/* alinhados com código atual? Broken links? Versões obsoletas?

## Verdict: 🔴 FAIL — bloqueia GA

A vitrine de documentação tem 3 falhas graves de **honestidade**: persona table
totalmente desalinhada da realidade, link "Referencia de Agentes" apontando pra
arquivo de Codex CLI (não pra referência de agentes), e issue draft de janeiro
de 2025 ainda no repo público com personas legacy. São defeitos que
contradizem o discurso da Constitution.

---

## Findings

### F1 [P0] — `docs/guides/getting-started.md:117-126` lista personas legacy-upstream legacy

**Onde:** `docs/guides/getting-started.md:115-126`
```
| `@developer` | Pixel | ...
| `@quality-gate` | Quinn | ...
| `@architect` | Aria | ...
| `@project-lead` | Morgan | ...
| `@product-lead` | Pax | ...
| `@analyst` | Alex | ...
| `@data-engineer` | Dara | ...
| `@ux-design-expert` | Uma | ...
| `@devops` | Gage | ...
```

**Reality canonical** (lendo `.sinapse-ai/development/agents/*.md` `name:`):
- architect → Stratum (não Aria)
- quality-gate → Litmus (não Quinn) — confirmado em README:243
- project-lead → Beacon (não Morgan)
- product-lead → Axis (não Pax)
- analyst → Scope (não Alex)
- data-engineer → Tensor (não Dara)
- ux-design-expert → Mosaic (não Uma)
- devops → Pipeline (não Gage)

8 de 10 personas estão erradas. Esses são os nomes **legacy-upstream originais** (origem
forkada do framework). Usuário ativa `@architect` esperando "Aria" e recebe
"Stratum" → bug aparente.

**Impacto:** GA blocker. Esse arquivo é linkado direto do README como
"Documentacao completa" no CTA final.

---

### F2 [P0] — `docs/guides/agent-reference.md` é AGENTS.md do Codex, não referência de agentes

**Onde:** `docs/guides/agent-reference.md:1` — `# AGENTS.md - SINAPSE`
**Reality:** O arquivo é o equivalente do CLAUDE.md mas pra Codex CLI — descreve
configuração de comportamento de agentes no Codex, não documenta os 12 agentes
core nem suas commands.

**README link:** `README.md:413` — `| Referencia de Agentes | [docs/guides/agent-reference.md] |`

**Impacto:** Usuário curioso sobre "que comandos cada agente expõe?" cai em
documento de Codex CLI configuration. Frustrante e enganoso.

**Fix:** Renomear arquivo atual pra `docs/guides/codex-config.md` e criar de
verdade um `docs/guides/agent-reference.md` com a tabela de personas + comandos
canônicos por agente.

---

### F3 [P1] — `.github/ISSUE_DRAFT_P0_missing_module.md` ainda no repo com persona legacy

**Onde:** `.github/ISSUE_DRAFT_P0_missing_module.md:6-9`
```
**Discovered By:** @quality-gate (Quinn) - QA Test Architect
**Date Discovered:** 2025-01-23
**Assigned To:** @developer (Dex) - Development Lead
```

**Análise:** É um draft. "Quinn" e "Dex" são personas legacy-upstream legacy. Data: jan/2025.
Está em `.github/` que é uma pasta pública. Issue ja foi resolvido provavelmente.

**Fix:** Apagar o arquivo. Não pertence ao repo público em rc.11.

---

### F4 [P1] — `docs/community/README-community-snippet-*.md` apontam pra org SinapseAI

**Onde:** Todos os 3 snippets em `docs/community/`:
```
docs/community/README-community-snippet-core.md:5
docs/community/README-community-snippet-mcp.md:13, 17, 18, 20, 21, 45
docs/community/README-community-snippet-squads.md:13, 17, 18, 20, 21
```
URLs apontam pra `github.com/SinapseAI/sinapse-ai`. Reality (CONTRIBUTING.md,
SECURITY.md, CODE_OF_CONDUCT.md): repo é `caioimori/sinapse-ai`.

Detalhe em sub-relatório 4 (Naming consistency). Aqui só documenta-se que
`docs/community/` está desatualizado.

---

### F5 [P1] — `docs/framework/roadmap.md` aponta pra org SinapseAI também

**Onde:** `docs/framework/roadmap.md:84, 88, 111`
**Fix:** s/SinapseAI/caioimori/

---

### F6 [P2] — Versão do guide `_SINAPSE Getting Started Guide v5.0_`

**Onde:** `docs/guides/getting-started.md:195`
**Análise:** Footer "v5.0" não bate com versão do projeto (10.0.0-rc.11). Convenção
de versionamento do guide diferente do framework — confunde. Padronizar:
ou remover o "v5.0", ou incluir "Last updated: YYYY-MM-DD".

---

### F7 [P2] — `docs/guides/` lista 50+ arquivos sem índice top-level

**Onde:** `docs/guides/` raw listing tem 50+ arquivos, mas README só linka 5
(getting-started, squads-guide, agent-reference, workflows-guide, contributing).
Os outros 45+ arquivos (development-setup, build-recovery-guide, llm-routing,
memory-system, etc.) não têm gateway. Usuário descobre por acaso.

**Fix:** Criar `docs/guides/README.md` com índice categorizado, ou expandir
seção Documentação no README.

---

### F8 [P2] — Auditorias prévias (audit-1, audit-2) não linkadas no README

**Onde:** README seção Documentação não menciona `docs/audits/`. Em projeto
que se vende como "rigoroso" e tem 18+ audit reports, esconder eles é estranho.
**Fix:** Adicionar bullet "Audit reports" pra `docs/audits/`.

---

### F9 [P3] — Frontmatter inconsistente entre guides

**Onde:** `docs/guides/workflows-guide.md:1-6` tem
```
**Version:** 1.0.0
**Last Updated:** 2026-02-02
**Status:** Active
```
`docs/guides/getting-started.md` não tem. `docs/guides/squads-guide.md` tem
header de língua mas não version. Padronizar template de frontmatter.

---

## Severity counts
- **P0:** 2 (personas legacy no getting-started, link agent-reference quebrado conceitualmente)
- **P1:** 3 (issue draft jan/2025, snippets community, roadmap drift)
- **P2:** 3 (versão v5.0 confusa, falta índice de guides, audits não linkados)
- **P3:** 1 (frontmatter inconsistente)

## Verdict: 🔴 FAIL — bloqueia GA até P0 fechar.
