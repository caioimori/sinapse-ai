---
task: manage-pixel-capi-health
responsavel: "@meta-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: pixel_data
    tipo: data
    origem: "Meta Events Manager"
    obrigatorio: true

Saida:
  - campo: health_report
    tipo: document
    destino: "Lighthouse + Apex"
---

# Task: Manage Pixel & CAPI Health

## Metadata
- **Agent:** meta-ads-specialist (Signal)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Monitorar e otimizar saude do Facebook Pixel e Conversions API para maximizar signal quality.

## Steps

1. **Verificar Pixel status**
   - Pixel ativo em todas as paginas (Events Manager → Diagnostics)
   - Events firing corretamente (PageView, ViewContent, ATC, Purchase, Lead)
   - Parametros de evento completos (value, currency, content_id, content_type)
   - Nenhum erro ativo nos diagnostics

2. **Verificar CAPI status**
   - CAPI implementado e enviando events
   - Event Match Quality por evento (target >6.0, ideal >8.0)
   - Deduplication configurado (event_id matching entre Pixel e CAPI)
   - Server-side events com user data parameters (em, fn, ln, ph, external_id)

3. **Diagnosticar problemas comuns**
   - EMQ baixo (<6): verificar user data parameters enviados
   - Dedup ratio anormal (>90% ou <10%): verificar event_id logic
   - Events atrasados (>1h): verificar server-side infrastructure
   - Missing events: comparar Pixel vs CAPI volume (devem ser similares)

4. **Otimizar signal quality**
   - Adicionar parametros de usuario adicionais (hashed): email, phone, name
   - Implementar Advanced Matching (browser-side)
   - Configurar server events via GTM Server-Side ou partner
   - Testar com Facebook Pixel Helper extension

5. **Configurar monitoramento**
   - Alerta se EMQ cair abaixo de 6.0
   - Alerta se volume de events cair >30% dia-a-dia
   - Revisao semanal de diagnostics
   - Verificacao mensal de deduplication accuracy

## Output
Health report com status de pixel/CAPI, EMQ scores, problemas e acoes corretivas.

## Quality Gates
- [ ] Todos os eventos criticos testados (PageView, Lead/Purchase)
- [ ] EMQ reportado por evento
- [ ] Deduplication verificada
- [ ] Acoes corretivas priorizadas

## Quando Usar
- Setup inicial de tracking
- Auditoria de conta
- Quando conversoes reportadas divergem da realidade
- Mensalmente como health check
