# Typography Personality — Knowledge Base

## Classificacao Tipografica

| Classe | Personalidade | Quando Usar | Exemplos |
|--------|--------------|-------------|----------|
| **Serif** | Tradicao, confianca, elegancia, autoridade | Marcas premium, financeiras, editoriais | Times, Georgia, Playfair Display, Lora |
| **Sans-serif** | Moderno, limpo, acessivel, tech | Marcas tech, startups, minimalistas | Inter, Helvetica, Roboto, Montserrat |
| **Slab Serif** | Forte, confiavel, industrial, friendly | Marcas robustas, construccao, food | Rockwell, Roboto Slab, Zilla Slab |
| **Mono** | Tecnico, codigo, dados, precision | Tech, dados, documentacao tecnica | JetBrains Mono, Fira Code, Source Code |
| **Display** | Impacto, unico, expressivo | Headlines, logos, hero text APENAS | Oswald, Bebas Neue, custom fonts |
| **Script** | Elegante, pessoal, feminino, artesanal | Luxury, beauty, weddings, artesanal | Pacifico, Great Vibes, Dancing Script |
| **Handwritten** | Autentitico, casual, humano | Marcas jovens, artesanais, pessoais | Caveat, Patrick Hand, Indie Flower |

## Mapeamento Arquetipo → Tipografia

| Arquetipo | Display | Body | Mood |
|-----------|---------|------|------|
| Inocente | Rounded sans-serif | Light sans-serif | Friendly, simple |
| Explorador | Bold condensed | Geometric sans | Adventurous, direct |
| Sabio | Classic serif | Readable serif | Intellectual, trustworthy |
| Heroi | Heavy bold sans | Strong sans-serif | Powerful, bold |
| Fora-da-Lei | Distressed/grunge | Edgy sans-serif | Rebellious, raw |
| Mago | Elegant serif | Refined sans | Mystical, premium |
| Governante | High-contrast serif | Conservative serif/sans | Authoritative, premium |
| Criador | Unique display | Modern sans | Creative, unique |
| Amante | Script or thin serif | Elegant serif | Romantic, refined |

## Type Scale Ratios

| Nome | Ratio | Uso |
|------|-------|-----|
| Minor Second | 1.067 | Muito compacto, tables |
| Major Second | 1.125 | Compacto, apps mobile |
| Minor Third | 1.200 | Balanceado, web geral |
| Major Third | 1.250 | Classico, versatil |
| Perfect Fourth | 1.333 | Dramatic, editorial |
| Augmented Fourth | 1.414 | Bold, impactful |
| Perfect Fifth | 1.500 | Grande contraste |
| Golden Ratio | 1.618 | Harmonico, classico |

**Exemplo (Major Third 1.250, base 16px):**
- h1: 48.83px | h2: 39.06px | h3: 31.25px | h4: 25px | h5: 20px | h6: 16px | body: 16px | small: 12.8px | caption: 10.24px

## Font Pairing Rules
1. **Contraste:** serif display + sans body (ex: Playfair + Inter)
2. **Concordancia:** mesma familia em weights diferentes (ex: Roboto Bold + Roboto Regular)
3. **EVITAR conflito:** duas fontes similares mas diferentes (ex: Arial + Helvetica)
4. **Max 3 fontes:** display + body + accent (mono optional)

## Web Performance
- Subsetting: remover glyphs nao usados (latin-ext se nao precisa de acentos especiais)
- font-display: swap (previne FOIT)
- Preload: `<link rel="preload" href="font.woff2" as="font" crossorigin>`
- Variable fonts: 1 arquivo vs multiplos weights (economia de 60%+)
- Fallback stack: `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;`

## Fontes Customizadas de Grandes Marcas

Marcas de grande porte criam fontes proprietarias para diferenciacao maxima. Custo: US$ 50K-500K+.

| Marca | Fonte Proprietaria | Caracteristica |
|-------|-------------------|---------------|
| Apple | San Francisco (SF Pro) | Sistema, clean, legibilidade extrema |
| Google | Google Sans (Product Sans) | Geometric, acessivel, moderna |
| Netflix | Netflix Sans | Economica em espaco, legivel em TV |
| Samsung | SamsungOne | Global, multi-script |
| IBM | IBM Plex | Open source, corporativa + humana |
| Airbnb | Cereal | Amigavel, distintiva, moderna |
| Spotify | Circular | Geometric, energica, moderna |

## Pairing Recomendado por Caso de Uso

| Caso | Display | Body | Justificativa |
|------|---------|------|--------------|
| Startup tech moderna | Space Grotesk | Inter | Tech + legivel |
| Marca editorial premium | Playfair Display | Source Sans Pro | Heritage + acessivel |
| Luxury / fashion | Cormorant Garamond | Lato Light | Elegancia + modernidade |
| Marca jovem/energica | Montserrat Bold | Open Sans | Impacto + leitura |
| Developer / tech B2D | JetBrains Mono | Inter | Credibilidade tecnica |

## Classificacao por Personalidade (Kapferer/Aaker)

| Dimensao de Personalidade (Jennifer Aaker) | Tipografia Recomendada |
|------------------------------------------|----------------------|
| Sincerity (Dove, Natura) | Rounded sans-serif, humanista |
| Excitement (Nike, Red Bull) | Bold condensed, display energica |
| Competence (McKinsey, Volvo) | Serif classica ou sans-serif geometrica neutra |
| Sophistication (Chanel, Rolex) | Serif elegante, alto contraste, thin weight |
| Ruggedness (Jeep, Harley-Davidson) | Slab serif, display industrial, condensed bold |
