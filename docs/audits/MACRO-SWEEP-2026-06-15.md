# Varredura Macro — SINAPSE-AI (2026-06-15)

> Diagnóstico macro do framework inteiro, quebrado em 8 áreas. Base para os mergulhos
> profundos área-a-área e o plano de execução sequencial. Gerado por varredura paralela
> (8 auditorias independentes + síntese), validado por evidência (arquivo:linha).
> Versão analisada: v1.8.0.

## Mapa de saúde (nota 1–10)

| # | Área | Nota | Veredito |
|---|------|:----:|----------|
| A1 | Invocação & Orquestração (chamar o master por @sinapse/@snps) | **3** | Quebrado na raiz. A pasta que o programa lê pra ativar agentes por `@` está vazia. É a porta de entrada de tudo. |
| A2 | Instalação & Atualização | **5** | Base encaminhada (já pergunta idioma/editor, já tirou o postinstall automático), mas falta confirmar com prévia antes de instalar e o "atualizar" não troca de versão de verdade. |
| A3 | Múltiplos editores (IDE adapters) | **5** | Mantém 7 editores quando só 2 valem; os 5 secundários são cópias capadas a ~10%. O Codex ainda não tem as travas de proteção do Claude. |
| A4 | Times de IA (agents & squads) | **6** | Estrutura sólida e validada (18 times, 1 coordenador cada), mas 3 formatos convivendo, 2 times visuais duplicados e agentes-zumbi que contam mas não funcionam. |
| A5 | Núcleo de código & arquitetura | **8** | Saudável e bem cabeado. Comandos que faltavam já funcionam, ~11 mil testes passam. Só pontas soltas de limpeza. |
| A6 | Fluxos, Tarefas, Modelos | **7** | Conteúdo robusto. O problema é a ferramenta de medição quebrada (gera alarme falso) e descoberta confusa, não falta de material. |
| A7 | Segurança & dados | **9** | Ponto mais forte. Alarme do `.env` era FALSO (só placeholders, nunca vazou). Defesas reais e ativas. |
| A8 | Inacabado & feedback visual | **5** | Pouco lixo de verdade; muita coisa pela metade por falta de cabeamento. Indicador visual de "quem está trabalhando" já existe em ~60%, nunca foi ligado. |

---

## A1 — Invocação & Orquestração (o bug nº1) · nota 3

**Causa-raiz do sintoma relatado** (`@sinapse`/`@snps` não ativa o master nem cria plano):

| # | Problema | Sev | Evidência |
|---|----------|:---:|-----------|
| 1 | A pasta que o Claude Code lê pra ativar agentes por `@` está vazia | **P0** | `.claude/agents/` só tem `README.md` (descreve ~134 stubs que deveriam existir, mas não existem). Claude resolve `@nome` lendo `.claude/agents/*.md` → sem arquivos, nada casa. |
| 2 | Não existe apelido curto `sinapse`/`snps` registrado | **P0** | id real = `snps-orqx`, alias `sinapse-orqx` (`sinapse-orqx.md:198-199`). `@sinapse`/`@snps` não casam com nenhum `name`. |
| 3 | Os arquivos de comando do master não têm frontmatter | **P0** | `grep -c '^name:'` em `.claude/commands/SINAPSE/agents/sinapse-orqx.md` = 0. Começam com heading markdown, sem bloco `name:`/`description:` → lidos como texto, não comando. |
| 4 | O único hook de entrada não ativa o master nem gera plano | **P1** | `settings.json:3-13` só registra `synapse-wrapper.cjs`, que injeta regras do sistema minúsculo `synapse` (CRUD de domínios), nada a ver com o master. |
| 5 | Colisão de nomenclatura SINAPSE vs SNPS vs synapse | **P2** | 3 árvores paralelas em `.claude/commands/` → manutenção em dobro e risco de editar a árvore errada. |

**Conserto (baixo risco):** gerar os stubs em `.claude/agents/` com frontmatter mínimo · criar aliases curtos `sinapse`/`snps` → master · colocar frontmatter nos documentos do master · ensinar o hook de entrada a reconhecer a chamada e ativar o master + plano automaticamente (rede de segurança).

## A2 — Instalação & Atualização · nota 5

**Já está do jeito que você quer:** comando único e idempotente (`npx sinapse-ai install`) · pergunta idioma PT/EN com setas · pergunta Claude e/ou Codex · **postinstall automático já foi removido** por segurança.

**Falta:**
- **P1** — Sem passo de confirmar (ENTER) com prévia antes de instalar: termina as perguntas e já copia arquivos (`bin/commands/install.js:157-167` → `179-206` sem prompt no meio).
- **P1** — O `update` não baixa a versão nova de verdade, só re-sincroniza a versão atual (`bin/commands/update.js` nunca chama `npm install -g ...@latest`).
- **P1/P2** — O wizard mais bonito (menu de setas @clack + prévia `--dry-run`) existe em `packages/sinapse-install/` mas está **órfão** — quem roda `npx sinapse-ai install` nunca cai nele. Há **3 instaladores concorrentes** sem dono claro.
- **P2** — A prévia atual não mostra conteúdo real (nº de agentes/squads/hooks, README explicativo).

