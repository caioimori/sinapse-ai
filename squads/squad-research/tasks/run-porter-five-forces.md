---
task: run-porter-five-forces
responsavel: "@competitive-intelligence"
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

# Task: Run Porter Five Forces

## Metadata
- **Squad:** squad-research
- **Agent:** competitive-intelligence (Hawk)
- **Complexity:** COMPLEX
- **Depends on:** map-competitive-landscape
- **Feeds:** evaluate-market-entry (Scope), brand-system/Athena

## Objetivo
Conduzir analise Five Forces de Porter para avaliar atratividade estrutural de uma industria e poder de negociacao de cada forca.

## Entrada
- Industria/mercado a analisar
- Posicao da empresa na industria (ou pretendida)

## Passos

### 1. Rivalidade entre Concorrentes Existentes
- Quantos competidores? (concentracao)
- Crescimento da industria (alto → menos rivalidade)
- Diferenciacao entre players (alta → menos rivalidade)
- Custos fixos (altos → mais rivalidade por volume)
- Barreiras de saida (altas → competidores nao saem, mais rivalidade)
- **Score: BAIXA | MEDIA | ALTA**

### 2. Ameaca de Novos Entrantes
- Barreiras de entrada: capital, tecnologia, regulacao, marca, rede
- Economias de escala dos incumbents
- Acesso a canais de distribuicao
- Retaliacao esperada dos incumbents
- Regulacao governamental
- **Score: BAIXA | MEDIA | ALTA**

### 3. Poder dos Fornecedores
- Concentracao de fornecedores (poucos = mais poder)
- Custo de troca de fornecedor
- Importancia do insumo (critico = mais poder)
- Ameaca de integracao vertical do fornecedor
- Substitutos para o insumo
- **Score: BAIXO | MEDIO | ALTO**

### 4. Poder dos Compradores
- Concentracao de compradores (poucos = mais poder)
- Volume de compra individual
- Custo de troca para o comprador
- Sensibilidade a preco
- Ameaca de integracao vertical do comprador
- Informacao disponivel (mais info = mais poder)
- **Score: BAIXO | MEDIO | ALTO**

### 5. Ameaca de Substitutos
- Disponibilidade de substitutos
- Custo-beneficio do substituto vs produto atual
- Custo de troca para substituto
- Propensao do comprador a substituir
- **Score: BAIXA | MEDIA | ALTA**

### 6. Analise Consolidada

| Forca | Score | Implicacao |
|-------|-------|-----------|
| Rivalidade | | |
| Novos Entrantes | | |
| Poder Fornecedores | | |
| Poder Compradores | | |
| Substitutos | | |
| **Atratividade Geral** | | |

### 7. Implicacoes Estrategicas
- Que forcas trabalham A FAVOR? (explorar)
- Que forcas trabalham CONTRA? (mitigar)
- Como se posicionar para maximizar poder na cadeia?
- Recomendacao: entrar / fortalecer / diversificar / sair

## Saida
- Analise Five Forces completa com scores
- Tabela consolidada
- Implicacoes estrategicas
- Recomendacao de posicionamento

## Validacao
- [ ] 5 forcas analisadas com dados
- [ ] Scores atribuidos com justificativa
- [ ] Implicacoes estrategicas derivadas
- [ ] Recomendacao de posicionamento

---

*Task operada por: competitive-intelligence (Hawk)*
