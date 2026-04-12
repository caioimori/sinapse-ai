---
task: audit-sitemap-health
responsavel: "@campaign-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Audit Sitemap Health

## Metadata
- **Agent:** campaign-analyst (Pulse)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Auditar saude do sitemap e cobertura de indexacao para garantir que paginas criticas estao acessiveis ao Google.

## Steps

1. **Verificar sitemap submission** - Submitted no Search Console? Processado sem erros?
2. **Verificar coverage** - URLs no sitemap vs URLs indexadas. URLs criticas faltando?
3. **Verificar erros** - URLs com erro 4xx/5xx no sitemap. Redirects no sitemap (devem apontar para URL final)
4. **Landing pages** - Todas as LPs de campanhas presentes? Thank you pages excluidas? (noindex)

## Output
Sitemap health report com status e issues.

## Quality Gates
- [ ] Sitemap processado sem erros
- [ ] LPs criticas presentes

## Quando Usar
- Auditoria trimestral
- Apos criar novas LPs
