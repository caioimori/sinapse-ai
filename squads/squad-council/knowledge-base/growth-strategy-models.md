# Growth Strategy Models

## Purpose
Frameworks de crescimento para diagnosticar, desenhar e escalar estrategias de aquisicao, retencao e monetizacao. Do MVP ao IPO. Compilado das melhores praticas de growth hacking, product-led growth, e venture-backed scaling.

---

## PART 1: FRAMEWORKS FUNDAMENTAIS DE GROWTH

### 1. Growth Loops Framework (Reforge / Brian Balfour)
- **Originator**: Brian Balfour (Reforge); articulado em oposicao ao funil tradicional
- **When to Use**: Diagnosticar como o produto cresce de forma composta; identificar o loop primario do negocio
- **How to Apply**:
  1. Identifique os inputs do loop (usuarios, conteudo, dados, capital)
  2. Mapeie as acoes que transformam inputs em outputs
  3. Identifique como os outputs alimentam novos inputs (fechamento do loop)
  4. Meça a "loop velocity" (velocidade de rotacao) e "loop magnitude" (escala)
  5. Otimize o gargalo do loop, nao as extremidades
  
  **Tipos de Growth Loops**:
  - **Viral Loop**: Usuario usa produto → invita outros → novos usuarios usam produto
  - **Content Loop**: Cria conteudo → SEO → novos usuarios → criam mais conteudo
  - **Paid Loop**: Receita → anuncios → novos usuarios pagantes → mais receita
  - **Product Loop**: Usuarios geram dados → produto melhora → mais usuarios
  - **Sales Loop**: Leads → vendas → case studies → mais leads
- **Example Application**: Dropbox: Upload arquivo (input) → compartilha link com nao-usuario → nao-usuario precisa criar conta → novo usuario → compartilha mais arquivos (viral loop). Identificar que o loop era "share file" (nao "sign up page") direcionou toda a otimizacao para a feature de compartilhamento.
- **Key Metrics**: Loop cycle time; virality coefficient (K-factor); loop conversion rate
- **Cross-References**: Network Effects, North Star Metric, AARRR, PLG

---

### 2. North Star Metric Framework (Sean Ellis / Amplitude)
- **Originator**: Sean Ellis (cunhou "growth hacking"); formalizado por Amplitude
- **When to Use**: Alinhar toda a empresa em torno de uma unica metrica de valor; priorizar experimentos de growth
- **How to Apply**:
  1. Defina o NSM: a metrica que melhor captura o valor que o produto entrega aos usuarios
  2. Criterios de uma boa NSM:
     - Representa valor real para o usuario (nao vanity metric)
     - Correlaciona com receita no longo prazo
     - Todos na empresa entendem e podem influenciar
     - Lideravel (pode ser melhorada em 30-90 dias)
  3. Decomponha a NSM em inputs: quais drivers a movem?
  4. Crie arvore de metricas: NSM → inputs de primeiro nivel → sub-drivers
  5. Toda equipe de produto/growth tem pelo menos um input que e o seu KPI
  
  **Exemplos de NSM por modelo**:
  - Spotify: Tempo ouvindo musica por dia
  - Airbnb: Noites reservadas
  - Facebook: DAU (Daily Active Users)
  - Slack: Mensagens enviadas por organizacao/dia
  - Uber: Viagens por semana
  - HubSpot: Weekly Active Users engajando com pelo menos 3 features
- **Example Application**: SaaS B2B de automacao: NSM = "Automacoes executadas com sucesso por conta/semana". Inputs: contas ativas, automacoes criadas/conta, taxa de sucesso de execucao. Cada squad tem um input: Onboarding Squad → contas ativas; Product Squad → automacoes criadas; Infra Squad → taxa de sucesso.
- **Key Metrics**: NSM absoluto; NSM por cohort; NSM growth rate MoM
- **Cross-References**: OKRs, Growth Loops, AARRR/RARRA, Unit Economics

---

### 3. AARRR / Pirate Metrics (Dave McClure, 500 Startups, 2007)
- **Originator**: Dave McClure (500 Startups)
- **When to Use**: Diagnosticar onde o funil esta vazando; priorizar iniciativas de growth
- **How to Apply**:
  **AARRR Framework**:
  - **Acquisition**: Como usuarios te encontram? (SEO, pago, viral, etc.)
  - **Activation**: Quando tem o "aha moment"? (first value experience)
  - **Retention**: Voltam? (DAU/WAU/MAU, cohort retention curves)
  - **Referral**: Recomendam? (NPS, K-factor, viral coefficient)
  - **Revenue**: Pagam? (conversion, ARPU, LTV)
  
  **Processo de diagnostico**:
  1. Meça cada etapa com conversao clara
  2. Identifique o maior gap entre etapas
  3. Essa etapa e seu maior alavanca — foque 80% dos recursos aqui
  4. Nao otimize Acquisition se Retention esta quebrada
  
  **RARRA** (para produtos com retencao como base):
  Retention → Activation → Referral → Revenue → Acquisition
  (Andrew Chen recomenda para SaaS moderno)
