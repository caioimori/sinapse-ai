---
task: structure-argument-progression
responsavel: "@content-engineer"
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

# Task: Structure Argument Progression

> Projetar a progressao logica de argumentos para conteudo de autoridade e thought leadership.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Conteudo de MEIO de funil, thought leadership, posts de opiniao |
| **Input** | Espinha Dorsal (TESE forte), dados de suporte, contra-argumentos |
| **Output** | Progressao argumentativa com logica, evidencias e transicoes |
| **Handoff** | → write-{format}-content |
| **Complexity** | medium |

---

## Fundamentacao

Conteudo de autoridade nao convence por volume — convence por logica. Uma progressao argumentativa bem construida leva o leitor de "nao concordo" a "nunca tinha pensado assim". A chave e antecipar objecoes e responde-las antes que o leitor as formule. Referencia: Andy Crestodina — content strategy, Daniel Kahneman — thinking fast and slow (vieses cognitivos na persuasao).

---

## Steps

### Step 1: Estabelecer Premissa
Qual e o ponto de partida que a audiencia JA aceita? Comecar do consenso e construir a partir dele. Exemplo: "Todos concordam que conteudo e importante" (premissa) → "Mas a maioria faz conteudo errado" (tensao).

### Step 2: Introduzir Tensao
A tensao entre premissa e tese cria interesse. Mostrar a lacuna entre o que a audiencia acredita e a realidade. Dados comparativos, exemplos contrastantes, paradoxos.

### Step 3: Construir Argumentos em Camadas
Argumento 1 (mais acessivel) → Argumento 2 (mais profundo) → Argumento 3 (mais provocativo). Progressao de complexidade mantem atencao e constroi conviccao gradual.

### Step 4: Antecipar Contra-Argumentos
Para cada argumento: qual e a objecao mais provavel? Abordar proativamente: "Voce pode pensar que X, mas na verdade Y porque Z". Antecipar objecoes constroi credibilidade.

### Step 5: Convergir para Conclusao
Todos os argumentos devem convergir para a TESE da Espinha Dorsal. A conclusao nao e um resumo — e a sintese que torna a tese inevitavel.

### Step 6: Handoff

```yaml
handoff:
  artifact: "argument-progression-{peca}.md"
  context: "Progressao: {N} argumentos, {O} objecoes antecipadas, conclusao convergente"
  next: "write-{formato}-content para escrita final"
```
