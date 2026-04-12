---
task: define-sustainability-branding
responsavel: "@brand-culture-architect"
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

# Task: Define Sustainability Branding Strategy

> Definir como a marca comunica sustentabilidade e ESG de forma autêntica e verificável.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-culture-architect (Ethos) |
| **Co-agents** | brand-strategist (Athena) posicionamento, brand-identity-designer (Iris) visual |
| **Trigger** | Quando marca tem compromissos ESG ou quer comunicar sustentabilidade |
| **Input** | Propósito, valores, práticas atuais de sustentabilidade, relatórios ESG |
| **Output** | `sustainability-branding.md` |
| **Handoff** | → brand-strategist (Athena) para integração + brand-compiler (Atlas) |
| **Referências** | B Corp Standards, GRI (Global Reporting Initiative), UN SDGs, ISO 14001, EU Green Claims Directive |

---

## Fundamentação

Greenwashing é o maior risco para marcas que comunicam sustentabilidade sem lastro. A EU Green Claims Directive (2024) e regulações crescentes exigem claims verificáveis. A estratégia deve seguir o princípio: **"Do good, then talk about it"** — nunca o contrário.

```
ANTI-GREENWASHING FRAMEWORK:

  ❌ CLAIM → sem ação → GREENWASHING
  ✅ AÇÃO → verificável → COMUNICAÇÃO AUTÊNTICA

  Credibilidade = Ação Real × Verificabilidade × Consistência
```

---

## Steps

### Step 1: Auditar Práticas Reais de Sustentabilidade
Antes de comunicar QUALQUER coisa, mapear o que a marca REALMENTE faz:

| Pilar ESG | Prática Atual | Evidência | Verificável? | Score (0-5) |
|-----------|--------------|-----------|-------------|-----------|
| **Environmental** | | | | |
| Pegada de carbono | {medida? neutralizada?} | {relatório} | {sim/não} | |
| Materiais sustentáveis | {% reciclado, orgânico} | {certificações} | {sim/não} | |
| Gestão de resíduos | {política de zero waste} | {dados} | {sim/não} | |
| Energia renovável | {% da operação} | {contratos} | {sim/não} | |
| **Social** | | | | |
| Diversidade & inclusão | {dados da equipe} | {relatório D&I} | {sim/não} | |
| Condições de trabalho | {certificações, práticas} | {auditorias} | {sim/não} | |
| Comunidade local | {investimento, programas} | {relatório social} | {sim/não} | |
| Supply chain ética | {auditorias de fornecedores} | {certificações} | {sim/não} | |
| **Governance** | | | | |
| Transparência | {relatórios públicos} | {GRI, integrated} | {sim/não} | |
| Ética corporativa | {código de conduta} | {compliance} | {sim/não} | |
| Anti-corrupção | {políticas} | {canais} | {sim/não} | |

**Regra:** Só comunicar pilares com score ≥3 E verificáveis. Score <3 = trabalhar internamente PRIMEIRO.

### Step 2: Definir Nível de Comunicação

| Nível | Descrição | Quando | Risco |
|-------|-----------|--------|-------|
| **1. Silêncio** | Não comunica sustentabilidade | Práticas insuficientes | Zero |
| **2. Factual** | Comunica dados verificáveis, sem claims | Práticas em desenvolvimento | Baixo |
| **3. Compromisso** | Comunica metas + progresso | Jornada clara com milestones | Médio |
| **4. Liderança** | Sustentabilidade é pilar da marca | Prática + certificação + influência | Médio-Alto |
| **5. Ativismo** | Marca lidera mudança na indústria | Referência no setor | Alto |

**Exemplos por nível:**
- Nível 2: "100% das nossas embalagens são recicláveis" (dado verificável)
- Nível 3: "Até 2030, seremos carbono neutro. Hoje estamos em 40% do caminho"
- Nível 4: Patagonia — sustentabilidade é o propósito
- Nível 5: Tony's Chocolonely — luta ativa contra trabalho escravo no cacau

### Step 3: Criar Framework Anti-Greenwashing

**Teste de Autenticidade para cada claim:**

| Teste | Pergunta | Pass/Fail |
|-------|----------|-----------|
| **Materialidade** | Esta prática é material para nosso negócio? | |
| **Verificabilidade** | Temos dados/certificações que comprovam? | |
| **Especificidade** | O claim é específico (não vago como "eco-friendly")? | |
| **Completude** | Estamos contando a história completa (não cherry-picking)? | |
| **Comparabilidade** | Se comparamos com benchmark, é honesto? | |
| **Atualidade** | Os dados são atuais (últimos 12 meses)? | |