- **Example Application**: App com 10K downloads/mes, 3K ativacoes, 900 retidos em D7, 270 referiram amigos, 135 pagantes. Conversoes: 30% Acquisition→Activation, 30% Activation→Retention. Gap maior: Activation (70% drop). Foco: melhorar onboarding e primeiro valor percebido.
- **Key Metrics**: Cada etapa do funil; conversao entre etapas; benchmark por canal de aquisicao
- **Cross-References**: North Star Metric, Growth Loops, Hook Model

---

### 4. Product-Led Growth — PLG (OpenView Partners, 2019)
- **Originator**: Blake Bartlett (OpenView Venture Partners); livro de Wes Bush (2019)
- **When to Use**: Quando o produto pode demonstrar valor antes do pagamento; mercados com longa curva de vendas; escalar sem crescer linearmente o time de vendas
- **How to Apply**:
  **Principios do PLG**:
  1. **End User Focus**: Venda para o usuario individual, nao apenas para o decisor de compra
  2. **Value Before Payment**: Freemium, trial, ou tiers gratuitos funcionais
  3. **Product as Distribution**: O produto se espalha via uso (Slack, Notion, Figma)
  4. **Bottom-Up Monetization**: Individual paga → empresa adota → enterprise contract
  
  **PLG Motion**:
  - Free tier com valor real (nao "feature incompleta")
  - Viral dentro das organizacoes (compartilhar arquivos, convidar membros)
  - PQL (Product Qualified Lead): usuario com sinais de intencao de upgrade
  - Land and Expand: comeca pequeno, cresce o contrato
  
  **Quando PLG funciona**: produto com valor imediato e obvio, viralidade natural, mercado amplo (muitos decisores)
  **Quando PLG nao funciona**: produtos complexos com longa implantacao, vendas enterprise-only, sem viralidade natural
- **Example Application**: Notion: usuario individual cria workspace (free) → compartilha com colegas → equipe toda usa Notion → TI ve o valor → contrato enterprise. O CAC do enterprise foi praticamente zero — o produto vendeu.
- **Key Metrics**: PQL → Paid conversion; Product Viral Coefficient; Time to Value; Expansion Revenue
- **Cross-References**: Growth Loops, AARRR, Unit Economics (PLG deve ter LTV/CAC >5x)

---

### 5. Hook Model (Nir Eyal, 2014)
- **Originator**: Nir Eyal ("Hooked: How to Build Habit-Forming Products")
- **When to Use**: Desenhar produtos que criam habito; aumentar retencao organica; reduzir churn
- **How to Apply**:
  **4 fases do Hook**:
  1. **Trigger**: Externo (notificacao, email, anuncio) → Interno (emocao, pensamento automatico)
  2. **Action**: A acao mais simples possivel em antecipacao da recompensa (scroll, click, busca)
  3. **Variable Reward**: Recompensa imprevisivel (feed de noticias, likes, novos matches) — variabilidade cria compulsao
  4. **Investment**: Usuario investe tempo, dados, ou reputacao — aumenta valor do produto para ele e probabilidade do proximo trigger
  
  **Progressao**: Triggers externos funcionam no inicio. O objetivo e criar triggers internos (uso automatico sem estimulo externo).
  
  **Teste etico**: O produto melhora a vida do usuario? Voce usaria o produto voce mesmo? Se nao: reconsidere o design do hook.
- **Example Application**: Twitter: Trigger externo (notificacao de reply) → interno (tedio, ansiedade social). Action: abrir app, scroll infinito. Variable Reward: novo tweet interessante, novo like, novo follower. Investment: escrever tweets (que geram notificacoes para outros).
- **Key Metrics**: Habitual users rate (% usuarios que voltam sem trigger externo); D1/D7/D30 retention; Trigger→Action conversion
- **Cross-References**: Retention (AARRR), Feedback Loops (Mental Models), Behavioral Economics

---

## PART 2: FRAMEWORKS DE PRIORIZAÇÃO

