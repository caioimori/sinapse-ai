# Prompt Engineering for Visual Assets — Knowledge Base

> Guia de engenharia de prompts para geração de assets visuais com IA.

---

## 1. APIs e Capacidades

### DALL-E 3 (OpenAI)
- **Resolução:** 1024x1024, 1024x1792, 1792x1024
- **Força:** Seguir instruções complexas, texto em imagens, composição precisa
- **Fraqueza:** Estilo fotorealista limitado, branding mark preciso
- **Melhor para:** Mockups conceituais, ilustrações, composições criativas
- **Formato prompt:** Texto descritivo natural, detalhado

### Midjourney
- **Resolução:** Até 2048x2048 (upscale)
- **Força:** Qualidade estética excepcional, fotorealismo, estilos artísticos
- **Fraqueza:** Controle preciso limitado, texto em imagens falha
- **Melhor para:** Moodboards, conceitos visuais, fotografias conceituais
- **Parâmetros úteis:** --ar (aspect ratio), --s (stylize), --q (quality), --v (version)

### Ideogram
- **Resolução:** Até 1024x1024
- **Força:** Texto legível em imagens, tipografia
- **Fraqueza:** Menor qualidade geral que Midjourney
- **Melhor para:** Mockups com texto, logos conceituais, sinalizações

### Stable Diffusion (via API)
- **Resolução:** Configurável
- **Força:** Controle total (ControlNet, LoRA), open-source
- **Fraqueza:** Requer mais expertise técnica
- **Melhor para:** Produção em massa, estilo consistente, workflows automatizados

### Gemini (Google)
- **Resolução:** 1024x1024+
- **Força:** Compreensão contextual, instruções multimodais
- **Fraqueza:** Estilo menos refinado que Midjourney
- **Melhor para:** Iterações rápidas, conceitos baseados em referência

---

## 2. Anatomia do Prompt Perfeito

### Estrutura Base
```
[SUJEITO] + [ESTILO] + [COMPOSIÇÃO] + [ILUMINAÇÃO] + [COR] + [DETALHE TÉCNICO] + [MOOD]
```

### Elementos do Prompt
| Elemento | Descrição | Exemplo |
|----------|-----------|---------|
| Sujeito | O que está na imagem | "luxury perfume bottle" |
| Estilo | Estilo visual/artístico | "minimalist product photography" |
| Composição | Como está arranjado | "centered, negative space, eye-level" |
| Iluminação | Tipo de luz | "soft studio lighting, rim light" |
| Cor | Paleta dominante | "deep navy and gold accents" |
| Técnico | Specs de câmera/render | "shot on 85mm f/1.4, shallow DOF" |
| Mood | Atmosfera/sentimento | "sophisticated, premium, aspirational" |

---

## 3. Templates de Prompt por Tipo de Asset

### Mockup de Produto
```
Professional product photography of [PRODUCT] with [BRAND ELEMENTS],
[COMPOSITION STYLE], [LIGHTING], [BACKGROUND],
[CAMERA SPECS], [COLOR PALETTE], [MOOD].
High resolution, commercial quality.
```

**Exemplo:**
```
Professional product photography of a premium skincare bottle
with minimal white label, centered composition on marble surface,
soft diffused studio lighting from above-left, clean white background
with subtle shadow, shot on Phase One 150mm, shallow depth of field,
ivory and sage green color palette, luxurious and clean aesthetic.
High resolution, commercial quality.
```

### Mockup de Apparel
```
[GARMENT TYPE] mockup with [BRAND DESIGN] printed/embroidered,
[MODEL/MANNEQUIN/FLAT LAY], [SETTING], [LIGHTING],
[STYLE], [COLOR], [QUALITY DESCRIPTOR].
```

**Exemplo:**
```
Premium black heavyweight cotton t-shirt with minimal geometric logo
in white screenprint on chest, worn by athletic male model, urban
concrete background, natural golden hour lighting, streetwear editorial
style, monochrome palette with warm undertones, 4K fashion photography.
```

### Mockup de Embalagem
```
[PACKAGE TYPE] packaging design for [BRAND/PRODUCT],
[DESIGN ELEMENTS], [MATERIAL/TEXTURE], [COMPOSITION],
[ENVIRONMENT/SURFACE], [LIGHTING], [MOOD].
```

### Social Media Content
```
[PLATFORM] post design for [BRAND], [VISUAL STYLE],
[COMPOSITION with text space], [COLOR PALETTE],
[ELEMENTS], [FORMAT: square/portrait/landscape],
[MOOD/FEELING]. Clean, shareable, on-brand.
```

