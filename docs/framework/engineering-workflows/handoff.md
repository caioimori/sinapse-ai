# Estado do lote — 08/11/2026

Implementação isolada na branch `codex/feat/engineering-workflows-20261108`,
base `842eeabc4e9fe39d42f1119c9dc85a8a1e70cbc5`, acompanhada na
[issue #424](https://github.com/caioimori/sinapse-ai/issues/424).

## Entregue no código

- 275 workflows canônicos, 10 aplicados e catálogo dos 60 domínios.
- Fontes públicas preservadas, revisão fixa, licença e manifesto de integridade.
- Busca explicável, recuperação seletiva e importação manual limitada.
- Quatro receitas originais e plano proporcional com critério de conclusão.
- Ciclo guiado com evidências, retomada, limite, timeout e concorrência.
- CLI adicional, skills equivalentes e inclusão dos arquivos no pacote npm.

O checkout original e seus arquivos alterados foram preservados. Nenhum arquivo
protegido, hook ou CI foi alterado; nenhuma ação de produção foi executada.

## Evidência observada

| Verificação | Resultado |
|---|---|
| Recuperar todos os workflows com hash conferido | 285/285 contratos |
| Integridade das fontes e índice | 16/16 arquivos, 510.812 bytes |
| Reconstrução offline do catálogo | Metadados idênticos à importação |
| Busca PT-BR, ordenação e domínio inválido | Casos focados passaram |
| Runtime e casos negativos | 19 testes focados, sem falha ou skip |
| CLI em processos separados e raiz isolada | Seis etapas, retomada e conclusão registrada |
| Revisão antiga, evidência alterada e ID desconhecido pela CLI | Rejeitados |
| Empacotamento simulado, sem scripts de build | CLI, duas skills, fontes e NOTICE incluídos |
| Sintaxe JS e whitespace do diff | Conferidos |

A revisão independente encontrou um estado impossível que poderia aparecer
como concluído. A correção valida o histórico por replay e reconcilia etapa,
revisão, tentativas, timestamps e status; teste de regressão incluído.

Cinco contadores de frontmatter estavam defasados nas fontes originais.
O catálogo preserva essa informação e conta os headings reais, incluindo sete
loops mestres. Não foram criados workflows para completar contagem.

## Limitações e entrega

O executor registra resultado declarado e integridade do artefato; ele não
comprova semântica, produção ou autorização externa. Nenhum dos 285 diagramas
foi apresentado como programa automaticamente executado.

Build e suíte completa não executados: C: tinha cerca de 4,4 GB livres.
Lint e validação dinâmica dos adapters dependem de ferramentas de desenvolvimento
ausentes no checkout; não houve instalação de dependências para o runtime.

Branch e PR seguem o fluxo de entrega autorizado; merge, publicação npm,
instalação global e atualização de sessões não fazem parte deste lote.
