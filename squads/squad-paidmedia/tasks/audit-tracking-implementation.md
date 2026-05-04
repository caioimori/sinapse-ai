---
task: audit-tracking-implementation
responsavel: "@performance-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Audit Tracking Implementation

## Metadata
- **Agent:** performance-engineer (Lighthouse)
- **Squad:** squad-paidmedia
- **Complexity:** HIGH

## Objetivo
Auditar implementacao completa de tracking (pixels, tags, events) em todas as LPs.

## Steps

1. **Inventariar tags e pixels**
   - Google Tag Manager: presente e configurado?
   - Google Ads conversion tag: presente?
   - Google Analytics 4: configurado?
   - Meta Pixel: presente e eventos configurados?
   - Outros: LinkedIn Insight, TikTok Pixel, etc.

2. **Verificar firing order**
   - PageView events: firing em todas as paginas?
   - Conversion events: firing apenas na acao correta?
   - Timing: tags nao bloqueiam render?
   - Consent: respeitando consentimento (GDPR/LGPD)?

3. **Testar cada evento end-to-end**
   - Navegar como usuario, executar cada acao de conversao
   - Verificar em cada plataforma que evento foi recebido
   - Verificar parametros (value, currency, content_id)
   - Verificar deduplication entre browser e server-side

4. **Verificar cross-domain**
   - Se LP e checkout estao em dominios diferentes
   - Cross-domain tracking configurado em GA4?
   - Cookies preservados entre dominios?

5. **Documentar setup**
   - Mapa de tags: qual tag, qual trigger, qual evento
   - Data layer structure
   - Consent mode configuration
   - Troubleshooting guide

## Output
Tracking implementation audit com inventario, status de cada tag/evento e gaps.

## Quality Gates
- [ ] Todas as tags inventariadas
- [ ] Todos os eventos testados end-to-end
- [ ] Firing order verificado (nao bloqueia render)
- [ ] Cross-domain verificado (se aplicavel)
- [ ] Consent mode verificado

## Quando Usar
- Setup de conta nova
- Pre-launch de campanha
- Quando dados de conversao parecem incorretos
- Auditoria semestral
