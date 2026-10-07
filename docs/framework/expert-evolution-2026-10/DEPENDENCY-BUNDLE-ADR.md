# Bibliotecas empacotadas do npm — decisão de reparo

Status: Accepted para o lote local/PR de 07.10.2026; sem publicação NPM, produção ou alteração de ferramenta global. O novo pedido de Caio autoriza correções de segurança do framework. Os cinco avisos adicionais surgiram na validação remota desta rodada e constituem uma preocupação nova, além dos reparos iniciais.

## Evidência e escolha

O audit remoto de `e7b73b92` mostrou nove avisos na árvore completa, apesar do audit de produção aprovado. O refresh focal same-major reduziu a árvore local a cinco: três HIGH e dois moderados. As distribuições oficiais npm 11.19.1 e 11.21 ainda empacotam as mesmas cinco bibliotecas afetadas; overrides não substituem seus bytes. As versões patched e engines foram conferidas no registro oficial antes de instalação.

Escolha: fork local restrito à dependência de desenvolvimento npm, com identidade própria, baseado no tarball oficial 11.19.1 verificado por SHA-512. Atualizar somente cinco árvores bundled com tarballs oficiais compatíveis: brace-expansion 5.0.12, http-cache-semantics 4.3.0, ip-address 10.7.3, postcss-selector-parser 7.1.6 e undici 6.28.1. Uma dependência transitiva nova só entra se exigida pelo manifesto patched e com a mesma verificação oficial.

O arquivo vendorizado conserva todas as licenças e inclui manifesto público de origem/deltas. Nome e versão identificam o fork SINAPSE; não anunciar uma release oficial corrigida do npm. A alias de desenvolvimento aponta para o arquivo local; consumidores de produção permanecem iguais. A ferramenta npm global e os hooks existentes não mudam.

## Alternativas e consequências

- Apenas atualizar npm 11: já observado como insuficiente, com cinco avisos bundled persistentes.
- Overrides ou edição cosmética do lock: rejeitados porque não corrigem os arquivos executados.
- npm 12/undici 8: rejeitados por incompatibilidade com Node 20 nesta matriz.
- Remover npm: rejeitado sem prova de dispensabilidade e autorização de remoção.

O fork exige manutenção própria e não recebe garantia do mantenedor upstream. É uma correção estreita e auditável para a PR, com maior responsabilidade de atualização; a próxima release oficial compatível deve ser reavaliada. Zero avisos no scanner não certifica o fork.

## Contrato de execução e freio

1. Devops verifica integridade, inventário e contenção antes de extrair cada tarball em scratch próprio. Rejeitar paths absolutos, escapes, symlinks e entradas inesperadas; sem lifecycle.
2. Reempacotar com identidade própria e cinco deltas delimitados. Todos os demais arquivos upstream devem permanecer byte-equivalentes; registrar hashes, versões, licenças e arquivos alterados.
3. Conferir os bytes realmente empacotados, resolução das bibliotecas, APIs benignas e CLI em scratch, sem chamadas de rede, credenciais ou escrita em configuração compartilhada.
4. Revisão independente precede promoção da alias e lock. Audit, engines Node 20, instalação e testes completos são conferidos no CI existente.

Máximo duas tentativas. Se forem necessários patches no código do npm, mudanças de engine, alteração de ferramenta compartilhada ou cadeia transitiva fora dos cinco deltas justificados, interromper esta subtask e registrar o impedimento. Nenhum build, suíte, e2e ou instalação completa de desenvolvimento local com C: abaixo de 10 GB.

Rollback: conservar o tarball upstream e o refresh mínimo anterior no scratch privado; reverter somente alias/lock/artefatos novos deste lote. Fontes instaladas, usuários, dados, históricos e snapshots anteriores não são tocados.
