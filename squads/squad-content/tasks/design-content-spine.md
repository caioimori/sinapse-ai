---
task: design-content-spine
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

# Task: Design Content Spine

> Projetar a Espinha Dorsal (Content Spine) que sustenta qualquer peca de conteudo independente de formato.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Co-agents** | editorial-strategist (North) |
| **Trigger** | Inicio de producao de qualquer peca de conteudo |
| **Input** | Brief de conteudo, pilar editorial, estagio de funil, audiencia-alvo |
| **Output** | Espinha Dorsal completa: TESE + MECANISMO + PROVA + DIRECAO |
| **Handoff** | → design-narrative-arc ou write-{format}-content |
| **Complexity** | complex |

---

## Fundamentacao

A Espinha Dorsal e o motor format-agnostic que alimenta qualquer conteudo. Antes de escrever qualquer linha, a estrutura precisa estar solida. A Espinha Dorsal tem 4 componentes inegociaveis: (1) TESE — o claim central, a afirmacao que voce defende; (2) MECANISMO — como funciona, o "porque" por tras; (3) PROVA — evidencia concreta (dado, caso, exemplo); (4) DIRECAO — proximo passo para a audiencia. Sem Espinha Dorsal, conteudo vira texto bonito sem substancia. Referencia: Andy Crestodina — orbiting the giant hairball of content, Ann Handley — everybody writes.

---

## Steps

### Step 1: Definir a TESE
Qual e o claim central da peca? Uma afirmacao clara, defendível e provocativa. Deve ser expressa em 1 frase. Exemplos: "Postar todo dia nao funciona se voce nao tem nada a dizer" ou "A melhor estrategia de conteudo e nao ter uma".

### Step 2: Articular o MECANISMO
Como/por que a tese funciona? O mecanismo e a explicacao. Pode ser um framework, um principio, uma analogia, um modelo mental. O mecanismo transforma opiniao em insight. Deve ser concreto e ensinavel.

### Step 3: Construir a PROVA
Que evidencia suporta a tese + mecanismo? Dados de pesquisa, case real, exemplo do setor, experiencia propria documentada, analogia de outro dominio. Prova fraca = conteudo fraco. Minimo 1 prova forte por peca.

### Step 4: Estabelecer a DIRECAO
O que a audiencia faz depois de consumir? Pode ser: reflexao (muda perspectiva), acao (testa algo), engajamento (comenta/compartilha), aprofundamento (le mais), conversao (compra/agenda). A direcao deve ser explicita, nao implicita.

### Step 5: Validar Coerencia
A TESE leva ao MECANISMO? O MECANISMO e sustentado pela PROVA? A PROVA direciona naturalmente para a DIRECAO? Se alguma conexao esta fraca, a Espinha Dorsal precisa ser ajustada.

### Step 6: Calibrar para Formato
A mesma Espinha Dorsal gera um carrossel (tese no slide 1, mecanismo em 3-5 slides, prova em 1-2 slides, direcao no ultimo), um blog (tese na intro, mecanismo nos subtitulos, prova nos paragrafos, direcao na conclusao), ou um reel (tese no hook, mecanismo no corpo, prova como overlay, direcao no CTA).

### Step 7: Handoff

```yaml
handoff:
  artifact: "content-spine-{peca}.md"
  context: "Espinha Dorsal: TESE '{tese}', MECANISMO '{mecanismo}', PROVA '{tipo_prova}', DIRECAO '{tipo_direcao}'"
  next: "design-narrative-arc para estrutura narrativa ou write-{formato} para producao direta"
```
