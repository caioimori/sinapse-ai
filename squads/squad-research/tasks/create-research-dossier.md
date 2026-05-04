---
task: create-research-dossier
responsavel: "@deep-researcher"
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

# Task: Create Research Dossier

## Metadata
- **Squad:** squad-research
- **Agent:** deep-researcher (Sage)
- **Complexity:** COMPLEX
- **Depends on:** conduct-deep-research
- **Feeds:** Loom (para formatacao), Hawk (se competidor)

## Objetivo
Criar dossie completo sobre entidade (empresa, pessoa, mercado, tecnologia), consolidando toda informacao relevante em documento de referencia.

## Entrada
- Entidade a pesquisar
- Escopo: que aspectos cobrir
- Uso pretendido (due diligence, partnership, competicao, investimento)

## Passos

### 1. Definir Escopo do Dossie
- Tipo de entidade: empresa | pessoa | tecnologia | mercado | setor
- Aspectos a cobrir (template por tipo):
  - **Empresa:** historia, fundadores, produto, mercado, financials, cultura, press
  - **Pessoa:** background, expertise, publicacoes, rede, posicoes, controversias
  - **Tecnologia:** estado da arte, players, adocao, limitacoes, roadmap
  - **Mercado:** sizing, players, trends, barriers, opportunities

### 2. Coleta Sistematica
- Fontes publicas: website, LinkedIn, Crunchbase, Glassdoor, press
- Fontes de industria: Gartner, Forrester, CB Insights
- Social: mencoes, sentimento, reputacao
- Legal/Regulatorio: patentes, processos, compliance
- Financeiro (se disponivel): funding, revenue, growth

### 3. Organizacao por Secao
- **Overview:** resumo em 1 paragrafo
- **Historia & Contexto:** timeline de eventos-chave
- **Oferta:** produtos/servicos, diferenciais
- **Mercado & Posicao:** onde se posiciona, share, competidores
- **Forcas & Fraquezas:** SWOT condensado
- **Dados Financeiros:** se publicos/disponiveis
- **Press & Reputacao:** cobertura de midia, sentimento
- **Riscos & Red Flags:** o que prestar atencao
- **Oportunidades:** para nos, baseado no uso pretendido

### 4. Analise Critica
- O que os dados dizem vs o que a entidade diz sobre si mesma
- Consistencia entre discurso e pratica
- Red flags identificados
- Gaps de informacao

### 5. Recomendacao Final
- Baseado no uso pretendido:
  - Due diligence: GO | CAUTION | NO-GO
  - Partnership: PURSUE | EXPLORE | AVOID
  - Competicao: THREAT LEVEL (1-5)
  - Investimento: recomendacao com justificativa

## Saida
- Dossie completo (10-30 paginas dependendo do escopo)
- Executive summary (1 pagina)
- SWOT condensado
- Recomendacao final

## Validacao
- [ ] Todas as secoes preenchidas (ou gaps declarados)
- [ ] Fontes citadas e classificadas
- [ ] SWOT com implicacoes
- [ ] Red flags identificados
- [ ] Recomendacao final com justificativa

---

*Task operada por: deep-researcher (Sage)*
