# React Bits no SINAPSE AI

> Base operacional pesquisada em 14/07/2026. Fonte oficial fixada no commit
> [`3acbd54115330a42e39f63dda2d4859e998b6684`](https://github.com/DavidHDev/react-bits/tree/3acbd54115330a42e39f63dda2d4859e998b6684).

## Escopo comprovado

O catálogo oficial contém **139 componentes**: 31 animations, 23 text animations,
40 components e 45 backgrounds. Cada um oferece quatro variantes: JavaScript + CSS,
JavaScript + Tailwind, TypeScript + CSS e TypeScript + Tailwind. Os catálogos
gerados registram descrição, documentação, código fixado no commit, dependências,
props públicas e variantes:

- [Animations](animations.md)
- [Text animations](text-animations.md)
- [Components](components.md)
- [Backgrounds](backgrounds.md)
- [Resumo legível por máquina](catalog-summary.json)
- [Inventário integral legível por máquina](inventory.json)
- [Auditoria de implementação, documentação e registry](audit-findings.md)
- [Playbook de implementação e composição](implementation-playbook.md)

## Modelo mental correto

React Bits não é uma dependência monolítica de runtime. É um registry/catálogo de
código copiável: o componente entra no projeto e passa a ser código da aplicação.
Isso permite modificar layout, shaders, timelines, props e estilos, mas também
transfere para o projeto a responsabilidade por dependências, acessibilidade,
performance, cleanup, responsividade e atualização futura.

### Famílias técnicas

| Família | Uso típico | Motores dominantes | Risco principal |
|---|---|---|---|
| Text animations | headline, números, marquee, reveal | CSS, Motion, GSAP, Matter.js, Three.js | legibilidade e reduced motion |
| Animations | wrappers, cursores, trails, transições | CSS, GSAP, Three/R3F | listeners e custo por frame |
| Components | navegação, cards, galleries, inputs | CSS, Motion, GSAP, OGL/R3F | semântica, foco e interação |
| Backgrounds | atmosfera, shaders, partículas | OGL, Three.js, postprocessing | GPU, bateria e mobile |

No snapshot, as dependências mais recorrentes no registry são OGL, GSAP, Three.js e
Motion. Isso não significa instalar todas: instalar somente as
dependências declaradas pelo componente escolhido.

## Instalação oficial

### Manual

1. Abrir a página do componente e escolher Code.
2. Escolher linguagem e estilo.
3. Verificar cada pacote com `npm view <pacote>` antes de instalar.
4. Instalar apenas as dependências exibidas.
5. Copiar o componente e o CSS quando aplicável.
6. Importar, renderizar e adaptar no código da aplicação.

### CLI por URL

```bash
npx shadcn@latest add https://reactbits.dev/r/SplitText-TS-TW
npx jsrepo@latest add https://reactbits.dev/r/SplitText-TS-TW
```

Formato do item: `<Component>-<LANG>-<STYLE>`, com `LANG` em `JS|TS` e `STYLE`
em `CSS|TW`. O README oficial também demonstra o alias:

```bash
npx shadcn@latest add @react-bits/BlurText-TS-TW
```

Para o alias funcionar, configurar `components.json`:

```json
{
  "registries": {
    "@react-bits": "https://reactbits.dev/r/{name}.json"
  }
}
```

### MCP shadcn

```bash
npx shadcn@latest mcp init --client claude
npx shadcn@latest mcp init --client cursor
npx shadcn@latest mcp init --client vscode
```

O MCP serve para descobrir, pesquisar e adicionar itens do registry por linguagem
natural. Ele não substitui a revisão do código importado nem autoriza instalar um
pacote sem verificar sua existência e procedência.

> Exceção comprovada neste snapshot: `CurvedInput` só tem código funcional em
> `JS-CSS`; `JS-TW`, `TS-CSS` e `TS-TW` estão publicadas, porém vazias. Não instalar
> essas três variantes até o upstream corrigi-las.

## Escolha de variante

- Preferir `TS-TW` em projetos TypeScript + Tailwind.
- Preferir `TS-CSS` quando o CSS precisa permanecer explícito, isolável ou fácil de
  portar para outra camada de estilos.
- Usar variantes JS somente em projetos JavaScript existentes; não rebaixar um
  projeto TypeScript.
- Tratar o código instalado como ponto de partida. Manter a API mínima necessária e
  remover demos, defaults ou recursos não usados.

## Licença e limite de uso

O snapshot usa **MIT + Commons Clause License Condition v1.0**. O código pode ser
usado e modificado em aplicações, sites e produtos, inclusive comerciais, mantendo
o aviso de copyright/licença nas cópias substanciais. A restrição é não vender,
sublicenciar ou redistribuir os próprios componentes isoladamente, em bundle ou em
um port. Esta base armazena metadados, análise e links; não republica a biblioteca.

## Atualização da base

```bash
git -C <checkout-react-bits> pull --ff-only
node scripts/research/generate-react-bits-catalog.mjs --repo <checkout-react-bits>
```

Sempre registrar o novo SHA, revisar mudanças de licença e confirmar que a contagem
gerada coincide com `componentMetadata`. Não declarar a base atualizada apenas por
consultar o número promocional “140+” do README.

## Fontes primárias

- [Repositório oficial](https://github.com/DavidHDev/react-bits)
- [Documentação oficial](https://reactbits.dev/get-started/index)
- [Instalação](https://reactbits.dev/get-started/installation)
- [MCP](https://reactbits.dev/get-started/mcp)
- [Licença no commit pesquisado](https://github.com/DavidHDev/react-bits/blob/3acbd54115330a42e39f63dda2d4859e998b6684/LICENSE.md)
