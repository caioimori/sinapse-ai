---
task: design-welcome-series
responsavel: "@email-sequence-strategist"
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

# Task: Design Welcome Series

## Metadata
- **Squad:** squad-copy
- **Agent:** email-sequence-strategist (Drip)
- **Complexity:** STANDARD
- **Depends on:** lead magnet definido, audiencia, brand voice
- **Feeds:** conversion-writer (Spark), copy-editor (Chisel)

## Objetivo
Criar welcome series que transforma novos subscribers em engajados e compradores. Os primeiros 5-7 emails definem a relacao — expectativas, valor, confianca e primeiro "sim" de compra. E a sequencia mais importante de qualquer email marketing.

## Entrada
- Lead magnet ou oferta de entrada
- Audiencia e awareness level no momento da inscricao
- Brand voice e persona (Attractive Character)
- Produto/servico principal a ser apresentado
- Objetivo da welcome series (engajamento, primeira compra, qualificacao)

## Passos

### 1. Definir Estrutura da Welcome Series
**Sequencia padrao (5-7 emails, cadencia diaria → cada 2 dias):**

| Email | Timing | Objetivo | Tipo |
|-------|--------|----------|------|
| 1 | Imediato | Entregar lead magnet + definir expectativas | Delivery + Welcome |
| 2 | +1 dia | Contar SUA historia (Epiphany Bridge) | Story |
| 3 | +2 dias | Entregar valor educacional surpreendente | Insight/Education |
| 4 | +3 dias | Social proof — resultados de clientes | Proof |
| 5 | +5 dias | Enderecar objecao principal | Objection Handler |
| 6 | +7 dias | Soft pitch — apresentar oferta | Offer (soft) |
| 7 | +9 dias | Direct pitch com urgencia/bonus exclusivo | Offer (direct) |

### 2. Escrever Email 1 — The Welcome Email
**Elementos obrigatorios:**
- Entregar o que foi prometido (link/acesso ao lead magnet)
- Agradecer e criar conexao pessoal
- Definir expectativas (o que vao receber, frequencia)
- Pedir whitelist ("arraste para principal" ou "adicione aos contatos")
- Plantar semente de curiosidade para proximo email
- Tom: quente, acolhedor, genuino

### 3. Construir Epiphany Bridge (Email 2-3)
- Contar a historia de transformacao do fundador/marca
- Formato: estava [situacao ruim] → descobri [insight] → agora [resultado]
- Objetivo: criar identificacao e autoridade simultaneamente
- Gancho emocional que conecta COM a dor do subscriber

### 4. Criar Progressao de Valor → Oferta
- Emails 3-5: 80% valor, 20% semente de venda
- Email 6: 50% valor, 50% apresentacao da oferta
- Email 7: 80% oferta, 20% valor (deadline/bonus)
- Transicao deve ser NATURAL, nao abrupta

### 5. Definir Reply Triggers e Segmentacao
- Email 1: "Responda e me conte seu maior desafio com [X]"
- Email 3: "Qual dessas situacoes e mais parecida com a sua? (A/B/C)"
- Respostas alimentam segmentacao para sequencias futuras
- Quem responde → tag "engaged", priorizacao em ofertas

## Cross-Squad Handoff
```yaml
handoffs:
  - to: brand-voice-writer (Tone)
    delivers: Welcome series para review de voz e tom
    format: Sequencia completa com notas de persona
  - to: funnel-copywriter (Flow)
    delivers: Welcome series integrada ao funil
    format: Sequencia com contexto de value ladder
```

## Saida
- Welcome series completa (5-7 emails)
- Subject lines + preview texts (3 variacoes cada)
- Timing/cadencia definida
- Reply triggers e perguntas de segmentacao
- Notas de transicao entre emails

## Validacao
- [ ] Email 1 entrega lead magnet imediatamente
- [ ] Expectativas definidas no Email 1 (frequencia, conteudo)
- [ ] Whitelist request incluido
- [ ] Epiphany Bridge autentica e relatable
- [ ] Progressao natural de valor para oferta
- [ ] Reply triggers para engajamento e segmentacao
- [ ] Subject lines testadas (3 variacoes por email)
- [ ] Tom consistente com brand voice
- [ ] CTA claro em cada email (mesmo que nao seja venda)
- [ ] Open loops entre emails

---

*Task operada por: email-sequence-strategist (Drip)*
