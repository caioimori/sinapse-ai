# Plano Mestre — Refino do SINAPSE-AI

> Documento de execução consolidado · 15/06/2026
> Linguagem acessível. Cada etapa tem: o que muda, os passos concretos (com os arquivos), como saber que ficou pronto, risco/esforço, do que depende e como conferir.
> Tudo roda em área separada e é reversível. Nada vai pro principal sem as verificações automáticas no verde.

---

## O que é este refino, em uma frase

Transformar o SINAPSE-AI de um protótipo avançado (com boas intenções mas várias pontas soltas) num produto coerente, honesto e blindado — começando por consertar a porta de entrada que hoje está morta, limpando peso morto, e deixando os dois ambientes de trabalho (Claude e Codex) igualmente seguros.

## A ordem de execução (e por que é essa)

1. **Consertar a invocação @sinapse / @snps** — a porta de entrada de tudo
2. **Remover os 5 ambientes de edição secundários** — faxina antes de refinar
3. **Consertar o termômetro de tarefas** — medir certo antes de decidir o que melhorar
4. **Unificar instalação e atualização** — uma porta única e previsível
5. **Fundir os 2 times de design + limpar agentes-zumbi** — contagem honesta
6. **Refinar os times de criação e as tarefas centrais** — qualidade, agora que dá pra medir
7. **Ligar o feedback visual de orquestração** — ver o sistema "acendendo"
8. **Levar as 24 travas de segurança pro Codex** — a parte mais pesada
9. **Pente-fino de saúde + reforços finais de segurança** — fechamento

A lógica: a etapa 1 destrava as etapas 7 e 8 (sem ela, nada disso é testável). A etapa 2 vem antes de refinar para não refinar lixo. A etapa 3 vem antes de "melhorar tarefas" porque sem medir certo você decidiria no escuro. A etapa 9 é a última porque depende de tudo já estar no lugar.

---

## Etapa 1 — Consertar a invocação do coordenador (@sinapse / @snps)

**Objetivo.** Fazer com que digitar @sinapse, @snps (ou as formas longas) ative de fato o coordenador principal, mostre a saudação e já monte o plano de execução automaticamente. Hoje isso não acontece porque a "caixa de entrada" que o programa lê está vazia (confirmado: a pasta `.claude/agents/` só tem um README).

**Passos concretos.**
1. Registrar a decisão técnica (são dois mecanismos diferentes: o `@` lê a pasta `.claude/agents/`; os comandos com barra leem outra pasta). Arquivo de decisão em `docs/stories/`.
2. Criar os arquivos que fazem o programa reconhecer o coordenador: `.claude/agents/sinapse-orqx.md` e `.claude/agents/snps-orqx.md`, cada um com o cabeçalho mínimo que o programa exige e uma linha que carrega a personalidade do coordenador.
3. Criar os apelidos curtos `.claude/agents/sinapse.md` e `.claude/agents/snps.md` (quatro portas equivalentes para o mesmo lugar).
4. Adicionar o cabeçalho que faltava nos arquivos de comando do coordenador — na FONTE (`.sinapse-ai/development/agents/snps-orqx.md` e `sinapse/agents/*.md`) para não ser sobrescrito, depois rodar a sincronização.
5. Ensinar a sincronização a gerar esses arquivos sozinha no futuro (para não virar trabalho manual a cada novo agente): novo destino no `.sinapse-ai/core-config.yaml` + um transformador dedicado.
6. Rede de segurança: um detector de entrada (`.claude/hooks/master-activation.cjs`) que, mesmo se algo falhar, reconhece a chamada e já manda o coordenador se apresentar e montar o plano. Registrado em `.claude/settings.json`.
7. Acabar com a confusão de três nomes parecidos (SINAPSE, SNPS e synapse): eleger uma versão oficial sem quebrar a parte que cuida de regras.

**Critério de pronto.** Digitar @sinapse (ou os outros 3) ativa o coordenador, mostra a saudação e produz o plano sem perguntar "quer que eu planeje?". A sincronização roda duas vezes sem gerar diferença. A parte de regras (`/synapse`) continua intacta.

**Risco / esforço.** Risco baixo (tudo aditivo e versionado). Esforço: 1 a 2 dias.

**Depende de.** Nada — é a fundação.

**Como validar.** Recarregar o programa no projeto e testar os 4 atalhos; rodar a sincronização e conferir que não sobra diferença; rodar o diagnóstico de saúde e conferir que continua verde.

