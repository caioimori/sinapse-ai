---
task: create-content-governance
responsavel: "@content-governor"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Create Content Governance

> Estabelecer politicas de governanca que regulam producao, publicacao e manutencao de conteudo.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-governor (Index) |
| **Co-agents** | content-orqx (Nexus) |
| **Trigger** | Setup de novo projeto ou revisao anual |
| **Input** | Escopo do projeto, equipe, plataformas, regulacoes do setor |
| **Output** | Documento de governanca com politicas, processos e responsabilidades |
| **Handoff** | → todos os agentes como referencia operacional |
| **Complexity** | complex |

---

## Fundamentacao

Governanca de conteudo previne caos em escala. Quando a producao cresce (mais pecas, mais plataformas, mais pessoas), sem governanca surgem: inconsistencias, publicacoes nao aprovadas, conteudo desatualizado, e risco de compliance. A governanca define: quem aprova? qual o fluxo? o que e proibido? como escalar? Referencia: Kristina Halvorson — content governance, Content Strategy Alliance — governance frameworks.

---

## Steps

### Step 1: Definir Papeis e Responsabilidades
Quem produz, quem revisa, quem aprova, quem publica? Matriz RACI (Responsible, Accountable, Consulted, Informed) para cada etapa do pipeline.

### Step 2: Definir Fluxo de Aprovacao
Quantas etapas de aprovacao? Para conteudo padrao: 1 revisao (Index). Para conteudo sensivel (opiniao, produto, crise): 2 revisoes + aprovacao do cliente.

### Step 3: Definir Politicas de Publicacao
O que pode ser publicado sem aprovacao (stories, replies)? O que SEMPRE precisa de aprovacao (posts de feed, blog, newsletter)? SLAs de revisao (24h para padrao, 4h para urgente).

### Step 4: Definir Politicas de Conteudo
Lista de temas proibidos, tom a evitar, claims que requerem comprovacao, mencoes a concorrentes, regras de desconto/promocao, regras de UGC repost.

### Step 5: Definir Politica de Arquivo e Remocao
Quando remover conteudo? Conteudo com dados desatualizados, conteudo que nao reflete mais o posicionamento, conteudo com performance negativa (comentarios negativos persistentes).

### Step 6: Handoff

```yaml
handoff:
  artifact: "content-governance-{client}.md"
  context: "Governanca estabelecida: RACI definido, {N} politicas, fluxo de aprovacao configurado"
  next: "Referencia operacional para todos os agentes do squad"
```
