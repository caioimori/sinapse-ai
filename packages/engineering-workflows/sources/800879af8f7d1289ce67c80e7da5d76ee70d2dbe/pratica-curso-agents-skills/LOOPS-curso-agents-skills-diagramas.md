---
titulo: "LOOPS Curso Agents & Skills — Engenharia de Contexto na prática (diagramas e passo a passo)"
tipo: loops-diagramas
created: 2026-06-22
total_workflows: 10
---

# LOOPS Curso Agents & Skills — Engenharia de Contexto na prática

Os loops operacionais destilados da **Formação DEV — "Agents, Skills & Engenharia de Contexto"** (fonte única prática), prontos pra virar comportamento de agent. Aterram, no chão de fábrica do dev, os domínios canônicos [[23-desenvolvimento-orientado-por-ia]], [[24-spec-driven-development]], [[25-agentic-loops-orquestracao]], [[26-context-engineering]], [[27-evals-verificacao-guardrails]] e [[28-tool-use-mcp-harness]]. Do prompt narrado por voz à biblioteca de 15 skills, do scaffold determinístico de projeto ao módulo de autenticação ponta a ponta — cada workflow é a versão "como eu faço isso hoje no Claude Code / Codex / Cursor" dos conceitos já mapeados no repo.

## Índice dos loops

- **W1** — Estrutura de um prompt eficaz (contexto → objetivos → regras → formato → tarefa; peso do final)
- **W2** — Fluxo narrar-por-voz → IA estrutura → micro-revisão final
- **W3** — Curadoria de contexto (marcar arquivos/pastas, injetar rule/skill, verificar no fim)
- **W4** — Decisão Rule vs Skill (declarativo-passivo vs procedimental-ativo)
- **W5** — Autoria de uma Skill por engenharia reversa (do código real ao `SKILL.md`)
- **W6** — Scaffolding "Novo Projeto" (skill determinística do monorepo Turborepo)
- **W7** — Scaffolding "Novo Módulo" (negócio → Nest → rotas Next, skill híbrida)
- **W8** — Sistema de validações do módulo `shared` (regra → agregação → contrato → catálogo)
- **W9** — Módulo de Autenticação (User → providers → registrar → Prisma → API + teste)
- **W10** — Agentes em paralelo (tarefas independentes + worktrees Git)

---

## W1 — Estrutura de um prompt eficaz

> Monta o prompt na ordem canônica do curso (contexto → objetivos → regras → formato → tarefa), explorando o peso desproporcional do final pra ancorar o que mais importa.

```mermaid
flowchart TD
    A["Intenção da tarefa"] --> B["1. CONTEXTO<br/>quem é você, projeto, stack"]
    B --> C["2. OBJETIVOS<br/>o que precisa ser feito"]
    C --> D["3. REGRAS<br/>restrições (reusar uma RULE existente)"]
    D --> E["4. FORMATO DE SAÍDA<br/>(ex.: JSON com campos específicos)"]
    E --> F["5. TAREFA FINAL<br/>'implemente X conforme acima'"]
    F --> G{"O mais crítico está<br/>no início OU no fim?"}
    G -- "Está no meio" --> H["Mover para o final<br/>(recency / Lost in the Middle)"]
    H --> F
    G -- "Está na borda" --> I["Prompt pronto:<br/>contexto rico vence redação elaborada"]
```

---

## W2 — Fluxo narrar-por-voz → IA estrutura → revisa-final

> A meta-skill pessoal do instrutor: narrar por voz aceitando ruído, fechar com uma micro-revisão do mais importante, e opcionalmente pedir à própria IA pra reescrever na estrutura do W1.

```mermaid
flowchart TD
    A["Pedido na cabeça"] --> B["Narrar por voz<br/>(ditado → texto no cursor)"]
    B --> C["Aceitar ruído:<br/>repetições, palavras ignoradas — 'no fim ele sobrevive'"]
    C --> D["Micro-revisão final:<br/>repetir a coisa mais importante (peso do final)"]
    D --> E{"Tarefa é simples<br/>ou tem pegadinhas?"}
    E -- "Simples" --> F["Enviar narração direta<br/>(contexto rico basta)"]
    E -- "Tem pegadinhas" --> G["Pedir à IA:<br/>'reescreva na estrutura W1'"]
    G --> H["IA devolve prompt estruturado<br/>(um prompt gera outro)"]
    H --> I["Revisar e executar"]
    F --> I
```

