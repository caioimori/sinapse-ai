---
task: create-signage
responsavel: "@brand-collateral-designer"
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

# Task: create-signage

## Metadata
- **Agent:** brand-collateral-designer (Vellum)
- **Squad:** squad-brand
- **Trigger:** `*create-signage`
- **Inputs:** Visual guidelines, logo, paleta, localizacao/tipo
- **Outputs:** Signage design + mockup ambiental + specs

## Description
Cria design de signage e environmental branding para espacos fisicos.

## Steps
1. Mapear touchpoints fisicos: fachada, recepcao, wayfinding, salas, elevadores, estacionamento
2. Definir materiais por tipo: ACM (fachada), acrilico (recepcao), vinil (wayfinding), LED (destaque)
3. Aplicar logo respeitando escala (visibilidade a distancia: 1cm no cartao ≠ 1m na fachada)
4. Definir iluminacao: backlit (noturno), frontlit (diurno), nao-iluminado (interno)
5. Definir wayfinding system: setas, pictos, nomenclatura de espacos
6. Gerar mockups ambientados via IA (fachada real, recepcao, corredor)
7. Documentar specs: material, dimensoes, fixacao, iluminacao, cores (RAL para pintura)

## Validation Criteria
- Touchpoints principais cobertos
- Escala adequada por tipo (legibilidade a distancia)
- Materiais especificados
- Mockups ambientados realistas

## Output Format
Design por touchpoint + mockups ambientais + specs de producao.
