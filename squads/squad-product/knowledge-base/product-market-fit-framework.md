# Product-Market Fit Framework

## Purpose
Framework completo para medir, encontrar e escalar product-market fit (PMF) — combinando metodos quantitativos e qualitativos. Nenhuma estrategia de growth funciona sem PMF.

## O Que e PMF

Marc Andreessen definiu em 2007: "Product-market fit significa estar em um bom mercado com um produto que pode satisfazer esse mercado."

A definicao mais operacional de Andy Rachleff (Benchmark/Wealthfront): PMF = quando o produto satisfaz uma necessidade de mercado com intensidade suficiente para criar crescimento sustentavel.

**A metafora de Sam Altman:** PMF e quando usuarios estao tao desesperados para usar seu produto que voce mal consegue acompanhar o crescimento. Quando os usuarios que sairam voltam a pedir de volta.

**O sinal mais forte de ausencia de PMF:** Voce precisa convencer pessoas a usar seu produto. Com PMF real, usuarios convencem uns aos outros.

## Metodos de Medicao

### 1. Sean Ellis PMF Test (Survey)

O metodo mais usado para medir PMF quantitativamente. Criado por Sean Ellis (ex-Dropbox, GrowthHackers) enquanto gerenciava growth em 40+ empresas.

**A pergunta central:**
```
"Como voce se sentiria se nao pudesse mais usar [produto]?"
Opcoes:
  (a) Muito decepcionado
  (b) Um pouco decepcionado
  (c) Nao decepcionado
  (d) N/A — nao uso mais
```

**Interpretacao:**
```
% que respondeu "Muito Decepcionado":
  >= 40%: PMF atingido — foque em crescimento
  25-40%: PMF parcial — segmente e entenda quem disse 40%+, otimize para eles
  < 25%: PMF nao atingido — foque em produto, nao em crescimento
```

**Regras de aplicacao:**
- Enviar para usuarios que usaram o produto ao menos 2 vezes nos ultimos 30 dias (usuarios ativos, nao todos os signups)
- Amostra minima: 40 respostas para resultados significativos
- Segmentar por plano, canal de aquisicao, perfil de usuario para encontrar o segmento com >40%
- Ler os comentarios qualitativos — especialmente os "Muito Decepcionados" — eles descrevem o produto que voce deveria construir

**Descoberta de Superhuman (Rahul Vohra):**
Superhuman usou o Ellis Survey para identificar que o segmento com >40% eram "profissionais de alta performance que lidam com grande volume de email". Eles cortaram features para todos os outros segmentos e focaram apenas nesse segmento. NPS foi de 22 para 58 em 6 meses.

### 2. Retention Curves — O Grafico Mais Importante

A curva de retencao e o sinal mais definitivo de PMF. Sem retencao, voce nao tem PMF — tem um funil com vazamento.

**O que procurar:**

```
Curva que vai a zero:
  Sem PMF — usuarios experimentam e nao voltam
  Crescimento = adicionar usuarios que vao embora

Curva que estabiliza (flattens):
  PMF encontrado — um nucleo de usuarios continua usando
  A altura do plateau indica forca do PMF

Curva que inverte (J-curve):
  PMF excepcional — usuarios se tornam mais ativos ao longo do tempo
  Rarissimo. Exemplos: Slack (quanto mais voce usa, mais critica se torna a ferramenta)
```

**Como ler a curva:**
- Eixo X: tempo desde o signup (D1, D7, D30, D60, D90...)
- Eixo Y: % do cohort original ainda ativo
- Acao em D1, D7, D30 sao os momentos criticos

**Benchmarks de retencao por tipo de produto (Lenny Rachitsky):**

| Tipo de Produto | D1 | D7 | D30 |
|----------------|----|----|-----|
| Consumer social | 25-60% | 15-35% | 8-20% |
| SaaS B2B | 65-85% | 55-75% | 40-60% |
| Marketplace | 30-50% | 20-40% | 15-30% |
| E-commerce | 30-40% | 15-25% | 8-15% |

**Regra de Casey Winters (Pinterest/Grubhub):**
Se a curva de retencao nao estabiliza, para de gastar em aquisicao. Todo usuario adquirido vai embora — voce esta enchendo um balde furado.

### 3. NPS Segmentado

NPS acima de 40 e um sinal indicativo de PMF — mas deve ser interpretado com cautela porque NPS pode ser alto por inertia (sem alternativas) em vez de amor real.

NPS mais revelador: segmentar por cohort de maturidade:
- Novos usuarios (D0-D30): NPS baixo e normal — ainda aprendendo
- Usuarios de longo prazo (D90+): NPS deve ser significativamente mais alto
- Se NPS de longo prazo nao e maior, ha problema de retencao e produto

### 4. Comportamentos de PMF (Qualitativos)

Sinais que indicam PMF real (Andrew Chen / Andreessen Horowitz):

| Sinal | O que significa |
|-------|----------------|
| Usuarios voltam sem ser lembrados | Habito formado — produto resolve necessidade real |
| Usuarios criam workarounds para problemas do produto | Alto valor percebido supera fricao |
| Usuarios indicam sem incentivo | Advocacy organica |
| Usuarios ficam chateados com downtime | Dependencia real |
| Usuarios pedem features especificas | Engajamento profundo com a proposta de valor |
| Usuarios migram dados de outra ferramenta | Comprometimento real |
| "Como eu vivia sem isso?" | Aha moment sustentado |

