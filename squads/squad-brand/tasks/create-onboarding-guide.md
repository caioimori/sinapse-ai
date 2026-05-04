---
task: create-onboarding-guide
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

# Task: create-onboarding-guide

## Metadata
- **Agent:** brand-compiler (Atlas)
- **Squad:** squad-brand
- **Trigger:** `*create-onboarding-guide`
- **Inputs:** Brandbook, visual guidelines, tom de voz, templates
- **Outputs:** Onboarding guide (10-20 paginas)

## Description
Cria guia de onboarding para novos membros da equipe — como usar a marca no dia-a-dia.

## Steps
1. **Boas-vindas** (1 pagina): historia da marca, proposito, o que nos torna unicos
2. **Visual essencial** (3-4 paginas): como usar o logo (DO/DON'T), cores (hex quick ref), fontes
3. **Tom de voz** (2-3 paginas): como escrever pela marca, exemplos por canal, palavras usar/evitar
4. **Ferramentas e templates** (2 paginas): onde encontrar assets, como usar templates, como solicitar novos
5. **Top 10 DO's e DON'Ts** (1-2 paginas): regras mais importantes em formato rapido
6. **FAQ** (1-2 paginas): perguntas mais comuns sobre uso da marca
7. **Contatos e aprovacao** (1 pagina): quem contactar, processo de aprovacao
8. Tom do documento: acessivel, didatico, com exemplos visuais
9. Formato: PDF interativo + versao web

## Validation Criteria
- 10-20 paginas (nao mais)
- Tom acessivel (nao tecnico demais)
- Exemplos visuais em cada secao
- FAQ com perguntas reais
- Autocontido (nao precisa ler o brandbook completo)

## Output Format
Onboarding guide PDF + web version.
