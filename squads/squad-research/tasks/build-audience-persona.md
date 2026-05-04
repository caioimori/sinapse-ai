---
task: build-audience-persona
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

# Task: Build Audience Persona

## Metadata
- **Squad:** squad-research
- **Agent:** audience-intelligence (Pulse)
- **Complexity:** COMPLEX
- **Depends on:** dados de audiencia (analytics, CRM, social)
- **Feeds:** content-intelligence/North, copywriting-persuasion, commercial-systems

## Objetivo
Construir persona de audiencia baseada em DADOS (nao ficcao), documentando quem e, o que quer, como se comporta e por que toma decisoes.

## Entrada
- Dados disponiveis (analytics, CRM, surveys, social, vendas)
- Contexto: para que a persona sera usada (content, copy, produto, vendas)
- Segmento especifico (se ja identificado)

## Passos

### 1. Coleta de Dados
- **Quantitativos:** analytics (demografia, device, comportamento), CRM (perfil, historico), vendas (ticket, ciclo, objecoes)
- **Qualitativos:** reviews, comentarios, support tickets, social listening
- **Internos:** entrevistas com equipe de vendas/suporte (quem fala com cliente)
- REGRA: zero dado inventado. Se nao ha dado, declarar como hipotese

### 2. Analise Demografica
- Idade, genero, localizacao, renda (range)
- Cargo/funcao, setor, empresa (B2B)
- Escolaridade, estado civil (se relevante)
- NOTA: demografia e DESCRICAO, nao MOTIVACAO

### 3. Analise Psicografica
- Valores e crencas (o que importa de verdade)
- Aspiracoes e medos (o que busca, o que evita)
- Fontes de informacao (onde aprende, quem segue)
- Estilo de vida (como gasta tempo e dinheiro)
- Referencia: Schwartz Values Theory, VALS framework

### 4. Jobs To Be Done (Christensen)
- **Job Funcional:** O que precisa ser feito? Que tarefa contrata?
- **Job Emocional:** Como quer se sentir? Que emocao busca?
- **Job Social:** Como quer ser percebido? Que status almeja?
- **Hiring criteria:** Por que contrataria NOSSA solucao?
- **Firing criteria:** Por que demissionaria nossa solucao?
- **Compensating behaviors:** Que gambiarra usa hoje?

### 5. Pain-Gain Matrix
- **Dores (Pains):** frustrações, riscos, obstaculos, medos
- **Ganhos (Gains):** desejos, resultados esperados, surpresas positivas
- Ranquear por intensidade (1-5) e frequencia
- Conectar: qual dor nossa solucao resolve? Qual ganho entrega?

### 6. Documentacao da Persona
- Nome (ficticio mas representativo)
- Foto representativa (stock, nao pessoa real)
- Quote que resume a mentalidade (extraida de dados reais)
- Resumo em 1 paragrafo
- Dados demograficos chave
- Psychographics (valores, aspiracoes, medos)
- JTBD (3 dimensoes)
- Pain-Gain matrix
- Fontes de informacao e influencia
- Jornada de compra resumida
- Objecoes comuns

### 7. Versionamento
- Persona v1.0: baseada em dados disponiveis (hipotese informada)
- Definir metodo de validacao (survey, entrevistas, A/B testing)
- Persona v1.1+: ajustada apos validacao

## Saida
- Persona documentada (usar audience-persona-template)
- Pain-Gain matrix preenchida
- JTBD mapeados (3 dimensoes)
- Metodo de validacao definido
- Versao declarada (v1.0 = hipotese)

## Validacao
- [ ] Persona baseada em dados (fontes citadas)
- [ ] Demografia + Psicografia + JTBD cobertos
- [ ] Pain-Gain matrix com intensidade ranqueada
- [ ] Versao declarada (v1.0 = hipotese, v1.1+ = validada)
- [ ] Metodo de validacao definido

## Handoffs
```yaml
handoff:
  cross_squad:
    - to: "content-intelligence/North"
      artifact: "persona-doc, JTBD, pain-gain matrix"
      context: "Para planejamento editorial baseado em audiencia real"
    - to: "copywriting-persuasion/orchestrator"
      artifact: "psychographics, pain points, linguagem da audiencia"
      context: "Para copy que ressoa com motivacoes reais"
    - to: "commercial-systems/orchestrator"
      artifact: "JTBD, objecoes, hiring/firing criteria"
      context: "Para abordagem comercial alinhada"
    - to: "brand-system/Athena"
      artifact: "valores da audiencia, aspiracoes"
      context: "Para posicionamento de marca que conecta"
  cross_squad:
    - to: "research-intelligence/research-orqx"
      when: "Pesquisa de mercado para validar persona"
      context: "Hipoteses de persona a validar com dados de mercado"
```

---

*Task operada por: audience-intelligence (Pulse)*
