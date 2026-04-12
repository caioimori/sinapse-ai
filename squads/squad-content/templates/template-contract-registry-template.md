# Template Contract Registry

> Template para registrar novos Template Contracts no sistema.

---

## Template Contract

```yaml
template_contract:
  # Identificacao
  id: "{plataforma}-{formato}-{variante}"
  platform: "{instagram|linkedin|blog|tiktok|twitter|youtube|newsletter}"
  format: "{carousel|feed|stories|reels|text|article|video|thread|email}"
  variant: "{educativo|storytelling|thought-leadership|tutorial|comercial|opiniao}"
  version: "1.0"
  created_at: "{YYYY-MM-DD}"
  updated_at: "{YYYY-MM-DD}"

  # Estrutura
  structure:
    min_elements: {numero}      # Minimo de slides/secoes/tweets
    max_elements: {numero}      # Maximo
    first_element: "{tipo}"     # Ex: "hook", "headline"
    last_element: "{tipo}"      # Ex: "cta", "summary"
    element_order: []           # Sequencia obrigatoria, se aplicavel

  # Campos de Conteudo
  fields:
    hook:
      type: "text"
      min_chars: {numero}
      max_chars: {numero}
      required: true
      rules: "{regras especificas}"

    body:
      type: "text"
      min_chars: {numero}
      max_chars: {numero}
      required: true
      rules: "{regras especificas}"

    cta:
      type: "text"
      min_chars: {numero}
      max_chars: {numero}
      required: true
      rules: "{regras especificas}"
      allowed_types: ["save", "share", "comment", "click", "convert"]

    caption:
      type: "text"
      min_chars: {numero}
      max_chars: {numero}
      required: {true|false}
      rules: "{regras especificas}"

    hashtags:
      type: "list"
      min_count: {numero}
      max_count: {numero}
      required: {true|false}
      rules: "{regras de mix e selecao}"

  # Specs Visuais (se aplicavel)
  visual_specs:
    aspect_ratio: "{1:1|4:5|9:16|16:9}"
    resolution: "{WxH}"
    text_max_percentage: {numero}
    font_min_size: "{tamanho}"
    duration_seconds: {numero}  # Para video

  # Regras de Validacao
  validation:
    hard_fail:   # Rejeicao automatica
      - "{regra que causa rejeicao}"
    soft_warn:   # Aviso sem rejeicao
      - "{regra que gera aviso}"

  # Changelog
  changelog:
    - version: "1.0"
      date: "{YYYY-MM-DD}"
      changes: "Criacao inicial"
      reason: "{motivo}"
```

---

## Instrucoes de Preenchimento

1. **id**: Formato `{plataforma}-{formato}-{variante}`. Deve ser unico.
2. **fields**: Cada campo com limites EXATOS (nao aproximados).
3. **hard_fail**: Regras que causam rejeicao automatica. Sem excecao.
4. **soft_warn**: Regras que geram aviso mas permitem publicacao.
5. **changelog**: Toda alteracao registrada com data, mudanca e motivo.

---

*Template operado por: platform-specialist (Morph)*
*Validado por: content-governor (Index)*
*Referencia: template-contract-system.md (KB)*
