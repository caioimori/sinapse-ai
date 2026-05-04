# Delivery Formats — Knowledge Base

> Formatos de entrega, especificações e empacotamento de projetos de marca.

---

## 1. Estrutura de Pacote de Entrega

### Estrutura Completa
```
{brand-name}-brand-v{version}/
├── 01-BRANDBOOK/
│   ├── {brand}-brandbook-v{version}.pdf     # PDF interativo
│   ├── {brand}-quick-reference.pdf          # Quick reference card
│   └── {brand}-onboarding-guide.pdf         # Guia de onboarding
│
├── 02-LOGOS/
│   ├── primary/
│   │   ├── svg/   {brand}-logo-primary.svg
│   │   ├── png/   {brand}-logo-primary-@1x.png, @2x.png, @4x.png
│   │   └── eps/   {brand}-logo-primary.eps
│   ├── horizontal/
│   ├── icon/
│   ├── monochrome/
│   ├── negative/
│   └── favicon/
│       ├── favicon.ico (16x16, 32x32, 48x48)
│       ├── favicon.svg
│       ├── apple-touch-icon.png (180x180)
│       └── android-chrome-{size}.png (192x192, 512x512)
│
├── 03-TYPOGRAPHY/
│   ├── fonts/
│   │   ├── {display-font}/ (OTF/TTF/WOFF2)
│   │   ├── {body-font}/ (OTF/TTF/WOFF2)
│   │   └── {mono-font}/ (OTF/TTF/WOFF2, se aplicável)
│   └── licenses/ (licenças de uso)
│
├── 04-COLORS/
│   ├── {brand}-color-palette.pdf
│   ├── {brand}-colors.ase (Adobe Swatch)
│   ├── {brand}-colors.sketchpalette
│   └── {brand}-colors.css
│
├── 05-ASSETS/
│   ├── icons/ (SVG sprite + individuais)
│   ├── patterns/ (SVG + PNG seamless)
│   ├── illustrations/ (SVG + PNG)
│   ├── photography/ (curated stock + direction doc)
│   └── mockups/ (PSD/AI/PNG em alta resolução)
│
├── 06-TEMPLATES/
│   ├── stationery/
│   │   ├── business-card/ (AI/PSD/PDF print-ready)
│   │   ├── letterhead/ (DOCX/AI/PDF)
│   │   ├── envelope/ (AI/PDF)
│   │   └── folder/ (AI/PDF)
│   ├── presentations/
│   │   ├── google-slides/
│   │   ├── powerpoint/
│   │   └── keynote/ (se aplicável)
│   ├── social-media/
│   │   ├── instagram/ (feed, stories, reels cover)
│   │   ├── linkedin/ (post, banner, article)
│   │   ├── twitter/ (post, header)
│   │   ├── youtube/ (thumbnail, banner, end screen)
│   │   └── tiktok/ (cover)
│   ├── email/
│   │   ├── signature/ (HTML + instruções)
│   │   └── newsletter/ (HTML template)
│   └── documents/
│       ├── proposal/ (DOCX/PDF)
│       ├── invoice/ (DOCX/PDF)
│       └── report/ (DOCX/PDF)
│
├── 07-DESIGN-SYSTEM/
│   ├── tokens/
│   │   ├── tokens.css
│   │   ├── tokens.scss
│   │   ├── tokens.json
│   │   └── tailwind.config.js
│   ├── components/ (código ou Figma link)
│   └── figma-library-link.md
│
├── 08-MOTION/
│   ├── animations/ (CSS/Lottie/After Effects)
│   ├── video-templates/ (AE project + renders)
│   └── motion-guidelines.pdf
│
├── 09-AUDIO/
│   ├── audio-logo/ (WAV + MP3 + AAC, 3 versões)
│   ├── ui-sounds/ (WAV + MP3, 6 sons)
│   ├── audio-beds/ (WAV + MP3, 5 moods × 3 durações)
│   └── voice-guidelines.pdf
│
├── 10-GOVERNANCE/
│   ├── {brand}-governance.pdf
│   ├── approval-matrix.pdf
│   └── update-process.pdf
│
├── README.md          # Índice + instruções
└── CHANGELOG.md       # Histórico de versões
```

---

## 2. Formatos de Arquivo por Tipo

### Logos
| Formato | Uso | Quando Entregar |
|---------|-----|-----------------|
| SVG | Web, digital, escalável | Sempre |
| PNG @1x | Digital standard | Sempre |
| PNG @2x | Retina/HiDPI | Sempre |
| PNG @4x | Ultra-high DPI | Sempre |
| EPS | Print, gráficas | Para projetos com print |
| AI | Editável (Illustrator) | Sob demanda |
| PDF | Impressão e compartilhamento | Sempre |

### Tipografia
| Formato | Uso | Prioridade |
|---------|-----|-----------|
| WOFF2 | Web (browser moderno) | Obrigatório |
| WOFF | Web (fallback) | Recomendado |
| OTF | Desktop (Mac/Win) | Obrigatório |
| TTF | Desktop + Android | Recomendado |
| Variable Font | Web/Desktop performant | Se disponível |

### Imagens
| Formato | Uso | Compressão |
|---------|-----|-----------|
| PNG | Transparência, ícones, UI | Lossless |
| JPEG | Fotos, backgrounds | 85-92% quality |
| WebP | Web otimizado | 80% quality, 30% menor |
| AVIF | Web next-gen | 60-70% quality, 50% menor |
| SVG | Gráficos vetoriais | Texto/paths |
| TIFF | Print master | Sem compressão |
| PSD | Editável (Photoshop) | Sem compressão |
| AI | Editável (Illustrator) | Sem compressão |

