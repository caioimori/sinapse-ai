---
task: purpose-profit-alignment
responsavel: "@yvon-chouinard"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: business_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: alignment_report
    tipo: document
    destino: Console

Checklist:
  - "[ ] Proposito articulado com clareza"
  - "[ ] Conflitos proposito-lucro identificados"
  - "[ ] Alinhamento projetado"
  - "[ ] Metricas duplas (proposito + lucro) definidas"
---

# Task: Purpose-Profit Alignment

## Metadata
- **Squad:** squad-council
- **Agent:** Yvon Chouinard
- **Complexity:** Standard

## Objetivo
Alinhar proposito e lucro de forma que se reforcem mutuamente — nao como forcas opostas. Usar a filosofia de Chouinard onde o negocio e uma ferramenta para avancar o proposito, nao o contrario. "I never wanted to be a businessman. But I'm committed to using business to inspire and implement solutions." — Chouinard

## Pre-Condicoes
- Negocio com proposito definido (ou desejo de defini-lo)
- Dados financeiros basicos disponiveis
- Disposicao para questionar trade-offs assumidos

## Passos

### 1. Articular o Proposito
Diferenciar tipos de proposito:
| Tipo | Exemplo | Autenticidade |
|------|---------|--------------|
| Marketing (cosmetic) | "Somos verdes" (sem acao) | Falso — nao contar |
| Filantropia (bolted-on) | Doa 1% mas core business prejudica | Parcial |
| Integrado (embedded) | Proposito guia decisoes de negocio | Autentico |
| Existencial (foundational) | Empresa existe PARA o proposito | Chouinard-level |

Onde esta a empresa? Onde quer chegar?

### 2. Mapear Conflitos Atuais
| Area | Decisao pelo Lucro | Decisao pelo Proposito | Conflito Real? |
|------|-------------------|----------------------|---------------|
| Materiais | Mais barato | Mais sustentavel | |
| Cadeia de suprimentos | Mais eficiente | Mais justa | |
| Crescimento | Mais rapido | Mais responsavel | |
| Marketing | Mais consumo | Consumo consciente | |
| Pessoas | Custo otimizado | Bem-estar priorizado | |

### 3. Identificar "Proposito como Vantagem Competitiva"
Onde proposito GERA lucro (nao compete com ele):
| Proposito | Como Gera Receita | Evidencia |
|-----------|------------------|-----------|
| Qualidade duradoura | Clientes leais, willingness to pay premium | |
| Transparencia | Confianca, brand equity | |
| Tratamento justo de funcionarios | Retencao, produtividade | |
| Sustentabilidade | Regulacao favoravel, custos futuros menores | |
| Comunidade | Word-of-mouth, advocacy | |

Chouinard: "Every time I do the right thing, it ends up making us more money."

### 4. Projetar Business Model Alinhado
| Componente | Versao Maximiza-Lucro | Versao Proposito-Integrado | Impacto Financeiro |
|-----------|---------------------|--------------------------|-------------------|
| Produto | | | |
| Pricing | | | |
| Distribuicao | | | |
| Marketing | | | |
| Operacoes | | | |
| Supply chain | | | |

### 5. Definir "Profit Floor" e "Purpose Ceiling"
- Profit Floor: lucro minimo necessario para sustentabilidade do negocio
- Purpose Ceiling: maximo de proposito sem comprometer viabilidade
- Sweet Spot: onde lucro suficiente habilita maximo proposito

```
$$$  |         /--- Purpose Ceiling
     |        /
     |   ====/ ← Sweet Spot
     |  /
     | / Profit Floor ---
     |___________________ Purpose
```

### 6. Criar Metricas Duplas
Para cada area, uma metrica de lucro E uma de proposito:
| Area | Metrica de Lucro | Metrica de Proposito | Target Integrado |
|------|-----------------|---------------------|-----------------|
| Produto | Revenue | Impacto social/ambiental | |
| Pessoas | Custo por funcionario | Employee wellbeing score | |
| Clientes | LTV | Customer purpose alignment | |
| Operacoes | Margem | Sustainability score | |
| Comunidade | Brand value | Community impact | |

### 7. Aplicar o "Patagonia Test"
Perguntas que Chouinard faria:
- Voce compraria seu proprio produto se nao fosse sua empresa?
- Seus netos teriam orgulho de como voce ganha dinheiro?
- Se todos os negocios operassem como o seu, o mundo seria melhor?
- Voce esta extraindo ou regenerando?
- "Going back to a simpler life based on living by doing is the most rewarding life"

### 8. Projetar Roadmap de Alinhamento
| Fase | Acao | Impacto Proposito | Impacto Financeiro | Timeline |
|------|------|------------------|-------------------|---------|
| 1. Quick wins | Mudancas sem custo | Medio | Neutro | 0-3M |
| 2. Investments | Mudancas com investimento | Alto | Negativo curto prazo | 3-12M |
| 3. Transformation | Mudanca de modelo | Transformacional | Positivo longo prazo | 12-36M |

## Output
```yaml
alignment_report:
  business: ""
  purpose_statement: ""
  purpose_type: "cosmetic/bolted-on/embedded/foundational"
  conflicts: []
  purpose_as_advantage: []
  profit_floor: ""
  dual_metrics:
    - area: ""
      profit_metric: ""
      purpose_metric: ""
  alignment_roadmap: []
  patagonia_test_score: "/5"
```

## Validacao
- [ ] Proposito articulado e tipo classificado
- [ ] Conflitos proposito-lucro mapeados honestamente
- [ ] Areas onde proposito gera lucro identificadas
- [ ] Business model alinhado projetado
- [ ] Metricas duplas definidas para todas as areas
- [ ] Patagonia Test aplicado
- [ ] Roadmap de alinhamento com timeline
