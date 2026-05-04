# Preferences — squad-commercial

## Overview
Este diretório armazena preferências customizáveis do squad que podem ser ajustadas por projeto ou organização sem modificar os arquivos core.

## Available Preferences

### Sales Methodology
- Primary qualification framework: MEDDIC (default)
- Discovery framework: SPIN + Gap Selling hybrid (default)
- Presentation approach: Challenger (default)
- Negotiation approach: Sandler (default)

### Pricing & Packaging
- Proposal structure: Three-Options / Blair Enns (default)
- Pricing model: Value-based (default)
- Minimum viable offer: Always three options (default)

### Thresholds & Targets
- MEDDIC qualification threshold: ≥ 8/16 for proposal investment
- Proposal quality gate: ≥ 18/21 to send
- Health Score bands: Green ≥80, Yellow 50-79, Red <50
- NRR target: > 110%
- Pipeline coverage: 3-5x quota
- LTV:CAC target: ≥ 3:1
- CAC payback target: < 18 months
- NPS target: > 50

### Response SLAs
- Detractor follow-up: 24 hours
- Red health score response: 4 hours
- Yellow health score response: 24 hours
- Proposal review turnaround: 4 hours
- Discovery summary to prospect: 24 hours
- QBR follow-up email: 24 hours

### Reporting Cadence
- Pipeline review: Weekly
- Revenue report: Monthly
- Forecast: Monthly
- NPS survey: Quarterly
- QBR (per client): Quarterly
- Full commercial review: Quarterly

## Customization
To override defaults, create a `custom-preferences.yaml` in this directory with the settings you want to change. The squad will merge custom preferences over defaults.
