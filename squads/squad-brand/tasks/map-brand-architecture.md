---
task: map-brand-architecture
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

# Task: map-brand-architecture

## Metadata
- **Agent:** brand-strategist (Athena)
- **Squad:** squad-brand
- **Trigger:** `*map-architecture` ou message house definido
- **Inputs:** Briefing, portfolio de produtos/servicos, positioning
- **Outputs:** Brand architecture map

## Description
Mapeia a arquitetura de marca — como a marca mae se relaciona com sub-marcas, produtos e servicos.

## Steps
1. Inventariar portfolio: produtos, servicos, linhas, sub-marcas existentes
2. Identificar tipo de arquitetura adequado:
   - **Monolitica (Branded House):** tudo sob uma marca (Google, Virgin, FedEx)
   - **Endorsed:** sub-marcas endorsadas pela mae (Marriott → Courtyard by Marriott)
   - **House of Brands:** marcas independentes (P&G → Tide, Pampers, Gillette)
   - **Hybrid:** combinacao (Alphabet → Google, YouTube, Waymo)
3. Mapear hierarquia visual: qual marca aparece maior, como se relacionam
4. Definir regras de naming para novos produtos/servicos
5. Definir regras de co-branding (parceirias, sponsorships)
6. Definir regras de endorsed brands (quando e como endorsar)
7. Criar diagrama de arquitetura (mapa visual hierarquico)
8. Documentar logica de extensao (como adicionar novos items)

## Validation Criteria
- Tipo de arquitetura justificado estrategicamente
- Hierarquia clara e sem ambiguidade
- Regras de naming sao aplicaveis e escaláveis
- Diagrama e compreensivel em 30 segundos

## Output Format
```markdown
# Brand Architecture — {brand_name}

## Tipo
{monolitica|endorsed|house-of-brands|hybrid} — justificativa

## Hierarquia
{diagrama textual}

## Regras de Naming
1. ...

## Regras de Co-Branding
1. ...

## Extensibilidade
{como adicionar novos produtos/servicos}
```
