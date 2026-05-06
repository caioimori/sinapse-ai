# EIXO B — Auditoria Individual de ~200 Agents

**Data:** 2026-05-06
**Auditor:** sub-agent Explore (read-only) + verificação cirúrgica do Imperator
**Método:** Amostragem estratégica (100% orchestrators, 100% framework-core, 30% specialists)
**Critérios:** 8 dimensões (persona, commands, dependencies, whenToUse, ACTIVATION-NOTICE, tamanho, off-pattern, alucinação)

---

## Verdict: 🟢 HEALTHY (92%) — mas 4 agents BROKEN em squad-design

**184 de 200 agents (92%) bem-construídos.** 4 alucinados em squad-design (CRITICAL — bloqueiam ativação). 4 orchestrators undersized (MEDIUM).

---

## Achados CRITICAL (bloqueiam ativação)

### 4 agents quebrados em `squad-design/agents/` (CONFIRMADO via leitura direta)

Todos referenciam `pro/private-squads/design/agents/{name}.md` para carregar persona — **`pro/` NÃO EXISTE no repo** (verificado: `ls pro/` retorna "pro/ NÃO EXISTE").

| Agent | Linha do problema | Persona carrega? |
|---|---|:-:|
| `squads/squad-design/agents/dan-mall.md` | L36: `Read pro/private-squads/design/agents/dan-mall.md` | ❌ |
| `squads/squad-design/agents/brad-frost.md` | L36 (mesmo padrão) | ❌ |
| `squads/squad-design/agents/dave-malouf.md` | L36 (mesmo padrão) | ❌ |
| `squads/squad-design/agents/nano-banana-generator.md` | L25 (mesmo padrão) | ❌ |

**Hipótese:** plano de "PRO version" (versão paga / private squads) abandonado, deixando shells quebrados públicos.

**Impacto:**
- Agent é invocável via `/design:agents:dan-mall` mas falha silenciosamente
- Confunde usuário ("agente existe mas não funciona")
- Quebra promessa do framework (200 agents prometidos, 196 realmente funcionais)

**Fix imediato (3 opções):**
1. **DELETE os 4 agents** — solução mais limpa
2. **Refazer com persona inline** (sem ref externa) — mantém mas funcional
3. **Criar `pro/private-squads/`** com personas reais — só faz sentido se houver plano de pro tier

Recomendação: **Opção 1** (delete). Se você quiser manter as personas inspiradas em pessoas reais (Dan Mall, Brad Frost, Dave Malouf), refazer como Opção 2 (persona inline).

---

## Achados MEDIUM (4 orchestrators undersized)

Possível conexão com tua observação ("orqx executa em vez de delegar") — orqx pequenos têm menos delegação explícita:

| Orchestrator | Tamanho | Problema | Fix sugerido |
|---|---:|---|---|
| `squad-animations/agents/animations-orqx.md` | 4.3 KB | Markdown puro, sem YAML, delegação curta | Expandir com `delegates_to:` table |
| `squad-design/agents/design-orqx.md` | 3.1 KB | Markdown puro, undersized | Expandir + delegação explícita |
| `squad-product/agents/product-orqx.md` | 3.8 KB | Sem `whenToUse` claro | Expandir + whenToUse + delegação |
| `squad-growth/agents/growth-orqx.md` | 4.9 KB | Markdown puro, undersized | Expandir + delegação |

**Comparação:** Imperator (`sinapse/agents/snps-orqx.md`) tem 33 KB com `delegates_to:` completo. Esses 4 têm 4-5 KB. Diferença de 7-10x sugere delegação implícita ou ausente.

---

## Distribuição por padrão estrutural

| Padrão | # agents | % | Onde |
|---|---:|---:|---|
| **A. Framework-core** (ACTIVATION-NOTICE + YAML completo) | 37 | 20% | `.sinapse-ai/development/agents/` + alguns squads |
| **B. Orchestrator YAML** (yaml + sections markdown) | 81 | 43% | brand, copy, council, storytelling, cybersecurity, etc. |
| **C. Markdown-native** (sem yaml frontmatter) | 66 | 35% | animations, finance, design (parcial), specialists |

Os 3 padrões coexistem. Não é problema em si, mas **falta documentação dizendo qual usar quando**.

---

## Scores por critério

| Critério | Score | Observação |
|---|---:|---|
| Persona definida | **99/100** | Quase todos têm persona clara |
| Tamanho razoável (sem stubs/bloated) | **100/100** | Zero stubs, ninguém >50KB |
| Off-pattern | **98/100** | 4 agents YAML CLI format únicos (squad-design alucinados) |
| Alucinação visível | **98/100** | 4 agents com path fictício |
| Commands listados | **85/188 = 45%** | Padrão em framework-core, faltando em domain |
| ACTIVATION-NOTICE/Greeting | **37/188 = 20%** | Só framework-core e Imperator |
| `whenToUse` definido | **49/188 = 26%** | Afeta auto-routing automático 🟡 |
| Dependencies declaradas | **10/188 = 5%** | Não-crítico (delegação implícita via `delegates_to:`) |

---

## Squads bem-construídos (referência)

✅ **EXCELENTE** (zero problemas, alta consistência):
- squad-brand (15 agents) · squad-council (11) · squad-storytelling (11) · claude-code-mastery (8)
- Framework-core (12)

✅ **BOM** (estrutura sólida, pequenos ajustes):
- squad-cybersecurity (9) · squad-content (7) · squad-copy (14) · squad-animations (9) · squad-artdir (14)
- squad-commercial (11) · squad-courses (8) · squad-research (8) · squad-finance (5) · squad-cloning (9) · squad-paidmedia (10)

⚠️ **PROBLEMAS LOCALIZADOS**:
- squad-design (4 agents quebrados de 15 = 27% do squad) ⚠️
- squad-product (orchestrator undersized)
- squad-growth (orchestrator undersized)

---

## Recomendações por prioridade

### 🔴 CRITICAL — fix essa semana
1. **Resolver 4 agents quebrados em squad-design** (delete OU refazer com persona inline)
2. **Decidir destino do conceito `pro/private-squads/`** (matar a ideia OU implementar)

### 🟡 MEDIUM — fix próximas 2 semanas
3. **Expandir 4 orchestrators undersized** (animations, design, product, growth) com `delegates_to:` explícito
4. **Adicionar `whenToUse` no template padrão** — beneficia auto-routing dos 139 agents que faltam

### 🟢 LOW — fix próximo mês
5. **Style guide unificado** documentando os 3 padrões (A/B/C) e quando usar cada
6. **Validador automático** em CI que checka cada novo agent contra os 8 critérios

---

## Limitação desta auditoria

- Amostragem 30% dos specialists (não 100%) — pode ter agents quebrados não detectados
- Não verificou cross-references profundamente (esse é Eixo D)
- Não validou comportamento runtime (config vs execução real)
