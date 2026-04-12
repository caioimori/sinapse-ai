---
task: create-creator-toolkit
responsavel: "@brand-creative-engineer"
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

# Task: Create Creator & Influencer Brand Toolkit

> Criar toolkit para criadores de conteúdo, influenciadores e parceiros manterem consistência de marca.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-creative-engineer (Forge) |
| **Co-agents** | brand-identity-designer (Iris) visual, brand-strategist (Athena) tom, brand-collateral-designer (Vellum) templates |
| **Trigger** | Quando marca trabalha com influenciadores, creators, UGC ou programas de embaixadores |
| **Input** | Brand guidelines, social voice, photography direction, templates existentes |
| **Output** | `creator-toolkit/` (docs + templates + assets) |
| **Handoff** | → brand-compiler (Atlas) para inclusão no delivery package |
| **Referências** | Creator Economy best practices, FTC Guidelines, CONAR, EU Digital Services Act |

---

## Fundamentação

O conteúdo de creators/influenciadores é frequentemente o touchpoint de maior reach e menor controle da marca. Um toolkit bem projetado resolve esse paradoxo: dá liberdade criativa DENTRO de guardrails que protegem a marca.

```
     SEM TOOLKIT           COM TOOLKIT
     ┌─────────┐          ┌─────────┐
     │ Off-brand│          │On-brand │
     │ content  │    →     │ content │
     │ sem      │          │com      │
     │ controle │          │liberdade│
     └─────────┘          └─────────┘
     Risco alto           Risco controlado
```

---

## Steps

### Step 1: Definir Níveis de Parceria
Cada nível recebe um toolkit diferente:

