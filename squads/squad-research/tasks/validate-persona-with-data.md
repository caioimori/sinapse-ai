---
task: validate-persona-with-data
responsavel: "@audience-intelligence"
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

# Task: Validate Persona with Data

## Metadata
- **Squad:** squad-research
- **Agent:** audience-intelligence (Pulse)
- **Complexity:** STANDARD
- **Depends on:** build-audience-persona
- **Feeds:** persona versionada (v1.0 → v1.1+)

## Objetivo
Validar persona construida contra dados reais para evoluir de hipotese (v1.0) para persona validada (v1.1+).

## Entrada
- Persona v1.0 (hipotese)
- Dados novos (survey, entrevistas, analytics, vendas)

## Passos

### 1. Definir Hipoteses a Validar
- Extrair claims da persona que sao testaveis:
  - "Audience tem idade X" → verificar com dados
  - "Pain principal e Y" → verificar em entrevistas/reviews
  - "Compra por motivo Z" → verificar com vendas
- Listar como hipotese: "Acreditamos que [X], evidencia seria [Y]"

### 2. Coletar Dados de Validacao
- **Quantitativos:** survey direcionada, analytics
- **Qualitativos:** entrevistas (min 5-8), social listening
- **Indiretos:** dados de vendas, support tickets, churn reasons

### 3. Comparar Hipotese vs Realidade

| Aspecto da Persona | Hipotese (v1.0) | Dado Real | Status |
|--------------------|--------------------|-----------|--------|
| Demografia | {hipotese} | {dado} | CONFIRMADO/AJUSTADO/INVALIDADO |
| Pain principal | {hipotese} | {dado} | ... |
| JTBD | {hipotese} | {dado} | ... |
| Motivacao | {hipotese} | {dado} | ... |

### 4. Classificar Resultado
- **CONFIRMADO:** dado suporta hipotese → manter
- **AJUSTADO:** dado parcialmente suporta → refinar
- **INVALIDADO:** dado contradiz → corrigir
- **INCONCLUSO:** dados insuficientes → registrar para proxima validacao

### 5. Atualizar Persona
- Incorporar ajustes e correcoes
- Documentar o que mudou e por que
- Atualizar versao: v1.0 → v1.1 (primeira validacao)
- Registrar confidence level por aspecto

### 6. Planejar Re-validacao
- Que aspectos precisam de mais dados?
- Quando re-validar? (a cada 6 meses ou apos mudanca significativa)
- Que sinais indicariam que persona ficou obsoleta?

## Saida
- Tabela de validacao preenchida
- Persona atualizada (v1.1+) com ajustes documentados
- Plano de re-validacao

## Validacao
- [ ] Hipoteses testadas contra dados reais
- [ ] Persona atualizada com mudancas documentadas
- [ ] Versao incrementada
- [ ] Plano de re-validacao definido

---

*Task operada por: audience-intelligence (Pulse)*
