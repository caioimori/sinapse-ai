---
task: validate-pixel-health
responsavel: "@performance-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Validate Pixel Health

## Metadata
- **Agent:** performance-engineer (Lighthouse)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Validar saude de pixels (Meta, Google, outros) em LPs de campanhas.

## Steps

1. **Meta Pixel** - Pixel Helper extension: eventos detectados? Events Manager: status ativo? Event Match Quality (CAPI): >6.0? Diagnostics: algum warning/error?
2. **Google Ads Tag** - Tag Assistant: conversion tag detectado? Google Ads: conversion action status? Enhanced conversions: habilitado e funcionando?
3. **GA4** - DebugView: eventos aparecendo? Realtime: dados em tempo real? Configuration: data streams corretos?
4. **Outros pixels** - LinkedIn Insight Tag, TikTok Pixel, etc. Cada um: presente e firing?

## Output
Pixel health report com status de cada pixel em cada LP.

## Quality Gates
- [ ] Todos os pixels verificados
- [ ] Eventos criticos testados
- [ ] Issues com severity classificada

## Quando Usar
- Pre-launch de campanha
- Quando conversoes caem sem razao aparente
- Health check mensal
