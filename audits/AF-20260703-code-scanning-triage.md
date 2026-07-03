---
id: AF-20260703-code-scanning-triage
title: "Triagem do GitHub Code Scanning — sinapse-ai"
date: 2026-07-03
author: analista de segurança (story Onda2-P10)
status: análise concluída — nenhuma mudança de código, nenhum dismissal
repo: caioimori/sinapse-ai
scanned_commit: d2d50c3d78d23d5884ea00579d78e502c27bc2d6 (origin/main, tip no momento da triagem)
scanner: CodeQL 2.25.6 (100% dos 429 alertas)
---

# AF-20260703 — Triagem do Code Scanning (429 alertas)

## 1. Sumário executivo

O total real hoje é **429 alertas abertos**, não "500+" como estimado no contexto da story — a diferença provavelmente reflete uma contagem anterior ou alertas já endereçados entre a criação da story e esta triagem; não há como reconstituir a causa exata sem histórico do dashboard, então fica registrada como discrepância, não corrigida silenciosamente. Dos 429, **85% (366) vivem em `tests/`** e nunca saem do repositório; só **62 alertas (14%) chegam ao pacote publicado no npm** (`ships_to_npm`, derivado do array `files` do `package.json`), e desses, a leitura linha-a-linha no commit exato analisado (`d2d50c3d78`, tip de `main`) mostra que a maior categoria isolada (24 instâncias de "insecure-temporary-file") tem um rótulo que não bate com o código real — escreve em `~/.claude` e `~/.sinapse` do próprio usuário, não no diretório temporário do SO — e o único alerta "high" citado nominalmente no contexto da story (polynomial-redos) foi **refutado com benchmark empírico** (tempo linear até 5.000.000 de caracteres, ver §3). Nenhum dos 429 alertas configura um CRÍTICO-REAL no modelo de ameaça de um CLI local single-user; os itens que merecem correção real são MODERADOS, de custo baixo, e estão listados no plano de ondas (§6).

**Placar:**

| Corte | Valores |
|---|---|
| Total | **429** (100% CodeQL; 0 Dependabot/secret-scanning nesta consulta) |
| Por `security_severity_level` (GitHub) | high **257** · medium **4** · sem classificação de segurança (pura qualidade de código) **168** |
| Por `rule.severity` (CodeQL cru) | warning 266 · note 159 · error 4 |
| Por exposição (Eixo 1) | tests/fixtures **366** (85,3%) · produção **50** (11,7%) · scripts internos **8** (1,9%) · docs/templates **5** (1,2%) |
| Por `ships_to_npm` (embarca no pacote publicado) | não **367** (85,5%) · sim **62** (14,5%) |
| Categorias distintas (`rule.id`) | 15 |

## 2. Matriz exposição × categoria

Classificação aplicada a 100% dos 429 alertas (script determinístico sobre os campos `number`, `rule.id`, `rule.severity`, `rule.security_severity_level`, `most_recent_instance.location.path/start_line`, coletados via `gh api code-scanning/alerts?state=open&per_page=100 --paginate`).

**Eixo 1 — exposição**, definido cruzando o path do alerta com o array `files` de `package.json` (não com suposição — o `files` foi lido e o matcher replica as regras positivas/negativas dele, incluindo o re-include final de `.sinapse-ai/development/templates/**`):
- **Produção** — `bin/`, `.sinapse-ai/**` (menos node_modules/tests/dist), `packages/**` (workspace `packages/installer`, real e ativo — 74 arquivos, confirmado via `git ls-tree`)
- **Tests/fixtures** — `tests/`, `__tests__/`, `*.test.*`, `*.spec.*`
- **Scripts internos** — `scripts/`, `.github/`
- **Docs/templates/exemplos** — `docs/**`, `templates/`, `examples/`

