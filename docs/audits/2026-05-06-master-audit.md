# MASTER AUDIT — SINAPSE-AI Framework (Síntese de 5 Eixos)

**Data:** 2026-05-06
**Auditor:** Imperator (sinapse-orqx) + 4 sub-agents Explore (read-only)
**Versão atual:** `sinapse-ai@1.2.1` (npm latest)
**Trigger:** Caio solicitou auditoria completa pra orientar evolução do framework como produto multi-tenant (back + front + distribuição)

---

## TL;DR — A saúde do framework em 1 tabela

| Dimensão | Status | Achado central |
|---|:-:|---|
| **Estrutura macro** | 🔴 | Counts errados em 4 fontes oficiais (Article VII drift) |
| **Squads** | 🔴 | 1 squad-fantasma (artdir) + 1 duplicação (claude vs claude-code-mastery) |
| **Agents** | 🟢 92% | 184/200 saudáveis. 4 quebrados (squad-design + `pro/` inexistente) |
| **Orquestração** | 🟡 | 16/19 orqx delegam em config; 4 orqx undersized (suspeitos do bug runtime) |
| **Cross-refs** | 🟡 | Estruturalmente OK, mas APSE legacy em 3.123 pontos |
| **Vazamentos pessoais** | 🟡 | 46 Caio-isms (35 operacionais a remover) |
| **Documentação vs realidade** | 🔴 | README promete 200 agents/1.237 tasks → entrega 188/1.235 |

**Health score geral: 78/100** — framework funcional e maduro, mas com 5 dívidas CRITICAL que sangram credibilidade pro usuário externo.

---

## Top 10 Achados CRITICAL (priorizados por impacto/custo)

| # | Achado | Eixo | Impacto | Esforço | Risco do fix |
|---|---|:-:|:-:|:-:|:-:|
| 1 | Counts errados em README/AGENTS/Imperator vs realidade | A | 🔴 ALTO (Article VII drift) | 🟢 baixo | 🟢 baixo |
| 2 | 4 agents quebrados em squad-design (`pro/private-squads/`) | B | 🔴 ALTO (promessa quebrada) | 🟢 baixo | 🟢 baixo |
| 3 | Conceito "PRO" abandonado (pro-detector.js + sinapse-pro-cli) | D | 🟡 MED (dívida técnica) | 🟡 médio | 🟡 médio |
| 4 | squad-claude vs claude-code-mastery duplicação | A | 🔴 ALTO (UX confuso) | 🟡 médio | 🟡 médio |
| 5 | squad-artdir órfão (não roteado pelo Imperator) | A | 🔴 ALTO (14 agents invisíveis) | 🟢 baixo | 🟢 baixo |
| 6 | 35 vazamentos pessoais operacionais ("Caio approval", paths) | E | 🔴 ALTO (multi-tenant quebrado) | 🟡 médio | 🟢 baixo |
| 7 | APSE legacy em 3.123 pontos (CLI bin + docs + configs) | D | 🟡 MED (UX inconsistente) | 🔴 alto | 🟡 médio |
| 8 | 4 orquestradores undersized (suspeitos de não delegar runtime) | B+C | 🟡 MED (qualidade subjetiva) | 🟡 médio | 🟢 baixo |
| 9 | squad.yaml drift universal (manifest ≠ filesystem) | A | 🟡 MED (tooling quebra) | 🟡 médio | 🟢 baixo |
| 10 | snps-orqx duplicado em 2 paths divergentes | A | 🟢 LOW | 🟢 baixo | 🟢 baixo |

---

## Plano de fix em 5 ondas (PRs cirúrgicos)

### 🌊 Onda 1 — Quick wins de credibilidade (1 sessão)
**Tema:** Honestidade de números + remover quebrado.

| PR | Escopo | Tamanho | Risco |
|---|---|:-:|:-:|
| **PR-1** | Sync counts em todas fontes (README/AGENTS/Imperator) → 19 squads, 188 agents, 1.235 tasks | XS | 🟢 |
| **PR-2** | Delete os 4 agents quebrados (`squad-design/dan-mall.md`, `brad-frost.md`, `dave-malouf.md`, `nano-banana-generator.md`) | XS | 🟢 |
| **PR-3** | Adicionar squad-artdir ao routing table do Imperator OU remover squad inteiro (decisão sua) | S | 🟢 |
| **PR-4** | Consolidar snps-orqx duplicado em single source | XS | 🟢 |

**Resultado:** Framework para de mentir sobre si mesmo. Article VII (Metrics Accuracy) volta a ser true.

### 🌊 Onda 2 — Multi-tenant first (1-2 sessões)
**Tema:** Remover Caio-isms operacionais (manter só autoria).

