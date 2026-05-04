# Squad Copywriting & Persuasion — Preferences

## Sobre
Este diretorio armazena preferencias personalizaveis que ajustam o comportamento da squad sem modificar os arquivos core.

## Arquivos de Preferencia

### Configuracoes Gerais
Crie um arquivo `general.yaml` neste diretorio para personalizar:

```yaml
# general.yaml
language: pt-BR                    # Idioma padrao das entregas
tone_default: professional         # Tom padrao quando nao especificado
review_rounds: 2                   # Rodadas minimas de revisao
auto_ethical_check: true           # Sempre rodar checagem etica
headline_variants_min: 5           # Minimo de variantes de headline
cta_variants_min: 3                # Minimo de variantes de CTA
```

### Preferencias de Formato
Crie `format.yaml` para ajustar formatos de entrega:

```yaml
# format.yaml
output_format: markdown            # markdown | google-docs | notion
include_rationale: true            # Incluir explicacao das escolhas
include_alternatives: true         # Incluir opcoes alternativas
max_copy_length:
  ad_headline: 30                  # Google Ads headline
  ad_description: 90               # Google Ads description
  meta_primary: 125                # Meta primary text (visible)
  email_subject: 50                # Email subject line
  social_post: 280                 # Post de rede social
```

### Preferencias de Brand Voice
Crie `brand-voice.yaml` para definir defaults de voz:

```yaml
# brand-voice.yaml
default_formality: 5               # 1-10 (formal → casual)
default_emotion: 6                 # 1-10 (racional → emocional)
default_treatment: voce            # voce | tu | senhor
contractions: always               # always | sometimes | never
emoji_policy: moderate             # liberal | moderate | prohibited
oxford_comma: false
```

### Preferencias de Persuasao
Crie `persuasion.yaml` para ajustar approach de persuasao:

```yaml
# persuasion.yaml
cialdini_min_principles: 4         # Min principios por peca
loss_framing_max_ratio: 0.30       # Max 30% loss framing
urgency_policy: real_only          # real_only | permitted | prohibited
social_proof_layers_min: 3         # Camadas minimas de prova
ethical_strictness: high           # low | medium | high
```

### Preferencias de Review
Crie `review.yaml` para ajustar processo de revisao:

```yaml
# review.yaml
mandatory_passes:
  - strategic                      # Pass 1 sempre obrigatorio
  - technical                      # Pass 5 sempre obrigatorio
  - ethical                        # Etica sempre obrigatoria
optional_passes:
  - persuasion                     # Pass 2
  - voice                          # Pass 3
  - clarity                        # Pass 4
full_review_threshold: important   # all | important | critical
```

## Como Usar

1. Crie os arquivos YAML desejados neste diretorio
2. Os agentes da squad lerao automaticamente as preferencias
3. Preferencias nao definidas usam os defaults dos agentes
4. Preferencias sao hierarquicas: brief > preferences > agent defaults

## Prioridade de Configuracao

```
1. Brief do projeto (mais alta)
2. Preferences deste diretorio
3. Defaults dos agentes
4. Knowledge base da squad (mais baixa)
```

## Notas

- Preferencias sao opcionais — a squad funciona com todos os defaults
- Nao modifique arquivos fora deste diretorio para customizar comportamento
- Para preferencias por projeto, use o Copy Brief Template
