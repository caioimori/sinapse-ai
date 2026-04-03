# Guia de Seguranca SINAPSE-AI

> Para reportar vulnerabilidades, veja [SECURITY.md](../../SECURITY.md)

---

## Indice

1. [Visao Geral da Arquitetura de Seguranca](#visao-geral-da-arquitetura-de-seguranca)
2. [Gestao de Secrets](#gestao-de-secrets)
3. [Modelo de Confianca MCP](#modelo-de-confianca-mcp)
4. [Limites de Seguranca dos Agentes](#limites-de-seguranca-dos-agentes)
5. [Arquitetura de Hooks](#arquitetura-de-hooks)
6. [Boas Praticas para Usuarios](#boas-praticas-para-usuarios)
7. [Aplicacao Constitucional](#aplicacao-constitucional)

---

## Visao Geral da Arquitetura de Seguranca

O SINAPSE-AI implementa um modelo de seguranca em profundidade com multiplas camadas de aplicacao:

```
Constitution (Artigo X)
  |
  +-- 25 Bloqueadores Pre-Deploy (3 tiers)
  |     +-- Tier 1: Bloqueadores Absolutos (deploy impossivel)
  |     +-- Tier 2: Bloqueadores de Compliance (LGPD)
  |     +-- Tier 3: Bloqueadores Operacionais
  |
  +-- 19 Hooks Claude Code (aplicacao em tempo real)
  |     +-- Varredura de secrets
  |     +-- Governanca SQL
  |     +-- Gates de arquitetura primeiro
  |     +-- Controle de autoridade de push
  |
  +-- Quality Gates (pre-commit, PR, revisao humana)
```

Seguranca nao e opcional no SINAPSE-AI. E aplicada no nivel constitucional (Artigo X -- NON-NEGOTIABLE) e automatizada atraves de hooks e gates que bloqueiam violacoes antes de chegarem a producao.

---

## Gestao de Secrets

### Como o SINAPSE-AI Trata Secrets

O SINAPSE-AI usa um sistema de varredura de secrets baseado em hooks que roda em toda operacao de escrita e commit.

**Hook ativo:** `secret-scanning.cjs`

**Padroes varridos incluem:**
- Chaves de acesso e secrets AWS
- Chaves de API Stripe (live e teste)
- Chaves privadas SSH (RSA, ED25519, ECDSA)
- Tokens GitHub (pessoal, OAuth, app)
- Chaves de API e credenciais OAuth Google
- Tokens e webhooks Slack
- Strings de conexao de banco com credenciais embutidas
- Tokens JWT e Bearer
- Strings genericas de alta entropia que correspondem a padroes de chaves

**Comportamento na deteccao:**
- O commit e **bloqueado** imediatamente
- O agente e notificado com o arquivo e padrao especificos
- O arquivo e removido do staging
- O usuario e avisado para rotacionar a credencial detectada

### Regras de Variaveis de Ambiente

| Regra | Aplicacao |
|-------|----------|
| Arquivos `.env` devem estar no `.gitignore` | Hook bloqueia commits contendo `.env` |
| `.env.example` deve usar placeholders | Revisao manual durante QA gate |
| Variaveis `NEXT_PUBLIC_*` sao publicas | Nunca coloque secrets em `NEXT_PUBLIC_*` |
| Chaves `service_role` nunca no frontend | Hook varre diretorios `src/`, `app/`, `pages/` |

---

## Modelo de Confianca MCP

O SINAPSE-AI usa uma abordagem em camadas para confianca de servidores MCP (Model Context Protocol):

### Isolamento Docker

Servidores MCP que requerem autenticacao ou acessam servicos externos rodam dentro de containers Docker via Docker MCP Toolkit. Isso fornece:

- **Isolamento de processo:** Servidores MCP nao podem acessar o filesystem do host diretamente
- **Segmentacao de rede:** Cada container tem seu proprio namespace de rede
- **Isolamento de credenciais:** Chaves de API sao injetadas via variaveis de ambiente Docker, nao armazenadas em arquivos do projeto

### Preferencia por Ferramentas Nativas

O SINAPSE-AI sempre prefere ferramentas nativas do Claude Code sobre equivalentes MCP:

| Tarefa | Ferramenta Preferida | Motivo |
|--------|---------------------|--------|
| Leitura/escrita de arquivos | Read, Write, Edit | Executa localmente, sem rede |
| Busca | Grep, Glob | Mais rapido, sem chamadas externas |
| Comandos | Bash | Execucao direta no host |

Servidores MCP so sao usados quando ferramentas nativas nao podem fornecer a capacidade requerida (busca web, automacao de navegador, acesso a APIs externas).

### Governanca MCP

Apenas o agente DevOps (`@devops` / Pipeline) tem autoridade para:
- Adicionar ou remover servidores MCP
- Configurar credenciais MCP
- Gerenciar infraestrutura Docker MCP

Outros agentes sao apenas consumidores -- nao podem modificar a configuracao MCP.

---

## Limites de Seguranca dos Agentes

### Camadas de Protecao do Framework (L1-L4)

O SINAPSE-AI aplica um modelo de fronteira de 4 camadas que controla o que agentes podem e nao podem modificar:

| Camada | Protecao | O Que Contem |
|--------|----------|-------------|
| **L1** Core do Framework | NUNCA modificar | Modulos core, Constitution, binarios CLI |
| **L2** Templates do Framework | NUNCA modificar | Tasks, templates, checklists, workflows |
| **L3** Config do Projeto | Controlado | Arquivos de dados, memoria de agentes, config |
| **L4** Runtime do Projeto | Aberto | Stories, packages, testes |

Essas fronteiras sao aplicadas deterministicamente atraves de deny rules em `.claude/settings.json`, nao pelo sistema de honra dos agentes.

### Matriz de Autoridade dos Agentes

Cada agente tem permissoes explicitas definindo quais operacoes pode executar:

| Agente | Pode Fazer | Nao Pode Fazer |
|--------|-----------|----------------|
| `@developer` | Escrever codigo, commit local | Push para remote, criar PRs |
| `@devops` | Push, criar PRs, gerenciar CI | Escrever codigo de aplicacao |
| `@architect` | Decisoes de design | Escrever codigo de implementacao |
| `@data-engineer` | Design de schema, migracoes | Codigo de aplicacao, git push |

O hook `enforce-delegation.cjs` bloqueia agentes orquestradores de executar trabalho de dominio diretamente, aplicando a matriz de delegacao em tempo de execucao.

### Autoridade de Git Push

Apenas `@devops` (Pipeline) pode executar `git push`. O hook `enforce-git-push-authority.sh` intercepta todos os comandos Bash e bloqueia qualquer tentativa de push de outros agentes.

---

## Arquitetura de Hooks

O SINAPSE-AI usa 19 hooks Claude Code organizados por evento de trigger:

### Mapa de Eventos dos Hooks

| Evento | Hook | Proposito | Comportamento |
|--------|------|-----------|---------------|
| **UserPromptSubmit** | `synapse-wrapper.cjs` | Injecao de contexto | Permitir |
| **PreToolUse (Bash)** | `enforce-git-push-authority.sh` | Bloquear push nao autorizado | Bloquear |
| **PreToolUse (Bash)** | `sql-governance.py` | Bloquear SQL perigoso | Bloquear |
| **PreToolUse (Bash)** | `enforce-delegation.cjs` | Bloquear trabalho direto de orquestradores | Bloquear |
| **PreToolUse (Write/Edit)** | `enforce-architecture-first.cjs` | Exigir docs antes de codigo | Bloquear |
| **PreToolUse (Write/Edit)** | `write-path-validation.cjs` | Avisar sobre paths errados | Avisar |
| **PreToolUse (Write/Edit)** | `enforce-story-gate.cjs` | Exigir story para codigo | Bloquear |
| **PreToolUse (Write/Edit)** | `slug-validation.py` | Validar nomenclatura | Avisar |
| **PreToolUse (Write/Edit)** | `mind-clone-governance.py` | Exigir DNA para clones | Bloquear |
| **PreToolUse (Write/Edit)** | `enforce-delegation.cjs` | Bloquear trabalho direto de orquestradores | Bloquear |
| **PreToolUse (Read)** | `read-protection.py` | Controlar acesso a arquivos sensiveis | Avisar |
| **PreCompact** | `precompact-wrapper.cjs` | Captura de digest de sessao | Permitir |

### Principios de Design

1. **Fail-open** -- Se um hook falha ou nao consegue parsear a entrada, sai com codigo 0 (permitir). Isso previne que bugs em hooks bloqueiem todo o desenvolvimento.
2. **Rapido** -- Cada hook deve completar em menos de 5 segundos.
3. **Silencioso no sucesso** -- Hooks so produzem saida ao bloquear ou avisar.
4. **Deterministico** -- Mesma entrada sempre produz a mesma saida.
5. **Sem efeitos colaterais** -- Hooks leem estado mas nao o modificam.

### Protocolo de Exit Code

| Codigo | Significado | Efeito |
|--------|------------|--------|
| 0 | Permitir | Operacao procede normalmente |
| 2 | Bloquear | Operacao negada, mensagem exibida |
| Outro | Ignorado | Tratado como 0 (permitir) |

---

## Boas Praticas para Usuarios

### Apos Instalar o SINAPSE-AI

1. **Verificar instalacao de hooks**: Execute `npx sinapse-ai doctor` para confirmar que todos os hooks estao registrados
2. **Checar `.gitignore`**: Garanta que `.env`, `.sinapse/`, e outros paths sensiveis estao listados
3. **Revisar servidores MCP**: Habilite apenas servidores MCP em que voce confia e precisa
4. **Configurar protecao de branch**: Habilite protecao de branch em `main` nas configuracoes do GitHub

### Durante o Desenvolvimento

1. **Nunca commite arquivos `.env`** -- Use `.env.example` com valores placeholder
2. **Use queries parametrizadas** -- Nunca use interpolacao de strings para SQL
3. **Revise codigo gerado** -- Codigo gerado por IA deve ser revisado antes de producao
4. **Mantenha dependencias atualizadas** -- Execute `npm audit` regularmente
5. **Use feature branches** -- O SINAPSE-AI cria branches automaticamente e nunca trabalha em `main`

### Para Deploys em Producao

1. **Habilite RLS em todas as tabelas** com dados de usuarios (veja [Padroes RLS](../../.sinapse-ai/data/rls-security-patterns.md))
2. **Nunca exponha chaves `service_role`** em codigo frontend
3. **Configure CORS** com origens explicitas (nunca use `origin: '*'` em producao)
4. **Adicione rate limiting** em todos os endpoints publicos de API
5. **Configure headers de seguranca** usando helmet ou middleware equivalente

---

## Aplicacao Constitucional

A Constitution do SINAPSE-AI (Artigo X -- Seguranca e Protecao de Dados) define 25 bloqueadores obrigatorios de pre-deploy:

### Tier 1: Bloqueadores Absolutos (10 itens)

Tornam o deploy impossivel se violados:
- Tabelas sem RLS habilitado
- Chaves de API hardcoded no codigo fonte
- `service_role` exposto no frontend
- MFA ausente em contas admin
- APIs sem autenticacao
- SQL com concatenacao de strings
- Vulnerabilidades critical/high em dependencias
- Secrets detectados no codebase
- Credenciais default em producao
- Criptografia TLS ausente

### Tier 2: Bloqueadores de Compliance (7 itens)

Tornam o deploy ilegal no Brasil (LGPD):
- DPO/Encarregado ausente
- Sem capacidade de notificacao de breach
- Mecanismo de consentimento ausente
- Sem portal de direitos do titular
- Transferencia internacional sem SCCs
- Dados de criancas sem consentimento dos pais
- Politica de privacidade nao publicada

### Tier 3: Bloqueadores Operacionais (8 itens)

Tornam o deploy irresponsavel:
- Sem inventario de ativos
- Sem logging centralizado
- Sem plano de resposta a incidentes
- Sem verificacao de backup
- Sem varredura de vulnerabilidades
- Sem segmentacao de rede
- Sem avaliacao de seguranca de vendors
- Sem aplicacao de SSL no banco de dados

Para o checklist completo e detalhes de implementacao, veja a Constitution em `.sinapse-ai/constitution.md`.

---

*Ultima atualizacao: 2026-04-03*
