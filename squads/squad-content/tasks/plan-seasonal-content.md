---
task: plan-seasonal-content
responsavel: "@editorial-strategist"
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

# Task: Plan Seasonal Content

> Planejar conteudo sazonal com antecedencia para datas relevantes ao cliente e ao setor.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | editorial-strategist (North) |
| **Co-agents** | content-engineer (Arc), platform-specialist (Morph) |
| **Trigger** | Planejamento trimestral ou 30 dias antes de data relevante |
| **Input** | Calendario de datas, pilares editoriais, historico de performance sazonal |
| **Output** | Plano sazonal com pecas, angulos e timeline de producao |
| **Handoff** | → content-engineer (Arc) para producao antecipada |
| **Complexity** | medium |

---

## Fundamentacao

Conteudo sazonal funciona quando e original, nao quando e obrigatorio. Postar "Feliz Dia das Maes" sem angulo proprio e ruido. O valor esta em encontrar a conexao autentica entre a data e a marca. Planejamento antecipado permite angulos originais; last-minute forca conteudo generico. Referencia: Content Marketing Institute — seasonal content planning.

---

## Steps

### Step 1: Mapear Datas do Proximo Ciclo
Listar datas: feriados nacionais, datas do setor, eventos relevantes, datas proprietarias da marca, trends previsiveis (volta as aulas, Black Friday, etc). Priorizar por relevancia ao pilar.

### Step 2: Filtrar por Relevancia
Para cada data: conecta com algum pilar? Tem angulo original possivel? Se a resposta for "nao" para ambas, descartar. Nem toda data merece conteudo. Qualidade > quantidade.

### Step 3: Definir Angulo por Data
Para cada data selecionada: qual e o angulo UNICO da marca? Nao "Feliz Natal" — mas "O que o Natal ensina sobre [pilar]". O angulo deve ser incopiavel, conectado com a Big Idea.

### Step 4: Planejar Timeline de Producao
Para cada peca sazonal: data de publicacao, deadline de producao, deadline de revisao, dependencias (design, foto, video). Lead time minimo: 2 semanas para simples, 4 semanas para complexo.

### Step 5: Definir Formatos e Plataformas
Para cada data: qual formato maximiza impacto? Datas emotivas (video/reel), datas educativas (carrossel/blog), datas comerciais (stories/CTA). Definir distribuicao multi-plataforma.

### Step 6: Handoff

```yaml
handoff:
  artifact: "seasonal-plan-{client}-{quarter}.md"
  context: "Plano sazonal: {N} datas selecionadas, {M} descartadas, {P} pecas planejadas, lead time medio {X} dias"
  next: "content-engineer (Arc) para iniciar producao das pecas com maior lead time"
```
