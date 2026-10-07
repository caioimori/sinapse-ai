# Auditoria criativa do plano — 2026-10-02

**Veredito:** o plano tem boa proveniência e limites honestos, mas ainda não comprova excelência criativa. A próxima entrega deve ser quatro artefatos locais reais, com revisão de pixels, movimento e áudio, depois de corrigir conflitos canônicos.

Escopo observado: HEAD `47f421cb1d813875504815734acd15562bbeca01`, branch `codex/feat/framework-evolution-20261002`. Esta auditoria produz somente este documento e [contratos estruturados](../../../research/expert-evolution/audit-creative.json); nenhum código, render, gasto ou publicação.

## Oito gaps para executar

| ID | Prioridade | Evidência | Gap e ação |
|---|---|---|---|
| CREATIVE-01 | P0 | `research/expert-evolution/benchmark-protocol.json:15`; `research/expert-evolution/benchmark-results.json:246`; `docs/framework/expert-evolution-2026-10/verification.md:22` | O benchmark aprova decisões escritas, não produto criativo. Executar quatro contratos de artefato abaixo com baseline e contexto enriquecido, direitos constantes e reviewer separado. Manter os casos escritos como etapa de triagem. |
| CREATIVE-02 | P0 | `squads/squad-design/agents/dx-ui-designer.md:100`; `squads/squad-design/agents/platform-aesthetic-director.md:92`; `squads/squad-animations/agents/animation-performance-engineer.md:121` | Heurísticas contextualizadas conflitam com ordens canônicas universais. Alteração posterior autorizada deve tornar padrões em defaults condicionais: objetivo, contexto, faixa inicial, exceção, contraexemplo e forma de medir. Preservar controles de acessibilidade. Proibir afirmação causal ou universal sem apoio; não proibir densidade, linear, stock licenciado ou layout animado por categoria. |
| CREATIVE-03 | P0 | `research/expert-evolution/expert-profiles.json:8891`; `research/expert-evolution/expert-profiles.json:15676`; `research/expert-evolution/expert-profiles.json:4863` | Perfis confundem entregável, responsabilidade e critério de outra função. Separar responsabilidade, artefato, acceptance específico e validação downstream. Curador entrega decomposição e encaixe; frontend entrega comportamento; vídeo exige storyboard, arquivo e áudio. Marcar critérios críticos como não truncáveis em uma implementação posterior. |
| CREATIVE-04 | P0 | `docs/framework/expert-evolution-2026-10/models.md:29`; `squads/squad-design/agents/platform-aesthetic-director.md:31`; `squads/squad-content/agents/content-governor.md:46` | Falta uma rubrica observável para julgar estética e marca. Usar rubricas por artefato, critérios de marca registrados no brief, revisão sem rótulo baseline/enriched e comparação com rejeitável. Automação mede estrutura; humano ou modelo visual capaz observa pixels. Nenhum juiz pode avaliar o próprio output sozinho. |
| CREATIVE-05 | P0 | `docs/framework/expert-evolution-2026-10/PLAN.md:59`; `research/expert-evolution/priority-pack.json:2088`; `research/expert-evolution/priority-cases.json:169` | Narrativa escrita não verifica áudio, montagem ou origem da mídia final. Reel local com captura própria da fixture, trilha/som próprio e narração própria ou síntese local já disponível e autorizada. Separar storyboard e validação do master. Se voz legítima não estiver disponível, usar leitura textual + sound design próprio e declarar limite de cobertura de diálogo. |
| CREATIVE-06 | P0 | `research/expert-evolution/expert-profiles.json:9695`; `research/expert-evolution/priority-cases.json:92`; `squads/squad-animations/agents/animation-performance-engineer.md:89` | Acessibilidade e performance precisam de escopo, estados e ambiente. Adicionar reflow com exceções documentadas, teclado/foco, alteração de reduced-motion em runtime, pausa de autoplay quando aplicável e dez ciclos de lifecycle. Medir trace no ambiente descrito; emulação não vira prova de GPU real. |
| CREATIVE-07 | P1 | `docs/framework/expert-evolution-2026-10/priority-research.md:37`; `docs/framework/expert-evolution-2026-10/PLAN.md:65`; `research/expert-evolution/priority-pack.json:681` | Fontes e referências mundiais precisam virar mecanismos avaliados. Adquirir somente a lacuna que um artefato revelou; conservar edição/locator, direito, condição, mecanismo, conflito e alternativa. Avaliar aplicação e transferência para outro brief; parar no terceiro ciclo sem novas melhorias observáveis. |
| CREATIVE-08 | P1 | `docs/framework/expert-evolution-2026-10/priority-research.md:13`; `docs/framework/expert-evolution-2026-10/priority-research.md:17`; `research/expert-evolution/mobbin-onboarding-receipt.json:22` | Mobbin e conhecimento não cobrem todos os consumidores criativos. Preservar scope/readBy e não declarar 50 fluxos. Mapear mecanismo a owner/consumer por função; passar brief e evidência mínima. Jev pode classificar texto recuperado, não conferir pixels/áudio nem licenças por inferência. |

