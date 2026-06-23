# Potencialização dos Agentes com a Base de Engenharia de Software

> **Data:** 2026-06-22 · **Branch:** `caio/feat/potencializar-agentes-eng-software`
> **Origem:** base de engenharia de software do Caio (60 domínios · 1.617 fichas · 16 kits em `engenharia-software/fase-4-agents/`, repo `caioimori/engenharia-de-software`).
> **Objetivo:** ancorar **todos** os agentes do framework na base, sem violar a fronteira L1-L4 nem quebrar o CI.

---

## 1. Sumário executivo

| Métrica | Valor |
|---|---|
| Agentes no framework | **172** (12 framework + 160 squad em 17 squads) |
| Agentes potencializados nesta entrega | **170** (10 framework via MEMORY.md + 160 squad) |
| Fora do escopo (efeito colateral no codex) | 2 (snps-orqx, squad-creator) — ver §5 |
| Validação | `validate:agents` ✅ 0 errors · `validate:parity` ✅ · lint ✅ · guards de conteúdo ✅ |
| Estratégia | Não-destrutiva (só adição), idempotente (marcador `ENG-GROUNDING:v1`), reversível (branch+PR) |

---

## 2. Mapeamento da topologia (Fase 1)

### 2.1 Onde vivem os agentes

| Local | Papel | Editável? | Conteúdo |
|---|---|---|---|
| `.sinapse-ai/development/agents/<id>.md` | **Fonte** framework (definição) | L1/L2 — não tocar | 12 agentes |
| `.sinapse-ai/development/agents/<id>/MEMORY.md` | **Fonte** framework (memória) | **L3 — editável** | canal de potencialização |
| `squads/<squad>/agents/<id>.md` | **Fonte** squad (definição) | L4 — editável | 160 agentes |
| `.claude/commands/SINAPSE/agents/` | Espelho IDE (gerado por `sync:ide`) | gerado — não editar | full markdown |
| `.codex/agents/`, `.codex/skills/` | Espelho IDE (redirects) | gerado — não editar | apontam pra fonte |

### 2.2 Sincronização e validação (o que não pode quebrar)

- **Sync:** `npm run sync:ide` (gera `.claude`, só framework) · `npm run sync:ide:codex` (redirects + skills do codex).
- **Validação (CI):** `validate:agents` (172, core strict + squad warn) · `validate:parity` (claude-sync, codex-sync, codex-skills) · `validate:no-external-refs` · `validate:no-personal-leaks` · `validate:semantic-lint` · `lint` · `validate:article-vii/viii/xi`.
- **Manifest:** `npm run generate:manifest` após mudanças estruturais (criação/remoção de arquivos).

### 2.3 Fronteira L1-L4 (core-config.yaml: `boundary.frameworkProtection: false` — modo contribuidor)

- **Editável (L3/L4):** `agents/<id>/MEMORY.md`, `squads/**`, `.sinapse-ai/data/**`, `docs/**`, `.claude/rules/<nova>.md`.
- **Proibido (L1/L2):** `.sinapse-ai/core/**`, `.sinapse-ai/development/{tasks,templates,checklists,workflows}/**`, `.sinapse-ai/infrastructure/**`, `constitution.md`, `bin/`.

---

## 3. O que foi feito (Fase 2 — potencialização)

### 3.1 Agentes de framework (12) — via `MEMORY.md` (canal L3 nativo, `@import`)

