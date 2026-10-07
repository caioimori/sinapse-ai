# Refresh focal de dependências — 07.10.2026

Atualização restrita às cadeias de desenvolvimento vulneráveis. A resolução foi feita em scratch com os dois manifests de workspace reais, `--package-lock-only --ignore-scripts`, sem instalar a árvore de desenvolvimento, executar lifecycle, mudar ferramentas globais ou alterar CI/hooks. A compatibilidade funcional completa depende da nova CI.

| Cadeia | Antes | Resolução proposta |
| --- | --- | --- |
| brace-expansion fora do bundle npm | 5.0.8 | 5.0.12 |
| browserslist | 4.28.2 | 4.28.7 |
| baseline-browser-mapping | 2.10.38 | 2.11.0 |
| undici de @actions/http-client | 6.27.0 | 6.28.1 |
| undici de @semantic-release/github | 7.28.0 | 7.29.1 |
| npm, dependência de @semantic-release/npm | 11.18.0 | 11.19.1 |

São18 entradas alteradas no lock, sem adições ou exclusões de pacotes. Três bases de dados do browserslist precisaram atualizar porque as versões anteriores não satisfaziam seus novos ranges mínimos: caniuse-lite, electron-to-chromium e node-releases. As demais alterações pertencem ao bundle oficial do npm ou às cadeias acima. Todos os128 registros anteriores de produção permanecem byte-equivalentes; o runtime isolado já instalado não precisou ser reinstalado.

`npm view` confirmou versões, engines, licenças e integridades oficiais antes da resolução. npm11.19.1 mantém `^20.17.0 || >=22.9.0`; undici7.29.1 exige `>=20.18.1`, compatível com os runners atuais Node20/22/24. npm12 e undici8 não foram adotados: suas engines atuais excedem o Node20 desta matriz. O alias `braces=file:vendor/braces-depth-guard` e o override `$braces` continuam intactos.

O [tarball oficial npm11.19.1](https://registry.npmjs.org/npm/-/npm-11.19.1.tgz), de3.002.869 bytes, teve SHA-512 conferido antes da leitura. Sete manifests internos foram comparados ao lock; o bundle entrega tar7.5.22, mas ainda traz brace-expansion5.0.9, http-cache-semantics4.2.0, ip-address10.5.0, postcss-selector-parser7.1.4 e undici6.28.0. Overrides globais não foram apresentados como substituição desses bytes internos. A tentativa same-major npm11.21.0 manteve os mesmos cinco advisories e não foi promovida.

O audit do novo lock em scratch observou **cinco advisories: três HIGH e dois MODERATE**, todos no bundle npm de desenvolvimento. Antes eram nove: sete HIGH e dois MODERATE. **Não é audit zero nem resolução de toda a segurança.** Produção permanece separada: audit real do runtime isolado e check remoto do primeiro commit e7b73b92 observaram zero vulnerabilidades de produção; isso não é prova de execução da nova árvore de desenvolvimento.

Os três HIGH que restavam nessa etapa eram brace-expansion, http-cache-semantics e undici do bundle npm. Os dois MODERATE eram ip-address e postcss-selector-parser desse bundle. Essa etapa histórica foi seguida pela solução T08 abaixo, preservando os receipts anteriores. Nenhuma suíte/build/e2e local foi iniciada com C: abaixo de10GB.

Receipts privados preservados em `examples/framework-quality/output/pending-20261007/`: `dev-advisory-triage.json`, `dev-patched-candidates.json`, `dev-lock-plan.json`, `dev-lock-audit.json`, `npm-bundle-proof.json` e `dev-dependency-refresh-receipt.json`. Os tarballs, caches e logs permanecem locais e não integram a entrega pública nem HOME.

## T08 — bundle próprio de desenvolvimento

Após ADR aceita e revisão independente **PASS STATIC WITH LIMITS**, o alias de desenvolvimento foi promovido para `@sinapse-internal/npm-security-refresh@11.19.1-sinapse.1`, arquivo local SHA-256 `c27f314b93b1d64cd744393914868615c0ac01353983520e3cc8bdacf79cb91d`. Não é release oficial do npm nem alteração da ferramenta global. O npm upstream mantém licença Artistic-2.0 integral; as cinco licenças dos componentes também acompanham o artefato público.

Somente as cinco árvores oficiais verificadas mudam: brace-expansion5.0.12, http-cache-semantics4.3.0, ip-address10.7.3, postcss-selector-parser7.1.6 e undici6.28.1. Os1923 arquivos upstream restantes são byte-equivalentes; os92 deltas pertencem a essas árvores ou à identidade própria. Engines permanecem iguais e nenhuma dependência transitiva adicional foi necessária. [Proveniência pública](../../../vendor/npm-security-refresh/SOURCE-MANIFEST.json) registra seis URLs oficiais, integridades, licenças e todos os deltas.

Reconstrução offline a partir dos seis tarballs verificados reproduziu2015 payloads e o mesmo SHA do artefato. O parser recebe os bytes cujo SHA-512 já foi conferido, sem reabrir a fonte por caminho. Oito probes benignos delimitados passaram, incluindo CLI com config/cache/prefix próprios e MockAgent sem rede. A revisão é estática e esses probes não representam a suíte completa do npm.

O lock da alias exata observou **zero advisories no audit local de resolução**, preservando128 registros de produção byte-equivalentes. Ainda não é prova da instalação completa de desenvolvimento ou da CI remota deste novo commit. O teste `tests/unit/npm-security-refresh.test.js` exige identidade instalada, versões e92 hashes reais, CLI offline e APIs dos cinco componentes. Sintaxe/lint locais passaram; sua execução real ficará na matriz remota existente, sem alterar a CI.

### Readback remoto da fonte estável

Na fonte `bee125db9a83e7ff13f8de3b879c10360e60c4b1`, o teste do npm realmente instalado passou nos cinco jobs: Node20, Node24, Coverage22, macOS e Windows. Portanto, identidade própria,92 hashes de payload, cinco versões/resoluções, CLI com configuração isolada e APIs benignas offline foram observados após a instalação real feita pela CI, não somente no espelho de preparação.

O Security Audit remoto observou **zero vulnerabilidades em produção e na árvore completa instalada de desenvolvimento**. Essa contagem é do scanner e deste SHA; não é certificação de toda a segurança do fork/repositório. Gitleaks não encontrou vazamentos; o check autoritativo CodeQL informou zero novo alerta nesta PR. A matriz manteve185 skips e oito todo preexistentes; o job full-cross-platform foi dispensado pela regra existente de PR, enquanto os jobs Mac/Windows efetivamente executaram e passaram.

O runtime pessoal foi migrado por CAS para a mesma fonte estável após essas provas:1929 pins, nove destinos compilados,42 contextos offline selecionados, dois provedores/roots e quatro rejeições esperadas. Preservados262 payloads pessoais,193 entradas do checkout original e três históricos de fonte; journal/snapshots novos e os dois anteriores foram conferidos. Esse readback é offline e não certifica172 execuções nativas.

Receipts T08 privados: `npm-fork-candidate.json`, `npm-fork-probes.json`, `npm-fork-lock-plan.json`, `npm-fork-lock-audit.json` e `npm-fork-promotion-receipt.json`. Nenhuma nova cobrança, instalação global, full DEV local, CAS/HOME, merge ou publicação ocorreu nesta etapa.