---

## Etapa 2 — Remover os 5 ambientes de edição secundários

**Objetivo.** Deixar só os 2 ambientes que valem de verdade (Claude e Codex), apagando ~73 arquivos de peso morto dos 5 secundários (.cursor, .gemini, .kimi, .antigravity, .github/agents) e as engrenagens que os alimentavam.

**Passos concretos.**
1. Desligar os 5 destinos secundários na configuração central `.sinapse-ai/core-config.yaml` (sem isso, qualquer sincronização recria as pastas apagadas).
2. Remover os mesmos destinos do motor de sincronização `.sinapse-ai/infrastructure/scripts/ide-sync/index.js`.
3. Apagar os 4 transformadores secundários + o gerador do Gemini em `.sinapse-ai/infrastructure/scripts/ide-sync/transformers/` (conferir antes que `persona-renderer.js`, que é compartilhado, não os referencia).
4. Apagar as 5 pastas geradas (`.cursor/`, `.gemini/`, `.kimi/`, `.antigravity/`, `.github/agents/`) — atenção: o resto de `.github` (a automação de testes) permanece.
5. Remover os 5 scripts de validação desses editores do `package.json` (manter os do Claude e do Codex).
6. Confirmar que nada no pacote publicado nem no `.gitignore` ainda referencia os removidos.
7. Busca de segurança: garantir que nenhum código vivo ainda importa os transformadores apagados; ajustar testes que os usavam.

**Critério de pronto.** A sincronização toca apenas Claude e Codex; as 5 pastas sumiram; `git status` mostra só as ~73 remoções esperadas; testes e diagnóstico verdes.

**Risco / esforço.** Risco médio (mexe no motor de sincronização). Esforço: 0,5 a 1 dia.

**Depende de.** Etapa 1 funcionando.

**Como validar.** Rodar a sincronização (só toca Claude/Codex), os validadores, os testes e o empacotamento de teste — nenhum lista arquivo dos editores removidos.

---

## Etapa 3 — Consertar o termômetro de tarefas

**Objetivo.** Tornar a ferramenta que mede a qualidade das tarefas (`scripts/audit-tasks.cjs`) honesta: roda sem travar, mede também as 210 tarefas do núcleo, entende os 3 formatos reais de cabeçalho e para de dar alarme falso.

**Passos concretos.**
1. Tirar uma "foto do antes" rodando o medidor e registrando o erro atual (ele trava ao tentar salvar porque a pasta de relatório não existe).
2. Fazer o medidor criar a pasta de relatório sozinho (fim do travamento).
3. Ampliar o que ele varre para incluir o núcleo (`.sinapse-ai/development/tasks/`), subindo de ~1213 para ~1423 tarefas medidas.
4. Corrigir a leitura do cabeçalho: hoje ele se confunde com um marcador solto e só entende 1 dos 3 formatos. Passar a entender os blocos "## Task Definition" e "## Metadata" (que 169 tarefas usam), com acentos.
5. Recalibrar as notas para o formato real (hoje pune o formato que quase todas usam).
6. Criar o atalho `npm run audit:tasks` (hoje a ferramenta é órfã, ninguém a chama).
7. Corrigir os ~20 cabeçalhos centrais de fato vazios/quebrados (começando por `create-next-story`, `create-task`, `create-workflow`, `correct-course`, `brownfield-create-story`).
8. Atualizar a lista de fluxos (`workflows/README.md` mostra 7 de 17 e ainda cita um editor que vamos remover).
9. Criar um índice único dos modelos (templates) espalhados em 6+ pastas — sem mover nada, só facilitar achar.
10. Decidir o destino das tarefas "soltas" (publicar no npm, ligar/desligar modo rápido) — cabear ou arquivar conforme recomendação.
11. Rodar o medidor de novo e comparar com a "foto do antes": agora só as tarefas realmente mal feitas aparecem.

**Critério de pronto.** O medidor roda até o fim, mede squads + núcleo, e a lista de "problemas" cai de centenas para uma fração; as 5 tarefas nomeadas saem de "crítico".

**Risco / esforço.** Risco médio (parser e edição de templates). Esforço: 1 a 2 dias.

**Depende de.** Etapa 2 (o README de fluxos não pode citar editor removido). Editar tarefas em massa pede seu OK (são templates do framework).

