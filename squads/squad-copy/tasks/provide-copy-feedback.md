---
task: provide-copy-feedback
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

# Task: Provide Copy Feedback

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-editor (Chisel)
- **Complexity:** STANDARD
- **Depends on:** copy de qualquer writer
- **Feeds:** writer original

## Objetivo
Fornecer feedback rapido e acionavel em qualquer peca de copy — sem fazer full review, apenas apontar os 3-5 pontos mais impactantes para melhorar.

## Entrada
- Copy para feedback rapido
- Contexto (canal, audiencia, objetivo)
- Nivel de feedback desejado (quick/detailed)

## Passos

### 1. Quick Scan (2 minutos)
**Primeira impressao:**
- Li os primeiros 3 segundos. Quero continuar?
- O que senti? (emocao)
- Entendi a proposta? (clareza)
- Sei o que fazer? (CTA)

### 2. Identificar Top 3-5 Melhorias
**Priorizar por impacto:**
| Prioridade | Impacto |
|:----------:|---------|
| 1 | Headline/hook (afeta TUDO) |
| 2 | CTA (afeta conversao direta) |
| 3 | Proof/credibilidade (afeta confianca) |
| 4 | Estrutura/fluxo (afeta engagement) |
| 5 | Voice/tom (afeta brand perception) |

### 3. Formato de Feedback Rapido
```
COPY FEEDBACK — QUICK REVIEW

Copy: [Nome]
Tempo de review: [X] minutos

PRIMEIRA IMPRESSAO: [1 frase]

TOP [N] MELHORIAS:

1. 🔴 [ALTA PRIORIDADE]
   Onde: [Secao/linha]
   Problema: [O que nao funciona]
   Sugestao: [Como melhorar]
   Exemplo: "[copy sugerida]"

2. 🟡 [MEDIA PRIORIDADE]
   Onde: [Secao/linha]
   Problema: [O que nao funciona]
   Sugestao: [Como melhorar]

3. 🟢 [NICE TO HAVE]
   Onde: [Secao/linha]
   Sugestao: [Melhoria]

O QUE FUNCIONA BEM:
  ✅ [Ponto forte 1]
  ✅ [Ponto forte 2]

VEREDICTO RAPIDO:
  [Pronta / Quase la / Precisa de trabalho]
```

### 4. Regras de Feedback
- Maximo 5 pontos (nao sobrecarregar)
- Sempre incluir o que FUNCIONA (nao so critica)
- Oferecer alternativa concreta (nao apenas "melhore isso")
- Priorizar por impacto na conversao
- Respeitar estilo do writer (editar, nao reescrever)
- Prazo para resposta: 24h (nao segurar copy)

## Saida
- Feedback rapido (3-5 pontos)
- Priorizado por impacto
- Com sugestoes concretas
- Pontos fortes destacados

## Validacao
- [ ] Max 5 pontos de feedback
- [ ] Priorizado por impacto
- [ ] Cada ponto com sugestao concreta
- [ ] Pontos fortes incluidos
- [ ] Entregue em < 24h
- [ ] Tom construtivo (nao destrutivo)

---

*Task operada por: copy-editor (Chisel)*
