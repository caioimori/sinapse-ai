---
task: design-brand-culture
responsavel: "@brand-culture-architect"
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

# Task: Design Brand Culture

> Projetar cultura de marca intencional com valores ativados, rituais e Culture Code.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-culture-architect (Ethos) |
| **Trigger** | Após estratégia de marca definida (post-Athena) |
| **Input** | Manifesto, valores, personas, culture audit |
| **Output** | `brand-culture-design.md` + `culture-code.md` |
| **Handoff** | → brand-compiler (Atlas) para inclusão no brandbook |

---

## Steps

### Step 1: Definir Purpose Statement Autêntico
Refinar o propósito até passar no Purpose Authenticity Test (≥20/25):

```
PROPÓSITO: {declaração concisa}
WHY: {por que isso importa}
HOW: {como praticamos isso}
PROOF: {evidência de que é real}
```

### Step 2: Ativar Valores em Comportamentos
Para CADA valor da marca:

**Valor: {nome}**
| Comportamento Esperado | Anti-comportamento | Exemplo Real |
|----------------------|-------------------|-------------|
| {o que fazer 1} | {o que NÃO fazer 1} | {situação real} |
| {o que fazer 2} | {o que NÃO fazer 2} | {situação real} |
| {o que fazer 3} | {o que NÃO fazer 3} | {situação real} |

**Teste:** Se alguém observar a equipe por 1 semana, conseguiria adivinhar os valores da marca apenas pelo comportamento?

### Step 3: Projetar Rituais de Marca

**Rituais Internos:**
| Ritual | Frequência | Formato | Valor Reforçado | Responsável |
|--------|-----------|---------|----------------|------------|
| {ritual 1} | Diário/Semanal/Mensal | | | |
| {ritual 2} | | | | |

**Rituais Externos (experiência do cliente):**
| Ritual | Touchpoint | Formato | Sentimento Gerado |
|--------|-----------|---------|------------------|
| {ritual 1: ex: welcome message} | Onboarding | | |
| {ritual 2: ex: unboxing experience} | Entrega | | |
| {ritual 3: ex: aniversário de cliente} | Retenção | | |

**Rituais Comunitários:**
| Ritual | Frequência | Formato | Objetivo |
|--------|-----------|---------|---------|
| {ex: meetup mensal} | Mensal | | |
| {ex: challenge sazonal} | Trimestral | | |

### Step 4: Definir Artefatos Culturais
| Artefato | Descrição | Status |
|----------|-----------|--------|
| Espaço físico/virtual | Como reflete a marca? | |
| Dress code | Existe? Qual? | |
| Ferramentas | Que tools usam e por quê? | |
| Onboarding kit | Welcome package para novos membros | |
| Communication channels | Como se comunicam internamente? | |
| Celebration format | Como celebram conquistas? | |

### Step 5: Criar Culture Code
Documento visual de 10-20 páginas:

```markdown
# Culture Code — {brand_name}

## Quem Somos
{Propósito + história resumida}

## No Que Acreditamos
{Valores com comportamentos}

## Como Trabalhamos
{Rituais + estilo de trabalho}

## O Que Nos Diferencia
{Cultura única da marca}

## Nossos Heróis
{Pessoas/histórias que exemplificam a cultura}

## O Que Não Toleramos
{Anti-comportamentos claros}

## Como Crescemos
{Desenvolvimento + feedback + evolução}

## Junte-se a Nós
{EVP — Employee Value Proposition}
```

### Step 6: Criar Employee Brand Guidelines
| Área | Guideline |
|------|-----------|
| Tom de voz interno | {como se comunicar entre equipe} |
| Social media pessoal | {regras de menção à marca} |
| Representação pública | {como representar em eventos} |
| Uso de assets | {o que pode/não pode usar} |
| Dress code | {se aplicável} |
| Resposta a crises | {como agir em situações negativas} |

### Step 7: Handoff
```yaml
handoff:
  to: brand-compiler (Atlas)
  artifacts:
    - brand-culture-design.md
    - culture-code.md
  context: "Cultura de marca projetada com valores ativados, rituais e Culture Code"
  next: "Incluir no brandbook como seção de cultura + documento standalone"
```
