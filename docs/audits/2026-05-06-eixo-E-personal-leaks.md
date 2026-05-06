# EIXO E — Vazamentos Pessoais (Caio-isms) no Framework Público

**Data:** 2026-05-06
**Auditor:** sub-agent Explore (read-only)
**Método:** Grep de keywords pessoais (Caio Imori, @caioimori, paths absolutos, projetos pessoais) em todo o repo
**Trigger:** Caio reforçou em 2026-05-06 que tudo específico ao contexto pessoal dele deve ficar em `~/.claude/`, não no framework público.

---

## Verdict: 🟡 HIGH — 46 vazamentos detectados em 5 categorias

Framework é **98% limpo** de vazamentos pessoais, mas os 46 que existem são **operacionais** (Caio como decisor, paths absolutos, vault hardcoded) — não autoria legítima.

---

## Categorias

| # | Categoria | Ocorrências | Severidade |
|---|---|---:|:-:|
| 1 | Nomes próprios "Caio" como decisor/persona | 19 | 🔴 CRITICAL |
| 2 | Paths absolutos da máquina (`C:\Users\Caio Imori\...`) | 13 | 🔴 CRITICAL |
| 3 | Second Brain Obsidian referenciado como "canonical memory" | 2 | 🔴 CRITICAL |
| 4 | `@caioimori` GitHub username | 11 | 🟢 OK (autoria) |
| 5 | Projetos pessoais (Astro Brand Studio etc.) como exemplo | 1 | 🟡 MEDIUM |

---

## Top vazamentos críticos

### 🔴 CRITICAL — vault pessoal hardcoded
- `external-repos-mining-plan.md:88` — `OneDrive\...\Second-Brain` identificado como **"Caio's Second Brain — canonical memory source"**
- Risco: framework público exibe path do vault pessoal do Caio como source

### 🔴 CRITICAL — paths absolutos em planos públicos
- `epic-external-mining-v1.md:5` — `C:\Users\Caio Imori\Workspace\external-reference\` aparece **3× em planos públicos**
- Risco: usuário externo recebe path da máquina do Caio como referência

### 🔴 CRITICAL — Caio como decisor mencionado nominalmente
- 4 epics estratégicos com **"Caio Imori" como Owner**
- Frases tipo:
  - "awaiting Caio approval to execute"
  - "Caio can reactivate any deferred dimension"
  - "Caio decision 2026-05-02"
- Risco: framework público assume figura específica como decisor — quebra produto multi-tenant

### 🟢 OK — autoria legítima (manter)
- `@caioimori` como GitHub author em README/CONTRIBUTING/package.json
- Citações de copyright

---

## Padrão de vazamento mais severo

Uso operacional de **"Caio" como persona ou decision-maker** em docs do framework. Diferente de autoria — é **contexto operacional vazado**.

| Forma | Exemplo | Severidade |
|---|---|:-:|
| Autoria | `Author: Caio Imori` em package.json | ✅ OK |
| Owner em PR template | `## Owner: @caioimori` | ✅ OK |
| Operacional | "awaiting Caio approval to execute" | 🔴 ERRADO |
| Operacional | "Caio's Second Brain at OneDrive" | 🔴 ERRADO |
| Operacional | "Caio decision 2026-05-02" | 🔴 ERRADO |

---

## Recomendações

### Fix imediato (PR cirúrgico)
1. **Generalizar 19 menções "Caio" operacionais** → "framework maintainer", "user", "you", "project owner"
2. **Remover paths absolutos** dos 13 docs/planos públicos → tornar relativos ou usar placeholders (`{REPO_ROOT}`)
3. **Generalizar Second Brain references** → "external memory source (optional)" + opt-in via wizard
4. **Remover Astro Brand Studio** como exemplo único → genérico

### Prevenção de regressão
- Script `lint:no-personal-leaks` em CI com keywords proibidas:
  - Operacional: `Caio approval`, `Caio decision`, `Caio's Second Brain`, `awaiting Caio`
  - Paths: `C:\\Users\\Caio`, `OneDrive\\Caio`, `Second-Brain` (fora de docs/audits/)
  - Allowlist: `@caioimori` (autoria), `Caio Imori` em LICENSE/copyright
- Pre-commit hook bloqueando novos vazamentos
- Quarterly grep audit (ratchet anti-regressão)

---

## Limitação desta auditoria

- ✅ Repo público (`sinapse-ai`) auditado completamente
- ❌ Pasta `external-reference/`, `extracted-intelligence/` podem ter mais (não verificado profundo)
- ❌ Hooks do `~/.claude/` que se referem a paths do Caio são esperados — fora de escopo (são pessoais)

**Próxima ação:** decidir se 46 vazamentos viram 1 PR cirúrgico OU vão pro Eixo Síntese pra priorização junto com outros eixos.
