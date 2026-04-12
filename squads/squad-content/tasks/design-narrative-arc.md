---
task: design-narrative-arc
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

# Task: Design Narrative Arc

> Projetar o arco narrativo que transforma a Espinha Dorsal em uma jornada envolvente para a audiencia.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Apos design da Espinha Dorsal, para pecas que requerem narrativa estruturada |
| **Input** | Espinha Dorsal, formato da peca, audiencia-alvo |
| **Output** | Arco narrativo com abertura, desenvolvimento, climax e resolucao |
| **Handoff** | → write-{format}-content |
| **Complexity** | medium |

---

## Fundamentacao

Informacao sem narrativa nao retém atencao. O arco narrativo e o que transforma "dados sobre produtividade" em "a historia de como uma rotina mudou tudo". Mesmo conteudo tecnico ganha quando estruturado como jornada. O arco classico (heroi → desafio → transformacao) funciona em qualquer formato. Referencia: Donald Miller — Building a StoryBrand, Kurt Vonnegut — shapes of stories, Robert McKee — Story.

---

## Steps

### Step 1: Definir o Gancho (Hook)
Os primeiros 3 segundos/linhas determinam se a audiencia continua. O hook deve criar tensao cognitiva: surpresa, contradicao, pergunta aberta, dado chocante, ou promessa de valor. O hook conecta com a TESE da Espinha Dorsal.

### Step 2: Construir a Tensao
Apos o hook, expandir o problema/desafio. A audiencia deve sentir a dor antes de ver a solucao. Sem tensao, nao ha interesse na resolucao. Tecnicas: contraste antes/depois, pergunta retórica, scenario hipotetico.

### Step 3: Entregar o Insight (Climax)
O momento "aha!" — onde o MECANISMO da Espinha Dorsal e revelado. Deve ser especifico, acionavel e surpreendente. Evitar generalidades: "Planeje melhor" e fraco; "Use a regra 3-3-3 para planejamento" e forte.

### Step 4: Fornecer Prova
Ancorar o insight com PROVA da Espinha Dorsal. Timing importa: prova DEPOIS do insight reforça; prova ANTES do insight justifica. Escolher baseado no formato e no ceticismo esperado da audiencia.

### Step 5: Fechar com Direcao
A DIRECAO da Espinha Dorsal como fechamento do arco. O leitor deve sair com clareza sobre o proximo passo. CTA explicito ou implicito, dependendo do estagio de funil.

### Step 6: Handoff

```yaml
handoff:
  artifact: "narrative-arc-{peca}.md"
  context: "Arco narrativo: Hook tipo '{tipo}', tensao via '{tecnica}', climax em '{formato}'"
  next: "write-{formato}-content para execucao da escrita"
```
