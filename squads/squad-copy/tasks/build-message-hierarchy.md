---
task: build-message-hierarchy
responsavel: "@copy-strategist"
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

# Task: Build Message Hierarchy

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-strategist (Quill)
- **Complexity:** STANDARD
- **Depends on:** dados de audiencia, brand positioning
- **Feeds:** todos os writers, campaign planning

## Objetivo
Construir hierarquia de mensagens que define O QUE comunicar e em que ORDEM — do One Big Idea ate proof points especificos.

## Entrada
- Brand positioning (brand-system)
- Audience insights (research-intelligence)
- Product/service features e beneficios
- Competitive context

## Passos

### 1. Definir One Big Idea
- A unica coisa que queremos que a audiencia LEMBRE
- Formato: "[Marca] e a unica [categoria] que [diferencial] para [audiencia] que quer [outcome]"
- Teste: Se so pudesse dizer UMA coisa, seria esta?
- Deve ser: memoravel, diferenciada, verdadeira, relevante

### 2. Desdobrar em Key Messages (3-5)
Cada key message suporta o One Big Idea:
- **Message 1 (Primary Benefit):** O beneficio mais importante
- **Message 2 (Proof/Credibility):** Por que acreditar
- **Message 3 (Differentiation):** Por que nos e nao eles
- **Message 4 (Emotional Connection):** Como isso FAZ sentir
- **Message 5 (Risk Mitigation):** Por que e seguro escolher

### 3. Proof Points por Message
Para cada key message, 2-3 proof points:
- **Dados:** Numeros, estatisticas, resultados
- **Testimonials:** Depoimentos de clientes
- **Awards/Recognition:** Premios, certificacoes
- **Case Studies:** Historias de sucesso
- **Authority:** Experts, partnerships, media

### 4. Feature-Benefit-Outcome Mapping
Para cada feature do produto:
- **Feature:** O que e (tecnico)
- **Benefit:** O que FAZ pelo cliente (pratico)
- **Outcome:** Como muda a VIDA do cliente (emocional)
- Exemplo: Feature="AI-powered analytics" → Benefit="Decisoes 3x mais rapidas" → Outcome="Confianca nas decisoes, menos stress"

### 5. Hierarchy Visual
```
ONE BIG IDEA
├── Key Message 1 (Primary Benefit)
│   ├── Proof Point 1.1
│   ├── Proof Point 1.2
│   └── Feature → Benefit → Outcome
├── Key Message 2 (Credibility)
│   ├── Proof Point 2.1
│   └── Proof Point 2.2
├── Key Message 3 (Differentiation)
│   ├── Proof Point 3.1
│   └── Feature → Benefit → Outcome
└── Key Messages 4-5...
```

## Saida
- One Big Idea articulada
- 3-5 Key Messages com proof points
- Feature-Benefit-Outcome mapping completo
- Hierarchy visual documentada

## Validacao
- [ ] One Big Idea e memoravel e diferenciada
- [ ] Key messages suportam o OBI
- [ ] Cada message tem 2+ proof points
- [ ] Feature → Benefit → Outcome mapeado
- [ ] Hierarchy e MECE (nao overlap, sem gap)

---

*Task operada por: copy-strategist (Quill)*
