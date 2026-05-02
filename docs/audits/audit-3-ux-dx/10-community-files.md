# Sub-domínio 10 — Community files

**Pergunta:** CONTRIBUTING.md, CODE_OF_CONDUCT.md, ISSUE_TEMPLATE/, PR template, SECURITY.md.

## Verdict: 🟡 CONCERNS

Files básicos todos presentes (CONTRIBUTING 656L, CoC 90L, SECURITY 77L,
PULL_REQUEST_TEMPLATE.md + 4 templates extras, 4 ISSUE_TEMPLATEs em yml +
config). Quality varia: CONTRIBUTING é robusto, CoC padrão Contributor
Covenant traduzido, SECURITY tem versão obsoleta (7.x) e datas inconsistentes.
FUNDING.yaml é template do GitHub não-customizado. Issue draft jan/2025
solto.

---

## Findings

### F1 [P0] — `SECURITY.md` lista versão suportada errada

**Onde:** `SECURITY.md:5-8`
```
| Version | Supported |
|---------|-----------|
| 7.x     | Yes       |
| < 7.0   | No        |
```

**Reality:** `package.json:3` versão atual é `10.0.0-rc.11`. v7.x é legacy.
Atualizar pra:
```
| Version | Supported |
|---------|-----------|
| 10.x    | Yes       |
| < 10.0  | No        |
```

Em produto pré-GA (rc.11) afirmar suporte a 7.x é **mentira ativa** com
implicação de segurança. Researcher reportando vuln em 10.x pode ser ignorado
porque "documentação diz que só 7.x é suportado".

**Fix imediato:** Atualizar tabela.

---

### F2 [P1] — `.github/ISSUE_DRAFT_P0_missing_module.md` jan/2025 solto

**Onde:** `.github/ISSUE_DRAFT_P0_missing_module.md`
**Análise:** Coberto em sub-relatório 3 F3. Repetido aqui porque cai sob
"community files". Arquivo público. Apagar.

---

### F3 [P1] — `.github/FUNDING.yaml` é template não-customizado

**Onde:** `.github/FUNDING.yaml`
**Conteúdo atual (todas comentadas exceto custom):**
```
github: # Replace with up to 4 GitHub Sponsors-enabled usernames
patreon: # Replace with...
...
custom: ['https://f5.ventures/sinapsefullstack']
```

**Análise:**
1. Apenas `custom` está populado, com URL `f5.ventures/sinapsefullstack` —
   não-validado se está vivo, e usa nome legacy "sinapsefullstack" sem hífen
2. Outros campos com texto-template inalterado polui o arquivo

**Fix:** Limpar comentários, validar URL, considerar adicionar GitHub Sponsors.

---

### F4 [P1] — `CODE_OF_CONDUCT.md` aponta pra issues mas devia ter email privado

**Onde:** `CODE_OF_CONDUCT.md:39-41`
```
Casos de comportamento abusivo, assediador ou de outra forma inaceitavel
podem ser reportados atraves de GitHub Issues no repositorio do SINAPSE-AI:

**https://github.com/caioimori/sinapse-ai/issues**
```

**Análise:** **Sério problema.** Issues do GitHub são **públicas**. Vítima de
assédio NUNCA deve ter que reportar publicamente. Padrão Contributor Covenant
exige canal privado (email).

**Fix imediato:** Substituir por email privado de conduct@... ou Caio direto
+ instrução pra usar GitHub Security Advisories como canal alternativo se
sensível.

---

### F5 [P1] — `SECURITY.md` aponta pra org caioimori, restante do repo split-brain

**Onde:** `SECURITY.md:17, 75`
**Análise:** Coberto em sub-relatório 4 F1. Aqui resumo: "scope" diz
`caioimori/sinapse-ai`, mas API GitHub mostra `SinapseAI/sinapse-ai`.
Researcher abrindo Advisory pode bater no repo errado.

---

### F6 [P2] — `CODEOWNERS` lista apenas @caioimori

**Onde:** `.github/CODEOWNERS`
**Análise:** Bus factor = 1. Não-blocker técnico, mas mata claim de "open
source maintido". Adicionar @Matheus-soier (já listado em README como
Co-Maintainer linha 477) como secondary owner em paths não-críticos.

---

### F7 [P2] — PR template não cobre Audit follow-ups

**Onde:** `.github/PULL_REQUEST_TEMPLATE.md` lista escopos: Core, Squads,
Packages, Documentação, CI/CD, Hooks. Faltam:
- Audit fix (referência ao audit report)
- Constitutional change

**Fix:** Adicionar 2 checkboxes no Escopo.

---

### F8 [P2] — Issue template config blank_issues_enabled: true

**Onde:** `.github/ISSUE_TEMPLATE/config.yml:1`
**Análise:** Permitir issues blank derruba a triagem (templates servem pra
estruturar). Em projeto pré-GA, blank issues geram ruído.

**Fix:** Setar `blank_issues_enabled: false` ou adicionar template "Other".

---

### F9 [P2] — `SECURITY.md` data "Last updated: 2026-04-03" — atrasado

**Onde:** `SECURITY.md:77`
**Análise:** Hoje é 2026-04-28. Em 25 dias, supported versions ainda 7.x. Sinal
de doc não-mantido. Atualizar junto com F1.

---

### F10 [P3] — DISCUSSION_TEMPLATE/ não inspecionado

**Análise:** Pasta existe (`.github/DISCUSSION_TEMPLATE/`) mas não auditei
conteúdo. Recomendo verificar templates pra Q&A, Ideas, Show & Tell.

---

### F11 [P3] — `RFC_TEMPLATE.md` em `.github/` mas não usado

**Onde:** `.github/RFC_TEMPLATE.md`. Existência sem documentação de quando
usar (vs PR vs Issue) confunde contribuidor. Documentar em CONTRIBUTING ou
remover.

---

## Severity counts
- **P0:** 1 (SECURITY.md versões obsoletas — implicação de segurança)
- **P1:** 4 (issue draft solto, FUNDING template, CoC sem canal privado, SECURITY org drift)
- **P2:** 4 (CODEOWNERS bus factor, PR template, blank issues, SECURITY data)
- **P3:** 2 (DISCUSSION_TEMPLATE não auditado, RFC sem doc)

## Verdict: 🟡 CONCERNS — F1 e F4 são P0/P1 com implicação ética/segurança. Bloqueiam GA.