**Como validar.** Rodar `npm run audit:tasks` num projeto limpo: não trava, gera o relatório, mostra o número honesto.

---

## Etapa 4 — Unificar instalação e atualização

**Objetivo.** Uma porta única, estável e previsível: menu com setas, idioma (Português por padrão), escolha Claude/Codex/Ambos, prévia em linguagem simples do que será instalado (com números reais), e confirmação por ENTER antes de qualquer cópia. E fazer o "atualizar" baixar e instalar a versão nova de verdade, como o "claude update".

**Passos concretos.**
1. Eleger o instalador oficial (o wizard com setas e modo de pré-visualização, `packages/sinapse-install/src/installer.js`) e registrar a decisão.
2. Apontar os comandos de instalação (`bin/cli.js`, `bin/sinapse.js`) para esse instalador único.
3. Adicionar as perguntas de idioma (PT/EN) e de ambiente (Claude/Codex/Ambos), reaproveitando o que já existe.
4. Criar a prévia didática lendo os números reais do manifesto (`.sinapse-ai/install-manifest.yaml`): "Vou instalar X times, Y agentes, Z travas de segurança, W comandos — em tais pastas". Novo arquivo `packages/sinapse-install/src/preview.js`.
5. Inserir a confirmação por ENTER entre a prévia e a cópia (em modo automático/CI, pula).
6. Fazer o `sinapse update` consultar o npm e instalar a versão nova de verdade (incluindo instalação global quando aplicável), reaproveitando o atualizador que já consulta o npm.
7. Fixar o Português como padrão consistente em todos os caminhos (hoje um caminho cai em inglês).
8. Aposentar com segurança os instaladores concorrentes e corrigir o atalho quebrado (`packages/installer/package.json` aponta para um arquivo que não existe).
9. Cobrir o novo fluxo com testes (confirma aborta sem copiar; update detecta versão nova; sem rede real).

**Critério de pronto.** Os dois comandos de instalação abrem exatamente o mesmo fluxo; responder N aborta sem criar nada; `sinapse update` numa versão antiga baixa e passa a refletir a nova; só sobra um instalador oficial.

**Risco / esforço.** Risco alto (mexe na porta de entrada do produto). Esforço: 3 a 5 dias.

**Depende de.** Etapa 2 (o wizard importa o sync dos editores); o número de "travas de segurança" na prévia depende da Etapa 8.

**Como validar.** Instalar num diretório limpo seguindo o fluxo; testar `--dry-run`, `--quiet`, e o `update --check`; rodar testes e diagnóstico.

---

## Etapa 5 — Fundir os 2 times de design + limpar agentes-zumbi

**Objetivo.** Unir os dois times visuais (direção de arte e produto digital) num só, comandado pelo coordenador que já segue o padrão validado, preservando 100% das capacidades fortes; aposentar 7 "chefes" fantasma que contam mas não funcionam; deixar a contagem honesta.

**Passos concretos.**
1. Tirar a foto da contagem atual (rodar os 3 validadores) para comparação honesta no fim.
2. Definir o formato padrão de agente e registrar.
3. Mapear, agente a agente, o que é duplicata (descartar) e o que é único (migrar): preservar persuasão/conversão, embalagem premium, estética de plataforma SaaS e telas de produto.
4. Migrar os 4 especialistas únicos para o time de design no formato padrão (+ o material de conhecimento que eles usam).
5. Atualizar o roteamento do coordenador de design para os 11 especialistas, incluindo landing pages/conversão.
6. Remover o "chefe" duplicado do design e reanexar os 2 arquivos legados úteis ao roteamento.
7. Aposentar os 7 "chefes" fantasma (as personas que eles citam não existem; confirmado no repo). `claude-mastery-chief.md` fica de fora — verificar à parte.
8. Limpar as listas de componentes nos arquivos de configuração dos times afetados.
9. Arquivar a pasta do time antigo e remover uma pasta-fantasma que ia no pacote por engano (`squads/sinapse/**` no `package.json`).
10. Sincronizar Claude e Codex e remover as cópias dos agentes apagados.
11. Reconciliar e validar a contagem honesta no fim (atualizar os números no `package.json` e no registro).

**Critério de pronto.** Cada time com exatamente um coordenador; nenhuma capacidade órfã; contagem reflete o que realmente funciona; validadores em 0 erros.

**Risco / esforço.** Risco médio. Esforço: 1 a 2 dias.

