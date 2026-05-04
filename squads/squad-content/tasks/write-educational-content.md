---
task: write-educational-content
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

# Task: Write Educational Content

> Escrever conteudo educativo que ensina algo acionavel e posiciona a marca como autoridade.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Producao de conteudo pilar educativo (qualquer formato) |
| **Input** | Espinha Dorsal, nivel de profundidade, formato, audiencia |
| **Output** | Conteudo educativo completo com framework/passos acionaveis |
| **Handoff** | → content-governor (Index) para validacao |
| **Complexity** | medium |

---

## Fundamentacao

Conteudo educativo e o maior gerador de saves e shares — as duas metricas que mais sinalizam qualidade para algoritmos. Mas "educativo" nao significa "academico". O melhor conteudo educativo e: especifico (nao generico), acionavel (pode ser aplicado hoje), progresso (leva de A para B). Referencia: Ann Handley — "utility is the new currency", Jay Baer — Youtility.

---

## Steps

### Step 1: Definir o Que a Audiencia Aprende
Resultado especifico: "Apos consumir isso, a audiencia saberá fazer X". Se o resultado e vago, o conteudo sera vago. Especificidade e a regra.

### Step 2: Estruturar em Passos/Framework
Conteudo educativo funciona melhor em formato estruturado: "5 passos para...", "Framework de 3 pilares", "Metodo XYZ". Frameworks sao memoraveis e compartilhaveis.

### Step 3: Incluir Exemplos Concretos
Para cada passo/conceito: pelo menos 1 exemplo real. Exemplos ancoram o abstrato no concreto. Preferir exemplos do setor do cliente.

### Step 4: Adicionar "Nao Faca Isso"
Contrastar o que fazer com o que NAO fazer. Erros comuns sao tao educativos quanto melhores praticas. O contraste reforça a licao.

### Step 5: Fechar com Acao Imediata
O proximo passo deve ser factivel HOJE. Nao "repense sua estrategia" — mas "abra seu ultimo post e verifique se tem X". Acao imediata = valor percebido.

### Step 6: Handoff

```yaml
handoff:
  artifact: "educational-content-{peca}.md"
  context: "Educativo: '{tema}', {N} passos, {E} exemplos, formato {formato}"
  next: "content-governor (Index) para validacao de qualidade"
```
