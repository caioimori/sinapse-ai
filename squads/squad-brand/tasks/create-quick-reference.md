---
task: create-quick-reference
responsavel: "@brand-compiler"
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

# Task: create-quick-reference

## Metadata
- **Agent:** brand-compiler (Atlas)
- **Squad:** squad-brand
- **Trigger:** `*create-quick-reference`
- **Inputs:** Visual guidelines, logo, paleta, tipografia, tom de voz
- **Outputs:** Quick reference card (2-4 paginas PDF)

## Description
Cria quick reference card condensado — para o dia-a-dia quando ninguem vai abrir 150 paginas.

## Steps
1. Pagina 1 (frente):
   - Logo principal + 3 variacoes essenciais
   - Paleta primaria (5-7 cores com hex)
   - Tipografia (display + body com exemplos)
2. Pagina 2 (verso):
   - Tom de voz (3 regras rapidas + 1 exemplo cada)
   - DO's e DON'Ts visuais (3 de cada com miniatura)
   - Contatos para duvidas
3. Se 4 paginas: adicionar grid, spacing e componentes top 3
4. Layout limpo, escaneavel em 30 segundos
5. Imprimivel em A4 (frente e verso)
6. Cores CMYK para impressao

## Validation Criteria
- 2-4 paginas maximo
- Informacao essencial APENAS (sem detalhes)
- Escaneavel em 30 segundos
- Imprimivel em A4

## Output Format
Quick reference PDF (A4) + versao digital.
