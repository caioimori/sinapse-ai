---
task: resolve-conflict
responsavel: "@sinapse-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: conflict_description
    tipo: string
    origem: "squad orchestrators ou user"
    obrigatorio: true

Saida:
  - campo: resolution
    tipo: document
    destino: "involved squad orchestrators"

Checklist:
  - "[ ] Identificar squads em conflito"
  - "[ ] Analisar domain authority"
  - "[ ] Definir ownership primario"
  - "[ ] Documentar resolucao"
---

# Task: Resolve Cross-Squad Conflict

## Metadata
- **Squad:** squad-sinapse
- **Agent:** Imperator (sinapse-orqx)
- **Complexity:** Advanced

## Objetivo
Resolver conflitos de dominio, handoff ou qualidade entre squads. Quando duas ou mais squads disputam ownership, quando handoffs falham, ou quando deliverables sao inconsistentes, Imperator media e resolve.

## Entrada
- Conflict description
- Squads involved
- Context of the disagreement
- Deliverables in question

## Passos

### 1. Conflict Classification

| Tipo de Conflito | Descricao | Resolucao Padrao |
|-----------------|-----------|-----------------|
| Domain Overlap | 2+ squads reclamam authority sobre o mesmo deliverable | Domain authority matrix |
| Handoff Failure | Output de uma squad nao atende input da proxima | Quality review + revision |
| Quality Dispute | Squad receptora rejeita output da squad emissora | Standards review |
| Timeline Conflict | Squads dependentes com timelines incompativeis | Reprioritization |
| Scope Creep | Squad expande alem do seu dominio | Boundary enforcement |

### 2. Domain Authority Analysis

Princípios de resolucao:
1. **Especialidade prevalece:** A squad cujo dominio e mais central ao deliverable lidera
2. **Quem consome decide o formato:** A squad receptora define os requisitos do handoff
3. **Nenhuma squad trabalha fora do dominio:** Se expandiu, deve delegar

Tabela de autoridade em areas de overlap:

| Area | Squad Primaria | Squad de Apoio |
|------|---------------|----------------|
| Brand voice em copy | brand-system (define) | copywriting-persuasion (executa) |
| Design system tokens | brand-system (define) | digital-experience (implementa) |
| Content SEO | content-intelligence (conteudo) | growth-analytics (SEO tecnico) |
| Ad creative + copy | paid-media (gestao) | copywriting-persuasion (texto) |
| Product pricing | commercial-systems (oferta) | financial-intelligence (modelo) |
| User research | product-systems (discovery) | digital-experience (UX research) |
| Motion in brand | brand-system (brand motion) | creative-animations (implementacao) |
| Pitch narrative | narrative-masters (story) | commercial-systems (sales context) |
| Security in product | cyber-defense (audit) | product-systems (implementation) |

### 3. Resolution

```
CONFLICT RESOLUTION
===================
Conflict: {descricao}
Squads Involved: {squad A} vs {squad B}
Type: {tipo}

ANALYSIS:
- Domain Authority: squad-{x} owns {area} because {razao}
- Supporting Role: squad-{y} contributes {aspecto}

RESOLUTION:
- Primary Owner: squad-{x} / {orchestrator}
- Supporting Squad: squad-{y} / {orchestrator}
- Handoff Definition: {o que passa de quem para quem}
- Quality Standard: {criterio de aceite}

ACTION ITEMS:
1. squad-{x}: {acao}
2. squad-{y}: {acao}
3. Imperator: {monitoramento}

PRECEDENT: This resolution applies to future similar conflicts.
```

### 4. Documentation

Registrar a resolucao para evitar repeticao:
- Adicionar ao knowledge base de cross-squad patterns
- Atualizar ambiguity resolution rules se necessario
- Notificar squad orchestrators envolvidos

## Saida
- Conflict resolution document
- Updated domain authority (if new precedent)
- Action items for each squad
- Prevention recommendation for future

## Validacao
- [ ] Conflito claramente descrito
- [ ] Domain authority analisada com base em principios
- [ ] Resolucao aceita por ambas as squads
- [ ] Precedente documentado
- [ ] Action items claros e assignados
