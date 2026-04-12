# Brandbook Structure — Knowledge Base

> Estrutura, conteúdo e boas práticas para compilação de brandbooks profissionais.

---

## 1. Estrutura Padrão (10 Seções)

### Seção 1: Capa + Créditos (2-4 páginas)
- Logo principal centralizado
- Nome da marca + "Brand Guidelines"
- Versão + data + status (draft/final)
- Créditos: equipe de criação
- Índice interativo (com hyperlinks)

### Seção 2: Introdução (4-6 páginas)
- Propósito do documento
- Como usar este guia (instruções de navegação)
- Para quem é (público do documento)
- Contatos para dúvidas
- Glossário de termos (se necessário)

### Seção 3: Estratégia de Marca (12-20 páginas)
| Subsecção | Páginas | Conteúdo |
|-----------|---------|----------|
| Posicionamento | 2-3 | Statement + mapa perceptual + diferenciação |
| Arquétipo | 2-3 | Arquétipo escolhido + justificativa + atributos |
| Manifesto | 3-4 | Propósito, visão, missão, valores, tagline |
| Tom de Voz | 3-4 | 4 dimensões + DOs/DON'Ts + exemplos por canal |
| Personas | 3-5 | 3-5 personas com perfil completo |
| Brand Architecture | 1-2 | Hierarquia + naming rules |

### Seção 4: Identidade Visual (16-24 páginas)
| Subsecção | Páginas | Conteúdo |
|-----------|---------|----------|
| Paleta de Cores | 3-4 | Primária + secundária + acento + escalas + WCAG |
| Tipografia | 3-4 | Display + body + mono + scale + pairing |
| Logo System | 4-6 | 6+ variações + proteção + mínimo + proibidos |
| Fotografia | 2-3 | Estilo + iluminação + composição + DON'Ts |
| Ilustração | 1-2 | Estilo + paleta + regras |
| Vocabulário Gráfico | 1-2 | Formas + patterns + elementos |
| Tratamento de Imagem | 1-2 | Filtros + overlays + crops |
| Data Visualization | 1-2 | Paleta dados + chart styles |

### Seção 5: Design System (8-12 páginas)
| Subsecção | Páginas | Conteúdo |
|-----------|---------|----------|
| Tokens | 2-3 | 3 níveis + naming + export formats |
| Grid | 1-2 | 12-col + breakpoints + containers |
| Componentes | 3-5 | Anatomia + variações + estados + ARIA |
| Dark Mode | 1-2 | Remapeamento + implementação |

### Seção 6: Aplicações (12-20 páginas)
| Subsecção | Páginas | Conteúdo |
|-----------|---------|----------|
| Business Cards | 1-2 | Design + specs + mockup |
| Stationery | 2-3 | Letterhead + envelope + folder |
| Apresentações | 1-2 | Template + slide types |
| Social Media | 2-3 | Templates por plataforma |
| Web | 2-3 | Templates de página |
| Packaging | 1-2 | Design + dieline (se aplicável) |
| Signage | 1-2 | Environmental branding |

### Seção 7: Motion (6-8 páginas)
| Subsecção | Páginas | Conteúdo |
|-----------|---------|----------|
| Motion Principles | 1-2 | Regras + easing + duration |
| Micro-Interactions | 1-2 | Por componente + CSS |
| Page Transitions | 1 | Tipos + scroll animations |
| Video Templates | 1-2 | Intro + outro + lower thirds |

### Seção 8: Audio (4-6 páginas)
| Subsecção | Páginas | Conteúdo |
|-----------|---------|----------|
| Sonic Identity | 1-2 | Sonic DNA + atributos |
| Audio Logo | 1 | 3 versões + specs |
| UI Sounds | 1 | 6 sons de interface |
| Audio Beds | 1 | 5 moods + loops |

### Seção 9: Governança (4-6 páginas)
| Subsecção | Páginas | Conteúdo |
|-----------|---------|----------|
| Aprovação de Uso | 1-2 | Quem aprova + processo |
| Licenciamento | 1 | Parceiros + co-branding |
| Atualização | 1 | Processo + versionamento |
| Contatos | 1 | Responsáveis + emails |

### Seção 10: Apêndices (variável)
- Glossário completo
- Arquivo de fontes e links
- Código CSS/SCSS dos tokens
- QR codes para assets digitais

---

## 2. Formatos de Entrega

### PDF Interativo
- **Páginas:** 80-150
- **Formato:** A4 landscape (297×210mm) ou 16:9 (1920×1080px)
- **Features:** Hyperlinks, bookmarks, índice clicável
- **Peso máximo:** 50MB
- **Ferramenta:** InDesign, Figma + plugin PDF

### Web (HTML)
- **Formato:** Site one-page ou multi-page
- **Features:** Busca, copiar código, download assets
- **Responsive:** Sim (mobile, tablet, desktop)
- **Ferramentas:** Gitbook, Notion, Storybook, custom site