## A3 — Múltiplos editores · nota 5

**Decisão (sua) confirmada correta:** manter só Claude + Codex.

- **Claude + Codex já compartilham a MESMA fonte dos agentes** — o agente do Codex tem 668 linhas, idêntico ao do Claude. Paridade de persona é real, não stub.
- **P1** — Cursor, Gemini, Kimi, Antigravity (+GitHub Copilot que apareceu) recebem ~10% da persona (`.cursor/.../developer.mdc` = 63 linhas vs fonte de 668). São cópias capadas, puro peso morto.
- **P1** — **Codex tem ZERO das 24 travas de proteção do Claude** (secret-scanning, enforce-delegation, enforce-architecture, etc.). Persona em paridade, mas **segurança e enforcement não** — esse é o gap real do Codex.
- **P2** — A máquina de sync carrega 7 destinos; 5 transformadores + 5 scripts `validate:*-sync` são manutenção a cada commit sem valor.

**Remover (`~73 arquivos`):** `.cursor`, `.gemini`, `.kimi`, `.antigravity`, `.github/agents` + transformadores. `.ai` e `.synapse` = rascunho local (não são IDEs), faxina leve.

## A4 — Times de IA · nota 6

**Saudável:** 18 times, 1 coordenador cada (validadores 100% verdes). Qualidade média boa (zero agentes abaixo de 40 linhas). Núcleo de criação (developer 666 ln, architect 558, data-engineer 540) é o mais bem desenvolvido.

- **P1** — `squad-artdir` e `squad-design` são amplamente **redundantes** (design-system, acessibilidade, interação, motion em ambos). 25 agentes cobrindo o mesmo domínio. Maior candidato a fusão.
- **P2** — `package.json:33` lista pasta fantasma `squads/sinapse/**` que não existe.
- **P2** — 7+ agentes legados `-chief` (`design-chief`, `copy-chief`, etc.) apontam pra arquivos de persona **inexistentes** → agentes-zumbi (contam nos 189, não funcionam).
- **P2** — 3 formatos de agente incompatíveis convivem no repo.
- **P3 (importante p/ o plano)** — O núcleo de DEV **não está** em `sinapse/agents/` (só tem 2 coordenadores) — está em `.sinapse-ai/development/agents/`. Mirar o lugar certo no refino.

## A5 — Núcleo de código · nota 8

**Forte.** CLI bem fatorada (delegação, não monolito acoplado). Os gaps de cabeamento que a auditoria anterior marcou como críticos **já foram fechados** na v1.8.0. 11.456/11.684 testes passam (os "falhos" são testes lentos mortos por timeout, não bugs). `sinapse doctor` roda limpo.

- **P2** — Drift de versão: `install-manifest.yaml` diz 1.7.0 vs package 1.8.0 (auto-corrige no publish; hoje gera alerta).
- **P3** — `fast-path-gate` e endpoint de telemetria existem mas sem chamador/ainda não enviam (features latentes).

## A6 — Fluxos & Tarefas · nota 7

**Correção de premissa:** os 4 fluxos primários EXISTEM — são **17 arquivos `.yaml`** em `.sinapse-ai/development/workflows/`. A contagem "só 1" contou o README. Os principais estão ligados a motores de execução reais.

- **P1** — A ferramenta de auditoria (`scripts/audit-tasks.cjs`) está **quebrada**: só varre `squads/*/tasks` (ignora as 210 tasks do núcleo) e crasha ao gravar relatório (`:249` ENOENT).
- **P2** — Falsos positivos massivos: marca ~622 tasks boas como "críticas" por checar formato errado de cabeçalho.
- **P2** — ~20 tasks centrais com cabeçalho YAML vazio/quebrado (`create-next-story.md`, `create-task.md`, etc.).
- **P2/P3** — Tarefas órfãs (existem, ninguém invoca) e templates espalhados em 6 pastas.

## A7 — Segurança · nota 9

**FALSO ALARME confirmado:** o `.env` é idêntico ao `.env.example` (só placeholders), está no `.gitignore:26`, **nunca foi commitado**, não está no pacote npm. **Nada vazou.**

Defesas reais: scanner de segredos (20+ padrões + entropia) roda na escrita E no commit, **fail-closed** (bloqueia se falhar). Pacote npm com allowlist explícita (sem `.env`, sem dados pessoais). Branch protection do main ativa.

