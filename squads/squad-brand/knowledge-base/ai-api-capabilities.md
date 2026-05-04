# AI API Capabilities — Knowledge Base

> Capacidades, limites e seleção de APIs de IA para geração de assets de marca.

---

## 1. Mapa de APIs por Tipo de Asset

### Geração de Imagem
| API | Melhor Para | Limitação | Custo Relativo |
|-----|-------------|-----------|----------------|
| DALL-E 3 | Composição controlada, texto em imagem | Fotorealismo limitado | Médio |
| Midjourney | Estética excepcional, fotorealismo | Controle preciso limitado | Médio |
| Ideogram | Texto legível em imagens | Qualidade geral menor | Baixo |
| Stable Diffusion | Consistência em série, ControlNet | Requer expertise | Baixo (self-hosted) |
| Gemini | Compreensão contextual, multimodal | Estilo menos refinado | Médio |
| Flux | Fotorealismo, anatomia | Mais recente, menos testado | Médio |

### Edição de Imagem
| API | Capacidade | Melhor Para |
|-----|-----------|-------------|
| DALL-E 3 (edit) | Inpainting, outpainting | Modificar áreas específicas |
| Stable Diffusion (img2img) | Style transfer, variações | Manter composição, mudar estilo |
| Remove.bg API | Remoção de fundo | Isolamento de produto |
| Photoroom API | Composição de produto | Mockups com fundo |

### Geração de Texto/Copy
| API | Melhor Para | Limitação |
|-----|-------------|-----------|
| Claude (Anthropic) | Estratégia, manifestos, copy longo | — |
| GPT-4 (OpenAI) | Copy criativo, variações rápidas | — |
| Gemini (Google) | Análise de marca, pesquisa | — |

### Geração de Áudio
| API | Melhor Para | Formatos |
|-----|-------------|---------|
| Suno | Música, jingles, audio beds | MP3, WAV |
| Udio | Composição musical | MP3, WAV |
| ElevenLabs | Voice branding, narração | MP3, WAV |
| Mubert | Background music, loops | MP3, WAV |

### Geração de Vídeo
| API | Melhor Para | Limitação |
|-----|-------------|-----------|
| Runway Gen-3 | Motion graphics, transições | Duração curta (4-16s) |
| Pika | Animação de imagens | Qualidade variável |
| Kling | Vídeo realista | Menos controle criativo |
| Luma | 3D scene generation | Mais experimental |

---

## 2. Seleção de API — Decision Tree

### Para Logo Concepts
```
Precisa de texto legível? → Ideogram
Quer exploração estética? → Midjourney
Precisa de composição específica? → DALL-E 3
Quer série consistente? → Stable Diffusion
```

### Para Mockups de Produto
```
Produto em contexto lifestyle? → Midjourney
Produto em fundo clean? → DALL-E 3 ou Stable Diffusion
Produto com texto/label? → Ideogram → retouch DALL-E 3
Série de 5+ mockups? → Stable Diffusion (seed fixo)
```

### Para Social Media Content
```
Gráfico com texto? → Ideogram
Foto lifestyle? → Midjourney
Série de templates? → Stable Diffusion
Ilustração? → DALL-E 3
```

### Para Audio Assets
```
Jingle/Audio logo? → Suno (custom prompt)
Background music? → Mubert (filtros de mood)
Narração/Voice? → ElevenLabs (voice cloning)
Sound effects? → Freesound API + edição manual
```

---

## 3. Limites Técnicos

### DALL-E 3
| Parâmetro | Limite |
|-----------|--------|
| Resoluções | 1024×1024, 1024×1792, 1792×1024 |
| Batch | 1 imagem por chamada |
| Prompt max | ~4000 chars |
| Rate limit | Depende do tier |
| Estilo | natural, vivid |
| Edição | Inpainting com mask |

### Midjourney
| Parâmetro | Limite |
|-----------|--------|
| Resolução base | 1024×1024 |
| Upscale | Até 4x (2048×2048 ou mais) |
| Aspect ratios | --ar de 1:3 a 3:1 |
| Stylize | --s 0-1000 (default 100) |
| Chaos | --c 0-100 |
| Quality | --q .25, .5, 1 |
| Batch | 4 imagens por prompt |

