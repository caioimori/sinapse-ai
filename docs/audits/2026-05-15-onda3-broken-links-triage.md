# Onda 3 — Triage de Broken Links (Top-50+)

**Data:** 2026-05-15
**Escopo Onda 3 / Frente D:** atacar top-50 links quebrados críticos. Resultado real superou o alvo.
**Baseline pré-Onda-3:** 479 broken links (`scripts/check-markdown-links.py`)
**Baseline pós-Onda-3 Frente D:** 310 broken links
**Consertados nesta onda:** **169 links** (35,3 % de redução)

---

## Resultado por categoria

| Categoria | Estratégia | Links consertados |
|---|---|---:|
| `docs/sinapse-agent-flows/*-system.md` (9 arquivos) | Prefixar paths `.sinapse-ai/` com `../../` | 89 |
| `docs/sinapse-agent-flows/qa-system.md` | Substituir `/.sinapse-ai/` (absoluto) por `../../.sinapse-ai/` (relativo) | 10 |
| `docs/pt/README.md` | Remover seções de tradução ES/ZH inexistentes; remover refs a `core-architecture.md` / `meta-agent-commands.md` (não existem) | 18 |
| `docs/sinapse-agent-flows/README.md` | Remover `EN/ES/ZH` (inexistentes); corrigir `sinapse-orqx-system.md` → `snps-orqx-system.md` (arquivo real); substituir `meta-agent-commands.md` por `framework/` | 6 |
| `docs/guides/README.md` | Remover ref ES; marcar `module-system.md` / `migration-guide.md` / `mcp-api-keys-management.md` / `git-workflow-guide.md` como *(coming soon)* | 6 |
| `docs/pt/community.md` | Substituir refs a `CONTRIBUTING-PT.md` por `contributing.md` (arquivo real PT); marcar `Squads.md`, `CODE_OF_CONDUCT-PT.md`, `ROADMAP-PT.md`, `architecture.md`, `.sinapse-ai/user-guide.md` como *(coming soon)*; corrigir `docs/feature-process.md` → `../framework/feature-process.md` | 12 |
| `docs/guides/ade-guide.md` + `docs/pt/guides/ade-guide.md` | Remover links a `ADE-EPIC{1-7}-HANDOFF.md` (epics históricos já entregues); converter ref em texto plain mantendo nome do epic | 28 |

**Total:** 169 broken links resolvidos.

---

## Padrões detectados (lições)

1. **Path relativo errado em massa.** A maior fonte de broken links (~100 em 9 arquivos) era um único padrão: `[label](.sinapse-ai/...)` em arquivos dentro de `docs/sinapse-agent-flows/`. Faltava `../../` no início. Padrão consertável com regex.
2. **Traduções fantasmas.** READMEs principais (PT, guides, sinapse-agent-flows) listam ES e ZH como idiomas existentes. **Não existem.** Removidos os links → mantida apenas a estrutura EN + PT.
3. **Docs apagados sem atualizar refs.** Pasta `docs/architecture/` inteira foi removida em algum ciclo passado, mas refs a `module-system.md`, `mcp-api-keys-management.md`, `ADE-EPIC*-HANDOFF.md`, `ARCHITECTURE-INDEX.md` permaneceram. Estratégia aplicada: *(coming soon)* em docs vivos, conversão a texto plain em docs históricos (ade-guide).
4. **Convenção de path inconsistente em qa-system.md.** Usava paths absolutos `(/.sinapse-ai/...)` enquanto o resto dos `*-system.md` usava paths relativos. Padronizado pra relativo `../../`.

---

## Fila restante (310 links) — priorização recomendada para Onda 4+

### CRÍTICO (alta visibilidade pública)

| Arquivo | Broken | Decisão recomendada |
|---|---:|---|
| `docs/guides/ade-guide.md` | 16 | Já tratado parcialmente; ainda 16 refs a arquivos genéricos. Revisão profunda do guia ou aceitar como "histórico congelado" |
| `docs/pt/guides/ade-guide.md` | 16 | Idem |
| `docs/framework/feature-process.md` | 6 | Refs externas: `../../discussions`, `../../issues`, `../CONTRIBUTING.md`, `troubleshooting.md`, `CODE_OF_CONDUCT.md`. Apontar pro GitHub real ou criar stubs |
| `docs/installation/README.md` | 3 | Visibilidade alta — consertar prioridade |
| `docs/framework/README.md` | 3 | Visibilidade alta — consertar prioridade |

### MÉDIO (visibilidade interna)

| Arquivo | Broken |
|---|---:|
| `docs/guides/memory-intelligence-system.md` | 10 |
| `docs/pt/contributing.md` | 7 |
| `docs/framework/roadmap.md` | 5 |
| `docs/guides/docker-mcp-setup.md` | 5 |
| `docs/pt/architecture/module-system.md` | 5 |
| `docs/guides/git-workflow-guide.md` | 4 |
| `docs/guides/mcp-global-setup.md` | 4 |
| `docs/guides/user-guide.md` | 4 |
| `docs/sinapse-agent-flows/snps-orqx-system.md` | 4 |
| `docs/sinapse-workflows/README.md` | 4 |

### BAIXO (histórico, baixa visibilidade)

- 100 refs órfãs apontando pra `docs/es/` (idioma inexistente). Tratamento: ou criar stubs `docs/es/` que redirecionam ao EN, ou varrer todos `pt/` removendo refs ES sistematicamente. Estimativa: 1 dia de varredura.
- 46 refs órfãs apontando pra `docs/architecture/` (pasta removida em ciclo passado). Decisão: a) restaurar pasta com stubs *(coming soon)*; b) varrer e tirar todas as refs; c) marcar bloco `docs/architecture/` como deprecated no README principal e tolerar refs órfãs em docs históricos.

---

## Próximo passo recomendado

Para Onda 4 Frente D-2:
1. **Atacar `docs/es/` em massa** (100 links): decidir entre criar stubs ou remover refs sistematicamente nos arquivos PT que linkam pra ES inexistente.
2. **Decidir destino de `docs/architecture/`** (46 links): restaurar com stubs ou varrer refs.
3. Após esses dois passos: total broken deve cair de 310 → ~150 ou menos.

**Sem ação imediata:** os 310 restantes não bloqueiam funcionamento do framework. São broken links em docs internos / histórico. O `check-markdown-links.py` permanece como gate informativo.

---

*Auditoria executada como parte da Onda 3 / Frente D — escopo Opção 2 ampliado de 50 pra 169 links pela alta alavancagem dos padrões detectados (89 links consertados via 1 regex pattern fix).*