---

## W3 — Curadoria de contexto

> Engenharia de contexto aplicada: marcar os arquivos/pastas certos, injetar rule + skill antes da ação e deixar a ferramenta verificar build/teste no fim — contra o apodrecimento do contexto (context rot).

```mermaid
flowchart TD
    A["Vou executar uma ação"] --> B["Marcar ARQUIVOS relevantes<br/>(@arquivo ou colar caminho relativo)"]
    B --> C["Marcar PASTAS + descrever papel<br/>('aqui ficam os DTOs')"]
    C --> D["Injetar RULE (restrição)<br/>+ SKILL (processo) antes da ação"]
    D --> E{"Contexto traz só<br/>o relevante?"}
    E -- "Tem ruído / excesso" --> F["Cortar: contexto é recurso,<br/>não desperdiçar (evita context rot)"]
    F --> E
    E -- "Enxuto e rico" --> G["Executar ação<br/>(estrada bem definida = menos aleatoriedade)"]
    G --> H["Ferramenta roda build/teste<br/>e se autocorrige"]
    H --> I{"Output bate com<br/>o esperado?"}
    I -- "Não" --> J["Reinjetar erro como próximo prompt"]
    J --> G
    I -- "Sim" --> K["Resultado previsível,<br/>segue a arquitetura"]
```

---

## W4 — Decidir Rule vs Skill

> Decide se a necessidade é uma convenção/restrição passiva (Rule) ou um processo de construção repetível (Skill) — e amarra a skill às rules que ela precisa respeitar.

```mermaid
flowchart TD
    A["Necessidade a codificar"] --> B{"É CONVENÇÃO/RESTRIÇÃO<br/>que vale sempre que X?"}
    B -- "Sim" --> C["RULE<br/>(declarativa, passiva: o QUÊ)"]
    C --> D{"Mistura mais de uma<br/>responsabilidade?"}
    D -- "Sim" --> E["Separar:<br/>1 rule = 1 responsabilidade reusável"]
    E --> C
    D -- "Não" --> F["Rule pronta<br/>(ex.: nomenclatura, 'service não acessa banco')"]
    B -- "Não" --> G{"É um PROCESSO repetível<br/>de construção?"}
    G -- "Sim" --> H["SKILL<br/>(procedimental, ativa: o COMO)"]
    H --> I{"O processo precisa<br/>respeitar convenções?"}
    I -- "Sim" --> J["Skill REFERENCIA a Rule<br/>(rule = trilho, skill = trem)"]
    J --> K["Skill pronta"]
    I -- "Não" --> K
    G -- "Não" --> L["Ajuste pontual:<br/>nem rule nem skill, só prompt"]
```

---

## W5 — Autoria de uma Skill (do conceito ao arquivo)

> Skill de código nunca se escreve no vácuo: parte-se de código real validado, aponta-se a IA para fazer engenharia reversa e o `SKILL.md` nasce com few-shot real do próprio projeto.

```mermaid
flowchart TD
    A["Preciso de uma skill<br/>para tarefa repetível"] --> B{"Já existe código REAL<br/>validado desse padrão?"}
    B -- "Não" --> C["Criar 1 exemplo de referência<br/>e validar (roda/compila)"]
    C --> D
    B -- "Sim" --> D["Apontar IA pros arquivos:<br/>'engenharia reversa + gere a skill'"]
    D --> E["IA extrai estrutura + nomenclatura<br/>+ exemplos few-shot reais"]
    E --> F["Gera pasta da skill:<br/>SKILL.md (name kebab-case + description-gatilho)"]
    F --> G{"Parte do processo é<br/>100% fixa e conhecida?"}
    G -- "Sim" --> H["Adicionar script + assets<br/>(copiar, não gerar)"]
    H --> I
    G -- "Não" --> I["Skill aberta:<br/>corpo orienta a IA livremente"]
    I --> J{"Tem few-shot e<br/>escopo focado?"}
    J -- "Não (skill fraca)" --> K["Adicionar exemplos de código<br/>+ estreitar escopo"]
    K --> J
    J -- "Sim" --> L["Testar ao vivo num caso novo"]
    L --> M{"Output correto?"}
    M -- "Não" --> N["Ajustar SKILL.md<br/>(editável à mão)"]
    N --> L
    M -- "Sim" --> O["Skill pronta<br/>(versionar como submódulo Git)"]
```