### Ambiente / Interior
```
[SPACE TYPE] interior with [BRAND ELEMENTS],
[ARCHITECTURAL STYLE], [MATERIALS], [LIGHTING],
[COLOR SCHEME], [MOOD], architectural photography,
[CAMERA ANGLE], high quality render.
```

---

## 4. Modificadores de Qualidade

### Fotorealismo
- "hyperrealistic", "photorealistic", "8K resolution"
- "shot on [camera model]", "RAW photograph"
- "[lens]mm lens", "f/[aperture]"
- "natural lighting", "studio photography"

### Ilustração
- "digital illustration", "vector art style"
- "flat design", "isometric"
- "line art", "geometric abstraction"
- "watercolor style", "ink drawing"

### 3D Render
- "3D render", "octane render", "blender render"
- "ray tracing", "volumetric lighting"
- "PBR materials", "subsurface scattering"
- "studio HDRI", "product visualization"

### Estilo Artístico
- "in the style of [movement]" (Art Deco, Bauhaus, Swiss Design)
- "inspired by [artist]" (quando permitido)
- "[decade] aesthetic" (70s, 80s, 90s)
- "[cultura] patterns" (Japanese, Scandinavian, African)

---

## 5. Técnicas Avançadas

### Prompt Negativo (Stable Diffusion / Midjourney)
```
--no [elementos indesejados]
```
Exemplos comuns:
- `--no text, watermark, blurry, low quality, distorted`
- `--no people, hands, faces` (quando não quer humanos)

### Consistência de Estilo (Série de Assets)
1. Criar prompt base com todos os elementos de marca
2. Variar apenas o SUJEITO entre prompts
3. Manter mesmos: iluminação, cor, estilo, mood
4. Usar seed fixo quando disponível

### Iteração Eficiente
1. **Prompt inicial:** Amplo, exploratório
2. **Refinamento 1:** Adicionar especificidade de composição
3. **Refinamento 2:** Ajustar iluminação e cor
4. **Final:** Detalhes técnicos e mood fine-tuning
- **Máximo 3 iterações** por asset (regra do squad)

### Multi-shot Consistency
Para manter consistência visual entre múltiplos assets:
- Fixar: paleta de cores, iluminação, estilo
- Variar: sujeito, composição, formato
- Documentar: prompt base em template reutilizável

---

## 6. Mapeamento Brand → Prompt

### Tradução de Atributos de Marca
| Atributo de Marca | Keywords no Prompt |
|-------------------|--------------------|
| Luxuoso | premium, high-end, sophisticated, gold accents, marble, silk |
| Acessível | friendly, approachable, bright, casual, everyday |
| Tecnológico | futuristic, sleek, glass, metal, neon, dark UI |
| Natural | organic, earth tones, linen, wood, botanical |
| Ousado | bold, vibrant, high contrast, dynamic angles |
| Minimalista | clean, minimal, whitespace, simple, essential |
| Divertido | playful, colorful, dynamic, pop art, quirky |
| Confiável | professional, clean, balanced, structured |

### Tradução de Paleta
| Cor | Keywords Associados |
|-----|---------------------|
| Deep Navy | corporate, trust, depth, premium |
| Sage Green | natural, calm, wellness, organic |
| Coral/Terracotta | warm, human, approachable, vibrant |
| Black + Gold | luxury, premium, exclusive, power |
| Pastéis | soft, gentle, friendly, modern minimal |
| Neons | tech, innovation, youth, energy |

---

## 7. Checklist Pre-Geração

- [ ] Paleta de cores definida (HEX values no prompt se possível)
- [ ] Estilo fotográfico/visual definido
- [ ] Formato e resolução definidos
- [ ] Referências visuais analisadas
- [ ] Prompt segue estrutura: sujeito + estilo + composição + luz + cor + técnico + mood
- [ ] Prompt negativo definido (se aplicável)
- [ ] Máximo de 3 iterações planejado
- [ ] Critério de aprovação claro

---

## 8. Limitações e Workarounds

| Limitação | Workaround |
|-----------|-----------|
| Texto ilegível | Usar Ideogram OU adicionar texto em pós-produção |
| Logo inconsistente | Gerar sem logo, overlay em pós |
| Mãos/dedos distorcidos | Especificar "hands not visible" ou retocar |
| Rosto específico | Não possível eticamente — usar stock + compositing |
| Cor exata (HEX) | Gerar próximo + ajustar em pós-produção |
| Formato exato | Gerar maior + crop |
| Tipografia específica | Gerar sem texto + adicionar no design tool |
