# Especialização verificável de todo o framework

## Objetivo e autorização

Pedido de 2026-10-02: estruturar e executar a evolução dos 17 squads e 172 agentes,
priorizando design, frontend, vídeo, motion, reels e carrosséis; reduzir ruído na
organização, aplicar conhecimento de especialistas e atualizar a seleção de modelos.
YOLO autoriza o trabalho delimitado. O piloto Jev anteriormente apresentado está
autorizado até US$ 0,05, uma tentativa por grupo, sem recarga ou compra de serviços.

Esta entrega deve deixar um sistema executável de especialização, curadoria,
avaliação e navegação. Não deve afirmar absorção de mil horas, fidelidade integral
a uma pessoa, ganho exponencial ou execução autenticada que não ocorreu.

## Escopo

1. Plano completo por agente/squad, com missões, entregáveis, competências,
   referências candidatas/lidas, lacunas e critérios de evolução distintos.
2. Pacote aprofundado prioritário de design/frontend/motion/vídeo/conteúdo,
   com fontes primárias, heurísticas, condições, exceções e casos de avaliação.
3. Pipeline de ingestão para conteúdo autorizado, deduplicação, segmentos,
   locators, conhecimento persistente e promoção condicionada à evidência.
4. Catálogo de todos os usos Jev por squad e planos executáveis de julgamentos
   atômicos; código conserva permissões, contagens, cálculos e efeitos externos.
5. Catálogo do repositório por responsabilidade, com caminhos canônicos,
   adapters gerados, compatibilidade, arquivos históricos e candidatos a revisão.
   Não apagar ou mover fontes existentes; reduzir ruído por navegação unificada.
6. Política de modelos por capacidade, versões observadas e validade da revisão.
   Sol 6.1 consta do catálogo nativo desta sessão. Nomes Opus/Office e futuras
   versões precisam de fonte/availability; não inventar model IDs ou API aliases.
7. Substituir suposições de contexto ilimitado no agente de clonagem permitido
   por orçamento medido, recuperação e evidência, preservando sua autoridade.
8. Testes, catálogo/curadoria integrados ao runtime quando compatíveis,
   avaliação reservada, handoff e recibos da entrega local.

## Limites

Continuar no worktree isolado de evolução, base local 45e979f25931730ef1428d65e3dcb0a3b544a51f.
Preservar checkout original e outros worktrees. Não alterar paths protegidos,
remover fontes funcionais, migrar clientes, instalar globalmente ou publicar.
Não executar instaladores remotos; usar dependências nativas existentes.
Não contornar login, limites de dispositivo, paywall ou direitos de acesso.
Credenciais são locais e nunca aparecem em planos, logs, commits ou chat.

Mobbin deve ter acesso atual comprovado antes de marcar referências privadas
como lidas. Sem conexão, entregar protocolo e adaptação com fontes públicas;
a restrição não bloqueia as outras frentes. Jev pago usa um ledger compartilhado
do processo; sem credencial, manter lote executável offline e registrar o bloqueio.

## Contextos e responsabilidades

| Contexto | Responsabilidade | Saída |
|---|---|---|
| Expertise | Definir especialização por função, não imitar identidade | Perfis e critérios por 172 IDs canônicos |
| Evidence | Captura lícita, deduplicação, segmentos e proveniência | Manifesto e unidades de conhecimento rastreáveis |
| Decisions | Perguntas Jev e revisão de inferências | Julgamentos tipados, limites e gaps |
| Delivery | Modelo adequado, recuperação e execução canônica | Contexto limitado e rubric de entregável |
| Catalog | Fonte única e navegação entre superfícies | Mapa de folders/arquivos e aliases preservados |
| Evaluation | Casos reservados e comparação independente | Resultados, regressões e promoção explícita |

Arquitetura aditiva, monolito modular: scripts/expert-evolution, research/expert-evolution
e docs/framework/expert-evolution-2026-10. O corpus inicial continua no contrato v1
anterior. Fontes de pesquisa prioritária ficam em pacote separado para integração
controlada; vários workers nunca reescrevem os três JSON canônicos simultaneamente.

## ASRs e critérios de aceite

- Cobertura: exatamente os 172 agentes e 17 squads canônicos, sem aliases inventados;
  referência candidata não conta como competência validada.
- Ingestão: corpus grande processado em segmentos limitados; hashes/locators,
  direitos e deduplicação conservados; não carregar mil horas no prompt.
- Contexto: cápsulas limitadas por representação JSON completa; erro e gaps explícitos.
- Jev: perguntas atômicas, respostas validadas, fonte associada, cache versionado,
  reserva antes da tentativa e teto de US$ 0,05 nesta execução.
- Design/media: marca correta, UX/a11y, responsividade, performance, continuidade,
  ritmo, áudio e direitos entram em critérios separados; render não prova qualidade.
- Modelos: selecionar somente IDs realmente disponíveis; revisão vencida ou versão
  candidata não é promoção automática. Novidades exigem benchmark e rollback.
- Preservação: zero alterações nos paths protegidos e zero diferenças atribuíveis
  ao trabalho no recibo dos 191 arquivos originais. Testes não são ganho comportamental.

## Decisões e consequências

Rejeitar mudança física ampla antes do mapa de dependências: quebraria resolvers,
instaladores e clientes ativos. A navegação única reduz ruído agora, mantendo paths;
uma futura consolidação física precisa de aliases, fixtures e decisão por alvo.

Rejeitar mil horas por agente como quota: volume redundante aumenta custo e reduz
relevância. Capturar de forma incremental até saturação de mecanismos; exigir fontes
contraditórias e casos negativos. A contrapartida é não prometer clones completos.

Rejeitar escolher modelo só pelo número da versão: disponibilidade e capacidade
variam por runtime. Separar aliases do produto, IDs de API e evidência de seleção.
Ganhos são medidos por tarefa, com modelo e corpus pinados durante a avaliação.

## Ordem de execução

Contrato validado → três frentes independentes (prioridade criativa, expertise/curadoria,
catálogo) → integração de modelos/runtime/Jev → QA e checkpoint. Cada frente tem
no máximo cinco iterações e duas tentativas por operação de fonte; timeout de rede
até 60s. Sem laço infinito de pesquisa ou aquisição de recursos pagos.