### Stable Diffusion (via API)
| Parâmetro | Limite |
|-----------|--------|
| Resolução | Configurável (512-2048+) |
| Steps | 20-50 (típico) |
| CFG Scale | 1-30 (7-12 recomendado) |
| Seed | Reprodutível com mesmo seed |
| ControlNet | Canny, Depth, Pose, Reference |
| LoRA | Estilos custom treináveis |

### ElevenLabs
| Parâmetro | Limite |
|-----------|--------|
| Duração | Até 5 min por geração |
| Vozes | 100+ pré-definidas + custom |
| Clone | 3-30 min de áudio para clone |
| Idiomas | 30+ idiomas |
| Formatos | MP3, WAV |

---

## 4. Custo por Asset (Estimativa)

### Imagem
| API | Custo por Imagem | Nota |
|-----|------------------|------|
| DALL-E 3 (Standard) | ~$0.04 | 1024×1024 |
| DALL-E 3 (HD) | ~$0.08 | 1024×1024 HD |
| Midjourney | ~$0.02-0.06 | Depende do plano |
| Stable Diffusion (hosted) | ~$0.01-0.03 | Via API |
| Stable Diffusion (self) | Custo de GPU | ~$0.005/imagem |
| Ideogram | ~$0.02-0.04 | Depende do plano |

### Audio
| API | Custo | Nota |
|-----|-------|------|
| Suno | Plano mensal | 50-500 songs/mês |
| ElevenLabs | ~$0.30/1K chars | Voice generation |
| Mubert | Plano mensal | Tracks ilimitadas |

### Budget por Projeto de Brand (estimativa)
| Tipo | Assets Gerados | Custo IA Estimado |
|------|---------------|-------------------|
| Brand Essentials | 20-30 imagens + 2 áudio | $5-15 |
| Brand System | 50-100 imagens + 5 áudio | $15-40 |
| Brand Premium | 100-200 imagens + 10 áudio + 2 vídeo | $40-100 |

---

## 5. Workflow de Geração

### Processo Padrão
```
1. BRIEF → Definir exatamente o que precisa
2. SELECT → Escolher API mais adequada
3. PROMPT → Engenharia de prompt otimizada
4. GENERATE → Gerar lote inicial (3-5 variações)
5. SELECT → Escolher melhor resultado
6. REFINE → Iterar no prompt (máximo 3 iterações)
7. POST-PROCESS → Ajustes em ferramenta de design
8. VALIDATE → Verificar contra guidelines de marca
```

### Regras de Qualidade
1. **Máximo 3 iterações** por asset — se não acertar, repensar o brief
2. **Sempre pós-processar** — IA gera base, humano/ferramenta finaliza
3. **Nunca usar texto de IA** em entrega final — sempre overlay manual
4. **Logo sempre em pós** — não depender da IA para marca/logo
5. **Verificar direitos** — output de IA pode ter restrições comerciais

### Consistência em Série
Para manter estilo uniforme em múltiplos assets:
```
1. Criar prompt base (template)
2. Definir: paleta, iluminação, estilo, composição
3. Usar seed fixo (Stable Diffusion) ou --sref (Midjourney)
4. Variar apenas: sujeito, composição menor
5. Pós-processar com mesmo LUT/preset
```

---

## 6. Ética e Direitos

### Princípios
1. **Transparência** — Informar ao cliente que IA foi usada na geração
2. **Originalidade** — Não copiar marcas existentes
3. **Direitos** — Verificar termos de uso de cada API
4. **Diversidade** — Garantir representatividade em pessoas geradas
5. **Verificação** — Sempre validar output antes de entregar

### Uso Comercial por API
| API | Uso Comercial | Propriedade |
|-----|--------------|-------------|
| DALL-E 3 | Sim (planos pagos) | Usuário possui |
| Midjourney | Sim (planos pagos) | Usuário possui |
| Stable Diffusion | Sim (open source) | Usuário possui |
| Ideogram | Sim (planos pagos) | Usuário possui |
| Suno | Verificar plano | Varia por plano |
| ElevenLabs | Sim (planos pagos) | Verificar termos |

### O Que Evitar
- Gerar rostos de pessoas reais sem consentimento
- Copiar estilo de artista específico por nome
- Usar output sem pós-processamento como entrega final
- Ignorar artefatos visuais (mãos, texto, distorções)
- Gerar conteúdo que viola guidelines da marca
