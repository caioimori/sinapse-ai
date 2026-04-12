---
task: create-editing-guidelines
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

# Task: Create Editing Guidelines

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-editor (Chisel)
- **Complexity:** STANDARD
- **Depends on:** brand voice, style guide
- **Feeds:** todos os editors/reviewers

## Objetivo
Criar guidelines de edicao que padronizam o processo de review — garantindo consistencia de qualidade independente de quem edita.

## Entrada
- Brand voice guidelines
- Writing style guide
- Historico de erros comuns
- Process de review atual

## Passos

### 1. Definir Niveis de Edicao
| Nivel | Nome | O que faz | Quando usar |
|:-----:|------|-----------|-------------|
| 1 | Proofreading | Erros gramaticais, typos, formatacao | Copy ja aprovada, so checagem final |
| 2 | Copy editing | Clareza, fluidez, consistencia | Copy boa mas precisa polimento |
| 3 | Line editing | Frase por frase, ritmo, impacto | Copy ok mas precisa forca |
| 4 | Developmental | Estrutura, estrategia, narrativa | Copy precisa reestruturacao |
| 5 | Full review | Todos os 5 passes | Copy nova, critica ou complexa |

### 2. Editing Shorthand (Marcas de Edicao)
**Sistema de marcacao para feedback:**
```
[CUT] — Remover este trecho
[REWRITE] — Reescrever completamente
[SIMPLIFY] — Simplificar linguagem
[SPECIFY] — Adicionar especificidade
[PROOF] — Adicionar prova/evidencia
[VOICE] — Ajustar para brand voice
[FLOW] — Melhorar transicao/fluxo
[CTA] — Melhorar call-to-action
[?] — Pergunta para o writer
[!] — Excelente, manter!
```

### 3. Processo de Feedback
**Regras de feedback construtivo:**
1. **Comece com o que funciona** (manter motivacao)
2. **Seja especifico** ("Esta frase" vs "o texto")
3. **Explique o por que** ("Porque o leitor pode..." vs "nao gostei")
4. **Ofereça alternativa** (nao apenas critique)
5. **Priorize** (marque os 3 mais importantes)
6. **Respeite a voz do writer** (edite, nao reescreva o estilo)

**Template de feedback:**
```
O QUE FUNCIONA:
  - [Ponto forte 1]
  - [Ponto forte 2]

O QUE MELHORAR (priorizado):
  1. [Mais importante] — [sugestao]
  2. [Segundo] — [sugestao]
  3. [Terceiro] — [sugestao]

QUESTOES PARA O WRITER:
  - [Pergunta sobre intencao/decisao]

PRAZO PARA REVISAO: [data]
```

### 4. Common Errors Catalog
**Erros mais comuns e como corrigir:**

| Erro | Exemplo | Correcao |
|------|---------|----------|
| Fluff words | "Realmente incrivel" | "Incrivel" |
| Voz passiva | "Foi criado por nos" | "Nos criamos" |
| Jargao | "Alavancando sinergias" | "Trabalhando juntos" |
| Feature > Benefit | "Dashboard em tempo real" | "Decisoes em minutos" |
| Generico | "Melhore seus resultados" | "Aumente vendas em 30%" |
| Paragrafos longos | 8+ linhas | Max 3-4 linhas |
| CTA fraco | "Clique Aqui" | "Comecar Meu Trial Gratis" |
| Tom off-brand | Corporativo | Conforme voice guidelines |

### 5. Escalation Rules
| Situacao | Acao |
|----------|------|
| Erro menor (typo) | Corrigir direto, notificar writer |
| Erro de voice | Sugerir alternativa, writer decide |
| Erro estrategico | Devolver para Pass 1, nao editar |
| Claim nao verificavel | Flag para Nudge (ethical review) |
| Reescrita necessaria | Devolver para writer com brief |
| Writer discorda | Escalar para Quill (copy strategist) |

## Saida
- Editing guidelines completo
- Niveis de edicao definidos
- Editing shorthand system
- Common errors catalog
- Escalation rules

## Validacao
- [ ] 5 niveis de edicao definidos
- [ ] Editing shorthand system criado
- [ ] Processo de feedback estruturado
- [ ] Common errors catalogados (min 10)
- [ ] Escalation rules claras
- [ ] Template de feedback incluido
- [ ] Aprovado por copy strategist

---

*Task operada por: copy-editor (Chisel)*
