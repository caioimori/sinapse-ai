---
task: identify-inflection-points
responsavel: "@trend-forecaster"
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

# Task: Identify Inflection Points

## Metadata
- **Squad:** squad-research
- **Agent:** trend-forecaster (Horizon)
- **Complexity:** STANDARD
- **Depends on:** industry trends, macro forces
- **Feeds:** product-systems, @architect, @pm

## Objetivo
Identificar pontos de inflexao estrategicos (Andy Grove) — momentos onde mudanca fundamental ocorre e redefine as regras do jogo.

## Entrada
- Tendencias de industria analisadas
- Macro forces (PESTEL)
- Historico de inflexoes do setor
- Sinais fracos detectados

## Passos

### 1. Estudar Inflexoes Passadas do Setor
- Quais foram os pontos de inflexao historicos? (ultimos 10-20 anos)
- O que causou cada um? (tecnologia, regulacao, comportamento, crise)
- Quem PREVIU e se beneficiou?
- Quem NAO PREVIU e foi prejudicado?
- Que SINAIS existiam ANTES da inflexao? (em retrospecto)
- Padrao comum: sinais existiam 2-5 anos antes

### 2. Framework de Deteccao (Grove's 10X Force)
Uma forca se torna 10X quando muda drasticamente:
- **Poder de competidores existentes** (novo player dominante?)
- **Poder de complementadores** (ecossistema mudando?)
- **Poder de clientes** (expectativas transformadas?)
- **Poder de fornecedores** (dependencias alteradas?)
- **Regras do jogo** (regulacao, tecnologia, modelo de negocio?)
- **Impacto de substitutos** (alternativa radicalmente diferente?)
- Quando QUALQUER uma dessas forcas atinge 10X magnitude → inflexao

### 3. Candidatos a Inflexao Futura
Para cada candidato identificado:
- **Descricao:** Que mudanca fundamental pode ocorrer?
- **Forca 10X:** Qual forca esta amplificando?
- **Timeline estimado:** Quando pode ocorrer?
- **Probabilidade:** Alta / Media / Baixa
- **Impacto se ocorrer:** 1-5 (escala de disrupcao)
- **Sinais atuais:** Que evidencia temos HOJE?

### 4. Pre-Mortem por Inflexao
Para cada candidato de alta probabilidade:
- Imaginar que a inflexao JA OCORREU
- O que mudou no mercado?
- Quem sao os novos winners?
- O que deveríamos ter feito ANTES?
- Que acoes podemos tomar AGORA?

### 5. Strategic Response Framework
- **Se inflexao CONFIRMAR:** Plano de acao proativo
- **Se inflexao RETARDAR:** Manter opcionalidade, continuar monitorando
- **Se inflexao NAO OCORRER:** Que aprendizados retiramos?
- Para cada: early indicators que confirmam/refutam

## Cross-Squad Handoffs
```yaml
handoffs:
  - to: product-systems
    delivers: inflexoes que afetam roadmap
    format: inflection cards com timeline e impacto
  - to: commercial-systems
    delivers: inflexoes que afetam GTM
    format: implicacoes comerciais por cenario
```

## Saida
- Inflexoes historicas analisadas (padroes)
- Candidatos a inflexao futura priorizados
- Pre-mortem por inflexao de alta probabilidade
- Strategic response framework
- Early indicators para monitoramento

## Validacao
- [ ] Inflexoes historicas estudadas
- [ ] 10X forces avaliadas
- [ ] Candidatos a inflexao identificados e priorizados
- [ ] Pre-mortem executado para top candidates
- [ ] Strategic response framework definido

---

*Task operada por: trend-forecaster (Horizon)*
