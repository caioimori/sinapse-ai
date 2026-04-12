---
task: diagnose-team-dysfunction
responsavel: "@patrick-lencioni"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: team_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: dysfunction_diagnosis
    tipo: document
    destino: Console

Checklist:
  - "[ ] 5 disfuncoes avaliadas em ordem"
  - "[ ] Disfuncao primaria identificada"
  - "[ ] Working genius gaps mapeados"
  - "[ ] Plano de intervencao criado"
---

# Task: Diagnose Team Dysfunction

## Metadata
- **Squad:** squad-council
- **Agent:** Patrick Lencioni
- **Complexity:** Standard

## Objetivo
Diagnosticar disfuncoes de equipe usando a piramide de Lencioni e o Working Genius. Identificar a disfuncao primaria (de baixo para cima) e criar plano de intervencao.

## Passos

### 1. Five Dysfunctions Assessment (bottom-up)
| Nivel | Disfuncao | Score (1-5) | Sintomas | Presente? |
|-------|-----------|-------------|----------|-----------|
| 1 (base) | Absence of Trust | | Invulnerabilidade, defensividade | |
| 2 | Fear of Conflict | | Harmonia artificial, reunioes tedias | |
| 3 | Lack of Commitment | | Ambiguidade, falta de buy-in | |
| 4 | Avoidance of Accountability | | Padroes baixos, ninguem confronta | |
| 5 (topo) | Inattention to Results | | Ego > time, departamento > empresa | |

**Regra:** Resolver de BAIXO para CIMA. Nao tente corrigir accountability sem confianca.

### 2. Identify Primary Dysfunction
- Qual e o PRIMEIRO nivel (mais baixo) que falha?
- Esta e a prioridade — nao adianta subir sem resolver a base
- Exemplos de intervencao para cada nivel

### 3. Working Genius Assessment
| Genius | Membros com este Genius | Gap? |
|--------|------------------------|------|
| Wonder (questionar, imaginar) | | |
| Invention (criar solucoes) | | |
| Discernment (avaliar intuitivamente) | | |
| Galvanizing (mobilizar pessoas) | | |
| Enablement (dar suporte) | | |
| Tenacity (completar, finalizar) | | |

**Gap analysis:** Falta algum genius critico na equipe?

### 4. Meeting Audit
| Tipo | Acontece? | Eficaz? | Problema |
|------|-----------|---------|----------|
| Daily Check-In (5-10 min) | | | |
| Weekly Tactical (45-90 min) | | | |
| Monthly Strategic (2-4 hrs) | | | |
| Quarterly Off-Site (1-2 dias) | | | |

### 5. Intervention Plan
- Disfuncao primaria: acao imediata
- Working genius gap: contratacao ou reatribuicao
- Meetings: redesign do cadence
- Hire check: proxima contratacao deve ser humble, hungry, smart
- Timeline: 30/60/90 dias
