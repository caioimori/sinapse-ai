---
task: edit-copy-persuasion-review
responsavel: "@copy-editor"
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

# Task: Edit Copy — Persuasion Review (Pass 2)

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-editor (Chisel)
- **Complexity:** STANDARD
- **Depends on:** Pass 1 aprovado
- **Feeds:** persuasion-psychologist (Nudge) se necessario

## Objetivo
Segunda passada: avaliar e otimizar a forca persuasiva da copy — verificando se cada secao maximiza seu potencial de influenciar a decisao do leitor.

## Entrada
- Copy aprovada no Pass 1 (estrategia ok)
- Persuasion review do Nudge (se disponível)

## Passos

### 1. Avaliar Headline/Hook
- [ ] Captura atencao em 3 segundos?
- [ ] Contem beneficio ou curiosidade?
- [ ] Especifico (numeros, nomes, resultados)?
- [ ] Funciona sozinho (fora de contexto)?
- [ ] Diferenciado dos competitors?

### 2. Avaliar Body Copy
- [ ] Slippery slide funciona? (cada paragrafo puxa para o proximo)
- [ ] Emocao antes de logica?
- [ ] Beneficios traduzidos de features?
- [ ] Future pacing presente?
- [ ] Objecoes top 3 endereçadas?
- [ ] Provas em camadas (social, authority, demo)?

### 3. Avaliar CTA
- [ ] Especifico (nao "Clique Aqui")?
- [ ] Beneficio no texto do botao?
- [ ] Friction reducers presentes?
- [ ] Posicionado apos proof suficiente?
- [ ] Urgencia/escassez etica (se aplicavel)?

### 4. Intensificar Pontos Fracos
**Para cada secao fraca, aplicar:**
- Adicionar especificidade (numeros, nomes, resultados)
- Adicionar proof (testimonial, dado, caso)
- Adicionar emocao (historia, analogia, contraste)
- Adicionar urgencia (se etico e relevante)
- Remover fluff (palavras que nao adicionam valor)

### 5. Feedback Pass 2
```
PERSUASION REVIEW — PASS 2

HEADLINE: [Score /5] — [Nota]
BODY PERSUASION: [Score /5] — [Nota]
PROOF LAYERS: [Score /5] — [Nota]
CTA POWER: [Score /5] — [Nota]
OBJECTION HANDLING: [Score /5] — [Nota]

EDITS FEITOS: [N]
AREAS INTENSIFICADAS: [lista]

DECISAO:
  ✅ APROVADO para Pass 3
  🔄 AJUSTES NECESSARIOS [lista]
```

## Saida
- Copy com persuasao otimizada
- Scores por elemento
- Lista de intensificacoes feitas

## Validacao
- [ ] Headline score >= 4/5
- [ ] Body persuasion >= 4/5
- [ ] Proof em 3+ camadas
- [ ] CTA optimizado
- [ ] Objecoes top 3 endereçadas
- [ ] Emocao→Logica sequencia correta

---

*Task operada por: copy-editor (Chisel)*
