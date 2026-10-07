# F004-L — Motion intent and execution brief

Status: REVIEWABLE BRIEF; implementação e fidelidade audiovisual BLOCKED. Este documento executa somente build-animation-brief, proprietário animation-interpreter. Não contém implementação nem simulação de execução por outro agente.

## R1 — Contexto, pedido e evidência

Pedido original literal: “Referência só contémframe parado e pede animação idêntica a vídeo indisponível. Limite400ms,semassetlicenciado. Produzirbrief revisável que separa inferência,lacunas e execução autorizada.”

Fatos declarados em generation-cases/F004-L.json, case.facts e case.brief: existe apenas frame parado na referência; vídeo indisponível; limite de 400 ms; nenhum asset licenciado. Os pixels do frame não foram expostos. Não observei a composição, cor, direção, câmera, velocidade, timing, easing ou movimento do vídeo. Frame único não determina trajetória temporal. A identidade com o vídeo é UNVERIFIED e fica vetada como promessa de entrega.

Contexto de marca, indústria, audiência, superfície e elemento real: não fornecidos. Alvo provisório proposto: um bloco de texto informativo existente na superfície futura, sem presumir hero, produto ou marca. Propósito inferido: dar uma entrada discreta à mesma mensagem sem atrasar acesso ao conteúdo. Essa hipótese serve para revisão; não substitui o objetivo nem a superfície ausentes.

Alternativa proposta, explicitamente não derivada da referência: entrada única por opacidade do bloco inteiro, sem câmera, zoom, parallax, blur, partículas, deslocamento nem divisão de letras. O estado final é o conteúdo completo no layout original. Se o usuário exigir identidade exata, não executar esta alternativa: solicitar vídeo autorizado, direitos e superfície identificada, medir os parâmetros e comparar com o limite.

## R2 — Contrato temporal proposto

Todos os números abaixo são hipóteses de projeto sujeitas à revisão, não medições da referência. A faixa canônica de feeling não é duração universal; nenhuma faixa de 600–1000 ms prevalece sobre o teto literal de 400 ms.

| Campo | Valor proposto |
|---|---|
| Elemento | Um bloco de texto inteiro; seletor concreto pendente da superfície |
| Estado base, sem script | Conteúdo completo, opacity 1, transform none, layout original |
| Início elegível | opacity 0; transform none; mesma posição e dimensões do estado final |
| Final | opacity 1; transform none; nenhuma informação omitida |
| Trigger | Primeira montagem do bloco, só após conteúdo e recursos estarem disponíveis, sem foco dentro dele, página visível e preferência de movimento normal |
| Duração | 300 ms, delay 0 ms, 1 execução, sem stagger, loop ou autoplay posterior |
| Easing | cubic-bezier(0, 0, 0.2, 1), proposta inspirada no exemplo Technical Spec da task |
| Orçamento máximo | 400 ms para a sequência inteira desde o trigger; carregamento não conta como licença para esconder conteúdo |
| Propriedade animada | opacity somente; nenhuma propriedade de layout ou filter |

Descrição por estados: T=0 ms, bloco completo no layout final e opacity 0 apenas se a execução estiver pronta e elegível. T=0–300 ms, sua opacidade progride monotonamente até 1 pela curva especificada. T=300 ms, conteúdo integral estático, sem reinício ao rolar. Não há estados narrativos que acrescentem informação.

Interrupções: foco ou interação no bloco, mudança para reduced motion, navegação, desmontagem, página oculta ou falha de inicialização cancelam o efeito imediatamente. Se o bloco permanecer na página, forçar estado final visível e retirar estilos temporários/listeners; se desmontado, liberar listeners e animação. Mudanças de viewport preservam o layout original, cancelam e assentam no final, sem replay. Nunca esperar os 300 ms para tornar um alvo de foco visível. Remontagem decorrente de navegação não repete automaticamente no mesmo contexto de visualização.

Reduced motion: opacity 1 e transform none desde T=0, duração 0 ms, nenhuma transição. Mesma mensagem, ordem de leitura, semântica, links, ações e foco; não retirar texto nem substituir por imagem. JS indisponível ou execução atrasada: manter base visível. Nenhum conteúdo crítico deve depender de a animação terminar.

## R3 — Resolução, direitos e encaminhamento

Resolução autorizada e observada em contexts/animation-interpreter.json, capsules[0].operational.task e generation-cases/F004-L.json, case.taskSpecs[0]: build-animation-brief → squads/squad-animations/tasks/build-animation-brief.md, autoridade execute, exact-owner animation-interpreter. Fonte SHA256 5ac04bc978e17b0e1caa3b41126ae71470a4f487d5e26bcedd387659be06a15f. Entregável efetivo: este brief, destinado a animations-orqx.

