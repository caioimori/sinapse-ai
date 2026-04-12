---
task: coordinate-cross-squad
responsavel: "@content-orqx"
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

# Task: Coordinate Cross-Squad

> Alinhar com outras squads (brand-system, research-intelligence, copywriting-persuasion, growth-analytics) para inputs e outputs.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-orqx (Nexus) |
| **Co-agents** | Agentes das squads parceiras |
| **Trigger** | Necessidade de input cross-squad ou entrega de output |
| **Input** | Necessidade identificada (brand guidelines, SEO data, copy optimization, etc.) |
| **Output** | Inputs recebidos e integrados ou outputs entregues |
| **Handoff** | → Agente interno que precisa do input |
| **Complexity** | medium |

---

## Fundamentacao

Conteudo nao existe no vacuo — depende de brand guidelines (brand-system), dados de SEO (growth-analytics), tecnicas de persuasao (copywriting-persuasion) e insights de audiencia (research-intelligence). Coordenacao cross-squad garante que conteudo seja alinhado com estrategia global, nao apenas com estrategia editorial. Sem isso, conteudo pode estar bem escrito mas desalinhado com marca ou mercado.

---

## Steps

### Step 1: Identificar Necessidade

Classificar o tipo de coordenacao:
- **Inbound:** preciso receber algo de outra squad (brand guidelines, SEO keywords, audience insights)
- **Outbound:** preciso entregar algo para outra squad (content for website, case studies, performance data)

### Step 2: Solicitar ou Entregar

- Inbound: solicitar com contexto claro (o que preciso, por que, quando)
- Outbound: entregar com contexto claro (o que estou entregando, como usar, restricoes)

### Step 3: Integrar Inputs

Se inbound: integrar no fluxo do agente que precisa (North recebe brand pillars, Arc recebe copy frameworks, Morph recebe SEO keywords)

### Step 4: Confirmar Alinhamento

Verificar que o input recebido foi corretamente aplicado e que o output entregue foi util para a squad destino.

### Step 5: Handoff

```yaml
handoff:
  artifact: "cross-squad-log-{date}.md"
  context: "Coordenacao cross-squad com {squad_name} concluida"
  next: "Agente interno que precisa do input recebido"
```
