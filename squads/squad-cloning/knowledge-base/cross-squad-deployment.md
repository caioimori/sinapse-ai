# Cross-Squad Deployment — Regras de Deploy de KBs

> Define como, onde e quando deployar KBs gerados pelo pipeline de clonagem
> para os squads destino do ecossistema Sinapse.

---

## Tabela de Deployment

| Tipo de KB gerado | Squad(s) destino | Prioridade |
|-------------------|-----------------|-----------|
| Content patterns, editorial frameworks | squad-content, squad-storytelling | Alta |
| Copy/headline patterns, persuasion frameworks | squad-copy | Alta |
| Business strategy, sales methodology | squad-commercial, squad-council | Alta |
| Growth/marketing patterns, acquisition models | squad-growth, squad-paidmedia | Alta |
| Brand voice patterns, positioning frameworks | squad-brand | Media |
| Product thinking, discovery frameworks | squad-product | Media |
| Research methodology, analysis frameworks | squad-research | Media |
| Design system patterns, UX frameworks | squad-design | Baixa |
| Security frameworks | squad-cybersecurity | Baixa |
| Financial models, pricing strategies | squad-finance | Baixa |

---

## Naming Convention

KBs deployados seguem o padrao:
```
{source-mind-kebab-case}-{topic-kebab-case}.md
```

Exemplos:
- `alex-hormozi-offer-creation-framework.md`
- `russell-brunson-funnel-building-patterns.md`
- `gary-halbert-headline-formulas.md`

---

## Processo de Deploy

### 1. Pre-deploy
- [ ] KB passou na quality checklist
- [ ] Confidence score documentado
- [ ] Squad destino identificado
- [ ] Nao existe KB com nome conflitante no destino

### 2. Deploy
- [ ] Copiar KB para `{squad-destino}/knowledge-base/`
- [ ] Adicionar entrada na secao `knowledge_bases` do `squad.yaml` destino
- [ ] Verificar que formatting esta correto

### 3. Post-deploy
- [ ] Verificar que squad.yaml parse corretamente
- [ ] Documentar deployment no clone project

---

## Resolucao de Conflitos

### KB com nome similar ja existe
- Se conteudo complementar: manter ambos, cross-referenciar
- Se conteudo redundante: merge no existente (adicionar perspectiva do target)
- Se conteudo conflitante: manter ambos com nota de contexto

### Squad destino ja tem muitos KBs
- Priorizar KBs com confidence ≥80%
- KBs [HIPOTESE]-heavy podem esperar upgrade de tier
- Consultar squad orchestrator antes de deploy massivo

---

## Version Tracking

Cada KB deployado deve ter no header:
```markdown
> Deploy: {data}
> Source: squad-cloning/{target-name}
> Clone Tier: {1|2|3}
> Confidence: {score}%
```

Isso permite rastrear origem e atualizar quando o clone e upgraded.

---

## Deployment como SKILL.md (Canal Adicional)

Alem do deploy direto nos squads, KBs podem ser exportados como SKILL.md
para uso em qualquer plataforma compativel (33+ plataformas).

### Quando Usar Cada Canal

| Canal | Caso de Uso | Audiencia |
|-------|------------|----------|
| Deploy em squad (este documento) | Uso interno SINAPSE | Agentes dos squads |
| Export como SKILL.md | Uso cross-platform ou externo | Qualquer usuario com Claude Code/Codex/etc |
| Ambos | Clone de alta demanda | Maximo alcance |

### Pre-requisito para Export como SKILL.md

- Confidence score documentado no frontmatter
- ethical_declaration preenchida (ver `ethical-guidelines.md`)
- Fidelity score >= 70% validado (ver `clone-quality-assurance.md`)

Ver: `skill-standard-for-clones.md` para o processo completo de exportacao.

---

## Governance de Content Decay nos Squads

KBs deployados em squads podem ficar desatualizados quando o pensamento
do original evolui ou quando o mercado muda.

### Protocolo de Review

| Tipo de KB | Frequencia de Review | Responsavel |
|-----------|---------------------|-------------|
| Heuristics taticas (L2) | Semestral | @source-hunter |
| Mental Models (L1) | Anual | @cognitive-extractor |
| Workflows (L3) | Semestral | @cognitive-extractor |
| Communication Style (L4) | Anual | @agent-forger |
| Meta-patterns (L5) | Bienal | @mind-synthesizer |

### Sinais de Decay a Monitorar

- Nova publicacao do original contradizendo KB existente
- Mercado mudou e heuristic ja nao se aplica
- Squad destino reportou respostas inconsistentes com o expected
- Confidence downgrade necessario (nova evidencia contradiz [DIRETO] anterior)
