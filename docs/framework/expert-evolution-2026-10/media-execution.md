# Lume — execução de mídia

Estado: **exportações locais e verificações técnicas concluídas; áudio subjetivo não observado**. [Preview editável](../../../examples/framework-quality/media/index.html), [receitas](../../../examples/framework-quality/media/README.md), [manifesto](../../../examples/framework-quality/media/source-manifest.json), [texto equivalente](../../../examples/framework-quality/media/text.md) e [VTT](../../../examples/framework-quality/media/captions.vtt).

Brief [AUDITED-SPEC.md](AUDITED-SPEC.md), story Ready e T02/T03 liberados pelo root. Fontes, pixels geométricos e osciladores são próprios. Marfim `#f7f5ef`, grafite `#252824`, cobalto `#2248bd` e Segoe UI seguem os tokens canônicos. Nenhum asset remoto, Mobbin, stock, música licenciada, sample, cliente ou voz humana foi usado.

## Exportações e refinamento

Tentativa 001 preservada. Após revisão independente de 89/100, o root autorizou somente o refinamento dos grafismos: ficha de mensagem, storyboard Texto/Imagem/Ritmo, checklist e ações do ciclo. Tentativa 002 recebeu 91/100 para o carrossel, comunicado pelo root; autor não atribuiu nota. Parecer independente é mantido separadamente pelo root.

Tentativa 002 contém cinco PNGs RGB 1080×1350, contato com miniaturas de 390 px, prévia empilhada de 390 px, cinco SVGs editáveis e equivalente textual alinhado aos pixels atuais. Copy principal, cinco páginas, sequência e identidade preservadas.

Reel: H.264/yuv420p 1080×1920, 18 s, 30 fps e 540 frames; AAC estéreo 48 kHz. WAV dual mono sintetizado e cópia MP3 integral a 8 kbit/s para revisão. Texto sem fala humana; cinco cenas com cortes em 3, 7, 11 e 15 s.

## Evidência técnica

[Receipt do render 002](../../../examples/framework-quality/output/media/attempt-002/receipt.json): 15,735 s; decode integral com exit 0; probe real; 18 frames extraídos incluindo antes/depois dos cortes; PNGs íntegros; caixas de texto medidas; versões de ferramentas/fontes e hashes reais. Áudio decodificado: RMS 0,0201497, pico 0,125301 e zero amostras clipadas.

[Receipt final do navegador](../../../examples/framework-quality/output/media/attempt-002/browser-3/receipt.json): quatro checks (hub e mídia em 1440/390), screenshots sem overflow horizontal, cinco imagens carregadas, player com controles e tempo avançando, dimensões/duração do vídeo e cinco cues VTT observados, zero erros de página/recursos.

[Resumo pós-correção acessível](../../../examples/framework-quality/output/media/attempt-002/verification-summary.json) registra hashes atuais sem reescrever receipts originais. Descrições visuais de `text.md` e HTML alinhadas à 002, preservando headings/mensagem. [Servidor local](../../../examples/framework-quality/serve.cjs) passou sete probes: HTML completo, HEAD, byte range MP4, POST rejeitado, traversal rejeitado, range inválido e MIME VTT.

## Limites e reprodução

Dois renders de até três autorizados; cada encode limitado a 180 s. Código nativo Windows/Pillow/ffmpeg, sem instalação, WSL, Docker, publicação ou chamadas pagas. Outputs/receipts locais e ignorados; fontes e SVGs rastreáveis. A receita recusa sobrescrever uma tentativa existente.

Nota do carrossel não equivale à aprovação audiovisual. Áudio permanece `not_observed`; qualidade sonora, sincronização percebida e conjunto Reel/áudio continuam **CONCERNS** até escuta apropriada. Métricas não provam escuta, aprovação humana, retorno comercial nem expertise universal. Sem diálogo/locução, essas competências não são avaliadas.

Preview somente local: `node examples/framework-quality/serve.cjs --port=4179`, `http://127.0.0.1:4179/`. GET/HEAD, realpath contido na pasta de exemplos, streaming com MIME/range e bind loopback; nada remoto. Encerrar o processo após a revisão.

Os dois caminhos de knowledge base nomeados pela skill sinapse-content estavam ausentes no checkout durante T07; o renderer segue o brief congelado e o planejamento aprovado, sem inventar seu conteúdo.