### Audio
| Formato | Uso | Qualidade |
|---------|-----|-----------|
| WAV 48kHz/24bit | Master | Lossless |
| MP3 320kbps | Web/geral | High quality lossy |
| AAC 256kbps | iOS/mobile | High quality lossy |
| OGG 320kbps | Web fallback | High quality lossy |

### Vídeo
| Formato | Uso | Codec |
|---------|-----|-------|
| MOV (ProRes) | Master | Apple ProRes 422 |
| MP4 (H.264) | Web/geral | H.264, CRF 18-23 |
| MP4 (H.265) | Qualidade máxima | H.265/HEVC |
| WebM | Web fallback | VP9 |
| GIF | Animações simples | 256 cores |
| Lottie (JSON) | Web animations | Vector-based |

---

## 3. Naming Convention

### Padrão
```
{brand}-{asset-type}-{variant}-{size}.{ext}
```

### Exemplos
```
acme-logo-primary.svg
acme-logo-horizontal-negative.svg
acme-logo-icon-@2x.png
acme-pattern-geometric-dark.svg
acme-icon-arrow-right-24.svg
acme-audio-logo-short.wav
acme-audio-bed-calm-60s.mp3
acme-mockup-tshirt-white-front.png
acme-template-instagram-feed-01.psd
```

### Regras
1. Tudo em lowercase
2. Separador: hífen (-)
3. Sem espaços, acentos ou caracteres especiais
4. Sufixo de tamanho: @1x, @2x, @4x ou dimensão (24, 48)
5. Versão no folder pai, não no nome do arquivo

---

## 4. Controle de Qualidade Pre-Entrega

### Checklist de Entrega
- [ ] Todos os arquivos nomeados corretamente (naming convention)
- [ ] README.md com índice completo e instruções
- [ ] CHANGELOG.md com versão atual documentada
- [ ] Zero arquivos temporários (.DS_Store, Thumbs.db, .tmp)
- [ ] Zero arquivos de trabalho (PSD com layers bagunçadas)
- [ ] Logos: todas as variações em SVG + PNG (@1x, @2x, @4x)
- [ ] Fontes: licenças incluídas, formatos web (WOFF2) + desktop (OTF)
- [ ] Cores: documentadas em HEX, RGB, CMYK, HSL
- [ ] Tokens: exportados em CSS + JSON + Tailwind mínimo
- [ ] Templates: editáveis (não achatados)
- [ ] Audio: master WAV + versões comprimidas
- [ ] Brandbook: PDF interativo com bookmarks
- [ ] Quick Reference: imprimível em A4
- [ ] Tamanho total do pacote: documentado

### Peso Máximo por Tipo
| Tipo | Peso Máximo | Nota |
|------|-------------|------|
| Brandbook PDF | 50MB | Comprimir imagens internas |
| Logo SVG | 100KB | Otimizar paths |
| Logo PNG @4x | 2MB | Compressão adequada |
| Mockup PNG | 5MB | Máximo por imagem |
| Audio WAV | 20MB | Por arquivo |
| Pacote total ZIP | 500MB | Usar compressão |

---

## 5. Métodos de Entrega

### Opção 1: Cloud Storage (Recomendado)
- **Google Drive:** Pasta compartilhada com permissões
- **Dropbox:** Business link compartilhado
- **OneDrive:** Compartilhamento corporativo
- **Vantagem:** Fácil de atualizar, controle de acesso

### Opção 2: Download Direto
- **ZIP comprimido** com estrutura de pastas
- **Link temporário** com prazo de expiração
- **Vantagem:** Offline access, sem dependência

### Opção 3: Git Repository (Design System)
- **GitHub/GitLab** para tokens, componentes, código
- **NPM package** para consumo por devs
- **Vantagem:** Versionamento, CI/CD, automação

### Opção 4: Design Tool
- **Figma:** Library compartilhada + componentes
- **Storybook:** Componentes documentados + interativos
- **Vantagem:** Uso direto pela equipe de design/dev

### Entrega Combinada (Recomendada)
```
1. Figma Library → para designers
2. NPM package → para devs (tokens + componentes)
3. Cloud folder → para stakeholders (brandbook + assets)
4. Storybook → para documentação viva
```

---

## 6. Post-Entrega

### Onboarding Session
- **Duração:** 60-90 minutos
- **Participantes:** Brand manager + designers + devs + marketing
- **Conteúdo:** Walkthrough do brandbook, Q&A, acesso a assets
- **Output:** Gravação da sessão + follow-up email

### Follow-ups
| Timing | Ação |
|--------|------|
| 24h | Email de confirmação + links de acesso |
| 1 semana | Check-in: "Alguma dúvida?" |
| 30 dias | Review de adoção + ajustes necessários |
| 90 dias | Auditoria rápida de consistência |
| 6 meses | Revisão de brand health |
| 12 meses | Full audit + proposta de atualização |

### SLA de Suporte
| Tipo | Tempo de Resposta |
|------|-------------------|
| Dúvida simples | 24h úteis |
| Necessidade de asset | 48h úteis |
| Correção de erro | 24h úteis |
| Nova aplicação | Novo escopo |
