# Troubleshooting — SINAPSE-AI

> Problemas comuns e soluções diretas. Se não resolver aqui, abra issue em https://github.com/caioimori/sinapse-ai/issues.

## Comando padrão de diagnóstico

```bash
npx sinapse-ai doctor          # roda 16 health checks
npx sinapse-ai doctor --fix    # tenta corrigir o que estiver errado
```

90% dos problemas resolvem aí.

## Problemas de instalação

### `npx sinapse-ai install` falha
```bash
# Limpe cache e tente de novo
rm -rf ~/.sinapse-ai
npx sinapse-ai@latest install
```

Se persistir, valide Node.js:
```bash
node --version    # precisa >= 20
```

### Postinstall falha em CI
Defina `SINAPSE_SKIP_POSTINSTALL=1` antes do `npm install`:
```bash
SINAPSE_SKIP_POSTINSTALL=1 npm install sinapse-ai
```
Depois rode `sinapse doctor --fix` manualmente.

### Windows: erro de path com espaços
Use aspas duplas em paths com espaço:
```powershell
npx sinapse-ai install --target "C:\Users\My User\projeto"
```

## Problemas de ativação de agentes

### `@developer` não ativa
1. Verifique IDE detectada: `cat .claude/settings.json` (Claude Code) ou `cat .codex/instructions.md` (Codex)
2. Re-sincronize: `npx sinapse-ai install --reconfigure`
3. Reinicie o IDE

### Agente ativa mas sem comandos
```bash
npm run sync:ide          # re-sincroniza Claude Code
npm run sync:ide:codex    # re-sincroniza Codex
```

## Problemas de hooks

### Hook bloqueando operação válida
Cheque qual hook bloqueou (mensagem de erro tem o nome). Exemplos:
- **enforce-story-gate**: precisa story em `docs/stories/` antes de mexer em paths protegidos. Crie story OU use `@sprint-lead *draft`.
- **enforce-git-push-authority**: só `@devops` pode push. Delegue: `@devops *push`.
- **secret-scanning**: detectou secret. Verifique e remova OU mova pra `.env` (gitignored).

Lista completa de hooks: `.claude/hooks/README.md`.

### Hook não está rodando
```bash
cat .claude/settings.json | grep hooks    # confirma registro
ls .claude/hooks/                          # confirma arquivo existe
```

## Problemas de CI

### Article XI gate falha em PR de delete
Adicione no commit message OU PR body:
```
Article XI override: <razão concreta da deletion>
```

### Article VII (Metrics Accuracy) falha
README divergiu da Constitution:
```bash
npm run sync:counts                 # regenera constitution
npm run validate:article-vii        # confirma OK
```

### Coverage threshold não bate
```bash
npm run test:coverage
cat coverage/coverage-summary.json   # números reais
```
Se real ≥ threshold, é flake — re-rodar. Se real < threshold, precisa adicionar testes OU baseline foi quebrada.

## Problemas de update

### `npm update sinapse-ai` quebra projeto
```bash
npx sinapse-ai update         # use o updater do framework, não npm
```

### Customizações sumiram após update
Não deveria. Updater faz upsert idempotente. Reporte bug com diff de `.claude/`.

## Como reportar bug

```bash
# Coleta info pro report
npx sinapse-ai doctor > doctor.txt
node --version > env.txt
npx sinapse-ai --version >> env.txt
```
Anexe `doctor.txt` + `env.txt` na issue + descreva passos pra reproduzir.

---

*Não resolveu? Abra issue: https://github.com/caioimori/sinapse-ai/issues/new*
