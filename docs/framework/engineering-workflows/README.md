# Workflows de engenharia

O SINAPSE integra **275 workflows canônicos + 10 aplicados, em 60 domínios**,
com pesquisa local, recuperação seletiva e acompanhamento guiado. Quatro
receitas originais organizam correções, features, arquitetura e incidentes.

O runtime controla plano, etapa, tentativas, prazo e integridade de artefatos.
O trabalho e sua verificação acontecem na sessão atual: diagramas não são
executados automaticamente e resultados fornecidos pelo agente são declarados.

## Consultar sem iniciar execução

Na raiz do checkout:

```sh
node bin/engineering-workflows.js help
node bin/engineering-workflows.js search "refatoração" --limit 3
node bin/engineering-workflows.js search "segurança" --domain 29 --limit 3
node bin/engineering-workflows.js show wave-08-w27
node bin/engineering-workflows.js show applied-w10
```

No pacote instalado, `sinapse-engineering` é o mesmo comando. A nova versão
precisa estar instalada para esse binário existir; um PR não atualiza a
instalação global nem as sessões já abertas.

`catalog` apresenta o inventário completo; no trabalho cotidiano prefira
`search` e depois `show`. A busca explica os termos que pontuaram cada
resultado; os filtros por domínio usam a associação temática da onda original,
não uma classificação semântica individual dos 285 diagramas.

IDs `wave-08-w27` identificam a onda e a posição no catálogo; `applied-w10`
identifica a camada aplicada. Sete loops mestres também são workflows reais da
fonte. Títulos e headings originais permitem conferir a correspondência.

## Preparar o menor caminho seguro

```sh
node bin/engineering-workflows.js plan --input docs/framework/engineering-workflows/examples/quick-fix.json
```

O JSON contém objetivo, critério de conclusão, workflows e sinais explícitos.
Somente correção simples, de baixo risco e reversível usa o caminho rápido;
arquitetura, migração, risco elevado ou irreversibilidade acrescentam desenho e
recuperação. Risco omitido recebe tratamento conservador.

O seletor anterior de aplicabilidade continua disponível sem mudança de
contrato. Se `signals` for informado, o plano incorpora suas recomendações
advisory; sinais desconhecidos precisam ser resolvidos antes do início.
As regras vigentes do projeto determinam autorizações e documentação necessária.

## Iniciar, registrar e retomar

Use `--root` com a raiz real do projeto em que o trabalho será feito.
O exemplo usa o diretório atual:

```sh
node bin/engineering-workflows.js start correcao-validacao --root . --input docs/framework/engineering-workflows/examples/quick-fix.json
node bin/engineering-workflows.js status correcao-validacao --root .
```

O estado fica em `.sinapse/workflow-state/engineering/correcao-validacao.json`.
`status` não altera o arquivo; ele retorna a etapa atual e verifica a
integridade do plano, das fontes selecionadas e dos artefatos já registrados.

Depois de realizar a etapa e salvar sua evidência sanitizada no próprio
projeto, crie um JSON como este, ajustando etapa e revisão ao `status`:

```json
{
  "expectedRevision": 0,
  "stageId": "inspect",
  "outcome": "pass",
  "evidencePath": "evidence/baseline.md",
  "notes": "Comportamento reproduzido e critério confrontado com os casos observados."
}
```

```sh
node bin/engineering-workflows.js advance correcao-validacao --root . --input evidence/etapa.json
```

Só a etapa atual pode avançar. Reusar revisão antiga, apontar evidência vazia
ou externa ao projeto, alterar evidência registrada ou trocar fonte exige
revisão do responsável. O runtime rejeita atalhos por caminhos sensíveis,
traversal e links de filesystem.

Use um artefato imutável por registro: a baseline original deve continuar
disponível depois da correção. O estado guarda caminho, tamanho e hash,
resultado declarado e nota; não copia o conteúdo da evidência.

## Ler os resultados corretamente

| Estado | Significado |
|---|---|
| `in-progress` | Há uma etapa atual com trabalho pendente. |
| `review-required` | A tentativa falhou e ainda há orçamento para corrigir. |
| `exhausted` | A etapa atingiu o limite de tentativas. |
| `timed-out` | O prazo terminou; não é possível continuar a execução. |
| `human-checkpoint` | Há decisão ou ação que exige outro caminho de autoridade. |
| `completed` | Todas as etapas receberam evidência e resultado `pass` declarados. |

`completed` não atesta a correção semântica do código, aceite do usuário,
publicação, autenticação ou persistência em produção. As verificações reais
pertinentes ao lote continuam necessárias e suas limitações devem ser relatadas.

O limite padrão é de três tentativas por etapa e quinze minutos por execução.
Os tetos configuráveis são dez tentativas por etapa e uma hora. Não há daemon,
repetição automática, chamada de modelo ou contratação de serviço.

Execução encerrada, expirada ou em checkpoint não é reaberta com uma flag de
aprovação. Após resolver a causa, prepare uma continuação revisada com novo ID,
preservando o registro anterior e as autorizações específicas da conversa.

## Providers, fontes e atualização

`$sinapse-engineering` no Codex e a skill de mesmo nome no Claude Code usam o
mesmo contrato. A fonte canônica está em `.agents/skills/sinapse-engineering`;
o sincronizador entrega o mesmo conteúdo à superfície Claude.

As fontes são cópias dos arquivos públicos da base, conferidas contra a revisão
`800879af8f7d1289ce67c80e7da5d76ee70d2dbe`. O manifesto registra hash da cópia
versionada e da publicação, inclusive diferenças apenas de finais de linha.
Uso cotidiano é inteiramente local e não depende do acesso ao repositório fonte.

Atualização é manual e exige acesso legítimo à fonte e correspondência com os
arquivos públicos. Não há sincronização recorrente nem ativação de CI:

```sh
node scripts/import-engineering-workflows.js --revision <SHA-completo-de-40-caracteres>
```

O importador confere download, licença, contagem e conteúdo antes de publicar o
novo catálogo. Consulte [a atribuição e as licenças](../../../NOTICE.md),
[o contrato de implementação](spec.md) e [a validação observada](handoff.md).
