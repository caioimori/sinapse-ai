# Stack Tecnológico do SINAPSE

> [English](../../framework/tech-stack.md) | **Português**

Este documento descreve a tecnologia presente no repositório. As versões
canônicas estão em `package.json`, `package-lock.json` e nos workflows do GitHub
Actions fixados por SHA. Tecnologias propostas pertencem a um RFC, não a este
inventário.

## Contrato de runtime

| Superfície | Contrato atual |
|---|---|
| Runtime | Node.js 18 ou superior |
| Gerenciador de pacotes | npm 9 ou superior; `package-lock.json` é o lockfile canônico |
| Sistema de módulos | Pacote CommonJS com tipos e exports declarados |
| Plataformas | Windows, macOS e Linux |
| Pacote público | `sinapse-ai` no npm |
| Entrada principal | `npx sinapse-ai@latest install` |

A CI exercita Node.js 18, 20, 22 e 24 nas coberturas de compatibilidade. Vários
jobs determinísticos usam Node.js 20. O campo `engines` do pacote permanece como
fonte de verdade para a versão mínima suportada.

## Dependências de produção

O runtime é orientado a CLI:

| Capacidade | Pacotes |
|---|---|
| CLI e prompts | `commander`, `@clack/prompts`, `inquirer`, `ora`, `chalk`, `cli-progress` |
| Arquivos e processos | `fs-extra`, `fast-glob`, `chokidar`, `cross-spawn`, `execa`, `proper-lockfile`, `tar` |
| Dados estruturados | `yaml`, `js-yaml`, `ajv`, `ajv-formats`, `handlebars` |
| Versionamento e comparação | `semver`, `diff` |
| Saída no terminal | `asciichart` |

Os intervalos semânticos exatos não são duplicados aqui. Consulte-os com:

```bash
node -e "const p=require('./package.json'); console.log(p.dependencies)"
npm ls --depth=0
```

## Ferramentas de engenharia

| Responsabilidade | Ferramentas |
|---|---|
| Testes e cobertura | Jest 30 |
| Análise estática | ESLint 9 com `eslint.config.js` |
| Verificação de tipos | TypeScript 5 em modo `--noEmit` |
| Formatação | Prettier 3 |
| Gates locais | Husky e lint-staged |
| Release notes e publicação | semantic-release com plugins npm e GitHub |
| CI e segurança | GitHub Actions, CodeQL, scanner de secrets e gates constitucionais |

O processo de release é dividido intencionalmente: a preparação abre um pull
request e a publicação ocorre somente após aprovação protegida. Veja o
[processo de release](../../guides/release-process.md).

## Limites de arquitetura

- O core L1 é imutável.
- Templates e infraestrutura L2 são extend-only.
- A configuração L3 é mutável com guardrails.
- Stories, packages, squads e testes L4 pertencem ao projeto.
- Os adaptadores de Claude Code e Codex resolvem as mesmas definições canônicas.
- A CLI controla o comportamento; dashboards apenas observam.

## Verificação

Use comandos reproduzíveis em vez de claims não medidos de performance ou
tamanho de bundle:

```bash
npm ci --ignore-scripts
npm run lint
npm run typecheck
npm test
npm run validate:parity
npm pack --dry-run
npm audit --omit=dev
```

Não execute reescritas automáticas de dependências como correção padrão. Revise
a cadeia da dependência, atualize deliberadamente, rode a matriz relevante e
preserve a evidência do lockfile.

Última verificação contra o repositório: 2026-07-16.
