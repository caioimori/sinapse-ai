---
task: create-brand-manifesto
responsavel: "@long-form-writer"
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

# Task: Create Brand Manifesto

## Metadata
- **Squad:** squad-copy
- **Agent:** long-form-writer (Saga)
- **Complexity:** COMPLEX
- **Depends on:** brand voice definida, copy strategy
- **Feeds:** brand-voice-writer (Tone), todos os writers

## Objetivo
Criar brand manifesto que articula a razao de existir da marca — um documento inspiracional que alinha equipe, atrai tribalistas e repele quem nao e o publico. O manifesto e a "constituicao emocional" da marca.

## Entrada
- Brand positioning e values
- Audiencia core (quem e a "tribo")
- Brand voice guidelines
- Competitor manifestos (para diferenciacao)

## Passos

### 1. Definir a Tensao Central
Todo grande manifesto nasce de uma TENSAO — algo que esta errado no mundo que a marca existe para consertar.

**Framework de Tensao:**
- **Status quo:** O que o mundo aceita como "normal"
- **O que esta errado:** Por que isso e inaceitavel
- **A visao alternativa:** Como o mundo DEVERIA ser
- **O papel da marca:** Como a marca luta por essa visao

**Exemplos classicos:**
- Apple: "Conformismo vs. Pensamento Diferente"
- Nike: "Duvida vs. Just Do It"
- Patagonia: "Consumismo vs. Responsabilidade Ambiental"

### 2. Escolher Estrutura do Manifesto
**Estruturas comprovadas:**

**A. Declaracao de Guerra:**
"Nos acreditamos que [status quo] esta errado. Existe um mundo onde [visao]. E nos existimos para [missao]."

**B. Manifesto do "Nos":**
"Nos somos os que [identidade]. Nos [acao]. Nos nao [anti-identidade]. Nos somos [marca]."

**C. Carta ao Mundo:**
Formato epistolar dirigido ao publico ou ao mundo. Tom pessoal, vulneravel, autentico.

**D. Principios Numerados:**
Lista de crencas/principios que definem a marca. Cada item e uma declaracao forte.

**E. Historia de Origem:**
Narrativa do fundador/momento que criou a necessidade da marca existir.

### 3. Escrever o Manifesto
**Principios de escrita:**
- **Tom:** Apaixonado mas nao arrogante
- **Comprimento:** 300-800 palavras (lido em 2-4 minutos)
- **Ritmo:** Frases curtas e declarativas + momentos de expansao
- **Voz:** Primeira pessoa do plural (nos) ou segunda pessoa (voce)
- **Emocao:** Indignacao construtiva — algo precisa mudar
- **Vocabulario:** Simples, visceral, memoravel — zero corporates

**Elementos obrigatorios:**
1. Opening hook que estabelece tensao
2. Declaracao de crenca core
3. Anti-posicionamento (o que NAO somos/fazemos)
4. Visao do futuro desejado
5. Convite a acao ou pertencimento
6. Frase de fechamento memoravel (soundbite)

**Tecnicas narrativas:**
- Anaphora: Repeticao de inicio de frase ("Nos acreditamos... Nos acreditamos...")
- Contraste: "Eles dizem X. Nos dizemos Y."
- Escalation: Cada paragrafo mais intenso que o anterior
- Payoff: A frase final recompensa quem leu tudo

### 4. Testar o Manifesto
**Testes de qualidade:**
- **Teste da tatuagem:** Alguem tatuaria uma frase deste manifesto?
- **Teste do competitor:** Se trocar o nome da marca por um competitor, ainda funciona? (Se sim, e generico demais)
- **Teste do arrepio:** Ao ler em voz alta, causa alguma reacao fisica?
- **Teste do poster:** Algum trecho ficaria bem numa parede?
- **Teste do inimigo:** O manifesto deixa claro contra O QUE a marca luta?
- **Teste do recruta:** Um candidato leria isso e pensaria "quero trabalhar aqui"?

### 5. Adaptar para Uso
**Versoes derivadas:**
| Formato | Comprimento | Uso |
|---------|-------------|-----|
| Full manifesto | 300-800 palavras | Website About, cultura interna |
| Condensed | 100-200 palavras | Brand book, apresentacoes |
| Soundbite | 1-2 frases | Tagline, social bio |
| Visual manifesto | 5-10 frases | Video, poster, mural |
| Internal version | Completo + contexto | Onboarding, alinhamento |

## Cross-Squad Handoff
```yaml
handoffs:
  - to: brand-voice-writer (Tone)
    delivers: Manifesto como referencia de voz e tom
    format: Manifesto completo + soundbites extraidos
  - to: squad-brand-identity
    delivers: Manifesto para alinhamento visual
    format: Manifesto + notas de intencao emocional
```

## Saida
- Brand manifesto completo (300-800 palavras)
- Versao condensada (100-200 palavras)
- 3-5 soundbites extraidos
- Notas de intencao (por que cada escolha foi feita)

## Validacao
- [ ] Tensao central clara e autentica
- [ ] Anti-posicionamento presente (o que NAO somos)
- [ ] Nao e generico (teste do competitor)
- [ ] Provoca reacao emocional (teste do arrepio)
- [ ] Inclui convite a pertencimento
- [ ] Frase de fechamento memoravel
- [ ] Versoes derivadas criadas
- [ ] Consistente com brand voice

---

*Task operada por: long-form-writer (Saga)*
