# Playbook de Otimizacao de Custos

> Taticas praticas de reducao de custos para agencias: vendor negotiation, tool stack optimization, freelancer vs FTE, overhead reduction.

---

## 1. Vendor Negotiation Tactics

### Antes de Negociar

```
1. PESQUISAR alternativas (pelo menos 3 opcoes)
2. DOCUMENTAR uso real (quantos usuarios? % de features usadas?)
3. CALCULAR custo por usuario e comparar com mercado
4. PREPARAR BATNA (Best Alternative to Negotiated Agreement)
5. TIMING: negociar 60-90 dias antes do vencimento
```

### Taticas de Negociacao

```
1. ANNUAL vs MONTHLY:
   Pedir desconto de 15-25% por pagamento anual
   "Se fecharmos anual, qual o melhor preco?"

2. MULTI-YEAR LOCK-IN:
   Oferecer contrato de 2-3 anos por desconto de 20-35%
   Cuidado: avaliar se ferramenta sera necessaria

3. VOLUME DISCOUNT:
   Negociar por quantidade de licencas/seats
   Ponto de negociacao: acima de 10 seats

4. COMPETITIVE BID:
   "Estamos avaliando [Concorrente] que oferece X"
   Funciona melhor se voce REALMENTE testou o concorrente

5. STARTUP/AGENCY PROGRAM:
   Muitos SaaS tem programas especiais para agencias
   Perguntar: "Voces tem programa de parceria para agencias?"

6. PREPAYMENT:
   Oferecer pagamento antecipado por desconto extra

7. FEATURE UNBUNDLING:
   "Nao usamos features X e Y, podemos ter plano customizado?"
```

### Tabela de Desconto Esperado

```
| Tatica | Desconto Tipico |
|--------|----------------|
| Annual billing | 15-25% |
| Multi-year (2 anos) | 20-30% |
| Multi-year (3 anos) | 25-35% |
| Volume (10-50 seats) | 10-20% |
| Volume (50+ seats) | 15-30% |
| Competitive bid | 10-20% |
| Agency program | 20-50% |
| Prepayment | 5-10% |
```

---

## 2. Tool Stack Optimization

### Audit do Tool Stack

```
Para cada ferramenta, responder:
1. Quantos usuarios tem acesso? ___
2. Quantos usam ATIVAMENTE (ultimos 30 dias)? ___
3. Qual % das features e usada? ___
4. Existe ferramenta que ja temos que faz o mesmo? ___
5. Existe alternativa gratis ou mais barata? ___
6. Qual o custo por usuario ativo? ___
```

### Redundancias Comuns em Agencias

```
| Funcao | Ferramentas Redundantes | Consolidar Em |
|--------|------------------------|--------------|
| Project Management | Asana + Monday + Trello | 1 so |
| Comunicacao | Slack + Teams + Discord | 1 so |
| Design | Figma + Sketch + Adobe XD | 1 so |
| CRM | HubSpot + Pipedrive + Salesforce | 1 so |
| Analytics | GA4 + Mixpanel + Amplitude | GA4 + 1 avancado |
| Email Marketing | Mailchimp + SendGrid + ConvertKit | 1 so |
| Video Call | Zoom + Meet + Teams | 1 so (integrado) |
```

### Quick Wins de Economia

```
1. Remover licencas inativas (verifica usuarios que nao logam ha 30 dias)
2. Downgrade de planos nao utilizados (enterprise → pro)
3. Cancelar free trials que viraram planos pagos sem uso
4. Negociar annual billing em renovacoes
5. Consolidar ferramentas redundantes
6. Usar free tiers quando volume permite
```

---

## 3. Freelancer vs FTE — Cost Model

### Comparativo de Custo

