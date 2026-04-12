---
task: define-tone-of-voice
responsavel: "@brand-strategist"
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

# Task: define-tone-of-voice

## Metadata
- **Agent:** brand-strategist (Athena)
- **Squad:** squad-brand
- **Trigger:** `*define-tone` ou manifesto criado
- **Inputs:** Brand manifesto, arquetipo, personas
- **Outputs:** Tone of voice guide completo

## Description
Define como a marca fala — nao O QUE diz, mas COMO diz. Mapeia personalidade para atributos verbais com exemplos praticos por canal.

## Steps
1. Mapear arquetipo para atributos verbais naturais
2. Definir 4 dimensoes do tom de voz com posicao no espectro:
   - Formal ←→ Casual (posicao 1-10)
   - Serio ←→ Humorado (posicao 1-10)
   - Respeitoso ←→ Irreverente (posicao 1-10)
   - Entusiasta ←→ Matter-of-fact (posicao 1-10)
3. Criar DO's e DON'Ts verbais com exemplos concretos:
   - DO: "Usar linguagem direta e acionavel" → Exemplo: "Comece agora" (nao "Caso deseje iniciar...")
   - DON'T: "Usar jargao corporativo" → Exemplo: evitar "sinergia", "alavancagem"
4. Definir vocabulary list: palavras que a marca USA e palavras que EVITA
5. Adaptar tom por canal:
   - Website: {tom + exemplos}
   - Social media: {tom + exemplos por rede}
   - Email marketing: {tom + exemplos}
   - Atendimento/suporte: {tom + exemplos}
   - Documentos formais: {tom + exemplos}
6. Criar 3 exemplos de texto para cada canal (headline, paragrafo, CTA)
7. Documentar regras de gramatica e estilo (numeros, siglas, pontuacao, emojis)

## Validation Criteria
- 4 dimensoes posicionadas com justificativa
- Minimo 5 DO's e 5 DON'Ts com exemplos
- Adaptacao para pelo menos 4 canais
- Exemplos sao reconheciveis como "a voz da marca"
- Qualquer redator consegue reproduzir o tom seguindo o guia

## Output Format
```markdown
# Tom de Voz — {brand_name}

## Personalidade Verbal
{descricao em 2-3 frases}

## Espectro
- Formal [--●-------] Casual (posicao 3/10)
...

## DO's e DON'Ts
| DO | Exemplo | DON'T | Exemplo |

## Vocabulario
- Palavras da marca: ...
- Palavras proibidas: ...

## Por Canal
### Website
{tom + 3 exemplos}
...
```
