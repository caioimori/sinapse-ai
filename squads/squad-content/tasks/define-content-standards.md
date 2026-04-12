---
task: define-content-standards
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

# Task: Define Content Standards

> Definir padroes de qualidade e estilo que todo conteudo deve seguir.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-governor (Index) |
| **Trigger** | Setup de projeto ou atualizacao de brand guidelines |
| **Input** | Brand voice (brand-system), pilares, Template Contracts |
| **Output** | Style guide de conteudo com padroes de escrita, formatacao e qualidade |
| **Handoff** | → content-engineer (Arc) e todos os agentes como referencia |
| **Complexity** | medium |

---

## Fundamentacao

Standards sao diferentes de governance: governance define QUEM e QUANDO; standards definem COMO e O QUE. O style guide de conteudo e a biblia de producao: como escrever numeros, como formatar citacoes, quando usar maiusculas, qual o comprimento ideal de frase. Standards previnem inconsistencias micro que se acumulam em desordem macro. Referencia: Mailchimp Content Style Guide (referencia mundial), Apple Style Guide.

---

## Steps

### Step 1: Definir Padroes de Escrita
Voz ativa vs passiva, tamanho ideal de frase, paragrafos curtos, uso de jargao, nivel de linguagem (formal/informal). Ser especifico: "frases de no maximo 20 palavras" nao "frases curtas".

### Step 2: Definir Padroes de Formatacao
Como formatar: numeros (1 ou "um"?), datas, percentuais, links, citacoes, acronimos, listas. Padroes de capitalizacao para titulos (Title Case vs Sentence case).

### Step 3: Definir Padroes Visuais de Texto
Para conteudo visual: fonte minima legivel, contraste de texto, maximo de texto por tela, espacamento entre linhas.

### Step 4: Definir Padroes de CTA
Formato padrao de CTA por tipo (engagement, conversao, share). Verbos preferidos. Posicao padrao.

### Step 5: Definir Padroes de Qualidade Minima
Score minimo para publicacao. Criterios de rejeicao automatica (erros gramaticais, dados sem fonte, claims nao comprovados).

### Step 6: Handoff

```yaml
handoff:
  artifact: "content-standards-{client}.md"
  context: "Standards definidos: {N} regras de escrita, {F} regras de formatacao, score minimo {S}"
  next: "Referencia permanente para Arc e todos os agentes produtores"
```
