---
task: create-battle-card
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

# Task: Create Battle Card

## Metadata
- **Squad:** squad-research
- **Agent:** competitive-intelligence (Hawk)
- **Complexity:** STANDARD
- **Depends on:** analyze-competitor-positioning, analyze-competitor-strategy
- **Feeds:** commercial-systems (vendas)

## Objetivo
Criar battle card acionavel para equipe de vendas — documento de 1-2 paginas que arma o vendedor para enfrentar objecoes e comparacoes com competidor.

## Entrada
- Analise de posicionamento do competidor
- Analise estrategica
- Dados de vendas (objecoes comuns, win/loss reasons)

## Passos

### 1. Overview do Competidor (1 paragrafo)
- Quem sao, o que fazem, quanto valem (resumo)
- Posicionamento em 1 frase

### 2. Head-to-Head Comparison

| Dimensao | Nos | Eles |
|----------|-----|------|
| Core offering | | |
| Target principal | | |
| Pricing | | |
| Diferencial chave | | |
| Fraqueza principal | | |

### 3. Quando ELES Ganham (e por que)
- Cenarios onde competidor tem vantagem
- Que tipo de cliente prefere eles
- Que argumento usam que funciona

### 4. Quando NOS Ganhamos (e por que)
- Cenarios onde temos vantagem clara
- Que tipo de cliente prefere nos
- Argumentos vencedores comprovados

### 5. Objecoes Comuns & Respostas

| Objecao | Resposta Recomendada |
|---------|---------------------|
| "Eles sao mais baratos" | [resposta com dados] |
| "Eles tem feature X" | [resposta com alternativa/contexto] |
| "Empresa maior/mais segura" | [resposta com diferencial] |

### 6. Killer Questions
- Perguntas que o vendedor deve fazer ao prospect para expor fraquezas do competidor:
  - "Voce ja perguntou sobre [area onde competidor e fraco]?"
  - "Como eles resolvem [problema que nos resolvemos melhor]?"

### 7. DO & DON'T
- **DO:** Focar em nossos diferenciais reais
- **DO:** Usar dados e cases
- **DON'T:** Falar mal do competidor
- **DON'T:** Mentir sobre features que nao temos
- **DON'T:** Competir em terreno onde somos fracos

## Saida
- Battle card de 1-2 paginas pronta para vendas
- Head-to-head comparison
- Objecoes com respostas
- Killer questions

## Validacao
- [ ] Max 2 paginas (acionavel, nao enciclopedia)
- [ ] Head-to-head honesto (sem desonestidade)
- [ ] Objecoes com respostas testadas
- [ ] Killer questions incluidas

## Handoffs
```yaml
handoff:
  cross_squad:
    - to: "commercial-systems/orchestrator"
      artifact: "battle card completa"
      context: "Para uso direto pela equipe de vendas"
    - to: "copywriting-persuasion/orchestrator"
      artifact: "diferenciais, objecoes, killer questions"
      context: "Para copy que posiciona contra competidores"
```

---

*Task operada por: competitive-intelligence (Hawk)*
