<pre align="center">
 ███████╗███╗   ██╗██████╗ ███████╗     █████╗ ██╗
 ██╔════╝████╗  ██║██╔══██╗██╔════╝    ██╔══██╗██║
 ███████╗██╔██╗ ██║██████╔╝███████╗    ███████║██║
 ╚════██║██║╚██╗██║██╔═══╝ ╚════██║    ██╔══██║██║
 ███████║██║ ╚████║██║     ███████║    ██║  ██║██║
 ╚══════╝╚═╝  ╚═══╝╚═╝     ╚══════╝    ╚═╝  ╚═╝╚═╝
</pre>

<p align="center">
  <a href="https://www.npmjs.com/package/sinapse-ai"><img src="https://img.shields.io/npm/v/sinapse-ai?style=flat-square&color=00B894&label=npm" alt="Versão npm"></a>
  <a href="https://github.com/caioimori/sinapse-ai/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/caioimori/sinapse-ai/ci.yml?branch=main&style=flat-square&label=CI" alt="Status da CI"></a>
  <a href="https://www.npmjs.com/package/sinapse-ai"><img src="https://img.shields.io/npm/dm/sinapse-ai?style=flat-square&color=0EA5E9" alt="Downloads mensais"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-111827?style=flat-square" alt="Licença MIT"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D18-22C55E?style=flat-square" alt="Node 18 ou superior"></a>
</p>

<p align="center">
  <strong>Orquestre trabalho especializado. Preserve o controle da engenharia.</strong>
</p>

<p align="center">
  17 squads &middot; 172 agentes &middot; Claude Code + Codex &middot; 11 artigos de governança
</p>

<p align="center">
  <a href="README.en.md">English</a> &middot;
  <a href="docs/getting-started.md">Primeiros passos</a> &middot;
  <a href="https://www.npmjs.com/package/sinapse-ai">npm</a> &middot;
  <a href="https://github.com/caioimori/sinapse-ai/discussions">Discussões</a>
</p>

---

SINAPSE AI é um framework de orquestração que instala agentes, skills, regras e
quality gates diretamente no seu projeto. Claude Code e Codex passam a trabalhar
com o mesmo catálogo, o mesmo processo de engenharia e autoridades explícitas.

Ele não substitui sua CLI ou sua LLM. Ele transforma uma sessão de IA em um
sistema de trabalho auditável: briefing, roteamento, story, implementação, QA e
entrega.

## Instale com um comando

No diretório do projeto:

```bash
npx sinapse-ai@latest install
```

Sem flags, uma instalação nova configura **Claude Code e Codex**. Uma nova
execução preserva a seleção salva e o conteúdo que pertence ao projeto.

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
  D --> E[Implementação]
  E --> F[QA e gates]
  F --> G[PR e entrega]
```

```text
Você: "Audite este fluxo de checkout e corrija os riscos encontrados."

SINAPSE
  -> classifica projeto, superfície e risco
  -> roteia arquitetura, produto, desenvolvimento e QA
  -> exige uma story pronta antes da implementação
  -> valida testes, segurança e paridade entre providers
  -> entrega evidências, não apenas uma resposta
```

## Por que SINAPSE

### Governança executável

A Constituição de 11 artigos define story-first, autoridade por papel,
qualidade, segurança, colaboração e defaults conservadores. Hooks e validadores
transformam essas regras em gates reais.

### Paridade Claude Code + Codex

O catálogo canônico gera superfícies nativas para as duas CLIs. Os adapters são
validados contra drift; o provider muda, o contrato de trabalho permanece.

### Especialização coordenada

Os 17 squads cobrem engenharia, produto, design, segurança, growth, conteúdo,
finanças e operações. Orquestradores roteiam; especialistas executam dentro de
limites claros.

## O que é instalado

| Capacidade | Claude Code | Codex |
|---|:---:|:---:|
| Catálogo de 172 agentes | Sim | Sim |
| Skills instaladas | 37 | 37 |
| Regras e instruções nativas | Sim | Sim |
| Hooks registrados | 20 registros | 9 eventos |
| Tasks e knowledge bases | Compartilhadas | Compartilhadas |
| React Bits para frontend | Skill + corpus | Skill + corpus |

O inventário atual contém **1.201 squad tasks**, **211 development tasks**,
**1.412 task files** e **1.348 ponteiros resolvíveis** em runtime.

Esses números são medidos a partir do repositório. Verifique o estado atual com:

```bash
node .codex/scripts/resolve-codex-agent.js --stats
npm run validate:parity
```

## Casos de uso

- **Produto novo:** discovery, arquitetura, stories, implementação e gate de QA.
- **Brownfield:** diagnóstico de dívida, risco e plano incremental antes de editar.
- **Frontend:** design system, acessibilidade, React Bits e motion com reduced motion.
- **Segurança:** threat modeling, validação de secrets, RLS e revisão pre-deploy.
- **Operação:** GitHub Flow, CI, releases, documentação e rastreabilidade.

## Operação segura

```bash
# Instalar ou atualizar preservando customizações do projeto
npx sinapse-ai@latest install

# Diagnosticar o ambiente
npx sinapse-ai@latest doctor

# Aplicar correções seguras encontradas pelo diagnóstico
npx sinapse-ai@latest doctor --fix

# Ver a superfície instalada
npx sinapse-ai@latest status
```

Use `install --llm=claude-code` ou `install --llm=codex` somente para uma
instalação deliberadamente restrita. Use `install --reconfigure` para trocar a
seleção existente e `install --force` para renovar superfícies gerenciadas.

## Modelo de propriedade e responsabilidades

| Camada | Responsabilidade | Política |
|---|---|---|
| L1 | Core do framework | Imutável |
| L2 | Templates e workflows | Extend-only |
| L3 | Configuração | Mutável com guardrails |
| L4 | Stories, packages, squads e testes | Pertence ao projeto |

Reexecuções renovam superfícies gerenciadas sem tratar o código do projeto
como descartável. Consulte a [política de instalação](docs/installation/README.md).

## Documentação

| Jornada | Documento |
|---|---|
| Instalar e fazer o primeiro roteamento | [Primeiros passos](docs/getting-started.md) |
| Escolher o workflow de engenharia | [Aplicabilidade de engenharia](docs/framework/software-engineering-applicability.md) |
| Integrar Claude Code e Codex | [Integração de providers](docs/guides/ide-integration.md) |
| Encontrar agentes e comandos | [Referência de agentes](docs/agent-reference-guide.md) |
| Usar React Bits com critério | [React Bits](docs/framework/react-bits/index.md) |
| Entender contribuição e GitFlow | [Contribuindo](CONTRIBUTING.md) |
| Reportar vulnerabilidades | [Segurança](SECURITY.md) |
| Pedir ajuda | [Suporte](SUPPORT.md) |

## Produto e comunidade

- [Roadmap](ROADMAP.md): direção pública, sem promessas artificiais de prazo.
- [Governança](GOVERNANCE.md): decisões, papéis e política de mudança.
- [Discussões](https://github.com/caioimori/sinapse-ai/discussions): dúvidas e propostas abertas.
- [Issues](https://github.com/caioimori/sinapse-ai/issues): bugs reproduzíveis e trabalho rastreável.
- [Changelog](CHANGELOG.md): histórico de releases.

Contribuições passam por branch curta, PR, story quando aplicável e gates
automatizados. Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

Distribuído sob a [licença MIT](LICENSE). Atribuições de trabalhos derivados e
avisos de marcas estão em [NOTICE.md](NOTICE.md).
