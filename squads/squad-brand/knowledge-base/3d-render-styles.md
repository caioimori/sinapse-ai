# 3D Render Styles — Knowledge Base

> Estilos de render 3D para mockups e visualizações de marca.

---

## 1. Estilos de Render

### 1.1 Product Visualization (Studio)
- **Uso:** Mockups de produtos, embalagens, acessórios
- **Iluminação:** 3-point studio (key + fill + rim)
- **Background:** Infinito branco/neutro ou gradiente sutil
- **Materiais:** PBR (Physically Based Rendering), realistas
- **Qualidade:** Fotorealismo máximo, ray tracing
- **Ferramentas:** Blender Cycles, Cinema 4D + Octane, KeyShot

### 1.2 Lifestyle / Scene
- **Uso:** Produto em contexto real, ambientação
- **Iluminação:** HDRI environment maps, luz natural simulada
- **Background:** Cenário completo (escritório, loja, casa)
- **Materiais:** Texturas realistas + imperfeições
- **Qualidade:** Fotorealismo com storytelling
- **Ferramentas:** Blender Cycles, Unreal Engine 5

### 1.3 Isometric / Flat 3D
- **Uso:** Infográficos, explicativos, UI illustrations
- **Iluminação:** Flat, sem sombras duras, ambient occlusion
- **Background:** Transparente ou cor sólida
- **Materiais:** Cores sólidas, matte, sem reflexos complexos
- **Qualidade:** Stylized, clean, vetorial feel
- **Ferramentas:** Blender EEVEE, Spline, Figma 3D plugins

### 1.4 Clay / Monochrome
- **Uso:** Apresentações de conceito, antes do material final
- **Iluminação:** Suave, studio, ambient occlusion
- **Background:** Branco ou gradiente sutil
- **Materiais:** Matte clay, sem textura, cor única
- **Qualidade:** Focus na forma, sem distração de cor/textura
- **Ferramentas:** Qualquer engine com material override

### 1.5 Stylized / Cartoon
- **Uso:** Marcas playful, ilustrações animadas, social
- **Iluminação:** Flat ou cel-shading
- **Background:** Cores vibrantes, gradientes
- **Materiais:** Toon shader, cores sólidas, outline
- **Qualidade:** Estilizado, on-brand, fun
- **Ferramentas:** Blender (Freestyle), Cinema 4D

### 1.6 Abstract / Generative
- **Uso:** Hero images, backgrounds, visual identity elements
- **Iluminação:** Volumétrica, emissive, experimental
- **Background:** Dark ou gradiente de marca
- **Materiais:** Glass, metal reflexivo, emissive, subsurface
- **Qualidade:** Artístico, impactante, sem representação literal
- **Ferramentas:** Blender + Geometry Nodes, Houdini, TouchDesigner

---

## 2. Materiais PBR — Referência

### Materiais Comuns para Branding
| Material | Roughness | Metallic | IOR | Uso em Branding |
|----------|-----------|----------|-----|-----------------|
| Papel matte | 0.8-1.0 | 0 | 1.5 | Business cards, packaging |
| Papel glossy | 0.1-0.3 | 0 | 1.5 | Revistas, folders |
| Plástico matte | 0.5-0.7 | 0 | 1.45 | Packaging, gadgets |
| Plástico glossy | 0.05-0.2 | 0 | 1.45 | Gadgets premium |
| Metal brushed | 0.3-0.5 | 1 | — | Sinalização, troféus |
| Metal polished | 0.02-0.1 | 1 | — | Logo em relevo, foil |
| Vidro clear | 0.01-0.05 | 0 | 1.52 | Frascos, vitrines |
| Vidro frosted | 0.3-0.6 | 0 | 1.52 | Embalagens premium |
| Tecido cotton | 0.8-1.0 | 0 | 1.5 | Camisetas, uniforms |
| Couro | 0.5-0.8 | 0 | 1.4 | Agendas, bolsas |
| Madeira | 0.5-0.9 | 0 | 1.5 | Sinalização, packaging eco |
| Concreto | 0.8-1.0 | 0 | 1.5 | Signage, environment |

