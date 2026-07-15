# React Bits - achados de auditoria do snapshot

## Cobertura e proveniência

- Repositório e registry confirmados no SHA
  `3acbd54115330a42e39f63dda2d4859e998b6684`, de 14/07/2026.
- 139 componentes reais: 31 Animations, 23 TextAnimations, 40 Components e 45
  Backgrounds.
- 556 itens publicados no registry, quatro nomes de variante por componente.
- 139 demos com PropTable e mais de 1.600 entradas documentadas de props.
- O slogan “140+” é aproximado/promocional e não deve ser usado como contagem exata.

## Gap de variante funcional

`CurvedInput` tem implementação funcional apenas em `JS-CSS`. Os arquivos e os
payloads publicados de `JS-TW`, `TS-CSS` e `TS-TW` existem, mas o código principal tem
zero bytes. Portanto, existência no registry não prova capacidade funcional. O
gerador SINAPSE mede bytes e registra `incompleteVariants`.

## Divergências de API/documentação

- `AnimatedContent`: tabela escreve `dissappearAfter`; fonte usa `disappearAfter`.
- `GridDistortion`: tabela escreve `imgageSrc`; fonte usa `imageSrc`.
- `ASCIIText`: `strokeColor` aparece como não implementada.
- `FallingText`: `highlightClass` existe no JS-CSS, mas não é consistente nas outras
  variantes; `wordSpacing` aparece na tabela sem equivalente nas fontes TS.
- `Ferrofluid`: `backgroundColor` é duplicada na tabela.
- `LogoLoop` fica dentro do objeto `textAnimations` em `Components.js`, mas metadata,
  navegação e URL o tratam corretamente como Animation.

Regra: em conflito, usar registry para dependências e código da variante escolhida
para API/comportamento; tratar a PropTable como interface de documentação, não como
prova final.

## Divergências de instalação

- README e o gerador das páginas usam shadcn com alias `@react-bits/...`.
- `Installation.jsx` e `llms.txt` também mostram shadcn por URL direta. Ambos são
  formatos oficiais, mas a documentação não é uniforme.
- A página de instalação lista variantes jsrepo antigas (`default`, `tailwind`,
  `ts/default`, `ts/tailwind`), enquanto o registry/comando atual usa `JS-CSS`,
  `JS-TW`, `TS-CSS`, `TS-TW`.
- `Lanyard` marca `dependencyResolution: manual`; seu registry não expressa todas as
  dependências necessárias. Consultar demo e fonte.

## Padrões técnicos observados

Os padrões se sobrepõem; um componente pode aparecer em várias linhas:

| Padrão no JS-CSS        | Componentes |
| ----------------------- | ----------: |
| `requestAnimationFrame` |          78 |
| interação pointer/touch |          76 |
| WebGL ou shader         |          43 |
| `ResizeObserver`        |          34 |
| OGL                     |          31 |
| GSAP                    |          28 |
| Three.js/R3F            |          23 |
| Canvas 2D               |          23 |
| Motion                  |          20 |
| `IntersectionObserver`  |          17 |
| SVG                     |          12 |
| CSS `@keyframes`        |           4 |

Conclusão operacional: a maior parte do catálogo exige disciplina de lifecycle,
render loop, resize, pointer e GPU. Não tratar os snippets como CSS decorativo trivial.

## Dependências com discrepância

Há diferenças entre demo/manual e registry em pelo menos FadeContent, GradualBlur,
MagicRings, ASCIIText, GradientText, ShinyText, CardNav, Carousel, Lanyard, PillNav,
Ballpit e GridScan. Também há variantes com conjuntos diferentes, como ElasticSlider
e Ballpit. O `inventory.json` registra dependências por variante.

## Ferramentas oficiais fora dos 139 componentes

- [Background Studio](https://reactbits.dev/tools/background-studio): customiza
  backgrounds e exporta vídeo, imagem ou código.
- [Shape Magic](https://reactbits.dev/tools/shape-magic): cria formas/blobs e exporta
  SVG, PNG, JPG, React ou CSS clip-path.
- [Texture Lab](https://reactbits.dev/tools/texture-lab): aplica noise, dithering,
  halftone, ASCII e outros efeitos, com exportação/presets.

As três rotas têm implementação lazy real no snapshot. O sitemap não lista `/tools`,
as três subrotas nem `/get-started/index`; isso é omissão de SEO, não ausência.

## Comandos do repositório upstream

| Comando                               | Função                                           |
| ------------------------------------- | ------------------------------------------------ |
| `npm run dev`                         | registry watch + Vite                            |
| `npm run build`                       | registry build + llms.txt + sitemap + Vite build |
| `npm run new:component <tipo> <nome>` | cria estrutura inicial de componente             |
| `npm run registry:build`              | gera `public/r` via jsrepo                       |
| `npm run registry:dev`                | observa e regenera registry                      |
| `npm run llms:text`                   | gera índice textual para LLMs                    |
| `npm run sitemap`                     | gera sitemap                                     |
| `npm run lint`                        | ESLint sem warnings                              |
| `npm run format`                      | Prettier                                         |

O gerador upstream cria árvores e arquivos, mas não garante implementação equivalente
nas quatro variantes. Toda contribuição precisa revisar código, demo, metadata,
registry, desktop, mobile e console.
