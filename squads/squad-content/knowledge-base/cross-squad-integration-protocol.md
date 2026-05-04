# Cross-Squad Integration Protocol

> Protocolo de integracao entre content-intelligence e outros squads do ecossistema Sinapse.

---

## Squads Conectados

### Inbound (Recebe de)

| Squad | O Que Recebe | Agente Receptor |
|-------|-------------|-----------------|
| **brand-system** | Brand voice, visual guidelines, posicionamento, tom & voz | Index (para enforcement), Arc (para producao), North (para planejamento) |
| **growth-analytics** | Dados de SEO, keywords, dados de conversao, analytics | Lens (para analise), Morph (para SEO), North (para estrategia) |
| **digital-experience** | UX guidelines, especificacoes de landing pages | Morph (para adaptacao web) |
| **community-engagement** | Feedback de comunidade, dados de sentimento | Radar (como sinal), Lens (para analise) |

### Outbound (Envia para)

| Squad | O Que Envia | Agente Emissor |
|-------|-----------|----------------|
| **digital-experience** | Conteudo para landing pages, blog, email | Arc (produz), Morph (adapta) |
| **growth-analytics** | Dados de performance de conteudo, ROI | Lens (relatorio) |
| **commercial-systems** | Conteudo de produto, cases, materiais de venda | Arc (produz) |
| **community-engagement** | Conteudo para social, UGC curado, temas para comunidade | Arc + Morph (produzem) |
| **copywriting-persuasion** | Briefs de conteudo que precisam de copy persuasiva | North (brief), Nexus (handoff) |
| **brand-system** | Feedback de campo sobre brand voice em acao | Lens (dados), Index (inconsistencias) |

---

## Handoff Protocol

### Formato de Handoff

```yaml
cross_squad_handoff:
  from_squad: "content-intelligence"
  from_agent: "{agente_emissor}"
  to_squad: "{squad_destino}"
  to_agent: "{agente_receptor ou 'orchestrator'}"
  artifact: "{nome_do_artefato}"
  context: "{descricao breve}"
  priority: "{high|medium|low}"
  deadline: "{se aplicavel}"
```

### Regras de Handoff
1. Sempre especificar agente emissor e receptor
2. Incluir artefato completo (nao referencia a artefato)
3. Contexto deve ser auto-contido (receptor nao precisa buscar informacao)
4. Prioridade define SLA de resposta

---

## Dependencias Criticas

| Dependencia | De | Para | Criticidade |
|-------------|-----|------|-------------|
| Brand Voice | brand-system | content-intelligence | CRITICA — sem isso, producao fica off-brand |
| Visual Guidelines | brand-system | content-intelligence | ALTA — consistencia visual |
| SEO Data | growth-analytics | content-intelligence | MEDIA — otimizacao de blog |
| Performance Data | content-intelligence | growth-analytics | ALTA — alimenta dashboard geral |

---

## Fronteiras de Ownership

| Tipo de Conteudo | Owner | Motivo |
|-----------------|-------|--------|
| Blog articles (editorial) | content-intelligence | Conteudo de marca/autoridade |
| Landing page copy | copywriting-persuasion | Copy de conversao |
| Email nurture sequences | copywriting-persuasion | Persuasao sequencial |
| Social media posts | content-intelligence | Conteudo social editorial |
| Newsletter editorial | content-intelligence | Relacionamento com base |
| Newsletter de vendas | copywriting-persuasion | Conversao |
| Case studies | content-intelligence | Prova social editorial |
| Product descriptions | copywriting-persuasion | Copy de produto |

---

## Referências

- Sinapse Cross-Squad Architecture
- brand-system squad.yaml — integration points
