---
task: create-personalization-strategy
responsavel: "@ga-cro-specialist"
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

# Task: Create Personalization Strategy

## Metadata
- **Squad:** squad-growth
- **Agent:** Convert (ga-cro-specialist)
- **Complexity:** Standard

## Objetivo
Criar estrategia de personalizacao — definir segmentos, regras de personalizacao, conteudo dinamico e metricas de sucesso.

## Entrada
- User segments (from Insight)
- Behavioral data
- Content inventory
- Personalization platform

## Passos

### 1. Personalization Types
| Tipo | Descricao | Exemplo | Complexidade |
|------|----------|---------|-------------|
| Segment-based | Conteudo por grupo de usuarios | New vs returning visitors | Baixa |
| Behavioral | Baseado em acoes do usuario | Recently viewed products | Media |
| Geographic | Por localizacao | Local pricing, language | Baixa |
| Referral-based | Baseado na origem | Ad → matching LP content | Baixa |
| Predictive | ML-based recommendations | "You might also like" | Alta |
| Real-time | Baseado na sessao atual | Exit intent offer | Media |

### 2. Segment × Content Matrix
| Segmento | Homepage | CTA | Social Proof | Pricing | Oferta |
|----------|---------|-----|-------------|---------|--------|
| New visitor (organic) | Intro content | "Learn More" | Generic | Show plans | Free trial |
| New visitor (paid) | Match ad message | "Start Free Trial" | Industry-specific | Highlight plan | Match ad offer |
| Returning visitor | "Welcome back" | "Continue" | Updated metrics | Same plan | Loyalty offer |
| Free user | Feature highlights | "Upgrade" | Success stories | Upgrade benefits | Discount |
| Churned user | "We miss you" | "Come Back" | What's new | Special offer | Win-back |

### 3. Personalization Rules
```yaml
rules:
  - name: "New visitor from paid ad"
    condition:
      segment: "new_visitor"
      source: "paid"
      medium: "cpc"
    action:
      headline: "Match ad headline"
      cta: "Start Free Trial"
      social_proof: "Industry-specific testimonial"

  - name: "Returning free user"
    condition:
      segment: "free_user"
      visits: "> 3"
    action:
      banner: "Upgrade prompt with usage stats"
      cta: "Upgrade to Pro"
      pricing: "Highlight most popular plan"
```

### 4. Success Metrics
| Metrica | Baseline (no personalization) | Target (with) | Measurement |
|---------|------------------------------|-------------|------------|
| Conversion rate | | +10-30% | A/B test |
| Engagement rate | | +15-25% | Analytics |
| Bounce rate | | -10-20% | Analytics |
| Revenue per visitor | | +5-15% | Analytics |
| Customer satisfaction | | +5-10 NPS | Survey |

## Saida
- Personalization strategy document
- Segment × content matrix
- Personalization rules
- Success metrics and measurement plan

## Validacao
- [ ] Segmentos definidos com dados
- [ ] Content matrix preenchida
- [ ] Regras de personalizacao claras
- [ ] Metricas de sucesso definidas
- [ ] Privacy compliance verificado
- [ ] A/B testing plan para validacao
