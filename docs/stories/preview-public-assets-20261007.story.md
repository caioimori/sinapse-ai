---
id: preview-public-assets-20261007
status: Done
---
# Prévia local com arquivos públicos

## Status: Done

## Story
Como operador do framework, quero abrir os exemplos locais sem tornar relatórios, capturas e diagnósticos privados acessíveis pelo servidor de prévia.

## Scope
Somente `examples/framework-quality/serve.cjs` e esta story. Não alterar arquivos de contexto, instalação pessoal, dependências, ferramentas compartilhadas ou CI. Preservar arquivos e as cinco demonstrações.

## Acceptance Criteria
- [x] GET e HEAD de arquivos públicos continuam disponíveis, incluindo ranges de mídia.
- [x] Caminhos com segmentos privados ou ocultos, inclusive aliases resolvidos para esses segmentos, retornam 404; somente os oito exports públicos nominais da página de mídia são exceções. Nenhum arquivo é removido.
- [x] Tipos sem mapeamento público não são servidos; os 1.928 inputs da fonte instalada permanecem íntegros.

## File List
- `examples/framework-quality/serve.cjs`
- `docs/stories/preview-public-assets-20261007.story.md`

## Validation
Em 07.10.2026, 53 verificações focais passaram: seis rotas públicas com GET e HEAD; oito exports nominais com SHA, HEAD e Range; negação de diretórios privados, alias de fixture própria, formato não mapeado, POST e range inválido. Lint focal sem avisos; metadata desta story válida.

Os oito exports foram copiados da fonte histórica preservada, com SHA conferido e sem sobrescrever arquivos divergentes. A releitura da instalação confirmou 1.928/1.928 inputs intactos; servidor e teste de portabilidade ficam fora desses pins. Recibo privado: `examples/framework-quality/output/expertise-20261007/preview-public-assets/receipt.json`.

Este escopo restringe a prévia própria em loopback. Não comprova defesa contra toda corrida de filesystem por um processo com controle local da fonte.

## Rollback
Restaurar somente o servidor desta story ao commit anterior e reiniciar a prévia própria. A fonte de contexto instalada e seus snapshots permanecem iguais.
