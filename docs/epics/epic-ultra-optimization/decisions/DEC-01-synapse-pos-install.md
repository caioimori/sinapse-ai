# DEC-01 — Motor de contexto synapse pós-install: ativar, descontinuar ou opt-in

> Parecer de arquitetura · Story onda2-p8 · Item 2.6 do AF-20260702 · 2026-07-02
> Status: **AGUARDA OK DO DONO** (Art. XI Conservative Default)

## Contexto

O motor synapse (pipeline de 8 camadas de injeção de contexto) recebeu investimento
real na Onda 1-2: dieta de contexto (Onda1-S2: seção CONSTITUTION caiu de ~1.807 tok
para ~171 tok nos turnos 2+, **−90,5%** — base de medição documentada em
`.sinapse-ai/core/synapse/context/context-tracker.js:30-46`), budgets honestos com
overflow sinalizado, e `maxContext` derivado do registry de modelos (Onda2-P4,
`core-config.yaml:400-406` — `models.active: claude-fable-5`, `contextWindow: 1000000`).

Problema: **nada disso chega a quem instala o framework.** O motor só ativa se
`<cwd>/.synapse/` existir — e nenhum caminho de instalação cria essa pasta.

## Evidência de consumidores (verificada por grep em 2026-07-02)

| Fato | Evidência |
|---|---|
| Hook retorna `null` sem `.synapse/` | `.sinapse-ai/core/synapse/runtime/hook-runtime.js:45-46` (`if (!fs.existsSync(synapsePath)) return null;`) |
| Installer NUNCA referencia `.synapse` | grep `\.synapse` em `packages/installer/src/` → **0 arquivos** |
| MAS o installer **copia e registra o hook** em toda instalação | `packages/installer/src/wizard/ide-config-generator.js:538` (HOOKS_TO_COPY) e `:584-588` (HOOK_EVENT_MAP → UserPromptSubmit, timeout 10) |
| E copia o core do motor | `packages/installer/src/installer/sinapse-ai-installer.js:32` (`'core'` em FOLDERS_TO_COPY) + `constitution.md` em ROOT_FILES_TO_COPY (`:41`) |
| Existe auto-bootstrap, mas fora do caminho canônico | `bin/postinstall.js:365-393` (`stepGenerateSynapse`) roda só via `npm run setup` (`package.json` script `setup`; **não há** script `postinstall` — decisão de supply-chain, `README.md:70`); nem `bin/cli.js` nem o installer invocam esse passo (grep `postinstall|generate-synapse` em ambos → 0) |
| Mesmo se rodasse como dependência, escreveria no lugar errado | `generate-constitution.js:156-158` — `projectRoot` default = raiz do PACOTE (4 níveis acima), não o cwd do usuário |
| `sessions/` auto-cria, não é obstáculo | `.sinapse-ai/core/synapse/session/session-manager.js:86` (`mkdirSync(..., { recursive: true })`) |
| Template de core-config instalado NÃO tem seção `models` | grep `models` em `packages/installer/src/config/templates/core-config-template.js` → 0; instalações caem no fallback 200000 (`context-tracker.js:87-96`) |

**Estado líquido hoje:** toda instalação paga o custo (hook executado a cada prompt,
arquivos do motor copiados) e recebe **zero** benefício — o hook morre no early-return.
O comentário de `context-tracker.js:91-92` já registra que fechar isso "is a separate,
deliberate decision (P8/DEC-01)". Este é o parecer.

## Opções

### A — Instalador cria `.synapse/` e completa a ativação (RECOMENDADA)
- **O quê:** passo no installer local: (1) gerar `.synapse/constitution` chamando
  `generate-constitution.js::main({ projectRoot: <target> })` a partir da
  `constitution.md` já copiada; (2) adicionar a seção `models` (espelho de
  `core-config.yaml:400-406`) ao `core-config-template.js`. Sessions auto-criam.
- **Custo:** S. Tudo já é shipped (hook registrado, `core/` copiado, gerador existe e
  aceita `projectRoot`). É ~1 chamada no installer + 1 bloco no template + testes.
- **Risco:** hook passa a injetar contexto em projeto de usuário. Mitigadores já
  construídos: fail-open por design (`stepGenerateSynapse` é não-crítico,
  `postinstall.js:362-363`), timeout 10s no evento, budgets com overflow **sinalizado**
  (S2), dieta que reduz a injeção a ~171 tok/prompt nos turnos 2+. Risco residual:
  manutenção de mais uma superfície viva em máquina de terceiro.
- **Benefício:** o resultado medido da S2 (−90,5%) chega a usuários reais; P4 fecha de
  vez (instalação com modelo 1M para de cair no fallback 200K); `sinapse doctor` pode
  ganhar check "motor de contexto ativo".

### B — Descontinuar formalmente para instalações (dogfooding-only)
- **O quê:** remover `synapse-engine.cjs` de HOOKS_TO_COPY/HOOK_EVENT_MAP, parar de
  copiar `core/synapse/`, documentar em KNOWN-LIMITATIONS que o motor é interno.
- **Custo:** S-M (remoções + docs + testes de installer).
- **Risco:** joga fora investimento recém-feito (S2, P4, QW-1) sem medição em usuário
  real; contradiz a sequência de decisões da Onda 1-2 (ninguém faz dieta de um motor
  que pretende matar).
- **Benefício:** menos superfície shipped; coerência "o que não ativa, não embarca".

### C — Opt-in via flag do installer (`--with-context-engine`)
- **O quê:** meio-termo; A atrás de flag.
- **Custo:** S (igual A + flag).
- **Risco:** é o PIOR estado prolongado: o código continua shipped pra todos, o
  benefício continua invisível (flag que ninguém descobre), e a decisão de produto
  fica adiada de novo — exatamente o padrão que a F6 do épico de consolidação deixou
  pendurado e virou o item 2.6.

## Recomendação

**Opção A**, com as salvaguardas já existentes (fail-open, timeout, budgets
sinalizados) e um check novo no doctor. Fundamento:

1. O estado atual já é "meio-A involuntário": o hook JÁ roda em toda instalação
   (`ide-config-generator.js:538,584`) — só que sempre no caminho morto. A escolha real
   não é "instalar ou não um hook novo"; é "dar função ao hook que já embarca, ou
   removê-lo". C perpetua a incoerência.
2. B é defensável, mas incoerente com o investimento imediatamente anterior (S2/P4
   foram construídas E medidas para este motor). Se o dono decidir B, o corte honesto
   inclui desregistrar o hook e parar de copiar `core/synapse/` — não apenas "não criar
   a pasta".
3. A resolve TAMBÉM a ponta solta da P4 no mesmo movimento (seção `models` no
   template), como o próprio código pede em `context-tracker.js:87-92`.

## O que a decisão destrava

- **A aprovada** → story de implementação no installer (S) + template `models` +
  check no doctor; o item 2.6 e a F6 do épico de consolidação fecham juntos.
- **B aprovada** → story de descontinuação (remover hook do copy-map + docs) e o
  DEC-04 ganha um argumento a mais para aposentar a escada de brackets.
- Enquanto não decidir: nada muda (estado atual documentado aqui, sem deleção).
