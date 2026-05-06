# EIXO D — Alucinações & Cross-References Quebradas

**Data:** 2026-05-06
**Auditor:** sub-agent Explore (read-only) + verificação cirúrgica
**Método:** Grep cross-references + comparação README/docs vs realidade
**Limitação:** Sub-agent ficou superficial em alguns checks — Master Synthesis usa apenas dados verificados.

---

## Verdict: 🟡 HIGH — APSE rename incompleto (3.123 refs) + cross-refs estruturais OK

### Resumo

| Categoria | Severidade | # refs |
|---|:-:|---:|
| APSE→SNPS rename incompleto | 🔴 CRITICAL | **3.123 refs** (verificado) |
| Paths absolutos hardcoded | 🔴 CRITICAL | 13 (já no Eixo E) |
| "Caio" como decisor operacional | 🔴 CRITICAL | 19 (já no Eixo E) |
| Cross-refs squad-internal (workflows, KBs) | ✅ OK | validações passaram |
| README features vs implementação | 🟡 PARCIAL | counts errados (Eixo A), features OK |

---

## APSE legacy — 3.123 refs distribuídas

### Por categoria de arquivo (top 10)

| Arquivo | Refs | Categoria |
|---|---:|---|
| `CHANGELOG.md` | 26 | Histórico (✅ OK manter) |
| `README.md` | 18 | Marketing (❌ deve ser SNPS) |
| `README.en.md` | 16 | Marketing (❌ deve ser SNPS) |
| `CONTRIBUTING.md` | 10 | Onboarding (❌ deve ser SNPS) |
| `docs/legal/terms.md` | 18 | Legal (revisar caso a caso) |
| `docs/TELEMETRY.md` | 10 | Operacional (❌ deve ser SNPS) |
| `.coderabbit.yaml` | 5 | Config crítica (❌ deve ser SNPS) |
| `bin/cli.js` + `bin/commands/*` | múltiplas | Código de produção 🔴 |
| `docs/research-synthesis-for-upgrade.md` | 19 | Histórico (✅ OK manter) |
| `bin/utils/pro-detector.js` | múltiplas | Código (revisar) |

### Áreas afetadas

- **Marketing público** (READMEs, CONTRIBUTING, AGENTS.md) — usuário externo vê APSE quando deveria ver SNPS
- **CLI/binários** (`bin/`) — código de produção ainda referencia APSE
- **Configs estruturais** (`.coderabbit.yaml`, `.codex/*`, `.claude/templates/*`) — confirmado pelo handoff anterior
- **Docs operacionais** (TELEMETRY, troubleshooting, getting-started) — UX confuso pra usuário
- **Histórico legítimo** (CHANGELOG, research-synthesis) — manter, é registro temporal

### Estratégia de fix recomendada

Por categoria, não bulk:

| Categoria | Estratégia | Risco |
|---|---|:-:|
| Histórico (CHANGELOG, research-*) | **Manter** APSE como registro temporal | Baixo |
| Marketing (README, CONTRIBUTING) | **Replace bulk** APSE→SNPS | Baixo |
| Configs estruturais | **Replace + validar** com `validate:codex-*` | Médio |
| Código `bin/` | **Replace + testar** install matrix | **Alto** |
| Docs operacionais | **Replace bulk** APSE→SNPS | Baixo |
| Legal (terms.md) | **Revisar caso a caso** | Médio |

---

## Cross-refs validados (sub-agent reportou OK)

✅ Squad agents referenciados em workflows existem
✅ Tasks em workflows apontam pra arquivos reais
✅ Knowledge bases declaradas em squad.yaml existem
✅ Cross-squad routing rules têm agentes alvo válidos

**Caveat:** sub-agent fez amostragem — não bate cada cross-ref. Achados de cross-ref REAL quebrada estão no Eixo B (4 agents apontando pra `pro/private-squads/` inexistente).

---

## README/docs vs realidade

| Promessa | Realidade | Severidade |
|---|---|:-:|
| "19 squads, 200 agentes, 1.237 tasks" (README) | 19 squads ✅, 188 agents ❌ (-12), 1.235 tasks ❌ | 🔴 CRITICAL (ver Eixo A) |
| "Constitution com enforcement real, 13 hooks ativos" | Constitution existe em `.sinapse-ai/constitution.md` ✅, hooks count NÃO verificado | 🟡 verificar |
| "Squad de design system" | squad-design existe MAS 4 de 15 agents quebrados | 🟡 entrega parcial |
| "Squad de cybersecurity, copywriting, branding..." | Todos existem ✅ | ✅ OK |
| "PRO version" / `pro/private-squads/` | **Não existe** mas 4 agents tentam carregar | 🔴 CRITICAL |

---

## Achados ÚNICOS deste eixo

1. **APSE→SNPS rename atinge 3.123 pontos** (vs 10 configs do handoff anterior) — escopo MUITO maior que o reportado
2. **`bin/utils/pro-detector.js` existe** — sugere conceito "PRO" foi codificado mas nunca completado (correlaciona com agents quebrados em squad-design)
3. **`packages/sinapse-pro-cli/`** existe (1 ref) — packagedeprecated/abandonado?

---

## Recomendações

### Validador automático em CI
- `lint:no-personal-leaks` (Eixo E)
- `lint:apse-legacy` — detecta APSE em arquivos NÃO-históricos (allowlist: CHANGELOG, research-synthesis)
- `validate:cross-refs` — checa cada agent/task/KB ref aponta pra arquivo existente
- `validate:counts-sync` — README/AGENTS/Imperator concordam com filesystem

### Cleanup do conceito PRO
Decidir o destino:
- **Opção A — Matar PRO inteiro:** delete `bin/utils/pro-detector.js`, `packages/sinapse-pro-cli/`, 4 agents quebrados, refs em CLI
- **Opção B — Implementar PRO:** criar `pro/private-squads/`, definir tier, implementar paywall (escopo grande)

Recomendação: **Opção A** se PRO não está no roadmap próximo. Limpa dívida técnica grande.

---

## Limitação desta auditoria

- Sub-agent não validou TODAS as 3.123 APSE refs (só amostragem) — cada uma precisa decisão case-by-case
- Cross-references runtime (agent.md → task que carrega outro agent indiretamente) não verificadas
- Hooks count (README diz "13 hooks ativos") não verificado
