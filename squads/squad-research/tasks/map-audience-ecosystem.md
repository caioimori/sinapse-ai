---
task: map-audience-ecosystem
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

# Task: Map Audience Ecosystem

## Metadata
- **Squad:** squad-research
- **Agent:** audience-intelligence (Pulse)
- **Complexity:** STANDARD
- **Depends on:** build-audience-persona
- **Feeds:** content-intelligence/North, brand-system/Athena

## Objetivo
Mapear o ecossistema completo da audiencia — onde vivem, quem influencia, que consomem, em quem confiam — para informar estrategia de presenca e parcerias.

## Entrada
- Persona(s) definida(s)
- Dados de social listening
- Dados de analytics (referral sources)

## Passos

### 1. Fontes de Informacao
- Onde a audiencia APRENDE? (blogs, podcasts, newsletters, cursos)
- Que publicacoes leem? Que canais seguem?
- Que conferencias/eventos frequentam?
- Que comunidades participam? (Discord, Slack, Facebook Groups, Reddit)

### 2. Influenciadores & Autoridades
- Quem seguem? (criadores, especialistas, thought leaders)
- Em quem CONFIAM para recomendacoes?
- Macro-influenciadores (alcance) vs Micro (engajamento) vs Nano (confianca)
- Que tipo de conteudo desses influenciadores mais ressoam?

### 3. Produtos & Servicos Adjacentes
- Que outros produtos/servicos a audiencia usa?
- Que stack de ferramentas tem? (B2B)
- Que marcas admiram (mesmo fora do nosso setor)?
- Oportunidades de partnership/co-marketing

### 4. Comportamento de Plataforma
- Onde passam MAIS TEMPO? (Instagram, LinkedIn, TikTok, YouTube)
- Que plataforma usam para que proposito?
- Comportamento por plataforma (lurker? engager? creator?)
- Migracao entre plataformas (tendencias)

### 5. Mapa Visual do Ecossistema
- Centro: audiencia
- Primeiro anel: plataformas onde vive
- Segundo anel: influenciadores e autoridades
- Terceiro anel: marcas e produtos adjacentes
- Conexoes: como se relacionam entre si

### 6. Implicacoes Estrategicas
- Onde devemos ESTAR PRESENTE?
- Com quem devemos CRIAR PARCERIAS?
- Que LINGUAGEM do ecossistema devemos adotar?
- Que GAPS no ecossistema podemos preencher?

## Saida
- Mapa do ecossistema da audiencia (visual + descritivo)
- Lista de influenciadores chave
- Oportunidades de presenca e parceria
- Recomendacoes estrategicas

## Validacao
- [ ] Fontes de informacao mapeadas
- [ ] Influenciadores identificados e classificados
- [ ] Produtos adjacentes mapeados
- [ ] Mapa visual criado
- [ ] Recomendacoes estrategicas definidas

---

*Task operada por: audience-intelligence (Pulse)*