### 6. ICE Score (Sean Ellis)
- **Originator**: Sean Ellis (GrowthHackers)
- **When to Use**: Priorizar backlog de experimentos de growth rapidamente
- **How to Apply**:
  ICE Score = Impact × Confidence × Ease (cada um de 1-10)
  - **Impact**: Se funcionar, qual o impacto na North Star Metric? (1=marginal, 10=transformador)
  - **Confidence**: Qual a confianca de que vai funcionar? (1=palpite, 10=validado empiricamente)
  - **Ease**: Qual a facilidade de implementacao? (1=6+ meses, 10=1 dia)
  
  **Como usar**: 
  1. Liste todos os experimentos candidatos
  2. Score cada um (individualmente, depois media do time)
  3. Ordene por ICE score decrescente
  4. Execute os top 3 desta semana
  5. Revise scores mensalmente com novos dados
- **Example Application**: Experimento A (novo onboarding flow): Impact 8, Confidence 5, Ease 3 = ICE 120. Experimento B (email de reativacao): Impact 5, Confidence 8, Ease 9 = ICE 360. Prioridade: B primeiro — rapido, confiante, impacto decente.
- **Key Metrics**: Win rate de experimentos (ICE alto deve ter win rate maior); velocidade de experimentos/semana
- **Cross-References**: RICE Score (alternativa), North Star Metric, AARRR

---

### 7. RICE Score (Intercom, 2016)
- **Originator**: Sean McBride (Intercom)
- **When to Use**: Priorizar features e projetos de produto (mais robusto que ICE para product management)
- **How to Apply**:
  RICE = (Reach × Impact × Confidence) / Effort
  - **Reach**: Quantos usuarios serao afetados em um periodo (ex: por quarter)?
  - **Impact**: Impacto por usuario (0.25=minimo, 0.5=baixo, 1=medio, 2=alto, 3=massivo)
  - **Confidence**: % de confianca na estimativa (100%=total, 80%=alta, 50%=media, 20%=baixa)
  - **Effort**: Person-months de trabalho
- **Example Application**: Feature A: Reach 2000 usuarios, Impact 3, Confidence 80%, Effort 2 person-months. RICE = (2000×3×0.8)/2 = 2400. Feature B: Reach 500, Impact 2, Confidence 90%, Effort 0.5. RICE = (500×2×0.9)/0.5 = 1800. Feature A vence por RICE mesmo sendo mais trabalhosa.
- **Key Metrics**: RICE score por feature; velocidade de entrega; impacto realizado vs. estimado (calibracao)
- **Cross-References**: ICE Score, North Star Metric, OKRs

---

## PART 3: MODELOS DE CRESCIMENTO

### 8. Crossing the Chasm (Geoffrey Moore, 1991)
- **Originator**: Geoffrey Moore ("Crossing the Chasm", 1991)
- **When to Use**: Ao sair do mercado early adopter para mainstream; ao diagnosticar stagnacao de crescimento
- **How to Apply**:
  **Technology Adoption Lifecycle**:
  Innovators (2.5%) → Early Adopters (13.5%) → Early Majority (34%) → Late Majority (34%) → Laggards (16%)
  
  **O Chasm**: Gap entre Early Adopters e Early Majority. Early Adopters toleram imperfeicoes; Early Majority nao. Diferentes necessidades, referencias, e linguagem.
  
  **Estrategia de Crossing**:
  1. Escolha um segmento especifico da Early Majority (bowling pin)
  2. Domine completamente este segmento (nao fragmente)
  3. Use o segmento dominado como referencia para o proximo
  4. Repita — como bolas de boliche caindo
  
  **Sinais de que voce esta no Chasm**:
  - Crescimento estagnou apos fase inicial
  - Clientes early adoram, mas mainstream nao entende
  - Necessidade de "evangelismo" para cada nova venda
- **Example Application**: Salesforce (2000): cruzou o chasm focando em SMB (nao enterprise enorme) com modelo SaaS simples. Dominou SMB → usou como prova para Mid-Market → depois Enterprise.
- **Key Metrics**: Cohort retention por segmento de adocao; CAC por segmento; % do mercado endereçavel capturado
- **Cross-References**: TAM/SAM/SOM, Technology Adoption Lifecycle, Zero to One (Thiel — domine antes de expandir)

---

### 9. Jobs-to-be-Done — JTBD (Clayton Christensen, ~1990s)
- **Originator**: Clayton Christensen (Harvard Business School); formalizado por Tony Ulwick (Outcome-Driven Innovation)
- **When to Use**: Descobrir o real motivo pelo qual clientes "contratam" seu produto; redesenhar posicionamento e features
- **How to Apply**:
  **Framework**: "Customers don't buy products; they hire them to do a job"
  
  1. Identifique o job: "Quando [situacao], quero [motivacao] para [resultado esperado]"
  2. Distinga jobs funcionais (o que precisa ser feito) de jobs emocionais (como quer se sentir) e sociais (como quer ser percebido)
  3. Mapeie a "job story" completa: contexto → job → resultado
  4. Identifique o "progress" que o cliente busca — nao a solucao especifica
  5. Valide: quais alternativas (incluindo nao-consumo) o cliente usa hoje para fazer esse job?
  
  **Switch Interview**: Entreviste clientes que mudaram para ou de seu produto. Pergunte sobre o momento do switch (qual foi o "gatilho"?), o que estava errado com a solucao anterior, o que buscaram antes de encontrar voce.
