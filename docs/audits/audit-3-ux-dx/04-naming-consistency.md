# Sub-domínio 4 — Naming consistency

**Pergunta:** sinapse-/SINAPSE/Sinapse/SNPS — uso correto em cada contexto.

## Verdict: 🔴 FAIL — bloqueia GA

Split-brain de organização GitHub (SinapseAI vs caioimori) em 20+ arquivos
públicos. Brand legacy `SINAPSE-FullStack` ainda em CLI público, package.json
interno, scripts e tasks. Decisão APSE→SNPS aplicada parcialmente. Esses são
defeitos de identidade visível imediatamente após `npm install`.

---

## Findings

### F1 [P0] — Org GitHub split-brain: SinapseAI vs caioimori

**Inventário (grep `github.com/(SinapseAI|caioimori)/sinapse-ai`):**

**Aponta pra `caioimori/sinapse-ai`** (ERRADO conforme realidade):
- `bin/sinapse.js:135` — texto de help "For more information, visit..."
- `.sinapse-ai/package.json:81, 84, 86` — repository, bugs, homepage
- `.sinapse-ai/schemas/squad-schema.json:3` — `$id`
- `.sinapse-ai/user-guide.md:84, 820, 1395`
- `.sinapse-ai/development/tasks/pr-automation.md:74`
- `docs/community/README-community-snippet-core.md` (15+ refs)
- `docs/community/README-community-snippet-mcp.md` (8+ refs)
- `docs/community/README-community-snippet-squads.md` (5+ refs)
- `docs/framework/roadmap.md:84, 88, 111`
- `docs/audits/install-matrix-template.md:27`
- `.sinapse/audit/repo-settings.json` (full snapshot)

**Aponta pra `caioimori/sinapse-ai`** (CORRETO):
- `README.md:4, 5` (badges + CI links)
- `CONTRIBUTING.md:47, 336, 580, 581, 594, 611, 639`
- `CODE_OF_CONDUCT.md:41`
- `SECURITY.md:17, 75`
- `docs/guides/getting-started.md:191`

**Reality check (`.sinapse/audit/repo-settings.json:1`):** Repo real **é**
`caioimori/sinapse-ai` segundo a API do GitHub. Owner login: SinapseAI (org).
Mas todos os docs front-of-house (README, CONTRIBUTING, SECURITY) usam
`caioimori`.

**Análise:** Existe uma dissonância — ou (a) o repo migrou de pessoal pra org
e os docs públicos não acompanharam, ou (b) caioimori é redirect/alias
oficial. Ambos os casos são inaceitáveis pra GA. Decidir org canônica e
unificar.

**Fix:**
1. Caio decide: org SinapseAI ou conta pessoal caioimori
2. Update via script (`scripts/rewrite-org-refs.js`) em todos os arquivos
3. Adicionar lint hook que falha CI se URL inconsistente

---

### F2 [P1] — `SINAPSE-FullStack` brand legacy em superfícies públicas

**Onde:**
- `bin/sinapse.js:67` — `SINAPSE-FullStack v${packageJson.version}` (visível em `--help` e `--version`)
- `.sinapse-ai/cli/index.js:47` — `.description('SINAPSE-FullStack: AI-Orchestrated...')`
- `.sinapse-ai/package.json:4` — `"description": "SINAPSE-FullStack Core ..."`
- `.sinapse-ai/development/tasks/analyze-project-structure.md:417` — referência em template
- `.sinapse-ai/development/scripts/squad/squad-publisher.js:331` — submission footer público
- `.claude/commands/SINAPSE/agents/devops.md:402` + `.codex/agents/devops.md:402`
- `.sinapse-ai/development/agents/devops.md:402`
- `.sinapse-ai/infrastructure/scripts/sinapse-validator.js:2, 204`
- `.sinapse-ai/core/registry/service-registry.json:2917`
- `bin/sinapse.js:50, 328, 522` — error messages

**Reality:** README + npm package = `sinapse-ai`. Nome canônico atual.
"SINAPSE-FullStack" é o nome antigo (v6 ou anterior) e aparece em
`*help`, error messages, e na descrição do package interno.

**Impacto:** Usuário roda `sinapse --help`, vê "SINAPSE-FullStack v10.0.0-rc.11"
→ confusão sobre qual é o nome real do produto. Em rc.11 era pra estar fechado.

---

### F3 [P1] — Convenção APSE→SNPS aplicada parcialmente

**Memória + CHANGELOG rc.11:** "APSE → SNPS string rename across docs/CHANGELOG
(Caio decision 2026-05-02). Word-boundary safe — `SINAPSE` brand and `sinapse-`
prefix preserved." (PR #124)

**Verificação:** Não foi feito grep exaustivo de "APSE" no repo neste audit.
Recomendar grep dedicado pra confirmar zero ocorrências de `APSE ` (com
boundary) fora do contexto histórico em CHANGELOG (que é OK).

**Sugestão de comando:** `grep -rEn "\bAPSE\b" --include="*.md" --include="*.js" .
| grep -v CHANGELOG.md | grep -v node_modules`

---

### F4 [P2] — Variantes de capitalização: SINAPSE / Sinapse / sinapse-ai

**Análise:** Não-blocker, mas:
- `SINAPSE` (caps) → uso de marca/título
- `Sinapse` (Title) → aparece em alguns lugares (`.codex/agents/squad-creator.md`)
- `sinapse-ai` (lower-kebab) → nome do package npm
- `SinapseAI` (CamelCase) → nome de org GitHub legacy

**Sem regra documentada.** README usa `SINAPSE` em prosa, `sinapse-ai` em
comandos. CONTRIBUTING usa `SINAPSE-AI` (com hífen e caps) — mais uma variante.

**Fix:** Documentar em `CONTRIBUTING.md` ou nova `docs/style-guide.md`:
- Marca: `SINAPSE` (em prosa)
- Package: `sinapse-ai` (em comandos)
- Repo: dependendo da decisão de F1

---

### F5 [P3] — `Sinapse` (Title Case) em casos isolados

**Onde:** `.codex/agents/squad-creator.md` (sample). Provavelmente outros
casos. Não-blocker, mas inconsistente.

---

## Severity counts
- **P0:** 1 (org split-brain caioimori/caioimori)
- **P1:** 2 (SINAPSE-FullStack legacy, APSE→SNPS verificação)
- **P2:** 1 (capitalização sem guideline)
- **P3:** 1 (Sinapse title case)

## Verdict: 🔴 FAIL — F1 é GA blocker (split-brain de identidade pública).
