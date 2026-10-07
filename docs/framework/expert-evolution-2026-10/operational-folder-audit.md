# Organização: decisão sobre os 14 grupos de duplicação

## Resultado

Os 14 grupos abrangem 34 arquivos do snapshot anterior. A revisão por consumidor indica preservação dos 14 grupos: bytes iguais não representam 34 arquivos dispensáveis. A redução de ruído deve ocorrer na navegação, mostrando uma entrada canônica por função e escondendo detalhes de distribuição.

| Grupo | Motivo para preservar | Consumidor observado |
|---|---|---|
| React Bits em dois providers | Distribuição Codex/Claude; ambas as superfícies fazem parte da paridade | scripts/validate-provider-adapters.js:224; bin/lib/global-provider-adapters.js:108 |
| Matrizes de delegação/paridade | Dois contratos lidos separadamente, mesmo conteúdo atual | .codex/scripts/resolve-codex-delegation.js:8; resolve-codex-delegation-parity.js:8; sinapse-codex.js:76 |
| Agent elicitation | Um alvo está em core protegido; retirar o outro exige migração específica | Paths .sinapse-ai/core/elicitation e .sinapse-ai/elicitation; core não editável nesta onda |
| Task elicitation | Mesma fronteira protegida e compatibilidade de runtime | Paths .sinapse-ai/core/elicitation e .sinapse-ai/elicitation |
| Framework guard | Distribuição para hooks e utilitários; mover exige instalação/paridade de hooks | .sinapse-ai/git-hooks/lib e bin/utils |
| Secret scanner core | Require local em cada cópia de staged-secret-scan | bin/utils/staged-secret-scan.js:28; .sinapse-ai/git-hooks/lib/staged-secret-scan.js:28 |
| Protected-files guard | Proteção distribuída; consolidar um path pode enfraquecer hooks instalados | Distribuição .sinapse-ai/git-hooks/lib e bin/utils |
| Staged secret scan | Bundle de publicação valida a presença do hook | bin/utils/validate-publish.js:128 |
| SQL guard | Distribuição de segurança; sem ganho de navegação no catálogo de agentes | Distribuição .sinapse-ai/git-hooks/lib e bin/utils |
| Três .gitkeep de governança | Diretórios vazios com responsabilidades distintas; custo desprezível | audits/archived, audits/promoted e governance/proposals/archive |
| Trace vigente e snapshot v1-act8 | README aponta o vigente; snapshot preserva registro histórico | docs/guides/agents/traces/README.md:17 |
| Dois aliases do orquestrador | Compatibilidade nominal, uma identidade lógica | tests/agents/backward-compatibility.test.js:381; scripts/validate-agent-codenames.js:12 |
| Cinco README de preferências | Cada squad tem contexto e caminho próprio; similaridade do template não elimina o destino | squads/{council,cybersecurity,finance,paidmedia,storytelling}/preferences |
| Quatro fixtures vazias | São entradas de casos negativos diferentes; remover altera a prova | tests/unit/squad/squad-validator.test.js:216,237,454 |

## Prova e limite

O JSON acompanhante recalcula SHA-256 de cada arquivo na worktree e registra se o cluster ainda é idêntico. As referências acima foram verificadas por busca no fonte; o documento não presume consumidores externos, dinâmicos ou instalados inexistentes.

Nenhum arquivo foi apagado, movido ou desrastreado. Consolidação física permanece candidata quando houver alvo, ganho concreto, compatibilidade e autorização de remoção. Os clusters protegidos não entram nesse escopo. O painel fornece navegação por necessidade sem exigir compreensão da árvore técnica.
