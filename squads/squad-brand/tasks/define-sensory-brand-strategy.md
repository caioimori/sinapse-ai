---
task: define-sensory-brand-strategy
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

# Task: Define Multi-Sensory Brand Strategy

> Projetar experiência de marca nos 5 sentidos para criar conexão sensorial completa.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-culture-architect (Ethos) |
| **Co-agents** | brand-identity-designer (Iris) visual, brand-sonic-designer (Echo) auditivo |
| **Trigger** | Após Identity Prism definido, para marcas com touchpoints físicos |
| **Input** | Identity Prism (faceta Physique), arquétipo, touchpoints mapeados |
| **Output** | `sensory-brand-strategy.md` |
| **Handoff** | → brand-compiler (Atlas) para inclusão no brandbook |
| **Referências** | Martin Lindstrom "Brand Sense", Aradhna Krishna "Sensory Marketing" |

---

## Fundamentação

Martin Lindstrom demonstrou que marcas que ativam 4-5 sentidos têm brand engagement até 70% superior vs marcas que ativam apenas 1-2 sentidos. Singapore Airlines, Apple, Aesop, Abercrombie, BMW — todas têm estratégia sensorial projetada.

```
        VISÃO (70% da percepção)
           ↑
  TATO ← MARCA → AUDIÇÃO
           ↓
     OLFATO   PALADAR
```

---

## Steps

### Step 1: Avaliar Aplicabilidade Sensorial
Nem toda marca precisa dos 5 sentidos. Avaliar relevância:

| Sentido | Relevância para esta Marca | Touchpoints Aplicáveis | Prioridade |
|---------|---------------------------|----------------------|-----------|
| Visual | Sempre alta (100%) | Todos os materiais | Obrigatório |
| Auditivo | Alta para digital + experiencial | App, vídeo, loja, telefone | Alta |
| Tátil | Alta para produto físico + print | Embalagem, cartão, materiais | Média-Alta |
| Olfativo | Alta para retail + hospitality | Loja, evento, embalagem, produto | Condicional |
| Gustativo | Alta para F&B, hospitality | Produto, evento, experiência | Condicional |

**Regra:** Mínimo 3 sentidos projetados. Visual e auditivo são obrigatórios. Tátil recomendado para qualquer marca com touchpoints físicos.

### Step 2: Mapear Personalidade → Sentidos
Baseado no arquétipo e no Identity Prism (Physique):

**Mapeamento por Arquétipo:**
| Arquétipo | Visual | Auditivo | Tátil | Olfativo | Gustativo |
|-----------|--------|----------|-------|----------|-----------|
| Inocente | Claro, clean | Suave, acústico | Macio, liso | Fresco, floral leve | Doce, leve |
| Explorador | Natural, texturas | Orgânico, drums | Rugoso, natural | Terra, madeira, ar | Amargo, especiado |
| Sábio | Estruturado, minimal | Piano, ambient | Papel, couro | Cedro, sândalo | Chá, café premium |
| Herói | Bold, alto contraste | Percussivo, power | Firme, metálico | Couro, metalizado | Forte, intenso |
| Fora-da-lei | Dark, grunge | Distorção, bass | Áspero, industrial | Fumaça, couro cru | Whisky, amargo |
| Mago | Etéreo, surreal | Synths, chimes | Glass, smooth | Incenso, oud | Exótico, inesperado |
| Cara Comum | Familiar, quente | Acústico, handclaps | Confortável, têxtil | Café, pão, vanilla | Comfort food |
| Amante | Luxuoso, close-up | Sensual, jazz | Seda, veludo | Rosa, jasmin, musk | Chocolate, vinho |
| Bobo | Colorido, pop | Playful, upbeat | Bouncy, borracha | Frutas, doces | Doces, chiclete |
| Cuidador | Suave, quente | Lullaby, gentle | Felpudo, quente | Lavanda, bebê | Mel, camomila |
| Criador | Eclético, craft | Variedade, textura | Artesanal, madeira | Tinta, papel, cola | Artesanal |
| Governante | Simétrico, grandioso | Orchestra, brass | Mármore, metal polido | Madeira nobre, couro | Champagne, caviar |

### Step 3: Definir Estratégia Visual (Iris confirma)
Já coberto por Iris — apenas validar alinhamento com estratégia sensorial global:
- [ ] Paleta de cores evoca o sentimento correto
- [ ] Texturas visuais são coerentes com tátil
- [ ] Fotografias comunicam atmosfera sensorial

