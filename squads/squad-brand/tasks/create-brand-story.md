---
task: create-brand-story
responsavel: "@brand-strategist"
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

# Task: create-brand-story

## Metadata
- **Agent:** brand-strategist (Athena)
- **Squad:** squad-brand
- **Trigger:** `*create-brand-story` ou manifesto criado
- **Inputs:** Discovery report, manifesto, positioning, historia dos fundadores
- **Outputs:** Brand story document

## Description
Cria a narrativa da marca — a historia que conecta emocionalmente publico e proposito. Usa storytelling estrategico para criar significado.

## Steps
1. Definir arco narrativo da marca:
   - **Origem:** como e por que a marca nasceu (momento fundador)
   - **Conflito:** qual problema/injustica motivou a criacao
   - **Resolucao:** como a marca resolve esse problema
   - **Futuro:** para onde a marca esta caminhando
2. Aplicar Hero's Journey da marca:
   - O mundo antes da marca (status quo insatisfatorio)
   - O chamado (insight ou momento de virada)
   - A jornada (desafios enfrentados)
   - A transformacao (o que mudou)
   - O retorno (o que a marca traz ao mundo)
3. Criar Founder Story (se aplicavel):
   - Motivacao pessoal, momento eureka, primeiros passos, superacao
4. Criar Customer Stories Framework:
   - Template: [cliente] tinha [problema], descobriu [marca], agora [transformacao]
5. Criar Brand Milestones Timeline (marcos importantes)
6. Escrever versoes da historia:
   - Ultra-curta (1 paragrafo — para bios e about)
   - Curta (meia pagina — para website)
   - Completa (2-3 paginas — para brandbook)

## Validation Criteria
- Historia emociona E e estrategicamente alinhada
- Arco narrativo e completo (origem→conflito→resolucao→futuro)
- Founder story e autentica (baseada em fatos reais)
- 3 versoes de tamanho diferentes
- Customer stories framework e reutilizavel

## Output Format
```markdown
# Brand Story — {brand_name}

## Arco Narrativo
### Origem
...
### Conflito
...
### Resolucao
...
### Futuro
...

## Founder Story
{narrativa pessoal}

## Customer Stories Framework
Template: ...
Exemplo: ...

## Versoes
### Ultra-curta (1 paragrafo)
...
### Curta (meia pagina)
...
### Completa (2-3 paginas)
...

## Milestones
- {ano}: {marco}
```