**Palavras PROIBIDAS (sem evidência específica):**

| Proibido | Por que | Substituir por |
|----------|---------|---------------|
| "Eco-friendly" | Vago, imensurável | "Feito com X% material reciclado" |
| "Sustentável" (genérico) | Vago demais | "{ação específica verificável}" |
| "Verde" | Marketing vazio | "{dado concreto}" |
| "Natural" | Subjetivo | "{ingredientes específicos}" |
| "Consciente" | Não verificável | "{prática específica}" |
| "Carbono neutro" (sem certificação) | Pode ser greenwashing | "Compensamos X toneladas via {programa certificado}" |
| "100% sustentável" | Impossível/misleading | "{% específico de práticas sustentáveis}" |

### Step 4: Definir Visual de Sustentabilidade

| Elemento | Guideline | Evitar |
|----------|----------|-------|
| **Cores** | Usar paleta da marca (NÃO adicionar verde genérico) | Verde genérico que não é da paleta |
| **Iconografia** | Ícones específicos (reciclável, orgânico, certificação) | Folhas/árvores genéricas |
| **Fotografia** | Realista, documentária, das práticas reais | Stock photos genéricas de natureza |
| **Certificações** | Logos oficiais em tamanho regulatório | Certificações fake ou expiradas |
| **Infográficos** | Dados reais, fontes citadas | Gráficos misleading |
| **Embalagem** | Instruções claras de descarte | Símbolos ambíguos |

**Regra visual:** Sustentabilidade NÃO é uma sub-brand separada. É integrada na identidade visual principal.

### Step 5: Criar Estrutura de Relatório

**Relatório de Sustentabilidade da Marca:**

```markdown
## 1. Compromisso da Marca
{Declaração de propósito + metas}

## 2. Environmental
### O que fazemos
{Práticas com dados}
### Progresso
{Métricas vs metas}
### Próximos passos
{Roadmap}

## 3. Social
### O que fazemos
{Práticas com dados}
### Progresso
{Métricas vs metas}
### Próximos passos
{Roadmap}

## 4. Governance
### O que fazemos
{Práticas com dados}

## 5. Certificações e Parceiros
{Lista com logos e datas de validade}

## 6. Metas e Roadmap
{Timeline visual com milestones}

## 7. Disclaimers e Metodologia
{Como medimos, quem audita, limitações}
```

### Step 6: Definir Comunicação por Canal

| Canal | O que comunicar | Tom | Frequência |
|-------|----------------|-----|-----------|
| Website (página dedicada) | Relatório completo + dados | Factual, transparente | Atualizar trimestralmente |
| Embalagem | Claims específicos + instruções de descarte | Informativo, claro | Permanente |
| Social media | Progress updates + behind the scenes | Autêntico, humano | Mensal |
| Relatório anual | Overview completo + métricas | Formal, data-driven | Anual |
| PR | Milestones alcançados | News-worthy, factual | Por milestone |
| Produto | Materiais, origem, impacto | Direto, no ponto de venda | Permanente |
| Interna | Progresso + engajamento | Motivacional, participativo | Quinzenal |

### Step 7: Definir Métricas e Reporting

| Métrica | Baseline | Target | Frequência |
|---------|----------|--------|-----------|
| Pegada de carbono (tCO2e) | | | Anual |
| % materiais sustentáveis | | | Trimestral |
| % energia renovável | | | Trimestral |
| Diversidade na liderança | | | Semestral |
| NPS sustentabilidade (percepção) | | | Anual |
| Brand lift sustentabilidade | | | Anual |
| Certificações ativas | | | Tracking contínuo |
| Investimento ESG (% da receita) | | | Anual |

### Step 8: Handoff
```yaml
handoff:
  to: brand-strategist (Athena)
  artifact: sustainability-branding.md
  context: "Estratégia de sustentabilidade com anti-greenwashing, comunicação por canal e métricas"
  also_to:
    - brand-identity-designer (Iris): "Visual de sustentabilidade integrado na identidade"
    - brand-compiler (Atlas): "Incluir como capítulo no brandbook"
    - brand-growth-strategist (Catalyst): "Integrar ESG no brand valuation"
  next: "Athena integra no posicionamento. Atlas documenta no brandbook."
```
