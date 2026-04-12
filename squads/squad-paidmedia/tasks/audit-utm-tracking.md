---
task: audit-utm-tracking
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: campaign_urls
    tipo: list
    origem: "Google Ads + Meta Ads"
    obrigatorio: true

Saida:
  - campo: utm_audit_report
    tipo: document
    destino: "Lighthouse + Pulse"
---

# Task: Audit UTM Tracking

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Auditar UTM parameters em todas as URLs de campanha para garantir consistencia e rastreabilidade.

## Steps

1. **Coletar todas as URLs ativas**
   - Final URLs de Google Ads
   - Link URLs de Meta Ads
   - Landing page URLs de outras plataformas

2. **Verificar parametros obrigatorios**
   - utm_source: presente e consistente (google, facebook, instagram, linkedin)
   - utm_medium: presente e consistente (cpc, paid-social, display, shopping)
   - utm_campaign: presente e descritivo
   - utm_content: presente para diferenciar ads
   - utm_term: presente para keywords (Google Search)

3. **Verificar consistencia**
   - Mesmo fonte = mesmo utm_source (nao misturar "google" com "Google" com "adwords")
   - Nomenclatura padronizada: lowercase, hifens (nao underscores ou spaces)
   - Template UTM documentado e seguido

4. **Verificar auto-tagging**
   - Google Ads: auto-tagging habilitado (gclid)?
   - Meta Ads: URL parameters template configurado?
   - Conflito entre auto-tag e UTM manual?

5. **Gerar recomendacoes**
   - URLs sem UTM: adicionar
   - UTMs inconsistentes: padronizar
   - Template UTM padrao para novos ads
   - Formato recomendado: `?utm_source={source}&utm_medium={medium}&utm_campaign={campaign_name}&utm_content={ad_name}`

## Output
Audit report com URLs problematicas, padroes inconsistentes e template padrao recomendado.

## Quality Gates
- [ ] Todas as URLs ativas verificadas
- [ ] Template UTM padrao definido
- [ ] Inconsistencias listadas com correcao

## Quando Usar
- Auditoria de conta
- Setup de tracking para nova campanha
- Quando GA4 mostra trafego (not set) ou (direct) inesperado
