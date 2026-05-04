---
task: create-brand-characters
responsavel: "@brand-creative-engineer"
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

# Task: Create Brand Characters, Avatars & Mascots

> Criar personagens, avatares e mascotes proprietarios da marca — do conceito a producao de assets utilizaveis.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-creative-engineer (Forge) |
| **Co-agents** | brand-identity-designer (Iris) direcao visual, brand-strategist (Athena) personalidade, brand-culture-architect (Ethos) valores |
| **Trigger** | Quando marca precisa de personagem, mascote ou sistema de avatares |
| **Input** | Illustration system (de Iris), brand personality, brand values, target audience, contextos de uso |
| **Output** | `brand-characters/` (character sheets + assets exportados) |
| **Handoff** | → brand-compiler (Atlas) para brandbook + brand-motion-vfx (Flux) para animacao |
| **Complexity** | complex |
| **Referencias** | Duolingo (Duo), Mailchimp (Freddie), Headspace (characters), Slack (emoji characters), Reddit (Snoo), GitHub (Octocat), Discord (Clyde & Wumpus), M&Ms (characters) |

---

## Fundamentacao

Brand characters criam **conexao emocional** que logos e cores sozinhos nao alcancam. Duolingo reinventou sua marca inteira ao redor do Duo. Discord construiu comunidade ao redor do Wumpus. M&Ms geram bilhoes em brand equity com personagens de 70 anos.

**Tipos de brand character:**

```
MASCOTE          AVATAR SYSTEM       PERSONAGEM NARRATIVO
┌──────────┐     ┌──────────┐        ┌──────────┐
│ 1 char   │     │ N chars  │        │ Cast de  │
│ principal │     │ sistema  │        │ personag.│
│ unico    │     │ customiz.│        │ com arco │
└──────────┘     └──────────┘        └──────────┘
 Duo, Freddie    Notion, Apple        Headspace, M&Ms
                 Memoji               characters
```

---

## Steps

### Step 1: Definir Tipo e Proposito do Character

| Tipo | Descricao | Quando Usar | Exemplos |
|------|-----------|-------------|----------|
| **Mascote unico** | Um personagem central que representa a marca | Quando marca quer um "rosto" reconhecivel | Duo (Duolingo), Freddie (Mailchimp) |
| **Duo/Trio** | 2-3 personagens que interagem | Quando marca precisa de dinamica/narrativa | M&Ms, Snap/Crackle/Pop |
| **Cast expandido** | Varios personagens com roles distintos | Quando marca precisa representar diversidade | Discord, Inside Out |
| **Sistema de avatares** | Template customizavel para usuarios/equipe | Quando marca precisa de personalizacao | Notion, Apple Memoji |
| **Icone vivo** | Logo ou icone que ganha expressoes/movimentos | Quando logo existente pode ser "humanizado" | GitHub Octocat, Reddit Snoo |

### Step 2: Definir Personalidade do Character

**Character Profile:**

| Atributo | Definicao |
|----------|----------|
| **Nome** | {nome do personagem — memoravel, pronunciavel, alinhado com marca} |
| **Especie/Tipo** | {humano, animal, criatura, objeto, abstrato} |
| **Personalidade** | {3-5 traits alinhados com brand personality} |
| **Voz** | {como fala — se aplicavel} |
| **Expressao padrao** | {emocao default: alegre, curioso, calmo, energetico} |
| **Backstory** | {1-2 frases de origem — opcional mas agrega} |
| **Relacionamento com usuario** | {guia, amigo, assistente, provocador, protetor} |
| **O que FAZ** | {papel funcional: ensina, acompanha, celebra, alerta} |
| **O que NUNCA faz** | {limites: nunca e agressivo, nunca e passivo, etc.} |

### Step 3: Criar Character Sheet

**Model Sheet com:**

| Elemento | Especificacao |
|----------|--------------|
| **Vista frontal** | Pose padrao, expressao neutra-positiva |
| **Vista 3/4** | Angulo mais dinamico |
| **Vista lateral** | Perfil |
| **Vista traseira** | Se relevante para animacao/3D |
| **Expressoes** | Minimo 8: neutro, feliz, triste, surpreso, pensativo, irritado, animado, confuso |
| **Poses** | Minimo 6: padrao, acenando, apontando, celebrando, pensando, apresentando |
| **Escala** | Proporcoes head-to-body definidas (ex: 1:3, 1:2.5) |
| **Cores** | Paleta especifica do personagem (subset da brand palette) |
| **Acessorios** | Itens caracteristicos (se houver) |
| **Tamanhos** | Como funciona em favicon (16px), icone (64px), hero (1024px+) |

