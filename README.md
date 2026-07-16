<p align="center">
  <img src="https://raw.githubusercontent.com/caioimori/sinapse-ai/main/docs/assets/sinapse-ai-github-hero.png" alt="SINAPSE AI - sistema governado de agentes para Claude Code e Codex" width="100%">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/sinapse-ai"><img src="https://img.shields.io/npm/v/sinapse-ai?style=flat-square&color=00B894&label=npm" alt="Versao npm"></a>
  <a href="https://github.com/caioimori/sinapse-ai/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/caioimori/sinapse-ai/ci.yml?branch=main&style=flat-square&label=CI" alt="Status da CI"></a>
  <a href="https://www.npmjs.com/package/sinapse-ai"><img src="https://img.shields.io/npm/dm/sinapse-ai?style=flat-square&color=0EA5E9" alt="Downloads mensais"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-111827?style=flat-square" alt="Licenca MIT"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D18-22C55E?style=flat-square" alt="Node 18 ou superior"></a>
</p>

<p align="center">
  <strong>Orquestre trabalho especializado. Preserve o controle da engenharia.</strong>
</p>

<p align="center">
  17 squads &middot; 172 agentes &middot; Claude Code + Codex &middot; 11 artigos de governanca
</p>

<p align="center">
  <a href="README.en.md">English</a> &middot;
  <a href="docs/getting-started.md">Primeiros passos</a> &middot;
  <a href="https://www.npmjs.com/package/sinapse-ai">npm</a> &middot;
  <a href="https://github.com/caioimori/sinapse-ai/discussions">Discussoes</a>
</p>

---

SINAPSE AI e um framework de orquestracao que instala agentes, skills, regras e
quality gates diretamente no seu projeto. Claude Code e Codex passam a trabalhar
com o mesmo catalogo, o mesmo processo de engenharia e autoridades explicitas.

Ele nao substitui sua CLI ou sua LLM. Ele transforma uma sessao de IA em um
sistema de trabalho auditavel: briefing, roteamento, story, implementacao, QA e
entrega.

## Instale em 30 segundos

No diretorio do projeto:

```bash
npx sinapse-ai@latest install
```

Sem flags, uma instalacao nova configura **Claude Code e Codex**. Uma nova
execucao preserva a selecao salva e o conteudo que pertence ao projeto.

Depois, ative o orquestrador:

| Claude Code | Codex |
|---|---|
| `@sinapse-orqx` | `$snps` |

Ou chame um especialista diretamente:

| Claude Code | Codex |
|---|---|
| `@developer` | `$sinapse-agent developer` |

> Requisitos: Node.js 18+, npm 9+ e pelo menos uma das CLIs suportadas.

## Do pedido a entrega

```mermaid
flowchart LR
  A[Briefing] --> B[Orquestrador]
  B --> C[Especialista]
  C --> D[Story validada]
  D --> E[Implementacao]
  E --> F[QA e gates]
  F --> G[PR e entrega]
```

```text
Voce: "Audite este fluxo de checkout e corrija os riscos encontrados."

SINAPSE
  -> classifica projeto, superficie e risco
  -> roteia arquitetura, produto, desenvolvimento e QA
  -> exige uma story pronta antes da implementacao
  -> valida testes, seguranca e paridade entre providers
  -> entrega evidencias, nao apenas uma resposta
```

## Por que SINAPSE

### Governanca executavel

A Constitution de 11 artigos define story-first, autoridade por papel,
qualidade, seguranca, colaboracao e defaults conservadores. Hooks e validadores
transformam essas regras em gates reais.

### Paridade Claude Code + Codex

O catalogo canonico gera superficies nativas para as duas CLIs. Os adapters sao
validados contra drift; o provider muda, o contrato de trabalho permanece.

### Especializacao coordenada

Os 17 squads cobrem engenharia, produto, design, seguranca, growth, conteudo,
financas e operacoes. Orquestradores roteiam; especialistas executam dentro de
limites claros.

