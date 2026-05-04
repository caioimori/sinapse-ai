---
task: design-content-series
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

# Task: Design Content Series

> Projetar series de conteudo recorrente que criam expectativa e fidelizam audiencia.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Planejamento editorial ou necessidade de formato recorrente |
| **Input** | Pilares editoriais, formatos disponiveis, frequencia desejada |
| **Output** | Design de serie com conceito, episodios, identidade e regras |
| **Handoff** | → create-editorial-calendar, write-{format}-content |
| **Complexity** | complex |

---

## Fundamentacao

Series criam habito. Um post isolado compete com infinitos outros; uma serie cria expectativa e retorno. "Segunda do Insight", "Case da Semana", "Mito vs Realidade" — sao formatos que a audiencia busca ativamente. Series bem desenhadas reduzem fadiga de decisao (sempre sabemos o que postar segunda-feira) e constroem reconhecimento de formato. Referencia: Joe Pulizzi — "content tilt as a series", Buffer — content series strategy.

---

## Steps

### Step 1: Identificar Oportunidade de Serie
Qual pilar tem sub-temas suficientes para recorrencia? Quais formatos a audiencia mais engaja? Onde ha gap de consistencia no calendario? Uma serie precisa de pelo menos 12 episodios planejados para ser viavel.

### Step 2: Definir Conceito da Serie
Nome memoravel, formato fixo, periodicidade, pilar associado. O conceito deve ser auto-explicativo: ao ler o nome, a audiencia sabe o que esperar.

### Step 3: Projetar Identidade Visual/Verbal
Elementos recorrentes: template visual fixo, hashtag propria, intro/outro padrao, tom especifico. Consistencia visual constroi reconhecimento — a audiencia deve identificar a serie antes de ler o conteudo.

### Step 4: Planejar Primeiros 12 Episodios
Listar temas para os primeiros 12 episodios. Garantir variedade dentro do conceito e progressao de valor (episodios posteriores podem ser mais profundos).

### Step 5: Definir Regras da Serie
Frequencia (semanal, quinzenal), duracao minima/maxima, estrutura fixa (ex: sempre 7 slides, sempre pergunta no final), criterios de descontinuacao (menos de X engajamento por 4 edicoes).

### Step 6: Handoff

```yaml
handoff:
  artifact: "content-series-{nome}.md"
  context: "Serie '{nome}': conceito definido, {N} episodios planejados, frequencia {freq}, pilar {pilar}"
  next: "create-editorial-calendar para incluir serie no calendario"
```
