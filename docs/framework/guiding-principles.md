# Principios Orientadores do SINAPSE

> Filosofia por tras das decisoes de design do framework SINAPSE-AI.

---

## 1. CLI First

**Por que CLI ao inves de UI?**

O SINAPSE segue uma hierarquia rigorosa: CLI > Observabilidade > UI. Toda inteligencia, execucao e automacao vivem no CLI. Dashboards observam, mas nunca controlam.

Essa decisao nao e estetica --- e estrutural. Agentes de IA operam em terminais. Interfaces graficas adicionam latencia, dependencias de runtime e pontos de falha entre o agente e a acao. Quando o CLI e a fonte da verdade, qualquer IDE compativel (Claude Code, Codex) consegue operar o framework sem camada intermediaria.

**Implicacao pratica:** toda funcionalidade nova DEVE funcionar 100% via CLI antes de qualquer UI existir. Se nao funciona no terminal, nao esta pronto.

> Constitution Art. I --- NON-NEGOTIABLE

---

## 2. Governanca Constitucional

**Por que artigos formais com enforcement automatico?**

O SINAPSE possui 10 artigos constitucionais que governam o comportamento de todos os 172 agentes. Cada artigo tem severidade definida (NON-NEGOTIABLE ou MUST) e gates automaticos que bloqueiam violacoes deterministicamente.

A alternativa --- guidelines aspiracionais --- falha em escala. Quando 172 agentes operam em 17 dominios, regras que dependem de "boa vontade" sao violadas silenciosamente. Gates automaticos (hooks pre-commit, pre-push, validacoes de story) garantem que violacoes sao detectadas e bloqueadas antes de causar dano.

**Exemplo:** o hook `enforce-git-push-authority.sh` bloqueia qualquer agente que nao seja @devops (Pipeline) de executar `git push`. Nao e uma sugestao --- e um bloqueio deterministico.

> Constitution v2.2.0 --- 10 artigos, 6 NON-NEGOTIABLE, 4 MUST

---

## 3. Documentation-First Development

**Por que stories antes de codigo?**

Nenhuma linha de codigo e escrita sem uma story validada. O pipeline e automatico e inviolavel:

```
Briefing → Epic → Story → Validacao → Implementacao
```

Essa decisao nasce de experiencia pratica: codigo sem especificacao gera retrabalho. Stories com acceptance criteria claros (Given/When/Then) criam um contrato verificavel entre quem pede e quem implementa. O agente @product-lead (Axis) valida cada story antes que @developer (Pixel) toque em qualquer arquivo.

**O que acontece se o usuario pedir "implementa rapido, sem story"?** O sistema RECUSA. Nao existe atalho. Mesmo bug fixes passam pelo pipeline de documentacao.

> Constitution Art. III --- NON-NEGOTIABLE

---

## 4. Delegacao Obrigatoria

**Por que orquestradores nunca executam trabalho de dominio?**

Orquestradores (Imperator e todos os *-orqx) existem para rotear, diagnosticar e coordenar. Eles NUNCA escrevem codigo, criam schemas, fazem copy ou executam qualquer trabalho especializado. Sempre delegam ao agente correto.

A razao e separacao de responsabilidades em escala. Um orquestrador que "faz tudo" acumula contexto desnecessario, perde especializacao e cria um ponto unico de falha. Quando Imperator recebe "implementa feature X", ele delega para @developer (Pixel). Quando recebe "audita a marca", delega para @brand-orqx (Meridian). Mesmo que o usuario diga "faz voce mesmo" --- o orquestrador delega.

**Enforcement:** qualquer resposta de orquestrador contendo trabalho de dominio direto e uma violacao constitucional bloqueada automaticamente.

> Constitution Art. VIII --- NON-NEGOTIABLE

---

## 5. Escala do Ecossistema de Agentes

**Por que 172 agentes em 17 dominios?**

O SINAPSE nao e um agente generalista. E um ecossistema de 160 especialistas organizados em 17 squads tematicos. Cada agente tem persona, expertise e comandos especificos para seu dominio.

Essa arquitetura permite:

- **Especializacao profunda:** um agente de copywriting (Quill) nao carrega contexto de database. Um data engineer (Tensor) nao carrega contexto de branding.
- **Contexto otimizado:** cada agente carrega apenas as dependencias necessarias para seu dominio, preservando a janela de contexto para o trabalho real.
- **Escalabilidade horizontal:** novos dominios sao adicionados como squads independentes, sem impactar o core.

Os 12 agentes core cobrem o ciclo completo de desenvolvimento de software. Os 17 squads expandem para dominios como branding, growth, financeiro, cybersecurity e mais.

| Camada | Agentes | Funcao |
|--------|---------|--------|
| Core | 12 agentes | Desenvolvimento de software completo |
| Squads | 160 agentes em 17 dominios | Especializacao por dominio |
| Total | 172 agentes | Ecossistema completo |

> Constitution Art. VII --- metricas exatas, sempre sincronizadas

---

## 6. Enforcement via Hooks

**Por que controles deterministicos ao inves de guidelines aspiracionais?**

