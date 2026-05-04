## Resumo
<!-- Descreva brevemente o que essa PR faz (1-3 frases) -->

## Story
<!-- OBRIGATORIO: Link para a story associada -->
**Story:** `docs/stories/__.story.md`

## Tipo de Mudanca
<!-- Marque o que se aplica -->
- [ ] Bug fix (correcao que nao quebra funcionalidade existente)
- [ ] Nova feature (funcionalidade nova)
- [ ] Breaking change (mudanca que quebra compatibilidade)
- [ ] Documentacao
- [ ] Refatoracao
- [ ] Teste
- [ ] Infraestrutura / CI/CD

## Escopo
- [ ] Core framework (.sinapse-ai/)
- [ ] Squads / Agents
- [ ] Packages / Installer
- [ ] Documentacao (docs/)
- [ ] CI/CD (.github/)
- [ ] Hooks / Rules (.claude/)

## Como Testar
<!-- Passos para validar as mudancas -->
1.
2.
3.

---

## Quality Gates

| Gate | Status |
|------|--------|
| `npm run lint` | :question: |
| `npm run typecheck` | :question: |
| `npm test` | :question: |
| Coverage | :question: |
| CodeRabbit | :question: |

## Security Checklist
- [ ] Revisei o codigo para vulnerabilidades (injection, XSS, path traversal)
- [ ] Nenhuma issue de seguranca nova introduzida
- [ ] Nenhum dado sensivel exposto (API keys, tokens, passwords, .env)

## CodeRabbit Review
- [ ] Nenhum finding CRITICAL
- [ ] Findings HIGH foram endereacados ou justificados
- [ ] Sugestoes de melhoria consideradas

## Art. X Reminder
> Antes de merge para producao, verifique os [25 deployment blockers](../.claude/rules/security-data-protection.md) (Tier 1: absolutos, Tier 2: compliance LGPD, Tier 3: operacionais).

## Checklist Final
- [ ] Testei localmente (todos os quality gates passam)
- [ ] Story atualizada com progresso e File List
- [ ] Nao modifiquei .sinapse-ai/core/ sem aprovacao do @architect (Stratum)
- [ ] Sem senhas, tokens ou chaves no codigo
- [ ] PR title segue Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)