---

## W6 — Scaffolding "Novo Projeto"

> Skill determinística modelo: um script JS cria o monorepo Turborepo do zero, sem interação humana (flags de auto-confirmação), com travas de idempotência e renomeação de namespace pela IA no fim.

```mermaid
flowchart TD
    A["criar projeto @namespace"] --> B{"Já existe projeto<br/>na pasta atual?"}
    B -- "Sim" --> C["ABORTAR<br/>(idempotência: não rodar 2x)"]
    B -- "Não" --> D["create-turbo<br/>(--package-manager, sem perguntar)"]
    D --> E["Excluir apps de exemplo<br/>(rm -rf sem confirmação)"]
    E --> F["Criar app web (Next.js)<br/>--no-git, com src/, npm"]
    F --> G["Criar app backend (NestJS)<br/>em apps/backend"]
    G --> H["Instalar config de .env no backend<br/>+ ajustar portas: web 3000 / backend 4000"]
    H --> I["Habilitar CORS no main.ts"]
    I --> J["Criar .env/.env.example sincronizados<br/>(NEXT_PUBLIC_API_URL=localhost:4000)"]
    J --> K["Adicionar script 'dev' na raiz<br/>(roda os 2 apps via Turbo)"]
    K --> L{"@namespace foi passado?"}
    L -- "Sim" --> M["IA substitui namespace<br/>em web + backend + packages"]
    M --> N["npm run dev:<br/>web:3000 e backend:4000 no ar"]
    L -- "Não" --> N
```

---

## W7 — Scaffolding "Novo Módulo"

> Skill híbrida: script copia o template fixo do pacote de negócio; a IA registra dependências, cria o módulo Nest e as rotas Next — e tudo fecha com install + build + test verde.

```mermaid
flowchart TD
    A["criar módulo nome @namespace"] --> B{"Recebeu nome E namespace?"}
    B -- "Falta algum" --> C["ABORTAR e perguntar<br/>(trava de segurança)"]
    B -- "Sim" --> D["Copiar template determinístico:<br/>src/index, tests/index.test, package.json, tsconfig"]
    D --> E["Registrar dep @namespace/nome<br/>no package.json do backend e do web"]
    E --> F["Garantir ts-node na raiz<br/>(dev dependency)"]
    F --> G["Criar módulo Nest em apps/backend<br/>+ controller com 1 rota + registrar em app.module"]
    G --> H{"Módulo é autenticação?"}
    H -- "Sim" --> I["Rota Next em (public)/"]
    H -- "Não" --> J["Rota Next em (private)/"]
    I --> K["Criar page + component do módulo<br/>(page.tsx importa page, page importa components)"]
    J --> K
    K --> L["npm install → npm run build → npm test"]
    L --> M{"Build verde e<br/>cobertura 100%?"}
    M -- "Não" --> N["Corrigir e repetir"]
    N --> L
    M -- "Sim" --> O["Módulo pronto<br/>(negócio + Nest + rotas)"]
```

---

## W8 — Sistema de validações do módulo `shared`

> O sistema de validações reutilizável evolui em 4 partes: regra isolada → agregação por entidade → contrato elegante (string | null) → catálogo em arquivos próprios, com i18n e coleta de todos os erros.

