---
task: create-business-cards
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

# Task: create-business-cards

## Metadata
- **Agent:** brand-collateral-designer (Vellum)
- **Squad:** squad-brand
- **Trigger:** `*create-business-cards`
- **Inputs:** Visual guidelines, paleta CMYK, tipografia, logo specs
- **Outputs:** Business card design (frente e verso) + mockup + specs

## Description
Cria design de business card profissional com specs de producao.

## Steps
1. Definir dimensao: 85x55mm (padrao internacional) ou 3.5x2in (US)
2. Layout frente: logo principal + nome da empresa + tagline (opcional)
3. Layout verso: nome do colaborador + cargo + telefone + email + site + social
4. Aplicar paleta em CMYK (nao RGB)
5. Aplicar tipografia do sistema (body font para contatos, display para nome)
6. Definir bleed: 3mm em todos os lados
7. Definir safe zone: 5mm do trim para texto/logo
8. Verificar legibilidade em tamanho real (texto minimo 7pt)
9. Gerar mockup 3D via IA generativa
10. Documentar specs para grafica: CMYK, 300 DPI, PDF/X-1a, fontes em curvas

## Validation Criteria
- Dimensoes corretas com bleed e safe zone
- CMYK (nao RGB)
- 300 DPI minimo
- Texto legivel em tamanho real (>= 7pt)
- Mockup 3D realista

## Output Format
Design frente/verso + mockup + spec sheet para grafica.
