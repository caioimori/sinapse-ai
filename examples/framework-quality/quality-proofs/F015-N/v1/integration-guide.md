# F015-N · Integração de ícones

Criados três desenhos originais editáveis: Salvar (disquete), Voltar (seta para a esquerda) e Alerta (triângulo com exclamação). Categoria: actions, navigation e status. Grid 24 × 24, stroke 1.5, fill none, caps/joins round. Salvar usa cantos rx=2; Alerta usa curvas de raio 2; Voltar é um traçado aberto com junções redondas. Não confundir igual caixa externa com igual peso óptico.

## Arquivos e tokens

SVGs individuais em icons/. Sprite com três symbols em icons/sprite.svg. Todos herdam currentColor. Tokens permitidos: Vanta e White. Valores hex, contraste e regra de aplicação não fornecidos: UNVERIFIED. A prévia vincula --Vanta:CanvasText e --White:Canvas apenas para inspeção, sem aprovar uma paleta. Na aplicação, use valores autorizados em --Vanta/--White e color:var(--Vanta) ou color:var(--White). Sem fonte tipográfica de marca fornecida; system-ui é só interface da prévia, não parte da arte.

## Sprite local e IDs

Instale o conteúdo de sprite.svg inline UMA vez por documento, antes das composições. Use <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#f015n-v1-salvar"/></svg>. As referências são locais e exatas; não usar URL externa. Ambas as composições da prévia compartilham o mesmo sprite. IDs: f015n-v1-salvar, f015n-v1-voltar, f015n-v1-alerta. Para outra família instalada no mesmo documento, aplique um novo namespace em todas as definições E referências. Não há title/clipPath/mask/gradiente que demande IDs adicionais.

## Semântica por consumidor

Botão com texto Salvar: SVG aria-hidden=true e focusable=false; texto dá o nome. Botão somente desenho Voltar: aria-label="Voltar" no botão, SVG oculto da árvore. Alerta junto de mensagem: desenho decorativo oculto; mensagem comunica o estado. Imagem informativa autônoma: SVG role=img aria-label="Alerta", sem rótulo redundante no ancestral. SVGs individuais incluem role=img e aria-label para uso autônomo; em contexto decorativo, retire role/aria-label e acrescente aria-hidden=true/focusable=false. Não usar alt no SVG inline.

## Provas delimitadas

validate.ps1 usa parser XML .NET em SVGs reais, checa IDs, viewBox, estilo, refs locais e rejeita conteúdo ativo, URL externa, referência quebrada e ID duplicado por fixtures negativas. Não modifica inventário preexistente. Leitura XML e atributos não provam reconhecimento, contraste, experiência nem árvore acessível. Root deve abrir preview.html em browser, capturar 16/24/32 px e 390/1440 px, verificar referências renderizadas nas duas composições, nomes acessíveis (Salvar/Voltar uma vez), decoração ausente da árvore e overflow. Render, dispositivo, percepção e AT: UNVERIFIED nesta entrega.

PNG fallbacks 1x/2x/4x: UNVERIFIED; requer exportação renderizada pelo root, usando os SVGs individuais, cores de marca aprovadas e conferência visual. Máximo três ciclos de refinamento; interromper se faltarem tokens ou prova, sem publicar. Integração na aplicação cabe a developer; auditoria independente cabe a brand-auditor/quality-gate. Nenhuma delegação ou alteração externa executada.

## Direitos e fontes

Geometria original criada nesta execução a partir de primitivas SVG, sem traçar arte alheia. Caso declara fontes sintéticas e uso autorizado; não implica licença de imagens externas. Manifest documenta locators e hashes das fontes congeladas lidas. Referências MDN symbol e Storybook vieram apenas de cápsula INFERRED/context-only/planned, não foram abertas/verificadas ao vivo. Não há expertise validada nem licença de asset externo inferida.