| Categoria (`rule.id`) | Total | Produção | Tests/fixtures | Scripts internos | Docs/templates | `security_severity` |
|---|---:|---:|---:|---:|---:|---|
| `js/insecure-temporary-file` | 207 | 24 | 182 | 1 | 0 | high |
| `js/unused-local-variable` | 159 | 2 | 157 | 0 | 0 | — (qualidade) |
| `js/file-system-race` | 43 | 18 | 21 | 4 | 0 | high |
| `js/xss-through-dom` | 5 | 0 | 0 | 0 | 5 | high |
| `js/useless-assignment-to-local` | 4 | 2 | 2 | 0 | 0 | — (qualidade) |
| `js/unused-loop-variable` | 2 | 0 | 2 | 0 | 0 | — (qualidade) |
| `js/polynomial-redos` | 1 | 1 | 0 | 0 | 0 | high |
| `js/regex/missing-regexp-anchor` | 1 | 1 | 0 | 0 | 0 | high |
| `js/indirect-command-line-injection` | 1 | 0 | 0 | 1 | 0 | medium |
| `js/trivial-conditional` | 1 | 1 | 0 | 0 | 0 | — (qualidade) |
| `js/superfluous-trailing-arguments` | 1 | 0 | 1 | 0 | 0 | — (qualidade) |
| `js/regex/duplicate-in-character-class` | 1 | 0 | 1 | 0 | 0 | — (qualidade) |
| `js/log-injection` | 1 | 1 | 0 | 0 | 0 | medium |
| `js/bad-code-sanitization` | 1 | 0 | 0 | 1 | 0 | medium |
| `actions/missing-workflow-permissions` | 1 | 0 | 0 | 1 | 0 | medium |
| **TOTAL** | **429** | **50** | **366** | **8** | **5** | |

**Achado sobre `ships_to_npm`** (cruzamento fino que a story pediu para confirmar): dos 8 alertas em "scripts internos", **7 embarcam no npm** (`scripts/` está no `files` do `package.json` — não é "interno" no sentido de blast radius, é distribuído) e só 1 não embarca (`.github/workflows/quarterly-gap-audit.yml`, categoria `actions/*`, que fica fora do array `files`). Dos 5 em "docs/templates", **os 5 embarcam** (`docs/framework/` está no `files`). Ou seja: **62 alertas realmente saem da máquina do autor** — 50 produção + 7 scripts + 5 docs — e é sobre esses 62 que a avaliação de risco em §3/§4 se debruça de verdade.

`packages/` merece nota à parte: o Glob inicial de exploração não encontrou nada em `packages/**` (ferramenta com soluço), mas `git ls-tree` confirmou que `packages/installer/` é real, ativo, 74 arquivos, idêntico em `HEAD` e `origin/main` — é o workspace do instalador citado na story como possibilidade, e concentra boa parte dos achados de produção (26 dos 50).

## 3. Top-10 alertas reais mais graves

Cada item foi lido no código-fonte exato do commit escaneado (`git show d2d50c3d78:<path>`, não no working tree local — a branch atual diverge de `main` e os números de linha não batem 1:1 com o checkout local; ver §7).

**#1 — TOCTOU na cadeia de confiança do instalador (assinatura do manifesto)**
`js/file-system-race` · `packages/installer/src/installer/manifest-signature.js:334` e `:362` · alertas #19, #20
```js
// :334 (modo dev sem assinatura obrigatória)
content: fs.readFileSync(manifestPath),
// :362 (modo normal)
const manifestContent = fs.readFileSync(manifestPath);
const signatureContent = fs.readFileSync(signaturePath, 'utf8');
const verifyResult = verifyManifestSignature(manifestContent, signatureContent, options);
```
Avaliação: é o código que **verifica a integridade criptográfica do manifesto de instalação** — o candidato mais "tematicamente crítico" do lote, porque um TOCTOU aqui mina o próprio controle de integridade. Na prática, para explorar, o atacante precisaria já ter um processo concorrente com permissão de escrita no mesmo arquivo, na mesma máquina, na mesma janela de milissegundos — no modelo de ameaça de CLI local single-user isso equivale a "já ter execução de código na máquina", ou seja, sem cruzar fronteira de privilégio nova. **Veredito: MODERADO** (não crítico-real) — vale endurecer (ler uma vez, hashear o buffer lido, não reler) porque é barato e é a peça mais sensível do lote, mas não é uma porta de entrada.
Fix sugerido: ler o arquivo uma única vez para buffer e passar o mesmo buffer para verificação e uso, eliminando a segunda leitura.

