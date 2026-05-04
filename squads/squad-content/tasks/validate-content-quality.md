---
task: validate-content-quality
responsavel: "@content-governor"
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

# Task: Validate Content Quality

> Validar qualidade do conteudo antes da publicacao usando criterios objetivos.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-governor (Index) |
| **Trigger** | Pre-publicacao — gate obrigatorio |
| **Input** | Conteudo finalizado, Template Contract, criterios de qualidade |
| **Output** | Score de qualidade com pass/fail e feedback |
| **Handoff** | → publicacao se pass, content-engineer (Arc) se fail |
| **Complexity** | medium |

---

## Fundamentacao

Qualidade nao e subjetiva quando ha criterios claros. Um checklist de qualidade com criterios objetivos remove viés pessoal e garante padrao minimo. O gate de qualidade e o ultimo checkpoint antes do conteudo representar a marca publicamente. Referencia: Content Marketing Institute — content quality checklist.

---

## Steps

### Step 1: Verificar Espinha Dorsal
TESE clara e defendivel? MECANISMO especifico e ensinavel? PROVA concreta e verificavel? DIRECAO acionavel? Se qualquer componente e fraco, a peca e fraca.

### Step 2: Verificar Template Contract
Todos os campos dentro dos limites? Numero de caracteres, slides, secoes — conforme especificado? Hard fail se fora dos limites.

### Step 3: Verificar Originalidade
O conteudo traz angulo original? Nao e reformulacao de conteudo generico? Nao e copia de concorrente? O teste: "outra marca poderia ter publicado isso?" Se sim, falta originalidade.

### Step 4: Verificar Clareza
Um leitor do publico-alvo entenderia na primeira leitura? Jargao desnecessario? Frases longas demais? Ambiguidades? Medir: Flesch reading ease ou equivalente.

### Step 5: Verificar Acionabilidade
O leitor sabe o que fazer apos consumir? O CTA e claro? O valor prometido foi entregue? Conteudo que promete "5 dicas" deve entregar exatamente 5 dicas acionaveis.

### Step 6: Emitir Score e Veredicto
Score 1-10 (media dos criterios). >= 7: PASS. 5-6: PASS COM RESSALVAS (publicar mas melhorar no proximo). < 5: FAIL (devolver para Arc com feedback).

### Step 7: Handoff

```yaml
handoff:
  artifact: "quality-validation-{peca}.md"
  context: "Qualidade: score {S}/10, veredicto {PASS/FAIL}, {N} criterios avaliados"
  next: "Publicacao se PASS, content-engineer (Arc) se FAIL com feedback especifico"
```
