# Mídia Lume — reprodução local

Fontes declarativas congeladas: `production-plan.json`, `STORYBOARD.md`, brief e tokens compartilhados. `render.py` usa somente geometria própria, fontes Segoe UI instaladas, Pillow já disponível e ffmpeg/ffprobe nativos. Sem rede, instalações, stock, samples, voz ou dados de cliente.

```powershell
# Pelo root do repositório; Python/Pillow e Node/Playwright já disponíveis no host.
python examples/framework-quality/media/render.py --attempt 2
node examples/framework-quality/media/verify-media.cjs --attempt=2 --qa-cycle=1
node examples/framework-quality/media/test-serve.cjs
python examples/framework-quality/media/finalize-manifest.py 2
node examples/framework-quality/serve.cjs --port=4179
```

Cada tentativa de render usa um diretório novo, no máximo 001–003; a tentativa 002 já existe. O renderer recusa sobrescrever; escolha 003 apenas para correção autorizada. `verify-media.cjs` preserva cada ciclo de QA (1–3). Para reprodução nova da tentativa 002, use checkout separado e mesmos fontes. Configure `NODE_PATH`/`PATH` para o runtime já instalado quando o host não resolver Playwright; nenhuma instalação é feita.

O preview aponta para a tentativa 002. Se outro attempt for produzido, atualize as referências e descrições acessíveis antes de verificar. `serve.cjs` usa `127.0.0.1`, porta explícita, GET/HEAD, realpath, MIME e byte ranges. O processo permanece aberto para revisão local; encerre-o ao concluir.

## Evidência

- `output/media/attempt-001/`: versão inicial e receipt preservados.
- `output/media/attempt-002/`: cinco PNGs 1080×1350, contato com cinco miniaturas de 390 px, prévia 390 px e master H.264/AAC 1080×1920 de 18 s/540 frames a 30 fps.
- `editable/`: cinco SVGs atuais. `text.md`: equivalente textual atual; VTT: texto principal e informação sonora sem fala humana.
- `lume-sound.wav`: estéreo dual mono sintetizado por osciladores próprios. `review-audio.mp3`: cópia mono 8 kbit/s integral para revisão; não é o master.
- `receipt.json`: hashes e versões realmente usados no render; dimensões, probe, frames do master, decode integral, caixas de texto e RMS/pico.
- `browser-*/receipt.json`: screenshots 1440/390, reflow, cinco imagens, vídeo reproduzido, VTT com cinco cues e erros de página/recurso.
- `verification-summary.json`: hashes posteriores à correção acessível, separados do receipt original. Manifesto preserva versões iniciais e associa fontes atuais às exportações.

Refinamento 002 autorizado após revisão independente: diagramas genéricos viraram ficha de mensagem, storyboard Texto/Imagem/Ritmo e checklist. Copy principal, ordem e identidade preservadas. Testes técnicos não aprovam estética, qualidade sonora ou cliente; áudio subjetivo permanece `not_observed` e o conjunto audiovisual permanece CONCERNS até escuta apropriada.