## O que e instalado

| Capacidade | Claude Code | Codex |
|---|:---:|:---:|
| Catalogo de 172 agentes | Sim | Sim |
| Skills instaladas | 37 | 37 |
| Regras e instrucoes nativas | Sim | Sim |
| Hooks registrados | 20 registros | 9 eventos |
| Tasks e knowledge bases | Compartilhadas | Compartilhadas |
| React Bits para frontend | Skill + corpus | Skill + corpus |

Os numeros sao medidos a partir do repositorio. Verifique o estado atual com:

O inventario atual contem **1.201 squad tasks**, **211 development tasks**,
**1.412 task files** e **1.348 ponteiros resolviveis** em runtime.

```bash
node .codex/scripts/resolve-codex-agent.js --stats
npm run validate:parity
```

## Casos de uso

- **Produto novo:** discovery, arquitetura, stories, implementacao e gate de QA.
- **Brownfield:** diagnostico de divida, risco e plano incremental antes de editar.
- **Frontend:** design system, acessibilidade, React Bits e motion com reduced motion.
- **Seguranca:** threat modeling, validacao de secrets, RLS e revisao pre-deploy.
- **Operacao:** GitHub Flow, CI, releases, documentacao e rastreabilidade.

## Operacao segura

```bash
# Atualizar uma instalacao preservando customizacoes do projeto
npx sinapse-ai@latest update

# Diagnosticar o ambiente
npx sinapse-ai@latest doctor

# Aplicar correcoes seguras encontradas pelo diagnostico
npx sinapse-ai@latest doctor --fix

# Ver a superficie instalada
npx sinapse-ai@latest status
```

Use `install --llm=claude-code` ou `install --llm=codex` somente para uma
instalacao deliberadamente restrita. Use `install --reconfigure` para trocar a
selecao existente e `install --force` para renovar superficies gerenciadas.

## Arquitetura de ownership

| Camada | Responsabilidade | Politica |
|---|---|---|
| L1 | Core do framework | Imutavel |
| L2 | Templates e workflows | Extend-only |
| L3 | Configuracao | Mutavel com guardrails |
| L4 | Stories, packages, squads e testes | Pertence ao projeto |

Atualizacoes renovam superficies gerenciadas sem tratar o codigo do projeto
como descartavel. Consulte a [politica de instalacao e update](docs/installation/README.md).

## Documentacao

| Jornada | Documento |
|---|---|
| Instalar e fazer o primeiro roteamento | [Primeiros passos](docs/getting-started.md) |
| Escolher o workflow de engenharia | [Aplicabilidade de engenharia](docs/framework/software-engineering-applicability.md) |
| Integrar Claude Code e Codex | [Integracao de providers](docs/guides/ide-integration.md) |
| Encontrar agentes e comandos | [Referencia de agentes](docs/agent-reference-guide.md) |
| Usar React Bits com criterio | [React Bits](docs/framework/react-bits/index.md) |
| Entender contribuicao e GitFlow | [Contribuindo](CONTRIBUTING.md) |
| Reportar vulnerabilidades | [Seguranca](SECURITY.md) |
| Pedir ajuda | [Suporte](SUPPORT.md) |

## Produto e comunidade

- [Roadmap](ROADMAP.md): direcao publica, sem promessas artificiais de prazo.
- [Governanca](GOVERNANCE.md): decisoes, papeis e politica de mudanca.
- [Discussoes](https://github.com/caioimori/sinapse-ai/discussions): duvidas e propostas abertas.
- [Issues](https://github.com/caioimori/sinapse-ai/issues): bugs reproduziveis e trabalho rastreavel.
- [Changelog](CHANGELOG.md): historico de releases.

Contribuicoes passam por branch curta, PR, story quando aplicavel e gates
automatizados. Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Licenca

Distribuido sob a [licenca MIT](LICENSE). Atribuicoes de trabalhos derivados e
avisos de marcas estao em [NOTICE.md](NOTICE.md).