**#2 — TOCTOU no hasher de integridade de arquivos instalados**
`js/file-system-race` · `packages/installer/src/installer/file-hasher.js:78/81/113/116` · alertas #15, #16, #17, #18
```js
content = fs.readFileSync(filePath);       // binário
const rawContent = fs.readFileSync(filePath, 'utf8'); // texto, depois normalizado e re-hasheado
```
Mesma família do #1 (o hash calculado aqui alimenta a comparação contra o manifesto assinado). **Veredito: MODERADO**, mesmo raciocínio — 4 instâncias no mesmo arquivo, mesmo padrão, mesmo fix.
Fix sugerido: idêntico ao #1 — uma leitura, um buffer, sem reabertura do handle.

**#3 — DOM-XSS real no dashboard interno do framework**
`js/xss-through-dom` · `docs/framework/atlas/atlas.html:347-384` (5 instâncias) · alertas #524-#528
```js
const code=s=>'<code>'+(s||'')+'</code>';               // sem escape
document.getElementById('t-agents').innerHTML = tbl([...], rows.map(a=>[code(a.id), a.persona||'—', ...]));
```
Os dados (`D.agents`, `D.squads`, `D.rules`, `D.workflows`) vêm de `docs/framework/atlas/atlas-data.json`, gerado a partir do registro de agentes/squads do próprio framework — **conteúdo que qualquer PR externo de contribuição open-source pode influenciar** (um campo `persona`/`role`/`description` de um agente novo com HTML embutido, se passar por review sem ser notado, vira XSS armazenado que dispara quando alguém abrir o atlas localmente ou publicado). Requer PR maliciosa não pega em review + vítima abrir o HTML — não é trivial, mas é um padrão real de DOM-XSS, não um ruído de linter. **Veredito: MODERADO.**
Fix sugerido: trocar a concatenação de string por um helper de escape HTML (`&<>"'` → entidades) antes de interpolar em `code()`/`sev()`/`tbl()` — mecânico, mesmo padrão nas 5 ocorrências.

**#4 — log-injection no fluxo de update**
`js/log-injection` · `packages/installer/src/updater/index.js:787` · alerta #32
```js
log(message) { if (this.options.verbose) console.log(`[SINAPSEUpdater] ${message}`); }
```
Tracei os call-sites de `this.log(...)` na mesma classe: a maioria é mensagem fixa, mas várias interpolam `error.message` vindo de parsing de JSON/rede (`npm registry error`, `Could not read version.json`) e uma monta a partir do resultado de checagem de versão do **registro npm** (`Running: npm install sinapse-ai@${targetVersion}`). Se o texto de erro ou a resposta do registro contiver sequências de escape ANSI/controle, dá para forjar linhas de log falsas no terminal do usuário (log/terminal injection — CWE-117), não execução de código. Exploração exige controlar a resposta do registro npm ou uma mensagem de erro específica — estreito, mas real. **Veredito: MODERADO.**
Fix sugerido: strip de caracteres de controle (`\x00-\x1F` exceto `\n` normal) antes de interpolar em `console.log`, ou logger estruturado.

**#5 — indirect-command-line-injection (categoria citada nominalmente na story) — rastreado e atenuado**
`js/indirect-command-line-injection` · `scripts/validate-article-xi.js:66` · alerta #507
```js
function gitExec(cmd) { return execSync(cmd, { cwd: ROOT, ... }).toString(); }
// cmd é montado com baseRef, vindo de --base OU de process.env.GITHUB_BASE_REF
```
Rastreei a origem do taint até o workflow que chama este script (`.github/workflows/article-gates.yml`): `GITHUB_BASE_REF: ${{ github.base_ref }}`. `github.base_ref` é o **nome da branch-alvo do PR**, escolhido pelo GitHub a partir das branches que já existem no repositório de destino — um contribuidor externo não consegue setar esse valor para uma string arbitrária (só pode escolher entre branches existentes, tipicamente só `main`). Isso reduz bastante a exploração real via esse vetor específico. Achado colateral (fora do escopo do CodeQL): o mesmo workflow também passa `GITHUB_PR_BODY: ${{ github.event.pull_request.body }}` — texto 100% controlado por quem abre o PR — mas rastreei o uso e ele só entra num `.test()` de regex (`hasOverride`), nunca em `execSync`; não é o alerta em questão, mas é o tipo de variável que, se um dia passar a ser interpolada em um `cmd`, vira injeção real. **Veredito: MODERADO-BAIXO** (dataflow correto do CodeQL, mas a fonte de taint é praticamente fechada pela semântica do GitHub; ainda assim, é o tipo de coisa que quebra silenciosamente se o workflow mudar).
Fix sugerido: trocar `execSync(cmd)` por `execFileSync('git', [...argv])` (sem shell) nos pontos onde `baseRef` é interpolado.

