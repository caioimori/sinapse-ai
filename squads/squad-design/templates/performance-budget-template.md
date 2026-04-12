# Performance Budget Template

## Instrucoes
Definir ANTES de implementar. Serve como contrato de performance que o CI/CD enforces automaticamente.

---

## 1. Projeto

| Campo | Valor |
|-------|-------|
| Projeto | |
| Tipo de pagina | [Marketing / E-commerce / Dashboard / Blog / App] |
| Responsavel | Apex (dx-performance-engineer) |
| Data | |
| Revisao | [Mensal / Trimestral] |

## 2. Core Web Vitals Targets

| Metrica | Target | Limite Aceitavel | Tool |
|---------|--------|-----------------|------|
| LCP | < 2.0s | < 2.5s | Lighthouse CI |
| INP | < 150ms | < 200ms | Web Vitals |
| CLS | < 0.05 | < 0.1 | Lighthouse CI |
| TTFB | < 600ms | < 800ms | WebPageTest |
| TBT | < 150ms | < 200ms | Lighthouse CI |
| Lighthouse Score | >= 95 | >= 90 | Lighthouse CI |

## 3. Resource Budgets

### Por Tipo de Recurso
| Recurso | Budget (compressed) | Budget (uncompressed) |
|---------|--------------------|-----------------------|
| JavaScript (critical) | KB | KB |
| JavaScript (total) | KB | KB |
| CSS (critical) | KB | KB |
| CSS (total) | KB | KB |
| Images (above fold) | KB | KB |
| Images (total page) | KB | KB |
| Fonts | KB | KB |
| Third-party (total) | KB | KB |
| **Total page weight** | **KB** | **KB** |

### Por Tipo de Pagina
| Pagina | JS | CSS | Images | Total |
|--------|-----|-----|--------|-------|
| Homepage | KB | KB | KB | KB |
| Landing page | KB | KB | KB | KB |
| Product page | KB | KB | KB | KB |
| Blog post | KB | KB | KB | KB |
| Dashboard | KB | KB | KB | KB |

## 4. Request Budgets

| Tipo | Max Requests |
|------|-------------|
| JavaScript files | |
| CSS files | |
| Image requests (above fold) | |
| Font files | |
| Third-party domains | |
| **Total requests** | |

## 5. Third-Party Budget

| Script | Categoria | Budget (KB) | Loading | Impacto TBT |
|--------|----------|-------------|---------|-------------|
| Google Analytics | Analytics | | defer | ms |
| | | | | ms |
| | | | | ms |
| | | | | ms |
| **Total 3P** | | **KB** | | **ms** |

## 6. Enforcement

### Lighthouse CI Config
```js
// lighthouserc.js
module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.90 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'interactive': ['error', { maxNumericValue: 3500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-byte-weight': ['error', { maxNumericValue: TOTAL_BUDGET }],
      }
    }
  }
};
```

### Bundle Size Check
```json
// package.json
{
  "bundlesize": [
    { "path": "dist/js/*.js", "maxSize": "BUDGET KB" },
    { "path": "dist/css/*.css", "maxSize": "BUDGET KB" }
  ]
}
```

## 7. Monitoring

| Metrica | Ferramenta | Frequencia | Alerta se |
|---------|-----------|-----------|-----------|
| Core Web Vitals (field) | CrUX / RUM | Continuo | Fora do target |
| Lighthouse Score | Lighthouse CI | Por PR | < 90 |
| Bundle Size | bundlesize | Por PR | Excede budget |
| Page Weight | DebugBear | Semanal | Excede budget |

## 8. Budget Review Process

### Quando revisar
- [ ] Trimestralmente (rotina)
- [ ] Apos adicionar nova feature significativa
- [ ] Apos adicionar third-party script
- [ ] Apos regressao detectada
- [ ] Apos mudanca de stack/framework

### Como ajustar
1. Identificar o que causou o aumento
2. Avaliar se e necessario (feature value vs performance cost)
3. Se necessario: compensar removendo ou otimizando outro recurso
4. Atualizar budget document e CI config
5. Comunicar mudanca ao time

## Assinaturas

| Papel | Nome | Data | Aprovado |
|-------|------|------|----------|
| Performance Engineer | | | [ ] |
| Frontend Lead | | | [ ] |
| Tech Lead | | | [ ] |
