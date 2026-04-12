---
task: review-ethical-compliance
responsavel: "@persuasion-psychologist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Review Ethical Compliance

## Metadata
- **Squad:** squad-copy
- **Agent:** persuasion-psychologist (Nudge)
- **Complexity:** STANDARD
- **Depends on:** copy final de qualquer writer
- **Feeds:** copy-editor (Chisel), copy-strategist (Quill)

## Objetivo
Revisar toda copy para compliance etica — garantindo que persuasao e usada para AJUDAR o cliente a tomar a melhor decisao, nunca para manipular. A linha entre persuasao e manipulacao e clara: persuasao informa, manipulacao engana.

## Entrada
- Copy final para review
- Claims feitos na copy
- Dados e provas usados
- Oferta e garantia

## Passos

### 1. Checklist de Dark Patterns (NAO PERMITIDO)
| Dark Pattern | Descricao | Detectar |
|-------------|-----------|----------|
| Confirmshaming | Humilhar quem recusa | "Nao, prefiro continuar fracassando" |
| Hidden costs | Custos escondidos ate o checkout | Fees so revelados no final |
| Bait and switch | Prometer X, entregar Y | Headline promete algo diferente da oferta |
| Forced continuity | Auto-renewal sem aviso claro | Trial que cobra automaticamente |
| Roach motel | Facil entrar, impossível sair | Cancelamento propositalmente dificil |
| Misdirection | Desviar atencao do preco real | Design que esconde custo total |
| Trick questions | Perguntas confusas em opt-in | "Desmarque para NAO receber" |
| Urgency fabrication | Countdown que reseta | Timer que reinicia ao recarregar |
| Social proof fraud | Reviews/numeros falsos | Testimonials inventados |
| Price manipulation | "De" inflado artificialmente | Preco "original" nunca praticado |

### 2. Verificar Claims
**Todo claim na copy deve ser:**
| Tipo | Verificacao | Acao se falhar |
|------|-------------|----------------|
| Resultado numerico | Fonte verificavel | Remover ou adicionar fonte |
| Testimonial | Cliente real com permissao | Remover ou obter permissao |
| Comparativo | Base factual | Remover ou referenciar estudo |
| "Melhor" / "#1" | Ranking verificavel | Mudar para claim qualificado |
| Garantia | Realmente cumprida | Remover se nao cumpre |
| Escassez | Quantidade/prazo real | Remover se fabricado |
| Timeline | Resultado tipico documentado | Adicionar "resultados podem variar" |

### 3. Avaliar Etica de Persuasao
**Matriz Etica:**
| Tecnica | ETICO (✅) | ZONA CINZA (⚠️) | ANTIÉTICO (❌) |
|---------|-----------|-----------------|--------------|
| Urgencia | Deadline real | "Vagas limitadas" sem limite definido | Timer que reseta |
| Escassez | Estoque real limitado | "Ultimas unidades" generico | "So 3 restando" (falso) |
| Social Proof | Reviews reais | Reviews selecionados (so positivos) | Reviews inventados |
| Anchoring | Valor real de mercado | "De R$X" (nunca praticado) | Preco original inflado |
| Loss Aversion | Custo real de inacao | Exagero de consequencias | Criar medo infundado |
| Autoridade | Credenciais reais | Credenciais infladas | Credenciais falsas |
| Reciprocidade | Valor real gratuito | Trial muito limitado | "Gratis" com custos escondidos |

### 4. Teste do "Jornal"
**Para cada peca de copy, pergunte:**
1. "Se saisse numa materia de jornal, nos orgulhariamos dessa copy?"
2. "Se o cliente visse os bastidores, se sentiria enganado?"
3. "Essa copy ajuda o cliente a tomar a MELHOR decisao?"
4. "Estariamos ok se TODOS os nossos clientes lessem essa copy?"
5. "Essa copy trata o leitor com respeito?"

**Se qualquer resposta for NAO → revisar.**

### 5. Compliance Regulatorio
**Checklist por industria:**
| Industria | Regulacao | Cuidados |
|-----------|-----------|----------|
| Financas | BACEN, CVM | "Rentabilidade passada nao garante futura" |
| Saude | ANVISA, CFM | Nao prometer cura, resultados variam |
| Educacao | MEC | Nao garantir emprego/salario |
| Ecommerce | CDC | Direto arrependimento 7 dias |
| Dados | LGPD/GDPR | Consentimento explicito |
| Publicidade | CONAR | Regras de comparativos |

### 6. Emitir Parecer Etico
```
ETHICAL COMPLIANCE REVIEW

Copy: [Nome da peca]
Date: [Data]
Reviewer: Nudge (Ethics Review)

DARK PATTERNS: ✅ LIMPO / ⚠️ [N] ALERTAS / ❌ [N] VIOLAÇÕES
  [Lista de alertas/violações se houver]

CLAIMS VERIFICATION:
  Verificados: [N] ✅
  Alertas: [N] ⚠️
  Falsos: [N] ❌

PERSUASION ETHICS: ✅ ETICO / ⚠️ ZONA CINZA / ❌ MANIPULATIVO
  [Notas]

REGULATORY COMPLIANCE: ✅ OK / ⚠️ REVIEW NEEDED / ❌ VIOLATION
  [Notas]

TESTE DO JORNAL: PASS / FAIL
  [Notas]

VEREDICTO:
  ✅ APPROVED — Eticamente solido
  ⚠️ ADJUST — Ajustes recomendados antes de publicar
  ❌ REJECT — Problemas eticos serios, nao publicar

RECOMENDAÇÕES:
  1. [Acao necessaria]
  2. [Acao necessaria]
```

## Saida
- Ethical compliance review report
- Dark patterns check
- Claims verification
- Regulatory compliance notes
- Veredicto (APPROVED / ADJUST / REJECT)

## Validacao
- [ ] Dark patterns checklist completo (zero tolerancia)
- [ ] Claims verificados com fontes
- [ ] Persuasion ethics avaliada
- [ ] Teste do jornal passado
- [ ] Regulatory compliance verificado
- [ ] Veredicto claro e acionavel
- [ ] Recomendacoes especificas se ADJUST

---

*Task operada por: persuasion-psychologist (Nudge)*