- **P2** — `frameworkProtection: false` (modo contribuidor) — as deny rules que protegem o núcleo estão desligadas (não é vazamento, é proteção contra auto-sabotagem).
- **P2/P3** — Falta scanner de segredo no momento exato de publicar; doc de hooks diz "fail-open" enquanto os de segurança são (corretamente) "fail-closed".

## A8 — Inacabado & feedback visual · nota 5

**Feedback visual de "quem está trabalhando" (seu pedido) já existe em ~60%:**
- A barra de status já mostra agente (🤖) e squad (🎯) ativos (`statusline-script.js:76-81`).
- Existe painel animado com spinner + etapa + agente (`core/ui/observability-panel.js`) — funcional e testado.
- **P1** — Nunca foram ligados ao fluxo normal: o painel só aparece num modo que quase ninguém usa; a barra só atualiza em condições específicas. Falta cabear 3 peças prontas (detector + barra + painel). É cabeamento, não construção do zero.

Outros: **P1** `packages/installer` aponta pra arquivo inexistente (quebra se acionado) · **P2** `.sinapse-ai/monitor` manda eventos pra servidor que não existe no repo · **P3** landing com números antigos (17/161/1400 vs 18/189) · `workflow-intelligence` (4400 linhas) sem consumidor de runtime.

---

## Temas que se repetem (cross-cutting)

1. **Fonte única forte, cópias capadas.** O original dos agentes é rico; o que chega aos editores secundários (A3) e aos apelidos de entrada (A1) é encolhido ou inexistente. O problema é distribuição, não qualidade.
2. **Cabeamento ausente.** Muita capacidade construída mas não "plugada" no fluxo: entrada do master (A1), indicador visual (A8), tarefas órfãs (A6), comandos sem chamador (A5). É ligar, não inventar.
3. **Duplicação por excesso.** 3 árvores de comando, 3 instaladores, 7 editores, 2 times visuais. Manutenção em dobro.
4. **Ferramentas de medição mentindo.** Auditoria de tarefas quebrada (A6), números antigos na vitrine (A8). Decisões partem de dados cegos.
5. **Documentação otimista demais.** Docs dizem "tudo pronto" enquanto há buracos (paridade Codex, proteção do núcleo).

---

## Sequência de execução proposta

| Ordem | Frente | Por quê | Complexidade |
|:-----:|--------|---------|:------------:|
| 1 | **A1 — Consertar a invocação (@sinapse/@snps)** | Porta de entrada de tudo + o bug que você relatou. Enquanto não ligar, nada do resto importa. | Média |
| 2 | **A3a — Remover os 5 editores secundários** | Você já decidiu manter só 2. Faxinar antes de refinar evita refinar o que seria descartado. ~73 arquivos somem sem risco. | Baixa |
| 3 | **A6a — Consertar a ferramenta de medição de tarefas** | Antes de "aprimorar cada task", o medidor precisa funcionar. Hoje gera alarme falso em massa. | Baixa |
| 4 | **A2 — Instalação & atualização** | Com a entrada ok e o terreno limpo: confirmar com prévia, "atualizar de verdade", escolher 1 instalador oficial. | Média |
| 5 | **A4a — Limpar/desambiguar os times** | Fundir os 2 times visuais, aposentar agentes-zumbi, mirar o lugar certo do núcleo de criação. | Média |
| 6 | **A4b+A6b — Refinar os times de criação** | O refino que você pediu, começando pela criação (dev/arquitetura/PRD). Base forte, refino incremental. | Média |
| 7 | **A8 — Ligar o indicador visual de orquestração** | Conectar detector + barra + painel pra mostrar quem está trabalhando. Depende da invocação (passo 1) já funcionar. | Média |
| 8 | **A3b — Portar as 24 travas de proteção pro Codex** | Trabalho mais pesado: Codex alcançar o potencial do Claude. Cada trava adaptada ao formato do Codex. | Alta |
| 9 | **A5+A7 — Pente-fino final de higiene** | Versão desatualizada, vitrine, scanner no publish, ajustes de doc. Nada urgente. | Baixa |

---

## Decisões que dependem do Caio

1. **Remover de vez os 5 editores secundários** (Cursor, Gemini, Kimi, Antigravity, GitHub Copilot)? Apaga ~73 arquivos — OK explícito antes de apagar.
2. **Fundir os 2 times visuais** (direção de arte + design/UI)? Simplifica, mas perde a separação conceitual entre "direção de arte" e "UI".
3. **Codex:** investir o esforço maior (vários dias) pra portar todas as travas e chegar ao nível do Claude, ou por ora basta a paridade de persona?
4. **"Atualizar":** passar a baixar/instalar a versão nova de verdade (como o Claude), ou manter o comportamento atual?
5. **Agentes-zumbi `-chief`:** apagar da contagem pra refletir o que funciona, ou reconstruir as definições que faltam?
6. **Capacidades inacabadas** (monitor sem servidor, painel preso a modo raro): ligar ao fluxo principal ou cortar pra enxugar?