| Nível | Tipo | Controle da Marca | Toolkit | Aprovação |
|-------|------|-------------------|---------|-----------|
| **Tier 1: Embaixador** | Contrato longo prazo, exclusividade | Alto | Completo (full kit) | Brand Manager + Legal |
| **Tier 2: Creator parceiro** | Campanha específica, recorrente | Médio-Alto | Standard (kit + brief) | Brand Manager |
| **Tier 3: Influenciador** | Post único ou série curta | Médio | Light (1-pager + assets) | Marketing |
| **Tier 4: UGC** | Conteúdo espontâneo, incentivado | Baixo | Micro (DO/DON'T + logo) | Self-service |
| **Tier 5: Afiliado** | Link/código, sem criação | Mínimo | Asset pack (banners + links) | Automático |

### Step 2: Criar Kit de Marca para Creators

**Conteúdo do toolkit por tier:**

| Material | T1 | T2 | T3 | T4 | T5 |
|----------|----|----|----|----|------|
| Brand story (1 pager) | ✅ | ✅ | ✅ | ✅ | — |
| Visual DO/DON'T | ✅ | ✅ | ✅ | ✅ | — |
| Logo pack (formatos) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Paleta de cores (HEX) | ✅ | ✅ | ✅ | — | — |
| Fontes/alternativas | ✅ | ✅ | — | — | — |
| Templates editáveis | ✅ | ✅ | ✅ | — | ✅ |
| Moodboard de referência | ✅ | ✅ | ✅ | — | — |
| Tone of voice guide | ✅ | ✅ | — | — | — |
| Hashtag guide | ✅ | ✅ | ✅ | ✅ | — |
| Talking points | ✅ | ✅ | ✅ | — | — |
| Legal/disclosure guide | ✅ | ✅ | ✅ | ✅ | ✅ |
| Product info/specs | ✅ | ✅ | ✅ | — | — |
| Creative brief (campanha) | ✅ | ✅ | — | — | — |
| Performance guidelines | ✅ | — | — | — | — |
| Banner/asset pack | — | — | — | — | ✅ |

### Step 3: Criar 1-Pager de Brand Story para Creators

```markdown
# {MARCA} — Creator Brand Guide

## Quem Somos
{2-3 frases: propósito, personalidade, diferencial}

## Nossa Personalidade
{5 adjetivos + descrição de 1 linha cada}

## Tom de Voz
**Somos:** {3 adjetivos}
**Não somos:** {3 adjetivos}

## Hashtags Oficiais
- Principal: #{marca}
- Campanha: #{campanha}
- Parceria: #{marca}partner ou #publi{marca}

## Visual Quick Guide
- Cores: {swatches com HEX}
- Nosso estilo de foto: {3 bullets}
- Evitar: {3 bullets}

## DO ✅
- Ser autêntico — use sua voz
- Mostrar o produto em contexto real
- Seguir disclosure guidelines (#ad #publi)

## DON'T ❌
- Alterar o logo
- Usar cores que não são da paleta
- Fazer claims não aprovados
- Falar de concorrentes

## Contato
Brand Manager: {email}
Aprovações: {email/link}
Assets: {link para DAM/Drive}
```

### Step 4: Definir Photography Guidelines para Creators

| Aspecto | Guideline | Exemplo |
|---------|----------|---------|
| **Iluminação** | {natural/estúdio/específica} | Preferir luz natural, golden hour |
| **Composição** | {regras básicas} | Regra dos terços, produto centrado |
| **Background** | {clean/lifestyle/específico} | Fundos limpos ou em contexto de uso |
| **Cores dominantes** | {dentro da paleta} | Evitar cores que conflitem com a marca |
| **Produto** | {como mostrar} | Rótulo visível, produto em destaque |
| **Pessoa** | {guidelines de representação} | Autêntico, diverso, natural |
| **Edição/Filtros** | {permitidos/proibidos} | Filtros leves OK, sem distorção de cor |
| **Resolução mínima** | {px} | 1080×1080 mínimo, 4K para vídeo |

**Moodboard de referência:** Incluir 9-12 fotos que exemplificam o estilo desejado.

### Step 5: Definir Compliance e Disclosure

**Guidelines legais por mercado:**

| Mercado | Regulação | Disclosure Obrigatória | Formato |
|---------|-----------|----------------------|---------|
| **Brasil** | CONAR + CDC | "#publi" ou "publicidade" | Visível, início do post |
| **EUA** | FTC Guidelines | "#ad" ou "Paid partnership" | Clear and conspicuous |
| **EU** | UCPD + national | "#ad" + tag de parceria | Visível, idioma local |
| **UK** | ASA/CAP | "#ad" | Top of caption |

**Regras universais:**
- [ ] Disclosure SEMPRE presente em conteúdo pago
- [ ] Disclosure ANTES do "leia mais" / fold
- [ ] Disclosure em linguagem clara (não abreviações obscuras)
- [ ] Stories: tag de "parceria paga" do Instagram/TikTok
- [ ] Vídeo: disclosure verbal nos primeiros 30 segundos
- [ ] Claims sobre o produto DEVEM ser verificáveis
- [ ] Resultados pessoais DEVEM ter disclaimer "resultados individuais podem variar"

### Step 6: Criar Template de Creative Brief

```markdown
## Creative Brief — {Nome da Campanha}

### Objetivo
{O que queremos alcançar com esta parceria}

### Mensagem-chave
{1-2 frases que DEVEM ser comunicadas}

### Deliverables
| Peça | Formato | Plataforma | Prazo |
|------|---------|-----------|-------|
| {Post feed} | {1080×1080, JPG} | {Instagram} | {data} |
| {Reels/TikTok} | {1080×1920, MP4, 30-60s} | {IG/TT} | {data} |
| {Stories} | {1080×1920, 3 frames} | {Instagram} | {data} |

### Talking Points (DEVE mencionar)
1. {ponto 1}
2. {ponto 2}
3. {ponto 3}

### NÃO mencionar
1. {restrição 1}
2. {restrição 2}

### Hashtags obrigatórias
{#hashtag1} {#hashtag2} {#publi ou #ad}

### Produto/Link
- Produto: {nome + link}
- UTM: {link com tracking}
- Código de desconto: {código} (se aplicável)

### Processo de Aprovação
1. Creator envia draft em {prazo}
2. Brand review em {SLA, ex: 48h}
3. Ajustes (se necessário) em {prazo}
4. Publicação em {data/janela}

### Contato
{Nome do Brand Manager} — {email} — {telefone}
```

### Step 7: Definir Processo de Aprovação

| Etapa | Responsável | SLA | Ferramenta |
|-------|------------|-----|-----------|
| Briefing | Brand Manager → Creator | D-14 | Email/plataforma |
| Draft | Creator → Brand Manager | D-7 | Link do draft |
| Review | Brand Manager | 48h úteis | Comentários inline |
| Revisão | Creator | 24h | Atualização |
| Aprovação final | Brand Manager | 24h | Aprovação formal |
| Publicação | Creator | Janela aprovada | Plataforma |
| Report | Creator → Brand Manager | D+7 | Métricas |

**Critérios de aprovação:**
- [ ] Disclosure presente e visível
- [ ] Talking points incluídos
- [ ] Visual alinhado com brand guidelines
- [ ] Nenhum item "NÃO mencionar" presente
- [ ] Hashtags corretas
- [ ] Link/UTM corretos
- [ ] Qualidade técnica (resolução, áudio, iluminação)
- [ ] Claims verificáveis

### Step 8: Definir Métricas de Performance

| Métrica | Target | Quem Mede |
|---------|--------|-----------|
| Brand consistency score | ≥85% | Brand audit |
| Engagement rate | ≥{benchmark do setor} | Analytics |
| Reach | {target por tier} | Analytics |
| Sentiment | ≥80% positivo | Social listening |
| Conversion (se aplicável) | {target} | UTM tracking |
| Content quality score | ≥4/5 | Brand review |
| Compliance rate | 100% | Legal review |
| UGC volume (T4) | {target mensal} | Social listening |

### Step 9: Handoff
```yaml
handoff:
  to: brand-compiler (Atlas)
  artifact: creator-toolkit/
  context: "Toolkit completo para creators com guidelines, templates, compliance e processo de aprovação"
  also_to:
    - brand-culture-architect (Ethos): "Integrar com programa de embaixadores"
    - brand-strategist (Athena): "Alinhamento com social voice e message house"
  next: "Atlas inclui no delivery package como Creator Toolkit separado"
```
