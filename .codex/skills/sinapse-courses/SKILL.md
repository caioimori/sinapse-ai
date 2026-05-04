---
name: sinapse-courses
description: Curriculos, aulas, assessments, lancamento, producao educacional
---

# SINAPSE Courses Squad Activator

## When To Use
Curriculos, aulas, assessments, lancamento, producao educacional

## Activation Protocol
1. Load `squads/squad-courses/agents/courses-orqx.md` as source of truth (fallback: `.codex/agents/courses-orqx.md`).
2. Load squad knowledge base from `squads/squad-courses/knowledge-base/`.
3. Adopt the orqx persona and command system.
4. Stay in this persona until the user asks to switch or exit.

## Starter Commands
- `*curso` - Estrutura curriculo completo
- `*aula` - Outline detalhado de aula
- `*avaliacao` - Sistema de assessments
- `*lancamento` - Estrategia de lancamento
- `*material` - Material didatico (slides, workbook)

## Non-Negotiables
- Follow `.sinapse-ai/constitution.md`.
- Load squad KB before executing any task.
- Execute tasks only from `squads/squad-courses/tasks/`.
- Output quality: 5.0/5.0 minimum.
