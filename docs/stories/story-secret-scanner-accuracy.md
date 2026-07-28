---
status: Ready
owner: sprint-lead
executor: developer
quality_gate: quality-gate
quality_gate_tools:
  - node
  - jest
created: 2026-07-25
---

# Story: Precisao do secret scanner — placeholders de credencial e varredura completa

## User story

Como usuario do SINAPSE em um projeto consumidor, quero que o secret scanner nao
bloqueie commits por placeholders de documentacao e examine TODAS as ocorrencias de
cada padrao, para que o guard permaneca confiavel: sem falso positivo que ensine o
time a usar `--no-verify`, e sem falso negativo que deixe passar um segredo real.

## Contexto e rastreabilidade

Quatro defeitos foram observados em uma instalacao consumidora do SINAPSE 1.27.0 e
reproduzidos contra `bin/utils/secret-scanner-core.js` e
`bin/utils/staged-secret-scan.js` na `main`.

**Defeito 1 — placeholder de senha nao reconhecido.**
`PLACEHOLDER_TOKENS` cobre `your-key`, `your-secret`, `your-token` e `your-api`, mas
nenhuma variante de senha. Como `placeholderDominates()` so allowlista quando ALGUM
token casa (`matchedAny`), valores descritivos de documentacao — o literal
`secure-password`, ou `your-password-here` — retornam `false` e sao reportados como
`Hardcoded Password`.

Impacto observado: o arquivo `.sinapse-ai/product/data/supabase-patterns.md`,
distribuido pelo proprio framework, documenta `supabase.auth.signUp` com o literal
`secure-password` no campo de senha. O pre-commit bloqueia o commit desse arquivo, e a
unica saida pratica e `--no-verify` — que desliga o guard inteiro, nao so o achado
falso. Um guard que precisa ser contornado rotineiramente deixa de ser um guard.

Evidencia adicional, colhida durante a redacao desta story: o hook
`.claude/hooks/secret-scanning.cjs` bloqueou a escrita deste proprio arquivo quando o
exemplo do Supabase foi citado no formato chave-valor. O defeito reproduz na
documentacao que o descreve.

**Defeito 2 — apenas a primeira ocorrencia de cada padrao e examinada.**
`scanContent()` usa `text.match(descriptor.pattern)` e nenhum dos 27 descritores tem
a flag `g`, entao apenas o primeiro match de cada padrao por arquivo e avaliado.

Isso nao e apenas um relatorio incompleto. Os gates `lowConfidence`,
`credentialPlaceholderGated`, `entropyGated` e `hashContextGated` usam `continue`,
que avanca para o PROXIMO DESCRITOR. Quando a primeira ocorrencia e um placeholder
legitimo, o `continue` descarta o padrao inteiro e um segredo real que apareca depois
no mesmo arquivo nunca chega a ser examinado. Este e um falso negativo de deteccao.

**Defeito 3 — posicao do match obtida por busca de string.**
No gate `hashContextGated`, a janela de contexto e recortada a partir de
`text.indexOf(matched)`, que devolve a primeira ocorrencia do TEXTO, nao a posicao do
match corrente. Hoje o efeito e nulo porque so existe um match; ao corrigir o defeito
2, a janela passaria a ser avaliada na posicao errada. A correcao acompanha o item 2.

**Defeito 4 — auto-isencao nao resolve no projeto consumidor.**
`SCANNER_SELF_FILES` lista os caminhos canonicos do repositorio (`bin/utils/...`). Na
instalacao consumidora esses arquivos sao distribuidos em `.sinapse-ai/git-hooks/lib/`,
onde a isencao nao casa. O guard pode entao bloquear o commit do proprio scanner, cujas
regexes embutem formatos de token por definicao.

## Escopo

- Reconhecer placeholders descritivos de credencial por FORMA, nao por catalogo de
  tokens, evitando um jogo interminavel de adicionar variantes uma a uma.
- Avaliar todas as ocorrencias de cada padrao nomeado, preservando os gates atuais.
- Recortar a janela de contexto do gate de hash na posicao real do match.
- Fazer a auto-isencao do scanner resolver tambem na arvore do projeto consumidor.
- Cobrir cada defeito com teste que falha antes da correcao.

## Acceptance criteria

