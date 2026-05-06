# EIXO A — Inventário Macro do Framework SINAPSE-AI

**Data:** 2026-05-06
**Auditor:** Imperator (sinapse-orqx)
**Método:** Filesystem direto (Glob/Grep), comparado contra docs públicos
**Escopo:** Estrutura agregada — squads, agents, tasks, KBs, workflows. NÃO entra em análise individual.

---

## Verdict: 🔴 CRITICAL — Article VII (Metrics Accuracy) violado em múltiplas fontes oficiais

Os números prometidos divergem entre fontes oficiais E divergem da realidade do filesystem.

### 1. Drift de contagem (CRITICAL)

| Fonte | Squads | Agents | Tasks |
|---|---:|---:|---:|
| `README.md` (linha 24, 305, 489) | 19 | 200 | 1.237 |
| `README.en.md` (linha 34, 266, 448) | 19 | 200 | 1.237 |
| `AGENTS.md` (linha 4, 91) | 19 | 200 | 1.237 |
| `sinapse/agents/snps-orqx.md` (linha 3, 28, 115, 516) | **18** | **186** | **1.430** |
| **REAL no filesystem** (`squads/`) | **19** | **188** | **1.235** |

**Severidade:** CRITICAL — viola Article VII (Metrics Accuracy NON-NEGOTIABLE).

**Impacto:**
- Imperator (snps-orqx) anuncia "18 squads · 186 agents · 1.430 tasks" no greeting → usuário recebe info errada
- README/AGENTS prometem 200 agents → entrega 188 (12 a menos)
- Tasks: README diz 1.237, Imperator diz 1.430 → ambos errados (real: 1.235)

**Fix:** sync via script `npm run sync:counts` em todas as fontes. Ratchet em CI gate.

---

### 2. Squad-fantasma: `squad-artdir` (CRITICAL)

`squads/squad-artdir/` existe no filesystem com **14 agents + 13 tasks + 8 KBs + 6 workflows**, mas **NÃO está no routing table do Imperator** (sinapse/agents/snps-orqx.md).

Routing table lista apenas 17 squads (não 18 como diz a contagem própria):
brand, commercial, content, copy, animations, design, finance, growth, paidmedia, product, research, **claude**, council, storytelling, cybersecurity, cloning, courses.

**Faltando:** squad-artdir + (squad-claude OU claude-code-mastery — ver item 3).

**Impacto:** 14 agents existem mas são ineligíveis (Imperator nunca roteia pra eles). Código morto perante o usuário.

**Fix:** decidir — adicionar ao routing table OU remover squad inteiro.

---

### 3. Duplicação flagrante: `squad-claude` vs `claude-code-mastery` (CRITICAL)

Dois squads existem com sobreposição massiva de agents:

| Agent | squad-claude (10) | claude-code-mastery (8) |
|---|:-:|:-:|
| config-engineer | ✅ | ✅ |
| hooks-architect | ✅ | ✅ |
| mcp-integrator | ✅ | ✅ |
| project-integrator | ✅ | ✅ |
| roadmap-sentinel | ✅ | ✅ |
| skill-craftsman | ✅ | ✅ |
| swarm-orqx | ✅ | ✅ |
| claude-orqx | ✅ | ❌ |
| db-sage | ✅ | ❌ |
| tools-orqx | ✅ | ❌ |
| claude-mastery-chief | ❌ | ✅ |

**7 agents idênticos em pasta diferente.** Provável legado de rename incompleto ou tentativa de fork não consolidada.

**Tamanho dos manifestos:**
- `squad-claude/squad.yaml`: 32 linhas (esqueleto)
- `claude-code-mastery/squad.yaml`: 205 linhas (completo)

**Impacto:**
- Confusão pra usuário ("invoco qual?")
- Manutenção dobrada
- Routing table só lista um (squad-claude)
- Trust no framework cai

**Fix:** consolidar em UM. Provável: matar `squad-claude` (esqueleto), promover `claude-code-mastery` (completo) com agents adicionais (`claude-orqx`, `db-sage`, `tools-orqx`) movidos pra dentro.

---

### 4. Squad.yaml drift massivo (HIGH)

Manifestos não declaram agents reais. Drift entre `squad.yaml` e filesystem:

| Squad | Agents declarados (yaml) | Agents reais (fs) | Status |
|---|---:|---:|---|
| squad-brand | 142 | 15 | 🔴 inflado (provável counting bug do meu grep, mas drift evidente) |
| squad-content | 231 | 7 | 🔴 inflado idem |
| squad-cybersecurity | 64 | 9 | 🔴 inflado idem |
| squad-storytelling | 61 | 11 | 🔴 inflado idem |
| 14 squads restantes | 0 | varia | 🔴 **não declaram NADA** |

