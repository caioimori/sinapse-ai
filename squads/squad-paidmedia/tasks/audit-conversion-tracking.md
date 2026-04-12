---
task: audit-conversion-tracking
responsavel: "@cro-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Audit Conversion Tracking (LP)

## Metadata
- **Agent:** cro-specialist (Convert)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Auditar tracking de conversoes na landing page para garantir dados precisos.

## Steps

1. **Verificar eventos de conversao** - Form submit event firing corretamente? Thank you page com conversion tag? CTA clicks tracked? Scroll depth tracked?
2. **Verificar plataformas** - Google Ads conversion tag, Meta Pixel events, GA4 events, GTM configuration
3. **Testar end-to-end** - Submeter form de teste, Verificar evento em cada plataforma, Verificar parametros (value, currency, content)
4. **Verificar deduplication** - Mesmo formulario nao dispara 2x em refresh, Dedup entre browser e server-side
5. **Documentar setup** - Quais eventos, quais tags, quais triggers, Para referencia e troubleshooting futuro

## Output
Conversion tracking audit report com status de cada evento e plataforma.

## Quality Gates
- [ ] Todos os eventos testados end-to-end
- [ ] Todas as plataformas verificadas
- [ ] Deduplication confirmada

## Quando Usar
- Pre-launch de campanha
- Quando conversoes reportadas divergem
- Apos mudancas na LP