```mermaid
flowchart TD
    A["Necessidade de validação<br/>no shared"] --> B["Parte 1 — Desenho:<br/>ValidationRule (validate) + Validator + regras concretas"]
    B --> C["Cada regra valida SÓ sua característica<br/>(RequiredRule separada; EmailRule vazia = passa)"]
    C --> D["Parte 2 — Agregação por entidade:<br/>{fieldCode, value, rules[]} → acumula TODOS os erros"]
    D --> E["Código de campo = entidade.atributo + regra<br/>(ex.: user.email.invalid.email → i18n)"]
    E --> F["Parte 3 — Refino do contrato:<br/>validate() retorna string | null (não boolean)"]
    F --> G["Validator.validate (estático) percorre campos,<br/>junta erros, lança ValidationException (422) se ≥1"]
    G --> H["Parte 4 — Catálogo em massa:<br/>texto/números/datas/identificadores/contato/Brasil(CPF/CNPJ/CEP)"]
    H --> I{"IA jogou tudo<br/>num index.ts único?"}
    I -- "Sim" --> J["Corrigir prompt:<br/>'cada regra em *.rule.ts, index só re-exporta'"]
    J --> H
    I -- "Não" --> K["npm test:<br/>86 testes / 19 suites / 100% cobertura"]
    K --> L["Sistema de validações pronto<br/>(reutilizado por todas as entidades)"]
```

---

## W9 — Módulo de Autenticação (ponta a ponta)

> Clean Architecture do negócio à API: entidade User com validações reais, providers como interfaces, caso de uso testado 100% com mocks (sem infra), depois Prisma + bcrypt + controller fino + teste de integração `.http`.

```mermaid
flowchart TD
    A["Agregado user/ no módulo auth"] --> B["Entidade User extends Entity<br/>name + email + password (hash bcrypt) + datas"]
    B --> C["Validações: PersonalNameRule (shared) +<br/>EmailRule + HashedPasswordRule; validate() público"]
    C --> D["Providers (ports): UserRepository (CrudRepository)<br/>+ CryptoProvider (encrypt/compare)"]
    D --> E["Caso de uso RegisterUser:<br/>valida senha forte → encrypt → cria User → validate → persiste"]
    E --> F["Testar com fake repo + fake crypto<br/>(100% cobertura, ZERO infra)"]
    F --> G["Config Prisma (skill):<br/>schema PostgreSQL + docker-compose + DATABASE_URL"]
    G --> H["prisma:sync-models (skill):<br/>varre o módulo → gera model User (tabela 'users' via @@map)"]
    H --> I["npx prisma migrate dev"]
    I --> J["prisma:repository (skill):<br/>UserPrisma implementa UserRepository (DI do PrismaService)"]
    J --> K["Bcrypt implementa CryptoProvider<br/>(salt rounds = 12)"]
    K --> L["Controller fino: POST /register injeta<br/>UserPrisma + Bcrypt → executa use case → 201"]
    L --> M["Teste de integração (REST Client *.http):<br/>senha fraca → 422; email inválido → 422; válido → 201"]
    M --> N{"Erro 'tabela não existe'?"}
    N -- "Sim" --> O["npx prisma generate + npm run dev<br/>(verificação pós-ação)"]
    O --> M
    N -- "Não" --> P["Registro gravado<br/>(senha já criptografada, conferida no Studio)"]
```

---

## W10 — Usar agentes em paralelo

> Dois níveis de paralelismo: rodar skills que geram artefatos independentes ao mesmo tempo, e isolar cada agente numa worktree Git separada pra eles nunca colidirem no mesmo repositório.

```mermaid
flowchart TD
    A["Várias tarefas pendentes"] --> B{"As tarefas geram artefatos<br/>SEM dependência entre si?"}
    B -- "Não (acoplados)" --> C["Rodar em sequência<br/>(uma depende do output da outra)"]
    B -- "Sim" --> D{"Risco de colisão<br/>no mesmo working tree?"}
    D -- "Baixo" --> E["Nível 1: rodar N skills em paralelo<br/>(ex.: 3 skills, arquivos independentes)"]
    D -- "Alto" --> F["Nível 2: skill 'agente-em-paralelo' (determinística)<br/>cria worktree/branch Git por agente"]
    F --> G["Cada agente trabalha isolado<br/>(contexto + working tree próprios)"]
    E --> H{"Custo de créditos<br/>aceitável?"}
    G --> H
    H -- "Não" --> I["Reduzir nº de agentes<br/>(paralelismo tem custo por chamada)"]
    I --> H
    H -- "Sim" --> J["Coletar artefatos<br/>e mesclar (fan-in)"]
    C --> J
```
