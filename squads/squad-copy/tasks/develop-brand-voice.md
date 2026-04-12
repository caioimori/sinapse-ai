---
task: develop-brand-voice
responsavel: "@brand-voice-writer"
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

# Task: Develop Brand Voice

## Metadata
- **Squad:** squad-copy
- **Agent:** brand-voice-writer (Tone)
- **Complexity:** COMPLEX
- **Depends on:** brand positioning, audiencia, valores da marca
- **Feeds:** todos os writers do squad, squad-brand-identity

## Objetivo
Desenvolver brand voice completa — a personalidade verbal que torna a marca reconhecivel em qualquer canal, formato ou contexto. A voice e o DNA verbal da marca.

## Entrada
- Brand positioning (missao, visao, valores)
- Audiencia core (quem sao, como falam)
- Competitor voices (para diferenciacao)
- Exemplos de copy existente (se houver)

## Passos

### 1. Definir Voice Attributes (3-5 Dimensoes)
**Framework de Voice Dimensions:**
Escolher 3-5 atributos que definem COMO a marca fala.

**Mapa de atributos (escolher 1 de cada par ou posicionar no espectro):**
| Dimensao | ←— Polo A | Espectro | Polo B —→ |
|----------|-----------|:--------:|-----------|
| Formalidade | Casual | ◆◇◇◇◇ | Formal |
| Energia | Calma | ◇◇◇◆◇ | Energetica |
| Humor | Serio | ◇◇◆◇◇ | Divertido |
| Autoridade | Amigavel | ◇◆◇◇◇ | Autoritario |
| Complexidade | Simples | ◆◇◇◇◇ | Sofisticado |
| Emocao | Racional | ◇◇◇◆◇ | Emocional |
| Atitude | Convencional | ◇◇◇◇◆ | Rebelde |
| Proximidade | Institucional | ◆◇◇◇◇ | Pessoal |

**Formato de definicao (por atributo):**
```
ATRIBUTO: Acessivel
  O que significa: Falamos de forma que qualquer pessoa entende,
                   independente do nivel tecnico
  Soa como: "Vamos simplificar isso" / "Na pratica, funciona assim"
  NAO soa como: "Alavancando sinergias cross-funcionais" / "De modo holístico"
  Exemplos:
    ✅ "Conecte seu email em 2 cliques"
    ❌ "Integre seu provedor de email via API REST"
```

### 2. Criar This/Not That Guide
**Para cada atributo, definir fronteiras claras:**

| Nos SOMOS | Nos NAO SOMOS |
|-----------|---------------|
| Confiantes | Arrogantes |
| Divertidos | Palhacos |
| Diretos | Rudes |
| Inteligentes | Pedantes |
| Calorosos | Grudentos |
| Ousados | Irresponsaveis |
| Simples | Simplistas |
| Profissionais | Corporativos |

### 3. Definir Vocabulario da Marca
**Palavras que usamos (always words):**
- [Lista de 10-20 palavras/expressoes que SIM]
- Ex: "Equipe" (nao "recursos humanos"), "parceiro" (nao "vendor")

**Palavras que evitamos (never words):**
- [Lista de 10-20 palavras/expressoes que NAO]
- Ex: Nunca "revolucionario", nunca "lider de mercado"

**Expressoes assinatura:**
- [3-5 frases que so a marca usaria]
- Ex: Mailchimp: "High fives!" / Slack: "Where work happens"

### 4. Voice Archetype
**Escolher arquetipo de voz (baseado em Jung adaptado):**
| Arquetipo | Tom | Marcas Exemplo |
|-----------|-----|----------------|
| Sage | Inteligente, educativo | Google, TED |
| Explorer | Aventureiro, livre | Patagonia, Jeep |
| Creator | Inovador, inspiracional | Apple, Adobe |
| Ruler | Autoritativo, premium | Mercedes, Rolex |
| Caregiver | Empatico, nurturing | Johnson&Johnson |
| Jester | Divertido, irreverente | Old Spice, Dollar Shave |
| Hero | Corajoso, empoderador | Nike, FedEx |
| Rebel | Disruptivo, ousado | Harley, Diesel |
| Everyman | Acessivel, autentico | IKEA, Target |
| Lover | Sensual, emocional | Chanel, Godiva |
| Magician | Transformador, visionario | Disney, Tesla |
| Innocent | Otimista, puro | Coca-Cola, Dove |

**Mistura:** Tipicamente 1 primario + 1 secundario.
Ex: "Sage com toque de Jester" = Inteligente mas com humor

### 5. Documentar Voice Guidelines
**Documento final inclui:**
1. Voice summary (2-3 frases)
2. Voice attributes (3-5 com definicoes)
3. This/Not That table
4. Vocabulario (always/never)
5. Expressoes assinatura
6. Arquetipo de voz
7. Exemplos de copy por canal (ver task: write-voice-examples-by-channel)
8. Anti-exemplos (como NAO soar)

## Cross-Squad Handoff
```yaml
handoffs:
  - to: todos os writers do squad
    delivers: Brand voice guidelines como referencia
    format: Documento completo de voice
  - to: squad-brand-identity
    delivers: Voice para alinhamento com visual identity
    format: Voice summary + atributos + arquetipo
```

## Saida
- Brand voice document completo
- Voice attributes com definicoes e exemplos
- This/Not That guide
- Vocabulario (always/never lists)
- Voice archetype definido

## Validacao
- [ ] 3-5 voice attributes definidos com exemplos
- [ ] This/Not That claro (fronteiras)
- [ ] Vocabulario always/never com min 10 itens cada
- [ ] Voice archetype selecionado e justificado
- [ ] Expressoes assinatura criadas (3-5)
- [ ] Teste do competitor: voice e distinguivel?
- [ ] Teste da pessoa: alguem descreveria a marca com esses atributos?
- [ ] Anti-exemplos incluidos

---

*Task operada por: brand-voice-writer (Tone)*
