---
task: map-category-entry-points
responsavel: "@brand-growth-strategist"
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

# Task: Map Category Entry Points

> Mapear todos os momentos em que consumidores pensam na categoria da marca.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-growth-strategist (Catalyst) |
| **Trigger** | Após personas e landscape competitivo definidos |
| **Input** | Personas, competitive landscape, dados de mercado |
| **Output** | `category-entry-points-map.md` |
| **Handoff** | → brand-strategist (Athena) para integração na message house |

---

## Steps

### Step 1: Identificar CEPs
Listar TODOS os momentos/situações em que alguém pensa na categoria:

**Framework de Identificação:**
- **Quando?** (momentos do dia, estações, eventos)
- **Onde?** (locais físicos, contextos digitais)
- **Com quem?** (sozinho, família, trabalho, amigos)
- **Por quê?** (necessidade funcional, emocional, social)
- **Como?** (urgente vs planejado, racional vs impulso)

### Step 2: Avaliar CEPs
| CEP | Quando | Onde | Motivação | Volume | Marca Presente? | Dominante | Oportunidade |
|-----|--------|------|-----------|--------|----------------|-----------|-------------|
| | | | | Alto/Med/Bai | Sim/Não/Parcial | Quem? | Alta/Med/Bai |

### Step 3: Priorizar
Matriz de priorização:
```
Volume × Viabilidade × (1 - Competitividade)
```
- Volume: quanto daquele CEP acontece
- Viabilidade: capacidade da marca de se posicionar ali
- Competitividade inversa: menos competição = mais oportunidade

### Step 4: Definir Estratégia por CEP
Para os top 5-8 CEPs prioritários:
1. **Mensagem** — O que comunicar nesse momento
2. **Canal** — Onde estar presente
3. **Asset** — Qual distinctive asset ativar
4. **Frequência** — Com que constância
5. **Métrica** — Como medir presença

### Step 5: Handoff
```yaml
handoff:
  to: brand-strategist (Athena)
  artifact: category-entry-points-map.md
  context: "CEPs mapeados e priorizados com estratégia por ponto"
  next: "Integrar na message house e social voice strategy"
```