| PR | Escopo | Tamanho | Risco |
|---|---|:-:|:-:|
| **PR-5** | Generalizar 19 menções "Caio" operacionais → "framework maintainer"/"user"/"you" | S | 🟢 |
| **PR-6** | Remover/relativizar 13 paths absolutos `C:\Users\Caio Imori\` em docs públicos | S | 🟢 |
| **PR-7** | Generalizar 2 refs Second Brain → "external memory source (optional)" | XS | 🟢 |
| **PR-8** | Adicionar lint `no-personal-leaks` + pre-commit hook | M | 🟡 |

**Resultado:** Framework parece com produto multi-tenant, não com tooling pessoal do Caio.

### 🌊 Onda 3 — Consolidação estrutural (2-3 sessões)
**Tema:** Eliminar duplicações e dead code.

| PR | Escopo | Tamanho | Risco |
|---|---|:-:|:-:|
| **PR-9** | Consolidar `squad-claude` + `claude-code-mastery` em UM squad (matar `squad-claude` esqueleto, manter `claude-code-mastery` completo + agents extras) | L | 🟡 |
| **PR-10** | Decidir destino do conceito PRO: matar (delete `bin/utils/pro-detector.js`, `packages/sinapse-pro-cli/`) OU implementar | M | 🟡 |
| **PR-11** | Padronizar squad.yaml schema com lista explícita `agents:` declarada — validar via `validate:squad-manifests` em CI | M | 🟡 |

**Resultado:** Arquitetura coerente, sem dead code, manifest = filesystem.

### 🌊 Onda 4 — Maturidade dos orquestradores (1-2 sessões)
**Tema:** Resolver o bug que você identificou (orqx executando vs delegando).

| PR | Escopo | Tamanho | Risco |
|---|---|:-:|:-:|
| **PR-12** | Expandir 4 orquestradores undersized (`animations-orqx`, `design-orqx`, `product-orqx`, `growth-orqx`) com `delegates_to:` table explícita seguindo template Imperator | M | 🟢 |
| **PR-13** | Padronizar `claude-orqx` e `artdir-orqx` (config issues do Eixo C) | S | 🟢 |
| **PR-14** | Adicionar gate/lint que bloqueia orqx com `commands` tipo `*write-X`/`*create-X` (executoras) ao invés de `*route-to-*`/`*delegate-*` | M | 🟢 |
| **PR-15** | Auditoria task-level: cada task de squad orqx tem step "delegate" como primeiro action? (próxima rodada de auditoria) | — | — |

**Resultado:** Bug runtime de execução vs delegação resolvido — especialistas voltam a ser invocados.

### 🌊 Onda 5 — APSE→SNPS legacy cleanup (3-5 sessões)
**Tema:** Limpar dívida histórica grande.

| PR | Escopo | Tamanho | Risco |
|---|---|:-:|:-:|
| **PR-16** | APSE→SNPS bulk em **marketing público** (READMEs, CONTRIBUTING, AGENTS.md, getting-started) | M | 🟢 |
| **PR-17** | APSE→SNPS em **docs operacionais** (TELEMETRY, troubleshooting) | S | 🟢 |
| **PR-18** | APSE→SNPS em **configs estruturais** (`.coderabbit.yaml`, `.codex/*`, `.claude/templates/*`) — validar via `validate:codex-*` | M | 🟡 |
| **PR-19** | APSE→SNPS em **código de produção** (`bin/cli.js`, `bin/commands/*`, `bin/utils/*`) — testar install matrix | L | 🔴 |
| **PR-20** | Allowlist histórico (CHANGELOG, research-synthesis-for-upgrade) — adicionar lint exception | XS | 🟢 |

**Resultado:** Rename completo. UX consistente. Onboarding de usuário externo limpo.

---

## Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Quebrar instalação ao mexer em `bin/` | Onda 5 PR-19 testa install matrix antes de merge |
| Usuários atuais com squad-claude/claude-code-mastery em uso | Onda 3 PR-9 com aliases backward-compat por 1 minor version |
| Decisão estratégica sobre PRO | Onda 3 PR-10 fica BLOCKED até você decidir matar ou implementar |
| Caio observou orqx executando, mas Eixo C config diz que delegam | Onda 4 PR-15 (auditoria task-level) confirma comportamento |

---

## Próxima decisão sua

### Sequência recomendada
**Onda 1 → Onda 2 → Onda 4 → Onda 3 → Onda 5**

Justificativa:
1. Onda 1 (quick wins) — restaura credibilidade rapidamente, baixo risco
2. Onda 2 (multi-tenant) — alinha framework com posicionamento que você acabou de reforçar
3. Onda 4 (delegação) — resolve o bug que você identificou; alta prioridade
4. Onda 3 (consolidação) — exige decisões estratégicas, espera maturação
5. Onda 5 (APSE legacy) — escopo grande, baixa urgência (cosmético)

### Decisões que precisam de você
1. **Conceito PRO**: matar ou implementar? (afeta Ondas 1, 3, 5)
2. **squad-artdir**: integrar ao routing table OU remover? (afeta Onda 1)
3. **squad-claude vs claude-code-mastery**: qual o canônico? (afeta Onda 3)
4. **Backward-compat**: aliases pra rename (squad-claude → claude-code-mastery) por 1 minor? (afeta Onda 3)

### Próximo passo
Confirma a sequência das 5 Ondas. Posso começar a executar Onda 1 imediatamente (4 PRs cirúrgicos, baixo risco, alta visibilidade).

---

## Apêndice — Documentos da auditoria

- [Eixo A — Inventário macro](./2026-05-06-eixo-A-inventario.md)
- [Eixo B — 200 agents individuais](./2026-05-06-eixo-B-agents.md)
- [Eixo C — Delegação vs execução](./2026-05-06-eixo-C-delegation-bug.md)
- [Eixo D — Alucinações & cross-refs](./2026-05-06-eixo-D-hallucinations.md)
- [Eixo E — Vazamentos pessoais](./2026-05-06-eixo-E-personal-leaks.md)
