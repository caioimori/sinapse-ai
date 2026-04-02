# Safe Collaboration Template

Template reutilizavel para configurar colaboracao segura em qualquer projeto.

## Uso

Copie os arquivos deste diretorio para o projeto alvo:

```bash
# 1. Regra para agentes Claude Code
cp safe-collaboration-rule.md <projeto>/.claude/rules/safe-collaboration.md

# 2. Guia para a equipe
cp parallel-workflow-guide.md <projeto>/docs/guides/parallel-workflow.md

# 3. CODEOWNERS (ajuste os usernames)
cp CODEOWNERS.template <projeto>/.github/CODEOWNERS

# 4. PR template simplificado
cp pull_request_template.md <projeto>/.github/PULL_REQUEST_TEMPLATE.md
```

## Configuracao no GitHub

Apos copiar os arquivos, configure no repositorio:

1. Settings > Rules > Rulesets > New ruleset
   - Target: `main`
   - Block direct pushes
   - Require 1 PR approval
   - Block force pushes
   - Block branch deletion
   - Dismiss stale reviews

2. Settings > Collaborators
   - Adicionar membros com permissao `Write` (nunca Admin)

3. Settings > General
   - Marcar "Automatically delete head branches"
