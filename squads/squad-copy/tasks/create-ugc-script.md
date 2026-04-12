---
task: create-ugc-script
responsavel: "@ad-copywriter"
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

# Task: Create UGC Script

## Metadata
- **Squad:** squad-copy
- **Agent:** ad-copywriter (Spark)
- **Complexity:** STANDARD
- **Depends on:** audiencia, produto, plataforma, UGC creator brief
- **Feeds:** paid-media squad, growth-analytics squad

## Objetivo
Criar scripts de UGC (User Generated Content) que parecem organicos mas sao estrategicamente escritos para converter. UGC performa melhor que ads tradicionais porque parece REAL — o script deve manter essa autenticidade enquanto guia o viewer para a acao desejada.

## Entrada
- Produto/servico e key benefits
- Plataforma-alvo (TikTok, Instagram Reels, YouTube Shorts)
- Perfil do UGC creator (persona, tom, estilo)
- Objetivo (awareness, consideration, conversao)
- Objecoes principais a enderecar
- CTA desejado

## Passos

### 1. Definir Formato de UGC
| Formato | Duracao | Plataforma | Best For |
|---------|---------|------------|----------|
| Talking Head | 15-60s | TikTok, Reels | Depoimento, review |
| Get Ready With Me | 30-90s | TikTok, Reels | Beauty, lifestyle |
| Day in My Life | 30-90s | TikTok, Reels | Integracao natural |
| Unboxing/First Impressions | 30-60s | TikTok, YouTube | Produto fisico |
| Problem → Solution | 15-45s | Todas | Conversao direta |
| Story Time | 30-90s | TikTok, Reels | Conexao emocional |
| Tutorial/How-To | 30-120s | Todas | Educacional |

### 2. Escrever Hook (Primeiros 1-3 Segundos)
**O hook determina retencao. Deve parecer ORGANICO, nao ad.**

**Formulas de hook UGC:**
- "POV: voce descobriu [produto] e [resultado]"
- "Ok entao eu PRECISO falar sobre [produto]..."
- "Eu nao ia postar isso mas [razao emocional]..."
- "Alguem mais tem esse problema? Porque eu encontrei..."
- "Nao acredito que demorei tanto pra descobrir isso"
- "[Numero] dias usando [produto] e..."
- "Story time: como [produto] [resultado inesperado]"

**Regra:** Hook NUNCA deve soar como ad. Deve soar como alguem compartilhando algo com amigos.

### 3. Escrever Body por Persona
**3 personas de UGC creator:**

**Persona A — Entusiasta Genuino:**
```
[Hook: "Gente, eu PRECISO falar sobre isso..."]
[Contexto: "Entao, eu tava com [problema] ha [tempo]..."]
[Descoberta: "Ai uma amiga me indicou [produto]..."]
[Experiencia: "Nos primeiros [prazo], ja notei [resultado especifico]"]
[Resultado: "Agora [situacao transformada] e eu nao consigo parar de recomendar"]
[CTA: "Serio, link na bio. Voces precisam testar."]
```

**Persona B — Cetico Convertido:**
```
[Hook: "Ok eu sou a pessoa mais cetica do mundo com [categoria]..."]
[Contexto: "Ja gastei [valor/tempo] com [alternativas] e NADA funcionava"]
[Virada: "Mas depois que vi [N] pessoas falando de [produto], resolvi testar"]
[Experiencia: "E olha... eu odeio admitir... mas [resultado especifico]"]
[Prova: "Olha isso aqui [mostra resultado]"]
[CTA: "Enfim, link na bio pra quem quiser testar. Mas nao fala que eu indiquei."]
```

**Persona C — Expert/Autoridade:**
```
[Hook: "Como [profissao], eu normalmente NAO recomendo [categoria]..."]
[Contexto: "Porque a maioria e [problema com alternativas]"]
[Diferencial: "Mas [produto] faz diferente porque [mecanismo]"]
[Validacao: "Eu testei com [N] [clientes/pacientes] e [resultado]"]
[Recomendacao: "[Produto] e o unico que eu uso pessoalmente"]
[CTA: "Link na bio. Me conta depois o que acharam."]
```

### 4. Adicionar Notas de Producao
**Diretrizes para o creator:**
- Filmar em ambiente natural (nao estudio)
- Iluminacao natural preferida
- Olhar para camera (talking head) ou filmar acao
- Sem musica de fundo nos primeiros 3 segundos
- Legendas obrigatorias (85% assistem sem som)
- Nao usar filtros pesados (reduz autenticidade)

**Marcacoes no script:**
- [MOSTRAR PRODUTO] — close-up do produto
- [MOSTRAR RESULTADO] — before/after ou resultado visivel
- [EMOCAO: surpresa/empolgacao/ceticismo] — direcao de atuacao
- [CORTE RAPIDO] — transicao de edicao
- [TELA COM TEXTO] — overlay de texto na tela

### 5. Criar 3 Versoes por Script
**Para cada conceito, 3 variacoes:**
| Versao | Duracao | Tom | Hook |
|--------|---------|-----|------|
| A | 15-30s | Entusiasta | Hook direto |
| B | 30-60s | Cetico convertido | Hook de story |
| C | 45-90s | Expert | Hook de autoridade |

**Cada versao com:**
- Hook alternativo
- Body adaptado a duracao
- CTA adaptado a plataforma

## Cross-Squad Handoff
```yaml
handoffs:
  - to: paid-media squad
    delivers: UGC scripts para briefing de creators
    format: Scripts formatados com notas de producao
  - to: growth-analytics squad
    delivers: Scripts para conteudo organico
    format: Versoes adaptadas para posting organico
```

## Saida
- Scripts de UGC (3 personas x 3 versoes = 9 scripts)
- Hooks alternativos (5+ por conceito)
- Notas de producao por script
- Brief para UGC creator (guidelines + script)
- Adaptacoes por plataforma (TikTok, Reels, Shorts)

## Validacao
- [ ] Hook para nos primeiros 1-3 segundos
- [ ] Scripts parecem ORGANICOS (nao ads)
- [ ] 3 personas diferentes (entusiasta, cetico, expert)
- [ ] 3 versoes por persona (curta, media, longa)
- [ ] Notas de producao claras para creator
- [ ] CTA natural e nao forcado
- [ ] Resultado especifico mencionado (nao generico)
- [ ] Adaptacoes por plataforma incluidas
- [ ] Legendas consideradas no script
- [ ] Compliance com politicas da plataforma

---

*Task operada por: ad-copywriter (Spark)*