### 5. Qualitative PMF Interview

Complemento ao Ellis Survey. Entrevistar os "Muito Decepcionados":

```
Perguntas-chave:
1. "Como voce descreveria [produto] para um amigo?" 
   → Revela posicionamento real (geralmente diferente do que a empresa pensa)

2. "Que tipo de pessoa se beneficiaria mais com [produto]?"
   → Define o ICP real a partir da perspectiva do usuario

3. "O que o levou a mudar para [produto]?" (se vieram de alternativa)
   → Forca de push (o que estava errado antes) e pull (o que o atraiu)

4. "Qual seria o principal beneficio que perderia?"
   → Core value prop na voz do usuario

5. "Como voce usa [produto]? Descreva um dia tipico de uso."
   → Contexto de uso real vs. contexto de uso assumido
```

## Encontrando PMF — O Processo

### Framework de Rahul Vohra (Superhuman)

1. **Segmentar:** Identificar o segmento com maior % de "Muito Decepcionados" no Ellis Survey
2. **Codificar:** Ler todos os comentarios dos "Muito Decepcionados" — extrair as frases mais repetidas
3. **Definir ICP baseado em dados:** "Nosso produto e melhor para [ICP] porque resolve [job] melhor que qualquer alternativa"
4. **Cortar features:** Funcionalidades amadas pelo segmento wrong diminuem o PMF do segmento right
5. **Dobrar no que o segmento right ama:** Highroad de features que aparecem nos comentarios dos Muito Decepcionados

### PMF Engine (Eric Ries / Lean Startup)

```
Build → Measure → Learn (ciclos curtos)

Objetivo: invalidar hipoteses o mais rapido possivel
Cada ciclo deve responder: "Estamos mais perto ou mais longe de PMF?"

Criterio de pivô:
  Nao e "o produto nao funciona"
  E "este segmento / problema / solucao nao tem tracao — onde esta o problema?"
```

### Pivots Classicos de PMF

| Tipo de Pivot | Quando usar | Exemplo |
|-------------|------------|---------|
| **Zoom-in** | Feature se torna produto inteiro | Flickr era game, foto era feature |
| **Zoom-out** | Produto se torna feature de produto maior | Burbn era check-in app, foto era feature → Instagram |
| **Customer Segment** | Produto certo, cliente errado | YouTube era dating, virou video geral |
| **Problem** | Solucao certa, problema errado | Groupon era plataforma de ativismo → cupons |
| **Platform** | App se torna plataforma | PayPal era para Palm Pilots → web payments |
| **Business Architecture** | Troca de modelo de margem/volume | | 

## Escalar Apos PMF

**A armadilha do falso PMF:** Crescimento por paid ads pode mascarar ausencia de PMF. Quando o budget para, o crescimento para. PMF real e quando crescimento organico ou viral sustenta o negocio.

### Pre-requisitos para escalar (Benchmark de Andreessen Horowitz)

```
Antes de escalar agressivamente, confirme:
  [ ] Retention curve flattened (cohort D30 estabilizou)
  [ ] NRR >= 100% (clientes estao expandindo ou pelo menos ficando)
  [ ] K-factor > 0.3 (alguma viralidade organica)
  [ ] CAC Payback Period < 18 meses
  [ ] LTV/CAC >= 3:1
  [ ] Organic growth > 20% do novo MRR (alguma tracao nao-paga)
  [ ] Sean Ellis Score >= 40% no segmento ICP
```

### Growth Strategies pós-PMF

| Stage | Focus | Metricas |
|-------|-------|---------|
| Pre-PMF | Encontrar o segmento certo, iterar produto | Sean Ellis Score, D30 retention |
| Early PMF | Otimizar activation e onboarding | TTFV, Activation Rate, D7 retention |
| Scaling | Escalar o que funciona, diversificar canais | CAC, LTV, NRR, K-factor |
| Mature | Expansao de produto/mercado, moats | Net Expansion Rate, Market Share |

## Burn Rate vs. PMF — A Decisao Critica

Startup sem PMF que escala = queimar dinheiro no lixo.

**Regra de Sequoia Capital:**
```
Se PMF Score < 40% (Ellis) AND Retention Curve vai a zero:
  → PARE de escalar
  → REDUZA burn rate
  → FOQUE 100% em iterar produto com ICP menor e mais definido
  → Meça a cada 30 dias
```

**Signal para adicionar growth:**
```
D30 retention estabilizou AND
Sean Ellis Score >= 40% no segmento ICP AND
QUALQUER organic/viral growth visible
→ Agora escale o que esta funcionando
```

## Ferramentas para Medir PMF

| Ferramenta | Uso |
|-----------|-----|
| **Typeform / Tally** | Ellis PMF Survey |
| **Amplitude / Mixpanel** | Retention curves, cohort analysis |
| **Segment** | Instrumentacao de eventos para tracking preciso |
| **Looker / Metabase** | Dashboard de metricas de PMF |
| **Dovetail / Notion** | Repositorio de insights qualitativos de entrevistas |
| **Hotjar** | Session replay — ver onde usuarios travam |
| **Delighted / Medallia** | NPS automation |