**Depende de.** Etapas 1 e 2.

**Como validar.** Rodar os 3 validadores + sincronização + diagnóstico; comparar a contagem antes/depois.

---

## Etapa 6 — Refinar os times de criação e as tarefas centrais

**Objetivo.** Com o termômetro honesto e os times limpos, melhorar o núcleo de criação (os agentes que escrevem código, arquitetura e banco) e o restante das ~39 tarefas centrais com cabeçalho quebrado.

**Passos concretos.**
1. Usar o relatório honesto do termômetro (Etapa 3) para priorizar quais tarefas refinar primeiro.
2. Corrigir o restante dos cabeçalhos das tarefas centrais em `.sinapse-ai/development/tasks/`.
3. Padronizar os agentes de criação no formato canônico e fechar pontas de roteamento.

**Critério de pronto.** As tarefas centrais saem da lista de "problemas"; os agentes de criação seguem o padrão único.

**Risco / esforço.** Risco médio. Esforço: 1 a 2 dias.

**Depende de.** Etapas 3 e 5.

**Como validar.** Rerodar o termômetro; conferir notas; testes verdes.

---

## Etapa 7 — Ligar o feedback visual de orquestração

**Objetivo.** Mostrar, sem você pedir, quando o coordenador foi acionado e quando um ou mais especialistas estão trabalhando — cabeando as 3 peças que já existem (detector, barra de status, painel animado).

**Passos concretos.**
1. Cabear o detector no próprio projeto (segunda entrada em `.claude/settings.json` apontando para `track-agent.sh`).
2. Ensinar o detector a reconhecer o coordenador (gravar "coordenador chamado" + horário).
3. Mostrar na barra o marcador de "coordenador acionado" (aparece e some sozinho) e o contador de vários especialistas ("3 trabalhando: ...").
4. Sincronizar o instalador para cabear o detector no novo formato.
5. Permitir abrir o painel animado no fluxo normal (`sinapse status --watch`), não só num modo raro.
6. Corrigir o atalho do instalador-pacote que aponta para arquivo inexistente.
7. Atualizar os números antigos da página de apresentação (`landing/index.html`: 18 times / 189 agentes / nº de tarefas confirmado).
8. Decidir o destino do painel web de monitoramento sem servidor (recomendado arquivar) e do módulo de sugestão de próximos passos (recomendado cabear de leve).
9. Validar de ponta a ponta: enviar @sinapse → @architect → @developer e ver a barra e o painel reagindo.

**Critério de pronto.** A barra destaca o coordenador e lista vários especialistas; o painel anima a etapa e o agente; números da vitrine corretos; atalho do instalador resolvido.

**Risco / esforço.** Risco médio. Esforço: 2 a 3 dias.

**Depende de.** Etapa 1 (nomes do coordenador) + Etapas 5 e 3 (contagem e nº de tarefas).

**Como validar.** Demo manual no projeto + testes do painel e da barra verdes.

---

## Etapa 8 — Levar as 24 travas de segurança pro Codex (a parte mais pesada)

**Objetivo.** Hoje só o ambiente Claude tem as travas ligadas (varredura de segredos, exigir delegação, documentar antes de programar, banco seguro). O Codex tem a mesma "inteligência", mas não tem essas proteções — e não aceita o mesmo tipo de trava automática. Vamos levar as proteções para ele de outro jeito, deixando os dois igualmente blindados.

**Passos concretos.**
1. Mapear honestamente como o Codex aplica regras (instruções fortes + verificações automáticas na hora de salvar/publicar) e registrar a estratégia em 3 camadas.
2. Classificar as 24 travas: quais viram verificação automática, quais viram regra forte, e quais são exclusivas do Claude por natureza (sem fingir paridade falsa).
3. Portar primeiro as 4 mais críticas na ordem fixada: varredura de segredos, exigir delegação, documentar antes do código, exigir tarefa pronta.
4. Empacotar as verificações automáticas (segredos, banco, pacotes inventados, caminhos protegidos) como checagens que rodam na hora de salvar/publicar — valendo para qualquer ambiente.
5. Atualizar a documentação de paridade para dizer a verdade sobre o que já está protegido e o que falta.

**Critério de pronto.** Um arquivo com segredo ou um banco perigoso é bloqueado no fluxo do Codex; a documentação reflete o estado real; nenhuma promessa otimista demais.