### Step 4: Definir Variantes de Contexto

| Contexto | Variante | Exemplo |
|----------|---------|---------|
| **Social media** | Reacoes, stickers, GIFs | Duo fazendo squats no TikTok |
| **Website** | Empty states, loading, success/error | Mailchimp high-five |
| **App/SaaS** | Onboarding, achievements, notifications | Duolingo streak |
| **Conteudo** | Thumbnails, capas, illustrations | Character como host |
| **Apresentacoes** | Slides, decks, reports | Character como guia |
| **Eventos** | Badges, standees, photo opportunities | Character em tamanho real |
| **Merchandise** | Camisetas, adesivos, brindes | Character em produtos |
| **Sazonal** | Natal, Halloween, datas especiais | Character com tema |

### Step 5: Definir Sistema de Expressoes e Emocoes

**Emotion Grid:**

| Emocao | Olhos | Boca | Corpo | Quando Usar |
|--------|-------|------|-------|-------------|
| Neutro/Calmo | Abertos, relaxados | Leve sorriso | Postura relaxada | Estado padrao |
| Feliz | Abertos, brilhantes | Sorriso aberto | Bracos para cima | Sucesso, celebracao |
| Empolgado | Muito abertos | Sorriso grande | Pulando/vibrando | Achievement, lancamento |
| Pensativo | Semi-cerrados | Labio lateral | Mao no queixo | Loading, processando |
| Surpreso | Muito abertos | "O" | Corpo para tras | Novidade, descoberta |
| Triste | Caidos | Virada para baixo | Ombros baixos | Erro, perda de streak |
| Confuso | Assimetricos | Torcida | Cabeca inclinada | Ajuda, FAQ |
| Determinado | Focados | Firme | Postura forte | Desafio, CTA |

### Step 6: Definir Guidelines de Uso

**Regras de aplicacao:**

| Regra | Descricao |
|-------|----------|
| **Consistencia** | Character SEMPRE no estilo definido. Sem variacoes "artisticas" nao aprovadas |
| **Escala** | Minimo 32px para digital. Abaixo disso, usar versao simplificada |
| **Espaco** | Character precisa de breathing room — nunca espremido |
| **Cor** | NUNCA alterar cores do character. Versao mono/outline permitida se documentada |
| **Expressao** | Usar expressao APROPRIADA ao contexto. Nunca feliz em mensagem de erro |
| **Frequencia** | Nao usar character em TUDO. Impacto vem de uso estrategico, nao spam |
| **Co-branding** | Em contextos co-branded, character da marca host prevalece |
| **Acessibilidade** | Character NUNCA substitui texto funcional. E decorativo/complementar |

### Step 7: Producao de Assets

**Export checklist:**

| Asset | Formato | Tamanhos | Uso |
|-------|---------|----------|-----|
| Character principal | SVG + PNG | 64, 128, 256, 512, 1024px | Todos |
| Expressoes (8) | SVG + PNG | 64, 128, 256px | App, social, conteudo |
| Poses (6) | SVG + PNG | 256, 512, 1024px | Marketing, conteudo |
| Sticker pack | PNG + WebP + GIF | 512px | Social, messaging |
| Versao simplificada | SVG | 16, 32px | Favicon, micro-icons |
| Versao monocromatica | SVG | Variavel | Contextos limitados |
| Character em cena | PNG | 1080, 1920px | Hero, banners |
| Lottie/After Effects | JSON/AEP | Variavel | Animacoes |

### Step 8: Handoff

```yaml
handoff:
  to: brand-compiler (Atlas)
  artifact: brand-characters/
  context: "Character system completo: profile, model sheet, expressoes, poses, guidelines, assets exportados"
  also_to:
    - brand-motion-vfx (Flux): "Animar character — expressoes, transicoes, micro-interacoes"
    - brand-identity-designer (Iris): "Validar consistencia com illustration system"
    - brand-collateral-designer (Vellum): "Integrar character em templates de colateral"
    - brand-auditor (Sentinel): "Adicionar character consistency check no audit"
  next: "Atlas inclui Character System como capitulo no brandbook. Flux anima versoes prioritarias."
```
