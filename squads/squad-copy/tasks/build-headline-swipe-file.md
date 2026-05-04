---
task: build-headline-swipe-file
responsavel: "@headline-specialist"
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

# Task: Build Headline Swipe File

## Metadata
- **Squad:** squad-copy
- **Agent:** headline-specialist (Hook)
- **Complexity:** STANDARD
- **Depends on:** pesquisa de mercado, benchmarks
- **Feeds:** todos os writers do squad

## Objetivo
Construir e manter swipe file de headlines — colecao curada de headlines de alta performance por categoria, industria e pattern para referencia e inspiracao.

## Entrada
- Headlines de alta performance (proprios e de mercado)
- Benchmarks de industria
- Competitor copy (de research-intelligence/Hawk)

## Passos

### 1. Coletar Headlines de Alta Performance
**Fontes internas:**
- Emails com maior open rate
- Ads com maior CTR
- Posts com maior engagement
- Landing pages com maior conversion

**Fontes externas:**
- Swipe file classics (Ogilvy, Caples, Halbert, Sugarman)
- High-performing ads (Facebook Ad Library, Moat)
- Viral headlines (BuzzFeed, Upworthy patterns)
- Subject lines de alta performance (Really Good Emails)
- Competitor headlines

### 2. Catalogar por Categoria

| Categoria | Exemplo | Pattern |
|-----------|---------|---------|
| How-to | "How to Win Friends..." | How to [benefit] |
| Number | "7 Habits of Highly Effective..." | [N] [topic] |
| Question | "Do You Make These Mistakes?" | Do you [relatable mistake]? |
| Curiosity | "They Laughed When I Sat Down..." | [Setup that creates gap] |
| Testimonial | "I Doubled My Revenue in..." | [First-person result] |
| Warning | "Warning: Don't [action] Until..." | Warning: [alert] |
| Secret | "The Secret of..." | The Secret of [desire] |
| Challenge | "Can You Pass This Test?" | Can you [challenge]? |

### 3. Tag por Industria e Uso
- Tags de industria: SaaS, ecommerce, fintech, health, education
- Tags de canal: email, web, ad, social, video
- Tags de awareness: unaware, problem, solution, product, most
- Tags de emocao: fear, curiosity, desire, urgency, belonging

### 4. Criar Pattern Templates
Para cada pattern, criar template preenchivel:
- Pattern: "How to [BENEFIT] Without [OBJECTION]"
- Exemplo classic: "How to Win Friends Without Being Fake"
- Template: "How to _______ Without _______"
- Quando usar: Solution/Product Aware audiences

### 5. Manutencao Continua
- Adicionar 5-10 novos headlines por semana
- Revisitar e remover underperformers
- Atualizar com trends de copy (novos patterns emergindo)
- Compartilhar "headline of the week" com team

## Saida
- Swipe file organizado por categoria
- 100+ headlines catalogados
- Pattern templates preenchíveis
- Tags por industria, canal, awareness, emocao

## Validacao
- [ ] Min 100 headlines catalogados
- [ ] Min 8 categorias cobertas
- [ ] Tags aplicadas (industria, canal, awareness)
- [ ] Pattern templates criados
- [ ] Processo de manutencao definido

---

*Task operada por: headline-specialist (Hook)*
