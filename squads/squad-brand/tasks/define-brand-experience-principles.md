---
task: define-brand-experience-principles
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

# Task: define-brand-experience-principles

## Metadata
- **Agent:** brand-strategist (Athena)
- **Squad:** squad-brand
- **Trigger:** `*define-experience-principles` ou manifesto criado
- **Inputs:** Manifesto, personas, posicionamento
- **Outputs:** Experience principles document

## Description
Define 5-7 principios que guiam TODA interacao da marca com o publico — do website ao atendimento, da embalagem ao email.

## Steps
1. Derivar principios do manifesto e valores
2. Definir 5-7 principios de experiencia:
   - Para cada principio:
     - **Nome:** curto e memoravel (ex: "Surpreender positivamente")
     - **Definicao:** o que significa na pratica
     - **Exemplo:** como se manifesta em um touchpoint real
     - **Metrica de sucesso:** como medir se esta funcionando
     - **Anti-exemplo:** o que viola este principio
3. Aplicar principios por touchpoint:
   - Website: como cada principio se manifesta
   - App/produto: como cada principio se manifesta
   - Atendimento: como cada principio se manifesta
   - Loja fisica (se aplicavel)
   - Embalagem/unboxing
   - Comunicacao (email, social)
4. Criar framework de avaliacao (cada touchpoint avaliado contra principios)
5. Priorizar principios (quais sao inegociaveis vs aspiracionais)

## Validation Criteria
- 5-7 principios distintos e acionaveis
- Cada principio tem definicao, exemplo, metrica e anti-exemplo
- Principios aplicados a pelo menos 4 touchpoints
- Framework de avaliacao e pratico
- Principios refletem personalidade da marca (nao sao genericos)

## Output Format
```markdown
# Experience Principles — {brand_name}

## Principios
### 1. {nome}
- Definicao: ...
- Exemplo: ...
- Metrica: ...
- Anti-exemplo: ...

## Por Touchpoint
### Website
- Principio 1 se manifesta como: ...
...

## Framework de Avaliacao
| Touchpoint | P1 | P2 | P3 | P4 | P5 | Score |
```