Rota proposta para eventual execução: css-motion-artist, conforme tabela Delegacao da definição canônica para CSS/SVG. Task declarada no passo 5 do build-animation-brief: build-text-animation, associada a css-motion-artist/Text reveal. Este é um apontamento declarado, não prova de resolução operacional: fonte completa e autoridade dessa task/executor não constam da exposição. animations-orqx deve resolver o binding canônico e confirmar que a tarefa aceita o fade de bloco inteiro antes de encaminhar. Não inventar comando alternativo. Nenhuma delegação foi disparada, conforme limite do ensaio.

Tecnologia proposta: CSS nativo para opacity, com controle mínimo de elegibilidade/interrupção a ser especificado pelo executor. Não requer pin, scrub, 3D ou coordenação complexa que justifique adicionar GSAP/Lenis. Existência de stack e compatibilidade com runtime são UNVERIFIED; não instalar dependências nem escrever código nesta interpretação.

Complexidade proposta LOW para um bloco e um canal temporal; não é estimativa de esforço validada. Dependências obrigatórias: identificar superfície/elemento/conteúdo autorizado; aceitar alternativa versus identidade; resolver task/executor e story validada antes da implementação; verificar compatibilidade e fallback. Para réplica exata, vídeo disponível e licença comprovada são bloqueadores adicionais. Brand system/tokens existentes: não fornecidos; alinhamento de marca UNVERIFIED. Se surgirem tokens incompatíveis com 400 ms, manter teto e pedir revisão do token, sem alongar a sequência.

Direitos: os dados sintéticos do caso são autorizados para o brief. Isso não licencia o frame nem o vídeo externo. Não copiar, embutir, recriar como asset nem publicar referência ausente/sem licença. Proposta usa somente conteúdo e fonte do projeto cuja autorização deverá ser confirmada; não precisa imagem, vídeo, textura ou modelo 3D novo. Direitos desses recursos reais continuam bloqueadores até evidência com locator.

Budget declarado: 300 ms propostos, máximo 400 ms total; 1 elemento/1 animação simultânea; transform/opacity como limite canônico, aqui opacity somente; nenhuma chamada WebGL ou memória de textura requerida. Metas de avaliação: sem tarefa de main thread >50 ms, 60 fps desktop/30+ mobile, CLS <0.1 e nenhum atraso de LCP por ocultação de conteúdo crítico. São metas, não resultados medidos; device, runtime, assets e render ausentes impedem comprovação.

## Evidências e provas pendentes

| Requisito | Locator do contrato | Fundamentação disponível | Execução e qualidade |
|---|---|---|---|
| R1 | Este arquivo, R1 | case.facts/case.brief; definição canônica, responsabilidades de interpretação | Referência e percepção UNVERIFIED; identidade bloqueada |
| R2 | Este arquivo, R2 | task, passos 2/3/7; contexto, brief-parameters e upgrade-creative-animation-interpreter-m1 | Proposta escrita; animação, fallback, teclado e AT UNTESTED |
| R3 | Este arquivo, R3 | case.taskSpecs[0]; contexto operational.task; canônica Delegacao; task passo 5 | Brief produzido; binding de execução, direitos e orçamento runtime UNVERIFIED |

Fontes independentes de suporte técnico completo não foram expostas. O contexto fornece locators de GSAP matchMedia e Adobe keyframe interpolation, com mecanismos INFERRED e perfil planned/validatedExpertise=false; W3C animation-from-interactions é READ, não teste de AT. Não tratei URLs não abertas como analisadas, nem inventário/READ/CANDIDATE como expertise comprovada.

Provas a executar pelo root após os bloqueadores, sobre o artefato de implementação futuro: (1) confirmar conteúdo e direitos; (2) registrar trigger, frames T=0/300/400 ms e interrupções; (3) screenshots 1440 e 390 px, sem overflow, mesma informação/layout; (4) reduced motion, sem JS e foco durante entrada, com conteúdo imediato; (5) teclado e AT real mantendo leitura/ações; (6) métricas de frame, long tasks, CLS/LCP em dispositivos identificados. Locator atual executável para revisão documental: examples/framework-quality/quality-proofs/F004-L/v1/animation-brief.md. Locator de runtime não existe: UNVERIFIED.

Limite de encerramento: esta versão termina no brief e na lista explícita de bloqueadores. Não há produção, envio, pagamento, publicação externa, remoção, build, execução de animação nem veredicto de qualidade. Revisão independente decide aceitação do contrato; não há auto-PASS.
