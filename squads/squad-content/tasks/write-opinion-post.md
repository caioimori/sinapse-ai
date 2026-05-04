---
task: write-opinion-post
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

# Task: Write Opinion Post

> Escrever post de opiniao/thought leadership que posiciona a marca como autoridade no setor.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Tema quente do setor, debate publico, ou estrategia de thought leadership |
| **Input** | Espinha Dorsal (TESE forte), progressao argumentativa, brand voice |
| **Output** | Post de opiniao completo com posicionamento claro e argumentacao |
| **Handoff** | → content-governor (Index) para validacao de brand consistency |
| **Complexity** | medium |

---

## Fundamentacao

Posts de opiniao sao o conteudo de maior risco E maior recompensa. Uma opiniao forte gera polarizacao — atrai quem concorda e repele quem discorda. Isso e desejavel: marcas que tentam agradar todos nao se destacam. A chave e opinar com SUBSTANCIA, nao com provocacao vazia. Referencia: Mark Schaefer — known, Jay Acunzo — break the wheel.

---

## Steps

### Step 1: Validar Posicao da Marca
A opiniao esta alinhada com os valores da marca? A marca pode sustentar essa posicao publicamente? Teste: se um jornalista perguntar "por que voce disse isso?", ha resposta solida?

### Step 2: Abrir com Posicao Clara
Nada de "muitos acham que..." — comecar com a opiniao direta: "Eu acredito que X porque Y." Ambiguidade mata posts de opiniao. A audiencia deve saber a posicao nos primeiros 2 segundos.

### Step 3: Argumentar com Substancia
Usar a progressao argumentativa (structure-argument-progression): premissa aceita → tensao → argumentos em camadas → contra-argumentos antecipados → conclusao inevitavel.

### Step 4: Incluir Vulnerabilidade
Opiniao + vulnerabilidade = autenticidade. "Eu costumava pensar diferente, mas mudei de ideia quando..." mostra evolucao, nao fraqueza. A audiencia confia mais em quem admite mudanca.

### Step 5: Fechar com Convite ao Debate
Nao fechar com certeza absoluta — fechar com convite: "E voce, concorda? O que faria diferente?" Debate gera engajamento e comentarios longos que o algoritmo favorece.

### Step 6: Handoff

```yaml
handoff:
  artifact: "opinion-post-{peca}.md"
  context: "Post de opiniao: posicao '{tese}', {N} argumentos, tom {tom}"
  next: "content-governor (Index) para validacao de brand consistency e compliance"
```