Os 178 testes estruturais e 18/20 → 20/20 foram reportados com limites adequados. São evidência de controles e decisões escritas; não podem receber o rótulo de qualidade visual. Os 172 perfis continuam planejados.

A amostra desta auditoria é explicitamente de 28 perfis ligados à produção e coordenação em design/animations/content, excluindo content-analyst e signal-intelligence. Não se presume que sejam as mesmas 28 funções aprofundadas citadas em verification.md. IDs e escopo estão no JSON.

## Quatro entregas locais, sem dados de cliente

Marca e produto fictícios: Estúdio Aurora, organizador de kit de oficina. O especialista registra identidade independente de SINAPSE e decisões de marca antes de executar; números de slides/duração abaixo são escolhas da fixture, não leis de formato.

| Artefato | Autor / reviewer | Entrega que pode ser aberta | Positivo / negativo / conflito |
|---|---|---|---|
| Microfrontend | dx-frontend-engineer + dx-ui-designer / accessibility, performance, product surface | UI executável; screenshots 1440/390; ações e reflow 320; trace delimitado | Escolher kit / nome longo, vazio, erro e quantidade inválida / densidade útil com marca clara |
| Motion | css-motion-artist + motion-choreographer / animation-performance-engineer, accessibility | Clips normal/reduced; trace; dez ciclos de lifecycle | Continuidade / preferência em runtime e teardown / linear e layout necessários com medição |
| Carrossel | content-engineer + brand-collateral-designer / platform-specialist, content-governor | Cinco PNG 1080×1350; fonte editável; prévia 390; equivalente textual | Mecanismo compreensível / texto longo / diagrama denso útil sem cortar prova |
| Reel | production-director + content-engineer + brand-motion-vfx / content-governor, platform-specialist | Master MP4 com áudio; storyboard; legendas; frames; manifest | Fala/plano correspondentes / claim falso, legenda errada ou áudio ausente / abertura calma e plano longo justificados |

UI local não comprova persistência, RLS, usuário real ou conversão. Um MP4 válido não comprova ritmo, inteligibilidade ou marca. Toda simulação de loading/erro deve ser rotulada no receipt, sem alegação de backend.

O Reel usa captura própria da UI, grafismos e áudio próprios. Se voz legítima não estiver disponível, texto + sound design pode cobrir montagem, mas diálogo falado fica não avaliado; essa lacuna não recebe nota presumida.

## Rubricas explícitas para 90/100

| Artefato | Dimensões e pesos |
|---|---|
| UI | Tarefa/estados 30; composição/legibilidade 25; identidade/adequação 20; acessibilidade 15; performance/resiliência 10 |
| Motion | Função/continuidade 30; controle/acessibilidade 25; timing/marca 20; lifecycle/performance 25 |
| Carrossel | Tese/progressão 30; legibilidade/hierarquia 30; identidade/composição 25; equivalente textual/integridade 15 |
| Reel | Correspondência audiovisual 30; montagem/ritmo 20; legibilidade/identidade 20; áudio/legendas 20; origem/técnica 10 |

Cada dimensão vai de 0 a 4: ausente/contraditória; falha grave; parcial; adequada com limitações; excelente com evidência. Total = soma(peso × nota/4). PASS exige ≥90, nenhum critério <3 e zero bloqueadores; não arredondar para passar.

