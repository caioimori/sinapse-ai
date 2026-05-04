---
task: write-opt-in-page
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

# Task: Write Opt-in Page Copy

## Metadata
- **Squad:** squad-copy
- **Agent:** conversion-writer (Spark)
- **Complexity:** STANDARD
- **Depends on:** lead magnet definido, copy brief, audiencia
- **Feeds:** long-form-writer (Saga), squad-growth

## Objetivo
Escrever copy de opt-in/squeeze page que maximiza taxa de conversao de leads — comunicando valor do lead magnet em poucas palavras e reduzindo fricao ao minimo.

## Entrada
- Lead magnet (ebook, checklist, template, webinar, trial)
- Audiencia e pain points
- Promise do lead magnet
- Numero de campos do formulario

## Passos

### 1. Estrutura da Opt-in Page
**Opt-in page eficaz tem MENOS, nao mais:**

```
HEADLINE (promessa do lead magnet)
SUBHEADLINE (especificidade + tempo/formato)
BULLET POINTS (3-5 beneficios do lead magnet)
VISUAL (mockup do lead magnet)
FORMULARIO (min campos possivel)
CTA BUTTON (action-oriented)
MICRO-COPY (privacy + expectativa)
[OPCIONAL] SOCIAL PROOF (1-2 linhas)
```

**Regra: ZERO navegacao. ZERO distracao. 1 acao possivel.**

### 2. Escrever Headline da Opt-in
**Formulas testadas:**
- "O Guia Definitivo para [Resultado]" (direto)
- "[Download] Gratis: [N] [Recurso] para [Resultado]" (especifico)
- "Descubra [Segredo/Metodo] que [Resultado] em [Tempo]" (curiosidade)
- "Checklist: [N] Passos para [Resultado] — Download Gratis" (utilidade)
- "Webinar Exclusivo: Como [Resultado] Sem [Objecao]" (evento)

**Subheadline complementar:**
- "Receba [lead magnet] direto no seu email em [X] segundos"
- "[N] paginas / [N] minutos de conteudo pratico"
- "Usado por [N] [audiencia] para [resultado]"

### 3. Bullet Points do Lead Magnet
**3-5 bullets que vendem o conteudo:**

**Formula por bullet:**
"[Icone/emoji] [O que vai aprender/receber] — [e como isso ajuda]"

**Exemplos:**
- "✅ O framework de 5 passos que empresas de $1M+ usam para [resultado]"
- "✅ A checklist completa para [acao] sem esquecer nenhum detalhe"
- "✅ [N] templates prontos para usar — copie, cole e personalize"
- "✅ Os [N] erros mais caros em [area] — e como evitar cada um"
- "✅ Bonus: [recurso extra] para [beneficio adicional]"

**Regras:**
- Comece com o bullet mais forte
- Cada bullet = 1 beneficio claro
- Especificidade (numeros, nomes, formatos)
- O leitor deve pensar "preciso disso" em cada bullet

### 4. Formulario e CTA
**Campos do formulario:**
| Campos | Conversion Rate | Quando Usar |
|--------|:---------------:|-------------|
| 1 (email) | Mais alta | Lead magnet simples, topo de funil |
| 2 (nome + email) | Alta | Personalizacao necessaria |
| 3 (nome + email + empresa) | Media | B2B qualification |
| 4+ campos | Baixa | Apenas se lead scoring essencial |

**CTA Button copy:**
- "Baixar [Lead Magnet] Gratis"
- "Receber Meu [Lead Magnet]"
- "Quero o [Lead Magnet]!"
- "Enviar para Meu Email"
- "Sim, Quero Acesso Gratis"

**Micro-copy abaixo do CTA:**
- "🔒 Seus dados estao seguros. Zero spam."
- "Receba em [X] segundos no seu email"
- "Pode cancelar a qualquer momento"
- "[N]+ pessoas ja baixaram"

### 5. Thank You Page Copy
**Apos opt-in, a Thank You Page e oportunidade:**

```
CONFIRMACAO: "Pronto! Confira seu email."
INSTRUCAO: "Caso nao encontre, verifique a pasta de spam"
[OPCIONAL] OFERTA: Tripwire offer ou upsell
[OPCIONAL] SOCIAL: Compartilhe com quem precisa
[OPCIONAL] NEXT STEP: "Enquanto espera, [acao]"
```

### 6. Variantes para Testing
**A/B tests prioritarios:**
1. Headline (maior impacto)
2. CTA copy (segundo maior impacto)
3. Numero de campos (terceiro)
4. Bullets (quarto)

**Gerar:**
- 3 headlines
- 3 CTA copies
- 2 variantes de social proof
- 2 versoes de bullet points (ordem diferente)

## Cross-Squad Handoff
```yaml
handoffs:
  - to: long-form-writer (Saga)
    delivers: Lead magnet content brief (o conteudo em si)
    format: Outline do lead magnet com promessas feitas na opt-in
  - to: squad-growth
    delivers: Opt-in page para tracking
    format: Copy + variantes A/B + metricas-alvo
```

## Saida
- Opt-in page copy completa
- Thank you page copy
- 3 variantes de headline
- 3 variantes de CTA
- Micro-copy library

## Validacao
- [ ] 1 unica acao possivel na pagina
- [ ] Headline comunica valor do lead magnet
- [ ] 3-5 bullet points especificos
- [ ] Min campos no formulario
- [ ] CTA action-oriented (nao "Submit")
- [ ] Micro-copy de privacy/confianca
- [ ] Thank you page otimizada
- [ ] Variantes para A/B testing criadas
- [ ] Zero distracao (sem nav, sem links externos)

---

*Task operada por: conversion-writer (Spark)*
