---
task: assess-purpose-alignment
responsavel: "@yvon-chouinard"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: business_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: purpose_assessment
    tipo: document
    destino: Console

Checklist:
  - "[ ] 4 stakeholders avaliados"
  - "[ ] Mission alignment testado"
  - "[ ] Growth assumptions desafiadas"
  - "[ ] Integrity check completado"
---

# Task: Assess Purpose & Mission Alignment

## Metadata
- **Squad:** squad-council
- **Agent:** Yvon Chouinard
- **Complexity:** Standard

## Objetivo
Avaliar se um negocio esta alinhado com seu proposito e missao. Usar o framework Responsible Company para verificar responsabilidade com todos os 4 stakeholders.

## Passos

### 1. Mission Clarity
- Qual e a missao declarada do negocio?
- As decisoes diarias sao consistentes com essa missao?
- Se a missao desaparecesse, o mundo notaria?

### 2. Four Stakeholders Assessment
| Stakeholder | Responsabilidade | Score (1-5) | Evidencia |
|-------------|-----------------|-------------|-----------|
| Workers | Salarios justos, trabalho significativo | | |
| Customers | Produtos duráveis, marketing honesto | | |
| Community | Sourcing local, grants, ativismo | | |
| Nature | Materiais sustentaveis, economia circular | | |

### 3. Growth Challenge
- O crescimento esta servindo a missao ou consumindo-a?
- O que aconteceria se parasse de crescer AGORA?
- O negocio esta grande o suficiente para cumprir seu proposito?
- "Growth for the sake of growth is the ideology of the cancer cell" — se aplica aqui?

### 4. Quality Over Quantity Check
- Os produtos/servicos sao construidos para durar?
- Existe planned obsolescence?
- O que seria construir para 10 anos ao inves de 2?

### 5. Integrity Test
- Voce tem vergonha de alguma decisao de negocio?
- Voce estaria confortavel explicando suas praticas para seus filhos?
- Se fosse publicado no jornal, tudo estaria OK?
- Voce mataria seu "cash cow" se descobrisse que causa dano?

### 6. Purpose Score
- **ALIGNED** — Missao clara, 4 stakeholders servidos, integridade intacta
- **DRIFTING** — Missao existe mas decisoes divergem, precisa recalibrar
- **MISALIGNED** — Decisoes contradizem missao, crise de integridade