```
FTE CLT (Dev Senior):
  Salario: R$ 14.000
  Encargos (~80%): R$ 11.200
  Beneficios (~15%): R$ 2.100
  CUSTO MENSAL: R$ 27.300
  Custo/hora: R$ 163 (168h disponiveis)
  Custo/hora efetivo (75% util): R$ 217

FTE PJ (Dev Senior):
  Nota fiscal: R$ 18.000
  Overhead PJ (~10%): R$ 1.800
  CUSTO MENSAL: R$ 19.800
  Custo/hora: R$ 118
  Custo/hora efetivo (75% util): R$ 157

Freelancer (Dev Senior):
  Rate: R$ 150-250/hora
  So paga quando trabalha
  Custo/hora efetivo: R$ 150-250 (100% util por definicao)
```

### Quando Usar Cada Modelo

```
FTE CLT:
  ✅ Core team, competencias estrategicas
  ✅ Trabalho continuo e previsivel
  ✅ Necessidade de cultura e retenção
  ❌ Projetos pontuais
  ❌ Skills muito especializados usados raramente

FTE PJ:
  ✅ Profissionais senior que preferem PJ
  ✅ Custo menor que CLT com estabilidade
  ✅ Flexibilidade de alocação
  ❌ Riscos trabalhistas se exclusividade
  ❌ Menor vinculo cultural

Freelancer:
  ✅ Picos de demanda
  ✅ Skills especializados temporarios
  ✅ Projetos pontuais de curta duracao
  ❌ Custo hora mais alto
  ❌ Menor controle de qualidade
  ❌ Disponibilidade incerta
```

### Regra de Ouro

```
Se a funcao e necessaria > 70% do tempo → FTE (CLT ou PJ)
Se a funcao e necessaria 30-70% do tempo → PJ ou part-time
Se a funcao e necessaria < 30% do tempo → Freelancer

Mix ideal para agencia:
  70-80% FTE (core team)
  10-20% PJ/contrato (especialistas)
  5-15% Freelancers (picos e nichos)
```

---

## 4. Overhead Reduction Strategies

### Categorias de Overhead

```
1. FACILITIES (tipico 5-15% receita):
   - Coworking vs escritorio proprio
   - Hibrido reduz espaco necessario
   - Renegociar aluguel anualmente

2. ADMIN (tipico 5-10% receita):
   - Automatizar processos manuais (billing, reporting)
   - Terceirizar contabilidade e juridico (vs equipe interna)
   - Usar templates e workflows padronizados

3. FERRAMENTAS (tipico 3-8% receita):
   - Audit trimestral de tool stack
   - Negociar anualmente
   - Eliminar redundancias

4. FOLHA ADMIN (tipico 8-15% receita):
   - Otimizar ratio admin:delivery (target: 1:5 ou melhor)
   - Automatizar antes de contratar
   - Funcoes hibridas (ex: PM que tambem faz account)
```

### Quick Win Matrix

```
| Acao | Economia Estimada | Esforco | Prazo |
|------|------------------|---------|-------|
| Remover licencas inativas | 5-10% ferramentas | Baixo | 1 semana |
| Negociar annual billing | 15-25% vendor | Medio | 1 mes |
| Consolidar ferramentas | 20-40% categoria | Alto | 2-3 meses |
| Migrar para coworking hibrido | 30-50% facilities | Alto | 3-6 meses |
| Automatizar billing | 80% horas manuais | Medio | 1-2 meses |
| Renegociar top 5 vendors | 10-20% cada | Medio | 1-2 meses |
```

---

## 5. Framework de Decisao de Corte

```
Ao decidir cortar um custo, avaliar:

1. IMPACTO NA RECEITA: Este custo gera receita direta?
   Se SIM → cuidado, cortar pode custar mais

2. IMPACTO NA EQUIPE: Afeta produtividade ou moral?
   Se SIM → avaliar alternativa menos impactante

3. REVERSIBILIDADE: Posso voltar atras facilmente?
   Se NAO → testar parcialmente antes

4. ALTERNATIVA: Existe opcao mais barata que mantem o beneficio?
   Se SIM → substituir antes de eliminar

Prioridade de corte:
  1o. Nice-to-have sem impacto (ex: ferramentas nao usadas)
  2o. Custos com alternativas mais baratas
  3o. Overhead reduzivel (facilities, admin)
  4o. ULTIMO: pessoas e custos que geram receita
```
