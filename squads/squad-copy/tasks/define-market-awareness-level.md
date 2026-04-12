---
task: define-market-awareness-level
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

# Task: Define Market Awareness Level

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-strategist (Quill)
- **Complexity:** STANDARD
- **Depends on:** dados de audiencia (research-intelligence)
- **Feeds:** todos os copy briefs, todos os writers

## Objetivo
Classificar o nivel de consciencia de mercado da audiencia usando os 5 niveis de Eugene Schwartz — isso determina COMPLETAMENTE a abordagem do copy.

## Entrada
- Dados de audiencia (personas, JTBD, journey stage)
- Canal/contexto onde o copy sera apresentado
- Produto/servico sendo comunicado

## Passos

### 1. Diagnosticar Nivel de Consciencia

**Level 1: UNAWARE** — Nao sabe que tem problema
- Sinais: Nao busca solucoes, nao reconhece sintomas
- Copy approach: STORYTELLING. Educar sobre o problema. "Voce sabia que...?"
- Lead type: Indirect (historia, analogia, revelacao)
- Copy length: Longo — precisa construir awareness

**Level 2: PROBLEM AWARE** — Sabe que tem problema, nao conhece solucoes
- Sinais: Pesquisa o problema, nao os produtos
- Copy approach: AGITATION + SOLUTION TEASE. Amplificar dor, mostrar que solucao existe
- Lead type: Problem-focused. "Cansado de [problema]?"
- Copy length: Medio-longo

**Level 3: SOLUTION AWARE** — Sabe que solucoes existem, nao conhece SEU produto
- Sinais: Compara categorias, pesquisa opcoes
- Copy approach: DIFERENCIACAO. Por que SUA solucao e melhor
- Lead type: Solution-focused. "The [adjective] way to [benefit]"
- Copy length: Medio

**Level 4: PRODUCT AWARE** — Conhece seu produto, nao comprou ainda
- Sinais: Visitou site, baixou material, esta considerando
- Copy approach: OFFER + PROOF. Testimonials, case studies, garantia, urgencia
- Lead type: Offer-focused. "Ate [data], ganhe [bonus]"
- Copy length: Curto-medio

**Level 5: MOST AWARE** — Conhece, confia, so precisa do empurrao final
- Sinais: Retornou ao site, items no carrinho, engajamento alto
- Copy approach: DEAL + CTA DIRETO. Oferta clara, facilitar acao
- Lead type: Direct. "Assine agora e economize 30%"
- Copy length: Curto

### 2. Mapear Awareness por Canal
- **Search (Google):** Problem Aware (pesquisam o problema) ou Product Aware (pesquisam o produto)
- **Social organic:** Unaware → Problem Aware (descoberta)
- **Social ads:** Problem Aware → Solution Aware (interrupcao)
- **Email list:** Product Aware → Most Aware (nurturing)
- **Retargeting:** Product Aware → Most Aware (re-engagement)
- **Referral:** Product Aware (ja ouviu de alguem)

### 3. Definir Copy Strategy por Level

| Level | Lead Type | Headline Style | Body Focus | CTA Style |
|-------|----------|---------------|------------|-----------|
| Unaware | Story/analogy | Curiosity | Education | Soft (learn more) |
| Problem Aware | Problem | "Tired of X?" | Agitation | Medium (discover) |
| Solution Aware | Solution | "Better way to X" | Differentiation | Medium (see how) |
| Product Aware | Offer | "Get X with Y" | Proof + offer | Strong (start now) |
| Most Aware | Deal | "Save X% today" | Deal terms | Direct (buy now) |

### 4. Documentar para Brief
- Level classificado com justificativa
- Copy approach recomendado
- Lead type definido
- Headline direction sugerida
- References: exemplos de copy para este level

## Saida
- Market awareness level classificado
- Copy approach definido
- Lead type e headline direction
- Canal × awareness mapping

## Validacao
- [ ] Level classificado com evidencia (nao suposicao)
- [ ] Copy approach alinhado com o level
- [ ] Lead type definido
- [ ] Mapping por canal documentado

---

*Task operada por: copy-strategist (Quill)*
