---
task: diagnose-conversion-tracking
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: conversion_data
    tipo: data
    origem: "Google Ads + GA4"
    obrigatorio: true

Saida:
  - campo: diagnosis_report
    tipo: document
    destino: "Lighthouse + Query"
---

# Task: Diagnose Conversion Tracking

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Diagnosticar problemas de conversion tracking no Google Ads e GA4.

## Steps

1. **Comparar fontes de dados**
   - Google Ads reported conversions vs GA4 conversions
   - Discrepancia aceitavel: <15% (attribution differences)
   - Discrepancia >15%: investigar

2. **Verificar conversion actions**
   - Status de cada conversion action: active, recently active, inactive, no recent conversions
   - Tag assistant: eventos firing corretamente?
   - Conversion value: correto ou placeholder?
   - Count: "Every" (ecommerce) vs "One" (leads)

3. **Diagnosticar causas comuns**
   - Tag nao firing: verificar com Tag Assistant / Chrome DevTools
   - Double counting: conversoes duplicadas (tag na wrong page)
   - Attribution mismatch: Google Ads vs GA4 usam modelos diferentes
   - Cross-domain issues: dominio do LP diferente do dominio do checkout
   - Consent mode: bloqueando tags para % dos usuarios

4. **Verificar enhanced conversions**
   - Habilitado? (melhora accuracy em ~5-10%)
   - Dados de usuario sendo enviados (hashed email, phone)
   - Diagnostics: match rate

5. **Recomendacoes de fix**
   - Priorizar por impacto no tracking accuracy
   - Quick fixes: tag corrections, attribution alignment
   - Medium fixes: enhanced conversions setup, cross-domain fix
   - Complex fixes: server-side tagging, consent mode optimization

## Output
Diagnosis report com problemas identificados, causa e plano de fix.

## Quality Gates
- [ ] Google Ads vs GA4 discrepancia quantificada
- [ ] Conversion actions auditadas individualmente
- [ ] Causas identificadas com evidencia
- [ ] Plano de fix priorizado

## Quando Usar
- Discrepancia entre Google Ads e GA4
- Conversoes caindo sem razao aparente
- Setup de nova conta
- Smart Bidding nao performando como esperado
