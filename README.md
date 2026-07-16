<p align="center">
  <a href="https://www.npmjs.com/package/sinapse-ai"><img src="https://img.shields.io/npm/v/sinapse-ai?color=00B894&label=npm" alt="Versao npm"></a>
  <a href="https://github.com/caioimori/sinapse-ai/actions/workflows/ci.yml"><img src="https://github.com/caioimori/sinapse-ai/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-0EA5E9.svg" alt="Licenca MIT"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D18-22C55E.svg" alt="Node 18 ou superior"></a>
</p>

<h1 align="center">SINAPSE AI</h1>

<p align="center"><strong>Uma equipe de IA governada para Claude Code e Codex.</strong></p>

<p align="center">
  17 squads · 172 agentes · 1.412 task files · 1.348 ponteiros resolvíveis
</p>

<p align="center"><a href="README.en.md">English</a> · <a href="docs/getting-started.md">Documentacao</a> · <a href="https://www.npmjs.com/package/sinapse-ai">npm</a> · <a href="https://github.com/caioimori/sinapse-ai/issues">Issues</a></p>

---

```text
     S I N A P S E
  specialized work, one governed system
```

SINAPSE organiza trabalho de produto, engenharia, design, growth, seguranca e
operacao em especialistas coordenados. Ele nao troca sua LLM: instala a camada
de agentes, skills, regras e quality gates que torna Claude Code e Codex
consistentes dentro do projeto.

## Comece com um comando

No diretorio do projeto, execute:

```bash
npx sinapse-ai@latest install
```

Esse e o caminho canonico para instalacoes novas e existentes. Sem flags, ele
configura **Claude Code e Codex**; repeticoes sao upserts idempotentes e
preservam conteudo do projeto. Para limitar conscientemente a um provider, use
`--llm=claude-code` ou `--llm=codex`.

```text
install -> agentes e skills nativos -> regras e hooks -> projeto pronto
```

| Depois da instalacao | Claude Code | Codex |
|---|---|---|
| Orquestrador | `@sinapse-orqx` | `$snps` |
| Especialista | `@developer` | `$sinapse-agent developer` |
| Reconfigurar providers | `npx sinapse-ai@latest install --reconfigure` | mesmo comando |

## O que entra no seu projeto

| Superficie | Claude Code | Codex |
|---|:---:|:---:|
| Agentes canonicos | 172 | 172 |
| Skills instaladas | 37 | 37 |
| Hooks registrados | 20 registros | 9 eventos |
| React Bits | Skill + corpus de 9 arquivos | Skill + corpus de 9 arquivos |

O catalogo tem 17 squads e 172 agentes especializados. O runtime mede 1.201
squad tasks, 211 development tasks, 1.412 task files e 1.348 ponteiros
resolvíveis. React Bits esta incluido como capacidade de frontend, com um
snapshot pesquisavel de 139 componentes e regras de performance, acessibilidade
e reduced motion.

## Como o trabalho flui

```mermaid
flowchart LR
  A[Briefing] --> B[Orquestrador]
  B --> C[Especialista]
  C --> D[Story Ready]
  D --> E[Implementacao]
  E --> F[QA e gates]
  F --> G[Entrega]
```

O framework aplica uma Constitution com 11 artigos: documentacao antes de
codigo, autoridade clara por agente, seguranca, qualidade e colaboracao segura.
O orquestrador roteia; especialistas executam; o processo deixa evidencias.

## Comandos essenciais

```bash
# Instalar ou sincronizar os dois providers no projeto atual
npx sinapse-ai@latest install

# Atualizar uma instalacao sem perder customizacoes de projeto
npx sinapse-ai@latest update

# Diagnosticar e corrigir o ambiente
npx sinapse-ai@latest doctor --fix

# Ver a superficie instalada
npx sinapse-ai@latest status
```

`install --force` reinstala a superficie gerenciada. `install --reconfigure`
abre a escolha de provider. `install --global-only` configura apenas os
adapters globais, sem alterar o projeto atual.

## Arquitetura que respeita o projeto

| Camada | Responsabilidade | Politica |
|---|---|---|
| L1 | Core do framework | Imutavel |
| L2 | Templates e workflows | Extend-only |
| L3 | Configuracao | Mutavel com guardrails |
| L4 | Stories, packages, squads e testes | Sempre do projeto |

Atualizacoes renovam o que e gerenciado e preservam trabalho local. Os gates
tambem evitam push indevido, escrita sem story validada, SQL perigoso e drift
entre Claude Code e Codex.

## Para quem e

- Times que querem IA especializada sem perder rastreabilidade.
- Projetos que precisam do mesmo contrato em Claude Code e Codex.
- Produtos que valorizam story-first, QA, seguranca e entrega incremental.
- Pessoas que preferem comandos claros a um conjunto de prompts improvisados.

## Documentacao

| Tema | Link |
|---|---|
| Primeiros passos | [docs/getting-started.md](docs/getting-started.md) |
| Integracao Claude Code e Codex | [docs/guides/ide-integration.md](docs/guides/ide-integration.md) |
| Workflows de engenharia | [docs/framework/software-engineering-applicability.md](docs/framework/software-engineering-applicability.md) |
| Referencia de agentes | [docs/agent-reference-guide.md](docs/agent-reference-guide.md) |
| React Bits | [docs/framework/react-bits/index.md](docs/framework/react-bits/index.md) |
| Seguranca | [SECURITY.md](SECURITY.md) |
| Contribuir | [CONTRIBUTING.md](CONTRIBUTING.md) |

## Contribuicao

```bash
git clone https://github.com/caioimori/sinapse-ai.git
cd sinapse-ai
npm install
npm test
```

Abra uma branch, mantenha a story e os gates atualizados, e envie uma PR. Veja
[CONTRIBUTING.md](CONTRIBUTING.md) para o fluxo completo.

## Licenca

MIT. Veja [LICENSE](LICENSE).
