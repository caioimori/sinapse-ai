---
task: create-content-brief
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

# Task: Create Content Brief

> Criar brief estruturado que guia a producao de qualquer peca de conteudo.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Co-agents** | editorial-strategist (North) |
| **Trigger** | Antes da producao de qualquer peca — prerequisito universal |
| **Input** | Tema, pilar, formato, plataforma, audiencia, funil |
| **Output** | Brief completo com todos os parametros de producao |
| **Handoff** | → design-content-spine ou write-{format}-content |
| **Complexity** | simple |

---

## Fundamentacao

Brief e o contrato entre estrategia e execucao. Sem brief, cada produtor interpreta o tema de forma diferente. O brief nao e criativo — e parametrico. Ele define O QUE produzir com clareza suficiente para que qualquer produtor (humano ou AI) chegue ao resultado certo. Referencia: Content Marketing Institute — content brief template.

---

## Steps

### Step 1: Definir Parametros Basicos
Titulo de trabalho, pilar editorial, sub-tema, estagio de funil, plataforma de publicacao, formato, audiencia-alvo especifica.

### Step 2: Definir Objetivo da Peca
O que esta peca deve FAZER? Opcoes: educar, inspirar, converter, engajar, posicionar autoridade. Objetivo unico — peca com 3 objetivos nao atinge nenhum.

### Step 3: Especificar Angulo
Qual e o angulo especifico? Nao "falar sobre produtividade" — mas "por que a produtividade obsessiva e o novo burnout". O angulo e o diferencial entre conteudo generico e conteudo memoravel.

### Step 4: Listar Referencias e Dados
Quais fontes, dados, exemplos devem ser incluidos? Quais evitar? Concorrentes ja publicaram sobre o tema? Qual o angulo deles (para diferenciacao)?

### Step 5: Definir Restricoes
Limites do Template Contract: caracteres, slides, duracao, formato de CTA. Tom e voz esperados. Palavras a evitar. Compliance se aplicavel.

### Step 6: Handoff

```yaml
handoff:
  artifact: "content-brief-{peca}.md"
  context: "Brief: '{titulo}', pilar {pilar}, formato {formato}, funil {estagio}, objetivo {objetivo}"
  next: "design-content-spine para estruturar Espinha Dorsal ou write-{formato} para producao direta"
```