**#6 — refutação empírica do ReDoS citado na story**
`js/polynomial-redos` · `packages/installer/src/wizard/ide-config-generator.js:110-115` · alerta #515
```js
let sanitized = candidate.toLowerCase().trim()
  .replace(/[^a-zA-Z0-9_-]/g, '-')
  .replace(/[-_]+/g, '-')
  .replace(/^[-_]+|[-_]+$/g, '');
```
Nenhuma das 3 regexes tem quantificador aninhado/sobreposto (todas são "star height 1", sem ambiguidade) — não bate com o padrão clássico de ReDoS. Escrevi um micro-benchmark (fora do repo) aplicando exatamente essa cadeia a strings adversariais de até 5.000.000 de caracteres (inclusive só hífens, a string sugerida pela própria mensagem do alerta): tempo escalou **linearmente** (5,7ms para 5M de caracteres, 2,6ms para 2M de caracteres alternando `-_`). **Veredito: FALSO-POSITIVO**, com evidência empírica, não só leitura estática — é o alerta "high" mais visível do lote (citado no contexto da story) e agora está fechado com dado, não com opinião.
Fix sugerido: nenhum fix de código necessário; candidato a dismissal com a evidência do benchmark anexada.

**#7 — regex sem âncora simétrica no próprio scanner de segredos**
`js/regex/missing-regexp-anchor` · `bin/utils/staged-secret-scan.js:53` · alerta #511
```js
const TEST_FILE_PATTERN = /(^|\/)(tests?|__tests__)\/|\.(test|spec)\.[cm]?[jt]s$/i;
```
Ironia temática: é a regex que decide se um arquivo fica **isento** do scanner de segredos pré-commit. Rastreei manualmente se a assimetria de âncora (um lado ancorado no fim com `$`, o outro não) permite algum bypass — não encontrei: o primeiro ramo já exige `/` ou início de string antes do segmento `test(s)`/`__tests__` e `/` depois, então só casa segmento de path completo, não substring solta. **Veredito: BAIXO-CONTEXTUAL** — o CodeQL está tecnicamente certo que a assimetria é um cheiro de código, mas não achei brecha de exploração real na lógica atual; vale o fix pela higiene de ser o guard de segredos, não pela urgência.
Fix sugerido: agrupar cada alternativa com âncoras próprias — `((^|\/)(tests?|__tests__)\/)|(\.(test|spec)\.[cm]?[jt]s$)`.

**#8 — permissão de workflow não restrita (achado real e barato)**
`actions/missing-workflow-permissions` · `.github/workflows/quarterly-gap-audit.yml:11` · alerta #1
O workflow roda `npm ci`, gera relatórios e cria uma issue via `github-script` (`github.rest.issues.create`) **sem bloco `permissions:` explícito** — herda o padrão do repositório/org para o `GITHUB_TOKEN`. Não embarca no npm (é só CI), mas é o tipo de gap que vira problema se uma dependência da cadeia (`npm ci`) for comprometida durante a execução do workflow. **Veredito: MODERADO**, fix trivial.
Fix sugerido: `permissions: { contents: read, issues: write }` no topo do job.