Notas exigem arquivo e slide/frame/timecode/ação observados. Critério não observado fica null e impede nota final. Falha crítica de tarefa, foco, legibilidade, origem, legenda, áudio obrigatório ou lifecycle reprova mesmo com estética alta.

Automação verifica comportamento, dimensões, caixas, contraste mensurável, probe/decodificação e recursos da fixture. Reviewer separado observa composição, compreensão, narrativa, marca, timing e inteligibilidade; não há teste automático de beleza.

Modelo visual só julga pixels efetivamente recebidos com capacidade comprovada. Vídeo e áudio exigem capacidade específica. Jev classifica texto/JSON contextualizado; não inspeciona pixels/áudio bruto, concede licença ou aprova estética por descrição.

## Protocolo real, com freio

Congelar brief, casos, pesos, corpus, modelo e orçamento antes da geração. Produzir baseline e enriched com os mesmos assets, direitos, ferramentas e tempo. Sorteio A/B no reviewer; registrar sinais que quebram cegamento.

Revisor não é autor; negativos críticos precisam ser rejeitados. Divergência de uma nota ou mais em dimensão exige terceiro julgamento e conserva as notas originais. Ausência de reviewer ou mídia fica CONCERNS, não PASS.

Máximo três ciclos gerar → verificar → corrigir por artefato, com timeout declarado antes de executar. No terceiro ciclo, preservar artefato e reportar gap se não passar. Não recalibrar pesos ou casos para fabricar vitória; uma dupla A/B não estabelece ganho causal.

Receipt guarda hashes do input/corpus/final, modelo realmente executado, ferramentas/versões, ambiente, mídia observada, notas, bloqueadores, reviewer, custo/tempo e falhas/skips. Aprovação fica limitada à competência exercitada naquele artefato.

## Fronteiras e consumidores

Orqx coordena e conserva autoridade, sem executar domínio. Hue entrega referência decomposta e encaixe; UI designer compõe; frontend implementa; accessibility/performance verificam. Critério de navegação cabe no downstream, não no artefato de curadoria.

Motion choreographer decide função e timing; motion artist executa; performance engineer mede lifecycle e custo. Content engineer estrutura/escreve; collateral designer compõe slides; production director responde pelo audiovisual; platform specialist adapta; governor revisa o final.

Um mecanismo sai da pesquisa com fonte, locator, condição, ação, exceção e contraexemplo, dirigido a consumidores concretos. Não se injeta toda a biblioteca em toda função; o JSON contém o mapa de handoffs e os bloqueadores por artefato.

## Referências e escopo de leitura

Esta auditoria leu os receipts Mobbin, sem reinspecionar os pixels. O registro anterior atribui a priority_expertise nove prévias: quatro telas web e posições 1/6/12/17/22 de Ahead. Nada autoriza declarar 50 fluxos, redistribuir assets ou inferir backend.

Métodos de autores são fontes contextualizadas; leitura seletiva não é expertise integral. Val Head e Walter Murch continuam candidatos conforme priority-research.md:37. Só adquirir nova fonte para lacuna que o artefato revelou, com direito e locator.

Reflow web deve considerar 320 CSS px e exceções para conteúdo bidimensional; desktop/390 sozinho não cobre esse requisito. [W3C — Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

Movimento de interação não essencial pode ser desativado; esse critério é AAA. Prefers-reduced-motion exige verificar a implementação, e não deve ser apresentado sozinho como certificação AA. [W3C — Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).

Preferir compositor reduz custo, mas a escolha depende do efeito e da medição. Layout necessário não é automaticamente erro; refresh rate, hardware e sequência devem aparecer no trace. [web.dev — Animations guide](https://web.dev/articles/animations-guide).

Legenda automática precisa revisão de precisão e sincronização, incluindo informação sonora relevante. O master precisa ser visto e ouvido, não apenas inspecionado por metadata. [W3C — Captions](https://www.w3.org/WAI/media/av/captions/).

**Próxima ação concreta:** integrar os gaps com as auditorias de contratos/runtime, corrigir fontes e consumidores no escopo autorizado e executar as quatro fixtures locais. Esses dois arquivos são contratos de execução; não representam o produto final ou sua aprovação.