### Step 4: Definir Estratégia Auditiva (Echo confirma)
Já coberto por Echo — validar alinhamento:
- [ ] Audio logo coerente com personalidade sensorial
- [ ] UI sounds alinhados com a experiência tátil
- [ ] Audio beds evocam o ambiente sensorial completo

### Step 5: Definir Estratégia Tátil
Para touchpoints físicos:

| Touchpoint | Material/Textura | Peso/Densidade | Acabamento | Sensação Desejada |
|-----------|-----------------|----------------|-----------|-------------------|
| Business card | {papel: tipo, gramatura} | {g/m²} | {fosco/brilho/soft-touch/relevo} | {ex: premium, substancial} |
| Embalagem | {material} | {espessura} | {laminação, UV, foil} | {ex: luxuoso, unboxing ritual} |
| Produto | {material principal} | {peso} | {textura} | {ex: satisfação tátil} |
| Materiais impressos | {papel} | {gramatura} | {acabamento} | {ex: qualidade perceptível} |

**Guidelines táteis universais:**
- Gramatura mínima para business cards: {g/m²}
- Acabamento padrão: {fosco/soft-touch/etc}
- Proibido: {materiais que contradizem a marca}

### Step 6: Definir Estratégia Olfativa (se aplicável)
```yaml
elicit: true
format: questionnaire
```

| Pergunta | Resposta |
|----------|---------|
| A marca tem touchpoints onde cheiro é relevante? (loja, evento, produto) | |
| Que sentimento o cheiro deve evocar? | |
| 3 referências olfativas que combinam com a marca | |

**Se aplicável, definir:**

| Elemento | Descrição |
|----------|-----------|
| Signature scent | Fragrância principal da marca |
| Notas de topo | Primeira impressão (5-15 min) |
| Notas de coração | Identidade (15 min - 2h) |
| Notas de base | Persistência (2h+) |
| Intensidade | Leve / Moderado / Intenso |
| Aplicação | Difusor em loja, embalagem, produto |
| Fornecedor sugerido | {empresa de scent marketing} |
| DON'T | Fragrâncias que contradizem a marca |

**Exemplos de referência:**
- Singapore Airlines: "Stefan Floridian Waters" (rosa, lavanda, cítrico)
- Abercrombie & Fitch: "Fierce" (cologne na loja)
- Le Labo: Fragrância específica por cidade (Santal 33 NYC)
- Apple: Cheiro de produto novo ("new Apple smell" é projetado)

### Step 7: Definir Estratégia Gustativa (se aplicável)
Para marcas de F&B ou hospitality:

| Elemento | Descrição |
|----------|-----------|
| Flavor profile | Perfil de sabor da marca (doce, ácido, umami, etc) |
| Temperatura | Frio / morno / quente |
| Textura oral | Cremoso / crocante / líquido / airy |
| Ritual | Como o consumo acontece |
| Pairing | Com o que combina |

### Step 8: Criar Mapa Sensorial Unificado
Documento final com todos os sentidos integrados:

```
┌────────────────────────────────────────────┐
│         MAPA SENSORIAL — {brand_name}       │
├────────┬───────────────────────────────────┤
│ VISÃO  │ {cores, formas, texturas visuais} │
├────────┼───────────────────────────────────┤
│ AUDIÇÃO│ {sons, música, voz, silêncio}     │
├────────┼───────────────────────────────────┤
│ TATO   │ {materiais, pesos, acabamentos}   │
├────────┼───────────────────────────────────┤
│ OLFATO │ {fragrância ou N/A com justif.}   │
├────────┼───────────────────────────────────┤
│PALADAR │ {perfil ou N/A com justif.}       │
├────────┼───────────────────────────────────┤
│SINESTESIA│ {conexões cross-sensoriais}      │
│        │ ex: "azul da marca soa como piano"│
└────────┴───────────────────────────────────┘
```

### Step 9: Handoff
```yaml
handoff:
  to: brand-compiler (Atlas)
  artifact: sensory-brand-strategy.md
  context: "Mapa sensorial completo com 3-5 sentidos projetados"
  also_to:
    - brand-identity-designer (Iris): "Validar visual com mapa sensorial"
    - brand-sonic-designer (Echo): "Validar audio com mapa sensorial"
    - brand-collateral-designer (Vellum): "Aplicar specs táteis em colaterais"
```