**Risco / esforço.** Risco alto. Esforço: 3 a 5 dias (a frente mais cara do refino — recomendado entregar em PRs separados).

**Depende de.** Etapa 1 + sincronização verde após a Etapa 2.

**Como validar.** Teste de fumaça: tentar salvar um segredo falso e um banco perigoso pelo Codex → bloqueia; validadores de paridade verdes.

---

## Etapa 9 — Pente-fino de saúde + reforços finais de segurança

**Objetivo.** Zerar o único alarme vermelho do diagnóstico, deixar os testes do dia a dia rápidos e verdes, fechar pontas latentes, e adicionar reforços finais de segurança — tudo de baixo risco.

**Passos concretos (saúde).**
1. Regenerar o manifesto (`npm run generate:manifest`) para alinhar a versão — hoje o manifesto diz 1.7.0 e o produto está em 1.8.0, e é isso que dispara o único alarme vermelho. Confirmado no repo.
2. Garantir, no processo de publicação, que o manifesto nunca mais fique desencontrado.
3. Separar os testes pesados num grupo à parte para o teste do dia a dia rodar rápido e todo verde (eles continuam existindo e rodando).
4. Marcar de forma clara duas funções prontas mas propositalmente "em espera" (medição opcional e envio de estatísticas que depende de revisão jurídica), para não parecerem coisa esquecida.
5. Remover um atalho antigo já substituído por um comando melhor (`bin/sinapse-graph.js`).

**Passos concretos (segurança).**
6. Adicionar uma conferência de segredos no momento exato de publicar: antes de enviar, varre tudo que iria no pacote e bloqueia se achar qualquer chave/senha (reaproveitando o detector que já roda ao salvar e ao guardar).
7. Corrigir um texto interno que descrevia errado como as travas se comportam quando algo falha (elas corretamente BLOQUEIAM em caso de dúvida; a doc dizia o contrário).
8. Deixar registrado, em linguagem clara, quando religar a "proteção do núcleo" (desligada de propósito agora porque estamos justamente mexendo no núcleo durante o refino).
9. Deixar pronto o procedimento para, quando o Matheus começar a contribuir, passar a exigir uma aprovação antes de juntar mudanças no ramo principal — mantendo você com liberdade total para aprovar o próprio trabalho.

**Critério de pronto.** Diagnóstico de saúde sem nenhum alarme vermelho; teste do dia a dia rápido e verde; publicar passa a ter conferência de segredos embutida.

**Risco / esforço.** Risco baixo. Esforço: ~meio dia (saúde 2-3h + segurança 2-4h).

**Depende de.** Todas as etapas anteriores concluídas (o manifesto precisa refletir o estado final; religar a proteção do núcleo só depois que nenhuma edição toca mais os caminhos protegidos).

**Como validar.** Rodar o diagnóstico (sem alarme), o teste rápido e o teste pesado (ambos verdes), e o teste de segredo falso no publish.

---

## Decisões que precisam do seu OK

Algumas escolhas têm uma recomendação pronta, mas precisam da sua confirmação antes de aplicar. As principais:

- **Agentes-zumbi:** apagar os 7 "chefes" fantasma (recomendado) ou reconstruir as personas.
- **Painel web de monitoramento sem servidor:** arquivar agora (recomendado) ou construir o painel web.
- **Módulo de sugestão de próximos passos:** cabear de leve (recomendado), manter latente, ou cortar.
- **Instalação global automática no "atualizar":** confirmar que pode instalar global sozinho.
- **Religar a proteção do núcleo:** manter desligada até o fim do refino (recomendado), depois religar.
- **Envio de estatísticas (telemetria):** manter "em espera" (recomendado) ou implementar agora.
- **Tarefas soltas e cabeçalhos centrais:** confirmar cabear/arquivar e a edição em massa.
- **Revisão obrigatória quando o Matheus contribuir:** acionar no 1º PR dele (recomendado).

---

## Em resumo

Tudo é reversível, feito em área separada, e validado automaticamente antes de valer. A frente número 1 (consertar @sinapse) destrava o resto; a faxina vem antes de refinar; o termômetro é consertado antes de "melhorar tarefas"; e a blindagem do Codex, por ser a mais pesada, vai numa entrega própria. No fim: a porta de entrada funciona, a instalação é única e previsível, o feedback visual "acende", os dois ambientes ficam igualmente seguros, e os números passam a ser honestos.