O SINAPSE usa hooks (scripts executados automaticamente em momentos especificos) para garantir que regras sejam seguidas. Cada hook tem comportamento definido:

| Hook | O que faz | Comportamento |
|------|-----------|---------------|
| `enforce-git-push-authority.sh` | Bloqueia push por agentes nao-autorizados | BLOCK |
| `sql-governance.py` | Bloqueia SQL perigoso (injection) | BLOCK |
| `enforce-story-gate.cjs` | Exige story valida antes de codigo | BLOCK |
| `enforce-delegation.cjs` | Impede orquestradores de executar dominio | BLOCK |
| `enforce-architecture-first.cjs` | Exige docs antes de codigo protegido | BLOCK |

**Principios de design dos hooks:**
- **Fail-open:** se o hook crasha, a operacao continua (nunca bloqueia por bug)
- **Rapidos:** cada hook completa em menos de 5 segundos
- **Silenciosos no sucesso:** so produzem output quando bloqueiam ou alertam
- **Deterministicos:** mesma entrada sempre produz mesma saida
- **Sem efeitos colaterais:** hooks leem estado, nunca modificam

> Detalhes completos: `.claude/rules/hook-governance.md`

---

## 7. Colaboracao Segura

**Por que a complexidade do git e escondida dos usuarios?**

Os usuarios do SINAPSE sao product builders, nao especialistas em git. Agentes DEVEM gerenciar toda a complexidade de versionamento automaticamente:

- **Auto-branch:** nunca trabalhar em `main`. Criar branch automaticamente.
- **Auto-sync:** `git fetch` + pull no inicio de toda sessao.
- **Auto-resolve:** resolver conflitos simples automaticamente.
- **Auto-PR:** criar PR com reviewer assignment apos push.
- **Linguagem simples:** "salvei seu trabalho" ao inves de "commitei no HEAD".

**Por que?** Porque merge conflicts, rebases e force pushes sao a maior fonte de perda de trabalho em equipes nao-tecnicas. O SINAPSE elimina essa classe inteira de problemas ao automatizar 100% do fluxo git.

> Constitution Art. IX --- NON-NEGOTIABLE

---

## 8. Seguranca por Default

**Por que 25 deployment blockers existem?**

O SINAPSE define 25 verificacoes que DEVEM passar antes de qualquer deploy em producao. Sao organizadas em 3 tiers:

| Tier | Quantidade | Consequencia de ignorar |
|------|-----------|------------------------|
| Tier 1: Absolute Blockers | 10 | Deploy impossivel |
| Tier 2: Compliance Blockers | 7 | Deploy ilegal no Brasil (LGPD) |
| Tier 3: Operational Blockers | 8 | Deploy irresponsavel |

Essa decisao vem de licoes reais: os maiores vazamentos de dados de 2023-2025 (Change Healthcare: 192.7M afetados, Ticketmaster: 560M, 23andMe: 6.9M) tiveram como causa raiz a AUSENCIA de controles basicos como MFA e RLS.

**Exemplos de blockers:**
- Tabela sem RLS ativado
- API keys hardcoded no codigo
- `service_role` exposta no frontend
- APIs sem autenticacao
- Vulnerabilidades critical/high em dependencias

> Constitution Art. X --- NON-NEGOTIABLE

---

## 9. Open Source com Standards

**Por que MIT com quality gates?**

O SINAPSE e distribuido sob licenca MIT --- qualquer pessoa pode usar, modificar e distribuir. Mas contribuicoes ao repositorio principal passam por quality gates rigorosos:

- **3 camadas de qualidade:** pre-commit (hooks locais) → PR automation (CodeRabbit + CI) → human review
- **Documentation-First:** toda contribuicao segue o pipeline de documentacao
- **Constitution compliance:** nenhuma contribuicao pode violar os 10 artigos constitucionais
- **Metricas exatas:** qualquer mudanca que altere contagem de squads/agentes deve atualizar TODOS os documentos que referenciam essas metricas

Isso garante que o framework mantem coerencia e qualidade mesmo com contribuicoes externas.

> Processo de contribuicao: [CONTRIBUTING.md](../CONTRIBUTING.md)

---

## Resumo

| Principio | Por que existe | Enforcement |
|-----------|---------------|-------------|
| CLI First | Agentes operam em terminais | Hook WARN |
| Governanca Constitucional | 172 agentes precisam de regras deterministicas | 10 artigos + gates |
| Documentation-First | Codigo sem spec gera retrabalho | Hook BLOCK |
| Delegacao Obrigatoria | Separacao de responsabilidades em escala | Hook BLOCK |
| Ecossistema 172 Agentes | Especializacao profunda por dominio | Art. VII metricas |
| Hooks Deterministicos | Guidelines aspiracionais falham em escala | 5+ hooks ativos |
| Colaboracao Segura | Usuarios nao sao git experts | Auto-branch/sync/PR |
| Seguranca por Default | Licoes de vazamentos reais | 25 blockers |
| Open Source + Standards | Qualidade com contribuicoes externas | 3 camadas QA |
