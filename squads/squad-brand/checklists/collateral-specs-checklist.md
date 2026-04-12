# Collateral Production Specs Checklist

## Print (10 itens)
| # | Item | Spec | Check |
|---|------|------|-------|
| 1 | Color mode | CMYK (nao RGB) | |
| 2 | Resolucao | 300 DPI minimo | |
| 3 | Bleed | 3mm em todos os lados | |
| 4 | Safe zone | 5mm do trim para texto/logo | |
| 5 | Fontes | Convertidas para curvas OU embedded | |
| 6 | Rich black | C:40 M:40 Y:40 K:100 (nao K:100 puro) | |
| 7 | Overprint | Preto em overprint, sem branco em overprint | |
| 8 | Formato arquivo | PDF/X-1a para grafica | |
| 9 | Color profile | ISO Coated v2 (Europa) ou SWOP (Americas) | |
| 10 | Prova | Soft proof ou hard proof aprovada | |

## Digital (8 itens)
| # | Item | Spec | Check |
|---|------|------|-------|
| 1 | Color mode | RGB (sRGB para web) | |
| 2 | Resolucao | @1x, @2x (retina), @4x (se necessario) | |
| 3 | File size | Imagens < 200KB web, < 1MB social | |
| 4 | Responsivo | Testado mobile (375px), tablet (768px), desktop (1024px+) | |
| 5 | Browser compat | Chrome, Firefox, Safari, Edge (ultimas 2 versoes) | |
| 6 | Acessibilidade | WCAG AA: contrast 4.5:1, alt text, keyboard nav | |
| 7 | Performance | LCP < 2.5s, CLS < 0.1, FID < 100ms | |
| 8 | SEO | Title, meta description, OG tags, structured data | |

## Motion (6 itens)
| # | Item | Spec | Check |
|---|------|------|-------|
| 1 | Frame rate | 60fps (sem drops abaixo de 30fps) | |
| 2 | Codec video | H.264 (compatibilidade) ou H.265 (qualidade) | |
| 3 | Duracao | Conforme spec (bumper 3-5s, outro 5s, etc) | |
| 4 | Loop | Seamless (sem jump ou flash no loop point) | |
| 5 | Audio sync | Audio alinhado com visual (±50ms) | |
| 6 | Reduced motion | prefers-reduced-motion respeitado (fade-only fallback) | |

## Audio (6 itens)
| # | Item | Spec | Check |
|---|------|------|-------|
| 1 | Master format | WAV 48kHz / 24bit | |
| 2 | Web format | MP3 320kbps | |
| 3 | Mobile format | AAC 256kbps | |
| 4 | Loudness | -14 LUFS (streaming standard) | |
| 5 | Peak | True peak < -1dBTP | |
| 6 | Loop audio beds | Seamless (crossfade no loop point) | |
