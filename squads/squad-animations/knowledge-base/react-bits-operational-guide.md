# React Bits - operational guide

> Fonte canônica: `docs/framework/react-bits/index.md`.
> Snapshot: `DavidHDev/react-bits@3acbd54115330a42e39f63dda2d4859e998b6684`.

## Contrato de uso

React Bits é um catálogo de código copiável, não um pacote monolítico. Usar a base
para descobrir o componente, confirmar API e dependências, escolher uma das quatro
variantes, instalar/copiar a fonte oficial e adaptar o código ao projeto.

Carregar sob demanda os quatro catálogos e o playbook em
`docs/framework/react-bits/`.

## Roteamento interno

| Necessidade                         | Delegar para                     |
| ----------------------------------- | -------------------------------- |
| intenção, shortlist e especificação | `animation-interpreter`          |
| CSS, SVG e microinteração           | `css-motion-artist`              |
| timing, easing e composição         | `motion-choreographer`           |
| scroll e narrativa                  | `scroll-narrative-engineer`      |
| Three/R3F/WebGL                     | `threejs-architect`              |
| OGL/GLSL/shaders                    | `shader-artist`                  |
| partículas e física                 | `generative-particle-engineer`   |
| performance, mobile e a11y          | `animation-performance-engineer` |

## Regras invioláveis

1. Selecionar pela função na experiência, não por novidade.
2. Consultar fonte oficial e catálogo antes de afirmar props ou dependências.
3. Rodar `npm view <pacote>` para cada dependência antes de instalar.
4. Preferir `TS-TW` ou `TS-CSS` em projetos TypeScript.
5. Criar wrapper local e adaptar design tokens, conteúdo e breakpoints.
6. Implementar cleanup, reduced motion, fallback estático e semântica/foco.
7. Medir no mobile e impedir múltiplos owners de scroll, cursor ou render loop.
8. Não redistribuir componentes como biblioteca, bundle ou port; respeitar a licença.

## Atualização

Atualizar o checkout oficial por fast-forward e executar
`scripts/research/generate-react-bits-catalog.mjs`. A nova base só é válida quando o
gerador confirma paridade com `componentMetadata` e registra o novo SHA.