### Acabamentos Especiais (Foil / Spot UV)
| Acabamento | Como Simular |
|------------|-------------|
| Hot foil gold | Metallic=1, Roughness=0.1, Color=gold (#D4AF37) |
| Hot foil silver | Metallic=1, Roughness=0.05, Color=silver (#C0C0C0) |
| Spot UV | Roughness map: 0.9 (base) vs 0.05 (UV area) |
| Emboss | Normal map com relevo, Roughness uniforme |
| Deboss | Normal map invertido |
| Laminação matte | Roughness=0.7, sem metallic |
| Laminação soft-touch | Roughness=0.9, subsurface scatter sutil |

---

## 3. Iluminação para Produtos

### HDRI Studios
| HDRI | Mood | Uso |
|------|------|-----|
| Studio white | Clean, neutro | Produto puro, e-commerce |
| Studio warm | Acolhedor, premium | Cosmetics, food |
| Studio dramatic | Contrastado, impactante | Tech, automotive |
| Outdoor daylight | Natural, lifestyle | Outdoor, sustainability |
| Sunset/golden | Quente, emocional | Lifestyle, premium |

### 3-Point Lighting Setup
```
Key Light (principal):
- Posição: 45° acima e à esquerda
- Intensidade: 100%
- Tipo: Softbox grande

Fill Light (preenchimento):
- Posição: 30° à direita, mesmo nível
- Intensidade: 30-50% do key
- Tipo: Refletor ou softbox maior

Rim Light (contorno):
- Posição: Atrás, acima
- Intensidade: 50-80% do key
- Tipo: Strip softbox
```

---

## 4. Composição 3D por Tipo de Mockup

### Business Card
- **Câmera:** 35-50mm, leve ângulo (15-30°)
- **Composição:** 2-3 cards overlapping, uma face up, uma face down
- **Superfície:** Mármore, madeira, concreto, cor sólida
- **Sombra:** Contact shadow suave
- **Resolução:** 3000x2000px mínimo

### Packaging
- **Câmera:** 50-85mm, hero angle (3/4 view)
- **Composição:** Produto + 1-2 ingredientes/elementos
- **Superfície:** Contextual (mesa, prateleira)
- **Sombra:** Natural, soft
- **Resolução:** 3000x3000px mínimo

### Apparel (T-shirt)
- **Câmera:** 85mm, frontal
- **Composição:** Flat lay ou em modelo 3D
- **Superfície:** Flat lay = fundo clean / Modelo = contextual
- **Dobras:** Realistas, cloth simulation
- **Resolução:** 2400x3000px mínimo

### Signage / Environment
- **Câmera:** 24-35mm, perspectiva natural
- **Composição:** Mock in-situ (fachada, parede, recepção)
- **Iluminação:** Matching da cena (interior/exterior)
- **Resolução:** 4000x2500px mínimo

### Device Mockup (Screen)
- **Câmera:** 50mm, leve tilt
- **Composição:** Device + elementos de contexto (mesa, teclado)
- **Tela:** UI/Screenshot inserido, glare realista
- **Resolução:** 3000x2000px mínimo

---

## 5. Otimização e Entrega

### Formatos de Render
| Formato | Uso | Bits | Notas |
|---------|-----|------|-------|
| EXR | Master/compositing | 32-bit float | Máxima qualidade, grande |
| PNG | Entrega com transparência | 16-bit | Lossless |
| JPEG | Entrega web/social | 8-bit | 90% quality |
| WebP | Web otimizado | 8-bit | 30% menor que JPEG |
| TIFF | Print | 16-bit | CMYK se necessário |

### Resoluções Padrão
| Uso | Resolução | DPI |
|-----|-----------|-----|
| Instagram post | 2160x2160 | 72 |
| Hero web | 3840x2160 | 72 |
| Print A4 | 3508x2480 | 300 |
| Print A3 | 4961x3508 | 300 |
| Apresentação | 3840x2160 | 72 |

### Performance / Tempo de Render
| Qualidade | Samples (Cycles) | Tempo Estimado | Uso |
|-----------|------------------|----------------|-----|
| Preview | 64-128 | 1-5 min | Iteração rápida |
| Draft | 256-512 | 5-15 min | Aprovação interna |
| Final | 1024-4096 | 15-60 min | Entrega ao cliente |
| Showcase | 4096+ | 1-4 horas | Portfolio, impressão grande |

---

## 6. Prompts para IA Generativa 3D

### Prompt Structure
```
3D render of [OBJECT], [MATERIAL], [LIGHTING],
[BACKGROUND], [COMPOSITION], [STYLE],
[ENGINE/QUALITY MODIFIERS]
```

### Exemplo: Business Card
```
3D render of premium business cards on marble surface,
matte white paper with gold foil logo, soft studio lighting
with rim light, clean white background with subtle shadow,
angled composition 3 cards slightly overlapping,
photorealistic product visualization, octane render,
8K resolution, ray tracing, shallow depth of field
```

### Quality Keywords
- "octane render", "cycles render", "vray render"
- "ray tracing", "global illumination", "caustics"
- "8K", "ultra detailed", "photorealistic"
- "studio lighting", "HDRI", "volumetric"
- "physically based materials", "PBR"
- "depth of field", "bokeh", "ambient occlusion"
