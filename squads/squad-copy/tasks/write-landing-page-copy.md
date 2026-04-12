---
task: write-landing-page-copy
responsavel: "@conversion-writer"
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

# Task: Write Landing Page Copy

## Metadata
- **Squad:** squad-copy
- **Agent:** conversion-writer (Spark)
- **Complexity:** COMPLEX
- **Depends on:** copy brief, headlines aprovados, message hierarchy
- **Feeds:** persuasion-psychologist (Nudge), copy-editor (Chisel)

## Objetivo
Escrever copy de landing page que converte — cada secao estrategicamente posicionada para mover o visitante de "interessado" para "convencido" ate "convertido". A LP e uma sales letter visual.

## Entrada
- Copy brief com objetivo de conversao
- Headline e subheadlines aprovados
- Message hierarchy e proof points
- Oferta, pricing, garantia
- Awareness level da audiencia

## Passos

### 1. Definir Estrutura por Awareness Level
| Awareness | Sections | Comprimento |
|-----------|----------|-------------|
| Unaware | Story → Problem → Agitation → Solution → Proof → Offer → CTA | Longa (8-12 sections) |
| Problem Aware | Problem → Empathy → Solution → Mechanism → Proof → Offer → CTA | Media-Longa (7-10) |
| Solution Aware | Unique Mechanism → Benefits → Proof → Comparison → Offer → CTA | Media (6-8) |
| Product Aware | Offer → Benefits → Proof → Guarantee → CTA | Curta (5-7) |
| Most Aware | Offer → CTA → Guarantee | Muito Curta (3-5) |

### 2. Escrever Cada Secao

**HERO SECTION (above the fold):**
```
HEADLINE — Promessa principal
SUBHEADLINE — Expande com especificidade
HERO IMAGE/VIDEO — Visual que suporta a promessa
CTA PRINCIPAL — Acao clara
SOCIAL PROOF BAR — Logos, numeros, estrelas
```
**Regra:** Em 5 segundos o visitante deve entender: O que e, Para quem e, Qual o beneficio

**PROBLEM SECTION:**
- Articula a dor do visitante (melhor que ele faria)
- Use a linguagem DELES (de pesquisa, reviews, entrevistas)
- 3-5 pain points especificos
- "Se voce ja sentiu [X], voce nao esta sozinho"

**SOLUTION SECTION:**
- Apresenta a solucao (nao o produto ainda)
- Foca no MECANISMO — por que funciona
- Framework "Imagine se..." (future pacing)
- Transicao suave de problema para possibilidade

**BENEFITS SECTION:**
- 3-6 beneficios principais
- Formato: Icone + Headline + 1-2 linhas de copy
- Feature → Benefit → Outcome para cada item
- Organizar por importancia (mais impactante primeiro)

**SOCIAL PROOF SECTION:**
- Testimonials com nome, foto, cargo (especificos)
- Numeros de impacto ("10,000+ clientes", "4.9/5 estrelas")
- Logos de clientes/midia
- Case study snippets
- Variar tipos: texto, video, antes/depois

**HOW IT WORKS SECTION:**
- 3-4 steps simples
- Visual step-by-step
- Reduz perceived complexity
- "1. [Acao simples] → 2. [Acao simples] → 3. [Resultado]"

**OFFER SECTION:**
- O que recebe (product + bonuses)
- Valor percebido vs. preco
- Comparacao de planos (se aplicavel)
- Destaque no plano recomendado

**GUARANTEE SECTION:**
- Risk reversal forte e especifica
- "Se em [X] dias voce nao [resultado], devolvemos [Y]"
- Nome a garantia (brandear)
- Quanto mais forte, melhor

**FAQ SECTION:**
- 5-8 perguntas mais comuns
- Cada resposta desfaz uma objecao
- Respostas curtas e diretas
- Include CTA em respostas relevantes

**FINAL CTA SECTION:**
- Recapitula valor
- Urgencia (se real)
- CTA com copy action-oriented
- Alternativa menor (micro-commitment)

### 3. Otimizar CTAs
**Regras de CTA:**
- Especifico > Generico: "Comecar Meu Trial Gratis" > "Clique Aqui"
- Primeira pessoa: "Quero Meu Acesso" > "Obtenha Acesso"
- Reduzir fricção: "Sem cartao de credito" abaixo do botao
- Multiplos CTAs ao longo da pagina (min 3)
- CTA sticky header/footer em mobile

**Anti-CTA (friction reducers):**
- "Cancele quando quiser"
- "Setup em 2 minutos"
- "Sem compromisso"
- "Join 10,000+ [audiencia]"

### 4. Mobile-First Copy
- Paragrafos max 2-3 linhas (mobile)
- Subheadlines visiveis em scroll rapido
- CTA buttons com copy completa (nao abreviada)
- Testimonials colapsáveis
- Hero section funciona sem imagem

### 5. Checklist Pre-Launch
- [ ] Headline claro em 5 segundos
- [ ] CTA above the fold
- [ ] Zero jargao (teste com nao-cliente)
- [ ] Cada secao tem proposito persuasivo claro
- [ ] Social proof variado e especifico
- [ ] Garantia forte e visivel
- [ ] FAQ endereça top 5 objecoes
- [ ] Mobile-friendly copy
- [ ] Load time < 3 segundos
- [ ] Analytics/tracking configurado

## Cross-Squad Handoff
```yaml
handoffs:
  - to: persuasion-psychologist (Nudge)
    delivers: LP copy para review de persuasao
    format: Copy completa com intencao por secao
  - to: squad-design
    delivers: Copy para implementacao
    format: Copy por secao + especificacoes de CTA
```

## Saida
- Copy completa por secao da LP
- Wireframe copy (layout com copy posicionada)
- CTAs com copy e micro-copy
- FAQ section
- Mobile adaptations

## Validacao
- [ ] Estrutura alinhada com awareness level
- [ ] Hero section comunica proposta em 5 segundos
- [ ] Min 3 CTAs ao longo da pagina
- [ ] Social proof variado e especifico
- [ ] Garantia forte incluida
- [ ] FAQ endereça objecoes top
- [ ] Copy mobile-friendly
- [ ] Zero jargao tecnico desnecessario
- [ ] Cada secao tem funcao persuasiva clara
- [ ] Scanning test: subheadlines contam a historia

---

*Task operada por: conversion-writer (Spark)*
