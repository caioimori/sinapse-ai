---
task: adapt-for-linkedin
responsavel: "@platform-specialist"
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

# Task: Adapt for LinkedIn

> Adaptar conteudo para tom, formato e algoritmo do LinkedIn.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Trigger** | Conteudo que precisa ir para LinkedIn |
| **Input** | Conteudo original, Template Contract LinkedIn, perfil do autor |
| **Output** | Conteudo adaptado com formato, tom e otimizacoes LinkedIn |
| **Handoff** | → content-governor (Index) para validacao |
| **Complexity** | simple |

---

## Fundamentacao

LinkedIn tem o maior alcance organico entre plataformas profissionais. O algoritmo favorece: dwell time (tempo lendo), comentarios longos (>15 palavras), posts nativos (sem links externos), e conteudo que gera conversas profissionais. O tom e profissional-humano: nem formal demais, nem casual demais. Referencia: Richard van der Blom — LinkedIn algorithm research 2024.

---

## Steps

### Step 1: Adaptar Tom
LinkedIn exige tom profissional-humano. Remover girias, emojis excessivos. Adicionar contexto profissional. Manter personalidade sem ser informal demais.

### Step 2: Formatar para Escaneabilidade
Linhas curtas (max 8-10 palavras por linha). Espacamento generoso entre paragrafos. Uso de simbolos (→, •, ✓) para listas. O "ver mais" acontece em ~210 caracteres.

### Step 3: Otimizar para Algoritmo
Sem links no corpo (link no primeiro comentario). Perguntas que geram comentarios longos. Conteudo que as pessoas querem "concordar publicamente" (validacao profissional).

### Step 4: Incluir Contexto Profissional
Adicionar credenciais, experiencia ou dados que reforcem autoridade. LinkedIn e a plataforma onde expertise importa mais.

### Step 5: Estrategia de Primeiro Comentario
Se ha link: preparar primeiro comentario com link + contexto. Se nao ha link: preparar primeiro comentario com pergunta adicional ou recurso complementar.

### Step 6: Handoff

```yaml
handoff:
  artifact: "linkedin-adaptation-{peca}.md"
  context: "Adaptado para LinkedIn: {X} chars, tom {tom}, link '{posicao}'"
  next: "content-governor (Index) para validacao"
```