**Nota:** os "declared" usam regex naïve `^\s+- .*\.md` que pega referências a templates/tasks/KBs além de agents. Mas o sinal central é claro: **manifest e filesystem não falam a mesma língua em squad nenhum**.

**Impacto:**
- Imperator não pode confiar no squad.yaml pra saber agents disponíveis
- Tooling automatizado quebra (instaladores, validators)
- Bug latente em qualquer feature que dependa do manifest

**Fix:** padronizar squad.yaml schema (lista explícita de `agents:`) + script `validate:squad-manifests` em CI.

---

### 5. Imperator duplicado (MEDIUM)

`snps-orqx.md` existe em 2 lugares e **não são idênticos** (diff retorna != 0):
- `sinapse/agents/snps-orqx.md` (versão "oficial" do squad sinapse)
- `.sinapse-ai/development/agents/snps-orqx.md` (versão framework core)

**Risco:** definições divergem → comportamento incoerente dependendo de qual o usuário invocar.

**Fix:** uma única source-of-truth + symlink ou geração.

---

## Inventário canônico (verdade atual do filesystem)

### Squads: 19
1. claude-code-mastery
2. squad-animations
3. squad-artdir ⚠️ (não roteado)
4. squad-brand
5. squad-claude ⚠️ (duplica claude-code-mastery)
6. squad-cloning
7. squad-commercial
8. squad-content
9. squad-copy
10. squad-council
11. squad-courses
12. squad-cybersecurity
13. squad-design
14. squad-finance
15. squad-growth
16. squad-paidmedia
17. squad-product
18. squad-research
19. squad-storytelling

\+ Meta-squad `sinapse/` (1 agent — Imperator)

### Agents por squad (filesystem real)

| Squad | Agents | Tasks | KBs | Workflows |
|---|---:|---:|---:|---:|
| claude-code-mastery | 8 | 26 | 1 | 3 |
| squad-animations | 9 | 75 | 15 | 10 |
| squad-artdir | 14 | 13 | 8 | 6 |
| squad-brand | 15 | 97 | 30 | 8 |
| squad-claude | 10 | 49 | 13 | 4 |
| squad-cloning | 9 | 54 | 16 | 12 |
| squad-commercial | 11 | 85 | 22 | 12 |
| squad-content | 7 | 90 | 32 | 12 |
| squad-copy | 14 | 81 | 24 | 12 |
| squad-council | 11 | 56 | 11 | 2 |
| squad-courses | 8 | 59 | 13 | 12 |
| squad-cybersecurity | 9 | 53 | 14 | 4 |
| squad-design | 15 | 101 | 19 | 12 |
| squad-finance | 5 | 45 | 21 | 8 |
| squad-growth | 7 | 77 | 22 | 12 |
| squad-paidmedia | 10 | 82 | 21 | 10 |
| squad-product | 7 | 75 | 15 | 12 |
| squad-research | 8 | 72 | 26 | 12 |
| squad-storytelling | 11 | 47 | 16 | 2 |
| **Total squads** | **188** | **1.235** | **339** | **163** |
| sinapse (meta) | 1 | 7 | 2 | 0 |
| .sinapse-ai/dev/agents (framework core) | 12 | — | — | — |
| **Grande total** | **201** | **1.242** | **341** | **163** |

---

## Próximos eixos (paralelos)

- **B** — Saúde individual dos 188+12 agents (estrutura, off-pattern, alucinações)
- **C** — Bug de delegação vs execução nos 19 squad orqx
- **D** — Cross-references quebradas (agent→task/KB/workflow inexistente)
- **E** — Vazamentos pessoais (Caio-isms hardcoded)

## Achados acionáveis (já)

| # | Achado | Severidade | Esforço |
|---|---|:-:|:-:|
| A1 | Drift de counts em 4 fontes oficiais | 🔴 CRITICAL | Baixo (script + CI gate) |
| A2 | squad-artdir órfão (14 agents fora do routing) | 🔴 CRITICAL | Médio (decisão estratégica) |
| A3 | squad-claude vs claude-code-mastery duplicação | 🔴 CRITICAL | Alto (consolidação + migração) |
| A4 | squad.yaml drift universal (manifest ≠ fs) | 🟡 HIGH | Médio (schema + validador) |
| A5 | snps-orqx duplicado em 2 paths divergentes | 🟢 MEDIUM | Baixo (single source) |
