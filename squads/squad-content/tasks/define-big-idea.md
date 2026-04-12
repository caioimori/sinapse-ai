---
task: define-big-idea
responsavel: "@editorial-strategist"
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

# Task: Define Big Idea

> Definir a Big Idea central que orienta toda a estrategia editorial do cliente.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | editorial-strategist (North) |
| **Co-agents** | content-orqx (Nexus) |
| **Trigger** | Onboarding de novo cliente ou revisao estrategica trimestral |
| **Input** | Brand voice (do squad brand-system), posicionamento, publico-alvo, objetivos de negocio |
| **Output** | Big Idea documentada com narrativa-mestre e territorios tematicos |
| **Handoff** | → define-editorial-pillars |
| **Complexity** | critical |

---

## Fundamentacao

A Big Idea e o "norte magnético" de todo conteudo. Sem ela, conteudo vira tatica sem estrategia — posts desconectados que nao constroem nada. A Big Idea responde: "qual e a UNICA coisa que queremos que a audiencia pense/sinta quando interagir com nosso conteudo?". Referencia: David Ogilvy — "big ideas come from the unconscious", Ann Handley — "bigger, bolder, braver content". A Big Idea deve ser simples, memoravel e infinitamente desdobravel.

---

## Steps

### Step 1: Auditar Posicionamento Existente
Receber do brand-system: brand voice, valores, proposta de valor, diferenciais competitivos, Tom & Voz. Sintetizar o DNA da marca em 3-5 afirmacoes fundamentais.

### Step 2: Mapear Tensoes do Mercado
Quais tensoes existem entre o que a audiencia quer e o que o mercado oferece? Onde a marca pode ser a ponte? Tensoes geram Big Ideas fortes — elas criam relevancia emocional.

### Step 3: Formular Candidatas
Gerar 3-5 Big Ideas candidatas. Cada uma deve ser: (1) Uma frase de 10-15 palavras, (2) Provocativa mas alinhada com a marca, (3) Desdobravel em centenas de pecas, (4) Diferenciada dos concorrentes, (5) Ressonante com a audiencia-alvo.

### Step 4: Stress-Test das Candidatas
Para cada Big Idea: (1) Gera pelo menos 20 ideias de conteudo em 5 minutos? (2) Funciona em todos os formatos (post, video, blog, newsletter)? (3) Sobrevive a mudancas de trend? (4) E defensavel (concorrente nao pode copiar facilmente)? (5) Conecta com objetivos de negocio? A que responder SIM a todas e a vencedora.

### Step 5: Definir Narrativa-Mestre
Expandir a Big Idea vencedora em narrativa-mestre: quem e o heroi (audiencia), qual e o desafio, como a marca ajuda, qual e a transformacao prometida. Referencia: StoryBrand de Donald Miller.

### Step 6: Documentar Territorios Tematicos
Da Big Idea, derivar 4-6 territorios tematicos que serao a base dos pilares editoriais. Cada territorio e um "espaco narrativo" que a marca reivindica.

### Step 7: Handoff

```yaml
handoff:
  artifact: "big-idea-{client}.md"
  context: "Big Idea definida: '{big_idea}', {N} territorios tematicos, narrativa-mestre completa"
  next: "define-editorial-pillars para estruturar pilares a partir dos territorios"
```
