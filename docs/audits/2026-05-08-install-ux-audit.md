# Install UX Audit — 2026-05-08

> **Trigger:** runtime feedback do maintainer ("não passa pelas configurações de português/inglês ou Claude/Codex; vai direto instalando")
> **Goal:** identificar gargalos da experiência de instalação antes da release oficial (sair de RC/test)
> **Scope:** read-only

## TL;DR

A instalação **TEM** prompts de idioma e IDE, mas:

1. **`selectInstallationMode()` é um STUB** (não pergunta GREENFIELD vs BROWNFIELD). Caio relatou exatamente isso.
2. **Idioma + IDE pulam silenciosamente** quando `~/.claude/settings.json` já existe (upsert mode sem `--reconfigure`). Isso explica a percepção de "vai direto instalando".
3. **Pre-install summary não existe** — não há tela de confirmação do que vai acontecer antes de copiar arquivos.
4. **Grounding (vault/DS/brand)** pede "caminho absoluto" sem auto-discovery — UX baixo.

## Sequência atual (fase a fase)

### Global install path (`npx sinapse-ai install` → `bin/commands/install.js`)

```
1. Language Selection      ✓ existe (pula se settings.json salvo)
2. LLM/IDE Selection       ✓ existe (pula se settings.json salvo)
3. Grounding Config        ✓ existe (opt-in, Enter pra pular)
4. Squad Sync              → copia squads, gera commands
5. Project Files           → chama wizard com `quiet: true`
```

### Modular wizard (`packages/installer/src/wizard/wizard.js`)

```
1. Mode Detection          ✓ auto-detecta GREENFIELD/BROWNFIELD
2. Project Type Confirmation ✗ STUB — NUNCA PERGUNTA
3. Language Selection      ✓ duplica lógica do global
4. IDE Selection           ✓ duplica lógica do global
5. Tech Preset             ✓ pergunta tech stack
6. Environment Config      ✓ separado em `configureEnvironment()`
```

## Gargalos (priorizados)

### 🔴 P0 — `selectInstallationMode()` é STUB

`packages/installer/src/wizard/wizard.js:82-98`

```js
function selectInstallationMode(detected) {
  // STUB: returns detected mode without asking the user
  console.log('Using detected mode (stub)');
  return detected;
}
```

**Impacto:** Framework pula direto pra ação destrutiva (gera arquivos) sem validar intenção do usuário. Exatamente o gargalo reportado.

### 🔴 P0 — Idioma + IDE pulam quando settings persistem

`bin/commands/install.js:71-110` (language) e `:127` (LLM/IDE)

Quando `~/.claude/settings.json` já tem `language` e `llm`, o código pula os prompts SEM informar o usuário. Sem `--reconfigure`, o user nunca vê as perguntas — daí a percepção "vai direto instalando".

**Impacto:** Caio (com settings persisted da última instalação) NUNCA vê os prompts. Para ele, a instalação está quebrada. Para um user fresh, ela funciona.

### 🟠 P1 — Sem pre-install summary

Em nenhum momento o usuário vê:
> "Vou instalar SINAPSE-AI no seu projeto.
> Idioma: PT
> IDE: Claude Code + Codex
> Modo: BROWNFIELD (detectado)
> Vault grounding: nenhum
> Confirma? [Y/n]"

**Impacto:** Sem confirmação final, o user pode estar "no piloto automático" sem perceber escolhas erradas.

### 🟠 P1 — Grounding sem auto-discovery

`promptGroundingSections()` pede "caminho absoluto pro vault" como input vazio. Não oferece:
- "Detectei vault em `~/Notes/`. Usar? [Y/n]"
- Auto-detect de Obsidian / Logseq
- Lista de sugestões

**Impacto:** Usuário sem prática deixa em branco e perde toda a inteligência de grounding (uma das vendas centrais do framework).

### 🟡 P2 — Duplicação de lógica IDE/idioma

IDE selection vive em DOIS lugares:
- `bin/commands/install.js` (global, primeiro)
- `packages/installer/src/wizard/ide-selector.js` (modular, segundo)

Modular wizard é chamado com `quiet: true` no fluxo global pra evitar double-prompt, mas dá manutenção dupla. Risco de drift.

### 🟡 P2 — `--reconfigure` não é discoverable

Não há mensagem "settings persistidas — pra reconfigurar, rode com --reconfigure". User não sabe que pode forçar reprompt.

## Arquivos com gargalos

| Arquivo | Linha | Gargalo |
|---|---|---|
| `packages/installer/src/wizard/wizard.js` | 82-98 | `selectInstallationMode()` é STUB |
| `packages/installer/src/wizard/wizard.js` | 30-74 | `runWizard()` mostra detected mode mas não pergunta |
| `bin/commands/install.js` | 71-110 | Language prompt pula silenciosamente em upsert |
| `bin/commands/install.js` | 127 | LLM/IDE prompt pula silenciosamente em upsert |
| `bin/commands/install.js` | 382-386 | Wizard chamado com `quiet: true` (suprime modular prompts) |
| `packages/installer/src/wizard/ide-selector.js` | 70-78 | Duplica IDE selection do global |
| `packages/installer/src/detection/detect-project-type.js` | 46-57 | Auto-detect sem caminho de override interativo |

## Recomendações (sem implementar)

1. **Implementar `selectInstallationMode()` real** com confirmação:
   ```
   Detectei BROWNFIELD (encontrei package.json + 3 components).
   ❯ ✓ Sim, BROWNFIELD (analisar código existente)
     ✗ Não, GREENFIELD (começar do zero)
   ```
2. **Pre-install summary obrigatório:** depois de coletar tudo, mostrar resumo + Y/n.
3. **Anunciar o "skip"** quando settings já estão persistidas: "Idioma: PT (do seu config). Pra mudar, use --reconfigure."
4. **Auto-discovery de vault/DS/brand** com fallback pra "caminho absoluto" caso falhe.
5. **Unificar IDE selection** em UM lugar (preferencialmente no wizard modular; `bin/commands/install.js` invoca ele sem `quiet`).
6. **Documentar UX contract** em `docs/installation/wizard-spec.md`: o que o installer DEVE perguntar antes de qualquer ação destrutiva.

## Verdict

**FAIL** — bloqueador pra release oficial. P0 stub torna a UX inconsistente entre fresh install e re-install, e o user nunca confirma o modo de projeto. P1s degradam adoção.

## Próximo passo

Plano de fix em PRs separados (apresentado no chat antes de executar — mudança estrutural, fora do escopo doc-only).