- **Núcleo "Engenharia com IA"** (7 leis transversais do `KIT-ai-engineering`, posterior ao PR #264) adicionado ao MEMORY.md dos 10 agentes com memória.
- Os 8 técnicos (PR #264) já tinham munição específica do papel → ganharam o núcleo como complemento.
- `analyst` (+ gates de pesquisa/grounding) e `ux` (+ frontend + product-craft) ganharam munição (faltavam no PR #264).
- `agent-memory-imports.md`: +2 `@import` (analyst, ux).

### 3.2 Agentes de squad (160) — via seção no corpo (L4)

Seção idempotente **"Munição: Engenharia com IA"** (marcador `ENG-GROUNDING:v1`) anexada ao corpo markdown (não toca o bloco YAML → schema intacto):

- **Núcleo transversal** (7 leis: simplicidade, spec/No-Invention, loop com freio, verificação, contexto finito, eval/saída-não-confiável, tool-como-contrato) para **todos**.
- **Gates de domínio** (destilados fiéis dos kits) para squads técnicos:

| Squad(s) | Gates de domínio |
|---|---|
| cybersecurity | KIT-security (deny-by-default, input hostil, cripto, lethal trifecta, least agency) |
| design, animations | KIT-frontend + KIT-product-craft (rendering, CWV, a11y, layout fluido, token semântico, motion) |
| claude-code-mastery, cloning | KIT-skills-aplicado (engenharia reversa, determinístico, contexto por task) |
| product | KIT-product-sprint + KIT-product-craft (outcome, fatia vertical, MVP=experimento, WIP) |
| brand, commercial, content, copy, council, courses, finance, growth, paidmedia, research, storytelling | núcleo transversal (rigor de criar COM IA) |

> **Fidelidade (No Invention):** toda munição foi destilada dos kits reais. Para squads de criação (copy/brand/etc.), aplicou-se só o núcleo transversal — a base é de *engenharia de software*; munição de domínio (copywriting, branding) exigiria outra base e não foi inventada.

### 3.3 Validação

`validate:agents` 0 errors (226 warnings pré-existentes, nenhuma nova) · `validate:parity` passou · lint, no-external-refs, no-personal-leaks, semantic-lint, article-vii/viii/xi, agents-md ✅.

---

## 4. Como reverter / manutenção

- **Reverter tudo:** descartar a branch (nada foi pra main).
- **Reverter um agente:** remover o bloco entre os marcadores `<!-- ENG-GROUNDING:v1 -->`.
- **Re-aplicar (idempotente):** scripts em `_research/_tmp-eng-grounding/` (`apply-squads.cjs`, `apply-framework.cjs`) — só tocam agentes sem o marcador.

---

## 5. Pendências e decisões

### 5.1 snps-orqx e squad-creator (revertidos)
Criar subdir/`MEMORY.md` para esses 2 fez o `sync:ide:codex` gerar uma skill órfã fora do catálogo (31/30), quebrando `validate:parity`. Revertido. **Próximo:** tratá-los pelo mecanismo de skills do codex (registrar no catálogo) ou via outro canal — fora do escopo seguro autônomo.

### 5.2 Complementos (workflows / tasks / regras novos) — ROADMAP, requer aprovação
Criar artefatos novos em `.sinapse-ai/development/{workflows,tasks}` é **evolução do framework** sujeita à governança (`governance/evolution-pipeline.md`: audit → proposal → approval → PR) e toca camada L1/L2. **Não foi feito em massa autônomo** por disciplina (Conservative Default + No Invention de capacidade). Lacunas priorizadas, prontas para aprovação:

| Prioridade | Domínio da base sem artefato dedicado | Complemento sugerido |
|---|---|---|
| P1 | Agentic Loops & Orquestração (dom 25) | workflow `agentic-loop-execution` + task de design de loop com freio |
| P1 | Evals, Verificação & Guardrails (dom 27) | workflow `eval-gate` + task `guardrail-policy` + checklist de cobertura |
| P1 | Context Engineering (dom 26) | task `context-window-audit` + rule de budget de contexto |
| P2 | Tool Use / MCP (dom 28) | task `mcp-tool-design-spec` + checklist de qualidade de tool |
| P2 | Spec-Driven Development (dom 24) | estender `spec-pipeline.yaml` com spec formal + testes de conformidade |
| P2 | Security / AppSec (dom 29-37) | workflow `security-gates-continuous` + task `threat-model-create` |

---

## 6. Refino v2 — Fortificação individual por função (2026-06-23)

Auditoria pré-merge revelou que a v1 era munição **genérica-por-squad** (agentes da mesma equipe idênticos; orquestradores com gates de execução). Corrigido com munição **individual por função**:

- **172 agentes classificados** em 18 arquétipos de função (orquestrador, executor-código, arquiteto, frontend-ui, design-ux, motion, dados, devops-sre, segurança, qualidade, qualidade-editorial, produto-processo, skills-automação, pesquisa-análise, copy-escrita, brand-criativo, comercial-growth, storytelling, conselho-estratégico).
- Cada agente: **núcleo anti-alucinação** (No Invention, saída de IA não-confiável, spec antes) + **munição da função** (destilada fiel dos kits) + **linha de congruência** amarrada à persona específica.
- **162 agentes com v2** (marcador `ENG-GROUNDING:v2`); 10 framework mantêm a munição completa do PR #264.
- **Verificação adversarial em 3 frentes** corrigiu, antes do commit: os 18 orquestradores → munição de COORDENAÇÃO (não execução; corrige `design-orqx` que tinha gates de frontend); 4 QA não-software (`content-governor`, `brand-auditor`, `copy-editor`, `fiscal-compliance-br`) → arquétipo "Qualidade Editorial"; bloco de storytelling generalizado (removido jargão interno).
- Validação: `validate:agents` 0 errors · `validate:parity` 100% · `lint` OK · manifest válido.

---

*Documento gerado na execução autônoma de 2026-06-22, refino v2 em 2026-06-23. Entregue em PR para revisão.*
