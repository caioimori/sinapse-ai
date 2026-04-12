---
task: write-voice-examples-by-channel
responsavel: "@brand-voice-writer"
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

# Task: Write Voice Examples by Channel

## Metadata
- **Squad:** squad-copy
- **Agent:** brand-voice-writer (Tone)
- **Complexity:** STANDARD
- **Depends on:** brand voice, tone spectrum
- **Feeds:** todos os writers do squad

## Objetivo
Criar exemplos concretos de como a brand voice se manifesta em cada canal — servindo como referencia pratica para qualquer writer produzir copy on-brand imediatamente.

## Entrada
- Brand voice guidelines
- Tone spectrum
- Canais ativos da marca
- Copy existente (para avaliar e refinar)

## Passos

### 1. Mapear Canais e Adaptacoes
| Canal | Comprimento | Formalidade | Emocao | Personalidade |
|-------|:-----------:|:-----------:|:------:|:-------------:|
| Website (hero) | Curto | Media | Alta | Forte |
| Website (product) | Medio | Media | Media | Forte |
| Blog | Longo | Casual-Med | Media | Forte |
| Email marketing | Medio | Casual | Media-Alta | Forte |
| Email transacional | Curto | Med-Formal | Neutra | Sutil |
| Social (Instagram) | Curto | Casual | Alta | Forte |
| Social (LinkedIn) | Medio | Med-Formal | Media | Moderada |
| Social (Twitter/X) | Muito curto | Casual | Alta | Forte |
| Ads | Muito curto | Media | Alta | Forte |
| Help Center | Medio | Med-Formal | Empatica | Sutil |
| Push notification | Micro | Casual | Direta | Minima |
| In-app | Micro | Casual | Variavel | Moderada |

### 2. Escrever Exemplos por Canal (3 por canal)
**Para cada canal, produzir:**
- 1 exemplo "Perfeito" (benchmark)
- 1 exemplo "Aceitavel" (minimum)
- 1 exemplo "Nao faca isso" (anti-pattern)

**Template por canal:**
```
CANAL: [Nome]
Contexto: [Situacao]
Audience: [Quem ve isso]
Tom: [Tom principal]

✅ PERFEITO:
"[Copy exemplo]"
→ Por que funciona: [explicacao]

🟡 ACEITAVEL:
"[Copy exemplo]"
→ O que falta: [explicacao]

❌ NAO FACA:
"[Copy exemplo]"
→ O que esta errado: [explicacao]
```

### 3. Website Examples
**Hero Section:**
```
✅ "Transforme dados em decisoes. Em minutos, nao dias."
→ Beneficio claro, ritmo, contraste

🟡 "A plataforma de analytics para times modernos."
→ Funcional mas generico, sem emocao

❌ "Solucao SaaS de Business Intelligence para otimizacao de KPIs corporativos."
→ Jargao, frio, ninguem se identifica
```

**Error Page (404):**
```
✅ "Ops! Esta pagina saiu de ferias. Vamos te levar de volta? [Ir para Home]"
→ Personalidade mantida mesmo no erro

🟡 "Pagina nao encontrada. Voltar a pagina inicial."
→ Funcional mas sem personalidade

❌ "Error 404: Resource not found. Contact system administrator."
→ Tecnico, frio, assustador
```

### 4. Email Examples
**Welcome Email:**
```
✅ "Oi [Nome]! 👋 Que bom ter voce aqui. Preparamos algo especial..."
→ Caloroso, pessoal, antecipacao

🟡 "Bem-vindo a [marca]. Acesse sua conta aqui."
→ Funcional mas sem calor

❌ "Prezado cliente, sua conta foi criada com sucesso no sistema."
→ Corporativo, impessoal, frio
```

### 5. Social Media Examples
**Instagram Post:**
```
✅ "O segredo nao e trabalhar mais. E saber onde focar.
   (Deslize para o framework completo 👉)"
→ Hook forte, valor, CTA natural

🟡 "[Marca] lanca nova feature. Saiba mais no link da bio."
→ Informativo mas sem engagement

❌ "Estamos extremamente honrados em anunciar o lancamento..."
→ Corporativo, distante, ninguem compartilha isso
```

**LinkedIn Post:**
```
✅ "Analiso dados de 500+ empresas todo trimestre.
   Aqui esta o que ninguem fala sobre [topico]:
   (Thread 🧵)"
→ Authority + curiosidade, nativo da plataforma

🟡 "Publicamos um novo blog sobre [topico]. Confira."
→ Funcional mas sem valor direto

❌ "Temos orgulho de ser lideres no segmento de..."
→ Auto-promocao pura, ninguem engaja
```

### 6. Compilar Voice Sample Book
**Documento final organizado por:**
1. Canal → 3 exemplos cada (perfeito/aceitavel/nao faca)
2. Situacao → como a voice responde (positivo/neutro/negativo)
3. Formato → como adaptar por comprimento (micro/curto/medio/longo)

**Incluir:**
- Copy blocks reutilizaveis (greetings, closings, CTAs)
- Frases proibidas (blacklist)
- Emojis aprovados e uso por canal
- Formatting conventions por canal

## Cross-Squad Handoff
```yaml
handoffs:
  - to: todos os writers do squad
    delivers: Voice sample book como referencia diaria
    format: Documento com exemplos por canal
  - to: squad-design
    delivers: UX copy examples
    format: In-app, push, error messages examples
```

## Saida
- Voice sample book completo
- 3 exemplos por canal (perfeito/aceitavel/nao faca)
- Copy blocks reutilizaveis
- Formatting conventions por canal

## Validacao
- [ ] Min 8 canais cobertos com exemplos
- [ ] 3 exemplos por canal (perfeito/aceitavel/erro)
- [ ] Explicacao de POR QUE cada exemplo funciona ou nao
- [ ] Copy blocks reutilizaveis incluidos
- [ ] Emojis e formatting por canal definidos
- [ ] Consistencia de voice atraves dos canais
- [ ] Anti-patterns claros para evitar

---

*Task operada por: brand-voice-writer (Tone)*
