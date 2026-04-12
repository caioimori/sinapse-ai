# Extraction Patterns — Como Identificar Elementos Cognitivos

> Padroes praticos para identificar mental models, heuristics, workflows,
> communication patterns e meta-patterns em conteudo bruto.

---

## Pattern 1: Identificando Mental Models

### Sinais linguisticos
- "Eu penso em X como Y" (analogia explicita)
- "X e como Y" (metafora estrutural)
- "Meu framework de..." (modelo nomeado)
- "O mundo funciona assim..." (worldview)
- "A forma como eu vejo isso e..." (lens)

### Sinais comportamentais
- Usa a mesma analogia em contextos diferentes
- Referencia o mesmo framework repetidamente
- Estrutura argumentos sempre no mesmo padrao
- Categoriza problemas da mesma forma

### Red flags (falsos positivos)
- Citacao de terceiros sem endorsement pessoal (nao e model do target)
- Analogia usada 1 vez sem recorrencia (pode ser casual)
- Framework generico de livro sem adaptacao pessoal

---

## Pattern 2: Identificando Heuristics

### Sinais linguisticos
- "Minha regra e..." / "Minha regra numero 1..."
- "Eu sempre..." / "Eu nunca..."
- "Se X acontece, eu faco Y"
- "Antes de X, eu verifico Y"
- "Quando vejo X, sei que Z"
- Numeros e thresholds ("30%", "3 vezes", "nunca menos que")

### Sinais comportamentais
- Decisoes consistentes em situacoes similares
- Conselhos repetidos para diferentes pessoas
- Mesma resposta para o mesmo tipo de pergunta

### Construindo trigger/action/rationale
```
Trigger: A situacao que ativa a regra
Action: O que a pessoa faz/recomenda
Rationale: Por que (nas palavras da pessoa, nao inventado)
```

---

## Pattern 3: Identificando Workflows

### Sinais linguisticos
- "Primeiro eu faco X, depois Y, depois Z"
- "Meu processo tem N etapas"
- "Passo 1:... Passo 2:..."
- "Comeco por... depois... finalmente..."
- "Minha rotina matinal e..."

### Sinais comportamentais
- Descreve o mesmo processo em multiplas ocasioes
- Ensina seu processo para outros
- Referencia etapas especificas

### Reconstrucao de workflow implicito
As vezes a pessoa nao descreve o processo explicitamente, mas de varios
exemplos concretos e possivel reconstruir o workflow abstrato:
1. Coletar 3+ exemplos de como fez a mesma coisa
2. Identificar steps comuns
3. Ordenar
4. Marcar como [INFERIDO] (nao [DIRETO])

---

## Pattern 4: Identificando Communication Patterns

### Vocabulario
- Palavras usadas 5+ vezes mais que a media
- Jargao proprio ou redefinicoes de termos comuns
- Expressoes assinatura

### Tom
- Escala: formal ←→ informal
- Escala: tecnico ←→ popular
- Escala: direto ←→ diplomatico
- Escala: serio ←→ humoristico
- Uso de dados vs historias vs analogias

### Storytelling
- Como abre (hook, pergunta, dados, historia pessoal?)
- Como desenvolve (linear, circular, problema-solucao?)
- Como fecha (call-to-action, reflexao, humor?)
- Usa experiencia pessoal como evidencia?

### Catchphrases
- Frases que repete frequentemente
- Closings de video/podcast
- Slogans pessoais

---

## Pattern 5: Identificando Meta-patterns

### Sinais
- Mesmo principio aparece em Layer 1 E Layer 2
- Heuristic que e consequencia logica de um mental model
- Workflow que implementa um mental model
- Contradicao que se resolve em nivel mais abstrato

### Tecnica de subida de abstracao
1. Listar todos os mental models
2. Agrupar por tema
3. Para cada grupo: qual o principio que une?
4. Esse principio aparece tambem em heuristics ou workflows?
5. Se sim: meta-pattern encontrado

### Core Axiom
O principio mais fundamental, de onde todos os outros derivam:
- Aparece em 3+ layers
- Explica multiplos mental models
- E consistente com as heuristics
- Se removido, o perfil perde coerencia

---

## Red Flags Gerais

| Red flag | Significado | Acao |
|----------|-----------|------|
| Conselho generico ("trabalhe duro") | Nao e especifico da pessoa | Descartar |
| Ideia mencionada 1x sem contexto | Pode ser casual | Marcar [HIPOTESE] |
| Terceiro atribui, pessoa nao confirma | Fonte secundaria | Marcar [HIPOTESE] |
| Contradicao entre livro e video recente | Evolucao de pensamento | Documentar ambos |
| Muitas [HIPOTESE], poucas [DIRETO] | Conteudo insuficiente | Considerar downgrade |
