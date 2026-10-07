# Lume — plano de produção

Fonte congelada: `docs/framework/expert-evolution-2026-10/AUDITED-SPEC.md`. Lume é fictícia. A versão Aurora da auditoria é anterior e não rege esta produção.

Conceito: um projeto passa por três decisões observáveis — definir a ideia, dar forma e conferir a mensagem. Fundo marfim, texto grafite, geometria original cobalto; valores exatos em `production-plan.json`, extraídos de `../shared.css`.

## Reel — 18 segundos

| Tempo | Texto na tela | Plano e movimento | Som |
|---|---|---|---|
| 00:00–00:03 | Um projeto. Três decisões. / Planejar → Produzir → Revisar | Três nós unidos por linha; entrada curta, seguida de leitura estável | Pad suave; pulso em 00:00.35 |
| 00:03–00:07 | Planejar / Defina a ideia. / Escolha uma mensagem central. | Três cartões, um selecionado; ajuste de até 32 px nos primeiros 0,5 s | Pulso em 00:03 |
| 00:07–00:11 | Produzir / Dê forma à mensagem. / Texto, imagem e ritmo na mesma direção. | Cartões se alinham; um painel cobalto assume o foco | Pulso em 00:07 |
| 00:11–00:15 | Revisar / Confira a peça inteira. / Mensagem. Leitura. Sequência. | Moldura de revisão; três marcas surgem, seguidas de leitura estável | Pulso em 00:11 |
| 00:15–00:18 | Volte à ideia. Ajuste a peça. / Planejar → Produzir → Revisar | Arco retorna à primeira etapa; quadro final estável até o último frame | Pulso em 00:15; saída suave |

Cortes limpos em 3, 7, 11 e 15 s. Geometria em movimento, texto estável durante a leitura. Master 1080×1920, 30 fps, 540 frames; toda informação essencial entre x=96–984 e y=240–1536. Esse retângulo é uma decisão da fixture, não garantia universal contra interfaces de redes sociais.

Sem voz humana, diálogo, produto real, assets externos ou alegações comerciais. `captions.vtt` preserva a sequência textual e informa a trilha relevante; `text.md` oferece alternativa completa. Legendas devem ser disponibilizadas junto ao player, mesmo com texto integrado nos frames.

## Carrossel — cinco páginas

1. Criar começa com uma decisão. Apresenta o ciclo completo com três nós.
2. Defina a ideia antes do formato. Três cartões representam opções; uma é escolhida.
3. Dê forma ao que foi definido. Os cartões passam a uma composição alinhada.
4. Confira o que a peça comunica. Moldura e três marcas orientam a revisão.
5. Volte à ideia. Ajuste a peça. O arco de retorno fecha o ciclo.

Exportar cinco PNGs 1080×1350 e cinco SVGs editáveis. Os textos e as posições exatas estão em `production-plan.json`. Contato com páginas em ordem, miniaturas de pelo menos 390 px, arquivos individuais preservados e prévia empilhada a 390 px sem corte.

## Handoff e limites

T07 contém somente planejamento, dados de cena e textos. Developer implementa o renderer nativo e T04 após confirmação de T03 pelo root. Máximo três ciclos de criação/verificação/correção; render nativo limitado a 180 segundos por tentativa.

Revisor separado deve ver os PNGs individuais, contatos, prévias a 390 px, frames extraídos do master e movimento real. Áudio precisa ser ouvido por capacidade apropriada; se indisponível, registrar `not_observed`. Duração, codec, RMS e pico não concedem aprovação estética.