**#9 — maior volume de "high" do lote, rótulo não bate com o código**
`js/insecure-temporary-file` · 24 instâncias em produção, 10 arquivos (`bin/commands/install.js`, `bin/lib/command-generator.js`, `bin/postinstall.js`, `bin/lib/setup-statusline.js`, `bin/modules/chrome-brain-installer.js`, `packages/sinapse-install/src/capabilities/chrome-brain.js`, `packages/sinapse-install/src/installer.js`, `packages/installer/src/wizard/index.js`, `packages/installer/src/installer/brownfield-upgrader.js`, `packages/installer/src/config/configure-environment.js`) · exemplo lido: alertas #530/#531
```js
fs.writeFileSync(claudeSettingsPath, JSON.stringify(settings, null, 2) + '\n'); // ~/.claude/settings.json
fs.writeFileSync(path.join(SINAPSE_HOME, 'metadata.json'), JSON.stringify(meta, null, 2)); // ~/.sinapse/metadata.json
```
Em nenhuma das 4 instâncias lidas o sink é literalmente `os.tmpdir()` — são escritas nomeadas e previsíveis dentro do **próprio diretório home do usuário** (`~/.claude`, `~/.sinapse`), não num diretório compartilhado multiusuário. O CWE-377/378 (arquivo temporário inseguro) pressupõe um diretório compartilhado onde outro usuário sem privilégio pode pré-criar o arquivo/symlink antes da vítima escrever — isso não se aplica a um `$HOME` de máquina pessoal single-user. **Veredito: BAIXO-CONTEXTUAL** — é o maior bloco numérico do lote (24 de 50 em produção) mas o rótulo da regra não corresponde ao padrão real; a única situação em que isso importa de verdade é máquina genuinamente compartilhada/multiusuário (servidor CI compartilhado, workstation compartilhada) onde `$HOME` não seja exclusivo — fora do escopo declarado do produto, mas plausível o suficiente para justificar hardening barato.
Fix sugerido: escrita atômica (`write-file-atomic` ou `tmp + fs.renameSync`) nos ~10 arquivos, mesmo padrão repetido.

**#10 — sanitização de código "ruim" em ferramenta interna com input 100% estático**
`js/bad-code-sanitization` · `scripts/sinapse-patch.js:193` · alerta #2
```js
const newLogo = `function HV6(){...${LOGO_LINES.map(l => JSON.stringify(l)).join(',')}...}`;
```
`scripts/sinapse-patch.js` é uma ferramenta de manutenção local que reescreve o bundle minificado de um CLI de terceiro para trocar o logo pelo mascote SINAPSE. `LOGO_LINES` é array de ASCII art **hardcoded no mesmo arquivo**, sem nenhuma entrada externa, e já passa por `JSON.stringify()` (escapa corretamente para embutir como string JS). **Veredito: FALSO-POSITIVO** — o heurístico do CodeQL não reconhece `JSON.stringify` como sanitização suficiente para esse padrão de sink, mas não há dado externo em nenhum ponto da cadeia.
Fix sugerido: nenhum fix necessário; candidato a dismissal como falso-positivo.

## 4. Categorias avaliadas (Passo 3 — por classe, honesto)

| Categoria | Onde (produção/scripts shipped) | Veredito | Fundamento (resumo — detalhe no §3 quando aplicável) |
|---|---|---|---|
| `js/insecure-temporary-file` | produção (24) + scripts (1) | **BAIXO-CONTEXTUAL** | Sinks reais são `~/.claude`, `~/.sinapse`, não `os.tmpdir()`; exige máquina genuinamente multiusuário pra importar. |
| `js/file-system-race` | produção (18) + scripts (4) | **MODERADO** | TOCTOU real em C, mas exige atacante já com execução concorrente local; subconjunto na cadeia de confiança do instalador (manifest-signature/file-hasher/post-install-validator) merece prioridade por ser o código que verifica integridade. |
| `js/polynomial-redos` | produção (1) | **FALSO-POSITIVO** | Refutado com benchmark empírico (linear até 5M chars); nenhuma das 3 regexes tem quantificador aninhado. |
| `js/regex/missing-regexp-anchor` | produção (1) | **BAIXO-CONTEXTUAL** | Assimetria de âncora confirmada, mas rastreamento manual não achou bypass explorável na lógica atual do guard. |
| `js/log-injection` | produção (1) | **MODERADO** | Call-sites confirmam que `message` pode carregar texto de erro/rede; janela real porém estreita (terminal spoofing, não RCE). |
| `js/indirect-command-line-injection` | scripts, embarca (1) | **MODERADO-BAIXO** | Taint rastreado até `github.base_ref`, que GitHub restringe a branches existentes — fonte de ataque externa praticamente fechada; fix ainda recomendado por baixo custo. |
| `js/bad-code-sanitization` | scripts, embarca (1) | **FALSO-POSITIVO** | Input 100% hardcoded no mesmo arquivo, já passa por `JSON.stringify`. |
| `js/xss-through-dom` | docs, embarca (5) | **MODERADO** | DOM-XSS real via `.innerHTML` sem escape; dado vem de registro do framework, alterável por PR externa de contribuição em projeto open-source. |
| `actions/missing-workflow-permissions` | scripts (CI, não embarca) | **MODERADO** | Gap real de least-privilege no `GITHUB_TOKEN`; blast radius limitado ao CI do repo (não ao produto distribuído). |
| `js/unused-local-variable` | produção (2) | **FALSO-POSITIVO** (p/ segurança) | Qualidade de código pura; GitHub não atribui `security_severity_level`. |
| `js/useless-assignment-to-local` | produção (2) | **FALSO-POSITIVO** (p/ segurança) | Idem. |
| `js/trivial-conditional` | produção (1) | **FALSO-POSITIVO** (p/ segurança) | Negação sempre-verdadeira em parser de merge de markdown — pode ser bug funcional, mas não é vetor de segurança. |
| `js/unused-loop-variable`, `js/superfluous-trailing-arguments`, `js/regex/duplicate-in-character-class` | só em tests (4 no total) | **FALSO-POSITIVO** (p/ segurança) | Qualidade de código em arquivos que nem embarcam. |

