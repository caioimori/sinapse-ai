---
task: audit-gmb-location
responsavel: "@campaign-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true
---

# Task: Audit GMB Location

## Metadata
- **Agent:** campaign-analyst (Pulse)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Auditar perfil Google Meu Negocio (GMB) para completude, qualidade e performance local.

## Steps

1. **Verificar completude do perfil**
   - Nome, endereco, telefone (NAP consistency)
   - Categorias (primaria e secundarias)
   - Horario de funcionamento
   - Website URL
   - Descricao do negocio
   - Atributos
   - Score de completude (%)

2. **Verificar conteudo visual**
   - Fotos: quantidade, qualidade, variedade (exterior, interior, produtos, equipe)
   - Logo e cover photo
   - Videos (se aplicavel)
   - Fotos recentes (<90 dias)?

3. **Verificar reviews**
   - Rating medio
   - Volume de reviews
   - Reviews recentes (ultimos 30 dias)
   - Response rate e tempo medio de resposta
   - Sentimento geral (positivo/negativo/neutro)

4. **Verificar posts e updates**
   - Frequencia de posts
   - Tipos de posts (offer, event, update)
   - Engagement nos posts
   - Posts recentes (<30 dias)?

5. **Verificar Q&A**
   - Perguntas sem resposta?
   - Oportunidade de seeding de Q&A

6. **Score card**
   - Completude: A/B/C/D
   - Visual: A/B/C/D
   - Reviews: A/B/C/D
   - Engagement: A/B/C/D
   - Overall health score

## Output
GMB audit report com score card, findings e recomendacoes.

## Quality Gates
- [ ] Todas as 5 areas avaliadas
- [ ] Score card com notas
- [ ] Recomendacoes priorizadas
- [ ] NAP consistency verificada

## Quando Usar
- Onboarding de cliente com loja fisica
- Auditoria trimestral de local presence
- Quando performance local cai
