---
task: audit-distinctive-assets
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

# Task: Audit Distinctive Brand Assets

> Inventariar e avaliar assets distintivos da marca usando framework de Romaniuk.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-growth-strategist (Catalyst) |
| **Trigger** | Após identidade visual + sonic identity criadas |
| **Input** | Todos os brand assets criados |
| **Output** | `distinctive-assets-audit.md` |
| **Handoff** | → brand-auditor (Sentinel) |

---

## Steps

### Step 1: Inventariar Todos os Assets
Catalogar TODOS os elementos que podem ser distinctive assets:

**Visuais:**
- [ ] Logo (símbolo)
- [ ] Logo (wordmark)
- [ ] Cor primária
- [ ] Cor secundária
- [ ] Cor accent
- [ ] Tipografia display
- [ ] Forma/shape proprietária
- [ ] Pattern/textura
- [ ] Estilo de fotografia
- [ ] Estilo de ilustração
- [ ] Mascote/personagem (se existir)
- [ ] Packaging shape (se aplicável)

**Sonoros:**
- [ ] Audio logo
- [ ] UI sounds
- [ ] Voz (timbre, estilo)

**Verbais:**
- [ ] Nome da marca
- [ ] Tagline/slogan
- [ ] Tom de voz (estilo)
- [ ] Catchphrase/bordão

**Experienciais:**
- [ ] Ritual de marca (unboxing, experiência)
- [ ] Cheiro/aroma (se aplicável)
- [ ] Textura/tato (se aplicável)

### Step 2: Avaliar Distinctiveness
Para cada asset, avaliar 2 dimensões:

**Fame (0-50):** Quantas pessoas associam este asset à marca?
- 0-10: Desconhecido
- 11-25: Parcialmente reconhecido
- 26-40: Bem reconhecido
- 41-50: Universalmente reconhecido

**Uniqueness (0-50):** Este asset é exclusivo desta marca?
- 0-10: Genérico (muitas marcas usam similar)
- 11-25: Parcialmente único
- 26-40: Bastante único
- 41-50: Totalmente proprietário

**Distinctiveness Score = Fame + Uniqueness (0-100)**

### Step 3: Classificar Assets

| Score | Classificação | Ação |
|-------|--------------|------|
| 80-100 | Icon | Proteger e nunca mudar |
| 60-79 | Strong | Manter e reforçar |
| 40-59 | Developing | Investir para crescer |
| 20-39 | Weak | Decidir: investir ou substituir |
| 0-19 | Non-distinctive | Criar novo ou abandonar |

### Step 4: Mapeamento de Oportunidades
```
            ALTA UNIQUENESS
                |
   INVESTIR  |  PROTEGER
   (tornar   |  (brand icon,
    famoso)  |   nunca mudar)
  ___________|___________
             |
   ABANDONAR |  REFORÇAR
   (genérico,|  (famoso mas
    ineficaz) |   não único)
             |
            BAIXA UNIQUENESS
  BAIXA FAME ← → ALTA FAME
```

### Step 5: Recomendações
Para cada asset com score < 60:
1. **Problema:** Por que não é distintivo?
2. **Oportunidade:** Como tornar mais distintivo?
3. **Ação:** Investimento necessário
4. **Timeline:** Quando veremos resultado?
5. **Métrica:** Como medir melhoria?

### Step 6: Handoff
```yaml
handoff:
  to: brand-auditor (Sentinel)
  artifact: distinctive-assets-audit.md
  context: "Inventário completo de distinctive assets com scores e recomendações"
  next: "Validar scores e integrar no brand consistency score"
```