## 5. Falso-positivos e aceitáveis-com-justificativa (candidatos a dismissal — apenas listados, nenhum fechado)

1. **`js/polynomial-redos` #515** — falso-positivo com evidência empírica (benchmark linear até 5M chars). Anexar o resultado do benchmark ao comentário de dismissal.
2. **`js/bad-code-sanitization` #2** — falso-positivo, input 100% estático/hardcoded no mesmo arquivo.
3. **`js/regex/missing-regexp-anchor` #511** — aceitável-com-justificativa: assimetria real, mas sem bypass encontrado; se não for corrigido nesta rodada, justificar como "hygiene, não segurança".
4. **`js/indirect-command-line-injection` #507** — aceitável-com-justificativa: fonte de taint (`github.base_ref`) não é atacável externamente na configuração atual do workflow; registrar a análise para não reabrir a mesma dúvida no futuro.
5. **Todo o bloco de qualidade de código sem `security_severity_level`** (168 alertas: `unused-local-variable`, `useless-assignment-to-local`, `unused-loop-variable`, `trivial-conditional`, `superfluous-trailing-arguments`, `regex/duplicate-in-character-class`) — não são achados de segurança; candidatos a correção mecânica em lote (não a dismissal, já que o fix é trivial) ou, alternativamente, a exclusão de `tests/**` da configuração de scan do CodeQL (ver §6 Onda C) já que 359 dos 366 alertas de teste caem nessas mesmas categorias de qualidade.
6. **`js/insecure-temporary-file` + `js/file-system-race` em `tests/`** (203 alertas) — não embarcam, não processam input externo real; candidatos a exclusão de path na config do CodeQL em vez de 203 dismissals manuais.

## 6. Plano de correção em ondas

**Onda A — fixes cirúrgicos de dias (baixo risco de regressão):**
- `permissions:` explícito em `quarterly-gap-audit.yml` (15 min).
- Escapar HTML nos 3 helpers (`code`, `sev`, `tbl`) de `docs/framework/atlas/atlas.html`, mesmo padrão nas 5 ocorrências (1-2h).
- Reagrupar a âncora em `staged-secret-scan.js:53` (10 min, sem mudança de comportamento — já validado que não há bypass hoje).
- Strip de caracteres de controle antes do `console.log` em `updater/index.js` (meio dia, escopo só nessa classe).
- Limpeza mecânica dos 168 alertas de qualidade de código pura (unused var/assignment/loop-var/trivial-conditional/etc.) — majoritariamente elegível a `eslint --fix` style, revisão em lote (~1 dia incluindo revisão).
- **Estimativa Onda A: 3-4 dias.**

