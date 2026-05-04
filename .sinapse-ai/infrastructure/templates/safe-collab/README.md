# Safe Collaboration Template

Template reutilizavel para configurar colaboracao segura em qualquer projeto.

## Fonte canonica

Para a politica completa e atualizada de colaboracao paralela, use:

- `docs/guides/parallel-collaboration-source-of-truth.md`

Este README explica o template. O documento acima define a regra mestra.

## Uso rapido

```bash
bash apply.sh <projeto> <owner-github> <collab-github> [prefix1] [prefix2]
```

### Exemplo

```bash
bash .sinapse-ai/infrastructure/templates/safe-collab/apply.sh \
  /path/to/meu-projeto \
  caioimori \
  Matheus-soier \
  caio \
  soier
```

Isso cria automaticamente:
- `.claude/rules/safe-collaboration.md` — regras para agentes
- `.github/PULL_REQUEST_TEMPLATE.md` — template simplificado de PR
- `.github/CODEOWNERS` — code owners configurado
- `docs/guides/parallel-workflow.md` — guia para equipe
- Atualiza `.gitignore` com patterns de runtime

## Configuracao manual no GitHub

Apos rodar o script, configure no repositorio:

1. **Settings > Rules > Rulesets > New ruleset** (target: `main`)
   - Block direct pushes
   - Require 1 PR approval
   - Block force pushes
   - Block branch deletion
   - Dismiss stale reviews

2. **Settings > Collaborators**
   - Adicionar membros com permissao `Write` (nunca Admin)

3. **Settings > General**
   - Marcar "Automatically delete head branches"

## Arquivos incluidos

| Arquivo | Proposito |
|---------|-----------|
| `apply.sh` | Script de aplicacao automatica |
| `safe-collaboration-rule.md` | Regra para `.claude/rules/` |
| `parallel-workflow-guide.md` | Guia para equipe |
| `CODEOWNERS.template` | Template de code owners |
| `pull_request_template.md` | PR template simplificado |

## Placeholders

| Placeholder | Descricao | Exemplo |
|-------------|-----------|---------|
| `{{USER_1}}` | Nome do usuario 1 | Caio |
| `{{USER_2}}` | Nome do usuario 2 | Matheus |
| `{{user1}}` | Prefixo de branch user 1 | caio |
| `{{user2}}` | Prefixo de branch user 2 | soier |
| `{{OWNER_GITHUB}}` | Username GitHub do owner | caioimori |
| `{{COLLAB_GITHUB}}` | Username GitHub do collab | Matheus-soier |
| `{{PROJECT_NAME}}` | Nome do projeto | meu-projeto |
