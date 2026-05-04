---
task: write-social-proof-section
responsavel: "@persuasion-psychologist"
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

# Task: Write Social Proof Section

## Metadata
- **Squad:** squad-copy
- **Agent:** persuasion-psychologist (Nudge)
- **Complexity:** STANDARD
- **Depends on:** testimonials, dados, cases
- **Feeds:** conversion-writer (Spark), long-form-writer (Saga)

## Objetivo
Escrever secoes de social proof que convertem — selecionando, formatando e posicionando provas sociais para maximizar credibilidade e reduzir resistencia a compra.

## Entrada
- Testimonials coletados (texto, video, reviews)
- Dados de clientes (numeros, logos)
- Case studies disponiveis
- Premios, certificacoes, midia
- Copy onde social proof sera inserido

## Passos

### 1. Hierarquia de Social Proof
**Do mais forte ao mais fraco:**
| Nivel | Tipo | Forca | Exemplo |
|:-----:|------|:-----:|---------|
| 1 | Expert endorsement | ⭐⭐⭐⭐⭐ | "Recomendado por [autoridade reconhecida]" |
| 2 | Celebrity/Influencer | ⭐⭐⭐⭐ | "[Pessoa conhecida] usa [produto]" |
| 3 | User testimonial (specific) | ⭐⭐⭐⭐ | "[Nome] aumentou [metrica] em [X]%" |
| 4 | Aggregate data | ⭐⭐⭐ | "10,000+ clientes em 40 paises" |
| 5 | Client logos | ⭐⭐⭐ | Logos de marcas reconhecidas |
| 6 | Ratings/Reviews | ⭐⭐⭐ | "4.9/5 — 2,340 reviews no G2" |
| 7 | Media mentions | ⭐⭐ | "Como visto em Forbes, TechCrunch" |
| 8 | Certifications | ⭐⭐ | "ISO 27001, SOC 2 Type II" |
| 9 | Generic testimonial | ⭐ | "Otimo produto!" — Anonimo |

### 2. Selecionar e Editar Testimonials
**Regras de selecao:**
- Especifico > Genérico ("47% em 3 meses" > "muito bom")
- Similar ao prospect (mesma industria, cargo, tamanho)
- Com resultado mensuravel
- Com nome, foto, cargo, empresa (quanto mais, melhor)

**Regras de edicao:**
- NUNCA inventar ou exagerar
- OK encurtar (com [...] para indicar)
- OK corrigir gramatica menor
- SEMPRE verificar aprovacao do cliente
- Destacar parte mais impactante em bold

**Formato de testimonial otimizado:**
```
"[Resultado mensurável]. [Como ajudou]. [Recomendação]."

— [Nome Completo]
  [Cargo], [Empresa]
  [Foto]
```

### 3. Posicionar Social Proof Estrategicamente
| Posicao | Tipo de Proof | Funcao |
|---------|--------------|--------|
| Below hero | Logos + numero agregado | Credibilidade imediata |
| After benefits | Testimonial especifico | Prova do beneficio |
| Before CTA | Rating + garantia | Reduzir hesitacao |
| After pricing | ROI testimonial | Justificar investimento |
| In email | Quote curto + resultado | Credibilidade inline |
| In ad | 1 numero forte | Atencao + credibilidade |

### 4. Formatos de Social Proof
**Social Proof Bar (abaixo do hero):**
```
[Logo] [Logo] [Logo] [Logo] | "Usado por 10,000+ empresas"
```

**Testimonial Card:**
```
⭐⭐⭐⭐⭐
"[Quote principal em bold].
 [Contexto adicional]."

— [Nome], [Cargo]
  [Empresa] | [Resultado: +47% revenue]
  [Foto circular]
```

**Data Point:**
```
[NUMERO GRANDE]
[Contexto do numero]
Ex: "10,847 → Empresas que cresceram conosco"
```

**Before/After:**
```
ANTES: [Metrica ruim]
DEPOIS: [Metrica boa]
RESULTADO: [Diferenca em %]
```

**Video Testimonial CTA:**
```
▶️ "Veja como [Cliente] aumentou [metrica] em [X]%"
[Thumbnail com foto do cliente + play button]
```

### 5. Social Proof para Diferentes Stages
| Stage | Tipo de Proof | Exemplo |
|-------|--------------|---------|
| Awareness | Numeros agregados | "Join 10,000+ companies" |
| Interest | Industry testimonial | "[Pessoa do segmento] diz..." |
| Desire | Resultado especifico | "47% aumento em 90 dias" |
| Evaluation | Comparison/rating | "G2 #1 in category" |
| Purchase | Recent converts | "[Nome] acabou de assinar" |

## Saida
- Social proof sections por posicao
- Testimonials editados e formatados
- Data points preparados
- Hierarquia aplicada (mais forte → mais fraco)

## Validacao
- [ ] Testimonials especificos (com resultados)
- [ ] Nome, foto, cargo em cada testimonial
- [ ] Hierarquia de proof respeitada
- [ ] Posicionamento estrategico na peca
- [ ] Variedade de tipos (quote, data, logo, rating)
- [ ] Aprovacao dos clientes obtida
- [ ] Nenhum testimonial inventado ou exagerado

---

*Task operada por: persuasion-psychologist (Nudge)*