1. `isAllowlistPlaceholder` trata como placeholder os valores descritivos
   `secure-password`, `your-password-here` e `db_password`; `scanContent` nao reporta
   achado para o exemplo de `signUp` distribuido em `product/data/supabase-patterns.md`.
2. A nova regra NAO allowlista valor com digito, maiuscula ou simbolo:
   `Kq7mZ9xL2vRt8pWn` e `P@ssw0rd-secret` continuam sendo reportados.

   Nota de honestidade sobre o alcance desta regra: `MyPassword123` ja e allowlistado
   na `main` atual, porque `mypassword` consta de `PLACEHOLDER_TOKENS` e
   `placeholderDominates()` reduz o restante a `123`. Esse comportamento e anterior a
   esta story e permanece inalterado — o teste registra o estado atual em vez de
   sugerir que a mudanca o introduziu. Rever o catalogo de tokens herdado esta
   declarado em "Fora de escopo".
3. Um arquivo com duas chaves AWS distintas produz DOIS achados, um por chave.
4. Um arquivo em que a primeira ocorrencia de um padrao e placeholder e a segunda e um
   segredo real produz achado para o segredo real. (Falha na `main` atual.)
5. O gate `hashContextGated` continua ignorando hashes legitimos (integrity de
   lockfile, sha de 40/64) mesmo quando o arquivo tem varias ocorrencias, e a janela de
   contexto e recortada na posicao do match avaliado.
6. `SCANNER_SELF_FILES` isenta o scanner tanto em `bin/utils/` quanto em
   `.sinapse-ai/git-hooks/lib/`.
7. `npm test` permanece verde, sem suite silenciada ou teste marcado como skip.

## Tasks

- [ ] Adicionar padrao estrutural de placeholder descritivo de credencial em
      `PLACEHOLDER_PATTERNS`.
- [ ] Converter o laco de `NAMED_PATTERNS` para varredura global com deduplicacao.
- [ ] Trocar `text.indexOf(matched)` pela posicao real do match.
- [ ] Acrescentar os caminhos distribuidos a `SCANNER_SELF_FILES`.
- [ ] Testes em `tests/security/secret-scanner-core.test.js` para AC1-AC5.
- [ ] Teste em `tests/security/secret-scanning.test.js` para AC6.

## Riscos e controles

| Risco | Controle |
|---|---|
| A nova regra de placeholder allowlistar um segredo real fraco (ex.: `open-secret-door`) | O padrao exige valor composto SOMENTE de palavras minusculas separadas por `-`/`_` E que contenha o substantivo de credencial. Qualquer digito, maiuscula ou simbolo desqualifica. Tradeoff documentado no codigo |
| Varredura global aumentar o numero de achados e poluir a saida | Deduplicacao por texto do match dentro do mesmo descritor: ocorrencias repetidas contam uma vez, valores distintos contam separadamente |
| Regressao de performance em arquivos grandes | O laco global percorre o texto uma vez por descritor, mesma ordem de grandeza do `match` anterior; guarda contra match vazio evita laco infinito |

## Fora de escopo

- Rever os limiares de entropia (`ENTROPY_THRESHOLD`, `ENTROPY_MIN_LEN`).
- Rever o catalogo herdado de `PLACEHOLDER_TOKENS` (ver nota no AC2): entradas como
  `mypassword`, `secret123` e `password123` allowlistam valores que um leitor poderia
  considerar senhas reais fracas. E uma decisao anterior, com tradeoff proprio, e
  mudar isso agora misturaria duas discussoes no mesmo PR.
- Alterar a lista de padroes nomeados ou acrescentar novos provedores.
- Alterar o comportamento fail-closed do `staged-secret-scan.js`.
- Corrigir o conteudo de `product/data/supabase-patterns.md`: o exemplo esta correto
  como documentacao; quem precisa mudar e o scanner.

## Evidencias obrigatorias

- Saida de `npm test` para as suites de seguranca.
- Reproducao dos defeitos 1 e 2 na `main` antes da correcao.

## Definition of done

- AC1 a AC7 verificados.
- Testes acompanham cada defeito e falham sem a correcao.
- Sem alteracao de comportamento fora do escopo declarado.

## Validation record

_(preenchido na execucao)_

## Dev Agent Record

_(preenchido na execucao)_
