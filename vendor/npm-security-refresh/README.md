# npm security refresh — projeto, desenvolvimento

Fork SINAPSE baseado no npm11.19.1 oficial, com identidade própria `@sinapse-internal/npm-security-refresh@11.19.1-sinapse.1`. Não é uma release oficial corrigida do npm, atualização da ferramenta global ou publicação autorizada.

Somente cinco árvores bundled foram substituídas por distribuições oficiais verificadas: brace-expansion5.0.12, http-cache-semantics4.3.0, ip-address10.7.3, postcss-selector-parser7.1.6 e undici6.28.1. As engines originais permanecem `^20.17.0 || >=22.9.0`; nenhuma nova dependência transitiva foi necessária.

`SOURCE-MANIFEST.json` registra URLs oficiais, SHA-512 conferido antes da extração, licenças, inventário e cada delta SHA-256. São1923 arquivos upstream byte-equivalentes; todo delta restante pertence às cinco árvores ou à identidade do manifesto. O arquivo reempacotado contém2015 arquivos e conserva as licenças internas.

O caminho de reconstrução é offline. Obtenha os seis tarballs oficiais nomeados pelo manifesto e rode `node vendor/npm-security-refresh/rebuild.cjs <diretório-dos-tarballs> <novo-diretório-em-examples/framework-quality/output>`. O script verifica integridades, rejeita escapes/links, reconstrói e compara cada payload. O SHA do contêiner registra este build; diferenças de plataforma na recompactação não autorizam diferenças nos arquivos.

CLI em prefix/config/cache próprios e cinco APIs benignas tiveram oito verificações delimitadas, incluindo MockAgent sem rede. Isso não é a suíte completa do npm nem certificação de todos os exploits. Revisão independente, resolução real da alias e audit permanecem gates próprios; versões e hashes sozinhos não provam uso correto.

O npm upstream usa Artistic-2.0; seu texto integral e as cinco licenças de componentes estão preservados neste diretório e no arquivo. Esta versão modificada tem identidade própria e distribuição restrita à dependência de desenvolvimento deste projeto. A distribuição padrão pode ser obtida no registry oficial pela URL do npm registrada em `SOURCE-MANIFEST.json`; os seis arquivos-fonte oficiais e as alterações estão identificados nesse manifesto.

O fork adiciona responsabilidade de manutenção; uma distribuição upstream compatível futura deve ser reavaliada antes de substituir este artefato. Nenhuma ferramenta compartilhada, fonte instalada ou conteúdo de usuário foi modificado por sua preparação.
