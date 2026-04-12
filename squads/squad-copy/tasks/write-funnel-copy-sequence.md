---
task: write-funnel-copy-sequence
responsavel: "@funnel-copywriter"
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

# Task: Write Funnel Copy Sequence

## Metadata
- **Squad:** squad-copy
- **Agent:** funnel-copywriter (Flow)
- **Complexity:** COMPLEX
- **Depends on:** copy brief, value ladder, offers definidas, funnel architecture
- **Feeds:** ad-copywriter (Spark), email-sequence-strategist (Drip), copy-editor (Chisel)

## Objetivo
Escrever copy para um funil completo — do ad ate o thank you page — com congruencia total de messaging. Cada etapa e um degrau na value ladder (Brunson) e o copy deve facilitar a ascensao natural do lead de um degrau para o proximo.

## Entrada
- Value ladder completa (ofertas por nivel de preco)
- Funnel architecture (etapas e fluxo)
- Copy brief com audiencia e awareness level
- Attractive Character e Epiphany Bridge
- Proof stack disponivel por etapa

## Passos

### 1. Mapear o Funil Completo
**Documentar cada etapa:**
| Etapa | Pagina | Oferta | Preco | Objetivo de Copy |
|-------|--------|--------|-------|-----------------|
| 1 | Ad | — | — | Parar scroll, gerar clique |
| 2 | Opt-in Page | Lead Magnet | Gratis | Capturar email |
| 3 | Thank You / Bridge | — | — | Aquecer para tripwire |
| 4 | Tripwire/SLO | Oferta low-ticket | R$7-47 | Converter em buyer |
| 5 | Upsell 1 | Oferta complementar | R$47-197 | Maximizar AOV |
| 6 | Downsell | Versao reduzida | R$27-97 | Recuperar nao-buyers |
| 7 | Core Sales Page | Produto principal | R$97-997 | Full pitch |
| 8 | Order Bump | Add-on | R$27-97 | Impulse add |
| 9 | Thank You | — | — | Confirmar + next step |

### 2. Escrever Opt-in Page Copy
**Estrutura:**
```
HEADLINE: Promessa clara do lead magnet
SUBHEADLINE: Como/em quanto tempo
3-5 BULLETS: O que vao aprender/receber
PROOF: Mini social proof (N downloads, rating)
CTA: "Quero [beneficio]" (nao "Cadastrar")
URGENCIA (opcional): "Disponivel por tempo limitado"
```
**Regra:** Opt-in page deve converter >30% do trafego.

### 3. Escrever Tripwire/SLO Copy
**Estrutura (pagina curta, 500-1000 palavras):**
1. Headline com oferta irresistivel
2. Conexao com lead magnet ("Gostou do [LM]? Isso vai alem...")
3. 3-5 beneficios do tripwire
4. Preco anchor → preco real
5. Garantia
6. CTA urgente

**Objetivo:** Self-Liquidating Offer — cobrir custo de aquisicao.

### 4. Escrever Upsell/Downsell Scripts
**One-Click Upsell (video ou texto, 2-3 min):**
```
"Espere! Antes de ir..."
→ Reconhecer a compra ("Parabens pela decisao")
→ "Mas tem UMA coisa que vai acelerar seus resultados..."
→ Apresentar oferta complementar
→ Mostrar que funciona MELHOR junto com o que ja comprou
→ Preco especial (so agora, so aqui)
→ CTA: "Sim, quero [beneficio]" / "Nao, obrigado"
```

**Downsell (para quem recusou upsell):**
```
→ Reconhecer a objecao (geralmente preco)
→ Oferecer versao reduzida ou parcelamento
→ Manter promessa core mas com menos extras
→ CTA: "Quero a versao [nome]"
```

### 5. Escrever Order Bump Copy
**Regras (3-5 linhas maximo):**
- Checkbox com frase de beneficio
- Complementar (nao competir com) a oferta principal
- Parecer impulse buy obvia ("por apenas R$27 a mais")
- Formato: "[Checkmark] Sim! Adicione [nome] por apenas R$[preco] — [beneficio em 1 frase]"

### 6. Garantir Congruencia de Messaging
**Checklist de congruencia:**
- Mesma Big Idea do ad ao thank you page
- Mesma linguagem e tom em todas as etapas
- Promessas do ad cumpridas na landing page
- Attractive Character consistente
- Objecoes endereçadas progressivamente (nao repetidas)
- Cada etapa referencia a anterior ("Voce acabou de [acao]...")

## Cross-Squad Handoff
```yaml
handoffs:
  - to: ad-copywriter (Spark)
    delivers: Brief de messaging para ads alinhados ao funil
    format: Big Idea + hooks + tom + CTA
  - to: email-sequence-strategist (Drip)
    delivers: Context de funil para email sequences
    format: Value ladder + messaging por etapa
  - to: digital-experience squad
    delivers: Copy completa por pagina para implementacao
    format: Copy blocks organizados por secao e pagina
```

## Saida
- Copy completa para cada etapa do funil
- Opt-in page copy
- Tripwire/SLO copy
- Upsell e downsell scripts
- Order bump copy
- Thank you page copy
- Mapa de congruencia de messaging

## Validacao
- [ ] Todas as etapas do funil com copy completa
- [ ] Hook-Story-Offer em cada peca principal
- [ ] Value ladder refletida na progressao de ofertas
- [ ] Congruencia de messaging verificada (ad → thank you)
- [ ] Opt-in page com headline + bullets + CTA
- [ ] Tripwire conectado ao lead magnet
- [ ] Upsell complementa (nao repete) oferta anterior
- [ ] Order bump em 3-5 linhas max
- [ ] Cada etapa referencia a anterior
- [ ] CTAs especificos com beneficio (nao "clique aqui")

---

*Task operada por: funnel-copywriter (Flow)*