- **Example Application**: Milkshake de McDonald's: contratado de manha por commuters para tornar o trajeto menos chato e mante-los saciados ate o almoco (job funcional + emocional). Insight: fazer o milkshake mais grosso (duracao mais longa no trajeto) e adicionar frutas (variabilidade). Nao foi insight de "sabor" — foi de "job".
- **Key Metrics**: Job clarity score (0-10 quanto bem o produto faz o job); customer interview insights; feature usage alinhado ao job
- **Cross-References**: First Principles (Thiel/Naval), Product-Market Fit, Crossing the Chasm

---

### 10. Viral Coefficient & Virality Models (David Skok)
- **Originator**: Conceito de matematica epidemiologica (R0); aplicado a produtos por David Skok
- **When to Use**: Avaliar potencial de crescimento viral; projetar crecimento organico; decidir investimento em paid vs. viral
- **How to Apply**:
  **Viral Coefficient (K)** = Convites enviados por usuario × Taxa de conversao dos convites
  - K > 1: crescimento viral exponencial (cada usuario traz mais de 1 novo)
  - K = 1: crescimento linear
  - K < 1: crescimento dependente de aquisicao externa
  
  **Viral Cycle Time**: Tempo medio entre um usuario se juntar e seu usuario convidado se juntar
  (K = 0.7 com ciclo de 1 dia cresce mais rapido que K = 0.7 com ciclo de 30 dias)
  
  **Growth por canal**:
  - Paid: cresce enquanto voce paga (linear)
  - SEO/Content: cresce lentamente, depois compostos
  - Viral: cresce exponencialmente se K > 1
  - Sales: cresce linear com equipe de vendas
  
  Objetivo: mix de canais com pelo menos um com crescimento composto
- **Example Application**: WhatsApp: K proximo a 2 nos primeiros anos (cada usuario convidava em media 2 amigos que ficavam). Resultado: 0 → 450M usuarios em 5 anos com quase zero marketing. O produto E o marketing.
- **Key Metrics**: K-factor; Viral cycle time; % novos usuarios via referral
- **Cross-References**: Growth Loops, Network Effects, PLG, Blitzscaling

---

## PART 4: CRESCIMENTO RESPONSAVEL

### 11. Sustainable Growth Rate (SGR)
- **Originator**: Conceito financeiro classico; aplicado a growth por Ben Horowitz (a16z)
- **When to Use**: Decidir velocidade de crescimento sustentavel sem destruir cultura ou cash; equilibrar burn vs. growth
- **How to Apply**:
  SGR financeiro = ROE × (1 - Payout Ratio)
  
  **Para startups (perspectiva operacional)**:
  1. Identifique o gargalo de crescimento (contratacao, infra, qualidade de produto)
  2. Defina: qual crescimento pode ser absorvido sem degradar o produto/cultura?
  3. Blitzscaling: viola este principio conscientemente (ver Hoffman) quando vantagem de ser first-mover supera o custo da ineficiencia
  4. Crescimento saudavel: voce pode manter cultura, qualidade de produto, e unit economics ao mesmo ritmo de crescimento?
- **Key Metrics**: NPS durante crescimento (nao deve cair mais de 10 pontos); Churn durante crescimento (nao deve subir >2%); Glassdoor rating
- **Cross-References**: Blitzscaling (quando violar), Chouinard's Responsible Growth, Rule of 40

---

## Quick Reference: Growth Model Selector

| Cenario | Framework Primario | Framework Secundario |
|---------|-------------------|---------------------|
| Produto novo, early adopters | Jobs-to-be-Done | Crossing the Chasm |
| Definir a metrica chave | North Star Metric | AARRR |
| Funil vazando, nao sei onde | AARRR diagnostic | ICE Score |
| Quer virality | Viral Coefficient | Growth Loops |
| Quer PLG | Product-Led Growth | Hook Model |
| Priorizar backlog grande | RICE Score | ICE Score |
| Crescer para mainstream | Crossing the Chasm | TAM/SAM/SOM |
| Decidir velocidade | Sustainable Growth Rate | Blitzscaling |
| Criar habito no produto | Hook Model | AARRR Retention |
