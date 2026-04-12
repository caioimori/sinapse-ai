---
task: define-growth-strategy
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

# Task: Define Brand Growth Strategy

> Definir estratégia de crescimento de marca baseada em evidence-based branding.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-growth-strategist (Catalyst) |
| **Trigger** | Após estratégia de marca definida (post-Athena) |
| **Input** | Posicionamento, personas, landscape competitivo |
| **Output** | `brand-growth-strategy.md` |
| **Handoff** | → brand-orqx (Meridian) |

---

## Steps

### Step 1: Audit Against Sharp's 7 Rules
Para cada regra, avaliar 0-5:

| # | Regra | Score | Gap | Ação |
|---|-------|-------|-----|------|
| 1 | Alcance contínuo (inclusive light buyers) | | | |
| 2 | Facilidade de compra (mental + physical availability) | | | |
| 3 | Ser notado (distinctive assets) | | | |
| 4 | Refrescar memory structures | | | |
| 5 | Criar e usar distinctive brand assets | | | |
| 6 | Consistência com frescor | | | |
| 7 | Manter competitividade | | | |
| **Total** | | **/35** | | |

Threshold: ≥25 = forte, 18-24 = adequado, <18 = gaps críticos

### Step 2: Map Category Entry Points (CEPs)
Listar todos os momentos em que consumidor pensa na categoria:

| CEP | Volume | Marca Presente? | Concorrente Dominante | Prioridade |
|-----|--------|----------------|----------------------|-----------|
| {momento 1} | Alto/Médio/Baixo | Sim/Não | {quem} | Alta/Média/Baixa |
| {momento 2} | | | | |
| {momento 3} | | | | |

Priorizar CEPs por: Volume × Viabilidade × Ausência de concorrente

### Step 3: Inventory Distinctive Brand Assets
Avaliar cada asset por distinctiveness (0-100):

| Asset | Tipo | Distinctiveness | Fame | Uniqueness | Status |
|-------|------|----------------|------|-----------|--------|
| Logo | Visual | /100 | /50 | /50 | Proprietário? |
| Cor primária | Visual | /100 | | | Proprietária? |
| Tipografia | Visual | /100 | | | Proprietária? |
| Forma/símbolo | Visual | /100 | | | Proprietário? |
| Audio logo | Sonoro | /100 | | | Proprietário? |
| Slogan/tagline | Verbal | /100 | | | Proprietário? |
| Personagem | Visual | /100 | | | Proprietário? |
| Packaging | Visual | /100 | | | Proprietário? |

Assets com Distinctiveness ≥70 = forte. <50 = investir.

### Step 4: Craft Onlyness Statement (Neumeier)
```
Nosso [OFERECIMENTO] é o único [CATEGORIA]
que [BENEFÍCIO ÚNICO]
para [PÚBLICO-ALVO]
em [CONTEXTO/ERA]
porque [RAZÃO/PROVA].
```

Validar:
- [ ] É verdadeiro? (verificável)
- [ ] É relevante? (público se importa)
- [ ] É sustentável? (será verdade em 5 anos)
- [ ] É único? (nenhum concorrente pode dizer o mesmo)
- [ ] É claro? (qualquer pessoa entende em 10 segundos)

### Step 5: Define Growth Levers
Selecionar e priorizar alavancas de crescimento:

| Lever | Potencial | Esforço | Timeline | Prioridade |
|-------|-----------|---------|----------|-----------|
| Penetração (novos clientes) | | | | |
| Frequência (clientes existentes) | | | | |
| Brand extension (novos produtos) | | | | |
| Market expansion (novas geografias) | | | | |
| DTC / Digital channels | | | | |
| Community building | | | | |
| Partnerships / Co-branding | | | | |
| Content / Thought leadership | | | | |

### Step 6: Create Growth Roadmap
```yaml
short_term: # 0-6 meses
  - action: "{ação 1}"
    lever: "{lever}"
    kpi: "{métrica}"
    target: "{meta}"
  - action: "{ação 2}"

medium_term: # 6-18 meses
  - action: "{ação 1}"
  - action: "{ação 2}"

long_term: # 18-36 meses
  - action: "{ação 1}"
  - action: "{ação 2}"
```

### Step 7: Define Brand KPIs
| Categoria | KPI | Baseline | Target 6m | Target 12m |
|-----------|-----|----------|-----------|-----------|
| Awareness | Aided recall | | | |
| Awareness | Social followers | | | |
| Consideration | Website traffic | | | |
| Consideration | Search volume (brand) | | | |
| Conversion | CAC | | | |
| Loyalty | NPS | | | |
| Loyalty | Retention rate | | | |
| Advocacy | Referral rate | | | |

### Step 8: Handoff
```yaml
handoff:
  to: brand-orqx (Meridian)
  artifact: brand-growth-strategy.md
  context: "Growth strategy com roadmap, KPIs e prioridades definidas"
  next: "Integrar no plano geral de execução do projeto"
```