### Figma Library
- **Formato:** Figma file compartilhado
- **Features:** Componentes, variáveis, estilos
- **Vantagem:** Designers usam diretamente
- **Atualização:** Em tempo real

### Pacote Completo
```
brand-{name}-v{version}/
├── Brandbook.pdf              # PDF interativo
├── Quick-Reference.pdf        # Card de referência
├── assets/
│   ├── logos/                 # SVG + PNG todas variações
│   ├── icons/                 # SVG sprite + individuais
│   ├── patterns/              # SVG + PNG
│   ├── fonts/                 # Arquivos de fonte
│   ├── photos/                # Banco de imagens
│   └── audio/                 # Sons + música
├── tokens/
│   ├── tokens.css             # CSS Custom Properties
│   ├── tokens.scss            # SCSS variables
│   ├── tokens.json            # JSON (Style Dictionary)
│   └── tailwind.config.js     # Tailwind theme
├── templates/
│   ├── figma/                 # Figma files
│   ├── sketch/                # Sketch files (se aplicável)
│   ├── google-slides/         # Apresentação template
│   ├── social/                # Templates por rede
│   └── email/                 # Email templates HTML
├── mockups/                   # Mockups em alta resolução
├── README.md                  # Instruções de uso
└── CHANGELOG.md               # Histórico de versões
```

---

## 3. Níveis de Brandbook

### Level 1: Brand Essentials (20-30 páginas)
- Logo + variações
- Paleta de cores (primária + secundária)
- Tipografia (display + body)
- Tom de voz (resumo)
- Quick reference card
- **Ideal para:** Startups early-stage, projetos com orçamento limitado

### Level 2: Brand System (60-80 páginas)
- Tudo do Level 1 +
- Posicionamento + arquétipo + manifesto
- Photography direction
- Social media guidelines
- Stationery (business card + letterhead)
- Design tokens básicos
- **Ideal para:** Empresas em crescimento, marcas com presença digital

### Level 3: Brand Universe (80-150 páginas)
- Tudo do Level 2 +
- Personas detalhadas
- Design system completo (tokens + componentes)
- Motion language
- Sonic identity
- Packaging guidelines
- Governança completa
- **Ideal para:** Marcas consolidadas, franquias, empresas com múltiplos touchpoints

---

## 4. Boas Práticas de Compilação

### Regras de Conteúdo
1. **Zero placeholders** — Todo campo deve ter conteúdo real
2. **Show, don't tell** — Exemplos visuais > descrições textuais
3. **DOs & DON'Ts** — Sempre incluir o que NÃO fazer
4. **Contexto** — Explicar POR QUE, não apenas O QUE
5. **Exemplos reais** — Mostrar em aplicação, não isolado

### Regras de Design do Documento
1. **Grid** — O próprio brandbook deve seguir o grid da marca
2. **Tipografia** — Usar as fontes da marca no documento
3. **Cores** — Usar a paleta da marca no layout
4. **Consistência** — Mesmo estilo visual em todas as páginas
5. **Legibilidade** — Texto mínimo 10pt, contraste adequado

### Regras de Versionamento
```
v1.0.0 — Release inicial
v1.1.0 — Adição de novas seções
v1.0.1 — Correção de erros
v2.0.0 — Rebranding / mudança significativa
```
- Incluir data em toda versão
- Changelog detalhado
- Versões anteriores arquivadas

---

## 5. Erros Comuns a Evitar

| Erro | Impacto | Solução |
|------|---------|---------|
| Brandbook muito longo | Ninguém lê | Manter focado, max 150 páginas |
| Sem exemplos de uso | Difícil de aplicar | Mínimo 1 exemplo por regra |
| Só DOs sem DON'Ts | Ambiguidade | Sempre mostrar o que NÃO fazer |
| Sem Quick Reference | Adoção baixa | Card de 2-4 páginas obrigatório |
| Desatualizado | Marca fragmenta | Processo de atualização definido |
| PDF não interativo | Difícil navegar | Bookmarks + hyperlinks |
| Sem tokens/código | Dev improvisa | Exportar em CSS/JSON/SCSS |
| Sem governance | Uso inconsistente | Definir quem aprova e como |
| Complexo demais | Intimidador | Linguagem acessível, visual |
| Sem versão digital | Inacessível | Site ou Figma library |

---

## 6. Métricas de Qualidade do Brandbook

| Métrica | Target | Como Medir |
|---------|--------|-----------|
| Completude | 100% seções preenchidas | Checklist de seções |
| Exemplos visuais | ≥1 por regra | Contagem manual |
| DOs/DON'Ts | ≥3 por categoria | Contagem manual |
| Acessibilidade | WCAG AA no próprio doc | Contraste check |
| Peso | <50MB PDF | File size |
| Navegabilidade | Bookmarks + hyperlinks | Teste manual |
| Aplicabilidade | Dev consegue implementar | Teste com dev real |
| Clareza | Leitor entende sem ajuda | Teste com 3 pessoas |