**Onda B — refactors (mais tempo, mais superfície de teste):**
- Escrita atômica consistente (`write-file-atomic` ou padrão `tmp+rename`) nos ~14 arquivos que concentram `insecure-temporary-file` + `file-system-race` em produção, priorizando primeiro a cadeia `manifest-signature.js` → `file-hasher.js` → `post-install-validator.js` (a mais sensível), depois o restante (`bin/commands/install.js`, `bin/lib/command-generator.js`, `bin/postinstall.js`, `bin/sinapse-init.js`, `bin/sinapse.js`, módulos de instalação do Chrome Brain/MCP). Exige teste cross-platform (Windows/macOS/Linux) porque rename atômico tem semântica diferente por SO — este framework já tem histórico de bugs Windows-specific em fluxo de instalação.
- Endurecer `execSync` → `execFileSync` com array de argumentos nos pontos onde `baseRef`/valores de ambiente são interpolados em comando de shell (`validate-article-xi.js` e qualquer script irmão com o mesmo padrão `gitExec`).
- **Estimativa Onda B: 1 a 1,5 semana**, incluindo QA cross-platform.

**Onda C — supressões/config justificadas (decisão do dono, não desta story):**
- Dismissal dos 2 falsos-positivos com evidência anexada (`polynomial-redos` #515, `bad-code-sanitization` #2).
- Avaliar excluir `tests/**`/`__tests__/**` da configuração de análise do CodeQL (ou marcar como `path-classifiers: test`) em vez de carregar 366 alertas de teste no dashboard permanentemente — decisão de higiene de processo, não de código.
- Aceitar com justificativa registrada: `missing-regexp-anchor` #511 e `indirect-command-line-injection` #507, se a Onda A não cobrir os dois.
- **Estimativa Onda C: meio dia** (config do CodeQL + textos de justificativa), mas é decisão do dono do repositório, não execução automática.

## 7. Limitações da triagem

- **Discrepância de contagem:** a story menciona "500+"; a API retorna 429 nesta data. Não investiguei a causa (dismissals parciais entre a criação da story e agora, ou escopo/branch diferente na estimativa original) — registrado, não resolvido.
- **Amostragem dentro de categoria:** a classificação de exposição e `ships_to_npm` é 100% dos 429 (script determinístico). A **leitura de código**, como pedido no Passo 3, foi amostral: 3-6 exemplos por categoria/arquivo represent ativo, não os 50 alertas de produção um a um linha por linha.
- **Drift de branch:** a branch local usada nesta sessão (`caio/feat/onda2-synapse-pos-install`) diverge de `main`, e todos os alertas apontam para o commit `d2d50c3d78` em `refs/heads/main`. Ler o working tree local teria dado números de linha errados para vários arquivos (confirmado na prática: por exemplo a leitura inicial de `bin/commands/install.js` na árvore local não batia com o conteúdo esperado pela mensagem do alerta). Por isso, todo o código citado no §3/§4 foi obtido via `git show <commit>:<path>` (leitura pura do objeto git, sem tocar o working tree), não do checkout local.
- **Estado do repositório durante a sessão:** o `git status` estava limpo no primeiro comando desta sessão. Ao longo da análise, outra sessão passou a editar arquivos na mesma branch (`bin/commands/uninstall.js`, `bin/postinstall.js`, `bin/sinapse.js`, `packages/installer/src/config/configure-environment.js`, `packages/installer/src/config/templates/core-config-template.js`, `packages/installer/src/wizard/i18n.js`, `packages/installer/src/wizard/index.js`, `tests/installer/core-config-template.test.js`, mais 3 arquivos novos não rastreados) — mudanças de trabalho em andamento, não desta triagem (nenhum `Write`/`Edit` foi usado em arquivo do repositório nesta sessão). Ver §confirmação final na resposta.
- **Sem execução end-to-end:** a avaliação é estática + 1 benchmark empírico isolado (ReDoS) + rastreamento manual de call-sites (log-injection, PR body). Não rodei o fluxo real de instalação/update numa máquina limpa.
- **Só CodeQL:** os 429 alertas são 100% da ferramenta CodeQL (`tool.name`); esta consulta não cobre Dependabot nem secret-scanning (endpoints diferentes), que não foram auditados aqui.
- **Ponto cego possível:** a classificação `ships_to_npm` replica as regras do array `files` do `package.json`; não verifiquei se existe algum mecanismo adicional (`.npmignore` em subpacote, `prepublishOnly` que gere/remova arquivos) que altere o pacote final além do que `files` descreve — o `.npmignore` do repo root existe mas `files` tem precedência sobre ele por padrão no npm quando ambos existem, então o risco de erro aqui é baixo, não zero.
